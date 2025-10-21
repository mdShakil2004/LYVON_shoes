import React from 'react';
import { Search } from 'lucide-react';
import Icon from '../AppIcon'; // Adjust path if needed

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  iconName, 
  className = '', 
  disabled, 
  isDarkMode 
}) => {
  const wrapperClasses = `relative ${className}`;
  const labelClasses = `block text-sm font-medium mb-2 ${isDarkMode ? 'text-foreground-dark' : 'text-foreground'}`;
  const iconClasses = `absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-muted-foreground-dark' : 'text-muted-foreground'}`;
  const inputBaseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent';
  const inputPaddingLeft = iconName ? 'pl-10' : '';
  const inputColorScheme = isDarkMode
    ? 'bg-background-dark border-border-dark text-foreground-dark'
    : 'bg-background border-border text-foreground';
  const inputDisabled = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const inputClasses = `${inputBaseClasses} ${inputPaddingLeft} ${inputColorScheme} ${inputDisabled}`;

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <div className="relative">
        {iconName && (
          <span className={iconClasses}>
            {iconName === 'Search' ? (
              <Search className="h-4 w-4" />
            ) : (
              <Icon name={iconName} size={16} />
            )}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      </div>
    </div>
  );
};

export default Input;
