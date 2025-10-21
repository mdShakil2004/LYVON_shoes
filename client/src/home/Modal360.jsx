import React, { useEffect, useState } from 'react';

const Modal360 = ({ selectedProduct, current360Image, setCurrent360Image, setIs360View }) => {
  const [fade, setFade] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (selectedProduct?.images360) {
      selectedProduct.images360.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    let interval;
    if (selectedProduct?.images360 && !isPaused) {
      interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrent360Image(prev => (prev + 1) % selectedProduct.images360.length);
          setFade(true);
        }, 300);
      }, 6000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedProduct, setCurrent360Image, isPaused]);

  if (!selectedProduct?.images360) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl p-4 sm:p-8 w-full max-w-[90vw] sm:max-w-4xl shadow-2xl">
        <button
          onClick={() => setIs360View(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close 360 view modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
          {selectedProduct.name} - 360° View
        </h2>
        <div
          className="flex items-center justify-center overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <img
            src={selectedProduct.images360[current360Image]}
            alt={`${selectedProduct.name} 360 view`}
            className={`w-full h-64 sm:h-80 md:h-[28rem] object-contain transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
          />
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
            {isPaused ? 'Paused' : 'Playing'}
          </div>
        </div>
        <div className="flex justify-center space-x-3 mt-4 sm:mt-6">
          {selectedProduct.images360.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setCurrent360Image(index);
                  setFade(true);
                }, 300);
              }}
              className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full transition-colors duration-200 ${current360Image === index ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`View 360 image ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal360;