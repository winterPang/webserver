(function ($) {
    var MODULE_NAME = "city_position.client_manage";
    var g_BackgroundLayer;
    var g_ClientLayer;
    var g_TimeLayer;
    var g_WallLayer;
    var g_ApLayer;

    function getMapImage() {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc/getMapFile",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getMapallurl",
                Param: {
                    devSN: FrameInfo.ACSN
                },
                Return: ["url", "mapName", "filename"]
            })
        });
    }

    function getMapInfo() {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getMapwithindex",
                Param: {
                    devSN: FrameInfo.ACSN,
                },
                Return: ["mapName", "scale", "wallList", "apList","index"]
            })
        });
    }

    function getMapIndex(mapName) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getindex",
                Param: {
                    devSN: FrameInfo.ACSN,
                    mapName: mapName
                },
                Return: ["mapName","index"]
            })
        });
    }

    function getClientNode(mapName, time) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc_clientread",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getClientSite",
                Param: {
                    devSN: FrameInfo.ACSN,
                    mapName: mapName,
                    time: time //(s)
                },
                result: ["clientMac", "XCord", "YCord", "clientStatus"]
            })
        });
    }

    function getClientList(mapName, startTime, endTime) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc_clientread",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getClientList",
                Param: {
                    devSN: FrameInfo.ACSN,
                    mapName: mapName,
                    startTime: startTime,//(s)
                    endTime: endTime
                },
                result: ["clientMac"]
            })
        });
    }

    function getClientTime(mapName, clientMac, startTime, endTime, nInterval) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc_clientread",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getClientTrack",
                Param: {
                    devSN: FrameInfo.ACSN,
                    mapName: mapName,
                    clientMac: clientMac,
                    startTime: startTime,
                    endTime: endTime,
                    intervalTime: nInterval

                },
                result: ["time", "XCord", "YCord", "clientStatus"]
            })
        });
    }

    function getApList() {
        return $.ajax({
            type: "GET",
            url: MyConfig.path + "/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
            contentType: "application/json",
            dataType: "json",
        });
    }

    function getRcText(sRcId) {
        return Utils.Base.getRcString("wloc_rc", sRcId);
    }


    function onClick() {
        var sId = $(this).attr("id").split("_")[1];
        switch (sId) {
            case "Pie":
                $("#filter_PieMac").toggle();
                return false;
                break;
            default:
                break;
        }
    }

    function initCanvas() {
        var BackgroundLayer = $("canvas").cocos("BackgroundLayer");
        var WallLayer = $("canvas").cocos("WallLayer");
        var ApLayer = $("canvas").cocos("ApLayer");
        var ClientLayer = $("canvas").cocos("ClientLayer");
        var TimeLayer = $("canvas").cocos("TimeLayer");

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

                var apLayer = new ApLayer();
                this.addChild(apLayer);
                g_ApLayer = apLayer;

                var clientLayer = new ClientLayer();
                this.addChild(clientLayer);
                g_ClientLayer = clientLayer;

                var timeLayer = new TimeLayer();
                this.addChild(timeLayer);
                g_TimeLayer = timeLayer;
                initData();
            }
        });

        cc.game.onStart = function () {
            cc.LoaderScene.preload([], function () {
                cc.director.runScene(new HelloWorldScene());
            }, this);
        };
        cc.game.run("gameCanvas");
    }


    function initForm() {
        /*����MAC��ַ��ѯ�Ĵ���*/
        $("#filter_Pie").on("click", onClick);
        //$("#filter_PieDate").click(onSelected);
        $("#filter_PieDateRemove").click(function () {
            //Utils.Pages.closeWindow(Utils.Pages.getWindow($("#filter_PieMac")));
            $("#f_datetime input").val("");
            $("#t_datetime input").val("");
            $("#f_clocktime input").val("");
            $("#t_clocktime input").val("");
            $("#filter_PieMac").hide();
        });
        $("#refreshPie").on("click", function () {
            initData();
        });

        $("#client_slist").on('click', '.list-link', selectTime);
    }

    function initData() {
        getMapInfo().done(function (data, textStatus, jqXHR) {
            if (data.retCode !== 0) {
                console.log("getMapInfo error, retCode: " + data.retCode + " errorMessage: " + data.errorMessage);
                return;//�ִ�
            }
            var mapAllList = data.data.maplist;
            mapAllList = mapAllList === "" ? [] : mapAllList;

            if (data.data.retCode !== 0) {
                return;
            }
            g_BackgroundLayer.clean();
            g_WallLayer.clean();
            g_ApLayer.clean();
            g_ClientLayer.clean();
            g_TimeLayer.clean();

            var mapInfoList = (data.data.maplist === "" ? [] : data.data.maplist);
            var mapList = {};
            var mapNameList = [];
            var mapIndex = [];

            mapAllList.forEach(function(map){
                mapIndex.push(map.index);
            });
            mapAllList.forEach(function (map) {
                map.mapName = map.mapName.split(",")[0];
                if (map.mapName == "") {
                    return true;//continue
                }
                mapNameList.push(map.mapName);

            });
            mapNameList.forEach(function (map) {
                mapList[map] = { path: "", mapName: map };
                //return true;
            });
            mapInfoList.forEach(function (map) {
                mapList[map.mapName] = map;
            });
            $("#history_hour").css({ "color": "green" });
            $("#MapSelect").singleSelect("InitData", mapNameList);
            $("#MapSelect").singleSelect("value", mapNameList[0]);

            $(".period")[0].click();

            var mapname = mapNameList[0];
            var index = mapIndex[0];
            //var mapPath = (mapname + "_woshiyigedashuaige" in mapList ? "../../../" + mapList[mapname + "_woshiyigedashuaige"].path : "../position/cocos/res/whiteBoard.png");
            var imgUrl = '/v3/wloc/image/' + FrameInfo.ACSN + '/' + index + '/background';
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
            //g_BackgroundLayer.initBackgroundImage(mapPath);

            //$(".period").click(onSelectClient(/*interval,mapName,nowtime*/));///////


            g_ClientLayer.startUpDate(function () {
                var layer = this;
                var date = new Date();
                //var curTime = date.getTime()/1000;
                var curTime = 0;
                getClientNode(mapname, curTime).done(function (data, textStatus, jqXHR) {
                    g_ClientLayer.clean();
                    g_TimeLayer.clean();
                    if (data.retCode == -1) {
                        return;
                    }
                    var clientList = data.result || [];
                    var clientMacList = [];
                    clientList.forEach(function (client) {
                        clientMacList.push(client.clientMac);
                    });
                    $("#ClientSelect").singleSelect("InitData", clientMacList);
                    g_ClientLayer.drawClientNodes(clientList);
                    /*
                     if (clientMacList.lenght > 0){//不为空再画图
                     g_ClientLayer.clean();
                     g_TimeLayer.clean();
                     g_ClientLayer.drawClientNodes(clientList);
                     }
                     */
                });
            }, mapname);

            $("#MapSelect").change(function () {
                var mapname = $("#MapSelect").val();
                //var mapUrl = (mapname in mapList ? "../../../" + mapList[mapname].path : "");
                getMapIndex(mapname).done(function (data, textStatus, jqXHR){
                g_BackgroundLayer.clean();
                g_ClientLayer.clean();
                g_TimeLayer.clean();
                g_WallLayer.clean();
                g_ApLayer.clean();
                    var imgUrl = '../../../v3/wloc/image/' + FrameInfo.ACSN + '/' + data.index + '/background';
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

                    //g_BackgroundLayer.initBackgroundImage(mapUrl);
                    g_ClientLayer.startUpDate(function () {
                        var layer = this;
                        var date = new Date();
                        var curTime = date.getTime() / 1000;
                        getClientNode(mapname, curTime).done(function (data, textStatus, jqXHR) {
                            g_ClientLayer.clean();
                            g_TimeLayer.clean();
                            if (data.retCode == -1) {
                                return;
                            }
                            var clientList = data.result || [];
                            var clientMacList = [];
                            clientList.forEach(function (client) {
                                clientMacList.push(client.clientMac);
                            });
                            $("#ClientSelect").singleSelect("InitData", clientMacList);
                            layer.clean();
                            layer.drawClientNodes(clientList);

                        });

                    }, mapname);
                    mapAllList.forEach(function (map) {
                        if (map.mapName == mapname) {
                            var wallList = map.wallList;
                            g_WallLayer.drawWallNodes(wallList);

                            var apList = map.apList;
                            g_ApLayer.drawApNodes(apList);
                        }
                    });
                    $('.period').css("color", "");
                    $('.period[time=1]').css("color", "grey");
                    var hours = 1;
                    var date = new Date();
                    var curTime = date.getTime();
                    var startTime = curTime - hours * 60 * 60 * 1000;
                    var endTime = curTime;
                    var mapName = $("#MapSelect").singleSelect("value");
                    onSelectClient(mapName, startTime, endTime);
                    g_ClientLayer.startUpDate(function () {
                        var layer = this;
                        var date = new Date();
                        //var curTime = date.getTime()/1000;
                        var curTime = 0;
                        getClientNode(mapName, curTime).done(function (data, textStatus, jqXHR) {
                            g_ClientLayer.clean();
                            g_TimeLayer.clean();
                            if (data.retCode == -1) {
                                return;
                            }
                            var clientList = data.result || [];
                            var clientMacList = [];
                            clientList.forEach(function (client) {
                                clientMacList.push(client.clientMac);
                            });
                            $("#ClientSelect").singleSelect("InitData", clientMacList);
                            g_ClientLayer.drawClientNodes(clientList);
                            /*
                             if (clientMacList.lenght > 0){//不为空再画图
                             g_ClientLayer.clean();
                             g_TimeLayer.clean();
                             g_ClientLayer.drawClientNodes(clientList);
                             }
                             */
                        });
                    }, mapName);
                });

            });

        });
    }

    function onSelectClient(mapName, startTime, endTime) {
        //var startTime = nowtime - interval;
        //var endTime = nowtime;
        //$(".period").css({"color" : ""});
        //$(this).css({"color":"green"});
        /*
        var clientList = [
            { clientMac: "0-0-1" },
            { clientMac: "0-0-2" },
            { clientMac: "0-0-3" },
            { clientMac: "0-0-4" },
            { clientMac: "0-0-5" }
        ];
        var clientMacList = [];
        clientList.forEach(function (client) {
            clientMacList.push(client.clientMac);
        });
        $("#client_slist").SList("refresh", clientList);
        */
        getClientList(mapName,startTime, endTime).done(function(data, textStatus, jqXHR){
            if(data.retCode !== 0){
               console.log("getClientList error, retCode: " + data.retCode + " errorMessage: " + data.errorMessage);
               return;//error
            }
            var clientList = data.result || [];
            var clientMacList = [];
            clientList.forEach(function(client){
                clientMacList.push(client.clientMac);
            });
            $("#client_slist").SList ("refresh", clientList);
        });
        

    }

    function showOldClientPath() {
        var detTime = $("input[name=TimeSelect]:checked").attr("value");//hours
        console.log(detTime);
        detTime = detTime * 60 * 60 * 1000;

        var date = new Date();
        var startTime = date.getTime();
        var endTime = startTime + detTime;

        var mapName = $("#MapSelect").singleSelect("value");
        var nInterval = $("#footer_interval").val();

        g_ClientLayer.clean();
        g_ClientLayer.stopUpDate();
        g_TimeLayer.clean();
        g_TimeLayer.stopUpDate();
        
        /*
        g_TimeLayer.drawClientTimeNodes([]);
        
        var XCord = 100;
        var YCord = 100;
        
        g_TimeLayer.startUpDate(function (){
            getClientNode(mapName, 0).done(function(data, textStatus, jqXHR){
                if (data.retCode !== 0){
                    return;//粗错
                }
                
            });
            XCord += 20;
            YCord += 20;
            console.log("XCord: " + XCord);
            console.log("YCord: " + YCord);
            g_TimeLayer.updateCallback({ time: 10, XCord: XCord, YCord: YCord, clientMac: "0-0-0-0" });
            //return { time: 10, XCord: XCord, YCord: YCord, clientMac: "0-0-0-0" };
        }, 5); 
        */
        /*
        var mapName, clientMac, startTime, endTime, nInterval;
        getClientTime(mapName, clientMac, startTime, endTime, nInterval).done(function (data, textStatus, jqXHR){
            if (data.retCode !== 0) {
                return ;//粗错
            }
            
            var clientArr = data.result;
            g_ClientLayer.clean();
            g_ClientLayer.stopUpDate();
            g_TimeLayer.clean();
            g_TimeLayer.stopUpDate();
            g_TimeLayer.drawClientTimeNodes(clientArr || []);
            
        });
        */
    }


    function selectTime(oRowdata, sName) {

        var jFormChat = $("#toggle_form");
        var pageName = sName;
        if (sName == "add") {
            console.log("add");
        }
        else {

            console.log("pageName");
            $("#chatname", jFormChat).attr("readonly", true);
            function showOldClientPath() {
                console.log(oRowdata);
                var detTime = $("input[name=TimeSelect]:checked").attr("value");//hours
                console.log(detTime);
                detTime = detTime * 60 * 60 * 1000;

                var date = new Date();
                var endTime = date.getTime(); 
                var startTime = (endTime - detTime);

                var mapName = $("#MapSelect").singleSelect("value");
                var nInterval = $("#footer_interval").val() * 1000;
                var clientMac = oRowdata.clientMac;
                getClientTime(mapName, clientMac, parseInt(startTime), parseInt(endTime), parseInt(nInterval)).done(function (data, textStatus, jqXHR) {
                    if (data.retCode !== 0) {
                        return;//粗错
                    }

                    var clientArr = data.result;
                    g_ClientLayer.clean();
                    g_ClientLayer.stopUpDate();
                    g_TimeLayer.clean();
                    g_TimeLayer.stopUpDate();
                    
                    g_TimeLayer.drawClientTimeNodes(clientArr || []);

                    g_TimeLayer.startUpDate(function () {
                        getClientNode(mapName, 0).done(function (data, textStatus, jqXHR) {
                            if (data.retCode !== 0) {
                                return;//粗错
                            }

                            var clientList = data.result || [];
                            for (var i = 0; i < clientList.length; ++i) {
                                var client = clientList[i];
                                if (clientMac == client.clientMac) {
                                    g_TimeLayer.updateCallback({ time: 10, XCord: client.XCord, YCord: client.YCord, clientMac: clientMac });
                                    return;
                                }
                            }
                            /*
                            clientList.forEach(function (client) {
                                if (clientMac == client.clientMac) {
                                    g_TimeLayer.updateCallback({ time: 10, XCord: client.XCord, YCord: client.YCord, clientMac: clientMac });
                                    return;
                                }
                            });
                            */
                            
                            //1 get cur XCord YCord
                            //2. random
                            
                            var curPos = g_TimeLayer.actionClientNode.getPosition();
                            var maxLen = 30;//px
                            //curPos.x += Math.random()*maxLen;
                            curPos.x += Math.random()*maxLen * (Math.random() > 0.5 ? 1 : -1);
                            curPos.y += Math.random()*maxLen * (Math.random() > 0.5 ? 1 : -1);
                            g_TimeLayer.updateCallback({ time: 10, XCord: curPos.x, YCord: curPos.y, clientMac: clientMac });
                            
                            
                            
                            
                        });
                        //g_TimeLayer.updateCallback({ time: 10, XCord: 10, YCord: 10, clientMac: "0-0-0-0" });
                    }, 5);

                });

            }

            jFormChat.form("init", "edit", { "btn_apply": showOldClientPath, "btn_cancel": function () { } });
            /*
            jFormChat.form ("init", "edit", {"btn_apply": function(param){
                console.log(param);
                console.log("show");
                //write code here;
                showOldClientPath();
            }, "btn_cancel":function(){
                g_TimeLayer.stopUpDate();
            }});
            */

            jFormChat.form("updateForm", oRowdata);
            $("input[type=text]", jFormChat).each(function () {
                Utils.Widget.setError($(this), "");
            });
            $("#client_slist .form-actions.top").remove();
           /* $("#client_slist .btn.btn-apply").removeClass("disabled").parent("div").removeClass("hide");*/
            $("#client_slist .btn.btn-apply").html((getRcText("STOP_BEGIN").split(",")[0]));
            $("#client_slist .btn.btn-cancel").html((getRcText("STOP_BEGIN").split(",")[1]));
        }
        return false;
    }

    function initGrid() {
        var opt = {
            colNames: getRcText("CLIENTMAC_LIST"),
            showHeader: true,
            multiSelect: false,
            pageSize: 8,
            colModel: [
                { name: "clientMac", datatype: "String" }
            ],
            onToggle: {
                action: selectTime,
                jScope: $("#clientToggle")
            },
            buttons:[
                
            ]
        };
        $("#client_slist").SList("head", opt);
       // $("#client_slist .form-actions.top").hide();
    }

    function _init() {

        initCanvas();
        //initData();
        initForm();
        initGrid();



        $(".period").click(function () {
            $(".period").css("color", "");
            $(this).css("color", "grey");

            var hours = $(this).attr("time");

            var date = new Date();
            var curTime = date.getTime();
            var startTime = curTime - hours * 60 * 60 * 1000;
            var endTime = curTime;

            var mapName = $("#MapSelect").singleSelect("value");

            onSelectClient(mapName, startTime, endTime);
        });
        
        //$(".period")[0].click();

    }

    function _destroy() {
        console.log("destroy");
        g_ClientLayer.stopUpDate();
        g_TimeLayer.stopUpDate();
    }


    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Form", "SingleSelect", "DateTime", "Cocos"],
        "utils": ["Base"]
    });
    /**
     * Created by Administrator on 2016/1/17.
     */
})(jQuery);