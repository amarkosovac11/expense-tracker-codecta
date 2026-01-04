using ExpenseTracker.Api.DTOs.SavingTransactions;
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SavingTransactionsController : ControllerBase
    {
        private readonly ISavingTransactionRepository _repo;

        public SavingTransactionsController(ISavingTransactionRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<ActionResult<List<SavingTransactionDto>>> GetAll()
        {
            var items = await _repo.GetAllAsync();

            var result = items.Select(t => new SavingTransactionDto
            {
                Id = t.Id,
                SavingGoalId = t.SavingGoalId,
                Amount = t.Amount,
                Date = t.Date
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SavingTransactionDto>> GetById(int id)
        {
            var t = await _repo.GetByIdAsync(id);
            if (t == null) return NotFound();

            return Ok(new SavingTransactionDto
            {
                Id = t.Id,
                SavingGoalId = t.SavingGoalId,
                Amount = t.Amount,
                Date = t.Date
            });
        }

        [HttpGet("goal/{savingGoalId:int}")]
        public async Task<ActionResult<List<SavingTransactionDto>>> GetByGoalId(int savingGoalId)
        {
            var items = await _repo.GetByGoalIdAsync(savingGoalId);

            var result = items.Select(t => new SavingTransactionDto
            {
                Id = t.Id,
                SavingGoalId = t.SavingGoalId,
                Amount = t.Amount,
                Date = t.Date
            }).ToList();

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<SavingTransactionDto>> Create([FromBody] CreateSavingTransactionDto dto)
        {
            if (dto.SavingGoalId <= 0) return BadRequest("SavingGoalId is required.");
            if (dto.Amount <= 0) return BadRequest("Amount must be greater than 0.");

            var date = dto.Date == default ? DateTime.UtcNow : dto.Date;

            var tx = new SavingTransaction
            {
                SavingGoalId = dto.SavingGoalId,
                Amount = dto.Amount,
                Date = date
            };

            var created = await _repo.CreateAsync(tx);

            var result = new SavingTransactionDto
            {
                Id = created.Id,
                SavingGoalId = created.SavingGoalId,
                Amount = created.Amount,
                Date = created.Date
            };

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
