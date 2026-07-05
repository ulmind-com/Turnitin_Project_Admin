import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineShieldCheck, HiOutlineKey } from 'react-icons/hi';

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
      toast.success('ACCESS GRANTED', { style: { background: '#000', color: '#00ff41', border: '1px solid #00ff41' }});
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'ACCESS DENIED', { style: { background: '#000', color: '#ff003c', border: '1px solid #ff003c' }});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Background Grid & Glare */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md fade-in relative z-10">
        <div className="text-center mb-8 relative">
          <div className="w-24 h-24 bg-black border border-accent-primary mx-auto mb-6 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,0,60,0.3)]" style={{ clipPath: 'polygon(25% 0%, 100% 0, 100% 75%, 75% 100%, 0 100%, 0% 25%)' }}>
            <div className="absolute inset-0 border-2 border-transparent border-t-accent-primary rounded-full animate-spin" style={{ animationDuration: '4s' }} />
            <HiOutlineShieldCheck className="text-neon-red text-4xl" />
          </div>
          
          <h1 className="text-4xl font-display font-bold text-text-primary uppercase tracking-[0.2em]">
            NAK <span className="text-neon-red glitch-hover">Core</span>
          </h1>
          <p className="text-accent-primary font-mono text-xs uppercase tracking-[0.3em] mt-3 opacity-80">
            Level 5 Clearance Required
          </p>
          
          <div className="absolute top-1/2 left-0 w-16 h-px bg-accent-primary/50" />
          <div className="absolute top-1/2 right-0 w-16 h-px bg-accent-primary/50" />
        </div>
        
        <div className="cyber-card p-8 bg-black/60 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-accent-primary shadow-[0_0_15px_rgba(255,0,60,0.8)]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent-primary/50" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono text-text-secondary mb-2 uppercase tracking-[0.2em] flex items-center justify-between">
                <span>Administrator ID</span>
                <span className="text-accent-primary/50">[AUTH_ID]</span>
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="input-cyber pl-10" 
                  placeholder="SYSADMIN@NAK.CORE" 
                  required 
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-primary/50">
                  <HiOutlineShieldCheck />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-mono text-text-secondary mb-2 uppercase tracking-[0.2em] flex items-center justify-between">
                <span>Access Key</span>
                <span className="text-accent-primary/50">[ENCRYPTED]</span>
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="input-cyber pl-10" 
                  placeholder="••••••••••••" 
                  required 
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-primary/50">
                  <HiOutlineKey />
                </div>
              </div>
            </div>
            
            <button type="submit" className="btn-cyber w-full group overflow-hidden mt-8" disabled={loading}>
              <div className="absolute inset-0 bg-accent-primary/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative z-10 text-sm">{loading ? 'VERIFYING CREDENTIALS...' : 'INITIALIZE LOGIN PROTOCOL'}</span>
            </button>
          </form>
          
          <div className="mt-8 pt-4 border-t border-accent-primary/20 text-center">
            <p className="text-[9px] font-mono text-accent-primary uppercase tracking-widest opacity-50">
              WARNING: UNAUTHORIZED ACCESS ATTEMPTS WILL BE LOGGED AND TRACED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
