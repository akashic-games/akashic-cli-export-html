import * as cmn from "@akashic/akashic-cli-commons";
import { ConvertTemplateParameterObject } from "./convertUtil";
import { promiseConvertNoBundle } from "./convertNoBundle";
import { promiseConvertBundle } from "./convertBundle";

import * as fs from "fs";
import * as fsx from "fs-extra";
import * as path from "path";
import * as os from "os";

export interface ExportHTMLParameterObject extends ConvertTemplateParameterObject {
	quiet?: boolean;
	exclude?: string[];
	bundle?: boolean;
	use?: string;
	hashLength?: number;
};

export function _completeExportHTMLParameterObject(param: ExportHTMLParameterObject): void {
	param.source = param.source || process.cwd();
	param.logger = param.logger || new cmn.ConsoleLogger();
}
export function promiseExportHTML(param: ExportHTMLParameterObject): Promise<void> {
	_completeExportHTMLParameterObject(param);
	const restoreDirectory: (err?: any) => Promise<void> = cmn.Util.chdir(param.source);
	let gamepath: string;

	if (!param.output) {
		return Promise.reject("--output option must be specified.");
	}

	if (!param.strip && !/^\.\./.test(path.relative(param.source, param.output))) {
		param.logger.warn("The output path overlaps with the game directory: files will be exported into the game directory.");
		param.logger.warn("NOTE that after this, exporting this game with --no-strip option may include the files.");
	}
	return new Promise((resolve, reject) => {
		fs.stat(path.resolve(param.output), (error: any, stat: any) => {
			if (error) {
				if (error.code !== "ENOENT") {
					return reject("Output directory has bad status. Error code " + error.code);
				}
				fs.mkdir(path.resolve(param.output), (err: any) => {
					if (err) {
						return reject("Create " + param.output + " directory failed.");
					}
					resolve();
				});
			} else if (stat) {
				if (!stat.isDirectory()) {
					return reject(param.output + " is not directory.");
				}
				if (!param.force) {
					return reject("The output directory " + param.output + " already exists. Cannot overwrite without force option.");
				}
				resolve();
			}
		});
	})
	.then(() => {
		if (param.hashLength === 0) return param.source;
		return createRenamedGame(param.source, param.hashLength, param.logger);
	})
	.then((currentGamepath: string) => {
		gamepath = currentGamepath;
		const convertParam = {
			output: param.output,
			logger: param.logger,
			strip: param.strip,
			minify: param.minify,
			magnify: param.magnify,
			force: param.force,
			source: gamepath
		};
		if (param.bundle) {
			return promiseConvertBundle(convertParam);
		} else {
			return promiseConvertNoBundle(convertParam);
		}})
	.then(restoreDirectory)
	.then(() => {
		if (param.hashLength > 0) {
			param.logger.info("removing temp files...");
			fsx.removeSync(gamepath);
		}
		return Promise.resolve();
	})
	.catch((error) => {
		param.logger.error(error);
		restoreDirectory();
		throw new Error(error);
	})
	.then(() => param.logger.info("Done!"));
};

export function exportHTML(param: ConvertTemplateParameterObject, cb: (err?: any) => void): void {
	promiseExportHTML(param).then<void>(cb).catch(cb);
}

function createRenamedGame(cwd: string, hashLength: number, logger: cmn.Logger): Promise<string> {
	const copyDirPath = path.resolve(fs.mkdtempSync(path.join(os.tmpdir(), "akashic-export-html-")));
	fsx.copySync(cwd, copyDirPath);

	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read(path.join(copyDirPath, "game.json"), logger))
		.then((gamejson: cmn.GameConfiguration) => {
			cmn.Renamer.renameAssetFilenames(gamejson, copyDirPath, hashLength);
			return cmn.ConfigurationFile.write(gamejson, path.resolve(path.join(copyDirPath, "game.json")), logger);
		}).then(() => {
			return copyDirPath;
		});
}
