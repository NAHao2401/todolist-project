import { configureStore } from "@reduxjs/toolkit"; //hàm của Redux Toolkit để tạo store
import { authApi } from "./api/authApi";
import { todosApi } from "./api/todosApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(authApi.middleware, todosApi.middleware), //getDefault(): Trả về middleware mặc định cùa Redux Toolkit + nối thêm middleware của RTK Query
});
