require("dotenv").config();
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Settings = require("../models/Settings");

const BAG_SIZES = [
  { name: "Small", price: 1100, compareAt: 1500, stock: 25 },
  { name: "Medium", price: 1300, compareAt: 1800, stock: 20 },
  { name: "Large", price: 1400, compareAt: 1900, stock: 15 },
];

const POUCH_SIMPLE = "Simple Roti Pouch";
const POUCH_LACE = "Roti Pouch with Lace Design";

const catalog = [
  {
    slug: "stripe-storage-tote",
    name: "Stripe Quilted Storage Tote",
    category: "Storage",
    sizes: BAG_SIZES,
    colors: [
      { name: "Red Stripe", hex: "#B33A3A", image: "/media/bag1.jpeg" },
      { name: "Cream", hex: "#F5E6D3", image: "/media/bag2.jpeg" },
      { name: "Classic", hex: "#8B5A2B", image: "/media/bag3.jpeg" },
    ],
    price: 1100,
    compareAt: 1500,
    discount: 25,
    stock: 60,
    image: "/media/bag1.jpeg",
    gallery: ["/media/bag1.jpeg", "/media/bag2.jpeg", "/media/bag3.jpeg"],
    description:
      "A structured quilted storage tote in classic red and cream stripes. Soft sides, durable zipper, and generous room for blankets, seasonal clothes, or everyday essentials.",
    details: ["Available in S / M / L", "Quilted lid", "Zip closure", "Dual handles"],
  },
  {
    slug: "teal-geometric-tote",
    name: "Teal Geometric Storage Tote",
    category: "Storage",
    sizes: BAG_SIZES,
    colors: [
      { name: "Teal", hex: "#2A8F8F", image: "/media/bag4.jpeg" },
      { name: "Cream", hex: "#F2E8D5", image: "/media/bag5.jpeg" },
      { name: "Geometric Mix", hex: "#3D6B6B", image: "/media/bag6.jpeg" },
    ],
    price: 1100,
    compareAt: 1800,
    discount: 25,
    stock: 60,
    image: "/media/bag4.jpeg",
    gallery: ["/media/bag4.jpeg", "/media/bag5.jpeg", "/media/bag6.jpeg"],
    description:
      "Modern geometric print in teal and cream with a diamond-quilted top. Designed to keep spaces tidy while looking beautifully finished.",
    details: ["Available in S / M / L", "Geometric print", "Quilted lid", "Long carry handles"],
  },
  {
    slug: "wildflower-linen-bin",
    name: "Wildflower Linen Bin",
    category: "Storage",
    sizes: BAG_SIZES,
    colors: [
      { name: "Honey Beige", hex: "#C4A574", image: "/media/bag7.jpeg" },
      { name: "Floral Soft", hex: "#D4B896", image: "/media/bag8.jpeg" },
      { name: "Warm Linen", hex: "#B8956A", image: "/media/bag9.jpeg" },
    ],
    price: 1100,
    compareAt: 1900,
    discount: 25,
    stock: 60,
    image: "/media/bag7.jpeg",
    gallery: ["/media/bag7.jpeg", "/media/bag8.jpeg", "/media/bag9.jpeg"],
    description:
      "Soft honey-beige floral storage bin with a calm botanical print. Perfect for linens, throws, and bedroom organisation with a handcrafted finish.",
    details: ["Available in S / M / L", "Botanical print", "Soft cube form", "Side handles"],
  },
  {
    slug: "floral-roti-warmer",
    name: "Simple Roti Pouch — Floral",
    category: "Kitchen",
    size: POUCH_SIMPLE,
    sizes: [],
    colors: [
      { name: "Floral Multicolor", hex: "#C45C7A", image: "/media/image1.jpeg" },
    ],
    price: 800,
    compareAt: 1100,
    discount: 25,
    stock: 40,
    image: "/media/image1.jpeg",
    gallery: ["/media/image1.jpeg"],
    description:
      "Insulated circular roti pouch with a vibrant floral exterior and soft padded construction to keep flatbreads warm at the table.",
    details: [POUCH_SIMPLE, "Insulated lining", "Velcro closure", "Hang loop"],
  },
  {
    slug: "gingham-roti-warmer",
    name: "Roti Pouch with Lace Design — Gingham",
    category: "Kitchen",
    size: POUCH_LACE,
    sizes: [],
    colors: [
      { name: "Chocolate Gingham", hex: "#5C4033", image: "/media/image2.jpeg" },
      { name: "Cream Lace", hex: "#F5EDE0", image: "/media/image2.jpeg" },
    ],
    price: 1000,
    compareAt: 1350,
    discount: 25,
    stock: 30,
    image: "/media/image2.jpeg",
    gallery: ["/media/image2.jpeg"],
    description:
      "Chocolate gingham roti pouch edged with delicate cream lace trim. A charming everyday piece with thoughtful stitching details.",
    details: [POUCH_LACE, "Lace design", "Velcro closure", "Hang loop"],
  },
  {
    slug: "leaf-roti-warmer",
    name: "Simple Roti Pouch — Leaf Print",
    category: "Kitchen",
    size: POUCH_SIMPLE,
    sizes: [],
    colors: [
      { name: "Botanical Green", hex: "#4F7A4F", image: "/media/image3.jpeg" },
      { name: "Navy Lining", hex: "#1F2A44", image: "/media/image3.jpeg" },
    ],
    price: 800,
    compareAt: 1100,
    discount: 25,
    stock: 35,
    image: "/media/image3.jpeg",
    gallery: ["/media/image3.jpeg"],
    description:
      "Fresh botanical leaf print roti pouch with padded insulation and a clean navy lining for everyday kitchen use.",
    details: [POUCH_SIMPLE, "Padded insulation", "Velcro closure", "Hang loop"],
  },
  {
    slug: "stripe-roti-warmer",
    name: "Simple Roti Pouch — Stripe",
    category: "Kitchen",
    size: POUCH_SIMPLE,
    sizes: [],
    colors: [
      { name: "Red Stripe", hex: "#B33A3A", image: "/media/image4.jpeg" },
      { name: "Cream", hex: "#F5E6D3", image: "/media/image4.jpeg" },
    ],
    price: 800,
    compareAt: 1100,
    discount: 25,
    stock: 35,
    image: "/media/image4.jpeg",
    gallery: ["/media/image4.jpeg"],
    description:
      "Bold red-and-cream striped roti pouch with matching lid pieces. Classic, practical, and carefully stitched.",
    details: [POUCH_SIMPLE, "Matching lid set", "Velcro closure", "Fabric loops"],
  },
  {
    slug: "teal-geometric-warmer",
    name: "Simple Roti Pouch — Teal Geometric",
    category: "Kitchen",
    size: POUCH_SIMPLE,
    sizes: [],
    colors: [
      { name: "Teal", hex: "#2A8F8F", image: "/media/image5.jpeg" },
      { name: "Geometric Cream", hex: "#E8DCC8", image: "/media/image6.jpeg" },
    ],
    price: 800,
    compareAt: 1100,
    discount: 25,
    stock: 30,
    image: "/media/image5.jpeg",
    gallery: ["/media/image5.jpeg", "/media/image6.jpeg"],
    description:
      "Contemporary teal geometric roti pouch that pairs beautifully with modern kitchens while keeping rotis soft and warm.",
    details: [POUCH_SIMPLE, "Insulated lining", "Velcro closure", "Hang loop"],
  },
];

