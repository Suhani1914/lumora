import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./Product";
import bcrypt from "bcryptjs";
import User from "./User";
import jwt from "jsonwebtoken";
import Cart from "./Cart";
import Order from "./Order";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authenticateUser = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {
            userId: string;
            email: string;
        };

        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
    res.send("Lumora backend is running!");
});


// =====================================================
// GET ALL PRODUCTS
// =====================================================

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);
    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            message: "Failed to fetch products",
        });
    }
});


// =====================================================
// ADD 8 NEW PRODUCTS
// =====================================================
// This is a temporary route.
// We will remove it after the products are added.
// =====================================================

app.post("/api/products/seed-new", async (req, res) => {
    try {
        const newProducts = [
            {
                id: 5,
                name: "Mini Crossbody",
                category: "BAGS",
                price: 2499,
                image: "/products/mini-crossbody.png",
                isNew: true,
            },

            {
                id: 6,
                name: "Minimal Court Sneaker",
                category: "FOOTWEAR",
                price: 3299,
                image: "/products/minimal-court-sneaker.png",
                isNew: true,
            },

            {
                id: 7,
                name: "Mono Tote",
                category: "BAGS",
                price: 2799,
                image: "/products/mono-tote.png",
                isNew: false,
            },

            {
                id: 8,
                name: "Oversized Knit Cardigan",
                category: "KNITWEAR",
                price: 2999,
                image: "/products/oversized-knit-cardigan.png",
                isNew: true,
            },

            {
                id: 9,
                name: "Soft Ribbed Sweater",
                category: "KNITWEAR",
                price: 2199,
                image: "/products/soft-ribbed-sweater.png",
                isNew: false,
            },

            {
                id: 10,
                name: "Street Low Top",
                category: "FOOTWEAR",
                price: 2999,
                image: "/products/street-low-top.png",
                isNew: false,
            },

            {
                id: 11,
                name: "Studio Bomber",
                category: "JACKETS",
                price: 3499,
                image: "/products/studio-bomber.png",
                isNew: true,
            },

            {
                id: 12,
                name: "Urban Cropped Jacket",
                category: "JACKETS",
                price: 2799,
                image: "/products/urban-cropped-jacket.png",
                isNew: false,
            },
        ];

        for (const product of newProducts) {
            await Product.findOneAndUpdate(
                { id: product.id },
                product,
                {
                    upsert: true,
                    new: true,
                }
            );
        }

        res.json({
            message: "8 new products added successfully",
        });
    } catch (error) {
        console.error("Seed products error:", error);

        res.status(500).json({
            message: "Failed to add products",
        });
    }
});


// =====================================================
// REGISTER
// =====================================================

app.post("/api/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Registration failed",
        });
    }
});


// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1d",
            }
        );

        res.json({
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed",
        });
    }
});


// =====================================================
// GET CART
// =====================================================

app.get(
    "/api/cart",
    authenticateUser,
    async (req: any, res) => {
        try {
            const cart = await Cart.findOne({
                userId: req.userId,
            });

            if (!cart) {
                return res.json({
                    items: [],
                });
            }

            const items = await Promise.all(
                cart.items.map(async (item) => {
                    const product =
                        await Product.findOne({
                            id: item.productId,
                        });

                    return {
                        product,
                        size: item.size,
                        quantity: item.quantity,
                    };
                })
            );

            res.json({
                items,
            });
        } catch (error) {
            console.error("Cart error:", error);

            res.status(500).json({
                message: "Failed to fetch cart",
            });
        }
    }
);


// =====================================================
// ADD TO CART
// =====================================================

app.post(
    "/api/cart",
    authenticateUser,
    async (req: any, res) => {
        try {
            const {
                productId,
                size,
            } = req.body;

            if (!productId || !size) {
                return res.status(400).json({
                    message:
                        "Product and size are required",
                });
            }

            let cart = await Cart.findOne({
                userId: req.userId,
            });

            if (!cart) {
                cart = await Cart.create({
                    userId: req.userId,
                    items: [],
                });
            }

            const existingItem =
                cart.items.find(
                    (item) =>
                        item.productId ===
                            Number(productId) &&
                        item.size === size
                );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({
                    productId: Number(productId),
                    size,
                    quantity: 1,
                });
            }

            await cart.save();

            res.json({
                message:
                    "Product added to cart",
            });
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to add product to cart",
            });
        }
    }
);


// =====================================================
// REMOVE FROM CART
// =====================================================

