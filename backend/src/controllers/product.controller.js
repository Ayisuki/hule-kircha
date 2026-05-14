import { Product } from "../models/Product.js";
import { sanitizeInput } from "../middleware/validate.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, isAvailable, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
    if (featured !== undefined) filter.featured = featured === "true";
    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products }
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching products"
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching product"
    });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, price, deliveryFee, stock, minOrderQty, maxOrderQty } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category, and price are required"
      });
    }

    const product = await Product.create({
      name: sanitizeInput(name),
      description: sanitizeInput(description),
      category,
      subCategory: subCategory || null,
      price: Number(price),
      deliveryFee: Number(deliveryFee) || 350,
      stock: Number(stock) || 0,
      minOrderQty: Number(minOrderQty) || 1,
      maxOrderQty: Number(maxOrderQty) || 100,
      image: req.body.image || null
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product }
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating product"
    });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, price, deliveryFee, stock, isAvailable, minOrderQty, maxOrderQty, featured } = req.body;

    const updates = {};
    if (name) updates.name = sanitizeInput(name);
    if (description) updates.description = sanitizeInput(description);
    if (category) updates.category = category;
    if (subCategory !== undefined) updates.subCategory = subCategory;
    if (price !== undefined) updates.price = Number(price);
    if (deliveryFee !== undefined) updates.deliveryFee = Number(deliveryFee);
    if (stock !== undefined) updates.stock = Number(stock);
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;
    if (minOrderQty !== undefined) updates.minOrderQty = Number(minOrderQty);
    if (maxOrderQty !== undefined) updates.maxOrderQty = Number(maxOrderQty);
    if (featured !== undefined) updates.featured = featured;
    if (req.body.image) updates.image = req.body.image;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product }
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating product"
    });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting product"
    });
  }
};
