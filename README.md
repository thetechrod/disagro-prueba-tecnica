# DISAGRO - Plataforma de Eventos

Prueba técnica Full Stack para administrar la confirmación de asistencia a un evento promocional de DISAGRO, incluyendo selección de horario, productos y servicios de interés, cálculo de descuentos y persistencia de la confirmación.

## Demo

- **Frontend:** https://fronted-service-production.up.railway.app
- **Backend API:** https://backend-service-production-0a9c.up.railway.app
- **Usuario demo:** `demo@disagro.com`
- **Contraseña:** `Disagro2026!`

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Base de datos: MySQL
- Autenticación demo: JWT + `node:crypto` (`scrypt`)
- Contenedores: Docker + Docker Compose
- Producción: Railway

## Funcionalidad principal

- Login con usuario preconfigurado.
- Carga del evento activo, horarios y catálogo desde MySQL.
- Búsqueda y selección de productos/servicios.
- Vista previa de descuentos en frontend.
- Validación y recálculo definitivo de descuentos en backend.
- Una confirmación por email y evento.
- Persistencia mediante transacción SQL.
- Snapshot de nombre, tipo y precio de cada item al confirmar.
- Pantalla de resumen y opción de registrar otra asistencia.
- Diseño responsive para desktop, tablet y mobile.

## Reglas de descuentos

### Productos

| Cantidad | Descuento |
| -------- | --------- |
| 0-2      | 0%        |
| 3-4      | 3%        |
| 5+       | 5%        |

### Servicios

| Condición                         | Descuento |
| --------------------------------- | --------- |
| 0-1 servicios                     | 0%        |
| 2+ servicios y subtotal <= Q1,500 | 3%        |
| 2+ servicios y subtotal > Q1,500  | 5%        |

## API

| Método | Endpoint             | Descripción                                                       |
| ------ | -------------------- | ----------------------------------------------------------------- |
| POST   | `/api/auth/login`    | Autentica el usuario demo y devuelve JWT.                         |
| GET    | `/api/events/active` | Devuelve evento activo, slots y catálogo. Requiere Bearer token.  |
| POST   | `/api/confirmations` | Valida, calcula y guarda una confirmación. Requiere Bearer token. |

## Ejecutar localmente con Docker

### Requisitos

- Docker Desktop
- Docker Compose

Crea un `.env` en la raíz:

```env
MYSQL_ROOT_PASSWORD=tu_password_local_de_docker
JWT_SECRET=tu_jwt_secret
```

Luego ejecuta:

```bash
docker compose up --build
```

Servicios locales:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`
- MySQL Docker: `localhost:3307`

Para reinicializar completamente la DB Docker y volver a ejecutar `schema.sql` + `seed.sql`:

```bash
docker compose down -v
docker compose up --build
```

## Persistencia y consistencia

El backend considera la base de datos como fuente de verdad. Los precios e items se obtienen desde MySQL y los descuentos se recalculan en el servidor antes de persistir. La UI calcula los descuentos únicamente como previsualización.

Al confirmar, `confirmation_items` guarda snapshots de nombre, tipo y precio para conservar históricamente las condiciones ofrecidas aunque el catálogo cambie posteriormente.

## Autenticación

La autenticación se implementó como demostración de seguridad sin ampliar innecesariamente el alcance:

- No existe registro público de usuarios.
- El usuario demo se provisiona mediante `seed.sql`.
- La contraseña se almacena hasheada con `scrypt`.
- El backend emite un JWT de corta duración.
- El frontend mantiene el token en `sessionStorage`.
- Los endpoints de evento y confirmaciones están protegidos en backend.

En un sistema productivo se ampliarían controles como recuperación de cuenta, rotación/refresh de sesión, rate limiting y políticas de credenciales.

## Documentación

La documentación técnica resumida se encuentra en `docs/DISAGRO-documentacion.pdf`.
