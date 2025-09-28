// src/validations/user.validation.js

/**
 * Simulación de validaciones estilo Zod para usuarios
 * (puedes implementar con Joi, express-validator o Zod real después)
 */

/**
 * Valida los parámetros de query para obtener usuarios
 */
export const validateUserQuery = (query) => {
  const errors = [];
  const data = {};
  
  // Page
  if (query.page) {
    const page = parseInt(query.page);
    if (isNaN(page) || page < 1) {
      errors.push({ path: ['page'], message: 'Page must be a positive integer' });
    } else {
      data.page = page;
    }
  } else {
    data.page = 1;
  }
  
  // Limit
  if (query.limit) {
    const limit = parseInt(query.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push({ path: ['limit'], message: 'Limit must be between 1 and 100' });
    } else {
      data.limit = limit;
    }
  } else {
    data.limit = 10;
  }
  
  // Role filter
  if (query.role) {
    const validRoles = ['user', 'admin', 'moderator'];
    if (!validRoles.includes(query.role)) {
      errors.push({ path: ['role'], message: 'Invalid role filter' });
    } else {
      data.role = query.role;
    }
  }
  
  // Search filter
  if (query.search) {
    if (typeof query.search !== 'string' || query.search.length < 2) {
      errors.push({ path: ['search'], message: 'Search must be at least 2 characters' });
    } else {
      data.search = query.search.trim();
    }
  }
  
  return {
    success: errors.length === 0,
    data,
    error: errors.length > 0 ? { errors } : null
  };
};

/**
 * Valida ID de usuario
 */
export const validateUserId = (params) => {
  const errors = [];
  const data = {};
  
  if (!params.id) {
    errors.push({ path: ['id'], message: 'User ID is required' });
  } else if (typeof params.id !== 'string' || params.id.length !== 24) {
    errors.push({ path: ['id'], message: 'Invalid user ID format' });
  } else {
    data.id = params.id;
  }
  
  return {
    success: errors.length === 0,
    data,
    error: errors.length > 0 ? { errors } : null
  };
};

/**
 * Valida datos para crear usuario
 */
export const validateCreateUser = (body) => {
  const errors = [];
  const data = {};
  
  // Name
  if (!body.name) {
    errors.push({ path: ['name'], message: 'Name is required' });
  } else if (typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push({ path: ['name'], message: 'Name must be at least 2 characters' });
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(body.name.trim())) {
    errors.push({ path: ['name'], message: 'Name can only contain letters and spaces' });
  } else {
    data.name = body.name.trim();
  }
  
  // Email
  if (!body.email) {
    errors.push({ path: ['email'], message: 'Email is required' });
  } else if (typeof body.email !== 'string') {
    errors.push({ path: ['email'], message: 'Email must be a string' });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      errors.push({ path: ['email'], message: 'Invalid email format' });
    } else {
      data.email = body.email.toLowerCase().trim();
    }
  }
  
  // Password
  if (!body.password) {
    errors.push({ path: ['password'], message: 'Password is required' });
  } else if (typeof body.password !== 'string' || body.password.length < 6) {
    errors.push({ path: ['password'], message: 'Password must be at least 6 characters' });
  } else {
    data.password = body.password;
  }
  
  // Role
  const validRoles = ['user', 'admin', 'moderator'];
  if (body.role) {
    if (!validRoles.includes(body.role)) {
      errors.push({ path: ['role'], message: 'Invalid role' });
    } else {
      data.role = body.role;
    }
  } else {
    data.role = 'user';
  }
  
  return {
    success: errors.length === 0,
    data,
    error: errors.length > 0 ? { errors } : null
  };
};

/**
 * Valida datos para actualizar usuario
 */
export const validateUpdateUser = (body) => {
  const errors = [];
  const data = {};
  
  // Name (opcional)
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push({ path: ['name'], message: 'Name must be at least 2 characters' });
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(body.name.trim())) {
      errors.push({ path: ['name'], message: 'Name can only contain letters and spaces' });
    } else {
      data.name = body.name.trim();
    }
  }
  
  // Email (opcional)
  if (body.email !== undefined) {
    if (typeof body.email !== 'string') {
      errors.push({ path: ['email'], message: 'Email must be a string' });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        errors.push({ path: ['email'], message: 'Invalid email format' });
      } else {
        data.email = body.email.toLowerCase().trim();
      }
    }
  }
  
  // Role (opcional)
  if (body.role !== undefined) {
    const validRoles = ['user', 'admin', 'moderator'];
    if (!validRoles.includes(body.role)) {
      errors.push({ path: ['role'], message: 'Invalid role' });
    } else {
      data.role = body.role;
    }
  }
  
  // isActive (opcional)
  if (body.isActive !== undefined) {
    if (typeof body.isActive !== 'boolean') {
      errors.push({ path: ['isActive'], message: 'isActive must be a boolean' });
    } else {
      data.isActive = body.isActive;
    }
  }
  
  return {
    success: errors.length === 0,
    data,
    error: errors.length > 0 ? { errors } : null
  };
};