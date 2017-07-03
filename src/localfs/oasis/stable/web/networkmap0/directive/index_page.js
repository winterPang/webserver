/**
 * Created by Administrator on 2017/4/7.
 */
define(['angularAMD', 'jquery', 'async', 'utils', 'sprintf', 'frame/service/alert', 'networkmap0/lib/jtopo-min', 'css!networkmap0/css/index-page.css'],
    function (app, $, async, utils) {
        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE = sprintf('../networkmap0/views/%s/index_page.html', sLang);
        app.directive('indexPage', ['$timeout', '$rootScope', '$http', '$q', '$alertService', '$compile', '$state',
            function ($timeout, $rootScope, $http, $q, $alert, $compile, $state) {
                return {
                    restrict: 'EA',
                    scope: {
                        region: "=indexPage"
                    },
                    replace: true,
                    controller: function ($scope, $element, $attrs, $transclude) {
                        $scope.pagination = {
                            first: "<<",
                            prev: "<",
                            next: ">",
                            last: ">>",
                            totalPages: 0,
                            paginationClass: 'pagination',
                            onPageClick: function (e, page) {
                                // console.log('new_page:' + page);
                            }
                        };
                    },
                    templateUrl: URL_TEMPLATE,
                    link: function ($scope, $element, $attrs, $ngModel) {
                        $scope.total = 0;
                        $scope.page = 1;
                        $scope.pageSize = 4;
                        function getRcString(attrName) {
                            return utils.getRcString("rc", attrName).split(',');
                        }

                        $scope.$watch('region', function (v, v2) {
                            // 区域修改后，直接返回到第一页，如果是第一页，有page修改触发查询事件，否则自动执行查询事件
                            if (v) {
                                // hide select while region change
                                $scope.total = 0;
                                // goto first page if region change
                                $scope.pagination.totalPages = 0;
                                // console.debug('region', $scope);
                                if ($scope.page == 1) {  //  第一页自动触发
                                    // console.debug('region', arguments);
                                    updateSites($scope.page, $scope.pageSize);
                                } else {  //  由pagechange执行
                                    $scope.page = 1;
                                }
                            }
                        });
                        $scope.$on('regionRefresh', function () {
                            // hide select while region change
                            /*$scope.total = 0;
                             // goto first page if region change
                             $scope.pagination.totalPages = 0;
                             $scope.page = 1;*/
                            // console.debug('regionRefresh', arguments);
                            updateSites($scope.page, $scope.pageSize);
                        });
                        $scope.$watch('page', function (v, v2) {
                            //  if change
                            if (v && v != v2) {
                                // console.debug('page', arguments);
                                updateSites($scope.page, $scope.pageSize);
                            }
                        });
                        $scope.$watch('pageSize', function (v, v2) {
                            //  if change
                            if (v && v != v2) {
                                if ($scope.page == 1) {  //  第一页自动触发
                                    // console.debug('pageSize', arguments);
                                    updateSites($scope.page, $scope.pageSize);
                                } else {  //  由pagechange自动触发
                                    $scope.page = 1;
                                }
                            }
                        });
                        $scope.deletemap = function ($event) {
                            var $canvas = $(".img-responsive");
                            var $img = $($event.target).parents("div.slist-body").find($canvas);
                            var mapName = $img.attr("mapName");
                            $alert.confirm(getRcString("DELETE_OR_CANCEL")[0], function () {
                                $http({
                                    method: 'POST',
                                    url: '/v3/wloc/delMapAndDirNew',
                                    data: {
                                        Method: "deleteMap",
                                        Param: {
                                            mapName: mapName,
                                            devSN: $rootScope.sceneInfo.sn
                                        }
                                    }
                                }).success(function (data) {
                                    if (data.retCode !== 0) {
                                        //Frame.Msg.info("删除地图失败")
                                        $alert.msgDialogError(getRcString("DELETE_FAILED")[0], 'error');
                                        return;//粗错
                                    }
                                    //Utils.Base.refreshCurPage();
                                    updateSites($scope.page, $scope.pageSize);
                                    $alert.msgDialogSuccess(getRcString("DELETE_SUCCESS")[0]);
                                }).error(function () {
                                    $alert.msgDialogError(getRcString("FAILURE_RETRY")[0], 'error');
                                });
                            });
                        }
                        $scope.editmap = function ($event) {
                            var img = $($($($($event.target).parent()).parent()).parent()).parent();
                            //var $canvas = $(".img-responsive")[0];
                            var img1 = $(img).find("canvas");
                            var mapName = img1.attr('mapName');
                            //Utils.Base.redirect({np: 'position.edit_apply',mapName:mapName});
                            //$state.go("^.edit_apply");
                            $state.go('^.edit_apply', {editData: mapName});
                        }

                        function updateSites(nPage, nPageSize) {
                            if (!(nPage && nPageSize)) {
                                return;
                            }
                            var g_AP = [];
                            var g_Template = [
                                '<div class="col-xs-6 app-colum">',
                                '<div class="box-body1 no-height">',
                                '<div class="simple-list col-xs-12">',
                                '<div class="slist-body">',
                                '<div class="slist-head" style="line-height: 40px;color:black;">',
                                '<div class="head-check check-column"></div>',
                                '<div class="title" title="[mapName]">',
                                '<div class="mapnamestyle">'+getRcString("MAP")[0],
                                '[mapName]',
                                '</div>',
                                '<span class="text-right link-container" style="top:0;">',
                                '<a class="oper-btn edit_map_a" title="'+getRcString("EDIT")[0]+'" ng-click="editmap($event)">'+getRcString("EDIT")[0],
                                //'修改',
                                '</a>',
                                ' | ',
                                '<a class="oper-btn delete_map" id="del" style="margin-right: 8px;" title="'+getRcString("DELETE")[0]+'" ng-click="deletemap($event)">'+getRcString("DELETE")[0],
                                //'删除',
                                '</a>',
                                '</span>',
                                '</div>',
                                '</div>',
                                '<div class="slist-center scroll-able">',
                                '<a class="edit_map" style="width:514px;height:257px;">',
                                '<canvas id="[index]" class="img-responsive" width="514" height="257" style="margin: 0 auto;" dialogType="[type]" mapName=[mapName] bgSrc="[bgSrc]">',
                                '</canvas>',
                                '</a>',
                                '</div>',
                                '</div>',
                                '</div>',
                                '</div>',
                                '</div>'
                            ].join("");
                            //显示AP
                            function showApNodes(apList, scene, stage, scaleX, scaleY) {
                                $.each(apList, function (ap, apInfo) {
                                    var posX = apInfo.XCord / scaleX;
                                    var posY = apInfo.YCord / scaleY;
                                    var node = new JTopo.Node();
                                    var status = 2;
                                    for (var i = 0; i < g_AP.length; i++) {
                                        if (apInfo.apName == g_AP[i].apName) {
                                            status = g_AP[i].status;
                                            break;
                                        }
                                    }
                                    if (status == 1) {
                                        node.setImage('../networkmap0/cocos/res/ap_01.png', true);
                                    } else if (status == 2) {
                                        node.setImage('../networkmap0/cocos/res/ap_02.png', true);
                                    } else {
                                        node.setImage('../networkmap0/cocos/res/ap_02.png', true);
                                    }
                                    node.setLocation(posX, posY);
                                    node.text = apInfo.apName;
                                    node.textPosition = "Bottom_Center";
                                    node.textOffsetY = -10;
                                    node.fontColor = '176,23,31';
                                    node.dragable = false;
                                    scene.add(node);
                                });
                            }

                            //显示区域
                            function showAreaNodes(areaList, scene, stage, scaleX, scaleY) {
                                $.each(areaList, function (node, areaValue) {
                                    // 区域类型
                                    var nodeColor = "";
                                    if (areaValue.areaType == "location") {
                                        //nodeColor = "255,255,0";
                                        nodeColor = "0,0,255";
                                    } else if (areaValue.areaType == "obstacle") {
                                        nodeColor = "255,0,0";
                                    } else {
                                        nodeColor = "60,179,113";
                                    }

                                    //var nodeName = areaValue.areaName + "_" + areaValue.areaType;
                                    var nodes = [];
                                    var areaNodeXYPos = areaValue.nodes;
                                    $.each(areaNodeXYPos, function (xyPos, nodeXYpos) {
                                        var cnode = new JTopo.CircleNode();
                                        cnode.radius = 6;
                                        cnode.fontColor = "0,0,0";
                                        var xPos = parseFloat(nodeXYpos.xPos) / scaleX;
                                        var yPos = parseFloat(nodeXYpos.yPos) / scaleY;
                                        cnode.setLocation(xPos, yPos);
                                        cnode.fillColor = nodeColor;
                                        cnode.dragable = false;
                                        scene.add(cnode);
                                        nodes.push(cnode);
                                    });

                                    // 连接节点
                                    var links = [];
                                    for (var i = 1; i < nodes.length; i++) {
                                        var link = new JTopo.Link(nodes[i - 1], nodes[i]);
                                        link.strokeColor = nodeColor;
                                        scene.add(link);
                                        links.push(link);
                                    }
                                    // 首尾相连
                                    var link = new JTopo.Link(nodes[nodes.length - 1], nodes[0]);
                                    scene.add(link);
                                    link.strokeColor = nodeColor;
                                    links.push(link);
                                });
                            }

                            function callBackData(pageNum) {
                                var i = 0;
                                return $http({
                                    method: "POST",
                                    url: "/v3/wloc",
                                    data: {
                                        Method: "getMapInfo",
                                        Param: {
                                            devSN: $rootScope.sceneInfo.sn,
                                            startRowIndex: 4 * (pageNum - 1),
                                            maxItem: 4
                                        }
                                    }
                                }).success(function (data) {
                                    //cBack(data);
                                    if (data.retCode !== 0) {
                                        $alert.msgDialogError(getRcString("GETMAP_FAILED")[0]);
                                        //Frame.Msg.info("获取地图信息失败");
                                        return;//粗错
                                    }
                                    success(data.rowCount);
                                    var mapInfoList = (data.data.mapList === "" ? [] : data.data.mapList);
                                    $.map(mapInfoList, function (map) {
                                        map.index = i++;
                                    });
                                    if (mapInfoList.length === 0) {
                                        //$("#MapList").append(addImg);
                                        $("#emptyAdd").css("display","block")
                                        return;//空数据 当前没有地图信息
                                    }
                                    $("#emptyAdd").css("display","none")
                                    $("#MapList1").children().remove();
                                    $("#MapList1").append($compile($.map(mapInfoList, function (map) {
                                        //var bgPath = "";
                                        var s = g_Template
                                            .replace(/\[index\]/g, map.index+''+pageNum)
                                            .replace(/\[mapName\]/g, map.mapName)
                                            .replace(/\[type\]/g, "edit")

                                        return s;
                                    }).join(""))($scope));

                                    $.map(mapInfoList, function (map) {
                                        $http({
                                            method: "POST",
                                            url: "/v3/wloc/image/getMap",
                                            data: {
                                                'devSN': $rootScope.sceneInfo.sn,
                                                'mapName': map.mapName
                                            }
                                        }).success(function (data) {
                                            //cBack(data);
                                            if (data.retcode !== 0) {
                                                //Frame.Msg.info("获取"+map.mapName+"图片失败");
                                                $alert.msgDialogError(getRcString("GETMAP_INFO")[0]);
                                                return;
                                            }
                                            //后加的
                                            var bgCanvas1 = document.getElementById(map.index+''+pageNum);
                                            if(bgCanvas1 == null){
                                                return;
                                            }
                                            ////////
                                            //var bgCanvas = document.getElementById(map.index);
                                            //var bgContext = bgCanvas.getContext("2d");
                                            var scaleX = 1;
                                            var scaleY = 1;
                                            var stage = new JTopo.Stage(bgCanvas1);
                                            var scene = new JTopo.Scene(stage);
                                            //scene.background = bgCanvas.getAttribute("bgsrc");
                                            var img = new Image();
                                            stage.mode = "select";
                                            img.onload = function () {
                                                scaleX = img.width / 514;
                                                scaleY = img.height / 257;
                                                scene.background = data.image;
                                                // 显示所有节点
                                                $http({
                                                    method: "GET",
                                                    url: "/v3/apmonitor/web/aplist?devSN=" + $rootScope.sceneInfo.sn
                                                }).success(function (data) {
                                                    //cBack(data);
                                                    var apListArr = data.apList;
                                                    g_AP = apListArr;
                                                    showApNodes(map.apList, scene, stage, scaleX, scaleY);
                                                }).error(function (data) {
                                                    cBack("");
                                                });
                                                // 显示区域
                                                showAreaNodes(map.areaList, scene, stage, scaleX, scaleY);
                                            }
                                            img.src = data.image
                                        }).error(function (data) {
                                            cBack("");
                                        });

                                    });
                                }).error(function (data) {
                                    cBack("");
                                });

                            }

                            function success(rowCount) {
                                $scope.total = rowCount;
                                updateTotal();
                            }

                            function updateTotal(nTotalCount) {
                                var nTotalPage = Math.floor($scope.total / $scope.pageSize) + ((0 != $scope.total % $scope.pageSize) ? 1 : 0);
                                $scope.pagination.totalPages = nTotalPage;
                            }

                            callBackData(nPage)
                        }
                    }
                };
            }]);
    })
