import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ status: "paid" });
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    // Revenue calculation
    const revenueResult = await Order.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$finalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name phone")
      .populate("items.productId", "name category");

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      { $match: { status: "paid", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$finalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category distribution
    const categoryStats = await Order.aggregate([
      { $match: { status: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.category",
          totalSales: { $sum: "$items.totalPrice" },
          count: { $sum: "$items.quantity" }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalOrders,
          paidOrders,
          pendingOrders,
          deliveredOrders,
          totalRevenue
        },
        recentOrders,
        monthlyRevenue,
        categoryStats
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching dashboard"
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { paymentRef: { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("userId", "name phone")
      .populate("items.productId", "name category image");

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching orders"
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const updates = { status };
    if (status === "delivered") {
      updates.deliveredAt = new Date();
    }
    if (status === "paid") {
      updates.paidAt = new Date();
      updates.paymentStatus = "completed";
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate("userId", "name phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating order"
    });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-pin");

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: { users }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching users"
    });
  }
};

// @desc    Toggle user active status (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      data: { user: user.toJSON() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating user"
    });
  }
};

// @desc    Get payment summary (Admin)
// @route   GET /api/admin/payments
// @access  Private/Admin
export const getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const payments = await Order.find({
      $or: [{ status: "paid" }, { status: "processing" }, { status: "shipped" }, { status: "delivered" }]
    })
      .sort({ paidAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("userId", "name phone")
      .select("paymentRef finalAmount status paidAt telebirrTransactionId");

    const total = await Order.countDocuments({
      $or: [{ status: "paid" }, { status: "processing" }, { status: "shipped" }, { status: "delivered" }]
    });

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: { payments }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching payments"
    });
  }
};
