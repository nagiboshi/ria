const BaseController = require('../controllers/base-controller');
const errorService = require('./error-service');

const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Session = require('../models/session');

class AuthService extends BaseController {
  constructor() {
    super();
  }
  
  async asUser(req, res, next) {
    try {
      req.checkHeaders('Authorization').notEmpty();
      
      await this.getValidationResult(req);

      req.session = await this._getSessionByToken(req.headers.authorization);
      
      let user =  await User.findById(req.session.owner);

      if (!user) {
        throw errorService.user.notFound;
      }

      req.user = user;
      
      next();
    } catch(error) {
      next(error);
    }
  }

  async asAdmin(req, res, next) {
    try {
      req.checkHeaders('Authorization').notEmpty();

      await this.getValidationResult(req);

      req.session = await this._getSessionByToken(req.headers.authorization);
      let user = await User.findById(req.session.owner);
      
      if (user.role !== 'admin') {
        throw errorService.auth.accessDeny;
      }

      req.user = user;
      next();
    } catch(error) {
      next(errorService.auth.default.ex(error));
    }
  }

  async _getSessionByToken(token) {
    let { sessionID } = await jwt.verify(token, 'TOP_SECRET');
    let session = await Session.findById(sessionID);

    if (!session) {
      throw errorService.auth.notFound;
    }

    if (session.expDate < Date.now()) {
      session.remove();
      throw errorService.auth.invalidSession;
    }

    return session;
  }

}

module.exports = new AuthService();