import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as ect from "ect";
import { ConvertTemplateParameterObject, copyAssetFilesStrip, copyAssetFiles, wrap,
		getDefaultBundleScripts, getOutputPath, readAssets, readGlobalScripts  } from "./convertUtil";

interface InnerHTMLAssetData {
	name: string;
	type: string;
	code: string;
}

export async function promiseConvertBundle(options: ConvertTemplateParameterObject): Promise<void> {
	var content = await cmn.ConfigurationFile.read(path.join(process.cwd(), "game.json"), options.logger);
	var conf = new cmn.Configuration({
		content: content
	});
	var innerHTMLAssetsArray: InnerHTMLAssetData[] = [];
	var outputPath = await getOutputPath(options);

	innerHTMLAssetsArray.push({
		name: "game.json",
		type: "text",
		code: encodeURIComponent(JSON.stringify(conf._content, null, "\t"))
	});

	innerHTMLAssetsArray = await readAssets(innerHTMLAssetsArray, conf, undefined, assetProcessor);
	if (conf._content.globalScripts) {
		innerHTMLAssetsArray = await readGlobalScripts(innerHTMLAssetsArray, conf, outputPath, globalScriptsProcessor);
	}

	writeEct(innerHTMLAssetsArray, outputPath, conf, options);
}

function assetProcessor(assetName: string, conf: cmn.Configuration): any {
	var assets = conf._content.assets;
	var isScript = assets[assetName].type === "script";
	var assetString = fs.readFileSync(assets[assetName].path, "utf8").replace(/\r\n|\n/g, "\n");

	return {
		name: assetName,
		type: assets[assetName].type,
		code: (isScript ? wrap(assetString) : encodeURIComponent(assetString))
	};
}

function globalScriptsProcessor(scriptName: string): any {
	var scriptString = fs.readFileSync(scriptName, "utf8").replace(/\r\n|\n/g, "\n");
	var isScript = /\.js$/i.test(scriptName);

	var scriptPath = path.resolve("./", scriptName);
	if (path.extname(scriptPath) === ".json") {
		scriptString = encodeURIComponent(scriptString);
	}

	return {
		name: scriptName,
		type: isScript ? "script" : "text",
		code: isScript ? wrap(scriptString) : scriptString
	};
};

function writeEct(
	innerHTMLAssetsArray: InnerHTMLAssetData[], outputPath: string,
	conf: cmn.Configuration, options: ConvertTemplateParameterObject): void {
	var scripts = getDefaultBundleScripts();
	var ectRender = ect({root: __dirname + "/../templates", ext: ".ect"});
	console.log("isBundle", options.bundle);
	var html = ectRender.render("bundle-index", {
		assets: innerHTMLAssetsArray,
		isBundle: options.bundle,
		preloadScripts: scripts.preloadScripts,
		postloadScripts: scripts.postloadScripts
	});
	fs.writeFileSync(path.resolve(outputPath, "./index.html"), html);

	if (options.strip) {
		copyAssetFilesStrip(outputPath, conf._content.assets, options);
	} else {
		copyAssetFiles(outputPath, options);
	}
	fsx.copySync(
		path.resolve(__dirname, "..", "templates/template-export-html"),
		outputPath,
		{ filter: (filePath: string): boolean =>  !/\.js$/i.test(filePath)});
}
