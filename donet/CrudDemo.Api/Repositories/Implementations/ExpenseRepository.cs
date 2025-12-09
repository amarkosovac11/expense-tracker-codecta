using CrudDemo.API.Models;
using CrudDemo.API.Repositories.Interfaces;
using CrudDemo.Data;
using Microsoft.EntityFrameworkCore;

namespace CrudDemo.API.Repositories.Implementations
{
    public class ExpenseRepository : IExpenseRepository
    {
        
        private readonly ExpenseTrackerDbContext _context;

        public ExpenseRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<List<Expense>> GetAllAsync()
        {
            return await _context.Expenses.ToListAsync();
        }

        public async Task<Expense?> GetByIdAsync(int id)
        {
            return await _context.Expenses.FindAsync(id);
        }

        public async Task<Expense> AddAsync(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<Expense?> UpdateAsync(Expense expense)
        {
            var existing = await _context.Expenses.FindAsync(expense.Id);
            if (existing == null)
                return null;

            existing.CategoryId = expense.CategoryId;
            existing.Amount = expense.Amount;
            existing.Date = expense.Date;
            existing.Description = expense.Description;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Expenses.FindAsync(id);
            if (existing == null)
                return false;

            _context.Expenses.Remove(existing);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
