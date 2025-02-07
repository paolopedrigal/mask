module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["@babel/plugin-transform-flow-strip-types"],
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
        },
      ],
      [
        "module-resolver",
        {
          alias: {
            "@assets": "./assets",
            "@components": "./src/components",
            "@contexts": "./src/contexts",
            "@navigation": "./src/navigation",
            "@store": "./src/store",
            "@screens": "./src/screens",
            "@services": "./src/services",
            "@theme": "./src/theme/",
            "@ts": "./src/ts",
            "@utils": "./src/utils",
          },
          root: ["./"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
      "react-native-reanimated/plugin", // react-native-reanimated/plugin has to be listed last. See more: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/
    ],
  };
};
