import React, { useState } from 'react';
import { GlassPane } from '../../../components/ui/GlassPane';
import { Button } from '../../../components/ui/Button';
import { SudoModal } from '../SudoModal';

export function UpdatePanel() {
  const [sudoOpen, setSudoOpen] = useState(false);

  const handleUpdate = () => {
    setSudoOpen(true);
  };

  const executeUpdate = () => {
    console.log('Initiating system update');
    setSudoOpen(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-headline)] text-2xl font-semibold">System Update</h2>
        <p className="font-[family-name:var(--font-mono)] text-[var(--text-muted)] text-sm mt-1 uppercase">StreamHome Version Control</p>
      </div>

      <GlassPane className="p-8" spotlight={false}>
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-[family-name:var(--font-body)] text-lg text-white">Current Version</span>
              <span className="font-[family-name:var(--font-mono)] bg-white/10 px-3 py-1 rounded-md text-white">v1.4.2</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="font-[family-name:var(--font-body)] text-lg text-[var(--text-secondary)]">Latest Available</span>
              <span className="font-[family-name:var(--font-mono)] bg-[var(--accent-container)] text-black font-bold px-3 py-1 rounded-md">v1.5.0</span>
            </div>

            <p className="font-[family-name:var(--font-body)] text-[var(--text-muted)] text-sm max-w-md">
              A new version is available. Updating will restart the StreamHome daemon and temporarily interrupt active streams.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Button variant="primary" onClick={handleUpdate} className="animate-pulse">
              Install Update
            </Button>
          </div>
        </div>
      </GlassPane>

      <SudoModal 
        isOpen={sudoOpen}
        actionLabel="Execute System Update"
        onSuccess={executeUpdate}
        onCancel={() => setSudoOpen(false)}
      />
    </div>
  );
}
