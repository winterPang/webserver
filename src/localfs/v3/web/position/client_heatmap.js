/**
 * Created by Administrator on 2016/12/13.
 */
(function ($) {
    var MODULE_NAME = "position.client_heatmap";
    var g_scaleX = 1;
    var g_scaleY = 1;
    var g_stage = null;
    var timer = null;
    var g_areaList = [];
    var g_areaInfo = {};
    var g_width = null;
    var g_height = null;

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
                }
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
                Method: "getMapIndex",
                Param: {
                    devSN: FrameInfo.ACSN,
                    mapName: mapName
                }
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
                }
            })
        });
    }

    //获取区块中的终端
    function getAreaClient(mapName, areaName, areaType, startTime, endTime, pageNum, oFilter) {
        var pageSize = 10;
        pageNum = pageNum || 1;
        oFilter = oFilter || {};
        var Param = {
            devSN: FrameInfo.ACSN,
            mapName: mapName,
            areaName: areaName,
            areaType: areaType,
            startTime: startTime,
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
                Method: "getAreaClient",
                Param: Param
            })
        });
    }

    function getRcText(sRcId) {
        return Utils.Base.getRcString("wloc_rc", sRcId);
    }

    function initEvent() {
        $("#MapSelect").change(function () {
            clearInterval(timer);
            initData();
        });
        getMapInfo().done(function (data, textStatus, jqXHR) {
            if (data.retCode !== 0) {
                console.log("getMapInfo error, retCode: " + data.retCode + " errorMessage: " + data.errorMessage);
                Frame.Msg.info("获取地图信息失败");
                return;
            }
            var mapAllList = data.data.mapList;
            mapAllList = mapAllList === "" ? [] : mapAllList;
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
            $("#MapSelect").singleSelect("InitData", mapNameList);
            $("#MapSelect").singleSelect("value", mapNameList[0]);
            initData();
        })
        $("#layout_center").scroll(function () {
            var scrollTop = $(this).scrollTop();
            displayRail(scrollTop);
        })
        $(".btn.btn-primary,.close").click(function () {
            var mapName = $("#MapSelect").val();
            timer = setInterval(function () {
                updateEchart(mapName, 0)
            }, 1000);
        })
    }

    function initData() {
        var mapName = $("#MapSelect").val();
        var canvas = $("#canvas");
        var railCanvas = document.getElementById("rail")
        var bgCanvas = document.getElementById("bgCanvas");
        var dis = 1;
        var curTime = 0;
        var areaList = [];
        var aRail = [];
        g_stage.clear();
        var scene = new JTopo.Scene(g_stage);
        if (mapName == null) {
            Frame.Msg.info("当前没有地图");
        } else {
            getImage(mapName).done(function (data) {
                if (data.retcode != 0) {
                    Frame.Msg.info("获取" + mapName + "图片失败");
                    return;
                }
                var imgbackground = new Image();
                imgbackground.onload = function () {
                    g_width = imgbackground.width;
                    g_height = imgbackground.height;
                    dis = canvas.width() / imgbackground.width;
                    bgCanvas.height = imgbackground.height * dis;
                    bgCanvas.width = canvas.width();
                    railCanvas.width = bgCanvas.width;
                    railCanvas.height = bgCanvas.height;
                    //canvas.height(bgCanvas.height);
                    g_scaleX = dis;
                    g_scaleY = dis;
                    scene.background = data.image;
                    scene.mode = 'select';
                    scene.areaSelect = false;
                    updateEchart(mapName, curTime);
                    timer = setInterval(function () {
                        updateEchart(mapName, curTime)
                    }, 1000);
                    getMapInfo().done(function (data) {
                        if (data.retCode !== 0) {
                            Frame.Msg.info("获取地图信息失败");
                            return;
                        }
                        var mapAllList = data.data.mapList;
                        for (var i = 0; i < mapAllList.length; i++) {
                            if (mapName == mapAllList[i].mapName) {
                                areaList = mapAllList[i].areaList;
                            }
                        }
                        $.map(areaList, function (map) {
                            if (map.areaType == "rail") {
                                for (var i = 0; i < map.nodes.length; i++) {
                                    map.nodes[i].xPos *= dis;
                                    map.nodes[i].yPos *= dis;
                                }
                                aRail.push(map);
                            }
                        });
                        g_areaList = aRail;
                        displayRail();
                    });
                };
                imgbackground.src = data.image;
            })
        }
    }

    function updateEchart(mapName, curTime) {
        var oOpacity = 1;
        var myCanvas = document.getElementById("bgCanvas");
        var oWidth = myCanvas.width;
        var oHeight = myCanvas.height;
        getClientNode(mapName, curTime).done(function (data, textStatus, jqXHR) {
            if (data.retCode == -1) {
                Frame.Msg.info("获取终端失败");
                return;
            }
            var clientList = data.result.ClientList || [];
            var heatData = clientList.reduce(function (res, cur) {
                if (cur.XCord < 0) {
                    cur.XCord = 0;
                } else if (cur.XCord > g_width) {
                    cur.XCord = g_width;
                }
                if (cur.YCord < 0) {
                    cur.YCord = 0
                } else if (cur.YCord > g_height) {
                    cur.YCord = g_height;
                }
                res.push([cur.XCord * g_scaleX, (cur.YCord * g_scaleY), 0.1]);
                return res;
            }, []);
            if (heatData.length == 0) {
                heatData = [[200, 200, 0.1]];
                oOpacity = 0;
            }
            var option = {
                width: oWidth,
                height: oHeight,
                title: {
                    text: ''
                },
                series: [
                    {
                        type: 'heatmap',
                        data: heatData,
                        hoverable: false,
                        gradientColors: [{
                            offset: 0.2,
                            color: 'blue'
                        }, {
                            offset: 0.4,
                            color: 'green'
                        }, {
                            offset: 0.6,
                            color: 'yellow'
                        }, {
                            offset: 0.8,
                            color: 'orange'
                        }, {
                            offset: 1,
                            color: 'red'
                        }],
                        minAlpha: 0.3,
                        valueScale: 0.5,
                        opacity: oOpacity
                    }
                ]
            };

            $("#eChart").echart("init", option, {});
        });
    }

    function initGrid() {
        var opt = {
            colNames: getRcText("CLIENT_INFO"),
            multiSelect: false,
            showHeader: true,
            asyncPaging: true,
            pageSize: 10,
            onSearch: function (oFilter, oSorter) {
                if (oFilter != null) {
                    var oFilt = {
                        clientMac: oFilter.clientMac,
                    };
                }
                updateList(g_areaInfo, 0, oFilt);
            },
            onPageChange: function (pageNum, pageSize, oFilter) {
                if (oFilter != null) {
                    var oFilt = {
                        clientMac: oFilter.clientMac,
                    };
                }
                updateList(g_areaInfo, pageNum, oFilt);
            },
            colModel: [
                {name: "clientMac", datatype: "String", width: 600},
                {name: "XCord", datatype: "String", width: 500},
                {name: "YCord", datatype: "String", width: 500}
            ],
            buttons: []
        };
        $("#client_slist").SList("head", opt);
    }

    function displayRail(scroll) {
        var mapName = $("#MapSelect").val();
        var rail = document.getElementById("rail");
        var ctx = rail.getContext("2d");
        var railX = getOffset(rail).left;
        var railY = getOffset(rail).top;
        var flag = 0;
        var flag1 = 0;
        var flag2 = 0;
        var scrollTop = scroll || 0;
        rail.onmousemove = function (e) {
            var event = e || window.e;
            flag = 0;
            flag1 = 0;
            flag2 = 0;
            var mouseX = event.clientX - railX;
            var mouseY = event.clientY - railY;
            var pt = {
                xPos: mouseX,
                yPos: mouseY
            };
            clearSence(rail, ctx);
            for (var k = 0; k < g_areaList.length; k++) {
                if (isInsidePolygon(pt, g_areaList[k].nodes)) {
                    flag++;
                    flag2 = 1;
                    drawPoly(rail, ctx, g_areaList[k].nodes);
                    if (flag == 1) {
                        flag1 = 1;
                        g_areaInfo = {
                            mapName: mapName,
                            areaName: g_areaList[k].areaName,
                            areaType: g_areaList[k].areaType,
                            startTime: new Date().getTime() - 3000000,
                            endTime: new Date().getTime()
                        };
                    }
                }
            }

            $("#rail").click(function () {
                if (flag1 == 1 && flag2 == 1) {
                    clearInterval(timer);
                    $("#areaName").html(g_areaInfo.areaName);
                    Utils.Base.openDlg(null, {}, {scope: $("#areaForm"), className: "modal-large"});
                    getAreaClient(g_areaInfo.mapName, g_areaInfo.areaName, g_areaInfo.areaType, g_areaInfo.startTime, g_areaInfo.endTime, 1).done(function (data) {
                        if (data.retCode != 0) {
                            Frame.Msg.info("获取区域终端失败");
                            return;
                        }
                        var clientList = data.result.ClientList;
                        //clientList = [{mac:11-22-33-44-55-66,XCord:210,YCord:100},{mac:22-33-44-55-66-77,XCord:215,YCord:122}]
                        $("#client_slist").SList("refresh", {data: clientList, total: data.result.rowCount});//data.data.rowCount
                    })
                }
            });
        };
    }

    function updateList(obj, pageNum, oFilter) {
        var mapName = $("#MapSelect").val();
        getAreaClient(mapName, obj.areaName, obj.areaType, obj.startTime, obj.endTime, pageNum, oFilter).done(function (data) {
            if (data.retCode != 0) {
                Frame.Msg.info("获取区域终端失败");
                return;
            }
            var clientList = data.result.ClientList;
            $("#client_slist").SList("refresh", {data: clientList, total: data.result.rowCount});
        })
    }

    function clearSence(canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawPoly(canvas, ctx, arr) {
        ctx.beginPath();

        ctx.fillStyle = 'rgba(222, 221, 221, 0.8)';

        ctx.moveTo(arr[0].xPos, arr[0].yPos);

        for (var i = 1; i < arr.length; i++) {

            ctx.lineTo(arr[i].xPos, arr[i].yPos);

        }
        ctx.closePath();

        ctx.fill();

        ctx.lineWidth = 5;

        //ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';

        //ctx.stroke();
    }

    function isInsidePolygon(pt, poly) {
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].yPos <= pt.yPos && pt.yPos < poly[j].yPos) || (poly[j].yPos <= pt.yPos && pt.yPos < poly[i].yPos))
            && (pt.xPos < (poly[j].xPos - poly[i].xPos) * (pt.yPos - poly[i].yPos) / (poly[j].yPos - poly[i].yPos) + poly[i].xPos)
            && (c = !c);
        return c;
    }

    function getOffsetSum(ele) {
        var top = 0, left = 0;
        while (ele) {
            top += ele.offsetTop;
            left += ele.offsetLeft;
            ele = ele.offsetParent;
        }
        return {
            top: top,
            left: left
        }
    }

    function getOffsetRect(ele) {
        var box = ele.getBoundingClientRect();
        var body = document.body,
            docElem = document.documentElement;
        //获取页面的scrollTop,scrollLeft(兼容性写法)
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
            scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        var clientTop = docElem.clientTop || body.clientTop,
            clientLeft = docElem.clientLeft || body.clientLeft;
        var top = box.top + scrollTop - clientTop,
            left = box.left + scrollLeft - clientLeft;
        return {
            //Math.round 兼容火狐浏览器bug
            top: Math.round(top),
            left: Math.round(left)
        }
    }

    function getOffset(ele) {
        if (ele.getBoundingClientRect) {
            return getOffsetRect(ele);
        } else {
            return getOffsetSum(ele);
        }
    }

    function _init() {
        var myCanvas = document.getElementById("bgCanvas");
        var stage = new JTopo.Stage(myCanvas);
        g_stage = stage;
        initEvent();
        initGrid();
    }

    function _destroy() {
        clearInterval(timer);
        g_scaleX = null;
        g_scaleY = null;
        g_stage = null;
        timer = null;
        g_width = null;
        g_height = null;
        g_areaList = [];
        g_areaInfo = {};
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SingleSelect", "Form", "Echart", "Cocos", "SList"],
        "utils": ["Base", "Timer", "Device"]
    });
})(jQuery);