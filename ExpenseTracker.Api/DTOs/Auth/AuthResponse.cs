namespace ExpenseTracker.Api.Dtos.Auth;

public record AuthResponse(int UserId, string Name, string Email, string Token);
