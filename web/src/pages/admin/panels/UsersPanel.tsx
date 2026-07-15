import React, { useState } from 'react';
import { GlassPane } from '../../../components/ui/GlassPane';
import { Button } from '../../../components/ui/Button';
import { SudoModal } from '../SudoModal';

// Mock data, in a real scenario fetch from /api/admin/users
const mockUsers = [
  { id: '1', name: 'Admin', email: 'admin@streamhome.local', has2FA: true },
  { id: '2', name: 'Guest', email: 'guest@streamhome.local', has2FA: false }
];

export function UsersPanel() {
  const [sudoOpen, setSudoOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleDeleteRequest = (userId: string) => {
    setUserToDelete(userId);
    setSudoOpen(true);
  };

  const executeDelete = () => {
    console.log(`Deleted user ${userToDelete}`);
    setSudoOpen(false);
    setUserToDelete(null);
    // Refresh user list logic here
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl font-semibold">User Management</h2>
          <p className="font-[family-name:var(--font-mono)] text-[var(--text-muted)] text-sm mt-1 uppercase">Manage access and 2FA</p>
        </div>
        <Button variant="primary">Add User</Button>
      </div>

      <div className="flex flex-col gap-4">
        {mockUsers.map(user => (
          <GlassPane key={user.id} className="p-6 flex items-center justify-between" spotlight={false}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-[family-name:var(--font-body)] text-lg font-medium text-white">{user.name}</span>
                {user.id === '1' && (
                  <span className="bg-[var(--accent-container)] text-black font-bold font-[family-name:var(--font-mono)] text-[10px] px-2 py-0.5 rounded-sm">ADMIN</span>
                )}
                {user.has2FA && (
                  <span className="border border-green-500/50 text-green-400 font-[family-name:var(--font-mono)] text-[10px] px-2 py-0.5 rounded-sm">2FA ENABLED</span>
                )}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[var(--text-secondary)] text-sm">{user.email}</div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm">Reset Password</Button>
              {user.id !== '1' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteRequest(user.id)}
                  className="text-[var(--text-error)] hover:text-white hover:bg-[var(--text-error)] border border-[var(--text-error)]"
                >
                  Delete
                </Button>
              )}
            </div>
          </GlassPane>
        ))}
      </div>

      <SudoModal 
        isOpen={sudoOpen}
        actionLabel="Delete User Account"
        onSuccess={executeDelete}
        onCancel={() => setSudoOpen(false)}
      />
    </div>
  );
}
