
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Position } from '../types/trading';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface PositionTableProps {
  positions: Position[];
}

const PositionTable: React.FC<PositionTableProps> = ({ positions }) => {
  const getPositionColor = (quantity: number) => {
    if (quantity > 0) return 'text-green-400';
    if (quantity < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  const getPositionIcon = (quantity: number) => {
    if (quantity > 0) return <TrendingUp className="h-4 w-4" />;
    if (quantity < 0) return <TrendingDown className="h-4 w-4" />;
    return <Target className="h-4 w-4" />;
  };

  const getPositionBadge = (quantity: number) => {
    if (quantity > 0) return <Badge variant="outline" className="text-green-400 border-green-400">LONG</Badge>;
    if (quantity < 0) return <Badge variant="outline" className="text-red-400 border-red-400">SHORT</Badge>;
    return <Badge variant="outline" className="text-slate-400 border-slate-400">FLAT</Badge>;
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Current Positions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {positions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No positions available
          </div>
        ) : (
          <div className="space-y-2">
            {positions.map((position) => (
              <div
                key={position.securityCode}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getPositionIcon(position.quantity)}
                  <div>
                    <div className="font-mono text-white font-semibold text-lg">
                      {position.securityCode}
                    </div>
                    <div className="text-sm text-slate-400">Security</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`font-mono text-xl font-bold ${getPositionColor(position.quantity)}`}>
                      {position.quantity > 0 ? '+' : ''}{position.quantity}
                    </div>
                    <div className="text-sm text-slate-400">Quantity</div>
                  </div>
                  {getPositionBadge(position.quantity)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PositionTable;
