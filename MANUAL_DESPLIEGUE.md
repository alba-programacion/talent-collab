# Manual de instalación y despliegue — Sistema de Intercambio AMIB

Guía para instalar el proyecto en local y entender cómo se despliega: **Vercel** (frontend), **Render** (backend), **MongoDB Atlas** (base de datos) y **Brevo** (correo).

---

## 1. Cómo encajan las piezas

```
                    ┌────────────────────┐
  Usuario ────────► │ Vercel             │  Sirve el frontend (archivos estáticos)
  (navegador)       │ React + Vite       │
                    └────────────────────┘
        │
        │ El navegador hace fetch(VITE_API_URL + "/api/...")
        ▼
                    ┌────────────────────┐        ┌───────────────────┐
                    │ Render             │ ─────► │ MongoDB Atlas     │
                    │ Express (Node)     │        │ (base de datos)   │
                    └────────────────────┘        └───────────────────┘
                              │
                              └──────────────────► Brevo (envío de correos)
```

Puntos clave:

- **Vercel y Render no se hablan entre sí.** El frontend se descarga en el navegador del usuario y es el navegador quien llama al backend.
- La dirección del backend vive en una variable del frontend: `VITE_API_URL`.
- La dirección del frontend vive en una variable del backend: `CLIENT_URL`. Se usa solo para armar los links de los correos.
- El backend acepta peticiones de cualquier dominio (`app.use(cors())` en `backend/server.js`).

---

## 2. Qué instalar

| Herramienta | Versión | Para qué |
|---|---|---|
| Node.js | **20 LTS** recomendado (el Dockerfile usa 20; en local hay 22) | Ejecutar front y back |
| npm | el que trae Node | Instalar dependencias |
| Git | cualquiera reciente | Control de versiones y despliegue |
| MongoDB | Atlas (nube) o MongoDB Community local | Base de datos |
| Docker (opcional) | cualquiera | Solo si quieres correr el back en contenedor |

Cuentas necesarias: GitHub, Vercel, Render, MongoDB Atlas, Brevo.

> Pendiente recomendado: fijar la versión de Node con `"engines": { "node": "20.x" }` en los `package.json` (o un `.nvmrc`) para que local, Vercel y Render usen la misma.

---

## 3. Estructura del repositorio

```
talent-collab/
├── frontend/          React 19 + Vite 8 + Tailwind 4
│   ├── src/config.js  Define API_URL
│   ├── .env           VITE_API_URL
│   └── vercel.json    Reescritura de rutas para la SPA
├── backend/           Express 5 + Mongoose 8
│   ├── server.js      Todas las rutas de la API
│   ├── models/        Esquemas de MongoDB
│   ├── utils/mailer.js
│   ├── scripts/       Seeds y limpieza de BD
│   └── Dockerfile
└── package.json       Workspace raíz (build del frontend)
```

---

## 4. Variables de entorno

### 4.1 Frontend

| Variable | Valor | Dónde se declara |
|---|---|---|
| `VITE_API_URL` | URL pública del backend, por ejemplo `https://intercambio-back.onrender.com` (sin `/` final) | Local: `frontend/.env`. Vercel: Settings → Environment Variables |

- Si no existe, el código usa `http://localhost:5000` (`frontend/src/config.js`).
- Vite **incrusta** el valor al compilar. Si cambias la URL del backend, hay que **volver a desplegar** el frontend.
- Toda variable del frontend debe empezar con `VITE_`.
- No pongas secretos aquí: el frontend es público.

### 4.2 Backend

