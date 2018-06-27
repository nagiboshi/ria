const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => res.send('I am alive!'));

router.use(require('./user'));

router.use(require('./company'));

router.use(require('./request'));

router.use(require('./article'));

router.use(require('./riskgroups'));

router.use(require('./db'));

router.use(require('./test'));

router.use((req, res, next) => res.send({ success: true, data: req.dataOut }));
router.use((error, req, res, next) => res.send({ success: false, error }));

module.exports = router;