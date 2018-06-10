const BaseController = require('./base-controller');
const errorService = require('../services/error-service');

const Company = require('../models/company');

class CompanyController extends BaseController {
  constructor() {
    super();
  }

  async getAll(req, res, next) {
    try {
      const skip = +req.query.skip || 0;
      const limit = +req.query.limit || 100;

      req.dataOut = await Company
        .find()
        .skip(skip)
        .limit(limit)
        .exec();

      next();
    } catch(error) {
      next(errorService.company.default.ex(error))
    }
  }
  
  async addCompany(req, res, next) {
    try {
      req.checkBody('name').notEmpty();

      await this.getValidationResult(req);

      let name = req.body.name;
      let company = await Company.findOne({name});
      
      if (company) {
        throw errorService.company.alreadyExists;
      }

      let code = name;

      if (/\s/g.test(name)) {
        code = name
          .split(/\s/)
          .reduce((result, item) => {
            const firstChar = item
              .charAt(0)
              .toUpperCase();

            return result + firstChar + item.substr(1);
          }, '');
      }

      code += Math.round(Date.now() / 1000) % 1000000;
      
      req.dataOut =  await new Company({name, code}).save();
      
      next();
    } catch(error) {
      next(errorService.company.default.ex(error));
    }
  }
  
  async update(req, res, next) {
    try {
      req.checkBody('_id').notEmpty();

      await this.getValidationResult(req);

      let companyId = req.body._id;
      let companyById = await Company.findById(companyId);

      if (!companyById) {
        throw errorService.company.notFound;
      }

      let updatedCompany = {};

      if (req.body.name) {
        let name = req.body.name;

        let companyByName = await Company.findOne({name});

        if (companyByName && companyByName.id !== companyId) {
          throw errorService.company.nameIsBusy;
        }

        updatedCompany.name = name;
      }

      if (req.body.code) {
        let code = req.body.code;

        if (/\s/.test(req.body.code)) {
          code = code
            .match(/\w+/g)
            .reduce((result, item) => {
              return result += item.charAt(0).toUpperCase() + item.substr(1);
            }, '');
        }

        let companyByCode = await Company.findOne({code});

        if (companyByCode && companyByCode.id !== companyId) {
          throw errorService.company.codeIsBusy;
        }

        updatedCompany.code = code;
      }

      req.dataOut = await Company
        .findOneAndUpdate(
          { _id: companyId },
          updatedCompany,
          { new: true }
        );

      next();
    } catch(error) {
      next(errorService.company.default.ex(error));
    }
  }

  async remove(req, res, next) {
    try {
      req.checkQuery('_id').notEmpty();

      await this.getValidationResult(req);

      let company = await Company.findById(req.query._id);

      if (!company) {
        throw errorService.company.notFound;
      }

      req.dataOut = await company.remove();

      next();
    } catch(error) {
      next(errorService.company.default.ex(error));
    }
  }
}

module.exports = new CompanyController();