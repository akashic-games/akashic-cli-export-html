import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as ect from "ect";

interface InnerHTMLAssetData {
	name: string;
	type: string;
	code: string;
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
				innerHTMLAssetsArray.push({
					name: "game.json",
					type: "text",
					code: escape(JSON.stringify(conf._content, null, "\t"))
				});

				var assetNames = Object.keys(assets);
				assetNames.filter((assetName) => {
					var type = assets[assetName].type;
					return (type === "script" || type === "text");
				}).forEach((assetName) => {
					var assetString = fs.readFileSync(assets[assetName].path, "utf8").replace(/\r\n|\n/g, "\n");
					if (assets[assetName].type === "text") assetString = escape(assetString);

					innerHTMLAssetsArray.push({
						name: assetName,
						type: assets[assetName].type,
						code: (assets[assetName].type === "script" ? wrap(assetString) : assetString)
					});
				});

				if (conf._content.globalScripts) {
					conf._content.globalScripts.forEach((scriptName: string) => {
						var scriptPath = path.resolve("./", scriptName);
						var scriptString = fs.readFileSync(scriptPath, "utf8").replace(/\r\n|\n/g, "\n");

						if (path.extname(scriptPath) === ".json") {
							scriptString = escape(filterUnparsablePath(scriptString));
						}

						innerHTMLAssetsArray.push({
							name: "./" + scriptName,
							type: (/\.js$/i.test(scriptName) ? "script" : "text"),
							code: (/\.js$/i.test(scriptName) ? wrap(scriptString) : scriptString)
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
					if (e.code !== "ENOENT" && e.code !== "EEXIT") {
						options.logger.error("Error while copying: " + e);
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
		options.logger.error("Error while copying: " + e);
	}
	fsx.copySync(path.resolve(__dirname, "..", "templates/template-export-html"),  outputPath);
}

function wrap(code: string): string {
	var PRE_SCRIPT = "(function(exports, require, module, __filename, __dirname) {";
	var POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);";
	return PRE_SCRIPT + "\r" + code + "\r" + POST_SCRIPT + "\r";
}

function filterUnparsablePath(assetString: string): string {
	return assetString.replace(/\\\\/g, "/"); // Windows環境では、インストールされたモジュールの package.json の _where や _args プロパティに \\ 区切りのパスが挿入される
}

function escape(code: string): string {
	return encodeURIComponent(code.replace(/\\n/g, ""));
}
