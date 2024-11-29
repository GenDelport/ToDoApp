using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToDoApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class memberEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Members",
                newName: "Password");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Members",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Members");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Members",
                newName: "Name");
        }
    }
}
