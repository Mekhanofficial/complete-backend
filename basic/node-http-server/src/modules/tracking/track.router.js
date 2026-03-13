const express = require('express');
const { generateQrCode, serveTrackingPage } = require('./tracking.controller');



const trackRouter = express.Router();

trackRouter.route('/track-order').post(generateQrCode);
trackRouter.route('/track/:id').get(serveTrackingPage);

module.exports = trackRouter;
