import { AppError } from "../utils/error";
import { type NextFunction,type Request, type Response } from "express";

const errorHandler =  (err: AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            code: err.code
        });
    }
        console.error("UNEXPECTED ERROR:", err);
};

export default errorHandler;