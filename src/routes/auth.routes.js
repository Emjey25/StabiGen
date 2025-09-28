import express from "express";
import { signin, signout, signup, getProfile } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/private.middleware.js";
import { HTTP_STATUS } from "../constants/http-status.js";

const authRoutes = express.Router();

// Public routes
authRoutes.post("/sign-up", signup);
authRoutes.post("/sign-in", signin);
authRoutes.post("/sign-out", signout);

// Private Routes - requieren autenticación
authRoutes.get("/me", verifyToken, getProfile);              // Obtener mi perfil
authRoutes.get("/private-route", verifyToken, (req, res) => {
  const rolePersmited = ["admin", "moderator"];
  const role = req.user.role;
  if (!rolePersmited.includes(role)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Acceso denegado" });
  }
  const userId = req.user.id;
  res.status(HTTP_STATUS.OK).json({ message: "Bienvenido a la ruta privada" });
});

export default authRoutes;
