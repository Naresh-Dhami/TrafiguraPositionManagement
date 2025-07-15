using Microsoft.EntityFrameworkCore;
using PositionManagement.Server.Data;
using PositionManagement.Server.Models;

namespace PositionManagement.Server.Services
{
    public interface IPositionService
    {
        Task<Transaction> ProcessTransactionAsync(Transaction transaction);
        Task<IEnumerable<Position>> GetPositionsAsync();
        Task<IEnumerable<Transaction>> GetTransactionsAsync();
    }

    public class PositionService : IPositionService
    {
        private readonly ApplicationDbContext _context;

        public PositionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Transaction> ProcessTransactionAsync(Transaction transaction)
        {
            // First, validate the transaction
            if (transaction.Version == 1 && transaction.Action != "INSERT")
            {
                throw new InvalidOperationException("Version 1 must be an INSERT action");
            }

            // Get all transactions for this trade ordered by version
            var existingTransactions = await _context.Transactions
                .Where(t => t.TradeID == transaction.TradeID)
                .OrderByDescending(t => t.Version)
                .ToListAsync();

            var latestVersion = existingTransactions.FirstOrDefault()?.Version ?? 0;

            // Validate version
            if (transaction.Action == "INSERT" && existingTransactions.Any())
            {
                throw new InvalidOperationException("INSERT action already exists for this trade");
            }

            if (transaction.Version != latestVersion + 1 && transaction.Action != "INSERT")
            {
                throw new InvalidOperationException("Invalid version number");
            }

            // For UPDATE, validate that there's an existing trade to update
            if (transaction.Action == "UPDATE" && !existingTransactions.Any())
            {
                throw new InvalidOperationException("Cannot UPDATE a non-existent trade");
            }

            // For CANCEL, validate that there's an existing trade to cancel
            if (transaction.Action == "CANCEL" && !existingTransactions.Any())
            {
                throw new InvalidOperationException("Cannot CANCEL a non-existent trade");
            }

            // Add the transaction
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            // Update positions
            await UpdatePositionsAsync();

            return transaction;
        }

        public async Task<IEnumerable<Position>> GetPositionsAsync()
        {
            return await _context.Positions.ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> GetTransactionsAsync()
        {
            return await _context.Transactions
                .OrderByDescending(t => t.TransactionID)
                .ToListAsync();
        }

        private async Task UpdatePositionsAsync()
        {
            // Clear existing positions
            _context.Positions.RemoveRange(await _context.Positions.ToListAsync());
            await _context.SaveChangesAsync();
            
            // Get all trades grouped by TradeID
            var trades = await _context.Transactions
                .GroupBy(t => t.TradeID)
                .ToListAsync();

            var positions = new Dictionary<string, int>();

            foreach (var trade in trades)
            {
                // Get the latest version of the trade
                var latestTransaction = trade
                    .OrderByDescending(t => t.Version)
                    .First();

                // Skip cancelled trades
                if (latestTransaction.Action == "CANCEL")
                    continue;

                // Calculate the effect on position
                var quantity = latestTransaction.Quantity;
                if (latestTransaction.TradeType == "Sell")
                {
                    quantity = -quantity; // Negative for sell trades
                }

                // Update the position for this security
                if (!positions.ContainsKey(latestTransaction.SecurityCode))
                {
                    positions[latestTransaction.SecurityCode] = 0;
                }
                positions[latestTransaction.SecurityCode] += quantity;
            }

            // Save new positions
            foreach (var position in positions)
            {
                _context.Positions.Add(new Position
                {
                    SecurityCode = position.Key,
                    Quantity = position.Value
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
