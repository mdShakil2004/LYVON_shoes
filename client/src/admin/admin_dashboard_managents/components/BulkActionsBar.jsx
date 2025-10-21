import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedCount, onBulkAction, onClearSelection, isVisible }) => {
  if (!isVisible) return null;

  const actions = [
    { id: 'activate', label: 'Activate', icon: 'Eye', color: 'text-success' },
    { id: 'deactivate', label: 'Deactivate', icon: 'EyeOff', color: 'text-warning' },
    { id: 'delete', label: 'Delete', icon: 'Trash2', color: 'text-destructive' },
    { id: 'export', label: 'Export', icon: 'Download', color: 'text-accent' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-2xl bg-white z-10 lg:ml-64">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Icon name="CheckSquare" size={20} className="text-accent" />
          <span className="text-sm font-medium text-foreground">
            {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {actions.map(action => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => onBulkAction(action.id)}
              className={action.color}
            >
              <Icon name={action.icon} size={16} className="mr-2" />
              {action.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            <Icon name="X" size={16} className="mr-2" />
            Clear Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;