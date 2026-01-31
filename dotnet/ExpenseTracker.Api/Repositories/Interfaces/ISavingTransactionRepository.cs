using ExpenseTracker.Api.Models;

namespace ExpenseTracker.Api.Repositories.Interfaces
{
    public interface ISavingTransactionRepository
    {
        Task<List<SavingTransaction>> GetAllAsync(int userId);
        Task<List<SavingTransaction>> GetByGoalIdAsync(int savingGoalId, int userId);
        Task<SavingTransaction?> GetByIdAsync(int id, int userId);

        Task<SavingTransaction?> CreateAsync(SavingTransaction tx, int userId);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
