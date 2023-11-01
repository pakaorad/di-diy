import app, { NextFunction, Request, Response } from 'express';
import { Inject, Injectable, waitForInjection } from '../../../src/index';

@Injectable('globalService')
class GlobalService {
  constructor() {
    console.log('created global service');
  }

  get() {
    return 'GLOBAL';
  }
}

@Injectable('userService')
class UserService {
  username: string;

  constructor() {
    console.log('created user service');
  }

  set(username: string) {
    this.username = username;
  }

  get() {
    return this.username;
  }
}

class UserMiddleware {
  @Inject()
  userService: UserService;
  constructor() {
    console.log('created middleware');
  }

  processUser(req: Request, res: Response, next: NextFunction) {
    let username = req.query['username'] as string;
    this.userService?.set(username || 'no-username');
    return next();
  }
}

class Controller {
  @Inject()
  userService: UserService;

  @Inject()
  globalService: GlobalService;

  constructor() {
    console.log('created controller');
  }

  bub(req: Request, res: Response, next: NextFunction) {
    return res
      .json({
        username: this.userService?.get(),
        global: this.globalService?.get(),
      })
      .end();
  }
}

async function waitForInjectionMW(req: Request, _res: Response, next: NextFunction) {
  await waitForInjection();
  next();
}

const exampleApp = app();
// app.use(express.json());
// app.use(express.text({ limit: '50mb' }));
exampleApp.use(waitForInjectionMW);
exampleApp.use((req, res, next) => new UserMiddleware().processUser(req, res, next));
exampleApp.use('/', (req, res, next) => new Controller().bub(req, res, next));

exampleApp.listen(3000);
