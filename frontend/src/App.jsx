import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin"; // new admin login page
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRecycleBin from "./components/AdminRecycleBin";
import Discover from "./pages/Discover";
import "./App.css"

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <Discover />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/recycle"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminRecycleBin />
            </ProtectedRoute>
          }
        />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
