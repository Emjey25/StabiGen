// auth.controller.js

import logger from "../config/logger.js";
import { HTTP_STATUS, ERROR_TYPES } from "../constants/http-status.js";
import { User } from "../models/user.js";
import { jwttoken } from "../utils/jwt.js";
import { signupService } from "../validations/auth.validation.js";

// Registro de usuario
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const validation = await signupService({ name, email, password, role });
    if (validation.status !== HTTP_STATUS.OK) {
      return res.status(validation.status).json(validation.response);
    }
  } catch (error) {
    // logger por si hay error en el signup
    logger.error("Signup error:", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ VALIDATION_ERROR: true, message: ERROR_TYPES.VALIDATION_ERROR });
  }

  // Creacion de un objeto usuario en la base de datos
  const newUser = await User.create({ name, email, password, role });

  // Creacion de JWT
  const token = jwttoken.sign(
    {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  ); // -> return Jwt

  // logger para registro del token generado
  logger.info("Token generado:", token);

  // Guardar el token en una cookie
  // 🆕 NUEVO: Guardar token en cookie
  res.cookie("authToken", token, {
    httpOnly: true, // No accesible desde JavaScript del navegador (más seguro)
    secure: true, // true solo en HTTPS (false para desarrollo)
    sameSite: "strict", // Protección contra ataques
    maxAge: 60 * 60 * 1000, // 1 hora en milisegundos
  });

  // Respuesta
  return res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "Usuario registrado exitosamente",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    token: token,
  });
};

// Inicio de sesión
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🆕 NUEVO: Buscar usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // 🆕 NUEVO: Verificar contraseña (necesitarás bcrypt para esto)
    // Por ahora comparamos directamente (INSEGURO, mejorarlo después)
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
      secure: false, // true solo en producción
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
