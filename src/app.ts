import express, { Express } from 'express';
import { IRouter } from './api/v1/interfaces/routers';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { AppDataSource } from './config/typeorm.config';
import { Logger } from './api/v1/helpers/logger';
import { AuthRoute } from './api/v1/routes/auth.routes';
import { ErrorHandler } from './api/v1/middlewares/error.middleware';
import { LoggerMiddleware } from './api/v1/middlewares/logger.middleware';
import { ListingRoute } from './api/v1/routes/listing.routes';

export class App {
    private app: Express;
    private port: number;
    public static use =
        (fn: Function) =>
        (
            req: any,
            res: any,
            next: ((reason: any) => PromiseLike<never>) | null | undefined,
        ): Promise<any> =>
            Promise.resolve(fn(req, res, next)).catch(next);

    constructor() {
        this.app = express();
        this.port = 3001;

        // call other config functions
        this.configureMiddlewares();
        this.configureRoutes([
            new AuthRoute(this.app),
            new ListingRoute(this.app),
        ]);
    }

    private configureMiddlewares(): void {
        this.app.use(LoggerMiddleware);
        this.app.use(cors());
        this.app.use(
            bodyParser.urlencoded({
                extended: false,
            }),
        );
        this.app.use(bodyParser.json());
    }

    private configureRoutes(routers: IRouter[]): void {
        // initialize all routes
        routers.forEach((route): void => {
            this.app.use(route.router);
        });

        // initialize error handler middleware
        this.app.use(ErrorHandler);
    }

    public start(): void {
        // Start database and server
        AppDataSource.initialize()
            .then(async (): Promise<void> => {
                Logger.info(`Database connected...`);
                /* create the server */
                const server = http.createServer(this.app);
                server.listen(this.port, (): void => {
                    Logger.info(`Server is listening on port ${this.port}`);
                });
            })
            .catch((e): never => {
                Logger.error('${e}');
                // stop the server
                AppDataSource.destroy();
                process.exit(1);
            });

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            Logger.error('Shutting down');
            // stop the server
            AppDataSource.destroy();
            process.exit(1);
        });
    }
}
