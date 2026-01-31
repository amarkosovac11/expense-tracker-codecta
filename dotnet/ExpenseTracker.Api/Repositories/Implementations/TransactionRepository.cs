using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.DTOs.Expenses;
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Repositories.Implementations
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public TransactionRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<List<Transaction>> GetAllAsync(int userId)
        {
            return await _context.Transactions
                .AsNoTracking()
                .Where(t => t.UserId == userId)
                .OrderBy(t => t.Id)
                .ToListAsync();
        }

        public async Task<Transaction?> GetByIdAsync(int id, int userId)
        {
            return await _context.Transactions
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<Transaction> AddAsync(Transaction transaction)
        {
            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<Transaction?> UpdateAsync(int id, int userId, UpdateTransactionDto dto)
        {
            var existing = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (existing == null) return null;

            existing.CategoryId = dto.CategoryId;
            existing.Amount = dto.Amount;
            existing.Date = dto.Date;
            existing.Description = dto.Description;
            existing.TransactionType = dto.TransactionType;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var existing = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (existing == null) return false;

            _context.Transactions.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
