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
import { ListingController } from '../controllers/listing.controller';

export class ListingRoute implements IRouter {
    router = Router();
    controller = new ListingController();
    path: string = '/listing';
    routes: IRoute[] = [
        {
            route: '/',
            method: Method.GET,
            middleware: [],
            controller: this.controller.handleFetchAllProducts,
        },
        {
            route: '/mine',
            method: Method.GET,
            middleware: [authHeaderMiddleware],
            controller: this.controller.handleFetchMyProducts,
        },
        {
            route: '/:id',
            method: Method.GET,
            middleware: [],
            controller: this.controller.handleFetchSingleProduct,
        },
        {
            route: '/',
            method: Method.POST,
            middleware: [authHeaderMiddleware],
            controller: this.controller.handleCreateProduct,
        },
        {
            route: '/:id',
            method: Method.DELETE,
            middleware: [authHeaderMiddleware],
            controller: this.controller.handleDeleteProduct,
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
