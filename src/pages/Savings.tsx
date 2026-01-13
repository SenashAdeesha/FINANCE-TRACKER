// pages/Savings.tsx
import { useState, useEffect, type ChangeEvent, type MouseEvent } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaChevronDown, FaPiggyBank, FaChartLine } from "react-icons/fa";

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
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{editingEntry ? 'Edit' : 'Add'} {step === 'select' ? 'Entry' : (step === 'savings' ? 'Savings' : 'Investment')}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Choose entry type to continue</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStep('savings')}
                  className="p-4 border rounded-md bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm flex items-center justify-center gap-2"
                >
                  <FaPiggyBank size={20} />
                  <span>Savings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('investment')}
                  className="p-4 border rounded-md bg-green-600 text-white hover:bg-green-700 border-green-600 shadow-sm flex items-center justify-center gap-2"
                >
                  <FaChartLine size={20} />
                  <span>Investment</span>
                </button>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-md">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {/* Type toggle */}
              <div className="mb-4">
                <div className="inline-flex rounded-md border bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setStep('savings')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md ${step === 'savings' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Savings
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('investment')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md ${step === 'investment' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Investment
                  </button>
                </div>
              </div>

              {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Recurring {step === 'savings' ? 'Savings' : 'Investment'}</span>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-md">Cancel</button>
              <button type="button" onClick={handleSubmit} className={`px-4 py-2 rounded-md text-white ${step === 'savings' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
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
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [timePeriod, setTimePeriod] = useState('1 month');
  const [filterMode, setFilterMode] = useState<'period' | 'month'>('period');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [savingsData, setSavingsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      'bg-blue-500', 'bg-teal-500', 'bg-indigo-500', 'bg-purple-500', 
      'bg-green-500', 'bg-yellow-500', 'bg-pink-500', 'bg-red-500'
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
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} pageTitle="Savings & Investments" />

        <main className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setModalOpen(true)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Entry
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
                        ? 'bg-purple-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Time Period
                  </button>
                  <button
                    onClick={() => setFilterMode('month')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterMode === 'month' 
                        ? 'bg-purple-600 text-white shadow-sm' 
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
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer shadow-sm"
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
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm text-gray-600 mb-2">
                Total Amount ({filterMode === 'month' 
                  ? new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : timePeriod})
              </h3>
              <div className="text-3xl font-bold text-green-600">Rs. {totalAmount.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">Combined savings & investments</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaPiggyBank className="text-blue-600 text-xl" />
                <h3 className="text-sm text-gray-600">Total Savings</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600">Rs. {totalSavings.toLocaleString()}</div>
              <div className="text-xs text-blue-600 mt-1">↑ 12% from last period</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaChartLine className="text-purple-600 text-xl" />
                <h3 className="text-sm text-gray-600">Total Investments</h3>
              </div>
              <div className="text-3xl font-bold text-purple-600">Rs. {totalInvestments.toLocaleString()}</div>
              <div className="text-xs text-purple-600 mt-1">↑ 18% from last period</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-lg font-semibold">Recent Entries</h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Type:</label>
                      <div className="relative inline-block">
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm"
                        >
                          <option value="All">All</option>
                          <option value="savings">Savings</option>
                          <option value="investment">Investments</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <FaChevronDown size={12} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Category:</label>
                      <div className="relative inline-block">
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm"
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
                          <option value="Other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <FaChevronDown size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {filteredData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{item.description}</div>
                          {item.recurring && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">Recurring</span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.type === 'savings' 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'bg-purple-50 text-purple-700'
                          }`}>
                            {item.type === 'savings' ? 'Savings' : 'Investment'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.category} • {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-lg font-semibold ${
                          item.type === 'savings' ? 'text-blue-600' : 'text-purple-600'
                        }`}>
                          +Rs. {Number(item.amount).toLocaleString()}
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
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Breakdown</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Savings Categories</h3>
                <div className="space-y-3">
                  {savingsCategories.map((cat) => {
                    const percentage = totalSavings > 0 ? (cat.amount / totalSavings) * 100 : 0;
                    return (
                      <div key={cat.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{cat.name}</span>
                          <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-xs font-semibold">Rs. {cat.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Investment Categories</h3>
                <div className="space-y-3">
                  {investmentCategories.map((cat) => {
                    const percentage = totalInvestments > 0 ? (cat.amount / totalInvestments) * 100 : 0;
                    return (
                      <div key={cat.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{cat.name}</span>
                          <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-xs font-semibold">Rs. {cat.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <SavingsModal 
        isOpen={modalOpen} 
        onClose={handleModalClose}
        onSuccess={fetchData}
        editingEntry={editingEntry}
      />
    </div>
  );
}

export default Savings;
