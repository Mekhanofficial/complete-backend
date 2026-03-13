const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;