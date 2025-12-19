namespace CrudDemo.API.DTOs.SavingTransactions
{
    public class CreateSavingTransactionDto
    {
        public int SavingGoalId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}
