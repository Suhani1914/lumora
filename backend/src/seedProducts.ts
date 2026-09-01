import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./Product";

dotenv.config();

const products = [
    // =========================
    // JACKETS - 6 PRODUCTS
    // =========================

    {
        id: 1,
        name: "Noir Oversized Jacket",
        category: "JACKETS",
        price: 2499,
        image: "/src/assets/products/01_women_minimal_bomber.jpg",
        isNew: true,
    },
    {
        id: 5,
        name: "Urban Cropped Jacket",
        category: "JACKETS",
        price: 2799,
        image: "/src/assets/products/02_women_wool_collar.jpg",
        isNew: true,
    },
    {
        id: 6,
        name: "Studio Bomber",
        category: "JACKETS",
        price: 3199,
        image: "/src/assets/products/03_women_cropped_zip.jpg",
        isNew: false,
    },
    {
        id: 13,
        name: "Structured Wool Jacket",
        category: "JACKETS",
        price: 3999,
        image: "/src/assets/products/04_men_classic_bomber.jpg",
        isNew: true,
    },
    {
        id: 14,
        name: "Relaxed Utility Jacket",
        category: "JACKETS",
        price: 3499,
        image: "/src/assets/products/05_men_wool_overshirt.jpg",
        isNew: false,
    },
    {
        id: 15,
        name: "Classic Denim Jacket",
        category: "JACKETS",
        price: 2999,
        image: "/src/assets/products/06_men_suede_zip.jpg",
        isNew: false,
    },

    // =========================
    // FOOTWEAR - 6 PRODUCTS
    // =========================

    {
        id: 2,
        name: "Sculpt Runner",
        category: "FOOTWEAR",
        price: 3499,
        image: "/src/assets/products/footwear_women_01_classic_white_sneakers.png",
        isNew: true,
    },
    {
        id: 7,
        name: "Minimal Court Sneaker",
        category: "FOOTWEAR",
        price: 2999,
        image: "/src/assets/products/footwear_women_02_suede_loafers.png",
        isNew: true,
    },
    {
        id: 8,
        name: "Street Low-Top",
        category: "FOOTWEAR",
        price: 2699,
        image: "/src/assets/products/footwear_women_03_leather_runners.png",
        isNew: false,
    },
    {
        id: 16,
        name: "Everyday Trainer",
        category: "FOOTWEAR",
        price: 3299,
        image: "/src/assets/products/footwear_men_01_classic_black_sneakers.png",
        isNew: false,
    },
    {
        id: 17,
        name: "Urban Slip-On",
        category: "FOOTWEAR",
        price: 2499,
        image: "/src/assets/products/footwear_men_02_chelsea_boots.png",
        isNew: true,
    },
    {
        id: 18,
        name: "Essential Court Shoe",
        category: "FOOTWEAR",
        price: 3099,
        image: "/src/assets/products/footwear_men_03_chunky_trail_sneakers.png",
        isNew: false,
    },

    // =========================
    // BAGS - 6 PRODUCTS
    // =========================

    {
        id: 3,
        name: "Luna Shoulder Bag",
        category: "BAGS",
        price: 2999,
        image: "/src/assets/products/bags_women_01_classic_tote.png",
        isNew: false,
    },
    {
        id: 9,
        name: "Mono Tote",
        category: "BAGS",
        price: 2499,
        image: "/src/assets/products/bags_women_02_minimal_shoulder_bag.png",
        isNew: false,
    },
    {
        id: 10,
        name: "Mini Crossbody",
        category: "BAGS",
        price: 2199,
        image: "/src/assets/products/bags_women_03_quilted_crossbody.png",
        isNew: true,
    },
    {
        id: 19,
        name: "Everyday Shoulder Bag",
        category: "BAGS",
        price: 2799,
        image: "/src/assets/products/bags_men_01_classic_backpack.png",
        isNew: true,
    },
    {
        id: 20,
        name: "Structured Mini Bag",
        category: "BAGS",
        price: 2599,
        image: "/src/assets/products/bags_men_02_leather_weekend_bag.png",
        isNew: false,
    },
    {
        id: 21,
        name: "Minimal Carryall",
        category: "BAGS",
        price: 3199,
        image: "/src/assets/products/bags_men_03_messenger_bag.png",
        isNew: false,
    },

    // =========================
    // KNITWEAR - 6 PRODUCTS
    // =========================

    {
        id: 4,
        name: "Essential Knit",
        category: "KNITWEAR",
        price: 1999,
        image: "/src/assets/products/knitwear_women_01_ribbed_crewneck_sweater.png",
        isNew: false,
    },
    {
        id: 11,
        name: "Soft Ribbed Sweater",
        category: "KNITWEAR",
        price: 2299,
        image: "/src/assets/products/knitwear_women_02_v_neck_knit_sweater.png",
        isNew: true,
    },
    {
        id: 12,
        name: "Oversized Knit Cardigan",
        category: "KNITWEAR",
        price: 2899,
        image: "/src/assets/products/knitwear_women_03_cropped_knit_cardigan.png",
        isNew: false,
    },
    {
        id: 22,
        name: "Relaxed Crew Knit",
        category: "KNITWEAR",
        price: 2399,
        image: "/src/assets/products/knitwear_men_01_waffle_knit_sweater.png",
        isNew: true,
    },
    {
        id: 23,
        name: "Soft Everyday Cardigan",
        category: "KNITWEAR",
        price: 2699,
        image: "/src/assets/products/knitwear_men_02_half_zip_knit_sweater.png",
        isNew: false,
    },
    {
        id: 24,
        name: "Minimal Textured Knit",
        category: "KNITWEAR",
        price: 2499,
        image: "/src/assets/products/knitwear_men_03_turtleneck_knit_sweater.png",
        isNew: false,
    },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);

        console.log("MongoDB connected");

        for (const product of products) {
            await Product.updateOne(
                { id: product.id },
                { $set: product },
                { upsert: true }
            );
        }

        console.log("24 products added successfully");

        await mongoose.disconnect();

        console.log("MongoDB disconnected");
    } catch (error) {
        console.error("Error adding products:", error);
        process.exit(1);
    }
};

seedProducts();