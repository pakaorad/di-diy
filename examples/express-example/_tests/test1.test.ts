import { expect, assert } from 'chai';
import { InjectionContext, Reset, waitForInjection } from '../../../src/index';
import { equal, notEqual } from 'assert';
import { it } from 'node:test';

it('test1', async () => {
  await injectFakeService('service', '');
  await waitForInjection();
  assert(equal(1, 1));
});

async function injectFakeService(name: string, service: any) {
  let di = InjectionContext.getInstance();
  di.set(name, service);
  await waitForInjection();
  await Reset();
}
