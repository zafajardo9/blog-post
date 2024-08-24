import React from "react";

export const PostSkeleton: React.FC = () => (
  <div className="rounded-lg shadow-lg overflow-hidden border border-gray-700 animate-pulse">
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="bg-gray-700 h-4 w-1/4 rounded"></div>
        <div className="flex gap-4">
          <div className="bg-gray-700 h-6 w-6 rounded"></div>
          <div className="bg-gray-700 h-6 w-6 rounded"></div>
        </div>
      </div>
      <div className="bg-gray-700 h-4 w-3/4 rounded mb-2"></div>
      <div className="bg-gray-700 h-4 w-1/2 rounded mb-4"></div>
      <div className="bg-gray-700 h-4 w-1/3 rounded"></div>
    </div>
  </div>
);
