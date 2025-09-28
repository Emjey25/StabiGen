import express from "express";
import cookieParser from "cookie-parser";
import { ShowErrorMessage } from "./src/config/envs.js";
import ConnectDB from "./src/db/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/users.routes.js";
import { errorHandler } from "./src/middleware/private.middleware.js";

// Función autoejecutable para iniciar el servidor y conectar a la base de datos
(() => {
  ServerApp();
  ConnectDB();
})();

// Mueve el listen dentro de ServerApp y pásale el puerto como argumento
function ServerApp() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // middleware básico
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // mostrar mensajes de error en desarrollo
  ShowErrorMessage();

  // rutas públicas
  app.use("/api/auth", authRoutes);
  
  // rutas privadas (usuarios)
  app.use("/api/users", userRoutes);

  // Middleware de manejo de errores (DEBE ir al final)
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("servidor corriendo correctamente en la url http://localhost:" + PORT + "/api/auth");
  });
}
