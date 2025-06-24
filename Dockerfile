# angular-app/Dockerfile

# Etapa 1: Compilación de Angular
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json y restaurar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente y compilar
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servidor web Nginx
FROM nginx:alpine
# Copiar los archivos compilados de la etapa anterior al directorio de Nginx
COPY --from=build /usr/src/app/dist/hub_peliculas/browser /usr/share/nginx/html
# (Asegúrarse de que la ruta /dist/hub_peliculas/browser sea la correcta para tu proyecto)

# Copiar una configuración personalizada de Nginx
# para que las rutas de Angular (ej. /login) funcionen al recargar la página.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80