import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { verify2FA } from '../../api/auth';

interface SudoModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  actionLabel: string;
}

export function SudoModal({ isOpen, onSuccess, onCancel, actionLabel }: SudoModalProps) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const email = useAuthStore(state => state.email); // Need email to verify

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (email && code) {
        // Mocking sudo auth behavior for now, usually an endpoint like /api/admin/sudo
        await verify2FA({ email, code });
      }
      // If we didn't throw, assume success
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div 
        className="p-6 md:p-8 flex flex-col gap-6"
        style={{ border: '1px solid var(--text-error)', borderRadius: 'inherit' }}
      >
        <div>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl font-bold text-[var(--text-error)] mb-2 tracking-wide uppercase">
            Authorization Required
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[var(--text-secondary)] text-sm">
            Please authenticate to perform: <strong className="text-[var(--text-primary)]">{actionLabel}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label="Master Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input 
            label="6-Digit TOTP Code" 
            type="text" 
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          {error && (
            <div className="font-[family-name:var(--font-mono)] text-[var(--text-error)] text-xs">
              {error}
            </div>
          )}

          <div className="flex gap-4 mt-4">
            <Button type="submit" variant="primary" disabled={isLoading || code.length !== 6}>
              {isLoading ? 'Verifying...' : 'Authorize Action'}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