| Variable | Obligatoria | Para qué |
|---|---|---|
| `MONGODB_URI` | Sí | Cadena de conexión a MongoDB Atlas. Sin ella usa `mongodb://127.0.0.1:27017/talent-collab` |
| `PORT` | No | Puerto. Render lo asigna solo. Por defecto 5000 |
| `CLIENT_URL` | Sí | URL del frontend en Vercel, para los links de los correos (verificar cuenta, restablecer contraseña). Por defecto `http://localhost:5173` |
| `BREVO_API_KEY` | Sí, para enviar correo | Llave de la API de Brevo |
| `BREVO_FROM_EMAIL` | Recomendada | Correo remitente (debe estar verificado en Brevo) |
| `BREVO_FROM_NAME` | No | Nombre del remitente. Por defecto "Sistema de Intercambio-AMIB" |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS` | Opcionales | Alternativa por SMTP con Nodemailer |

Dónde se declaran:

- **Local:** archivo `backend/.env` (ignorado por git).
- **Render:** servicio → **Environment**.

Ejemplo de `backend/.env` local:

```env
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@cluster.mongodb.net/talent-collab
PORT=5000
CLIENT_URL=http://localhost:5173
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=correo-verificado@tudominio.com
BREVO_FROM_NAME=Sistema de Intercambio-AMIB
```

---

## 5. Correr el proyecto en local

### Backend

```bash
cd backend
npm install
# crear backend/.env (ver sección 4.2)
node server.js          # http://localhost:5000
```

Al arrancar debe verse: `Backend de Colaboración de Talento (MVP) corriendo en http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

Si no defines `VITE_API_URL`, el frontend apunta a `http://localhost:5000`. Para probar contra el backend de producción, ponlo en `frontend/.env`.

### Otros comandos del frontend

```bash
npm run build           # genera frontend/dist
npm run preview         # sirve el build localmente
npm run lint            # ESLint
```

### Backend con Docker (opcional)

```bash
cd backend
docker build -t amib-backend .
docker run -p 5000:5000 --env-file .env amib-backend
```

### Scripts de base de datos (backend/scripts)

```bash
node scripts/seed_directory.js    # carga el directorio de contactos
node scripts/seed_contacts.js
node scripts/reset_db.js          # DESTRUCTIVO: reinicia la BD
node scripts/clean_db.js          # DESTRUCTIVO
```

> Los scripts de limpieza borran datos. Verifica a qué `MONGODB_URI` apuntas antes de ejecutarlos.

---

## 6. MongoDB Atlas

1. Crea un cluster (el plan gratuito M0 alcanza).
2. **Database Access:** crea un usuario y contraseña de base de datos.
3. **Network Access:** agrega la IP desde la que se conecta el backend. Render usa IPs variables, así que normalmente se permite `0.0.0.0/0`. Eso es menos seguro y se compensa con una contraseña fuerte.
4. **Connect → Drivers:** copia la cadena `mongodb+srv://...` y úsala como `MONGODB_URI`.
5. Si la contraseña tiene caracteres especiales (`@`, `:`, `/`), codifícalos en la URL.

Colecciones principales: User, Institution, Vacancy, CV, Task, Fine, Notification, Event, Contact.

---

## 7. Backend en Render

### Por qué Render
- Un backend Express necesita un **proceso Node siempre disponible**. Vercel está pensado para sitios estáticos y funciones cortas, y no encaja bien con un servidor Express de este tamaño.
- Render ejecuta el servidor tal cual (`node server.js`), da una URL pública con HTTPS y se conecta a GitHub para redesplegar.

### Cómo funciona el proyecto dentro de Render
- Render clona el repo `intercambio-back` (la carpeta `backend/` aislada, de modo que `package.json` queda en la raíz).
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- Inyecta `PORT` y las variables de entorno, y expone el servicio en `https://<servicio>.onrender.com`.
- Un cambio en el repo conectado dispara un nuevo deploy si **Auto-Deploy** está activo (Settings → Build & Deploy). Si no, se pulsa **Manual Deploy**.

### Configuración paso a paso
1. Render → **New → Web Service** → conecta el repo `alba-programacion/intercambio-back`, rama `main`.
2. Runtime **Node**, Build `npm install`, Start `node server.js`.
3. En **Environment**, agrega las variables de la sección 4.2.
4. Despliega. Prueba abriendo la URL: la ruta `/` debe responder.

### Cómo se publican los cambios del backend
El backend vive dentro del monorepo, pero Render lee un repo aparte. Por eso se corta la carpeta `backend/` y se empuja:

```bash
# 1. subir el monorepo normal
git push origin main

# 2. separar la carpeta backend en una rama propia
git subtree split --prefix=backend -b temp-backend-split

# 3. empujarla al repo que vigila Render
git push backend-render temp-backend-split:main --force
```

Con el paso 3 Render detecta el cambio y redespliega (si Auto-Deploy está activo).

> Un `git push origin main` solo **no** actualiza Render.

