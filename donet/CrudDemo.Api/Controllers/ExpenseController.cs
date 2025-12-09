using CrudDemo.API.DTOs.Expenses;
using CrudDemo.API.Models;
using CrudDemo.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CrudDemo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseRepository _expenseRepository;

        public ExpensesController(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<ExpenseDto>>> GetAll()
        {
            var expenses = await _expenseRepository.GetAllAsync();

            var result = expenses.Select(e => new ExpenseDto
            {
                Id = e.Id,
                CategoryId = e.CategoryId,
                Amount = e.Amount,
                Date = e.Date,
                Description = e.Description
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ExpenseDto>> GetById(int id)
        {
            var e = await _expenseRepository.GetByIdAsync(id);
            if (e == null)
                return NotFound();

            var dto = new ExpenseDto
            {
                Id = e.Id,
                CategoryId = e.CategoryId,
                Amount = e.Amount,
                Date = e.Date,
                Description = e.Description
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> Create([FromBody] CreateExpenseDto dto)
        {
            var expense = new Expense
            {
                UserId = dto.UserId,
                CategoryId = dto.CategoryId,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description
            };

            var created = await _expenseRepository.AddAsync(expense);

            var result = new ExpenseDto
            {
                Id = created.Id,
                CategoryId = created.CategoryId,
                Amount = created.Amount,
                Date = created.Date,
                Description = created.Description
            };

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ExpenseDto>> Update(int id, [FromBody] UpdateExpenseDto dto)
        {
            var expense = new Expense
            {
                Id = id,
                CategoryId = dto.CategoryId,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description
            };

            var updated = await _expenseRepository.UpdateAsync(expense);
            if (updated == null)
                return NotFound();

            var result = new ExpenseDto
            {
                Id = updated.Id,
                CategoryId = updated.CategoryId,
                Amount = updated.Amount,
                Date = updated.Date,
                Description = updated.Description
            };

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _expenseRepository.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
