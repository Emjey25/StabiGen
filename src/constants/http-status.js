export const HTTP_STATUS = {
  // Éxito
  OK: 200,
  CREATED: 201,

  // Errores del cliente
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Errores del servidor
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_TYPES = {
  VALIDATION_ERROR: "ERROR_DE_VALIDACION",
  AUTHENTICATION_ERROR: "ERROR_DE_AUTENTICACION",
  AUTHORIZATION_ERROR: "ERROR_DE_AUTORIZACION",
  DUPLICATE_RESOURCE: "RECURSO_DUPLICADO",
  RESOURCE_NOT_FOUND: "RECURSO_NO_ENCONTRADO",
  DATABASE_ERROR: "ERROR_DE_BASE_DE_DATOS",
  INTERNAL_ERROR: "ERROR_INTERNO",
};

export const ERROR_MESSAGES = {
  // Relacionados con autenticación
  INVALID_CREDENTIALS: "Correo electrónico o contraseña inválidos",
  EMAIL_ALREADY_EXISTS: "El correo electrónico ya está en uso",
  USER_NOT_FOUND: "Usuario no encontrado",
  TOKEN_REQUIRED: "Se requiere un token de acceso",
  INVALID_TOKEN: "Token inválido o expirado",
  INSUFFICIENT_PERMISSIONS: "Permisos insuficientes",
  RATE_LIMIT_EXCEEDED: "Límite de solicitudes excedido",
  FORBIDDEN: "Acceso prohibido",
  // Relacionados con validación
  VALIDATION_FAILED: "La validación ha fallado",

  // Genéricos
  INTERNAL_SERVER_ERROR: "Error interno del servidor",
  SERVICE_UNAVAILABLE: "Servicio temporalmente no disponible",
};
