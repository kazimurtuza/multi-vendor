import { Request, Response, RequestHandler, NextFunction } from "express";
const TryCatch = (handler: RequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await handler(req, res, next);

        } catch (err: any) {
            return res.status(500).json({
                messages: err.message,
            })
        }
    }

}

export default TryCatch;