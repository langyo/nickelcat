import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from 'nickelcat-action-preset';

export function routeWebSocket(
  entry: string | {
    host?: string,
    port?: string,
    path: string,
    security?: 'wsOnly' | 'wssOnly' | 'auto'
  },
  action: IRuntimeObject
): IRuntimeObject {
  return {
    type: 'preset.routeWebSocket',
    args: { }
  }
}