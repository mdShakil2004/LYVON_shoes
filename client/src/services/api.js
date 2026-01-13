const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000/api'; // Proxy or direct

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
});

export const api = {
  // Catalog
  getProducts: (params) => fetch(`${API_BASE}/catalog?${new URLSearchParams(params)}`).then(r => r.json()),
  getProduct: (id) => fetch(`${API_BASE}/catalog/${id}`).then(r => r.json()),

  // Wishlist
  getWishlist: () => fetch(`${API_BASE}/catalog/wishlist`, { headers: getHeaders() }).then(r => r.json()),
  addToWishlist: (id) => fetch(`${API_BASE}/catalog/wishlist/${id}`, { method: 'POST', headers: getHeaders() }),
  removeFromWishlist: (id) => fetch(`${API_BASE}/catalog/wishlist/${id}`, { method: 'DELETE', headers: getHeaders() }),

  // Recommendations (fallback to basic if not logged in)
  getPersonalizedRecommendations: () => fetch(`${API_BASE}/recommendations/personalized`, { headers: getHeaders() }).then(r => r.json()),
  getProductRecommendations: (id) => fetch(`${API_BASE}/catalog/recommendations/product/${id}`).then(r => r.json()),
  getCartRecommendations: (ids) => fetch(`${API_BASE}/catalog/recommendations/cart?productIds=${ids.join(',')}`).then(r => r.json()),

  // Orders
  createOrder: (data) => fetch(`${API_BASE}/orders`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  getOrders: () => fetch(`${API_BASE}/orders`, { headers: getHeaders() }).then(r => r.json())




  //  other file added ......  
//   ......  below is added... contact for all  
};