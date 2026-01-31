using BCrypt.Net;
using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.Dtos.Auth;
using ExpenseTracker.Api.Models;
using ExpenseTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly ExpenseTrackerDbContext _db;
    private readonly JwtService _jwt;

    public AuthController(ExpenseTrackerDbContext db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest req)
    {
        var email = req.Email.Trim().ToLower();

        var exists = await _db.Users.AnyAsync(u => u.Email.ToLower() == email);
        if (exists) return BadRequest("Email already in use.");

        var user = new User
        {
            Name = req.Name.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _jwt.CreateToken(user);
        return Ok(new AuthResponse(user.Id, user.Name, user.Email, token));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
    {
        var email = req.Email.Trim().ToLower();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);
        if (user == null) return Unauthorized("Invalid credentials.");

        var ok = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
        if (!ok) return Unauthorized("Invalid credentials.");

        var token = _jwt.CreateToken(user);
        return Ok(new AuthResponse(user.Id, user.Name, user.Email, token));
    }
}
