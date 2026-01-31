using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.DTOs.SavingGoals;
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Repositories.Implementations
{
    public class SavingGoalRepository : ISavingGoalRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public SavingGoalRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<List<SavingGoal>> GetAllAsync(int userId)
        {
            return await _context.SavingGoals
                .AsNoTracking()
                .Where(g => g.UserId == userId)
                .OrderBy(g => g.Id)
                .ToListAsync();
        }

        public async Task<SavingGoal?> GetByIdAsync(int id, int userId)
        {
            return await _context.SavingGoals
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
        }

        public async Task<SavingGoal> CreateAsync(SavingGoal goal)
        {
            await _context.SavingGoals.AddAsync(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<SavingGoal?> UpdateAsync(int id, int userId, UpdateSavingGoalDto dto)
        {
            var existing = await _context.SavingGoals
                .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

            if (existing == null) return null;

            existing.Title = dto.Title.Trim();
            existing.TargetAmount = dto.TargetAmount;
            existing.CurrentAmount = dto.CurrentAmount;
            existing.Deadline = dto.Deadline;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var existing = await _context.SavingGoals
                .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

            if (existing == null) return false;

            _context.SavingGoals.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id, int userId)
        {
            return await _context.SavingGoals.AnyAsync(g => g.Id == id && g.UserId == userId);
        }
    }
}
