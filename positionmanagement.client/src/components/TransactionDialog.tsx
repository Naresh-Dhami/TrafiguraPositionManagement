
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, PlusCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { api } from '../services/api';

interface TransactionDialogProps {
  trigger?: React.ReactNode;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    tradeId: '',
    version: '',
    securityCode: '',
    quantity: '',
    action: 'INSERT' as 'INSERT' | 'UPDATE' | 'CANCEL',
    side: 'Buy' as 'Buy' | 'Sell'
  });

  const queryClient = useQueryClient();

  const insertMutation = useMutation({
    mutationFn: api.insertTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({
        title: "Transaction Inserted",
        description: `INSERT transaction for ${formData.securityCode} processed successfully.`,
      });
      resetForm();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to insert transaction: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({
        title: "Transaction Updated",
        description: `UPDATE transaction for ${formData.securityCode} processed successfully.`,
      });
      resetForm();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update transaction: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: api.cancelTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({
        title: "Transaction Cancelled",
        description: `CANCEL transaction for ${formData.securityCode} processed successfully.`,
      });
      resetForm();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to cancel transaction: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      tradeId: '',
      version: '',
      securityCode: '',
      quantity: '',
      action: 'INSERT',
      side: 'Buy'
    });
  };

  const saveToLocalStorage = (transaction: any, error?: string) => {
    try {
      const offlineTransactions = JSON.parse(localStorage.getItem('offlineTransactions') || '[]');
      offlineTransactions.push({
        ...transaction,
        isOffline: true,
        error,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('offlineTransactions', JSON.stringify(offlineTransactions));

      // Update positions in localStorage
      const positions = JSON.parse(localStorage.getItem('positions') || '{}');
      const quantity = transaction.action === 'CANCEL' ? 0 : 
        (transaction.side === 'Sell' ? -transaction.quantity : transaction.quantity);
      
      positions[transaction.securityCode] = (positions[transaction.securityCode] || 0) + quantity;
      localStorage.setItem('positions', JSON.stringify(positions));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tradeId || !formData.version || !formData.securityCode || !formData.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const transaction = {
      tradeId: parseInt(formData.tradeId),
      version: parseInt(formData.version),
      securityCode: formData.securityCode.toUpperCase(),
      quantity: parseInt(formData.quantity),
      action: formData.action,
      side: formData.side
    };

    const handleError = (error: Error) => {
      saveToLocalStorage(transaction, error.message);
      toast({
        title: "Transaction Saved Offline",
        description: "The transaction will be synced when connection is restored.",
        variant: "default",
      });
      resetForm();
      setOpen(false);
    };

    switch (formData.action) {
      case 'INSERT':
        insertMutation.mutate(transaction, {
          onError: handleError
        });
        break;
      case 'UPDATE':
        updateMutation.mutate(transaction, {
          onError: handleError
        });
        break;
      case 'CANCEL':
        cancelMutation.mutate(transaction, {
          onError: handleError
        });
        break;
    }
  };

  const getActionIcon = () => {
    switch (formData.action) {
      case 'INSERT': return <PlusCircle className="h-5 w-5" />;
      case 'UPDATE': return <Edit className="h-5 w-5" />;
      case 'CANCEL': return <X className="h-5 w-5" />;
    }
  };

  const isLoading = insertMutation.isPending || updateMutation.isPending || cancelMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            {getActionIcon()}
            Transaction Management
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tradeId" className="text-slate-300">Trade ID *</Label>
              <Input
                id="tradeId"
                type="number"
                value={formData.tradeId}
                onChange={(e) => setFormData({ ...formData, tradeId: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="version" className="text-slate-300">Version *</Label>
              <Input
                id="version"
                type="number"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="securityCode" className="text-slate-300">Security Code *</Label>
              <Input
                id="securityCode"
                value={formData.securityCode}
                onChange={(e) => setFormData({ ...formData, securityCode: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="REL"
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-slate-300">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="action" className="text-slate-300">Action *</Label>
              <Select value={formData.action} onValueChange={(value: 'INSERT' | 'UPDATE' | 'CANCEL') => setFormData({ ...formData, action: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="INSERT" className="text-green-400">INSERT</SelectItem>
                  <SelectItem value="UPDATE" className="text-yellow-400">UPDATE</SelectItem>
                  <SelectItem value="CANCEL" className="text-red-400">CANCEL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="side" className="text-slate-300">Side *</Label>
              <Select value={formData.side} onValueChange={(value: 'Buy' | 'Sell') => setFormData({ ...formData, side: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="Buy" className="text-green-400">Buy</SelectItem>
                  <SelectItem value="Sell" className="text-red-400">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </div>
            ) : (
              <>
                {getActionIcon()}
                <span className="ml-2">{formData.action} Transaction</span>
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
