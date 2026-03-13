const express = require('express');
const { registerRestaurant } = require('../controllers/restaurant.controller');
const validateUser = require('../middleware/validate_user');

const restaurantRouter = express.Router();

restaurantRouter.route('/create-restaurant').post(validateUser, registerRestaurant);

module.exports = restaurantRouter;

