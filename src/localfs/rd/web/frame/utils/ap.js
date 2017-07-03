;(function($)
{
    var UTILNAME = "AP";
    var NC = Utils.Pages["Frame.NC"].NC_AP;
    // var NC = null;

    function ApDB(aColumn,sType)
    {
        this.getRequestTable = getRequestTable;
        this.getData = getData;
        this.addToTypehead = addToTypehead;
        this.addToSelect = addToSelect;

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
            var aItems = [];
            for(var i=0; i<aData.length; i++)
            {
               aItems.push(aData[i].Name);
            }

            $(sSelector).typehead("setData",aItems);
        }

        function addToSelect(sSelector, aData, allowClear)
        {
            var aItems = [];
            for(var i=0; i<aData.length; i++)
            {
               aItems.push(aData[i].Name);
            }

            allowClear = allowClear ? true : false;

            $(sSelector).singleSelect("InitData",aItems,{allowClear:allowClear});
        }

        function getReqTable(aColumn)
        {
            // var oTbale = NC[sType];
            var aDefColumn = oTbale.column;
            if (undefined === aColumn)
            {
                oTbale.column = aDefColumn;
                return oTbale;
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

            oTbale.column = aDataCol;
            return oTbale;
        }

        var _oTable = getReqTable (aColumn);
        
    }

    function _getRegionDBData()
    {
        function onReqErr()
        {
           _getRegionDBData();
        }
        
        function Callback(oInfos)
        {
            var aRegionDB = Utils.Request.getTableRows(NC.RegionDB,oInfos)||[];
            Frame.arrRedionDB = aRegionDB;
            oAp._RegionCallback && oAp._RegionCallback(aRegionDB);
        }

        var oRegionDB = Utils.Request.getTableInstance(NC.RegionDB);
        Utils.Request.getAll([oRegionDB], Callback, onReqErr, {showErrMsg:false});
    }

    function _getApdbData()
    {
        function onReqErr()
        {
            _getApdbData();
        }
        
        function Callback(oInfos)
        {
            var aAPDB = Utils.Request.getTableRows(NC.APDB,oInfos)||[];
            Frame.arrAPDB = aAPDB;
            oAp._ApCallback && oAp._ApCallback(aAPDB);
        }

        var oAPDB = Utils.Request.getTableInstance(NC.APDB);
        Utils.Request.getAll([oAPDB], Callback, onReqErr, {showErrMsg:false});
    }

    function ManualAP(aColumn)
    {
        return new ApDB(aColumn,"ManualAP");
    }

    function RunAP(aColumn)
    {
        return new ApDB(aColumn,"RunAP");
    }

    function APGroup(aColumn)
    {
        return new ApDB(aColumn,"APGroup");
    }

    function APLocation(aColumn)
    {
        return new ApDB(aColumn,"Location");
    }

    function RadioOfMAP(aColumn)
    {
        return new ApDB(aColumn,"RadioOfMAP");
    }

    function RadioRunningCfg(aColumn)
    {
        return new ApDB(aColumn,"RadioRunningCfg");
    }

    function getAPDB(pfCallback)
    {
        if(Frame.arrAPDB)
        {
            pfCallback && pfCallback(Frame.arrAPDB);
        }
        else
        {
            this._ApCallback = pfCallback;
        }
    }

    function getRegionDB(pfCallback)
    {
        if(Frame.arrRedionDB)
        {
            pfCallback && pfCallback(Frame.arrRedionDB);
        }
        else
        {
            this._RegionCallback = pfCallback;
        }
    }

    function radioDisplay(sMode,nRadioId)
    {
        var sMode = typeof(sMode)=="String" ? sMode : sMode+"";
        switch(sMode)
        {
            case "2":
            case "5":
            case "7":
                sRadio = "5GHz";
                break;
            case "1":
            case "3":
            case "4":
            case "6":
                sRadio = "2.4GHz";
                break;
            default:
                break;
        }
        sRadio = sRadio + "(" + nRadioId +")";
        return sRadio;
    }
    
    var oAp = {
        ManualAP : ManualAP,
        RunAP : RunAP,
        APGroup : APGroup,
        APLocation : APLocation,
        RadioOfMAP : RadioOfMAP,
        RadioRunningCfg : RadioRunningCfg,
        getAPDB : getAPDB,
        getRegionDB : getRegionDB,
        radioDisplay: radioDisplay,
        _ApCallback : false ,
        _RegionCallback : false 
    };

    function _init()
    {
        !Frame.arrAPDB &&_getApdbData();
        !Frame.arrRedionDB && _getRegionDBData();
    }

    Utils.regUtil(UTILNAME, oAp);
    Utils.loadUtil("Request",_init);
})(jQuery);
