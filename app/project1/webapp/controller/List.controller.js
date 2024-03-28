sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/f/library",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,fioriLibrary,Filter, FilterOperator,) {
        "use strict";

        return Controller.extend("app.project1.controller.List", {
            onInit: function () {
                this._oTable = this.byId("table0");
                var oDetailModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oDetailModel, "detailModel");
              


            },
            onCreate: function () {
                
                    const oList = this._oTable;
                        const oBinding = oList.getBinding("items");
                        const oContext = oBinding.create({
                            "name": this.byId("EntityNamee").getValue(),
                              
                        });
                      
               
    
            },
            onOpenAddDialog: function () {
                this.getView().byId("OpenDialog").open();
             },
             onCancelDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
             },
             onEditMode: function(){
                this.byId("editModeButton").setVisible(false);
                this.byId("saveButton").setVisible(true);
                this.byId("deleteButton").setVisible(true);
                this.rebindTable(this.oEditableTemplate, "Edit");
           },
           onDelete: function(){

            var oSelected = this.byId("table0").getSelectedItem();
            if(oSelected){
                var oSalesOrder = oSelected.getBindingContext("mainModel").getObject().soNumber;
            
                oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                    MessageToast.show(oSalesOrder + " SuccessFully Deleted");
                }.bind(this), function (oError) {
                    MessageToast.show("Deletion Error: ",oError);
                });
            } else {
                MessageToast.show("Please Select a Row to Delete");
            }
            
        },
        onListItemPress: function (oEvent) {
           var oItem = oEvent.getSource();
            //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           var oSelectedContext = oItem.getBindingContext("mainModel");
            var oSelectedEntity = oSelectedContext.getProperty("name");
            var oSelectedEntityid = oSelectedContext.getProperty("ID"); 
            // Passer les données de l'entité sélectionnée à la deuxième vue et afficher cette vue
           // var oDetailView = this.getView().getParent().getParent().getMidColumnPages()[0];
           /*  oDetailView.setModel(new sap.ui.model.json.JSONModel(oSelectedEntity), "selectedEntityModel");
            this.getView().getParent().getParent().setLayout(sap.f.LayoutType.TwoColumnsMidExpanded); */
            var oModel = this.getOwnerComponent().getModel("detailModel");
            oModel.setProperty("/name", oSelectedEntity);
            oModel.setProperty("/id", oSelectedEntityid);


            


            this.getOwnerComponent().getRouter().navTo("Details", {
				index: oSelectedEntityid
			});
            var Model = this.getOwnerComponent().getModel("localModel");
            Model.setProperty("/layout", "TwoColumnsMidExpanded");






        },
        
        filterEntityById: function(id) {
            let oModel = this.getView().getModel();
            let aFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, id);
        
            oModel.bindList("{mainModel>/Entity}", undefined, undefined, [aFilter]).requestContexts().then(function(aContexts) {
                aContexts.forEach(oContext => {
                    console.log(oContext.getObject());
                });
            });
        },
        onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("name", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oUploadSet = this.byId("table0");
			var oBinding = oUploadSet.getBinding("items");
			oBinding.filter(aFilters, "Application");
		}
        
        
        
        });
    });