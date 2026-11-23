import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Preset default user to faculty for rich, immediate experience matching the screenshot
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnwise_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'faculty-demo-01',
      email: 'dr.robert@learnwise.edu',
      full_name: 'Dr. Robert Vance',
      role: 'FACULTY',
      is_active: true,
      is_approved: true,
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('learnwise_token') || 'demo-jwt-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('learnwise_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('learnwise_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('learnwise_token', token);
    } else {
      localStorage.removeItem('learnwise_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: loggedUser } = res.data;
      setToken(access_token);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (err) {
      const detail = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      return { success: false, error: detail };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, full_name, role }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, password, full_name, role });
      return { success: true, data: res.data };
    } catch (err) {
      const detail = err.response?.data?.detail || 'Registration failed.';
      return { success: false, error: detail };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('learnwise_token');
    localStorage.removeItem('learnwise_user');
  };

  // Helper role switch for demo / testing convenience
  const switchRole = (role) => {
    if (role === 'ADMIN') {
      setUser({
        id: 'admin-demo-01',
        email: 'admin@learnwise.edu',
        full_name: 'System Administrator',
        role: 'ADMIN',
        is_active: true,
        is_approved: true,
      });
    } else if (role === 'FACULTY') {
      setUser({
        id: 'faculty-demo-01',
        email: 'dr.robert@learnwise.edu',
        full_name: 'Dr. Robert Vance',
        role: 'FACULTY',
        is_active: true,
        is_approved: true,
      });
    } else {
      setUser({
        id: 'student-demo-01',
        email: 'alice.smith@learnwise.edu',
        full_name: 'Alice Smith',
        role: 'STUDENT',
        is_active: true,
        is_approved: true,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchRole,
        isAdmin: user?.role === 'ADMIN',
        isFaculty: user?.role === 'FACULTY',
        isStudent: user?.role === 'STUDENT',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
