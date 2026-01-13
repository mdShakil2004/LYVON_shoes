import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { sizes, brands } from './assets/assets.js';  // for filters
import { api } from './services/api'; // Centralized API

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [productList, setProductList] = useState([]);
  const [cart, setCart] = useState([]); // Local cart (session-based)
  const [wishlist, setWishlist] = useState([]); // Server-side wishlist
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [999, 15999],
    sizes: [],
    brands: [],
  });
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const products = await api.getProducts();
        setProductList(products || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProductList([]); // Fallback to empty
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch wishlist if logged in (on mount + after login)
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const wishlistProducts = await api.getWishlist();
          setWishlist(wishlistProducts.map(p => p._id || p.id));
        } catch (err) {
          console.error('Failed to fetch wishlist:', err);
          setWishlist([]);
        }
      }
    };
    fetchWishlist();

    // Optional: Listen for storage changes (multi-tab login)
    window.addEventListener('storage', fetchWishlist);
    return () => window.removeEventListener('storage', fetchWishlist);
  }, []);

  // Client-side filtering (on fetched products)
  const getFilteredProducts = () => {
    return productList
      .filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
      .filter(p => filters.sizes.length === 0 || filters.sizes.some(size => p.sizes.includes(size)))
      .filter(p => filters.brands.length === 0 || filters.brands.includes(p.brand));
  };

  // Local cart (can be moved to backend later)
  const addToCart = (productId, size) => {
    const product = productList.find(p => p.id === productId || p._id === productId);
    if (product && (!product.sizeStock || product.sizeStock[size] > 0)) {
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

  // Server-side wishlist toggle
  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to manage wishlist');
      return;
    }

    const isInWishlist = wishlist.includes(productId);
    try {
      if (isInWishlist) {
        await api.removeFromWishlist(productId);
      } else {
        await api.addToWishlist(productId);
      }
      // Refresh wishlist
      const updated = await api.getWishlist();
      setWishlist(updated.map(p => p._id || p.id));
    } catch (err) {
      console.error('Wishlist update failed:', err);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {loadingProducts ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-2xl">Loading products...</p>
        </div>
      ) : (
        <Routes>
          <Route
            path="/*"
            element={
              <Home
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                productList={productList}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist} // Updated to async server call
                setWishlist={setWishlist}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filters={filters}
                setFilters={setFilters}
                sizes={sizes}
                brands={brands}
                getFilteredProducts={getFilteredProducts} // Now uses fetched products
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
