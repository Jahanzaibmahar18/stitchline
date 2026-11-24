require("dotenv").config();
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Settings = require("../models/Settings");

const catalog = [
  {
    slug: "stripe-storage-tote",
    name: "Stripe Quilted Storage Tote",
    category: "Storage",
    size: "Small",
    price: 1100,
    compareAt: 1500,
    discount: 25,
    stock: 25,
    image: "/products/bag1.jpeg",
    gallery: ["/products/bag1.jpeg", "/products/bag2.jpeg", "/products/bag3.jpeg"],
    description:
      "A structured quilted storage tote in classic red and cream stripes. Soft sides, durable zipper, and generous room for blankets, seasonal clothes, or everyday essentials.",
    details: ["Size: Small", "Quilted lid", "Zip closure", "Dual handles"],
  },
  {
    slug: "teal-geometric-tote",
    name: "Teal Geometric Storage Tote",
    category: "Storage",
    size: "Medium",
    price: 1300,
    compareAt: 1800,
    discount: 25,
    stock: 20,
    image: "/products/bag4.jpeg",
    gallery: ["/products/bag4.jpeg", "/products/bag5.jpeg", "/products/bag6.jpeg"],
    description:
      "Modern geometric print in teal and cream with a diamond-quilted top. Designed to keep spaces tidy while looking beautifully finished.",
    details: ["Size: Medium", "Geometric print", "Quilted lid", "Long carry handles"],
  },
  {
    slug: "wildflower-linen-bin",
    name: "Wildflower Linen Bin",
    category: "Storage",
    size: "Large",
    price: 1400,
    compareAt: 1900,
    discount: 25,
    stock: 15,
    image: "/products/bag7.jpeg",
    gallery: ["/products/bag7.jpeg", "/products/bag8.jpeg", "/products/bag9.jpeg"],
    description:
      "Soft honey-beige floral storage bin with a calm botanical print. Perfect for linens, throws, and bedroom organisation with a handcrafted finish.",
    details: ["Size: Large", "Botanical print", "Soft cube form", "Side handles"],
  },
  {
    slug: "floral-roti-warmer",
    name: "Floral Roti Pouch",
    category: "Kitchen",
    price: 800,
    compareAt: 1100,
    discount: 25,
    stock: 40,
    image: "/products/image1.jpeg",
    gallery: ["/products/image1.jpeg"],
    description:
      "Insulated circular roti pouch with a vibrant floral exterior and soft padded construction to keep flatbreads warm at the table.",
    details: ["Simple design", "Insulated lining", "Velcro closure", "Hang loop"],
  },
  {
    slug: "gingham-roti-warmer",
    name: "Gingham Roti Pouch",
    category: "Kitchen",
    price: 1000,
    compareAt: 1350,
    discount: 25,
    stock: 30,
    image: "/products/image2.jpeg",
    gallery: ["/products/image2.jpeg"],
    description:
      "Chocolate gingham roti pouch edged with delicate cream lace trim. A charming everyday piece with thoughtful stitching details.",
    details: ["Lace design", "Insulated pouch", "Velcro closure", "Hang loop"],
  },
  {
    slug: "leaf-roti-warmer",
    name: "Leaf Print Roti Pouch",
    category: "Kitchen",
    price: 800,
    compareAt: 1100,
    discount: 25,
    stock: 35,
    image: "/products/image3.jpeg",
    gallery: ["/products/image3.jpeg"],
    description:
      "Fresh botanical leaf print roti pouch with padded insulation and a clean navy lining for everyday kitchen use.",
    details: ["Simple design", "Padded insulation", "Velcro closure", "Hang loop"],
  },
  {
    slug: "stripe-roti-warmer",
    name: "Stripe Roti Pouch",
    category: "Kitchen",
    price: 800,
    compareAt: 1100,
    discount: 25,
    stock: 35,
    image: "/products/image4.jpeg",
    gallery: ["/products/image4.jpeg"],
    description:
      "Bold red-and-cream striped roti pouch with matching lid pieces. Classic, practical, and carefully stitched.",
    details: ["Simple design", "Matching lid set", "Velcro closure", "Fabric loops"],
  },
  {
    slug: "teal-geometric-warmer",
    name: "Teal Geometric Roti Pouch",
    category: "Kitchen",
    price: 800,
    compareAt: 1100,
    discount: 25,
    stock: 30,
    image: "/products/image5.jpeg",
    gallery: ["/products/image5.jpeg", "/products/image6.jpeg"],
    description:
      "Contemporary teal geometric roti pouch that pairs beautifully with modern kitchens while keeping rotis soft and warm.",
    details: ["Simple design", "Insulated lining", "Velcro closure", "Hang loop"],
  },
];

async function seed() {
  await connectDB();

  await Settings.findOneAndUpdate(
    {},
    {
      storeName: "The StitchLane",
      email: process.env.STORE_EMAIL || "thestitchlane404@gmail.com",
      phone: process.env.STORE_PHONE || "03121825417",
      location: process.env.STORE_LOCATION || "Bahawalpur, Pakistan",
      currency: "PKR",
      deliveryCharge: Number(process.env.DELIVERY_CHARGE || 250),
      codEnabled: true,
    },
    { upsert: true, new: true }
  );

  const adminEmail = process.env.ADMIN_EMAIL || "admin@thestitchlane.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: process.env.ADMIN_NAME || "StitchLane Admin",
      email: adminEmail,
      phone: process.env.STORE_PHONE || "03121825417",
      password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
      role: "admin",
    });
    console.log("Admin created:", adminEmail);
  } else {
    console.log("Admin already exists:", adminEmail);
  }

  const storage = await Category.findOneAndUpdate(
    { slug: "storage" },
    {
      name: "Storage",
      slug: "storage",
      description: "Quilted storage totes and bins",
      isActive: true,
    },
    { upsert: true, new: true }
  );
  const kitchen = await Category.findOneAndUpdate(
    { slug: "kitchen" },
    {
      name: "Kitchen",
      slug: "kitchen",
      description: "Roti pouches and kitchen textiles",
      isActive: true,
    },
    { upsert: true, new: true }
  );

  for (const item of catalog) {
    const category = item.category === "Kitchen" ? kitchen._id : storage._id;
    await Product.findOneAndUpdate(
      { slug: item.slug },
      { ...item, category, status: "active" },
      { upsert: true, new: true }
    );
  }

  console.log(`Seeded ${catalog.length} products`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
