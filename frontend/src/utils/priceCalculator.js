export const calculatePrice = (distance, basePrice, pricePerKm) => {
  return basePrice + distance * pricePerKm;
};
