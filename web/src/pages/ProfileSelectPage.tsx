import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profileStore';
import { useThemeStore } from '../stores/themeStore';
import { getProfiles } from '../api/profiles';
import { Profile } from '../types/api';
import { ThemeId } from '../types/theme';
import { cn } from '../utils/cn';
import { GlassPane } from '../components/ui/GlassPane';
import { EmberBackground } from '../themes/ember/EmberBackground';
import { AuroraBackground } from '../themes/aurora/AuroraBackground';
import { CinemaBackground } from '../themes/cinema/CinemaBackground';
import { GeminiBackground } from '../themes/gemini/GeminiBackground';
import { ScanLines } from '../themes/ember/ScanLines';

export function ProfileSelectPage() {
  const navigate = useNavigate();
  const { profiles, setProfiles, selectProfile } = useProfileStore();
  const { setTheme } = useThemeStore();
  
  const [hoveredProfile, setHoveredProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProfiles = async () => {
      try {
        const data = await getProfiles();
        if (mounted) {
          setProfiles(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch profiles', err);
        if (mounted) setIsLoading(false);
      }
    };
    fetchProfiles();
    return () => { mounted = false; };
  }, [setProfiles]);

  const hoveredTheme: ThemeId = (hoveredProfile?.theme as ThemeId) || 'ember';

  const handleSelect = (profile: Profile) => {
    selectProfile(profile);
    setTheme(profile.theme as ThemeId || 'ember');
    navigate('/');
  };

  return (
    <div 
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[var(--bg-body)]"
      data-theme={hoveredTheme}
    >
      {hoveredTheme === 'ember' && <EmberBackground />}
      {hoveredTheme === 'aurora' && <AuroraBackground />}
      {hoveredTheme === 'cinema' && <CinemaBackground />}
      {hoveredTheme === 'gemini' && <GeminiBackground />}
      {hoveredTheme === 'ember' && <ScanLines />}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 flex flex-col items-center gap-16">
        <h1 className="font-[family-name:var(--font-headline)] text-[var(--text-primary)] text-4xl md:text-5xl font-light tracking-wide text-center">
          Select Identity
        </h1>

        {isLoading ? (
          <div className="text-[var(--text-muted)] font-[family-name:var(--font-mono)]">LOADING DATA...</div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {profiles.map((profile: Profile) => (
              <GlassPane
                key={profile.id}
                as="button"
                onClick={() => handleSelect(profile)}
                onMouseEnter={() => setHoveredProfile(profile)}
                onMouseLeave={() => setHoveredProfile(null)}
                spotlight={true}
                className={cn(
                  "w-[180px] h-[300px] flex flex-col items-center justify-center relative group",
                  "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "hover:scale-105 hover:border-[var(--glass-border-hover)]"
                )}
              >
                {profile.id === "1" && (
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-container)] animate-pulse" />
                    <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-widest text-[var(--text-muted)] group-hover:text-[var(--accent-container)] transition-colors">
                      [ADMIN]
                    </span>
                  </div>
                )}
                
                <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <text 
                    x="50%" y="50%" 
                    textAnchor="middle" dominantBaseline="central" 
                    fontSize="72px" 
                    fontFamily="var(--font-headline)"
                    fill="transparent" 
                    stroke="var(--text-primary)" 
                    strokeWidth="1px"
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </text>
                </svg>

                <div className="absolute bottom-6 w-full text-center px-4">
                  <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.1em] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate uppercase">
                    {profile.name}
                  </div>
                </div>
              </GlassPane>
            ))}

            {/* Add Profile Card */}
            <button
              className={cn(
                "w-[180px] h-[300px] flex flex-col items-center justify-center relative group",
                "rounded-[var(--radius)] border border-dashed border-[var(--glass-border)] bg-transparent",
                "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "hover:scale-105 hover:bg-[var(--glass-fill)] hover:border-solid hover:border-[var(--glass-border-hover)]"
              )}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <div className="absolute bottom-6 w-full text-center font-[family-name:var(--font-mono)] text-[12px] tracking-[0.1em] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors uppercase">
                Add New
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
