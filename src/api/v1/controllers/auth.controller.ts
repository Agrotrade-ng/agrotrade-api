import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors';

export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    handleLoginWithEmail = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {
        const { email, password } = req.body;
        const result = await this.service.processLoginWithEmail(
            email,
            password,
        );

        return res.status(200).send({
            message: 'Login successful',
            data: result,
        });
    };

    //
    handleCreateUser = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {
        const { firstname, lastname, email, password } = req.body;
        const result = await this.service.processCreateUser(
            firstname,
            lastname,
            email,
            password,
        );

        return res.status(201).send({
            message: 'Signup successful',
            data: result,
        });
    };

    //
    handleFetchProfile = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {
        const result = await this.service.processFetchUser(req.params.id);
        return res.status(200).send({
            message: 'Profile fetched successfully',
            data: result,
        });
    };

    //
    handleRefreshToken = async (
        req: Request,
        res: Response,
    ): Promise<Response> => {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            throw new UnauthorizedError('Refresh token is missing');
        }

        const result = await this.service.processRefreshToken(refresh_token);
        return res.status(200).send({
            message: 'Token refreshed successfully',
            data: result,
        });
    };

    //
    handleLogout = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        await this.service.processLogout(id);
        return res.status(200).send({
            message: 'Logout successfully',
        });
    };
}
