const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./client/index.html", 
  filename: "./index.html"
});
module.exports = (env, argv) => {
  console.log(argv.mode);
  return {
    entry: "./client/index.jsx",
    output: { // NEW
      path: path.join(__dirname, 'dist'),
      filename: "[name].js"
    }, // NEW Ends
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [htmlPlugin],
    module: {
      rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ["babel-loader", "eslint-loader"]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            loader: "file-loader",
            options: { name: '/static/[name].[ext]' }
        }
      ]
    }
  };
};