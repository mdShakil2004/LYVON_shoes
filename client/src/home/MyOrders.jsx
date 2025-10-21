import React from 'react';

const MyOrders = ({ userOrders, isDarkMode, products }) => {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div key={order.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order No #{order.id}</h2>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-2 rounded-full ${
                  order.status.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status.status.charAt(0).toUpperCase() + order.status.status.slice(1)}
                </div>
              </div>
              <div className="space-y-4">
                {order.items.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center">
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number: {order.trackingNumber}</p>
                    <p className="text-sm text-gray-500">Estimated Delivery: {order.estimatedDelivery}</p>
                  </div>
                  <p className="text-xl font-bold">Total: ₹{order.totalAmount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;