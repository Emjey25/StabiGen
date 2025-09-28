// src/controllers/user.controller.js

import logger from "../config/logger.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} from "../services/user.service.js";
import { 
  ValidationError, 
  AuthorizationError 
} from "../utils/errors.js";
import { formatValidationErrors } from "../utils/format.js";
import {
  validateUserQuery,
  validateUserId,
  validateCreateUser,
  validateUpdateUser,
} from "../validations/user.validation.js";

/**
 * Obtener todos los usuarios (solo admins)
 * GET /api/users?page=1&limit=10&role=user&search=john
 */
export const fetchAllUsers = asyncHandler(async (req, res) => {
  // Validar parámetros de query
  const validationResult = validateUserQuery(req.query);
  if (!validationResult.success) {
    const errorDetails = formatValidationErrors(validationResult.error);
    throw new ValidationError('Parámetros de consulta inválidos', errorDetails);
  }

  // Llamar al service
  const result = await getAllUsers(validationResult.data);

  // Respuesta exitosa
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Usuarios obtenidos correctamente',
    data: result.users,
    pagination: result.pagination,
  });

  // Log de la operación
  logger.info('Users fetched successfully', {
    count: result.users.length,
    page: result.pagination.page,
    total: result.pagination.total,
    requestedBy: req.user.email
  });
});

/**
 * Obtener usuario por ID
 * GET /api/users/:id
 */
export const fetchUserById = asyncHandler(async (req, res) => {
  // Validar ID del usuario
  const validationResult = validateUserId(req.params);
  if (!validationResult.success) {
    const errorDetails = formatValidationErrors(validationResult.error);
    throw new ValidationError('ID de usuario inválido', errorDetails);
  }

  const { id } = validationResult.data;

  // Verificar permisos: usuarios solo pueden ver su propio perfil, admins pueden ver cualquiera
  if (req.user.role !== 'admin' && req.user.id !== id) {
    throw new AuthorizationError('Solo puedes ver tu propio perfil');
  }

  // Obtener usuario
  const user = await getUserById(id);

  // Respuesta exitosa
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Usuario obtenido correctamente',
    data: user,
  });

  // Log de la operación
  logger.info('User fetched successfully', {
    userId: id,
    userEmail: user.email,
    accessedBy: req.user.email,
  });
});

/**
 * Crear nuevo usuario (solo admins)
 * POST /api/users
 */
export const createUserController = asyncHandler(async (req, res) => {
  // Validar datos de entrada
  const validationResult = validateCreateUser(req.body);
  if (!validationResult.success) {
    const errorDetails = formatValidationErrors(validationResult.error);
    throw new ValidationError(
      'Por favor proporciona todos los campos requeridos con datos válidos',
      errorDetails
    );
  }

  // Crear usuario
  const user = await createUser(validationResult.data);

  // Respuesta exitosa
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Usuario creado correctamente',
    data: user,
  });

  // Log de la operación
  logger.info('User created successfully', {
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    createdBy: req.user?.email || 'system',
  });
});

/**
 * Actualizar usuario
 * PUT /api/users/:id
 */
export const updateUserController = asyncHandler(async (req, res) => {
  // Validar ID
  const idValidation = validateUserId(req.params);
  if (!idValidation.success) {
    const errorDetails = formatValidationErrors(idValidation.error);
    throw new ValidationError('ID de usuario inválido', errorDetails);
  }

  // Validar datos de actualización
  const dataValidation = validateUpdateUser(req.body);
  if (!dataValidation.success) {
    const errorDetails = formatValidationErrors(dataValidation.error);
    throw new ValidationError('Datos de actualización inválidos', errorDetails);
  }

  const { id } = idValidation.data;
  const updateData = { ...dataValidation.data };

  // Solo admin puede actualizar el rol
  if (updateData.role && req.user.role !== 'admin') {
    delete updateData.role;
  }

  // Verificar permisos: usuarios solo pueden actualizar su propia cuenta, admins pueden actualizar cualquiera
  if (req.user.role !== 'admin' && req.user.id !== id) {
    throw new AuthorizationError('Solo puedes actualizar tu propia cuenta');
  }

  // Actualizar usuario
  const updatedUser = await updateUser(id, updateData);

  // Respuesta exitosa
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Usuario actualizado correctamente',
    data: updatedUser,
  });

  // Log de la operación
  logger.info('User updated successfully', {
    userId: id,
    updatedBy: req.user.email,
    updatedFields: Object.keys(updateData),
  });
});

/**
 * Eliminar usuario (solo admins)
 * DELETE /api/users/:id
 */
export const deleteUserController = asyncHandler(async (req, res) => {
  // Validar ID
  const validationResult = validateUserId(req.params);
  if (!validationResult.success) {
    const errorDetails = formatValidationErrors(validationResult.error);
    throw new ValidationError('ID de usuario inválido', errorDetails);
  }

  const { id } = validationResult.data;
  const currentUserId = req.user.id;

  // Eliminar usuario
  const result = await deleteUser(id, currentUserId);

  // Respuesta exitosa
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: result.message,
  });

  // Log de la operación
  logger.info('User deleted successfully', {
    deletedUserId: id,
    deletedBy: req.user.email,
  });
});

/**
 * Obtener estadísticas de usuarios (solo admins)
 * GET /api/users/stats
 */
export const getUserStatsController = asyncHandler(async (req, res) => {
  // Obtener estadísticas
  const stats = await getUserStats();

  // Respuesta exitosa
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Estadísticas obtenidas correctamente',
    data: stats,
  });

  // Log de la operación
  logger.info('User stats accessed', {
    accessedBy: req.user.email,
    totalUsers: stats.total,
  });
});

/**
 * Cambiar estado activo/inactivo de usuario (solo admins)
 * PUT /api/users/:id/toggle-status
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  // Validar ID
  const validationResult = validateUserId(req.params);
  if (!validationResult.success) {
    const errorDetails = formatValidationErrors(validationResult.error);
    throw new ValidationError('ID de usuario inválido', errorDetails);
  }

  const { id } = validationResult.data;

  // No permitir que el admin se desactive a sí mismo
  if (req.user.id === id) {
    throw new ValidationError('No puedes cambiar el estado de tu propia cuenta');
  }

  // Obtener usuario actual para conocer su estado
  const currentUser = await getUserById(id);
  
  // Cambiar estado
  const updatedUser = await updateUser(id, { 
    isActive: !currentUser.isActive 
  });

  // Respuesta exitosa
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Usuario ${updatedUser.isActive ? 'activado' : 'desactivado'} correctamente`,
    data: updatedUser,
  });

  // Log de la operación
  logger.info('User status toggled', {
    userId: id,
    newStatus: updatedUser.isActive ? 'active' : 'inactive',
    changedBy: req.user.email,
  });
});