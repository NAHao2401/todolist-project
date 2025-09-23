export const getAccessToken = () => localStorage.getItem("access"); //localStorage là một Web Storage API do trình duyệt cung cấp, cho phép lưu trữ key-value ngay trên trình duyệt của người dùng
export const getRefreshToken = () => localStorage.getItem("refresh");

export const setTokens = (access, refresh) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
