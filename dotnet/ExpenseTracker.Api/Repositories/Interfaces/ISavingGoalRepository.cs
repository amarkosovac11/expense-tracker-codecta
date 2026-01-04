using ExpenseTracker.Api.Models;

namespace ExpenseTracker.Api.Repositories.Interfaces
{
    public interface ISavingGoalRepository
    {
        Task<List<SavingGoal>> GetAllAsync();
        Task<List<SavingGoal>> GetByUserIdAsync(int userId);
        Task<SavingGoal?> GetByIdAsync(int id);

        Task<SavingGoal> CreateAsync(SavingGoal goal);
        Task<bool> UpdateAsync(SavingGoal goal);
        Task<bool> DeleteAsync(int id);

        Task<bool> ExistsAsync(int id);
    }
}
