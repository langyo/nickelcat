import {
  IRuntimeFunc,
  IPlatforms
} from './index';
import { getPlatform } from './contextManager';

let actions: { [actionName: string]: IRuntimeFunc } = {};
let actionPlatformTags: { [actionName: string]: string[] } = {};

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

  if (typeof actionPlatformTags[type] === 'undefined') {
    actionPlatformTags[type] = [];
  }
  actionPlatformTags[type].push(platform);
}


export function hasAction(
  type: string, platform: IPlatforms
): boolean {
  return typeof actionPlatformTags[type] !== 'undefined' &&
    actionPlatformTags[type].indexOf(platform) >= 0;
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