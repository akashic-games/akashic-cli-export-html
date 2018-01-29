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
	const logger = new ConsoleLogger({ quiet: param.quiet });
	const exportParam = {
		cwd: param.cwd,
		force: param.force,
		quiet: param.quiet,
		output: param.output,
		exclude: param.exclude,
		logger: logger,
		strip: (param.strip != null) ? param.strip : true,
		hashLength: !param.hashFilename ? 0 : (param.hashFilename === true) ? 20 : Number(param.hashFilename),
		minify: param.minify,
		bundle: param.bundle,
		magnify: param.magnify
	};
	Promise.resolve()
		.then(() => promiseExportHTML(exportParam))
		.catch((err: any) => {
			logger.error(err);
			process.exit(1);
		});
}

const ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

commander
	.version(ver);

commander
	.description("convert your Akashic game runnable standalone.")
	.option("-C, --cwd <dir>", "The directory to export from")
	.option("-f, --force", "Overwrites existing files")
	.option("-q, --quiet", "Suppress output")
	.option("-o, --output <fileName>", "Name of output file or directory")
	.option("-S, --no-strip", "output fileset without strip")
	.option("-H, --hash-filename [length]", "Rename asset files with their hash values")
	.option("-M, --minify", "minify JavaScript files")
	.option("-b, --bundle", "bundle assets and scripts in index.html (to reduce the number of files)")
	.option("-m, --magnify", "fit game area to outer element size")
	.option("-e, --exclude [fileNames]", "Name of exclude file", (fileNames: string, list: string[]) => {
		list.push(fileNames);
		return list;
	}, []);

export function run(argv: string[]): void {
	// Commander の制約により --strip と --no-strip 引数を両立できないため、暫定対応として Commander 前に argv を処理する
	const argvCopy = dropDeprecatedArgs(argv);
	commander.parse(argvCopy);
	cli({
		cwd: commander["cwd"],
		force:commander["force"],
		quiet: commander["quiet"],
		output: commander["output"],
		exclude: commander["exclude"],
		strip: commander["strip"],
		minify: commander["minify"],
		bundle: commander["bundle"],
		magnify: commander["magnify"],
		hashFilename: commander["hashFilename"]
	});
}

function dropDeprecatedArgs(argv: string[]): string[] {
	const filteredArgv = argv.filter(v => !/^(-s|--strip)$/.test(v));
	if (argv.length !== filteredArgv.length) {
		console.log("WARN: --strip option is deprecated. strip is applied by default.");
		console.log("WARN: If you do not need to apply it, use --no-strip option.");
	}
	return filteredArgv;
}
