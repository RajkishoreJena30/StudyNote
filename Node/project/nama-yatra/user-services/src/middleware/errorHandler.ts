import { AppError } from "../utils/error";
import { type NextFunction, type Request, type Response } from "express";

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
            code: err.code,
        });
        return;
    }

    console.error("UNEXPECTED ERROR:", err);
    res.status(500).json({
        success: false,
        error: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
    });
};

export default errorHandler;