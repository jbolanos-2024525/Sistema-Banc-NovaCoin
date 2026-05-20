using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TransService.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "transacciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TipoTransaccion = table.Column<int>(type: "integer", nullable: false),
                    CuentaOrigen = table.Column<Guid>(type: "uuid", nullable: true),
                    CuentaDestino = table.Column<Guid>(type: "uuid", nullable: true),
                    Monto = table.Column<decimal>(type: "numeric", nullable: false),
                    Moneda = table.Column<string>(type: "text", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transacciones", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "transacciones");
        }
    }
}
