import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = sessionStorage.getItem('pilar_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/admin/login', { email, password });
    sessionStorage.setItem('pilar_token', data.token);
    sessionStorage.setItem('pilar_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/admin/logout'); } catch { /* ignore */ }
    sessionStorage.removeItem('pilar_token');
    sessionStorage.removeItem('pilar_admin');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuth: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
