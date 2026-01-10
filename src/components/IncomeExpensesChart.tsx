import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

function IncomeExpensesChart({ income, expenses }: { income: number; expenses: number }) {
  const data = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ];

  const formatCurrency = (v: number) => `Rs. ${new Intl.NumberFormat('en-IN').format(v)}`;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-3">Income vs Expenses</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(v: number) => new Intl.NumberFormat('en-IN').format(v)}
              domain={[0, 'dataMax']}
              label={{ value: 'Amount (Rs.)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
            />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#16a34a' : '#dc2626'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncomeExpensesChart;
