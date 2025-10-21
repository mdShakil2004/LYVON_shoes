import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { products, sizes, brands } from './assets/assets.js';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [productList, setProductList] = useState(products);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Added search state
  const [filters, setFilters] = useState({
    priceRange: [999, 15999],
    sizes: [],
    brands: [],
  });

  // Helper to filter products
  const getFilteredProducts = (productsToFilter, query, filters) => {
    return productsToFilter
      .filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
      .filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
      .filter(p => filters.sizes.length === 0 || filters.sizes.some(size => p.sizes.includes(size)))
      .filter(p => filters.brands.length === 0 || filters.brands.includes(p.brand));
  };

  const addToCart = (productId, size) => {
    const product = productList.find(p => p.id === productId);
    if (product && product.sizeStock[size] > 0) {
      const existingItem = cart.find(item => item.productId === productId && item.size === size);
      if (existingItem) {
        setCart(cart.map(item =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, { productId, size, quantity: 1 }]);
      }
    }
  };

  const removeFromCart = (productId, size) => {
    setCart(cart.filter(item => !(item.productId === productId && item.size === size)));
  };

  const addToWishlist = (productId) => {
    if (!wishlist.includes(productId)) {
      setWishlist([...wishlist, productId]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(id => id !== productId));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              productList={productList}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              wishlist={wishlist}
              addToWishlist={addToWishlist}
              removeFromWishlist={removeFromWishlist}
              setWishlist={setWishlist}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
              sizes={sizes}
              brands={brands}
              getFilteredProducts={getFilteredProducts}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;