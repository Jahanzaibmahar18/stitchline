import bag1 from "../../assets/storefront/bag1.jpeg";
import bag2 from "../../assets/storefront/bag2.jpeg";
import bag3 from "../../assets/storefront/bag3.jpeg";
import bag4 from "../../assets/storefront/bag4.jpeg";
import bag5 from "../../assets/storefront/bag5.jpeg";
import bag6 from "../../assets/storefront/bag6.jpeg";
import bag7 from "../../assets/storefront/bag7.jpeg";
import bag8 from "../../assets/storefront/bag8.jpeg";
import bag9 from "../../assets/storefront/bag9.jpeg";
import image1 from "../../assets/storefront/image1.jpeg";
import image2 from "../../assets/storefront/image2.jpeg";
import image3 from "../../assets/storefront/image3.jpeg";
import image4 from "../../assets/storefront/image4.jpeg";
import image5 from "../../assets/storefront/image5.jpeg";
import image6 from "../../assets/storefront/image6.jpeg";
import { api, mapApiProduct } from "../../api/storefront/client";

export const DELIVERY_CHARGE = 250;
export const STORE_LOCATION = "Bahawalpur, Pakistan";
export const STORE_PHONE = "03121825417";
export const STORE_PHONE_LINK = "https://wa.me/923121825417";
export const STORE_EMAIL = "thestitchlane404@gmail.com";

const BAG_SIZES = [
  { name: "Small", price: 1100, compareAt: 1500, stock: 25 },
  { name: "Medium", price: 1300, compareAt: 1800, stock: 20 },
  { name: "Large", price: 1400, compareAt: 1900, stock: 15 },
];

const POUCH_SIMPLE = "Simple Roti Pouch";
const POUCH_LACE = "Roti Pouch with Lace Design";

