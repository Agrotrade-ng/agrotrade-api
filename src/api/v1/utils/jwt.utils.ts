import jwt from 'jsonwebtoken';
import { Logger } from '../helpers/logger';
import redis from '../../../config/redis.config';

const JWT_SECRET = process.env.JWT_SECRET || 'chill-capybara';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; // Access token expiry
const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || 'not-so-chill-capybara';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'; // Refresh token expiry

export class JwtUtil {
    // generate access token
    static generateAccessToken = (payload: object): string => {
        try {
            return jwt.sign(payload, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
            });
        } catch (error) {
            Logger.error('Error generating access token: ' + error.message);
            throw new Error('Failed to generate access token');
        }
    };

    // generate access token
    static generateRefreshToken = (payload: object): string => {
        try {
            return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
                expiresIn: REFRESH_TOKEN_EXPIRES_IN,
            });
        } catch (error) {
            Logger.error('Error generating refresh token: ' + error.message);
            throw new Error('Failed to generate refresh token');
        }
    };

    static verifyAccessToken = (token: string): any => {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (error) {
            Logger.error('Error verifying JWT token: ' + error.message);
            throw new Error('Invalid or expired token.');
        }
    };
    static verifyRefreshToken = (token: string): any => {
        try {
            const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
            return decoded;
        } catch (error) {
            Logger.error('Error verifying Refresh token: ' + error.message);
            throw new Error('Invalid or expired token.');
        }
    };

    static decodeToken = (token: string) => {
        return jwt.decode(token);
    };

    //
    static storeRefreshToken = async (user_id: string, token: string) => {
        const k = `refresh_token:${user_id}`;
        const ttl = 60 * 60 * 24 * 7; //7days

        try {
            //
            await redis.setex(k, ttl, token);
        } catch (error) {
            Logger.error('Error storing refresh token: ' + error);
        }
    };

    //
    static revokeRefreshToken = async (user_id: string) => {
        const k = `refresh_token:${user_id}`;

        try {
            //
            await redis.del(k);
        } catch (error) {
            Logger.error('Error storing refresh token: ' + error);
        }
    };
}
