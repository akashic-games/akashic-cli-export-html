var cmn = require("@akashic/akashic-cli-commons");
var exp = require("../lib/exportHTML");
var path = require("path");

describe("exportHTML", function () {
	var logger = new cmn.ConsoleLogger({
		quiet: true,
		debugLogMethod: err => { /* do nothing */ }
	});

	it("_completeExportHTMLParameterObject", function (done) {
		Promise.resolve()
		.then(function () {
			var param = {
				logger: undefined,
				cwd: process.cwd(),
				output: process.cwd()
			}
			exp._completeExportHTMLParameterObject(param);
			expect(param.logger).not.toBe(undefined);
			})
		.then(done, done.fail);
	});

	it("_completeExportHTMLParameterObject - fullpath", function (done) {
		Promise.resolve()
		.then(function () {
			var param = {
				logger: undefined,
				cwd: path.join(process.cwd(), ""),
				source: path.join(process.cwd(), "content"),
				output: path.join(process.cwd(), "output")
			}
			exp._completeExportHTMLParameterObject(param);
			expect(param.output).toBe(path.join(process.cwd(), "output"));

			param = {
				logger: undefined,
				cwd: path.join(process.cwd(), "content"),
				output:  "../output"
			}
			exp._completeExportHTMLParameterObject(param);
			expect(param.output).toBe(path.join(process.cwd(), "output"));
		})
		.then(done, done.fail);
	});


	it("promiseExportHTML", function (done) {
		Promise.resolve()
		.then(function () {
			var param = {
				logger: undefined,
				cwd: "./",
			}
			return exp.promiseExportHTML(param);
		})
		.then(() => done.fail())
		.catch((err) => {
			expect(err).toBe("--output option must be specified.");
			done();
		});
	});
});
