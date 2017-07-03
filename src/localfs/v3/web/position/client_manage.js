(function ($) {
    var MODULE_NAME = "position.client_manage";
    var g_BackgroundLayer;
    var g_ClientLayer;
    var g_TimeLayer;
    var g_WallLayer;
    var g_ApLayer;
    var g_Hours;
    var g_scaleX = 1;
    var g_scaleY = 1;
    var g_oPara = null;
    var g_mapName = null;
    var g_mapAllList = [];

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
                Method: "getMapInfo",
                Param: {
                    devSN: FrameInfo.ACSN,
                },
                Return: ["mapName", "scale", "wallList", "apList"]
            })
        });
    }

    function getImage(mapName) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc/image/getMap",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                mapName: mapName
            })
        })
    }

    /*getMapwithindex*/

    function getMapIndex(mapName) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getMapIndex",
                Param: {
                    devSN: FrameInfo.ACSN,
                    mapName: mapName
                },
                Return: ["mapName", "index"]
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

    //获取终端列表与终端
    function getClientSiteAndList(mapName, time, startTime, endTime, pageNum, oFilter) {
        var pageSize = 10;
        pageNum = pageNum || 1;
        oFilter = oFilter || {};
        var Param = {
            devSN: FrameInfo.ACSN,
            mapName: mapName,
            time: time,
            startTime: startTime,//(s)
            endTime: endTime,
            startRowIndex: pageSize * (pageNum - 1),
            maxItem: pageSize
        }
        $.extend(Param, oFilter);
        return $.ajax({
            type: "POST",
            url: "/v3/wloc_clientread",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getClientSiteAndList",
                Param: Param
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

        //$("#client_slist").on('click', '.list-link', selectTime);
    }

    function initData() {
        getMapInfo().done(function (data, textStatus, jqXHR) {
            if (data.retCode !== 0) {
                console.log("getMapInfo error, retCode: " + data.retCode + " errorMessage: " + data.errorMessage);
                Frame.Msg.info("获取地图信息失败");
                return;
            }
            var mapAllList = data.data.mapList;
            mapAllList = mapAllList === "" ? [] : mapAllList;
            g_mapAllList = mapAllList;
            g_BackgroundLayer.clean();
            g_WallLayer.clean();
            g_ApLayer.clean();
            g_ClientLayer.clean();
            g_TimeLayer.clean();

            var mapInfoList = (data.data.mapList === "" ? [] : data.data.mapList);
            var mapList = {};
            var mapNameList = [];
            var mapIndex = [];

            mapAllList.forEach(function (map) {
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
                mapList[map] = {path: "", mapName: map};
                //return true;
            });
            mapInfoList.forEach(function (map) {
                mapList[map.mapName] = map;
            });
            //$("#history_hour").css({ "color": "green" });
            $("#MapSelect").singleSelect("InitData", mapNameList);
            if (g_mapName != "undefined") {
                $("#MapSelect").singleSelect("value", g_mapName);
            } else {
                $("#MapSelect").singleSelect("value", mapNameList[0]);
            }

            $(".period")[0].click();

            var mapname = mapNameList[0];
            if (g_mapName != "undefined") {
                mapname = g_mapName;
                for (var j = 0; j < mapNameList.length; j++) {
                    if (g_mapName == mapNameList[j]) {
                        break;
                    }
                }
            } else {
                mapname = mapNameList[0];
            }
            if (mapNameList.length == 0) {
                Frame.Msg.info("当前没有地图");
            } else {
                getImage(mapname).done(function (data) {
                    var apList = [];
                    if (data.retcode != 0) {
                        Frame.Msg.info("获取" + mapname + "图片失败");
                        return;
                    }
                    //var imgUrl = '/v3/wloc/image/' + FrameInfo.ACSN + '/' + index + '/background';
                    var imgbackground = new Image();
                    imgbackground.onload = function () {
                        g_scaleX = 800 / imgbackground.width;
                        g_scaleY = 450 / imgbackground.height;
                        var canvas1 = document.createElement('CANVAS');
                        canvas1.width = 800;
                        canvas1.height = 450;
                        var ctx = canvas1.getContext("2d");
                        ctx.drawImage(imgbackground, 0, 0, imgbackground.width, imgbackground.height, 0, 0, 800, 450);
                        var imagebase64 = canvas1.toDataURL("image/jpeg");
                        cc.loader.loadImg(imagebase64, {isCrossOrigin: false}, function (err, img) {
                            g_BackgroundLayer.setBackgroundImage(img);
                        });
                        for(var i = 0; i<mapAllList.length;i++){
                            if(mapAllList[i].mapName == mapname){
                                for(var j = 0; j<g_mapAllList[i].apList.length;j++){
                                    var obj = {};
                                    obj.apName = g_mapAllList[i].apList[j].apName;
                                    obj.XCord = g_mapAllList[i].apList[j].XCord;
                                    obj.YCord = g_mapAllList[i].apList[j].YCord;
                                    apList.push(obj);
                                }
                                break;
                            }
                        }
                        $.map(apList, function (map) {
                            map.XCord *= g_scaleX;
                            map.YCord = canvas1.height - map.YCord * g_scaleY;
                        })
                        g_ApLayer.drawApNodes(apList);
                        g_ClientLayer.startUpDate(function () {
                            var layer = this;
                            var curTime = 0;
                            var date = new Date();
                            var oTime = date.getTime();
                            var startTime = oTime - g_Hours * 60 * 60 * 1000;
                            var endTime = oTime;
                            getClientSiteAndList(mapname, curTime, startTime, endTime).done(function (data, textStatus, jqXHR) {
                                g_ClientLayer.clean();
                                g_TimeLayer.clean();
                                if (data.retCode != 0) {
                                    Frame.Msg.info("获取终端失败");
                                    return;
                                }
                                var clientList1 = data.result.oClientSiteInfo.ClientList || [];
                                if (data.result.oClientSiteInfo.retCode !== 0) {
                                    clientList1 = [];
                                }
                                $.map(clientList1, function (map) {
                                    map.XCord *= g_scaleX;
                                    map.YCord = canvas1.height - map.YCord * g_scaleY;
                                    if (map.XCord < 0) {
                                        map.XCord = 0;
                                    } else if (map.XCord > canvas1.width) {
                                        map.XCord = canvas1.width;
                                    }
                                    if (map.YCord < 0) {
                                        map.YCord = 0
                                    } else if (map.YCord > canvas1.height) {
                                        map.YCord = canvas1.height;
                                    }
                                })
                                g_ClientLayer.drawClientNodes(clientList1);
                                var clientList = data.result.oClientListInfo.ClientList || [];
                                if (data.result.oClientListInfo.retCode !== 0) {
                                    clientList = [];
                                }
                                $("#client_slist").SList("refresh", {
                                    data: clientList,
                                    total: data.result.oClientListInfo.rowCount
                                });
                            });
                        }, mapname);
                    };
                    imgbackground.src = data.image;
                })
            }

            $("#MapSelect").change(function () {
                var mapname = $("#MapSelect").val();
                //var mapUrl = (mapname in mapList ? "../../../" + mapList[mapname].path : "");
                g_BackgroundLayer.clean();
                g_ClientLayer.clean();
                g_TimeLayer.clean();
                g_WallLayer.clean();
                g_ApLayer.clean();
                getImage(mapname).done(function (data) {
                    var apList = [];
                    if (data.retcode != 0) {
                        Frame.Msg.info("获取" + mapname + "图片失败");
                        return;
                    }
                    var imgbackground = new Image();
                    imgbackground.onload = function () {
                        g_scaleX = 800 / imgbackground.width;
                        g_scaleY = 450 / imgbackground.height;
                        var canvas1 = document.createElement('CANVAS');
                        canvas1.width = 800;
                        canvas1.height = 450;
                        var ctx = canvas1.getContext("2d");
                        ctx.drawImage(imgbackground, 0, 0, imgbackground.width, imgbackground.height, 0, 0, 800, 450);
                        var imagebase64 = canvas1.toDataURL("image/jpeg");
                        cc.loader.loadImg(imagebase64, {isCrossOrigin: false}, function (err, img) {
                            g_BackgroundLayer.setBackgroundImage(img);
                        });
                        for(var i = 0; i<g_mapAllList.length;i++){
                            if(g_mapAllList[i].mapName == mapname){
                                for(var j = 0; j<g_mapAllList[i].apList.length;j++){
                                    var obj = {};
                                    obj.apName = g_mapAllList[i].apList[j].apName;
                                    obj.XCord = g_mapAllList[i].apList[j].XCord;
                                    obj.YCord = g_mapAllList[i].apList[j].YCord;
                                    apList.push(obj);
                                }
                                break;
                            }
                        }
                        $.map(apList, function (map) {
                            map.XCord *= g_scaleX;
                            map.YCord = canvas1.height - map.YCord * g_scaleY;
                        })
                        console.log(apList);
                        g_ApLayer.drawApNodes(apList);
                        updateList()
                    };
                    imgbackground.src = data.image;
                })
            });

        });
    }

    function onSelectClient(mapName, startTime, endTime) {
        getClientSiteAndList(mapName, 0, startTime, endTime).done(function (data, textStatus, jqXHR) {
            if (data.retCode !== 0) {
                console.log("getClientList error, retCode: " + data.retCode + " errorMessage: " + data.errorMessage);
                Frame.Msg.info("获取终端失败");
                return;//error
            }
            var clientList = data.result.oClientListInfo.ClientList || [];
            if (data.result.oClientListInfo.retCode !== 0) {
                clientList = [];
            }
            $("#client_slist").SList("refresh", {data: clientList, total: data.result.oClientListInfo.rowCount});
        });
    }

    function updateList(pageNum, oFliter) {
        g_ClientLayer.stopUpDate();
        var mapname = $("#MapSelect").val();
        var myCanvas = document.getElementById("gameCanvas");
        g_ClientLayer.startUpDate(function () {
            var curTime = 0;
            var date = new Date();
            var oTime = date.getTime();
            var startTime = oTime - g_Hours * 60 * 60 * 1000;
            var endTime = oTime;
            getClientSiteAndList(mapname, curTime, startTime, endTime, pageNum, oFliter).done(function (data, textStatus, jqXHR) {
                g_ClientLayer.clean();
                g_TimeLayer.clean();
                if (data.retCode != 0) {
                    Frame.Msg.info("获取终端失败");
                    return;
                }
                var clientList1 = data.result.oClientSiteInfo.ClientList || [];
                if (data.result.oClientSiteInfo.retCode !== 0) {
                    clientList1 = [];
                }
                $.map(clientList1, function (map) {
                    map.XCord *= g_scaleX;
                    map.YCord = myCanvas.height - map.YCord * g_scaleY;
                    if (map.XCord < 0) {
                        map.XCord = 0;
                    } else if (map.XCord > myCanvas.width) {
                        map.XCord = myCanvas.width;
                    }
                    if (map.YCord < 0) {
                        map.YCord = 0
                    } else if (map.YCord > myCanvas.height) {
                        map.YCord = myCanvas.height;
                    }
                })
                g_ClientLayer.drawClientNodes(clientList1);
                var clientList = data.result.oClientListInfo.ClientList || [];
                if (data.result.oClientListInfo.retCode !== 0) {
                    clientList = [];
                }
                $("#client_slist").SList("refresh", {data: clientList, total: data.result.oClientListInfo.rowCount});
            }, mapname);
        })
    }

    function initGrid() {
        var opt = {
            colNames: getRcText("CLIENTMAC_LIST"),
            showHeader: true,
            multiSelect: false,
            asyncPaging: true,
            pageSize: 10,
            onSearch: function (oFilter, oSorter) {
                if (oFilter != null) {
                    var oFilt = {
                        clientMac: oFilter.clientMac
                    };
                }
                updateList(0, oFilt);
            },
            onPageChange: function (pageNum, pageSize, oFilter) {
                if (oFilter != null) {
                    var oFilt = {
                        clientMac: oFilter.clientMac
                    };
                }
                updateList(pageNum, oFilt);
            },
            colModel: [
                {name: "clientMac", datatype: "String"}
            ],
            /*onToggle: {
             action: selectTime,
             jScope: $("#clientToggle")
             },*/
            buttons: []
        };
        $("#client_slist").SList("head", opt);
        // $("#client_slist .form-actions.top").hide();
    }

    function enterPage(e) {
        var mac = $(this).text();
        var mapName = $("#MapSelect").singleSelect("value");
        Utils.Base.redirect({np: 'position.client_trace', mapName: mapName, clientMac: mac});
    }

    function initEvent() {
        $("#client_slist").on('click', '.slist-row', enterPage);
        $(".period").click(function () {
            $(".period").css("color", "");
            $(this).css("color", "grey");

            var hours = $(this).attr("time");
            if(hours == ""){
                hours = 1/12;
            }
            var date = new Date();
            var curTime = date.getTime();
            var startTime = curTime - hours * 60 * 60 * 1000;
            var endTime = curTime;
            g_Hours = hours;

            var mapName = $("#MapSelect").singleSelect("value");

            onSelectClient(mapName, startTime, endTime);
        });
        /*'.slist-row',*/

    }

    function _init() {
        g_oPara = Utils.Base.parseUrlPara();
        g_mapName = decodeURI(g_oPara.mapName);
        initCanvas();
        //initData();
        initForm();
        initGrid();
        initEvent();
    }

    function _destroy() {
        g_ClientLayer.stopUpDate();
        g_TimeLayer.stopUpDate();
        g_oPara = null;
        g_mapName = null;
    }


    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Form", "SingleSelect", "DateTime", "Cocos"],
        "utils": ["Base"]
    });
})(jQuery);