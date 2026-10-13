# Manual: despliegue público en servidor propio (Podman + pm2 + Nginx)

Guía paso a paso para publicar el **Sistema de Intercambio AMIB** (backend Express + frontend React/Vite) en el servidor de AMIB, con acceso desde internet, HTTPS y Nginx como proxy inverso.

> Este manual asume el servidor `10.10.10.13`, usuario `contenedores`, y contenedores Podman con pm2 adentro, como en los demás proyectos de AMIB. Cambia los nombres de dominio de los ejemplos por los reales.

---

## 1. Arquitectura final

```
                     Internet
                        │  HTTPS 443
                        ▼
              ┌───────────────────┐
              │ Firewall / router │  (TI: abre 80 y 443 hacia el servidor)
              └─────────┬─────────┘
                        ▼
              ┌───────────────────┐
              │ Nginx (en el host)│  Termina HTTPS (certbot)
              └───┬───────────┬───┘
   intercambio.   │           │   api-intercambio.
   amib.com.mx    ▼           ▼   amib.com.mx
        127.0.0.1:8080   127.0.0.1:5000
        ┌──────────────┐ ┌──────────────┐
        │ Contenedor   │ │ Contenedor   │   Podman
        │ pm2 serve    │ │ pm2 server.js│   (puertos publicados al host)
        │ frontend dist│ │ backend      │
        └──────────────┘ └──────┬───────┘
                                │
                                ├──► MongoDB Atlas (o MongoDB local)
                                └──► Brevo (correo)
```

- El navegador carga el front desde `https://intercambio.amib.com.mx`.
- El front llama al back en `https://api-intercambio.amib.com.mx` (valor de `VITE_API_URL`).
- Nginx es lo único expuesto a internet. Los contenedores solo escuchan en `127.0.0.1` del host.

---

## 2. Qué debe resolver TI antes de empezar

| # | Requisito | Detalle |
|---|---|---|
| 1 | **Dos nombres de dominio** | Uno para el front y otro para el back, con registro DNS tipo A hacia la **IP pública** de AMIB |
| 2 | **Puertos 80 y 443** | Abiertos en el firewall/router y redirigidos al servidor donde corre Nginx |
| 3 | **Salida a internet del servidor** | Para MongoDB Atlas, Brevo, `git pull` y `certbot` |
| 4 | **Nginx en el host** | Si ya existe, solo se le agregan sitios. Si no, instalarlo (sección 4) |

Comprobaciones rápidas desde tu PC una vez que TI termine:

```bash
nslookup intercambio.amib.com.mx          # debe devolver la IP pública
curl -I http://intercambio.amib.com.mx    # debe responder (aunque sea 404 de nginx)
```

---

## 3. Preparar el servidor

Entra al servidor y revisa el estado actual:

```bash
ssh contenedores@10.10.10.13
podman ps -a                      # contenedores existentes
ss -tlnp | grep -E ':80|:443|:5000|:8080'   # puertos ocupados
which nginx; nginx -v             # ¿hay nginx?
```

Si `5000` u `8080` ya están ocupados, elige otros puertos libres y úsalos en todo el manual.

---

## 4. Instalar Nginx (si no existe)

Requiere permisos de administrador (`sudo`). Pide a TI que lo haga si tu usuario no los tiene.

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx

# RHEL/Rocky/Alma
sudo dnf install -y nginx certbot python3-certbot-nginx

sudo systemctl enable --now nginx
sudo systemctl status nginx
```

Si el servidor tiene firewall local:

```bash
sudo ufw allow 'Nginx Full'                       # Ubuntu
# o:
sudo firewall-cmd --permanent --add-service=http --add-service=https && sudo firewall-cmd --reload
```

---

## 5. Contenedores

El backend y el frontend pueden ir en **un mismo contenedor** (más simple) o en dos. Aquí se usa uno solo, llamado `intercambio`, con dos puertos publicados.

> Los puertos de Podman se definen al **crear** el contenedor. Si el contenedor ya existe sin ellos, hay que recrearlo.

```bash
podman run -d --name intercambio \
  -p 127.0.0.1:5000:5000 \
  -p 127.0.0.1:8080:8080 \
  -v /home/contenedores/intercambio-uploads:/app/dev/intercambio/backend/uploads:Z \
  docker.io/library/node:20 sleep infinity
