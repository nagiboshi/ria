const errorService = require('../services/error-service');
const pushService = require('../services/push-service');
const BaseController = require('../controllers/base-controller');
const Article = require('../models/article');
const config = require('jconf');
const fs = require('fs');
const schedule = require('node-schedule');

class ArticleController extends BaseController {
  constructor() {
    super();    
    
    var rule = new schedule.RecurrenceRule();
    // Run notification every wednesday and saturday
     // rule.dayOfWeek = [3,6];
      rule.second = 1;
      // rule.minute = 1;
        debugger;
      let job = schedule.scheduleJob(rule, ()=>{
          console.log("Scheduling job run ...");
          pushService.send('true');
      });
  }

  getBase64ImageFromBuffer(image) {
  return `data:${image.contentType};base64,${image.data.toString('base64')}`
  }

  
  getArticleFromModel(articleModel) {
  return  { _id: articleModel._id,
            title:articleModel.title,
            body: articleModel.body,
            image: articleModel.image,
            riskGroups: articleModel.riskGroups
          };
  }

  async getByGroupRisks(req,res, next) {
    try {
      // if( req )
      debugger;
      req.checkParams('riskGroups');
      let articles = await Article
      .find({ "token": token }).populate({"riskGroups": {"id":{"$in": req.riskGroups}}}).exec();
        req.dataOut = articles;
        res.body = articles;
        next();
    } catch(e) {
      next(errorService.article.default.ex(e));
    }

  }

  async getAll(req, res, next) {
    try {
      let articles = await Article
        .find()
        .populate('riskGroups')
        .exec();
      let articlesWithBase64Img = articles.map((articleModel) => this.getArticleFromModel(articleModel));
      req.dataOut = articlesWithBase64Img;
      res.body = articlesWithBase64Img;
      next();
    } catch(error) {
      next(errorService.article.default.ex(error));
    }
  }

  async getArticle(req, res, next) {
    try {
      req.article = await req.article.clear();
      req.dataOut = req.article;
      next();
    } catch(error) {
      next(errorService.article.default.ex(error));
    }
  }

  getArticleImgPath(article){ 
    let filePath = this.fixFilePath(config.articleImgs);
    let projectPath = process.cwd();
    let generatedFilePath = projectPath + filePath + article.image;
    return generatedFilePath;
  }

  fixFilePath(path) {
    if ( !path.endsWith('/')) {
      path+=path + "/";
    }
    return path;
  }

  generateArticleImgPath(imageFormat) {
    let filePath = this.fixFilePath(config.articleImgs);
    let projectPath = process.cwd();
    let imageName = Date.now() + "." + imageFormat; 
    let generatedFilePath = projectPath + filePath + imageName;
    return generatedFilePath;
  }

  removeArticleImage(articleModel) {
    if( articleModel && articleModel.image ) {
      fs.unlink(this.getArticleImgPath(articleModel), (err) => {
        if( err ) { 
        errorService.article.default.ex(err);
       } 
      });
    }
  }

  saveArticleImage(req, next) {
    let reqArticle = req.body.article;
    let b64ImageWithFormat = reqArticle.image.split("base64,");
    if(b64ImageWithFormat && b64ImageWithFormat.length == 2) {
      // image format is data:image/[FORMAT];   
      // so we substring from 11 to the end - 1 
      const startIndex = 11;
      const lastIndex = b64ImageWithFormat[0].length - 1;
      let imageFormat = b64ImageWithFormat[0].substring(startIndex,lastIndex);
      let b64Image = b64ImageWithFormat[1];
      let articleFilePath = this.generateArticleImgPath(imageFormat);
      fs.writeFile(articleFilePath, b64Image, 'base64', (err) => {
        if( err )  {
          next(errorService.article.badRequest.ex(err));
        }
      });

      return articleFilePath;
    }
  }

  getArticleImageNameFromPath(path) {
    let pathChunks = path.split('/');
    return pathChunks[pathChunks.length - 1];
  }

  validateReq( req ) {
    req.checkBody('_id').notEmpty();
    req.checkBody('title').notEmpty();
    req.checkBody('body').notEmpty();
    req.checkBody('image').notEmpty();
    req.checkBody('riskGroups').notEmpty();
  }

  async addArticle(req, res, next) {
    try {
      this.validateReq(req);
      let articleImagePath = this.saveArticleImage(req, next);
      let image = this.getArticleImageNameFromPath(articleImagePath);
      let reqArticle = req.body.article;
      pushService.send('New artile added ' + reqArticle.title);
        let title = reqArticle.title;
        let body = reqArticle.body;
        let riskGroups = reqArticle.riskGroups;
        let articleModel = await new Article({image, title, body, riskGroups}).save();
        let articleModelWithRiskGroups = await Article.populate(articleModel, 'riskGroups');
        req.dataOut = this.getArticleFromModel(articleModelWithRiskGroups);
        next();
    } catch(error) {
      next(errorService.article.default.ex(error));
    }
  }
  

  async updateArticle(req, res, next) {
    try {
      this.validateReq(req);

      let newArticleReq = req.body.article;
      let oldArticle = await Article.findById(newArticleReq._id);
      if (!oldArticle) {
        throw errorService.article.notFound;
      }
      
      if( newArticleReq.image.startsWith("data:")){ 
        this.removeArticleImage(oldArticle);
        let imagePath = this.saveArticleImage(req, next);
        newArticleReq.image = this.getArticleImageNameFromPath(imagePath);
      }

      await oldArticle.update(newArticleReq);
      req.dataOut = await Article.findById(oldArticle._id).populate('riskGroups');
      
      next();
    } catch(error) {
      next(errorService.article.default.ex(error));
    }
  }

  async removeArticle(req, res, next) {
    try {
      req.checkBody('_id').notEmpty();
      let article = await Article.findById(req.body._id);
      if (!article) {
        throw errorService.article.notFound;
      }

      await article.remove();
      debugger;
      this.removeArticleImage(article);
      req.dataOut = await Article.find();
      next();
    } catch(error) {
      next(errorService.article.default.ex(error));
    }
  }

}

module.exports = new ArticleController();