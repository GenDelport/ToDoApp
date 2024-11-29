namespace ToDoApp.Server.Models
{
    public class Member
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; } // Store the hashed password
        public string? PasswordSalt { get; set; } // Store the salt used
        // Navigation property to related ToDoTasks
        public ICollection<ToDoTask>? ToDoTasks { get; set; }
    }
}
