using ExpenseTracker.Api.DTOs.SavingGoals;
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTracker.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SavingGoalsController : ControllerBase
    {
        private readonly ISavingGoalRepository _savingGoalRepository;

        private int UserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        public SavingGoalsController(ISavingGoalRepository savingGoalRepository)
        {
            _savingGoalRepository = savingGoalRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<SavingGoalDto>>> GetAll()
        {
            var goals = await _savingGoalRepository.GetAllAsync(UserId);

            var result = goals.Select(g => new SavingGoalDto
            {
                Id = g.Id,
                UserId = g.UserId,
                Title = g.Title,
                TargetAmount = g.TargetAmount,
                CurrentAmount = g.CurrentAmount,
                Deadline = g.Deadline
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SavingGoalDto>> GetById(int id)
        {
            var g = await _savingGoalRepository.GetByIdAsync(id, UserId);
            if (g == null) return NotFound();

            return Ok(new SavingGoalDto
            {
                Id = g.Id,
                UserId = g.UserId,
                Title = g.Title,
                TargetAmount = g.TargetAmount,
                CurrentAmount = g.CurrentAmount,
                Deadline = g.Deadline
            });
        }

        [HttpPost]
        public async Task<ActionResult<SavingGoalDto>> Create([FromBody] CreateSavingGoalDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title)) return BadRequest("Title is required.");
            if (dto.TargetAmount <= 0) return BadRequest("TargetAmount must be greater than 0.");

            var goal = new SavingGoal
            {
                UserId = UserId,
                Title = dto.Title.Trim(),
                TargetAmount = dto.TargetAmount,
                CurrentAmount = 0m,
                Deadline = dto.Deadline
            };

            var created = await _savingGoalRepository.CreateAsync(goal);

            var result = new SavingGoalDto
            {
                Id = created.Id,
                UserId = created.UserId,
                Title = created.Title,
                TargetAmount = created.TargetAmount,
                CurrentAmount = created.CurrentAmount,
                Deadline = created.Deadline
            };

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSavingGoalDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title)) return BadRequest("Title is required.");
            if (dto.TargetAmount <= 0) return BadRequest("TargetAmount must be greater than 0.");
            if (dto.CurrentAmount < 0) return BadRequest("CurrentAmount cannot be negative.");

            var updated = await _savingGoalRepository.UpdateAsync(id, UserId, dto);
            if (updated == null) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _savingGoalRepository.DeleteAsync(id, UserId);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
