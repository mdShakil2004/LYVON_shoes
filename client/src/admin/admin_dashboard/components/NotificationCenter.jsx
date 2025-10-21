import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ onMarkAsRead, onMarkAllAsRead, onNotificationClick }) => {
  const notifications = [
    { id: 1, type: 'order', message: 'New order #1234 received', time: '5 min ago', isRead: false },
    { id: 2, type: 'inventory', message: 'Product "Air Max" low stock', time: '2 hours ago', isRead: false },
    { id: 3, type: 'customer', message: 'New customer feedback received', time: '1 day ago', isRead: true }
  ];

  const getIconForType = (type) => {
    switch (type) {
      case 'order': return 'ShoppingCart';
      case 'inventory': return 'Package';
      case 'customer': return 'Users';
      default: return 'Bell';
    }
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Icon name="Bell" size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                {notifications.filter(n => !n.isRead).length} unread notifications
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
            Mark all as read
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer ${
              notification.isRead ? 'opacity-60' : ''
            }`}
            onClick={() => onNotificationClick(notification)}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-muted rounded-lg">
                <Icon name={getIconForType(notification.type)} size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead('mark-read', notification.id);
                }}
              >
                <Icon name="Check" size={16} className="text-success" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border bg-muted/20">
        <Button variant="ghost" size="sm" className="w-full">
          View All Notifications
          <Icon name="ArrowRight" size={14} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationCenter;