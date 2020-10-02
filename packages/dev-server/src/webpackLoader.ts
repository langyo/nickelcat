import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { createConfigItem } from '@babel/core';

import { join } from 'path';
import { IUnionFs } from 'unionfs';

export function webpackCompilerFactory(
  webpackConfig: { [key: string]: any }
): (fs: IUnionFs) => Promise<{ code: string, sourceMap: string }> {
  return async function (
    fs: IUnionFs
  ): Promise<{ code: string, sourceMap: string }> {
    const compiler = webpack({
      mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
      context: process.cwd(),
      module: {
        rules: [
          {
            test: /\.[jt]sx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
              presets: [
                createConfigItem(
                  require(join(__dirname, './node_modules/@babel/preset-env'))
                ),
                createConfigItem(
                  require(join(__dirname, './node_modules/@babel/preset-react'))
                ),
                createConfigItem(
                  require(join(__dirname, './node_modules/@babel/preset-typescript'))
                )
              ]
            }
          }
        ]
      },
      resolve: {
        modules: [
          join(__dirname, './node_modules'),
          join(process.cwd(), './node_modules'),
          'node_modules'
        ]
      },
      resolveLoader: {
        modules: [
          join(__dirname, './node_modules'),
          join(process.cwd(), './node_modules'),
          'node_modules'
        ]
      },
      output: {
        filename: 'output.js',
        path: '/'
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
          terserOptions: {
            output: {
              comments: false
            },
          },
          extractComments: false,
          sourceMap: true
        })],
      },
      devtool: 'source-map',
      ...webpackConfig
    });
    compiler.inputFileSystem = fs;
    compiler.outputFileSystem = fs as any;

    return new Promise((resolve, reject) => {
      compiler.run((err: Error, status) => {
        if (err) {
          reject(err);
        }

        else if (status.hasErrors()) {
          const info = status.toJson();
          let errStr = '';
          if (status.hasErrors()) {
            info.errors.forEach((e: string) => errStr += (e + '\n'));
          }
          if (status.hasWarnings()) {
            info.warnings.forEach((e: string) => errStr += (e + '\n'));
          }
          reject(new Error(errStr));
        }

        else {
          fs.readFile('/output.js', { encoding: 'utf8' },
            (err, code) => {
              fs.readFile('/output.js.map', { encoding: 'utf8' },
                (err, sourceMap) => {
                  resolve({
                    code, sourceMap
                  })
                })
            });
        }
      })
    });
  }
};