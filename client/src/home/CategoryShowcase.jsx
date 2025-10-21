import React from 'react';

const CategoryShowcase = ({ isDarkMode, setCurrentPage }) => {
  const categories = [
    {
      category: 'men',
      title: "Men's Collection",
      image: "https://readdy.ai/api/search-image?query=stylish%20mens%20dress%20shoes%20and%20sneakers%20collection%20on%20clean%20white%20background%20with%20professional%20lighting%20showcasing%20masculine%20design%20and%20premium%20quality&width=400&height=300&seq=men-cat&orientation=landscape"
    },
    {
      category: 'women',
      title: "Women's Collection",
      image: "https://readdy.ai/api/search-image?query=elegant%20womens%20heels%20and%20athletic%20shoes%20collection%20on%20clean%20white%20background%20with%20professional%20lighting%20showcasing%20feminine%20design%20and%20premium%20quality&width=400&height=300&seq=women-cat&orientation=landscape"
    },
    {
      category: 'unisex',
      title: "Unisex Collection",
      image: "https://readdy.ai/api/search-image?query=trendy%20unisex%20streetwear%20sneakers%20collection%20on%20clean%20white%20background%20with%20professional%20lighting%20showcasing%20versatile%20urban%20design%20and%20premium%20quality&width=400&height=300&seq=unisex-cat&orientation=landscape"
    }
  ];

  return (
    <section className={`py-8 sm:py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {categories.map((item) => (
            <div
              key={item.category}
              className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              onClick={() => setCurrentPage(item.category)}
            >
              <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 sm:h-64 object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">{item.title}</h3>
                <button className="bg-white text-black px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors !rounded-button text-sm sm:text-base">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;