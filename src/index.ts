import { setTimeout } from 'timers/promises';

const WAIT_TIME = 100000;

export class InjectionContext {
  private static __instance: InjectionContext;
  private di = {} as { [state: string]: any };
  private ready = false;
  private stack = [] as Array<() => Promise<void>>;
  /**
   * Checks if everything is ready
   * TODO: add a timeout error
   * @returns true when all dependencies are injected
   */
  async isReady() {
    return this.ready;
  }

  async reset() {
    this.ready = false;
  }

  set(name: string, obj: any) {
    this.di[name] = obj;
  }

  has(name: string) {
    return new Boolean(this.di[name]).valueOf();
  }

  async get(name: string) {
    return this.di[name];
  }

  async injectLater(target: any, name: string) {
    let attempts = 0;
    while (!this.has(name) && attempts < WAIT_TIME) {
      await setTimeout(30);
      attempts++;
    }
    target[name] = await this.get(name);
  }

  inject(target: any, name: string) {
    this.stack.push(() => {
      let pi = this.injectLater(target, name);
      return pi;
    });
  }

  async collapse() {
    let pisList = this.stack.map(a => a());
    await Promise.all(pisList);
    // this.stack = [];
    this.ready = true;
  }

  static getInstance() {
    InjectionContext.__instance = InjectionContext.__instance || new InjectionContext();
    return InjectionContext.__instance;
  }
}

export function Inject(name?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    InjectionContext.getInstance().inject(target, name || propertyKey);
  } as any;
}

export function InjectParam(name: string) {
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    InjectionContext.getInstance().inject(target, name);
  } as any;
}

export function Injectable(name: string) {
  return function (target: any) {
    InjectionContext.getInstance().set(name, new target());
  };
}

// export async function waitForInjectionMW(req: Request, _res: Response, next: NextFunction) {
//   await waitForInjection();
//   next();
// }

export async function waitForInjection() {
  let di = InjectionContext.getInstance();
  if (!(await di.isReady())) {
    await InjectionContext.getInstance().collapse();
  }
}

export async function Reset() {
  let di = InjectionContext.getInstance();
  await di.reset();
}
