const path = require('path');

module.exports = {
  // Entry point for your app
  entry: './src/index.js',
  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!framer-motion)/, // Exclude all node_modules except framer-motion
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],  // Add preset-env here
          },
        },
      },
      // Other rules can go here...
    ],
  },
  resolve: {
    // Add any necessary resolve configurations, like extensions or aliasing
  },
  // Other configurations like plugins, devServer, etc. can be added here
};
