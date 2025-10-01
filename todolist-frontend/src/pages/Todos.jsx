import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../lib/storage";
import { todosApi } from "../api/todosApi";
import { authApi } from "../api/authApi";
import "./Todos.css";
import { useChangePasswordMutation } from "../api/authApi";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "../api/todosApi";

export default function Todos() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useGetTodosQuery(page);
  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [filter, setFilter] = useState("all");

  const [showSetting, setShowSetting] = useState(false);

  const [showChangePass, setShowChangePass] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword] = useChangePasswordMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleLogout() {
    clearTokens();
    // reset toàn bộ cache của RTK Query
    dispatch(todosApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());
    navigate("/login", { replace: true });
  }

  if (isLoading) return <p> Dang tải...</p>;
  if (error) return <p>Có lỗi khi tải dữ liệu</p>;

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return; //.trim() loại bỏ khoảng trắng ở đầu và cuối chuỗi. Điều kiện rỗng -> điều kiện đúng
    await addTodo({ title, description, is_completed: false });
    setTitle("");
    setDescription("");
  }

  async function toggle(todo) {
    await updateTodo({ id: todo.id, is_completed: !todo.is_completed });
  }

  async function remove(id) {
    await deleteTodo(id);
  }

  const results = data?.results ?? [];

  //Trả về dữ liệu phân trang nên trong format trả về sẽ có: previous và next để xác định url trước và sau
  const hasPrev = Boolean(data?.previous);
  const hasNext = Boolean(data?.next);

  const token = localStorage.getItem("access");
  let decoded = null;

  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  let filteredResults = results;
  if (filter === "done") {
    filteredResults = results.filter((t) => t.is_completed);
  } else if (filter === "pending") {
    filteredResults = results.filter((t) => !t.is_completed);
  }

  return (
    <div className="todos-container">
      <header className="header">
        <p className="user-info">User: {decoded?.username ?? "Guest"}</p>
        <button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Close" : "Add To Do"}
        </button>
        <div className="header-right">
          <div className="settings-container">
            <button onClick={() => setShowSetting((prev) => !prev)}>
              Setting
            </button>
            {showSetting && (
              <div className="settings-panel">
                <button onClick={() => setShowChangePass(true)}>
                  Đổi mật khẩu
                </button>
              </div>
            )}
          </div>

          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="main">
        <div className={`form-wrapper ${showForm ? "" : "hidden"}`}>
          <form onSubmit={handleAdd} className="todo-form">
            <div className="form-group">
              <label>Title:</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập công việc..."
                className="todo-input"
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả chi tiết..."
                className="todo-textarea"
                rows={4}
              />
            </div>

            <button type="submit">Thêm</button>
          </form>
        </div>

        <div className="content-wrapper">
          <h1 className="title">Todo List</h1>

          <div className="list-section">
            <ul className="todo-list">
              {filteredResults.length === 0 ? (
                <li className="todo-empty">Bạn chưa có công việc nào 📋</li>
              ) : (
                filteredResults.map((t) => (
                  <React.Fragment key={t.id}>
                    <li
                      className={`todo-item ${
                        t.id === selectedId ? "active" : ""
                      }`}
                      onClick={() =>
                        setSelectedId(t.id === selectedId ? null : t.id)
                      }
                    >
                      {editingId === t.id ? (
                        <div className="edit-form">
                          <label>Title:</label>
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Nhập công việc mới..."
                          />
                          <label>Description:</label>
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Nhập mô tả chi tiết mới..."
                          />
                          <div className="edit-actions">
                            <button
                              onClick={async () => {
                                await updateTodo({
                                  id: t.id,
                                  title: editTitle,
                                  description: editDescription,
                                });
                                setEditingId(null);
                              }}
                            >
                              Save
                            </button>
                            <button onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span
                          className={t.is_completed ? "todo-completed" : ""}
                        >
                          {t.title}
                        </span>
                      )}
                    </li>

                    {selectedId === t.id && editingId !== t.id && (
                      <div className="todo-extra">
                        <span className="todo-description">
                          {t.description || "Chưa có mô tả"}
                        </span>
                        <div className="todo-actions">
                          <button onClick={() => toggle(t)}>
                            {t.is_completed ? "Unfinish" : "Finish"}
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(t.id);
                              setEditTitle(t.title);
                              setEditDescription(t.description);
                            }}
                          >
                            Update
                          </button>
                          <button onClick={() => remove(t.id)}>Delete</button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))
              )}
            </ul>
            {filteredResults.length > 0 && (
              <div className="filters">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All Tasks
                </button>
                <button
                  className={filter === "pending" ? "active" : ""}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </button>
                <button
                  className={filter === "done" ? "active" : ""}
                  onClick={() => setFilter("done")}
                >
                  Done
                </button>
              </div>
            )}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!hasPrev || isFetching}
            >
              ← Trang trước
            </button>
            <span>Trang {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext || isFetching}
            >
              Trang sau →
            </button>
          </div>
        </div>

        {showChangePass && (
          <div className="modal">
            <div className="modal-content">
              <h2>Đổi mật khẩu</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPass !== confirmPass) {
                    alert("Mật khẩu xác nhận không khớp!");
                    return;
                  }
                  try {
                    await changePassword({ oldPass, newPass }).unwrap();
                    alert("Đổi mật khẩu thành công!");
                    setShowChangePass(false);
                    setOldPass("");
                    setNewPass("");
                    setConfirmPass("");
                  } catch {
                    alert("Đổi mật khẩu thất bại. Kiểm tra lại.");
                  }
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu cũ"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu mới"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />

                {/* Checkbox show/hide password */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.9rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                  />
                  Hiển thị mật khẩu
                </label>

                <div style={{ marginTop: "12px" }}>
                  <button type="submit">Xác nhận</button>
                  <button
                    type="button"
                    onClick={() => setShowChangePass(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
