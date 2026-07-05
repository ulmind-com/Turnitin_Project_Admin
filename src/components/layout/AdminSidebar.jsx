import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineHome, HiOutlineClock, HiOutlineUsers, HiOutlineDocumentSearch, HiOutlineLogout, HiOutlineShieldCheck, HiOutlineLightningBolt } from 'react-icons/hi';

export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { to: '/', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/payments', icon: HiOutlineClock, label: 'Payment Queue' },
    { to: '/users', icon: HiOutlineUsers, label: 'User Management' },
    { to: '/scans', icon: HiOutlineDocumentSearch, label: 'Scan Logs' },
    { to: '/override', icon: HiOutlineLightningBolt, label: 'Manual Override' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-secondary border-r border-border flex flex-col z-50">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-secondary to-accent-primary flex items-center justify-center">
            <HiOutlineShieldCheck className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary tracking-tight">Admin Vault</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">Control Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20' : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'}`}>
            <Icon className="text-lg" /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-accent-secondary/20 flex items-center justify-center text-sm font-bold text-accent-secondary">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-text-muted truncate">{admin?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-text-muted hover:text-accent-danger transition-colors" title="Logout">
            <HiOutlineLogout className="text-lg" />
          </button>
        </div>
      </div>
    </aside>
  );
}
