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
	tiny?: boolean;
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
		tiny: param.tiny
	};
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
	.option("-t, --tiny", "output tiny fileset")
	.option("-e, --exclude [fileNames]", "Name of exclude file", (fileNames: string, list: string[]) => {
		list.push(fileNames);
		return list;
	}, []);

export function run(argv: string[]): void {
	commander.parse(argv);
	cli(commander);
}
