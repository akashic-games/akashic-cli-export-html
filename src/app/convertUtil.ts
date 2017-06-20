import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";

export interface ConvertTemplateParameterObject {
	quiet?: boolean;
	exclude?: string[];
	output?: string;
	force?: boolean;
	logger?: cmn.Logger;
	strip?: boolean;
	bundle?: boolean;
}

export function extractAssetDefinitions (conf: cmn.Configuration, type: string): string[] {
	var assets = conf._content.assets;
	var assetNames = Object.keys(assets);
	return assetNames.filter((assetName) => assets[assetName].type === type);
}

export function resolveOutputPath(output: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		if (!output) {
			return reject("output is not defined.");
		}
		var resolvedPath = path.resolve(output);
		if (!/^\.\./.test(path.relative(process.cwd(), resolvedPath))) {
			return reject("output path overlaps with source directory.");
		}
		return resolve(resolvedPath);
	});
}

export function copyAssetFilesStrip(outputPath: string, assets: cmn.Assets, options: ConvertTemplateParameterObject): void {
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

export function copyAssetFiles(outputPath: string, options: ConvertTemplateParameterObject ): void {
	options.logger.info("copying files...");
	const scriptPath = path.resolve(outputPath, "script");
	const textPath = path.resolve(outputPath, "text");
	const filterFunc = (src: string, dest: string) => {
		return src.indexOf(scriptPath) === -1 && src.indexOf(textPath) === -1;
	};
	try {
		// fs-extraのd.tsではCopyFilterにdest引数が定義されていないため、anyにキャストする
		(<any>(fsx.copySync))(process.cwd(), outputPath, {overwrite: options.force, filter: filterFunc});
	} catch (e) {
		options.logger.error("Error while copying: " + e.message);
	}
}

export function wrap(code: string): string {
	var PRE_SCRIPT = "(function(exports, require, module, __filename, __dirname) {";
	var POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);";
	return PRE_SCRIPT + "\n" + code + "\n" + POST_SCRIPT + "\n";
}

export function getDefaultBundleScripts(): any {
	var preloadScriptNames =
		["akashic-engine.strip.js", "game-driver.strip.js", "pdi-browser.strip.js"];
	var postloadScriptNames =
		["LocalScriptAsset.js", "LocalTextAsset.js", "game-storage.strip.js", "logger.js", "sandbox.js", "initGlobals.js"];

	var preloadScripts = preloadScriptNames.map(loadScriptFile);
	var postloadScripts = postloadScriptNames.map(loadScriptFile);
	return {
		preloadScripts,
		postloadScripts
	};
}

function loadScriptFile(fileName: string): string {
	try {
		return fs.readFileSync(
			path.resolve(__dirname, "..", "templates/template-export-html/js", fileName), "utf8").replace(/\r\n|\r/g, "\n");
	} catch (e) {
		if (e.code === "ENOENT") {
			throw new Error(fileName + " is not found. Try re-install akashic-cli");
		} else {
			throw e;
		}
	}
}
