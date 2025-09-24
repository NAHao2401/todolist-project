import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; //BrowserRouter: quản lý lịch sử và điều hướng
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";
import { clearTokens } from "./lib/storage";
import "./App.css";

export default function App() {
  const authed = !!localStorage.getItem("access");

  return (
    <BrowserRouter>
      <div className="auth-container">
        <div className="auth-left">
          <div className="form-wrapper">
            <nav className="auth-nav">
              {authed ? (
                <>
                  <Link to="/todos">Todos</Link>
                  <button
                    onClick={() => {
                      clearTokens();
                      location.href = "/login";
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </nav>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/todos"
                element={
                  <ProtectedRoute>
                    <Todos />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
        <div className="auth-right">
          <img src="bg1.png" alt="background" />
        </div>
      </div>
    </BrowserRouter>
  );
}
