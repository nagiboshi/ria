const express = require('express');
const router = express.Router();

const deviceCtrl = require('../controllers/device-controller');

router.post('/device/register', deviceCtrl.register.bind(deviceCtrl));


module.exports = router;