import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "./Todos.css";
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

  if (isLoading) return <p> Dang tải...</p>;
  if (error) return <p>Có lỗi khi tải dữ liệu</p>;

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return; //.trim() loại bỏ khoảng trắng ở đầu và cuối chuỗi. Điều kiện rỗng -> điều kiện đúng
    await addTodo({ title, description: "", is_completed: false });
    setTitle("");
  }

  async function toggle(todo) {
    await updateTodo({ id: todo.id, is_completed: !todo.is_completed });
  }

  async function remove(id) {
    await deleteTodo(id);
  }

  const results = data?.results ?? [];
  console.log(results);
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

  return (
    <div className="todos-container">
      <header className="header">
        <p className="user-info">User: {decoded?.username ?? "Guest"}</p>
        <button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Close" : "Add To Do"}
        </button>
        <Link className="logout" to="/login">
          Logout
        </Link>
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
              {results.map((t) => (
                <React.Fragment key={t.id}>
                  <li
                    className={`todo-item ${
                      t.id === selectedId ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelectedId(t.id === selectedId ? null : t.id)
                    }
                  >
                    <span className={t.is_completed ? "todo-completed" : ""}>
                      {t.title}
                    </span>
                  </li>
                  {selectedId === t.id && (
                    <div className="todo-extra">
                      <span className="todo-description">
                        {t.description || "Chưa có mô tả"}
                      </span>
                      <div className="todo-actions">
                        <button onClick={() => toggle(t)}>
                          {t.is_completed ? "Unfinish" : "Finish"}
                        </button>
                        <button onClick={() => alert("Update form ở đây")}>
                          Update
                        </button>
                        <button onClick={() => remove(t.id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </ul>

            <div className="filters">
              <button onClick={() => setFilter("")}>All Tasks</button>
              <button onClick={() => setFilter("")}>Done</button>
              <button onClick={() => setFilter("")}>Pending</button>
            </div>
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
      </main>
    </div>
  );
}
