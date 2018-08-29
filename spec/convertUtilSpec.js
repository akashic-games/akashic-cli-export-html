var convert = require("../lib/convertUtil");

describe("convertUtil", function () {
	describe("getInjectedContents", function () {
		var sampleScriptContent = "<script>\n\tconsole.log(\"test\");\n</script>\n";
		var sampleStyleContent = "<style type=\"text/css\">\n" +
			"\tbody{\n" +
			"\t\toverflow: hidden;\n" +
			"\t}\n" +
			"</style>\n";

		it("can get file content", function () {
			var existFileContents = convert.getInjectedContents(
				__dirname,
				["fixture/innerhtml/sample_script.html"]
			);
			expect(existFileContents.length).toBe(1);
			expect(existFileContents[0]).toBe(sampleScriptContent);
		});
		it("can get file contents in specified directory", function () {
			var existFileContents = convert.getInjectedContents(__dirname, ["fixture/innerhtml"]);
			expect(existFileContents.length).toBe(2);
			expect(existFileContents[0]).toBe(sampleScriptContent);
			expect(existFileContents[1]).toBe(sampleStyleContent);
		});
		it("can get file contents by specified order", function () {
			var existFileContents = convert.getInjectedContents(
				__dirname,
				["fixture/innerhtml/sample_style.html", "fixture/innerhtml/sample_script.html"]
			);
			expect(existFileContents.length).toBe(2);
			expect(existFileContents[0]).toBe(sampleStyleContent);
			expect(existFileContents[1]).toBe(sampleScriptContent);
		});
	});
	describe("wrap", function () {
		it("can wrap ES5 syntax code", function () {
			var targetCode = "var a = 1;";
			var PRE_SCRIPT = "(function(exports, require, module, __filename, __dirname) {";
			var POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);";
			var expected = PRE_SCRIPT + "\n" + targetCode + "\n" + POST_SCRIPT + "\n";
			expect(convert.wrap(targetCode)).toBe(expected);
		});
		it("can not wrap code that is not ES5 syntax", function () {
			var targetCode = "const a = 1;";
			try {
				convert.wrap(targetCode);
			} catch (e) {
				expect(e.message).toBe("Please describe with ES5 syntax");
			}
		});
	});
});
