import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_access_token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await api.get('/api/auth/me');
      if (res.data.role !== 'admin') throw new Error('Not admin');
      setAdmin(res.data);
    } catch {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/api/auth/admin/login', { email, password });
    localStorage.setItem('admin_access_token', res.data.access_token);
    localStorage.setItem('admin_refresh_token', res.data.refresh_token);
    await checkAuth();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
