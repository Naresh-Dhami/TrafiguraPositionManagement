
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PositionTable from '../components/PositionTable';
import { api } from '../services/api';

const Positions = () => {
  const { data: positions = [], isLoading, error } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      try {
        // Get positions from API
        const apiPositions = await api.getPositions();
        
        // Get offline positions
        const offlinePositions = JSON.parse(localStorage.getItem('positions') || '{}');
        
        // Merge API and offline positions
        const mergedPositions = [...apiPositions];
        Object.entries(offlinePositions).forEach(([securityCode, quantity]) => {
          const existingPosition = mergedPositions.find(p => p.securityCode === securityCode);
          if (existingPosition) {
            existingPosition.quantity += quantity as number;
          } else {
            mergedPositions.push({ securityCode, quantity: quantity as number });
          }
        });
        
        return mergedPositions;
      } catch (error) {
        // If API fails, return offline positions
        const offlinePositions = JSON.parse(localStorage.getItem('positions') || '{}');
        return Object.entries(offlinePositions).map(([securityCode, quantity]) => ({
          securityCode,
          quantity: quantity as number
        }));
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading positions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading positions</p>
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
            <h1 className="text-2xl font-bold text-cyan-400">Current Positions</h1>
            <p className="text-slate-400 mt-1">Real-time equity position tracking</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PositionTable positions={positions} />
      </div>
    </div>
  );
};

export default Positions;
