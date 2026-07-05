import { useState, useEffect } from 'react';
import api from '../services/api';
import { HiOutlineUsers, HiOutlineDocumentSearch, HiOutlineClock, HiOutlineCreditCard } from 'react-icons/hi';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 relative z-10">
        <div className="skeleton h-8 w-48 mb-6 bg-accent-primary/20" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 cyber-card" />)}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Personnel', value: data?.total_users ?? 0, icon: HiOutlineUsers, color: 'text-neon-red', shadowColor: 'rgba(255,0,60,0.5)' },
    { label: 'Global Scans', value: data?.total_scans ?? 0, icon: HiOutlineDocumentSearch, color: 'text-neon-orange', shadowColor: 'rgba(245,158,11,0.5)' },
    { label: 'Pending Clearances', value: data?.pending_payments ?? 0, icon: HiOutlineClock, color: 'text-neon-red', shadowColor: 'rgba(255,0,60,0.5)', isAlert: (data?.pending_payments ?? 0) > 0 },
    { label: 'Distributed Credits', value: data?.total_credits_distributed ?? 0, icon: HiOutlineCreditCard, color: 'text-neon-green', shadowColor: 'rgba(0,255,65,0.5)' },
  ];

  return (
    <div className="space-y-8 fade-in relative z-10">
      <div className="border-b border-accent-primary/20 pb-4 relative">
        <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-accent-primary shadow-[0_0_10px_rgba(255,0,60,1)]" />
        <h1 className="text-3xl font-display font-bold text-text-primary uppercase tracking-widest">
          NAK Core <span className="text-neon-red glitch-hover">Command</span>
        </h1>
        <p className="text-accent-primary font-mono text-xs uppercase tracking-[0.2em] mt-2 opacity-80">Global System Telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color, shadowColor, isAlert }) => (
          <div key={label} className={`cyber-card p-6 group transition-all duration-300 ${isAlert ? 'border-accent-primary shadow-[inset_0_0_15px_rgba(255,0,60,0.2)]' : 'bg-black/40 hover:bg-accent-primary/5'}`}>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <span className="text-[10px] text-text-secondary uppercase font-display tracking-[0.15em]">{label}</span>
              <div className={`w-8 h-8 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity ${isAlert ? 'animate-pulse text-accent-primary' : ''}`}>
                <Icon className={`text-2xl ${color}`} />
              </div>
            </div>
            <p className={`text-4xl font-bold font-mono ${color} tracking-wider z-10 relative`} style={{ textShadow: `0 0 15px ${shadowColor}` }}>
              {value}
            </p>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Plans breakdown */}
      {data?.plans_breakdown?.length > 0 && (
        <div className="cyber-card bg-black/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="p-5 border-b border-accent-primary/20 flex justify-between items-center bg-accent-primary/5">
            <h2 className="text-[11px] font-display font-bold text-accent-primary uppercase tracking-[0.2em]">Active Protocols Distribution</h2>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-accent-primary animate-pulse" />
              <div className="w-1.5 h-1.5 bg-accent-primary animate-pulse delay-75" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-accent-primary/20 relative z-10">
            {data.plans_breakdown.map((plan) => (
              <div key={plan.slug} className="p-8 text-center group hover:bg-accent-primary/5 transition-colors">
                <p className="text-[10px] font-mono text-text-muted mb-2 uppercase tracking-[0.2em]">{plan.name}</p>
                <p className="text-3xl font-bold font-mono text-neon-red group-hover:text-white transition-colors drop-shadow-[0_0_10px_rgba(255,0,60,0.5)]">
                  {plan.total_subscriptions}
                </p>
                <p className="text-[9px] font-display text-accent-primary/50 mt-2 uppercase tracking-widest">Active Clearances</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
