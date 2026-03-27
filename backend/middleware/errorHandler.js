module.exports = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Un enregistrement avec ces données existe déjà',
      error: err.message
    });
  }
  
  if (err.code === 'ER_BAD_FIELD_ERROR') {
    return res.status(400).json({
      success: false,
      message: 'Champ invalide',
      error: err.message
    });
  }
  
  // Default error response
  const status = err.status || 500;
  const message = err.message || 'Erreur serveur interne';
  
  res.status(status).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
