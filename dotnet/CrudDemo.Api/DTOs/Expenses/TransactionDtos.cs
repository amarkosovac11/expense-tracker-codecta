namespace CrudDemo.API.DTOs.Expenses
{
 
    public class TransactionDto
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public string TransactionType { get; set; } = null!;
    }

    
    public class CreateTransactionDto
    {
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public string TransactionType { get; set; } = null!;
    }


    public class UpdateTransactionDto
    {
        public int CategoryId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public string TransactionType { get; set; } = null!;
    }
}
