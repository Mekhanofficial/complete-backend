const express = require('express');
const { createitem, findOneItem } = require('./item.controller');
const validateUser = require('../../../middleware/validate_user');
const { uploadSingleImg } = require('../../../multer/multer');

const itemrouter = express.Router();

itemrouter.route('/create-item').post(validateUser,uploadSingleImg,createitem);
itemrouter.route('/findone-item/:id').get(findOneItem);

module.exports = itemrouter;
