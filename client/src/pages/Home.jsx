import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UploadCSV from '../components/UploadCSV';
import Dashboard from '../components/Dashboard';
import TransactionTable from '../components/TransactionTable';

function Home() {
  const { user, loading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Track and manage your expenses efficiently</p>
        </div>

        <UploadCSV onUploadSuccess={handleUploadSuccess} />
        
        <Dashboard refreshTrigger={refreshTrigger} />
        
        <TransactionTable refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default Home;