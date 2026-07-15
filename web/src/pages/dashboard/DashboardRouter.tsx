import React from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { EmberDashboard } from './ember/EmberDashboard';

// Stubs for other themes to be implemented next
const AuroraDashboard = () => <div className="text-white p-8">Aurora Dashboard (Coming Soon)</div>;
const CinemaDashboard = () => <div className="text-white p-8">Cinema Dashboard (Coming Soon)</div>;
const GeminiDashboard = () => <div className="text-white p-8">Gemini Dashboard (Coming Soon)</div>;

export function DashboardRouter() {
  const { activeTheme } = useThemeStore();

  switch (activeTheme) {
    case 'aurora':
      return <AuroraDashboard />;
    case 'cinema':
      return <CinemaDashboard />;
    case 'gemini':
      return <GeminiDashboard />;
    case 'ember':
    default:
      return <EmberDashboard />;
  }
}
