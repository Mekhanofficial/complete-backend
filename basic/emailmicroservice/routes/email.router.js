const express = require('express');
const { sendOTP } = require('../controller/email.controller');

const emailRouter = express.Router();

emailRouter.post('/send-otp', sendOTP);

module.exports = emailRouter;
