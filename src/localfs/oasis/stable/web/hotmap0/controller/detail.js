define(['jquery', 'echarts', 'utils', 'angular-ui-router', 'bsTable',
    'hotmap0/libs/jtopo-min'], function ($, echarts, Utils) {
    return ['$scope', '$http', '$state', '$alertService', '$interval', function ($scope, $http, $state, $alert, $interval) {


        var g_scaleX = 1;
        var g_scaleY = 1;
        var g_stage = null;
        $scope.timer3 = null;
        var g_areaList = [];
        $scope.g_areaInfo = {};
        var flag = 0;
        var flag1 = 0;
        var flag2 = 0;
        var g_width = null;
        var g_height = null;
        var g_awidth = null;
        var g_aheight = null;
        var g_window_width = null;
        var g_window_height = null;
        var g_modal_width=null;
        var g_modal_width2=null;
        var g_src = null;
        var sTitle = getRcString("CLIENT_INFO").split(',');

        //function f_width() {
        //    $scope.timer2 = $interval(function () {
        //        g_awidth = $(window).width();
        //        //g_aheight=$(window).height();
        //    }, 1000);
        //}
        //f_width();

        function resize() {
            var imgbackground = new Image();
            imgbackground.onload = function () {
                var canvas = $("#canvas");
                var railCanvas = document.getElementById("rail");
                var bgCanvas = document.getElementById("bgCanvas");
                $scope.dis = 1;
                g_width = imgbackground.width;
                g_height = imgbackground.height;

                $scope.dis = canvas.width() / imgbackground.width;
                bgCanvas.height = imgbackground.height * $scope.dis;

                bgCanvas.width = canvas.width();
                railCanvas.width = bgCanvas.width;
                railCanvas.height = bgCanvas.height;
                $('#canvas').css('height', bgCanvas.height);
                $('#eChart').css('width', bgCanvas.width);
                $('#eChart').css('height', bgCanvas.height);
                g_scaleX = $scope.dis;
                g_scaleY = $scope.dis;
            };
            imgbackground.src = g_src;
        }

        function getRcString(sRcId) {
            return Utils.getRcString("wloc_rc", sRcId);
        }

        function getMapInfo(succb) {
            $http({
                method: 'POST',
                url: '/v3/wloc',
                data: {
                    //devSN: "210235A0VSB157000034",
                    devSN: $scope.sceneInfo.sn,
                    Method: "getMapInfo",
                    Param: {
                        devSN: $scope.sceneInfo.sn
                    }
                }
            }).success(function (data) {
                succb(data);
            }).error(function (data) {
            })
        }

        function getAreaClient(cBack, mapName, areaName, areaType, startTime, endTime, pageNum, oFilter) {
            var pageSize = 10;
            pageNum = pageNum || 1;
            oFilter = oFilter || {};
            var Param = {
                devSN: $scope.sceneInfo.sn,
                mapName: mapName,
                areaName: areaName,
                areaType: areaType,
                startTime: startTime,
                endTime: endTime,
                startRowIndex: pageSize * (pageNum - 1),
                maxItem: pageSize
            }
            $.extend(Param, oFilter);

            ////////////////////////修改
            $http({
                method: 'post',
                url: "/v3/wloc_clientread",
                data: {
                    devSN: $scope.sceneInfo.sn,
                    Method: "getAreaClient",
                    Param: Param
                }
            }).success(function (data) {
                cBack(data);
            }).error(function () {
            });
        }

        function getMapIndex(mapName) {
            $http({
                method: "getMapIndex",
                url: "/v3/wloc",
                Param: {
                    devSN: $scope.sceneInfo.sn,
                    mapName: mapName
                }
            }).success(function (data) {
                cBack(data);
            }).error(function (data) {
                cBack("");
            })
        }

        function getImage(mapName, succb) {
            $http({
                method: "POST",
                url: "/v3/wloc/image/getMap",           //少写一个'/'导致只能返回html页面
                data: {
                    devSN: $scope.sceneInfo.sn,
                    mapName: mapName
                }
            }).success(function (data) {
                succb(data);
            }).error(function (err) {
                errcb(err);
            });
        }

        function getClientNode(mapName, time, cBack) {
            $http({
                method: "POST",
                url: "/v3/wloc_clientread",
                data: {
                    devSN: $scope.sceneInfo.sn,
                    Method: "getClientSite",
                    Param: {
                        devSN: $scope.sceneInfo.sn,
                        mapName: mapName,
                        time: time //(s)
                    }
                }
            }).success(function (data) {
                cBack(data);
            }).error(function (data) {
                cBack("");
            })
        }

        function initEvent() {

            $scope.selectChange = function () {
                //清空区域。。
                echarts.init(document.getElementById('eChart'));
                g_areaList = [];
                var rail = document.getElementById("rail");
                var ctx = rail.getContext("2d");
                clearSence(rail, ctx);
                /////////////////
                $interval.cancel($scope.timer3);
                initData();
                $('#MapSelect123').attr("disabled",true);
            }

            //$(document).on("click","[role=button-cancel]",function(){
            //    var mapName = $scope.mapName1;
            //    if($scope.timer3){
            //        $interval.cancel($scope.timer3);
            //        $scope.timer3=null;
            //    }
            //    $scope.timer3 = $interval(function () {
            //        updateEchart(mapName, 0)
            //    }, 2000);
            //
            //})

            function getMapInfoNextt(data) {
                if (data.retCode !== 0) {
                    console.log("getMapInfo1 error, retCode: " + data.retCode + " errorMessage: " + data.errorMessage);
                    $alert.msgDialogError(getRcString("FALIEDD"), 'error');
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
                });
                mapInfoList.forEach(function (map) {
                    mapList[map.mapName] = map;
                });

                $scope.mapNameList1 = mapNameList;
                $scope.mapName1 = mapNameList[0];
                initData();
            }

            getMapInfo(getMapInfoNextt);

            $("#layout_center").scroll(function () {
                var scrollTop = $(this).scrollTop();
                displayRail(scrollTop);
            })
        }

        function initData() {
            function getImageNext(data) {
                if (data.retcode != 0) {
                    echarts.init(document.getElementById('eChart'));

                    g_areaList = [];
                    var rail = document.getElementById("rail");
                    var ctx = rail.getContext("2d");
                    clearSence(rail, ctx);

                    $alert.msgDialogError(getRcString("FALIEDD"), 'error');
                    return;
                }
                var imgbackground = new Image();
                imgbackground.onload = function () {
                    $('#MapSelect123').attr("disabled",false);
                    var canvas = $("#canvas");
                    var railCanvas = document.getElementById("rail");
                    var bgCanvas = document.getElementById("bgCanvas");
                    $scope.dis = 1;
                    var curTime = 0;
                    var areaList = [];
                    g_stage.clear()
                    var scene = new JTopo.Scene(g_stage);

                    g_width = imgbackground.width;
                    g_height = imgbackground.height;

                    $scope.dis = canvas.width() / imgbackground.width;
                    bgCanvas.height = imgbackground.height * $scope.dis;

                    bgCanvas.width = canvas.width();
                    //bgCanvas.width = canvas.width();
                    railCanvas.width = bgCanvas.width;
                    railCanvas.height = bgCanvas.height;
                    //$('#canvas').css('width',bgCanvas.width);
                    $('#canvas').css('height', bgCanvas.height);
                    $('#eChart').css('width', bgCanvas.width);
                    $('#eChart').css('height', bgCanvas.height);
                    //canvas.height(bgCanvas.height);
                    g_scaleX = $scope.dis;
                    g_scaleY = $scope.dis;
                    scene.background = data.image;
                    g_src = data.image;
                    scene.mode = 'select';
                    scene.areaSelect = false;

                    updateEchart(mapName, curTime);
                    //timer = setInterval(function () {
                    //    updateEchart(mapName, curTime)  /////////每隔一秒钟获取一次热点
                    //}, 1000);
                    if($scope.timer){
                        $interval.cancel($scope.timer);
                        $scope.timer = null;
                    }
                    if($scope.timer3){
                        $interval.cancel($scope.timer3);
                        $scope.timer3 = null;
                    }
                    $scope.timer3 = $interval(function () {
                        updateEchart(mapName, curTime)  /////////每隔一秒钟获取一次热点
                    }, 2000);

                    function getMapInfoNext(data) {
                        var aRail = [];
                        if (data.retCode !== 0) {
                            $alert.msgDialogError(getRcString("FALIEDD"), 'error');
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
                                    map.nodes[i].xPos *= $scope.dis;
                                    map.nodes[i].yPos *= $scope.dis;
                                }
                                aRail.push(map);
                            }
                        });
                        g_areaList = aRail;

                        displayRail();
                    }

                    getMapInfo(getMapInfoNext);
                };
                imgbackground.src = data.image;
            }

            var mapName = $scope.mapName1;
            g_stage.clear();
            var scene = new JTopo.Scene(g_stage);
            if (mapName == null) {
                console.log('当前没有地图');
                //$alert.msgDialogError(getRcString("FALIEDD1"), 'error');
            } else {
                getImage(mapName, getImageNext)
            }
        }

        function updateEchart(mapName, curTime) {
            function getClientNodeNext(data) {
                var oOpacity = 1;
                var myCanvas = document.getElementById("bgCanvas");
                var oWidth = myCanvas.width;
                var oHeight = myCanvas.height;
                if (data.retCode == -1) {
                    //Frame.Msg.info("获取终端失败");
                    console.log("获取终端失败");
                    $alert.msgDialogError(getRcString("FAILED"), 'error');
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

                //var myChart=echarts.init($('#eChart'));
                var myChart = echarts.init(document.getElementById('eChart'));
                var option = {
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
                myChart.setOption(option);
                //console.log('此处是否存在问题呢。。。。。。。。。。。。。');
                //$("#eChart").echart("init", option, {});
            }

            getClientNode(mapName, curTime, getClientNodeNext);
        }

        //userOption

        $scope.close = function () {
            $scope.$broadcast('hide#addUserInfo');
            //$scope.$broadcast('hide#macInfo');

            var mapName = $scope.mapName1;
            $scope.timer3 = $interval(function () {
                updateEchart(mapName, 0)
            }, 2000);

        }

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.timer3);
            $scope.timer3 = null;
            //$interval.cancel($scope.timer2);
            //$scope.timer2 = null;
        })


        function displayRail(scroll) {
            var rail = document.getElementById("rail");
            var ctx = rail.getContext("2d");
            var scrollTop = scroll || 0;
            //$scope.move=function(e){
            //    console.log('鼠标div元素划过了。。。。。。。。。')
            //}
            rail.onmousemove = function (e) {
                var railX = getOffset(rail).left;
                var railY = getOffset(rail).top;
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
                            $scope.g_areaInfo = {
                                mapName: $scope.mapName1,
                                areaName: g_areaList[k].areaName,
                                areaType: g_areaList[k].areaType,
                                startTime: new Date().getTime() - 3000000,
                                endTime: new Date().getTime()
                            };

                        }
                    }
                }


            };
			rail.onmouseout = function (e){
                clearSence(rail, ctx);
            };
        }

        $scope.addUserInfo = {
            mId: 'addUserInfo',
            title: "",
            //title: getRcString("NAME"),
            autoClose: false,
            showCancel: false,
            buttonAlign: "center",
            modalSize: 'lg',
            showClose:false,
            showFooter: false,
            okHandler: function (modal, $ele) {
            },
            cancelHandler: function (modal, $ele) {
            },
            beforeRender: function ($ele) {
                return $ele;
            }
        }
        $scope.macInfo = {
            tId: 'macInfo',
            title: getRcString("NAME")[0],
            striped: true,
         //   url: '/v3/wloc_clientread',
            method: 'post',
            contentType: 'application/json',
            dataType: 'json',
            pagination: true,
            paginationSize: "lg",
            searchable: true,
            pageSize: 5,
            showPageList: false,
            //pageList:[5,10],
            sidePagination: 'server',
            startField: 'startRowIndex',
            limitField: 'maxItems',
            queryParams: function (params) {
                params.devSN = $scope.sceneInfo.sn;
                params.Method = "getAreaClient";
                params.Param = {
                    devSN: $scope.sceneInfo.sn,
                    mapName: $scope.mapName1,
                    startTime: $scope.startTime,//(s)dyy修改
                    endTime: $scope.endTime,//(s)dyy修改
                    areaName: $scope.g_areaInfo.areaName,
                    areaType: $scope.g_areaInfo.areaType,
                    startRowIndex: params.startRowIndex,
                    maxItem: params.maxItems
                };
                $.extend(params.Param, params.findoption);
                delete params.findoption;
                delete params.maxItems;
                delete params.order;
                delete params.size;
                delete params.start;
                delete params.startRowIndex;
                return params;
            },
            responseHandler: function (data) { //请求成功后的动作（刷数据）
                return {
                    total: data.result.rowCount,
                    rows: data.result.ClientList
                };
            },
            columns: [
                {sortable: false, field: 'clientMac', title: sTitle[0], searcher: {type: "text"}},
                {sortable: false, field: 'XCord', title: sTitle[1]},
                {sortable: false, field: 'YCord', title: sTitle[2]}
            ]
        };

        $scope.addClick = function () {
            $scope.endTime = new Date().getTime();
            $scope.startTime = $scope.endTime - 5 * 1000;
            //$('.modal-title').html='数字围栏名称 ：'+g_areaInfo.areaName;
            if (flag1 == 1 && flag2 == 1) {
                $(".modal-title").html(getRcString("NAME") + ":" + $scope.g_areaInfo.areaName);
                //clearInterval(timer);
                $interval.cancel($scope.timer3);
                $scope.timer3 = null;
                $scope.$broadcast('refresh#macInfo',{
                    url:'/v3/wloc_clientread'
                });
                $scope.$broadcast('show#addUserInfo');
                //$('input[search-field="XCord"]').css('display','none');
                //$('input[search-field="YCord"]').css('display','none');

            }
        }
        ////////用于分页的时候的刷新数据的函数
        function updateList(obj, pageNum, oFilter) {
            var mapName = $("#MapSelect").val();
            getAreaClient(mapName, obj.areaName, obj.areaType, obj.startTime, obj.endTime, pageNum, oFilter).done(function (data) {
                if (data.retCode != 0) {
                    //Frame.Msg.info("获取区域终端失败");
                    $alert.msgDialogError(getRcString("FAILED"), 'error');
                    return;
                }
                var clientList = data.result.ClientList;
                //$("#client_slist").SList("refresh", {data: clientList, total: data.result.rowCount});
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

        function init() {
            var myCanvas = document.getElementById("bgCanvas");
            var stage = new JTopo.Stage(myCanvas);
            g_stage = stage;
            initEvent();
            //initGrid();
        }

        init();

    }];
})
