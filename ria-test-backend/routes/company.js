const express = require('express');
const router = express.Router(); 

const authService = require('../services/auth-service');
const companyCtrl = require('../controllers/company-controller');

router.get('/companies', authService.asAdmin.bind(authService), companyCtrl.getAll.bind(companyCtrl));

router.post('/company/add', authService.asAdmin.bind(authService), companyCtrl.addCompany.bind(companyCtrl));

router.post('/company/update', authService.asAdmin.bind(authService), companyCtrl.update.bind(companyCtrl));

router.get('/company/remove', authService.asAdmin.bind(authService), companyCtrl.remove.bind(companyCtrl));

module.exports = router;