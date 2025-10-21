import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductFormModal = ({ isOpen, onClose, product = null, onSave, isLoading = false, isDarkMode, brands }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    images: [],
    sizes: [],
    colors: [],
    status: 'active',
    featured: false,
    tags: '',
    sizeStock: {}
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const categoryOptions = [
    { value: 'mens', label: "Men's Shoes" },
    { value: 'womens', label: "Women's Shoes" },
    { value: 'unisex', label: 'Unisex' },
    { value: 'sneakers', label: 'Sneakers' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'sports', label: 'Sports' }
  ];

  const brandOptions = brands.map(brand => ({
    value: brand.toLowerCase(),
    label: brand
  }));

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' }
  ];

  const sizeOptions = [
    { value: '6', label: 'UK 6' },
    { value: '7', label: 'UK 7' },
    { value: '8', label: 'UK 8' },
    { value: '9', label: 'UK 9' },
    { value: '10', label: 'UK 10' },
    { value: '11', label: 'UK 11' },
    { value: '12', label: 'UK 12' }
  ];

  const colorOptions = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'brown', label: 'Brown' },
    { value: 'grey', label: 'Grey' }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product?.name || '',
        brand: product?.brand?.toLowerCase() || '',
        category: product?.category || '',
        price: product?.price?.toString() || '',
        originalPrice: product?.originalPrice?.toString() || '',
        stock: product?.stock?.toString() || '',
        description: product?.description || '',
        images: product?.images || [product?.image || ''],
        sizes: product?.sizes || [],
        colors: product?.colors || [],
        status: product?.status || 'active',
        featured: product?.featured || false,
        tags: product?.tags?.join(', ') || '',
        sizeStock: product?.sizeStock || {}
      });
      setImagePreview(product?.image || product?.images?.[0] || '');
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category: '',
      price: '',
      originalPrice: '',
      stock: '',
      description: '',
      images: [],
      sizes: [],
      colors: [],
      status: 'active',
      featured: false,
      tags: '',
      sizeStock: {}
    });
    setErrors({});
    setImagePreview('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSizeStockChange = (size, value) => {
    setFormData(prev => ({
      ...prev,
      sizeStock: {
        ...prev.sizeStock,
        [size]: parseInt(value) || 0
      }
    }));
    const totalStock = Object.values({ ...formData.sizeStock, [size]: parseInt(value) || 0 }).reduce((sum, stock) => sum + stock, 0);
    handleInputChange('stock', totalStock.toString());
  };

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e?.target?.result);
        handleInputChange('images', [e?.target?.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    if (formData.sizes.length === 0) newErrors.sizes = 'At least one size is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: parseInt(formData.stock),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: imagePreview || formData.images[0] || '/assets/images/no_image.png'
    };
    onSave(productData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
      } rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <Icon name="X" size={24} />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Input
                  label="Product Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                  placeholder="Enter product name"
                  className="rounded-md"
                />
                <Select
                  label="Brand"
                  options={brandOptions}
                  value={formData.brand}
                  onChange={(value) => handleInputChange('brand', value)}
                  error={errors.brand}
                  required
                  searchable
                  className="rounded-md"
                />
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => handleInputChange('category', value)}
                  error={errors.category}
                  required
                  className="rounded-md"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (₹)"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    error={errors.price}
                    required
                    placeholder="0"
                    className="rounded-md"
                  />
                  <Input
                    label="Original Price (₹)"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    placeholder="0"
                    description="Leave empty if no discount"
                    className="rounded-md"
                  />
                </div>
                <Input
                  label="Total Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  error={errors.stock}
                  required
                  placeholder="0"
                  disabled
                  className="rounded-md"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Image
                  </label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center relative">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="w-40 h-40 mx-auto rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={imagePreview}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setImagePreview('')}
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Icon name="Upload" size={32} className="mx-auto text-gray-400 dark:text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Upload product image</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                        <label
                          htmlFor="image-upload"
                          className="inline-block mt-2"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Choose File
                          </Button>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  className="rounded-md"
                />
                <Checkbox
                  label="Featured Product"
                  description="Show this product in featured sections"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                } placeholder-gray-400 dark:placeholder-gray-500`}
                placeholder="Enter product description..."
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Available Sizes"
                  options={sizeOptions}
                  value={formData.sizes}
                  onChange={(value) => handleInputChange('sizes', value)}
                  error={errors.sizes}
                  required
                  multiple
                  description="Select all available sizes"
                  className="rounded-md"
                />
                {formData.sizes.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Stock by Size</label>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.sizes.map(size => (
                        <div key={size} className="flex items-center">
                          <span className="text-sm mr-2">{size}:</span>
                          <Input
                            type="number"
                            min="0"
                            value={formData.sizeStock[size] || 0}
                            onChange={(e) => handleSizeStockChange(size, e.target.value)}
                            className="w-20 rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Select
                label="Available Colors"
                options={colorOptions}
                value={formData.colors}
                onChange={(value) => handleInputChange('colors', value)}
                multiple
                description="Select all available colors"
                className="rounded-md"
              />
            </div>
            <Input
              label="Tags"
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="casual, comfortable, trending"
              description="Separate tags with commas"
              className="rounded-md"
            />
          </div>
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 ">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;