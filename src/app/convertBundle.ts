import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as ect from "ect";
import { ConvertTemplateParameterObject, copyAssetFilesStrip, copyAssetFiles, wrap,
		getDefaultBundleScripts, resolveOutputPath, extractAssetDefinitions  } from "./convertUtil";

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
	var innerHTMLAssetArray: InnerHTMLAssetData[] = [];
	var outputPath = await resolveOutputPath(options.output);

	innerHTMLAssetArray.push({
		name: "game.json",
		type: "text",
		code: encodeURIComponent(JSON.stringify(conf._content, null, "\t"))
	});

	var innerHTMLAssetNames = extractAssetDefinitions(conf, "script").concat(extractAssetDefinitions(conf, "text"));
	innerHTMLAssetArray = innerHTMLAssetArray.concat(innerHTMLAssetNames.map((assetName: string) => {
		return convertAssetToInnerHTMLObj(assetName, conf);
	}));

	if (conf._content.globalScripts) {
		innerHTMLAssetArray = innerHTMLAssetArray.concat(conf._content.globalScripts.map((scriptName: string) => {
			return convertScriptNameToInnerHTMLObj(scriptName);
		}));
	}

	writeEct(innerHTMLAssetArray, outputPath, conf, options);
	writeCommonFiles(outputPath, conf, options);
}

function convertAssetToInnerHTMLObj(assetName: string, conf: cmn.Configuration): InnerHTMLAssetData {
	var assets = conf._content.assets;
	var isScript = assets[assetName].type === "script";
	var assetString = fs.readFileSync(assets[assetName].path, "utf8").replace(/\r\n|\r/g, "\n");
	return {
		name: assetName,
		type: assets[assetName].type,
		code: (isScript ? wrap(assetString) : encodeURIComponent(assetString))
	};
}

function convertScriptNameToInnerHTMLObj(scriptName: string): InnerHTMLAssetData {
	var scriptString = fs.readFileSync(scriptName, "utf8").replace(/\r\n|\r/g, "\n");
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
	innerHTMLAssetArray: InnerHTMLAssetData[], outputPath: string,
	conf: cmn.Configuration, options: ConvertTemplateParameterObject): void {
	var scripts = getDefaultBundleScripts();
	var ectRender = ect({root: __dirname + "/../templates", ext: ".ect"});
	var html = ectRender.render("bundle-index", {
		assets: innerHTMLAssetArray,
		preloadScripts: scripts.preloadScripts,
		postloadScripts: scripts.postloadScripts,
		magnify: !!options.magnify

	});
	fs.writeFileSync(path.resolve(outputPath, "./index.html"), html);
}

function writeCommonFiles(outputPath: string, conf: cmn.Configuration, options: ConvertTemplateParameterObject): void {
	if (options.strip) {
		copyAssetFilesStrip(outputPath, conf._content.assets, options);
	} else {
		copyAssetFiles(outputPath, options);
	}

	const filterFunc = (src: string, dest: string) => {
		return  !(dest === path.resolve(outputPath, "js"));
	};

	let templatePath: string;
	switch (options.use) {
		case "v1":
			templatePath = "templates/template-export-html-v1";
			break;
		case "v2":
			templatePath = "templates/template-export-html-v2";
			break;
		default:
			throw Error("unknown Akashic Engine version selected");
	}
	// fs-extraのd.tsではCopyFilterにdest引数が定義されていないため、anyにキャストする
	(<any>(fsx.copySync))(
		path.resolve(__dirname, "..", templatePath),
		outputPath,
		{ filter: filterFunc});
}
