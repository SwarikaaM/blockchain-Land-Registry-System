// src/api/v1/routes/spatial.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/spatial.controller');
const { optionalAuth } = require('../../../middleware/auth.middleware');

// Optional auth — public endpoint, but attaches user if token present
router.get('/plot-boundary', optionalAuth, controller.getPlotBoundary);

module.exports = router;
// const express = require('express');
