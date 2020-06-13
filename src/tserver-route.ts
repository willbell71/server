import { IServerRouteHandler } from './iserver-route-handler';

/**
 * Server route.
 * @property {string} path - route url.
 * @property {IServerRouteHandler<T>} handler - router handler.
 */
export type TServerRoute<T> = {
  path: string;
  handler: IServerRouteHandler<T>;
};
