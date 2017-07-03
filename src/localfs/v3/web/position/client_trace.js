/**
 * Created by Administrator on 2016/12/13.
 */
(function ($) {
    var MODULE_NAME = "position.client_trace";
    var g_oPara;
    var g_mapName;
    var g_clientMac;
    var g_scaleX = 1;
    var g_scaleY = 1;
    var g_stage = null;
    var g_scene = null;
    var g_timer = null;

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
                Return: ["mapName", "scale", "wallList", "apList"]
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
                },
                Return: ["mapName", "index"]
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

    function getClientTime(mapName, clientMac, startTime, endTime, days, nInterval) {
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
                    days: days,
                    intervalTime: nInterval

                },
                result: ["time", "XCord", "YCord", "clientStatus"]
            })
        });
    }

    function getClientNode(mapName, clientMac, time) {
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
                    clientMac: clientMac,
                    time: time //(s)
                },
                result: ["clientMac", "XCord", "YCord", "clientStatus"]
            })
        });
    }

    function disDate(startTime, endTime) {
        var days = 0;
        var startDate = new Date(startTime);
        var endDate = new Date(endTime);
        var startYear = startDate.getFullYear();
        var startMonth = startDate.getMonth() + 1;
        var startDay = startDate.getDate();
        var endYear = endDate.getFullYear();
        var endMonth = endDate.getMonth() + 1;
        var endDay = endDate.getDate();
        if (startYear == endYear) {
            if (startMonth == endMonth) {
                days = endDay - startDay;
            } else {
                switch (startMonth) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        days = 31 - startDay + endDay;
                        break;
                    case 2:
                        if ((startYear % 4 == 0) && (startYear % 100 != 0 || startYear % 400 == 0)) {
                            days = 29 - startDay + endDay;
                        } else {
                            days = 28 - startDay + endDay;
                        }
                        break;
                    default:
                        days = 30 - startDay + endDay;
                        break;
                }
            }
        } else {
            days = 31 - startDay + endDay;
        }
        return days;
    }

    function showOldClientPath() {
        var myCanvas = document.getElementById("gameCanvas");
        var nInterval = $("#footer_interval").val();
        var datetimerange = $('input,#datetimerange').val();
        var startTime;
        var endTime;
        if (datetimerange === "") {
            var date = new Date();
            endTime = date.getTime();
            startTime = (endTime - 3600000);
        } else {
            startTime = (new Date(datetimerange.split("-")[0])).getTime();
            endTime = (new Date(datetimerange.split("-")[1])).getTime();
        }
        var mapName = g_mapName;
        var clientMac = g_clientMac;
        var days = disDate(startTime, endTime);
        getClientTime(mapName, clientMac, parseInt(startTime), parseInt(endTime), days, parseInt(nInterval)).done(function (data, textStatus, jqXHR) {
            if (data.retCode !== 0) {
                Frame.Msg.info("获取历史轨迹失败");
                return;//粗错
            }

            var clientArr = data.result.clients;
            g_scene.clear();
            $.map(clientArr, function (map) {
                map.XCord *= g_scaleX;
                map.YCord *= g_scaleY;
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
            });
            $.each(clientArr, function (ap, apInfo) {
                var posX = apInfo.XCord;
                var posY = apInfo.YCord;
                var node = new JTopo.CircleNode();
                node.radius = 5;
                node.fillColor = "78,193,178";
                //node.setImage('../position/cocos/res/client.png', true);
                node.setLocation(posX, posY);
                node.dragable = false;
                g_scene.add(node);
            });
        });
    }

    function clientRealTime() {
        var myCanvas = document.getElementById("gameCanvas");
        if(g_timer){
            clearInterval(g_timer);
            g_timer = null;
        }
        g_timer = setInterval(function () {
            getClientNode(g_mapName, g_clientMac, 0).done(function (data) {
                if (data.retCode != 0) {
                    Frame.Msg.info("获取实时轨迹失败");
                    return;
                }
                var clientArr = data.result.ClientList;
                g_scene.clear();
                $.map(clientArr, function (map) {
                    map.XCord *= g_scaleX;
                    map.YCord *= g_scaleY;
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
                });
                $.each(clientArr, function (ap, apInfo) {
                    var posX = apInfo.XCord;
                    var posY = apInfo.YCord;
                    var node = new JTopo.CircleNode();
                    node.radius = 5;
                    node.fillColor = "78,193,178";
                    node.setLocation(posX, posY);
                    node.dragable = false;
                    g_scene.add(node);
                });
            })
        }, 1000)
    }

    function initData() {
        var mapname = g_mapName;
        var myCanvas = document.getElementById("gameCanvas");
        var canvasContain = $("#canvas");
        var disX = 1;
        getImage(mapname).done(function (data) {
            if (data.retcode != 0) {
                Frame.Msg.info("获取"+mapname+"图片失败");
                return;
            }
            //var imgUrl = '../../../v3/wloc/image/' + FrameInfo.ACSN + '/' + data.index + '/background';
            var imgbackground = new Image();
            imgbackground.onload = function () {
                disX = canvasContain.width() / imgbackground.width;
                myCanvas.width = canvasContain.width();
                myCanvas.height = disX * imgbackground.height;
                canvasContain.height(myCanvas.height);
                g_scaleX = disX;
                g_scaleY = disX;
                var stage = new JTopo.Stage(myCanvas);
                var scene = new JTopo.Scene(stage);
                g_stage = stage;
                g_scene = scene;
                scene.background = data.image;
                scene.mode = 'select';
                scene.areaSelect = false;
                clientRealTime();
            };
            imgbackground.src = data.image;
        })
    }

    function timetoString(oTime) {
        var timestring = '';
        var year = oTime.getFullYear();
        var month = (oTime.getMonth() + 1).toString();
        var day = (oTime.getDate()).toString();
        var hours = (oTime.getHours()).toString();
        var minutes = (oTime.getMinutes()).toString();
        var seconds = (oTime.getSeconds()).toString();
        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }
        if (hours.length == 1) {
            hours = "0" + hours;
        }
        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }
        if (seconds.length == 1) {
            seconds = "0" + seconds;
        }
        timestring = '' + year + '-' + month + '-' + day +
            ' ' + hours + ':' + minutes + ':' + seconds;

        return timestring;
    };

    function initEvent() {
        $("#refresh").on("click", function () {
            Utils.Base.refreshCurPage();
        })
        $("#back").on("click", function () {
            Utils.Base.redirect({np: 'position.client_manage', mapName: g_mapName});
        })
        $("#slide").click(function () {
            if ($(this).hasClass("clickUp")) {
                $("#err_footer_interval").css("display","none");
                $(this).removeClass("clickUp").addClass("clickDown");
                $(".client_history").animate({height: "220px", bottom: "-220px"});
            } else {
                $(this).removeClass("clickDown").addClass("clickUp");
                $(".client_history").animate({height: "0px", bottom: "0"});
            }
        });
        $(".history_btn").on("click", function () {
            var oInterval = $("#footer_interval");
            if(Number(oInterval.val()) < 10){
                $("#err_footer_interval").css("display","block");
            }else{
                $("#slide").removeClass("clickDown").addClass("clickUp");
                $(".client_history").animate({height: "0px", bottom: "0"});
                showOldClientPath();
            }
        });
        $(".applyBtn").click(function () {
            var datetimerange = $('input,#datetimerange').val();
            var oInterval = $("#footer_interval");
            oInterval.val(10);
        });

        $(".options_left").click(function () {
            if (!$(this).hasClass("active_li")) {
                $(this).addClass("active_li")
            }
            if ($(this).next().hasClass("active_li")) {
                $(this).next().removeClass("active_li")
            }
            $(".right1").css("display", "none");
            $("#slide").removeClass("clickDown").addClass("clickUp");
            $(".client_history").animate({height: "0px", bottom: "0"});
            clientRealTime();
        });
        $(".options_right").click(function () {
            if (!$(this).hasClass("active_li")) {
                $(this).addClass("active_li")
            }
            if ($(this).prev().hasClass("active_li")) {
                $(this).prev().removeClass("active_li")
            }
            $(".right1").css("display", "inline-table");
            clearInterval(g_timer);
            g_timer = null;
            //showOldClientPath();
        });
        $("#footer_interval").focus(function(){
            $("#err_footer_interval").css("display","none");
        })
    }

    function initDate(str) {
        var oDate = null;
        if (str) {
            oDate = new Date(str);
        } else {
            oDate = new Date();
        }
        var oMonth = oDate.getMonth() + 1;
        var oYear = oDate.getFullYear();
        var day = 0;
        switch (oMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                day = 31;
                break;
            case 2:
            {
                if ((oYear % 4 == 0) && (oYear % 100 != 0 || oYear % 400 == 0)) {
                    day = 29;
                } else {
                    day = 28;
                }
            }
                break;
            default:
                day = 30;
        }
        var minDate = parseInt(oDate.getTime()) - 86400000 * day;
        var minDate1 = timetoString(new Date(minDate));
        var opt = {
            minDate: minDate1
        };
        $("#datetimerange").daterange('setRangeData', "", opt);
    }

    //获得年月日
    function getMyDate(str){
        var oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth()+1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear +'/'+ getzf(oMonth) +'/'+ getzf(oDay)+'/'+ getzf(oHour) +'/'+ getzf(oMin) +'/'+getzf(oSen);//最后拼接时间
        return oTime;
    }
    function getMyStartDate(str){
        var oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth()+1,
            oDay = oDate.getDate(),
            oTime = oYear +'/'+ getzf(oMonth) +'/'+ getzf(oDay)+'/00/00/00';//最后拼接时间
        return oTime;
    }
    //补0操作
    function getzf(num){
        if(parseInt(num) < 10){
            num = '0'+num;
        }
        return num;
    }

    function initLimit() {
        var oDate = new Date();
        var endDate = oDate.getTime();
        var startDate = endDate - 6 * 24 * 60 * 60 * 1000;
        var opt = {
            //dateLimit: {days: 30},
            maxDate:getMyDate(endDate),
            minDate:getMyStartDate(startDate)
        };
        $("#datetimerange").daterange('setRangeData', "", opt);
    }

    function _init() {
        g_oPara = Utils.Base.parseUrlPara();
        g_mapName = decodeURI(g_oPara.mapName);
        g_clientMac = decodeURI(g_oPara.clientMac);
        $(".clientMac").html(g_clientMac);
        $(".mapName").html(g_mapName);
        initLimit();
        initData();
        initEvent();

    }

    function _destroy() {
        clearInterval(g_timer);
        g_timer = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "SingleSelect", "Form", "DateTime", "DateRange", "Cocos"],
        "utils": ["Base", "Timer"]
    });
})(jQuery);