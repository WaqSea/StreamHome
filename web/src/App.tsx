import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useProfileStore } from './stores/profileStore';

import { LoginPage } from './pages/LoginPage';
import { ProfileSelectPage } from './pages/ProfileSelectPage';
import { DashboardRouter } from './pages/dashboard/DashboardRouter';

// Stubs for future steps
const PlayerPage = () => <div className="text-white p-8">Player (Coming Soon)</div>;
const AdminGate = () => <div className="text-white p-8">Admin Gate (Coming Soon)</div>;

function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RequireProfile({ children }: { children: JSX.Element }) {
  const activeProfile = useProfileStore((state) => state.activeProfile);
  const location = useLocation();

  if (!activeProfile) {
    return <Navigate to="/profiles" state={{ from: location }} replace />;
  }
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const isAdmin = useProfileStore((state) => state.isAdmin);
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const loadAuth = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/profiles" element={
          <RequireAuth>
            <ProfileSelectPage />
          </RequireAuth>
        } />
        
        <Route path="/" element={
          <RequireAuth>
            <RequireProfile>
              <DashboardRouter />
            </RequireProfile>
          </RequireAuth>
        } />
        
        <Route path="/watch/:mediaId" element={
          <RequireAuth>
            <RequireProfile>
              <PlayerPage />
            </RequireProfile>
          </RequireAuth>
        } />
        
        <Route path="/admin/*" element={
          <RequireAuth>
            <RequireAdmin>
              <AdminGate />
            </RequireAdmin>
          </RequireAuth>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
