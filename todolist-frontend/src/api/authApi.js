import { createApi } from "@reduxjs/toolkit/query/react";
import { setTokens, clearTokens } from "../lib/storage";
import baseQueryWithReauth from "../lib/baseQuery";

export const authApi = createApi({
  reducerPath: "authApi", //tên nhánh trong Redux store để RTK Query biết dữ liệu auth sẽ lưu ở đâu
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      //builder.mutation: dùng chô các hành động thay đổi dữ liệu (POST/PUT/DELETE). login là dạng mutation
      query: ({ username, password }) => ({
        url: "token/",
        method: "POST",
        body: { username, password },
      }),
      //onQueryStarted là lifecycle callback chạy khi mutation được gọi
      async onQueryStarted(arg, { queryFulfilled }) {
        //queryFulfilled là Promise của request API.
        try {
          const { data } = await queryFulfilled; //đợi API trả về {data} hoặc ném lỗi {error}
          setTokens(data.access, data.refresh);
        } catch (e) {
          clearTokens();
          throw e;
        }
      },
    }),
    register: builder.mutation({
      query: ({ username, password, email }) => ({
        url: "register/",
        method: "POST",
        body: { username, password, email },
      }),
    }),
    changePassword: builder.mutation({
      query: ({ oldPass, newPass }) => ({
        url: "change-password/",
        method: "POST",
        body: { old_password: oldPass, new_password: newPass },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation,
} = authApi;
