import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./storage";

const rawBaseQuery = fetchBaseQuery({
  //fetchBaseQuery là một function helper được cung cấp bởi RTK Query, giúp đặt base URL mặc định, tự động gắn headers (ví dụ: Authorization)
  baseUrl: import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api/", // import.meta.env là cách chuẩn duy nhất mà Vite expose biến mối trường từ file .env.*
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) headers.set("Authorizations", `Bearer ${token}`); // Giúp tất cả request tự động gửi kèm token JWT (nếu có)
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // gọi API lần 1
  let result = await rawBaseQuery(args, api, extraOptions);
  //Nếu 401/403 -> thử refresh
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    const refresh = getRefreshToken();
    if (refresh) {
      const refreshResult = await rawBaseQuery(
        { url: "token/refresh", method: "POST", body: { refresh } },
        api,
        extraOptions
      );
      if (refreshResult.data?.access) {
        //Nếu trong refreshResult.data mà có trường access thì chạy tiếp, ngược lại thì không
        setTokens(refreshResult.data.access, null);
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        clearTokens();
      }
    }
  }
  return result;
};

export default baseQueryWithReauth;
