import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; //BrowserRouter: quản lý lịch sử và điều hướng
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Todos from "./pages/Todos";
import { clearTokens } from "./lib/storage";

export default function App() {
  const authed = !!localStorage.getItem("access");

  return (
    <BrowserRouter>
      <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/" style={{ marginRight: 12 }}>
          Todos
        </Link>
        {authed ? (
          <button
            onClick={() => {
              clearTokens();
              location.href = "/login";
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Todos />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
