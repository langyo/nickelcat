import {
  IRuntime
} from '../index';

export function loop(
  testFunc: (
    payload: { [key: string]: any },
    contexts: { [key: string]: any },
    variants: { [key: string]: any }
  ) => boolean,
  task: IRuntime
): IRuntime {
  return (platform, publicContexts) => async (
    payload, contexts, variants
  ) => {
    while (testFunc(payload, contexts, variants)) {
      payload = await task(
        platform, publicContexts
      )(payload, contexts, variants);
    }
    return payload;
  };
}