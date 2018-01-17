import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import { promiseExportHTML } from "./exportHTML";

interface CommandParameterObject {
	cwd?: string;
	force?: boolean;
	quiet?: boolean;
	output?: string;
	exclude?: string[];
	strip?: boolean;
	hashFilename?: number | boolean;
	minify?: boolean;
	bundle?: boolean;
	magnify?: boolean;
}

function cli(param: CommandParameterObject): void {
	var logger = new ConsoleLogger({ quiet: param.quiet });
	var exportParam = {
		cwd: param.cwd,
		force: param.force,
		quiet: param.quiet,
		output: param.output,
		exclude: param.exclude,
		logger: logger,
		strip: !param.strip, // デフォルト挙動では strip する
		hashLength: !param.hashFilename ? 0 : (param.hashFilename === true) ? 20 : Number(param.hashFilename),
		minify: param.minify,
		bundle: param.bundle,
		magnify: param.magnify
	};
	console.log("STRIP", param.strip);
	Promise.resolve()
		.then(() => promiseExportHTML(exportParam))
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

commander
	.version(ver);

commander
	.description("convert your Akashic game runnable standalone.")
	.option("-C, --cwd <dir>", "The directory to export from")
	.option("-f, --force", "Overwrites existing files")
	.option("-q, --quiet", "Suppress output")
	.option("-o, --output <fileName>", "Name of output file or directory")
	.option("-S, --no-strip [foo]", "output fileset without strip")
	.option("-H, --no-filename [length]", "Rename asset files with their hash values")
	.option("-M, --minify", "minify JavaScript files")
	.option("-b, --bundle", "bundle assets and scripts in index.html (to reduce the number of files)")
	.option("-m, --magnify", "fit game area to outer element size")
	.option("-e, --exclude [fileNames]", "Name of exclude file", (fileNames: string, list: string[]) => {
		list.push(fileNames);
		return list;
	}, []);

export function run(argv: string[]): void {
	// Commander の制約により --strip と --no-strip 引数を両立できないため、暫定対応として Commander 前に argv を処理する-
	let useStripOption = false;
	const argvCopy = argv.slice();

	const stripElement = argvCopy.indexOf("--strip");
	if (stripElement !== -1) {
		argvCopy.splice(stripElement, 1);
		useStripOption = true;
	}

	const stripShortElement = argvCopy.indexOf("-s");
	if (stripShortElement !== -1) {
		argvCopy.splice(stripShortElement, 1);
		useStripOption = true;
	}

	if (useStripOption) console.log(
		"--strip option is deprecated. strip is applied by default. If you do not need to apply it, use --no-strip option.");

	commander.parse(argvCopy);
	cli(commander);
}
