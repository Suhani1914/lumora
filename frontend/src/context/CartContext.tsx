import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import axios from "axios";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isNew?: boolean;
};

export type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];

  cartCount: number;

  addToCart: (
    product: Product,
    size: string
  ) => Promise<boolean>;

  removeFromCart: (
    productId: number,
    size: string
  ) => Promise<void>;

  updateQuantity: (
    productId: number,
    size: string,
    quantity: number
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  refreshCart: () => Promise<void>;
};

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem(
      "lumora-token"
    );
  };

  // =====================================================
  // FETCH CART FROM BACKEND
  // =====================================================

  const refreshCart = async () => {
    const token = getToken();

    // User is not logged in
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(
        response.data.items || []
      );
    } catch (error: any) {
      console.error(
        "Fetch cart error:",
        error
      );

      // Token is invalid/expired
      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "lumora-token"
        );

        setCartItems([]);

        window.dispatchEvent(
          new CustomEvent(
            "lumora-auth-changed"
          )
        );
      }
    }
  };

  // =====================================================
  // LOAD CART + LISTEN FOR LOGIN/LOGOUT
  // =====================================================

  useEffect(() => {
    // Load cart when application starts
    refreshCart();

    // IMPORTANT:
    // This works in the SAME browser tab.
    // Your previous "storage" event alone
    // was not enough for login/logout.

    const handleAuthChanged = () => {
      refreshCart();
    };

    window.addEventListener(
      "lumora-auth-changed",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "lumora-auth-changed",
        handleAuthChanged
      );
    };
  }, []);

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (
    product: Product,
    size: string
  ): Promise<boolean> => {
    const token = getToken();

    if (!token) {
      return false;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: product.id,
          size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get latest cart from MongoDB
      await refreshCart();

      return true;
    } catch (error: any) {
      console.error(
        "Add to cart error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "lumora-token"
        );

        setCartItems([]);

        window.dispatchEvent(
          new CustomEvent(
            "lumora-auth-changed"
          )
        );
      }

      return false;
    }
  };

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeFromCart = async (
    productId: number,
    size: string
  ) => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/cart/${productId}/${encodeURIComponent(
          size
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get updated cart
      await refreshCart();
    } catch (error) {
      console.error(
        "Remove from cart error:",
        error
      );
    }
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const updateQuantity = async (
    productId: number,
    size: string,
    quantity: number
  ) => {
    const token = getToken();

    if (!token || quantity < 1) {
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/cart/${productId}/${encodeURIComponent(
          size
        )}`,
        {
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get updated cart
      await refreshCart();
    } catch (error) {
      console.error(
        "Update quantity error:",
        error
      );
    }
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = async () => {
    const token = getToken();

    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      await axios.delete(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems([]);
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );
    }
  };

  // =====================================================
  // CART COUNT
  // =====================================================

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}