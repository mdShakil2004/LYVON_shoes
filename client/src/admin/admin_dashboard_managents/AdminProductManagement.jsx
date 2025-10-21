import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AdminSidebar from '../components/AdminSidebar';
import ProductTable from './components/ProductTable';
import ProductFilters from './components/ProductFilters';
import BulkActionsBar from './components/BulkActionsBar';
import ProductFormModal from './components/ProductFormModal';
import ImportExportModal from './components/ImportExportModal';

const AdminProductManagement = ({ products, brands, addProduct, updateProduct, deleteProduct, isDarkMode,isCollapsed }) => {
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    brand: 'all',
    status: 'all',
    stockLevel: 'all',
    priceRange: { min: '', max: '' },
    featured: false,
    hasImages: false,
    onSale: false,
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [importExportMode, setImportExportMode] = useState('import');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize as true for initial load
  const [savedPresets, setSavedPresets] = useState([]);

  // Handle initial loading
  useEffect(() => {
    
    const timer = setTimeout(() => {
      
      setIsLoading(false);
    }, 1000); // Match AdminDashboard's 1-second delay
    return () => clearTimeout(timer);
  }, []);

  // Update filteredProducts when products change
  useEffect(() => {
    
    setFilteredProducts(products);
  }, [products]);

  // Apply filters and sorting
  useEffect(() => {
    
    let filtered = [...products];

    if (filters?.search) {
      filtered = filtered.filter(product =>
        product?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        product?.brand?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.category && filters?.category !== 'all') {
      filtered = filtered.filter(product => product?.category === filters?.category);
    }

    if (filters?.brand && filters?.brand !== 'all') {
      filtered = filtered.filter(product => product?.brand?.toLowerCase() === filters?.brand);
    }

    if (filters?.status && filters?.status !== 'all') {
      filtered = filtered.filter(product => product?.status === filters?.status);
    }

    if (filters?.stockLevel && filters?.stockLevel !== 'all') {
      switch (filters?.stockLevel) {
        case 'in-stock':
          filtered = filtered.filter(product => product?.stock > 10);
          break;
        case 'low-stock':
          filtered = filtered.filter(product => product?.stock > 0 && product?.stock <= 10);
          break;
        case 'out-of-stock':
          filtered = filtered.filter(product => product?.stock === 0);
          break;
        default:
          break;
      }
    }

    if (filters?.priceRange?.min) {
      filtered = filtered.filter(product => product?.price >= parseFloat(filters?.priceRange?.min));
    }
    if (filters?.priceRange?.max) {
      filtered = filtered.filter(product => product?.price <= parseFloat(filters?.priceRange?.max));
    }

    if (filters?.featured) {
      filtered = filtered.filter(product => product?.featured);
    }
    if (filters?.hasImages) {
      filtered = filtered.filter(product => product?.image || product?.images?.length);
    }
    if (filters?.onSale) {
      filtered = filtered.filter(product => product?.originalPrice && product?.originalPrice > product?.price);
    }

    filtered.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === 'stock') {
        aValue = Object.values(a?.sizeStock || {}).reduce((sum, stock) => sum + (stock || 0), 0);
        bValue = Object.values(b?.sizeStock || {}).reduce((sum, stock) => sum + (stock || 0), 0);
      }

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters, sortBy, sortOrder]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      brand: 'all',
      status: 'all',
      stockLevel: 'all',
      priceRange: { min: '', max: '' },
      featured: false,
      hasImages: false,
      onSale: false,
    });
  };

  const handleSavePreset = (name, filterData) => {
    const newPreset = {
      id: Date.now(),
      name,
      filters: filterData,
      createdAt: new Date(),
    };
    setSavedPresets(prev => [...prev, newPreset]);
  };

  const handleLoadPreset = (preset) => {
    setFilters(preset?.filters);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleSelectProduct = (productId, selected) => {
    setSelectedProducts(prev =>
      selected ? [...prev, productId] : prev.filter(id => id !== productId)
    );
  };

  const handleSelectAll = (selected) => {
    const currentPageProducts = getCurrentPageProducts();
    const currentPageIds = currentPageProducts.map(p => p.id);
    setSelectedProducts(prev =>
      selected ? [...new Set([...prev, ...currentPageIds])] : prev.filter(id => !currentPageIds.includes(id))
    );
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
  };

  const handleBulkAction = async (action) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      switch (action) {
        case 'activate':
          selectedProducts.forEach(id => updateProduct(id, { status: 'active' }));
          break;
        case 'deactivate':
          selectedProducts.forEach(id => updateProduct(id, { status: 'inactive' }));
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            selectedProducts.forEach(id => deleteProduct(id));
          }
          break;
        case 'export':
          setIsImportExportModalOpen(true);
          setImportExportMode('export');
          break;
        default:
          break;
      }
      setSelectedProducts([]);
    } catch (error) {
      console.log('Bulk action failed:');
    } finally {
      setIsLoading(false);
      
    }
  };

  const handleEditProduct = (product) => {
    
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddProduct = () => {
   
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (editingProduct) {
        updateProduct(editingProduct.id, productData);
      } else {
        addProduct(productData);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.log('Save product failed:');
    } finally {
      setIsLoading(false);
      
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    
    updateProduct(productId, { status: currentStatus === 'active' ? 'inactive' : 'active' });
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      
      deleteProduct(productId);
    }
  };

  const handleImport = async (file, onProgress) => {
    
    setIsLoading(true);
    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress(i);
      }
      return {
        success: true,
        imported: 15,
        updated: 3,
        errors: 2,
        errorDetails: [
          { row: 5, message: 'Invalid price format' },
          { row: 12, message: 'Missing required field: brand' },
        ],
      };
    } catch (error) {
      alert('Import failed:');
      throw error;
    } finally {
      setIsLoading(false);
      
    }
  };

  const handleExport = async (options) => {
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      alert('Export failed:');
      throw error;
    } finally {
      setIsLoading(false);
     
    }
  };

  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <Helmet>
        <title>Product Management - Stryde Admin</title>
        <meta name="description" content="Manage your shoe inventory with comprehensive CRUD operations and bulk management capabilities." />
      </Helmet>
     
      <main className={`transition-all duration-100 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-[280px] '}`}>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <Icon name="Loader" size={32} className="animate-spin text-primary" />
            <span className="ml-2 text-foreground">Loading...</span>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
                <p className="text-muted-foreground">
                  Manage your shoe inventory with comprehensive tools and analytics
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    alert("contact admin to import data");
                   
                  }}
                  iconName="Upload"
                  iconPosition="left"
                >
                  Import
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    alert("contact admin to export data");
                    
                  }}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </Button>
                <Button
                  onClick={handleAddProduct}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Product
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} rounded-lg p-6 border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold text-foreground">{products.length}</p>
                  </div>
                  <Icon name="Package" size={24} className="text-accent" />
                </div>
              </div>
              <div className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} rounded-lg p-6 border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Products</p>
                    <p className="text-2xl font-bold text-success">
                      {products.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <Icon name="Eye" size={24} className="text-success" />
                </div>
              </div>
              <div className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} rounded-lg p-6 border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold text-warning">
                      {products.filter(p => p.stock > 0 && p.stock <= 10).length}
                    </p>
                  </div>
                  <Icon name="AlertTriangle" size={24} className="text-warning" />
                </div>
              </div>
              <div className={`${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} rounded-lg p-6 border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-2xl font-bold text-destructive">
                      {products.filter(p => p.stock === 0).length}
                    </p>
                  </div>
                  <Icon name="XCircle" size={24} className="text-destructive" />
                </div>
              </div>
            </div>
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              onSavePreset={handleSavePreset}
              savedPresets={savedPresets}
              onLoadPreset={handleLoadPreset}
              brands={brands}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {getCurrentPageProducts().length} of {filteredProducts.length} products
                {selectedProducts.length > 0 && (
                  <span className="ml-2 text-accent">({selectedProducts.length} selected)</span>
                )}
              </p>
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              )}
            </div>
            <ProductTable
              products={getCurrentPageProducts()}
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct}
              onSelectAll={handleSelectAll}
              onEditProduct={handleEditProduct}
              onToggleStatus={handleToggleStatus}
              onDeleteProduct={handleDeleteProduct}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              isDarkMode={isDarkMode}
            />
            <BulkActionsBar
              selectedCount={selectedProducts.length}
              onBulkAction={handleBulkAction}
              onClearSelection={handleClearSelection}
              isVisible={selectedProducts.length > 0}
            />
            <ProductFormModal
              isOpen={isProductModalOpen}
              onClose={() => {
                setIsProductModalOpen(false);
                setEditingProduct(null);
              }}
              product={editingProduct}
              onSave={handleSaveProduct}
              isLoading={isLoading}
              isDarkMode={isDarkMode}
              brands={brands}
            />
            <ImportExportModal
              isOpen={isImportExportModalOpen}
              onClose={() => setIsImportExportModalOpen(false)}
              mode={importExportMode}
              onImport={handleImport}
              onExport={handleExport}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProductManagement;