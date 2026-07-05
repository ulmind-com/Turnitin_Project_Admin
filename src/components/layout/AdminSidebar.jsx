import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineHome, HiOutlineClock, HiOutlineUsers, HiOutlineDocumentSearch, HiOutlineLogout, HiOutlineLightningBolt } from 'react-icons/hi';

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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-accent-secondary border-r border-accent-secondary flex flex-col z-50">
      <div className="p-6 border-b border-slate-700 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-accent-secondary font-bold text-xl">
          T
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Admin Console</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            <Icon className="text-xl" /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-xs text-slate-300 truncate">{admin?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors">
          <HiOutlineLogout className="text-xl" /> Logout
        </button>
      </div>
    </aside>
  );
}
