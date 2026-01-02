import React from 'react';
import { UserRole } from '../types';
import { MENU_ITEMS } from '../constants';

interface SidebarProps {
  role: UserRole;
  activeItem: string;
  onItemClick: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeItem, onItemClick }) => {
  const items = MENU_ITEMS[role] || [];

  return (
    <aside 
      className="hidden md:block w-[230px] min-h-screen pt-[84px] fixed left-0 top-0 custom-scrollbar overflow-y-auto transition-colors duration-300 z-0"
      style={{ backgroundColor: 'var(--role-color)' }}
    >
      <ul className="list-none p-0 m-0">
        {items.map((item) => (
          <li
            key={item}
            onClick={() => onItemClick(item)}
            className={`
              px-5 py-[14px] cursor-pointer text-white transition-all duration-200
              ${activeItem === item 
                ? 'bg-white/15 opacity-100 font-medium' 
                : 'opacity-85 hover:bg-white/10 hover:opacity-100'}
            `}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
};