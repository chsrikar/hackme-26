import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_FACULTY } from '../data/mockRoster';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [faculty, setFaculty] = useState(() => {
    const saved = localStorage.getItem('faculty_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default logged-in mock faculty for fast demoing
    return MOCK_FACULTY;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('faculty_token', res.token);
      localStorage.setItem('faculty_user', JSON.stringify(res.faculty));
      setFaculty(res.faculty);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('faculty_token');
    localStorage.removeItem('faculty_user');
    setFaculty(null);
  };

  return (
    <AuthContext.Provider value={{ faculty, isAuthenticated: Boolean(faculty), loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
