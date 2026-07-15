import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmberBackground } from '../../themes/ember/EmberBackground';
import { ScanLines } from '../../themes/ember/ScanLines';
import { cn } from '../../utils/cn';

import { UsersPanel } from './panels/UsersPanel';
import { StoragePanel } from './panels/StoragePanel';
import { DownloadsPanel } from './panels/DownloadsPanel';
import { BackupPanel } from './panels/BackupPanel';
import { UpdatePanel } from './panels/UpdatePanel';
import { HEVCPanel } from './panels/HEVCPanel';

type PanelType = 'users' | 'storage' | 'downloads' | 'backup' | 'update' | 'hevc';

export function AdminCenter() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<PanelType>('users');

  const navItems: { id: PanelType, label: string }[] = [
    { id: 'users', label: 'Users & 2FA' },
    { id: 'storage', label: 'Storage & Rclone' },
    { id: 'downloads', label: 'Download Queue' },
    { id: 'backup', label: 'Backup & Restore' },
    { id: 'update', label: 'System Update' },
    { id: 'hevc', label: 'HEVC Compression' },
  ];

  return (
    <div className="relative w-full h-screen flex overflow-hidden bg-[var(--bg-body)] text-[var(--text-primary)]" data-theme="ember">
      <EmberBackground />
      <ScanLines />

      {/* Sidebar */}
      <div className="relative z-10 w-[250px] h-full flex flex-col border-r border-[var(--glass-border)] bg-[rgba(30,16,11,0.6)] backdrop-blur-md">
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-headline)] text-xl font-bold tracking-widest text-[var(--text-accent)] uppercase">
            Admin Center
          </h1>
        </div>

        <div className="flex flex-col gap-2 p-4 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-md font-[family-name:var(--font-mono)] text-sm transition-colors duration-[var(--duration-fast)]",
                activePanel === item.id
                  ? "bg-[rgba(255,95,31,0.15)] text-[var(--accent-container)] border border-[var(--glass-border-hover)]"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-container)] hover:bg-[rgba(255,95,31,0.1)] border border-transparent"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-[var(--border-subtle)]">
          <button 
            onClick={() => navigate('/')}
            className="w-full px-4 py-3 text-center text-sm font-[family-name:var(--font-mono)] text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            ← Exit Admin Center
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 h-full overflow-y-auto">
        {activePanel === 'users' && <UsersPanel />}
        {activePanel === 'storage' && <StoragePanel />}
        {activePanel === 'downloads' && <DownloadsPanel />}
        {activePanel === 'backup' && <BackupPanel />}
        {activePanel === 'update' && <UpdatePanel />}
        {activePanel === 'hevc' && <HEVCPanel />}
      </div>
    </div>
  );
}
