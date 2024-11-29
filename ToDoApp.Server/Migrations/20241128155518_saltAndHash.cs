using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToDoApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class saltAndHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Members",
                newName: "PasswordSalt");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Members",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Members");

            migrationBuilder.RenameColumn(
                name: "PasswordSalt",
                table: "Members",
                newName: "Password");
        }
    }
}
