import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = AuthService._getToken();
        
        // If user is on login/register page and already authenticated, redirect to dashboard
        if (token && (location.pathname === '/login' || location.pathname === '/register')) {
          try {
            // This will automatically handle token refresh if needed
            const user = await AuthService.getCurrentUser();
            
            if (user) {
              navigate('/dashboard', { replace: true });
            }
          } catch (error) {
            // Token is invalid or refresh failed, let user stay on login/register page
            console.error('Authentication check failed:', error);
            AuthService._clearToken();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuthStatus();
  }, [navigate, location]);

  return children;
};

export default AuthGuard;