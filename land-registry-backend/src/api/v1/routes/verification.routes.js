// src/api/v1/routes/verification.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/verification.controller');

router.post('/verify', controller.verifyLand);

module.exports = router;