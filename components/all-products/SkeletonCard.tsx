"use client";

import React from "react";

interface SkeletonCardProps {
  count?: number;
}

export default function SkeletonCard({ count = 6 }: SkeletonCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col w-full relative min-w-35 animate-pulse"
        >
          {/* Wishlist button skeleton */}
          <div className="absolute top-3 right-3 w-5 h-5 bg-gray-200 rounded-full" />

          {/* Image skeleton */}
          <div className="w-full aspect-square mb-2 bg-gray-200 rounded-md" />

          {/* Title skeleton */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />

          {/* Stock skeleton */}
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />

          {/* Price and button skeleton */}
          <div className="mt-auto pt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex items-baseline gap-1">
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="h-3 bg-gray-200 rounded w-10" />
            </div>
            <div className="w-full sm:w-16 h-8 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
