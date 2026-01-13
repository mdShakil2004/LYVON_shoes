// Simple one-hot encoding maps (expand as needed)
const categories = ['men', 'women', 'unisex'];
const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'LyVON']; // Add your brands

function oneHot(value, list) {
  return list.map(item => (item === value ? 1 : 0));
}

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

exports.vectorizeProduct = (product) => {
  const priceNorm = normalize(product.price || 0, 1000, 20000); // Adjust min/max
  const ratingNorm = (product.rating || 4.5) / 5;
  return [
    ...oneHot(product.category, categories),
    ...oneHot(product.brand, brands),
    priceNorm,
    ratingNorm
  ];
};

exports.cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magA && magB ? dot / (magA * magB) : 0;
};