```

- `127.0.0.1:` delante del puerto hace que solo Nginx (en el mismo host) pueda llegar. Nadie desde fuera puede saltarse el proxy.
- El volumen guarda `uploads/` fuera del contenedor, para que los archivos subidos sobrevivan a un recreado.
- Si ya tienes una imagen base con pm2 que uses en otros proyectos, úsala en lugar de `node:20` y evita instalar pm2 a mano.

Entrar al contenedor y preparar pm2:

```bash
podman exec -ti intercambio bash
node -v                    # v20.x
npm install -g pm2         # solo si la imagen no lo trae
```

---

## 6. Obtener el código

Dentro del contenedor:

```bash
mkdir -p /app/dev && cd /app/dev
git clone https://github.com/alba-programacion/talent-collab.git intercambio
cd intercambio
git branch                 # debe estar en main
```

Para siguientes actualizaciones: `git pull origin main`. Si el repo pide usuario y contraseña, usa un **token de acceso personal** de GitHub como contraseña.

---

## 7. Backend

### 7.1 Instalar dependencias

```bash
cd /app/dev/intercambio/backend
npm install --omit=dev
```

### 7.2 Variables de entorno

Crea `backend/.env`:

```env
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@cluster.mongodb.net/talent-collab
PORT=5000
CLIENT_URL=https://intercambio.amib.com.mx
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=correo-verificado@amib.com.mx
BREVO_FROM_NAME=Sistema de Intercambio-AMIB
```

- `CLIENT_URL` debe llevar `https://` y **sin** `/` al final. Se usa para los links de correos.
- Protege el archivo: `chmod 600 .env`. Nunca lo subas a git.
- En MongoDB Atlas, permite la **IP pública** del servidor en Network Access.

### 7.3 Arrancar con pm2

```bash
cd /app/dev/intercambio/backend
pm2 start server.js --name intercambio-back
pm2 list
pm2 logs intercambio-back --lines 30
curl http://localhost:5000/
```

Debe aparecer en logs: `Backend de Colaboración de Talento (MVP) corriendo en ...`.

### 7.4 Que sobreviva a reinicios

```bash
pm2 save
pm2 startup        # ejecuta el comando que te imprima
```

Si el contenedor se reinicia, al volver a iniciarlo (`podman start intercambio`) pm2 relanza los procesos guardados con `pm2 resurrect`.

---

## 8. Frontend

### 8.1 Variable de entorno

La dirección del back se **incrusta al compilar**. Debe ser la URL pública, con HTTPS:

```bash
cd /app/dev/intercambio/frontend
echo "VITE_API_URL=https://api-intercambio.amib.com.mx" > .env
```

> Si en `frontend/.env` del repo ya hay otra URL (la de Render), esto la sustituye en el servidor. Cuida no subir ese cambio a git.

### 8.2 Compilar

```bash
npm install
npm run build          # genera frontend/dist
```

### 8.3 Servirlo con pm2

```bash
pm2 serve /app/dev/intercambio/frontend/dist 8080 --spa --name intercambio-front
pm2 save
curl -I http://localhost:8080/
```

`--spa` hace que cualquier ruta (`/vacantes`, `/login`...) devuelva `index.html`, que es lo mismo que hace `vercel.json`.

---

## 9. Nginx: configuración de los dos sitios

Fuera del contenedor, en el host. Un archivo por sitio.

### 9.1 Frontend

`/etc/nginx/conf.d/intercambio-front.conf`

