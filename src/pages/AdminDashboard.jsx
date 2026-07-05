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
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: data?.total_users ?? 0, icon: HiOutlineUsers, color: 'text-accent-primary', bg: 'bg-accent-primary/10' },
    { label: 'Total Scans', value: data?.total_scans ?? 0, icon: HiOutlineDocumentSearch, color: 'text-accent-secondary', bg: 'bg-accent-secondary/10' },
    { label: 'Pending Payments', value: data?.pending_payments ?? 0, icon: HiOutlineClock, color: 'text-accent-warning', bg: 'bg-accent-warning/10' },
    { label: 'Credits Distributed', value: data?.total_credits_distributed ?? 0, icon: HiOutlineCreditCard, color: 'text-accent-success', bg: 'bg-accent-success/10' },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-secondary mt-1">Platform-wide analytics and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-text-muted uppercase tracking-wider font-medium">{label}</span>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`text-xl ${color}`} />
              </div>
            </div>
            <p className={`text-3xl font-bold font-mono ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Plans breakdown */}
      {data?.plans_breakdown?.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Plans Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-border">
            {data.plans_breakdown.map((plan) => (
              <div key={plan.slug} className="p-6 text-center">
                <p className="text-sm text-text-secondary mb-1">{plan.name}</p>
                <p className="text-2xl font-bold font-mono text-accent-primary">{plan.total_subscriptions}</p>
                <p className="text-xs text-text-muted mt-1">subscriptions</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
