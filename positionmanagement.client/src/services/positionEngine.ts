
import { Transaction, Position, Trade } from '../types/trading';

export class PositionEngine {
  private trades: Map<number, Trade> = new Map();
  private positions: Map<string, Position> = new Map();

  processTransaction(transaction: Transaction): void {
    console.log('Processing transaction:', transaction);
    
    const { tradeId, version, securityCode, quantity, action, side } = transaction;
    
    // Get or create trade
    let trade = this.trades.get(tradeId);
    if (!trade) {
      trade = {
        tradeId,
        latestVersion: 0,
        securityCode,
        quantity,
        side,
        status: 'ACTIVE',
        versions: []
      };
      this.trades.set(tradeId, trade);
    }

    // Add transaction to trade versions
    trade.versions.push(transaction);
    trade.versions.sort((a, b) => a.version - b.version);

    // Process based on action
    this.processByAction(trade, transaction);
    
    // Recalculate positions
    this.recalculatePositions();
    
    transaction.processed = true;
    console.log('Updated positions:', Array.from(this.positions.entries()));
  }

  private processByAction(trade: Trade, transaction: Transaction): void {
    const { action, version, securityCode, quantity, side } = transaction;

    switch (action) {
      case 'INSERT':
        if (version === 1) {
          trade.securityCode = securityCode;
          trade.quantity = quantity;
          trade.side = side;
          trade.latestVersion = version;
          trade.status = 'ACTIVE';
        }
        break;

      case 'UPDATE':
        if (version > trade.latestVersion) {
          trade.securityCode = securityCode;
          trade.quantity = quantity;
          trade.side = side;
          trade.latestVersion = version;
        }
        break;

      case 'CANCEL':
        trade.status = 'CANCELLED';
        trade.latestVersion = version;
        break;
    }
  }

  private recalculatePositions(): void {
    this.positions.clear();

    for (const trade of this.trades.values()) {
      if (trade.status === 'CANCELLED') continue;

      const { securityCode, quantity, side } = trade;
      const signedQuantity = side === 'Buy' ? quantity : -quantity;

      const existingPosition = this.positions.get(securityCode);
      if (existingPosition) {
        existingPosition.quantity += signedQuantity;
      } else {
        this.positions.set(securityCode, {
          securityCode,
          quantity: signedQuantity
        });
      }
    }

    // Remove zero positions
    for (const [code, position] of this.positions.entries()) {
      if (position.quantity === 0) {
        this.positions.delete(code);
      }
    }
  }

  getPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  getTransactions(): Transaction[] {
    const transactions: Transaction[] = [];
    for (const trade of this.trades.values()) {
      transactions.push(...trade.versions);
    }
    return transactions.sort((a, b) => a.transactionId - b.transactionId);
  }

  getTrades(): Trade[] {
    return Array.from(this.trades.values());
  }

  getPositionSummary(): {
    totalPositions: number;
    longPositions: number;
    shortPositions: number;
  } {
    const positions = this.getPositions();
    return {
      totalPositions: positions.length,
      longPositions: positions.filter(p => p.quantity > 0).length,
      shortPositions: positions.filter(p => p.quantity < 0).length,
    };
  }
}
