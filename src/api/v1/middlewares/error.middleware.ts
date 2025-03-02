import { Response, Request, NextFunction } from 'express';

export const ErrorHandler = (
    err,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    console.log('err', err);
    // We need to check if its a Joi error so we can pass a statusCode. UnprocessableEntity error.
    if (err.isJoi) {
        err.statusCode = 422;
    }

    res.status(err.statusCode || 500).json({
        message: err.message,
        detail: err.detail || null,
        status_code: err.statusCode || 500,
    });
};
