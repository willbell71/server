import { ILogger } from '@willbell71/logger';

import { IServerRouteHandler } from './iserver-route-handler';
import { TServerRoute } from './tserver-route';

/**
 * Server interface.
 * @param M - middleware type.
 * @param R - server route handler type.
 */
export interface IServerService<M, R> {
  /**
   * Register middleware.
   * @param {M} middleware - middleware to register.
   */
  registerMiddleware: (middleware: M) => void;

  /**
   * Register middlewares.
   * @param {(M | null)[]} middlewares - sparse list of middleware to register.
   * @return {void}
   */
  registerMiddlewares: (middlewares: (M | null)[]) => void;

  /**
   * Register route
   * @param {string} path - path to register handler for.
   * @param {IServerRouteHandler<R>} handler - handler for path.
   */
  registerRoute: (path: string, handler: IServerRouteHandler<R>) => void;

  /**
   * Register routes.
   * @param {(TServerRoute<express.Router> | null)[]} routes - sparse list of routes to register.
   */
  registerRoutes: (routes: (TServerRoute<R> | null)[]) => void;

  /**
   * Register view engine.
   * @param {string} path - root path for views.
   * @param {string} engine - name of engine to render views.
   */
  registerViewEngine: (path: string, engine: string) => void;

  /**
   * Register static path to serve.
   * @param {string} path - path to serve.
   */
  registerStaticPath: (path: string) => void;

  /**
   * Start server.
   * @param {ILogger} logger - logger service provider.
   * @param {number} port - port number for server to listen on.
   */
  start: (logger: ILogger, port: number) => void;
}
