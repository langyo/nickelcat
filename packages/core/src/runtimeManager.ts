import {
  IRuntimeObject,
  IRuntimeFunc,
  IPlatforms
} from './index';
import {
  getPlatform,
  getContexts
} from './contextManager';

let runtimes: {
  [tag: string]: {
    [actionName: string]: IRuntimeObject
  }
} = {};
let actions: {
  [key: string]: IRuntimeFunc
} = {};

export function loadRuntime(
  runtime: IRuntimeObject,
  tag: string,
  name: string
): void {
  if (typeof runtime[getPlatform()] !== 'undefined') {
    runtimes[tag][name] = runtime[getPlatform()];
  }
};

export function registerAction(
  type: string,
  platform: IPlatforms | '*',
  runtime: IRuntimeFunc
) {
  if (platform === getPlatform() || platform === '*') {
    actions[type] = runtime;
  }
  else {
    actions[type] = () => async payload => payload
  }
}

export function getRuntimeList(tag: string): string[] {
  if (typeof runtimes[tag] === 'undefined') {
    throw new Error(`Unknown tag '${tag}' at the getPlatform() '${getPlatform()}'.`);
  }
  return Object.keys(runtimes[tag]);
}

export function hasRuntime(
  tag: string, streamName: string
): boolean {
  if (
    typeof runtimes[tag] === 'undefined' ||
    typeof runtimes[tag][streamName] === 'undefined'
  ) {
    return false;
  } else {
    return true;
  }
}

export async function runAction(
  type: string,
  args: { [key: string]: any },
  payload: { [key: string]: any },
  variants: { [key: string]: any }
): Promise<{ [key: string]: any }> {
  if (typeof actions[type] === 'undefined') {
    throw new Error(
      `Unknown action '${type}' at the getPlatform() '${getPlatform()}'.`
    );
  }
  return await actions[type](args)(payload, variants);
};

export async function runRuntime(
  tag: string,
  name: string,
  payload: { [key: string]: any },
  variants: { [key: string]: any }
) {
  const { type, args } = runtimes[tag][name];
  return await runAction(type, args, payload, variants);
}
