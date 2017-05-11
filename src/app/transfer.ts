import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as ect from "ect";

interface InnerHTMLAssetData {
	srcPath: string;
}

export interface TransferTemplateParameterObject {
	quiet?: boolean;
	exclude?: string[];
	output?: string;
	force?: boolean;
	logger?: cmn.Logger;
	strip?: boolean;
}

export function _completeTransferTemplateParameterObject(param: TransferTemplateParameterObject): void {
	param.quiet = param.quiet || false;
}

export function promiseTransfer(options: TransferTemplateParameterObject): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (!options.output) {
			options.logger.error("output path is not defined.");
			reject("output is not defined.");
		}
		var outputPath = path.resolve(options.output);
		if (!/^\.\./.test(path.relative(process.cwd(), outputPath))) {
			options.logger.error("output path overlaps with source directory.");
			reject("output is bad path.");
		}

		cmn.ConfigurationFile.read(path.join(process.cwd(), "game.json"), options.logger)
			.then((content) => {
				var conf = new cmn.Configuration({
					content: content
				});

				var assets = conf._content.assets;
				var innerHTMLAssetsArray: InnerHTMLAssetData[] = [];
				var gamejsonPath = path.resolve(outputPath, "./js/" + "game.json.js");
				fsx.outputFileSync(gamejsonPath, wrapJson(encodeURIComponent(JSON.stringify(conf._content, null, "\t")), "game.json"));

				innerHTMLAssetsArray.push({
					srcPath: "./js/game.json.js"
				});

				var assetNames = Object.keys(assets);
				assetNames.filter((assetName) => {
					var type = assets[assetName].type;
					return (type === "script" || type === "text");
				}).forEach((assetName) => {
					var assetString = fs.readFileSync(assets[assetName].path, "utf8").replace(/\r\n|\n/g, "\n");
					if (assets[assetName].type === "text") assetString = encodeURIComponent(assetString);

					var code = (assets[assetName].type === "script" ? wrapScript(assetString, assetName) : wrapJson(assetString, assetName));
					var filePath = path.resolve(outputPath, "./js/assets/" + assetName + (assets[assetName].type === "script" ? ".js" : ".json.js"));
					fsx.outputFileSync(filePath, code);

					innerHTMLAssetsArray.push({
						srcPath: "./js/assets/" + assetName + (assets[assetName].type === "script" ? ".js" : ".json.js")
					});
				});

				if (conf._content.globalScripts) {
					conf._content.globalScripts.forEach((scriptName: string) => {
						var scriptPath = path.resolve("./", scriptName);
						var scriptString = fs.readFileSync(scriptPath, "utf8").replace(/\r\n|\n/g, "\n");
						if (path.extname(scriptPath) === ".json") scriptString = encodeURIComponent(scriptString);

						var code = /\.js$/i.test(scriptName) ? wrapScript(scriptString, "./" + scriptName) : wrapJson(scriptString, "./" + scriptName);
						var filePath = path.resolve(outputPath, "./globalScripts/" + scriptName + (/\.js$/i.test(scriptName) ? "" : ".js"));
						fsx.outputFileSync(filePath, code);

						innerHTMLAssetsArray.push({
							srcPath: "./globalScripts/" + (/\.js$/i.test(scriptName) ? scriptName : scriptName + ".js")
						});
					});
				}

				var ectRender = ect({root: __dirname + "/../templates", ext: ".ect"});
				var html = ectRender.render("index", {assets: innerHTMLAssetsArray});
				fs.writeFileSync(path.resolve(outputPath, "./index.html"), html);
				if (options.strip) {
					copyAssetFilesStrip(outputPath, assets, options);
				} else {
					copyAssetFiles(outputPath, options);
				}
				resolve();
			})
			.catch((err) => reject(err));
	});

};

function copyAssetFilesStrip(outputPath: string, assets: cmn.Assets, options: TransferTemplateParameterObject): void {
	options.logger.info("copying stripped fileset...");
	var assetNames = Object.keys(assets);
	assetNames.filter((assetName) => {
		return assets[assetName].type !== "script" || assets[assetName].type !== "text";
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
	fsx.copySync(path.resolve(__dirname, "..", "templates/template-export-html"),  outputPath);
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
	fsx.copySync(path.resolve(__dirname, "..", "templates/template-export-html"),  outputPath);
}

function wrapScript(code: string, name: string): string {
	var PRE_SCRIPT = "window.gLocalAssetContainer[\"" +
		name + "\"] = function(g) { (function(exports, require, module, __filename, __dirname) {";
	var POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);}";
	return PRE_SCRIPT + "\r" + code + "\r" + POST_SCRIPT + "\r";
}

function wrapJson(code: string, name: string): string {
	var PRE_SCRIPT = "window.gLocalAssetContainer[\"" + name + "\"] = \"";
	var POST_SCRIPT = "\"";
	return PRE_SCRIPT + code + POST_SCRIPT + "\r";
}
