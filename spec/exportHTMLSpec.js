var cmn = require("@akashic/akashic-cli-commons");
var exp = require("../lib/exportHTML");

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
				output: process.cwd()
			}
			exp._completeExportHTMLParameterObject(param);
			expect(param.logger).not.toBe(undefined);
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
			if (err === "--output option must be specified.") {
				done();
			} else {
				done.fail(err);
			}
		});
	});
});
