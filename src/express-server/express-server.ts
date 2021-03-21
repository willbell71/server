import * as http from 'http';
import * as express from 'express';

import { ILogger } from '@willbell71/logger';
import { IServerService } from '../iserver-service';
import { IServerRouteHandler } from '../iserver-route-handler';
import { TServerRoute } from '../tserver-route';

/**
 * Server interface.
 */
export class ExpressServer implements IServerService<express.RequestHandler, express.Router> {
  // http server
  private server?: http.Server;
  // express instance
  private app: express.Express;

  /**
   * Constructor.
   */
  public constructor() {
    this.app = express();
  }

  /**
   * Register middleware.
   * @param {express.RequestHandler} middleware - middleware to register.
   * @return {void}
   */
  public registerMiddleware(middleware: express.RequestHandler): void {
    this.app.use(middleware);
  }

  /**
   * Register middlewares.
   * @param {(express.RequestHandler | null)[]} middlewares - sparse list of middleware to register.
   * @return {void}
   */
  public registerMiddlewares(middlewares: (express.RequestHandler | null)[]): void {
    middlewares
      .forEach((middleware: express.RequestHandler | null): void => {
        if (middleware) this.registerMiddleware(middleware);
      });
  }

  /**
   * Register route
   * @param {string} path - path to register handler for.
   * @param {IServerRouteHandler<express.Router>} handler - handler for path.
   * @return {void}
   */
  public registerRoute(path: string, handler: IServerRouteHandler<express.Router>): void {
    this.app.use(path, handler.registerHandlers());
  }

  /**
   * Register a list of routes.
   * @param {(TServerRoute<express.Router> | null)[]} routes - sparse list of routes to register.
   * @return {void}
   */
  public registerRoutes(routes: (TServerRoute<express.Router> | null)[]): void {
    routes
      .forEach((route: TServerRoute<express.Router> | null) => {
        if (route) this.registerRoute(route.path, route.handler);
      });
  }

  /**
   * Register view engine.
   * @param {string} path - root path for views.
   * @param {string} engine - name of engine to render views.
   * @return {void}
   */
  public registerViewEngine(path: string, engine: string): void {
    this.app.set('views', path);
    this.app.set('view engine', engine);
  }

  /**
   * Register static path to serve.
   * @param {string} path - path to serve.
   */
  public registerStaticPath(path: string): void {
    this.app.use(express.static(path));
  }

  /**
   * Install express error handler and logger, this must be called after all routes are registered.
   * @param {ILogger} logger - logger service provider.
   */
  public registerErrorHandler(logger: ILogger): void {
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error(`Express error handler - ${err.message}`);

      if (res.headersSent) return next(err);

      res.status(400).send(err.message);
    });
  }

  /**
   * Start server.
   * @param {ILogger} logger - logger service provider.
   * @param {number} port - port number for server to listen on.
   * @return {void}
   */
  public start(logger: ILogger, port: number): void {
    // start server
    this.server = http.createServer(this.app);
    this.server.listen(port, () => {
      logger.info('Server', `Express server listening on port ${port}`);
    });
  }
}
