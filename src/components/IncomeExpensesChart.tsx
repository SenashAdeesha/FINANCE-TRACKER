import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

function IncomeExpensesChart({ income, expenses }: { income: number; expenses: number }) {
  const data = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ];

  const COLORS = ['#16a34a', '#dc2626'];
  const formatCurrency = (v: number) => `Rs. ${new Intl.NumberFormat('en-IN').format(v)}`;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-3">Income vs Expenses</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncomeExpensesChart;
