import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import DriftingEmbers from '../components/DriftingEmbers';

export default function MainLayout() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen w-full relative bg-[var(--bg-color)] text-[var(--text-color)] font-sans">
      {theme === 'ember' && <DriftingEmbers />}
      <Outlet />
    </div>
  );
}
