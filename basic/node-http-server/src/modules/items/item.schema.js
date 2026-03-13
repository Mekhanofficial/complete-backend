const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    item_name: {
        type: String,
        required: true,
        trim: true,
        minlength:[3,'item name must be at least 3 characters long']
    }, 
    description: {
        type: String,
        trim: true,
        minlength:[10,'description must be at least 10 characters long']
    },
    price: {
        type: Number,
        required: true,
        min:[100,'price must be a positive number']
    },
    unit: {
        type: String,
        required: true,
        trim: true,
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true,
    },
}, {timestamps: true});

module.exports = mongoose.model('Item', itemSchema);        
