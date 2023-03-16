const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 3000,
    compress: false, // gzip压缩
    hot: true, // 热更新
    historyApiFallback: true, // 解决history路由404
    static: {
      directory: path.resolve(__dirname, '../public'),
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      middlewares.unshift({
        name: 'user-info',

        path: '/api/*',
        middleware: (req, res) => {
          const cbPath = './' + req._parsedUrl.path.slice(4) + '.js';
          const cb = require(path.resolve(__dirname, '../mock', cbPath));
          res.send(cb());
        },
      });

      return middlewares;
    },
  },
  plugins: [new ReactRefreshWebpackPlugin()],
});
