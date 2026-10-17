const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (!orderItems?.length) return res.status(400).json({ success: false, message: 'No order items' });

  let itemsPrice = 0;
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
    if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
    item.price = product.discountPrice || product.price;
    item.name = product.name;
    item.image = product.images[0]?.url || '';
    itemsPrice += item.price * item.quantity;
  }

  const shippingPrice = itemsPrice >= 2000 ? 0 : 99;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, soldCount: item.quantity },
    });
  }

  res.status(201).json({ success: true, order });
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt').populate('orderItems.product', 'name images');
  res.json({ success: true, orders });
};

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'name images');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  res.json({ success: true, order });
};

exports.updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  order.orderStatus = 'confirmed';
  await order.save();
  res.json({ success: true, order });
};

exports.getAllOrders = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = {};
  if (status) query.orderStatus = status;
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  res.json({ success: true, orders, total });
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.orderStatus = req.body.status;
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  if (req.body.status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  await order.save();
  res.json({ success: true, order });
};

exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount < 1) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === 'rzp_test_placeholder') {
    return res.status(500).json({
      success: false,
      message: 'Razorpay keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env',
    });
  }

  const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const razorpayOrder = await instance.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt: `tantvani_${Date.now()}`.slice(0, 40),
  });

  res.json({
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: keyId,
  });
};

exports.verifyAndCreateOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ success: false, message: 'Razorpay secret not configured on server' });
  }

  const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSign = crypto
    .createHmac('sha256', keySecret)
    .update(sign)
    .digest('hex');

  if (expectedSign !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: true,
    paidAt: Date.now(),
    orderStatus: 'confirmed',
    paymentResult: {
      id: razorpay_payment_id,
      status: 'completed',
      updateTime: new Date().toISOString(),
    },
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, soldCount: item.quantity },
    });
  }

  res.status(201).json({ success: true, order });
};

exports.getDashboardStats = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
  const totalRevenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = totalRevenueResult[0]?.total || 0;
  const recentOrders = await Order.find().sort('-createdAt').limit(5).populate('user', 'name email');
  res.json({ success: true, totalOrders, pendingOrders, totalRevenue, recentOrders });
};

exports.cancelOrder = async (req, res) => {
  const { reason } = req.body || {};
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Authorization check (user can only cancel their own order, or admin)
  const isOwner = order.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
  }

  // Check if order is already cancelled
  if (order.orderStatus === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Order is already cancelled' });
  }

  // Check if order is already shipped or delivered
  if (['shipped', 'delivered', 'returned'].includes(order.orderStatus)) {
    return res.status(400).json({
      success: false,
      message: `Cannot cancel order. It is already ${order.orderStatus}.`,
    });
  }

  // 12-hour limit check:
  // After order placement, user can only cancel within 12 hours.
  const orderCreatedAt = new Date(order.createdAt).getTime();
  const now = Date.now();
  const elapsedMilliseconds = now - orderCreatedAt;
  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

  if (!isAdmin && elapsedMilliseconds > TWELVE_HOURS_MS) {
    const hoursPast = Math.floor(elapsedMilliseconds / (60 * 60 * 1000));
    return res.status(400).json({
      success: false,
      message: `Cancellation window has expired. Orders can only be cancelled within 12 hours of placement (${hoursPast} hours have passed).`,
    });
  }

  // Restore inventory (product stock)
  if (order.orderItems?.length) {
    for (const item of order.orderItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
      }
    }
  }

  // Process Razorpay refund if paid online
  let refundSuccess = false;
  if (order.isPaid && order.paymentResult?.id && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      const refund = await instance.payments.refund(order.paymentResult.id, {
        amount: Math.round(order.totalPrice * 100),
        notes: {
          orderId: order._id.toString(),
          reason: reason || 'Customer cancelled within 12 hours window',
        },
      });
      refundSuccess = true;
      order.refundStatus = 'processed';
      order.refundId = refund.id;
    } catch (err) {
      console.error('Razorpay refund error:', err.message);
      order.refundStatus = 'pending';
    }
  } else if (order.isPaid) {
    order.refundStatus = 'pending';
  } else {
    order.refundStatus = 'not_applicable';
  }

  order.orderStatus = 'cancelled';
  order.cancelledAt = new Date();
  order.cancellationReason = reason || 'Customer requested cancellation';
  await order.save();

  res.json({
    success: true,
    message: refundSuccess
      ? 'Order cancelled and refund initiated successfully to your original payment method.'
      : 'Order cancelled successfully.',
    order,
  });
};

