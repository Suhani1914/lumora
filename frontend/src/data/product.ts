import jacketImg from "../assets/products/jacket.jpeg";
import shoesImg from "../assets/products/shoes.jpeg";
import bagImg from "../assets/products/bag.jpeg";
import knitImg from "../assets/products/knit.jpeg";

export const products = [
  {
    id: 1,
    name: "Noir Oversized Jacket",
    category: "JACKETS",
    price: 2499,
    image: jacketImg,
    isNew: true,
  },
  {
    id: 2,
    name: "Sculpt Runner",
    category: "FOOTWEAR",
    price: 3499,
    image: shoesImg,
    isNew: true,
  },
  {
    id: 3,
    name: "Luna Shoulder Bag",
    category: "BAGS",
    price: 2999,
    image: bagImg,
  },
  {
    id: 4,
    name: "Essential Knit",
    category: "KNITWEAR",
    price: 1999,
    image: knitImg,
  },
];