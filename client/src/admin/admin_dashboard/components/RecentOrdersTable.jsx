import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentOrdersTable = ({ orders, onViewOrder, onUpdateStatus, isDarkMode }) => {
  const statusColors = {
    pending: 'bg-warning/10 text-warning',
    shipped: 'bg-success/10 text-success',
    delivered: 'bg-blue-500/10 text-blue-500',
    cancelled: 'bg-destructive/10 text-destructive'
  };

  return (
    <div className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} rounded-lg overflow-hidden border`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">{orders.length} orders in queue</p>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="ArrowRight" size={16} className="mr-2" />
            View All Orders
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">Order ID</th>
              <th className="text-left p-4 font-medium text-foreground">Customer</th>
              <th className="text-left p-4 font-medium text-foreground">Date</th>
              <th className="text-left p-4 font-medium text-foreground">Total</th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-right p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <span className="text-sm text-foreground">#{order.id}</span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm text-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="p-4 text-sm font-medium text-foreground">
                  {/* ₹{order.totalAmount.toLocaleString('en-IN')} */}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewOrder(order.id)}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onUpdateStatus(order.id, order.status === 'pending' ? 'shipped' : 'delivered')}
                    >
                      <Icon name="Check" size={16} className="text-success" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;