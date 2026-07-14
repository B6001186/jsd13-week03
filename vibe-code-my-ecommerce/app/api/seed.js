require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Status = require("./src/models/Status");
const User = require("./src/models/User");
const Product = require("./src/models/Product");

const statuses = [
  { status_name: "pending_payment", description: "รอการชำระเงิน" },
  { status_name: "paid", description: "ชำระเงินแล้ว" },
  { status_name: "preparing_shipment", description: "เตรียมจัดส่ง" },
  { status_name: "shipped", description: "จัดส่งแล้ว" },
  { status_name: "delivered", description: "ได้รับสินค้าแล้ว" },
];

const adminUser = {
  name: "Atcharaporn",
  email: "atcharapornok@gmail.com",
  password: "admin123",
  tel: "082xxxxxxx",
  role: "admin",
};

const sampleProducts = [
  {
    product_name: "Pink Person",
    caption: "pink pink pink",
    pics_urls: ["https://example.com/pink-person.jpg"],
    price: 349,
    inventory: 10,
  },
  {
    product_name: "Blue Person",
    caption: "blue blue blue",
    pics_urls: ["https://example.com/blue-person.jpg"],
    price: 399,
    inventory: 5,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Status.deleteMany({});
    await Status.insertMany(statuses);
    console.log("Seeded statuses");

    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await User.create({ ...adminUser, password: hashedPassword });
    console.log(`Seeded admin: ${adminUser.email} / ${adminUser.password}`);

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log("Seeded products");

    console.log("Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
