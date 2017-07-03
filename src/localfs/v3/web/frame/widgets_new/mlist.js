;(function($)
{
	var WIDGETNAME = "Mlist";

	var oMlist = {
		_create: function(){
			this._oMlist = this.element;
		},
		head: function(oOption){
			return Frame.MList.create(this._oMlist.attr("id"), oOption);
		},
		refresh: function(aData, bKeepSearch){
			Frame.MList.refresh(this._oMlist.attr("id"), aData, bKeepSearch);
		},
		reLoad: function(aData)
		{
			var jMList = this._oMlist;
			var sMListId = this._oMlist.attr("id");

			// empty the datas
			Frame.MList.refresh(sMListId, []);

			// show loading
			$(".mlist-loading", jMList).show();
		},
		resize: function(){
			Frame.MList.resize(this.element.attr("id"));
		},
		commitEdit: function(){
			return Frame.MList.commitEdit(this.element.attr("id"));
		},
		cancelEdit: function(){
			return Frame.MList.cancelEdit(this.element.attr("id"));
		},
		fillSelect: function(aData){
			Frame.MList.Filter.fillSelect(Frame.MList.getAllColName(this._oMlist.attr("id")), aData);
		},
		appendToToolBar: function(oEle){
			Frame.MList.getToolBar(this._oMlist.attr("id")).append(oEle);
		},
		addRow: function(opt){
			Frame.MList.addRow(this.element.attr("id"), opt);
		},
		editRow: function(nRowId, opt){
			Frame.MList.editRow(this.element.attr("id"), nRowId, opt);
		},
		getData: function(rowId)
		{
			var sListId = this._oMlist.attr("id");
			return Frame.MList.getData(sListId, rowId);
		},
		selectDatas: function()
		{
			var sListId = this._oMlist.attr("id");
			var aSelect = Frame.MList.getSelectedRows(sListId);
			var aDatas = [];
			for(var i = 0;i<aSelect.length;i++)
			{
				aDatas.push(Frame.MList.getData(sListId, aSelect[i]));
			}
			return aDatas;
		},
		getSelectedRows: function ()
		{
			return Frame.MList.getSelectedRows(this._oMlist);
		},
		selectRows: function (rows)
		{
			Frame.MList.selectRows(this._oMlist, rows);
		},
		updateRows: function (aRow, aData)
		{
			Frame.MList.updateRows(this._oMlist, aRow, aData);
		},
		enable: function(bEable){
			var sListId = this._oMlist.attr("id");
			Frame.MList.enable(sListId, bEable);
		},
		reset: function()
		{
			var sListId = this._oMlist.attr("id");
			Frame.MList.destroy(sListId);
		},
		destroy:function()
		{
			this.reset();

			this._oMlist = null;
			$.Widget.prototype.destroy.call(this);
		}
	};

    function _init(oFrame)
    {
        $(".mlist", oFrame).mlist();
    }

    function _destroy(oFrame)
    {
    	$(".mlist", oFrame).mlist("destroy");
    }

    $.widget("ui.mlist", oMlist);
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":[],
        "libs": ["Libs.slickgrid.core"
        		,"Libs.slickgrid.plugins.rowselectionmodel"
        		,"Libs.slickgrid.plugins.checkboxselectcolumn"
        		,"Libs.slickgrid.dataview"
        		,"Libs.slickgrid.controls.pager"
        		,"Libs.slickgrid.controls.columnpicker"
        		,"Libs.slickgrid.grid"
        		,"Libs.slickgrid.editors"
        		,"Widgets.MList"]
    });
})(jQuery);
