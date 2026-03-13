const Order = require('../models/order.schema');
const { v4: uuidv4 } = require('uuid');
const paystack = require('paystack')(process.env.PSSECRET);

const createOrder = async (req, res) => {
  try {
    const { orderedItems, totalPrice, payment } = req.body;
    const owner = req.userData.userId;

    if (!orderedItems || orderedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    const newOrder = await Order.create({
      orderId: `ORD-${uuidv4().slice(0, 8)}`,
      owner,
      orderedItems,
      totalPrice,
      payment,
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
      trackingUrl: `${req.protocol}://${req.get('host')}/api/v1/tracking/track/${newOrder.orderId}`,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const initializePayment = async (req, res) => {
  try {
    const owner = req.userData?.userId;
    const email = req.userData?.email || req.userData?.mail;
    const { deliveryAddress, deliveryPhone } = req.body;

    if (!owner || !email || !deliveryAddress || !deliveryPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    if (String(deliveryPhone).length < 11) {
      return res.status(400).json({
        success: false,
        message: 'Delivery phone must be at least 11 digits',
      });
    }

    const order = await Order.findOne({ owner, isPaid: false }).sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found for this user',
      });
    }

    if (!order.orderedItems || order.orderedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

   order.deliveryAddress = deliveryAddress;
   order.deliveryPhone = deliveryPhone;
   
   const reference = `foodorder_${order.owner}_${Date.now()}`;

   // construct the payment payload
   const paymentData = {
     email,
     amount: Math.round(order.totalPrice * 100), // convert to kobo
     currency: 'NGN',
     reference,
     metadata: {
      owner: order.owner.toString(),
      orderId: order._id.toString(),
   }  };

   const paystackResponse = await paystack.transaction.initialize(paymentData);
   if(paystackResponse.status) {
    // update the order with the payment reference
    order.paymentReference = reference;
    order.paystackAccessCode = paystackResponse.data.access_code;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
         authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        reference,
        amount: order.totalPrice
      },
    });
   } else {
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: paystackResponse.message
    });
   }

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createOrder, initializePayment };
