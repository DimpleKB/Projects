import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setconfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Signup successful! You can now log in.");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="frm">
        <p>Username</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {/* <br /> */}
        <p>Password</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* <br /> */}
        <p>Confirm Password</p>
        <input
          type="password"
          placeholder="confirm"
          value={confirm}
          onChange={(e) => setconfirm(e.target.value)}
          required
        />
        <button className="submit" type="submit">Signin</button>
        <p>Have an account ?<Link to="/login">Signin</Link></p>
      </form>
    </div>
  );
}

export default Signup;
