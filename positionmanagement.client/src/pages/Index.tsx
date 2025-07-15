
import PositionTable from '@/components/PositionTable';
import TransactionTable from '@/components/TransactionTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, Plus, Target, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [formData, setFormData] = useState({
    tradeId: '',
    version: '1',
    securityCode: '',
    quantity: '',
    side: 'Buy',
    action: 'INSERT'
  });

  // Fetch transactions and positions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: api.getTransactions,
    refetchInterval: 5000,
  });

  const { data: positions = [], isLoading: positionsLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: api.getPositions,
    refetchInterval: 5000,
  });

  // Transaction mutation
  const transactionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const transactionData = {
        tradeId: parseInt(data.tradeId),
        version: parseInt(data.version),
        securityCode: data.securityCode,
        quantity: parseInt(data.quantity),
        side: data.side as 'Buy' | 'Sell',
      };

      switch (data.action) {
        case 'INSERT':
          return api.insertTransaction(transactionData);
        case 'UPDATE':
          return api.updateTransaction(transactionData);
        case 'CANCEL':
          return api.cancelTransaction(transactionData);
        default:
          throw new Error('Invalid action');
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Transaction ${formData.action.toLowerCase()}ed successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      
      // Reset form
      setFormData({
        tradeId: '',
        version: '1',
        securityCode: '',
        quantity: '',
        side: 'Buy',
        action: 'INSERT'
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${formData.action.toLowerCase()} transaction: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tradeId || !formData.securityCode || !formData.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    transactionMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-cyan-400">Trafigura:Position Management System</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/positions">
            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Current Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  View real-time equity positions
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/transaction-history">
            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Complete audit trail of all transactions and trade modifications
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/positions">
                <Button variant="outline" className="w-full justify-start text-green-400 border-green-400 hover:bg-green-400/10">
                  <Target className="h-4 w-4 mr-2" />
                  View Positions
                </Button>
              </Link>
              <Link to="/transaction-history">
                <Button variant="outline" className="w-full justify-start text-blue-400 border-blue-400 hover:bg-blue-400/10">
                  <Activity className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Add New Transaction Form */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="action" className="text-slate-300">Action</Label>
                  <Select value={formData.action} onValueChange={(value) => handleInputChange('action', value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INSERT">INSERT</SelectItem>
                      <SelectItem value="UPDATE">UPDATE</SelectItem>
                      <SelectItem value="CANCEL">CANCEL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tradeId" className="text-slate-300">Trade ID</Label>
                  <Input
                    id="tradeId"
                    type="number"
                    value={formData.tradeId}
                    onChange={(e) => handleInputChange('tradeId', e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Enter trade ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version" className="text-slate-300">Version</Label>
                  <Input
                    id="version"
                    type="number"
                    value={formData.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Enter version"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityCode" className="text-slate-300">Security Code</Label>
                  <Input
                    id="securityCode"
                    value={formData.securityCode}
                    onChange={(e) => handleInputChange('securityCode', e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="e.g., AAPL, MSFT"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-slate-300">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="side" className="text-slate-300">Side</Label>
                  <Select value={formData.side} onValueChange={(value) => handleInputChange('side', value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Buy">Buy</SelectItem>
                      <SelectItem value="Sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={transactionMutation.isPending}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {transactionMutation.isPending ? 'Processing...' : `${formData.action} Transaction`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Positions */}
        <div className="space-y-4">
          {positionsLoading ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">Loading positions...</div>
              </CardContent>
            </Card>
          ) : (
            <PositionTable positions={positions} />
          )}
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          {transactionsLoading ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">Loading transactions...</div>
              </CardContent>
            </Card>
          ) : (
            <TransactionTable transactions={transactions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
