# Andiamo en contenedor: se construye la web y la sirve nginx. Valen las imágenes de arm64 (Raspberry Pi 5) y de amd64.
# Construir:  docker build -t andiamo .

# ---- Construcción ----
# Node 24 porque scripts/generar-offline.mjs importa archivos .ts directamente.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Servidor ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
