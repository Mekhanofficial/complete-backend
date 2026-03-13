const QRCode = require('qrcode');
const Order = require('../../../models/order.schema');

const STATUS_PROGRESS_MAP = {
  pending: 10,
  preparing: 35,
  'ready for pickup': 60,
  'in transit': 80,
  delivered: 100,
  cancelled: 0,
};

const buildTrackingPayload = (orderDoc) => {
  const status = orderDoc.deliveryStatus || 'pending';
  const fallbackEta = new Date(orderDoc.createdAt.getTime() + 45 * 60 * 1000);
  const estimatedDeliveryAt = orderDoc.estimatedDeliveryAt || fallbackEta;

  return {
    id: orderDoc.orderId,
    status,
    progress: STATUS_PROGRESS_MAP[status] ?? 10,
    estimatedDelivery: estimatedDeliveryAt.toLocaleString(),
    items: (orderDoc.orderedItems || [])
      .map((entry) => {
        if (entry.itemId?.item_name) {
          return `${entry.itemId.item_name} x${entry.quantity}`;
        }
        return `Item x${entry.quantity}`;
      })
      .filter(Boolean),
  };
};

const generateQrCode = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'orderId is required',
      });
    }

    const order = await Order.findOne({ orderId: String(orderId).trim() }).select(
      'orderId'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const trackingUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/tracking/track/${encodeURIComponent(order.orderId)}`;

    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl);

    return res.status(200).json({
      success: true,
      orderId: order.orderId,
      trackingUrl,
      qrCode: qrCodeDataUrl,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
    });
  }
};

const serveTrackingPage = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ orderId: id }).populate({
      path: 'orderedItems.itemId',
      select: 'item_name',
    });

    if (!order) {
      return res
        .status(404)
        .send(
          '<h4>Order not found</h4><p>Please check your tracking ID and try again.</p>'
        );
    }

    const trackingOrder = buildTrackingPayload(order);

    return res.render('tracking/track', { order: trackingOrder });
  } catch (error) {
    console.error('Error serving tracking page:', error);
    return res.status(500).send('<h4>Unable to load tracking page right now.</h4>');
  }
};

module.exports = { generateQrCode, serveTrackingPage };
