import { type Request, type Response, type NextFunction, type RequestHandler } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (fn: AsyncFn): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next).catch(next);
    };
};