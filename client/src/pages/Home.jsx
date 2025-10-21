

import React, { useState, useEffect, useRef } from 'react';
import { brands, sizes } from '../assets/assets.js';
import Header from '../home/Header.jsx';
import Hero from '../home/Hero.jsx';
import PremiumShowcase from '../home/PremiumShowcase.jsx';
import CategoryShowcase from '../home/CategoryShowcase.jsx';
import Filters from '../home/Filters.jsx';
import ProductGrid from '../home/ProductGrid.jsx';
import ProductDetail from '../home/ProductDetail.jsx';
import MyOrders from '../home/MyOrders.jsx';
import OrderConfirmation from '../home/OrderConfirmation.jsx';
import PaymentModal from '../home/PaymentModal.jsx';
import Modal360 from '../home/Modal360.jsx';
import AboutPage from '../home/AboutPage.jsx';
import LoginModal from '../home/LoginModal.jsx';
import Wishlist from '../home/Wishlist.jsx';
import Checkout from '../home/Checkout.jsx';
import Newsletter from '../home/Newsletter.jsx';
import Footer from '../home/Footer.jsx';
import Chatbot from '../chat/Chatbot.jsx';

const Home = ({
  isDarkMode,
  setIsDarkMode,
  productList,
  cart,
  addToCart,
  removeFromCart,
  wishlist,
  addToWishlist,
  removeFromWishlist,
  setWishlist
}) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [userOrders, setUserOrders] = useState([
    {
      id: 'ORD123456',
      items: [{ productId: 1, size: '9', quantity: 1 }],
      totalAmount: 2999,
      status: { status: 'delivered', date: '2025-07-25', description: 'Your order has been delivered' },
      paymentStatus: 'paid',
      estimatedDelivery: '2025-07-25',
      createdAt: '2025-07-20',
      customerName: 'John Doe',
      shippingAddress: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
      paymentId: 'PAY123456',
      trackingNumber: 'TRK123456'
    },
    {
      id: 'ORD123457',
      items: [{ productId: 2, size: '8', quantity: 1 }],
      totalAmount: 4299,
      status: { status: 'shipped', date: '2025-07-28', description: 'Your order is on its way' },
      paymentStatus: 'paid',
      estimatedDelivery: '2025-07-31',
      createdAt: '2025-07-27',
      customerName: 'John Doe',
      shippingAddress: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
      paymentId: 'PAY123457',
      trackingNumber: 'TRK123457'
    }
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [cartItems, setCartItems] = useState(cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', zipCode: ''
  });
  const [filters, setFilters] = useState({
    priceRange: [999, 15999], sizes: [], brands: []
  });
  const [current360Image, setCurrent360Image] = useState(0);
  const [is360View, setIs360View] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const primiumRef=useRef(null)
  
  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  const filteredProducts = React.useMemo(() => {
    return productList.filter(product => {
      const matchesCategory = currentPage === 'home' || product.category === currentPage;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesSizes = filters.sizes.length === 0 || filters.sizes.some(size => product.sizes.includes(size));
      const matchesBrands = filters.brands.length === 0 || filters.brands.includes(product.brand);
      return matchesCategory && matchesSearch && matchesPrice && matchesSizes && matchesBrands;
    });
  }, [productList, currentPage, searchQuery, filters]);

  const getRecommendations = (currentProduct, limit = 4) => {
    if (!currentProduct) return [];
    return productList
      .filter(product => product.id !== currentProduct.id)
      .map(product => {
        let score = 0;
        if (product.category === currentProduct.category) score += 3;
        if (product.brand === currentProduct.brand) score += 2;
        const priceDiff = Math.abs(product.price - currentProduct.price);
        if (priceDiff <= 1000) score += 3;
        else if (priceDiff <= 2000) score += 2;
        else if (priceDiff <= 3000) score += 1;
        if (product.rating >= 4.5) score += 1;
        if (product.isPremium === currentProduct.isPremium) score += 1;
        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);
  };

  const getCartRecommendations = () => {
    if (cartItems.length === 0) return [];
    const cartProductIds = cartItems.map(item => item.productId);
    const cartProducts = productList.filter(p => cartProductIds.includes(p.id));
    const categoryCount = {};
    let totalPrice = 0;
    cartProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      totalPrice += product.price;
    });
    const avgPrice = totalPrice / cartProducts.length;
    const dominantCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );
    return productList
      .filter(product => !cartProductIds.includes(product.id))
      .map(product => {
        let score = 0;
        if (product.category === dominantCategory) score += 3;
        if (product.category === 'unisex') score += 1;
        const priceDiff = Math.abs(product.price - avgPrice);
        if (priceDiff <= 1500) score += 2;
        else if (priceDiff <= 3000) score += 1;
        if (product.rating >= 4.5) score += 1;
        if (product.reviews >= 50) score += 1;
        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.product);
  };

  const addToCartLocal = (productId, size) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    const product = productList.find(p => p.id === productId);
    if (!product) return;
    let selectedSizeForCart = size || selectedSize;
    if (!selectedSizeForCart) selectedSizeForCart = product.sizes[0];
    if (product.sizeStock && product.sizeStock[selectedSizeForCart] <= 0) return;
    const existingItem = cartItems.find(item => item.productId === productId && item.size === selectedSizeForCart);
    if (existingItem) {
      if (product.sizeStock && existingItem.quantity >= product.sizeStock[selectedSizeForCart]) return;
      const updatedCart = cartItems.map(item =>
        item.productId === productId && item.size === selectedSizeForCart
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCart);
      addToCart(productId, selectedSizeForCart);
    } else {
      const updatedCart = [...cartItems, { productId, size: selectedSizeForCart, quantity: 1 }];
      setCartItems(updatedCart);
      addToCart(productId, selectedSizeForCart);
    }
  };

  const toggleWishlist = (productId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      removeFromWishlist(productId);
    } else {
      setWishlist([...wishlist, productId]);
      addToWishlist(productId);
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setShowPaymentModal(true);
    setCurrentPage('payment');
  };

  const handlePayment = async (paymentMethod) => {
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_STRIPE_SECRET_KEY'
        },
        body: JSON.stringify({
          amount: cartItems.reduce((total, item) => {
            const product = productList.find(p => p.id === item.productId);
            return total + (product?.price || 0) * item.quantity;
          }, 0) * 100,
          currency: 'inr'
        })
      });
      const paymentIntent = await response.json();
      const newOrder = {
        id: `ORD${Math.random().toString(36).substr(2, 9)}`,
        items: cartItems,
        totalAmount: cartItems.reduce((total, item) => {
          const product = productList.find(p => p.id === item.productId);
          return total + (product?.price || 0) * item.quantity;
        }, 0),
        status: {
          status: 'processing',
          date: new Date().toISOString().split('T')[0],
          description: 'Order confirmed and being processed'
        },
        paymentStatus: 'pending',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        createdAt: new Date().toISOString(),
        customerName: 'John Doe',
        shippingAddress: shippingAddress,
        paymentId: paymentIntent.id
      };
      setCurrentOrder(newOrder);
      setUserOrders([...userOrders, newOrder]);
      setCartItems([]);
      removeFromCart();
      setCurrentPage('order-confirmation');
    } catch (error) {
      alert('Payment failed:');
    }
  };

  const handleLogin = (email, password) => {
    if (email === 'admin@stryde.com' && password === 'admin123') {
      setIsAdmin(true);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      window.location.href = '/admin';
    } else {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    }
  };

  const handleCheckoutProcess = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setCurrentPage('checkout');
    setCheckoutStep('address');
  };

  const initializeRazorpay = (orderId) => {
    const options = {
      key: 'YOUR_RAZORPAY_KEY',
      amount: currentOrder?.totalAmount ? currentOrder.totalAmount * 100 : 0,
      currency: 'INR',
      name: 'Stryde',
      description: 'Premium Footwear Purchase',
      order_id: orderId,
      handler: (response) => handlePaymentSuccess(response),
      prefill: { email: 'customer@example.com' },
      theme: { color: '#4F46E5' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaymentSuccess = (response) => {
    if (currentOrder) {
      const updatedOrder = {
        ...currentOrder,
        paymentStatus: 'paid',
        paymentId: response.razorpay_payment_id
      };
      setCurrentOrder(updatedOrder);
      setUserOrders([...userOrders, updatedOrder]);
      setCurrentPage('order-confirmation');
      setCartItems([]);
      removeFromCart();
    }
  };

  const handle360View = (productId) => {
    const product = productList.find(p => p.id === productId);
    if (product && product.images360) {
      setSelectedProduct(product);
      setIs360View(true);
      setCurrent360Image(0);
    }
  };

  useEffect(() => {
    let interval;
    if (is360View && selectedProduct?.images360) {
      interval = setInterval(() => {
        setCurrent360Image(prev => (prev + 1) % selectedProduct.images360.length);
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [is360View, selectedProduct]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const cartButton = document.getElementById('cartButton');
      const target = event.target;
      if (showCart && cartButton && !cartButton.contains(target) && !target.closest('.cart-dropdown')) {
        setShowCart(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCart]);

  const renderProductListingPage = () => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-[90vw] sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 capitalize">
          {currentPage === 'unisex' ? 'Unisex Collection' : `${currentPage}'s Collection`}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <Filters filters={filters} setFilters={setFilters} sizes={sizes} brands={brands} isDarkMode={isDarkMode} />
          <ProductGrid
            products={filteredProducts}
            isDarkMode={isDarkMode}
            addToCart={addToCartLocal}
            handle360View={handle360View}
            setSelectedProduct={setSelectedProduct}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn}
        cartItems={cartItems}
        setCartItems={setCartItems}
        showCart={showCart}
        setShowCart={setShowCart}
        handleCheckoutProcess={handleCheckoutProcess}
        products={productList}
        setShowLoginModal={setShowLoginModal}
      />

      {showLoginModal && (
        <LoginModal
          isDarkMode={isDarkMode}
          setShowLoginModal={setShowLoginModal}
          handleLogin={handleLogin}
        />
      )}
      {is360View && (
        <Modal360
          selectedProduct={selectedProduct}
          current360Image={current360Image}
          setCurrent360Image={setCurrent360Image}
          setIs360View={setIs360View}
        />
      )}
      {showPaymentModal && (
        <PaymentModal
          isDarkMode={isDarkMode}
          setShowPaymentModal={setShowPaymentModal}
          handlePayment={handlePayment}
        />
      )}
      <style>{`
        .!rounded-button {
          border-radius: 0.75rem;
        }
        body {
          min-height: 1024px;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      
      {currentPage === 'home' && (
        <>
          <Hero setCurrentPage={setCurrentPage} />
          {searchQuery ? (
            <section className={`py-8 sm:py-12 lg:py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="max-w-[90vw] sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 lg:mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Search Results for "{searchQuery}"
                </h2>
                {filteredProducts.length === 0 ? (
                  <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">No products found. Try a different search.</p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <Filters
                      filters={filters}
                      setFilters={setFilters}
                      sizes={sizes}
                      brands={brands}
                      isDarkMode={isDarkMode}
                    />
                    <ProductGrid
                      products={filteredProducts}
                      isDarkMode={isDarkMode}
                      addToCart={addToCartLocal}
                      handle360View={handle360View}
                      setSelectedProduct={setSelectedProduct}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </section>
          ) : (
            <>
              <PremiumShowcase
                products={productList}
                searchQuery={searchQuery}
                isDarkMode={isDarkMode}
                addToCart={addToCartLocal}
                handle360View={handle360View}
                setSelectedProduct={setSelectedProduct}
                setCurrentPage={setCurrentPage}
              />
              <CategoryShowcase isDarkMode={isDarkMode} setCurrentPage={setCurrentPage} />
              <section className={`py-8 sm:py-12 lg:py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="max-w-[90vw] sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Featured Products
                  </h2>
                  <ProductGrid
                    products={productList.slice(0, 3)}
                    isDarkMode={isDarkMode}
                    addToCart={addToCartLocal}
                    handle360View={handle360View}
                    setSelectedProduct={setSelectedProduct}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </section>
              <section className={`py-8 sm:py-12 lg:py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-[90vw] sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Customer Favorites
                  </h2>
                  <ProductGrid
                    products={productList.filter(p => p.rating >= 4.7).sort((a, b) => b.reviews - a.reviews).slice(0, 6)}
                    isDarkMode={isDarkMode}
                    addToCart={addToCartLocal}
                    handle360View={handle360View}
                    setSelectedProduct={setSelectedProduct}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </section>
              <Newsletter isDarkMode={isDarkMode} />
            </>
          )}
        </>
      )}
      {currentPage === 'about' && <AboutPage isDarkMode={isDarkMode} />}
      {currentPage === 'product' && (
        <ProductDetail
          selectedProduct={selectedProduct}
          isDarkMode={isDarkMode}
          setCurrentPage={setCurrentPage}
          addToCart={addToCartLocal}
          toggleWishlist={toggleWishlist}
          handle360View={handle360View}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          wishlist={wishlist}
          getRecommendations={getRecommendations}
          setSelectedProduct={setSelectedProduct}
        />
      )}
      {currentPage === 'order-confirmation' && (
        <OrderConfirmation
          currentOrder={currentOrder}
          isDarkMode={isDarkMode}
          setCurrentPage={setCurrentPage}
          products={productList}
          getCartRecommendations={getCartRecommendations}
        />
      )}
      {(currentPage === 'men' || currentPage === 'women' || currentPage === 'unisex') && renderProductListingPage()}
      {currentPage === 'my-orders' && (
        <MyOrders
          userOrders={userOrders}
          isDarkMode={isDarkMode}
          products={productList}
        />
      )}
      {currentPage === 'wishlist' && (
        <Wishlist
          wishlist={wishlist}
          products={productList}
          isDarkMode={isDarkMode}
          addToCart={addToCartLocal}
          handle360View={handle360View}
          setSelectedProduct={setSelectedProduct}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'checkout' && (
        <Checkout
          isDarkMode={isDarkMode}
          checkoutStep={checkoutStep}
          setCheckoutStep={setCheckoutStep}
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
          handleCheckout={handleCheckout}
        />
      )}
      <Footer isDarkMode={isDarkMode} />
      <Chatbot />
    </div>
  );
};

export default Home;