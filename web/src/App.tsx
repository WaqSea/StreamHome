import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

import { LoginPage } from './pages/LoginPage';
import { ProfileSelectPage } from './pages/ProfileSelectPage';
import { DashboardRouter } from './pages/dashboard/DashboardRouter';
import { PlayerPage } from './pages/player/PlayerPage';
import { AdminGate } from './pages/admin/AdminGate';

import { AuthGuard } from './components/guards/AuthGuard';
import { ProfileGuard } from './components/guards/ProfileGuard';
import { AdminGuard } from './components/guards/AdminGuard';

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
          <AuthGuard>
            <ProfileSelectPage />
          </AuthGuard>
        } />
        
        <Route path="/*" element={
          <AuthGuard>
            <ProfileGuard>
              <DashboardRouter />
            </ProfileGuard>
          </AuthGuard>
        } />
        
        <Route path="/watch/:mediaId" element={
          <AuthGuard>
            <ProfileGuard>
              <PlayerPage />
            </ProfileGuard>
          </AuthGuard>
        } />
        
        <Route path="/admin/*" element={
          <AuthGuard>
            <AdminGuard>
              <AdminGate />
            </AdminGuard>
          </AuthGuard>
        } />
        
      </Routes>
    </BrowserRouter>
  );
}
