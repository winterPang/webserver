;(function($)
{
    var UTILNAME = "Request";
    var oRequest = {
        getTableInstance : getTableInstance,
        getTableRows : getTableRows,
        mergeRequestTables: mergeRequestTables,
        set : set,
        action : action,
        getAll : getAll,
        getBulk : getBulk,
        getBulk : getBulk,
        get : get,
        getConfigAll : getConfigAll,
        saveCfg : saveCfg,
        loadCfg : loadCfg,
        rollbackCfg : rollbackCfg,
        sendCli : sendCli,
        sendUrl : sendUrl,
        clearMoudleAjax : clearMoudleAjax
    };
    function sendUrl(sUrl, pfOnSuccess, pfOnFailed)
    {
        var opt = {
                onSuccess: pfOnSuccess,
                onFailed: pfOnFailed
            };
        return sendRequest(sUrl, "url", opt);
    }

    function saveCfg(sFileName, bAllMdc, pfOnSuccess, pfOnFailed)
    {
        var sXml = oActionFunc["save"]("save", sFileName, bAllMdc);
        var opt = {
                onSuccess: pfOnSuccess,
                onFailed: pfOnFailed,
		showSucMsg: false
            };
        return sendRequest("set.j", sXml, opt);
    }

    function loadCfg(sFileName, bAllMdc, pfOnSuccess, pfOnFailed)
    {
        var sXml = oActionFunc["load"]("load", sFileName, bAllMdc);
        var opt = {
                onSuccess: pfOnSuccess,
                onFailed: pfOnFailed
            };
        return sendRequest("set.j", sXml, opt);
    }

    function rollbackCfg(sFileName, pfOnSuccess, pfOnFailed)
    {
        var sXml = oActionFunc["rollback"]("rollback", sFileName, false);
        var opt = {
                onSuccess: pfOnSuccess,
                onFailed: pfOnFailed
            };
        return sendRequest("set.j", sXml, opt);
    }

    function sendCli(cli, pfOnSuccess, pfOnFailed)
    {
        var aCli = cli;
        if (!$.isArray(cli))
        {
            aCli = [];
            aCli.push(cli);
        }

        var sUrl = "get.j";

        ////{{ local run start
        if(true === MyConfig.config.local)
        {
            sUrl = aCli[0]+".j";
        }
        ////}}

        var opt = pfOnSuccess || {};
        if(!$.isPlainObject(opt))
        {
            opt = {
                onSuccess: pfOnSuccess,
                onFailed: pfOnFailed,
                dataType: "text"
            };
        }

        return sendRequest(sUrl, makeCliXml(aCli), opt);
    }

    function getConfigAll(oTables, pfFunc)
    {
        return procGet("get-config", oTables, pfFunc);
    }

    function getAll(oTables, pfFunc, pfOnFailed, oOpts)
    {
        return procGet("get", oTables, pfFunc, pfOnFailed, oOpts);
    }
    function getBulk(oTables, pfFunc, pfOnFailed, oOpts)
    {
        return procGet("get-bulk", oTables, pfFunc, pfOnFailed, oOpts);
    }

    function getBulk(oTables, pfFunc, pfOnFailed, oOpts)
    {
        return procGet("get-bulk", oTables, pfFunc, pfOnFailed, oOpts);
    }

    function get(oTables, nCount, pfFunc, pfOnFailed)
    {
        return procGet("get", oTables, pfFunc, pfOnFailed, null, nCount);
    }

    function convertToXmlStr(sStr)
    {
        return sStr.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&#32;");
    }

    ////{{ local run start
    function _getUrl(sXml)
    {
        if(!sXml)
        {
            return "get.j";
        }

        var nStart = sXml.indexOf("<top ");
        var sTemp = sXml.substring(nStart + 5);

        nStart = sTemp.indexOf(">");
        sTemp = sTemp.substring(nStart + 2);

        var nEnd = sTemp.indexOf('>');
        var sUrl = sTemp.substring(0, nEnd).toLowerCase();

        return sUrl + ".php";
    }
    ////}}

    function procGet(sType, oTables, pfOnSuccess, pfOnFailed, oOpts, nCount)
    {
        var aTables = oTables;
        if (!$.isArray(oTables))
        {
            aTables = [oTables];
        }

        var sXml = oActionFunc[sType](sType, aTables, nCount);

        var sUrl = "get.j";
        var opt = pfOnSuccess || {};
        if(!$.isPlainObject(opt))
        {
            opt = {
                onSuccess: pfOnSuccess,
                onFailed: pfOnFailed
            };
        }

        if (oOpts)
        {
            $.each(oOpts, function(sIndex, oItem){opt[sIndex] = oItem; return;});
        }

        ////{{ local run start
        if (MyConfig.config.local)
        {
            sUrl = opt.name ? opt.name+".php" : _getUrl(sXml);
        }
        ////}}
        return sendRequest(sUrl, sXml, opt);
    }

    function action(oTables, pfOnSuccess, pfOnFailed)
    {
        var aTables = oTables;
        if (!$.isArray(oTables))
        {
            aTables = [oTables];
        }

        var opt = pfOnSuccess || {};
        if(!$.isPlainObject(opt))
        {
            opt = {
                onSuccess: pfOnSuccess,
                onFailed: pfOnFailed
            };
        }

        var sXml = oActionFunc["action"](aTables);
        var sUrl = "set.j";

        ////{{ local run start
        if (MyConfig.config.local)
        {
            sUrl = _getUrl(sXml);
        }
        ////}}

        return sendRequest(sUrl, sXml, opt);
    }

    function set(sType, oTables, pfOnSuccess, pfOnFailed, bErrorContinue)
    {
        var aTables = oTables;
        if (!$.isArray(oTables))
        {
            aTables = [oTables];
        }

        var opt = pfOnSuccess || {};
        if(!$.isPlainObject(opt))
        {
            opt = {
                onSuccess: pfOnSuccess,
                onFailed: pfOnFailed
            };
        }
        else
        {
            bErrorContinue = opt.errorContinue;
        }

        var sXml = oActionFunc["edit-config"]("edit-config", aTables, sType, bErrorContinue)
        return sendRequest("set.j", sXml, opt);
    }

    function getTableInstance(oTable, oOpt)
    {
        return new tableRequest(oTable, oOpt);
    }

    function getTableRows (oTable, oDataInfo)
    {
        var aRows = [];
        var oTemData = oDataInfo;

        if (oTemData["action-result"])
        {
            aRows = oTemData["action-result"][0]["result-data"];
        }
        else try 
        {
            for (var i = 0; i < oTable.nodes.length; i++)
            {
                if (oTable.nodes[i] in oTemData)
                {
                    oTemData = oTemData[oTable.nodes[i]];
                }
                else
                {
                    oTemData = oTable.row ? [] : null;
                    break;
                }
            }

            aRows = oTemData||[];
            formatRowData(oTable, aRows);
        }
        catch(e)
        {
            aRows = [];
        }
        
        return aRows;
    }

/*****************************************************************************
@FuncName: public, Utils.Request.mergeRequestTables
@DateCreated: 2014-09-28
@Author: Huangdongxiao 02807
@Description: merge some netconf tables to one array
    <b>Notice:</b> The first table is the master table, this action will extend all
    the others properties in other tables to the master table by index columns.
    It like a SQL "select table1.a, table1.b, table1.c from table1, table2 where table1.index=table2.key"
@Usage:
@ParaIn:
    * aTableDef, Array, Netconf table defination in nc.js
    * oJsonData, Object, a JSON data recieved from device
    * aMap, Array, The mapping relations of the netconf tables. the element's struck is as below:
    ////table start sep=//
    属性名//类型//描述
    src//Object//Defination of a netconf table in "nc.js"//
    column//Array//Key columns in "src" table and "dest" table//
    dest//Object//Defination of the target netconf table in "nc.js". All the properties in src table 
        will be added to the target table, and overwrite the same fields.
    ////table end
    * bMatchAll, boolean, Default is false. If true, only return the matched data, 
        or return all the target data.
@Return: None
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
function mergeRequestTables (aTableDef, oJsonData, aMap, bMatchAll/*=false*/)
{
    var aNewTable = [];
    var oHashTable = {};

    function getHashKey (aIndexDef, oData)
    {
        var aTemp = [];
        for (var k=0; k<aIndexDef.length; k++)
        {
            aTemp.push(oData[aIndexDef[k]]);
        }

        return aTemp.join('_');
    }

    function hashTable (oTableDef)
    {
        var oHashData = {};

        var aData = Utils.Request.getTableRows(oTableDef, oJsonData);
        for (var i=0; i<aData.length; i++)
        {
            var oData = aData[i];
            var sIndexKey = getHashKey (oTableDef.index, oData);
            oHashData[sIndexKey] = aData[i];
        }

        var sTableName = oTableDef.nodes.join(".");
        oHashTable[sTableName] = oHashData;
    }

    function mergeOneTable (oMap)
    {
        var oDestDef = oMap.dest;
        var oDestData = oHashTable[oDestDef.nodes.join(".")];
        var aSrcData = Utils.Request.getTableRows(oMap.src, oJsonData);
        var aMachedData = {};

        for (var i=0; i<aSrcData.length; i++)
        {
            var sIndexKey = getHashKey (oMap.column, aSrcData[i]);
            var oData = oDestData[sIndexKey];
            if (oData)
            {
                $.extend (oData, aSrcData[i]);
                aMachedData[sIndexKey] = oData;
            }
        }

        return bMatchAll ? aMachedData : oDestData;
    }

    // hash tables
    for (var i=0,k=aTableDef.length;i<k; i++)
    {
        hashTable (aTableDef[i]);
    }

    var oData = {};
    for (var i=0,k=aMap.length; i<k; i++)
    {
        var oMap = aMap[i];
        oData = mergeOneTable (oMap, oData);
    }

    $.each(oData, function(key, oItem)
    {
        aNewTable.push (oItem);
    })
    return aNewTable;
}

    function formatRowData(oTable, aRows)
    {
        var aDesRows = [];
        var aCols = [];
        var bNeedFormat = false;
        var oFormatCol = {};

        $.each(oTable.index, function(index,oEle){aCols.push(oEle)});
        $.merge(aCols, oTable.column);
        for (var i = 0, j = aCols.length; i < j; i++)
        {
            var aColName = aCols[i].split(".");
            if (aColName.length > 1)
            {
                bNeedFormat = true;
                oFormatCol[aCols[i]] = [];
                $.merge(oFormatCol[aCols[i]], aColName);
            }
        }

        if (bNeedFormat == false)
        {
            return;
        }

        for (var i = 0, j = aRows.length; i < j; i++)
        {
            var oData = aRows[i];
            $.each(oFormatCol, function (sIndex, aItem) {
                var oValue = oData;
                try
                {
                    for (var k = 0, l = aItem.length; k < l; k++)
                    {
                        oValue = oValue[aItem[k]];
                    }

                    if (oValue || oValue == "")
                    {
                        oData[sIndex] = oValue;
                    }
                }catch(err){}
            });
        }

        return;
    }

    var _oAjaxList = {};

    function sendRequest(sUrl, sXml, oPara)
    {
        var opt = {
            showSucMsg: true,
            showErrMsg: true,
            showMsg: false,
            paras: {type: oPara.dataType}    // URL paras
        };

        $.extend(opt, oPara);
        opt.onSuccess = onSuccess;
        opt.onFailed = onFailed;
        opt.paras.xml = "<rpc message-id='101' xmlns='urn:ietf:params:xml:ns:netconf:base:1.0'  xmlns:web='urn:ietf:params:xml:ns:netconf:base:1.0'>" + sXml + "</rpc>";
        opt.paras.req_menu = opt.menu || Frame.NewMenu.getMenuPath();

        // Empty request can't be allowed.
        if(!sXml)
        {
            setTimeout(function(){onSuccess.apply({})}, 10);
            return;
        }
        
        if(opt.showErrMsg)
        {
            Utils.Base.showError("", opt.scope);
        }

        sUrl = Frame.Util.getDynUrl(sUrl);
        var oAjax = Frame.Ajax.send(sUrl, opt);
        opt.paras.xml = null;
        delete sXml;

        var sModule = oPara.module;
        if (!sModule)
        {
            sModule = $(".portlet").attr("modid") ? $(".portlet").attr("modid") : $(".tab-content").attr("modid");
        }

        if (!_oAjaxList[sModule])
        {
            _oAjaxList[sModule] = [];
        }

        _oAjaxList[sModule].push(oAjax);

        function onSuccess(sMsg)
        {
            onAjaxBack(oAjax, sModule);
            if(this.ok && opt.showSucMsg)
            {
                Frame.Msg.info(sMsg);
            }

            // user process
            var pfOnSuccess = oPara.onSuccess;

            if(oPara.isSave === true)
            {
                onSaveCfg(pfOnSuccess,sMsg);
            }
            else
            {
                pfOnSuccess && pfOnSuccess(this, sMsg);
            }

        }

        function onFailed(sErrType, msg)
        {
            onAjaxBack(oAjax, sModule);
            // show error in form first
            if(opt.showErrMsg)
            {
                Utils.Base.showError(msg, opt.scope);
            }

            // user error
            var pfOnFailed = oPara.onFailed;
            pfOnFailed && pfOnFailed(sErrType, msg);
        }

        function onSaveCfg(pfCallBack,sMsg)
        {   
            var hWait = Frame.Msg.wait($.MyLocale.SAVING);
            saveCfg(null, false,
                function(){
                    hWait.close();
                    pfCallBack && pfCallBack(sMsg);
                },
                function(sErrType, msg)
                {
                    hWait.close(); 
                    Frame.Msg.error(msg);          
                }
            );
        }

        return oAjax;
    }

    function clearMoudleAjax(sMoudle)
    {
        if(_oAjaxList[sMoudle])
        {
            $.each(_oAjaxList[sMoudle], function (iIndex, oItem){
                if (oItem)
                {
                    oItem.abort();
                    _oAjaxList[sMoudle][iIndex] = null;
                }
            });
            _oAjaxList[sMoudle] = [];
        }

    }

    function onAjaxBack(oAjax, sMoudle)
    {
        $.each(_oAjaxList[sMoudle], function (iIndex, oItem){
            if (oItem == oAjax)
            {
                _oAjaxList[sMoudle][iIndex] = null;
            }
        });
    }

    var oActionFunc = {
        "get" : makeGetXml,
        "get-bulk" : makeGetXml,
        "get-config" : makeGetXml,
        "get-bulk-config" : makeGetXml,
        "edit-config" : makeEditXml,
        "action" :  makeActionXml,
        "load" : makeCfgFileXml,
        "save" : makeCfgFileXml,
        "rollback" : makeCfgFileXml,
        "cli" : makeCliXml
    };

    var DEF_NS = {
        base: "http://www.h3c.com/netconf/base:1.0",
        data: "http://www.h3c.com/netconf/data:1.0",
        config: "http://www.h3c.com/netconf/config:1.0",
        action: "http://www.h3c.com/netconf/action:1.0"
    };
    
    function getNS ()
    {
        return FrameInfo.ns || DEF_NS;
    }

    function getTableXml(aTables)
    {
        function getTableXmlArray(oNode)
        {
            var aXml = [];
            for (var sIndex in oNode)
            {
                var oTemNode = oNode[sIndex];
                if (Utils.Base.isEmptyObj(oTemNode.subnode) && (oTemNode.rows.length == 0))
                {
                    if (oTemNode.value)
                    {
                        if ($.isArray(oTemNode.value))
                        {
                            $.each(oTemNode.value, function(iIndex, oItem){
                                aXml.push("<" + sIndex + oTemNode.opt + ">" + oItem + "</" + sIndex + ">");
                            });
                        }
                        else
                        {
                            aXml.push("<" + sIndex + oTemNode.opt + ">" + oTemNode.value + "</" + sIndex + ">");
                        }
                    }
                    else
                    {
                        aXml.push("<" + sIndex + oTemNode.opt + "/>");
                    }
                }
                else
                {
                    if (!oTemNode.disView)
                    {
                        aXml.push("<" + sIndex + oTemNode.opt + ">");
                    }
                    
                    if (oTemNode.rows.length != 0)
                    {
                        for (var k = 0, f = oTemNode.rows.length; k < f; k++)
                        {
                            $.merge(aXml, getTableXmlArray(oTemNode.rows[k]));
                        }
                    }
                    else
                    {
                        $.merge(aXml, getTableXmlArray(oTemNode.subnode));
                    }

                    if (!oTemNode.disView)
                    {
                        aXml.push("</" + sIndex + ">");
                    }
                }
            }
            return aXml;
        }

        var aXml = [];

        for (var i = 0, j = aTables.length; i < j; i++)
        {
            $.merge(aXml, getTableXmlArray(aTables[i]));
        }

        return aXml.join("");
    }

    function mergeTable(aTables)
    {
        function insertTable(oDest, oSrc)
        {
            for (var sIndex in oSrc.subnode)
            {
                if (sIndex in oDest.subnode)
                {
                    if (Utils.Base.isEmptyObj(oSrc.subnode[sIndex].subnode))
                    {
                        $.merge(oDest.subnode[sIndex].rows, oSrc.subnode[sIndex].rows);
                    }
                    else
                    {
                        insertTable(oDest.subnode[sIndex], oSrc.subnode[sIndex]);
                    }
                }
                else
                {
                    oDest.subnode[sIndex] = oSrc.subnode[sIndex];
                }
            }
        }

        var aTotalTable = [];
        var oTotalTable = {};
        var bEmpty = true;

        for (var i = 0, j = aTables.length; i < j; i++)
        {
            var oTable = aTables[i];
            if (!oTable)
            {
                continue;
            }

            if (bEmpty == true)
            {
                $.each(oTable, function (sIndex, oItem){oTotalTable[sIndex] = oItem;return;});
                bEmpty = false;
                continue;
            }

            $.each(oTable, function (sIndex, oItem)
            {
                if (sIndex in oTotalTable)
                {
                    insertTable(oTotalTable[sIndex], oItem);
                }
                else
                {
                    oTotalTable[sIndex] = oItem;
                }
                return;
            });
        }

        $.each(oTotalTable, function (sIndex, oItem)
        {
            var oTemTable = {};
            oTemTable[sIndex] = oItem;
            aTotalTable.push(oTemTable);
            return;
        });
        return aTotalTable;
    }

    function makeTableXml(stype, aTables, bMerge)
    {
        var aTableXml = [];
        $.each(aTables, function(index, oEle)
            {
                var oTable = oEle ? oEle.getXml(stype): null;
                if (oTable)
                {
                    aTableXml.push(oTable);
                }
                return;
            });

        if (bMerge)
        {
            aTableXml = mergeTable(aTableXml);
        }
        return getTableXml(aTableXml);
    }

    function makeGetXml(sAction, aTables, oCount)
    {
        var sCountAttr = " xmlns:web='"+getNS().base+"'" + " xmlns:data='"+getNS().data+"'";
        var nCount = parseInt(oCount);
        var oActionOpt = {
            "get" : {ns : getNS().data, source : ""},
            "get-bulk" : {ns : getNS().data, source : ""},
            "get-config" : {ns : getNS().config, source : "<source><running/></source>"},
            "get-bulk-config" : {ns : getNS().config, source : "<source><running/></source>"}
        };
        var sContent = makeTableXml("get", aTables, true);
        var sGetXml = null;

        if (sContent != "")
        {
            if(!isNaN(nCount))
            {
                sCountAttr +=" web:count='"+nCount+"'";
            }

            sGetXml = "<"+sAction+">" + oActionOpt[sAction].source + 
                        "<filter type='subtree'><top xmlns='" + oActionOpt[sAction].ns + "'"+sCountAttr+">";
            sGetXml += sContent;
            sGetXml += "</top></filter></"+sAction+">";
        }

        return sGetXml;
    }

    function makeEditXml(sAction, aTables, sType, bErrorContinue)
    {
        var sEdit = null;
        var sContent = makeTableXml("set", aTables, false);

        if (sContent != "")
        {
            sEdit = "<"+sAction+"><target><running/></target>";

            if(bErrorContinue)
            {
                sEdit += "<error-option>continue-on-error</error-option>";
            }

            sEdit += "<config><top xmlns='" + getNS().config + "' web:operation='"+sType+"'>" +
                    sContent + "</top></config></"+sAction+">";
        }
        
        return sEdit;
    }

    function makeActionXml(aTables)
    {
        var sXml = null;
        var sContent = makeTableXml("set", aTables, false);

        if (sContent != "")
        {
            sXml ="<action><top xmlns='"+getNS().action+"'>" + sContent + "</top></action>";
        }
        return sXml;
    }

    function makeCfgFileXml(sAction, sFileName, bAllMdc)
    {
        var sXml = "";
        if(!sFileName && !bAllMdc)
        {
            sXml = "<"+sAction+"/>";
        }
        else
        {
            var sAttr = (true == bAllMdc) ? ' AllMDC="true"' : '';
            var sFile = (sFileName && sFileName != "") ? "<file>" + convertToXmlStr(sFileName) + "</file>" : "";
            sXml = "<"+sAction+sAttr+">" + sFile + "</"+sAction+">";
        }
        return sXml;
    }

    function makeCliXml (aCli)
    {
        var sXml = null;
        if (aCli.length > 0)
        {
            sXml ="<CLI><Configuration>" + aCli.join("\r\n") + "</Configuration></CLI>";
        }
        return sXml;
    }

    function tableRequest(oTable, oOpt)
    {
        this.addRows = addRows;
        this.addFilter = addFilter;
        this.addRegFilter = addRegFilter;
        this.addMatchFilter = addMatchFilter;
        this.addColumOpt = addColumOpt;
        this.getXml = getXml;
        this.oTable = oTable;

        var _oTable = oTable || {};
        var _oOpt = oOpt || {};
        var _aRows = [];
        var _oFilters = {};
        var _oRegFilters = {};
        var _oMatchFilters = {};
        var _oColumOpt = {};
            
        function addRows (oData, bOnlyIndex/*=false*/)
        {
            var aData = oData;
            if (!$.isArray(oData))
            {
                aData = [oData];
            }

            for (var i = 0; i < aData.length; i++)
            {
                var aRowData = [];
                for (var j = 0; j < _oTable.index.length; j++)
                {
                    var sItem = _oTable.index[j];
                    aRowData[sItem] = (aData[i][sItem] || (aData[i][sItem] == "")) ? aData[i][sItem] : null;
                }

                var aCol = (true===bOnlyIndex) ? [] : _oTable.column;
                for (var j = 0; j < aCol.length; j++)
                {
                    var sItem = _oTable.column[j];
                    aRowData[sItem] = (aData[i][sItem] || (aData[i][sItem] == "")) ? aData[i][sItem] : null;
                }

                var aGroup = _oTable["loopgroup"] ? _oTable["loopgroup"] : [];
                for (var j = 0; j < aGroup.length; j++)
                {
                    var sItem = _oTable.loopgroup[j];
                    aRowData[sItem] = (aData[i][sItem] || (aData[i][sItem] == "")) ? aData[i][sItem] : null;
                }

                _aRows.push(aRowData);
            }
            return;
        }

        function addColumOpt(sColum, oData)
        {
            _oColumOpt[sColum] = oData;
            return;
        }

        function addFilter(oData)
        {
            for(var sIndex in (oData))
            {
                _oFilters[sIndex] = oData[sIndex];
            }
            return;
        }

        function addRegFilter(oData)
        {
            for(var sIndex in (oData))
            {
                _oRegFilters[sIndex] = oData[sIndex];
            }
            return;
        }

        function addMatchFilter(oData)
        {
            for(var sIndex in (oData))
            {
                _oMatchFilters[sIndex] = oData[sIndex];
            }
            return;
        }

        function makeGetXml()
        {
            var aTotalCol = [];
            var aTotalNodes = [];
            var oTableNode = {};

            $.each(_oTable.index, function(index,oEle){aTotalCol.push(oEle)});
            $.merge(aTotalCol, _oTable.column);

            aTotalNodes = $.merge([], _oTable.nodes);
            if (_oTable.row)
            {
                aTotalNodes.push(_oTable.row);
            }

            for (var i = 0; i < aTotalCol.length; i++)
            {
                var sName = aTotalCol[i];
                var sFilter = _oFilters[sName] ? convertToXmlStr(_oFilters[sName]) : "";
                var sRegFilter = _oRegFilters[sName] ? ' web:regExp="'+convertToXmlStr(_oRegFilters[sName]) +'"' : "";
                var sMatchFilter = _oMatchFilters[sName] ? ' web:match="'+convertToXmlStr(_oMatchFilters[sName]) +'"' : "";

                appendNode(oTableNode, aTotalNodes, sName, sRegFilter + sMatchFilter, sFilter);
            }

            var sOpt = "";
            $.each(_oOpt, function (index, oEle){sOpt += " web:"+ index +"='"+convertToXmlStr(oEle)+"'"; return;});
            
            if (sOpt)
            {
                appendNode(oTableNode, [], _oTable.nodes.join("."), sOpt, null);
            }

            return oTableNode;
        }

        function getOptStr(oOpstion)
        {
            var sOpt = "";

            if (!oOpstion)
            {
                return sOpt;
            }

            if ("web" in oOpstion || "data" in oOpstion)
            {
                if (oOpstion["web"])
                {
                    $.each(oOpstion["web"], function (index, oEle){sOpt += " web:"+ index +"='"+convertToXmlStr(oEle)+"'"; return;});
                }
                
                if (oOpstion["data"])
                {
                    $.each(oOpstion["data"], function (index, oEle){sOpt += " data:"+ index +"='"+convertToXmlStr(oEle)+"'"; return;});
                }
            }
            else
            {
                $.each(oOpstion, function (index, oEle){sOpt += " web:"+ index +"='"+convertToXmlStr(oEle)+"'"; return;});
            }
            return sOpt;
        }

        function getXml(sType)
        {
            if (_aRows.length == 0)
            {
                if (sType == "get")
                {
                    return makeGetXml();
                }
                return null;
            }

            var oTable = {};
            var aRows = [];
            var sOpt = "";
            var aNodes = [];

            if (_oTable.row)
            {
                aNodes.push(_oTable.row);
            }

            var oLoopGroup = {};
            if (_oTable["loopgroup"])
            {
                $.each(_oTable["loopgroup"], function (iLoopIndex, sGroup){
                    oLoopGroup[sGroup] = {};
                    $.each(_oTable["column"], function (iCol, sCol){
                        var aItem = sCol.split(",");
                        if (aItem.length > 1 && aItem[0] == sGroup)
                        {
                            oLoopGroup[sGroup][aItem[1]] = "";
                        }
                    });
                });
            }
            
            for (var i = 0; i < _aRows.length; i++)
            {
                var oRowNode = {};
                var oRowData = _aRows[i];
                
                for(var sIndex in oRowData)
                {
                    if ((oRowData[sIndex] || oRowData[sIndex]=="") && !(sIndex in oLoopGroup))
                    {
                        if ($.isArray(oRowData[sIndex]))
                        {
                            $.each(oRowData[sIndex], function(iIndex, oItem){
                                oRowData[sIndex][iIndex] = convertToXmlStr(oItem);
                            });
                            appendNode(oRowNode, aNodes, sIndex, null, oRowData[sIndex]);
                        }
                        else
                        {
                            var sValue = convertToXmlStr(oRowData[sIndex]);
                            appendNode(oRowNode, aNodes, sIndex, null, sValue);
                        }
                    }
                }

                if (_oTable["loopgroup"])
                {
                    $.each(oLoopGroup, function (sGroup, oSubItem){
                        var aGroupRows = [];
                        var bHasValue = false;
                        var aGroupNodes = [sGroup];
                        if (oRowData[sGroup] && $.isArray(oRowData[sGroup]))
                        {
                            $.each(oRowData[sGroup], function(sGroupRowIndex, oRowItems){
                                var oGroupRowNode = {};
                                $.each(oRowItems, function(sGroupCol, oColItem){
                                    var sValue = convertToXmlStr(oRowItems[sGroupCol]);
                                    appendNode(oGroupRowNode, aGroupNodes, sGroupCol, null, sValue);
                                    bHasValue = true;
                                });
                                aGroupRows.push(oGroupRowNode);
                            });
                        }

                        if (bHasValue)
                        {
                            var aGroupNodes = [];
                            $.merge(aGroupNodes, aNodes);
                            aGroupNodes.push(sGroup);
                            addNodeRows(oRowNode, aGroupNodes, aGroupRows, true);
                        }
                    });
                }

                aRows.push(oRowNode);
            }

            addNodeRows(oTable, _oTable.nodes, aRows);
            $.each(_oOpt, function (index, oEle){sOpt += " web:"+ index +"='"+oEle+"'"; return;});
            if (sOpt)
            {
                appendNode(oTable, [], _oTable.nodes.join("."), sOpt, null);
            }
            
            return oTable;
        }

        function appendNode(oBaseNode, aParentNode, sNode, sOpt, sValue)
        {
            var oSubNode = oBaseNode;
            var oNode = null;
            var aNodes = sNode.split(".");
            var aTotalNode = $.merge([], aParentNode);
            $.merge(aTotalNode, aNodes);

            for (var i = 0, j = aTotalNode.length; i < j; i++)
            {
                var sParNode = aTotalNode[i];
                if (!(sParNode in oSubNode))
                {
                    var sNodeOpt = getOptStr(_oColumOpt[sParNode]);
                    oSubNode[sParNode] = {subnode:{}, opt:sNodeOpt, value:"", rows:[]};
                }
                oNode = oSubNode[sParNode];
                oSubNode = oSubNode[sParNode].subnode;
            }

            if(oNode)
            {
                oNode.opt += sOpt ? sOpt : "";
                oNode.value = sValue ? sValue : "";
            }

            return oBaseNode;
        }

        function addNodeRows(oBaseNode, aNodes, aRows, bDisView)
        {
            var oSubNode = oBaseNode;
            var oNode = null;

            for (var i = 0, j = aNodes.length; i < j; i++)
            {
                var sParNode = aNodes[i];
                if (!(sParNode in oSubNode))
                {
                    var sNodeOpt = getOptStr(_oColumOpt[sParNode]);
                    oSubNode[sParNode] = {subnode:{}, opt:sNodeOpt, value:"", rows:[], disView : bDisView};
                }
                oNode = oSubNode[sParNode];
                oSubNode = oSubNode[sParNode].subnode;
            }

            if (oNode)
            {
                $.merge(oNode.rows, aRows);
            }
            return oBaseNode;
        }        
    }

    Utils.regUtil(UTILNAME, oRequest, {"widgets": [], "utils":[]});
})(jQuery);
