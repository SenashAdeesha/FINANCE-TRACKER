// pages/Expenses.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaPlus, FaEdit, FaTrash, FaFilter } from "react-icons/fa";

function Expenses() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const expenseData = [
    { id: 1, description: "Grocery Shopping", amount: 12500, date: "2026-01-06", category: "Food & Dining" },
    { id: 2, description: "Electricity Bill", amount: 5200, date: "2026-01-05", category: "Utilities" },
    { id: 3, description: "Uber Ride", amount: 850, date: "2026-01-04", category: "Transportation" },
    { id: 4, description: "Netflix Subscription", amount: 1500, date: "2026-01-03", category: "Entertainment" },
    { id: 5, description: "Restaurant Dinner", amount: 4500, date: "2026-01-02", category: "Food & Dining" },
    { id: 6, description: "Pharmacy", amount: 2300, date: "2026-01-01", category: "Healthcare" },
  ];

  const categories = [
    { name: "Food & Dining", amount: 17000, color: "bg-red-500" },
    { name: "Utilities", amount: 5200, color: "bg-orange-500" },
    { name: "Transportation", amount: 850, color: "bg-blue-500" },
    { name: "Entertainment", amount: 1500, color: "bg-purple-500" },
    { name: "Healthcare", amount: 2300, color: "bg-green-500" },
  ];

  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Expenses</h1>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded bg-white border flex items-center gap-2">
                <FaFilter className="text-sm" />
                Filter
              </button>
              <button className="px-4 py-2 rounded bg-primary text-white flex items-center gap-2">
                <FaPlus className="text-sm" />
                Add Expense
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Total Expenses (This Month)</h3>
              <div className="text-3xl font-bold text-red-600">Rs. {totalExpenses.toLocaleString()}</div>
              <div className="text-xs text-red-600 mt-1">↑ 8% from last month</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Average Daily Spend</h3>
              <div className="text-3xl font-bold">Rs. {(totalExpenses / 7).toFixed(0)}</div>
              <div className="text-xs text-gray-600 mt-1">Last 7 days</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600 mb-2">Highest Category</h3>
              <div className="text-3xl font-bold">Food & Dining</div>
              <div className="text-xs text-gray-600 mt-1">Rs. 17,000</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Recent Expenses</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {expenseData.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold text-red-600">-Rs. {expense.amount.toLocaleString()}</div>
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
              <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
              <div className="space-y-4">
                {categories.map((cat) => {
                  const percentage = (cat.amount / totalExpenses) * 100;
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

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="font-semibold">{expenseData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Largest Expense</span>
                    <span className="font-semibold">Rs. 12,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Smallest Expense</span>
                    <span className="font-semibold">Rs. 850</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Expenses;