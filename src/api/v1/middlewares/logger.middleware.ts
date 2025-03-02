import { Request, Response, NextFunction } from 'express';
import { Logger } from '../helpers/logger';

export const LoggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const { method, url } = req;
    const startTime = Date.now();

    // Listen for the response to finish and log details
    res.on('finish', () => {
        const { statusCode } = res;
        const duration = Date.now() - startTime;

        // Log the HTTP request details
        Logger.info(`${method} ${url} [${statusCode}] - ${duration}ms`);
    });

    next();
};
