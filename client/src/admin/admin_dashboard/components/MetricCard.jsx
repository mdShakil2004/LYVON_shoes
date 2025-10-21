import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, description, loading, isDarkMode }) => {
  return (
    <div className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} rounded-lg p-6 border shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold text-foreground mt-1 ${loading ? 'animate-pulse' : ''}`}>
            {loading ? '...' : value}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`text-xs font-medium ${changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>
              {loading ? '...' : change}
            </span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-muted-dark' : 'bg-muted'}`}>
          <Icon name={icon} size={24} className="text-accent" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;