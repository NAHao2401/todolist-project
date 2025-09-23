import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../lib/baseQuery";

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Todo"], //Định nghĩa "nhãn" (tags) cho cache. RTK Query dùng tags này để biết khi nào cần làm mới dữ liệu
  endpoints: (builder) => ({
    getTodos: builder.query({
      //Hỗ trợ phân trang: query nhận page (mặc định 1)
      query: (page = 1) => `todos/?page=${page}`,
      //providesTags gắn nhãn cache cho dữ liệu query
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: "Todo", id })),
              { type: "Todo", id: "LIST" },
            ]
          : [{ type: "Todo", id: "LIST" }],
    }),
    addTodo: builder.mutation({
      query: (newTodo) => ({
        url: "todos/",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: [{ type: "Todo", id: "LIST" }], //Thông báo cho RTK Query biết cache nào đã lỗi thời và cần làm mới
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...patch }) => ({
        // ...patch gom toàn bộ thuộc tính còn lại (ngoài id) thành object để gửi lên server làm body của request
        url: `todos/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "Todo", id }],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `todos/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (r, e, id) => [
        { type: "Todo", id },
        { type: "Todo", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
