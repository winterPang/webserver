;(function($)
{
var UTILNAME = "Vlan";
var NC = Utils.Pages["Frame.NC"].NC_VLAN;
var aDefColumn = NC.VlanGroups.column;

function getReqTable(aColumn)
{
    var aTable = NC.VlanGroups;
    if (undefined === aColumn)
    {
        aTable.column = aDefColumn;
        return aTable;
    }

    aColumn = aColumn || [];
    if (!$.isArray(aColumn))
    {
        aColumn = [aColumn];
    }

    var oColum = {};
    for (var i=0, k=aColumn.length; i<k; i++)
    {
        oColum[aColumn[i]] = true;
    }

    var aDataCol = [];
    for (var i=0, k=aDefColumn.length; i<k; i++)
    {
        if (oColum[aDefColumn[i]])
        {
            aDataCol.push (aDefColumn[i]);
        }
    }

    aTable.column = aDataCol;
    return aTable;
}

    function VlanDB(aColumn)
    {
        this.getRequestTable = getRequestTable;
        this.getData = getData;
        this.addToTypehead = addToTypehead;

        var _oTable = getReqTable (aColumn);

        function getRequestTable()
        {
            var oRstTable = Utils.Request.getTableInstance(_oTable);
            return oRstTable;
        }

        function getData(oInfos)
        {
            var aData = Utils.Request.getTableRows(_oTable, oInfos);
            return aData;
        }

        function addToTypehead(sSelector, aData)
        {
            for(var i=0; i<aData.length; i++)
            {
	        aData[i].text = aData[i].ID;
                if(aData[i].Description)
                {
                    aData[i].text += " - " + aData[i].Description;
                }
            }

            $(sSelector).typehead("setData",aData, {displayField:"ID",valueField:"ID",itemField:"text"});
        }

        function init()
        {
        }

        init();
    }

    function createDB(aColumn)
    {
        return new VlanDB(aColumn);
    }

    function openAddDlg(cb, vlanType)
    {
        var oPagePara = {"vlanType":vlanType,defVal:{}, cb:cb};
        var oDlgPara = {className: ""};
        Utils.Base.openDlg("VLAN.add_vlan", oPagePara, oDlgPara);
    }

    var oVlan = {
        createDB : createDB,
        openAddDlg: openAddDlg
    };

    Utils.regUtil(UTILNAME, oVlan, {"widgets": [], "utils":["Request"]});
})(jQuery);
