import React from 'react';

const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+61', country: 'Australia' },
  { code: '+81', country: 'Japan' },
  { code: '+86', country: 'China' },
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+65', country: 'Singapore' },
];

const Checkout = ({ isDarkMode, checkoutStep, setCheckoutStep, shippingAddress, setShippingAddress, handleCheckout }) => {
  const isAddressComplete =
    shippingAddress.street &&
    shippingAddress.city &&
    shippingAddress.state &&
    shippingAddress.zipCode &&
    shippingAddress.countryCode &&
    shippingAddress.mobileNumber;

  const isValidMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-[90vw] sm:max-w-2xl md:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Checkout</h1>
        {checkoutStep === 'address' && (
          <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg sm:text-2xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Street"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                className={`p-3 rounded border w-full text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-600`}
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className={`p-3 rounded border w-full text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-600`}
              />
              <input
                type="text"
                placeholder="State"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                className={`p-3 rounded border w-full text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-600`}
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={shippingAddress.zipCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                className={`p-3 rounded border w-full text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-600`}
              />
              <div className="flex gap-2">
                <select
                  value={shippingAddress.countryCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, countryCode: e.target.value })}
                  className={`p-3 rounded border w-full sm:w-1/3 text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-600`}
                >
                  <option value="">Country Code</option>
                  {countryCodes.map((code) => (
                    <option key={code.code} value={code.code}>{code.code} ({code.country})</option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={shippingAddress.mobileNumber}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, mobileNumber: e.target.value })}
                  className={`p-3 rounded border w-full text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-600 ${shippingAddress.mobileNumber && !isValidMobile(shippingAddress.mobileNumber) ? 'border-red-500' : ''}`}
                />
              </div>
            </div>
            {shippingAddress.mobileNumber && !isValidMobile(shippingAddress.mobileNumber) && (
              <p className="text-red-500 text-sm mt-2">Please enter a valid 10-digit mobile number</p>
            )}
            <button
              onClick={() => setCheckoutStep('payment')}
              disabled={!isAddressComplete || !isValidMobile(shippingAddress.mobileNumber)}
              className={`w-full py-3 rounded-lg transition-colors !rounded-button mt-4 text-sm sm:text-base ${isAddressComplete && isValidMobile(shippingAddress.mobileNumber) ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
            >
              Add Address
            </button>
          </div>
        )}
        {checkoutStep === 'payment' && (
          <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg sm:text-2xl font-semibold mb-4">Confirm Shipping Address</h2>
            <div className="mb-6 text-sm sm:text-base">
              <p className="text-gray-600 dark:text-gray-300">
                {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Mobile: {shippingAddress.countryCode} {shippingAddress.mobileNumber}
              </p>
              <button
                onClick={() => setCheckoutStep('address')}
                className="mt-2 text-indigo-600 hover:text-indigo-700 flex items-center text-sm sm:text-base"
                aria-label="Edit shipping address"
              >
                <i className="fas fa-edit mr-2"></i>
                Edit Address
              </button>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors !rounded-button text-sm sm:text-base"
            >
              Complete Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;