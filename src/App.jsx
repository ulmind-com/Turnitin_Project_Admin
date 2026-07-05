import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/layout/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PaymentQueue from './pages/PaymentQueue';
import UserManagement from './pages/UserManagement';
import ScanLogs from './pages/ScanLogs';
import ManualOverride from './pages/ManualOverride';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/payments" element={<PaymentQueue />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/scans" element={<ScanLogs />} />
            <Route path="/override" element={<ManualOverride />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
