using Microsoft.EntityFrameworkCore;
using CrudDemo.API.Models;

namespace CrudDemo.Data
{
    public class ExpenseTrackerDbContext : DbContext
    {
        public ExpenseTrackerDbContext(DbContextOptions<ExpenseTrackerDbContext> options)
            : base(options)
        {
        }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<SavingGoal> SavingGoals { get; set; }
        public DbSet<SavingTransaction> SavingTransactions { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable("Transaction");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CategoryId).HasColumnName("category_id");
                entity.Property(e => e.Amount).HasColumnName("amount");
                entity.Property(e => e.Date).HasColumnName("date");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.TransactionType).HasColumnName("transaction_type");
            });

        }
    }
}
