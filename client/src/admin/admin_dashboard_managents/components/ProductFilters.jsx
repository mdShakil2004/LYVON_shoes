import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductFilters = ({ filters, onFiltersChange, onClearFilters, onSavePreset, savedPresets, onLoadPreset, brands }) => {
  const [presetName, setPresetName] = useState('');

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'mens', label: "Men's Shoes" },
    { value: 'womens', label: "Women's Shoes" },
    { value: 'unisex', label: 'Unisex' },
    { value: 'sneakers', label: 'Sneakers' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'sports', label: 'Sports' }
  ];

  const brandOptions = [
    { value: 'all', label: 'All Brands' },
    ...brands.map(brand => ({
      value: brand.toLowerCase(),
      label: brand
    }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' }
  ];

  const stockLevelOptions = [
    { value: 'all', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock (>10)' },
    { value: 'low-stock', label: 'Low Stock (1-10)' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const handleInputChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handlePriceRangeChange = (field, value) => {
    onFiltersChange({
      ...filters,
      priceRange: { ...filters.priceRange, [field]: value }
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName, filters);
      setPresetName('');
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Products</h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <Icon name="X" size={16} className="mr-2" />
          Clear Filters
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Search"
          type="text"
          value={filters.search}
          onChange={(e) => handleInputChange('search', e.target.value)}
          placeholder="Search by name or brand..."
          iconName="Search"
        />
        <Select
          label="Category"
          options={categoryOptions}
          value={filters.category}
          onChange={(value) => handleInputChange('category', value)}
        />
        <Select
          label="Brand"
          options={brandOptions}
          value={filters.brand}
          onChange={(value) => handleInputChange('brand', value)}
        />
        <Select
          label="Stock Level"
          options={stockLevelOptions}
          value={filters.stockLevel}
          onChange={(value) => handleInputChange('stockLevel', value)}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Price Range (₹)</label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              className="w-full"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleInputChange('status', value)}
        />
        <div className="flex items-end space-x-4">
          <Checkbox
            label="Featured"
            checked={filters.featured}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
          />
          <Checkbox
            label="Has Images"
            checked={filters.hasImages}
            onChange={(e) => handleInputChange('hasImages', e.target.checked)}
          />
          <Checkbox
            label="On Sale"
            checked={filters.onSale}
            onChange={(e) => handleInputChange('onSale', e.target.checked)}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center space-x-4">
        <Input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="Save filter preset as..."
          className="w-48"
        />
        <Button
          variant="outline"
          onClick={handleSavePreset}
          disabled={!presetName.trim()}
        >
          Save Preset
        </Button>
        {savedPresets.length > 0 && (
          <Select
            label="Load Preset"
            options={savedPresets.map(preset => ({
              value: preset.id,
              label: preset.name
            }))}
            onChange={(value) => {
              const preset = savedPresets.find(p => p.id === value);
              if (preset) onLoadPreset(preset);
            }}
            placeholder="Select a preset"
          />
        )}
      </div>
    </div>
  );
};

export default ProductFilters;