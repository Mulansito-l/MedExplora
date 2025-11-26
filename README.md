# MedExplora – Guía de Instalación y Ejecución

Este archivo README proporciona instrucciones claras para clonar, configurar e iniciar el proyecto **MedExplora**, compuesto por dos aplicaciones Node.js: el **frontend** (React + Vite) y **StrapiCMS** (backend CMS).

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/Mulansito-l/MedExplora.git
```

Una vez clonado, verás la siguiente estructura:

```
MedExplora/
 ├─ frontend/
 └─ strapicms/
```

Cada carpeta es un proyecto independiente de Node.js.

---

## 2. Instalar dependencias

Debes entrar en cada una de las carpetas y ejecutar:

### Para el frontend:
```bash
cd frontend
npm install
```

### Para StrapiCMS:
```bash
cd strapicms
npm install
```

Esto instalará todas las dependencias necesarias.

---

## 3. Crear y configurar los archivos `.env`

Cada proyecto requiere su propio archivo `.env`.

### En `frontend/.env` (ejemplo):
```
VITE_API_URL=http://TU_IP_LOCAL:1337
VITE_MEDIA_URL=http://TU_IP_LOCAL:1337
```

### En `strapicms/.env` (ejemplo):
```
HOST=0.0.0.0
PORT=1337
APP_KEYS=tu_llave1,tu_llave2
API_TOKEN_SALT=tu_salt
ADMIN_JWT_SECRET=tu_jwt_admin
TRANSFER_TOKEN_SALT=tu_salt_transfer
```

Asegúrate de reemplazar **TU_IP_LOCAL** por la IP real de tu equipo en la red (por ejemplo: `192.168.100.6`).

---

## 4. Actualizar IP del frontend

El frontend necesita apuntar correctamente hacia Strapi.  
Debes modificar las constantes donde se define la URL base.
Cámbiala por la IP de tu máquina.

## 5. Ejecutar los proyectos

### Iniciar StrapiCMS:
```bash
cd strapicms
npm run dev
```

### Iniciar el frontend:
```bash
cd frontend
npm run dev
```

---

## 6. Abrir la aplicación

Una vez iniciados los dos servicios:

- **Frontend**:  
  http://localhost:5173

- **StrapiCMS (panel admin)**:  
  http://localhost:1337/admin

---

## 7. Notas finales

- Ambos proyectos deben estar corriendo para que el frontend pueda obtener datos.
- Asegúrate de que la IP usada en el frontend coincida con la IP del equipo donde corre Strapi.
- Si compartes la app en LAN, otros dispositivos deben usar la misma IP configurada en el frontend.

---

¡Listo! El proyecto MedExplora debería estar funcionando correctamente.
