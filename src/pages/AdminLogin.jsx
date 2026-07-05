import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineShieldCheck } from 'react-icons/hi';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome, Admin!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-secondary to-accent-primary flex items-center justify-center mx-auto mb-4">
            <HiOutlineShieldCheck className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Admin Panel</h1>
          <p className="text-text-secondary mt-2">Central Vault • Restricted Access</p>
        </div>
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Admin Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="admin@scanvault.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
