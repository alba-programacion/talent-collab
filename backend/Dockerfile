# Usar una imagen oficial y ligera de Node.js (versión 20)
FROM node:20-alpine

# Establecer la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo el package.json primero (esto optimiza la creación de la imagen)
COPY package*.json ./

# Instalar dependencias (¡Esto ocurrirá en tu laptop que sí tiene internet!)
RUN npm install --production

# Copiar el resto del código del backend al contenedor
COPY . .

# Exponer el puerto que usará el servidor
EXPOSE 5000

# Comando para arrancar el servidor
CMD ["node", "server.js"]
