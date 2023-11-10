import { it } from 'node:test';
import assert from 'node:assert';
import { Inject, Injectable, InjectionContext, waitForInjection } from '../src';

@Injectable('first')
class TestService1 implements TestInterface {
  test(): string {
    return 'test1';
  }
}

@Injectable('second')
class TestService2 implements TestInterface {
  test(): string {
    return 'test2';
  }
}

class TestClass {
  @Inject('first')
  test1: TestService2;
  @Inject('second')
  test2: TestService1;

  constructor() {
    console.log('once');
  }

  test() {
    return [this.test1.test(), this.test2.test()];
  }
}

interface TestInterface {
  test(): string;
}

it('injection by string', async t => {
  let o = new TestClass();
  await waitForInjection();
  let ar = o.test();
  assert.equal(ar[0], 'test1');
  assert.equal(ar[1], 'test2');
  assert.equal(1, 1);
});
