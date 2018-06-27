const express = require('express');
const router = express.Router();


const articleCtrl = require('../controllers/article-controller');

router.post('/article/add', articleCtrl.addArticle.bind(articleCtrl));
router.post('/article/update', articleCtrl.updateArticle.bind(articleCtrl));
router.get('/articles',  articleCtrl.getAll.bind(articleCtrl));
router.post('/article/remove', articleCtrl.removeArticle.bind(articleCtrl));
module.exports = router;