### Cosas a saber de Render
- **Plan gratuito:** el servicio se duerme tras inactividad y la primera petición tarda en responder.
- **Disco efímero:** la carpeta `uploads/` se borra al reiniciar. Por eso los archivos también se guardan en Base64 en MongoDB, y `/uploads/:filename` los recupera de ahí.
- **Logs:** pestaña **Logs** del servicio. Es el primer lugar donde mirar si algo falla.

---

## 8. Frontend en Vercel

### Por qué Vercel
El frontend compila a archivos estáticos (HTML, JS, CSS). Vercel los sirve desde una CDN, con HTTPS y deploys automáticos por cada push.

### Cómo funciona
- Vercel clona el repo, ejecuta `npm run build` y publica la carpeta resultante.
- Es una SPA: todas las rutas (`/vacantes`, `/login`...) deben devolver `index.html`. Eso lo hace `frontend/vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Sin ese archivo, al recargar una ruta interna aparece un 404.

### Configuración paso a paso
1. Vercel → **Add New → Project** → importa el repo de GitHub.
2. **Root Directory:** `frontend`.
3. **Framework Preset:** Vite.
4. **Build Command:** `npm run build`. **Output Directory:** `dist`.
5. **Environment Variables:** `VITE_API_URL` = URL del backend en Render.
6. **Deploy.**

### Dónde ver cada cosa en Vercel
Entra al proyecto (no a Team Settings) → **Settings**:

| Sección | Qué ves |
|---|---|
| Environment Variables | `VITE_API_URL` |
| Git | Repo y rama conectados |
| General | Root Directory, Node.js Version |
| Deployments (pestaña superior) | Historial y logs de build |

### Despliegue
Cada `git push` a la rama conectada genera un deploy automático. Para forzar uno: **Deployments → ⋯ → Redeploy**. Si cambiaste una variable de entorno, haz Redeploy, porque Vite la incrusta al compilar.

---

## 9. Alternativa: Hostinger

El documento de arquitectura describe también un despliegue del frontend en Hostinger:

- Build raíz: `npm run build --prefix frontend && npx shx cp -r frontend/dist ./dist`
- `frontend/.htaccess` hace la misma reescritura a `index.html` que `vercel.json`.

Conviene dejar **un solo host oficial** para el frontend y anotar cuál es.

---

## 10. Flujo de trabajo del día a día

| Cambio | Qué hacer |
|---|---|
| Solo frontend | `git add`, `git commit`, `git push origin main`. Vercel despliega solo |
| Solo backend | Push a `origin` y además el `subtree split` + push a `backend-render` (sección 7) |
| Ambos | Las dos cosas |
| Cambió la URL del backend | Actualizar `VITE_API_URL` y redesplegar el frontend |
| Cambió la URL del frontend | Actualizar `CLIENT_URL` en Render |

---

## 11. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| 404 al recargar una página | Falta la reescritura SPA | Verificar `vercel.json` y Root Directory = `frontend` |
| El frontend no carga datos | `VITE_API_URL` incorrecta o sin redeploy | Revisarla en Vercel, redesplegar, y mirar F12 → Network |
| Primera petición muy lenta | Render gratuito dormido | Esperar, o usar un plan de pago |
| Cambié el backend y no se ve | Falta el push a `backend-render` | Ejecutar el subtree split y push |
| El backend no conecta a la BD | IP no permitida en Atlas o `MONGODB_URI` mal | Revisar Network Access y la cadena |
| No llegan correos | `BREVO_API_KEY` ausente o remitente no verificado | Revisar variables y el remitente en Brevo |
| Links de correo apuntan a localhost | `CLIENT_URL` sin definir en Render | Definirla con la URL del frontend |
| Archivos subidos desaparecen | Disco efímero de Render | Usar la copia Base64 (ya implementada) o almacenamiento externo |

---

## 12. Seguridad y recomendaciones

- La autorización actual usa los headers `X-Requester-Institution-Id` y `X-Requester-Role`, enviados por el cliente. Son fáciles de falsificar. A futuro conviene validar identidad en el servidor (JWT).
- `frontend/.env` está versionado. Ahora solo contiene una URL pública. No agregues secretos ahí.
- Nunca subas `backend/.env`. Está en `.gitignore`.
- `app.use(cors())` está abierto a cualquier origen. Se puede restringir al dominio del frontend.
- Antes de ejecutar scripts de `backend/scripts/`, confirma qué base de datos usa tu `MONGODB_URI`.

---

## 13. Despliegue en servidor propio de AMIB (Podman + pm2)

Alternativa a Vercel y Render. Se usa el servidor interno, donde cada proyecto corre dentro de un contenedor Podman y se mantiene vivo con pm2.

### 13.1 Qué se necesita para que sea público

El servidor tiene IP privada (`10.10.10.13`), así que desde internet no se ve. Hay que pedir a TI:

1. **Dominios o subdominios**, por ejemplo `intercambio.amib.com.mx` (front) y `api-intercambio.amib.com.mx` (back), apuntando a la IP pública de AMIB.
2. **Puertos 80 y 443** abiertos en el firewall o router, redirigidos al servidor que tiene el proxy.
3. **Certificado HTTPS** (Let's Encrypt es gratuito). Es obligatorio: si el front va por HTTPS y el back por HTTP, el navegador bloquea las peticiones.

Si ya existe un proxy inverso para otros proyectos del servidor, solo se agregan dos sitios nuevos.

### 13.2 Saber si ya hay Nginx

En el servidor (fuera del contenedor):

```bash
ssh contenedores@10.10.10.13
podman ps                       # ¿hay un contenedor nginx, proxy, traefik o caddy?
which nginx                     # ¿está instalado en el host?
systemctl status nginx          # ¿está corriendo?
ss -tlnp | grep -E ':80|:443'   # ¿quién escucha en 80/443?
```

Si algo responde en 80/443, ya hay proxy y solo hay que agregarle los sitios. Si no, hay que instalarlo o pedirle a TI que lo haga.

### 13.3 Backend

```bash
ssh contenedores@10.10.10.13
podman exec -ti <contenedor> bash
cd dev/intercambio
git pull origin main
cd backend
npm install
# crear/actualizar backend/.env (sección 4.2)
pm2 start server.js --name intercambio-back
pm2 list
curl localhost:5000/
pm2 save
```

- El contenedor debe tener publicado el puerto del back (`-p 5000:5000`). En Podman esto se define al **crear** el contenedor.
- Monta `backend/uploads` como volumen para no perder archivos si se recrea el contenedor.
- `CLIENT_URL` debe ser la URL pública del front, con `https://`.
- Para reiniciar tras un cambio: `pm2 restart intercambio-back`. Para ver errores: `pm2 logs intercambio-back`.

