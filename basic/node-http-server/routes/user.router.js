const express = require('express');
const { registeredUser, findOneUser, login } = require('../controllers/user.controller');
const validateUser = require('../middleware/validate_user');

const userRouter = express.Router();

// Registration should be public; do not require a token
userRouter.route('/register-user').post(registeredUser);
userRouter.route('/login').post(login);
userRouter.route('/findone-user').get(validateUser,findOneUser);

module.exports = userRouter; 
