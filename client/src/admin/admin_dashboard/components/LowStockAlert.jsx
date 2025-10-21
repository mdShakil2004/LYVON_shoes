
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const LowStockAlert = ({ products, onViewInventory, onRestockProduct, isDarkMode }) => {
  const lowStockProducts = products.filter(p => p.stock <= 10);

  const getStockStatus = (currentStock) => {
    if (currentStock === 0) return { label: 'Out of Stock', color: 'text-destructive', bgColor: 'bg-destructive/10' };
    if (currentStock <= 3) return { label: 'Critical', color: 'text-destructive', bgColor: 'bg-destructive/10' };
    if (currentStock <= 10) return { label: 'Low Stock', color: 'text-warning', bgColor: 'bg-warning/10' };
    return { label: 'Normal', color: 'text-success', bgColor: 'bg-success/10' };
  };

  return (
    <div className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} rounded-lg overflow-hidden border`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Low Stock Alerts</h3>
              <p className="text-sm text-muted-foreground">
                {lowStockProducts?.length} products need restocking
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onViewInventory}>
            <Icon name="Package" size={16} className="mr-2" />
            View Inventory
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {lowStockProducts?.map((product) => {
          const stockStatus = getStockStatus(product?.stock);
          return (
            <div key={product?.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={product?.image || product?.imageUrl}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {product?.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product?.category} • Brand: {product?.brand}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm font-medium text-foreground">
                          ₹{product?.price.toLocaleString()}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus?.bgColor} ${stockStatus?.color}`}>
                          {stockStatus?.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {product?.stock}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Stock</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {product.sizes.map((size) => (
                          <div key={size} className="flex items-center">
                            <span className="text-sm mr-2">{size}:</span>
                            <input
                              type="number"
                              min="0"
                              defaultValue={product.sizeStock[size] || 0}
                              onBlur={(e) => onRestockProduct(product.id, size, e.target.value)}
                              className={`w-16 p-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent ${isDarkMode ? 'bg-background-dark border-border-dark text-foreground-dark' : 'bg-background border-border text-foreground'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${product?.stock === 0 ? 'bg-destructive' : product?.stock <= 3 ? 'bg-destructive' : 'bg-success'}`}
                        style={{ width: `${Math.min((product?.stock / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <Icon name="Info" size={14} className="inline mr-1" />
            Auto-restock notifications enabled
          </div>
          <Button variant="ghost" size="sm">
            Configure Alerts
            <Icon name="Settings" size={14} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;