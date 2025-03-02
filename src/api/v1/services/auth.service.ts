import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors';
import { UserRepository } from '../repositories/user.repository';
import { JwtUtil } from '../utils/jwt.utils';
import { Logger } from '../helpers/logger';
import redis from '../../../config/redis.config';

export class AuthService {
    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }

    processLoginWithEmail = async (email: string, password: string) => {
        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        // Check if user exists and if password is valid
        if (!user || user.password != password)
            //will later use hash passwords
            throw new UnauthorizedError(
                'Invalid login credentials! Please try again',
            );
        // todo: create access_token and refresh_token
        const payload = { id: user.id, email: user.email };
        const access_token = JwtUtil.generateAccessToken(payload);
        const refresh_token = JwtUtil.generateRefreshToken(payload);

        //
        JwtUtil.storeRefreshToken(user.id, refresh_token);

        return {
            access_token,
            refresh_token,
            user,
        };
    };

    //
    processCreateUser = async (
        firstname: string,
        lastname: string,
        email: string,
        password: string,
    ) => {
        // Check if user exists
        const isUserExists = await this.userRepository.findByEmail(email);
        if (isUserExists)
            throw new UnauthorizedError(
                'An account with this email already exists!',
            );

        //
        const result = await this.userRepository.create({
            firstname,
            lastname,
            email,
            password,
        });

        return await this.processLoginWithEmail(result.email, result.password);
    };

    //
    processFetchUser = async (id: string) => {
        return await this.userRepository.findByID(id);
    };

    //
    processRefreshToken = async (refresh_token: string) => {
        const { id, email } = JwtUtil.verifyRefreshToken(refresh_token); // Extract user info from the refresh token
        const storedRefreshToken = await redis.get(`refresh_token:${id}`);
        if (!storedRefreshToken || storedRefreshToken != refresh_token) {
            throw new UnauthorizedError('Invalid or expired token');
        }
        return {
            access_token: JwtUtil.generateAccessToken({ id, email }), // Generate new access token
        };
    };

    //
    processLogout = async (id: string) => {
        await JwtUtil.revokeRefreshToken(id);
        return {
            message: 'Logged out successfully',
        };
    };
}
