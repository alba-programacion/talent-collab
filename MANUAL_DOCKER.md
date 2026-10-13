# Manual: despliegue con Docker Compose (backend + frontend + MongoDB local)

Levanta todo el sistema con un comando. Funciona con Docker (tu PC) y con Podman (servidor de AMIB).

## 1. Qué incluye

| Archivo | Para qué |
|---|---|
| `docker-compose.yml` | Define tres servicios: `mongo`, `backend`, `frontend` |
| `backend/Dockerfile` | Imagen del API (Node 20, puerto 5000) |
| `frontend/Dockerfile` | Compila con Node y sirve `dist` con Nginx |
| `frontend/nginx.conf` | Regla SPA (`try_files ... /index.html`) |
| `.env.example` | Plantilla de variables |

```
Nginx del host (HTTPS) ──► 127.0.0.1:8080  frontend (Nginx en contenedor)
                       └─► 127.0.0.1:5000  backend (Express)
                                              └─► mongo (red interna, sin puerto público)
```

- MongoDB **no** publica puertos. Solo el backend puede hablarle.
- Backend y frontend publican solo en `127.0.0.1`, de modo que lo único público es el Nginx del host (ver [MANUAL_SERVIDOR_NGINX.md](MANUAL_SERVIDOR_NGINX.md) secciones 9 y 10).

## 2. Variables

```bash
cp .env.example .env
```

| Variable | Qué es |
|---|---|
| `MONGO_USER`, `MONGO_PASSWORD` | Usuario administrador de MongoDB. Usa una clave larga |
| `CLIENT_URL` | URL pública del front. Va en los links de correos |
| `VITE_API_URL` | URL pública del back. Se **incrusta al compilar** el front |
| `BREVO_API_KEY`, `BREVO_FROM_EMAIL`, `BREVO_FROM_NAME` | Correo |

Si la contraseña de Mongo tiene caracteres especiales (`@`, `:`, `/`), codifícalos o evítalos, porque van dentro de la URL de conexión.

## 3. Probar en tu PC (Docker Desktop)

```bash
# En .env para pruebas locales:
#   CLIENT_URL=http://localhost:8080
#   VITE_API_URL=http://localhost:5000
docker compose up -d --build
docker compose ps
docker compose logs -f backend
```

- Front: http://localhost:8080
- Back: http://localhost:5000/

## 4. Servidor de AMIB (Podman)

```bash
ssh contenedores@10.10.10.13
cd dev/intercambio
git pull origin main
cp .env.example .env && nano .env      # solo la primera vez
podman compose up -d --build           # o: podman-compose up -d --build
podman ps
```

Después, configurar Nginx del host y HTTPS como en [MANUAL_SERVIDOR_NGINX.md](MANUAL_SERVIDOR_NGINX.md). En ese manual, el punto de entrada ahora es `127.0.0.1:8080` (front) y `127.0.0.1:5000` (back) y **no** hay que usar `pm2`.

> Con Podman rootless, para que los contenedores arranquen tras reiniciar el servidor hace falta `loginctl enable-linger <usuario>` o un servicio systemd. Pídeselo a TI si no pueden.

> **Puertos en el servidor de AMIB:** el 8080 ya lo usa otro contenedor, por eso el front se publica en `127.0.0.1:8081`. El Nginx del host debe apuntar a 8081. Antes de cambiar puertos, revisa con `ss -tlnp`.
>
> **Versión de compose:** el servidor trae `docker-compose 1.23.2`, que exige `version: "3.7"` en el archivo. Ya está incluido.

## 5. Actualizar después de cambios

```bash
git pull origin main
docker compose up -d --build           # reconstruye lo que cambió
```

Si cambia `VITE_API_URL`, el front se reconstruye con `--build` porque el valor se incrusta al compilar.

## 6. Migrar los datos de Atlas a Mongo local

Solo si ya hay datos en Atlas que quieres conservar:

```bash
# 1. Exportar desde Atlas (en una máquina con mongodump instalado)
mongodump --uri="mongodb+srv://USUARIO:CLAVE@cluster.mongodb.net/talent-collab" --out=./dump

# 2. Copiar ./dump al servidor y restaurarlo en el contenedor
docker compose cp ./dump mongo:/dump
docker compose exec mongo mongorestore \
  --username "$MONGO_USER" --password "$MONGO_PASSWORD" --authenticationDatabase admin \
  --db talent-collab /dump/talent-collab
```

Si la base nueva está vacía, el backend carga las instituciones iniciales al arrancar.

## 7. Respaldos (obligatorio con Mongo local)

Ya no hay respaldos automáticos de Atlas. Programa uno diario:

```bash
docker compose exec -T mongo mongodump \
  --username "$MONGO_USER" --password "$MONGO_PASSWORD" --authenticationDatabase admin \
  --archive --gzip > backup-$(date +%F).gz
```

Pásalo a un cron del servidor y copia los archivos fuera de esa máquina. Respalda también el volumen `uploads_data`.

Restaurar:

```bash
docker compose exec -T mongo mongorestore \
  --username "$MONGO_USER" --password "$MONGO_PASSWORD" --authenticationDatabase admin \
  --archive --gzip < backup-2026-10-13.gz
```

## 8. Comandos útiles

```bash
docker compose ps                      # estado
docker compose logs -f backend         # logs en vivo
docker compose restart backend         # reiniciar un servicio
docker compose down                    # apagar (conserva volúmenes)
docker compose down -v                 # apagar y BORRAR datos (¡cuidado!)
docker compose exec mongo mongosh -u "$MONGO_USER" -p "$MONGO_PASSWORD" --authenticationDatabase admin
```

## 9. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Backend: `MongoServerError: Authentication failed` | Usuario o clave distintos a los usados al crear el volumen | Mongo solo toma `MONGO_USER`/`MONGO_PASSWORD` la **primera vez**. Si cambias la clave hay que borrar el volumen `mongo_data` o cambiarla desde mongosh |
| El front llama a la URL equivocada | `VITE_API_URL` cambió sin reconstruir | `docker compose up -d --build frontend` |
| 404 al recargar una ruta | Falta la regla SPA | Revisar `frontend/nginx.conf` |
| Se pierden los archivos subidos | No se usó el volumen | Verificar `uploads_data` en `docker compose config` |
| Puerto ya en uso | 5000 u 8080 ocupados | Cambiar el puerto del host en `docker-compose.yml` (la parte izquierda) |
| No llegan correos | Brevo sin llave o remitente sin verificar | `docker compose logs backend` |

## 10. Antes de abrirlo a internet

Sigue vigente la sección 13 de [MANUAL_SERVIDOR_NGINX.md](MANUAL_SERVIDOR_NGINX.md): autorización por headers del cliente (reemplazar por JWT), CORS abierto y falta de límite en el login.
