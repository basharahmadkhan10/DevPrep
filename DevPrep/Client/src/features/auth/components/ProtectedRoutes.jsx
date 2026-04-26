/** @format */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-400 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // token hai to protected page access
  return children;
}

export default ProtectedRoute;