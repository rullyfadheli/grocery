import React from "react";

/**
 * Modern, minimal loading animation with a pulsing spinner and text
 */
const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 bg-white/95 px-8 py-6 rounded-2xl shadow-xl">
        {/* Modern Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        </div>

        {/* Loading Text with subtle pulse */}
        <p className="text-gray-600 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
