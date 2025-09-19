import React from "react";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
);

export default function TripSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-8">
      {/* Trip Details Skeleton */}
      <div className="card bg-base-100 shadow-xl rounded-2xl border border-base-300 p-8">
        <SkeletonBox className="h-8 w-1/3 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonBox key={i} className="h-6 w-32" />
          ))}
        </div>
      </div>

      {/* Weather Skeleton */}
      <div className="card bg-base-100 shadow-xl rounded-2xl border border-base-300 p-6">
        <SkeletonBox className="h-6 w-1/4 mb-4" />
        <SkeletonBox className="h-24 w-full" />
      </div>

      {/* Hotels Skeleton */}
      <div>
        <SkeletonBox className="h-8 w-1/4 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-xl rounded-2xl border border-base-300 p-6">
              <SkeletonBox className="h-40 w-full mb-4" />
              <SkeletonBox className="h-6 w-1/2 mb-2" />
              <SkeletonBox className="h-4 w-3/4 mb-2" />
              <SkeletonBox className="h-4 w-1/3 mb-4" />
              <SkeletonBox className="h-10 w-24 mb-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary Skeleton */}
      <div>
        <SkeletonBox className="h-8 w-1/3 mb-6" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-xl rounded-2xl border border-base-300 p-6 mb-4">
            <SkeletonBox className="h-6 w-1/4 mb-4" />
            <SkeletonBox className="h-20 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}