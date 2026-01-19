// pages/Savings.tsx
import { useState, useEffect, type ChangeEvent, type MouseEvent } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaChevronDown, FaPiggyBank, FaChartLine, FaUniversity, FaHome, FaCar, FaGraduationCap, FaUmbrella, FaWallet, FaCoins, FaChartBar, FaBitcoin, FaGem } from "react-icons/fa";
import PageLayout from "../components/PageLayout";
import { useCurrency } from "../context/CurrencyContext";

const API_BASE_URL = 'http://localhost:3001/api';

// Savings Modal Component
function SavingsModal({ isOpen, onClose, onSuccess, editingEntry }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; editingEntry?: any }) {
  const [step, setStep] = useState<'select' | 'savings' | 'investment'>('select');
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    recurring: false,
    description: ''
  });

  // Populate form when editing
  useEffect(() => {
    if (editingEntry && isOpen) {
      setStep(editingEntry.type);
      setFormData({
        amount: editingEntry.amount.toString(),
        date: editingEntry.date.split('T')[0],
        category: editingEntry.category,
        recurring: editingEntry.recurring,
        description: editingEntry.description || ''
      });
    }
  }, [editingEntry, isOpen]);

  const handleClose = () => {
    setStep('select');
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

    if (!formData.amount || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const url = editingEntry
        ? `${API_BASE_URL}/savings-investments/${editingEntry.id}`
        : `${API_BASE_URL}/savings-investments`;

      const method = editingEntry ? 'PUT' : 'POST';

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 1;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          type: step,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: formData.date,
          recurring: formData.recurring
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingEntry ? 'update' : 'add'} ${step}`);
      }

      alert(`${step === 'savings' ? 'Savings' : 'Investment'} ${editingEntry ? 'updated' : 'added'} successfully!`);
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert(`Failed to ${editingEntry ? 'update' : 'add'} ${step}. Please try again.`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const savingsCategories = ['Emergency Fund', 'Vacation', 'Home Down Payment', 'Car Purchase', 'Education', 'Retirement', 'General Savings', 'Other'];
  const investmentCategories = ['Stocks', 'Mutual Funds', 'Bonds', 'Real Estate', 'Cryptocurrency', 'Gold', 'Fixed Deposit', 'Other'];

  const categories = step === 'savings' ? savingsCategories : investmentCategories;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-gradient-to-br from-white/95 via-cyan-50/50 to-blue-50/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 w-full max-w-lg overflow-hidden relative">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl -z-10"></div>

        <div className="flex items-center justify-between px-8 py-6 border-b border-cyan-200/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              {step === 'savings' ? <FaPiggyBank className="text-white" size={16} /> : step === 'investment' ? <FaChartLine className="text-white" size={16} /> : <FaPlus className="text-white" size={16} />}
            </div>
            {editingEntry ? 'Edit' : 'Add'} {step === 'select' ? 'Entry' : (step === 'savings' ? 'Savings' : 'Investment')}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-all" aria-label="Close">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-8 relative z-10">
          {step === 'select' ? (
            <div className="space-y-5">
              <p className="text-sm text-gray-600 font-medium mb-4">Choose entry type to continue</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStep('savings')}
                  className="p-6 border-2 border-cyan-300 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all hover:scale-105 flex flex-col items-center justify-center gap-3"
                >
                  <FaPiggyBank size={28} />
                  <span className="font-bold text-lg">Savings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('investment')}
                  className="p-6 border-2 border-green-300 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all hover:scale-105 flex flex-col items-center justify-center gap-3"
                >
                  <FaChartLine size={28} />
                  <span className="font-bold text-lg">Investment</span>
                </button>
              </div>
              <div className="flex justify-end pt-2">
                <button type="button" onClick={handleClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all hover:scale-105">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {/* Type toggle */}
              <div className="mb-6">
                <div className="inline-flex rounded-xl border-2 border-gray-200 bg-gray-100 p-1.5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setStep('savings')}
                    className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${step === 'savings'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-white hover:shadow-sm'
                      }`}
                  >
                    Savings
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('investment')}
                    className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${step === 'investment'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-white hover:shadow-sm'
                      }`}
                  >
                    Investment
                  </button>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white shadow-sm hover:shadow-md transition-all font-medium"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                      Amount
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none shadow-sm hover:shadow-md transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none shadow-sm hover:shadow-md transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-cyan-50/50 rounded-xl border-2 border-cyan-200/50 hover:border-cyan-300 transition-all">
                    <input
                      type="checkbox"
                      name="recurring"
                      checked={formData.recurring}
                      onChange={handleChange}
                      className="w-5 h-5 text-cyan-600 border-gray-300 rounded-lg focus:ring-cyan-500 shadow-sm"
                    />
                    <span className="text-sm font-bold text-gray-700">Recurring {step === 'savings' ? 'Savings' : 'Investment'}</span>
                  </label>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                    Note (optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Additional details"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none shadow-sm hover:shadow-md transition-all font-medium"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={handleClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all hover:scale-105">Cancel</button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={`px-6 py-3 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 ${step === 'savings'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-cyan-500/30 hover:shadow-cyan-500/40 border-cyan-400'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/30 hover:shadow-green-500/40 border-green-400'
                      }`}
                  >
                    {editingEntry ? 'Update' : 'Add'} {step === 'savings' ? 'Savings' : 'Investment'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Savings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  // Function to get icon based on category
  const getCategoryIcon = (category: string, type: string) => {
    const iconClass = "text-2xl";

    // Savings categories
    if (type === 'savings') {
      switch (category) {
        case 'Emergency Fund': return <FaUmbrella className={iconClass} />;
        case 'Vacation': return <FaChartLine className={iconClass} />;
        case 'Home Down Payment': return <FaHome className={iconClass} />;
        case 'Car Purchase': return <FaCar className={iconClass} />;
        case 'Education': return <FaGraduationCap className={iconClass} />;
        case 'Retirement': return <FaUniversity className={iconClass} />;
        case 'General Savings': return <FaPiggyBank className={iconClass} />;
        default: return <FaWallet className={iconClass} />;
      }
    }

    // Investment categories
    switch (category) {
      case 'Stocks': return <FaChartBar className={iconClass} />;
      case 'Mutual Funds': return <FaCoins className={iconClass} />;
      case 'Bonds': return <FaUniversity className={iconClass} />;
      case 'Real Estate': return <FaHome className={iconClass} />;
      case 'Cryptocurrency': return <FaBitcoin className={iconClass} />;
      case 'Gold': return <FaGem className={iconClass} />;
      case 'Fixed Deposit': return <FaUniversity className={iconClass} />;
      default: return <FaChartLine className={iconClass} />;
    }
  };
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [timePeriod, setTimePeriod] = useState('1 month');
  const [filterMode, setFilterMode] = useState<'period' | 'month'>('period');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [savingsData, setSavingsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCurrency();

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/savings-investments`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setSavingsData(data);
    } catch (error) {
      console.error('Error fetching savings/investments:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/savings-investments/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');
      await fetchData();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingEntry(null);
  };

  // Calculate based on time period or calendar month
  const calculateData = () => {
    if (filterMode === 'month') {
      // Filter by specific calendar month (1st to last day)
      const [year, month] = selectedMonth.split('-').map(Number);
      const startOfMonth = new Date(year, month - 1, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      return savingsData.filter(item => {
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
        return savingsData;
      }

      const cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);
      cutoffDate.setHours(0, 0, 0, 0); // Start of that day

      return savingsData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate && itemDate <= now;
      });
    }
  };

  const filteredByTime = calculateData();

  // Calculate category breakdowns from actual data
  const calculateCategoryBreakdown = (type: 'savings' | 'investment') => {
    const filtered = filteredByTime.filter(item => item.type === type);
    const categoryMap = new Map<string, number>();

    filtered.forEach(item => {
      const current = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, current + Number(item.amount));
    });

    const colors = [
      'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-emerald-500', 'bg-sky-500', 'bg-blue-600', 'bg-cyan-600'
    ];

    return Array.from(categoryMap.entries())
      .map(([name, amount], index) => ({
        name,
        amount,
        color: colors[index % colors.length],
        type
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const savingsCategories = calculateCategoryBreakdown('savings');
  const investmentCategories = calculateCategoryBreakdown('investment');

  // Apply type filter
  const filteredByType = typeFilter === 'All'
    ? filteredByTime
    : filteredByTime.filter(item => item.type === typeFilter);

  // Apply category filter
  const getFilteredData = () => {
    if (categoryFilter === 'All') return filteredByType;
    return filteredByType.filter(item => item.category === categoryFilter);
  };

  const filteredData = getFilteredData();

  const totalSavings = filteredByTime.filter(item => item.type === 'savings').reduce((sum, item) => sum + Number(item.amount), 0);
  const totalInvestments = filteredByTime.filter(item => item.type === 'investment').reduce((sum, item) => sum + Number(item.amount), 0);
  const totalAmount = totalSavings + totalInvestments;

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      title="Savings"
      underlineColor="bg-gradient-to-r from-cyan-500 to-blue-600"
      hideContentTitle={true}
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 text-sm">Manage your savings goals and investment portfolio</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all hover:scale-105 flex items-center gap-3 border-2 border-cyan-400"
          >
            <FaPlus className="text-lg" />
            Add Entry
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
                    ? 'bg-white text-cyan-700 shadow-md scale-105'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Time Period
                </button>
                <button
                  onClick={() => setFilterMode('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'month'
                    ? 'bg-white text-cyan-700 shadow-md scale-105'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Calendar Month
                </button>
              </div>

              {/* Selectors */}
              {filterMode === 'period' ? (
                <div className="relative inline-block">
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer shadow-sm ml-2"
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
                    </optgroup>
                    <option value="All time">All Time</option>
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
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer shadow-sm ml-2"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: `Total Portfolio (${filterMode === 'month' ? new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : timePeriod})`, amount: totalAmount },
            { label: 'Total Savings', amount: totalSavings },
            { label: 'Total Investments', amount: totalInvestments }
          ].map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105 text-white">
              <h3 className="text-sm text-white/90 mb-2">{stat.label}</h3>
              <div className="text-3xl font-bold">{formatCurrency(stat.amount)}</div>
              <div className="text-xs text-white/80 mt-1">
                {i === 0 ? "Combined savings & investments" : (i === 1 ? "↑ 12% from last period" : "↑ 18% from last period")}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Entries */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white/90 via-cyan-50/40 to-blue-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden relative">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10"></div>

            <div className="p-8 border-b border-white/50 backdrop-blur-xl relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Recent Entries</h2>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Your savings & investment activities</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">Filter:</label>
                    <div className="relative inline-block">
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="appearance-none bg-white border-2 border-cyan-200 rounded-xl px-4 py-2 pr-10 text-sm font-bold text-gray-800 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                      >
                        <option value="All">All Types</option>
                        <option value="savings">Savings</option>
                        <option value="investment">Investments</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FaChevronDown size={12} />
                      </div>
                    </div>
                    <div className="relative inline-block">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="appearance-none bg-white border-2 border-cyan-200 rounded-xl px-4 py-2 pr-10 text-sm font-bold text-gray-800 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer shadow-lg hover:shadow-xl transition-all ml-2"
                      >
                        <option value="All">All Categories</option>
                        <optgroup label="Savings">
                          <option value="Emergency Fund">Emergency Fund</option>
                          <option value="Vacation">Vacation</option>
                          <option value="Home Down Payment">Home Down Payment</option>
                          <option value="Car Purchase">Car Purchase</option>
                          <option value="Education">Education</option>
                          <option value="Retirement">Retirement</option>
                          <option value="General Savings">General Savings</option>
                        </optgroup>
                        <optgroup label="Investments">
                          <option value="Stocks">Stocks</option>
                          <option value="Mutual Funds">Mutual Funds</option>
                          <option value="Bonds">Bonds</option>
                          <option value="Real Estate">Real Estate</option>
                          <option value="Cryptocurrency">Cryptocurrency</option>
                          <option value="Gold">Gold</option>
                          <option value="Fixed Deposit">Fixed Deposit</option>
                        </optgroup>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FaChevronDown size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 relative z-10">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading data...</div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No records found for this period</div>
              ) : (
                <div className="space-y-4">
                  {filteredData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-5 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl hover:bg-white/90 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl ${item.type === 'savings' ? 'text-cyan-600' : 'text-blue-600'}`}>
                            {getCategoryIcon(item.category, item.type)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 text-lg">{item.description || item.category}</div>
                            <div className="text-sm text-gray-600 mt-0.5 font-medium">
                              {item.category} • {new Date(item.date).toLocaleDateString()}
                            </div>
                          </div>
                          {item.recurring && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs rounded-full font-semibold shadow-md">Recurring</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-xl font-bold ${item.type === 'savings' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}`}>
                          +{formatCurrency(Number(item.amount))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-200 rounded">
                            <FaEdit className="text-gray-600" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-100 rounded">
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

          {/* Breakdown Section */}
          <div className="bg-gradient-to-br from-white/90 via-cyan-50/40 to-blue-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl -z-10"></div>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">Portfolio Analysis</h2>

            {/* Savings Breakdown */}
            <div className="space-y-5 mb-8">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                Savings Categories
              </h3>
              {savingsCategories.map((cat) => {
                const percentage = totalSavings > 0 ? (cat.amount / totalSavings) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-gray-800">{cat.name}</span>
                      <span className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-3 shadow-inner backdrop-blur-sm overflow-hidden">
                      <div
                        className={`${cat.color} h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <span className="text-sm font-bold text-gray-700">{formatCurrency(cat.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Investment Breakdown */}
            <div className="space-y-5 pt-8 border-t border-white/50">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                Investment Categories
              </h3>
              {investmentCategories.map((cat) => {
                const percentage = totalInvestments > 0 ? (cat.amount / totalInvestments) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-gray-800">{cat.name}</span>
                      <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-3 shadow-inner backdrop-blur-sm overflow-hidden">
                      <div
                        className={`${cat.color} h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <span className="text-sm font-bold text-gray-700">{formatCurrency(cat.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Growth Trend Chart */}
            <div className="mt-8 pt-8 border-t border-white/50">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaChartLine className="text-cyan-600" />
                Portfolio Growth
              </h3>
              {(() => {
                // Group savings & investments by month with proper date sorting
                const monthlyMap = new Map<string, { date: Date; savings: number; investment: number; label: string }>();
                
                filteredByTime.forEach(item => {
                  const date = new Date(item.date);
                  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                  
                  if (monthlyMap.has(key)) {
                    const existing = monthlyMap.get(key)!;
                    existing[item.type as 'savings' | 'investment'] += Number(item.amount);
                  } else {
                    monthlyMap.set(key, {
                      date,
                      savings: item.type === 'savings' ? Number(item.amount) : 0,
                      investment: item.type === 'investment' ? Number(item.amount) : 0,
                      label
                    });
                  }
                });
                
                // Sort by date and take last 6 months
                const sortedEntries = Array.from(monthlyMap.entries())
                  .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
                  .slice(-6);
                
                const maxAmount = Math.max(...sortedEntries.map(([_, v]) => v.savings + v.investment), 0);
                
                return sortedEntries.length > 0 ? (
                  <div className="space-y-2">
                    <div className="relative">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500 font-medium">
                        <span className="text-right pr-2">{formatCurrency(maxAmount)}</span>
                        <span className="text-right pr-2">{formatCurrency(maxAmount * 0.75)}</span>
                        <span className="text-right pr-2">{formatCurrency(maxAmount * 0.5)}</span>
                        <span className="text-right pr-2">{formatCurrency(maxAmount * 0.25)}</span>
                        <span className="text-right pr-2">0</span>
                      </div>
                      
                      {/* Chart area with grid */}
                      <div className="ml-16 relative">
                        {/* Horizontal grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                          {[0, 25, 50, 75, 100].map((percent) => (
                            <div key={percent} className="w-full border-t border-gray-200 border-dashed"></div>
                          ))}
                        </div>
                        
                        {/* Dual line graph */}
                        <div className="h-48 relative px-2">
                          <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                            {/* Savings line */}
                            <polyline
                              points={sortedEntries.map(([key, data], idx) => {
                                const x = (idx / (sortedEntries.length - 1)) * 100;
                                const y = 100 - (maxAmount > 0 ? (data.savings / maxAmount) * 100 : 0);
                                return `${x}%,${y}%`;
                              }).join(' ')}
                              fill="none"
                              stroke="url(#cyanGradient)"
                              strokeWidth="3"
                              className="drop-shadow-lg"
                            />
                            {/* Investment line */}
                            <polyline
                              points={sortedEntries.map(([key, data], idx) => {
                                const x = (idx / (sortedEntries.length - 1)) * 100;
                                const y = 100 - (maxAmount > 0 ? (data.investment / maxAmount) * 100 : 0);
                                return `${x}%,${y}%`;
                              }).join(' ')}
                              fill="none"
                              stroke="url(#blueGradient)"
                              strokeWidth="3"
                              className="drop-shadow-lg"
                              strokeDasharray="5,5"
                            />
                            {/* Gradient definitions */}
                            <defs>
                              <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
                              </linearGradient>
                              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                              </linearGradient>
                            </defs>
                            {/* Area under savings line */}
                            <defs>
                              <linearGradient id="areaCyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.2 }} />
                                <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.02 }} />
                              </linearGradient>
                            </defs>
                            <polygon
                              points={`
                                0%,100% 
                                ${sortedEntries.map(([key, data], idx) => {
                                  const x = (idx / (sortedEntries.length - 1)) * 100;
                                  const y = 100 - (maxAmount > 0 ? (data.savings / maxAmount) * 100 : 0);
                                  return `${x}%,${y}%`;
                                }).join(' ')} 
                                100%,100%
                              `}
                              fill="url(#areaCyanGradient)"
                            />
                          </svg>
                          
                          {/* Data points with tooltips */}
                          <div className="absolute inset-0 flex justify-between items-end px-2">
                            {sortedEntries.map(([key, data], idx) => {
                              const savingsY = maxAmount > 0 ? (data.savings / maxAmount) * 100 : 0;
                              const investmentY = maxAmount > 0 ? (data.investment / maxAmount) * 100 : 0;
                              const totalAmt = data.savings + data.investment;
                              
                              return (
                                <div key={key} className="flex-1 flex justify-center relative group" style={{ height: '100%' }}>
                                  {/* Savings point */}
                                  {data.savings > 0 && (
                                    <div className="absolute" style={{ bottom: `${savingsY}%`, transform: 'translateY(50%)' }}>
                                      <div className="w-3 h-3 bg-cyan-500 border-2 border-white rounded-full shadow-lg cursor-pointer transform transition-all duration-200 group-hover:scale-150 group-hover:bg-cyan-600"></div>
                                    </div>
                                  )}
                                  {/* Investment point */}
                                  {data.investment > 0 && (
                                    <div className="absolute" style={{ bottom: `${investmentY}%`, transform: 'translateY(50%)' }}>
                                      <div className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg cursor-pointer transform transition-all duration-200 group-hover:scale-150 group-hover:bg-blue-600"></div>
                                    </div>
                                  )}
                                  {/* Tooltip */}
                                  <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl">
                                    <div className="font-semibold mb-1">{data.label}</div>
                                    {data.savings > 0 && <div className="text-cyan-300">💰 Savings: {formatCurrency(data.savings)}</div>}
                                    {data.investment > 0 && <div className="text-blue-300">📈 Investment: {formatCurrency(data.investment)}</div>}
                                    <div className="border-t border-gray-600 mt-1 pt-1">Total: {formatCurrency(totalAmt)}</div>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="ml-16 flex justify-between px-2">
                      {sortedEntries.map(([key, data]) => (
                        <div key={key} className="flex-1 text-center">
                          <span className="text-xs font-semibold text-gray-600">{data.label}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg width="20" height="3">
                          <line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#06b6d4" strokeWidth="3" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-700">Savings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="20" height="3">
                          <line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#3b82f6" strokeWidth="3" strokeDasharray="5,5" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-700">Investments</span>
                      </div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-2 italic">Dual trend view • Showing last {sortedEntries.length} months • Hover for details</div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <div className="mb-2">📊 No data to display</div>
                    <div className="text-xs">Add savings or investment entries to see the trend chart</div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <SavingsModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={fetchData}
        editingEntry={editingEntry}
      />
    </PageLayout>
  );
}

export default Savings;
