import React from 'react';
import { UserRole } from '../types';
import { MENU_ITEMS, LOGO_URL } from '../constants';
import { 
  X, 
  LayoutDashboard, 
  Wallet, 
  Package, 
  CalendarDays, 
  Hotel, 
  Shirt, 
  UtensilsCrossed, 
  Users, 
  BarChart3, 
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activeItem: string;
  onItemClick: (item: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to map menu items to icons
const getIconForMenuItem = (item: string) => {
  switch (item) {
    case 'Tableau de bord': return LayoutDashboard;
    case 'Caisse': return Wallet;
    case 'Gestion de stock': return Package;
    case 'Planning des repas': return CalendarDays;
    case 'Appartements': return Hotel;
    case 'Blanchisserie': return Shirt;
    case 'Bons de restauration': return UtensilsCrossed;
    case 'Les employés': return Users;
    case 'Rapports': return BarChart3;
    case 'Présence': return Clock;
    default: return ChevronRight;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ role, activeItem, onItemClick, isOpen, onClose }) => {
  const items = MENU_ITEMS[role] || [];

  return (
    <>
      {/* Mobile Overlay with Blur */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside 
        className={`
          fixed md:fixed left-0 top-0 bottom-0 w-[270px] 
          flex flex-col
          bg-[var(--role-color)]
          transition-transform duration-300 ease-in-out z-50
          shadow-2xl md:shadow-none
          border-r border-white/5
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Sidebar Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 pointer-events-none z-0"></div>
        
        {/* Header Section (Mobile Close) */}
        <div className="relative z-10 flex items-center justify-between p-6 md:pt-8">
           <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-xl border-2 border-white/20 flex-shrink-0">
                 <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-white font-bold text-base leading-tight truncate">Résidence Samia</h3>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium">Menu Principal</p>
              </div>
           </div>
           <button 
             onClick={onClose} 
             className="text-white/70 hover:text-white md:hidden p-1 hover:bg-white/10 rounded-full transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        {/* Navigation Items */}
        <nav className="relative z-10 flex-1 px-4 overflow-y-auto custom-scrollbar pt-4">
          <ul className="space-y-1.5">
            {items.map((item) => {
              const isActive = activeItem === item;
              const Icon = getIconForMenuItem(item);
              
              return (
                <li key={item}>
                  <button
                    onClick={() => { onItemClick(item); onClose(); }}
                    className={`
                      group w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3.5
                      font-medium text-sm tracking-wide relative overflow-hidden
                      ${isActive 
                        ? 'bg-white text-[var(--role-color)] shadow-lg scale-[1.02]' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'}
                    `}
                  >
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold"></div>
                    )}
                    
                    <Icon 
                      size={20} 
                      className={`transition-colors duration-300 ${isActive ? 'text-[var(--role-color)]' : 'text-white/50 group-hover:text-white'}`} 
                    />
                    
                    <span className="z-10">{item}</span>
                    
                    {/* Hover Shine Effect */}
                    {!isActive && (
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"></div>
                    )}
                    
                    {/* Right Arrow for Active */}
                    {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="relative z-10 p-6 border-t border-white/10 bg-black/20 mt-auto">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-gold to-yellow-600 flex items-center justify-center text-[10px] font-bold text-black shadow-lg ring-2 ring-white/10">
                 RS
              </div>
              <div className="flex flex-col">
                 <span className="text-white text-xs font-bold">Résidence Samia</span>
                 <span className="text-white/40 text-[10px]">v2.4.0 (Pro)</span>
              </div>
           </div>
        </div>
      </aside>
    </>
  );
};