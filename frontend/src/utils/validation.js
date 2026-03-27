import React from 'react';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Moroccan phone format: 06/07 followed by 8 digits
  const phoneRegex = /^(06|07)\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

export const validateLength = (value, min, max) => {
  const length = value ? value.length : 0;
  return length >= min && length <= max;
};

export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
};

// Form validation rules
export const validationRules = {
  email: {
    required: true,
    validate: validateEmail,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    validate: validatePassword,
    message: 'Password must be at least 8 characters with one uppercase, one lowercase, and one number'
  },
  confirmPassword: {
    required: true,
    validate: (value, formData) => value === formData.password,
    message: 'Passwords do not match'
  },
  nom: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'Last name must be between 2 and 50 characters'
  },
  prenom: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'First name must be between 2 and 50 characters'
  },
  telephone: {
    required: true,
    validate: validatePhone,
    message: 'Please enter a valid Moroccan phone number (06/07XXXXXXXX)'
  },
  address: {
    required: true,
    minLength: 5,
    maxLength: 255,
    message: 'Address must be between 5 and 255 characters'
  },
  distance: {
    required: true,
    validate: (value) => validateNumber(value, 0, 999.99),
    message: 'Distance must be a valid number between 0 and 999.99'
  },
  price: {
    required: true,
    validate: (value) => validateNumber(value, 0, 99999.99),
    message: 'Price must be a valid number between 0 and 99999.99'
  }
};

// Validate a single field
export const validateField = (name, value, formData = {}) => {
  const rule = validationRules[name];
  if (!rule) return { isValid: true, error: '' };

  // Check if required
  if (rule.required && !validateRequired(value)) {
    return { isValid: false, error: `${name.charAt(0).toUpperCase() + name.slice(1)} is required` };
  }

  // Skip validation if field is empty and not required
  if (!validateRequired(value) && !rule.required) {
    return { isValid: true, error: '' };
  }

  // Check length
  if (rule.minLength && !validateLength(value, rule.minLength, rule.maxLength || Infinity)) {
    return { isValid: false, error: rule.message };
  }

  // Custom validation
  if (rule.validate) {
    const isValid = rule.validate(value, formData);
    return { isValid, error: isValid ? '' : rule.message };
  }

  return { isValid: true, error: '' };
};

// Validate entire form
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(fieldName => {
    const fieldValue = formData[fieldName];
    const validation = validateField(fieldName, fieldValue, formData);
    
    if (!validation.isValid) {
      errors[fieldName] = validation.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Real-time validation hook
export const useValidation = (initialData, rules) => {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validateFieldInternal = React.useCallback((name, value) => {
    const validation = validateField(name, value, formData);
    setErrors(prev => ({
      ...prev,
      [name]: validation.error
    }));
    return validation.isValid;
  }, [formData]);

  const setFieldValue = React.useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field if it has been touched
    if (touched[name]) {
      validateFieldInternal(name, value);
    }
  }, [touched, validateFieldInternal]);

  const setFieldTouched = React.useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field when touched
    validateFieldInternal(name, formData[name]);
  }, [formData, validateFieldInternal]);

  const validateAll = React.useCallback(() => {
    const { isValid, errors: validationErrors } = validateForm(formData, rules);
    setErrors(validationErrors);
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return isValid;
  }, [formData, rules]);

  const resetForm = React.useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Calculate isValid based on current form data and rules
  const currentValidation = React.useMemo(() => {
    const errors = {};
    let isValid = true;
    
    Object.keys(rules).forEach(fieldName => {
      const fieldValue = formData[fieldName];
      const validation = validateField(fieldName, fieldValue, formData);
      
      if (!validation.isValid) {
        errors[fieldName] = validation.error;
        isValid = false;
      }
    });
    
    return { isValid, errors };
  }, [formData, rules]);

  // For UI errors, only show touched fields
  const displayErrors = React.useMemo(() => {
    const displayErrors = {};
    Object.keys(touched).forEach(fieldName => {
      if (touched[fieldName] && currentValidation.errors[fieldName]) {
        displayErrors[fieldName] = currentValidation.errors[fieldName];
      }
    });
    return displayErrors;
  }, [touched, currentValidation.errors]);

  return {
    formData,
    errors: displayErrors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateAll,
    resetForm,
    isValid: currentValidation.isValid
  };
};
