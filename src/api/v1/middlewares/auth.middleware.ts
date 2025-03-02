import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.utils';

export const authHeaderMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res
            .status(401)
            .json({ message: 'Authorization header is required' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res
            .status(401)
            .json({ message: 'Authorization header format is invalid' });
    }

    const token = parts[1];

    try {
        // Decode and verify the token
        const decoded = JwtUtil.verifyAccessToken(token);

        // Attach the user's data to the request object
        req.params.id = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
