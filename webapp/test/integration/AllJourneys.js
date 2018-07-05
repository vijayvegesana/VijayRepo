jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"com/myagri/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"com/myagri/test/integration/pages/Worklist",
		"com/myagri/test/integration/pages/Object",
		"com/myagri/test/integration/pages/NotFound",
		"com/myagri/test/integration/pages/Browser",
		"com/myagri/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.myagri.view."
	});

	sap.ui.require([
		"com/myagri/test/integration/WorklistJourney",
		"com/myagri/test/integration/ObjectJourney",
		"com/myagri/test/integration/NavigationJourney",
		"com/myagri/test/integration/NotFoundJourney",
		"com/myagri/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});