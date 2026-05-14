import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import crypto from "crypto";

// Generate unique payment reference
const generatePaymentRef = () => {
  return "HK" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
};

// @desc    Create order and initiate Telebirr payment
// @route   POST /api/orders/checkout
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, deliveryPhone, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required"
      });
    }

    // Validate and process items
    let subtotal = 0;
    let totalDeliveryFee = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      if (!product.isAvailable || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock or unavailable`
        });
      }

      const itemTotal = product.price * item.quantity;
      const itemDeliveryFee = product.deliveryFee;

      orderItems.push({
        productId: product._id,
        name: product.name,
        category: product.category,
        quantity: item.quantity,
        unitPrice: product.price,
        deliveryFee: itemDeliveryFee,
        totalPrice: itemTotal
      });

      subtotal += itemTotal;
      totalDeliveryFee += itemDeliveryFee;
    }

    const finalAmount = subtotal + totalDeliveryFee;
    const paymentRef = generatePaymentRef();

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      subtotal,
      totalDeliveryFee,
      finalAmount,
      paymentRef,
      deliveryAddress: deliveryAddress || null,
      deliveryPhone: deliveryPhone || req.user.phone,
      notes: notes || null
    });

    // Initiate Telebirr payment (mock structure - replace with actual API)
    const telebirrPayload = {
      appId: process.env.TELEBIRR_APP_ID,
      appKey: process.env.TELEBIRR_APP_KEY,
      merchantCode: process.env.TELEBIRR_MERCHANT_CODE,
      nonce: crypto.randomBytes(16).toString("hex"),
      notifyUrl: process.env.TELEBIRR_NOTIFY_URL,
      returnUrl: process.env.TELEBIRR_RETURN_URL,
      timeoutExpress: "30m",
      totalAmount: finalAmount.toFixed(2),
      outTradeNo: paymentRef,
      subject: `Hule Kircha - ${orderItems.map(i => i.name).join(", ")}`,
      body: `Livestock order from Hule Kircha Trading`
    };

    // Generate signature (implementation depends on Telebirr API spec)
    const signString = Object.keys(telebirrPayload)
      .sort()
      .map(key => `${key}=${telebirrPayload[key]}`)
      .join("&");

    telebirrPayload.sign = crypto
      .createHmac("sha256", process.env.TELEBIRR_APP_KEY)
      .update(signString)
      .digest("hex");

    // In production: Send request to Telebirr API
    // const telebirrResponse = await axios.post(process.env.TELEBIRR_API_URL, telebirrPayload);
    // const paymentUrl = telebirrResponse.data.data.toPayUrl;

    // Mock payment URL for development
    const paymentUrl = `${process.env.TELEBIRR_API_URL || "https://app.ethiotelecom.et/telebirrApi"}?ref=${paymentRef}`;

    res.status(201).json({
      success: true,
      message: "Order created, redirecting to payment",
      data: {
        order: {
          id: order._id,
          paymentRef: order.paymentRef,
          finalAmount: order.finalAmount,
          status: order.status
        },
        paymentUrl
      }
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating order"
    });
  }
};

// @desc    Telebirr payment callback
// @route   POST /api/orders/callback
// @access  Public (Telebirr callback)
export const paymentCallback = async (req, res) => {
  try {
    const { outTradeNo, tradeNo, tradeStatus, totalAmount, sign } = req.body;

    // Verify signature
    const verifyPayload = { ...req.body };
    delete verifyPayload.sign;

    const verifyString = Object.keys(verifyPayload)
      .sort()
      .map(key => `${key}=${verifyPayload[key]}`)
      .join("&");

    const expectedSign = crypto
      .createHmac("sha256", process.env.TELEBIRR_APP_KEY)
      .update(verifyString)
      .digest("hex");

    if (sign !== expectedSign) {
      console.error("Invalid payment signature");
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    const order = await Order.findOne({ paymentRef: outTradeNo });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (tradeStatus === "SUCCESS") {
      order.status = "paid";
      order.paymentStatus = "completed";
      order.telebirrTransactionId = tradeNo;
      order.paidAt = new Date();

      // Reduce stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }
    } else if (tradeStatus === "FAILED") {
      order.paymentStatus = "failed";
    } else if (tradeStatus === "TIMEOUT") {
      order.paymentStatus = "timeout";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment callback processed"
    });
  } catch (error) {
    console.error("Payment callback error:", error);
    res.status(500).json({
      success: false,
      message: "Server error processing callback"
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name image category");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching orders"
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate("items.productId", "name image category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching order"
    });
  }
};
