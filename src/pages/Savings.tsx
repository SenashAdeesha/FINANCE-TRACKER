// pages/Savings.tsx
import { useState, type ChangeEvent, type MouseEvent } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaChevronDown, FaPiggyBank, FaChartLine } from "react-icons/fa";

// Savings Modal Component
function SavingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: 'savings', // savings or investment
    recurring: false,
    description: ''
  });

  const handleClose = () => {
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      type: 'savings',
      recurring: false,
      description: ''
    });
    onClose();
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Savings submitted:', formData);
    alert(`${formData.type === 'savings' ? 'Savings' : 'Investment'} added successfully!`);
    handleClose();
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

  const categories = formData.type === 'savings' ? savingsCategories : investmentCategories;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add {formData.type === 'savings' ? 'Savings' : 'Investment'}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
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
                <span className="text-sm font-medium text-gray-700">Recurring {formData.type === 'savings' ? 'Savings' : 'Investment'}</span>
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
              <button type="button" onClick={handleSubmit} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Add {formData.type === 'savings' ? 'Savings' : 'Investment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Savings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [timePeriod, setTimePeriod] = useState('1 month');

  const savingsData = [
    { id: 1, description: "Emergency Fund Deposit", amount: 20000, date: "2026-01-08", category: "Emergency Fund", type: "savings", recurring: true },
    { id: 2, description: "Vacation Savings", amount: 15000, date: "2026-01-05", category: "Vacation", type: "savings", recurring: false },
    { id: 3, description: "Mutual Fund SIP", amount: 10000, date: "2026-01-01", category: "Mutual Funds", type: "investment", recurring: true },
    { id: 4, description: "Stock Purchase", amount: 25000, date: "2026-01-03", category: "Stocks", type: "investment", recurring: false },
    { id: 5, description: "Gold Investment", amount: 30000, date: "2026-01-07", category: "Gold", type: "investment", recurring: false },
    { id: 6, description: "Retirement Fund", amount: 50000, date: "2026-01-01", category: "Retirement", type: "savings", recurring: true },
  ];

  const savingsCategories = [
    { name: "Emergency Fund", amount: 20000, color: "bg-blue-500", type: "savings" },
    { name: "Vacation", amount: 15000, color: "bg-teal-500", type: "savings" },
    { name: "Retirement", amount: 50000, color: "bg-indigo-500", type: "savings" },
  ];

  const investmentCategories = [
    { name: "Mutual Funds", amount: 10000, color: "bg-purple-500", type: "investment" },
    { name: "Stocks", amount: 25000, color: "bg-green-500", type: "investment" },
    { name: "Gold", amount: 30000, color: "bg-yellow-500", type: "investment" },
  ];

  // Calculate based on time period
  const calculateData = () => {
    const now = new Date('2026-01-10');
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
    const cutoffDate = new Date(now);
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);

    return savingsData.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredByTime = calculateData();
  
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

  const totalSavings = filteredByTime.filter(item => item.type === 'savings').reduce((sum, item) => sum + item.amount, 0);
  const totalInvestments = filteredByTime.filter(item => item.type === 'investment').reduce((sum, item) => sum + item.amount, 0);
  const totalAmount = totalSavings + totalInvestments;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Savings & Investments</h1>
            <button 
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded bg-primary text-white flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Entry
            </button>
          </div>

          {/* Time Period Filter (Dropdown Style) */}
          <div className="bg-white rounded-lg p-4 shadow mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Time Period</h3>
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaPiggyBank className="text-blue-600 text-xl" />
                <h3 className="text-sm text-gray-600">Total Savings</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600">Rs. {totalSavings.toLocaleString()}</div>
              <div className="text-xs text-blue-600 mt-1">↑ 12% from last period</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaChartLine className="text-purple-600 text-xl" />
                <h3 className="text-sm text-gray-600">Total Investments</h3>
              </div>
              <div className="text-3xl font-bold text-purple-600">Rs. {totalInvestments.toLocaleString()}</div>
              <div className="text-xs text-purple-600 mt-1">↑ 18% from last period</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Total Amount</h3>
              <div className="text-3xl font-bold text-green-600">Rs. {totalAmount.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">Combined savings & investments</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
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
                          +Rs. {item.amount.toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-200 rounded">
                            <FaEdit className="text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded">
                            <FaTrash className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
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

      <SavingsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default Savings;
