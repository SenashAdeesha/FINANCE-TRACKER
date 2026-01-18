import { useState, useEffect, type ChangeEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import IncomeExpensesChart from "../components/IncomeExpensesChart";
import FinancialInsightsModal from "../components/FinancialInsightsModal";
import { FaPiggyBank, FaTimes, FaArrowDown, FaArrowUp, FaChevronDown, FaChartLine, FaExclamationCircle, FaBullseye, FaPlus } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:3001/api';

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

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 1;

      if (step === 'savings') {
        endpoint = 'savings-investments';
        body = {
          user_id: userId,
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
          user_id: userId,
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-gradient-to-br from-white/95 via-blue-50/50 to-purple-50/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 w-full max-w-lg overflow-hidden relative">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>

        <div className="flex items-center justify-between px-8 py-6 border-b border-blue-200/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FaPlus className="text-white" size={16} />
            </div>
            Add Transaction
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-all" aria-label="Close">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-8 relative z-10">
          {step === 'select' ? (
            <div className="space-y-5">
              <p className="text-sm text-gray-600 font-medium mb-4">Choose transaction type to continue</p>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setStep('income')}
                  className="p-6 border-2 border-green-300 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all hover:scale-105 flex flex-col items-center justify-center gap-3"
                >
                  <FaArrowDown size={24} />
                  <span className="font-bold text-base">Income</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('expense')}
                  className="p-6 border-2 border-red-300 rounded-2xl bg-gradient-to-br from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transition-all hover:scale-105 flex flex-col items-center justify-center gap-3"
                >
                  <FaArrowUp size={24} />
                  <span className="font-bold text-base">Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('savings')}
                  className="p-6 border-2 border-cyan-300 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all hover:scale-105 flex flex-col items-center justify-center gap-3"
                >
                  <FaPiggyBank size={24} />
                  <span className="font-bold text-base">Savings</span>
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
                    onClick={() => setStep('income')}
                    className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${step === 'income'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-white hover:shadow-sm'
                      }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('expense')}
                    className={`px-5 py-2.5 text-sm font-bold transition-all ${step === 'expense'
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-white hover:shadow-sm'
                      }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('savings')}
                    className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${step === 'savings'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-white hover:shadow-sm'
                      }`}
                  >
                    Savings
                  </button>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                {step === 'savings' ? (
                  <>
                    {/* Savings Form */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                        Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white shadow-sm hover:shadow-md transition-all font-medium"
                      >
                        <option value="savings">Savings</option>
                        <option value="investment">Investment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
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
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none shadow-sm hover:shadow-md transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
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
                        <span className="text-sm font-bold text-gray-700">Recurring Savings</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
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
                  </>
                ) : (
                  <>
                    {/* Income/Expense Form */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <div className={`w-1 h-4 bg-gradient-to-b rounded-full ${step === 'income' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'}`}></div>
                        Category
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 outline-none bg-white shadow-sm hover:shadow-md transition-all font-medium ${step === 'income' ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-red-500 focus:border-red-500'}`}
                      >
                        <option value="">Select a category</option>
                        {(step === 'income' ? incomeCategories : expenseCategories).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <div className={`w-1 h-4 bg-gradient-to-b rounded-full ${step === 'income' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'}`}></div>
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
                          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 outline-none shadow-sm hover:shadow-md transition-all font-medium ${step === 'income' ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-red-500 focus:border-red-500'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <div className={`w-1 h-4 bg-gradient-to-b rounded-full ${step === 'income' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'}`}></div>
                          Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 outline-none shadow-sm hover:shadow-md transition-all font-medium ${step === 'income' ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-red-500 focus:border-red-500'}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${step === 'income'
                        ? 'bg-green-50/50 border-green-200/50 hover:border-green-300'
                        : 'bg-red-50/50 border-red-200/50 hover:border-red-300'
                        }`}>
                        <input
                          type="checkbox"
                          name="recurring"
                          checked={formData.recurring}
                          onChange={handleChange}
                          className={`w-5 h-5 border-gray-300 rounded-lg shadow-sm ${step === 'income'
                            ? 'text-green-600 focus:ring-green-500'
                            : 'text-red-600 focus:ring-red-500'
                            }`}
                        />
                        <span className="text-sm font-bold text-gray-700">Recurring Payment</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <div className={`w-1 h-4 bg-gradient-to-b rounded-full ${step === 'income' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'}`}></div>
                        Note (optional)
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Additional details"
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 outline-none resize-none shadow-sm hover:shadow-md transition-all font-medium ${step === 'income' ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-red-500 focus:border-red-500'}`}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={handleClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all hover:scale-105">Cancel</button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={`px-6 py-3 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 ${step === 'income'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/30 hover:shadow-green-500/40 border-green-400'
                      : step === 'expense'
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-red-500/30 hover:shadow-red-500/40 border-red-400'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-cyan-500/30 hover:shadow-cyan-500/40 border-cyan-400'
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
  const navigate = useNavigate();

  // Fetch income and expenses data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
    <PageLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      title="Dashboard"
      underlineColor="bg-gradient-to-r from-blue-500 to-purple-600"
      onNotificationClick={() => setInsightsModalOpen(true)}
      hideContentTitle={true}
    >
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <p className="text-gray-600 text-lg">Overview of your financial status and recent activities</p>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg text-white rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
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
            <div className="flex items-center gap-2 bg-gray-200 rounded-xl p-1.5 shadow-inner">
              <button
                onClick={() => setFilterMode('period')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'period'
                  ? 'bg-white text-blue-700 shadow-md scale-105'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Time Period
              </button>
              <button
                onClick={() => setFilterMode('month')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'month'
                  ? 'bg-white text-blue-700 shadow-md scale-105'
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

      {/* Stats Cards with Gradient */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          onClick={() => navigate('/income')}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105 text-white"
        >
          <h3 className="text-sm text-white/90 mb-2">
            Total Income {filterMode === 'month'
              ? `(${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`
              : `(${timePeriod})`}
          </h3>
          <div className="text-3xl font-bold">Rs. {stats.income.toLocaleString()}</div>
          <div className="text-xs text-white/80 mt-1">{stats.filteredIncome.length} transactions</div>
        </div>

        <div
          onClick={() => navigate('/expenses')}
          className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105 text-white"
        >
          <h3 className="text-sm text-white/90 mb-2">
            Total Expenses {filterMode === 'month'
              ? `(${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`
              : `(${timePeriod})`}
          </h3>
          <div className="text-3xl font-bold">Rs. {stats.expenses.toLocaleString()}</div>
          <div className="text-xs text-white/80 mt-1">{stats.filteredExpenses.length} transactions</div>
        </div>

        <div
          onClick={() => navigate('/savings')}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105 text-white"
        >
          <h3 className="text-sm text-white/90 mb-2">Savings</h3>
          <div className="text-3xl font-bold">Rs. {Number(stats.totalSavings || 0).toLocaleString()}</div>
          <div className="text-xs text-white/80 mt-1">{savingsInvestmentsData.length} entries</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Transaction Filter */}
          <div className="bg-gradient-to-br from-white/90 via-blue-50/50 to-purple-50/50 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/60 hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Recent Transactions</h3>
                <p className="text-sm text-gray-500 mt-1">Your latest financial activities</p>
              </div>
              <div className="flex gap-2 bg-white/60 backdrop-blur-md rounded-2xl p-2 shadow-inner border border-white/80">
                <button
                  onClick={() => setTransactionFilter('all')}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${transactionFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/40 scale-105'
                    : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:scale-105'
                    }`}
                >
                  <span className="text-sm">●</span>
                  All
                </button>
                <button
                  onClick={() => setTransactionFilter('income')}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${transactionFilter === 'income'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/40 scale-105'
                    : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:scale-105'
                    }`}
                >
                  <FaArrowDown className="text-xs" />
                  Income
                </button>
                <button
                  onClick={() => setTransactionFilter('expense')}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${transactionFilter === 'expense'
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/40 scale-105'
                    : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:scale-105'
                    }`}
                >
                  <FaArrowUp className="text-xs" />
                  Expense
                </button>
              </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-3 relative z-10">
              {getFilteredTransactions().slice(0, 10).map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-5 bg-white/70 backdrop-blur-xl hover:bg-white/90 rounded-2xl transition-all duration-300 border border-white/80 hover:shadow-xl hover:scale-[1.02] group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${transaction.type === 'income'
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-200'
                      : 'bg-gradient-to-br from-red-400 to-pink-500 shadow-red-200'
                      }`}>
                      {transaction.type === 'income' ?
                        <FaArrowDown className="text-white" size={22} /> :
                        <FaArrowUp className="text-white" size={22} />
                      }
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{transaction.title}</p>
                      <p className="text-sm text-gray-600 font-medium">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-xl ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {transaction.amount > 0 ? '+' : ''}Rs. {Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-br from-white/90 via-blue-50/40 to-purple-50/40 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/60 hover:shadow-3xl transition-all relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>

            <h3 className="font-bold text-xl mb-5 text-gray-800 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FaPlus className="text-white" size={16} />
              </div>
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3 relative z-10">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full text-left px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-105 flex items-center gap-3"
              >
                <FaPlus className="text-lg" />
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
                className="w-full text-left px-6 py-4 rounded-xl border-2 border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50/50 font-bold text-gray-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3"
              >
                <FaChartLine className="text-lg text-blue-600" />
                Export Report
              </button>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mt-6 bg-gradient-to-br from-white/90 via-green-50/40 to-emerald-50/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 hover:shadow-3xl transition-all relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl -z-10"></div>
            <IncomeExpensesChart income={stats.income} expenses={stats.expenses} />
          </div>

          {/* Financial Insights */}
          <div className="bg-gradient-to-br from-white/90 via-orange-50/40 to-pink-50/40 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/60 mt-6 hover:shadow-3xl transition-all relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl -z-10"></div>

            <h3 className="font-bold text-2xl mb-6 text-gray-800 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
                <FaChartLine className="text-white" size={18} />
              </div>
              Financial Insights
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-green-100/80 to-emerald-100/80 rounded-2xl border-2 border-green-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FaChartLine className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Savings Rate</p>
                  <p className="text-sm text-gray-700 mt-2 font-medium">You're saving {stats.savingsRate}% of your income this period</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-100/80 to-purple-100/80 rounded-2xl border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FaBullseye className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Top Spending</p>
                  <p className="text-sm text-gray-700 mt-2 font-medium">
                    {stats.filteredExpenses.length > 0
                      ? `Largest expense: ${stats.filteredExpenses.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max).description || stats.filteredExpenses.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max).category_name || 'Expense'} (Rs. ${Number(stats.filteredExpenses.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max).amount).toLocaleString()})`
                      : 'No expenses recorded yet'}
                  </p>
                </div>
              </div>

              {stats.savingsRate < 20 && (
                <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-yellow-100/80 to-orange-100/80 rounded-2xl border-2 border-yellow-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaExclamationCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Recommendation</p>
                    <p className="text-sm text-gray-700 mt-2 font-medium">Consider reducing expenses to increase your savings rate</p>
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
    </PageLayout >
  );
}

export default Dashboard;