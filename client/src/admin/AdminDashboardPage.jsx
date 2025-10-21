import React, { useState } from 'react';

const AdminDashboard = ({ orders, products, isDarkMode, updateProduct, deleteProduct, addProduct }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: 'men',
    price: 0,
    originalPrice: 0,
    description: '',
    sizes: '',
    stock: 0,
    sizeStock: {},
    image: null,
    imageUrl: '',
    rating: 0,
    reviews: 0,
    status: 'in_stock',
    isPremium: false,
    images360: ''
  });
  const [formError, setFormError] = useState('');

  // Filter products based on admin search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  const updateOrderStatus = (orderId, newStatus) => {
    // console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const updateStock = (productId, size, newStock) => {
   
    if (updateProduct) {
      const product = products.find(p => p.id === productId);
      const updatedSizeStock = { ...product.sizeStock, [size]: parseInt(newStock) };
      updateProduct(productId, { ...product, sizeStock: updatedSizeStock });
    }
  };

  const handleProductUpdate = (e) => {
    e.preventDefault();
    if (editProduct && updateProduct) {
      updateProduct(editProduct.id, {
        ...editProduct,
        name: e.target.name.value,
        price: parseFloat(e.target.price.value),
        originalPrice: parseFloat(e.target.originalPrice.value),
        description: e.target.description.value,
        stock: parseInt(e.target.stock.value)
      });
      setEditProduct(null);
      setSelectedProduct(null);
    }
  };

  const handleProductDelete = (productId) => {
    if (deleteProduct && window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null);
        setEditProduct(null);
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.brand || !newProduct.category || !newProduct.price || !newProduct.originalPrice || !newProduct.description || !newProduct.sizes || !newProduct.stock) {
      setFormError('All required fields must be filled');
      return;
    }
    if (!newProduct.image && !newProduct.imageUrl) {
      setFormError('Please provide an image file or URL');
      return;
    }
    setFormError('');
    if (addProduct) {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('brand', newProduct.brand);
      formData.append('category', newProduct.category);
      formData.append('price', newProduct.price);
      formData.append('originalPrice', newProduct.originalPrice);
      formData.append('description', newProduct.description);
      formData.append('sizes', newProduct.sizes);
      formData.append('stock', newProduct.stock);
      formData.append('sizeStock', JSON.stringify(newProduct.sizeStock));
      formData.append('rating', newProduct.rating);
      formData.append('reviews', newProduct.reviews);
      formData.append('status', newProduct.status);
      formData.append('isPremium', newProduct.isPremium);
      formData.append('images360', newProduct.images360);
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      } else if (newProduct.imageUrl) {
        formData.append('imageUrl', newProduct.imageUrl);
      }

      try {
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Failed to add product');
        }
        const newProductData = await response.json();
        addProduct(newProductData);
        setNewProduct({
          name: '',
          brand: '',
          category: 'men',
          price: 0,
          originalPrice: 0,
          description: '',
          sizes: '',
          stock: 0,
          sizeStock: {},
          image: null,
          imageUrl: '',
          rating: 0,
          reviews: 0,
          status: 'in_stock',
          isPremium: false,
          images360: ''
        });
        setShowAddProductModal(false);
      } catch (error) {
        
        setFormError('Failed to add product. Please try again.');
      }
    }
  };

  const handleSizeStockChange = (size, value) => {
    setNewProduct(prev => ({
      ...prev,
      sizeStock: { ...prev.sizeStock, [size]: value }
    }));
  };

  const closeModal = () => {
    setShowAddProductModal(false);
    setFormError('');
    setNewProduct({
      name: '',
      brand: '',
      category: 'men',
      price: 0,
      originalPrice: 0,
      description: '',
      sizes: '',
      stock: 0,
      sizeStock: {},
      image: null,
      imageUrl: '',
      rating: 0,
      reviews: 0,
      status: 'in_stock',
      isPremium: false,
      images360: ''
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        {/* Search Bar and Add Product Button */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search products by name or brand..."
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-full border-2 focus:outline-none focus:border-indigo-600 transition-colors text-sm w-full ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Add New Product
          </button>
        </div>
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Manage Orders */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${selectedOrder?.id === order.id ? 'border-2 border-indigo-600' : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-base">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${order.status.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status.status === 'shipped' ? 'bg-blue-100 text-blue-800' : order.status.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {order.status.status.charAt(0).toUpperCase() + order.status.status.slice(1)}
                    </div>
                  </div>
                  <p className="text-sm mt-2">Total: ₹{order.totalAmount.toLocaleString()}</p>
                </div>
              ))}
            </div>
            {selectedOrder && (
              <div className="mt-6 p-4 border-t border-gray-600">
                <h3 className="text-lg font-semibold mb-3">Order Details</h3>
                <p className="text-sm"><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p className="text-sm"><strong>Shipping:</strong> {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                <p className="text-sm"><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Update Status</h4>
                  <select
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className={`p-2 rounded-lg border w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          {/* Manage Products */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${selectedProduct?.id === product.id ? 'border-2 border-indigo-600' : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-center">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-base">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                      <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductDelete(product.id);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Stock by Size</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.sizes.map((size) => (
                        <div key={size} className="flex items-center">
                          <span className="text-sm mr-2">{size}:</span>
                          <input
                            type="number"
                            min="0"
                            defaultValue={product.sizeStock[size]}
                            onBlur={(e) => updateStock(product.id, size, parseInt(e.target.value))}
                            className={`w-16 p-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedProduct && (
              <div className="mt-6 p-4 border-t border-gray-600">
                <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                <p className="text-sm"><strong>Name:</strong> {selectedProduct.name}</p>
                <p className="text-sm"><strong>Brand:</strong> {selectedProduct.brand}</p>
                <p className="text-sm"><strong>Category:</strong> {selectedProduct.category}</p>
                <p className="text-sm"><strong>Price:</strong> ₹{selectedProduct.price.toLocaleString()}</p>
                <p className="text-sm"><strong>Original Price:</strong> ₹{selectedProduct.originalPrice.toLocaleString()}</p>
                <p className="text-sm"><strong>Description:</strong> {selectedProduct.description}</p>
                <p className="text-sm"><strong>Stock:</strong> {selectedProduct.stock}</p>
                <p className="text-sm"><strong>Rating:</strong> {selectedProduct.rating} ({selectedProduct.reviews} reviews)</p>
                <p className="text-sm"><strong>Status:</strong> {selectedProduct.status}</p>
                <p className="text-sm"><strong>Premium:</strong> {selectedProduct.isPremium ? 'Yes' : 'No'}</p>
                <button
                  onClick={() => setEditProduct(selectedProduct)}
                  className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                >
                  Edit Product
                </button>
              </div>
            )}
            {editProduct && (
              <div className="mt-6 p-4 border-t border-gray-600">
                <h3 className="text-lg font-semibold mb-3">Edit Product</h3>
                <form onSubmit={handleProductUpdate}>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editProduct.name}
                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <input
                        type="number"
                        name="price"
                        defaultValue={editProduct.price}
                        min="0"
                        step="0.01"
                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Original Price</label>
                      <input
                        type="number"
                        name="originalPrice"
                        defaultValue={editProduct.originalPrice}
                        min="0"
                        step="0.01"
                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        name="description"
                        defaultValue={editProduct.description}
                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        rows="4"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Total Stock</label>
                      <input
                        type="number"
                        name="stock"
                        defaultValue={editProduct.stock}
                        min="0"
                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditProduct(null)}
                        className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        {/* Add New Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100`}>
              <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
              {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">{formError}</div>
              )}
              <form onSubmit={handleAddProduct}>
                <div className="grid gap-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Brand</label>
                        <input
                          type="text"
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        >
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                          <option value="unisex">Unisex</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Pricing */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Pricing</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Price</label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          min="0"
                          step="0.01"
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Original Price</label>
                        <input
                          type="number"
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                          min="0"
                          step="0.01"
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* Inventory */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Inventory</h4>
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium">Sizes (comma-separated, e.g., 6,7,8)</label>
                        <input
                          type="text"
                          value={newProduct.sizes}
                          onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Stock by Size</label>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {newProduct.sizes.split(',').map(size => size.trim()).filter(size => size).map(size => (
                            <div key={size} className="flex items-center">
                              <span className="text-sm mr-2">{size}:</span>
                              <input
                                type="number"
                                min="0"
                                value={newProduct.sizeStock[size] || ''}
                                onChange={(e) => handleSizeStockChange(size, e.target.value)}
                                className={`w-16 p-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Total Stock</label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          min="0"
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <select
                          value={newProduct.status}
                          onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        >
                          <option value="in_stock">In Stock</option>
                          <option value="out_of_stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Media */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Media</h4>
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium">Image Upload</label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0], imageUrl: '' })}
                          className={`w-full p-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Or Image URL</label>
                        <input
                          type="text"
                          value={newProduct.imageUrl}
                          onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value, image: null })}
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">360 Images (comma-separated URLs)</label>
                        <input
                          type="text"
                          value={newProduct.images360}
                          onChange={(e) => setNewProduct({ ...newProduct, images360: e.target.value })}
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Additional Details */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Additional Details</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Rating</label>
                        <input
                          type="number"
                          value={newProduct.rating}
                          onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                          min="0"
                          max="5"
                          step="0.1"
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Reviews</label>
                        <input
                          type="number"
                          value={newProduct.reviews}
                          onChange={(e) => setNewProduct({ ...newProduct, reviews: e.target.value })}
                          min="0"
                          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="text-sm font-medium">Premium</label>
                        <input
                          type="checkbox"
                          checked={newProduct.isPremium}
                          onChange={(e) => setNewProduct({ ...newProduct, isPremium: e.target.checked })}
                          className="ml-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                    >
                      Add Product
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;