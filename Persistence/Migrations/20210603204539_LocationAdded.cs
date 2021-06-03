using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class LocationAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Tournaments");

            migrationBuilder.AddColumn<Guid>(
                name: "LocationId",
                table: "Tournaments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FormatedLocation = table.Column<string>(type: "text", nullable: true),
                    LocationString = table.Column<string>(type: "text", nullable: true),
                    Lat = table.Column<double>(type: "double precision", nullable: false),
                    Lng = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tournaments_LocationId",
                table: "Tournaments",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tournaments_Location_LocationId",
                table: "Tournaments",
                column: "LocationId",
                principalTable: "Location",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tournaments_Location_LocationId",
                table: "Tournaments");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropIndex(
                name: "IX_Tournaments_LocationId",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Tournaments");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Tournaments",
                type: "text",
                nullable: true);
        }
    }
}
