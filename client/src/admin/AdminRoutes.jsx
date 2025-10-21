import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './admin_dashboard/AdminDashboard';
import AdminProductManagement from './admin_dashboard_managents/AdminProductManagement';
import AdminSidebar from './components/AdminSidebar';
import { products as initialProducts, brands } from '../assets/assets';
import Icon from '../components/AppIcon';
import OrderManagement from './admin_dashboard_managents/components/OrderManagement';

// Placeholder components for additional routes
const OrdersPage = ({ isDarkMode }) => (
  <div className={`p-6 ${isDarkMode ? 'bg-background-dark text-foreground-dark' : 'bg-background text-foreground'}`}>
    <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
    <p className="text-muted-foreground">Manage customer orders, track shipments, and process returns.</p>
  </div>
);

const CustomersPage = ({ isDarkMode }) => (
  <div className={`flex items-center justify-center min-h-screen p-4 sm:p-6 ${isDarkMode ? 'bg-background-dark text-foreground-dark' : 'bg-background text-foreground'}`}>
    <div className="text-center max-w-md w-full">
      <h2 className="text-2xl font-semibold mb-4">Customer Management</h2>
      <p className="text-muted-foreground">View and manage customer profiles and interactions.</p>
      <p className="text-muted-foreground">Manage customer orders, track shipments, and process returns.</p>
      <p className=" text-red-600 text-muted-foreground">work in progress...</p>
    </div>
  </div>
);

const SettingsPage = ({ isDarkMode }) => (
  <div className={`flex items-center justify-center min-h-screen p-4 sm:p-6 ${isDarkMode ? 'bg-background-dark text-foreground-dark' : 'bg-background text-foreground'}`}>
    <div className="text-center max-w-md w-full">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <p className="text-muted-foreground">Configure admin preferences, user roles, and system settings.</p>
      <p className="text-muted-foreground">Manage customer orders, track shipments, and process returns.</p>
      <p className=" text-red-600 text-muted-foreground">work in progress...</p>
    </div>
  </div>
);

const NotFoundPage = ({ isDarkMode }) => (
  <div
    className={`flex items-center justify-center min-h-screen px-4 sm:px-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}
  >
    <div className="text-center max-w-md w-full">
      <Icon
        name="AlertTriangle"
        size={56}
        className="text-red-500 mx-auto mb-6 animate-pulse"
      />
      <h2 className="text-3xl font-bold mb-3">404 - Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      <button
        onClick={() => window.history.back()}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200 
          ${
            isDarkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
      >
        <Icon name="ArrowLeft" size={20} />
        <span>Go Back</span>
      </button>
    </div>
  </div>
);


// Sample orders data (replace with your actual data source)
const initialOrders = [
  {
    id: 1,
    createdAt: '2025-08-01T10:00:00Z',
    totalAmount: 1500,
    status: { status: 'processing' },
    customerName: 'John Doe',
    phone: '9876543210',
    email: 'john.doe@example.com',
    shippingAddress: {
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
    },
    paymentStatus: 'Paid',
  },
  {
    id: 2,
    createdAt: '2025-08-02T12:30:00Z',
    totalAmount: 2500,
    status: { status: 'shipped' },
    customerName: 'Jane Smith',
    phone: '8765432109',
    email: 'jane.smith@example.com',
    shippingAddress: {
      street: '456 Park Ave',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
    },
    paymentStatus: 'Pending',
  },
  {
    id: 3,
    createdAt: '2025-08-03T15:45:00Z',
    totalAmount: 1800,
    status: { status: 'delivered' },
    customerName: 'Alice Johnson',
    phone: '7654321098',
    email: 'alice.johnson@example.com',
    shippingAddress: {
      street: '789 Oak Rd',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
    },
    paymentStatus: 'Paid',
  },
  {
    id: 4,
    createdAt: '2025-08-03T15:45:00Z',
    totalAmount: 1800,
    status: { status: 'delivered' },
    customerName: 'Alice Johnson',
    phone: '7654321098',
    email: 'alice.johnson@example.com',
    shippingAddress: {
      street: '789 Oak Rd',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
    },
    paymentStatus: 'Paid',
  },
  {
    id: 5,
    createdAt: '2025-08-03T15:45:00Z',
    totalAmount: 1800,
    status: { status: 'delivered' },
    customerName: 'Alice Johnson',
    phone: '7654321098',
    email: 'alice.johnson@example.com',
    shippingAddress: {
      street: '789 Oak Rd',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
    },
    paymentStatus: 'Paid',
  },
];

const AdminRoutes = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Default to collapsed
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);

  // CRUD functions
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: products.length + 1, // Simple ID generation
    };
    setProducts([...products, newProduct]);
    
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(products.map(p => (p.id === productId ? { ...p, ...updatedData } : p)));
    
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    
  };

  // Toggle dark mode
  

  // CRUD function for orders
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map(order =>
        order.id === orderId ? { ...order, status: { status: newStatus } } : order
      )
    );
    
  };

  // Toggle sidebar
  const handleSidebarToggle = (collapsed) => {
    
    setIsSidebarCollapsed(collapsed);
  };

  // // Debug route changes
  // useEffect(() => {
  //   console.log('Current route:', window.location.pathname);
  // }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        userRole="super admin"
      />
      
      {/* Main content area */}
      <div className="flex-1 w-full">
        <Routes>
          <Route
            path="/"
            element={
              <AdminDashboard
                isDarkMode={isDarkMode}
                products={products}
                addProduct={addProduct}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
                isCollapsed={isSidebarCollapsed}

              />
            }
          />
          <Route
            path="product-management"
            element={
              <AdminProductManagement
                isDarkMode={isDarkMode}
                products={products}
                brands={brands}
                addProduct={addProduct}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
                isCollapsed={isSidebarCollapsed}
              />
            }
          />
          <Route path="orders" element={<OrderManagement orders={orders} updateOrderStatus={updateOrderStatus} isDarkMode={isDarkMode} isCollapsed={isSidebarCollapsed} />} />
          <Route path="customers" element={<CustomersPage isDarkMode={isDarkMode} />} />
          <Route path="settings" element={<SettingsPage isDarkMode={isDarkMode} />} />
          <Route path="*" element={<NotFoundPage isDarkMode={isDarkMode} />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;