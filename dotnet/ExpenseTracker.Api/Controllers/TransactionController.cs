using ExpenseTracker.Api.DTOs.Expenses;
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionController(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<TransactionDto>>> GetAll()
        {
            var expenses = await _transactionRepository.GetAllAsync();

            var result = expenses.Select(e => new TransactionDto
            {
                Id = e.Id,
                CategoryId = e.CategoryId,
                Amount = e.Amount,
                Date = e.Date,
                Description = e.Description,
                TransactionType = e.TransactionType
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TransactionDto>> GetById(int id)
        {
            var e = await _transactionRepository.GetByIdAsync(id);
            if (e == null)
                return NotFound();

            var dto = new TransactionDto
            {
                Id = e.Id,
                CategoryId = e.CategoryId,
                Amount = e.Amount,
                Date = e.Date,
                Description = e.Description,
                TransactionType = e.TransactionType
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<TransactionDto>> Create([FromBody] CreateTransactionDto dto)
        {
            var transaction = new Transaction
            {
                UserId = dto.UserId,
                CategoryId = dto.CategoryId,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description,
                TransactionType = dto.TransactionType
            };

            var created = await _transactionRepository.AddAsync(transaction);

            var result = new TransactionDto
            {
                Id = created.Id,
                CategoryId = created.CategoryId,
                Amount = created.Amount,
                Date = created.Date,
                Description = created.Description,
                TransactionType = created.TransactionType
            };

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<TransactionDto>> Update(int id, [FromBody] UpdateTransactionDto dto)
        {
            var transaction = new Transaction
            {
                Id = id,
                CategoryId = dto.CategoryId,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description,
                TransactionType = dto.TransactionType
            };

            var updated = await _transactionRepository.UpdateAsync(transaction);
            if (updated == null)
                return NotFound();

            var result = new TransactionDto
            {
                Id = updated.Id,
                CategoryId = updated.CategoryId,
                Amount = updated.Amount,
                Date = updated.Date,
                Description = updated.Description,
                TransactionType = updated.TransactionType
            };

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _transactionRepository.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