export const products = [
  {
    id: "stripe-storage-tote",
    name: "Stripe Quilted Storage Tote",
    category: "Storage",
    sizes: BAG_SIZES,
    colors: [
      { name: "Red Stripe", hex: "#B33A3A", image: bag1 },
      { name: "Cream", hex: "#F5E6D3", image: bag2 },
      { name: "Classic", hex: "#8B5A2B", image: bag3 },
    ],
    price: 1100,
    compareAt: 1500,
    discount: 25,
    image: bag1,
    gallery: [bag1, bag2, bag3],
    description:
      "A structured quilted storage tote in classic red and cream stripes. Soft sides, durable zipper, and generous room for blankets, seasonal clothes, or everyday essentials.",
    details: ["Available in S / M / L", "Quilted lid", "Zip closure", "Dual handles"],
  },
  {
    id: "teal-geometric-tote",
    name: "Teal Geometric Storage Tote",
    category: "Storage",
    sizes: BAG_SIZES,
    colors: [
      { name: "Teal", hex: "#2A8F8F", image: bag4 },
      { name: "Cream", hex: "#F2E8D5", image: bag5 },
      { name: "Geometric Mix", hex: "#3D6B6B", image: bag6 },
    ],
    price: 1100,
    compareAt: 1800,
    discount: 25,
    image: bag4,
    gallery: [bag4, bag5, bag6],
    description:
      "Modern geometric print in teal and cream with a diamond-quilted top. Designed to keep spaces tidy while looking beautifully finished.",
    details: ["Available in S / M / L", "Geometric print", "Quilted lid", "Long carry handles"],
  },
  {
    id: "wildflower-linen-bin",
    name: "Wildflower Linen Bin",
    category: "Storage",
    sizes: BAG_SIZES,
    colors: [
      { name: "Honey Beige", hex: "#C4A574", image: bag7 },
      { name: "Floral Soft", hex: "#D4B896", image: bag8 },
      { name: "Warm Linen", hex: "#B8956A", image: bag9 },
    ],
    price: 1100,
    compareAt: 1900,
    discount: 25,
    image: bag7,
    gallery: [bag7, bag8, bag9],
    description:
      "Soft honey-beige floral storage bin with a calm botanical print. Perfect for linens, throws, and bedroom organisation with a handcrafted finish.",
    details: ["Available in S / M / L", "Botanical print", "Soft cube form", "Side handles"],
  },
  {
    id: "floral-roti-warmer",
    name: "Simple Roti Pouch — Floral",
    category: "Kitchen",
    size: POUCH_SIMPLE,
    sizes: [],
    colors: [{ name: "Floral Multicolor", hex: "#C45C7A", image: image1 }],
    price: 800,
    compareAt: 1100,
    discount: 25,
    image: image1,
    gallery: [image1],
    description:
      "Insulated circular roti pouch with a vibrant floral exterior and soft padded construction to keep flatbreads warm at the table.",
    details: [POUCH_SIMPLE, "Insulated lining", "Velcro closure", "Hang loop"],
  },
  {
    id: "gingham-roti-warmer",
    name: "Roti Pouch with Lace Design — Gingham",
    category: "Kitchen",
    size: POUCH_LACE,
    sizes: [],
    colors: [
      { name: "Chocolate Gingham", hex: "#5C4033", image: image2 },
      { name: "Cream Lace", hex: "#F5EDE0", image: image2 },
    ],
    price: 1000,
    compareAt: 1350,
    discount: 25,
    image: image2,
    gallery: [image2],
    description:
      "Chocolate gingham roti pouch edged with delicate cream lace trim. A charming everyday piece with thoughtful stitching details.",
    details: [POUCH_LACE, "Lace design", "Velcro closure", "Hang loop"],
  },
  {
    id: "leaf-roti-warmer",
    name: "Simple Roti Pouch — Leaf Print",
    category: "Kitchen",
    size: POUCH_SIMPLE,
    sizes: [],
    colors: [
      { name: "Botanical Green", hex: "#4F7A4F", image: image3 },
      { name: "Navy Lining", hex: "#1F2A44", image: image3 },
    ],
    price: 800,
    compareAt: 1100,
    discount: 25,
    image: image3,
    gallery: [image3],
    description:
      "Fresh botanical leaf print roti pouch with padded insulation and a clean navy lining for everyday kitchen use.",
    details: [POUCH_SIMPLE, "Padded insulation", "Velcro closure", "Hang loop"],
  },
  {
    id: "stripe-roti-warmer",
    name: "Simple Roti Pouch — Stripe",
    category: "Kitchen",
    size: POUCH_SIMPLE,
    sizes: [],
    colors: [
      { name: "Red Stripe", hex: "#B33A3A", image: image4 },
      { name: "Cream", hex: "#F5E6D3", image: image4 },
    ],
    price: 800,
    compareAt: 1100,
    discount: 25,
    image: image4,
    gallery: [image4],
    description:
      "Bold red-and-cream striped roti pouch with matching lid pieces. Classic, practical, and carefully stitched.",
    details: [POUCH_SIMPLE, "Matching lid set", "Velcro closure", "Fabric loops"],
  },
  {
    id: "teal-geometric-warmer",
    name: "Simple Roti Pouch — Teal Geometric",
    category: "Kitchen",
    size: POUCH_SIMPLE,
    sizes: [],
    colors: [
      { name: "Teal", hex: "#2A8F8F", image: image5 },
      { name: "Geometric Cream", hex: "#E8DCC8", image: image6 },
    ],
    price: 800,
    compareAt: 1100,
    discount: 25,
    image: image5,
    gallery: [image5, image6],
    description:
      "Contemporary teal geometric roti pouch that pairs beautifully with modern kitchens while keeping rotis soft and warm.",
    details: [POUCH_SIMPLE, "Insulated lining", "Velcro closure", "Hang loop"],
  },
];

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

export function formatPrice(amount) {
  return `${Number(amount || 0).toLocaleString("en-PK")} PKR`;
}

export async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api(`/api/products${query ? `?${query}` : ""}`);
    return (res.data.items || []).map(mapApiProduct);
  } catch {
    return products;
  }
}

export async function fetchProductBySlug(slug) {
  try {
    const res = await api(`/api/products/${slug}`);
    return mapApiProduct(res.data);
  } catch {
    return getProductById(slug) || null;
  }
}

export async function fetchDeliveryCharge() {
  try {
    const res = await api("/api/settings/public");
    return Number(res.data.deliveryCharge ?? DELIVERY_CHARGE);
  } catch {
    return DELIVERY_CHARGE;
  }
}
