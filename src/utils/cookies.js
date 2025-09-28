
// Función para GUARDAR una cookie
export const setCookie = (res, name, value, options = {}) => {
  const defaultOptions = {
    httpOnly: true, // Solo el servidor puede leer la cookie (más seguro)
    secure: false, // false para desarrollo, true para producción con HTTPS
    sameSite: "strict", // Protección contra ataques
    maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    path: "/", // La cookie funciona en toda la aplicación
  };

  // Mezclar opciones por defecto con las que nos pasen
  const finalOptions = { ...defaultOptions, ...options };

  res.cookie(name, value, finalOptions);
};

// Función para LEER una cookie
export const getCookie = (req, name) => {
  return req.cookies ? req.cookies[name] : null;
};

// Función para BORRAR una cookie
export const clearCookie = (res, name, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  };

  const finalOptions = { ...defaultOptions, ...options };
  res.clearCookie(name, finalOptions);
};