;(function($)
{
var UTILNAME = "Acl";

var NC = Utils.Pages["Frame.NC"].NC_Acl;

    function AclDB()
    {
        this.getRequestTable = getRequestTable;
        this.getData = getData;
        this.addToTypehead = addToTypehead;

        var _oTable = NC.AclGroups;

        function getRequestTable(sType, sRange/*such as "notMore:3999"*/)
        {
            var oRstTable = Utils.Request.getTableInstance(_oTable);
            if("ipv4" == sType)
            {
                oRstTable.addFilter({"GroupType": "1"});
            }
            else if("ipv6" == sType)
            {
                oRstTable.addFilter({"GroupType": "2"});
            }
            
            if(sRange)
            {
                oRstTable.addMatchFilter({"GroupID": sRange});
            }
            return oRstTable;
        }

        function getData(oInfos, sType)
        {
            var aData = Utils.Request.getTableRows(_oTable, oInfos);
            var aTypeData = [];
            if("ipv4" == sType)
            {
                sType = "1";
            }
            else if("ipv6" == sType)
            {
                sType = "2";
            }
            else
            {
                return aData;
            }

            for (var i=0, k=aData.length; i<k; i++)
            {
                var oOneAcl =aData[i];
                (sType == oOneAcl.GroupType) && aTypeData.push(oOneAcl);
            }
            return aTypeData;
        }

        function addToTypehead(sSelector, aData)
        {
            for(var i=0; i<aData.length; i++)
            {
                if(aData[i].Name)
                {
                    aData[i].text = aData[i].GroupID + " " + aData[i].Name;
                }
            }

            $(sSelector).typehead("setData",aData, {displayField:"GroupID",valueField:"GroupID",itemField:"text"});
        }

        function init()
        {
        }

        init();
    }

    function createDB()
    {
        return new AclDB();
    }

    function openAddDlg(cb, aclType)
    {
        var oPagePara = {"aclType":aclType,defVal:{}, cb:cb};
        var oDlgPara = {className: "modal-large", scope:"_open_acl_dlg"};
        Utils.Base.openDlg("Acl.Add_acl", oPagePara, oDlgPara);
    }

    var oAcl = {
        createDB : createDB,
        openAddDlg: openAddDlg
    };

    Utils.regUtil(UTILNAME, oAcl, {"widgets": [], "utils":["Request"]});
})(jQuery);
