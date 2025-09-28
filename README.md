# StabiGen - Backend API

Un backend robusto construido con Node.js, Express.js y MongoDB para gestión de usuarios con autenticación JWT y sistema de roles.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso con Docker](#uso-con-docker)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Sistema de Roles](#sistema-de-roles)
- [Logging](#logging)
- [Contribución](#contribución)

## 🚀 Características

- ✅ Autenticación JWT con cookies seguras
- ✅ Sistema de roles (admin, moderator, user)
- ✅ CRUD completo de usuarios
- ✅ Middleware de autenticación y autorización
- ✅ Validaciones de datos robustas
- ✅ Logging con Winston
- ✅ Manejo de errores centralizado
- ✅ Soporte para Docker
- ✅ Variables de entorno configurables
- ✅ Base de datos MongoDB con Mongoose

## 🛠 Tecnologías

- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Logging**: Winston
- **Conteneurización**: Docker + Docker Compose
- **Variables de Entorno**: dotenv

### Dependencias Principales

```json
{
  "express": "^5.1.0",
  "mongoose": "^8.18.2",
  "jsonwebtoken": "^9.0.2",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^17.2.2",
  "winston": "^3.17.0"
}
```

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- MongoDB (local o remoto)
- Docker y Docker Compose (opcional, pero recomendado)

## 📦 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd StabiGen
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Crear archivo de variables de entorno**
   ```bash
   # Crear .env en la raíz del proyecto
   touch .env
   ```

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# URI de conexión a MongoDB
MONGODB_URI=mongodb://admin:admin123@localhost:27017/StabiGen?authSource=admin

# JWT Secret (genera una clave secreta fuerte)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# Entorno de desarrollo
NODE_ENV=development
```

### Configuración de MongoDB

Si usas MongoDB local, asegúrate de:

1. Tener MongoDB ejecutándose en tu sistema
2. Crear una base de datos llamada `StabiGen`
3. Configurar las credenciales apropiadas

## 🐳 Uso con Docker

### Docker Compose

El proyecto incluye un archivo `docker-compose.yml` que configura automáticamente MongoDB:

```yaml
services:
  mongodb:
    image: mongo:latest
    container_name: stabigen-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: StabiGen
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d

volumes:
  mongodb_data:
    driver: local
```

### Comandos Docker

1. **Iniciar MongoDB con Docker Compose**

   ```bash
   docker-compose up -d
   ```

2. **Verificar que el contenedor esté ejecutándose**

   ```bash
   docker-compose ps
   ```

3. **Ver logs del contenedor**

   ```bash
   docker-compose logs mongodb
   ```

4. **Detener los servicios**

   ```bash
   docker-compose down
   ```

5. **Detener y eliminar volúmenes (CUIDADO: elimina todos los datos)**
   ```bash
   docker-compose down -v
   ```

### Configuración de MongoDB con Docker

- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Base de datos**: `StabiGen`
- **Puerto**: `27017`
- **URI de conexión**: `mongodb://admin:admin123@localhost:27017/StabiGen?authSource=admin`

## 🚀 Ejecución

### Desarrollo con Docker

1. **Iniciar MongoDB**

   ```bash
   docker-compose up -d
   ```

2. **Iniciar el servidor en modo desarrollo**
   ```bash
   npm run dev
   ```

### Desarrollo sin Docker

1. **Asegúrate de tener MongoDB ejecutándose localmente**

2. **Iniciar el servidor**
   ```bash
   npm run dev
   ```

El servidor estará disponible en: `http://localhost:3000`

### Logs

Los logs se guardan en la carpeta `logs/`:

- `combined.log`: Todos los logs
- `error.log`: Solo errores

## 📁 Estructura del Proyecto

```
StabiGen/
├── app.js                      # Punto de entrada de la aplicación
├── package.json               # Dependencias y scripts
├── docker-compose.yml         # Configuración de Docker
├── logs/                      # Archivos de log
│   ├── combined.log
│   └── error.log
├── mongo-init/                # Scripts de inicialización de MongoDB
└── src/
    ├── config/                # Configuraciones
    │   ├── envs.js           # Variables de entorno
    │   └── logger.js         # Configuración de Winston
    ├── constants/             # Constantes de la aplicación
    │   └── http-status.js    # Códigos de estado HTTP
    ├── controllers/           # Controladores de la API
    │   ├── auth.controller.js
    │   └── user.controller.js
    ├── db/                    # Configuración de base de datos
    │   └── database.js
    ├── middleware/            # Middlewares personalizados
    │   ├── asyncHandler.js
    │   ├── auth.middleware.js
    │   └── private.middleware.js
    ├── models/                # Modelos de Mongoose
    │   └── user.js
    ├── routes/                # Definición de rutas
    │   ├── auth.routes.js
    │   └── users.routes.js
    ├── services/              # Servicios de negocio
    │   └── user.service.js
    ├── utils/                 # Utilidades
    │   ├── cookies.js
    │   ├── errors.js
    │   ├── format.js
    │   └── jwt.js
    └── validations/           # Validaciones de entrada
        ├── auth.validation.js
        └── user.validation.js
```

## 🔐 API Endpoints

### Autenticación (Rutas Públicas)

| Método | Endpoint             | Descripción             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/sign-up`  | Registrar nuevo usuario |
| POST   | `/api/auth/sign-in`  | Iniciar sesión          |
| POST   | `/api/auth/sign-out` | Cerrar sesión           |

### Perfil de Usuario (Rutas Privadas)

| Método | Endpoint                  | Descripción             | Roles            |
| ------ | ------------------------- | ----------------------- | ---------------- |
| GET    | `/api/auth/me`            | Obtener perfil actual   | Todos            |
| GET    | `/api/auth/private-route` | Ruta de ejemplo privada | admin, moderator |

### Gestión de Usuarios (Rutas Privadas)

| Método | Endpoint                       | Descripción                | Roles          |
| ------ | ------------------------------ | -------------------------- | -------------- |
| GET    | `/api/users`                   | Listar todos los usuarios  | admin          |
| GET    | `/api/users/stats`             | Estadísticas de usuarios   | admin          |
| GET    | `/api/users/:id`               | Ver perfil específico      | admin o propio |
| POST   | `/api/users`                   | Crear nuevo usuario        | admin          |
| PUT    | `/api/users/:id`               | Actualizar usuario         | admin o propio |
| DELETE | `/api/users/:id`               | Eliminar usuario           | admin          |
| PUT    | `/api/users/:id/toggle-status` | Activar/desactivar usuario | admin          |

### Ejemplos de Uso

#### Registro de Usuario

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "mi_password_seguro"
  }'
```

#### Iniciar Sesión

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "mi_password_seguro"
  }'
```

## 👥 Sistema de Roles

La aplicación implementa un sistema de roles con tres niveles:

### Roles Disponibles

1. **user** (por defecto)

   - Puede ver y editar su propio perfil
   - Acceso limitado a recursos

2. **moderator**

   - Acceso a rutas privadas específicas
   - Puede realizar acciones de moderación

3. **admin**
   - Acceso completo al sistema
   - Gestión de usuarios (CRUD)
   - Acceso a estadísticas
   - Puede cambiar roles de otros usuarios

### Modelo de Usuario

```javascript
{
  name: String,        // Nombre del usuario
  email: String,       // Email único
  password: String,    // Contraseña hasheada
  role: String,        // "user", "moderator", "admin"
  isActive: Boolean,   // Estado activo/inactivo
  createdAt: Date,     // Fecha de creación
  updatedAt: Date      // Fecha de actualización
}
```

## 📊 Logging

El sistema utiliza Winston para el logging con los siguientes niveles:

- **error**: Errores de la aplicación
- **warn**: Advertencias
- **info**: Información general
- **debug**: Información de depuración

### Archivos de Log

- `logs/error.log`: Solo errores
- `logs/combined.log`: Todos los logs

### Configuración de Logs

Los logs se configuran en `src/config/logger.js` y incluyen:

- Timestamp
- Nivel de log
- Mensaje
- Stack trace (para errores)

## 🔧 Troubleshooting

### Problemas Comunes

1. **Error de conexión a MongoDB**

   ```
   MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
   ```

   **Solución**: Verificar que MongoDB esté ejecutándose con Docker Compose

2. **Error de variables de entorno**

   ```
   Error Missing Environment Variables: - MONGODB_URI
   ```

   **Solución**: Crear archivo `.env` con las variables requeridas

3. **Error de autenticación JWT**
   ```
   JsonWebTokenError: invalid signature
   ```
   **Solución**: Verificar que `JWT_SECRET` esté configurado correctamente

### Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f mongodb

# Conectar a MongoDB desde terminal
docker exec -it stabigen-mongodb mongosh -u admin -p admin123

# Reiniciar completamente el proyecto
docker-compose down -v && docker-compose up -d
npm run dev
```

## 🤝 Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código

- Usar ES6+ modules
- Seguir convenciones de nombres en camelCase
- Documentar funciones complejas
- Mantener archivos organizados por funcionalidad
- Implementar manejo de errores apropiado

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

**Desarrollado con ❤️ por luneska usando Node.js y MongoDB**

Para más información o soporte, abre un issue en el repositorio.
