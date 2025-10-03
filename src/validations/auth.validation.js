// signup.service.js
import { HTTP_STATUS } from "../constants/http-status.js";
import { User } from "../models/user.js";

// Puedes exportar la función directamente
export const signupService = async ({ name, email, password, role }) => {
  // Validar datos obligatorios (role es opcional)
  if (!name || !email || !password) {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      response: {
        VALIDATION_ERROR: true,
        message: "Nombre, email y contraseña son obligatorios",
      },
    };
  }

  //Verificar que el nombre solo sean letras
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      response: {
        VALIDATION_ERROR: true,
        message: "El nombre solo debe contener letras y espacios",
      },
    };
  }

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      status: HTTP_STATUS.CONFLICT,
      response: { USER_EXISTS: true, message: "Usuario ya existe" },
    };
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      response: {
        VALIDATION_ERROR: true,
        message: "Formato de email no válido",
      },
    };
  }

  // Validar fortaleza de la contraseña
  if (password.length < 6) {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      response: {
        VALIDATION_ERROR: true,
        message: "La contraseña debe tener al menos 6 caracteres",
      },
    };
  }
  return { status: HTTP_STATUS.OK, response: { VALIDATION_ERROR: false } };
};
