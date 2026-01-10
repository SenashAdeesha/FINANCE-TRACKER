// pages/Income.tsx
import { useState, type ChangeEvent, type MouseEvent } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaChevronDown } from "react-icons/fa";

// Income Modal Component
function IncomeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    recurring: false,
    description: ''
  });

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

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Income submitted:', formData);
    alert('Income added successfully!');
    handleClose();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Rental', 'Gift', 'Other'];

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
                {incomeCategories.map(cat => (
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
              <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-md">Cancel</button>
              <button type="button" onClick={handleSubmit} className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700">
                Add Income
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

  const incomeData = [
    { id: 1, source: "Salary", amount: 85000, date: "2026-01-01", category: "Salary", recurring: true },
    { id: 2, source: "Freelance Project", amount: 25000, date: "2026-01-05", category: "Freelance", recurring: false },
    { id: 3, source: "Investment Returns", amount: 8000, date: "2026-01-10", category: "Investment", recurring: false },
    { id: 4, source: "Rental Income", amount: 15000, date: "2026-01-01", category: "Rental", recurring: true },
  ];

  const categories = [
    { name: "Salary", amount: 85000, color: "bg-blue-500" },
    { name: "Freelance", amount: 25000, color: "bg-green-500" },
    { name: "Investment", amount: 8000, color: "bg-purple-500" },
    { name: "Rental", amount: 15000, color: "bg-yellow-500" },
  ];

  // Calculate income based on time period
  const calculateIncome = () => {
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

    return incomeData.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredByTime = calculateIncome();
  const totalIncome = filteredByTime.reduce((sum, item) => sum + item.amount, 0);

  // Filter income data by category
  const getFilteredIncome = () => {
    if (categoryFilter === 'All') return filteredByTime;
    return filteredByTime.filter(item => item.category === categoryFilter);
  };

  const filteredIncome = getFilteredIncome();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Income</h1>
            <button 
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded bg-primary text-white flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Add Income
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Total Income (This Month)</h3>
              <div className="text-3xl font-bold text-green-600">Rs. {totalIncome.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-1">↑ 15% from last month</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Recurring Income</h3>
              <div className="text-3xl font-bold">Rs. 100,000</div>
              <div className="text-xs text-gray-600 mt-1">Monthly average</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">One-time Income</h3>
              <div className="text-3xl font-bold">Rs. 33,000</div>
              <div className="text-xs text-gray-600 mt-1">This month</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent Income</h2>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Filter:</label>
                    <div className="relative inline-block">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer shadow-sm"
                      >
                        <option value="All">All Categories</option>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Investment">Investment</option>
                        <option value="Business">Business</option>
                        <option value="Rental">Rental</option>
                        <option value="Gift">Gift</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FaChevronDown size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {filteredIncome.map((income) => (
                    <div key={income.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{income.source}</div>
                          {income.recurring && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">Recurring</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {income.category} • {new Date(income.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold text-green-600">+Rs. {income.amount.toLocaleString()}</div>
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
              <h2 className="text-lg font-semibold mb-4">Income by Category</h2>
              <div className="space-y-4">
                {categories.map((cat) => {
                  const percentage = (cat.amount / totalIncome) * 100;
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{cat.name}</span>
                        <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-sm font-semibold">Rs. {cat.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      <IncomeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default Income;