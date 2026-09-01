import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("lumora-token", data.token);
      localStorage.setItem(
        "lumora-user",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server");
    }
  };

  return (
    <section>
      <h1>Welcome Back</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          LOGIN
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          CREATE ACCOUNT
        </Link>
      </p>
    </section>
  );
}

export default Login;