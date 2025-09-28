// src/utils/format.js

/**
 * Formatea los errores de validación de manera legible
 * @param {Object} validationError - Error de validación 
 * @returns {Object} - Errores formateados
 */
export const formatValidationErrors = (validationError) => {
  const errors = {};
  
  if (validationError.errors) {
    validationError.errors.forEach((error) => {
      const field = error.path.join('.');
      errors[field] = error.message;
    });
  }
  
  return errors;
};

/**
 * Formatea la respuesta de paginación
 * @param {number} page - Página actual
 * @param {number} limit - Elementos por página
 * @param {number} total - Total de elementos
 * @returns {Object} - Información de paginación
 */
export const formatPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

/**
 * Formatea los datos del usuario para respuesta (sin contraseña)
 * @param {Object} user - Objeto usuario de la BD
 * @returns {Object} - Usuario sin datos sensibles
 */
export const formatUserResponse = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  
  const { password, __v, ...userWithoutSensitiveData } = userObj;
  
  return {
    id: userWithoutSensitiveData._id || userWithoutSensitiveData.id,
    name: userWithoutSensitiveData.name,
    email: userWithoutSensitiveData.email,
    role: userWithoutSensitiveData.role,
    isActive: userWithoutSensitiveData.isActive,
    createdAt: userWithoutSensitiveData.createdAt,
    updatedAt: userWithoutSensitiveData.updatedAt
  };
};