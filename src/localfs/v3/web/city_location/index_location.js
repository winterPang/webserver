(function($) {
    var MODULE_BASE = "city_location";
    var MODULE_NAME = MODULE_BASE + ".index_location";
    var MODULE_RC = "city_location_indexConfigure";
    //var MODULE_NP_H_WIRELESS = MODULE_BASE + ".index_detial";
    var g_oTableData = {};
    // var g_detial={};
    var deleteData = {};
    var g_oPara;
    var SKIP = 0;
    var LIMIT = 100;

    function getRcText(sRcName) {
        return Utils.Base.getRcString(MODULE_RC, sRcName); //MODULE_RC指的是apinfo_aplist_rc这个div，这句话看框架源码即可知道返回的是那个div里的具体sRcName的值
    }

    function datatime(argument) {

        var day = parseInt(argument / 86400);
        var temp = argument % 86400;
        var hour = parseInt(temp / 3600);
        temp = argument % 3600;
        var mini = parseInt(temp / 60);
        var sec = argument % 60;
        if (hour < 10) {
            var sDatatime = day + ":0" + hour;
        } else {
            var sDatatime = day + ":" + hour;
        }
        if (mini < 10) {
            sDatatime = sDatatime + ":0" + mini;
        } else {
            sDatatime = sDatatime + ":" + mini;
        }
        if (sec < 10) {
            sDatatime = sDatatime + ":0" + sec;
        } else {
            sDatatime = sDatatime + ":" + sec;
        }
        return sDatatime;
    }

    function showLinkSSIDList(row, cell, value, columnDef, dataContext, type) {
        value = value || "";

        if ("text" == type) {
            return value;
        }
        return '<a class="list-link" type="SSIDList" cell="' + cell + '"' + ' LocationName="' + dataContext.location_name + '">' + value + '</a>';

    }

    function showLinkAPList(row, cell, value, columnDef, dataContext, type) {
        value = value || "";

        if ("text" == type) {
            return value;
        }
        return '<a class="list-link" type="apList" cell="' + cell + '"' + ' LocationName="' + dataContext.location_name + '">' + value + '</a>';

    }

    function onDisDetail() {
        var ApNames = $(this).attr("ApName");
        var type = $(".list-link").attr("type");
        if ($(this).attr("type") == "apList"){
            var apGroupshuju=[
                {
                    "apGroupName":"apGroup1",
                    "Describe":"组1",
                    "LocationName":"昌平区"
                },
                {
                    "apGroupName":"apGroup2",
                    "Describe":"组2",
                    "LocationName":"昌平区"
                }
            ];
         
            $("#flowdetail_listAPGroup").SList ("refresh", apGroupshuju);
            Utils.Base.openDlg(null, {}, {
                scope: $("#TerminalInfoDlgAPGroup"),
                className: "modal-super"
            });
        }
        else
        {
            Utils.Base.openDlg(null, {}, {
                scope: $("#TerminalInfoDlgAP"),
                className: "modal-super"
            });
        }
    }



    function showRadio(obj) //这是一个处理函数，将返回的值做成具体的东西
    {
        var sRadio = '';
        $.each(obj, function(index, oDate) {
            sRadio = sRadio + oDate.radioMode + 'Hz(' + oDate.radioId + ')' + ",";
        });
        return sRadio.substring(0, sRadio.length - 1);
    }

    function onLineTime(num) {
        var time = (num.status == 1) ? datatime(num.onlineTime) :
            ((num.status == 2) ? aStatus[num.status] : "正在下载版本");
        return time;
    }

    function Traffic(up, down) {

        return parseInt(up) + '/' + parseInt(down);
    }

    var aStatus = getRcText("STATUS").split(',');
    var aAUTHEN_TYPE = getRcText("AUTHEN_TYPE").split(','); //aAUTHEN_TYPE=不认证,一键上网,账号认证
    function Fresh() {
        Utils.Base.refreshCurPage();
    }

    function bindAP(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].apGroupName = "是";
            if (data[i].apGroupName = "是") {
                Frame.Msg.info("配置成功");
            } else {
                Frame.Msg.error(data.errormsg);
            }
        };

        $("#flowdetail_listAP").SList("refresh");
        $("#TerminalInfoDlgAP").modal("hide");
    }

    function bindAPGroup(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].apGroupName = "是";
            if (data[i].apGroupName = "是") {
                Frame.Msg.info("配置成功");
            } else {
                Frame.Msg.error(data.errormsg);
            }
        };

        $("#flowdetail_listAPGroup").SList("refresh");
        $("#TerminalInfoDlgAPGroup").modal("hide");
    }

    function unbindAP(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].apGroupName = "是") {
                data[i].apGroupName = "否";
                Frame.Msg.info("配置成功");
            }
        };

        $("#flowdetail_listAP").SList("refresh");
        $("#TerminalInfoDlgAP").modal("hide");
    }

    function unbindAPGroup(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].apGroupName = "是") {
                data[i].apGroupName = "否";
                Frame.Msg.info("配置成功");
            }
        };

        $("#flowdetail_listAPGroup").SList("refresh");
        $("#TerminalInfoDlgAPGroup").modal("hide");
    }
    //删除发布模版
    function delPubMng(pubMngName) {
        var shopName = Utils.Device.deviceInfo.shop_name;
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path + "/pubmng/delete",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: FrameInfo.g_user.attributes.name,
                name: pubMngName || "",
                shopName: shopName
            })
        });
    }
    //删除SSID的接口
    function SSIDDelete(stName) {
        return $.ajax({
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDDelete",
                param: [{
                    stName: stName
                }]

            })
        });
    }

    function SSIDUnbindByAPGroup(stName) {
        return $.ajax({
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDUnbindByAPGroup",
                param: [{
                    apGroupName: "default-group",
                    apModelName: "WAP712",
                    radioId: 1,
                    stName: stName,
                    vlanId: 1
                }, {
                    apGroupName: "default-group",
                    apModelName: "WTU430",
                    radioId: 1,
                    stName: stName,
                    vlanId: 1
                }, {
                    apGroupName: "default-group",
                    apModelName: "WAP712",
                    radioId: 2,
                    stName: stName,
                    vlanId: 1

                }, {
                    apGroupName: "default-group",
                    apModelName: "WTU430",
                    radioId: 2,
                    stName: stName,
                    vlanId: 1

                }]

            })
        });
    }


    function onDelSSID(oData) {
        getSSIDInfo().done(function(data, textStatus, jqXHR) {
            if (!data) {
                return;
            }
            var stNameList = {}
            var ssidName = oData[0].ssid_name;
            var ssidList = data.ssid_list;
            $.each(ssidList, function(key, value) {
                stNameList[value.ssid_name] = value.sp_name;
            });
            var stName = stNameList[oData[0].ssid_name];
            SSIDUnbindByAPGroup(stName).done(function(data, textStatus, jqXHR) { //将SSID从AP组中解绑
                if (data.communicateResult == "success" && data.serviceResult == "success") {
                    SSIDDelete(stName).done(function(data, textStatus, jqXHR) { //删除SSID
                        if (("errorcode" in data) && (data.errorcode != 0)) {
                            Frame.Msg.info(getRcText("DEL_FAIL"), "error");
                            return;
                        } else {
                            queryPubMng().done(function(data, textStatus, jqXHR) { //查询发布管理
                                if (("errorcode" in data) && (data.errorcode != 0)) {
                                    return;
                                } else if (data.data.length > 0 && data.errorcode == 0) {
                                    var pubmng_list = data.data;
                                    for (var i = 0; i < pubmng_list.length; i++) {
                                        if (pubmng_list[i].name && pubmng_list[i].ssidName == ssidName && pubmng_list[i].isPublished == "1") {
                                            PublishPubMng(pubmng_list[i].name, false) //发布 发布模版
                                                .done(function(data, textStatus, jqXHR) {
                                                    if (data.errorcode == 0) {
                                                        delPubMng(pubmng_list[i].name).done(function(data, textStatus, jqXHR) {
                                                            if (("errorcode" in data) && (data.errorcode != 0)) {
                                                                Frame.Msg.info(getRcText("DEL_FAIL"), "error"); //失败哦
                                                                onSuccess();
                                                            }
                                                            Frame.Msg.info(getRcText("DEL_SUCCESS"));
                                                            synSSID(); //发布成功
                                                            // onSuccess();
                                                        })
                                                    }
                                                    // Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                                                    // onSuccess();
                                                });
                                        } else if (pubmng_list[i].ssidName == ssidName || pubmng_list[i].isPublished == "0") {
                                            Frame.Msg.info(getRcText("DEL_SUCCESS"));
                                            synSSID();
                                        }
                                    }
                                } else {
                                    Frame.Msg.info(getRcText("DEL_SUCCESS"));
                                    synSSID();
                                }
                            })
                        }
                    })
                } else {
                    Frame.Msg.info(getRcText("LINK_delete"), "error");
                    Utils.Base.refreshCurPage();
                    return;
                }
            })
        })
    }

    function getSSIDList() {
        return $.ajax({
            url: MyConfig.path + "/ssidmonitor/getssidlist?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        });
    }
    //查询发布管理
    function queryPubMng(data, textStatus, jqXHR) {
        // console.log(data);
        var shopName = Utils.Device.deviceInfo.shop_name;
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path + "/pubmng/query?ownerName=" + FrameInfo.g_user.attributes.name + "&shopName=" + shopName,
            dataType: "json",
            contentType: "application/json"
        });
    }


    function getApModel(){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "apmgr",
                deviceModule : "apmgr",
                method : "AddApGroupModel",
                param : [{apGroupName:"default-group",apModel:"WTU430"},
                        {apGroupName:"default-group",apModel:"WAP712"}]

            })
        });  
    }
    function refreshSSIDList(obj) {
        var arr = [];
        for (var a in obj) {
            arr.push(obj[a]);
        }
       // $("#location_list").SList("refresh", arr);
    }
    function SSIDUpdate_2(sStName,sSSID_name,bStatus,bHide,bEncrypt,nMaxSendRatio,nmaxReceiveRatio)
    {
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method: "SSIDUpdate",
                param:[{
                    stName: sStName || "",
                    ssidName: sSSID_name || "",
                    description: "1",
                    status: bStatus,
                    hideSSID: bHide,
                    cipherSuite: bEncrypt,
                    maxSendRatio: nMaxSendRatio,
                    maxReceiveRatio: nmaxReceiveRatio
                }]

            })
        })


    }
    function bingSSIDByAPgroup(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSIDBindByAPGroup",
                param :[ 
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   1,
                        stName       :   stName,
                        vlanId:1
                     },
                     {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   1,
                        stName       :   stName,
                         vlanId:1
                     },
                     {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   2,
                        stName       :   stName,
                         vlanId:1
                     },
                     {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   2,
                        stName       :   stName,
                         vlanId:1
                     }
                 ]
            })
        });  
    } 
    //同步请求接口
    function synSSID() {
        // alert("异步请求成功");
        $.ajax({
            type: "get",
            url: MyConfig.v2path + "/syncAc?acsn=" + FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data && data.error_code == "0") {

                    Utils.Base.refreshCurPage();
                } else {
                    Frame.Msg.info("同步失败", "error");
                }
            },
            error: function(err) {

            }

        })
    }
    function getRandomString(len) {  
        len = len || 32;  
        var $chars = 'abcdefhijkmnprstwxyz2345678';  
        var maxPos = $chars.length;  
        var pwd = '';  
        for (i = 0; i < len; i++) {  
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));  
        }  
        return pwd;  
    } 
    function portalEnable_1(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "portal",
                deviceModule : "portal",
                method : "setSimpleConfig",
                param : [
                    {
                        stname:stName,
                        enable:1,
                        webserver:"lvzhou-server",
                        domain:"cloud"
                    }
                ]

            })
        });  
    }
    function getInputValue(inputDiv)
    {
        var mInputs = [];
        $("input",inputDiv).each(function(){
            mInputs.push($(this).val());
        });

        return mInputs;
    }
    function onSubmit()
    {
        var avalue = getInputValue($("#location_name"));
        console.log(avalue);
    }
    function onAddCityLoaction(){

        var location = $("#location_name");
        var addForm = $("#AddLocationForm");

        location.children().remove();

        function addLabel(jInput , isAdd){
            var sOperClass = isAdd ? "minput-add" : "minput-remove";
            var str = '<div class="input-row"><input type="text" class="string big"/><span class="minput-operator '+sOperClass+'"></span</div>';

            var jLabel = $(str).appendTo(jInput);
            Utils.Widget.setError(jLabel,"");
            jLabel.on("blur","input",function(){
                var valueTemp = $(this).val();
                if(!valueTemp){
                    $("#location_name_error").html("必须填写该参数");
                    $("#location_name_error").show();
                    $(this).addClass("text-error");
                } else if(/[\u4e00-\u9fa5]/.test(valueTemp))
                {
                    $("#location_name_error").html("不支持中文");
                    $("#location_name_error").show();
                }
                else{
                    $(this).removeClass("text-error");
                    $("#location_name_error").html("");
                    $("#location_name_error").hide();
                }
            });
            jLabel.on('click','.minput-operator',function(e){
                if(isAdd)
                {
                    addLabel(jInput,false);
                }
                else
                {
                    $(this).parent().remove();
                }
            });
            return jLabel;
        }

        addLabel(location,true);
        //form初始化弹出添加框
        addForm.form("init", "add", {"title":getRcText("TITLE_LOCATION"), "btn_apply":onSubmit, "btn_cancel":false});
        addForm.form("updateForm",{location_name: ""});
        Utils.Base.openDlg(null, null,{scope:$("#AddLocationDlg"),className:"modal-large"});
    }

    function onCfgAddSsid()
    {
        getApModel().done(function(data, textStatus, jqXHR){
            if(data.communicateResult == "fail"){
                onCancelAddSsid();
                Frame.Msg.info(getRcText("LINK"));
                Utils.Base.refreshCurPage();
                return;
            }
            var stName = getRandomString(5);
            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                var addForm = $("#AddSsidForm");
                var sStName = stName;
                var sSSID_name = $("#ssid_name", addForm).val().trim();
                if(sSSID_name == ""){
                    Frame.Msg.info(getRcText("ADD_NULL_SSID"),"error");
                    return ;
                }
                // var bStatus = Number($(":input[name=status]", addForm).MRadio("getValue"));
                var bStatus = 1;
                // var bHide = Number($(":input[name=hideSSID]", addForm).MRadio("getValue"));
                var bHide = 0;
                // var bEncrypt =Number($(":input[name=cipherSuite]", addForm).MRadio("getValue"));
                var bEncrypt = 0;
                // var portal = Number($(":input[name=portal_policy_status]", addForm).MRadio("getValue"));
                var portal = 1;
                // var nMaxSendRatio = Number($("#maxSendRatio", addForm).val());
                var nMaxSendRatio = 0;
                // var nmaxReceiveRatio = Number($("#maxReceiveRatio", addForm).val());
                var nmaxReceiveRatio = 0;
                if(portal == 0)
                {
                    portalEnable_0(sStName).done(function(data, textStatus, jqXHR){
                         if(("errorcode" in data) && (data.errorcode != 0)){
                            return;
                        }                       
                    })

                }
                else
                {
                    portalEnable_1(sStName).done(function(data, textStatus, jqXHR){
                         if(data.communicateResult == "fail" && data.serviceResult == "fail"){
                            Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                            return;
                        } 
                    })
                }
                if(bEncrypt == "16")
                {
                    var sPsk = $("#psk", addForm).val();
                    var bMode = 1;
                    var bSecurity = 1;

                    SSIDUpdate(sStName,sSSID_name,bStatus, bHide, bEncrypt,sPsk, bMode, bSecurity,
                    nMaxSendRatio, nmaxReceiveRatio).done(function(data, textStatus, jqXHR){
                    if(data.communicateResult == "success" && data.serviceResult == "success")
                        bingSSIDByAPgroup(stName).done(function(data, textStatus, jqXHR){
                            if(data.communicateResult == "success" && data.serviceResult == "success")
                            {
                                onCancelAddSsid();
                                Frame.Msg.info(getRcText("ADD_SUCCESS"));
                                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                                Utils.Base.refreshCurPage();
                            }

                        })
                    })
                }
                else
                {
                    SSIDUpdate_2(sStName,sSSID_name,bStatus, bHide, bEncrypt,nMaxSendRatio,nmaxReceiveRatio).done(function(data, textStatus, jqXHR){
                        if(data.communicateResult == "success" && data.serviceResult == "success")
                        {
                            if(!data.deviceResult[0].errMsg ==""){
                                onCancelAddSsid();
                                Frame.Msg.info(getRcText("ADD_Limit"),"error");
                                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                                // Utils.Base.refreshCurPage();
                                return;
                            }
                            bingSSIDByAPgroup(stName).done(function(data, textStatus, jqXHR){
                                if(data.communicateResult == "success" && data.serviceResult == "success")
                                {
                                    onCancelAddSsid();
                                    Frame.Msg.info(getRcText("ADD_SUCCESS"));
                                    synSSID();
                                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                                    //Utils.Base.refreshCurPage();
                                }else{
                                    onCancelAddSsid();
                                    Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                                    Utils.Base.refreshCurPage();
                                }

                            })
                        }
                        else{
                            onCancelAddSsid();
                            Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                            Utils.Base.refreshCurPage();
                        }
                    })
                }



            }
        }) 
    }  
    function onCancelAddSsid()
    {
        $("input[type=text]",$("#AddSsidForm")).each(function() {
                Utils.Widget.setError($(this),"");
        });
        $("#AddSsidForm").form("updateForm",{
            ssid_name: "",
            password: "",
            hiding: 0,
            policy_status: 0,
            encrypt_status: 0,
            portal_policy_status: 0,
            upload_rate: "",
            download_rate: ""
        })
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddSsidForm")));
    }
    function getSSIDInfo() {
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path + "/getSSIDInfo",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                tenant_name: FrameInfo.g_user.attributes.name,
                dev_snlist: [FrameInfo.ACSN + ""]
            })
        });
    }
    function queryAuthCfg() {
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path + "/authcfg/query?ownerName=" + FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json"
        })
    }


    function initData() {
        var aAuthType = getRcText("AUTHEN_TYPE").split(","); //不认证,一键上网,账号认证
        var aSTATUS = getRcText("STATUS").split(','); //,使能,去使能
        var obj = {};
        //获取认证模板
        //下面的这个接口是用来向id="AuthCfgList"中的option标签加数据的
        queryAuthCfg().done(function(data, textStatus, jqXHR) {
            if (("errorcode" in data) && (data.errorcode != 0)) {
                return;
            }
            var auth_list = data.data;
            var authcfgList = [];
            auth_list.forEach(function(authcfg) {
                authcfgList.push(authcfg.authCfgTemplateName);
            });

            getSSIDInfo().done(function(data, textStatus, jqXHR) {
                var resfrsh = [];


                if ('{"errcode":"Invalid request"}' == data) {
                    alert("没有权限");
                } else {
                    $.each(data.ssid_list, function(index, iDate) {
                        iDate.status = aSTATUS[iDate.status];
                        iDate.bindAP=145;
                        iDate.authType="";
                        iDate.bindAPGroup=89;
                        resfrsh.push(iDate);
                    });
                    // $("#location_list").SList ("refresh", data.ssidList);
                    for(var i =0;i<resfrsh.length;i++){
                        g_oTableData[resfrsh[i].sp_name]=resfrsh[i];//用来刷超链接的
                    }

                    for (var i = 0; i < resfrsh.length; i++) {
                        obj[resfrsh[i].ssid_name] = resfrsh[i];
                    }
                    // refreshSSIDList(obj);
                }
           
                queryPubMng().done(function(data, textStatus, jqXHR) {
                    if (("errorcode" in data) && (data.errorcode != 0)) {
                        return;
                    }
                    var pubmng_list = data.data || [];
                    pubmng_list.forEach(function(pubmng) {
                        if (!("ssidName" in pubmng)) {
                            delPubMng(pubmng.name).done(function(data) {
                                console.log("delet other pubmng")
                            });
                            return;
                        }
                        if (!(pubmng.ssidName in obj)) {
                            delPubMng(pubmng.name).done(function(data) {
                                console.log("delet other pubmng")
                            });
                            return;
                        }
                        var ssid = pubmng.ssidName; //obj[pubmng.ssidName];
                        auth_list.forEach(function(authmsg) {
                            obj[ssid].pubMngName = pubmng.name;
                            obj[ssid].shopName = pubmng.shopname;
                            obj[ssid].ssidName = pubmng.ssidName;
                            obj[ssid].WeChartList = pubmng.weixinAccountName;
                            obj[ssid].authCfgName = pubmng.authCfgName;
                            obj[ssid].loginPage = pubmng.themeTemplateName;
                            //====for show===
                            obj[ssid].AuthenType = "AT" + (pubmng.authCfgName ? 4 : 0); //认证模板
                            obj[ssid].AuthCfgList = pubmng.authCfgName;
                            obj[ssid].LoginPage = pubmng.themeTemplateName ? "LP4" : "LP1" //页面模板
                            obj[ssid].LoginPageList = pubmng.themeTemplateName;
                            if (authmsg.authCfgTemplateName == pubmng.authCfgName) {
                                obj[ssid].AuthType = aAuthType[authmsg.authType]; //slist 显示用
                                if (authmsg.uamAuthParamList[0].authParamValue == "0") {
                                    obj[ssid].auto_study_enable = false;
                                } else {
                                    obj[ssid].auto_study_enable = true;
                                    obj[ssid].impose_auth_time = authmsg.uamAuthParamList[0].authParamValue;
                                }
                            }
                        })
                        
                    });
                    refreshSSIDList(obj);
                })
               
            })
        
        })

    };



    function cancelAllAP() {
        $("#TerminalInfoDlgAP").modal("hide"); //让弹窗消失的按钮
    }

    function cancelAllAPGroup() {
        $("#TerminalInfoDlgAPGroup").modal("hide"); //让弹窗消失的按钮
    }

    function addblackShow(aRows) {
        var bAddtoBlackshow = false;
        if (aRows.length > 0) {
            for (var i = 0; i < aRows.length; i++) {
                if (aRows[i].isBlackUser == true) {
                    return false;
                }
            }
            return true;
        }
        return bAddtoBlackshow;
    }

    function rmBlackShow(aRows) {
        var brmBlackshow = false;
        if (aRows.length > 0) {
            for (var i = 0; i < aRows.length; i++) {
                if (aRows[i].isBlackUser == false) {
                    return false;
                }
            }
            return true;
        }
        return brmBlackshow;
    }

    function del(){
        return '删除'
    }
    function initForm() {

        function onViewDetial(data) {
            var oUrlPara = {
                np: MODULE_BASE + ".index_detial",              
                ssid_name: data[0].ssid_name
            };
            Utils.Base.redirect(oUrlPara);
        }

        function showAddUser(data) {
            var oUrlPara = {
                np: MODULE_BASE + ".index_modify",
                stName: data[0].sp_name,
                ssidName: data[0].ssid_name,
                status: data[0].status,
                authType:data[0].AuthType
            };
            Utils.Base.redirect(oUrlPara);
        }
        var oSListLocation = { //初始化表头信息，并且写出具体字段，字段值和ajax返回的值要对应上
            height: "70",
            showHeader: true,
            showOperation: true,
            multiSelect: false,
            pageSize: 10,
            colNames: getRcText("LOCATION_HEADER"),
            colModel: [
                {name: "location_name", datatype: "String", width: 80},
                {name: "describe", datatype: "String", width: 80},
                {name: "group_name", datatype: "String", formatter:showLinkAPList, width: 80},
                {name: "service_name", datatype: "String", formatter:showLinkSSIDList, width: 80}
            ],
            buttons: [
                {name: "add", value: "添加", action: onAddCityLoaction, enable: 1},
                {name: "sync", value: "同步", action: synSSID},
                {name: "del", value: "删除", action: synSSID},
                {name: "delete", action: Utils.Msg.deleteConfirm(onDelSSID), enable: 1}
            ]
        };

        $("#location_list").SList("head", oSListLocation);
        var demoData = [{location_name:'昌平区', group_name:'3', service_name:'2'}];

        $("#location_list").SList("refresh", demoData);
        $("#location_list").on('click', 'a.list-link', onDisDetail);
       

        var oSListService = {
            height: "70",
            showHeader: true,
            pageSize: 10,
            colNames: getRcText("SERVICE_HEADER"),
            colModel: [
                {name: "ServiceName", datatype: "String"},
                {name: "SSID", datatype: "String"},
                {name: "ServiceType", datatype: "String"},
                {name: "LocationName", datatype: "String"}
            ],
            buttons: [
                {name: "add", value: "添加", action: onAddCityLoaction, enable: 1},
                {name: "del", value: "删除", action: synSSID}
            ]
        };

        var shuju=[
            {
                "ServiceName":"lvzhou-h3c",
                "SSID":"lvzhou-h3c",
                "ServiceType":"内部服务",
                "LocationName":"昌平区"
            },
            {
                "ServiceName":"lvzhou1-h3c",
                "SSID":"lvzhou1-h3c",
                "ServiceType":"内部服务",
                "LocationName":"昌平区"
            }
        ];
        $("#view_client_form").form("init", "edit", {
            "title": getRcText("ADDLOCATION"),
            "btn_apply": false,
            "btn_cancel": false
        });
        $("#flowdetail_listAP").SList("head", oSListService);
        $("#flowdetail_listAP").SList ("refresh", shuju);

        var oSListAPGroup = {
            height: "70",
            showHeader: true,
            multiSelect: true,
            pageSize: 10,
            colNames: getRcText("APGROUP_HEADER"),
            colModel: [
                {name: "apGroupName", datatype: "String"},
                {name: "Describe", datatype: "String"},
                {name: "LocationName", datatype: "String"}
            ],
            buttons: [
                {name: "add", value: "添加", action: onAddCityLoaction, enable: 1},
                {name: "del", value: "删除", action: synSSID}
            ]
        };
        var apGroupshuju=[
            {
                "apGroupName":"apGroup1",
                "Describe":"组1",
                "LocationName":"昌平区"
            },
            {
                "apGroupName":"apGroup2",
                "Describe":"组2",
                "LocationName":"昌平区"
            }
        ];
         //这句话是在弹出框中加上AP列表那项
        $("#view_client_form1").form("init", "edit", {
            "title": getRcText("ADDLOCATION"),
            "btn_apply": false,
            "btn_cancel": false
        });
        $("#flowdetail_listAPGroup").SList("head", oSListAPGroup);
        $("#flowdetail_listAPGroup").SList ("refresh", apGroupshuju);

    }

    function _init() {
        g_oPara = Utils.Base.parseUrlPara(); //这句话是把在url中的地址取到
        initForm();
        initData();
    }

    function _resize(jParent) {}

    function _destroy() {
        console.log("destory**************");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "SList", "Form", "SingleSelect"],
        "utils": ["Base", "Request", "Device"],

    });

})(jQuery);