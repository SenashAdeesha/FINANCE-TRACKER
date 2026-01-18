import { useState, useEffect, type ChangeEvent, type MouseEvent } from "react";
import PageLayout from "../components/PageLayout";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaChevronDown, FaUtensils, FaCar, FaShoppingBag, FaHome, FaBolt, FaHeartbeat, FaGraduationCap, FaFilm, FaPlane, FaWifi, FaShoppingCart } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:3001/api';

// Types
interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

interface Expense {
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

// Expense Modal Component
function ExpenseModal({
  isOpen,
  onClose,
  editingExpense,
  categories,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  editingExpense: Expense | null;
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
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount.toString(),
        date: editingExpense.date.split('T')[0],
        category: editingExpense.category_id.toString(),
        recurring: editingExpense.recurring,
        description: editingExpense.description || ''
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
  }, [editingExpense, isOpen]);

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
      console.error('Error submitting expense:', error);
      alert('Failed to save expense. Please try again.');
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-gradient-to-br from-white/95 via-red-50/50 to-pink-50/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 w-full max-w-lg overflow-hidden relative">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>

        <div className="flex items-center justify-between px-8 py-6 border-b border-red-200/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
              <FaPlus className="text-white" size={16} />
            </div>
            {editingExpense ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-all" aria-label="Close">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-8 relative z-10">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-pink-600 rounded-full"></div>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white shadow-sm hover:shadow-md transition-all font-medium"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-pink-600 rounded-full"></div>
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none shadow-sm hover:shadow-md transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-pink-600 rounded-full"></div>
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none shadow-sm hover:shadow-md transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-red-50/50 rounded-xl border-2 border-red-200/50 hover:border-red-300 transition-all">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleChange}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded-lg focus:ring-red-500 shadow-sm"
                />
                <span className="text-sm font-bold text-gray-700">Recurring Payment</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-pink-600 rounded-full"></div>
                Note (optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Additional details"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none shadow-sm hover:shadow-md transition-all font-medium"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Expense() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [timePeriod, setTimePeriod] = useState('1 month');
  const [filterMode, setFilterMode] = useState<'period' | 'month'>('period');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [expenseData, setExpenseData] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch expense data
  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/expense`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories');
    }
  };

  const fetchExpense = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenseData(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      alert('Failed to load expenses data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (editingExpense) {
      // Update existing expense
      const response = await fetch(`${API_BASE_URL}/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update expense');
    } else {
      // Create new expense
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 1;

      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, user_id: userId })
      });
      if (!response.ok) throw new Error('Failed to create expense');
    }
    await fetchExpense();
    setEditingExpense(null);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete expense');
      await fetchExpense();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  // Function to get icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const iconClass = "text-red-600";

    switch (categoryName?.toLowerCase()) {
      case 'food':
      case 'dining':
      case 'groceries':
        return <FaUtensils className={iconClass} />;
      case 'transportation':
      case 'fuel':
      case 'vehicle':
        return <FaCar className={iconClass} />;
      case 'shopping':
      case 'clothing':
        return <FaShoppingBag className={iconClass} />;
      case 'housing':
      case 'rent':
      case 'mortgage':
        return <FaHome className={iconClass} />;
      case 'utilities':
      case 'electricity':
      case 'water':
        return <FaBolt className={iconClass} />;
      case 'healthcare':
      case 'medical':
      case 'insurance':
        return <FaHeartbeat className={iconClass} />;
      case 'education':
      case 'books':
        return <FaGraduationCap className={iconClass} />;
      case 'entertainment':
      case 'hobbies':
        return <FaFilm className={iconClass} />;
      case 'travel':
      case 'vacation':
        return <FaPlane className={iconClass} />;
      case 'internet':
      case 'phone':
      case 'subscriptions':
        return <FaWifi className={iconClass} />;
      default:
        return <FaShoppingCart className={iconClass} />;
    }
  };

  // OLD CODE - REMOVED
  // const expenseData = [
  //   { id: 1, source: "Salary", amount: 85000, date: "2026-01-01", category: "Salary", recurring: true },
  //   { id: 2, source: "Freelance Project", amount: 25000, date: "2026-01-05", category: "Freelance", recurring: false },
  //   { id: 3, source: "Investment Returns", amount: 8000, date: "2026-01-10", category: "Investment", recurring: false },
  //   { id: 4, source: "Rental Expense", amount: 15000, date: "2026-01-01", category: "Rental", recurring: true },
  // ];

  // Calculate expense based on time period or calendar month
  const calculateExpense = () => {
    if (filterMode === 'month') {
      // Filter by specific calendar month (1st to last day)
      const [year, month] = selectedMonth.split('-').map(Number);
      const startOfMonth = new Date(year, month - 1, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      return expenseData.filter(item => {
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
        return expenseData;
      }

      const cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);
      cutoffDate.setHours(0, 0, 0, 0); // Start of that day

      return expenseData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate && itemDate <= now;
      });
    }
  };

  const filteredByTime = calculateExpense();
  const totalExpense = filteredByTime.reduce((sum, item) => sum + Number(item.amount), 0);
  const recurringExpense = filteredByTime.filter(item => item.recurring).reduce((sum, item) => sum + Number(item.amount), 0);
  const oneTimeExpense = filteredByTime.filter(item => !item.recurring).reduce((sum, item) => sum + Number(item.amount), 0);

  // Calculate category breakdown
  const categoryBreakdown = categories.map(cat => {
    const categoryTotal = filteredByTime
      .filter(item => item.category_id === cat.id)
      .reduce((sum, item) => sum + parseFloat(String(item.amount)), 0);
    return { ...cat, amount: categoryTotal };
  }).filter(cat => cat.amount > 0).sort((a, b) => b.amount - a.amount);

  // Filter expense data by category
  const getFilteredExpense = () => {
    if (categoryFilter === 'All') return filteredByTime;
    const selectedCategory = categories.find(c => c.name === categoryFilter);
    if (!selectedCategory) return filteredByTime;
    return filteredByTime.filter(item => item.category_id === selectedCategory.id);
  };

  const filteredExpense = getFilteredExpense();

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      title="Expenses"
      underlineColor="bg-gradient-to-r from-red-500 to-pink-600"
      hideContentTitle={true}
    >
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 text-sm">Monitor and categorize all your spending</p>
        <button
          onClick={() => setModalOpen(true)}
          className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transition-all hover:scale-105 flex items-center gap-3 border-2 border-red-400"
        >
          <FaPlus className="text-lg" />
          Add Expense
        </button>
      </div>

      {/* Time Period Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-semibold text-lg">Filter By</h3>

          <div className="flex items-center gap-4">
            {/* Filter Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-200 rounded-xl p-1.5 shadow-inner">
              <button
                onClick={() => setFilterMode('period')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'period'
                  ? 'bg-white text-red-700 shadow-md scale-105'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Time Period
              </button>
              <button
                onClick={() => setFilterMode('month')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'month'
                  ? 'bg-white text-red-700 shadow-md scale-105'
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
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer shadow-sm"
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
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 text-white">
          <h3 className="text-sm text-white/90 mb-2">
            Total Expense ({filterMode === 'month'
              ? new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : timePeriod})
          </h3>
          <div className="text-3xl font-bold">Rs. {totalExpense.toLocaleString()}</div>
          <div className="text-xs text-white/80 mt-1">{filteredByTime.length} transactions</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 text-white">
          <h3 className="text-sm text-white/90 mb-2">Recurring Expense</h3>
          <div className="text-3xl font-bold">Rs. {recurringExpense.toLocaleString()}</div>
          <div className="text-xs text-white/80 mt-1">From recurring sources</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 text-white">
          <h3 className="text-sm text-white/90 mb-2">One-time Expense</h3>
          <div className="text-3xl font-bold">Rs. {oneTimeExpense.toLocaleString()}</div>
          <div className="text-xs text-white/80 mt-1">From one-time sources</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-white/90 via-red-50/40 to-pink-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden relative">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-red-400/20 rounded-full blur-3xl -z-10"></div>

          <div className="p-8 border-b border-white/50 backdrop-blur-xl relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Recent Expenses</h2>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  Showing {filteredExpense.length} of {expenseData.length} total records
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">Filter:</label>
                <div className="relative inline-block">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none bg-white border-2 border-red-200 rounded-xl px-6 py-3 pr-12 text-sm font-bold text-gray-800 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer shadow-lg hover:shadow-xl transition-all"
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
          <div className="p-8 relative z-10">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading expense data...</div>
            ) : filteredExpense.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">No expense records found for this period</div>
                {expenseData.length > 0 && filteredByTime.length === 0 && (
                  <div className="text-sm text-gray-400">
                    Try selecting a longer time period to see {expenseData.length} total record{expenseData.length !== 1 ? 's' : ''}
                  </div>
                )}
                {expenseData.length === 0 && (
                  <div className="text-sm text-gray-400">Click "Add Expense" to create your first record</div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExpense.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-5 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl hover:bg-white/90 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCategoryIcon(expense.category_name || '')}</div>
                        <div>
                          <div className="font-bold text-gray-800 text-lg">{expense.description || expense.category_name}</div>
                          <div className="text-sm text-gray-600 mt-0.5 font-medium">
                            {expense.category_name} • {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </div>
                        {expense.recurring && (
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs rounded-full font-semibold shadow-md">Recurring</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">-Rs. {Number(expense.amount).toLocaleString()}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          <FaEdit className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
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

        <div className="bg-gradient-to-br from-white/90 via-red-50/40 to-pink-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6">Expense by Category</h2>
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : categoryBreakdown.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No expense data available</div>
          ) : (
            <div className="space-y-5">
              {categoryBreakdown.map((cat) => {
                const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
                return (
                  <div key={cat.id} className="group">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-gray-800">{cat.icon} {cat.name}</span>
                      <span className="text-sm font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-3 shadow-inner backdrop-blur-sm overflow-hidden">
                      <div
                        className="h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: cat.color,
                          boxShadow: `0 0 10px ${cat.color}40`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <span className="text-sm font-bold text-gray-700">Rs. {cat.amount.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ExpenseModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        editingExpense={editingExpense}
        categories={categories}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
}

export default Expense;