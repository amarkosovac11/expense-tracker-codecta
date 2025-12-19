namespace CrudDemo.API.DTOs.SavingGoals
{
    public class SavingGoalDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public decimal CurrentAmount { get; set; }
        public DateTime? Deadline { get; set; }
        public int UserId { get; set; }
    }
}