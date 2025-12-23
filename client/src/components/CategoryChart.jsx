import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  'Food & Dining': '#EF4444',
  'Groceries': '#10B981',
  'Transportation': '#F59E0B',
  'Shopping': '#8B5CF6',
  'Utilities': '#06B6D4',
  'Entertainment': '#EC4899',
  'Healthcare': '#14B8A6',
  'Education': '#6366F1',
  'Other': '#6B7280'
};

function CategoryChart({ data }) {
  const chartData = Object.entries(data).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: COLORS[category] || '#6B7280'
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-gray-700">₹{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Spending by Category</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center">
            <div 
              className="w-4 h-4 rounded mr-2" 
              style={{ backgroundColor: item.color }}
            />
            <div>
              <p className="text-sm font-medium text-gray-700">{item.name}</p>
              <p className="text-sm text-gray-600">₹{item.value.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryChart;