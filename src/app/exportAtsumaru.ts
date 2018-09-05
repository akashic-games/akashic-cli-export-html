import * as fs from "fs";
import * as fsx from "fs-extra";
import * as path from "path";
import {promiseExportZip} from "@akashic/akashic-cli-export-zip/lib/bundle";
import {ExportHTMLParameterObject, promiseExportHTML} from "./exportHTML";

export function promiseExportAtsumaru(param: ExportHTMLParameterObject): Promise<void> {
	return promiseExportHTML(param)
		.then(() => {
			// index.html以外はakashic export zip時にも生成されるので削除しておく。削除しないとハッシュ名の衝突が起きてエラーになるため。
			fs.readdirSync(param.output).forEach(fileName => {
				if (fileName !== "index.html") {
					fsx.removeSync(path.join(param.output, fileName));
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
			// TODO: べだ書きせずにengine-filesの最新のバージョンを取れるようにする
			if (!gameJson.environment["sandbox-runtime"] || gameJson.environment["sandbox-runtime"] === "1") {
				gameJson.environment["akashic-runtime"] = "0.0.11"; // v1に対応するengine-filesのバージョン
			} else {
				gameJson.environment["akashic-runtime"] = "1.0.11"; // v2に対応するengine-filesのバージョン
			}
			fs.writeFileSync(gameJsonPath, JSON.stringify(gameJson, null, 2));
			// export-html時に作られたディレクトリがディレクトリ毎コピーされてしまっているので削除
			fsx.removeSync(path.join(param.output, path.basename(param.output)));
		});
}
