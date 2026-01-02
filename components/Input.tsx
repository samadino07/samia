import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="w-full mb-3">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        className={`w-full p-[14px] border border-gray-300 rounded-lg bg-[#fefefe] focus:outline-none focus:border-[2px] focus:border-brand-focus focus:shadow-focus-glow transition-all duration-300 text-gray-800 placeholder-gray-400 ${className}`}
        {...props}
      />
    </div>
  );
};