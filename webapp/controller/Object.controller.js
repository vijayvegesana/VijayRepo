/*global location*/
var oJSONField;
sap.ui.define([
		"com/myagri/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"com/myagri/model/formatter"
	], function (
		BaseController,
		JSONModel,
		History,
		formatter
	) {
		"use strict";

		return BaseController.extend("com.myagri.controller.Object", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			},
			
            
	          
				onAfterRendering: function() {
				var that = this;
		        function loadJSON(callback) {   

				    var xobj = new XMLHttpRequest();
				        xobj.overrideMimeType("application/json");
				    xobj.open('GET', '../model/config.json', true); // Replace 'my_data' with the path to your file
				    xobj.onreadystatechange = function () {
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


				onDataBinding : function(oEvent){
					    var oController   = this;
						var oView 		  = this.getView();
						var idVertical    = oView.byId("VerticalLayout");
					
						var myData =oJSONField.oData.Sheet1;
						var lengthSF =myData.length;
						var grid   = new sap.ui.layout.Grid({defaultSpan:"L6 M6 S6"});
						grid.addStyleClass("sapUiSmallMarginTop")
					//	var oPanel = new sap.m.Panel();
					/*	var oPanel   =  new sap.m.Panel(oPanel,{
							expandable : false, 
							expanded : false, 
						
							width : "auto"
						}).addStyleClass("");*/
						for(var i=0 ; i< lengthSF ; i++){
							if(myData[i].APPL =="MA018" && myData[i].PROC_TYP =="AP"){
									var oPanel   =  new sap.m.Panel();
								var vLabel = new sap.m.Label({
									text:myData[i].FNAME +" : ",
									width:"8rem"
									}).addStyleClass("");
								
								oPanel.addContent(vLabel);
							
							if(myData[i].FLDTYP =="I"){
							
							   var Input = new sap.m.Input({
										width:"auto",
									value:"",
									change: function(event) {
				                    
					                    },
									liveChange:function(event) {
		
				                    },
									showValueHelp: false,
									valueHelpRequest:function(event) {
		
				                    }
								}).addStyleClass("borderLine");
								
								oPanel.addContent(Input);
							}else if(myData[i].FLDTYP =="R"){
									
								var oComboBox = new sap.m.ComboBox({
									width:"9rem",
									showSecondaryValues : true,
								
									selectionChange : function (){}
								}).addStyleClass("");
								
								var oItemTemplate = new sap.ui.core.ListItem();
								oItemTemplate.bindProperty("text", "D>device");
								oComboBox.bindItems("D>/hardware", oItemTemplate);
								oPanel.addContent(oComboBox);
							}else if(myData[i].FLDTYP =="T"){
								
								var oDateTimePicker = new sap.m.DateTimePicker({width:"9rem"});
								oPanel.addContent(oDateTimePicker);
								
							}else if(myData[i].FLDTYP =="D"){
								
								var oDatePicker = new sap.m.DateTimePicker({
									width:"auto"
								}).addStyleClass("borderLine");
								oPanel.addContent(oDatePicker);
								
							}else if(myData[i].FLDTYP =="N"){
								
								var oText = new sap.m.Text({width:"9rem"}).addStyleClass("");
								oPanel.addContent(oText);
								
							}else if(myData[i].FLDTYP =="C"){
								
								var oCheckBox = new sap.m.CheckBox({width:"9rem"}).addStyleClass("");
								oPanel.addContent(oCheckBox);
							}	
							grid.addContent(oPanel);
							}
						
						}
						
					//	grid.addContent(oPanel);
					idVertical.addItem(grid);
					/*	idVertical.addContent(grid);*/
					
		
					},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("objectView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},

			/**
			 * Event handler  for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the worklist route.
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					this.getRouter().navTo("worklist", {}, true);
				}
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				/*this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("BalStatPostingSet", {
						CompCode :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));*/
			},

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound
			 * @private
			 */
			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								// Busy indicator on view should only be set if metadata is loaded,
								// otherwise there may be two busy indications next to each other on the
								// screen. This happens because route matched handler already calls '_bindView'
								// while metadata is loaded.
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}

				var oResourceBundle = this.getResourceBundle(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.CompCode,
					sObjectName = oObject.Afpos;

				// Everything went fine.
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			}

		});

	}
);