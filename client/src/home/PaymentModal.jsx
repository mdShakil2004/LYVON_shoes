import React, { useState } from 'react';

const PaymentModal = ({ isDarkMode, setShowPaymentModal, handlePayment }) => {
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  const [upiId, setUpiId] = useState('');
  const [isUpiValid, setIsUpiValid] = useState(true);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [isCardValid, setIsCardValid] = useState(true);

  const validateUpiId = (id) => {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(id);
  };

  const validateCardDetails = () => {
    const { cardNumber, expiry, cvv } = cardDetails;
    const cardNumberRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3,4}$/;
    return cardNumberRegex.test(cardNumber) && expiryRegex.test(expiry) && cvvRegex.test(cvv);
  };

  const handleUpiPayment = (method) => {
    if (!upiId || !validateUpiId(upiId)) {
      setIsUpiValid(false);
      return;
    }
    const redirectUrls = {
      paytm: 'https://paytm.com',
      gpay: 'https://pay.google.com',
      phonepe: 'https://www.phonepe.com',
    };
    window.location.href = redirectUrls[method];
    handlePayment(method, upiId);
    setShowPaymentModal(false);
  };

  const handleCardPayment = (method) => {
    if (!validateCardDetails()) {
      setIsCardValid(false);
      return;
    }
    handlePayment(method, cardDetails);
    setShowPaymentModal(false);
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setIsUpiValid(true);
    setIsCardValid(true);
    setUpiId('');
    setCardDetails({ cardNumber: '', expiry: '', cvv: '' });
  };

  return (
    <div className=" inset-0 bg-black min-h-screen bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`relative p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-[90vw] sm:max-w-md md:max-w-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transform transition-all duration-300 scale-100 hover:scale-[1.02]`}
      >
        <button
          onClick={() => setShowPaymentModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close payment modal"
        >
          <i className="fas fa-times text-lg sm:text-xl"></i>
        </button>
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Choose Payment Method
        </h2>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center mb-4 sm:mb-6 gap-2 sm:gap-4">
          {['credit_card', 'paytm', 'gpay', 'phonepe', 'razorpay', 'cod'].map((method) => (
            <button
              key={method}
              onClick={() => handleMethodSelect(method)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${selectedMethod === method ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-900'} hover:bg-indigo-500 hover:text-white transition-colors`}
              aria-label={`Select ${method} payment method`}
            >
              {method.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
        {selectedMethod === 'credit_card' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Credit Card Details</h3>
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
              className={`w-full p-3 sm:p-4 rounded border text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isCardValid ? 'border-red-500' : ''}`}
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                className={`w-full p-3 sm:p-4 rounded border text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isCardValid ? 'border-red-500' : ''}`}
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                className={`w-full p-3 sm:p-4 rounded border text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isCardValid ? 'border-red-500' : ''}`}
              />
            </div>
            {!isCardValid && (
              <p className="text-red-500 text-sm text-center">Please enter valid card details</p>
            )}
            <button
              onClick={() => handleCardPayment('credit_card')}
              className={`w-full py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-all duration-200 ${isCardValid ? (isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-600') : 'bg-gray-300 text-gray-500 cursor-not-allowed'} text-white font-medium`}
            >
              Pay with Credit Card
            </button>
          </div>
        )}
        {['paytm', 'gpay', 'phonepe'].includes(selectedMethod) && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">UPI Payment</h3>
            <input
              type="text"
              placeholder="UPI ID (e.g., name@bank)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className={`w-full p-3 sm:p-4 rounded border text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isUpiValid ? 'border-red-500' : ''}`}
            />
            {!isUpiValid && (
              <p className="text-red-500 text-sm text-center">Please enter a valid UPI ID (e.g., name@bank)</p>
            )}
            <button
              onClick={() => handleUpiPayment(selectedMethod)}
              disabled={!upiId || !isUpiValid}
              className={`w-full py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-all duration-200 ${upiId && isUpiValid ? (isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-600') : 'bg-gray-300 text-gray-500 cursor-not-allowed'} text-white font-medium`}
            >
              Pay with {selectedMethod}
            </button>
          </div>
        )}
        {selectedMethod === 'razorpay' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Razorpay Payment</h3>
            <button
              onClick={() => {
                window.location.href = 'https://razorpay.com';
                handlePayment('razorpay');
                setShowPaymentModal(false);
              }}
              className={`w-full py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-all duration-200 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-600'} text-white font-medium`}
            >
              Pay with Razorpay
            </button>
          </div>
        )}
        {selectedMethod === 'cod' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Cash on Delivery</h3>
            <button
              onClick={() => {
                handlePayment('cod');
                setShowPaymentModal(false);
              }}
              className={`w-full py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-all duration-200 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-600'} text-white font-medium`}
            >
              Confirm Cash on Delivery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;