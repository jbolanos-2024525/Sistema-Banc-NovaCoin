using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

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
                    id_transaccion = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tipo_transaccion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    monto = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    numero_referencia = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    descripcion = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    fecha_transaccion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    id_cuenta = table.Column<int>(type: "integer", nullable: false),
                    id_empleado = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_transacciones", x => x.id_transaccion);
                });

            migrationBuilder.CreateIndex(
                name: "ix_transacciones_id_cuenta",
                table: "transacciones",
                column: "id_cuenta");

            migrationBuilder.CreateIndex(
                name: "ix_transacciones_id_empleado",
                table: "transacciones",
                column: "id_empleado");

            migrationBuilder.CreateIndex(
                name: "ix_transacciones_numero_referencia",
                table: "transacciones",
                column: "numero_referencia",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "transacciones");
        }
    }
}
