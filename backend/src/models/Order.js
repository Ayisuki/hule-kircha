import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
    index: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  totalDeliveryFee: {
    type: Number,
    required: true,
    min: 0
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentRef: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  telebirrTransactionId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"],
    default: "pending",
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "timeout"],
    default: "pending"
  },
  deliveryAddress: {
    type: String,
    default: null
  },
  deliveryPhone: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for recent orders
orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
