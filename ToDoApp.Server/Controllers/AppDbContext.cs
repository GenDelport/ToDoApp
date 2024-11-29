using Microsoft.EntityFrameworkCore;
using ToDoApp.Server.Models;

namespace ToDoApp.Server.Controllers
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ToDoTask> ToDoTasks { get; set; }
        public DbSet<Member> Members { get; set; }
    }
}
