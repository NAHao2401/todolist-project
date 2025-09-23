import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, clearTokens } from "../lib/storage";

export const authApi = createApi({
  reducerPath: "authApi", //tên nhánh trong Redux store để RTK Query biết dữ liệu auth sẽ lưu ở đâu
  baseQuery: fetchBaseQuery({
    // Mọi endpoint trong authApi sẽ gọi API dựa trên baseUrl này
    baseUrl: import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api/",
  }),
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
  }),
});

export const { useLoginMutation } = authApi;
