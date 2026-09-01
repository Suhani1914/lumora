import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Shop from "./components/Shop";
import Orders from "./components/Orders";
import Cart from "./components/Cart";
import Collections from "./components/Collections";
import CollectionsCategory from "./components/CollectionsCategory";
import ProductDetails from "./components/ProductDetails";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import Login from "./components/Login";
import Register from "./components/Register";
import About from "./components/About";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Shop />}
        />


        {/* ================= SHOP ================= */}

        <Route
          path="/shop"
          element={<Shop />}
        />


        {/* ================= ORDERS ================= */}

        <Route
          path="/orders"
          element={<Orders />}
        />


        {/* ================= COLLECTIONS ================= */}

        {/* Main Collections Page */}
        <Route
          path="/collections"
          element={<Collections />}
        />

        {/* Individual Collection Page */}
        <Route
          path="/collections/:category"
          element={<CollectionsCategory />}
        />


        {/* ================= PRODUCT DETAILS ================= */}

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />


        {/* ================= CART ================= */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* ================= CHECKOUT ================= */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* ================= ORDER SUCCESS ================= */}

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route
          path="/about"
          element={<About />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;