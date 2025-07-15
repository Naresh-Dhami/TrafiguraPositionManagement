
import { describe, beforeEach, test, expect } from 'vitest';
import { PositionEngine } from '../services/positionEngine';
import { Transaction } from '../types/trading';

describe('PositionEngine', () => {
  let engine: PositionEngine;

  beforeEach(() => {
    engine = new PositionEngine();
  });

  const createTransaction = (
    transactionId: number,
    tradeId: number,
    version: number,
    securityCode: string,
    quantity: number,
    action: 'INSERT' | 'UPDATE' | 'CANCEL',
    side: 'Buy' | 'Sell'
  ): Transaction => ({
    transactionId,
    tradeId,
    version,
    securityCode,
    quantity,
    action,
    side,
    timestamp: new Date(),
    processed: false
  });

  test('should process INSERT transaction correctly', () => {
    const transaction = createTransaction(1, 1, 1, 'REL', 50, 'INSERT', 'Buy');
    engine.processTransaction(transaction);

    const positions = engine.getPositions();
    expect(positions).toHaveLength(1);
    expect(positions[0]).toEqual({
      securityCode: 'REL',
      quantity: 50
    });
  });

  test('should process UPDATE transaction correctly', () => {
    const insertTx = createTransaction(1, 1, 1, 'REL', 50, 'INSERT', 'Buy');
    const updateTx = createTransaction(2, 1, 2, 'REL', 60, 'UPDATE', 'Buy');
    
    engine.processTransaction(insertTx);
    engine.processTransaction(updateTx);

    const positions = engine.getPositions();
    expect(positions).toHaveLength(1);
    expect(positions[0].quantity).toBe(60);
  });

  test('should process CANCEL transaction correctly', () => {
    const insertTx = createTransaction(1, 2, 1, 'ITC', 40, 'INSERT', 'Sell');
    const cancelTx = createTransaction(2, 2, 2, 'ITC', 30, 'CANCEL', 'Buy');
    
    engine.processTransaction(insertTx);
    engine.processTransaction(cancelTx);

    const positions = engine.getPositions();
    expect(positions).toHaveLength(0); // Position should be removed after cancel
  });

  test('should handle sample data correctly', () => {
    const transactions = [
      createTransaction(1, 1, 1, 'REL', 50, 'INSERT', 'Buy'),
      createTransaction(2, 2, 1, 'ITC', 40, 'INSERT', 'Sell'),
      createTransaction(3, 3, 1, 'INF', 70, 'INSERT', 'Buy'),
      createTransaction(4, 1, 2, 'REL', 60, 'UPDATE', 'Buy'),
      createTransaction(5, 2, 2, 'ITC', 30, 'CANCEL', 'Buy'),
      createTransaction(6, 4, 1, 'INF', 20, 'INSERT', 'Sell'),
    ];

    transactions.forEach(tx => engine.processTransaction(tx));

    const positions = engine.getPositions();
    const positionMap = new Map(positions.map(p => [p.securityCode, p.quantity]));

    expect(positionMap.get('REL')).toBe(60);  // INSERT 50, UPDATE to 60
    expect(positionMap.get('ITC')).toBeUndefined(); // CANCELLED, so no position
    expect(positionMap.get('INF')).toBe(50);  // INSERT +70, INSERT -20 = +50
  });

  test('should handle out-of-order transactions', () => {
    // Process UPDATE before INSERT
    const updateTx = createTransaction(2, 1, 2, 'REL', 60, 'UPDATE', 'Buy');
    const insertTx = createTransaction(1, 1, 1, 'REL', 50, 'INSERT', 'Buy');
    
    engine.processTransaction(updateTx);
    engine.processTransaction(insertTx);

    const positions = engine.getPositions();
    expect(positions).toHaveLength(1);
    expect(positions[0].quantity).toBe(60); // Should use latest version
  });

  test('should calculate position summary correctly', () => {
    engine.processTransaction(createTransaction(1, 1, 1, 'REL', 50, 'INSERT', 'Buy'));
    engine.processTransaction(createTransaction(2, 2, 1, 'ITC', 40, 'INSERT', 'Sell'));
    
    const summary = engine.getPositionSummary();
    expect(summary.totalPositions).toBe(2);
    expect(summary.longPositions).toBe(1);
    expect(summary.shortPositions).toBe(1);
  });
});
