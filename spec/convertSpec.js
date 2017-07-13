var path = require("path");
var cmn = require("@akashic/akashic-cli-commons");
var cvnb = require("../lib/convertNoBundle");
var cvu = require("../lib/convertUtil");

describe("convert", function () {
	var logger = new cmn.ConsoleLogger({
		quiet: true,
		debugLogMethod: err => { /* do nothing */ }
	});

	it("promiseConvert output undefined", function (done) {
		Promise.resolve()
			.then(function () {
				var param = {
					logger: logger,
					output: undefined
				}
				cvnb.promiseConvertNoBundle(param)
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

	it("promiseConvert outputpath same source directory", function (done) {
		Promise.resolve()
			.then(function () {
				var param = {
					logger: logger,
					output: process.cwd()
				}
				cvnb.promiseConvertNoBundle(param)
					.then(() => done.fail())
					.catch((err) => {
						if (err === "output path overlaps with source directory.") {
							done();
						} else {
							done.fail(err);
						}
					});
			})
	});
});
