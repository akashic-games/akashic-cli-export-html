var UglifyJS = require('uglify-js');
var path = require("path");
var fs = require("fs");

function minify(filepath) {
	return UglifyJS.minify(filepath, {
		mangle: false,
		output: {
			comments: "license",
			beautify: true
		}
	});
};

var files = [
	"js/akashic-engine.js",
	"node_modules/@akashic/game-driver/build/game-driver.js",
	"node_modules/@akashic/game-storage/build/game-storage.js",
	"node_modules/@akashic/pdi-browser/build/pdi-browser.js"
];

var templateName = process.argv[2];
if (!templateName) process.exit(1);

files.forEach(filepath => {
	const outputPath = path.resolve(process.cwd(), "../../templates-build/", templateName, "js", path.basename(filepath, ".js") + ".strip.js");
	fs.writeFileSync(outputPath, minify(filepath).code);
});
