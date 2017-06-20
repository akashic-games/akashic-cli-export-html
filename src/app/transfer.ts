import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as ect from "ect";

export interface TransferTemplateParameterObject {
	quiet?: boolean;
	exclude?: string[];
	output?: string;
	force?: boolean;
	logger?: cmn.Logger;
	strip?: boolean;
	bundle?: boolean;
}

interface InnerHTMLAssetData {
	name: string;
	type: string;
	code: string;
}

export function _completeTransferTemplateParameterObject(param: TransferTemplateParameterObject): void {
	param.quiet = param.quiet || false;
}

export function promiseTransfer(options: TransferTemplateParameterObject): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (!options.output) {
			options.logger.error("output path is not defined.");
			return reject("output is not defined.");
		}
		var outputPath = path.resolve(options.output);
		if (!/^\.\./.test(path.relative(process.cwd(), outputPath))) {
			options.logger.error("output path overlaps with source directory.");
			return reject("output is bad path.");
		}

		cmn.ConfigurationFile.read(path.join(process.cwd(), "game.json"), options.logger)
			.then((content) => {
				var conf = new cmn.Configuration({
					content: content
				});

				var innerHTMLAssetsArray: InnerHTMLAssetData[] = [];
				var assets = conf._content.assets;
				var gamejsonPath = path.resolve(outputPath, "./js/game.json.js");

				if (options.bundle) {
					innerHTMLAssetsArray.push({
						name: "game.json",
						type: "text",
						code: encodeURIComponent(JSON.stringify(conf._content, null, "\t"))
					});
				} else {
					fsx.outputFileSync(gamejsonPath, wrapText(JSON.stringify(conf._content, null, "\t"), "game.json"));
					innerHTMLAssetsArray.push({
						name: "./js/game.json.js",
						type: undefined,
						code: undefined
					});
				}

				var assetNames = Object.keys(assets);
				assetNames.filter((assetName) => {
					var type = assets[assetName].type;
					return (type === "script" || type === "text");
				}).forEach((assetName) => {
					var isScript = assets[assetName].type === "script";
					var assetString = fs.readFileSync(assets[assetName].path, "utf8").replace(/\r\n|\n/g, "\n");

					if (options.bundle) {
						if (assets[assetName].type === "text") assetString = encodeURIComponent(assetString);
						innerHTMLAssetsArray.push({
							name: assetName,
							type: assets[assetName].type,
							code: (assets[assetName].type === "script" ? wrap(assetString) : assetString)
						});
					} else {
						var code = (isScript ? wrapScript(assetString, assetName) : wrapText(assetString, assetName));
						var assetPath = assets[assetName].path;
						var relativePath = "./js/assets/" + path.dirname(assetPath) + "/" +
							path.basename(assetPath, path.extname(assetPath)) + (isScript ? ".js" : ".json.js");
						var filePath = path.resolve(outputPath, relativePath);

						fsx.outputFileSync(filePath, code);
						innerHTMLAssetsArray.push({
							name: relativePath,
							type: undefined,
							code: undefined
						});
					}
				});

				if (conf._content.globalScripts) {
					conf._content.globalScripts.forEach((scriptName: string) => {
						var scriptString = fs.readFileSync(scriptName, "utf8").replace(/\r\n|\n/g, "\n");
						var isScript = /\.js$/i.test(scriptName);

						if (options.bundle) {
							var scriptPath = path.resolve("./", scriptName);
							if (path.extname(scriptPath) === ".json") {
								scriptString = encodeURIComponent(scriptString);
							}

							innerHTMLAssetsArray.push({
								name: scriptName,
								type: isScript ? "script" : "text",
								code: isScript ? wrap(scriptString) : scriptString
							});
						} else {
							var code = isScript ? wrapScript(scriptString, scriptName) : wrapText(scriptString, scriptName);
							var relativePath = "./globalScripts/" + scriptName + (isScript ? "" : ".js");
							var filePath = path.resolve(outputPath, relativePath);

							fsx.outputFileSync(filePath, code);
							innerHTMLAssetsArray.push({
								name: relativePath,
								type: undefined,
								code: undefined
							});
						}
					});
				}

				var preloadScripts: string[] = [];
				var postloadScripts: string[] = [];
				if (options.bundle) {
					var preloadScriptsName = ["akashic-engine.strip.js", "game-driver.strip.js", "pdi-browser.strip.js"];
					var postloadScriptsName =
						["LocalScriptAsset.js", "LocalTextAsset.js", "game-storage.strip.js", "logger.js", "sandbox.js", "initGlobals.js"];
					preloadScriptsName.forEach((name) => {
						try {
							var code = fs.readFileSync(
									path.resolve(__dirname, "..", "templates/template-export-html/js", name), "utf8").replace(/\r\n|\n/g, "\n");
							preloadScripts.push(code);
						} catch (e) { throw new Error(e); }
					});
					postloadScriptsName.forEach((name) => {
						try {
							var code = fs.readFileSync(
									path.resolve(__dirname, "..", "templates/template-export-html/js", name), "utf8").replace(/\r\n|\n/g, "\n");
							postloadScripts.push(code);
						} catch (e) { throw new Error(e); }
					});
				}

				var ectRender = ect({root: __dirname + "/../templates", ext: ".ect"});
				var html = ectRender.render("index", {
					assets: innerHTMLAssetsArray,
					isBundle: options.bundle,
					preloadScripts: preloadScripts,
					postloadScripts: postloadScripts
				});

				fs.writeFileSync(path.resolve(outputPath, "./index.html"), html);
				if (options.strip) {
					copyAssetFilesStrip(outputPath, assets, options);
				} else {
					copyAssetFiles(outputPath, options);
				}
				fsx.copySync(
					path.resolve(__dirname, "..", "templates/template-export-html"),
					outputPath,
					{ filter: (filePath: string): boolean => {return !/\.js$/i.test(filePath) || !options.bundle; }});
				resolve();
			})
			.catch((err) => reject(err));
	});
};

