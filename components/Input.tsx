import React, { useState } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, className, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full mb-3">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--role-color)] dark:group-focus-within:text-brand-gold transition-colors duration-300 pointer-events-none z-10">
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          className={`
            w-full p-[14px] 
            ${Icon ? 'pl-10' : ''} 
            ${isPasswordType ? 'pr-10' : ''}
            border border-gray-300 dark:border-gray-600 
            rounded-lg 
            bg-[#fefefe] dark:bg-gray-800 
            text-gray-800 dark:text-white 
            placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 dark:focus:ring-brand-gold dark:focus:border-transparent
            transition-all duration-300 
            ${className}
          `}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer p-1 z-20"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};