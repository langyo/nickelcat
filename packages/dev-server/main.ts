import {
  IRequestForwardObjectType
} from './index';

import * as Koa from 'koa';

import { build, send } from './vmLoader';
import { webpackCompilerFactory } from './webpackLoader';
import { staticDepsBuilder } from './staticDepsBuilder';
import { dirWatcher } from './dirWatcher';

import { join } from 'path';

let clientBundleContent: string = '';

const webpackClientSideFunc = webpackCompilerFactory({
  entry: join(process.cwd(), './__nickelcat_defaultClientLoader.js'),
  target: 'web'
});
const webpackServerSideFunc = webpackCompilerFactory({
  entry: join(process.cwd(), './__nickelcat_defaultServerLoader.js'),
  target: 'node'
});

dirWatcher(async () => {
  clientBundleContent = (await webpackClientSideFunc(staticDepsBuilder())).code;
  build(await webpackServerSideFunc(staticDepsBuilder()));
});

const app = new Koa();

app.use(async (ctx: Koa.BaseContext, next: () => Promise<any>) => {
  const { status, code, type, body }: IRequestForwardObjectType =
    await send({
      ip: ctx.ip,
      path: ctx.path,
      query: ctx.query,
      host: ctx.host,
      protocol: ctx.protocol,
      cookies: {
        // BUG - The type declaration file has not defined 'cookies'
        get: (ctx as any).cookies.get,
        set: (ctx as any).cookies.set
      }
    });

  if (status === 'processed') {
    ctx.type = type;
    ctx.body = body;
    ctx.status = code;
  }
  await next();
});

app.listen(+process.env.PORT || 80, process.env.HOST || undefined);