function copyAssetFilesStrip(outputPath: string, assets: cmn.Assets, options: TransferTemplateParameterObject): void {
	options.logger.info("copying stripped fileset...");
	var assetNames = Object.keys(assets);
	assetNames.filter((assetName) => {
		return assets[assetName].type !== "script" && assets[assetName].type !== "text";
	}).forEach((assetName) => {
		var assetPath = assets[assetName].path;
		var assetDir = path.dirname(assetPath);
		fsx.mkdirsSync(path.resolve(outputPath, assetDir));
		var dst = path.join(outputPath, assetPath);
		if (assets[assetName].type === "audio") {
			var audioTypes = ["ogg", "mp4", "aac"];
			audioTypes.forEach((type) => {
				try {
					fsx.copySync(
						path.resolve(process.cwd(), assetPath) + "." + type,
						dst + "." + type,
						{clobber: options.force}
					);
				} catch (e) {
					if (e.code !== "ENOENT") {
						options.logger.error("Error while copying: " + e.message);
					}
				}
			});
		} else {
			fsx.copySync(
				path.resolve(process.cwd(), assetPath),
				dst,
				{clobber: options.force}
			);
		}
	});
};

function copyAssetFiles(outputPath: string, options: TransferTemplateParameterObject ): void {
	options.logger.info("copying files...");
	try {
		fsx.copySync(process.cwd(), outputPath, {clobber: options.force});
		fsx.removeSync(path.resolve(outputPath, "script"));
		fsx.removeSync(path.resolve(outputPath, "text"));
	} catch (e) {
		options.logger.error("Error while copying: " + e.message);
	}
}

function wrapScript(code: string, name: string): string {
	return "window.gLocalAssetContainer[\"" +	name + "\"] = function(g) { " + wrap(code) + "}";
}

function wrapText(code: string, name: string): string {
	var PRE_SCRIPT = "window.gLocalAssetContainer[\"" + name + "\"] = \"";
	var POST_SCRIPT = "\"";
	return PRE_SCRIPT + encodeURIComponent(code) + POST_SCRIPT + "\n";
}

function wrap(code: string): string {
	var PRE_SCRIPT = "(function(exports, require, module, __filename, __dirname) {";
	var POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);";
	return PRE_SCRIPT + "\n" + code + "\n" + POST_SCRIPT + "\n";
}
