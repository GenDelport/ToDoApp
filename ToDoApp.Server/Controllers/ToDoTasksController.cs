using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToDoApp.Server.Models;
using ToDoApp.Server.Models.DTO;

namespace ToDoApp.Server.Controllers
{
    [ApiController]
    [Route("api/todos")]
    [Authorize]
    public class ToDoTasksController(ILogger<ToDoTasksController> logger, AppDbContext appDbContext) : ControllerBase
    {
        private readonly ILogger<ToDoTasksController> _logger = logger;
        private readonly AppDbContext _context = appDbContext;

        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            try
            {
                if (Request.Headers.ContainsKey("Authorization"))
                {
                    var authHeader = Request.Headers["Authorization"].ToString();
                    _logger.LogInformation("Authorization Header: {AuthHeader}", authHeader);
                }
                else
                {
                    _logger.LogWarning("Authorization header is missing.");
                }
                _logger.LogInformation("Attempting to retrieve ToDo tasks.");
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                var tasks = await _context.ToDoTasks
                    .Where(t => t.MemberId == userId)
                    .ToListAsync();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving the ToDo tasks.");
                throw;
            }
        }
        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] ToDoTaskDto taskDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var task = new ToDoTask
            {
                Title = taskDto.Title,
                Status = taskDto.Status,
                Created = DateTime.UtcNow,
                MemberId = userId
            };

            _context.ToDoTasks.Add(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] ToDoTaskDto taskDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var task = await _context.ToDoTasks.FirstOrDefaultAsync(t => t.Id == id && t.MemberId == userId);
            if (task == null)
            {
                return NotFound();
            }
            
            task.Status = taskDto.Status;
            task.Title = taskDto.Title;

            _context.ToDoTasks.Update(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var task = await _context.ToDoTasks.FirstOrDefaultAsync(t => t.Id == id && t.MemberId == userId);
            if (task == null)
            {
                return NotFound();
            }

            _context.ToDoTasks.Remove(task);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
