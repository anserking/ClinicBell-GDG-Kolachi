import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white border border-[#DCE6E2] rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-[#E5F0EE] rounded-md w-1/3"></div>
        <div className="h-5 bg-[#E5F0EE] rounded-full w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-[#F4F7F6] rounded-md w-full"></div>
        <div className="h-3 bg-[#F4F7F6] rounded-md w-5/6"></div>
      </div>
      <div className="pt-2 border-t border-[#F0F5F3] flex justify-between">
        <div className="h-3 bg-[#E5F0EE] rounded-md w-1/4"></div>
        <div className="h-6 bg-[#E5F0EE] rounded-lg w-16"></div>
      </div>
    </div>
  );
};
