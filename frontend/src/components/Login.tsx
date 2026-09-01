import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // ========================================
    // VALIDATION
    // ========================================

    if (!email || !password) {
      alert(
        "Please enter email and password"
      );

      return;
    }

    try {
      setLoading(true);

      // ======================================
      // LOGIN API
      // ======================================

      const response =
        await axios.post(
          "https://lumora-dtb4.onrender.com/api/login",
          {
            email,
            password,
          }
        );

      // ======================================
      // GET TOKEN
      // ======================================

      const { token } =
        response.data;

      // ======================================
      // SAVE TOKEN
      // ======================================

      localStorage.setItem(
        "lumora-token",
        token
      );

      // ======================================
      // TELL NAVBAR LOGIN HAPPENED
      // ======================================

      window.dispatchEvent(
        new CustomEvent(
          "lumora-auth-changed",
          {
            detail: {
              message:
                "Logged in successfully",
            },
          }
        )
      );

      // ======================================
      // GO TO HOME
      // ======================================

      navigate("/");

    } catch (error: any) {

      console.error(
        "Login error:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Unable to login"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="login-page">

      <div className="login-container">

        {/* ==================================
            HEADER
        ================================== */}

        <p className="login-label">
          WELCOME BACK
        </p>

        <h1>
          Login to Lumora
        </h1>

        <p className="login-description">
          Sign in to access your account
          and continue shopping.
        </p>


        {/* ==================================
            LOGIN FORM
        ================================== */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <div className="login-field">

            <label htmlFor="email">
              EMAIL
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

          </div>


          {/* PASSWORD */}

          <div className="login-field">

            <label htmlFor="password">
              PASSWORD
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "LOGGING IN..."
              : "LOGIN"}
          </button>

        </form>


        {/* ==================================
            REGISTER
        ================================== */}

        <p className="register-text">

          Don't have an account?{" "}

          <Link to="/register">
            CREATE ACCOUNT
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Login;