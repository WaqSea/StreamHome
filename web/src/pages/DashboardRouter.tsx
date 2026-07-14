import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

import EmberHome from '../themes/ember/EmberHome';
import AuroraHome from '../themes/aurora/AuroraHome';
import CinemaHome from '../themes/cinema/CinemaHome';
import GeminiHome from '../themes/gemini/GeminiHome';

export default function DashboardRouter({ tab = 'home' }: { tab?: string }) {
  const { theme } = useTheme();

  const renderTheme = () => {
    switch (theme) {
      case 'ember':
        return <EmberHome tab={tab} />;
      case 'aurora':
        return <AuroraHome tab={tab} />;
      case 'cinema':
        return <CinemaHome tab={tab} />;
      case 'gemini':
        return <GeminiHome tab={tab} />;
      default:
        return <EmberHome tab={tab} />;
    }
  };

  return (
    <div className="w-full h-full min-h-screen">
      {renderTheme()}
    </div>
  );
}
