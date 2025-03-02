import { Router } from 'express';
import { Method } from '../utils/enums';

export interface IRouter {
    router: Router;
    path: string;
    routes: IRoute[];
}

export interface IRoute {
    method: Method;
    route: string;
    middleware?: any[];
    controller: Function;
}
