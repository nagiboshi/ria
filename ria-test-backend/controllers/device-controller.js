const BaseController = require('../controllers/base-controller');
const errorService = require('../services/error-service');
const User = require('../models/user');
const Device = require('../models/device');
class DeviceController extends BaseController {
  constructor() {
    super();
  }



  async register(req, res, next) {
    try {
      req.checkBody('token', 'email', 'platform').notEmpty();

      let device = await Device.findOld(req.body.email, req.body.token); 
      if( !device ) {
        console.log(`device with email ${req.body.email} and token ${req.body.token} doesn\'t exist. We register new`);
        device = await new Device({user:user, token: req.body.token, platform: req.body.platform }).save();
      }
      req.dataOut = device;
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

}

module.exports = new DeviceController();