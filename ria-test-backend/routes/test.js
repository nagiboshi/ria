const express = require('express');
const router = express.Router();
const authService = require('../services/auth-service');
const testCtrl = require('../controllers/test-controller');
const testService = require('../services/test-service');

router.get('/tests', authService.asUser.bind(authService), testCtrl.getTests.bind(testCtrl));
router.get('/tests/result', authService.asUser.bind(authService), testCtrl.getResultTestsUser.bind(testCtrl));
router.get('/tests/result-by-id', authService.asUser.bind(authService), testCtrl.getResultTestByIdTest.bind(testCtrl));
router.post('/tests/new-result', authService.asUser.bind(authService), testCtrl.setResultTest.bind(testCtrl),testService.prepareDataForReportTest.bind(testService),testCtrl.generateReportTestAndSendMail.bind(testCtrl), testCtrl.getTests.bind(testCtrl));
router.get('/tests/report', authService.asUser.bind(authService), testCtrl.getTestReports.bind(testCtrl), testService.prepareDataForReportTest.bind(testService), testCtrl.generateReportTest.bind(testCtrl));

module.exports = router;