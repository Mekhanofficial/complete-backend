const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item', // or Product/Food etc
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    orderedItems: [orderItemSchema],

    deliveryStatus: {
      type: String,
      enum: [
        'pending',
        'preparing',
        'ready for pickup',
        'in transit',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    payment: {
      type: String,
      enum: ['card', 'transfer'],
      default: 'card',
    },
    deliveryAddress: {
      type: String,
      minlength: 10,
    },
    deliveryPhone: {
      type: String,
      minlength: 11,
      maxlength: 15,
    },
    estimatedDeliveryAt: {
      type: Date,
      default: () => new Date(Date.now() + 45 * 60 * 1000),
    },
    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

    paymentReference: String,
    paystackAccessCode: String,

    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
