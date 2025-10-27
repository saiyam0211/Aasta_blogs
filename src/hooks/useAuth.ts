import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd validate the token with the server
      // For now, we'll just assume it's valid if it exists
      setAuthState({
        isAuthenticated: true,
        user: null, // You could decode user info from JWT
        token
      });
    }
  }, []);

  const login = (token: string, user?: User) => {
    localStorage.setItem('authToken', token);
    setAuthState({
      isAuthenticated: true,
      user: user || null,
      token
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  const getAuthHeaders = () => {
    if (authState.token) {
      return {
        'Authorization': `Bearer ${authState.token}`
      };
    }
    return {};
  };

  return {
    ...authState,
    login,
    logout,
    getAuthHeaders
  };
};