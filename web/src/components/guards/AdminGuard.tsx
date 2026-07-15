import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfileStore } from '../../stores/profileStore';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAdmin = useProfileStore((state) => state.isAdmin);
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}
