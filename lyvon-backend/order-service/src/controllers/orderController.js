const Order = require('../models/orderModel');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const sqs = new SQSClient({ region: process.env.AWS_REGION });

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = req.user.userId;

    // Calculate total (you could fetch latest prices from catalog-service)
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentStatus: 'paid' // Assuming payment succeeded
    });
    await order.save();

    // Queue async tasks
    await sqs.send(new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify({ orderId: order._id, action: 'confirm' })
    }));

    res.status(201).json({ orderId: order._id, totalAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};