FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código (excluyendo node_modules)
COPY . .

# Exponer puerto
EXPOSE 3020

# Comando de inicio
CMD ["node", "index.js"]
