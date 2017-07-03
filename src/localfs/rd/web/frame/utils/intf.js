;(function($)
{
    var UTILNAME = "Intf";
    var NC = Utils.Pages["Frame.NC"].NC_Intf;
    var _oTypes = {
        "COMMON" : 0 ,      "NULL" : 30 ,            "LOOPXGE" : 60 ,     "LOOPTGE" : 90 ,      
        "AM" : 1 ,          "POS" : 31 ,             "MIRRORFE" : 61 ,    "MIRRORTGE" : 91 ,    
        "ASY" : 2 ,         "RPR_POS" : 32 ,         "MIRRORGE" : 62 ,    "IDSTGE" : 92 ,       
        "IMA" : 3 ,         "RPR_XGE" : 33 ,         "MIRRORXGE" : 63 ,   "AC" : 93 ,           
        "ATM" : 4 ,         "RPR_GE" : 34 ,          "IDSFE" : 64 ,       "UPW" : 94 ,          
        "AUX" : 5 ,         "SERIAL" : 35 ,          "IDSGE" : 65 ,       "NPW" : 95 ,          
        "BRI" : 6 ,         "SUBSCRIBER_LINE" : 36 , "IDSXGE" : 66 ,      "TUNNEL_BUNDLE" : 96 ,
        "BVI" : 7 ,         "T1" : 37 ,              "RAGG" : 67 ,        "EFM" : 97 ,          
        "CONSOLE" : 8 ,     "T3" : 38 ,              "L2FGE" : 68 ,       "MAPPED" : 98 ,          
        "CPOS" : 9 ,        "TUNNEL" : 39 ,          "L2HGE" : 69 ,       "CBGE" : 99 ,
        "DIALER" : 10 ,     "GLOBAL_VA" : 40 ,       "L3FGE" : 70 ,       "CBXGE" : 100 ,
        "LOCAL_VA" : 11 ,   "VLAN" : 41 ,            "L3HGE" : 71 ,       "CBFGE" : 101 ,
        "E1" : 12 ,         "VT" : 42 ,              "LOOPFGE" : 72 ,     "CBHGE" : 102 ,
        "E3" : 13 ,         "RADIO_DOT11" : 43 ,     "LOOPHGE" : 73 ,     "PEX" : 103 , 
        "INETH" : 14 ,      "WLAN_ESS" : 44 ,        "MIRRORFGE" : 74 ,   "VE_L2VPN" : 104 , 
        "INLOOPBACK" : 15 , "WLAN_DBSS" : 45 ,       "MIRRORHGE" : 75 ,   "VE_L3VPN" : 105 , 
        "LOOPBACK" : 16 ,   "WLAN_BSS" : 46 ,        "IDSFGE" : 76 ,      "BLADE" : 106 , 
        "ENCRYPT" : 17 ,    "WLAN_ETH" : 47 ,        "IDSHGE" : 77 ,      "BLAGG" : 107 , 
        "L2ETHERNET" : 18 , "WLAN_TUN" : 48 ,        "FC" : 78 ,          "ETHCHANNEL" : 108 , 
        "L2GE" : 19 ,       "OLT" : 49 ,             "VFC" : 79 ,         "BETH" : 109 , 
        "L2VE" : 20 ,       "ONU" : 50 ,             "FCB" : 80 ,         "RETH" : 110 , 
        "L2XGE" : 21 ,      "MTUNNEL" : 51 ,         "EVI_LINK" : 81 ,    "CEM"  : 111 , 
        "L3ETHERNET" : 22 , "CELLULAR" : 52 ,        "SCHANNEL" : 82 ,    "REV15" : 112 , 
        "L3GE" : 23 ,       "INASY" : 53 ,           "FCM" : 83 ,         "REV16" : 113 , 
        "L3VE" : 24 ,       "L2RPR" : 54 ,           "VPPP" : 84 ,        "REV17" : 114 , 
        "L3XGE" : 25 ,      "L3RPR" : 55 ,           "TRILL_REMOTE" : 85 ,"REV18" : 115 , 
        "ME" : 26 ,         "BAGG" : 56 ,            "HDLCBUNDLE" : 86 ,  "REV19" : 116 , 
        "MFR" : 27 ,        "REGISTER_TUNNEL" : 57 , "GSCHANNEL" : 87 ,   "REV20" : 117 , 
        "MGE" : 28 ,        "LOOPFE" : 58 ,          "L2TGE" : 88 ,       "REV21" : 118 , 
        "MPGROUP" : 29 ,    "LOOPGE" : 59 ,          "L3TGE" : 89 ,       "REV22" : 119 , 
        "MAX" : 128
    };

    function cloneObj(oSrc)
    {
    	var oDes = {};
    	$.each(oSrc, function (index, oItem) {oDes[index] = oSrc[index];return;});
    	return oDes;
    }

    function getAbbreviatedNameReq(oOpt)
    {
    	var oIfAbbrTable = cloneObj(NC.IfMgrTable);
    	oIfAbbrTable.column = ["AbbreviatedName"];
    	return Utils.Request.getTableInstance(oIfAbbrTable);
    }

    function getAbbreviatedNameByIndex(aIfMgr, sIfindex)
    {
    	var aRight = $.grep(aIfMgr, function (oItem, index) {return (oItem.IfIndex == sIfindex);}) || [];
    	return (aRight[0] ? aRight[0].AbbreviatedName:"");
    }

    function getIfmgrInfos (oRoot)
    {
    	return (oRoot.Ifmgr.Interfaces || []);
    }

    function createDB(aColums)
    {
        var oIntfDB = new intfDB();
        oIntfDB.addColums(aColums);
        return oIntfDB;
    }

    function intfDB()
    {
        this.addColums = addColums;
        this.selectTypes = selectTypes;
        this.selectEth = selectEth;
        this.selectL2 = selectL2;
        this.selectL3 = selectL3;
        this.getRequestTable = getRequestTable;
        this.addData = addData;
        this.getL2Intf = getL2Intf;
        this.getL3Intf = getL3Intf;
        this.isL2IntfByIndex = isL2IntfByIndex;
        this.isL3IntfByIndex = isL3IntfByIndex;
        this.isBroadIntfByIndex = isBroadIntfByIndex;
        this.isLoopBackIntfByIndex = isLoopBackIntfByIndex;
        this.isTypeIntfByIndex = isTypeIntfByIndex;
        this.isREGIntfByIndex = isREGIntfByIndex;
        this.getIfNameByIndex = getIfNameByIndex;
        this.getIfAbbrNameByIndex = getIfAbbrNameByIndex;
        this.getIfDataByIndex = getIfDataByIndex;
        this.getLoopBackIntf = getLoopBackIntf;
        this.getIfAbbrNameByPortIndex = getIfAbbrNameByPortIndex;
        this.getIfNameByPortIndex = getIfNameByPortIndex;
        this.getAllIfData = getAllIfData;
        this.getIfIndexByName = getIfIndexByName;
        this.getIfIndexByPhyIndex = getIfIndexByPhyIndex;
        this.getCapabilitiesRequestTable = getCapabilitiesRequestTable;
        this.addCapabilitiesData = addCapabilitiesData;
        this.getConfigIfData = getConfigIfData;

        var _oTable = {};
        var _bAllData = true;
        var _oSelTypeStrs = {};
        var _oSelTypeVals = {};
        var _oColums = {};
        var _iSelLayer = 0;
        var _aData = [];
        var _aIfindexCach = {};
        var _aPortindexCach = {};
        var _aCapabilitiesData = {};

        function selectTypes(aTypes)
        {
            if (!aTypes || aTypes.length == 0)
            {
                return;
            }

            for (var i = 0, j = aTypes.length; i < j; i++)
            {
                var sType = aTypes[i];
                if (sType in _oTypes)
                {
                    _oSelTypeStrs[sType] = true;
                    _oSelTypeVals[_oTypes[sType].toString()] = true;                    
                }
            }
            return;
        }

        function selectEth()
        {
            var aEthTypes = ["L2ETHERNET", "L2GE", "L2VE", "L2XGE", "L2TGE", "L3ETHERNET",
            "L3GE", "L3VE", "L3XGE", "L3TGE", "LOOPFE", "LOOPGE", "LOOPXGE",
            "LOOPTGE", "MIRRORFE", "MIRRORGE", "MIRRORXGE", "MIRRORTGE", "IDSFE",
            "IDSGE", "IDSXGE", "IDSTGE", "L2FGE", "L3FGE", "LOOPFGE", "MIRRORFGE",
            "IDSFGE", "L2HGE", "L3HGE", "LOOPHGE", "MIRRORHGE"];

            selectTypes(aEthTypes);
            return;
        }

        function selectL2()
        {
            _iSelLayer = 1;
            return;
        }

        function selectL3()
        {
            _iSelLayer = 2;
            return;
        }

        function getRequestTable()
        {
            var oRequest = Utils.Request.getTableInstance(_oTable);
            if(_iSelLayer != 0)
            {
                var sCol = "PortLayer";
                if (!_oColums[sCol])
                {
                    _oColums[sCol] = true;
                    _oTable.column.push(sCol);
                }
                oRequest.addFilter({"PortLayer" : _iSelLayer});
            }
            return oRequest;
        }

function getCapabilitiesRequestTable(filter)
{
/*****************************************************************************
@FuncName: public, IntfDB.getCapabilitiesRequestTable
@DateCreated: 2014-08-11
@Author: huangdongxiao 02807
@Description: get netconf request table of IfMgrCapabilities
@Usage:
@ParaIn:
    * filter, boolean/Object, filter paras. It can be boolean(true or false) or Object({configurable: true/false})
@Return:
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    var oRequest = Utils.Request.getTableInstance(NC.IfMgrCapabilities);

    // parse arguments
    var oFilter;
    if ( (true === filter) || (false === filter) )
    {
        oFilter = {configurable: filter};
    }
    else
    {
        oFilter = filter || {configurable: true};
    }

    // add filter
    if (true === oFilter.configurable)
    {
        oRequest.addFilter({"Configurable": "true"});
    }
    else if (false === oFilter.configurable)
    {
        oRequest.addFilter({"Configurable": "false"});
    }

    return oRequest;
}

        function addColums(oIntfColums)
        {
            if (!oIntfColums)
            {
                return;
            }

            var aColums = oIntfColums;

            if (!$.isArray(oIntfColums))
            {
                aColums = [oIntfColums];
            }
            else if (aColums.length == 0)
            {
                return;
            }

            if (_bAllData)
            {
                _oTable.column = [];
                _bAllData = false;
            }

            function addColum(iIndex, sItem)
            {
                if (!(sItem in _oColums))
                {
                    _oColums[sItem] = true;
                    _oTable.column.push(sItem);
                }
                return;
            }
            
            $.each(aColums, addColum);
        }

        function addData(oInfos)
        {
            var aTemData = Utils.Request.getTableRows(_oTable, oInfos);

            if (Utils.Base.isEmptyObj(_oSelTypeVals))
            {
                _aData = aTemData;
            }
            else
            {
                for (var i = 0, j = aTemData.length; i < j; i++)
                {
                    var sType = aTemData[i]["ifTypeExt"];
                    if (sType in _oSelTypeVals)
                    {
                        _aData.push(aTemData[i]);
                    }
                }
            }

            for (var i=0; i<_aData.length; i++)
            {
                _aIfindexCach[_aData[i].IfIndex] = _aData[i];
                _aPortindexCach[_aData[i].PortIndex] = _aData[i];
            }
            return;
        }

        function addCapabilitiesData(oInfos)
        {
            _aCapabilitiesData = Utils.Request.getTableRows(NC.IfMgrCapabilities, oInfos);
            return ;
        }

        function getLayerIntf(sSelLayer)
        {
            var aTemData = [];
            for (var i = 0, j = _aData.length; i < j; i++)
            {
                var sLayer = _aData[i]["PortLayer"];
                if (sLayer == sSelLayer)
                {
                    aTemData.push(_aData[i]);
                }
            }
            return aTemData;
        }

        function getLoopBackIntf()
        {
            var sType = _oTypes["LOOPBACK"].toString();
            var aTemData = [];
            for (var i = 0, j = _aData.length; i < j; i++)
            {
                var sTemType = _aData[i]["ifTypeExt"];
                if (sType == sTemType)
                {
                    aTemData.push(_aData[i]);
                }
            }
            return aTemData;
        }

        function getL2Intf()
        {
            return getLayerIntf("1");
        }

        function getL3Intf()
        {
            return getLayerIntf("2");
        }

        function getDataByIfItem(sIfIndex, sItem)
        {
            return _aIfindexCach[sIfIndex] || null;
        }

        function getIfDataByIndex(sIfIndex, sItem)
        {
            var oIfData = getDataByIfItem(sIfIndex, "IfIndex");
            var sIfData = null;
            if (oIfData)
            {
                sIfData = oIfData[sItem];
            }
            return sIfData;
        }

        function getDataByPortIndex(sPortIndex)
        {
            return _aPortindexCach[sPortIndex];
        }

        function isL2IntfByIndex(sIfIndex)
        {
            var oIfData = getDataByIfItem(sIfIndex, "IfIndex");
            var bL2Intf = false;
            if (oIfData && oIfData["PortLayer"] == "1")
            {
                bL2Intf = true;
            }
            return bL2Intf;
        }

        function isL3IntfByIndex(sIfIndex)
        {
            var oIfData = getDataByIfItem(sIfIndex, "IfIndex");
            var bL3Intf = false;
            if (oIfData && oIfData["PortLayer"] == "2")
            {
                bL3Intf = true;
            }
            return bL3Intf;
        }

        function isBroadIntfByIndex(sIfIndex)
        {
            var oIfData = getDataByIfItem(sIfIndex, "IfIndex");
            var bBroadIntf = false;
            if (oIfData && (parseInt(oIfData["ForWardingAttribute"])&1 == 1))
            {
                bBroadIntf = true;
            }
            return bBroadIntf;
        }

        function isLoopBackIntfByIndex(sIfIndex)
        {
            var oIfData = getDataByIfItem(sIfIndex, "IfIndex");
            var bLoopIntf = false;
            if (oIfData && (oIfData["ifTypeExt"] == _oTypes["INLOOPBACK"] || oIfData["ifTypeExt"] == _oTypes["LOOPBACK"]))
            {
                bLoopIntf = true;
            }
            return bLoopIntf;
        }

        function isTypeIntfByIndex(sIfIndex, sType)
        {
            var oIfData = getDataByIfItem(sIfIndex, "IfIndex");
            var bTypeIntf = false;
            if (oIfData && !isNaN(_oTypes[sType]) && (oIfData["ifTypeExt"] == _oTypes[sType]))
            {
                bTypeIntf = true;
            }
            return bTypeIntf;
        }

        function isREGIntfByIndex(sIfIndex)
        {
            var oIfData = getDataByIfItem(sIfIndex, "IfIndex");
            var bLoopIntf = false;
            if (oIfData && (oIfData["ifTypeExt"] == _oTypes["REGISTER_TUNNEL"]))
            {
                bLoopIntf = true;
            }
            return bLoopIntf;
        }

        function getIfNameByIndex(sIfIndex)
        {
            return getIfDataByIndex(sIfIndex, "Name");
        }

        function getIfIndexByName (sName) 
        {
            var oIfData = getDataByIfItem(sName, "Name");
            var sIfIndex = "";
            if(oIfData)
            {
                sIfIndex = oIfData["IfIndex"];
            }
            return sIfIndex;
        }

        function getIfIndexByPhyIndex (sPhyIndex)
        {
            var oIfData = getDataByIfItem(sPhyIndex, "PhysicalIndex");
            var sIfIndex = "";
            if(oIfData)
            {
                sIfIndex = oIfData["IfIndex"];
            }
            return sIfIndex;
        }

        function getIfAbbrNameByIndex(sIfIndex)
        {
            return getIfDataByIndex(sIfIndex, "AbbreviatedName");
        }

        function getIfNameByPortIndex(sPortIndex)
        {
            var oIfData = getDataByPortIndex(sPortIndex);
            var sIfName = "";
            if (oIfData)
            {
                sIfName = oIfData["Name"];
            }
            return sIfName;
        }

        function getIfAbbrNameByPortIndex(sPortIndex)
        {
            var oIfData = getDataByPortIndex(sPortIndex);
            var sIfName = "";
            if (oIfData)
            {
                sIfName = oIfData["AbbreviatedName"];
            }
            return sIfName;
        }        

        function getAllIfData(aItems, aDatas)
        {
            aDatas = aDatas || [];
            for (var i = 0, j = _aData.length; i < j; i++)
            {
                var oIfData = {};
                for (var k = 0, f = aItems.length; k < f; k++)
                {
                    oIfData[aItems[k]] = _aData[i][aItems[k]];
                }
                aDatas.push(oIfData);
            }
            return aDatas;
        }

function getConfigIfData(aDatas)
{
/*****************************************************************************
@FuncName: public, IntfDB.getConfigIfData
@DateCreated: 2014-08-11
@Author: huangdongxiao 02807
@Description: get ifData of configrable to an array
@Usage:
@ParaIn:
    * aDatas, Array, The sorce data. if it is not specified, use the default data, 
        which returned from device
@Return:
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    aDatas = aDatas || _aData;
    var aTemData = [];
    var oIfData = {};
    for (var i = 0; i< aDatas.length; i++)
    {
        oIfData[aDatas[i]["IfIndex"]] = aDatas[i];
    }
    for (var j = 0; j< _aCapabilitiesData.length; j++)
    {
        var oIfCapData = _aCapabilitiesData[j];
        var ifIndex = oIfCapData["IfIndex"];
        var isConfig = oIfCapData["Configurable"];
        if("true" == isConfig)
        {
            if(oIfData[ifIndex])
            {
                aTemData.push(oIfData[ifIndex]);
            }
        }
    }
    return aTemData;
}

        function init()
        {
            _oTable = cloneObj(NC.IfMgrTable);
        }

        init();
    }

    function formatIfName(sIfName)
    {
        var sName = $.trim(sIfName);
        var lens = sName.length;
        var i = sName.length-1;

        while (i >= 0 && $.isNumeric(sName[i]))
        {
            i--;
        }

        i++;
        return {"pre" : sName.substring(0,i), "lastNum" : parseInt(sName.substring(i))};
    }

    function unCompassIntfs(aIntfs)
    {
        var aResult = [];
        for (i = 0, j = aIntfs.length; i < j; i++)
        {
            var oIntf = aIntfs[i];
            if ($.isArray(oIntf))
            {
                var oBegin = formatIfName(oIntf[0]);
                var oEnd = formatIfName(oIntf[1]);
                for (var k = oBegin.lastNum; k <= oEnd.lastNum; k++)
                {
                    aResult.push(oBegin.pre+k);
                }
            }
            else
            {
                aResult.push(oIntf);
            }
        }
        return aResult;
    }

    function compassIntfs(aIntfs)
    {
        var oIntfs = {};
        var aResult = [];
        for (i = 0, j = aIntfs.length; i < j; i++)
        {
            oIntfs[$.trim(aIntfs[i])] = true;
        }

        $.each(oIntfs, function(sIndex, oItem){
            if (oItem)
            {
                var oName = formatIfName(sIndex);
                var i = oName.lastNum + 1;
                var sEnd = sBegin = oName.pre + oName.lastNum;

                while(oName.pre+i in oIntfs)
                {
                    sEnd = oName.pre+i;
                    oIntfs[sEnd] = false;
                    i++;
                }

                i = oName.lastNum - 1;
                while(oName.pre+i in oIntfs)
                {
                    sBegin = oName.pre+i;
                    oIntfs[sBegin] = false;
                    i--;
                }

                if(sBegin == sEnd)
                {
                    aResult.push(sBegin);
                }
                else
                {
                    aResult.push([sBegin,sEnd]);
                }
            }
        });
        return aResult;
    }

    function getPortListByMap (sMap)
    {
        Frame.Debuger.assert(Utils.Codec, "register 'Codec' module first");

        var aMap = Utils.Codec.base64Decode(sMap);
        var aProtList = [];

        for (var i = 0, j = aMap.length; i < j; i++)
        {
            var iNum = aMap[i];
            for (k = 0; k < 8; k++)
            {
                if (iNum & (1 << k))
                {
                    aProtList.push(i*8 + k);
                }
            }
        }
        return aProtList;
    }

    function getMapByPortList (aPortList)
    {
        var aMap = [];
        for (var i = 0, j = aPortList.length; i < j; i++)
        {
            var iNum = aPortList[i];
            var iSet = iNum>>3;
            var iPos = iNum%8;
            var iVal = aMap[iSet];
            if (!iVal)
            {
                iVal = 0;
            }
            iVal += 1 << iPos;
            aMap[iSet] = iVal;
        }

        var sMap = "";
        for (var i = 0, j = aMap.length; i < j; i++)
        {
            if (!aMap[i])
            {
                sMap += String.fromCharCode(0);
            }
            else
            {
                sMap += String.fromCharCode(aMap[i]);
            }
        }
        return Utils.Codec.base64Encode(sMap);
    }

    function getIfTypeExtStr(iType)
    {
        var sType = "";
        for (var i in _oTypes)
        {
            if (_oTypes[i] == iType)
            {
                sType = i;
                break;
            }
        }
        return sType;
    }

    function getIfTypeExt (sIfType)
    {
        return _oTypes[sIfType];
    }

    var oIntf = {
        unCompassIntfs : unCompassIntfs,
        compassIntfs : compassIntfs,
    	getAbbreviatedNameReq : getAbbreviatedNameReq,
    	getAbbreviatedNameByIndex : getAbbreviatedNameByIndex,
    	getIfmgrInfos : getIfmgrInfos,
        createDB : createDB,
        getPortListByMap : getPortListByMap,
        getMapByPortList : getMapByPortList,
        getIfTypeExtStr : getIfTypeExtStr,
        getIfTypeExt: getIfTypeExt
    };

    Utils.regUtil(UTILNAME, oIntf, {"widgets": [], "utils":["Base", "Codec","Request"]});
})(jQuery);