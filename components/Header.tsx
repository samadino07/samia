import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { SITE_OPTIONS, LOGO_URL } from '../constants';
import { Bell, MessageSquare, Moon, Sun, LogOut } from 'lucide-react';

interface HeaderProps {
  user: User;
  currentSite: string;
  onSiteChange: (site: string) => void;
  onLogout: () => void;
  onThemeToggle: (isDark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, currentSite, onSiteChange, onLogout, onThemeToggle }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleThemeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    onThemeToggle(newMode);
  };

  // Styles mapping to CSS variables
  const headerStyle = { backgroundColor: 'var(--bg-header)', color: 'var(--text-main)' };
  const logoStyle = { backgroundColor: 'var(--role-color)' };
  const selectStyle = { backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' };

  return (
    <header 
      className="h-16 px-5 flex items-center justify-between shadow-sm transition-colors duration-300 fixed top-0 left-0 right-0 z-10"
      style={headerStyle}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Logo Circle with RS text as fallback if needed, but using Image per user request */}
         <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white font-bold" style={logoStyle}>
           RS
         </div>

        {/* App Name */}
        <span className="font-semibold text-[15px] tracking-tight">Résidence Samia</span>
        
        {/* Site Info */}
        <div className="flex items-center gap-2 ml-2 text-[13px] opacity-90">
          {user.role === UserRole.Boss ? (
            <>
              <span className="hidden sm:inline font-medium">Site:</span>
              <select 
                value={currentSite}
                onChange={(e) => onSiteChange(e.target.value)}
                className="py-1 px-2 rounded-md outline-none border-none cursor-pointer text-[13px] font-medium"
                style={selectStyle}
              >
                {SITE_OPTIONS.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </>
          ) : (
            <span className="font-medium">Site: {currentSite}</span>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-[16px]">
        <span className="cursor-pointer hover:opacity-80 transition-opacity" title="Notifications">🔔</span>
        <span className="cursor-pointer hover:opacity-80 transition-opacity" title="Messages">💬</span>
        
        <span className="text-[14px] opacity-90 hidden sm:block tabular-nums" id="clock">
          {currentTime.toLocaleTimeString('fr-FR')} | {currentTime.toLocaleDateString('fr-FR')}
        </span>

        <span 
          onClick={handleThemeToggle} 
          className="cursor-pointer hover:opacity-80 transition-opacity text-[18px]" 
          title="Mode sombre/clair"
        >
          🌙
        </span>
        
        <button 
          onClick={onLogout} 
          className="cursor-pointer hover:opacity-80 transition-opacity text-red-500" 
          title="Déconnexion"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      </div>
    </header>
  );
};