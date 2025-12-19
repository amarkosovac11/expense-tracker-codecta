using CrudDemo.API.Models;

namespace CrudDemo.API.Repositories.Interfaces
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetAllAsync();
        Task<Transaction?> GetByIdAsync(int id);
        Task<Transaction> AddAsync(Transaction transaction);
        Task<Transaction?> UpdateAsync(Transaction transaction);
        Task<bool> DeleteAsync(int id);
    }
}
