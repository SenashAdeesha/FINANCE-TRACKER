// pages/Income.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaPlus, FaEdit, FaTrash, FaCalendar } from "react-icons/fa";

function Income() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const incomeData = [
    { id: 1, source: "Salary", amount: 85000, date: "2026-01-01", category: "Employment", recurring: true },
    { id: 2, source: "Freelance Project", amount: 25000, date: "2026-01-05", category: "Freelance", recurring: false },
    { id: 3, source: "Investment Returns", amount: 8000, date: "2026-01-10", category: "Investments", recurring: false },
    { id: 4, source: "Rental Income", amount: 15000, date: "2026-01-01", category: "Property", recurring: true },
  ];

  const categories = [
    { name: "Employment", amount: 85000, color: "bg-blue-500" },
    { name: "Freelance", amount: 25000, color: "bg-green-500" },
    { name: "Investments", amount: 8000, color: "bg-purple-500" },
    { name: "Property", amount: 15000, color: "bg-yellow-500" },
  ];

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Income</h1>
            <button className="px-4 py-2 rounded bg-primary text-white flex items-center gap-2">
              <FaPlus className="text-sm" />
              Add Income
            </button>
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
                  <button className="text-sm text-primary flex items-center gap-2">
                    <FaCalendar className="text-xs" />
                    Filter by Date
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {incomeData.map((income) => (
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
    </div>
  );
}

export default Income;