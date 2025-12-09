using CrudDemo.API.Models;

namespace CrudDemo.API.Repositories.Interfaces
{
    public interface IExpenseRepository
    {
        Task<List<Expense>> GetAllAsync();
        Task<Expense?> GetByIdAsync(int id);
        Task<Expense> AddAsync(Expense expense);
        Task<Expense?> UpdateAsync(Expense expense);
        Task<bool> DeleteAsync(int id);
    }
}
