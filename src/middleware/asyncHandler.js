// src/middleware/asyncHandler.js

/**
 * Wrapper para funciones async que maneja automáticamente los errores
 * y los pasa al middleware de manejo de errores
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;