import bag1 from "../assets/bag1.jpeg";
import bag2 from "../assets/bag2.jpeg";
import bag3 from "../assets/bag3.jpeg";
import bag4 from "../assets/bag4.jpeg";
import bag5 from "../assets/bag5.jpeg";
import bag6 from "../assets/bag6.jpeg";
import bag7 from "../assets/bag7.jpeg";
import bag8 from "../assets/bag8.jpeg";
import bag9 from "../assets/bag9.jpeg";
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";
import image3 from "../assets/image3.jpeg";
import image4 from "../assets/image4.jpeg";
import image5 from "../assets/image5.jpeg";
import image6 from "../assets/image6.jpeg";
import { api, mapApiProduct } from "../api/client";

export const DELIVERY_CHARGE = 250;
export const STORE_LOCATION = "Bahawalpur, Pakistan";
export const STORE_PHONE = "03121825417";
export const STORE_PHONE_LINK = "https://wa.me/923121825417";
export const STORE_EMAIL = "thestitchlane404@gmail.com";

export const products = [
  {
    id: "stripe-storage-tote",
    name: "Stripe Quilted Storage Tote",
    category: "Storage",
    size: "Small",
    price: 1100,
    compareAt: 1500,
    discount: 25,
    image: bag1,
    gallery: [bag1, bag2, bag3],
    description:
      "A structured quilted storage tote in classic red and cream stripes. Soft sides, durable zipper, and generous room for blankets, seasonal clothes, or everyday essentials.",
    details: ["Size: Small", "Quilted lid", "Zip closure", "Dual handles"],
  },
  {
    id: "teal-geometric-tote",
    name: "Teal Geometric Storage Tote",
    category: "Storage",
    size: "Medium",
    price: 1300,
    compareAt: 1800,
    discount: 25,
    image: bag4,
    gallery: [bag4, bag5, bag6],
    description:
      "Modern geometric print in teal and cream with a diamond-quilted top. Designed to keep spaces tidy while looking beautifully finished.",
    details: ["Size: Medium", "Geometric print", "Quilted lid", "Long carry handles"],
  },
  {
    id: "wildflower-linen-bin",
    name: "Wildflower Linen Bin",
    category: "Storage",
    size: "Large",
    price: 1400,
    compareAt: 1900,
    discount: 25,
    image: bag7,
    gallery: [bag7, bag8, bag9],
    description:
      "Soft honey-beige floral storage bin with a calm botanical print. Perfect for linens, throws, and bedroom organisation with a handcrafted finish.",
    details: ["Size: Large", "Botanical print", "Soft cube form", "Side handles"],
  },
  {
    id: "floral-roti-warmer",
    name: "Floral Roti Pouch",
    category: "Kitchen",
    price: 800,
    compareAt: 1100,
    discount: 25,
    image: image1,
    gallery: [image1],
    description:
      "Insulated circular roti pouch with a vibrant floral exterior and soft padded construction to keep flatbreads warm at the table.",
    details: ["Simple design", "Insulated lining", "Velcro closure", "Hang loop"],
  },
  {
    id: "gingham-roti-warmer",
    name: "Gingham Roti Pouch",
    category: "Kitchen",
    price: 1000,
    compareAt: 1350,
    discount: 25,
    image: image2,
    gallery: [image2],
    description:
      "Chocolate gingham roti pouch edged with delicate cream lace trim. A charming everyday piece with thoughtful stitching details.",
    details: ["Lace design", "Insulated pouch", "Velcro closure", "Hang loop"],
  },
  {
    id: "leaf-roti-warmer",
    name: "Leaf Print Roti Pouch",
    category: "Kitchen",
    price: 800,
    compareAt: 1100,
    discount: 25,
    image: image3,
    gallery: [image3],
    description:
      "Fresh botanical leaf print roti pouch with padded insulation and a clean navy lining for everyday kitchen use.",
    details: ["Simple design", "Padded insulation", "Velcro closure", "Hang loop"],
  },
  {
    id: "stripe-roti-warmer",
    name: "Stripe Roti Pouch",
    category: "Kitchen",
    price: 800,
    compareAt: 1100,
    discount: 25,
    image: image4,
    gallery: [image4],
    description:
      "Bold red-and-cream striped roti pouch with matching lid pieces. Classic, practical, and carefully stitched.",
    details: ["Simple design", "Matching lid set", "Velcro closure", "Fabric loops"],
  },
  {
    id: "teal-geometric-warmer",
    name: "Teal Geometric Roti Pouch",
    category: "Kitchen",
    price: 800,
    compareAt: 1100,
    discount: 25,
    image: image5,
    gallery: [image5, image6],
    description:
      "Contemporary teal geometric roti pouch that pairs beautifully with modern kitchens while keeping rotis soft and warm.",
    details: ["Simple design", "Insulated lining", "Velcro closure", "Hang loop"],
  },
];

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

export function formatPrice(amount) {
  return `${amount.toLocaleString("en-PK")} PKR`;
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
