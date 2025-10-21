import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon'; // Adjust path as needed
import Button from '../../../components/ui/Button'; // Adjust path as needed

const SalesChart = ({ onDateRangeChange, orders, products, isDarkMode }) => {
  const [chartType, setChartType] = useState('line');
  const [dateRange, setDateRange] = useState('7days');

  const salesData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.sales += order.totalAmount;
      existing.orders += 1;
      existing.customers = new Set([...existing.customers, order.customerName]).size;
    } else {
      acc.push({ date, sales: order.totalAmount, orders: 1, customers: new Set([order.customerName]).size });
    }
    return acc;
  }, []);

  const categoryData = products.reduce((acc, product) => {
    const category = product.category;
    const existing = acc.find(c => c.category === category);
    const totalStock = Object.values(product.sizeStock || {}).reduce((sum, stock) => sum + (stock || 0), 0);
    const salesValue = product.price * totalStock;
    if (existing) {
      existing.sales += salesValue;
      existing.percentage = ((existing.sales / products.reduce((sum, p) => sum + p.price * Object.values(p.sizeStock || {}).reduce((s, stock) => s + (stock || 0), 0), 0)) * 100).toFixed(0);
    } else {
      acc.push({
        category,
        sales: salesValue,
        percentage: ((salesValue / products.reduce((sum, p) => sum + p.price * Object.values(p.sizeStock || {}).reduce((s, stock) => s + (stock || 0), 0), 0)) * 100).toFixed(0)
      });
    }
    return acc;
  }, []);

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 3 Months' },
    { value: 'year', label: 'This Year' }
  ];

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    onDateRangeChange(newRange);
  };

  const formatCurrency = (value) => `₹${(value / 1000).toFixed(0)}K`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className={`rounded-lg p-4 shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
          <p className="text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry?.color }} />
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{entry?.dataKey}:</span>
              <span className="font-medium">
                {entry?.dataKey === 'sales' ? formatCurrency(entry?.value) : entry?.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-xl overflow-hidden border shadow-lg ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
      {/* Header Section */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Sales Analytics</h3>
            <p className="text-sm text-gray-400 mt-1">Revenue trends and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className={`${chartType === 'line' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md transition-colors`}
              >
                <Icon name="TrendingUp" size={16} />
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('bar')}
                className={`${chartType === 'bar' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md transition-colors`}
              >
                <Icon name="BarChart3" size={16} />
              </Button>
            </div>
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className={`rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-green-500" />
              <span className="text-sm text-gray-400">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}</p>
            <p className="text-xs text-green-500">+12.5% from last period</p>
          </div>
          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <Icon name="ShoppingCart" size={16} className="text-blue-500" />
              <span className="text-sm text-gray-400">Total Orders</span>
            </div>
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-xs text-blue-500">+8.3% from last period</p>
          </div>
          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-purple-500" />
              <span className="text-sm text-gray-400">New Customers</span>
            </div>
            <p className="text-2xl font-bold">{new Set(orders.map(o => o.customerName)).size}</p>
            <p className="text-xs text-purple-500">+15.7% from last period</p>
          </div>
        </div>
      </div>
      {/* Chart Section */}
      <div className="p-6">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#000' : '#000'} />
                <XAxis
                  dataKey="date"
                  className="text-sm"
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="text-sm"
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5" // Indigo for sales
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981" // Green for orders
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#ec4899" // Pink for customers
                  strokeWidth={2}
                  dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#000' : '#000'} />
                <XAxis
                  dataKey="date"
                  className="text-sm"
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="text-sm"
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="customers" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
      {/* Sales by Category Section */}
      <div className="p-6 border-t border-gray-800">
        <h4 className="text-sm font-semibold mb-4">Sales by Category</h4>
        <div className="space-y-3">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                />
                <span className="text-sm font-medium">{category.category}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">{formatCurrency(category.sales)}</span>
                <span className="text-xs text-gray-400 w-8 text-right">{category.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;