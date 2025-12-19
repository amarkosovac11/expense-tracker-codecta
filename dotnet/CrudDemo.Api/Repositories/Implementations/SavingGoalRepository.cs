using CrudDemo.API.Data;
using CrudDemo.API.Models;
using CrudDemo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrudDemo.API.Repositories.Implementations
{
    public class SavingGoalRepository : ISavingGoalRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public SavingGoalRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<List<SavingGoal>> GetAllAsync()
        {
            return await _context.SavingGoals
                .AsNoTracking()
                .OrderBy(g => g.Id)
                .ToListAsync();
        }

        public async Task<List<SavingGoal>> GetByUserIdAsync(int userId)
        {
            return await _context.SavingGoals
                .AsNoTracking()
                .Where(g => g.UserId == userId)
                .OrderBy(g => g.Id)
                .ToListAsync();
        }

        public async Task<SavingGoal?> GetByIdAsync(int id)
        {
            return await _context.SavingGoals
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<SavingGoal> CreateAsync(SavingGoal goal)
        {
            await _context.SavingGoals.AddAsync(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<bool> UpdateAsync(SavingGoal goal)
        {
            var existing = await _context.SavingGoals.FirstOrDefaultAsync(g => g.Id == goal.Id);
            if (existing == null) return false;

            existing.Title = goal.Title;
            existing.TargetAmount = goal.TargetAmount;
            existing.CurrentAmount = goal.CurrentAmount;
            existing.Deadline = goal.Deadline;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.SavingGoals.FirstOrDefaultAsync(g => g.Id == id);
            if (existing == null) return false;

            _context.SavingGoals.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.SavingGoals.AnyAsync(g => g.Id == id);
        }
    }
}
