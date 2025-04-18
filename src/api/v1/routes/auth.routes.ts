import { Router, Express } from 'express';
import { IRoute, IRouter } from '../interfaces/routers';
import { App } from '../../../app';
import { Method } from '../utils/enums';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import {
    loginUserSchema,
    registerUserSchema,
} from '../validations/userValidation';
import { authHeaderMiddleware } from '../middlewares/auth.middleware';

export class AuthRoute implements IRouter {
    router = Router();
    controller = new AuthController();
    path: string = '/auth';
    routes: IRoute[] = [
        {
            route: '/login',
            method: Method.POST,
            middleware: [validateBody(loginUserSchema)],
            controller: this.controller.handleLoginWithEmail,
        },
        {
            route: '/register',
            method: Method.POST,
            middleware: [validateBody(registerUserSchema)],
            controller: this.controller.handleCreateUser,
        },
        {
            route: '/profile',
            method: Method.GET,
            middleware: [authHeaderMiddleware],
            controller: this.controller.handleFetchProfile,
        },
        {
            route: '/refresh-token',
            method: Method.GET,
            middleware: [authHeaderMiddleware],
            controller: this.controller.handleRefreshToken,
        },
        {
            route: '/logout',
            method: Method.DELETE,
            middleware: [authHeaderMiddleware],
            controller: this.controller.handleLogout,
        },
    ];

    public constructor(app: Express) {
        app.use(this.path, this.router);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.routes.forEach(route => {
            this.router[route.method](
                route.route,
                ...route.middleware,
                App.use(route.controller),
            );
        });
    }
}
