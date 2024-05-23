module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["@babel/plugin-transform-flow-strip-types"],
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
        },
      ],
      [
        "module-resolver",
        {
          alias: {
            firebaseConfig: "./firebaseConfig.js",
            "@navigation": "./src/navigation",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@assets": "./assets",
            "@redux": "./src/redux",
            "@contexts": "./src/contexts",
            "@_types": "./src/types", // added the underscore to differntiate from @types in node_modules
            "@utils": "./src/utils",
            supabase: "./supabase.ts",
          },
          root: ["./src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
      "react-native-reanimated/plugin", // react-native-reanimated/plugin has to be listed last. See more: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/
    ],
  };
};
