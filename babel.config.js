module.exports = function (api) {
  api.cache(true);
  return {
<<<<<<< HEAD
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
=======
    presets: ['babel-preset-expo']
>>>>>>> restore-point2
  };
};