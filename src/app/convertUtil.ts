import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as UglifyJS from "uglify-js";

export interface ConvertTemplateParameterObject {
	quiet?: boolean;
	exclude?: string[];
	output?: string;
	force?: boolean;
	logger?: cmn.Logger;
	strip?: boolean;
	minify?: boolean;
	bundle?: boolean;
	magnify?: boolean;
	use?: string;
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

export function encodeText(text: string): string {
	return text.replace(/[\u2028\u2029'"\\\b\f\n\r\t\v]/g, encodeURIComponent);
}

export function wrap(code: string, minify?: boolean): string {
	var PRE_SCRIPT = "(function(exports, require, module, __filename, __dirname) {";
	var POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);";
	var ret = PRE_SCRIPT + "\n" + code + "\n" + POST_SCRIPT + "\n";
	return minify ? UglifyJS.minify(ret, { fromString: true }).code : ret;
}

export function getDefaultBundleScripts(templatePath: string, minify?: boolean): any {
	var preloadScriptNames =
		["akashic-engine.strip.js", "game-driver.strip.js", "pdi-browser.strip.js"];
	var postloadScriptNames =
		["build/LocalScriptAsset.js", "build/LocalTextAsset.js", "game-storage.strip.js", "logger.js", "sandbox.js", "initGlobals.js"];

	var preloadScripts = preloadScriptNames.map((fileName) => loadScriptFile(fileName, templatePath));
	var postloadScripts = postloadScriptNames.map((fileName) => loadScriptFile(fileName, templatePath));
	if (minify) {
		preloadScripts = preloadScripts.map(script => UglifyJS.minify(script, { fromString: true }).code);
		postloadScripts = postloadScripts.map(script => UglifyJS.minify(script, { fromString: true }).code);
	}
	return {
		preloadScripts,
		postloadScripts
	};
}

export function getDefaultBundleStyle(templatePath: string): string {
	const filepath = path.resolve(__dirname, "..", templatePath, "css", "style.css");
	return fs.readFileSync(filepath, "utf8").replace(/\r\n|\r/g, "\n");
}

function loadScriptFile(fileName: string, templatePath: string): string {
	try {
		const filepath = path.resolve(__dirname, "..", templatePath, "js", fileName);
		return fs.readFileSync(filepath, "utf8").replace(/\r\n|\r/g, "\n");
	} catch (e) {
		if (e.code === "ENOENT") {
			throw new Error(fileName + " is not found. Try re-install akashic-cli" + path.resolve(__dirname, "..", templatePath, fileName));
		} else {
			throw e;
		}
	}
}
