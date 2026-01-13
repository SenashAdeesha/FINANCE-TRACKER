import { useState, useEffect, type ChangeEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import IncomeExpensesChart from "../components/IncomeExpensesChart";
import FinancialInsightsModal from "../components/FinancialInsightsModal";
import { FaMoneyBillWave, FaShoppingCart, FaWallet, FaPiggyBank, FaTimes, FaArrowDown, FaArrowUp, FaChevronDown, FaChartLine, FaExclamationCircle, FaBullseye, FaPlus } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:3001/api';

// Mock transaction data (kept for fallback)
const mockTransactions = [
  { id: 1, title: 'Salary', amount: 120000, date: '2026-01-05', type: 'income' },
  { id: 2, title: 'Grocery', amount: -5400, date: '2026-01-03', type: 'expense' },
  { id: 3, title: 'Freelance', amount: 25000, date: '2025-12-28', type: 'income' },
  { id: 4, title: 'Electric Bill', amount: -3200, date: '2025-12-20', type: 'expense' },
  { id: 5, title: 'Bonus', amount: 30000, date: '2025-11-15', type: 'income' },
  { id: 6, title: 'Shopping', amount: -8900, date: '2025-11-10', type: 'expense' },
  { id: 7, title: 'Investment', amount: 50000, date: '2025-09-05', type: 'income' },
  { id: 8, title: 'Car Payment', amount: -15000, date: '2025-08-20', type: 'expense' },
  { id: 9, title: 'Consulting', amount: 75000, date: '2024-06-10', type: 'income' },
  { id: 10, title: 'Vacation', amount: -45000, date: '2024-03-15', type: 'expense' },
];

// Transaction Modal Component
function TransactionModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<'select' | 'income' | 'expense' | 'savings'>('select');
  const [formData, setFormData] = useState<{
    amount: string;
    date: string;
    category_id: string;
    recurring: boolean;
    description: string;
    type: string;
    category: string;
  }>({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    recurring: false,
    description: '',
    type: 'savings',
    category: ''
  });
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        fetch(`${API_BASE_URL}/categories/income`),
        fetch(`${API_BASE_URL}/categories/expense`)
      ]);
      if (incomeRes.ok) {
        const incomeData = await incomeRes.json();
        setIncomeCategories(incomeData);
      }
      if (expenseRes.ok) {
        const expenseData = await expenseRes.json();
        setExpenseCategories(expenseData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleClose = () => {
    setStep('select');
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category_id: '',
      recurring: false,
      description: '',
      type: 'savings',
      category: ''
    });
    onClose();
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (step === 'savings') {
      if (!formData.amount || !formData.type || !formData.category) {
        alert('Please fill in all required fields');
        return;
      }
    } else {
      if (!formData.amount || !formData.category_id) {
        alert('Please fill in all required fields');
        return;
      }
    }

    try {
      let endpoint = '';
      let body = {};

      if (step === 'savings') {
        endpoint = 'savings-investments';
        body = {
          user_id: 1,
          type: formData.type,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: formData.date,
          recurring: formData.recurring
        };
      } else {
        endpoint = step === 'income' ? 'income' : 'expenses';
        body = {
          user_id: 1,
          category_id: parseInt(formData.category_id),
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: formData.date,
          recurring: formData.recurring
        };
      }

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Failed to add ${step}`);
      }

      const label = step === 'income' ? 'Income' : step === 'expense' ? 'Expense' : 'Savings';
      alert(`${label} added successfully!`);
      handleClose();
      onSuccess(); // Refresh dashboard data
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(`Failed to add ${step}. Please try again.`);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
          <h2 className="text-lg font-semibold">Add Transaction</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Choose transaction type to continue</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStep('income')}
                  className="p-4 border rounded-md bg-green-600 text-white hover:bg-green-700 border-green-600 shadow-sm"
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setStep('expense')}
                  className="p-4 border rounded-md bg-red-600 text-white hover:bg-red-700 border-red-600 shadow-sm"
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setStep('savings')}
                  className="p-4 border rounded-md bg-purple-600 text-white hover:bg-purple-700 border-purple-600 shadow-sm"
                >
                  Savings
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
                    onClick={() => setStep('income')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md ${step === 'income' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('expense')}
                    className={`px-4 py-2 text-sm font-medium ${step === 'expense' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('savings')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md ${step === 'savings' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Savings
                  </button>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {step === 'savings' ? (
                  <>
                    {/* Savings Form */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                      >
                        <option value="savings">Savings</option>
                        <option value="investment">Investment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                      >
                        <option value="">Select a category</option>
                        <option value="Emergency Fund">Emergency Fund</option>
                        <option value="Retirement">Retirement</option>
                        <option value="Education">Education</option>
                        <option value="Vacation">Vacation</option>
                        <option value="House Down Payment">House Down Payment</option>
                        <option value="Investment Portfolio">Investment Portfolio</option>
                        <option value="Stocks">Stocks</option>
                        <option value="Bonds">Bonds</option>
                        <option value="Mutual Funds">Mutual Funds</option>
                        <option value="Fixed Deposit">Fixed Deposit</option>
                        <option value="Other">Other</option>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
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
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Recurring Savings</span>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Income/Expense Form */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      >
                        <option value="">Select a category</option>
                        {(step === 'income' ? incomeCategories : expenseCategories).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-md">Cancel</button>
                  <button 
                    type="button" 
                    onClick={handleSubmit} 
                    className={`px-4 py-2 rounded-md text-white ${
                      step === 'income' ? 'bg-green-600 hover:bg-green-700' : 
                      step === 'expense' ? 'bg-red-600 hover:bg-red-700' : 
                      'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    Add {step === 'income' ? 'Income' : step === 'expense' ? 'Expense' : 'Savings'}
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

// Main Dashboard Component
function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [insightsModalOpen, setInsightsModalOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('1 month');
  const [filterMode, setFilterMode] = useState<'period' | 'month'>('period');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [savingsInvestmentsData, setSavingsInvestmentsData] = useState<any[]>([]);
  const [savingsGoalsData, setSavingsGoalsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch income and expenses data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [incomeRes, expensesRes, savingsInvRes, savingsGoalsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/income`),
        fetch(`${API_BASE_URL}/expenses`),
        fetch(`${API_BASE_URL}/savings-investments`),
        fetch(`${API_BASE_URL}/savings`)
      ]);
      
      // Log response status for debugging
      console.debug('fetchData: income', incomeRes.status, 'expenses', expensesRes.status, 'savingsInv', savingsInvRes.status, 'savingsGoals', savingsGoalsRes.status);

      if (incomeRes.ok) {
        const income = await incomeRes.json();
        setIncomeData(income);
      } else {
        console.error('Failed to fetch income', await incomeRes.text());
      }
      if (expensesRes.ok) {
        const expenses = await expensesRes.json();
        setExpensesData(expenses);
      } else {
        console.error('Failed to fetch expenses', await expensesRes.text());
      }
      if (savingsInvRes.ok) {
        const savingsInv = await savingsInvRes.json();
        setSavingsInvestmentsData(savingsInv);
      } else {
        console.error('Failed to fetch savings-investments', await savingsInvRes.text());
      }
      if (savingsGoalsRes.ok) {
        const goals = await savingsGoalsRes.json();
        setSavingsGoalsData(goals);
      } else {
        console.error('Failed to fetch savings goals', await savingsGoalsRes.text());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setFetchError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats based on time period or calendar month
  const calculateStats = () => {
    let filteredIncome: any[];
    let filteredExpenses: any[];

    if (filterMode === 'month') {
      // Filter by specific calendar month (1st to last day)
      const [year, month] = selectedMonth.split('-').map(Number);
      const startOfMonth = new Date(year, month - 1, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      filteredIncome = incomeData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
      });
      filteredExpenses = expensesData.filter(item => {
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
        filteredIncome = incomeData;
        filteredExpenses = expensesData;
      } else {
        const cutoffDate = new Date(now);
        cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);
        cutoffDate.setHours(0, 0, 0, 0); // Start of that day

        filteredIncome = incomeData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= cutoffDate && itemDate <= now;
        });
        filteredExpenses = expensesData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= cutoffDate && itemDate <= now;
        });
      }
    }

    // Continue with existing calculation using filtered data
    const filteredIncome_old = filteredIncome;
    const filteredExpenses_old = filteredExpenses;
    
    const income = filteredIncome_old.reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = filteredExpenses_old.reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

    // Total savings from savings/investments table
    const totalSavings = savingsInvestmentsData.reduce((sum, s) => sum + Number(s.amount || 0), 0);

    return { 
      income, 
      expenses, 
      balance, 
      savingsRate,
      totalSavings,
      filteredIncome: filteredIncome_old,
      filteredExpenses: filteredExpenses_old
    };
  };

  const stats = calculateStats();

  // Combine and filter transactions for display
  const getFilteredTransactions = () => {
    const allTransactions = [
      ...incomeData.map(t => ({ 
        id: `income-${t.id}`,
        dbId: t.id,
        title: t.description || t.category_name || 'Income', 
        amount: Number(t.amount), 
        date: t.date, 
        type: 'income' as const,
        created_at: t.created_at
      })),
      ...expensesData.map(t => ({ 
        id: `expense-${t.id}`,
        dbId: t.id,
        title: t.description || t.category_name || 'Expense', 
        amount: -Number(t.amount), 
        date: t.date, 
        type: 'expense' as const,
        created_at: t.created_at
      }))
    ].sort((a, b) => {
      // Sort by created_at if available, otherwise by id (most recent first)
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return b.dbId - a.dbId;
    });

    if (transactionFilter === 'all') return allTransactions;
    return allTransactions.filter(t => t.type === transactionFilter);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar 
          onToggleSidebar={() => setSidebarOpen((s) => !s)} 
          pageTitle="Dashboard"
          onNotificationClick={() => setInsightsModalOpen(true)}
        />

        <main className="p-8 max-w-7xl mx-auto">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 text-sm">Overview of your financial status and recent activities</p>
            <button 
              onClick={() => setModalOpen(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Transaction
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
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Time Period
                  </button>
                  <button
                    onClick={() => setFilterMode('month')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterMode === 'month' 
                        ? 'bg-blue-600 text-white shadow-sm' 
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
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm"
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
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title={`Total Income ${filterMode === 'month' 
                ? `(${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})` 
                : `(${timePeriod})`}`}
              amount={`Rs. ${stats.income.toLocaleString()}`}
              icon={<FaMoneyBillWave />}
              color="bg-white"
              onClick={() => navigate('/income')}
            />
            <DashboardCard
              title={`Total Expenses ${filterMode === 'month' 
                ? `(${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})` 
                : `(${timePeriod})`}`}
              amount={`Rs. ${stats.expenses.toLocaleString()}`}
              icon={<FaShoppingCart />}
              color="bg-white"
              onClick={() => navigate('/expenses')}
            />
            <DashboardCard title="Balance" amount={`Rs. ${stats.balance.toLocaleString()}`} icon={<FaWallet />} color="bg-white" />
            <DashboardCard title="Savings" amount={`Rs. ${Number(stats.totalSavings || 0).toLocaleString()}`} icon={<FaPiggyBank />} color="bg-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IncomeExpensesChart income={stats.income} expenses={stats.expenses} />
              
              {/* Transaction Filter */}
              <div className="mt-6 bg-white rounded-lg p-4 shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Recent Transactions</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTransactionFilter('all')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        transactionFilter === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setTransactionFilter('income')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        transactionFilter === 'income'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Income
                    </button>
                    <button
                      onClick={() => setTransactionFilter('expense')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        transactionFilter === 'expense'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Expense
                    </button>
                  </div>
                </div>
                
                {/* Transaction List */}
                <div className="space-y-3">
                  {getFilteredTransactions().slice(0, 10).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? 
                            <FaArrowDown className="text-green-600" size={18} /> : 
                            <FaArrowUp className="text-red-600" size={18} />
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{transaction.title}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}Rs. {Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full text-left px-4 py-2 rounded bg-primary text-white"
                  >
                    Add Transaction
                  </button>

                  <button
                    onClick={() => {
                      const csv = 'Title,Date,Amount\nSalary,Jan 1,+120000\nGrocery,Jan 3,-5400';
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'transactions.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full text-left px-4 py-2 rounded border"
                  >
                    Export Report
                  </button>
                </div>
              </div>

              {/* Financial Insights */}
              <div className="bg-white rounded-lg p-4 shadow mt-4">
                <h3 className="font-semibold text-lg mb-3">Financial Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FaChartLine className="text-green-600" size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Savings Rate</p>
                      <p className="text-xs text-gray-600">You're saving {stats.savingsRate}% of your income this period</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FaBullseye className="text-blue-600" size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Top Spending</p>
                      <p className="text-xs text-gray-600">
                        {stats.filteredExpenses.length > 0 
                          ? `Largest expense: ${stats.filteredExpenses.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max).description || stats.filteredExpenses.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max).category_name || 'Expense'} (Rs. ${Number(stats.filteredExpenses.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max).amount).toLocaleString()})`
                          : 'No expenses recorded yet'}
                      </p>
                    </div>
                  </div>
                  
                  {stats.savingsRate < 20 && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <FaExclamationCircle className="text-yellow-600" size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Recommendation</p>
                        <p className="text-xs text-gray-600">Consider reducing expenses to increase your savings rate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Summary */}
              <div className="bg-white rounded-lg p-4 shadow mt-4">
                <h3 className="font-semibold text-lg mb-3">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="font-semibold text-gray-800">{stats.filteredIncome.length + stats.filteredExpenses.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg. Income</span>
                    <span className="font-semibold text-green-600">
                      {stats.filteredIncome.length > 0 
                        ? `Rs. ${Math.round(stats.income / stats.filteredIncome.length).toLocaleString()}`
                        : 'Rs. 0'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg. Expense</span>
                    <span className="font-semibold text-red-600">
                      {stats.filteredExpenses.length > 0 
                        ? `Rs. ${Math.round(stats.expenses / stats.filteredExpenses.length).toLocaleString()}`
                        : 'Rs. 0'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-gray-600">Net Balance</span>
                    <span className={`font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Rs. {stats.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <TransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchData} />
      <FinancialInsightsModal 
        isOpen={insightsModalOpen}
        onClose={() => setInsightsModalOpen(false)}
        incomeData={incomeData}
        expensesData={expensesData}
        savingsInvestmentsData={savingsInvestmentsData}
        savingsGoalsData={savingsGoalsData}
        totalIncome={stats.income}
        totalExpenses={stats.expenses}
        balance={stats.balance}
        savingsRate={stats.savingsRate}
        totalSavings={stats.totalSavings}
      />
    </div>
  );
}

export default Dashboard;