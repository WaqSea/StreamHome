import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { login, verify2FA } from '../api/auth';
import { EmberBackground } from '../themes/ember/EmberBackground';
import { ScanLines } from '../themes/ember/ScanLines';
import { GlassPane } from '../components/ui/GlassPane';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [requires2FA, setRequires2FA] = useState(false);
  const [totpCode, setTotpCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login({ email, password });
      
      if ((res as any).requires2fa) {
        setRequires2FA(true);
      } else if ((res as any).accessToken) {
        setToken((res as any).accessToken, email);
        navigate('/profiles');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTotpChange = async (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...totpCode];
    newCode[index] = value;
    setTotpCode(newCode);
    setError('');

    // Auto focus next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit on 6th digit
    if (value !== '' && index === 5 && newCode.every(c => c !== '')) {
      setIsLoading(true);
      try {
        const code = newCode.join('');
        const res = await verify2FA({ email, code });
        if ((res as any).accessToken) {
          setToken((res as any).accessToken, email);
          navigate('/profiles');
        }
      } catch (err: any) {
        setError(err.message || 'Invalid 2FA code');
        setTotpCode(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTotpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && totpCode[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden" data-theme="ember">
      <EmberBackground />
      <ScanLines />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={error ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, y: 0 }}
        transition={error ? { duration: 0.4 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <GlassPane className="p-8 pb-10">
          <div className="mb-8 text-center">
            <h1 className="font-[family-name:var(--font-headline)] text-[var(--text-accent)] text-3xl tracking-widest font-bold select-none">
              STREAMHOME
            </h1>
            <p className="font-[family-name:var(--font-mono)] text-[var(--text-muted)] text-xs tracking-widest uppercase mt-2">
              Secure Terminal Access
            </p>
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!requires2FA ? (
                <motion.form
                  key="login-form"
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLoginSubmit}
                  className="flex flex-col gap-6"
                >
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    label="Master Password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  {error && (
                    <div className="text-[var(--text-error)] text-xs font-[family-name:var(--font-mono)] mt-[-10px]">
                      {error}
                    </div>
                  )}
                  <Button type="submit" disabled={isLoading} className="mt-2">
                    {isLoading ? 'Authenticating...' : 'Initialize Connection'}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="totp-form"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center gap-6"
                >
                  <p className="font-[family-name:var(--font-mono)] text-[var(--text-secondary)] text-sm text-center">
                    Enter the 6-digit TOTP code from your authenticator app.
                  </p>
                  
                  <div className="flex gap-2">
                    {totpCode.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleTotpChange(i, e.target.value)}
                        onKeyDown={(e) => handleTotpKeyDown(i, e)}
                        disabled={isLoading}
                        className="w-12 h-14 text-center text-xl font-[family-name:var(--font-mono)] bg-transparent border-b-2 border-[rgba(255,255,255,0.2)] text-[var(--text-primary)] outline-none transition-all duration-[var(--duration-fast)] focus:border-[var(--glass-border-hover)] focus:shadow-[0_4px_10px_rgba(255,95,31,0.2)]"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="text-[var(--text-error)] text-xs font-[family-name:var(--font-mono)]">
                      {error}
                    </div>
                  )}

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => { setRequires2FA(false); setTotpCode(Array(6).fill('')); setError(''); }}
                    disabled={isLoading}
                    className="mt-4"
                  >
                    Cancel
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassPane>
      </motion.div>
    </div>
  );
}
