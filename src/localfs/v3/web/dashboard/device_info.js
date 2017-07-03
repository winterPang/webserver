(function ($)
{
    var MODULE_NAME = "dashboard.Device_info";
    //var NC, MODULE_NC = "wsmbfile.NC";
    var g_BackgroundLayer;
    var g_WallLayer;
    var g_ApLayer;
    var g_mapAllList_Dialog = {};
    var g_mapAllList_Select = {};
    var editFlag = false;
    var model = "";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("device_infor_rc", sRcName);
    }

    function onEditApName(oData)
    {
        $("#changename").form ("init", "edit", {title : getRcText("RENAME_TITLE"),"btn_apply": onOk});
        $("#OldName").html(oData.Name);
        $("#NewName").val("");
    }

    function getRadioInfor(sCell,oData)
    {
        if(sCell == "1")
        {
            return {
                Name : "5GHz(" + oData.RadioNum + ")",
                ID : oData.RadioNum,
                Status :  oData.f5ghz,
                Power : oData.PowerID5
            };
        }
        else
        {
            return {
                Name : "2.4GHz(" + oData.RadioNum + ")",
                ID : oData.RadioNum,
                Status :  oData.f2ghz,
                Power : oData.PowerID2
            };
        }
    }

    function onEditStatus(oData,sCell){
        var oRadio = getRadioInfor(sCell,oData);
        $("#StatusForm").form("init", "edit", {title : getRcText("STATUS_TITLE"),"btn_apply": onOk});
        $("#ApName").html(oData.Name);
        $("#RadioName").html(oRadio.Name);
        $("#Status").MCheckbox("setState", oRadio.Status == "1");
        Utils.Base.openDlg(null, {}, {scope:$("#StatusDlg"),className:"modal-super"});
    }

    function onChangeAPInfo()
    {
        var jThis = $(this);
        var sApName = jThis.attr("PolicyName");
        var nType = jThis.attr("type");
        var jScope = $("#Opendlg");
        var oApData = $("#ap_info_list").SList("getSelectRow")[0];
        switch(nType)
        {
            case "0":
            {
                $ ("#changename").show();
                var oFormData = {OldApName:sApName};
                $ ("#changename").form ("updateForm", oFormData);
                Utils.Base.openDlg(null, {}, {scope:$("#ApNameDlg"),className:"modal-super dashboard"});
                onEditApName(oApData);
                break;
            }
            case "1":
            {
                onEditStatus(oApData,nType);
                break;
            }
            case "2":
            {
                onEditStatus(oApData,nType);
                break;
            }
            case "3":
            {
                Utils.Base.openDlg(null, {}, {scope:$("#historyinfo"),className:"modal-super dashboard"});
                break;
            }
            default:
                break;
        }
        return false;
    }

    function get_initFormData_function (){
        function get_initFormDataSuc(data)
        {

            var versionlist=[];
            // data.error_code=0
            if(data.error_code==0){
                $.each(data.data,function(key,value){
                    var version ={};
                    version.url=value.url;
                    version.size=(value.size/(1024*1024)).toFixed(2);
                    version.type=getRcText("VERSION_TYPE").split(",")[value.type];
                    version.version=value.version;
                    version.description=value.description;
                    version.bkSize = value.size;
                    versionlist.push(version);
                })
                Utils.Base.openDlg(null, {}, {scope:$("#verlist"),className:"modal-super dashboard"});
            }else{
                Frame.Msg.info(data.error_message,"error");

            }

            $("#version_info_list").SList ("refresh", versionlist);
        };

        function get_initFormDataFail()
        {
        };


        var get_initFormData = {
            url: MyConfig.v2path+"/getModelVersion?model="+model,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess: get_initFormDataSuc,
            onFailed: get_initFormDataFail
        };
        Utils.Request.sendRequest( get_initFormData );
    }

    /* 初始化表单，初始化点击事件 */
    function initForm()
    {
        $("#ap_info_list").on('click', '.list-link', onChangeAPInfo);
        $("#version").on("click",function(){

        get_initFormData_function ();
        });
    }

    function drawApInfo()
    {
        var opt = {
                colNames: getRcText ("AP_LABELS"),
                showHeader: true,
                multiSelect: false,
                colModel: [
                    {name:'Name', datatype:"String"/*,formatter:ChangeAPInfo*/},
                    {name:'MacAddress', datatype:"String"},
                    {name:'Ipv4Address', datatype:"String"},
                    {name:'f5ghz', datatype:"String"/*,formatter:ChangeAPInfo*/},
                    {name:'f2ghz', datatype:"String"/*,formatter:ChangeAPInfo*/},
                    {name:'OnlineTime', datatype:"String"},
                    {name:'Status', datatype:"String"},

              ]
            };
        $("#ap_info_list").SList ("head", opt);
    }

    function drawWirelessService()
    {
        var opt = {
                colNames: getRcText ("W_DEVICE"),
                showHeader: true,
                multiSelect: false,
                colModel: [
                    {name:'Name', datatype:"String"},
                    {name:'SSID', datatype:"String"},
                    {name:'Enable', datatype:"String"}
                ],
                onToggle : {
                    action : showHide,
                    jScope : $("#toggle_wireless")
                }
            };
        $("#wirelessService").SList ("head", opt);
    }

    function showHide(oRowdata)
    {
        var upServiceData = {};
        upServiceData.toggle_status = oRowdata.Enable;
        upServiceData.toggle_access_pwd = "N/A";
        upServiceData.toggle_auth = "N/A";
        upServiceData.ClientNumber5G = "N/A";
        upServiceData.ClientNumber2G = "N/A";
        upServiceData.total = "N/A";
        Utils.Base.updateHtml($("#toggle_wireless"),upServiceData);
    }

    /* 初始化试图，slist */
    function initGrid(){
        drawApInfo();
        drawWirelessService();
        versionGrid();
    }

    function versionGrid(){
        var versionopt = {
                colNames: getRcText ("Version_HEADER"),
                showHeader: true,
                multiSelect : true ,
                colModel: [
                    {name:'url', datatype:"String"},
                    {name:'size', datatype:"String"},
                    {name:'type', datatype:"String"},
                    {name:'version', datatype:"String"},
                    {name:'description', datatype:"String"}
                ],
                buttons:[
                    {name:"download",value:getRcText ("DOWNLOAD"),mode:Frame.Button.Mode.DOWNLOAD,action:downloadVersion}
                ]
         };
        $("#version_info_list").SList ("head", versionopt);
    }

    function downloadVersion(rowData){

        function get_downloadVersionSuc( data )
        {
            if(data.retCode == 0){
                Frame.Msg.info(error_message[0]);
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#verlist")));
            }else{
                Frame.Msg.info(error_message[1]);
            }
        };

        function get_downloadVersionFail()
        {

        };

        var error_message=getRcText ("DOWNLOAD_ERROR").split(",");
        if(rowData.length == 1){
            var data = {
                "tenant_name":FrameInfo.g_user.attributes.name,
                "dev_sn":FrameInfo.ACSN,
                "file_size":rowData[0].bkSize,
                 "devVersionUrl":rowData[0].url
            }

            var get_downloadVersion = {
                url: MyConfig.v2path+"/upgradeDevice",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data:JSON.stringify(data),
                onSuccess: get_downloadVersionSuc,
                onFailed: get_downloadVersionFail
            };
            Utils.Request.sendRequest( get_downloadVersion );

        }else{
            Frame.Msg.info(error_message[2],"error");
        }

    }

    function getApInfo(apList){
    var aAll = [];
    var allAPstatus = getRcText("AP_STATUS").split(",");
    allAPstatus.unshift("");
    var Timelable = getRcText("TIME").split(",");
        
    apList.forEach(function(ap){

        var time = ap.onlineTime;
        var day  = parseInt(time/86400);
        var temp = time%86400;
        var hour = parseInt(temp/3600);
        temp = time%3600;
        var mini = parseInt(temp/60);
        var sec  = time%60;
        sDatatime = day + Timelable[0] + hour + Timelable[1] + mini + Timelable[2];
        sdata = sDatatime;
        var info = {
            Name: ap["apName"],
            MacAddress: ap["macAddr"],
            Ipv4Address: ap["ipv4Addr"],
            OnlineTime: ap["onlineTime"],
            Status: allAPstatus[ap["status"]],
            // history: history
        };
        ap["radioList"].forEach(function(radio){
            var mode = (radio["radioMode"] === "5G" ? "f5ghz" : "f2ghz");
            info[mode] = (radio["radioStatus"] == "1" ? getRcText("ENABLE").split(',')[1]: getRcText("ENABLE").split(',')[0]);
        });
        aAll.push(info); 
    });
    return aAll;
}

    /* get代表的是获取ajax信息，中间部分是获取的哪个接口，后面的是调用函数中的标识信息可能是：ID、函数名 */


    function getMapInfo_Dialog() {
        function get_application_DialogSuc( data )
        {
            if (data.data.retCode !== 0) {
                return;
            }
            g_mapAllList_Dialog = data.data.maplist;
            g_mapAllList_Dialog = g_mapAllList_Dialog === "" ? [] : g_mapAllList_Dialog;
            getMapImage_Dialog();

        };

        function get_application_DialogFail()
        {

        };

        var get_application_Dialog = {
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSn: FrameInfo.ACSN,
                Method: "getMap",
                Param: {
                    devSN: FrameInfo.ACSN,
                },
                Return: ["mapName", "scale", "wallList", "apList"]
            }),
            onSuccess: get_application_DialogSuc,
            onFailed: get_application_DialogFail            
        };
        Utils.Request.sendRequest( get_application_Dialog );
    }

    function getMapImage_Dialog() {

        function get_MapFile_DialogSuc( data )
        {
            if (data.data.retCode !== 0) {
                return;
            }
            g_BackgroundLayer.clean();
            g_WallLayer.clean();
            g_ApLayer.clean();

            var mapInfoList = (data.data.maplist === "" ? [] : data.data.maplist);
            var mapList = {};
            var mapNameList = [];
            g_mapAllList_Dialog.forEach(function (map) {
                map.mapName = map.mapName.split(",")[0];
                if (map.mapName == "") {
                    return true;//continue
                }
                mapNameList.push(map.mapName);

            });
            mapNameList.forEach(function (map) {
                mapList[map] = {path: "", mapName: map};
                //return true;
            });
            mapInfoList.forEach(function (map) {
                mapList[map.mapName] = map;

            });

            $("#MapSelect").singleSelect("InitData", mapNameList);
            $("#MapSelect").singleSelect("value", mapNameList[0]);

            var mapname = mapNameList[0];
            $("#mapName").text(mapname);


            var imgUrl = '/v3/wloc/image/' + FrameInfo.ACSN + '/' + mapname + '/shortcut';
            var imgbackground = new Image();
            imgbackground.width =700;
            imgbackground.height = 350;
            imgbackground.onload = function(){
                var canvas1 = document.createElement('CANVAS');
                canvas1.width = 700;
                canvas1.height = 350;
                var ctx = canvas1.getContext("2d");
                ctx.drawImage(imgbackground,0, 0, 700, 350, 0, 0, 700, 350);
                var imagebase64 = canvas1.toDataURL("image/jpeg");
                cc.loader.loadImg(imagebase64, { isCrossOrigin: false }, function (err, img) {
                    g_BackgroundLayer.setBackgroundImage(img);
                });

            };
            imgbackground.src = imgUrl;
            Utils.Base.openDlg(null, {}, {scope: $("#mapInfo"), className: "modal-super dashboard"});
        };

        function get_MapFile_DialogFail()
        {

        };

        var get_MapFile_Dialog = {
            type: "POST",
            url: "/v3/wloc/getMapFile",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getMapallurl",
                Param: {
                },
                Return: ["url", "mapName", "filename"]
            }),
            onSuccess: get_MapFile_DialogSuc,
            onFailed: get_MapFile_DialogFail            
        };
        Utils.Request.sendRequest( get_MapFile_Dialog );
    };

    function getMapImage_Select() {

        function get_MapFile_SelectSuc( data )
        {
            if (data.data.retCode !== 0) {
                return;
            }
            g_BackgroundLayer.clean();
            g_WallLayer.clean();
            g_ApLayer.clean();

            var mapInfoList = (data.data.maplist === "" ? [] : data.data.maplist);
            var mapList = {};
            var mapNameList = [];
            g_mapAllList_Select.forEach(function (map) {
                map.mapName = map.mapName.split(",")[0];
                if (map.mapName == "") {
                    return true;//continue
                }
                mapNameList.push(map.mapName);

            });
            mapNameList.forEach(function (map) {
                mapList[map] = {path: "", mapName: map};
                //return true;
            });
            mapInfoList.forEach(function (map) {
                mapList[map.mapName] = map;
            });

            var mapname = mapNameList[0];
            mapname = $("#MapSelect").singleSelect("value");
            $("#mapName").text(mapname);


            var imgUrl = '/v3/wloc/image/' + FrameInfo.ACSN + '/' + mapname + '/shortcut';
            var imgbackground = new Image();
            imgbackground.width =700;
            imgbackground.height = 350;
            imgbackground.onload = function(){
                var canvas1 = document.createElement('CANVAS');
                canvas1.width = 700;
                canvas1.height = 350;
                var ctx = canvas1.getContext("2d");
                ctx.drawImage(imgbackground,0, 0, 700, 350, 0, 0, 700, 350);
                var imagebase64 = canvas1.toDataURL("image/jpeg");
                cc.loader.loadImg(imagebase64, { isCrossOrigin: false }, function (err, img) {
                    g_BackgroundLayer.setBackgroundImage(img);
                });

            };
            imgbackground.src = imgUrl;
        };

        function get_MapFile_SelectFail()
        {

        };
        var get_MapFile_Select = {
            type: "POST",
            url: "/v3/wloc/getMapFile",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getMapallurl",
                Param: {
                    //devSN: FrameInfo.ACSN //这个有问题  使用acsn获取地图信息没有数据返回
                },
                Return: ["url", "mapName", "filename"]
            }),
            onSuccess: get_MapFile_SelectSuc,
            onFailed: get_MapFile_SelectFail            
        };
        Utils.Request.sendRequest( get_MapFile_Select );
    }

    function getMapInfo_Select() {
        function get_application_SelectSuc( data )
        {
            if (data.data.retCode !== 0) {
                return;
            }
            g_mapAllList_Select = data.data.maplist;
            g_mapAllList_Select = g_mapAllList_Select === "" ? [] : g_mapAllList_Select;
            getMapImage_Select();
        };

        function get_application_SelectFail()
        {

        };

        var get_application_Select = {
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSn: FrameInfo.ACSN,
                Method: "getMap",
                Param: {
                    devSN: FrameInfo.ACSN,
                },
                Return: ["mapName", "scale", "wallList", "apList"]
            }),
            onSuccess: get_application_SelectSuc,
            onFailed: get_application_SelectFail            
        };
        Utils.Request.sendRequest( get_application_Select );
    }

    /* 初始化数据时调用的函数 */
    function get_DevStatus_Init(){
        function get_DevStatusSuc( data )
        {
            var adev_statuslist=data.dev_statuslist || [];
            var Connect_Sta=getRcText("Connect_Sta").split(",");
            if(adev_statuslist.length==1){
                if(adev_statuslist[0].dev_status==1)
                {
                    $("#CloudConnectionState").text(Connect_Sta[0]);
                }
                else{
                    $("#CloudConnectionState").text(Connect_Sta[1]);
                }
            }else{
                $("#CloudConnectionState").text(Connect_Sta[1]);
            }
        };

        function get_DevStatusFail()
        {

        };
        var get_DevStatus = {
            //url: MyConfig.v2path + "/getDevStatus",
            url:"/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal/getDevStatus",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                tenant_name: FrameInfo.g_user.attributes.name,
                dev_snlist: [FrameInfo.ACSN],
            }),
            onSuccess: get_DevStatusSuc,
            onFailed: get_DevStatusFail
        };
        Utils.Request.sendRequest(get_DevStatus);
    };

    function get_Dev_Init(){
        function get_DevSuc( data )
        {
            var statust=data.status;
            var iDis_Reason = data.lastDownReasonCode;
            var Connect_Sta=getRcText("Connect_Stav3").split(",");
            var Disconnect_Reason = getRcText("V3Dis_Reason").split(",");
            if(statust == 0) {
                $("#v3CloudConnectionState").text(Connect_Sta[0]);
                $("#v3DisconnectReason_Label").removeClass("hide");
                switch (iDis_Reason) {
                    case 0:
                    {
                        $("#v3DisconnectReason").text(Disconnect_Reason[0]);
                        break;
                    }
                    case 1:
                    {
                        $("#v3DisconnectReason").text(Disconnect_Reason[1]);
                        break;
                    }
                    case 2:
                    {
                        $("#v3DisconnectReason").text(Disconnect_Reason[2]);
                        break;
                    }
                    case 3:
                    {
                        $("#v3DisconnectReason").text(Disconnect_Reason[3]);
                        break
                    }
                    case 4:
                    {
                        $("#v3DisconnectReason").text(Disconnect_Reason[4]);
                        break;
                    }
                    case 5:
                    {
                        $("#v3DisconnectReason").text(Disconnect_Reason[5]);
                        break;
                    }
                    case 6:
                    {
                        $("#v3DisconnectReason").text(Disconnect_Reason[6]);
                        break;
                    }
                    case 7:
                    {
                        $("#v3DisconnectReason").text(Disconnect_Reason[7]);
                        break;
                    }
                    default:
                    {
                        $("#v3DisconnectReason").text(Disconnect_Reason[8]);
                        break;
                    }

                }
            }
            else{
                $("#v3CloudConnectionState").text([Connect_Sta[1]]);

            };

        };

        function get_DevFail()
        {

        };
        var get_Dev = {
            url: MyConfig.path + "/base/getDev",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({devSN: FrameInfo.ACSN}),
            onSuccess: get_DevSuc,
            onFailed: get_DevFail
        };
        Utils.Request.sendRequest(get_Dev);
    };

    function fnChengeTime(value) {
        var nSecond = parseInt(value);// 秒
        var nMinute = 0;// 分
        var nHour = 0;// 小时
        var nDay = 0; //天
        var result = {};
        if(nSecond > 60) {
            nMinute = parseInt(nSecond/60);
            nSecond = parseInt(nSecond%60);
            if(nMinute > 60) {
                nHour = parseInt(nMinute/60);
                nMinute = parseInt(nMinute%60);
            }
            if(nHour > 24){
                nDay = parseInt(nHour/24);
                nHour = parseInt(nHour%24);
            }
        }
        result = ""+parseInt(nSecond)+"秒";
        if(nMinute > 0) {
            result = ""+parseInt(nMinute)+"分"+result;
        }
        if(nHour > 0) {
            result = ""+parseInt(nHour)+"小时"+result;
        }
        if(nDay > 0)
        {
            result = ""+ parseInt(nDay)+"天"+result;
        }
        return result;
    }


    function get_WebAplist_Init(){
        function get_WebAplistSuc( data )
        {
            var apList = data["apList"];
            var aAPInfo = getApInfo(apList);
            var nIndex_length = aAPInfo.length;
            for (var i = 0; i < nIndex_length; i++)
            {
                aAPInfo[i].OnlineTime = fnChengeTime(aAPInfo[i].OnlineTime);
            };
            $("#ap_info_list").SList ("refresh", aAPInfo);
        };

        function get_WebAplistFail()
        {

        };
        var get_WebAplist = {
            type: "GET",
            url: MyConfig.path + "/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
            dataType: "json",
            onSuccess: get_WebAplistSuc,
            onFailed: get_WebAplistFail
        };
        Utils.Request.sendRequest(get_WebAplist);
    };

    function get_WebSystem_Init(){

        function get_WebSystemSuc( data )
        {
            model = data["devMode"];
            var oInfor = {
                "DeviceType" : data["devMode"],//aInfo[0].Model || aInfo[0].Name
                "SerialNumber": FrameInfo.ACSN,
                "FirmwareRev": data["devBootWare"],
                "HardwareRev" : data["devSoftVersion"],
                "SoftwareRev" : data["devHardVersion"]
            }
            Utils.Base.updateHtml($("#version_block"),oInfor);

        };

        function get_WebSystemFail()
        {

        };

        var get_WebSystem = {
            type: "GET",
            url: MyConfig.path + "/devmonitor/web/system?devSN=" + FrameInfo.ACSN,
            dataType: "json",
            onSuccess: get_WebSystemSuc,
            onFailed: get_WebSystemFail
        };
        Utils.Request.sendRequest(get_WebSystem);
    };
    /* 初始化数据 */
    function initData()
    {
        $("#mapDialog").click(function () {
            //map name init single list
            if (editFlag !== true) {
                editFlag = true;

                getMapInfo_Dialog();
          } else {
                return;
            }

        });

        $("#MapSelect").on("change", function () {
            getMapInfo_Select();
        });
        $("#formCloseBtn").click(function () {
            editFlag = false;
            return;
        });
        $(".close").click(function () {
            editFlag = false;
            return;
        });

        get_DevStatus_Init();

        get_Dev_Init();

        get_WebAplist_Init();

        get_WebSystem_Init();

        getSSIDInfo();
    }

    function getSSIDInfo()
    {
        function get_SSIDDataSuc(data){
            var aTemplate=[];
            if(data&&data.ssidList&&data.ssidList.length>0){
                var wireLess_Status = getRcText("Wireless_Status").split(",");
                for(var i=0;i<data.ssidList.length;i++)
                {
                    var oTemp={};
                    oTemp.Enable = wireLess_Status[data.ssidList[i].status];
                    oTemp.Name  = data.ssidList[i].stName;
                    oTemp.SSID = data.ssidList[i].ssidName;
                    aTemplate.push(oTemp);
                }
                $("#wirelessService").SList ("refresh", aTemplate);
            }
        }

        function get_SSIDataFail(err){
            coosole.log(err);
        }

        var ssidOpt = {
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess: get_SSIDDataSuc,
            onFailed: get_SSIDataFail
        }

        Utils.Request.sendRequest( ssidOpt );
    }

     function initCanvas() {
            var BackgroundLayer = $("canvas").cocos("BackgroundLayer");
            var WallLayer = $("canvas").cocos("WallLayer");
            var ApLayer = $("canvas").cocos("ApLayer");
            var ApNode = $("canvas").cocos("ApNode");

            var HelloWorldScene = cc.Scene.extend({
                onEnter: function () {
                    this._super();
                    cc.director.setDisplayStats(false);
                    var bgLayer = new BackgroundLayer();
                    this.addChild(bgLayer);
                    g_BackgroundLayer = bgLayer;

                    var wallLayer = new WallLayer(false);
                    this.addChild(wallLayer);
                    g_WallLayer = wallLayer;

                    var apLayer = new ApLayer(false);
                    this.addChild(apLayer);
                    g_ApLayer = apLayer;
                }
            });

            cc.game.onStart = function () {
                cc.LoaderScene.preload([], function () {
                    cc.director.runScene(new HelloWorldScene());
                }, this);
            };
            cc.game.run("gameCanvas");
        }

    function _init ()
    {
        initCanvas();
        initGrid();
        initData();
        initForm();

    }

    function _resize(jParent)
    {
    }

    /* 销毁函数，需要销毁ajax请求和全局变量 */
    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form","Switch","Cocos"],
        "utils": ["Base", "Request"]
    });

}) (jQuery);
