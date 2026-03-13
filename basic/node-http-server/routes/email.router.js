const express = require('express');
const { sendOTP } = require('../../emailmicroservice/controller/email.controller');

const emailRouter = express.Router();

emailRouter.route('/send-otp').post(sendOTP);

module.exports = emailRouter;