import { useState, useEffect } from 'react';
import api from '../utils/api';
import CategoryChart from './CategoryChart';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [dateRange]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await api.get('/transactions/summary', {
        params: dateRange
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
          
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold mb-1">Total Income</p>
                <p className="text-3xl font-bold text-green-700">
                  ₹{summary?.totalIncome?.toFixed(2) || '0.00'}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-semibold mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-red-700">
                  ₹{summary?.totalExpense?.toFixed(2) || '0.00'}
                </p>
              </div>
              <TrendingDown className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold mb-1">Net Balance</p>
                <p className={`text-3xl font-bold ${
                  (summary?.netBalance || 0) >= 0 ? 'text-blue-700' : 'text-red-700'
                }`}>
                  ₹{summary?.netBalance?.toFixed(2) || '0.00'}
                </p>
              </div>
              <Wallet className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {summary?.byCategory && Object.keys(summary.byCategory).length > 0 && (
        <CategoryChart data={summary.byCategory} />
      )}
    </div>
  );
}

export default Dashboard;