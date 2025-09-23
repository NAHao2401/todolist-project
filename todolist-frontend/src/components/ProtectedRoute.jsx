import { Navigate } from "react-router-dom"; //Dùng để chuyển hướng người dùng đến một đường dẫn khác

export default function ProtectedRoute({ children }) {
  //children: Các component được bọc bên trong ProtectedRoute
  const token = localStorage.getItem("access");
  if (!token) return <Navigate to="/login" replace />; //thuộc tính replace = thay thế entry hiện tại trong history thay vì thêm mới(Không thể Back quay lại trang cũ).
  return children;
}
