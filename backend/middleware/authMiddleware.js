const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }
    
    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Format de token invalide'
      });
    }
    
    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }
    
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

