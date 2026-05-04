
import React from 'react';
import { Icon, IconName } from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: IconName;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', icon, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-400',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
};

export default Button;
