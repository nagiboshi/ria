const errorService = require('../services/error-service');
const BaseController = require('../controllers/base-controller');

const Article = require('../models/article');
class ArticleController extends BaseController {
  constructor() {
    super();
    // let riskGroup = new RiskGroup;
    // RiskGroup.find((err, res) => {
    //   if( err ) { 
    //     console.log('crap!');
    //   } 

    //   let article = new Article;
    //   article.image.data = fs.readFileSync('D:/batman.png');
    //   article.image.contentType = 'image/png';
    //   article.title = 'Article Title 2';
    
    //   article.body = 'Article body 2';
    //   article.riskGroups = res.map(res=> res._id); 
     
    //   article.save(function(){
    //     console.log("saved!");
    //   });
    //  res.map((group)=> { group.clear() });
      // console.log(res);
    // })
    // let article = new Article;
    //   article.image.data = fs.readFileSync('D:/batman.png');
    //   article.image.contentType = 'image/png';
    //   article.title = 'Article Title 2';
    
    //   article.body = 'Article body 2';
    //   article.save(function(){
    //     console.log("saved!");
    //   });
      
  }

  async getAll(req, res, next) {
    try {
      let articles = await Article
        .find()
        .populate('riskGroups')
        .exec();
      let articlesWithBase64Img = articles.map((article) => {
                                    return {title:article.title,
                                            body: article.body,
                                            image: `data:${article.image.contentType};base64,${article.image.data.toString('base64')}`,
                                            riskGroups: article.riskGroups
                                           } }
                                          );
      console.log(articlesWithBase64Img);
      req.dataOut = articlesWithBase64Img;
      next();
      res.body = articlesWithBase64Img;
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
      req.checkQuery('_id').notEmpty();
      
      let article = await Article.findById(req.query._id);
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