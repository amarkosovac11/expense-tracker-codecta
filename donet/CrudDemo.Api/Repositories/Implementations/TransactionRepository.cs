using CrudDemo.API.Models;
using CrudDemo.API.Repositories.Interfaces;
using CrudDemo.Data;
using Microsoft.EntityFrameworkCore;

namespace CrudDemo.API.Repositories.Implementations
{
    public class TransactionRepository : ITransactionRepository
    {
        
        private readonly ExpenseTrackerDbContext _context;

        public TransactionRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<List<Transaction>> GetAllAsync()
        {
            return await _context.Transactions.ToListAsync();
        }

        public async Task<Transaction?> GetByIdAsync(int id)
        {
            return await _context.Transactions.FindAsync(id);
        }

        public async Task<Transaction> AddAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<Transaction?> UpdateAsync(Transaction transaction)
        {
            var existing = await _context.Transactions.FindAsync(transaction.Id);
            if (existing == null)
                return null;

            existing.CategoryId = transaction.CategoryId;
            existing.Amount = transaction.Amount;
            existing.Date = transaction.Date;
            existing.Description = transaction.Description;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Transactions.FindAsync(id);
            if (existing == null)
                return false;

            _context.Transactions.Remove(existing);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
