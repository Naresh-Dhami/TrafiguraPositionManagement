import { Position, Transaction } from '../types/trading';

const BASE_URL = 'http://localhost:5059/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
};

export const api = {
  async insertTransaction(transaction: Pick<Transaction, 'tradeId' | 'version' | 'securityCode' | 'quantity' | 'side'>): Promise<Transaction> {
    const response = await fetch(`${BASE_URL}/Positions/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tradeId: Number(transaction.tradeId),
        version: Number(transaction.version),
        securityCode: transaction.securityCode,
        quantity: Number(transaction.quantity),
        action: 'INSERT',
        tradeType: transaction.side
      })
    });
    return handleResponse(response);
  },

  async updateTransaction(transaction: Pick<Transaction, 'tradeId' | 'version' | 'securityCode' | 'quantity' | 'side'>): Promise<Transaction> {
    const response = await fetch(`${BASE_URL}/Positions/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tradeId: Number(transaction.tradeId),
        version: Number(transaction.version),
        securityCode: transaction.securityCode,
        quantity: Number(transaction.quantity),
        action: 'UPDATE',
        tradeType: transaction.side
      })
    });
    return handleResponse(response);
  },

  async cancelTransaction(transaction: Pick<Transaction, 'tradeId' | 'version' | 'securityCode' | 'quantity' | 'side'>): Promise<Transaction> {
    const response = await fetch(`${BASE_URL}/Positions/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tradeId: Number(transaction.tradeId),
        version: Number(transaction.version),
        securityCode: transaction.securityCode,
        quantity: Number(transaction.quantity),
        action: 'CANCEL',
        tradeType: transaction.side
      })
    });
    return handleResponse(response);
  },

  async getPositions(): Promise<Position[]> {
    const response = await fetch(`${BASE_URL}/Positions`);
    return handleResponse(response);
  },

  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${BASE_URL}/Positions/transactions`);
    return handleResponse(response);
  }
};