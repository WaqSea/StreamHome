import React, { useState } from 'react';
import { GlassPane } from '../../../components/ui/GlassPane';
import { Button } from '../../../components/ui/Button';
import { SudoModal } from '../SudoModal';
import { formatTimeAgo } from '../../../utils/format';

interface Backup {
  id: string;
  timestamp: string;
  size: string;
  version: string;
}

export function BackupPanel() {
  const [sudoOpen, setSudoOpen] = useState(false);
  const [backupToRestore, setBackupToRestore] = useState<string | null>(null);

  const [backups] = useState<Backup[]>([
    { id: 'b1', timestamp: new Date(Date.now() - 86400000).toISOString(), size: '24 MB', version: 'v1.4.2' },
    { id: 'b2', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), size: '23.8 MB', version: 'v1.4.1' },
  ]);

  const handleRestoreRequest = (id: string) => {
    setBackupToRestore(id);
    setSudoOpen(true);
  };

  const executeRestore = () => {
    console.log(`Restoring backup ${backupToRestore}`);
    setSudoOpen(false);
    setBackupToRestore(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl font-semibold">Backup & Restore</h2>
          <p className="font-[family-name:var(--font-mono)] text-[var(--text-muted)] text-sm mt-1 uppercase">Manage database snapshots</p>
        </div>
        <Button variant="primary">Create Snapshot</Button>
      </div>

      <div className="flex flex-col gap-4">
        {backups.map(backup => (
          <GlassPane key={backup.id} className="p-6 flex items-center justify-between" spotlight={false}>
            <div>
              <div className="font-[family-name:var(--font-body)] text-lg text-white mb-1">
                Backup {formatTimeAgo(backup.timestamp)}
              </div>
              <div className="flex gap-4 font-[family-name:var(--font-mono)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                <span>Size: {backup.size}</span>
                <span>StreamHome {backup.version}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleRestoreRequest(backup.id)}
              >
                Restore
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[var(--text-error)] hover:bg-[var(--text-error)] hover:text-white"
              >
                Delete
              </Button>
            </div>
          </GlassPane>
        ))}
      </div>

      <SudoModal 
        isOpen={sudoOpen}
        actionLabel="Restore Database Snapshot"
        onSuccess={executeRestore}
        onCancel={() => setSudoOpen(false)}
      />
    </div>
  );
}
