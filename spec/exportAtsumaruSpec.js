var cmn = require("@akashic/akashic-cli-commons");
var atsumaru = require("../lib/exportAtsumaru");
var path = require("path");
var fs = require("fs");
var fsx = require("fs-extra");
var zip = require("zip");

describe("exportAtsumaru", function () {
	const dirPath = path.join(__dirname, "fixture", "sample_game");
	const outputDirPath = path.join(dirPath, "output");
	var cliParam;
	beforeEach(function() {
		cliParam = {
			logger: undefined,
			cwd: dirPath,
			output: "output",
			hashLength: 20,
			bundle: true,
			copyText: true
		};
	});
	afterEach(function() {
		fsx.removeSync(outputDirPath);
	});
	describe("promiseExportAtsumaru", function () {
		it("output bundeled file(index.html) and hashed files", function (done) {
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest) {
					expect(dest).toBe(outputDirPath);
					expect(fs.existsSync(path.join(outputDirPath, "index.html"))).toBe(true);
					const expectedFilePath = cmn.Renamer.hashFilepath("script/aez_bundle_main.js", 20);
					expect(fs.existsSync(path.join(outputDirPath, expectedFilePath))).toBe(true);
					expect(fs.existsSync(path.join(outputDirPath, "script", "main.js"))).toBe(false);
				})
				.then(done, done.fail);
		});
		it("add information about nicocas to game.json (v1)", function (done) {
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest) {
					expect(dest).toBe(outputDirPath);
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.coe).toBe("0");
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment.external.nicocas).toBe("0");
					expect(gameJson.environment["akashic-runtime"]["version"]).toMatch(/^0\.0\.\d+$/); // TODO: あとで1.1.xに修正
					expect(gameJson.environment["akashic-runtime"]["flavor"]).toBe(undefined);
				})
				.then(done, done.fail);
		});
		it("add information about nicocas to game.json (v2)", function (done) {
			const targetDirPath = path.join(__dirname, "fixture", "sample_game_v2");
			const outputDirPath = path.join(targetDirPath, "output");
			Promise.resolve()
				.then(function () {
					cliParam.cwd = targetDirPath;
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest) {
					expect(dest).toBe(outputDirPath);
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.coe).toBe("0");
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment.external.nicocas).toBe("0");
					expect(gameJson.environment["akashic-runtime"]["version"]).toMatch(/^1\.0\.\d+$/); // TODO: あとで2.1.xに修正
					expect(gameJson.environment["akashic-runtime"]["flavor"]).toBe("-canvas");
				})
				.then(function() {
					fsx.removeSync(outputDirPath);
				})
				.then(done, done.fail);
		});
		it("does not add akashic-runtime-information about nicocas to game.json, if it is already written", function (done) {
			const targetDirPath = path.join(__dirname, "fixture", "sample_game_with_akashic_runtime");
			const outputDirPath = path.join(targetDirPath, "output");
			Promise.resolve()
				.then(function () {
					cliParam.cwd = targetDirPath;
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest) {
					expect(dest).toBe(outputDirPath);
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.coe).toBe("0");
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment.external.nicocas).toBe("0");
					expect(gameJson.environment["akashic-runtime"]["version"]).toBe("1.0.9-beta");
					expect(gameJson.environment["akashic-runtime"]["flavor"]).toBe(undefined);
				})
				.then(function() {
					fsx.removeSync(outputDirPath);
				})
				.then(done, done.fail);
		});
		it("create zip when output destination includes '.zip'", function (done) {
			cliParam["output"] = outputDirPath + ".zip";
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest) {
					expect(dest).toBe(outputDirPath + ".zip");
					const files = zip.Reader(fs.readFileSync(outputDirPath + ".zip")).toObject('utf8');
					const fileNames = Object.keys(files);
					expect(fileNames).toContain("output/game.json");
					expect(fileNames).toContain("output/index.html");
					const expectedFilePath = cmn.Renamer.hashFilepath("script/aez_bundle_main.js", 20);
					expect(fileNames).toContain("output/" + expectedFilePath);
				})
				.then(function() {
					fsx.removeSync(outputDirPath + ".zip");
				})
				.then(done, done.fail);
		});
		it("throw error when output destination is not specified", function (done) {
			delete cliParam["output"];
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function () {
					return done.fail();
				})
				.catch(function (err) {
					expect(err.message).toBe("--output option must be specified.");
					done();
				});
		});
	});
});
