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
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Todo List</h1>

      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập công việc..."
          style={{ width: "75%", marginRight: 8 }}
        />
        <button type="submit">Thêm</button>
      </form>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {results.map((t) => (
          <li
            key={t.id}
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <span
              onClick={() => toggle(t)}
              style={{
                flex: 1,
                cursor: "pointer",
                textDecoration: t.is_completed ? "line-through" : "none",
              }}
              title="Click để toggle trạng thái"
            >
              {t.title}
            </span>
            <button onClick={() => remove(t.id)} style={{ marginLeft: 8 }}>
              Xóa
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={!hasPrev || isFetching}
        >
          ← Trang trước
        </button>
        <span style={{ margin: "0 12px" }}>Trang {page}</span>
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
