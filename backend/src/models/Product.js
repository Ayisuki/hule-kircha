import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [200, "Name cannot exceed 200 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [2000, "Description cannot exceed 2000 characters"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["የበሬ ቅርጫ", "በግ", "ፍየል", "ቋንጣ"],
    index: true
  },
  subCategory: {
    type: String,
    enum: ["full", "half", "quarter", null],
    default: null
  },
  image: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  deliveryFee: {
    type: Number,
    required: [true, "Delivery fee is required"],
    min: [0, "Delivery fee cannot be negative"],
    default: 350
  },
  stock: {
    type: Number,
    required: [true, "Stock is required"],
    min: [0, "Stock cannot be negative"],
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  minOrderQty: {
    type: Number,
    default: 1,
    min: 1
  },
  maxOrderQty: {
    type: Number,
    default: 100
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);
