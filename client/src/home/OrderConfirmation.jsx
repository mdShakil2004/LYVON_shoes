import React from 'react';

const OrderConfirmation = ({ currentOrder, isDarkMode, setCurrentPage, products, getCartRecommendations }) => {
  if (!currentOrder) return null;

  const renderRecommendations = (recommendations, title) => (
    <div className={`mt-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div
              className="aspect-w-1 aspect-h-1 overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedProduct(product);
                setCurrentPage('product');
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover object-top hover:scale-105 transition-transform duration-300"
              />
              {product.isPremium && (
                <div className="absolute top-2 left-2">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold">
                    PREMIUM
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-semibold mb-1 text-sm">{product.name}</h4>
              <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${product.isPremium ? 'text-yellow-500' : 'text-indigo-600'}`}>
                  ₹{product.price.toLocaleString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                  }}
                  className={`px-3 py-1 rounded text-xs transition-colors !rounded-button whitespace-nowrap cursor-pointer ${
                    product.isPremium
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
          <div className="text-center mb-8">
            <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-500">Thank you for shopping with LyVON</p>
          </div>
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Order ID:</span>
              <span>{currentOrder.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Order Date:</span>
              <span>{new Date(currentOrder.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Estimated Delivery:</span>
              <span>{currentOrder.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Payment Status:</span>
              <span className="text-green-500 font-semibold">
                <i className="fas fa-check-circle mr-2"></i>
                {currentOrder.paymentStatus}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {currentOrder.items.map((item) => {
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
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total Amount:</span>
              <span>₹{currentOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-8 text-center space-y-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer mr-4"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => setCurrentPage('my-orders')}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
            >
              View Orders
            </button>
          </div>
          {currentOrder.items.length > 0 && renderRecommendations(getCartRecommendations(), "You might also like")}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;