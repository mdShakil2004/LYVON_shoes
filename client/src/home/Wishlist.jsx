import React from 'react';
import ProductGrid from './ProductGrid';

const Wishlist = ({ wishlist, products, isDarkMode, addToCart, handle360View, setSelectedProduct, setCurrentPage }) => {
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <h1 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8">Your Wishlist</h1>
        {wishlistProducts.length === 0 ? (
          <div className="text-center">
            <p className="text-sm sm:text-lg mb-4">Your wishlist is empty.</p>
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-indigo-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <ProductGrid
            products={wishlistProducts}
            isDarkMode={isDarkMode}
            addToCart={addToCart}
            handle360View={handle360View}
            setSelectedProduct={setSelectedProduct}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;