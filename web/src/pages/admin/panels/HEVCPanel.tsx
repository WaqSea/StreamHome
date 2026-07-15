import React, { useState } from 'react';
import { GlassPane } from '../../../components/ui/GlassPane';
import { Button } from '../../../components/ui/Button';

type HEVCMode = 'AUTO' | 'ON' | 'OFF';

export function HEVCPanel() {
  const [mode, setMode] = useState<HEVCMode>('AUTO');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-headline)] text-2xl font-semibold">HEVC Compression</h2>
        <p className="font-[family-name:var(--font-mono)] text-[var(--text-muted)] text-sm mt-1 uppercase">Configure h265 transcoding rules</p>
      </div>

      <GlassPane className="p-8" spotlight={false}>
        <div className="flex gap-4 mb-6">
          <Button 
            variant={mode === 'AUTO' ? 'primary' : 'ghost'} 
            onClick={() => setMode('AUTO')}
            className={mode === 'AUTO' ? 'ring-2 ring-[var(--accent-container)]' : ''}
          >
            AUTO (Smart)
          </Button>
          <Button 
            variant={mode === 'ON' ? 'primary' : 'ghost'} 
            onClick={() => setMode('ON')}
            className={mode === 'ON' ? 'ring-2 ring-[var(--accent-container)]' : ''}
          >
            FORCE ON
          </Button>
          <Button 
            variant={mode === 'OFF' ? 'primary' : 'ghost'} 
            onClick={() => setMode('OFF')}
            className={mode === 'OFF' ? 'ring-2 ring-[var(--accent-container)]' : ''}
          >
            DISABLE
          </Button>
        </div>

        <div className="bg-black/30 p-4 rounded-md border border-[var(--border-subtle)]">
          <h4 className="font-[family-name:var(--font-mono)] text-sm text-[var(--text-secondary)] uppercase mb-2">Mode Description</h4>
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--text-muted)] leading-relaxed">
            {mode === 'AUTO' && 'The system will automatically convert media to HEVC (h265) if the original file exceeds 5GB and the client supports HEVC decoding. This balances storage space and processing time.'}
            {mode === 'ON' && 'All ingested media will be converted to HEVC (h265) regardless of original size. This will maximize storage savings but heavily utilize CPU resources during ingestion.'}
            {mode === 'OFF' && 'Media will be kept in its original format. No background transcoding will occur. This minimizes CPU usage but requires maximum storage space.'}
          </p>
        </div>
      </GlassPane>
    </div>
  );
}
