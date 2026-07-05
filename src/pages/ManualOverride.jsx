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
      toast.error('PARAMETERS MISSING', { style: { background: '#000', color: '#f59e0b', border: '1px solid #f59e0b' }});
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/admin/users/${selectedUser.id}/plan`, { plan_id: selectedPlan });
      toast.success(`PROTOCOL ASSIGNED TO ${selectedUser.email.toUpperCase()}`, { style: { background: '#000', color: '#00ff41', border: '1px solid #00ff41' }});
      setSelectedUser(null);
      setSelectedPlan('');
      searchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'EXECUTION FAILED', { style: { background: '#000', color: '#ff003c', border: '1px solid #ff003c' }});
    } finally {
      setLoading(false);
    }
  };

  const handleSetCredits = async () => {
    if (!selectedUser || customCredits === '') {
      toast.error('PARAMETERS MISSING', { style: { background: '#000', color: '#f59e0b', border: '1px solid #f59e0b' }});
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/admin/users/${selectedUser.id}/credits`, { credits: parseInt(customCredits) });
      toast.success(`ALLOCATION OVERWRITTEN TO ${customCredits}`, { style: { background: '#000', color: '#00ff41', border: '1px solid #00ff41' }});
      setSelectedUser(null);
      setCustomCredits('');
      searchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'EXECUTION FAILED', { style: { background: '#000', color: '#ff003c', border: '1px solid #ff003c' }});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-3xl mx-auto relative z-10">
      <div className="border-b border-accent-secondary/20 pb-4 mb-8 relative">
        <div className="absolute bottom-0 right-0 w-32 h-[1px] bg-accent-secondary shadow-[0_0_10px_rgba(245,158,11,1)]" />
        <h1 className="text-3xl font-display font-bold text-text-primary uppercase tracking-widest">
          Manual <span className="text-neon-orange glitch-hover">Override</span>
        </h1>
        <p className="text-accent-secondary font-mono text-xs uppercase tracking-[0.2em] mt-2 opacity-80">Direct manipulation of operative allocations</p>
      </div>

      {/* User Search */}
      <div className="cyber-card p-8 mb-6 bg-black/40 relative">
        <div className="absolute top-0 left-0 w-12 h-1 bg-accent-secondary shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        <h3 className="text-[11px] font-display font-bold text-accent-secondary uppercase tracking-[0.2em] mb-4">Target Operative</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-secondary/50" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
              className="input-cyber pl-9 !border-accent-secondary/30 focus:!border-accent-secondary" 
              placeholder="ENTER IDENTIFIER OR QUERY..." 
            />
          </div>
          <button onClick={searchUsers} className="btn-cyber !border-accent-secondary !text-accent-secondary hover:!bg-accent-secondary/10">EXECUTE</button>
        </div>

        {users.length > 0 && (
          <div className="mt-6 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {users.map((user) => (
              <div key={user.id} onClick={() => setSelectedUser(user)}
                className={`p-4 cursor-pointer transition-all flex items-center justify-between border ${
                  selectedUser?.id === user.id ? 'bg-accent-secondary/10 border-accent-secondary shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]' : 'hover:bg-accent-secondary/5 border-white/5 hover:border-accent-secondary/30 bg-black/50'
                }`}
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <div className="flex items-center gap-3">
                  {selectedUser?.id === user.id && <HiOutlineChevronRight className="text-neon-orange" />}
                  <div>
                    <p className={`text-sm font-mono font-bold ${selectedUser?.id === user.id ? 'text-neon-orange' : 'text-text-primary'}`}>{user.name}</p>
                    <p className="text-[10px] font-mono text-text-muted mt-1 uppercase tracking-widest">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-accent-secondary">{user.credits} CR</p>
                  <p className="text-[9px] font-display text-text-muted mt-1 uppercase tracking-widest">{user.active_plan?.name || 'NO CLEARANCE'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assign Plan */}
          <div className="cyber-card p-6 bg-black/40 relative h-full flex flex-col">
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent-primary/50" />
            <h3 className="text-[11px] font-display font-bold text-accent-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <HiOutlineLightningBolt className="text-neon-red text-lg" /> Force Protocol
            </h3>
            <div className="grid grid-cols-1 gap-3 mb-6 flex-1">
              {plans.map((plan) => (
                <div key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 cursor-pointer transition-all flex items-center justify-between border ${
                    selectedPlan === plan.id ? 'bg-accent-primary/10 border-accent-primary shadow-[inset_0_0_10px_rgba(255,0,60,0.2)]' : 'border-white/5 hover:border-accent-primary/30 bg-black/50'
                  }`}
                  style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                  <p className={`text-xs font-mono font-bold uppercase tracking-widest ${selectedPlan === plan.id ? 'text-neon-red' : 'text-text-secondary'}`}>{plan.name}</p>
                  <p className="text-lg font-bold font-mono text-accent-primary">{plan.credits} <span className="text-[9px] font-mono text-text-muted tracking-widest">CR</span></p>
                </div>
              ))}
            </div>
            <button onClick={handleAssignPlan} className="btn-cyber w-full group overflow-hidden" disabled={!selectedPlan || loading}>
              <div className="absolute inset-0 bg-accent-primary/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative z-10">{loading ? 'EXECUTING...' : 'INITIATE ASSIGNMENT'}</span>
            </button>
          </div>

          {/* Custom Credits */}
          <div className="cyber-card p-6 bg-black/40 relative h-full flex flex-col">
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent-secondary/50" />
            <h3 className="text-[11px] font-display font-bold text-accent-secondary uppercase tracking-[0.2em] mb-4">Direct Allocation Override</h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="relative mb-6">
                <input 
                  type="number" 
                  value={customCredits} 
                  onChange={(e) => setCustomCredits(e.target.value)}
                  className="w-full bg-black/80 border-2 border-accent-secondary/30 focus:border-accent-secondary text-center text-4xl font-bold font-mono text-neon-orange py-8 outline-none transition-all shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]" 
                  placeholder="0" 
                  min={0} 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-accent-secondary/50 uppercase tracking-widest">CR</div>
              </div>
              <p className="text-[9px] font-mono text-text-muted mb-6 uppercase tracking-[0.2em] leading-relaxed text-center opacity-70">
                WARNING: THIS OPERATION WILL COMPLETELY OVERWRITE THE OPERATIVE'S EXISTING BALANCE. THIS ACTION CANNOT BE UNDONE.
              </p>
            </div>
            
            <button onClick={handleSetCredits} className="btn-cyber !border-accent-secondary !text-accent-secondary hover:!bg-accent-secondary/10 w-full" disabled={customCredits === '' || loading}>
              {loading ? 'EXECUTING...' : 'OVERWRITE BALANCE'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
