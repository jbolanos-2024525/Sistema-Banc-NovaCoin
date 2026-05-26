export const corsOptions = {
    origin: true,
    credentials: true, // 👈 Corregido: 'c' minúscula y en plural
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // 👈 ¡Agregados PUT y DELETE!
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token'] // Agregamos 'x-token' por si usas tu middleware
};