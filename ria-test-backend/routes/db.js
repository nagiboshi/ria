const express = require('express');
const router = express.Router();


const dbCtrl = require('../controllers/db-controller');

router.get('/install',  dbCtrl.setup.bind(dbCtrl));
module.exports = router;