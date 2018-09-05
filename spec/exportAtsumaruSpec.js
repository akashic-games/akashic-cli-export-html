var cmn = require("@akashic/akashic-cli-commons");
var atsumaru = require("../lib/exportAtsumaru");
var path = require("path");
var fs = require("fs");
var fsx = require("fs-extra");

describe("exportAtsumaru", function () {
	const dirPath = path.join(__dirname, "fixture", "sample_game");
	const outputDirPath = path.join(dirPath, "output");
	const cliParam = {
		logger: undefined,
		cwd: dirPath,
		output: outputDirPath,
		hashLength: 20,
		bundle: true,
		copyText: true
	};
	afterEach(function() {
		fsx.removeSync(outputDirPath);
	});
	describe("promiseExportAtsumaru", function () {
		it("output bundeled file(index.html) and hashed files", function (done) {
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function () {
					expect(fs.existsSync(path.join(outputDirPath, "index.html"))).toBe(true);
					const expectedFilePath = cmn.Renamer.hashBasename("script/aez_bundle_main.js", 20);
					expect(fs.existsSync(path.join(outputDirPath, expectedFilePath))).toBe(true);
					expect(fs.existsSync(path.join(outputDirPath, "script", "main.js"))).toBe(false);
				})
				.then(done, done.fail);
		});
		it("add information about nicocas to game.json", function (done) {
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function () {
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.coe).toBe("0");
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment.external.nicocas).toBe("0");
					expect(gameJson.environment["akashic-runtime"]).toBe("0.0.11");
				})
				.then(done, done.fail);
		});
		it("throw error when output destination is not specified", function (done) {
			const invalidCliParam = cliParam;
			delete invalidCliParam["output"];
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(invalidCliParam);
				})
				.then(function () {
					return done.fail()
				})
				.catch(function (err) {
					expect(err).toBe("--output option must be specified.");
					done();
				});
		});
	});
});
