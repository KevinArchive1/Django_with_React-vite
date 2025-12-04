// Cleaned AdminLogin.jsx (unnecessary parts removed, simplified structure)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import "../styles/AdminLogin.css";
import LoginImage from "../assets/Nobela.png";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/admin/token/", { username, password });
      if (res.status === 200) {
        const { access, refresh } = res.data;

        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);

        const decoded = jwtDecode(access);
        localStorage.setItem("userRole", decoded.is_staff ? "admin" : "user");

        navigate("/admin");
      }
    } catch {
      alert("Login failed. Only admin users allowed.");
    }
  };

  return (
    <div className="Outer-container">
      <div className="Inner-container">
        <h1 className="admin-title">Welcome Admin</h1>
        <p className="admin-subtitle">Please log in using your admin credentials.</p>

        <div className="Split-container">
          <div className="Image-section">
            <div className="Image-placeholder">
              <img src={LoginImage} alt="Admin Login" />
            </div>
          </div>

          <div className="Form-section">
            <div className="Login-card">
              <h2>Admin Login</h2>

              <form onSubmit={handleLogin}>
                <div className="user-input">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="user-input">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button className="form-button" type="submit">Login</button>

                <p className="Login-footer">Only authorized personnel with admin privileges can access this area</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;