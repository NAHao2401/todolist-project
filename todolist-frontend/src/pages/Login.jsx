import { useState } from "react";
import { useLoginMutation } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login({ username, password }).unwrap(); //.unwrap(): Lấy kết quả hoặc throw error(dễ dùng với try/catch).
      navigate("/", { replace: true }); //thành công thì sẽ được người dùng về trang "/" và thay lịch sử hiện tại(Không cho Back quay lại trang login nữa)
    } catch {
      alert("Đăng nhập thất bại. Kiểm tra username/pasword.");
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
      />
      {/*disabled: sẽ bị mờ đi và không click được. isLoading: true khi mutation login đang chạy(đang gửi request API) và false khi request hoàn thành hoặc chưa gọi*/}
      <button disabled={isLoading} type="submit">
        Login
      </button>
    </form>
  );
}
