const errorService = require('../services/error-service');
const BaseController = require('../controllers/base-controller');
const Article = require('../models/article');
class ArticleController extends BaseController {
  constructor() {
    super();     
  }

  getBase64ImageFromBuffer(image) {
  return `data:${image.contentType};base64,${image.data.toString('base64')}`
  }

  getArticleFromModel(articleModel) {
  return  { _id: articleModel._id,
            title:articleModel.title,
            body: articleModel.body,
            image: this.getBase64ImageFromBuffer(articleModel.image),
            riskGroups: articleModel.riskGroups
          };
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
  async addArticle(req, res, next) {
    try {
      req.checkBody('_id').notEmpty();
      req.checkBody('title').notEmpty();
      req.checkBody('body').notEmpty();
      req.checkBody('image').notEmpty();
      req.checkBody('riskGroups').notEmpty();
      let reqArticle = req.body.article;
      let b64ImageWithFormat = reqArticle.image.split("base64,");
      if(b64ImageWithFormat && b64ImageWithFormat.length == 2) {
        // image format is data:[FORMAT];   
        // so we substring from 5 to the end - 1 
        const startIndex = 5;
        const lastIndex = b64ImageWithFormat[0].length - 1;
        let imageFormat = b64ImageWithFormat[0].substring(startIndex,lastIndex);
        let b64Image = b64ImageWithFormat[1];
        let imageBlob = {data:Buffer.from(b64Image, "base64"), contentType:imageFormat};

        let image = imageBlob;
        let title = reqArticle.title;
        let body = reqArticle.body;
        let riskGroups = reqArticle.riskGroups;
        let articleModel = await new Article({image, title, body, riskGroups}).save();
        req.dataOut = this.getArticleFromModel(articleModel);
        next();
      }
    } catch(error) {
      next(errorService.company.default.ex(error));
    }
  }

  async updateArticle(req, res, next) {
    try {
      req.checkBody('_id').notEmpty();

      await this.getValidationResult(req);

      let article = await Article.findById(req.body._id);

      if (!article) {
        throw errorService.article.notFound;
      }

      req.dataOut = await article.update(req.body);
      
      req.dataOut = await req.dataOut.clear();
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
      
      req.dataOut = await Article.find();
      next();
    } catch(error) {
      next(errorService.article.default.ex(error));
    }
  }

}

module.exports = new ArticleController();