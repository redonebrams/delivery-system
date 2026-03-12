module.exports = {
  isEmail: (email) => /\S+@\S+\.\S+/.test(email),
  isNotEmpty: (val) => val && val.trim() !== ''
};
