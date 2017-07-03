/**
 * Created by Administrator on 2016/10/21.
 */
define(['angularAMD', 'utils', 'sprintf', 'css!./scene-change'], function (angularAMD, Utils) {
    var sceneInfoUrl = Utils.getUrl('POST', "", "/scenarioserver", '/init/scene/getShop.json');
    var MENU_URL_TEMPLATE = "https://" + location.hostname + "/oasis/stable/web/frame/index.html#/scene%d/nasid%d/devsn%s/content%stopName%s/monitor/dashboard15";
    var URL_GET_DEV_INFO = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/';
    var PERATION_URL_TEMPLATE = "https://oasisrd.h3c.com/oasis/stable/web/frame/index.html#/scene88/nasid%d/devsn%s/content/monitor/dashboard88";
    angularAMD.directive('sceneChange', [
        function () {
            return {
                restrict: 'EA',
                templateUrl: './directive/scene/sceneChangeTemplate-' + Utils.getLang() + '.html',
                replace: false,
                scope: true,
                controller: function ($scope, $http, $rootScope) {
                    var $panel = $('.scenes_panel');
                    var $contain = $('.change_scenes');
                    //  if first load,set devsn value param's devsn
                    var firstLoad = true;

                    if (!$scope.sceneInfo) {
                        return;
                    }

                    $scope.showDevices = $scope.sceneInfo.model != 9;
                    $scope.devSn = $scope.sceneInfo.sn;
                    $scope.isBranchAdmin = ($rootScope.userRoles && $rootScope.userRoles.accessApList != 'false') || false;

                    $scope.dataList = {};
                    $scope.devInfoList = {};
                    $scope.branchObj = {};
                    $scope.branchList = [];

                    if ($scope.isBranchAdmin) {
                        //  获取所有的分支信息
                        $http({
                            method: 'POST',
                            url: '/v3/cloudapgroup',
                            data: {
                                Method: 'getGroupNameListByRoleName',
                                query: {
                                    userName: $rootScope.userRoles.userRoot,
                                    roleName: $rootScope.userRoles.userName
                                }
                            }
                        }).success(function (data) {
                            if (data.retCode == 0) {
                                $.each(data.message, function () {
                                    $scope.branchObj[this.nasId] = this.groupList;
                                    $scope.branchObj[this.nasId + '_top'] = this.topId;
                                });
                            }
                        });
                    }

                    function getRcString(attrName) {
                        return $('#change_scenes').attr(attrName);
                    }

                    function watchScene() {
                        var v = $scope.selectedScene;
                        $scope.showDevices = ($scope.scenes && $scope.scenes[v] && $scope.scenes[v].model != 9) || true;//TODO
                        if (v) {
                            var devices = [].concat($scope.dataList[v]), devList = [], devSnList = [];
                            $scope.devList = [];
                            $.each(devices, function (i, d) {
                                devSnList.push(d.devSN);
                            });
                            $http.post('/base/getDevs', {devSN: devSnList})
                                .success(function (data) {
                                    var statusList = data.detail;
                                    $.each(devices, function (i, dev) {
                                        $.each(statusList, function (j, sta) {
                                            if (dev.devSN == sta.devSN) {
                                                dev.status = sta.status;
                                                dev.showName = dev.devName + '(' + (sta.status == 0 ? getRcString('online') : getRcString('offline')) + ')';
                                                devList.push(dev);
                                            }
                                        });
                                    });
                                    if (devList.length && !firstLoad) { //  不是第一次加载，则显示下拉框中的第一个
                                        $scope.devSn = devList[0].devSN;
                                    }
                                    firstLoad = false;
                                    $scope.devList = devList; //  加载设备列表
                                });
                            $scope.branchList = $scope.branchObj[v] || []; //  加载设备列表
                        }
                    }

                    $scope.$watch('branchObj', watchScene, true);
                    $scope.$watch('selectedScene', watchScene);
                    $scope.$watch('branchList', function (v) {
                        if (v && v.length) {
                            // 先判断当前列表有没有传进来的branch
                            var filterArr = $.grep(v, function (item) {
                                return item.groupId === $rootScope.branchName;
                            });

                            if (!$scope.branch && filterArr.length && $scope.branchName) {
                                $scope.branch = $scope.branchName;
                            } else {
                                $scope.branch = v[0].groupId;
                            }
                        } else {
                            $scope.branch = '';
                        }
                    }, true);

                    $http({
                        url: sceneInfoUrl.url,
                        method: sceneInfoUrl.method,
                        contentType: "application/json",
                        data: JSON.stringify({
                            "Method": "getdevListByUser",
                            "param": {
                                "userName": $rootScope.userInfo.attributes.name
                            }
                        }),
                        dataType: "json"
                    }).success(function (data) {
                        if (data && data.retCode == '0') {
                            var scenesList = {};
                            var scenesManageList = {};
                            angular.forEach(data.message, function (value, key, values) {
                                if (!scenesList[value.scenarioId]) {
                                    scenesList[value.scenarioId] = {
                                        id: value.scenarioId,
                                        name: value.shopName,
                                        model: value.model
                                    };
                                }

                                if (!$scope.dataList[value.scenarioId]) {
                                    $scope.dataList[value.scenarioId] = [];
                                }
                                $scope.devInfoList[value.devSN] = {
                                    devName: value.devName,
                                    devSN: value.devSN,
                                    url: value.redirectUrl
                                };
                                $scope.dataList[value.scenarioId].push($scope.devInfoList[value.devSN]);

                                var scene = {};
                                scene.id = value.scenarioId;
                                scene.name = value.shopName;
                                scene.model = value.model;
                                if (value.devSN == $scope.sceneInfo.sn) {
                                    $scope.selectedScene = scene.id;
                                }
                                var manageScene = {};
                                if(scene.model==0||scene.model==2||scene.model==5){
                                    manageScene.id = value.scenarioId;
                                    manageScene.name = value.shopName;
                                    manageScene.model = value.model; 
                                    scenesManageList[manageScene.id] = manageScene;
                                }
                                scenesList[scene.id] = scene;
                            });
                            if($rootScope.sceneInfo.model == 88){
                                $scope.scenes = scenesManageList;
                            }else{
                                $scope.scenes = scenesList;
                            } 
                            
                        }
                    }).error(function (err) {
                        console.log(err);
                    });

                    $scope.showPanel = function () {
                        $panel.toggle();
                    };
                    $scope.switchScenes = function () {
                        var branch = $scope.branch,
                            devSn = $scope.devSn,
                            shopId = $scope.selectedScene,
                            topName = $scope.branchObj[shopId + '_top'];
                        var url = sprintf(MENU_URL_TEMPLATE, 15, shopId, devSn, branch, topName);

                        console.log(branch, devSn, shopId, topName);
                        if (!branch) {
                            url = $scope.devInfoList[devSn].url.replace('oasis.h3c.com', location.hostname);
                        }
                        if($rootScope.sceneInfo.model == 88){
                            url =sprintf(PERATION_URL_TEMPLATE,shopId, devSn).replace('oasisrd.h3c.com', location.hostname);
                        }
                        location.replace(url);
                        $panel.hide();
                    };

                    $(document).on('click', function (e) {
                        var $target = $(e.target);
                        if ($target != $contain && !$.contains($contain.get(0), e.target)) {
                            $panel.hide();
                        }
                    });
                }
            };
        }]);
});