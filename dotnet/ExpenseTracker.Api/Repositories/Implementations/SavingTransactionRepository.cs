using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Repositories.Implementations
{
    public class SavingTransactionRepository : ISavingTransactionRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public SavingTransactionRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<List<SavingTransaction>> GetAllAsync(int userId)
        {
            return await _context.SavingTransactions
                .AsNoTracking()
                .Join(_context.SavingGoals,
                      tx => tx.SavingGoalId,
                      g => g.Id,
                      (tx, g) => new { tx, g })
                .Where(x => x.g.UserId == userId)
                .OrderBy(x => x.tx.Id)
                .Select(x => x.tx)
                .ToListAsync();
        }

        public async Task<List<SavingTransaction>> GetByGoalIdAsync(int savingGoalId, int userId)
        {
            var goalOwned = await _context.SavingGoals
                .AsNoTracking()
                .AnyAsync(g => g.Id == savingGoalId && g.UserId == userId);

            if (!goalOwned) return new List<SavingTransaction>();

            return await _context.SavingTransactions
                .AsNoTracking()
                .Where(tx => tx.SavingGoalId == savingGoalId)
                .OrderBy(tx => tx.Id)
                .ToListAsync();
        }

        public async Task<SavingTransaction?> GetByIdAsync(int id, int userId)
        {
            return await _context.SavingTransactions
                .AsNoTracking()
                .Join(_context.SavingGoals,
                      tx => tx.SavingGoalId,
                      g => g.Id,
                      (tx, g) => new { tx, g })
                .Where(x => x.tx.Id == id && x.g.UserId == userId)
                .Select(x => x.tx)
                .FirstOrDefaultAsync();
        }

        public async Task<SavingTransaction?> CreateAsync(SavingTransaction tx, int userId)
        {
            var goal = await _context.SavingGoals
                .FirstOrDefaultAsync(g => g.Id == tx.SavingGoalId && g.UserId == userId);

            if (goal == null) return null;

            await _context.SavingTransactions.AddAsync(tx);

            goal.CurrentAmount += tx.Amount;

            await _context.SaveChangesAsync();
            return tx;
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var existing = await _context.SavingTransactions
                .FirstOrDefaultAsync(tx => tx.Id == id);

            if (existing == null) return false;

            var goal = await _context.SavingGoals
                .FirstOrDefaultAsync(g => g.Id == existing.SavingGoalId && g.UserId == userId);

            if (goal == null) return false;

            goal.CurrentAmount -= existing.Amount;

            if (goal.CurrentAmount < 0)
                goal.CurrentAmount = 0;

            _context.SavingTransactions.Remove(existing);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}