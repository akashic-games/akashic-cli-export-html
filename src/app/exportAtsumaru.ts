import * as fs from "fs";
import * as fsx from "fs-extra";
import * as path from "path";
import * as archiver from "archiver";
import {promiseExportZip} from "@akashic/akashic-cli-export-zip/lib/bundle";
import {_completeExportHTMLParameterObject, ExportHTMLParameterObject, promiseExportHTML} from "./exportHTML";

export function promiseExportAtsumaru(param: ExportHTMLParameterObject): Promise<string> {
	if (param.output === undefined) {
		throw new Error("--output option must be specified.");
	}
	const outZip = path.extname(param.output) === ".zip";
	let destDir;
	if (!outZip) {
		destDir = param.output;
	}
	const completedParam = _completeExportHTMLParameterObject({...param});
	return promiseExportHTML({...param, output: destDir, logger: completedParam.logger})
		.then((dest) => {
			completedParam.output = dest;
			// filesディレクトリはakashic export zip時にも生成されるので削除しておく。削除しないとハッシュ名の衝突が起きてエラーになるため。
			fsx.removeSync(path.join(completedParam.output, "files"));
			// akashic export zip -o [outputDir] -b -H の実行
			return promiseExportZip({
				source: completedParam.source,
				bundle: completedParam.bundle,
				dest: completedParam.output,
				hashLength: completedParam.hashLength
			});
		}).then(() => {
			// game.jsonへの追記
			const gameJsonPath = path.join(completedParam.output, "game.json");
			const gameJson = require(gameJsonPath);
			if (!gameJson.environment) {
				gameJson.environment = {};
			}
			if (!gameJson.environment.external) {
				gameJson.environment.external = {};
			}
			gameJson.environment.external.coe = "0";
			gameJson.environment.external.send = "0";
			gameJson.environment.external.nicocas = "0";
			if (!gameJson.environment["akashic-runtime"]) {
				gameJson.environment["akashic-runtime"] = {};
			}
			// TODO: べだ書きせずにengine-filesの最新のバージョンを取れるようにする
			if (!gameJson.environment["sandbox-runtime"] || gameJson.environment["sandbox-runtime"] === "1") {
				gameJson.environment["akashic-runtime"]["version"] = "0.0.11"; // v1に対応するengine-filesのバージョン
			} else {
				gameJson.environment["akashic-runtime"]["version"] = "1.0.11"; // v2に対応するengine-filesのバージョン
			}
			if (!gameJson.renderers || gameJson.renderers.indexOf("webgl") === -1) {
				gameJson.environment["akashic-runtime"]["flavor"] = "-canvas";
			}
			fs.writeFileSync(gameJsonPath, JSON.stringify(gameJson, null, 2));
			// export-html時に作られたディレクトリがディレクトリ毎コピーされてしまっているので削除。
			// TODO: export-zipのstripモードが使えるようになったら、この処理は削除
			fsx.removeSync(path.join(completedParam.output, path.basename(completedParam.output)));
		}).then(() => {
			if (!outZip) {
				return;
			}
			return new Promise<void>((resolve, reject) => {
				const ostream = fs.createWriteStream(path.resolve(param.cwd, param.output));
				const archive = archiver("zip");
				ostream.on("close", () => resolve());
				archive.on("error", (err) => reject(err));
				archive.pipe(ostream);
				archive.directory(completedParam.output, path.basename(param.output).replace(/.zip$/g, ""));
				archive.finalize();
			}).then(() => {
				fsx.removeSync(completedParam.output);
				completedParam.logger.info("Done Zip!");
			});
		}).then(() => {
			return path.resolve(param.cwd, param.output);
		});
}
