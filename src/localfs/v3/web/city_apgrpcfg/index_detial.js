(function ($){
    var MODULE_BASE = "h_wireless";
    var MODULE_NAME = MODULE_BASE + ".index_detial";
    var MODULE_RC="h_wireless_indexDetial";
    var g_oPara;
    var obj = {};
    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }

    function initForm(){
        $("#view_client_form").form("init", "edit", {"title":getRcText("TERINFO"),"btn_apply": 
            false,"btn_cancel":false});
        $("#return").on('click',function(){ history.back();});
    }
    function getSSIDList() {
        return $.ajax({
            url: MyConfig.path + "/ssidmonitor/getssidlist?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        });
    }
    function initData(){
        var aAuthType = getRcText("AUTHEN_TYPE").split(","); //不认证,一键上网,账号认证
        getSSIDList().done(function(data, textStatus, jqXHR) {
                var resfrsh = [];
                var aSTATUS = getRcText("STATUS").split(','); //,使能,去使能

                if ('{"errcode":"Invalid request"}' == data) {
                    alert("没有权限");
                } else {
                    $.each(data.ssidList, function(index, iDate) {
                        iDate.status = aSTATUS[iDate.status];
                        iDate.AuthType = aAuthType[0];
                        resfrsh.push(iDate);
                    });
                    // $("#onlineuser_list").SList ("refresh", data.ssidList); 

                    for (var i = 0; i < resfrsh.length; i++) {
                        if(g_oPara.ssid_name==data.ssidList[i].ssidName){
                            obj[resfrsh[i].ssidName] = resfrsh[i];
                        }      
                    }
                  var datas=obj[g_oPara.ssid_name];
                   var aa={   
                        "apName":datas.stName,
                        "apSN":datas.AuthType,
                        "apModel":datas.ssidName,
                        "apStatus":datas.status
                        // "radioList1":datas.bindAP,
                        // "onlineTime1":datas.bindAPGroup
                }
              
       Utils.Base.updateHtml($("#view_client_form"), aa);
                }
        })
    }

    function _init ()
    {
        g_oPara=Utils.Base.parseUrlPara();
        initForm();
        initData();
    }
    function _resize (jParent)
    {
    }

    function _destroy()
    {
        console.log("destory**************");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Minput","SList","Form","SingleSelect"],
        "utils": ["Base", "Request"],
    });

}) (jQuery);;