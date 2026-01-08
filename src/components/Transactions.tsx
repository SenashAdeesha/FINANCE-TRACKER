import { FaChevronDown } from 'react-icons/fa';

const mock = [
  { id: 1, title: 'Salary', date: 'Jan 1', amount: '+Rs. 120,000', type: 'income' },
  { id: 2, title: 'Grocery', date: 'Jan 3', amount: '-Rs. 5,400', type: 'expense' },
  { id: 3, title: 'Electricity', date: 'Jan 5', amount: '-Rs. 2,300', type: 'expense' },
  { id: 4, title: 'Freelance', date: 'Jan 7', amount: '+Rs. 18,000', type: 'income' },
];

function Transactions() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button className="flex items-center gap-2 text-sm text-muted">Filter <FaChevronDown /></button>
      </div>

      <ul className="divide-y">
        {mock.map((t) => (
          <li key={t.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{t.title}</div>
              <div className="text-xs text-gray-400">{t.date}</div>
            </div>
            <div className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>{t.amount}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
