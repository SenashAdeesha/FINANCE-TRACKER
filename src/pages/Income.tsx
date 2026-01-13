// pages/Income.tsx
import { useState, useEffect, type ChangeEvent, type MouseEvent } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaChevronDown } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:3001/api';

// Types
interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

interface Income {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  description: string;
  date: string;
  recurring: boolean;
  created_at?: string;
  category_name?: string;
  category_icon?: string;
}

// Income Modal Component
function IncomeModal({ 
  isOpen, 
  onClose,
  editingIncome,
  categories,
  onSubmit
}: { 
  isOpen: boolean; 
  onClose: () => void;
  editingIncome: Income | null;
  categories: Category[];
  onSubmit: (data: any) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    recurring: false,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingIncome) {
      setFormData({
        amount: editingIncome.amount.toString(),
        date: editingIncome.date.split('T')[0],
        category: editingIncome.category_id.toString(),
        recurring: editingIncome.recurring,
        description: editingIncome.description || ''
      });
    } else if (isOpen) {
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        recurring: false,
        description: ''
      });
    }
  }, [editingIncome, isOpen]);

  const handleClose = () => {
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      recurring: false,
      description: ''
    });
    onClose();
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        category_id: parseInt(formData.category),
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        recurring: formData.recurring
      });
      handleClose();
    } catch (error) {
      console.error('Error submitting income:', error);
      alert('Failed to save income. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add Income</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Recurring Payment</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Additional details"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={handleClose} 
                className="px-4 py-2 border rounded-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : editingIncome ? 'Update Income' : 'Add Income'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Income() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [timePeriod, setTimePeriod] = useState('1 month');
  const [filterMode, setFilterMode] = useState<'period' | 'month'>('period');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [incomeData, setIncomeData] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch income data
  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/income`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories');
    }
  };

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/income`);
      if (!response.ok) throw new Error('Failed to fetch income');
      const data = await response.json();
      setIncomeData(data);
    } catch (error) {
      console.error('Error fetching income:', error);
      alert('Failed to load income data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (editingIncome) {
      // Update existing income
      const response = await fetch(`${API_BASE_URL}/income/${editingIncome.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update income');
    } else {
      // Create new income
      const response = await fetch(`${API_BASE_URL}/income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, user_id: 1 }) // Using demo user
      });
      if (!response.ok) throw new Error('Failed to create income');
    }
    await fetchIncome();
    setEditingIncome(null);
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this income?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/income/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete income');
      await fetchIncome();
    } catch (error) {
      console.error('Error deleting income:', error);
      alert('Failed to delete income');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingIncome(null);
  };

  // OLD CODE - REMOVED
  // const incomeData = [
  //   { id: 1, source: "Salary", amount: 85000, date: "2026-01-01", category: "Salary", recurring: true },
  //   { id: 2, source: "Freelance Project", amount: 25000, date: "2026-01-05", category: "Freelance", recurring: false },
  //   { id: 3, source: "Investment Returns", amount: 8000, date: "2026-01-10", category: "Investment", recurring: false },
  //   { id: 4, source: "Rental Income", amount: 15000, date: "2026-01-01", category: "Rental", recurring: true },
  // ];

  // Calculate income based on time period or calendar month
  const calculateIncome = () => {
    if (filterMode === 'month') {
      // Filter by specific calendar month (1st to last day)
      const [year, month] = selectedMonth.split('-').map(Number);
      const startOfMonth = new Date(year, month - 1, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      return incomeData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
      });
    } else {
      // Filter by rolling time period
      const now = new Date();
      now.setHours(23, 59, 59, 999); // End of today
      
      const monthsMap: Record<string, number> = {
        '1 month': 1,
        '2 months': 2,
        '3 months': 3,
        '6 months': 6,
        '1 year': 12,
        '2 years': 24,
        '3 years': 36,
        '4 years': 48,
        '5 years': 60,
        'All time': 9999
      };

      const monthsBack = monthsMap[timePeriod] || 1;
      
      if (timePeriod === 'All time') {
        return incomeData;
      }
      
      const cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);
      cutoffDate.setHours(0, 0, 0, 0); // Start of that day

      return incomeData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate && itemDate <= now;
      });
    }
  };

  const filteredByTime = calculateIncome();
  const totalIncome = filteredByTime.reduce((sum, item) => sum + Number(item.amount), 0);
  const recurringIncome = filteredByTime.filter(item => item.recurring).reduce((sum, item) => sum + Number(item.amount), 0);
  const oneTimeIncome = filteredByTime.filter(item => !item.recurring).reduce((sum, item) => sum + Number(item.amount), 0);

  // Calculate category breakdown
  const categoryBreakdown = categories.map(cat => {
    const categoryTotal = filteredByTime
      .filter(item => item.category_id === cat.id)
      .reduce((sum, item) => sum + Number(item.amount), 0);
    return { ...cat, amount: categoryTotal };
  }).filter(cat => cat.amount > 0);

  // Filter income data by category
  const getFilteredIncome = () => {
    if (categoryFilter === 'All') return filteredByTime;
    const selectedCategory = categories.find(c => c.name === categoryFilter);
    if (!selectedCategory) return filteredByTime;
    return filteredByTime.filter(item => item.category_id === selectedCategory.id);
  };

  const filteredIncome = getFilteredIncome();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} pageTitle="Income" />

        <main className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setModalOpen(true)}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Income
            </button>
          </div>

          {/* Time Period Filter */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="font-semibold text-lg">Filter By</h3>
              
              <div className="flex items-center gap-4">
                {/* Filter Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setFilterMode('period')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterMode === 'period' 
                        ? 'bg-green-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Time Period
                  </button>
                  <button
                    onClick={() => setFilterMode('month')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterMode === 'month' 
                        ? 'bg-green-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Calendar Month
                  </button>
                </div>

                {/* Period Selector */}
                {filterMode === 'period' ? (
                  <div className="relative inline-block">
                    <select
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer shadow-sm"
                    >
                      <optgroup label="Months">
                        <option value="1 month">Last 1 Month</option>
                        <option value="2 months">Last 2 Months</option>
                        <option value="3 months">Last 3 Months</option>
                        <option value="6 months">Last 6 Months</option>
                      </optgroup>
                      <optgroup label="Years">
                        <option value="1 year">Last 1 Year</option>
                        <option value="2 years">Last 2 Years</option>
                        <option value="3 years">Last 3 Years</option>
                        <option value="4 years">Last 4 Years</option>
                        <option value="5 years">Last 5 Years</option>
                      </optgroup>
                      <optgroup label="Other">
                        <option value="All time">All Time</option>
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <FaChevronDown size={12} />
                    </div>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      max={new Date().toISOString().slice(0, 7)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm text-gray-600 mb-2">
                Total Income ({filterMode === 'month' 
                  ? new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : timePeriod})
              </h3>
              <div className="text-3xl font-bold text-green-600">Rs. {totalIncome.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">{filteredByTime.length} transactions</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm text-gray-600 mb-2">Recurring Income</h3>
              <div className="text-3xl font-bold">Rs. {recurringIncome.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">From recurring sources</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm text-gray-600 mb-2">One-time Income</h3>
              <div className="text-3xl font-bold">Rs. {oneTimeIncome.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">From one-time sources</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Recent Income</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Showing {filteredIncome.length} of {incomeData.length} total records
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Filter:</label>
                    <div className="relative inline-block">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer shadow-sm"
                      >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FaChevronDown size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading income data...</div>
                ) : filteredIncome.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-2">No income records found for this period</div>
                    {incomeData.length > 0 && filteredByTime.length === 0 && (
                      <div className="text-sm text-gray-400">
                        Try selecting a longer time period to see {incomeData.length} total record{incomeData.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    {incomeData.length === 0 && (
                      <div className="text-sm text-gray-400">Click "Add Income" to create your first record</div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredIncome.map((income) => (
                      <div key={income.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">{income.category_icon} {income.description || income.category_name}</div>
                            {income.recurring && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">Recurring</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {income.category_name} • {new Date(income.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-semibold text-green-600">+Rs. {Number(income.amount).toLocaleString()}</div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(income)}
                              className="p-2 hover:bg-gray-200 rounded"
                            >
                              <FaEdit className="text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleDelete(income.id)}
                              className="p-2 hover:bg-red-100 rounded"
                            >
                              <FaTrash className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Income by Category</h2>
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : categoryBreakdown.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No income data available</div>
              ) : (
                <div className="space-y-4">
                  {categoryBreakdown.map((cat) => {
                    const percentage = totalIncome > 0 ? (cat.amount / totalIncome) * 100 : 0;
                    return (
                      <div key={cat.id}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{cat.icon} {cat.name}</span>
                          <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${percentage}%`, backgroundColor: cat.color }}></div>
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-sm font-semibold">Rs. {cat.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <IncomeModal 
        isOpen={modalOpen} 
        onClose={handleModalClose}
        editingIncome={editingIncome}
        categories={categories}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Income;