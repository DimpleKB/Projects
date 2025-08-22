import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Login successful!");
        navigate("/dashboard"); // 👈 FRONTEND handles navigation
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
    <form className="frm" onSubmit={handleSubmit}>
      <p>Username</p>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <p>Password</p>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="submit" type="submit">Login</button>
      <p>Don't have an account? <Link to="/signup">Signup</Link></p>
    </form>
    </div>
  );
}

export default Login;
