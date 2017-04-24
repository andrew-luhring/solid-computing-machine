const path = require('path');


module.exports = {
	context: path.resolve(__dirname, 'js')
, entry: './input/main.js'
, output:{
	 path: path.resolve(__dirname, 'js/output')
	, filename: 'packed.js'
	, publicPath: '/js/output/'
	}
};