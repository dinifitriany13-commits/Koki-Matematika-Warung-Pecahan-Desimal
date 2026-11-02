import React from 'react';

export const WarungBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#FAF5EB] overflow-x-hidden flex flex-col justify-between">
      {/* Warung Striped Awning (Kanopi Tenda Warung Tradisional) */}
      <div className="w-full relative z-20 shadow-sm">
        {/* Striped canopy banner */}
        <div className="h-4 sm:h-5 w-full bg-repeating-linear-gradient flex">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 20">
            <defs>
              <pattern id="awningStripes" width="60" height="20" patternUnits="userSpaceOnUse">
                <rect width="30" height="20" fill="#DC2626" />
                <rect x="30" width="30" height="20" fill="#FFFBEB" />
              </pattern>
            </defs>
            <rect width="100%" height="20" fill="url(#awningStripes)" />
          </svg>
        </div>

        {/* Awning scalloped decorative bottom edge */}
        <div className="w-full h-2.5 sm:h-3 overflow-hidden flex -mt-0.5">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 12">
            <defs>
              <pattern id="awningScallop" width="30" height="12" patternUnits="userSpaceOnUse">
                <path d="M 0 0 Q 7.5 12 15 12 Q 22.5 12 30 0 Z" fill="#DC2626" />
              </pattern>
            </defs>
            <rect width="100%" height="12" fill="url(#awningScallop)" />
          </svg>
        </div>
      </div>

      {/* Ambient Warung Props (Hiasan Latar Khas Warung Nusantara) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-35 sm:opacity-50">
        {/* Left Side: Kaleng Kerupuk Legendaris Khas Warung (Classic Blue Cracker Tin) */}
        <div className="absolute top-24 -left-6 sm:left-4 w-20 sm:w-28 h-28 sm:h-36 bg-sky-600 rounded-t-xl border-4 border-sky-800 shadow-md flex flex-col items-center justify-center p-2 transform -rotate-3">
          <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-sky-100 border-3 border-sky-900 flex items-center justify-center overflow-hidden">
            <div className="text-[9px] sm:text-[11px] font-bold text-sky-900 text-center uppercase tracking-tight leading-none font-heading">
              Kerupuk<br/>Putih
            </div>
          </div>
          <div className="w-16 sm:w-22 h-2.5 bg-sky-900 rounded-full mt-2" />
        </div>

        {/* Right Side: Pisang Gantung Khas Warung & Papan Menu */}
        <div className="absolute top-20 -right-4 sm:right-6 flex flex-col items-center transform rotate-3">
          {/* Hanging string */}
          <div className="w-0.5 h-6 bg-amber-800" />
          {/* Banana cluster */}
          <div className="w-16 sm:w-20 h-12 sm:h-16 bg-amber-400 rounded-full border-2 border-amber-600 shadow-sm flex items-center justify-center font-bold text-[9px] text-amber-900">
            🍌 Pisang
          </div>
        </div>

        {/* Subtle wooden plank wall lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(146,64,14,0.03)_100%)] bg-[size:100%_48px]" />
      </div>

      {/* Main Container Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>

      {/* Wooden Warung Counter Bottom Table Trim (Meja Kayu Etalase) */}
      <div className="w-full relative z-20 mt-auto">
        {/* Table cloth or wood counter top */}
        <div className="h-3 sm:h-4 w-full bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 border-t border-amber-600 shadow-inner flex items-center justify-center">
          <div className="text-[10px] text-amber-200/80 font-mono tracking-widest uppercase">
            Warung Matematika Nusantara
          </div>
        </div>
      </div>
    </div>
  );
};
