import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError, ZodSchema } from 'zod';

// Define the middleware function that validates request body using Zod
export const validateBody = (schema: ZodSchema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): any => {
        try {
            // Use Zod to parse the request body and validate it
            schema.parse(req.body); // This will throw an error if validation fails
            next(); // Validation passed, continue to the next middleware
        } catch (error) {
            if (error instanceof ZodError) {
                // Zod validation error, send a 400 response with error details
                return res.status(400).json({
                    message: 'Validation failed',
                    details: error.errors, // Zod errors are stored in `error.errors`
                });
            }
            // Handle other errors
            return res.status(500).json({
                message: 'Internal Server Error',
                details: error.message,
            });
        }
    };
};
