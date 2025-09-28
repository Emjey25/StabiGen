import logger from '../config/logger.js';
import { ERROR_MESSAGES } from '../constants/http-status.js';
import { cookies } from '../utils/cookies.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import { jwttoken } from '../utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  try {
    // Get token from cookie
    const token = cookies.get(req, 'token');

    if (!token) {
      throw new AuthenticationError(ERROR_MESSAGES.TOKEN_REQUIRED);
    }

    // Verify token
    const decoded = jwttoken.verify(token);
    
    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    
    logger.error('Error authenticating token:', error);
    return next(new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN));
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user.role)) {
      return next(new AuthorizationError(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS));
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');