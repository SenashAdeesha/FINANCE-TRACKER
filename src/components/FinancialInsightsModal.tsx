import { FaTimes, FaArrowUp, FaArrowDown, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaLightbulb, FaTrophy, FaCalendarAlt } from "react-icons/fa";

interface Transaction {
  id: string | number;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category_name?: string;
}

interface FinancialInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  incomeData: any[];
  expensesData: any[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
}

function FinancialInsightsModal({
  isOpen,
  onClose,
  incomeData,
  expensesData,
  totalIncome,
  totalExpenses,
  balance,
  savingsRate
}: FinancialInsightsModalProps) {
  if (!isOpen) return null;

  // Calculate comprehensive insights
  const calculateInsights = () => {
    const insights: any = {
      highestIncome: null,
      lowestIncome: null,
      highestExpense: null,
      lowestExpense: null,
      avgIncome: 0,
      avgExpense: 0,
      topIncomeCategory: null,
      topExpenseCategory: null,
      recentTrend: '',
      savingsStatus: '',
      recommendations: []
    };

    // Income analysis
    if (incomeData.length > 0) {
      const sortedIncome = [...incomeData].sort((a, b) => Number(b.amount) - Number(a.amount));
      insights.highestIncome = {
        amount: Number(sortedIncome[0].amount),
        description: sortedIncome[0].description || sortedIncome[0].category_name || 'Income',
        date: sortedIncome[0].date
      };
      insights.lowestIncome = {
        amount: Number(sortedIncome[sortedIncome.length - 1].amount),
        description: sortedIncome[sortedIncome.length - 1].description || sortedIncome[sortedIncome.length - 1].category_name || 'Income',
        date: sortedIncome[sortedIncome.length - 1].date
      };
      insights.avgIncome = totalIncome / incomeData.length;

      // Top income category
      const incomeByCategory: Record<string, number> = {};
      incomeData.forEach(item => {
        const cat = item.category_name || 'Uncategorized';
        incomeByCategory[cat] = (incomeByCategory[cat] || 0) + Number(item.amount);
      });
      const topIncomeCat = Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1])[0];
      insights.topIncomeCategory = { name: topIncomeCat[0], amount: topIncomeCat[1] };
    }

    // Expense analysis
    if (expensesData.length > 0) {
      const sortedExpenses = [...expensesData].sort((a, b) => Number(b.amount) - Number(a.amount));
      insights.highestExpense = {
        amount: Number(sortedExpenses[0].amount),
        description: sortedExpenses[0].description || sortedExpenses[0].category_name || 'Expense',
        date: sortedExpenses[0].date
      };
      insights.lowestExpense = {
        amount: Number(sortedExpenses[sortedExpenses.length - 1].amount),
        description: sortedExpenses[sortedExpenses.length - 1].description || sortedExpenses[sortedExpenses.length - 1].category_name || 'Expense',
        date: sortedExpenses[sortedExpenses.length - 1].date
      };
      insights.avgExpense = totalExpenses / expensesData.length;

      // Top expense category
      const expenseByCategory: Record<string, number> = {};
      expensesData.forEach(item => {
        const cat = item.category_name || 'Uncategorized';
        expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Number(item.amount);
      });
      const topExpenseCat = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
      insights.topExpenseCategory = { name: topExpenseCat[0], amount: topExpenseCat[1] };
    }

    // Recent trend (last 7 days vs previous 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentExpenses = expensesData.filter(e => new Date(e.date) >= sevenDaysAgo).reduce((sum, e) => sum + Number(e.amount), 0);
    const previousExpenses = expensesData.filter(e => new Date(e.date) >= fourteenDaysAgo && new Date(e.date) < sevenDaysAgo).reduce((sum, e) => sum + Number(e.amount), 0);

    if (previousExpenses > 0) {
      const change = ((recentExpenses - previousExpenses) / previousExpenses) * 100;
      if (change > 10) {
        insights.recentTrend = `📈 Spending increased ${Math.abs(change).toFixed(1)}% in the last week`;
      } else if (change < -10) {
        insights.recentTrend = `📉 Spending decreased ${Math.abs(change).toFixed(1)}% in the last week`;
      } else {
        insights.recentTrend = `➡️ Spending is stable compared to last week`;
      }
    }

    // Savings status
    if (savingsRate >= 30) {
      insights.savingsStatus = 'Excellent! You\'re saving a healthy portion of your income';
    } else if (savingsRate >= 20) {
      insights.savingsStatus = 'Good savings rate! Keep it up';
    } else if (savingsRate >= 10) {
      insights.savingsStatus = 'Fair savings rate, consider increasing it';
    } else if (savingsRate > 0) {
      insights.savingsStatus = 'Low savings rate, try to cut expenses';
    } else {
      insights.savingsStatus = 'Warning: Expenses exceed income';
    }

    // Generate smart recommendations
    if (balance < 0) {
      insights.recommendations.push({
        type: 'warning',
        text: 'Your expenses exceed income. Review and reduce unnecessary expenses immediately.'
      });
    }

    if (savingsRate < 20 && balance > 0) {
      insights.recommendations.push({
        type: 'tip',
        text: 'Try to increase your savings rate to at least 20% for better financial health.'
      });
    }

    if (insights.topExpenseCategory && insights.topExpenseCategory.amount > totalExpenses * 0.4) {
      insights.recommendations.push({
        type: 'info',
        text: `${insights.topExpenseCategory.name} accounts for ${((insights.topExpenseCategory.amount / totalExpenses) * 100).toFixed(0)}% of expenses. Consider if this can be optimized.`
      });
    }

    if (incomeData.length < 2) {
      insights.recommendations.push({
        type: 'tip',
        text: 'Consider diversifying your income sources for better financial security.'
      });
    }

    if (insights.highestExpense && insights.highestExpense.amount > insights.avgExpense * 3) {
      insights.recommendations.push({
        type: 'info',
        text: `Your highest expense (${insights.highestExpense.description}) is ${(insights.highestExpense.amount / insights.avgExpense).toFixed(1)}x your average. Is this planned?`
      });
    }

    if (balance > totalIncome * 0.3) {
      insights.recommendations.push({
        type: 'success',
        text: 'Great job! You have a healthy balance. Consider investing surplus funds.'
      });
    }

    return insights;
  };

  const insights = calculateInsights();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <FaChartLine className="text-2xl" />
            <div>
              <h2 className="text-xl font-bold">Financial Insights</h2>
              <p className="text-sm text-blue-100">Comprehensive analysis of your finances</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors" 
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Total Income</span>
                <FaArrowDown className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">Rs. {totalIncome.toLocaleString()}</p>
              <p className="text-xs text-green-700 mt-1">
                Avg: Rs. {insights.avgIncome ? insights.avgIncome.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-800">Total Expenses</span>
                <FaArrowUp className="text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-900">Rs. {totalExpenses.toLocaleString()}</p>
              <p className="text-xs text-red-700 mt-1">
                Avg: Rs. {insights.avgExpense ? insights.avgExpense.toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
              </p>
            </div>

            <div className={`bg-gradient-to-br rounded-xl p-4 border ${
              balance >= 0 
                ? 'from-blue-50 to-blue-100 border-blue-200' 
                : 'from-orange-50 to-orange-100 border-orange-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                  Net Balance
                </span>
                <FaTrophy className={balance >= 0 ? 'text-blue-600' : 'text-orange-600'} />
              </div>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                Rs. {balance.toLocaleString()}
              </p>
              <p className={`text-xs mt-1 ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                Savings Rate: {savingsRate}%
              </p>
            </div>
          </div>

          {/* Min/Max Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Income Min/Max */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaArrowDown className="text-green-600" />
                Income Analysis
              </h3>
              {insights.highestIncome ? (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-700 font-medium mb-1">HIGHEST INCOME</p>
                    <p className="text-lg font-bold text-green-900">Rs. {insights.highestIncome.amount.toLocaleString()}</p>
                    <p className="text-sm text-green-800">{insights.highestIncome.description}</p>
                    <p className="text-xs text-green-600 mt-1">📅 {new Date(insights.highestIncome.date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-700 font-medium mb-1">LOWEST INCOME</p>
                    <p className="text-lg font-bold text-gray-900">Rs. {insights.lowestIncome.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-800">{insights.lowestIncome.description}</p>
                    <p className="text-xs text-gray-600 mt-1">📅 {new Date(insights.lowestIncome.date).toLocaleDateString()}</p>
                  </div>
                  {insights.topIncomeCategory && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-700 font-medium mb-1">TOP INCOME SOURCE</p>
                      <p className="text-sm font-semibold text-blue-900">{insights.topIncomeCategory.name}</p>
                      <p className="text-lg font-bold text-blue-900">Rs. {insights.topIncomeCategory.amount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No income data available</p>
              )}
            </div>

            {/* Expense Min/Max */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaArrowUp className="text-red-600" />
                Expense Analysis
              </h3>
              {insights.highestExpense ? (
                <div className="space-y-3">
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-700 font-medium mb-1">HIGHEST EXPENSE</p>
                    <p className="text-lg font-bold text-red-900">Rs. {insights.highestExpense.amount.toLocaleString()}</p>
                    <p className="text-sm text-red-800">{insights.highestExpense.description}</p>
                    <p className="text-xs text-red-600 mt-1">📅 {new Date(insights.highestExpense.date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-700 font-medium mb-1">LOWEST EXPENSE</p>
                    <p className="text-lg font-bold text-gray-900">Rs. {insights.lowestExpense.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-800">{insights.lowestExpense.description}</p>
                    <p className="text-xs text-gray-600 mt-1">📅 {new Date(insights.lowestExpense.date).toLocaleDateString()}</p>
                  </div>
                  {insights.topExpenseCategory && (
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-orange-700 font-medium mb-1">TOP EXPENSE CATEGORY</p>
                      <p className="text-sm font-semibold text-orange-900">{insights.topExpenseCategory.name}</p>
                      <p className="text-lg font-bold text-orange-900">Rs. {insights.topExpenseCategory.amount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No expense data available</p>
              )}
            </div>
          </div>

          {/* Trends & Status */}
          {insights.recentTrend && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-purple-600" />
                Recent Trend
              </h3>
              <p className="text-gray-700">{insights.recentTrend}</p>
              <div className="mt-2 bg-white/50 rounded-lg p-2">
                <p className="text-sm text-gray-600">💡 {insights.savingsStatus}</p>
              </div>
            </div>
          )}

          {/* Smart Recommendations */}
          {insights.recommendations.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" />
                Smart Recommendations
              </h3>
              <div className="space-y-3">
                {insights.recommendations.map((rec: any, idx: number) => (
                  <div 
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      rec.type === 'warning' ? 'bg-red-50 border border-red-200' :
                      rec.type === 'success' ? 'bg-green-50 border border-green-200' :
                      rec.type === 'tip' ? 'bg-blue-50 border border-blue-200' :
                      'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {rec.type === 'warning' && <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />}
                    {rec.type === 'success' && <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />}
                    {rec.type === 'tip' && <FaLightbulb className="text-blue-500 mt-1 flex-shrink-0" />}
                    {rec.type === 'info' && <FaChartLine className="text-gray-500 mt-1 flex-shrink-0" />}
                    <p className="text-sm text-gray-700 flex-1">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinancialInsightsModal;
