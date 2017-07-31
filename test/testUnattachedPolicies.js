var assert = require("assert"),
  decache = require("decache"),
  path = require("path"),
  fs = require("fs"),
  debug = require("debug")("bundlelinter"),
  Bundle = require("../lib/package/Bundle.js"),
  util = require("util"),
  bl = require("../lib/package/bundleLinter.js"),
  configuration = {
    debug: false,
    source: {
      type: "filesystem",
      path: "./test/sampleProxy/24Solver/apiproxy"
    }
  };

debug("test configuration: " + JSON.stringify(configuration));
var bundle = new Bundle(configuration);

describe("List unattached policies", function() {
  bl.executePlugin("checkUnattachedPolicies.js", bundle);
  debug(
    "report: \n" +
      util.inspect(bundle.getReport(bundle), {
        showhidden: false,
        depth: 4,
        maxArrayLength: 10
      })
  );
});

describe("Check for unattached policies", function() {
  var report = bundle.getReport(bundle),
    unattachedFiles = [
      "ExtractVariables.xml",
      "ExtractVariables_1.xml",
      "ExtractVariables_unattached.xml",
      "badServiceCallout.xml",
      "jsCalculate.xml"
    ];
  unattachedFiles.forEach(function test(file) {
    var found = false;

    report.some(function(reportObj) {
      if (reportObj.filePath.endsWith(file)) {
        reportObj.messages.some(function(msg) {
          if (msg.ruleId === "BN005") {
            found = true;
            return;
          }
        });
        if (found) return;
      }
    });

    it("should mark " + file + " as unattached", function() {
      assert.equal(found, true);
    });
  });
})