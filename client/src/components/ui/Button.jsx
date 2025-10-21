import React from 'react';
import { Loader2 } from 'lucide-react';
import Icon from '../AppIcon'; // adjust path if needed

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  onClick, 
  disabled, 
  loading, 
  iconName, 
  iconPosition = 'right',
  isDarkMode 
}) => {
  const variants = {
    default: isDarkMode ? 'bg-accent text-background-dark hover:bg-accent/90' : 'bg-accent text-background hover:bg-accent/90',
    outline: isDarkMode ? 'border border-border-dark text-foreground-dark hover:bg-muted-dark' : 'border border-border text-foreground hover:bg-muted',
    ghost: isDarkMode ? 'text-foreground-dark hover:bg-muted-dark' : 'text-foreground hover:bg-muted',
  };

  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1 text-xs',
    icon: 'p-2',
  };

  const baseClasses = 'flex items-center justify-center rounded-md font-medium transition-colors';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

      {iconName && iconPosition === 'left' && (
        <span className="mr-2">
          <Icon name={iconName} size={16} />
        </span>
      )}

      {children}

      {iconName && iconPosition === 'right' && (
        <span className="ml-2">
          <Icon name={iconName} size={16} />
        </span>
      )}
    </button>
  );
};

export default Button;
