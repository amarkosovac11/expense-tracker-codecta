
namespace CrudDemo.API.Models
{public class SavingGoal
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = null!;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateTime? Deadline { get; set; }
}
}