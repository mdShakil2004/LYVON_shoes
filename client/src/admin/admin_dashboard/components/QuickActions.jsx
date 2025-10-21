import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { id: 'add-product', label: 'Add Product', icon: 'Plus', color: 'text-accent' },
    { id: 'process-orders', label: 'Process Orders', icon: 'ShoppingCart', color: 'text-blue-500' },
    { id: 'customer-support', label: 'Customer Support', icon: 'Users', color: 'text-purple-500' },
    { id: 'inventory-check', label: 'Inventory Check', icon: 'Package', color: 'text-warning' },
    { id: 'sales-report', label: 'Sales Report', icon: 'TrendingUp', color: 'text-success' },
    { id: 'bulk-update', label: 'Bulk Update', icon: 'RefreshCw', color: 'text-orange-500' }
  ];


  
  return (
    <div className="bg-card rounded-lg p-6 border border-slate-700 ">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map(action => (
          <Button
            key={action.id}
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => onActionClick(action.id)}
          >
            <Icon name={action.icon} size={16} className={action.color} />
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;