import React from 'react';

const ProductDetail = ({
  selectedProduct,
  isDarkMode,
  setCurrentPage,
  addToCart,
  toggleWishlist,
  handle360View,
  selectedSize,
  setSelectedSize,
  wishlist,
  getRecommendations,setSelectedProduct
}) => {
  if (!selectedProduct) return null;
  const recommendations = getRecommendations(selectedProduct);

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
                className="w-full h-48 object-cover  hover:scale-105 transition-transform duration-300"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setCurrentPage('home')}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-700 cursor-pointer"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Products
        </button>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg mb-4 relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-96 object-cover"
              />
              {selectedProduct.images360 && (
                <button
                  onClick={() => handle360View(selectedProduct.id)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg hover:bg-opacity-70 transition-colors cursor-pointer"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  360° View
                </button>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold">{selectedProduct.name}</h1>
              {selectedProduct.isPremium && (
                <span className="ml-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                  PREMIUM
                </span>
              )}
            </div>
            <p className="text-lg text-gray-500 mb-4">{selectedProduct.brand}</p>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(10)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < Math.floor(selectedProduct.rating) ? '' : 'text-gray-300'}`}></i>
                ))}
              </div>
              <span className="ml-2 text-gray-500">({selectedProduct.reviews} reviews)</span>
            </div>
            <div className="mb-6">
              <span className={`text-3xl font-bold ${selectedProduct.isPremium ? 'text-yellow-500' : 'text-indigo-600'}`}>
                ₹{selectedProduct.price.toLocaleString()}
              </span>
              {selectedProduct.originalPrice && (
                <span className="ml-3 text-xl text-gray-500 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((size) => {
                  const isOutOfStock = selectedProduct.sizeStock && selectedProduct.sizeStock[size] <= 0;
                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        selectedSize === size
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isOutOfStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-indigo-600'
                      }`}
                      disabled={isOutOfStock}
                    >
                      {size}
                      {isOutOfStock && <span className="block text-xs">Out of Stock</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">{selectedProduct.description}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => selectedSize && addToCart(selectedProduct.id, selectedSize)}
                className={`flex-1 py-3 rounded-lg transition-colors !rounded-button whitespace-nowrap ${
                  !selectedSize
                    ? 'bg-gray-400 cursor-not-allowed'
                    : selectedProduct.isPremium
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 cursor-pointer'
                    : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                } text-white`}
                disabled={!selectedSize}
              >
                {!selectedSize ? 'Select Size' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className={`px-6 py-3 border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  wishlist.includes(selectedProduct.id)
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-gray-300 hover:border-indigo-600'
                }`}
              >
                <i className="fas fa-heart"></i>
              </button>
            </div>
            <div className="mt-8">
              <p className="text-sm text-gray-500">
                <i className="fas fa-truck mr-2"></i>
                Free shipping on orders over ₹2000
              </p>
            </div>
          </div>
        </div>
        {recommendations.length > 0 && renderRecommendations(recommendations, "You might also like")}
      </div>
    </div>
  );
};

export default ProductDetail;