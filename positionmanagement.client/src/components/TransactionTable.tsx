
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle } from 'lucide-react';
import React from 'react';
import { Transaction } from '../types/trading';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const getActionColor = (action: string, isOffline?: boolean) => {
    if (isOffline) return 'bg-slate-800 text-slate-300 border-slate-500';
    switch (action) {
      case 'INSERT': return 'bg-green-900 text-green-300 border-green-500';
      case 'UPDATE': return 'bg-yellow-900 text-yellow-300 border-yellow-500';
      case 'CANCEL': return 'bg-red-900 text-red-300 border-red-500';
      default: return 'bg-slate-800 text-slate-300 border-slate-500';
    }
  };

  const getSideColor = (side: string, isOffline?: boolean) => {
    if (isOffline) return 'text-slate-400';
    return side === 'Buy' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No transactions available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-2 text-slate-300 font-semibold">TX ID</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-semibold">Trade ID</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-semibold">Ver</th>
                  <th className="text-left py-3 px-2 text-slate-300 font-semibold">Security</th>
                  <th className="text-right py-3 px-2 text-slate-300 font-semibold">Quantity</th>
                  <th className="text-center py-3 px-2 text-slate-300 font-semibold">Action</th>
                  <th className="text-center py-3 px-2 text-slate-300 font-semibold">Side</th>
                  <th className="text-center py-3 px-2 text-slate-300 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transactionId} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-2 font-mono text-white">{transaction.transactionId}</td>
                    <td className="py-3 px-2 font-mono text-white">{transaction.tradeId}</td>
                    <td className="py-3 px-2 font-mono text-white">{transaction.version}</td>
                    <td className="py-3 px-2 font-mono text-cyan-400 font-semibold">{transaction.securityCode}</td>
                    <td className="py-3 px-2 font-mono text-white text-right">{transaction.quantity}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge className={getActionColor(transaction.action)}>
                        {transaction.action}
                      </Badge>
                    </td>
                    <td className={`py-3 px-2 font-semibold text-center ${getSideColor(transaction.side)}`}>
                      {transaction.side}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {transaction.processed && (
                        <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
