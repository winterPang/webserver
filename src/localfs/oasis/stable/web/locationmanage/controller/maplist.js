define(['css!../css/maplist',
        'css!../css/pagination',
        '../libs/pagination',
        '../libs/jtopo-0.4.8-min',
        '../services/locationConst',
        '../services/locSer'],function (){
    return ['$scope','$state','$stateParams','$timeout', '$alertService', 'locConst', 'locSer',function (
                $scope, $state, $stateParams, $timeout, $alert, locConst, locSer){
        var shopId = $stateParams.shopId;
        var shopState;
        var mode = $scope.mode = parseInt($stateParams.mode);

        $scope.modeName = locConst.getName(mode);
        $scope.info = {
            deviceNoTurnOn : '请开启定位的AC设备.',
            delConfirm : '确认删除选择的地图信息？',
            delSuc : '删除成功。',
            mapNotExist : '地图已经不存在。',
            noAuthrity : '账号无权限。',
            noMapExist : '无地图，请至地图管理中操作。'
        };

        $scope.return=function(){
            $state.go('^.locationmanage',$stateParams);
        };
        $scope.mapManage=function(){
            $state.go('^.mapsetting',{shopId:shopId,mode:mode});
        };
        $scope.refreshLocationList =  function () {
            var timePromise;
            return function () {
                $timeout.cancel(timePromise);
                timePromise = $timeout(function () {
                    $state.reload()
                },300)
            }
        }();
        $scope.displayLocationClientById = function (locationId) {
            $state.go('^.clientmap',{locationId:locationId,shopId:shopId,mode:mode})
        };
        $scope.editLocatiton = function (locationId) {
            $state.go('^.editmap',{locationId:locationId,shopId:shopId,mode:mode})
        };
        $scope.deleteLocationById = function (locationId) {
            $alert.confirm($scope.info.delConfirm,deleteLocation.bind(null,locationId))
        };
        $scope.alertDeviceNoTurnOn = function () {
            $alert.confirm($scope.info.deviceNoTurnOn,function () {
                $state.go('^.locationmanage',$stateParams)
            })
        };
        locSer[mode].getLocationByShop(shopId)
            .then(function (data) {
                data = data.data;
                if (data.code == 0) {
                    shopState = data.state;
                    initLocation(data.locationMapList)
                }
            });
        // pagination
        function initLocation(locationList) {
            $('#pagination').pagination({
                dataSource: locationList,
                pageSize: 4,
                pageRange: 1,
                className: 'paginationjs-theme-lvzhou paginationjs-big',
                callback: function (data) {
                    masonListHandler(data);
                }
            })
        }
        function masonListHandler(locationList) {
            var marsonryHtml = "<div class='row'>";
            $.each(locationList, function (index, locatoinInfo) {
                var html = "<div class='col-md-6'><div class='box'>" +
                    "<div class='marsonImg' >" +
                    "<canvas id='" + locatoinInfo.locationId + "'  style='cursor:pointer'></canvas>" +
                    "</div><div class='mapTitle'><img src='../locationmanage/img/pic.png' style='margin-right:10px;'><label>地图名：" + locatoinInfo.mapName + "</label><br/>" +
                    "<button class='btn btn-lvzhou btnClient' style='margin-top:-3px;' infoId=" + locatoinInfo.locationId + ">终端显示</button>" +
                    "<button type='button' class='btn btn-default' style='border:1px solid #4ec1b2;border-radius:0px;margin-left:20%;height:35.4px;' aria-label='Left Align' infoId=" + locatoinInfo.locationId + "><img src='../locationmanage/img/icon-edit01.png' style='margin-top:-2.2px;margin-right:4px;'><span style='vertical:middle;'>编辑</span></button>" +
                    "<button type='button' class='btn btn-default' style='border:1px solid #4ec1b2;border-radius:0px;margin-left:3%;height:35.4px;' aria-label='Left Align'  infoId=" + locatoinInfo.locationId + "><img src='../locationmanage/img/icon-del01.png' style='margin-top:-2.2px;margin-right:4px;'><span style='vertical:middle;'>删除</span></button>" +
                    "</div></div></div>";
                marsonryHtml = marsonryHtml + html;
            });
            marsonryHtml += "</div></div>";
            $("#masonry").html(marsonryHtml);
            $.each(locationList, function (index, locatoinInfo) {
                showLocationInfo(locatoinInfo);
            });

            if(!shopState){
                $('.row button').each(function (idx,item) {
                    var evList = [$scope.displayLocationClientById,$scope.editLocatiton,$scope.deleteLocationById]
                    $(item).bind('click',function () {
                        evList[idx%3](item.getAttribute('infoId'))
                    })
                })
            }else{
                $('.row button').each(function (idx,item) {
                    var evList = [$scope.alertDeviceNoTurnOn,$scope.alertDeviceNoTurnOn,$scope.deleteLocationById]
                    $(item).bind('click',function () {
                        evList[idx%3](item.getAttribute('infoId'))
                    })
                })
            }
        }

        function showLocationInfo(locatoinInfo) {
            var imagePath = locatoinInfo.path;
            var locationId = locatoinInfo.locationId;

            var canvas = document.getElementById(locationId);
            $(canvas).attr('width', 324);
            $(canvas).attr('height', 324);

            var stage = new JTopo.Stage(canvas);
            var scene = new JTopo.Scene(stage);
            scene.background = imagePath;
            scene.mode = 'select';
            var scalex;
            var scaley;
            $("<img/>").attr("src",imagePath).load(function () {
                var imgWidth = this.width;
                var imgHeight = this.height;
                scalex = imgWidth / 532;
                scaley = imgHeight / 354;
            });
        }

        function deleteLocation(locationId) {
            locSer[mode].delMapByLocationId(locationId)
                .then(function (data) {
                    data = data.data;
                    if (data.code === 0) {
                        $alert.msgDialogSuccess($scope.info.delSuc);
                        $timeout(function () {$state.reload()},200)
                    } else if(data.code === 1){
                        $alert.msgDialogError($scope.info.mapNotExist)
                    } else if(data.code ===2){
                        $alert.msgDialogError($scope.info.noAuthrity)
                    }
                })
        }
    }
    ]})


