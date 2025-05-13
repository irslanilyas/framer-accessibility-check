// src/components/ui/PromoBanner.tsx
import React from 'react';

interface PromoBannerProps {
  onClick?: () => void;
  className?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onClick, className = "" }) => {
  return (
    <div 
      className={`relative overflow-hidden text-white px-3 py-2 rounded-[7px] mb-2 cursor-pointer flex items-center justify-between ${className}`}
      style={{
        background: 'linear-gradient(to right, #33A7FF 0%, #CD3AB7 62%, #207FBE 100%)'
      }}
      onClick={onClick}
    >
      {/* Sliding gradient overlay for animation */}
      <div 
        className="absolute inset-0 animate-slide-right"
        style={{
          background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)'
        }}
      ></div>
      
      {/* Content */}
      <div className="relative flex items-center gap-2">
      <svg width="20" height="20" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.49151 5.46452H11.8311L8.49151 2.12491V5.46452ZM3.81605 14.1475C3.4487 14.1475 3.13433 14.0168 2.87295 13.7554C2.61157 13.4941 2.48065 13.1795 2.48021 12.8117V10.8079H13.167V12.8117C13.167 13.179 13.0363 13.4936 12.7749 13.7554C12.5135 14.0173 12.1989 14.148 11.8311 14.1475H3.81605ZM0.47644 9.47206V8.13621H15.1707V9.47206H0.47644ZM2.48021 6.80037V2.12491C2.48021 1.75755 2.61112 1.44318 2.87295 1.1818C3.13477 0.920421 3.44914 0.789508 3.81605 0.789062H9.15944L13.167 4.7966V6.80037H2.48021Z" fill="url(#paint0_linear_107_78)"/>
<defs>
<linearGradient id="paint0_linear_107_78" x1="7.82359" y1="0.789062" x2="9.27221" y2="45.3419" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="#999999"/>
</linearGradient>
</defs>
</svg>

        <span className="text-[14px] font-normal">Get Unlimited Scans Starting at $10 Only</span>
      </div>
      
      <svg className="relative z-10" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};