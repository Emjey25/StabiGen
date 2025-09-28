// src/services/user.service.js

import { User } from "../models/user.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import { formatUserResponse, formatPagination } from "../utils/format.js";
import logger from "../config/logger.js";

/**
 * Obtiene todos los usuarios con filtros y paginación
 */
export const getAllUsers = async ({ page = 1, limit = 10, role, search }) => {
  try {
    // Construir filtros
    const filters = {};
    
    if (role) {
      filters.role = role;
    }
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calcular skip
    const skip = (page - 1) * limit;
    
    // Ejecutar queries en paralelo
    const [users, total] = await Promise.all([
      User.find(filters)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments(filters)
    ]);
    
    // Formatear usuarios
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    
    // Generar paginación
    const pagination = formatPagination(page, limit, total);
    
    return {
      users: formattedUsers,
      pagination
    };
  } catch (error) {
    logger.error('Error in getAllUsers service:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por ID
 */
export const getUserById = async (id) => {
  try {
    const user = await User.findById(id).select('-password').lean();
    
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in getUserById service:', error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario
 */
export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }
    
    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      role
    });
    
    // Devolver usuario sin contraseña
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    if (error instanceof ConflictError) {
      throw error;
    }
    logger.error('Error in createUser service:', error);
    throw error;
  }
};

/**
 * Actualiza un usuario
 */
export const updateUser = async (id, updateData) => {
  try {
    // Si se está actualizando el email, verificar que no exista
    if (updateData.email) {
      const existingUser = await User.findOne({ 
        email: updateData.email, 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        throw new ConflictError('El email ya está en uso por otro usuario');
      }
    }
    
    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').lean();
    
    if (!updatedUser) {
      throw new NotFoundError('Usuario no encontrado');
    }
    
    return {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error;
    }
    logger.error('Error in updateUser service:', error);
    throw error;
  }
};

/**
 * Elimina un usuario
 */
export const deleteUser = async (id, currentUserId) => {
  try {
    // No permitir que un usuario se elimine a sí mismo
    if (id === currentUserId) {
      throw new ConflictError('No puedes eliminar tu propia cuenta');
    }
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      throw new NotFoundError('Usuario no encontrado');
    }
    
    return {
      message: 'Usuario eliminado correctamente'
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error;
    }
    logger.error('Error in deleteUser service:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de usuarios
 */
export const getUserStats = async () => {
  try {
    const [totalUsers, activeUsers, usersByRole] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);
    
    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  } catch (error) {
    logger.error('Error in getUserStats service:', error);
    throw error;
  }
};