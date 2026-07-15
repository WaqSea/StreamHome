import React, { useState } from 'react';
import { EmberBackground } from '../../../themes/ember/EmberBackground';
import { ScanLines } from '../../../themes/ember/ScanLines';
import { EmberNavbar } from '../../../components/layout/EmberNavbar';
import { EmberHome } from './EmberHome';

export function EmberDashboard() {
  const [activeTab, setActiveTab] = useState<"home" | "movies" | "series" | "downloads">("home");

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-body)] text-[var(--text-primary)]" data-theme="ember">
      <EmberBackground />
      <ScanLines />
      <EmberNavbar />

      <main className="relative z-10 pt-[64px]">
        {activeTab === "home" && <EmberHome />}
        {activeTab === "movies" && <div className="p-8">Movies Tab (Coming Soon)</div>}
        {activeTab === "series" && <div className="p-8">Series Tab (Coming Soon)</div>}
        {activeTab === "downloads" && <div className="p-8">Downloads Tab (Coming Soon)</div>}
      </main>
    </div>
  );
}