app.delete(
    "/api/cart/:productId/:size",
    authenticateUser,
    async (req: any, res) => {
        try {
            const {
                productId,
                size,
            } = req.params;

            const cart = await Cart.findOne({
                userId: req.userId,
            });

            if (!cart) {
                return res.status(404).json({
                    message: "Cart not found",
                });
            }

            const itemIndex =
                cart.items.findIndex(
                    (item) =>
                        item.productId ===
                            Number(productId) &&
                        item.size === size
                );

            if (itemIndex === -1) {
                return res.status(404).json({
                    message:
                        "Product not found in cart",
                });
            }

            cart.items.splice(itemIndex, 1);

            await cart.save();

            res.json({
                message:
                    "Product removed from cart",
            });
        } catch (error) {
            console.error(
                "Remove from cart error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to remove product from cart",
            });
        }
    }
);


// =====================================================
// UPDATE CART QUANTITY
// =====================================================

app.patch(
    "/api/cart/:productId/:size",
    authenticateUser,
    async (req: any, res) => {
        try {
            const {
                productId,
                size,
            } = req.params;

            const {
                quantity,
            } = req.body;

            if (quantity < 1) {
                return res.status(400).json({
                    message:
                        "Quantity must be at least 1",
                });
            }

            const cart = await Cart.findOne({
                userId: req.userId,
            });

            if (!cart) {
                return res.status(404).json({
                    message:
                        "Cart not found",
                });
            }

            const item = cart.items.find(
                (item) =>
                    item.productId ===
                        Number(productId) &&
                    item.size === size
            );

            if (!item) {
                return res.status(404).json({
                    message:
                        "Product not found in cart",
                });
            }

            item.quantity = quantity;

            await cart.save();

            res.json({
                message:
                    "Quantity updated successfully",
            });
        } catch (error) {
            console.error(
                "Update quantity error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update quantity",
            });
        }
    }
);


// =====================================================
// CLEAR CART
// =====================================================

app.delete(
    "/api/cart",
    authenticateUser,
    async (req: any, res) => {
        try {
            const cart = await Cart.findOne({
                userId: req.userId,
            });

            if (!cart) {
                return res.json({
                    message:
                        "Cart is already empty",
                });
            }

            cart.items.splice(
                0,
                cart.items.length
            );

            await cart.save();

            res.json({
                message:
                    "Cart cleared successfully",
            });
        } catch (error) {
            console.error(
                "Clear cart error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to clear cart",
            });
        }
    }
);


// =====================================================
// PLACE ORDER
// =====================================================

app.post(
    "/api/orders",
    authenticateUser,
    async (req: any, res) => {
        try {
            const cart = await Cart.findOne({
                userId: req.userId,
            });

            if (
                !cart ||
                cart.items.length === 0
            ) {
                return res.status(400).json({
                    message:
                        "Your cart is empty",
                });
            }

            const {
                name,
                email,
                phone,
                address,
                city,
                pincode,
                state,
            } = req.body;

            if (
                !name ||
                !email ||
                !phone ||
                !address ||
                !city ||
                !pincode ||
                !state
            ) {
                return res.status(400).json({
                    message:
                        "Shipping information is required",
                });
            }

            const orderItems =
                await Promise.all(
                    cart.items.map(
                        async (item) => {
                            const product =
                                await Product.findOne(
                                    {
                                        id: item.productId,
                                    }
                                );

                            if (!product) {
                                throw new Error(
                                    `Product ${item.productId} not found`
                                );
                            }

                            return {
                                productId:
                                    product.id,

                                name:
                                    product.name,

                                price:
                                    product.price,

                                image:
                                    product.image,

                                size:
                                    item.size,

                                quantity:
                                    item.quantity,
                            };
                        }
                    )
                );

            const total =
                orderItems.reduce(
                    (sum, item) =>
                        sum +
                        item.price *
                            item.quantity,
                    0
                );

            const order =
                await Order.create({
                    userId: req.userId,

                    items: orderItems,

                    shipping: {
                        name,
                        email,
                        phone,
                        address,
                        city,
                        pincode,
                        state,
                    },

                    total,

                    status: "Placed",
                });

            cart.items.splice(
                0,
                cart.items.length
            );

            await cart.save();

            res.status(201).json({
                message:
                    "Order placed successfully",

                order,
            });
        } catch (error) {
            console.error(
                "Place order error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to place order",
            });
        }
    }
);


// =====================================================
// GET ORDERS
// =====================================================

app.get(
    "/api/orders",
    authenticateUser,
    async (req: any, res) => {
        try {
            const orders =
                await Order.find({
                    userId: req.userId,
                }).sort({
                    createdAt: -1,
                });

            res.json(orders);
        } catch (error) {
            console.error(
                "Get orders error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch orders",
            });
        }
    }
);


// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        console.log(
            "MongoDB connected successfully"
        );

        app.listen(5000, () => {
            console.log(
                "Lumora backend running on port 5000"
            );
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error
        );
    });