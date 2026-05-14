import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Create admin user
    const adminPin = await bcrypt.hash("1234", 12);
    const admin = await User.create({
      name: "Admin",
      phone: "+251911000000",
      pin: adminPin,
      isAdmin: true,
      preferredTheme: "dark"
    });
    console.log("👤 Admin created:", admin.phone);

    // Create demo user
    const userPin = await bcrypt.hash("1234", 12);
    const user = await User.create({
      name: "የሱፍያን አህመድ",
      phone: "+251911111111",
      pin: userPin,
      isAdmin: false,
      preferredTheme: "dark"
    });
    console.log("👤 Demo user created:", user.phone);

    // Create products
    const products = [
      {
        name: "የበሬ ቅርጫ - ሙሉ",
        description: "ፕሪሚየም የበሬ ቅርጫ ሙሉ ክፍል። ከፍተኛ ጥራት ያለው እና በጣም ጣፋጭ። ለበዓላት እና ለልዩ ዝግጅቶች ተስማሚ።",
        category: "የበሬ ቅርጫ",
        subCategory: "full",
        price: 25000,
        deliveryFee: 350,
        stock: 50,
        isAvailable: true,
        featured: true,
        minOrderQty: 1,
        maxOrderQty: 10
      },
      {
        name: "የበሬ ቅርጫ - ግማሽ",
        description: "የበሬ ቅርጫ ግማሽ ክፍል። ለአነስተኛ ቤተሰቦች እና ለጓደኞች ቡድን ተስማሚ።",
        category: "የበሬ ቅርጫ",
        subCategory: "half",
        price: 13000,
        deliveryFee: 350,
        stock: 30,
        isAvailable: true,
        featured: true,
        minOrderQty: 1,
        maxOrderQty: 20
      },
      {
        name: "በግ - ጥራት A",
        description: "ፕሪሚየም በግ ከከፍተኛ ጥራት። ለበዓል እና ለልዩ ዝግጅቶች። ጣፋጭ እና ለስላሳ ስጋ።",
        category: "በግ",
        price: 8000,
        deliveryFee: 600,
        stock: 40,
        isAvailable: true,
        featured: true,
        minOrderQty: 1,
        maxOrderQty: 15
      },
      {
        name: "በግ - ጥራት B",
        description: "ከፍተኛ ጥራት ያለው በግ በተመጣጣኝ ዋጋ። ለቤተሰብ በዓላት እና ለልዩ ዝግጅቶች።",
        category: "በግ",
        price: 6500,
        deliveryFee: 600,
        stock: 35,
        isAvailable: true,
        featured: false,
        minOrderQty: 1,
        maxOrderQty: 20
      },
      {
        name: "ፍየል - ጥራት A",
        description: "ፕሪሚየም ፍየል ከከፍተኛ ጥራት። ለበዓል እና ለልዩ ዝግጅቶች። ልዩ ጣዕም።",
        category: "ፍየል",
        price: 5000,
        deliveryFee: 600,
        stock: 45,
        isAvailable: true,
        featured: true,
        minOrderQty: 1,
        maxOrderQty: 20
      },
      {
        name: "ፍየል - ጥራት B",
        description: "ከፍተኛ ጥራት ያለው ፍየል በተመጣጣኝ ዋጋ። ለቤተሰብ በዓላት እና ለልዩ ዝግጅቶች።",
        category: "ፍየል",
        price: 4000,
        deliveryFee: 600,
        stock: 30,
        isAvailable: true,
        featured: false,
        minOrderQty: 1,
        maxOrderQty: 25
      },
      {
        name: "ቋንጣ - ጥራት A",
        description: "ፕሪሚየም ቋንጣ ከከፍተኛ ጥራት። ለበዓል እና ለልዩ ዝግጅቶች። ልዩ ጣዕም።",
        category: "ቋንጣ",
        price: 3000,
        deliveryFee: 300,
        stock: 60,
        isAvailable: true,
        featured: true,
        minOrderQty: 1,
        maxOrderQty: 30
      },
      {
        name: "ቋንጣ - ጥራት B",
        description: "ከፍተኛ ጥራት ያለው ቋንጣ በተመጣጣኝ ዋጋ። ለቤተሰብ በዓላት እና ለልዩ ዝግጅቶች።",
        category: "ቋንጣ",
        price: 2500,
        deliveryFee: 300,
        stock: 50,
        isAvailable: true,
        featured: false,
        minOrderQty: 1,
        maxOrderQty: 40
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`📦 ${createdProducts.length} products created`);

    // Create a sample order
    const sampleOrder = await Order.create({
      userId: user._id,
      items: [{
        productId: createdProducts[0]._id,
        name: createdProducts[0].name,
        category: createdProducts[0].category,
        quantity: 1,
        unitPrice: createdProducts[0].price,
        deliveryFee: createdProducts[0].deliveryFee,
        totalPrice: createdProducts[0].price
      }],
      subtotal: createdProducts[0].price,
      totalDeliveryFee: createdProducts[0].deliveryFee,
      finalAmount: createdProducts[0].price + createdProducts[0].deliveryFee,
      paymentRef: "HK" + Date.now().toString(36).toUpperCase(),
      status: "pending",
      paymentStatus: "pending",
      deliveryAddress: "አዲስ አበባ, ቦሌ",
      deliveryPhone: user.phone
    });
    console.log("📋 Sample order created:", sampleOrder.paymentRef);

    console.log("
🎉 Seed completed successfully!");
    console.log("
🔑 Login credentials:");
    console.log("  Admin: +251911000000 / PIN: 1234");
    console.log("  User:  +251911111111 / PIN: 1234");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedData();
