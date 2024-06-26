const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const errorService = require('../services/error-service');
const BaseController = require('../controllers/base-controller');
const mailService = require('../services/mail-service');

const User = require('../models/user');
const Session = require('../models/session');
const Company = require('../models/company');

const config = require('jconf');

class UserController extends BaseController {
  constructor() {
    super();
  }
  
  async getAll(req, res, next) {
    try {
      let users = await User
        .find()
        .populate('company')
        .exec();

      req.dataOut = users.map(user => user.clear());
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async getUser(req, res, next) {
    try {
      req.user = await req.user.clear();
      
      req.user.company = await Company.findById(req.user.company);

      req.dataOut = req.user;
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async signUp(req, res, next) {
    try {
      req.checkBody('company').notEmpty();
      req.checkBody('email').notEmpty();
      req.checkBody('password').notEmpty();
      
      await this.getValidationResult(req);

      let company = await Company.findOne({ code: req.body.company });
      if (!company) {
        throw errorService.company.notFound;
      }

      if (!/^([\w\.]*@\w+(:?\.\w+)?\.\w+)$/.test(req.body.email)) {
        throw errorService.user.invalidEmail;
      }

      let user = await User.findOne({ email: req.body.email });
      if (user) {
        throw errorService.user.exist;
      }

      req.dataOut = await new User({
        company: company._id,
        email: req.body.email,
        password: jwt.sign(req.body.password, config.baseKey)
      }).save();
       
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async signIn(req, res, next) {
    try {
      req.checkBody('email').notEmpty();
      req.checkBody('password').notEmpty();
      
      await this.getValidationResult(req);

      if (!/^([\w\.]*@\w+(:?\.\w+)?\.\w+)$/.test(req.body.email)) {
        throw errorService.user.invalidEmail;
      }

      let user  = await User.findOne({email: req.body.email});

      if (!user) {
        throw errorService.user.notFound;
      }

      if (jwt.verify(user.password, config.baseKey) !== req.body.password) {
        throw errorService.user.wrongPassword;
      }
      
      let session = await new Session({ owner: user.id, expDate: Date.now() + 2502000 * 1000 }).save();
      
      req.dataOut = { token: jwt.sign({ sessionID: session.id }, config.baseKey), user: user.clear() };
      
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async signOut(req, res, next) {
    try {
      req.checkHeaders('Authorization').notEmpty();

      await this.getValidationResult(req);
      
      let session = await jwt.verify(req.headers.authorization, 'TOP_SECRET');
      
      req.dataOut = await Session.remove({ _id: session.sessionID });
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async updateUser(req, res, next) {
    try {
      req.checkBody('_id').notEmpty();

      await this.getValidationResult(req);

      let user = await User.findById(req.body._id);

      if (!user) {
        throw errorService.user.notFound;
      }

      req.dataOut = await user.update(req.body);
      
      req.dataOut = await req.dataOut.clear();
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async resetPasswordMail(req, res, next) { 
    try {
      req.checkQuery('email').notEmpty();

      await this.getValidationResult(req);

      if (!/^([\w\.]*@\w+(:?\.\w+)?\.\w+)$/.test(req.query.email)) {
        throw errorService.user.invalidEmail;
      }

      let user = await User.findOne({email: req.query.email});

      if (!user) {
        throw errorService.user.notFound;
      }
      
      let hash = jwt.sign(user.email, config.baseKey);
      
      mailService.sendMessage(
        user.email,
        'Password reset.',
        `Сбросить пароль: https://ria-test-backend.herokuapp.com/user/password/reset?param=${hash}`
      );

      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async resetPassword(req, res, next) {
    try {
      req.checkQuery('param').notEmpty();
      
      await this.getValidationResult(req);

      let email = await jwt.verify(req.query.param, config.baseKey);
      
      let user = await User.findUserByEmail(email);

      if (!user) {
        throw errorService.user.notFound;
      }

      let password = crypto.randomBytes(4).toString('hex');
      
      user.password = await jwt.sign(password, config.baseKey);
      
      await user.update(user);
      
      await mailService.sendMessage(user.email, 'Password recovery.', `Your new password: ${password}`);
      
      req.dataOut = 'Your password has been reset. Check your email!';
      
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }
  
  async removeUser(req, res, next) {
    try {
      req.checkQuery('_id').notEmpty();
      
      let user = await User.findById(req.query._id);
      if (!user) {
        throw errorService.user.notFound;
      }

      await user.remove();
      
      req.dataOut = await User.find();
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

}

module.exports = new UserController();