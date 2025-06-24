import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
      {/* You can add text if you like, e.g., <p className="ml-3 text-gray-700">Loading...</p> */}
    </div>
  );
};

export default LoadingSpinner;