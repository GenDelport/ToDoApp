using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Server.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ToDoApp.Server.Models.Classes;


namespace ToDoApp.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(AppDbContext context, IConfiguration configuration) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly IConfiguration _configuration = configuration;
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest("Email and password are required.");
                }

                var existingMember = await _context.Members.FirstOrDefaultAsync(m => m.Email == request.Email);
                if (existingMember != null)
                {
                    return BadRequest("Email already in use.");
                }
                byte[] saltBytes = RandomNumberGenerator.GetBytes(128 / 8);
                string salt = Convert.ToBase64String(saltBytes);
                string passwordHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: request.Password!,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

                var member = new Member
                {
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    PasswordSalt = salt
                };

                _context.Members.Add(member);
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(member);

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest("Email and password are required.");
                }

                var member = await _context.Members.FirstOrDefaultAsync(m => m.Email == request.Email);
                if (member == null)
                {
                    return Unauthorized("Invalid email or password.");
                }
                byte[] saltBytes = Convert.FromBase64String(member.PasswordSalt);
                string passwordHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: request.Password,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
                if (passwordHash != member.PasswordHash)
                {
                    return Unauthorized("Invalid email or password.");
                }
                var token = GenerateJwtToken(member);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        private string GenerateJwtToken(Member member)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] {
                new Claim(ClaimTypes.NameIdentifier, member.Id.ToString()),
                new Claim(ClaimTypes.Email, member.Email)
            }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    Issuer = _configuration["Jwt:Issuer"],
                    Audience = _configuration["Jwt:Audience"],
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}