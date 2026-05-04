import React from 'react';
import { Icon, IconName } from './Icon';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  renderOption?: (option: string) => string;
  icon?: IconName;
}

const Select: React.FC<SelectProps> = ({ label, options, renderOption, icon, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id || props.name} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {icon && <Icon name={icon} size={16} />}
        <span>{label}</span>
      </label>
      <select
        {...props}
        className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {renderOption ? renderOption(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;