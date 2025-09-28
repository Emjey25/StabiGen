export class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthenticationError";
        this.statusCode = 401; // Código HTTP para "no autorizado"
    }
}

export class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthorizationError";
        this.statusCode = 403; // Código HTTP para "prohibido"
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404; // Código HTTP para "no encontrado"
    }
}

export class ValidationError extends Error {
    constructor(message, details = null) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 400; // Código HTTP para "petición incorrecta"
        this.details = details;
    }
}

export class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConflictError";
        this.statusCode = 409; // Código HTTP para "conflicto"
    }
}

export class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
        this.statusCode = 500; // Código HTTP para "error interno del servidor"
    }
}