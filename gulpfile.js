var gulp = require("gulp");
var path = require("path");
var del = require("del");
var tslint = require("gulp-tslint");
var jasmine = require("gulp-jasmine");
var istanbul = require("gulp-istanbul");
var shell = require("gulp-shell");
var reporters = require("jasmine-reporters");
var Reporter = require("jasmine-terminal-reporter");
var expect = require("gulp-expect-file");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var gutil = require('gulp-util');
var browserify = require("browserify");
var source = require('vinyl-source-stream');

gulp.task("install:typings", shell.task(["gulp install:typings:src", "gulp install:typings:spec"]));

gulp.task("install:typings:src", shell.task("typings install"));

gulp.task("install:typings:spec", shell.task("typings install", { cwd: "spec/" }));

gulp.task("clean", function(cb) { del(["lib", "spec/build"], cb); });

gulp.task("clean:typings", function (cb) { del(["typings", "spec/typings"], cb); });

gulp.task("compile", ["compileApp", "compileExport"]);

gulp.task("compileApp", shell.task("tsc -p ./", {cwd: __dirname}));

gulp.task("compileExport", ["compileExport:build"], shell.task("tsc -p ./src/export/", {cwd: __dirname}));

gulp.task("compileExport:build", function() {
	return gulp.src(["templates/template-export-html-v1/js/LocalScriptAsset.js", "templates/template-export-html-v1/js/LocaltextAsset.js"])
		.pipe(gulp.dest("./templates/template-export-html-v1/js/"));
});

gulp.task("compileSpec", ["compile"], shell.task("tsc", {cwd: path.join(__dirname, "spec")})); 

gulp.task("lint", function(){
	return gulp.src("src/**/*.ts")
		.pipe(tslint())
		.pipe(tslint.report());
});

gulp.task("lint-md", function(){
	return gulp.src(["**/*.md", "!node_modules/**/*.md"])
		.pipe(shell(["mdast <%= file.path %> --frail --no-stdout --quiet"]));
});

gulp.task("test", ["compileSpec"], function(cb) {
	var jasmineReporters = [ new Reporter({
			isVerbose: true,
			showColors: true,
			includeStackTrace: true
		}),
		new reporters.JUnitXmlReporter()
	];
	gulp.src(["lib/**/*.js"])
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on("finish", function() {
			gulp.src("spec/**/*[sS]pec.js")
				.pipe(jasmine({ reporter: jasmineReporters}))
				.pipe(istanbul.writeReports({ reporters: ["text", "cobertura", "lcov"] }))
				.on("end", cb);
		});
});

gulp.task("copy", ["copy:minify"], function(cb){
	del(["./templates/template-export-html-v2/js/akashic-engine.js"], cb);
});

gulp.task("copy:minify", ["copy:browserify"], function () {
	var files = [
		"templates/template-export-html-v2/js/akashic-engine.js",
		"node_modules/@akashic/game-driver/build/game-driver.js",
		"node_modules/@akashic/game-storage/build/game-storage.js",
		"node_modules/@akashic/pdi-browser/build/pdi-browser.js"
	];
	return gulp.src(files)
		.pipe(expect(files))
		.pipe(uglify({
			mangle: false,
			preserveComments: "license",
			output: {
				beautify: true
			}
		}))
        .pipe(rename({extname: ".strip.js"}))
        .pipe(gulp.dest("./templates/template-export-html-v2/js/"));
});

gulp.task("copy:browserify", function () {
	return browserify()
		.require("./node_modules/@akashic/akashic-engine/lib/main.node.js", {expose: "@akashic/akashic-engine"})
		.bundle()
		.pipe(source("akashic-engine.js"))
		.on("error", gutil.log)
		.pipe(gulp.dest("./templates/template-export-html-v2/js/"));
});

gulp.task("default", ["compile"]);
