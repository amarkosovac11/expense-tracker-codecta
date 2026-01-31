using ExpenseTracker.Api.DTOs.SavingGoals;
using ExpenseTracker.Api.Models;

namespace ExpenseTracker.Api.Repositories.Interfaces
{
    public interface ISavingGoalRepository
    {
        Task<List<SavingGoal>> GetAllAsync(int userId);
        Task<SavingGoal?> GetByIdAsync(int id, int userId);
        Task<SavingGoal> CreateAsync(SavingGoal goal);

        Task<SavingGoal?> UpdateAsync(int id, int userId, UpdateSavingGoalDto dto);
        Task<bool> DeleteAsync(int id, int userId);

        Task<bool> ExistsAsync(int id, int userId);
    }
}
