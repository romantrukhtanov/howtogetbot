import path from 'path';
import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';
import DoteEnvPlugin from 'dotenv-webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { envPath } from './envConfig';

import {
  isBundleAnalyzer,
  isProduction,
  isWatchMode,
} from './envConditions';

const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

const devtool = isProduction ? undefined : 'eval-cheap-module-source-map';
const hashType = isProduction ? 'contenthash' : 'fullhash';

const webpackConfig: Configuration = {
  context: sourcePath,
  mode: isProduction ? 'production' : 'development',
  entry: {
    app: './index.ts',
  },
  output: {
    path: outPath,
    publicPath: '/',
    filename: '[name].server.js',
    chunkFilename: `chunks/[name].[${hashType}].js`,
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: ['node_modules', 'src'],
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: /AbortSignal/,
        },
      }),
    ],
  },
  target: ['node', 'es6'],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [['@babel/preset-env', { modules: false }], '@babel/preset-typescript'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties',
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.(a?png|svg|jpe?g|gif|bmp)$/,
        type: 'asset',
      },
      {
        test: /\.(mp3|mp4|ogg|wav|eot|ttf|woff|woff2|zip|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new DoteEnvPlugin({
      path: envPath,
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false, // load '.env.defaults' as the default values if empty.
    }),
    isProduction &&
      new CleanWebpackPlugin({
        protectWebpackAssets: false,
        cleanAfterEveryBuildPatterns: ['*.js.map'],
      }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
        },
      ],
    }),
    isWatchMode &&
      new NodemonPlugin({
        watch: [path.resolve('./dist')],
        ext: 'js,json',
        ignore: ['*.js.map'],
        delay: 1000,
        verbose: true,
      }),
    isBundleAnalyzer &&
      new BundleAnalyzerPlugin({
        defaultSizes: 'gzip',
      }),
  ].filter((plugin): plugin is Exclude<typeof plugin, false> => Boolean(plugin)),
  devtool,
};

module.exports = webpackConfig;
