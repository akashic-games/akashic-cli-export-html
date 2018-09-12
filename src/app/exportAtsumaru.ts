import * as fs from "fs";
import * as fsx from "fs-extra";
import * as path from "path";
import * as archiver from "archiver";
import {promiseExportZip} from "@akashic/akashic-cli-export-zip/lib/bundle";
import {ExportHTMLParameterObject, promiseExportHTML} from "./exportHTML";

export function promiseExportAtsumaru(param: ExportHTMLParameterObject): Promise<void> {
	const originalOutput = param.output;
	if (param.output === undefined) {
		param.output = "";
	}
	const outZip = path.extname(param.output) === ".zip";
	param.output = outZip ? param.output.replace(/.zip$/g, "") : param.output;
	return promiseExportHTML(param)
		.then(() => {
			// filesディレクトリはakashic export zip時にも生成されるので削除しておく。削除しないとハッシュ名の衝突が起きてエラーになるため。
			fs.readdirSync(param.output).forEach(fileName => {
				const filePath = path.join(param.output, fileName);
				if (fileName === "files" && fs.statSync(filePath).isDirectory()) {
					fsx.removeSync(filePath);
				}
			});
			// akashic export zip -o [outputDir] -b -H の実行
			return promiseExportZip({
				source: param.source,
				bundle: param.bundle,
				dest: param.output,
				hashLength: param.hashLength
			});
		}).then(() => {
			// game.jsonへの追記
			const gameJsonPath = path.join(param.output, "game.json");
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
			gameJson.environment["akashic-runtime"] = {};
			// TODO: べだ書きせずにengine-filesの最新のバージョンを取れるようにする
			if (!gameJson.environment["sandbox-runtime"] || gameJson.environment["sandbox-runtime"] === "1") {
				gameJson.environment["akashic-runtime"]["version"] = "0.0.11"; // v1に対応するengine-filesのバージョン
			} else {
				gameJson.environment["akashic-runtime"]["version"] = "1.0.11"; // v2に対応するengine-filesのバージョン
			}
			if (!gameJson.renderer || gameJson.renderer !== "webgl") {
				gameJson.environment["akashic-runtime"]["flavor"] = "-canvas";
			}
			fs.writeFileSync(gameJsonPath, JSON.stringify(gameJson, null, 2));
			// export-html時に作られたディレクトリがディレクトリ毎コピーされてしまっているので削除。
			// TODO: export-zipのstripモードが使えるようになったら、この処理は削除
			fsx.removeSync(path.join(param.output, path.basename(param.output)));
		}).then(() => {
			if (!outZip) {
				return;
			}
			return new Promise<void>((resolve, reject) => {
				const ostream = fs.createWriteStream(originalOutput);
				const archive = archiver("zip");
				ostream.on("close", () => resolve());
				archive.on("error", (err) => reject(err));
				archive.pipe(ostream);
				archive.glob(path.relative(param.source, param.output) + "/**/*", { cwd: param.cwd });
				archive.finalize();
			}).then(() => {
				fsx.removeSync(param.output);
				param.logger.info("Done Zip!");
			});
		});
}
