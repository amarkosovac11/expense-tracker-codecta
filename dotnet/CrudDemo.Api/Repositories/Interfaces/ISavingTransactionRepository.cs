using CrudDemo.API.Models;

namespace CrudDemo.API.Repositories.Interfaces
{
    public interface ISavingTransactionRepository
    {
        Task<List<SavingTransaction>> GetAllAsync();
        Task<List<SavingTransaction>> GetByGoalIdAsync(int savingGoalId);
        Task<SavingTransaction?> GetByIdAsync(int id);

        Task<SavingTransaction> CreateAsync(SavingTransaction tx);
        Task<bool> DeleteAsync(int id);
    }
}
