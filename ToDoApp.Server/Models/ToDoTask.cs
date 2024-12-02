namespace ToDoApp.Server.Models
{
    public class ToDoTask
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Status { get; set; }
        public DateTime? Created { get; set; }

        // Foreign key to Member
        public int? MemberId { get; set; }
        public Member? Member { get; set; }  // Navigation property to Member
    }
    //public enum TaskStatus
    //{
    //    Pending = 1,
    //    Completed = 2
    //}
}
