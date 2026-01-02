import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { SITE_OPTIONS, LOGO_URL } from '../constants';
import { Bell, Moon, Sun, LogOut, Menu, ChevronDown, CalendarDays } from 'lucide-react';

interface HeaderProps {
  user: User;
  currentSite: string;
  onSiteChange: (site: string) => void;
  onLogout: () => void;
  onThemeToggle: (isDark: boolean) => void;
  onToggleSidebar: () => void;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, currentSite, onSiteChange, onLogout, onThemeToggle, onToggleSidebar, onNavigate }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleThemeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    onThemeToggle(newMode);
  };

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-30 h-20 px-4 md:px-6 
        flex items-center justify-between 
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md shadow-glass border-b border-gray-200/50 dark:border-white/5' 
          : 'bg-transparent border-b border-transparent dark:border-white/5 bg-gradient-to-b from-black/5 to-transparent dark:from-white/5'}
      `}
    >
      {/* Left Section: Mobile/Tablet Menu & Logo */}
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <Menu size={24} />
        </button>

        <div 
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => onNavigate('Tableau de bord')}
        >
           <div className="relative w-9 h-9 md:w-11 md:h-11 flex-shrink-0">
             <div className="absolute inset-0 bg-brand-gold/30 rounded-full blur-md group-hover:blur-lg transition-all duration-500"></div>
             <div className="relative w-full h-full rounded-full border-2 border-white/20 bg-white overflow-hidden shadow-lg">
               <img src={LOGO_URL} alt="RS Logo" className="w-full h-full object-cover" />
             </div>
           </div>

          <div className="flex flex-col justify-center">
            <h1 className="font-serif font-bold text-sm md:text-lg tracking-tight leading-none text-gray-900 dark:text-white group-hover:text-brand-gold transition-colors duration-300 hidden xs:block">
              Résidence Samia
            </h1>
            
            {/* Site Selector / Display */}
            <div className="flex items-center mt-0.5 md:mt-1">
              {user.role === UserRole.Boss ? (
                <div className="relative group/select" onClick={(e) => e.stopPropagation()}>
                  <select 
                    value={currentSite}
                    onChange={(e) => onSiteChange(e.target.value)}
                    className="appearance-none bg-transparent text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer pr-4 hover:text-brand-gold transition-colors focus:outline-none"
                  >
                    {SITE_OPTIONS.map(site => (
                      <option key={site} value={site} className="text-gray-900 bg-white dark:bg-gray-800">{site}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              ) : (
                <span className="text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                  {currentSite}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: User Profile & Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Date & Time (Visible on mobile now) */}
        <div className="flex flex-col items-end border-r border-gray-200 dark:border-white/10 pr-3 md:pr-6 mr-1 md:mr-2">
           <div className="flex items-center gap-1 md:gap-2 text-gray-500 dark:text-gray-400 text-[9px] md:text-[10px] uppercase tracking-wider font-semibold">
              <CalendarDays size={10} className="md:w-3 md:h-3 text-[var(--role-color)]"/>
              <span className="hidden sm:inline">{currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
              <span className="sm:hidden">{currentTime.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })}</span>
           </div>
           <span className="text-xs md:text-base font-mono font-bold text-gray-800 dark:text-gray-200 leading-tight">
             {currentTime.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
           </span>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button 
            onClick={handleThemeToggle} 
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-yellow-500 transition-all duration-300"
            title="Changer de thème"
          >
            {darkMode ? <Moon size={18} className="w-4 h-4 md:w-[18px] md:h-[18px]" /> : <Sun size={18} className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
          </button>
          
          <div className="h-6 md:h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-1 hidden md:block"></div>

          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300 group"
            title="Se déconnecter"
          >
            <span className="hidden md:block text-xs font-semibold uppercase tracking-wide opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">Sortir</span>
            <LogOut size={18} className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};