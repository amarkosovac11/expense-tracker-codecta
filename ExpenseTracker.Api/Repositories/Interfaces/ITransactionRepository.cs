using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.DTOs.Expenses;

namespace ExpenseTracker.Api.Repositories.Interfaces
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetAllAsync(int userId);
        Task<Transaction?> GetByIdAsync(int id, int userId);
        Task<Transaction> AddAsync(Transaction transaction);
        Task<Transaction?> UpdateAsync(int id, int userId, UpdateTransactionDto dto);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
