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
	describe("encodeText", function () {
		it("can encode specified characters and the characters can be decode", function () {
			var targetString = "";
			for (var i = 0; i < 128; i++) {
				targetString += String.fromCharCode(i);
			}
			targetString += "\u2028\u2029";
			targetString += "あいうえお";
			targetString += "１２３４５％＆’”";
			targetString += "漢字例";
			targetString += "○×";
			expect(decodeURIComponent(convert.encodeText(targetString))).toBe(targetString);
		});
	});
});
