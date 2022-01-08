const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "production",
  entry: ["./src/index.js"],
  devtool: "source-map",
  plugins: [new HtmlWebpackPlugin({
    title: 'MyGlobe',
    filename: 'index.html'
  })],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./dist"),
  },
};

