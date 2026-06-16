class AppError extends Error {
    constructor(message: string, public statusCode: number, public code:string) {
        super(message);
        // this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code; //custom error code for better error handling
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message: string, code: string = "BAD_REQUEST") {
        super(message, 400, code);
    }   
}

class UnauthorizedError extends AppError {
    constructor(message: string, code: string = "UNAUTHORIZED") {
        super(message, 401, code);
    }
}

class ForbiddenError extends AppError {
    constructor(message: string, code: string = "FORBIDDEN") {
        super(message, 403, code);
    }
}

class NotFoundError extends AppError {
    constructor(message: string, code: string = "NOT_FOUND") {
        super(message, 404, code);
    }
}

class InternalServerError extends AppError {
    constructor(message: string, code: string = "INTERNAL_SERVER_ERROR") {
        super(message, 500, code);
    }
}

class ConflictError extends AppError {
    constructor(message: string, code: string = "CONFLICT") {
        super(message, 409, code);
    }
}

class TooManyRequestError extends AppError {
    constructor(message: string, code: string = "TOO_MANY_REQUESTS") {
        super(message, 429, code);
    }
}

export {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    ConflictError,
    TooManyRequestError,
};