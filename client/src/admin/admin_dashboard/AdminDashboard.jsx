import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricCard from './components/MetricCard';
import RecentOrdersTable from './components/RecentOrdersTable';
import LowStockAlert from './components/LowStockAlert';
import SalesChart from './components/SalesChart';
import QuickActions from './components/QuickActions';
import NotificationCenter from './components/NotificationCenter';

const AdminDashboard = ({ products, isDarkMode, addProduct, updateProduct, deleteProduct ,isCollapsed }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');

  // Sample orders data (unchanged, as it doesn't depend on assets.js)
  const orders = [
    { id: 1, customerName: 'John Doe', customerEmail: 'john@example.com', createdAt: '2025-08-01', totalAmount: 2999, status: 'delivered' },
    { id: 2, customerName: 'Jane Smith', customerEmail: 'jane@example.com', createdAt: '2025-08-02', totalAmount: 4599, status: 'pending' },
    { id: 3, customerName: 'Alice Johnson', customerEmail: 'alice@example.com', createdAt: '2025-08-03', totalAmount: 8999, status: 'shipped' },
  ];

  const adminUser = {
    name: "Admin User",
    email: "admin@stryde.com",
    role: "Super Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  };

  const metricsData = [
    {
      title: "Today's Sales",
      value: `₹${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}`,
      change: "+12.5%",
      changeType: "positive",
      icon: "TrendingUp",
      description: "vs yesterday"
    },
    {
      title: "Total Orders",
      value: orders.length.toString(),
      change: "+8.3%",
      changeType: "positive",
      icon: "ShoppingCart",
      description: "today"
    },
    {
      title: "New Customers",
      value: new Set(orders.map(o => o.customerName)).size.toString(),
      change: "+15.7%",
      changeType: "positive",
      icon: "Users",
      description: "this week"
    },
    {
      title: "Inventory Alerts",
      value: products.filter(p => p.stock <= 10).length.toString(),
      change: "-2",
      changeType: "negative",
      icon: "AlertTriangle",
      description: "low stock items"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    // console.log('Updating order status:', orderId, newStatus);
  };

  const handleViewInventory = () => {
    navigate('/admin/product-management');
  };

  const handleRestockProduct = (productId, size, newStock) => {
    const product = products.find(p => p.id === productId);
    const updatedSizeStock = { ...product.sizeStock, [size]: parseInt(newStock) };
    const totalStock = Object.values(updatedSizeStock).reduce((sum, stock) => sum + stock, 0);
    updateProduct(productId, { ...product, sizeStock: updatedSizeStock, stock: totalStock });
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    // console.log('Date range changed:', newRange);
  };

 

  const handleNotificationAction = (action, notificationId) => {
    // console.log('Notification action:', action, notificationId);
  };

  const handleNotificationClick = (notification) => {
    switch (notification?.type) {
      case 'order': navigate('/admin-orders'); break;
      case 'inventory': navigate('/admin-product-management'); break;
      case 'customer': navigate('/admin-customers'); break;
      default: break;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
     
      <main className={`transition-all duration-100 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-[280px] '}`}>
        <header className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} p-6 border-b`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {adminUser?.name}. Here's what's happening with your store today.
              </p>
            </div>
           
          </div>
        </header>
        <div className="p-6 space-y-6">
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData?.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  description={metric?.description}
                  loading={loading}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SalesChart onDateRangeChange={handleDateRangeChange} orders={orders} products={products} isDarkMode={isDarkMode} />
              <RecentOrdersTable
                orders={orders}
                onViewOrder={handleViewOrder}
                onUpdateStatus={handleUpdateOrderStatus}
                isDarkMode={isDarkMode}
              />
            </div>
            <div className="space-y-6">
              <LowStockAlert
                products={products}
                onViewInventory={handleViewInventory}
                onRestockProduct={handleRestockProduct}
                isDarkMode={isDarkMode}
              />
              <NotificationCenter
                onMarkAsRead={handleNotificationAction}
                onMarkAllAsRead={() => handleNotificationAction('mark-all-read')}
                onNotificationClick={handleNotificationClick}
              />
            </div>
          </div>
           <section className="rounded-lg p-6 border shadow-lg  border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">System Status</h3>
                <div className="text-green-500 bg-green-500/10 px-2 py-1 rounded-full text-xs font-medium">
                  All Systems Operational
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Icon name="Server" size={20} className="text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Server Status</p>
                    <p className="text-xs text-green-500">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border  rounded-lg">
                  <Icon name="Database" size={20} className="text-green-500" />
                  <div>
                    <p className="text-sm  font-medium">Database</p>
                    <p className="text-xs text-green-500">Connected</p>
                  </div>
                </div>
                <div className="flex items-center border space-x-3 p-3  rounded-lg">
                  <Icon name="Zap" size={20} className="text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Performance</p>
                    <p className="text-xs text-green-500">Optimal</p>
                  </div>
                </div>
              </div>
            </section>


        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;