using CrudDemo.Data;
using CrudDemo.API.Models;
using CrudDemo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CrudDemo.API.Repositories.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public CategoryRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _context.Categories
                .AsNoTracking()
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Category> CreateAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> UpdateAsync(Category category)
        {
            var existing = await _context.Categories.FirstOrDefaultAsync(c => c.Id == category.Id);
            if (existing == null) return false;

            existing.Name = category.Name;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (existing == null) return false;

            _context.Categories.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Categories.AnyAsync(c => c.Id == id);
        }
    }
}
