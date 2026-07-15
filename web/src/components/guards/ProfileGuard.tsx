import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfileStore } from '../../stores/profileStore';

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const activeProfile = useProfileStore((state) => state.activeProfile);
  const location = useLocation();

  if (!activeProfile) {
    return <Navigate to="/profiles" state={{ from: location }} replace />;
  }
  return children;
}
