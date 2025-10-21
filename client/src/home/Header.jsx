import React, { useState, useEffect, useRef } from 'react';
import { header_logo } from '../assets/hero';

const Header = ({
  currentPage,
  setCurrentPage,
  isDarkMode,
  toggleTheme,
  searchQuery,
  setSearchQuery,
  isLoggedIn,
  cartItems,
  setCartItems,
  showCart,
  setShowCart,
  handleCheckoutProcess,
  products,
  setShowLoginModal

}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const [showSearchBar,setShowSearchBar]=useState(false);
  const [userData,setUserData]=useState(JSON.parse(localStorage.getItem('userData')));
  // Close dropdowns when clicking outside


  useEffect(()=>{
    const users = JSON.parse(localStorage.getItem('userData') || '[]');
    if(users){
      setUserData(users);
    }
  },[])



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleSearchBar=()=>{
    setShowSearchBar(!showSearchBar);
  }

  const logOut=()=>{
    //  const users = JSON.parse(localStorage.getItem('userData') || '[]');
     localStorage.removeItem('userData');
     setShowLoginModal(true);
      // setCurrentPage('login');
      setShowProfileDropdown(false);

  }

  return (
    <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Left - Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <img src={header_logo.header_Logo} alt="LyVON Logo" className="h-[50px] w-12 object-contain" />
          <h1 className="text-2xl font-extrabold tracking-tight">LyVON</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          {['home', 'men', 'women', 'unisex', 'about'].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`cursor-pointer capitalize hover:text-indigo-600 transition-colors ${
                currentPage === page ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              {page}
            </button>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleSearchBar}
          >
            <i className="fas fa-search text-lg"></i>
          </button>

          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search shoes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-full border-2 focus:outline-none focus:border-indigo-600 transition-colors text-sm ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          {/* Theme toggle */}
            <button
            onClick={toggleTheme}
            className="hidden md:block p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
          </button>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <i className="fas fa-user text-lg"></i>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setCurrentPage('my-orders');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-box mr-2"></i> My Orders
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('wishlist');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-heart mr-2"></i> Wishlist
                    </button>
                    <button
  onClick={() => {
    logOut();
    setShowProfileDropdown(false);
    
  }}
  className="w-full flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 
             hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 
             text-sm sm:text-base cursor-pointer"
>
  <i className="fas fa-sign-out-alt text-gray-600 dark:text-gray-300"></i>
  <span className="truncate">Log Out</span>
</button>

                  </>
                ) : (
                  <button
                    onClick={() => {
                      
                     setShowLoginModal(true)
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i> Log In
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <i className="fas fa-shopping-cart text-lg"></i>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>


            {/* Cart Dropdown */}
            {showCart && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
                {cartItems.length === 0 ? (
                  <div className="p-6 text-center">
                    <i className="fas fa-shopping-cart text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-4">Start shopping to add items to your cart</p>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        setCurrentPage('home');
                      }}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Shopping Cart</h3>
                    <div className="max-h-96 overflow-y-auto">
                      {cartItems.map((item) => {
                        const product = products.find(p => p.id === item.productId);
                        if (!product) return null;
                        return (
                          <div key={`${item.productId}-${item.size}`} className="flex items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                            <div className="ml-4 flex-1">
                              <h4 className="font-semibold">{product.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Size: {item.size}</p>
                              <div className="flex items-center mt-2">
                                <button
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      setCartItems(cartItems.map(cartItem =>
                                        cartItem.productId === item.productId && cartItem.size === item.size
                                          ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                          : cartItem
                                      ));
                                    }
                                  }}
                                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <span className="mx-3">{item.quantity}</span>
                                <button
                                  onClick={() => {
                                    const maxStock = product.sizeStock?.[item.size] || 0;
                                    if (item.quantity < maxStock) {
                                      setCartItems(cartItems.map(cartItem =>
                                        cartItem.productId === item.productId && cartItem.size === item.size
                                          ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                          : cartItem
                                      ));
                                    }
                                  }}
                                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{(product.price * item.quantity).toLocaleString()}</p>
                              <button
                                onClick={() => setCartItems(cartItems.filter(cartItem =>
                                  !(cartItem.productId === item.productId && cartItem.size === item.size)
                                ))}
                                className="text-red-500 hover:text-red-700 mt-2"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">Total:</span>
                        <span className="text-xl font-bold">
                          ₹{cartItems.reduce((total, item) => {
                            const product = products.find(p => p.id === item.productId);
                            return total + (product?.price || 0) * item.quantity;
                          }, 0).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                         
                          setShowCart(false);
                          handleCheckoutProcess();
                        }}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger for Mobile */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-lg"></i>
          </button>
        </div>
      </div>
        {showSearchBar && (
        <div className="md:hidden px-4 pb-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search shoes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-full border-2 focus:outline-none focus:border-indigo-600 transition-colors text-sm ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
          <i className="fas fa-search absolute left-9 mt-[-29px] text-gray-400 text-sm"></i>
        </div>
      )}

      {/* Mobile Menu */}
     {showMobileMenu && (
        <div className="md:hidden px-6 pb-4  bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className='flex flex-row'>
            {['home', 'men', 'women', 'unisex', 'about'].map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                setShowMobileMenu(false);
              }}
              className={`block w-full text-left py-2  capitalize hover:text-indigo-600 transition-colors ${
                currentPage === page ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              {page}
            </button>
          ))}
          </div>

          {/* Theme toggle inside menu */}
          <div className="flex items-center justify-between mt-4 py-2 border-t border-gray-300 dark:border-gray-700">
            <span className="font-semibold">Theme</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
            </button>
          </div>
          {
            userData.email && (
              <div className="flex items-center justify-between mt-4 py-2 border-t border-gray-300 dark:border-gray-700">
                <span className="font-semibold">Logout</span>
                <button
                  onClick={logOut}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <i className="fas fa-sign-out-alt text-lg"></i>
                </button>
              </div>
            )
          }

        </div>
      )}
    </header>
  );
};

export default Header;
