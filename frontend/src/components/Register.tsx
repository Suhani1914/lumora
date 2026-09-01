import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // ==============================
      // REGISTER USER
      // ==============================

      const registerResponse = await axios.post(
        "http://localhost:5000/api/register",
        {
          name,
          email,
          password,
        }
      );

      // ==============================
      // GET TOKEN
      // ==============================

      let token = registerResponse.data.token;

      // If register API does not return token,
      // login automatically after registration.
      if (!token) {
        const loginResponse = await axios.post(
          "http://localhost:5000/api/login",
          {
            email,
            password,
          }
        );

        token = loginResponse.data.token;
      }

      // ==============================
      // SAVE TOKEN
      // ==============================

      localStorage.setItem(
        "lumora-token",
        token
      );

      // Tell other components that auth changed
      window.dispatchEvent(
        new Event("lumora-auth-changed")
      );

      alert("Registration successful");

      // ==============================
      // GO TO HOME
      // ==============================

      navigate("/");
    } catch (error: any) {
      console.error(
        "Registration error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to register"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <div className="register-container">

        <p className="register-label">
          JOIN LUMORA
        </p>

        <h1>
          Create an account
        </h1>

        <p className="register-description">
          Create your Lumora account to save your
          details and manage your orders.
        </p>

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          <div className="register-field">

            <label htmlFor="name">
              NAME
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          <div className="register-field">

            <label htmlFor="email">
              EMAIL
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="register-field">

            <label htmlFor="password">
              PASSWORD
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "CREATING ACCOUNT..."
              : "CREATE ACCOUNT"}
          </button>

        </form>

        <p className="login-text">
          Already have an account?
          {" "}

          <Link to="/login">
            LOGIN
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Register;