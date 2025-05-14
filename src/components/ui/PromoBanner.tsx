// src/components/ui/PromoBanner.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface PromoBannerProps {
  onClick?: () => void;
  className?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onClick, className = "" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      animate={{ scale: [1, 1.015, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={`relative overflow-hidden text-white px-3 py-2 rounded-[7px] mb-2 cursor-pointer flex items-center justify-between ${className}`}
      style={{
        background: 'linear-gradient(to right, #33A7FF 0%, #CD3AB7 62%, #207FBE 100%)',
      }}
      onClick={onClick}
    >
      {/* Animated Sparkles */}
      {[...Array(5)].map((_, idx) => (
        <div
          key={idx}
          className="absolute w-[6px] h-[6px] rounded-full bg-white opacity-40 animate-sparkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Sliding gradient overlay */}
      <div 
        className="absolute inset-0 animate-slide-right pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)'
        }}
      ></div>

      {/* Content */}
      <div className="relative flex items-center gap-2 z-10">
        <svg width="20" height="20" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.49151 5.46452H11.8311L8.49151 2.12491V5.46452Z..." fill="url(#paint0_linear_107_78)" />
          <defs>
            <linearGradient id="paint0_linear_107_78" x1="7.82359" y1="0.789062" x2="9.27221" y2="45.3419" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="#999999" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-[14px] font-normal">Get Unlimited Scans Starting at $10 Only</span>
      </div>

      <svg className="relative z-10" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </motion.div>
  );
};
