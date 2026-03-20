import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

const LoadingOverlay = ({ isLoading, text = 'Loading...', children }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <LoadingSpinner size="large" text={text} />
      </div>
      <div className="opacity-50">
        {children}
      </div>
    </div>
  );
};

const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="large" text="Loading application..." />
  </div>
);

export { LoadingSpinner, LoadingOverlay, PageLoading };