### 13.4 Frontend

```bash
cd dev/intercambio/frontend
echo "VITE_API_URL=https://api-intercambio.amib.com.mx" > .env
npm install
npm run build
pm2 serve dist 8080 --spa --name intercambio-front
pm2 save
```

`--spa` hace que cualquier ruta devuelva `index.html`, que es lo mismo que hace `vercel.json`. Cada vez que cambie `VITE_API_URL` hay que repetir `npm run build`.

### 13.5 Proxy inverso (Nginx)

Un sitio por dominio. Ejemplo mínimo:

```nginx
server {
    server_name intercambio.amib.com.mx;
    location / { proxy_pass http://127.0.0.1:8080; }
}

server {
    server_name api-intercambio.amib.com.mx;
    client_max_body_size 20m;          # subida de CVs y logos
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

Certificados HTTPS:

```bash
sudo certbot --nginx -d intercambio.amib.com.mx -d api-intercambio.amib.com.mx
```

### 13.6 Actualizar después de un cambio

```bash
git pull origin main
# backend:
cd backend && npm install && pm2 restart intercambio-back
# frontend:
cd ../frontend && npm install && npm run build && pm2 restart intercambio-front
```

### 13.7 Ventajas y riesgos frente a Vercel + Render

| | Servidor propio | Vercel + Render |
|---|---|---|
| Costo | Sin planes mensuales | Free con límites o de pago |
| Servicio dormido | No | Sí en Render Free |
| Archivos subidos | Persisten en disco | Se pierden en Render |
| Mantenimiento | Lo hace AMIB (parches, respaldos, uptime) | Lo hace la plataforma |
| Exposición | Abrir el servidor a internet requiere endurecerlo | La plataforma lo aísla |

Si el servidor se expone a internet, conviene antes resolver la autorización del back (headers falsificables, ver sección 12) y restringir CORS al dominio del front.
