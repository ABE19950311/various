const path = require('path');

module.exports = {
    mode: "development",
    entry: "./index.js",

    output: {
        path: `./dist/`,
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['@babel/preset-env', {
                      'modules': false,
                      'useBuiltIns': 'usage',
                      'corejs': {
                        'version': 3,
                        'proposals': false
                      },
                      'targets': {
                        'node': 'current',
                        'browsers': ['last 2 versions', 'safari >= 7']
                      }
                    }]
                  ]
                }
              }
            ]
          }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: [".js", ".json", ".jsx", ".css"],
    }
}
