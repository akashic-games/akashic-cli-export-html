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
			}
			exp._completeExportHTMLParameterObject(param);
			expect(param.logger).not.toBe(undefined);
			})
		.then(done, done.fail);
	});
});
