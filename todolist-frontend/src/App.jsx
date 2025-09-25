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
    </BrowserRouter>
  );
}
