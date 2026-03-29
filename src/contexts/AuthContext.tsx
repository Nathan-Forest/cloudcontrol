'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // On mount — check if token already exists in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lifeos_token');
    if (stored) {
      setToken(stored);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://192.168.50.160:5003/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();

    // SecureAuth-Lite returns the token — store it
    const jwt = data.token || data.accessToken;
    setToken(jwt);
    localStorage.setItem('lifeos_token', jwt);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('lifeos_token');
  };

  return (
    <AuthContext.Provider value={{
      token,
      isAuthenticated: !!token,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}