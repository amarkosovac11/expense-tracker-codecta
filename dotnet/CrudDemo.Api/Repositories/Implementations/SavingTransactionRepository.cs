using CrudDemo.API.Data;
using CrudDemo.API.Models;
using CrudDemo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrudDemo.API.Repositories.Implementations
{
    public class SavingTransactionRepository : ISavingTransactionRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public SavingTransactionRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<List<SavingTransaction>> GetAllAsync()
        {
            return await _context.SavingTransactions
                .AsNoTracking()
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        public async Task<List<SavingTransaction>> GetByGoalIdAsync(int savingGoalId)
        {
            return await _context.SavingTransactions
                .AsNoTracking()
                .Where(t => t.SavingGoalId == savingGoalId)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        public async Task<SavingTransaction?> GetByIdAsync(int id)
        {
            return await _context.SavingTransactions
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<SavingTransaction> CreateAsync(SavingTransaction tx)
        {
            await _context.SavingTransactions.AddAsync(tx);
            await _context.SaveChangesAsync();
            return tx;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.SavingTransactions.FirstOrDefaultAsync(t => t.Id == id);
            if (existing == null) return false;

            _context.SavingTransactions.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
