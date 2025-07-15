
export interface Transaction {
  transactionId: number;
  tradeId: number;
  version: number;
  securityCode: string;
  quantity: number;
  action: 'INSERT' | 'UPDATE' | 'CANCEL';
  side: 'Buy' | 'Sell';
  timestamp: Date;
  processed: boolean;
}

export interface Position {
  securityCode: string;
  quantity: number;
  averagePrice?: number;
  unrealizedPnL?: number;
}

export interface Trade {
  tradeId: number;
  latestVersion: number;
  securityCode: string;
  quantity: number;
  side: 'Buy' | 'Sell';
  status: 'ACTIVE' | 'CANCELLED';
  versions: Transaction[];
}

export interface PositionSummary {
  totalPositions: number;
  longPositions: number;
  shortPositions: number;
  totalValue: number;
}
