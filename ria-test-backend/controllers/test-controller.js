const BaseController = require('../controllers/base-controller');
const errorService = require('../services/error-service');

const bunkerTest = require('../tests/test-bunker.json');
const TestResult = require('../models/test-result');

const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');
const mailService = require('../services/mail-service');

class TestController extends BaseController {
  constructor() {
    super();
  }

  async getTests(req, res, next) {
    let testsBunker = bunkerTest;
    let listIdTest = testsBunker.map(item => {
      return item.testId;
    });
    let listResult = await TestResult.find({
      userId: req.user._id,
      testId: { $in: listIdTest }
    }).sort({ created: 1 });
    listResult.forEach(resultObj => {
      testsBunker.forEach(test => {
        if(resultObj.testId === test.testId) {
          test.result = resultObj.result.split(',');
        }
      })
    });
    req.dataOut = JSON.stringify(testsBunker);
    next();
  }

  async setResultTest(req, res, next) {
    try {
      req.checkBody('testId').notEmpty();
      req.checkBody('result').notEmpty();

      if(!req.user) {
        throw errorService.user.notFound;
      }

      await TestResult.find({
        userId: req.user._id,
        testId: req.body.testId
      }).remove();

      req.resultTest = await new TestResult({
        userId: req.user._id,
        testId: req.body.testId,
        result: req.body.result
      }).save();
   
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async getResultTestsUser(req, res, next) {
    try {

      if(!req.user) {
        throw errorService.user.notFound;
      }

      let listResult = await TestResult.find({userId: req.user._id});

      req.dataOut = {
        listResult: listResult
      };
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async getResultTestByIdTest(req, res, next) {
    try {
      req.checkQuery('testId').notEmpty();

      if(!req.user) {
        throw errorService.user.notFound;
      }

      let listResult = await TestResult.find({userId: req.user._id, testId: req.query.testId});

      req.dataOut = {
        listResult: listResult
      };
      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  async getTestReports(req, res, next) {
    try {
      req.checkQuery('testId').notEmpty();

      req.resultTest = await TestResult.findOne({
        userId: req.user._id,
        testId: req.query.testId
      });

      if(!req.resultTest) {
        throw errorService.test.notResult;
      }

      next();
    } catch(error) {
      next(errorService.user.default.ex(error));
    }
  }

  generatePDFReport(name, data){ 
    let promise = new Promise((resolve, reject) => {
      try {
        ejs.renderFile('./views/test-view.ejs', data, (err, result) => {
          // render on success
          if( err ){ 
            reject(err);
          }
          if (result) {
            let htmlData = result;
            let options = {
              filename: name,
              format: 'A4',
              orientation: 'portrait',
              base: './files/',
              type: "pdf",
              phantomPath: "./node_modules/phantomjs-prebuilt/bin/phantomjs",
              
              footer: {
                height: "10mm"
              }
            };
    
            pdf.create(htmlData, options).toBuffer((err, buffer) => {
              if (err){ 
                reject(err);
              } else { 
                resolve(buffer);
              }
            });
          }
        
        });
      } catch(error) {
        reject(errorService.user.default.ex(error));
      }
    });
    return promise;
  }

  async generateReportTestAndSendMail(req, res, next){ 
    let nameNewFile = 'report-' + req.resultTest.testId + '.pdf';
     this.generatePDFReport(nameNewFile, req.reportTest).then((result) => {
        let attachments = [{content: result, contentType: 'application/pdf' , filename: nameNewFile}];
        mailService.sendMessageWithAttachments(req.user.email, 'RIA Результат тестирования', '','', attachments);
        
        next();
      }).catch((error)=>{
       next(error);
      });      
  }

  async generateReportTest(req, res, next) {
    let nameNewFile = 'report-' + req.resultTest.testId + '-' + req.resultTest.userId + '.pdf';
      this.generatePDFReport(nameNewFile, req.reportTest).then((result) => {
        res.send({
          success: true,
          data:  result
        });
      }).catch((error)=>{
        next(error);
      });   
  }
}

module.exports = new TestController();