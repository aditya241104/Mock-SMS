import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/DashBoard';
import ProtectedRoute from './Routes/ProtectedRoute';
import AuthGuard from './Auth/AuthGuard';
import MessagesPage from './Pages/MessagesPage';

// Dummy authentication check (replace with your real auth logic)
const isAuthenticated = () => {
  return localStorage.getItem('token'); // or any auth state you use
};

function App() {
  return (
    <Router>
      <AuthGuard>
        <div className="App">
          <Routes>
            {/* Redirect based on login status */}
            <Route
              path="/"
              element={
                isAuthenticated() ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/project/:projectId"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthGuard>
    </Router>
  );
}

export default App;
