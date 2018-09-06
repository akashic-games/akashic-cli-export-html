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
	extractAssetDefinitions,
	getInjectedContents,
	validateEs5Code
} from "./convertUtil";

interface AssetData {
	code: string;
	relativePath: string;
}

export async function promiseConvertNoBundle(options: ConvertTemplateParameterObject): Promise<void> {
	var content = await cmn.ConfigurationFile.read(path.join(options.source, "game.json"), options.logger);
	if (!content.environment) content.environment = {};
	content.environment["sandbox-runtime"] = content.environment["sandbox-runtime"] ? content.environment["sandbox-runtime"] : "1";
	var conf = new cmn.Configuration({
		content: content
	});
	var assetDataList: AssetData[] = [];

	writeCommonFiles(options.source, options.output, conf, options);

	assetDataList.push({
		code: wrapText(JSON.stringify(conf._content, null, "\t"), "game.json"),
		relativePath: "./js/game.json.js"
	});

	var assetNames = extractAssetDefinitions(conf, "script").concat(extractAssetDefinitions(conf, "text"));

	var errorMessages: string[] = [];
	assetDataList = assetDataList.concat(
		assetNames.map((assetName: string) => {
			return convertAssetAndOutput(assetName, conf, options.source, options.minify, errorMessages);
		})
	);
	if (conf._content.globalScripts) {
		assetDataList = assetDataList.concat(conf._content.globalScripts.map((scriptName: string) => {
			return convertGlobalScriptAndOutput(scriptName, options.source, options.minify, errorMessages);
		}));
	}

	if (errorMessages.length > 0) {
		options.logger.warn("The following ES5 syntax errors exist.\n" + errorMessages.join("\n"));
	}

	assetDataList.forEach(asset => {
		fsx.outputFileSync(path.resolve(options.output, asset.relativePath), asset.code);
	});
	writeEct(assetDataList.map(asset => asset.relativePath), options.output, conf, options);
	writeOptionScript(options.output, options);
}

function convertAssetAndOutput(
	assetName: string, conf: cmn.Configuration,
	inputPath: string, minify?: boolean, errors?: string[]): AssetData {
	var assets = conf._content.assets;
	var isScript = assets[assetName].type === "script";
	var assetString = fs.readFileSync(path.join(inputPath, assets[assetName].path), "utf8").replace(/\r\n|\r/g, "\n");
	var assetPath = assets[assetName].path;
	if (isScript) {
		errors.push.apply(errors, validateEs5Code(assetPath, assetString));
	}

	var relativePath = "./js/assets/" + path.dirname(assetPath) + "/" +
		path.basename(assetPath, path.extname(assetPath)) + (isScript ? ".js" : ".json.js");
	return {
		code: (isScript ? wrapScript(assetString, assetName, minify) : wrapText(assetString, assetName)),
		relativePath
	};
}

function convertGlobalScriptAndOutput(scriptName: string, inputPath: string, minify?: boolean, errors?: string[]): AssetData {
	var scriptString = fs.readFileSync(path.join(inputPath, scriptName), "utf8").replace(/\r\n|\r/g, "\n");
	var isScript = /\.js$/i.test(scriptName);
	if (isScript) {
		errors.push.apply(errors, validateEs5Code(scriptName, scriptString));
	}

	return {
		code: isScript ? wrapScript(scriptString, scriptName, minify) : wrapText(scriptString, scriptName),
		relativePath: "./globalScripts/" + scriptName + (isScript ? "" : ".js")
	};
}

function writeEct(assetPaths: string[], outputPath: string, conf: cmn.Configuration, options: ConvertTemplateParameterObject): void {
	const injects = options.injects ? options.injects : [];
	var ectRender = ect({root: __dirname + "/../templates-build", ext: ".ect"});
	var html = ectRender.render("no-bundle-index", {
		assets: assetPaths,
		magnify: !!options.magnify,
		injectedContents: getInjectedContents(options.cwd, injects)
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
			templatePath = "templates-build/v1";
			break;
		case "2":
			templatePath = "templates-build/v2";
			break;
		default:
			throw Error("Unknown engine version: `environment[\"sandbox-runtime\"]` field in game.json should be \"1\" or \"2\".");
	}

	fsx.copySync(
		path.resolve(__dirname, "..", templatePath),
		outputPath);
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
