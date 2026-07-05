import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlineLightningBolt, HiOutlineChevronRight } from 'react-icons/hi';

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
      toast.error('Please select a plan to assign');
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
      toast.error(err.response?.data?.detail || 'Assignment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSetCredits = async () => {
    if (!selectedUser || customCredits === '') {
      toast.error('Please enter a valid credit amount');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/admin/users/${selectedUser.id}/credits`, { credits: parseInt(customCredits) });
      toast.success(`Credits updated for ${selectedUser.email}`);
      setSelectedUser(null);
      setCustomCredits('');
      searchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Credit update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Manual Override</h1>
        <p className="text-text-secondary mt-1">Directly modify user plans and credit balances</p>
      </div>

      {/* User Search */}
      <div className="clean-card p-6">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Select User</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
              className="input-field pl-10" 
              placeholder="Search by name or email..." 
            />
          </div>
          <button onClick={searchUsers} className="btn-primary">Search</button>
        </div>

        {users.length > 0 && (
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto custom-scrollbar border border-border rounded-lg bg-slate-50 p-2">
            {users.map((user) => (
              <div key={user.id} onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between border ${
                  selectedUser?.id === user.id ? 'bg-blue-50 border-accent-primary shadow-sm' : 'bg-white border-transparent hover:border-border'
                }`}>
                <div className="flex items-center gap-3">
                  {selectedUser?.id === user.id && <HiOutlineChevronRight className="text-accent-primary" />}
                  <div>
                    <p className={`text-sm font-bold ${selectedUser?.id === user.id ? 'text-accent-primary' : 'text-text-primary'}`}>{user.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary">{user.credits} Credits</p>
                  <p className="text-xs text-text-muted mt-0.5">{user.active_plan?.name || 'No Plan'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assign Plan */}
          <div className="clean-card p-6 flex flex-col">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <HiOutlineLightningBolt className="text-accent-primary text-lg" /> Assign Plan
            </h3>
            <div className="grid grid-cols-1 gap-3 mb-6 flex-1">
              {plans.map((plan) => (
                <div key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                    selectedPlan === plan.id ? 'bg-blue-50 border-accent-primary' : 'bg-white border-border hover:border-slate-400'
                  }`}>
                  <p className={`text-sm font-bold ${selectedPlan === plan.id ? 'text-accent-primary' : 'text-text-primary'}`}>{plan.name}</p>
                  <p className="text-lg font-bold text-text-primary">{plan.credits} <span className="text-xs text-text-muted font-normal">CR</span></p>
                </div>
              ))}
            </div>
            <button onClick={handleAssignPlan} className="btn-primary w-full" disabled={!selectedPlan || loading}>
              {loading ? 'Processing...' : 'Assign Plan & Reset Credits'}
            </button>
          </div>

          {/* Custom Credits */}
          <div className="clean-card p-6 flex flex-col">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Set Custom Credits</h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm text-text-secondary mb-4 text-center">
                This will completely overwrite the user's current credit balance.
              </p>
              <div className="relative mb-6 mx-auto w-48">
                <input 
                  type="number" 
                  value={customCredits} 
                  onChange={(e) => setCustomCredits(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-border focus:border-accent-primary rounded-xl text-center text-3xl font-bold text-text-primary py-4 outline-none transition-colors" 
                  placeholder="0" 
                  min={0} 
                />
              </div>
            </div>
            
            <button onClick={handleSetCredits} className="btn-primary w-full bg-slate-800 hover:bg-slate-900" disabled={customCredits === '' || loading}>
              {loading ? 'Processing...' : 'Overwrite Balance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
