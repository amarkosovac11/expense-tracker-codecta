namespace CrudDemo.API.Models
{
public class SavingTransaction
{
    public int Id { get; set; }
    public int SavingGoalId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
}
}