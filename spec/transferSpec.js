var path = require("path");
var cmn = require("@akashic/akashic-cli-commons");
var tr = require("../lib/transfer");

describe("transfer", function () {
	var logger = new cmn.ConsoleLogger({
		quiet: true,
		debugLogMethod: err => { /* do nothing */ }
	});

	it("_completeTransferTemplateParameterObject", function (done) {
		Promise.resolve()
			.then(function () {
				var param = {
					logger: logger
				}
				tr._completeTransferTemplateParameterObject(param);
				expect(param.quiet).toBe(false);
			})
			.then(done, done.fail);
	});

	it("promiseTransfer output undefined", function (done) {
		Promise.resolve()
			.then(function () {
				var param = {
					logger: logger,
					output: undefined
				}
				tr.promiseTransfer(param)
					.then(() => done.fail())
					.catch((err) => {
						if (err === "output is not defined.") {
							done();
						} else {
							done.fail(err);
						}
					});
		})
	});

	it("promiseTransfer outputpath same source directory", function (done) {
		Promise.resolve()
			.then(function () {
				var param = {
					logger: logger,
					output: process.cwd()
				}
				tr.promiseTransfer(param)
					.then(() => done.fail())
					.catch((err) => {
						if (err === "output is bad path.") {
							done();
						} else {
							done.fail(err);
						}
					});
			})
	});
});
