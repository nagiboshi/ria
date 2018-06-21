const express = require('express');
const router = express.Router();

const authService = require('../services/auth-service');

const riskGroupCtrl = require('../controllers/riskGroup-controller');

router.get('/riskGroups', authService.asAdmin.bind(authService), riskGroupCtrl.getAll.bind(riskGroupCtrl));

module.exports = router;