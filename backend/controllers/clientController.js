const User = require('../models/User');
const responseFormatter = require('../utils/responseFormatter');

exports.getAll = async (req,res,next) => {
  try {
    // TODO: SELECT * FROM users WHERE role='client'
    res.json(responseFormatter(true,[],'Liste des clients'));
  } catch(err){ next(err); }
};

exports.getById = async (req,res,next) => {
  try {
    const client = await User.findById(req.params.id);
    res.json(responseFormatter(true,client,'Détails client'));
  } catch(err){ next(err); }
};


