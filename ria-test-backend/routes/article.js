const express = require('express');
const router = express.Router();


const articleCtrl = require('../controllers/article-controller');

router.get('/articles',  articleCtrl.getAll.bind(articleCtrl));

module.exports = router;