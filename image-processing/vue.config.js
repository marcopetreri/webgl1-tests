module.exports = {
  lintOnSave: false,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(glsl|vs|fs)$/,
          loader: 'shader-loader',
        },
      ],
    },
  },
};
