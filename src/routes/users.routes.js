// src/routes/users.routes.js

import express from "express";
import { authenticateToken } from "../middleware/private.middleware.js";
import {
  fetchAllUsers,
  fetchUserById,
  createUserController,
  updateUserController,
  deleteUserController,
  getUserStatsController,
  toggleUserStatus,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

// Aplicar middleware de autenticación a todas las rutas
userRoutes.use(authenticateToken);

// Middleware para verificar rol de admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  next();
};

// === RUTAS SOLO PARA ADMINISTRADORES ===

// GET /api/users - Listar todos los usuarios
userRoutes.get("/", requireAdmin, fetchAllUsers);

// GET /api/users/stats - Obtener estadísticas de usuarios
userRoutes.get("/stats", requireAdmin, getUserStatsController);

// POST /api/users - Crear nuevo usuario
userRoutes.post("/", requireAdmin, createUserController);

// DELETE /api/users/:id - Eliminar usuario
userRoutes.delete("/:id", requireAdmin, deleteUserController);

// PUT /api/users/:id/toggle-status - Activar/desactivar usuario
userRoutes.put("/:id/toggle-status", requireAdmin, toggleUserStatus);

// === RUTAS QUE USUARIOS PUEDEN USAR EN SU PROPIA INFORMACIÓN ===

// GET /api/users/:id - Ver perfil (admins ven cualquiera, usuarios solo el suyo)
userRoutes.get("/:id", fetchUserById);

// PUT /api/users/:id - Actualizar perfil (admins actualizan cualquiera, usuarios solo el suyo)
userRoutes.put("/:id", updateUserController);

export default userRoutes;