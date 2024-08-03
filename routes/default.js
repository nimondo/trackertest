const express = require('express');

const router = express.Router();
const defaultCtrl = require('../controllers/default');

router.get('/', defaultCtrl.default);
module.exports = router;