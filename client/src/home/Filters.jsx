import React, { useState, useEffect, useRef } from 'react';

const Filters = ({ filters, setFilters, sizes, brands, isDarkMode }) => {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Focus trap for modal accessibility
  useEffect(() => {
    if (showFilters) {
      const focusableElements = filterRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      firstFocusableRef.current = firstElement;
      firstElement?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setShowFilters(false);
        }
        if (e.key === 'Tab') {
          const lastElement = focusableElements[focusableElements.length - 1];
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showFilters]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  return (
    <>
      {/* Apply Filters Button (Mobile Only) */}
      <button
        className={`block sm:hidden w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors !rounded-button text-sm font-medium ${isDarkMode ? 'bg-indigo-700' : 'bg-indigo-600'}`}
        onClick={() => setShowFilters(true)}
        aria-label="Open filters"
      >
        Apply Filters
      </button>

      {/* Filter Panel (Hidden on Mobile, Visible on Desktop) */}
      <div
        ref={filterRef}
        className={`${
          showFilters ? 'fixed inset-0 z-50 flex' : 'hidden sm:block'
        } sm:w-64 sm:p-6 sm:shadow-lg sm:rounded-lg sm:${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} sm:static sm:flex`}
      >
        <div
          className={`w-full max-w-[90vw] p-4 sm:p-6 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          } rounded-lg shadow-lg sm:shadow-none sm:bg-transparent transform transition-transform duration-300 ${
            showFilters ? 'translate-x-0' : 'translate-x-full'
          } sm:translate-x-0 flex-1 flex flex-col`}
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold">Filters</h3>
            <button
              className="sm:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowFilters(false)}
              aria-label="Close filters"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="mb-6">
              <h4 className="font-medium text-sm sm:text-base mb-2">Price Range</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm">₹{filters.priceRange[0]}</span>
                <input
                  type="range"
                  min="999"
                  max="15999"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [parseInt(e.target.value), filters.priceRange[1]],
                    })
                  }
                  className="flex-1 focus:ring-2 focus:ring-indigo-600"
                  aria-label={`Price range from ₹${filters.priceRange[0]} to ₹${filters.priceRange[1]}`}
                />
                <span className="text-xs sm:text-sm">₹{filters.priceRange[1]}</span>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-sm sm:text-base mb-2">Sizes</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      const newSizes = filters.sizes.includes(size)
                        ? filters.sizes.filter((s) => s !== size)
                        : [...filters.sizes, size];
                      setFilters({ ...filters, sizes: newSizes });
                    }}
                    className={`p-3 sm:p-4 text-sm sm:text-base rounded border transition-colors cursor-pointer ${
                      filters.sizes.includes(size)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isDarkMode
                        ? 'border-gray-600 hover:border-indigo-600'
                        : 'border-gray-300 hover:border-indigo-600'
                    }`}
                    aria-label={`Toggle size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-sm sm:text-base mb-2">Brands</h4>
              <div className="max-h-40 overflow-y-auto pr-2 overscroll-contain">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={(e) => {
                        const newBrands = e.target.checked
                          ? [...filters.brands, brand]
                          : filters.brands.filter((b) => b !== brand);
                        setFilters({ ...filters, brands: newBrands });
                      }}
                      className="mr-2 focus:ring-2 focus:ring-indigo-600"
                      aria-label={`Toggle brand ${brand}`}
                    />
                    <span className="text-sm sm:text-base">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => {
                setShowFilters(false);
              }}
              className="w-full sm:hidden bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors !rounded-button text-sm sm:text-base"
              aria-label="Apply filters and close"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setFilters({ priceRange: [999, 15999], sizes: [], brands: [] });
                setShowFilters(false);
              }}
              className="w-full bg-gray-500 text-white py-3 sm:py-4 rounded-lg hover:bg-gray-600 transition-colors !rounded-button text-sm sm:text-base"
              aria-label="Clear filters"
            >
              Clear Filters
            </button>
          </div>
        </div>
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/50 sm:hidden"
            onClick={() => setShowFilters(false)}
            aria-hidden="true"
          ></div>
        )}
      </div>
    </>
  );
};

export default Filters;