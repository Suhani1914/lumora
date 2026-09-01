import {
  useState,
  useEffect,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";

import "./Navbar.css";

function Navbar() {
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      !!localStorage.getItem("lumora-token")
    );

  const [authMessage, setAuthMessage] =
    useState(
      localStorage.getItem(
        "lumora-auth-message"
      ) || ""
    );


  // ==========================================
  // CHECK LOGIN / LOGOUT STATUS
  // ==========================================

  useEffect(() => {
    const handleAuthChanged = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<{
          message?: string;
        }>;

      const token =
        localStorage.getItem(
          "lumora-token"
        );

      setIsLoggedIn(!!token);

      // Show message
      if (customEvent.detail?.message) {
        setAuthMessage(
          customEvent.detail.message
        );

        localStorage.setItem(
          "lumora-auth-message",
          customEvent.detail.message
        );
      }
    };

    // Check login status when Navbar loads
    setIsLoggedIn(
      !!localStorage.getItem(
        "lumora-token"
      )
    );

    // Listen for login/logout
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


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    // Remove login token
    localStorage.removeItem(
      "lumora-token"
    );

    // Save logout message
    localStorage.setItem(
      "lumora-auth-message",
      "Logged out successfully"
    );

    // Update Navbar
    window.dispatchEvent(
      new CustomEvent(
        "lumora-auth-changed",
        {
          detail: {
            message:
              "Logged out successfully",
          },
        }
      )
    );

    // Go to login page
    navigate("/login");
  };


  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      return;
    }

    navigate(
      `/shop?search=${encodeURIComponent(
        query
      )}`
    );

    setSearchOpen(false);
    setSearch("");
  };


  // ==========================================
  // CLOSE AUTH MESSAGE
  // ==========================================

  const closeAuthMessage = () => {
    setAuthMessage("");

    localStorage.removeItem(
      "lumora-auth-message"
    );
  };


  return (
    <>
      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="navbar">

        {/* LOGO */}

        <Link
          to="/"
          className="logo"
        >
          LUMORA
        </Link>


        {/* NAVIGATION LINKS */}

        <div className="nav-links">

          <Link to="/shop">
            Shop
          </Link>

          <Link to="/orders">
            My Orders
          </Link>

          <Link to="/collections">
            Collections
          </Link>

          <Link to="/about">
            About
          </Link>

        </div>


        {/* RIGHT SIDE */}

        <div className="nav-actions">

          {/* SEARCH */}

          {searchOpen ? (

            <form
              className="search-form"
              onSubmit={handleSearch}
            >

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                autoFocus
              />

              <button type="submit">
                GO
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearch("");
                }}
              >
                ×
              </button>

            </form>

          ) : (

            <button
              type="button"
              className="search-button"
              onClick={() =>
                setSearchOpen(true)
              }
            >
              Search
            </button>

          )}


          {/* LOGIN / LOGOUT */}

          {isLoggedIn ? (

            <button
              type="button"
              className="auth-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          ) : (

            <Link
              to="/login"
              className="auth-link"
            >
              Login
            </Link>

          )}


          {/* BAG */}

          <Link
            to="/cart"
            className="bag-link"
          >
            Bag{" "}
            {cartCount > 0
              ? `(${cartCount})`
              : ""}
          </Link>

        </div>

      </nav>


      {/* ======================================
          AUTH SUCCESS MESSAGE
      ====================================== */}

      {authMessage && (

        <div className="auth-toast">

          <div className="auth-toast-icon">
            ✓
          </div>

          <span>
            {authMessage}
          </span>

          <button
            className="auth-toast-close"
            onClick={closeAuthMessage}
          >
            ×
          </button>

        </div>

      )}

    </>
  );
}

export default Navbar;