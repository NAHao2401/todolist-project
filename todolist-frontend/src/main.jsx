import React from "react";
import ReactDOM from "react-dom/client"; //Thư viện con của React, chuyên làm việc với DOM của trình duyệt
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  //Truyển store Redux xuống tất cả component bên trong
  <Provider store={store}>
    <App />
  </Provider>
);
