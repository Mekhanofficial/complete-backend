const express = require('express');
const validateUser = require('../middleware/validate_user');
const { initializePayment, createOrder } = require('../controllers/order.controller');


const orderRouter = express.Router();

orderRouter.route('/create-order').post(validateUser, createOrder);
orderRouter.route('/pay-order').post(validateUser, initializePayment );

module.exports = orderRouter;
