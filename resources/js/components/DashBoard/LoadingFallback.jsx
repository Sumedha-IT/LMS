import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animations/loading.json';

const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-64 h-64">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
      <div className="text-gray-600 mt-4">Loading...</div>
    </div>
  );
};

export default LoadingFallback; 