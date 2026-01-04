using ExpenseTracker.Api.DTOs.SavingGoals;
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SavingGoalsController : ControllerBase
    {
        private readonly ISavingGoalRepository _savingGoalRepository;

        public SavingGoalsController(ISavingGoalRepository savingGoalRepository)
        {
            _savingGoalRepository = savingGoalRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<SavingGoalDto>>> GetAll()
        {
            var goals = await _savingGoalRepository.GetAllAsync();

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
            var g = await _savingGoalRepository.GetByIdAsync(id);
            if (g == null) return NotFound();

            var dto = new SavingGoalDto
            {
                Id = g.Id,
                UserId = g.UserId,
                Title = g.Title,
                TargetAmount = g.TargetAmount,
                CurrentAmount = g.CurrentAmount,
                Deadline = g.Deadline
            };

            return Ok(dto);
        }

        [HttpGet("user/{userId:int}")]
        public async Task<ActionResult<List<SavingGoalDto>>> GetByUserId(int userId)
        {
            var goals = await _savingGoalRepository.GetByUserIdAsync(userId);

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

        [HttpPost]
        public async Task<ActionResult<SavingGoalDto>> Create([FromBody] CreateSavingGoalDto dto)
        {
            if (dto.UserId <= 0) return BadRequest("UserId is required.");
            if (string.IsNullOrWhiteSpace(dto.Title)) return BadRequest("Title is required.");
            if (dto.TargetAmount <= 0) return BadRequest("TargetAmount must be greater than 0.");

            var goal = new SavingGoal
            {
                UserId = dto.UserId,
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

            var updated = await _savingGoalRepository.UpdateAsync(new SavingGoal
            {
                Id = id,
                Title = dto.Title.Trim(),
                TargetAmount = dto.TargetAmount,
                CurrentAmount = dto.CurrentAmount,
                Deadline = dto.Deadline
            });

            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _savingGoalRepository.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
