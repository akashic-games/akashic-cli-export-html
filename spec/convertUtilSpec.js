var path = require("path");
var convert = require("../lib/convertUtil");

describe("convertUtil", function () {
	describe("getFileContents", function () {
		it("can get file contents in specified directory", function () {
			var existFileContents = convert.getFileContents(path.join(__dirname, "fixture/innerhtml"));
			var sampleScriptContent = "<script>\n\tconsole.log(\"test\");\n</script>";
			var sampleStyleContent = "<style type=\"text/css\">\n" +
				"\tbody{\n" +
				"\t\toverflow: hidden;\n" +
				"\t}\n" +
				"</style>";
			expect(existFileContents.length).toBe(2);
			expect(existFileContents[0]).toBe(sampleScriptContent);
			expect(existFileContents[1]).toBe(sampleStyleContent);
		});
		it("if specified directory is not exist, get empty array", function() {
			var notExistFileContents = convert.getFileContents(path.join(__dirname, "fixture/not_exist"));
			expect(notExistFileContents.length).toBe(0);
		});
	});
});
