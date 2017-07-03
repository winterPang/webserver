/**
 * Created by Administrator on 2017/3/22.
 */
define(['jquery', 'utils', 'clienttrail0/libs/jtopo-min', 'angular-ui-router'], function ($, Utils, Cocos2d) {
    return ['$scope', '$http', '$state','$stateParams','$alertService','$interval', function ($scope, $http, $state, $stateParams, $alert, $interval) {
        var g_stage = null;
        var g_scene = null;
        var g_Hours = 1 / 12;
        var g_scaleX = 1;
        var g_scaleY = 1;
        var g_mapName = null;
        $scope.region = 1;
        function getRcText(sRcId) {
            return Utils.getRcString("wloc_rc",sRcId).split(',');
        }

        //$scope.sceneInfo.sn
        //210235A1JTB15A000003
        function getMapInfo(getMapInfoSuc) {
            $http({
                method: 'POST',
                url: '/v3/wloc',
                data: {
                    devSN: $scope.sceneInfo.sn,
                    Method: "getMapInfo",
                    Param: {
                        devSN: $scope.sceneInfo.sn
                    }
                }
            }).success(function (data) {
                //console.log(data)
                getMapInfoSuc(data);
            }).error(function (data) {
                //console.log(111)
            })
        }

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

        function getClientSiteAndList(mapName, time, startTime, endTime, pageNum, oFilter, ClientSiteAndListSuc) {
            var pageSize = 10;
            pageNum = pageNum || 1;
            oFilter = oFilter || {};
            var Param = {
                devSN: $scope.sceneInfo.sn,
                mapName: mapName,
                time: time,
                startTime: startTime,//(s)
                endTime: endTime,
                startRowIndex: pageSize * (pageNum - 1),
                maxItem: pageSize
            };
            $.extend(Param, oFilter);
            $http({
                method: 'POST',
                url: '/v3/wloc_clientread',
                data: {
                    devSN: $scope.sceneInfo.sn,
                    Method: "getClientSiteAndList",
                    Param: Param
                }
            }).success(function (data) {
                ClientSiteAndListSuc(data);
            }).error(function (data) {

            })
        }

        //初始化cocos
        function initCanvas() {
            var BackgroundLayer = Cocos.BackgroundLayer($("canvas"));
            var WallLayer = Cocos.WallLayer($("canvas"));
            var ApLayer = Cocos.ApLayer($("canvas"));
            var ClientLayer = Cocos.ClientLayer($("canvas"));
            var TimeLayer = Cocos.TimeLayer($("canvas"));

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
           // cc.game._prepareCalled = false;
            cc.game.run("gameCanvas");
        }

        function initList() {
            $scope.clientOption = {
                tId: 'clientList',
                striped: true,
                /*height: 455,*/
                pageSize: 10,
                showRowNumber: false,
                showPageList: false,
                searchable: true,
                paginationSize: 'normal',
                sidePagination: 'server',
                method: "post",
                url: "/v3/wloc_clientread",
                contentType: "application/json",
                dataType: "json",
                queryParams: function (params) {
                    var oParam = $.extend({}, {
                        devSN: $scope.sceneInfo.sn,
                        mapName: $scope.mapName,
                        time: 0,
                        startTime: $scope.startTime,//(s)
                        endTime: $scope.endTime,
                        startRowIndex: params.size * (params.start - 1),
                        maxItem: params.size
                    },  params.findoption);
                    return {
                        devSN: $scope.sceneInfo.sn,
                        Method: "getClientSiteAndList",
                        Param: oParam
                    };
                },
                responseHandler: function (data) { //请求成功后的动作（刷数据）
                    if(g_scene){
                        drawRealTimeClient(data);
                    }
                    return {
                        total: data.result.oClientListInfo.rowCount,
                        rows: data.result.oClientListInfo.ClientList
                    };
                },
                columns: [
                    {
                        searcher: {type: "text"},
                        sortable: false,
                        field: 'clientMac',
                        title: getRcText("CLIENTMAC_LIST")[0]
                    }
                ]
            };
        }
        $scope.$on('click-row.bs.table#clientList', function () {
            var record = {};
            record.clientMac = arguments[1].clientMac;
            record.mapName = $scope.mapName;
            var v = JSON.stringify(record);
            $state.go('^.clientdetail0', {detailData: v}, { reload: true });
        });
        $scope.mapSelect = function () {
            $scope.mapName = $scope.myMapName;
            getImage($scope.mapName, getImageSuc);
            $("#MapSelect").attr("disabled",true);
        };
        $scope.endTime = new Date().getTime();
        $scope.startTime = $scope.endTime - 5 * 60 * 1000;
        $scope.selectTime = function ($event) {
            $(".period").css("color", "#2fa4e7");
            //console.log($($event.target).attr("time"));
            $($event.target).css("color", "grey");
            var hours = $($event.target).attr("time");
            if (hours == "") {
                hours = 1 / 12;
            }
            var date = new Date();
            var curTime = date.getTime();
            $scope.startTime = curTime - hours * 60 * 60 * 1000;
            $scope.endTime = curTime;
            g_Hours = hours;
        };
        $scope.refresh = function(){
            $state.reload();
        };
        $scope.$on('$destroy',function(){
            $interval.cancel($scope.timer);
        })

        function initData() {
            getMapInfo(getMapInfoSuc);
            initList();
        }

        function getMapInfoSuc(data) {
            if (data.retCode !== 0) {
                //Frame.Msg.info("获取地图信息失败");
                $alert.msgDialogError(getRcText("GETMAPINFO_FAILED")[0]);
                return;
            }
            var mapNameList = [];
            var mapAllList = data.data.mapList;
            mapAllList = mapAllList === "" ? [] : mapAllList;
            mapAllList.forEach(function (map) {
                if (map.mapName == "") {
                    return true;
                }
                var obj = {
                    name: map.mapName
                };
                mapNameList.push(obj);
            });
            $scope.mapNames = mapNameList;
            if (g_mapName != "undefined" && g_mapName != null && g_mapName != "") {
                $scope.myMapName = g_mapName;
                $scope.mapName = g_mapName;
            } else {
                $scope.myMapName = mapNameList[0].name;
                $scope.mapName = mapNameList[0].name;
            }
            if (mapNameList.length == 0) {
                //Frame.Msg.info("当前没有地图");
                $alert.msgDialogError(getRcText("NOWNOMAP_INFO")[0]);
            } else {
                getImage($scope.mapName, getImageSuc)
            }
        }

        function getImageSuc(data) {
            if (data.retcode != 0) {
                //Frame.Msg.info("获取" + $scope.mapName + "图片失败");
				g_stage.clear();
                $alert.msgDialogError(getRcText("GETMAPFAILED_INFO")[0]);
                return;
            }
            drawImage(data);
        }

        function drawImage(data) {
            var myCanvas = document.getElementById("gameCanvas");
            myCanvas.width = 800;
            myCanvas.height = 450;
            g_stage.clear();
            var imgbackground = new Image();
            imgbackground.onload = function () {
                $("#MapSelect").attr("disabled",false);
                g_scaleX = 800 / imgbackground.width;
                g_scaleY = 450 / imgbackground.height;
                var scene = new JTopo.Scene(g_stage);
                g_scene = scene;
                scene.background = data.image;
                scene.mode = 'select';
                scene.areaSelect = false;
                updateList();
            };
            imgbackground.src = data.image;
        }

        function drawClient(clientList, scene, stage) {
            scene.clear();
            $.each(clientList, function (client, clientInfo) {
                var posX = clientInfo.XCord;
                var posY = clientInfo.YCord;
                var node = new JTopo.Node();
                var status = clientInfo.clientStatus;
                if (status == 1) {
                    node.setImage('../clienttrail0/img/client_002.png', true);
                } else if (status == 2) {
                    node.setImage('../clienttrail0/img/client_001.png', true);
                } else {
                    node.setImage('../clienttrail0/img/client_001.png', true);
                }
                node.setLocation(posX, posY);
                node.text = clientInfo.clientMac;
                node.textPosition = "Bottom_Center";
                node.textOffsetY = -10;
                node.font = "12px Consolas"
                node.fontColor = '102,102,85';
                node.dragable = false;
                scene.add(node);
            });
        }

        function updateList() {
            $interval.cancel($scope.timer);
            $scope.timer = null;
            $scope.timer=$interval(function(){
                var date = new Date();
                var oTime = date.getTime();
                $scope.startTime = oTime - g_Hours * 60 * 60 * 1000;
                $scope.endTime = oTime;
                $scope.$broadcast('refresh#clientList');
                $scope.$broadcast('hideLoading#clientList');
            },2000);
        }

        function drawRealTimeClient(data) {
            var myCanvas = document.getElementById("gameCanvas");
            var clientList1 = data.result.oClientSiteInfo.ClientList || [];
            if (data.result.oClientSiteInfo.retCode !== 0) {
                clientList1 = [];
            }

            $.map(clientList1, function (map) {
                map.XCord *= g_scaleX;
                map.YCord = map.YCord * g_scaleY;
                if (map.XCord < 0) {
                    map.XCord = 30;
                } else if (map.XCord > myCanvas.width) {
                    map.XCord = myCanvas.width - 30;
                }
                if (map.YCord < 0) {
                    map.YCord = 30;
                } else if (map.YCord > myCanvas.height) {
                    map.YCord = myCanvas.height - 30;
                }
            });
            drawClient(clientList1, g_scene, g_stage);
        }

        function _init() {
            var myCanvas = document.getElementById("gameCanvas");
            var stage = new JTopo.Stage(myCanvas);
            g_mapName = $stateParams.mapData;
            g_stage = stage;
            initData();

        }
        _init();

    }]
});
