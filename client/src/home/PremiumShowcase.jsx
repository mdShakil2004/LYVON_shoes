import React from 'react';
import "../style/luxury_brand.css";

const PremiumShowcase = ({ products, isDarkMode, addToCart, handle360View, setSelectedProduct, setCurrentPage, searchQuery = '' }) => {
  const premiumProducts = products
    .filter(p => p.isPremium)
    .filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <section className={`py-8 sm:py-20 ${isDarkMode ? 'bg-black' : 'bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-5xl font-bold text-white mb-4">Luxury Collection</h2>
          <p className="text-base sm:text-xl text-gray-300">Experience the pinnacle of footwear craftsmanship</p>
        </div>
        {premiumProducts.length === 0 ? (
          <p className="text-center text-gray-400 text-sm sm:text-lg">No premium products match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {premiumProducts.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-gold-200"
              >
                <div className="relative">
                  <div
                    className="aspect-w-1 aspect-h-1 overflow-hidden cursor-pointer relative"
                    onClick={() => {
                      setSelectedProduct(product);
                      setCurrentPage('product');
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                        PREMIUM
                      </span>
                    </div>
                    {product.images360 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handle360View(product.id);
                        }}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-70 transition-colors cursor-pointer"
                        aria-label="View 360 images"
                      >
                        <i className="fas fa-sync-alt text-sm"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-bold text-lg sm:text-xl mb-2 text-white">{product.name}</h3>
                  <p className="text-gray-400 mb-3 text-sm sm:text-base">{product.brand}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star text-xs sm:text-sm ${i < Math.floor(product.rating) ? '' : 'text-gray-600'}`}></i>
                      ))}
                    </div>
                    <span className="ml-2 text-xs sm:text-sm text-gray-400">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg sm:text-2xl font-bold text-yellow-400">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="ml-2 text-xs sm:text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2 sm:py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-colors !rounded-button text-sm sm:text-base"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-6">
          <button
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2 sm:py-3 px-6 sm:px-8 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-colors !rounded-button text-sm sm:text-base flex items-center justify-center mx-auto"
          >
            View More Luxury
            <i className="fas fa-chevron-down ml-2 custom-bounce"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PremiumShowcase;