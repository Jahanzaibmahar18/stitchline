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

export const products = [
  {
    id: "stripe-storage-tote",
    name: "Stripe Quilted Storage Tote",
    category: "Storage",
    price: 3200,
    compareAt: 4500,
    discount: 30,
    image: bag1,
    gallery: [bag1, bag2, bag3],
    description:
      "A structured quilted storage tote in classic red and cream stripes. Soft sides, durable zipper, and generous room for blankets, seasonal clothes, or everyday essentials.",
    details: ["Quilted lid", "Zip closure", "Dual handles", "Soft structured form"],
  },
  {
    id: "teal-geometric-tote",
    name: "Teal Geometric Storage Tote",
    category: "Storage",
    price: 3200,
    compareAt: 4500,
    discount: 30,
    image: bag4,
    gallery: [bag4, bag5, bag6],
    description:
      "Modern geometric print in teal and cream with a diamond-quilted top. Designed to keep spaces tidy while looking beautifully finished.",
    details: ["Geometric print", "Quilted lid", "Long carry handles", "Zippered top"],
  },
  {
    id: "wildflower-linen-bin",
    name: "Wildflower Linen Bin",
    category: "Storage",
    price: 2900,
    compareAt: 4100,
    discount: 30,
    image: bag7,
    gallery: [bag7, bag8, bag9],
    description:
      "Soft honey-beige floral storage bin with a calm botanical print. Perfect for linens, throws, and bedroom organisation with a handcrafted finish.",
    details: ["Botanical print", "Soft cube form", "Side handles", "Zippered opening"],
  },
  {
    id: "floral-roti-warmer",
    name: "Floral Roti Warmer",
    category: "Kitchen",
    price: 1100,
    compareAt: 1500,
    discount: 25,
    image: image1,
    gallery: [image1],
    description:
      "Insulated circular roti warmer with a vibrant floral exterior and soft padded construction to keep flatbreads warm at the table.",
    details: ["Insulated lining", "Velcro closure", "Hang loop", "Handmade finish"],
  },
  {
    id: "gingham-roti-warmer",
    name: "Gingham Roti Warmer",
    category: "Kitchen",
    price: 1100,
    compareAt: 1500,
    discount: 25,
    image: image2,
    gallery: [image2],
    description:
      "Chocolate gingham roti warmer edged with delicate cream lace trim. A charming everyday piece with thoughtful stitching details.",
    details: ["Lace trim", "Insulated pouch", "Velcro closure", "Hang loop"],
  },
  {
    id: "leaf-roti-warmer",
    name: "Leaf Print Roti Warmer",
    category: "Kitchen",
    price: 1100,
    compareAt: 1500,
    discount: 25,
    image: image3,
    gallery: [image3],
    description:
      "Fresh botanical leaf print warmer with padded insulation and a clean navy lining for everyday kitchen use.",
    details: ["Botanical print", "Padded insulation", "Velcro closure", "Hang loop"],
  },
  {
    id: "stripe-roti-warmer",
    name: "Stripe Roti Warmer",
    category: "Kitchen",
    price: 1050,
    compareAt: 1450,
    discount: 25,
    image: image4,
    gallery: [image4],
    description:
      "Bold red-and-cream striped roti warmer with matching lid pieces. Classic, practical, and carefully stitched.",
    details: ["Matching lid set", "Insulated interior", "Velcro closure", "Fabric loops"],
  },
  {
    id: "teal-geometric-warmer",
    name: "Teal Geometric Roti Warmer",
    category: "Kitchen",
    price: 1100,
    compareAt: 1500,
    discount: 25,
    image: image5,
    gallery: [image5, image6],
    description:
      "Contemporary teal geometric warmer that pairs beautifully with modern kitchens while keeping rotis soft and warm.",
    details: ["Geometric print", "Insulated lining", "Velcro closure", "Hang loop"],
  },
];

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

export function formatPrice(amount) {
  return `${amount.toLocaleString("en-PK")} PKR`;
}
