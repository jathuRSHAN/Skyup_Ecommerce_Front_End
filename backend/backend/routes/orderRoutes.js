const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');

const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Item = require('../models/Item');
const Payment = require('../models/Payment');

const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Get all orders (Admin only)
router.get('/', authenticateToken, authorizeRole("Admin"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name' }
      })
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get orders of the logged-in customer
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id }).exec();

    if (!customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    const orders = await Order.find({ customerId: customer._id })
      .populate('order_items.itemId', 'name new_price')
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching logged-in user's orders:", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get orders for a specific customer
router.get('/customer/:customerId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.id !== req.params.customerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const orders = await Order.find({ customerId: req.params.customerId }).exec();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(id)
      .populate('order_items.itemId', 'name new_price')
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .exec();

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Create a new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { order_items, discount = 0, shippingAddress } = req.body;

    if (!Array.isArray(order_items) || order_items.length === 0) {
      return res.status(400).json({ error: 'Invalid or missing order_items' });
    }

    const customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const items = await Promise.all(
      order_items.map(async item => {
        const product = await Item.findById(item.itemId);
        if (!product) throw new Error(`Item not found: ${item.itemId}`);
        return {
          itemId: product._id,
          quantity: item.quantity,
          unitPrice: product.new_price,
          name: product.name
        };
      })
    );

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const finalAmount = totalAmount - discount;

    // Check stock and reduce
    for (const item of items) {
      const product = await Item.findById(item.itemId);
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const payment = new Payment({
      customerId: customer._id,
      amount: totalAmount,
      currency: 'LKR',
      paymentMethod: 'Other',
      transactionId: null,
      status: 'Pending'
    });

    const order = new Order({
      customerId: customer._id,
      totalAmount,
      discount,
      lastAmount: finalAmount,
      status: 'New',
      paymentStatus: 'Pending',
      paymentId: payment._id,
      order_items: items,
      shippingAddress
    });

    await payment.save();
    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
      payment
    });

  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({
      error: "Order creation error",
      details: error.message
    });
  }
});

// Cancel order
router.put('/cancel/:id', authenticateToken, authorizeRole("Admin"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).exec();
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status === 'Done') return res.status(400).json({ error: 'Order is already completed' });
    if (order.status === 'Cancelled') return res.status(400).json({ error: 'Order is already cancelled' });

    order.status = 'Cancelled';
    order.paymentStatus = 'Cancelled';

    const payment = await Payment.findById(order.paymentId);
    if (payment) {
      payment.status = 'Cancelled';
      await payment.save();
    }

    await order.save();
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Update order status
router.put('/:id/status', authenticateToken, authorizeRole("Admin"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).exec();
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const { status } = req.body;
    const validStatuses = ["New", "Processing", "Done", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    order.status = status;

    const payment = await Payment.findById(order.paymentId);
    if (status === 'Done') {
      order.paymentStatus = 'Completed';
      if (payment) payment.status = 'Completed';
    } else if (status === 'Cancelled') {
      order.paymentStatus = 'Cancelled';
      if (payment) payment.status = 'Cancelled';
    }

    if (payment) await payment.save();
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
