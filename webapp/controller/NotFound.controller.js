sap.ui.define([
		"com/myagri/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.myagri.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);