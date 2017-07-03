; (function($) {
    var MODULE_NAME = "x_summary.device_info";
    var g_sShopName = null;
    var hPending = null;
    var statusList = [];

    function getRcText(sRcName) {
        return Utils.Base.getRcString("device_infor_rc", sRcName);
    }

    function ChangeAPInfo(row, cell, value, columnDef, dataContext, type)
    {
        if(!value)
        {
            return "";
        }
        if("text" == type)
        {
            return value;
        }
        switch(cell)
        {
            case  0:
            {
                var titletest = getRcText("DEV_STATUS").split(',')[2];
                if(dataContext["Status"] == 0)
                {
                    titletest = getRcText("DEV_STATUS").split(',')[0];
                    return "<p class='list-link float-left' type='0'>"+dataContext["Name"]+"</p><p title='"+titletest+"' class='index_icon_url version_icon icon_online'></p>";
                    //return dataContext["Name"];
                }else if(dataContext["Status"] == 1){
                    titletest = getRcText("DEV_STATUS").split(',')[1];
                    return "<p class='list-link float-left' type='0'>"+dataContext["Name"]+"</p><p title='"+titletest+"' class='index_icon_url version_icon icon_offline'></p>";
                }
                
                return "<p class='list-link float-left' type='0'>"+dataContext["Name"]+"</p><p title='"+titletest+"' class='index_icon_url version_icon icon_download'></p>";
                break;
            }
            default:
                break;
        }
        return false;
    }
    
    function getPlatFormType(callback) {
        var ajax = {
            type: 'POST',
            url: MyConfig.path + "/base/getDevPlatformType",
            contentType: "application/json",
            dataType: "json",
            timeout: 60000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN
            }),
            onSuccess: function (data) {
                if (data.retCode == 0){
                    callback(data.platformType);
                }else{
                    callback('fail');
                }
            },
            onFailed: function (err) {
                callback('fail');
            }
        }

        Utils.Request.sendRequest(ajax);
    }

    function  showDevList() {
        hPending = Frame.Msg.pending(getRcText("PENDING_MSG"));
        var aliasName = null;
        var devSN = null;
        var devModel = null;
        var aAll = [];
        function updateDevInfo(data) {
            var info = {
                AliasName:aliasName,
                Name:devModel,
                SN: devSN,
                OnlineTime: data.OnlineTime,
                b_userAccount: data.b_userAccount,
                m_userAccount: data.m_userAccount,
                Status: data.Status
            };
            aAll.push(info);
            hPending.close();
            return aAll;
        }

        function aj_getApInfo(callback) {
            var data = {
                "tenant_name": FrameInfo.g_user.attributes.name,
                      "nasid": FrameInfo.Nasid
                }
                var ajax = {
                    url: "/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal/getDeviceInfoShop",
                    type: "POST",
                    dataType: "json",
                    timeout: 150000,
                    contentType: "application/json",
                    data:JSON.stringify(data),
                    onSuccess: function(data) {
                        if(!('dev_list' in data)){
                            console.log('dev_list not exist');
                            return;
                        }
                        callback(data.dev_list);
                    },
                    onFailed:function(err){
                        //Frame.Msg.error(MyConfig.httperror);
                        callback("");
                    }
                }

                Utils.Request.sendRequest(ajax);

        }
        function getClientAccount(nasid,onSuccess,onFailed) {
            var getClientAccountOpt = {
                type: "GET",
                url: MyConfig.path + "/stamonitor/getClientCountByServiceType?nasId=" + FrameInfo.Nasid,
                dataType: "json",
                timeout: 150000,
                onSuccess:onSuccess,
                onFailed:onFailed
            }
            Utils.Request.sendRequest(getClientAccountOpt);
        }

        function onFailed(){
            hPending&&hPending.close();
        }
        //??¨¨?¨¦¨¨¡À?¨¢D¡À¨ª
            aj_getApInfo(function (devlist) {
                if (devlist != ""){
                    devlist.forEach(function(i){
                        if (i.shop_name == g_sShopName ){
                            devSN = i.dev_sn;
                            statusList.push(devSN);
                        }
                    });
                    var aDEVInfo;
                    //??¨¨??¨²??¨º¡À3¡è
                    getDevInfo(statusList,function(data, textStatus, jqXHR) {
                        if (data.devarray.length != 0){
                            data.devarray.forEach(function(item){
                                devlist.forEach(function(i) {
                                    if (i.dev_sn === item.devSN) {
                                        var timesecond = parseInt(item.devOnlineTime);
                                        var timeminute = 0;
                                        var timehour = 0;
                                        var timeday = 0;
                                        if(timesecond >= 60){
                                            timeminute = parseInt(timesecond/60);
                                            timesecond = parseInt(timesecond%60);
                                            if(timeminute >= 60){
                                                timehour = parseInt(timeminute/60);
                                                timeminute = parseInt(timeminute%60);
                                                if(timehour >= 24){
                                                    timeday = parseInt(timehour/24);
                                                    timehour = parseInt(timehour%24);
                                                }
                                            }
                                        }
                                        var result =  parseInt(timesecond) + "s";
                                        if(timeminute > 0){
                                            result =  parseInt(timeminute) + "m"+":"+ result;
                                        }
                                        if(timehour > 0){
                                            result =  parseInt(timehour) + "h"+":" + result;
                                        }
                                        if(timeday > 0){
                                            result =  parseInt(timeday) + "d" +":"+ result;
                                        }
                                        //if(timeYear > 0){
                                        //    result =  parseInt(timeYear) + "Äê" + result;
                                        //}
                                        //return result;
                                       // var result = timeday + getRcText("TIME").split(",")[0] + timehour + getRcText("TIME").split(",")[1] + timeminute + getRcText("TIME").split(",")[2] + timesecond + getRcText("TIME").split(",")[3];
                                        i.OnlineTime = result;
                                    }
                                    //else{
                                    //    i.OnlineTime = "0";
                                    //}
                                });
                            });
                        }
                        //??¨¨?¨¦¨¨¡À?¡Á¡ä¨¬?
                        devStates(statusList,function(data, textStatus, jqXHR) {
                            if (data.detail.length != 0){
                                data.detail.forEach(function(item){
                                    devlist.forEach(function(i) {
                                        if (i.dev_sn === item.devSN) {
                                            if(item.status == "0") {
                                                i.Status = getRcText("DEV_STATUS").split(",")[0];
                                            }
                                            else{
                                                i.Status = getRcText("DEV_STATUS").split(",")[1];
                                            }
                                        }
                                    });
                                });
                            }
                            //??¨¨?¨¦¨¬¨°¦Ìwifi?¨²2?wifi¡À??¨ª¨ºy
                            getClientAccount(FrameInfo.Nasid,function(data, textStatus, jqXHR) {
                                if(data.retCode === 0 && data.result.length){
                                    data.result.forEach(function(item){
                                        devlist.forEach(function(i){
                                            if(i.dev_sn === item.devSN && !i.beChanged){
                                                i.b_userAccount = item.businessCount;
                                                i.m_userAccount = item.manageCount;
                                                i.beChanged = true;
                                            }else if(i.beChanged){
                                                return;
                                            }
                                            else{
                                                i.b_userAccount = '0';
                                                i.m_userAccount = '0';
                                            }
                                        })
                                    })
                                }
                                else
                                {
                                    devlist.forEach(function(i){
                                        i.b_userAccount = 0;
                                        i.m_userAccount = 0;
                                    })
                                }
                                devlist.forEach(function(i){
                                    if (i.shop_name == g_sShopName ){
                                        aliasName = i.alias_name;
                                        devModel = i.dev_model;
                                        devSN = i.dev_sn;
                                        aDEVInfo = updateDevInfo(i);
                                    }
                                })
                                $("#dev_info_list").SList("refresh", aDEVInfo);

                            },onFailed);
                        },onFailed);
                   },onFailed);
                }
            });
    }
    function devStates(statusList,onSuccess,onFailed){
        var getDevStatusOpt = {
            type:"POST",
            url:"/base/getDevs",
            dataType:"json",
            timeout: 150000,
            data:{
                devSN:statusList
            },
            onSuccess:onSuccess,
            onFailed:onFailed
        };
        Utils.Request.sendRequest(getDevStatusOpt);
    }
    function getDevInfo(statusList,onSuccess,onFailed) {
        var getDevInfoOpt = {
            url:MyConfig.path + "/devmonitor/web/getDevsInfo?devSN="+FrameInfo.ACSN ,
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType:"application/json",
            data:{
                devSN:statusList
            },
            onSuccess:onSuccess,
            onFailed:onFailed
        };
        Utils.Request.sendRequest(getDevInfoOpt);
    }
    function  showApList() {
        //function updateApInfo(apList) {
        //    var aAll = [];
        //    var allAPstatus = getRcText("DEV_STATUS").split(",");
        //    allAPstatus.unshift("");
        //    var Timelable = getRcText("TIME").split(",");
        //    apList.forEach(function(ap) {
        //        var time = ap.onlineTime;
        //        var day = parseInt(time / 86400);
        //        var temp = time % 86400;
        //        var hour = parseInt(temp / 3600);
        //        temp = time % 3600;
        //        var mini = parseInt(temp / 60);
        //        var sec = time % 60;
        //        var sDatatime = day + Timelable[0] + hour + Timelable[1] + mini + Timelable[2];
        //
        //        var info = {
        //            AliasName:aliasName,
        //            Name: ap["apName"],
        //            SN: ap["apSN"],
        //            MAC: ap["macAddr"],
        //            // OnlineTime: sDatatime,
        //            OnlineTime: Onlinetime1,
        //            Status: allAPstatus[ap["status"]],
        //        };
        //        ap["radioList"].forEach(function(radio) {
        //            var mode = (radio["radioMode"] === "5G" ? "f5ghz" : "f2ghz");
        //            info[mode] = (radio["radioStatus"] == "1" ? getRcText("ENABLE").split(',')[1] : getRcText("ENABLE").split(',')[0]);
        //        });
        //        aAll.push(info);
        //    });
        //    return aAll;
        //}
        function getApInfo(onSuccess,onFailed) {
            var getApInfoOpt = {
                type: "GET",
                url: MyConfig.path + "/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
                dataType: "json",
                timeout: 150000,
                onSuccess:onSuccess,
                onFailed:onFailed
            }

            Utils.Request.sendRequest(getApInfoOpt);
        }
        getApInfo(function(data, textStatus, jqXHR) {
            var apList = data["apList"];
            var aAPInfo = updateApInfo(apList);
            $("#ap_info_list").SList("refresh", aAPInfo);

        },onFailed);
        hPending&&hPending.close();
    }
    function initData() {
        g_sShopName = Utils.Device.deviceInfo.shop_name;
        showDevList();
        getPlatFormType(function(platType){
            if(platType == 0){
                showApList();
            }else{
                $("#apContent").hide();
            }
        });
    }
    function initGrid() {
        (function drawApInfo() {
            var opt = {
                colNames: getRcText("AP_LABELS"),
                showHeader: true,
                multiSelect: false,
                pageSize:5,
                colModel: [
                    { name: 'Name', datatype: "String"},
                    { name: 'MAC', datatype: "String" },
                    { name: 'OnlineTime', datatype: "String" },
                    { name: 'Status', datatype: "String" }
                ]
            };
            $("#ap_info_list").SList("head", opt);

            var opt = {
                colNames: getRcText("DEV_LABELS"),
                showHeader: true,
                multiSelect: false,
                pageSize:10,
                colModel: [
                    { name: 'AliasName', datatype: "String" ,width:250},
                    { name: 'Name', datatype: "String",width:150},
                    { name: 'SN', datatype: "String",width:300 },
                    { name: 'Status', datatype: "String",width:100 },
                    { name: 'OnlineTime', datatype: "String",width:200 },
                    { name: 'b_userAccount', datatype: "String",width:150 },
                    { name: 'm_userAccount', datatype: "String",width:150 }
                ]
            };
            $("#dev_info_list").SList("head", opt);
        })();
    }
    function _init() {
        initGrid();
        initData();
    }

    function _destroy() {
        hPending&&hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils": ["Request","Base", 'Device']
    });
})(jQuery);