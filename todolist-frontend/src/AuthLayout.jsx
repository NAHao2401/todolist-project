import { Link } from "react-router-dom";
import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <h1>Todo List</h1>
      <nav className="auth-nav top-right-nav">
        <Link className="auth-link" to="/login">
          Login
        </Link>
        <Link className="auth-link" to="/register">
          Register
        </Link>
      </nav>
      <div className="auth-left">
        <img src="bg1.png" alt="background" />
        <div className="auth-text">
          <h2>Manage tasks effortlessly</h2>
          <p>
            Stay organized and boost your productivity. <br />
            Create, track, and complete your daily tasks with ease. <br />
            Log in now and start managing your to-do list!
          </p>
        </div>
      </div>

      <ul className="features-list">
        <li>✅ Create tasks in seconds</li>
        <li>🔄 Update & track progress easily</li>
        <li>📱 Access anywhere, anytime</li>
        <li>🎯 Stay focused and productive</li>
      </ul>
      <div className="auth-right">
        <div className="form-wrapper">{children}</div>
      </div>
    </div>
  );
}
