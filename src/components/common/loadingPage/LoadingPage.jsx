import React from 'react';


const LoadingPage = () => {
  return (
    <div>
      <div className="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 ">
        <div className="flex items-center justify-center shadow-md shadow-primary-light w-56 h-56 border border-gray-200 rounded-lg bg-gray-50">
          <div className="px-3 py-1 text-md font-medium leading-none text-center text-green-800 bg-green-200 rounded-full animate-pulse">Loading...</div>
        </div>
      </div>
  </div>
  );
};

export default LoadingPage;