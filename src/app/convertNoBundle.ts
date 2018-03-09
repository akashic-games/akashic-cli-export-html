import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as ect from "ect";
import {
	ConvertTemplateParameterObject,
	copyAssetFilesStrip,
	copyAssetFiles,
	encodeText,
	wrap,
	extractAssetDefinitions
} from "./convertUtil";

export async function promiseConvertNoBundle(options: ConvertTemplateParameterObject): Promise<void> {
	var content = await cmn.ConfigurationFile.read(path.join(options.source, "game.json"), options.logger);
	if (!content.environment) content.environment = {};
	content.environment["sandbox-runtime"] = content.environment["sandbox-runtime"] ? content.environment["sandbox-runtime"] : "1";
	var conf = new cmn.Configuration({
		content: content
	});
	var assetPaths: string[] = [];

	writeCommonFiles(options.source, options.output, conf, options);

	var gamejsonPath = path.resolve(options.output, "./js/game.json.js");
	fsx.outputFileSync(gamejsonPath, wrapText(JSON.stringify(conf._content, null, "\t"), "game.json"));
	assetPaths.push("./js/game.json.js");

	var assetNames = extractAssetDefinitions(conf, "script").concat(extractAssetDefinitions(conf, "text"));

	assetPaths = assetPaths.concat(
		assetNames.map((assetName: string) => convertAssetAndOutput(assetName, conf, options.source, options.output, options.minify)));
	if (conf._content.globalScripts) {
		assetPaths = assetPaths.concat(conf._content.globalScripts.map((scriptName: string) => {
			return convertGlobalScriptAndOutput(scriptName, options.source, options.output, options.minify);
		}));
	}

	writeEct(assetPaths, options.output, conf, options);
	writeOptionScript(options.output, options);
}

function convertAssetAndOutput(
	assetName: string, conf: cmn.Configuration,
	inputPath: string, outputPath: string, minify?: boolean): string {
	var assets = conf._content.assets;
	var isScript = assets[assetName].type === "script";
	var assetString = fs.readFileSync(path.join(inputPath, assets[assetName].path), "utf8").replace(/\r\n|\r/g, "\n");

	var code = (isScript ? wrapScript(assetString, assetName, minify) : wrapText(assetString, assetName));
	var assetPath = assets[assetName].path;
	var relativePath = "./js/assets/" + path.dirname(assetPath) + "/" +
		path.basename(assetPath, path.extname(assetPath)) + (isScript ? ".js" : ".json.js");
	var filePath = path.resolve(outputPath, relativePath);

	fsx.outputFileSync(filePath, code);
	return relativePath;
}

function convertGlobalScriptAndOutput(scriptName: string, inputPath: string, outputPath: string, minify?: boolean): string {
	var scriptString = fs.readFileSync(path.join(inputPath, scriptName), "utf8").replace(/\r\n|\r/g, "\n");
	var isScript = /\.js$/i.test(scriptName);

	var code = isScript ? wrapScript(scriptString, scriptName, minify) : wrapText(scriptString, scriptName);
	var relativePath = "./globalScripts/" + scriptName + (isScript ? "" : ".js");
	var filePath = path.resolve(outputPath, relativePath);

	fsx.outputFileSync(filePath, code);
	return relativePath;
}

function writeEct(assetPaths: string[], outputPath: string, conf: cmn.Configuration, options: ConvertTemplateParameterObject): void {
	var ectRender = ect({root: __dirname + "/../templates", ext: ".ect"});
	var html = ectRender.render("no-bundle-index", {
		assets: assetPaths,
		magnify: !!options.magnify
	});
	fs.writeFileSync(path.resolve(outputPath, "./index.html"), html);
}

function writeCommonFiles(
	inputPath: string,
	outputPath: string, conf: cmn.Configuration,
	options: ConvertTemplateParameterObject): void {
	if (options.strip) {
		copyAssetFilesStrip(inputPath, outputPath, conf._content.assets, options);
	} else {
		copyAssetFiles(inputPath, outputPath, options);
	}
	let templatePath: string;
	switch (conf._content.environment["sandbox-runtime"]) {
		case "1":
			templatePath = "templates/template-export-html-v1";
			break;
		case "2":
			templatePath = "templates/template-export-html-v2";
			break;
		default:
			throw Error("Unknown engine version: `environment[\"sandbox-runtime\"]` field in game.json should be \"1\" or \"2\".");
	}

	const nodeModulesPath = path.resolve(outputPath, "node_modules");
	const templatePackageJsonPath = path.resolve(outputPath, "package.json");
	fsx.copySync(
		path.resolve(__dirname, "..", templatePath),
		outputPath,
		{ filter: (src: string, dest: string): boolean => (dest !== nodeModulesPath && dest !== templatePackageJsonPath)}
	);
}

function writeOptionScript(outputPath: string, options: ConvertTemplateParameterObject): void {
	var script = `
if (! ("optionProps" in window)) {
	window.optionProps = {};
}
window.optionProps.magnify = ${!!options.magnify};
	`;
	fs.writeFileSync(path.resolve(outputPath, "./js/option.js"), script);
}

function wrapScript(code: string, name: string, minify?: boolean): string {
	return "window.gLocalAssetContainer[\"" + name + "\"] = function(g) { " + wrap(code, minify) + "}";
}

function wrapText(code: string, name: string): string {
	var PRE_SCRIPT = "window.gLocalAssetContainer[\"" + name + "\"] = \"";
	var POST_SCRIPT = "\"";
	return PRE_SCRIPT + encodeText(code) + POST_SCRIPT + "\n";
}
