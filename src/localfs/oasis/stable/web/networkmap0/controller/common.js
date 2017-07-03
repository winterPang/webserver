/**
 * Created by Administrator on 2017/4/11.
 */
define(['jquery', 'utils', 'angular-ui-router', 'bsTable', 'dyy/cocos',
    'dyy/lib/jtopo-min', 'dyy/directive/pagechange', 'css!dyy/css/warning.css', 'css!dyy/css/page.css'], function ($, Utils) {
    return ['$scope', '$http', '$state', '$stateParams', '$alertService',
        '$compile', function ($scope, $http, $state, $stateParams, $alert, $compile) {
            g_AP = []
            var g_Template = [
                '<div class="col-xs-6 app-colum">',
                '<div class="box-body1 no-height">',
                '<div class="simple-list col-xs-12">',
                '<div class="slist-body">',
                '<div class="slist-head" style="line-height: 40px;color:black;">',
                '<div class="head-check check-column"></div>',
                '<div class="title" title="[mapName]">',
                '<div class="mapnamestyle">��ͼ����',
                '[mapName]',
                '</div>',
                '<span class="text-right link-container" style="top:0;">',
                '<a class="oper-btn edit_map_a" title="�޸�" ng-click="editmap($event)">',
                '�޸�',
                '</a>',
                ' | ',
                '<a class="oper-btn delete_map" id="del" style="margin-right: 8px;" title="ɾ��" ng-click="deletemap($event)">',
                'ɾ��',
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
            //��ʾAP
            function showApNodes(apList, scene, stage, scaleX, scaleY) {
                $.each(apList, function (ap, apInfo) {
                    var posX = apInfo.XCord / scaleX;
                    var posY = apInfo.YCord / scaleY;
                    var node = new JTopo.Node();
                    var status = 2;
                    for(var i = 0; i<g_AP.length; i++){
                        if(apInfo.apName == g_AP[i].apName){
                            status = g_AP[i].status;
                            break;
                        }
                    }
                    if(status == 1){
                        node.setImage('../dyy/cocos/res/ap_01.png', true);
                    }else if(status == 2){
                        node.setImage('../dyy/cocos/res/ap_02.png', true);
                    }else{
                        node.setImage('../dyy/cocos/res/ap_02.png', true);
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
            //��ʾ����
            function showAreaNodes(areaList, scene, stage, scaleX, scaleY) {
                $.each(areaList, function (node, areaValue) {
                    // ��������
                    var nodeColor = "";
                    if (areaValue.areaType == "location") {
                        nodeColor = "0,0,255";
                        //nodeColor = "255,255,0";
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
                        cnode.fontColor="0,0,0";
                        var xPos = parseFloat(nodeXYpos.xPos) / scaleX;
                        var yPos = parseFloat(nodeXYpos.yPos) / scaleY;
                        cnode.setLocation(xPos, yPos);
                        cnode.fillColor = nodeColor;
                        cnode.dragable = false;
                        scene.add(cnode);
                        nodes.push(cnode);
                    });

                    // ���ӽڵ�
                    var links = [];
                    for (var i = 1; i < nodes.length; i++) {
                        var link = new JTopo.Link(nodes[i - 1], nodes[i]);
                        link.strokeColor = nodeColor;
                        scene.add(link);
                        links.push(link);
                    }
                    // ��β����
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
                            devSN: $scope.sceneInfo.sn,
                            startRowIndex: 4 * (pageNum - 1),
                            maxItem: 4
                        }
                    }
                }).success(function (data) {
                    //cBack(data);
                    if (data.retCode !== 0) {
                        $alert.msgDialogSuccess(getRcString("GETMAP_FAILED")[0]);
                        //Frame.Msg.info("��ȡ��ͼ��Ϣʧ��");
                        return;//�ִ�
                    }
                    var mapInfoList = (data.data.mapList === "" ? [] : data.data.mapList);
                    $.map(mapInfoList, function (map) {
                        map.index = i++;
                    });
                    $("#MapList").children().remove();
                    $("#MapList").append($compile($.map(mapInfoList, function (map) {
                        //var bgPath = "";
                        var s = g_Template
                            .replace(/\[index\]/g, map.index)
                            .replace(/\[mapName\]/g, map.mapName)
                            .replace(/\[type\]/g, "edit")

                        return s;
                    }).join(""))($scope));
                    $.map(mapInfoList, function (map) {
                        $http({
                            method: "POST",
                            url: "/v3/wloc/image/getMap",
                            data: {
                                'devSN': $scope.sceneInfo.sn,
                                'mapName': map.mapName
                            }
                        }).success(function (data) {
                            //cBack(data);
                            if (data.retcode !== 0) {
                                //Frame.Msg.info("��ȡ"+map.mapName+"ͼƬʧ��");
                                $alert.msgDialogSuccess("��ȡ" + map.mapName + "ͼƬʧ��");
                                return;
                            }
                            var bgCanvas = document.getElementById(map.index);
                            //var bgContext = bgCanvas.getContext("2d");
                            var scaleX = 1;
                            var scaleY = 1;
                            var stage = new JTopo.Stage(bgCanvas);
                            var scene = new JTopo.Scene(stage);
                            //scene.background = bgCanvas.getAttribute("bgsrc");
                            var img = new Image();
                            stage.mode = "select";
                            img.onload = function () {
                                scaleX = img.width / 514;
                                scaleY = img.height / 257;
                                scene.background = data.image;
                                // ��ʾ���нڵ�
                                $http({
                                    method: "GET",
                                    url: "/v3/apmonitor/web/aplist?devSN=" + $scope.sceneInfo.sn
                                }).success(function (data) {
                                    //cBack(data);
                                    var apListArr = data.apList;
                                    g_AP = apListArr;
                                    showApNodes(map.apList, scene, stage, scaleX, scaleY);
                                }).error(function (data) {
                                    cBack("");
                                });
                                // ��ʾ����
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
        }]
});
