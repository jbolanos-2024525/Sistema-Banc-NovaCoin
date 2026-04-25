import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const BASE_PATH = '/NovaCoin/Admin/v1';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NovaCoin Banking API",
      version: "1.0.0",
      description: "Documentación de la API del sistema bancario NovaCoin",
    },
    servers: [
      {
        url: `http://localhost:3020${BASE_PATH}`,
        description: "Servidor local",
      },
    ],
    tags: [
      { name: "Cliente",  description: "Gestión de clientes bancarios" },
      { name: "Empleado", description: "Gestión de empleados" },
      { name: "Cuenta",   description: "Gestión de cuentas bancarias" },
      { name: "Prestamo", description: "Gestión de préstamos" },
    ],
  },
  apis: [
    "./src/Cliente/cliente.routes.js",
    "./src/Empleado/empleado.routes.js",
    "./src/Cuenta/cuenta.routes.js",
    "./src/Prestamo/prestamo.routes.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
  console.log("📄 Swagger docs disponibles en http://localhost:3020/api-docs");
};