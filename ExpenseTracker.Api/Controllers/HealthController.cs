using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Api.Data;

namespace ExpenseTracker.Api.Controllers
{
    [ApiController]
    [Route("health")]
    public class HealthController : ControllerBase
    {
        private readonly ExpenseTrackerDbContext _db;

        public HealthController(ExpenseTrackerDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = new
            {
                api = true,
                db = false,
                time = DateTime.UtcNow
            };

            try
            {
                var canConnect = await _db.Database.CanConnectAsync();

                return Ok(new
                {
                    api = true,
                    db = canConnect,
                    status = canConnect ? "Healthy" : "Degraded",
                    time = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(503, new
                {
                    api = true,
                    db = false,
                    status = "Unhealthy",
                    error = ex.Message,
                    time = DateTime.UtcNow
                });
            }
        }
    }
}
