;(function($)
{
    var UTILNAME = "Device";
    var NC = Utils.Pages["Frame.NC"].NC_Device;
    var _oCurDevCap = {};
    var _oCurMaster = {};

    function getMaster()
    {
        return _oCurMaster;
    }

    function getEffDevNode(oDevNode)
    {
        var oEffDevNode = {};
        for (var i in _oCurDevCap)
        {
            if (oDevNode[i] && (i != "SubSlot" || oDevNode[i] != 65535))
            {
                oEffDevNode[i] = oDevNode[i];
            }
        }
    	return oEffDevNode;
    }

    function getMasterStr()
    {
        return transDevNode(_oCurMaster);
    }

    function transDevNode(oDevNode)
    {
        var oEffDevNode = getEffDevNode(oDevNode);
        var oNodeStr = "";
        for (var i in oEffDevNode)
        {
            oNodeStr += (i  + oEffDevNode[i]);
        }
        return oNodeStr;
    }

    function isSupportMdc()
    {
        return Frame.get("mdcid") != "0";
    }

    var oDevice = {
    	getMaster : getMaster,
    	transDevNode : transDevNode,
        getMasterStr : getMasterStr,
        isSupportMdc : isSupportMdc,
        getEffDevNode : getEffDevNode
    };    

    function onRequestBack(oData)
    {
        var aMaster = Utils.Request.getTableRows(NC.BoardsTable, oData);
        var aCap = Utils.Request.getTableRows(NC.DeviceCap, oData);

        try
        {
            var oCap = aCap[0];
            if (oCap.MinChassisNum != oCap.MaxChassisNum)
            {
                _oCurDevCap["Chassis"] = {min:oCap.MinChassisNum, max:oCap.MaxChassisNum};
            }
            if (oCap.MinSlotNum != oCap.MaxSlotNum)
            {
                _oCurDevCap["Slot"] = {min:oCap.MinSlotNum, max:oCap.MaxSlotNum};
            }
            _oCurDevCap["SubSlot"] = {min:"0", max:"65535"};
            if (oCap.MinCPUIDNum != oCap.MaxCPUIDNum)
            {
                _oCurDevCap["CPUID"] = {min:oCap.MinCPUIDNum, max:oCap.MaxCPUIDNum};
            }

            var oMaster = aMaster[0];
            for (var i in _oCurDevCap)
            {
                _oCurMaster[i] = oMaster["DeviceNode." + i];
            }
        }
        catch(e)
        {}

        Utils.regUtil(UTILNAME, oDevice, {"widgets": [], "utils":[]});
    }

    function onRequestLoaded()
    {
        var oBoards = Utils.Request.getTableInstance(NC.BoardsTable);
        oBoards.addFilter({"Role" : 2});
        var oCap = Utils.Request.getTableInstance(NC.DeviceCap);
        Utils.Request.getAll([oBoards, oCap], onRequestBack);
    }
    
    Utils.loadUtil("Request", onRequestLoaded);
})(jQuery);