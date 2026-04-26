/** @format */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./features/auth/pages/Login.jsx";
import Signup from "./features/auth/pages/Signup.jsx";
import ProtectedRoute from "./features/auth/components/ProtectedRoutes.jsx";
import {AuthProvider} from "./features/auth/auth.context.jsx";
import Dashboard from "./features/interview/pages/Dashboard.jsx";
import InterviewReport from "./features/interview/pages/InterviewReport.jsx";
import {InterviewProvider}  from "./features/interview/interview.context.jsx";


function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
      <main className="flex items-center justify-center h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/report/:id" element={<ProtectedRoute><InterviewReport /></ProtectedRoute>} />
        </Routes>
    </main>
    </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
