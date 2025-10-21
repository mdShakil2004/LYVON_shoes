import React, { useState } from 'react';
import Icon from '../../../components/AppIcon'; // Adjust path based on your project structure

const OrderManagement = ({ orders, updateOrderStatus, isDarkMode,isCollapsed }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Filter orders based on search query (id, customerName, phone, email)
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchQuery) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine orders to display (first 3 or all based on showAll)
  const displayedOrders = showAll ? filteredOrders : filteredOrders.slice(0, 3);

  return (
    <div
      className={`   border border-slate-600 mx-auto p-6 min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-[280px]'} ${
        isDarkMode ? 'bg-background-dark text-foreground-dark' : 'bg-background text-foreground'
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
      <p className="text-muted-foreground mb-6">
        Manage customer orders, track shipments, and process returns.
      </p>
      {/* Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by order ID, customer, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2 rounded-full border-2 focus:outline-none focus:border-indigo-600 transition-colors text-sm w-full ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-foreground-dark placeholder-gray-400'
                : 'bg-white border-gray-300 text-foreground placeholder-gray-500'
            }`}
            aria-label="Search orders by ID, customer, phone, or email"
          />
          <Icon
            name="Search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
          />
        </div>
      </div>
      {/* Order List and Details */}
      <div
        className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-lg p-6`}
      >
        <h3 className="text-xl font-semibold mb-4">Order List</h3>
        {filteredOrders.length === 0 && (
          <p className="text-sm text-muted-foreground">No orders match your search.</p>
        )}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {displayedOrders.map((order) => (
            <div
              key={order.id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } ${selectedOrder?.id === order.id ? 'border-2 border-indigo-600' : ''}`}
              onClick={() => setSelectedOrder(order)}
              role="button"
              aria-label={`Select order ${order.id}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-base">Order #{order.id}</h4>
                  <p className='text-sm text-muted-foreground'> Name: {order.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status.status.charAt(0).toUpperCase() + order.status.status.slice(1)}
                </div>
              </div>
              <p className="text-sm mt-2">Total: ₹{order.totalAmount.toLocaleString()}</p>
            </div>
          ))}
        </div>
        {filteredOrders.length > 3 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isDarkMode
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
              aria-label={showAll ? 'View fewer orders' : 'View more orders'}
            >
              {showAll ? 'View Less' : 'View More'}
            </button>
          </div>
        )}
        {selectedOrder && (
          <div className="mt-6 p-4 border-t border-gray-600">
            <h3 className="text-lg font-semibold mb-3">Order Details</h3>
            <p className="text-sm">
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>
            <p className="text-sm">
              <strong>Customer:</strong> {selectedOrder.customerName}
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {selectedOrder.phone}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {selectedOrder.email}
            </p>
            <p className="text-sm">
              <strong>Shipping:</strong> {selectedOrder.shippingAddress.street},{' '}
              {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
              {selectedOrder.shippingAddress.zipCode}
            </p>
            <p className="text-sm">
              <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
            </p>
            <p className="text-sm">
              <strong>Total:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Update Status</h4>
              <select
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                className={`p-2 rounded-lg border w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-foreground-dark'
                    : 'bg-white border-gray-300 text-foreground'
                }`}
                aria-label="Update order status"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;