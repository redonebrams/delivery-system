import React, { createContext, useContext, useState, useCallback } from 'react';

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = useCallback((error) => {
    const errorObj = {
      id: Date.now() + Math.random(),
      message: error.message || 'An unexpected error occurred',
      type: error.type || 'error',
      timestamp: new Date()
    };
    
    setErrors(prev => [...prev, errorObj]);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
      removeError(errorObj.id);
    }, 5000);
  }, []);

  const removeError = useCallback((id) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleApiError = useCallback((error) => {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response;
      message = data?.message || `Server error (${status})`;
    } else if (error.request) {
      // Request was made but no response received
      message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      message = error.message || 'An unexpected error occurred';
    }
    
    addError({ message, type: 'error' });
  }, [addError]);

  const handleSuccess = useCallback((message) => {
    addError({ message, type: 'success' });
  }, [addError]);

  const handleWarning = useCallback((message) => {
    addError({ message, type: 'warning' });
  }, [addError]);

  const value = {
    errors,
    addError,
    removeError,
    clearErrors,
    handleApiError,
    handleSuccess,
    handleWarning
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
