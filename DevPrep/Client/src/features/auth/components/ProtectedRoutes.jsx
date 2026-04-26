/** @format */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", width:"100%", background: "#0e0e0e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "1.5px solid rgba(255,255,255,0.06)", borderTopColor: "#c8923a", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
