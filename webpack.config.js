// webpack.config.js
const { withExpo } = require('@expo/webpack-config');

module.exports = async (env, argv) => {
  const config = await withExpo(env, argv);
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    "app": "./app"
  };
  return config;
};
