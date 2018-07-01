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
      req.checkBody('device', 'email', 'platform').notEmpty();

      let user = await User.findUserByEmail(req.body.email);
      let device = await new Device({user:user, deviceId: req.body.device, platform: req.body.platform }).save();
      debugger;
      console.log(`device saved ${device}`);
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

}

module.exports = new DeviceController();