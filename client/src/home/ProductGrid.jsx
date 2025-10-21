import React from 'react';

const ProductGrid = ({ products, isDarkMode, addToCart, handle360View, setSelectedProduct, setCurrentPage }) => {
  return (
    <div className="flex-1">

      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="relative">
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
                  className="w-full h-64 object-cover  hover:scale-105 transition-transform duration-300"
                />
                {product.isPremium && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold">
                      PREMIUM
                    </span>
                  </div>
                )}
                {product.images360 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handle360View(product.id);
                    }}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors cursor-pointer"
                  >
                    <i className="fas fa-sync-alt text-sm"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star text-sm ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}`}></i>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">({product.reviews})</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className={`text-xl font-bold ${product.isPremium ? 'text-yellow-500' : 'text-indigo-600'}`}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => addToCart(product.id)}
                className={`w-full py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer ${
                  product.isPremium
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;