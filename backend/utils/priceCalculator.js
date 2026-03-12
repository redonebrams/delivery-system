module.exports = {
  calculate: (distanceKm, basePrice=15, pricePerKm=3) => {
    return basePrice + (distanceKm * pricePerKm);
  }
};
