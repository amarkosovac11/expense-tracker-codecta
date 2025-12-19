namespace CrudDemo.API.DTOs.SavingGoals
{
    public class UpdateSavingGoalDto
    {
        public string Title { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public DateTime? Deadline { get; set; }
        public decimal CurrentAmount { get; set; }
    }
}
