// auth.controller.js

import logger from "../config/logger.js";
import { HTTP_STATUS, ERROR_TYPES } from "../constants/http-status.js";
import { User } from "../models/user.js";
import { jwttoken } from "../utils/jwt.js";
import { signupService } from "../validations/auth.validation.js";

// Registro de usuario
const signup = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body; // Asignar 'user' como rol por defecto
  
  try {
    // Validación de datos
    const validation = await signupService({ name, email, password, role });
    if (validation.status !== HTTP_STATUS.OK) {
      return res.status(validation.status).json(validation.response);
    }

    // Creacion de un objeto usuario en la base de datos
    const newUser = await User.create({ name, email, password, role });
    
    logger.info("Usuario creado exitosamente:", { 
      id: newUser._id, 
      email: newUser.email, 
      role: newUser.role 
    });

    // Creacion de JWT
    const token = jwttoken.sign(
      {
        id: newUser._id, // Usar _id que es como MongoDB guarda los IDs
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    ); // -> return Jwt

    // logger para registro del token generado
    logger.info("Token generado para usuario:", newUser.email);

    // Guardar el token en una cookie
    res.cookie("authToken", token, {
      httpOnly: true, // No accesible desde JavaScript del navegador (más seguro)
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: "strict", // Protección contra ataques
      maxAge: 60 * 60 * 1000, // 1 hora en milisegundos
    });

    // Respuesta
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token: token,
    });

  } catch (error) {
    // logger por si hay error en el signup
    logger.error("Error completo en signup:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Si es un error de duplicado de email (código 11000 en MongoDB)
    if (error.code === 11000) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: "El email ya está registrado"
      });
    }
    
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error interno del servidor al crear usuario"
    });
  }
};

// Inicio de sesión
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Intento de login con:', { email, password });

    // 🆕 NUEVO: Buscar usuario por email O por name (username)
    const user = await User.findOne({ 
      $or: [
        { email: email },
        { name: email } // Si el campo "email" contiene un nombre de usuario
      ]
    });
    
    console.log('👤 Usuario encontrado:', user ? { id: user._id, name: user.name, email: user.email } : 'NO ENCONTRADO');
    
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // 🆕 NUEVO: Verificar contraseña (necesitarás bcrypt para esto)
    // Por ahora comparamos directamente (INSEGURO, mejorarlo después)
    console.log('🔑 Comparando passwords:', { ingresada: password, almacenada: user.password });
    if (user.password !== password) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // ✅ ARREGLADO: Ahora 'user' sí existe
    const token = jwttoken.sign({
      id: user._id, // _id en MongoDB
      email: user.email,
      role: user.role,
    });

    // 🆕 NUEVO: Guardar token en cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Login exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });

    // ✅ ARREGLADO: Ahora user existe
    logger.info("User signed in successfully", {
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    logger.error("Signin error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Cierre de sesión
const signout = (req, res) => {
  // 🆕 NUEVO: Limpiar la cookie
  res.clearCookie("authToken");

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Sesión cerrada exitosamente",
  });

  logger.info("User signed out successfully");
};

// Obtener perfil del usuario actual
const getProfile = async (req, res) => {
  try {
    // La información del usuario ya está disponible en req.user del middleware
    res.status(HTTP_STATUS.OK).json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    });

    logger.info(`Profile accessed by user: ${req.user.email}`);
  } catch (error) {
    logger.error("Get profile error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error al obtener perfil"
    });
  }
};

export { signin, signout, signup, getProfile };
