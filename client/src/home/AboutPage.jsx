import React from 'react';

const AboutPage = ({ isDarkMode }) => {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About LyVON</h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Crafting premium footwear that blends style, comfort, and innovation.
          </p>
        </section>

        {/* Mission Section */}
        <section className={`rounded-lg shadow-lg p-8 mb-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            At LyVON, our mission is to empower every step with confidence and elegance. We design footwear that combines cutting-edge technology with timeless aesthetics, ensuring you look and feel your best whether you're running, exploring, or celebrating life's moments.
          </p>
        </section>

        {/* Story Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Founded in 2020, LyVON emerged from a passion for redefining footwear. Our team of designers and engineers set out to create sneakers and heels that don't compromise on style or comfort. From urban streets to gala events, LyVON has become synonymous with quality and innovation, trusted by customers worldwide.
            </p>
          </div>
          {/* <div className="flex items-center justify-center">
            <img
              src="https://readdy.ai/api/search-image?query=luxury%20footwear%20store%20interior%20with%20modern%20design%20and%20premium%20sneakers%20display%20on%20clean%20white%20background%20with%20professional%20studio%20lighting&width=400&height=400&seq=store1&orientation=squarish"
              alt="LyVON Store Interior"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div> */}
        </section>

        {/* Values Section */}
        <section className={`rounded-lg shadow-lg p-8 mb-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Quality</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Every pair is crafted with premium materials and meticulous attention to detail.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Innovation</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                We integrate advanced technology to enhance comfort and performance.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Sustainability</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Committed to eco-friendly practices and sustainable materials.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Join the LyVON Community</h2>
          <p className={`text-base mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Discover our latest collections and experience footwear designed for every journey.
          </p>
          <button
            onClick={() => window.location.href = '/#shop'}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } !rounded-button`}
          >
            Shop Now
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;