async function seed() {
  await connectDB();

  await Settings.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        storeName: "The StitchLane",
        email: process.env.STORE_EMAIL || "thestitchlane404@gmail.com",
        phone: process.env.STORE_PHONE || "03121825417",
        location: process.env.STORE_LOCATION || "Bahawalpur, Pakistan",
        currency: "PKR",
        deliveryCharge: Number(process.env.DELIVERY_CHARGE || 250),
        codEnabled: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
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
      $setOnInsert: {
        name: "Storage",
        slug: "storage",
        description: "Quilted storage totes and bins",
        isActive: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const kitchen = await Category.findOneAndUpdate(
    { slug: "kitchen" },
    {
      $setOnInsert: {
        name: "Kitchen",
        slug: "kitchen",
        description: "Roti pouches and kitchen textiles",
        isActive: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  for (const item of catalog) {
    const category = item.category === "Kitchen" ? kitchen._id : storage._id;
    const { category: _catLabel, ...rest } = item;
    const sizes = Array.isArray(item.sizes) ? item.sizes : [];
    await Product.findOneAndUpdate(
      { slug: item.slug },
      {
        $setOnInsert: {
          ...rest,
          category,
          sizes,
          size: item.size || "",
          status: "active",
          stock: sizes.length
            ? sizes.reduce((sum, s) => sum + (s.stock || 0), 0)
            : item.stock,
          price: sizes.length ? sizes[0].price : item.price,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Ensured ${catalog.length} starter products exist`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
