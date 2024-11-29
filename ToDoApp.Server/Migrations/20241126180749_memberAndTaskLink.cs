using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToDoApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class memberAndTaskLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Member",
                table: "ToDoTasks");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "ToDoTasks",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "ToDoTasks",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<int>(
                name: "MemberId",
                table: "ToDoTasks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ToDoTasks_MemberId",
                table: "ToDoTasks",
                column: "MemberId");

            migrationBuilder.AddForeignKey(
                name: "FK_ToDoTasks_Members_MemberId",
                table: "ToDoTasks",
                column: "MemberId",
                principalTable: "Members",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToDoTasks_Members_MemberId",
                table: "ToDoTasks");

            migrationBuilder.DropIndex(
                name: "IX_ToDoTasks_MemberId",
                table: "ToDoTasks");

            migrationBuilder.DropColumn(
                name: "MemberId",
                table: "ToDoTasks");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "ToDoTasks",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created",
                table: "ToDoTasks",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Member",
                table: "ToDoTasks",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
