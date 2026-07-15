import React, { useState } from 'react';
import { GlassPane } from '../../../components/ui/GlassPane';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SudoModal } from '../SudoModal';

export function StoragePanel() {
  const [engine, setEngine] = useState<'LOCAL' | 'CLOUD'>('LOCAL');
  const [rclonePath, setRclonePath] = useState('gdrive:Media');
  
  const [sudoOpen, setSudoOpen] = useState(false);
  const [pendingEngine, setPendingEngine] = useState<'LOCAL' | 'CLOUD' | null>(null);

  const handleEngineToggle = (newEngine: 'LOCAL' | 'CLOUD') => {
    if (newEngine === engine) return;
    setPendingEngine(newEngine);
    setSudoOpen(true);
  };

  const executeEngineChange = () => {
    if (pendingEngine) setEngine(pendingEngine);
    setSudoOpen(false);
    setPendingEngine(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-headline)] text-2xl font-semibold">Storage & Rclone</h2>
        <p className="font-[family-name:var(--font-mono)] text-[var(--text-muted)] text-sm mt-1 uppercase">Manage underlying storage engine</p>
      </div>

      <GlassPane className="p-8 mb-8" spotlight={false}>
        <h3 className="font-[family-name:var(--font-mono)] text-lg mb-4 uppercase tracking-widest border-b border-[var(--border-subtle)] pb-2">Active Engine</h3>
        
        <div className="flex gap-4 mb-6">
          <Button 
            variant={engine === 'LOCAL' ? 'primary' : 'ghost'} 
            onClick={() => handleEngineToggle('LOCAL')}
            className={engine === 'LOCAL' ? 'ring-2 ring-[var(--accent-container)]' : ''}
          >
            LOCAL DISK
          </Button>
          <Button 
            variant={engine === 'CLOUD' ? 'primary' : 'ghost'} 
            onClick={() => handleEngineToggle('CLOUD')}
            className={engine === 'CLOUD' ? 'ring-2 ring-[var(--accent-container)]' : ''}
          >
            RCLONE CLOUD
          </Button>
        </div>

        {engine === 'CLOUD' && (
          <div className="flex flex-col gap-4 mt-6 p-4 border border-[var(--border-subtle)] rounded-lg bg-[rgba(0,0,0,0.2)]">
            <h4 className="font-[family-name:var(--font-mono)] text-sm text-[var(--text-secondary)] uppercase">Cloud Configuration</h4>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input 
                  label="Rclone Remote Path" 
                  value={rclonePath} 
                  onChange={(e) => setRclonePath(e.target.value)} 
                />
              </div>
              <Button variant="secondary" className="mb-1">Save Path</Button>
            </div>
            <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)]">
              Ensure rclone is configured correctly on the host system before saving.
            </p>
          </div>
        )}
      </GlassPane>

      <SudoModal 
        isOpen={sudoOpen}
        actionLabel={`Switch storage engine to ${pendingEngine}`}
        onSuccess={executeEngineChange}
        onCancel={() => setSudoOpen(false)}
      />
    </div>
  );
}
