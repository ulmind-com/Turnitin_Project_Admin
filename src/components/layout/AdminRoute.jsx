import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-10 h-10 border-2 border-accent-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return <Navigate to="/login" replace />;
  return children;
}
