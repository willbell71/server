jest.mock('http', () => {
  const listen: jest.Mock = jest.fn().mockImplementation((port: number, cb: () => void) => cb());
  
  const createServer: jest.Mock = jest.fn().mockImplementation(() => ({
    listen
  }));
    
  return {
    createServer
  };
});
import * as http from 'http';

jest.mock('express', () => {
  const use: jest.Mock = jest.fn();
  const set: jest.Mock = jest.fn();
  const Router: jest.Mock = jest.fn();
  const fakeStatic: jest.Mock = jest.fn().mockImplementation(() => 'fakeStatic');

  type FakeExpress = {
    Router: jest.Mock;
  };

  const express: unknown = jest.fn().mockImplementation(() => ({
    use,
    set,
    Router
  }));

  (express as FakeExpress).Router = Router;
  (express as {static: jest.Mock})['static'] = fakeStatic;

  return express;
});
import * as express from 'express';

import { ExpressServer } from './express-server';

import { ILogLine, ILogger, Logger } from '@willbell71/logger';

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let server: ExpressServer;
beforeEach(() => {
  logLineSpy = jest.fn();
  warnLineSpy = jest.fn();
  errorLineSpy = jest.fn();
  assertLineSpy = jest.fn();

  log = {log: logLineSpy};
  warn = {log: warnLineSpy};
  error = {log: errorLineSpy};
  assert = {log: assertLineSpy};
  logger = new Logger(log, warn, error, assert);

  server = new ExpressServer();
});
afterEach(() => {
  jest.restoreAllMocks();
  (express().use as jest.Mock).mockClear();
  (http.createServer().listen as jest.Mock).mockClear();
  (http.createServer as jest.Mock).mockClear();
});

describe('ExpressServer', () => {
  describe('registerMiddleware', () => {
    it('should call app use', () => {
      server.registerMiddleware((): void => {});

      expect(express().use).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerMiddlewares', () => {
    it('should call app use for each middleware', () => {
      server.registerMiddlewares([(): void => {}, (): void => {}]);

      expect(express().use).toHaveBeenCalledTimes(2);
    });

    it('should NOT call app use for NULL middleware', () => {
      server.registerMiddlewares([(): void => {}, null]);

      expect(express().use).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerRoute', () => {
    it('should call app use', () => {
      server.registerRoute('', {
        registerHandlers: () => express.Router()
      });

      expect(express().use).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerRoutes', () => {
    it('should call app use for each route', () => {
      server.registerRoutes([
        { path: '', handler: { registerHandlers: (): express.Router => express.Router() } },
        { path: '', handler: { registerHandlers: (): express.Router => express.Router() } }
      ]);

      expect(express().use).toHaveBeenCalledTimes(2);
    });

    it('should NOT call app use for NULL route', () => {
      server.registerRoutes([
        { path: '', handler: { registerHandlers: (): express.Router => express.Router() } },
        null
      ]);

      expect(express().use).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerViewEngine', () => {
    it('should call app set', () => {
      server.registerViewEngine('path', 'engine');

      expect(express().set).toHaveBeenCalledTimes(2);
      expect(express().set).toHaveBeenNthCalledWith(1, 'views', 'path');
      expect(express().set).toHaveBeenNthCalledWith(2, 'view engine', 'engine');
    });
  });

  describe('registerStaticPath', () => {
    it('should call express static', () => {
      server.registerStaticPath('path');

      expect(express.static).toHaveBeenCalledTimes(1);
      expect(express.static).toHaveBeenCalledWith('path');
    });

    it('should call app use', () => {
      server.registerStaticPath('path');

      expect(express().use).toHaveBeenCalledTimes(1);
      expect(express().use).toHaveBeenCalledWith('fakeStatic');
    });
  });

  describe('start', () => {
    it('should call create server', () => {
      server.start(logger, 3000);

      expect(http.createServer).toHaveBeenCalledTimes(1);
    });

    it('should call listen', () => {
      server.start(logger, 3000);

      expect(http.createServer().listen).toHaveBeenCalledTimes(1);
    });

    it('should call logger', () => {
      server.start(logger, 3000);

      expect(logLineSpy).toHaveBeenCalled();
    });
  });
});
