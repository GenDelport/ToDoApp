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
                // Validate input
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest("Email and password are required.");
                }

                // Check if the email already exists
                var existingMember = await _context.Members.FirstOrDefaultAsync(m => m.Email == request.Email);
                if (existingMember != null)
                {
                    return BadRequest("Email already in use.");
                }
                byte[] saltBytes = RandomNumberGenerator.GetBytes(128 / 8); // 16 bytes
                string salt = Convert.ToBase64String(saltBytes);
                string passwordHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: request.Password!,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

                // Create new member
                var member = new Member
                {
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    PasswordSalt = salt
                };

                // Save to database
                _context.Members.Add(member);
                await _context.SaveChangesAsync();

                // Generate JWT token
                var token = GenerateJwtToken(member);

                // Return token
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
            // Validate input
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and password are required.");
            }

            // Find the user
            var member = await _context.Members.FirstOrDefaultAsync(m => m.Email == request.Email);
            if (member == null)
            {
                return Unauthorized("Invalid email or password.");
            }
            // Retrieve the stored salt
            byte[] saltBytes = Convert.FromBase64String(member.PasswordSalt);
            string passwordHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: request.Password,
            salt: saltBytes,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8)); // 32 bytes
            if (passwordHash != member.PasswordHash)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Generate JWT token
            var token = GenerateJwtToken(member);

            // Return token
            return Ok(new { token });
        }
        private string GenerateJwtToken(Member member)
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

    }
}