```nginx
server {
    listen 80;
    server_name intercambio.amib.com.mx;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 9.2 Backend

`/etc/nginx/conf.d/intercambio-back.conf`

```nginx
server {
    listen 80;
    server_name api-intercambio.amib.com.mx;

    client_max_body_size 20m;      # subida de CVs y logos

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

> En algunos sistemas los archivos van en `/etc/nginx/sites-available/` y se enlazan a `sites-enabled/`. Usa la carpeta que ya usen los otros proyectos.

### 9.3 Validar y recargar

```bash
sudo nginx -t              # debe decir "syntax is ok"
sudo systemctl reload nginx
```

---

## 10. HTTPS con Let's Encrypt

```bash
sudo certbot --nginx \
  -d intercambio.amib.com.mx \
  -d api-intercambio.amib.com.mx
```

- Certbot modifica los `server` de Nginx, agrega el bloque 443 y la redirección de HTTP a HTTPS.
- Elige la opción de **redirigir** todo el tráfico a HTTPS.
- Renovación automática: `sudo certbot renew --dry-run` para comprobar que funciona.

Verifica:

```bash
curl -I https://intercambio.amib.com.mx
curl https://api-intercambio.amib.com.mx/
```

---

## 11. Verificación final

| Prueba | Resultado esperado |
|---|---|
| `https://intercambio.amib.com.mx` | Carga la pantalla de login con candado |
| Recargar `https://intercambio.amib.com.mx/vacantes` | No da 404 |
| F12 → Network al hacer login | Peticiones a `https://api-intercambio.amib.com.mx/api/...` con 200 |
| Registrar un usuario | Llega el correo, y el link abre el front público |
| Subir un CV o logo | Se guarda y se vuelve a ver al recargar |
| `pm2 list` | `intercambio-back` y `intercambio-front` en `online` |

---

## 12. Actualizar después de cambios

```bash
ssh contenedores@10.10.10.13
podman exec -ti intercambio bash
cd /app/dev/intercambio
git pull origin main

# si cambió el backend
cd backend && npm install --omit=dev && pm2 restart intercambio-back

# si cambió el frontend
cd ../frontend && npm install && npm run build && pm2 restart intercambio-front
```

Respaldo previo recomendado de la configuración: `cp backend/.env ~/env-backup`.

---

## 13. Seguridad: obligatorio antes de abrirlo a internet

El proyecto, tal como está, **confía en headers que manda el cliente**. Con acceso público esto es un riesgo real.

| Riesgo | Hoy | Qué hacer |
|---|---|---|
| Autorización | `X-Requester-Role` y `X-Requester-Institution-Id` los envía el navegador. Cualquiera puede escribir `admin` | Emitir un **JWT** al hacer login y validarlo en cada ruta protegida |
| CORS abierto | `app.use(cors())` acepta cualquier origen | Restringir a `https://intercambio.amib.com.mx` |
| Archivos | `/uploads/:filename` es público | Evaluar proteger CVs con autenticación |
| Fuerza bruta | Sin límite en `/api/auth/login` | Agregar rate limiting (`express-rate-limit`) |
| Secretos | `frontend/.env` está versionado | Mantener ahí solo la URL pública, nunca llaves |
| Respaldos | Datos en Atlas M0 | Programar exportaciones periódicas |
| Parches | Los gestiona AMIB | Mantener Node, Nginx y el sistema actualizados |

Cambio mínimo de CORS en `backend/server.js`:

```js
app.use(cors({ origin: 'https://intercambio.amib.com.mx' }));
```

Mientras la autorización por headers siga vigente, **no se recomienda** publicar el sistema con datos reales.

---

## 14. Problemas frecuentes

| Síntoma | Causa probable | Qué revisar |
|---|---|---|
| El dominio no abre | DNS o firewall | `nslookup`, puertos 80/443 abiertos |
| `502 Bad Gateway` | El proceso no corre o el puerto no está publicado | `pm2 list` dentro del contenedor, `podman ps` (columna PORTS), `curl localhost:5000` |
| `413 Request Entity Too Large` | Falta `client_max_body_size` | Sección 9.2, luego `nginx -t` y reload |
| Login falla con error CORS en consola | Origen no permitido o URL del API mal | `VITE_API_URL`, y CORS en el back |
| Mixed content / peticiones bloqueadas | Front en HTTPS y API en `http://` | `VITE_API_URL` con `https://` y recompilar |
| El front sigue llamando a la URL vieja | No se recompiló tras cambiar `VITE_API_URL` | `npm run build` y `pm2 restart intercambio-front` |
| 404 al recargar una ruta | Falta `--spa` | Reiniciar con `pm2 serve ... --spa` |
| No llegan correos | `BREVO_API_KEY` o remitente sin verificar | `pm2 logs intercambio-back` |
| Links de correo con `localhost` | `CLIENT_URL` sin definir | `backend/.env` y `pm2 restart` |
| No conecta a la base de datos | IP del servidor no permitida en Atlas | Network Access en Atlas |
| Tras reiniciar el contenedor no hay procesos | Faltó `pm2 save` | `pm2 resurrect` y luego `pm2 save` |

Logs útiles:

```bash
pm2 logs intercambio-back          # dentro del contenedor
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 15. Resumen de comandos

```bash
# Acceso
ssh contenedores@10.10.10.13
podman ps
podman exec -ti intercambio bash

# Contenedor
podman stop intercambio
podman start intercambio

# Procesos
pm2 list
pm2 restart intercambio-back
pm2 restart intercambio-front
pm2 logs intercambio-back
pm2 save

# Código
cd /app/dev/intercambio && git pull origin main
cd frontend && npm run build

# Nginx (en el host)
sudo nginx -t
sudo systemctl reload nginx
sudo certbot renew --dry-run
```
