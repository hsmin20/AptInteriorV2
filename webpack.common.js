const path = require('path');

module.exports = {
    entry: './src/AptInterior.js',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
			    test: /\.(png|svg|jpg|jpeg|gif)$/i,
			    type: 'asset/resource',
			},
			{ 
				test: /\.(glb|bin)$/, 
				loader: 'file-loader', 
				options: { esModule: false } 
			},
			{
				test: /\.(ogg|mp3|wav|mpeg)$/i,
				loader: 'file-loader',
				options: {
				name: '[name].[ext]'
				},
			},
			{
				test: /\.(csv|tsv)$/i,
				use: ['csv-loader'],
			},
			{
				test: /\.xml$/i,
				use: ['xml-loader'],
			},
        ],
    },
    resolve: {
        alias: {
            three: path.resolve('./node_modules/three')
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'aptinteriorall.js',
        path: path.resolve(__dirname, './dist'),
    },
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
    },
    externals: {
      vscode: 'commonjs vscode'
    },
    resolve: {
      // support reading TypeScript and JavaScript files
      mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
      extensions: ['.ts', '.js'],
      alias: {
        // provides alternate implementation for node module and source files
      },
      fallback: {
      }
    },

    mode: 'development'
};