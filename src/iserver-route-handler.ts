/**
 * Server route handler interface.
 * @param {T} server route handler type.
 */
export interface IServerRouteHandler<T> {
  /**
   * Register handlers for route.
   * @return {T} router - router
   */
  registerHandlers: () => T;
}
