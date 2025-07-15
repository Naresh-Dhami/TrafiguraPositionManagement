
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import TransactionTable from '../components/TransactionTable';
import { api } from '../services/api';

const TransactionHistory = () => {
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      try {
        // Get transactions from API
        const apiTransactions = await api.getTransactions();
        
        // Get offline transactions
        const offlineTransactions = JSON.parse(localStorage.getItem('offlineTransactions') || '[]');
        
        // Combine and sort by timestamp
        return [...apiTransactions, ...offlineTransactions].sort((a, b) => {
          const dateA = new Date(a.timestamp || 0);
          const dateB = new Date(b.timestamp || 0);
          return dateB.getTime() - dateA.getTime();
        });
      } catch (error) {
        // If API fails, return offline transactions
        const offlineTransactions = JSON.parse(localStorage.getItem('offlineTransactions') || '[]');
        return offlineTransactions;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading transactions</p>
          <p className="text-slate-400 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">Transaction History</h1>
            <p className="text-slate-400 mt-1">Complete transaction audit trail</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
};

export default TransactionHistory;
