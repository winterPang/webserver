/**
 * Created by Administrator on 2017/3/22.
 */
define(['jquery','utils','moment','clienttrail0/libs/jtopo-min','angular-ui-router','bsTable', 'bootstrap-daterangepicker','css!bootstrap_daterangepicker_css'],function($,Utils,moment) {
    return ['$scope', '$http','$state', '$stateParams','$window','$alertService', '$interval',function($scope,$http,$state,$stateParams,$window,$alert,$interval){
        var g_oPara = null;
        var g_mapName = null;
        var g_clientMac = null;
        var g_scaleX = 1;
        var g_scaleY = 1;
        var g_stage = null;
        var g_scene = null;
        var g_src = null;
        var g_width = null;
        var g_height = null;

        //获取图片接口
        function getImage(mapName, getImageSuc) {
            $http({
                method: 'POST',
                url: '/v3/wloc/image/getMap',
                data: {
                    devSN: $scope.sceneInfo.sn,
                    mapName: mapName
                }
            }).success(function (data) {
                //console.log(data)
                getImageSuc(data);
            }).error(function (data) {
                //console.log(111)
            })
        }

        //查询历史轨迹接口
        function getClientTime(mapName, clientMac, startTime, endTime, days, nInterval, getClientTimeSuc) {
            $http({
                method: 'POST',
                url: '/v3/wloc_clientread',
                data: {
                    devSN: $scope.sceneInfo.sn,
                    Method: "getClientTrack",
                    Param: {
                        devSN: $scope.sceneInfo.sn,
                        mapName: mapName,
                        clientMac: clientMac,
                        startTime: startTime,
                        endTime: endTime,
                        days: days,
                        intervalTime: nInterval
                    }
                }
            }).success(function (data) {
                //console.log(data)
                getClientTimeSuc(data);
            }).error(function (data) {
                //console.log(111)
            })
        }
        //获取终端实时坐标接口
        function getClientNode(mapName, clientMac, time, getClientNodeSuc) {
            $http({
                method: 'POST',
                url: '/v3/wloc_clientread',
                data: {
                    devSN: $scope.sceneInfo.sn,
                    Method: "getClientSite",
                    Param: {
                        devSN: $scope.sceneInfo.sn,
                        mapName: mapName,
                        clientMac: clientMac,
                        time: time //(s)
                    }
                }
            }).success(function (data) {
                //console.log(data)
                getClientNodeSuc(data);
            }).error(function (data) {

            })
        }

        function getRcString(attrName){
            return Utils.getRcString("detail_rc",attrName);
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

        function clientRealTime() {
            var myCanvas = document.getElementById("Canvas1");
            /*if(g_timer){
                clearInterval(g_timer);
                g_timer = null;
            }*/
            if($scope.timer){
                $interval.cancel($scope.timer);
                $scope.timer = null;
            }
            function getClientNodeSuc(data){
                if (data.retCode != 0) {
                    //Frame.Msg.info("获取实时轨迹失败");
                    $alert.msgDialogError(getRcString("GETNOWFAILED_INFO"));
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
            }
            /*g_timer = setInterval(function () {
                getClientNode(g_mapName, g_clientMac, 0, getClientNodeSuc)
            }, 1000)*/
            $scope.timer = $interval(function () {
                getClientNode(g_mapName, g_clientMac, 0, getClientNodeSuc)
            }, 2000)
        }

        $scope.$on('$destroy',function(){
            $interval.cancel($scope.timer);
        })

        function showOldClientPath() {
            /*clearInterval(g_timer);
            g_timer = null;*/
            var myCanvas = document.getElementById("Canvas1");
            var nInterval = $(".clienttrail_detail #footer_interval").val();
            var datetimerange = $('.clienttrail_detail input#daterange').val();
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
            function getClientTimeSuc(data){
                if (data.retCode !== 0) {
                    //Frame.Msg.info("获取历史轨迹失败");
                    $alert.msgDialogError(getRcString("GETHISTORYFAILED_INFO"));
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
                        map.XCord = myCanvas.width - 5;
                    }
                    if (map.YCord < 0) {
                        map.YCord = 0
                    } else if (map.YCord > myCanvas.height) {
                        map.YCord = myCanvas.height - 5;
                    }
                    //myCanvas.height
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
            }
            getClientTime(mapName, clientMac, parseInt(startTime), parseInt(endTime), days, parseInt(nInterval), getClientTimeSuc)
        }

        function initData() {
            var mapname = g_mapName;
            var myCanvas = document.getElementById("Canvas1");
            var canvasContain = $(".clienttrail_detail #MyCanvas");
            var disX = 1;
            function getImageSuc(data){
                if (data.retcode != 0) {
                    //Frame.Msg.info("获取"+mapname+"图片失败");
                    $alert.msgDialogError(getRcString("GETMAPFAILED_INFO"));
                    return;
                }
                //var imgUrl = '../../../v3/wloc/image/' + FrameInfo.ACSN + '/' + data.index + '/background';
                var imgbackground = new Image();
                imgbackground.onload = function () {
                    g_width = imgbackground.width;
                    g_height = imgbackground.height;
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
                g_src = data.image;
            }
            getImage(mapname,getImageSuc);
        }
        /*$(window).resize(function(){
            var myCanvas = document.getElementById("Canvas1");
            var canvasContain = $(".clienttrail_detail #MyCanvas");
            var disX = 1;
            disX = canvasContain.width() / g_width;
            myCanvas.width = canvasContain.width();
            myCanvas.height = disX * g_height;
            canvasContain.height(myCanvas.height);
            g_scaleX = disX;
            g_scaleY = disX;
            
        })*/

        $scope.realOrHis = function($event){
            if($($event.target).hasClass("options_left")){
                if (!$($event.target).hasClass("active_li")) {
                    $($event.target).addClass("active_li")
                }
                if ($($event.target).next().hasClass("active_li")) {
                    $($event.target).next().removeClass("active_li")
                }
                $(".clienttrail_detail .right1").css("display", "none");
                $(".clienttrail_detail #real_mac").css("display","inline-block");
                $(".clienttrail_detail #slide").removeClass("clickDown").addClass("clickUp");
                $(".clienttrail_detail .client_history").animate({height: "0px", bottom: "0"});
                clientRealTime();
            }else{
                if (!$($event.target).hasClass("active_li")) {
                    $($event.target).addClass("active_li")
                }
                if ($($event.target).prev().hasClass("active_li")) {
                    $($event.target).prev().removeClass("active_li")
                }
                $(".clienttrail_detail .right1").css("display", "inline-table");
                $(".clienttrail_detail #real_mac").css("display","none");
                $interval.cancel($scope.timer);
                $scope.timer = null;
                g_scene.clear();
                /*if($("#slide").hasClass("clickDown")){}
                showOldClientPath();*/
            }
        };
        $scope.refresh = function(){
            $state.reload();
        };
        $scope.back = function(){
            //$state.back();
            //console.log(g_mapName)
            $state.go('^.clienttrail0', {mapData: g_mapName});
            //$window.history.back();
        }
        $scope.slideFn = function($event){
            if ($($event.target).hasClass("clickUp")) {
                $(".clienttrail_detail #err_footer_interval").css("display","none");
                $($event.target).removeClass("clickUp").addClass("clickDown");
                $(".clienttrail_detail .client_history").animate({height: "220px", bottom: "-220px"});
            } else {
                $($event.target).removeClass("clickDown").addClass("clickUp");
                $(".clienttrail_detail .client_history").animate({height: "0px", bottom: "0"});
            }
        };
        $scope.historyFn = function(){
            var oInterval = $(".clienttrail_detail #footer_interval");
            if(oInterval.val() == ""){
                $(".clienttrail_detail #err_footer_interval").html(getRcString("INPUTJIANGE_INFO"));
                $(".clienttrail_detail #err_footer_interval").css("display","block");
            }else if(Number(oInterval.val()) < 10){
                $(".clienttrail_detail #err_footer_interval").html(getRcString("INPUTMORE_INFO"));
                $(".clienttrail_detail #err_footer_interval").css("display","block");
            }else{
                $(".clienttrail_detail #slide").removeClass("clickDown").addClass("clickUp");
                $(".clienttrail_detail .client_history").animate({height: "0px", bottom: "0"});
                showOldClientPath();
            }
        }

        function initEvent(){
            $(".clienttrail_detail #footer_interval").focus(function(){
                $(".clienttrail_detail #err_footer_interval").css("display","none");
            })
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
                oTime = oYear +'/'+ getzf(oMonth) +'/'+ getzf(oDay)+'/23/59/59'/*+'/'+ getzf(oHour) +'/'+ getzf(oMin) +'/'+getzf(oSen);*///最后拼接时间
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

        var oDate = new Date();
        var endDate = oDate.getTime();
        var startDate = endDate - 6 * 24 * 60 * 60 * 1000;
        $('#daterange').daterangepicker(
            {
                /*startDate: getMyDate(endDate),
                endDate: getMyDate(endDate),*/
                maxDate:getMyDate(endDate),
                minDate:getMyStartDate(startDate),
                timePickerIncrement: 1,
                timePicker: true,
                timePicker24Hour: true,
                timePickerSeconds: true,
                opens: "right",
                locale: {
                    format: "YYYY/MM/DD HH:mm:ss",
                    applyLabel : getRcString("DRP_APPLYLABEL"),
                    cancelLabel : getRcString("DRP_CANCELLABEL"),
                    fromLabel : getRcString("DRP_FROMLABEL"),
                    toLabel : getRcString("DRP_TOLABEL"),
                    //daysOfWeek : getRcString("DRP_DAYSOFWEEK").split(","),
                    monthNames : getRcString("DRP_MONTHNAMES").split(",")
                }
            },
            function(start, end, label) {
                /*startDate = start.format('YYYY/MM/DD HH:mm:ss');
                endDate = end.format('YYYY/MM/DD HH:mm:ss');*/
            }
        );

        function _init(){
            g_oPara = JSON.parse($stateParams.detailData);
            g_mapName = g_oPara.mapName;
            g_clientMac = g_oPara.clientMac;
            $(".clienttrail_detail .clientMac").html(g_clientMac);
            $(".clienttrail_detail .mapName").html(g_mapName);
            initData();
            initEvent();
        }
        _init();


        //console.log($stateParams.detailData)

    }]
});
