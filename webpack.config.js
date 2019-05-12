function scriptRules () {
    return [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        options: { presets: ['env'] }
      }
    ]
  }
  
  module.exports = {
    entry: [
      './resources/assets/sass/app.scss',
      './resources/assets/scripts/app.js'
    ],
    output: {
      filename: 'public/app.js'
    },
    module: {
      rules: sassRules().concat(scriptRules())
    },
    plugins: [
      extractSass
    ]
}