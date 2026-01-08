import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import ChartPlaceholder from "../components/ChartPlaceholder";
import Transactions from "../components/Transactions";
import { FaMoneyBillWave, FaShoppingCart, FaWallet, FaPiggyBank } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="text-sm text-muted">Welcome back — here's what's happening with your accounts</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title="Total Income" amount="Rs. 120,000" icon={<FaMoneyBillWave />} color="bg-white" />
            <DashboardCard title="Total Expenses" amount="Rs. 75,000" icon={<FaShoppingCart />} color="bg-white" />
            <DashboardCard title="Balance" amount="Rs. 45,000" icon={<FaWallet />} color="bg-white" />
            <DashboardCard title="Savings %" amount="38%" icon={<FaPiggyBank />} color="bg-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <ChartPlaceholder />
              <div className="mt-6">
                <Transactions />
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate('/transactions')}
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
