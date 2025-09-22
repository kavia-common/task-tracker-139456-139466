import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthAPI } from '../api';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** React hook to access auth state and actions. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and methods to descendents. */
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await AuthAPI.me();
        if (!cancelled) setUser(me);
      } catch (_e) {
        // not logged in
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = async (username, password) => {
    setError('');
    await AuthAPI.login(username, password);
    const me = await AuthAPI.me();
    setUser(me);
  };

  const register = async (username, email, password) => {
    setError('');
    await AuthAPI.register(username, email, password);
    const me = await AuthAPI.me();
    setUser(me);
  };

  const logout = async () => {
    setError('');
    await AuthAPI.logout();
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    initializing,
    error,
    setError,
    login,
    register,
    logout,
  }), [user, initializing, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
