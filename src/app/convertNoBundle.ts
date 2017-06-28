import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as ect from "ect";
import { ConvertTemplateParameterObject, copyAssetFilesStrip, copyAssetFiles, wrapScript, wrapText,
	getOutputPath, readAssets, readGlobalScripts } from "./convertUtil";

export async function promiseConvertNoBundle(options: ConvertTemplateParameterObject): Promise<void> {
	var content = await cmn.ConfigurationFile.read(path.join(process.cwd(), "game.json"), options.logger);
	var conf = new cmn.Configuration({
		content: content
	});
	var assetPaths: string[] = [];
	var outputPath = await getOutputPath(options);

	var gamejsonPath = path.resolve(outputPath, "./js/game.json.js");
	fsx.outputFileSync(gamejsonPath, wrapText(JSON.stringify(conf._content, null, "\t"), "game.json"));
	assetPaths.push("./js/game.json.js");

	assetPaths = await readAssets(assetPaths, conf, outputPath, assetProcessor);
	if (conf._content.globalScripts) {
		assetPaths = await readGlobalScripts(assetPaths, conf, outputPath, globalScriptsProcessor);
	}

	writeEct(assetPaths, outputPath, conf);
	writeCommonFiles(outputPath, conf, options);
}

function assetProcessor(assetName: string, conf: cmn.Configuration, outputPath: string): string {
	var assets = conf._content.assets;
	var isScript = assets[assetName].type === "script";
	var assetString = fs.readFileSync(assets[assetName].path, "utf8").replace(/\r\n|\r/g, "\n");

	var code = (isScript ? wrapScript(assetString, assetName) : wrapText(assetString, assetName));
	var assetPath = assets[assetName].path;
	var relativePath = "./js/assets/" + path.dirname(assetPath) + "/" +
		path.basename(assetPath, path.extname(assetPath)) + (isScript ? ".js" : ".json.js");
	var filePath = path.resolve(outputPath, relativePath);

	fsx.outputFileSync(filePath, code);
	return relativePath;
}

function globalScriptsProcessor(scriptName: string, outputPath: string): string {
	var scriptString = fs.readFileSync(scriptName, "utf8").replace(/\r\n|\r/g, "\n");
	var isScript = /\.js$/i.test(scriptName);

	var code = isScript ? wrapScript(scriptString, scriptName) : wrapText(scriptString, scriptName);
	var relativePath = "./globalScripts/" + scriptName + (isScript ? "" : ".js");
	var filePath = path.resolve(outputPath, relativePath);

	fsx.outputFileSync(filePath, code);
	return relativePath;
}

function writeEct(assetPaths: string[], outputPath: string, conf: cmn.Configuration): void {
	var ectRender = ect({root: __dirname + "/../templates", ext: ".ect"});
	var html = ectRender.render("no-bundle-index", {
		assets: assetPaths
	});
	fs.writeFileSync(path.resolve(outputPath, "./index.html"), html);
}

function writeCommonFiles(outputPath: string, conf: cmn.Configuration, options: ConvertTemplateParameterObject): void {
	if (options.strip) {
		copyAssetFilesStrip(outputPath, conf._content.assets, options);
	} else {
		copyAssetFiles(outputPath, options);
	}
	fsx.copySync(
		path.resolve(__dirname, "..", "templates/template-export-html"),
		outputPath);
}
