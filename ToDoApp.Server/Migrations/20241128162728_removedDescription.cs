using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToDoApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class removedDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "ToDoTasks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ToDoTasks",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
