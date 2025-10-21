
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductTable = ({ 
  products, 
  selectedProducts, 
  onSelectProduct, 
  onSelectAll, 
  onEditProduct, 
  onToggleStatus, 
  onDeleteProduct,
  sortBy,
  sortOrder,
  onSort,
  isDarkMode
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStockStatusColor = (stock) => {
    if (stock === 0) return 'text-destructive';
    if (stock <= 10) return 'text-warning';
    return 'text-success';
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'active') {
      return `${baseClasses} bg-success/10 text-success`;
    }
    return `${baseClasses} bg-muted text-muted-foreground`;
  };

  return (
    <div className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} rounded-lg border overflow-hidden`}>
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={selectedProducts?.length === products?.length && products?.length > 0}
                  indeterminate={selectedProducts?.length > 0 && selectedProducts?.length < products?.length}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">Product</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-1 hover:text-accent transition-colors"
                >
                  <span>Category</span>
                  <Icon name={getSortIcon('category')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center space-x-1 hover:text-accent transition-colors"
                >
                  <span>Price</span>
                  <Icon name={getSortIcon('price')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center space-x-1 hover:text-accent transition-colors"
                >
                  <span>Stock</span>
                  <Icon name={getSortIcon('stock')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-right p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr
                key={product?.id}
                className={`border-b border-border hover:bg-muted/30 transition-colors ${
                  selectedProducts?.includes(product?.id) ? 'bg-accent/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(product?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedProducts?.includes(product?.id)}
                    onChange={(e) => onSelectProduct(product?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={product?.image}
                        alt={product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{product?.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{product?.brand}</p>
                      <p className="text-xs text-muted-foreground">{product?.sizes?.join(', ')}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-muted rounded-md text-sm text-foreground">
                    {product?.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-medium text-foreground">₹{product?.price?.toLocaleString('en-IN')}</span>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${getStockStatusColor(product?.stock)}`}>
                    {product?.stock}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {Object.entries(product?.sizeStock || {}).map(([size, stock]) => (
                      <span key={size} className="mr-2">{size}: {stock}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className={getStatusBadge(product?.status)}>
                    {product?.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditProduct(product)}
                      className={`opacity-0 ${hoveredRow === product?.id ? 'opacity-100' : ''} transition-opacity`}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleStatus(product?.id, product?.status)}
                      className={`opacity-0 ${hoveredRow === product?.id ? 'opacity-100' : ''} transition-opacity ${
                        product?.status === 'active' ? 'text-warning' : 'text-success'
                      }`}
                    >
                      <Icon name={product?.status === 'active' ? 'Eye' : 'EyeOff'} size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteProduct(product?.id)}
                      className={`opacity-0 ${hoveredRow === product?.id ? 'opacity-100' : ''} transition-opacity text-destructive`}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden space-y-4 p-4">
        {products?.map((product) => (
          <div
            key={product?.id}
            className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} rounded-lg p-4 border ${
              selectedProducts?.includes(product?.id) ? 'ring-2 ring-accent' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={selectedProducts?.includes(product?.id)}
                onChange={(e) => onSelectProduct(product?.id, e?.target?.checked)}
                className="mt-1"
              />
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground truncate">{product?.name}</h3>
                    <p className="text-sm text-muted-foreground">{product?.brand}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-muted rounded text-xs">{product?.category}</span>
                      <span className={getStatusBadge(product?.status)}>{product?.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{product?.sizes?.join(', ')}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditProduct(product)}
                  >
                    <Icon name="MoreVertical" size={16} />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">₹{product?.price?.toLocaleString('en-IN')}</p>
                    <p className={`text-sm ${getStockStatusColor(product?.stock)}`}>Stock: {product?.stock}</p>
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(product?.sizeStock || {}).map(([size, stock]) => (
                        <span key={size} className="mr-2">{size}: {stock}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleStatus(product?.id, product?.status)}
                      className={product?.status === 'active' ? 'text-warning' : 'text-success'}
                    >
                      <Icon name={product?.status === 'active' ? 'Eye' : 'EyeOff'} size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteProduct(product?.id)}
                      className="text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;