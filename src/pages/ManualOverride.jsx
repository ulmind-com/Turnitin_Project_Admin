import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlineLightningBolt } from 'react-icons/hi';

export default function ManualOverride() {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [customCredits, setCustomCredits] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/api/plans');
      setPlans(res.data.plans || []);
    } catch (err) { console.error(err); }
  };

  const searchUsers = async () => {
    if (!search.trim()) return;
    try {
      const res = await api.get(`/api/admin/users?search=${search}`);
      setUsers(res.data.users || []);
    } catch (err) { console.error(err); }
  };

  const handleAssignPlan = async () => {
    if (!selectedUser || !selectedPlan) {
      toast.error('Select a user and plan');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/admin/users/${selectedUser.id}/plan`, { plan_id: selectedPlan });
      toast.success(`Plan assigned to ${selectedUser.email}`);
      setSelectedUser(null);
      setSelectedPlan('');
      searchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSetCredits = async () => {
    if (!selectedUser || customCredits === '') {
      toast.error('Select a user and enter credit amount');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/admin/users/${selectedUser.id}/credits`, { credits: parseInt(customCredits) });
      toast.success(`Credits set to ${customCredits} for ${selectedUser.email}`);
      setSelectedUser(null);
      setCustomCredits('');
      searchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Manual Override</h1>
      <p className="text-text-secondary mb-8">Assign plans or set credits for VIP clients, testers, or offline sales</p>

      {/* User Search */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Find User</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
              className="input-field pl-9" placeholder="Search by name or email..." />
          </div>
          <button onClick={searchUsers} className="btn-primary">Search</button>
        </div>

        {users.length > 0 && (
          <div className="mt-4 space-y-2">
            {users.map((user) => (
              <div key={user.id} onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedUser?.id === user.id ? 'bg-accent-primary/10 border border-accent-primary/30' : 'hover:bg-bg-elevated border border-transparent'
                }`}>
                <div>
                  <p className="text-sm font-medium text-text-primary">{user.name}</p>
                  <p className="text-xs text-text-muted">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-accent-primary">{user.credits} credits</p>
                  <p className="text-xs text-text-muted">{user.active_plan?.name || 'No plan'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <>
          {/* Assign Plan */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <HiOutlineLightningBolt className="text-accent-secondary" /> Assign Plan to {selectedUser.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {plans.map((plan) => (
                <div key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all text-center border ${
                    selectedPlan === plan.id ? 'bg-accent-secondary/10 border-accent-secondary/30' : 'border-border hover:border-accent-secondary/20'
                  }`}>
                  <p className="text-sm font-semibold text-text-primary">{plan.name}</p>
                  <p className="text-2xl font-bold font-mono text-accent-secondary mt-1">{plan.credits}</p>
                  <p className="text-xs text-text-muted">credits</p>
                </div>
              ))}
            </div>
            <button onClick={handleAssignPlan} className="btn-primary w-full" disabled={!selectedPlan || loading}>
              {loading ? 'Assigning...' : 'Assign Plan & Add Credits'}
            </button>
          </div>

          {/* Custom Credits */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Set Custom Credits</h3>
            <div className="flex gap-3">
              <input type="number" value={customCredits} onChange={(e) => setCustomCredits(e.target.value)}
                className="input-field flex-1" placeholder="Enter credit amount" min={0} />
              <button onClick={handleSetCredits} className="btn-secondary" disabled={customCredits === '' || loading}>
                Set Credits
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2">This replaces the user's current credit balance entirely.</p>
          </div>
        </>
      )}
    </div>
  );
}
