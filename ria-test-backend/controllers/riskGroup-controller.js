const errorService = require('../services/error-service');
const BaseController = require('../controllers/base-controller');

const RiskGroup = require('../models/riskGroup');

class RiskGroupController extends BaseController {
  constructor() {
    super();
  }
  
  async getAll(req, res, next) {
    try {
      let groups = await RiskGroup
        .find()
        .exec();
      req.dataOut = groups.map(group => group.clear());
      next();
    } catch(error) {
      next(errorService.riskGroup.default.ex(error));
    }
  }

 
}

module.exports = new RiskGroupController();