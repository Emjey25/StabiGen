import jwttoken from "../utils/jwt.js";
import { AuthenticationError, AuthorizationError } from "../utils/errors.js";
import { ERROR_MESSAGES } from "../constants/http-status.js";
import logger from "../config/logger.js";

// Middleware para verificar que el usuario está logueado
export const authenticateToken = (req, res, next) => {
  try {
    // 1. Buscar token primero en cookies, luego en headers
    let token = req.cookies?.authToken;
    
    // Si no hay cookie, buscar en headers (para apps móviles)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization;
      // Quitar "Bearer " si está presente
      token = token.startsWith("Bearer ") ? token.slice(7) : token;
    }

    // Si no hay token en ningún lado
    if (!token) {
      throw new AuthenticationError(ERROR_MESSAGES.TOKEN_REQUIRED || "Token requerido");
    }

    // 2. Verificar que el token sea válido
    const decoded = jwttoken.verify(token);
    
    // 3. Guardar información del usuario para usar en otras funciones
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    // 4. Todo bien, continuar
    next();
  } catch (error) {
    // Si el token de la cookie es inválido, borrarla
    if (req.cookies?.authToken) {
      res.clearCookie('authToken');
    }
    
    // Si ya es un error de autenticación, pasarlo tal como está
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    
    // Si es cualquier otro error (token inválido, expirado, etc.)
    logger.error('Error authenticating token:', error);
    return next(new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN || "Token inválido"));
  }
};

// Middleware para verificar que el usuario tiene el rol correcto
export const requireRole = (roles) => {
  // Esta función RETORNA otra función (esto se llama "closure")
  return (req, res, next) => {
    try {
      // Verificar que el usuario esté logueado
      if (!req.user) {
        throw new AuthenticationError('Se requiere autenticación');
      }

      // Convertir roles a array si no lo es
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      // Verificar si el usuario tiene uno de los roles permitidos
      if (!allowedRoles.includes(req.user.role)) {
        throw new AuthorizationError(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS || "Sin permisos suficientes");
      }

      // Todo bien, continuar
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Atajos para roles específicos
export const requireAdmin = requireRole('admin');
export const requireModerator = requireRole(['admin', 'moderator']);

// Middleware para manejar errores globalmente
export const errorHandler = (error, req, res, next) => {
  logger.error('Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user?.email
  });

  // Si el error tiene statusCode, usarlo
  const statusCode = error.statusCode || 500;
  
  // Respuesta base
  const response = {
    success: false,
    message: error.message || 'Error interno del servidor'
  };

  // Agregar detalles si es error de validación
  if (error.details) {
    response.errors = error.details;
  }

  // Solo en desarrollo mostrar el stack del error
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

// Mantener la función original por compatibilidad
export const verifyToken = authenticateToken;