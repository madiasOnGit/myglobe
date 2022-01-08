const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: ["./src/index.js"],
  devtool: "inline-source-map",
  plugins: [new HtmlWebpackPlugin({
    title: 'MyGlobe',
    filename: 'indexDev.html'
  })],
  output: {
    filename: "mainDev.js",
    path: path.resolve(__dirname, "./dist"),
  },
};