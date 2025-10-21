import React, { useRef, useState, useEffect } from 'react';
import { header_logo, hero_data } from '../assets/hero';
import '../style/shoes.css'

const Hero = ({ setCurrentPage }) => {
  const shoeRef = useRef(null);
  const [currentShoe, setCurrentShoe] = useState(hero_data.hero_shoes1);

  // Array of shoe images to cycle through
  const shoeImages = [
    hero_data.hero_shoes1,
    hero_data.hero_shoes2,
    hero_data.hero_shoes3,
    hero_data.hero_shoes4,
    hero_data.hero_shoes5,
  ];

  // Cycle through shoes every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShoe((prevShoe) => {
        const currentIndex = shoeImages.indexOf(prevShoe);
        const nextIndex = (currentIndex + 1) % shoeImages.length;
        return shoeImages[nextIndex];
      });
    }, 7000); // 7 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [shoeImages]);

  const handleMouseMove = (e) => {
    const rect = shoeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10; // max 10 deg tilt
    const rotateY = ((x - centerX) / centerX) * 15; // max 15 deg tilt

    shoeRef.current.style.transform = `perspective(800px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    shoeRef.current.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <section
      className="relative h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700"
      style={{
        backgroundImage: `url(${hero_data.hero_bg_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

      {/* 🔥 Logo Overlay Poster */}
      <div className="absolute inset-0 flex items-center justify-center z-5">
        <img
          src={header_logo.Header_logo_LyVON}
          alt="LyVON Logo"
          className="w-[300px] max-w-[60vw] opacity-25 pointer-events-none"
        />
      </div>

      {/* Interactive Shoe Tilt with Animation */}
      <div
        ref={shoeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 transition-transform duration-200 ease-out animate-slide"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <img
          src={currentShoe}
          alt="LYVON Shoes"
          className="w-[600px] max-w-[95vw] object-contain block select-none pointer-events-none"
          draggable="false"
        />
      </div>

      {/* Text */}
      <div
        className="absolute z-20 text-center text-white w-full px-4"
        style={{ bottom: '12%' }}
      >
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Walk with Intention.<br />
          <span className="text-yellow-400">Own the LyVON Life.</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mt-2">
          Where craftsmanship meets bold design — footwear made to empower every LyVON.
        </p>
        <button
          onClick={() => setCurrentPage('men')}
          className="mt-4 bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-colors"
        >
          Discover LyVON
        </button>
      </div>
    </section>
  );
};

export default Hero;
