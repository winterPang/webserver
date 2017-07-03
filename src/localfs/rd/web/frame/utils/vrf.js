;(function($)
{
    var UTILNAME = "Vrf";
    var NC = Utils.Pages["Frame.NC"].NC_VRF;

    var _bSupportVrf;

    function createDB()
    {
        return new vrfDB();
    }

    function isSupportVrf ()
    {
        return _bSupportVrf;
    }

    function vrfDB()
    {
        this.getRequestTable = getRequestTable;
        this.addData = addData;
        this.getDataByVrf = getDataByVrf;
        this.getAllData = getAllData;
        this.getVrfByIndex = getVrfByIndex;
        this.getIndexByVrf = getIndexByVrf;

        var _aData;
        var _oVrfCach = {};
        var _oIndexCach = {};

        function getRequestTable()
        {
            var oRequest = null;

            if(isSupportVrf())
            {
                oRequest = Utils.Request.getTableInstance(NC.VrfTable);
            }

            return oRequest;
        }

        function addData(oInfos)
        {
            var aTemData = Utils.Request.getTableRows(NC.VrfTable, oInfos);

            if(false === MyConfig.supportVrf)
            {
                aTemData = [{VRF:"VRF_1", VrfIndex:"1"}
                         ,{VRF:"test1", VrfIndex:"2"}
                         ,{VRF:"test2", VrfIndex:"3"}
                         ,{VRF:"123", VrfIndex:"4"}
                         ,{VRF:"This_is_the_max_long_name_o_vrf", VrfIndex:"5"}
                         ];
            }

            // "Public" can't be returned from device, so insert to the first
            _aData.push ({VRF:"", VrfIndex:"0", VrfName:$.MyLocale.VRF_PUBLIC, Description: $.MyLocale.VRF_PUBLIC});
            _oIndexCach[_aData[0].VrfIndex] = _aData[0];

            for (var i=0, len=aTemData.length; i<len; i++)
            {
                aTemData[i].VrfName = aTemData[i].VRF;
                _aData.push (aTemData[i]);

                _oVrfCach[aTemData[i].VRF] = aTemData[i];
                _oIndexCach[aTemData[i].VrfIndex] = aTemData[i];
            }

            return;
        }

        function getDataByVrf(sVrf, sItem)
        {
            var sVal = null;
            var oData

            if (!sVrf)
            {
                oData = {VRF:"", VrfIndex: "0", VrfName: $.MyLocale.VRF_PUBLIC, Description: $.MyLocale.VRF_PUBLIC};
            }
            else
            {
                oData = _oVrfCach[sVrf];
            }
            return oData[sItem];
        }

        function getIndexByVrf(sVrf)
        {
            return getDataByVrf (sVrf, "VrfIndex");
        }

        function getVrfByIndex(sVrfIndex)
        {
            return (_oIndexCach[sVrfIndex]||{VRF:null}).VRF;
        }

        function getAllData(aItems, aDatas)
        {
            aDatas = aDatas || [];
            for (var i = 0, j = _aData.length; i < j; i++)
            {
                var oRow = {};
                for (var k = 0, f = aItems.length; k < f; k++)
                {
                    oRow[aItems[k]] = _aData[i][aItems[k]];
                }
                aDatas.push(oRow);
            }
            return aDatas;
        }

        function init()
        {
            _aData = [];
        }

        init();
    }

    function checkVrf (cb)
    {
        function onSuccess ()
        {
            _bSupportVrf = true;
            cb&&cb ();
        }

        function onFailed ()
        {
            _bSupportVrf = false;
            cb&&cb ();
        }

        if (undefined === _bSupportVrf)
        {
            var oRequest = Utils.Request.getTableInstance(NC.VrfTable);
            var opt = {
                onSuccess: onSuccess,
                onFailed: onFailed,
                showMsg: false,
                showErrMsg: false
            };
            Utils.Request.get([oRequest], 1, opt);
        }
        else
        {
            cb&&cb ();
        }
    }

    var oVrf = {
        isSupportVrf : isSupportVrf,
        createDB : createDB
    };

    checkVrf (function()
    {
        Utils.regUtil(UTILNAME, oVrf, {"widgets": [], "utils":["Request"]});
    });

})(jQuery);