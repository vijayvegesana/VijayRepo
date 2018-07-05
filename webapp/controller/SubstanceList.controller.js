sap.ui.define([
                "sap/ui/core/mvc/Controller"
], function(Controller) {
                "use strict";

                return Controller.extend("com.myagri.controller.SubstanceList", {

                                /**
                                * Called when a controller is instantiated and its View controls (if available) are already created.
                                * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
                                * @memberOf com.myagri.view.SubstanceList
                                */
                                                onInit: function() {
                                var myData = [{
                                                "Product" : "300000000149",
                                                "Description" : "SOA",
                                                "SLoc" : "",
                                                "Plant" : "0.00",
                                                "Total" : "0.000",
                                                "Unit" : "MT",
                                                "Batch" : ""
                                },
                                {
                                                "Product" : "300000000149",
                                                "Description" : "SOA",
                                                "SLoc" : "",
                                                "Plant" : "0.00",
                                                "Total" : "0.000",
                                                "Unit" : "MT",
                                                "Batch" : ""
                                }];
                                
                                                var oModel = new sap.ui.model.json.JSONModel(myData);
                                                                                                this.getView().byId("substanceListTableId").setModel(oModel, "oModel");

                                                },
                                                
                                                onAddSubstanceList : function(){
                                                var data =            this.getView().byId("substanceListTableId").getModel("oModel").getData();
                                                                
                                                                var newObj =     {
                                                "Product" : "",
                                                "Description" : "",
                                                "SLoc" : "",
                                                "Plant" : "",
                                                "Total" : "",
                                                "Unit" : "MT",
                                                "Batch" : ""
                                };
                                data.push(newObj);
                                this.getView().byId("substanceListTableId").getModel("oModel").refresh(true);
                                                },
                                                
                                                onDeleteSubstanceList : function(){
                                                                
                                                                var oModel = this.getView().byId("substanceListTableId").getModel("oModel");
                                                                var data = oModel.getData();//.results[0].F4ItemNav.results;

                                                                var oTable = this.byId("substanceListTableId");
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

                                /**
                                * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
                                * (NOT before the first rendering! onInit() is used for that one!).
                                * @memberOf com.myagri.view.SubstanceList
                                */
                                //            onBeforeRendering: function() {
                                //
                                //            },

                                /**
                                * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
                                * This hook is the same one that SAPUI5 controls get after being rendered.
                                * @memberOf com.myagri.view.SubstanceList
                                */
                                //            onAfterRendering: function() {
                                //
                                //            },

                                /**
                                * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
                                * @memberOf com.myagri.view.SubstanceList
                                */
                                //            onExit: function() {
                                //
                                //            }

                });

});
