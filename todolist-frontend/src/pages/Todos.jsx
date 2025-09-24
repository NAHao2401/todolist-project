import { useState } from "react";
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
  //Trả về dữ liệu phân trang nên trong format trả về sẽ có: previous và next để xác định url trước và sau
  const hasPrev = Boolean(data?.previous);
  const hasNext = Boolean(data?.next);

  return (
    <div className="todos-container">
      <h1>Todo List</h1>

      <form onSubmit={handleAdd} className="todo-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập công việc..."
          className="todo-input"
        />
        <button type="submit">Thêm</button>
      </form>

      <ul className="todo-list">
        {results.map((t) => (
          <li key={t.id} className="todo-item">
            <span
              onClick={() => toggle(t)}
              className={t.is_completed ? "todo-completed" : ""}
            >
              {t.title}
            </span>
            <button onClick={() => remove(t.id)}>Xóa</button>
          </li>
        ))}
      </ul>

      <div>
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
  );
}
