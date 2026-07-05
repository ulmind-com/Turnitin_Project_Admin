import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

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
    <div className="min-h-screen flex items-center justify-center bg-accent-secondary p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden fade-in">
        <div className="p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent-secondary rounded-xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-md">
              T
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Admin Console</h1>
            <p className="text-text-secondary mt-2 text-sm">Secure access for platform administrators.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">Admin Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="input-field pl-10" 
                  placeholder="admin@turnitin.com" 
                  required 
                />
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">Admin Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="input-field pl-10" 
                  placeholder="••••••••" 
                  required 
                />
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-accent-secondary text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors mt-8" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
