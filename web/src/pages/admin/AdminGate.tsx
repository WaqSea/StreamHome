import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfileStore } from '../../stores/profileStore';
import { EmberBackground } from '../../themes/ember/EmberBackground';
import { ScanLines } from '../../themes/ember/ScanLines';
import { GlassPane } from '../../components/ui/GlassPane';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AdminCenter } from './AdminCenter';

const SESSION_KEY = 'streamhome_admin_session';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function AdminGate() {
  const activeProfile = useProfileStore(state => state.activeProfile);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const data = JSON.parse(session);
        if (Date.now() - data.timestamp < SESSION_TTL) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        // invalid session format
      }
    }
  }, []);

  if (activeProfile?.id !== "1") {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/*" element={<AdminCenter />} />
      </Routes>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mocking auth verification logic. 
      // Replace with actual API call if backend provides an /api/admin/verify endpoint
      if (password === '' || totp.length !== 6) {
        throw new Error('Invalid credentials');
      }
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      // Success
      localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Access Denied');
      setTotp('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-body)]" data-theme="ember">
      <EmberBackground />
      <ScanLines />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={error ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, scale: 1, x: 0 }}
        transition={error ? { duration: 0.4 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <GlassPane className="p-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border border-[var(--text-error)] bg-[rgba(255,0,0,0.1)] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,0,0,0.2)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          
          <h1 className="font-[family-name:var(--font-headline)] text-[var(--text-primary)] text-2xl font-bold tracking-widest uppercase mb-2">
            System Override
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-[var(--text-muted)] text-xs text-center mb-8 uppercase tracking-widest">
            Level 1 Authorization Required
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <Input 
              label="Admin Password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input 
              label="6-Digit TOTP" 
              type="text" 
              maxLength={6}
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              required
            />

            {error && (
              <div className="font-[family-name:var(--font-mono)] text-[var(--text-error)] text-xs text-center">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" disabled={isLoading} className="mt-4">
              {isLoading ? 'VERIFYING...' : 'DISENGAGE LOCKS'}
            </Button>
          </form>
        </GlassPane>
      </motion.div>
    </div>
  );
}
