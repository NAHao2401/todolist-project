import { useState } from "react";
import { useRegisterMutation } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [register, { isLoading }] = useRegisterMutation();
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register({ useState, password, email }).unwrap();
      navigate("/login");
    } catch {
      alert("Đăng ký thất bại. Kiểm tra dữ liệu.");
    }
  }
  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
      />
      <button disabled={isLoading} type="submit">
        Register
      </button>
    </form>
  );
}
