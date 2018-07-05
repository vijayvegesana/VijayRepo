var oJSONField;
var oJSONTreeField;
sap.ui.define([
	"com/myagri/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/myagri/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.myagri.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			if (!this._AddFilter) {

				this._AddFilter = sap.ui.xmlfragment("com.myagri.Fragment.AddFilter", this);

				this.getView().addDependent(this._AddFilter);
			}

			var myData = [{
				"Product": "300000000149",
				"Description": "SOA",
				"SLoc": "",
				"Plant": "0.00",
				"Total": "0.000",
				"Unit": "MT",
				"Batch": ""
			}, {
				"Product": "300000000149",
				"Description": "SOA",
				"SLoc": "",
				"Plant": "0.00",
				"Total": "0.000",
				"Unit": "MT",
				"Batch": ""
			}];

			var oModel = new sap.ui.model.json.JSONModel(myData);
			this.getView().byId("substanceListId").setModel(oModel, "oModel");

			/*  if (!this._InitialPopUp) {

			      this._InitialPopUp = sap.ui.xmlfragment("com.myagri.Fragment.InitialPopUp", this);

			      this.getView().addDependent(this._InitialPopUp);
			  }*/
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onAddSubstanceList: function() {
			var data = this.getView().byId("substanceListId").getModel("oModel").getData();

			var newObj = {
				"Product": "",
				"Description": "",
				"SLoc": "",
				"Plant": "",
				"Total": "",
				"Unit": "MT",
				"Batch": ""
			};
			data.push(newObj);
			this.getView().byId("substanceListId").getModel("oModel").refresh(true);
		},

		onDeleteSubstanceList: function() {

			var oModel = this.getView().byId("substanceListId").getModel("oModel");
			var data = oModel.getData(); //.results[0].F4ItemNav.results;

			var oTable = this.byId("substanceListId");
			var sItems = oTable.getSelectedItems();
			if (sItems.length === 0) {
				sap.m.MessageBox.alert("Please select atleast one item to delete.", {
					title: 'Delete'
				});

			} else {
				var dialog = new sap.m.Dialog({
					title: 'Delete',
					type: 'Message',
					content: new sap.m.Text({
						text: 'Are you sure you want to delete the selected item ?'
					}),
					beginButton: new sap.m.Button({
						text: 'Ok',
						press: function() {
							for (var i = sItems.length - 1; i >= 0; i--) {

								var aPath = sItems[i].getBindingContextPath();
								var path = aPath.split("/")[1];
								var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
								data.splice(idx, 1);
							}

							oModel.refresh(true);
							dialog.close();
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});
				dialog.open();
			}
			oTable.removeSelections();

		},
		onSegmentedButton: function(oEvent) {
			var selectedButton = oEvent.mParameters.button.mProperties.text;

			if (selectedButton === "Application Parameter") {
				this.getView().byId("applicationParameterId").setVisible(true);
				this.getView().byId("TreeTableBasic").setVisible(false);
				this.getView().byId("substanceListId").setVisible(false);
			} else if (selectedButton === "Functional Location") {

				this.onGetFuncLocation();
				this.getView().byId("TreeTableBasic").setVisible(true);
				this.getView().byId("applicationParameterId").setVisible(false);
				this.getView().byId("substanceListId").setVisible(false);
			} else if (selectedButton === "Substance List") {
				this.getView().byId("substanceListId").setVisible(true);
				this.getView().byId("TreeTableBasic").setVisible(false);
				this.getView().byId("applicationParameterId").setVisible(false);
			}
		},

		onInitialPopUp: function() {
			/*if (!this._InitialPopUp) {

			    this._InitialPopUp = sap.ui.xmlfragment("com.myagri.Fragment.InitialPopUp", this);

			    this.getView().addDependent(this._InitialPopUp);
			}*/

			this._InitialPopUp.open();

			this.onDataBinding();
		},
		onInitialPopUpClose: function() {
			this._InitialPopUp.close();
		},

		onAddFilterPress: function() {
			/*  if (!this._AddFilter) {

                        this._AddFilter = sap.ui.xmlfragment("com.myagri.Fragment.AddFilter", this);

                        this.getView().addDependent(this._AddFilter);
                    }*/

			this._AddFilter.open();
		},
		onAddFilterClose: function() {
			this._AddFilter.close();
		},

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will navigate to the shell home
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = [new Filter("Afpos", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(oTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		onApplicationParameterPress: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: "Test" //oItem.getBindingContext().getProperty("CompCode")
			});
		},

		onFunctionalLocationPress: function(oItem) {
			this.onGetFuncLocation();
			this.getRouter().navTo("functionalLocation", {
				functionalLocationId: "Test" //oItem.getBindingContext().getProperty("CompCode")
			});
			debugger;
		},

		onGetFuncLocation: function() {
			var that = this;

			function loadJSON(callback) {

				var xobj = new XMLHttpRequest();
				xobj.overrideMimeType("application/json");
				xobj.open('GET', '../model/treetable.json', true); // Replace 'my_data' with the path to your file
				xobj.onreadystatechange = function() {
					if (xobj.readyState == 4 && xobj.status == "200") {
						// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
						callback(xobj.responseText);
					}
				};
				xobj.send(null);
			}

			loadJSON(function(response) {
				var actual_JSON = JSON.parse(response);
				oJSONTreeField = new sap.ui.model.json.JSONModel();
				oJSONTreeField.setData(actual_JSON);
				that.onFunctionDataBinding();
				console.log(oJSONTreeField);
			});
		},

		onFunctionDataBinding: function() {
			debugger;

			var data = oJSONTreeField.getData().Sheet1;
			var aHeader = [];
			var aItem = [];
			var addHeader = [];
			for (var i = 0; i < data.length; i++) {
				if (data[i].FlagIdent == "P") {
					addHeader.push(data[i]);
					data.splice(i, 1);
				}
			}

			var nodeData = [];

			for (var i = 0; i < addHeader.length; i++) {
				var aItem = [];
				for (var j = 0; j < data.length; j++) {
					if (data[j].FuncLoc.includes(addHeader[i].FuncLoc)) {
						aItem.push(data[j]);
					}
				}
				var array = {
					"Area": addHeader[i].Area,
					"Desc": addHeader[i].Desc,
					"FlagIdent": addHeader[i].FlagIdent,
					"FuncLoc": addHeader[i].FuncLoc,
					"SWO": addHeader[i].SWO,
					"Sort": addHeader[i].Sort,
					"Unit": addHeader[i].Unit,

					"child": aItem
				};
				nodeData.push(array);
				var treeData = {
					"d": {
						"result": {
							"child": nodeData
						}
					}
				};

				this.getView().getModel("hierarchyModel").setData(treeData);

			}
		},
		onSubstanceListPress: function(oItem) {
			this.getRouter().navTo("subsatnceList", {
				subsatnceListId: "Test" //oItem.getBindingContext().getProperty("CompCode")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {object} oTableSearchState an array of filters for the search
		 * @private
		 */
		_applySearch: function(oTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(oTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (oTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},

		onAfterRendering: function() {
			
		//	this.$().removeClass('sapUiSizeCompact');
			
		//	this.getView().byId("segmentedButtonId").removeClass('sapUiSizeCompact');
			var that = this;

			function loadJSON(callback) {

				var xobj = new XMLHttpRequest();
				xobj.overrideMimeType("application/json");
				xobj.open('GET', '../model/config.json', true); // Replace 'my_data' with the path to your file
				xobj.onreadystatechange = function() {
					if (xobj.readyState == 4 && xobj.status == "200") {
						// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
						callback(xobj.responseText);
					}
				};
				xobj.send(null);
			}

			loadJSON(function(response) {
				var actual_JSON = JSON.parse(response);
				oJSONField = new sap.ui.model.json.JSONModel();
				oJSONField.setData(actual_JSON);
				that.onDataBinding();
				console.log(oJSONField);
			});
		},

		onDataBinding: function(oEvent) {
			var oController = this;
			var oView = this.getView();
			var idVertical = oView.byId("VerticalLayout");

			var myData = oJSONField.oData.Sheet1;
			var lengthSF = myData.length;
			var grid = new sap.ui.layout.Grid({
				defaultSpan: "L6 M6 S6"
			});
			grid.addStyleClass("sapUiSmallMarginTop")
				//	var oPanel = new sap.m.Panel();
				/*	var oPanel   =  new sap.m.Panel(oPanel,{
						expandable : false, 
						expanded : false, 
					
						width : "auto"
					}).addStyleClass("");*/
			for (var i = 0; i < lengthSF; i++) {
				if (myData[i].APPL == "MA018" && myData[i].PROC_TYP == "AP") {
					var oPanel = new sap.m.Panel();
					var vLabel = new sap.m.Label({
						text: myData[i].FNAME + " : ",
						width: "8rem"
					}).addStyleClass("");

					oPanel.addContent(vLabel);

					if (myData[i].FLDTYP == "I") {

						var Input = new sap.m.Input({
							width: "auto",
							value: "",
							change: function(event) {

							},
							liveChange: function(event) {

							},
							showValueHelp: false,
							valueHelpRequest: function(event) {

							}
						}).addStyleClass("borderLine");

						oPanel.addContent(Input);
					} else if (myData[i].FLDTYP == "R") {

						var oComboBox = new sap.m.ComboBox({
							width: "9rem",
							showSecondaryValues: true,

							selectionChange: function() {}
						}).addStyleClass("");

						var oItemTemplate = new sap.ui.core.ListItem();
						oItemTemplate.bindProperty("text", "D>device");
						oComboBox.bindItems("D>/hardware", oItemTemplate);
						oPanel.addContent(oComboBox);
					} else if (myData[i].FLDTYP == "T") {

						var oDateTimePicker = new sap.m.DateTimePicker({
							width: "9rem"
						});
						oPanel.addContent(oDateTimePicker);

					} else if (myData[i].FLDTYP == "D") {

						var oDatePicker = new sap.m.DateTimePicker({
							width: "auto"
						}).addStyleClass("borderLine");
						oPanel.addContent(oDatePicker);

					} else if (myData[i].FLDTYP == "N") {

						var oText = new sap.m.Text({
							width: "9rem"
						}).addStyleClass("");
						oPanel.addContent(oText);

					} else if (myData[i].FLDTYP == "C") {

						var oCheckBox = new sap.m.CheckBox({
							width: "9rem"
						}).addStyleClass("");
						oPanel.addContent(oCheckBox);
					}
					grid.addContent(oPanel);
				}

			}

			//	grid.addContent(oPanel);
			idVertical.addItem(grid);
			/*	idVertical.addContent(grid);*/

		},

		onCollapseAll: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapseAll();
		},

		onCollapseSelection: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapse(oTreeTable.getSelectedIndices());
		},

		onExpandFirstLevel: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expandToLevel(1);
		},

		onExpandSelection: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expand(oTreeTable.getSelectedIndices());
		},
		onAfterRenderingrs: function() {
			var that = this;

			function loadJSON(callback) {

				var xobj = new XMLHttpRequest();
				xobj.overrideMimeType("application/json");
				xobj.open('GET', '../model/config.json', true); // Replace 'my_data' with the path to your file
				xobj.onreadystatechange = function() {
					if (xobj.readyState == 4 && xobj.status == "200") {
						// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
						callback(xobj.responseText);
					}
				};
				xobj.send(null);
			}

			loadJSON(function(response) {
				var actual_JSON = JSON.parse(response);
				oJSONField = new sap.ui.model.json.JSONModel();
				oJSONField.setData(actual_JSON);
				that.onDataBinding();
				console.log(oJSONField);
			});
		},

		onDataBindings: function(oEvent) {
			var oController = this;
			var oView = this.getView();
			var idVertical = oView.byId("icon");

			var myData = oJSONField.oData.Sheet1;
			var lengthSF = myData.length;
			var grid = new sap.ui.layout.Grid({
				defaultSpan: "L4 M6 S12"
			});
			//	var oPanel = new sap.m.Panel();
			/*	var oPanel   =  new sap.m.Panel(oPanel,{
					expandable : false, 
					expanded : false, 
				
					width : "auto"
				}).addStyleClass("");*/
			for (var i = 0; i < lengthSF; i++) {
				if (myData[i].APPL == "MA018" && myData[i].PROC_TYP == "AP") {
					var oPanel = new sap.m.Panel();
					var vLabel = new sap.m.Label({
						text: myData[i].FNAME + " : ",
						width: "8rem"
					}).addStyleClass("sapUiSmallMarginEnd");

					oPanel.addContent(vLabel);

					if (myData[i].FLDTYP == "I") {

						var Input = new sap.m.Input({
							width: "9rem",
							value: "",
							change: function(event) {

							},
							liveChange: function(event) {

							},
							showValueHelp: false,
							valueHelpRequest: function(event) {

							}
						}).addStyleClass("");

						oPanel.addContent(Input);
					} else if (myData[i].FLDTYP == "R") {

						var oComboBox = new sap.m.ComboBox({
							width: "9rem",
							showSecondaryValues: true,

							selectionChange: function() {}
						}).addStyleClass("");

						var oItemTemplate = new sap.ui.core.ListItem();
						oItemTemplate.bindProperty("text", "D>device");
						oComboBox.bindItems("D>/hardware", oItemTemplate);
						oPanel.addContent(oComboBox);
					} else if (myData[i].FLDTYP == "T") {

						var oDateTimePicker = new sap.m.DateTimePicker({
							width: "9rem"
						});
						oPanel.addContent(oDateTimePicker);

					} else if (myData[i].FLDTYP == "D") {

						var oDatePicker = new sap.m.DateTimePicker({
							width: "9rem"
						}).addStyleClass("");
						oPanel.addContent(oDatePicker);

					} else if (myData[i].FLDTYP == "N") {

						var oText = new sap.m.Text({
							width: "9rem"
						}).addStyleClass("");
						oPanel.addContent(oText);

					} else if (myData[i].FLDTYP == "C") {

						var oCheckBox = new sap.m.CheckBox({
							width: "9rem"
						}).addStyleClass("");
						oPanel.addContent(oCheckBox);
					}
					grid.addContent(oPanel);
				}

			}

			//	grid.addContent(oPanel);

			idVertical.addContent(grid);

		},
	});
});