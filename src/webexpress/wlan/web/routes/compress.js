var UglifyJS = require('uglify-js');
var cleanCSS = require('clean-css');
var fs = require('fs'),
	r1 = /^(.+)$/mg, /* 分行 */
	r2 = /\s{2,}/g,/*去空格*/
	r3 = /([^\\])\/\/.*/g,/*去行注释*/
	r4 = /\/\*.*?\*\//g;/*去块注释*/
var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;
module.exports.run = function (input,writePath) {
	var str = '';
	input.forEach(function (item) {
		var data = fs.readFileSync(item, 'utf8'),
			lines = data.match(r1);
		lines.forEach(function (item) {
			item = item.replace(r3, function ($1, $2) { return $2; });
			str = str + item;
		});
	});
	str = str.replace(r2, ' ').replace(r4, '');

	fs.appendFile(writePath, str, { encoding: 'utf8' }, function (err) {
		if (err) { throw err };
		console.log('complete........');
	});
};

module.exports.runcss = function (input,writePath) {
	var str = '';
	input.forEach(function (item) {
		var data = fs.readFileSync(item, 'utf8');
		str += data;
	});

	fs.appendFile(writePath, str, { encoding: 'utf8' }, function (err) {
		if (err) { throw err };
		console.log('complete........');
	});
};

module.exports.cssMinifier = function(flieIn, fileOut) {
	var flieIn=Array.isArray(flieIn)? flieIn : [flieIn];
	var origCode,finalCode='';
	for(var i=0; i<flieIn.length; i++) {
		origCode = fs.readFileSync(flieIn[i], 'utf8');
		finalCode += new cleanCSS().minify(origCode).styles;
	}
	//finalCode = new cleanCSS().minify(flieIn).styles;
	fs.writeFileSync(fileOut, finalCode, 'utf8');
}


module.exports.compressjs = function(flieIn,fileOut){
	var flieIn=Array.isArray(flieIn)? flieIn : [flieIn];
	var result = UglifyJS.minify(flieIn);
	fs.writeFileSync(fileOut, result.code);
};

module.exports.combineJs = function(flieIn,fileOut)
{
	var str = "";
	var data = "";
	var flieIn = Array.isArray(flieIn)? flieIn : [flieIn];
	flieIn.forEach(function(item){
		data = fs.readFileSync(item, 'utf8');
		str = str + data + ';' + '\r\n';
	});
	fs.writeFileSync(fileOut,str);
};