;(function($)
{
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

    var _oAjaxList = {};
    var UTILNAME = "Request";
    var oRequest = {
        sendRequest : sendRequest,
        clearMoudleAjax : clearMoudleAjax
    };
    function sendRequest(oPara)
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

        if(!oPara.url)
        {
            setTimeout(function(){onSuccess.apply({})}, 10);
            return;
        }

        var oAjax = Frame.Ajax.send(opt);

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

        function onSuccess(oJson,sCode)
        {
            onAjaxBack(oAjax, sModule);
            var pfOnSuccess = oPara.onSuccess;
            pfOnSuccess && oPara.onSuccess(oJson,sCode);
            //pfOnSuccess && pfOnSuccess(oJson,sCode);
        }

        function onFailed(oHttp,sDesc,oExcept)
        {
             onAjaxBack(oAjax, sModule);
            var pfOnFailed = oPara.onFailed;
            if(oAjax.statusText == "abort"){
                Frame.Debuger.warning("[ajax] cancel,url====="+opt.url);
                pfOnFailed = $.noop;
            }else{
                Frame.Debuger.error("[ajax] error===="+MyConfig.httperror+sModule
                    +",url====="+opt.url);
            }
            pfOnFailed && pfOnFailed(oHttp,sDesc,oExcept);
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

    function onAjaxBack(oAjax, sMoudle )
    {
        $.each(_oAjaxList[sMoudle], function (iIndex, oItem){
            if (oItem == oAjax)
            {
                _oAjaxList[sMoudle][iIndex] = null;
            }
        });
    }



    Utils.regUtil(UTILNAME, oRequest, {"widgets": [], "utils":[]});
})(jQuery);
