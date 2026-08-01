import React, { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Fetch current user profile on app load if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response?.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.error('Failed to load user profile', err);
        // Only wipe auth session if server explicitly returns 401 Unauthorized
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleNetworkError = (error) => {
    if (error.message === 'Network Error' || !error.response) {
      return 'Network Error: Cannot connect to server. Make sure backend is active.';
    }
    return error.response?.data?.message || error.message;
  };

  const login = async (credentials) => {
    setAuthError(null);
    try {
      const response = await authService.login(credentials);
      const { user: userData, accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message = handleNetworkError(error);
      setAuthError(message);
      throw new Error(message);
    }
  };

  const register = async (userDataInput) => {
    setAuthError(null);
    try {
      const response = await authService.register(userDataInput);
      const { user: userData, accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message = handleNetworkError(error);
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error during logout api call', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        authError,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
