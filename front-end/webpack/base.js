const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'), // 入口文件
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
    publicPath: isDev ? '/' : './',
  },
  module: {
    rules: [
      // jsx tsx js
      {
        test: /\.[tj]sx?$/,
        use: {
          loader: 'babel-loader',
          // babel设置放在 babel.config.js
        },
        exclude: /node_modules/,
      },
      // css
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
          },
        ],
      },
      // sass
      {
        test: /\.s[ca]ss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            // postcss 设置放在 postcss.config.js
          },
          'sass-loader',
        ],
      },
      // 匹配图片文件
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/images/[name][contenthash:8][ext]', // 文件输出目录和命名
        },
      },
      // 匹配字体图标文件
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/fonts/[name][contenthash:8][ext]', // 文件输出目录和命名
        },
      },
      // 匹配媒体文件
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/media/[name][contenthash:8][ext]', // 文件输出目录和命名
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    // 查找第三方模块只在本项目的node_modules中查找 ,提升编译速度
    modules: [path.resolve(__dirname, '../node_modules')],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true,
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
    }),
  ],
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
};
