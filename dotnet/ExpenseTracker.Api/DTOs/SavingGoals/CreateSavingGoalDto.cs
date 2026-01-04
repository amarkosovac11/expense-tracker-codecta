namespace ExpenseTracker.Api.DTOs.SavingGoals
{
    public class CreateSavingGoalDto
    {
        public string Title { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public DateTime? Deadline { get; set; }
        public int UserId { get; set; }
    }
}
