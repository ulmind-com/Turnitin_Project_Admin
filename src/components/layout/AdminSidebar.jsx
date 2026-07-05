import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineHome, HiOutlineClock, HiOutlineUsers, HiOutlineDocumentSearch, HiOutlineLogout, HiOutlineShieldCheck, HiOutlineLightningBolt } from 'react-icons/hi';

export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { to: '/', icon: HiOutlineHome, label: 'Core Dashboard' },
    { to: '/payments', icon: HiOutlineClock, label: 'Clearance Queue' },
    { to: '/users', icon: HiOutlineUsers, label: 'Operative Registry' },
    { to: '/scans', icon: HiOutlineDocumentSearch, label: 'Data Logs' },
    { to: '/override', icon: HiOutlineLightningBolt, label: 'Manual Override' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-accent-primary/20 flex flex-col z-50 relative overflow-hidden">
      {/* Edge highlight */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-accent-primary shadow-[0_0_10px_rgba(255,0,60,1)] z-10" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,0,60,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,60,0.2) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

      <div className="p-6 border-b border-accent-primary/20 relative z-10 bg-black/60">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black border border-accent-primary flex items-center justify-center relative shadow-[0_0_15px_rgba(255,0,60,0.3)] group cursor-pointer" style={{ clipPath: 'polygon(25% 0%, 100% 0, 100% 75%, 75% 100%, 0 100%, 0% 25%)' }}>
            <div className="absolute inset-0 border border-transparent border-t-accent-primary rounded-full animate-[spin_5s_linear_infinite]" />
            <HiOutlineShieldCheck className="text-neon-red text-2xl group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-text-primary tracking-widest uppercase">NAK <span className="text-neon-red">Core</span></h1>
            <p className="text-[9px] font-mono text-accent-primary uppercase tracking-[0.3em] mt-1">SYS.ADMIN</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 relative z-10 custom-scrollbar overflow-y-auto">
        <p className="text-[10px] font-display font-bold text-accent-primary/50 uppercase tracking-[0.2em] mb-4 pl-2">System Directories</p>
        
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 relative group overflow-hidden ${isActive ? 'text-neon-red' : 'text-text-secondary hover:text-white'}`}
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
          >
            {({ isActive }) => (
              <>
                {/* Background active/hover state */}
                <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-accent-primary/10' : 'group-hover:bg-white/5'}`} />
                {/* Active indicator line */}
                {isActive && <div className="absolute left-0 top-0 w-1 h-full bg-accent-primary shadow-[0_0_10px_rgba(255,0,60,1)]" />}
                
                <Icon className={`text-lg relative z-10 ${isActive ? 'text-accent-primary' : 'text-text-muted group-hover:text-white'}`} /> 
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-accent-primary/20 relative z-10 bg-black/60">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-accent-primary/10 border border-accent-primary flex items-center justify-center text-xs font-mono font-bold text-accent-primary" style={{ clipPath: 'polygon(25% 0%, 100% 0, 100% 75%, 75% 100%, 0 100%, 0% 25%)' }}>
            ID
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono font-bold text-neon-red truncate uppercase tracking-widest">{admin?.name || 'ROOT'}</p>
            <p className="text-[9px] font-mono text-text-muted truncate uppercase tracking-wider">{admin?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-text-muted hover:text-neon-red transition-colors p-2" title="TERMINATE SESSION">
            <HiOutlineLogout className="text-xl" />
          </button>
        </div>
      </div>
    </aside>
  );
}
