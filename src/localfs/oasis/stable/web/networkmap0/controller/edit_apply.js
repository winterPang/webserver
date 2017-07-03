/**
 * Created by Administrator on 2017/3/29.
 */
define(['jquery','utils','angular-ui-router','bsTable',
    'networkmap0/lib/jtopo-min','css!networkmap0/css/map.css'],function($,Utils) {
    return ['$scope','$http','$state','$stateParams','$alertService',
        '$compile',function($scope,$http,$state,$stateParams,$alert,$compile){
            var g_oPara = null;
            var g_mapName = $stateParams.editData;
            var g_bgSrc = null;
            var g_backgroundSrc = null;
            var currentSense = null;
            var currentNode = null;
            var currentAreaNode = null;
            var selectNodes = {};
            var areaNamesArray = [];
            var locationInfo = {};
            var g_stage = null;
            var g_scene = null;
            var g_mapScale = 1;
            var g_AP = [];
            var hPending = null;
            var g_width = null;
            var g_height = null;
            var g_apList = {};
            var g_areaList = [];
            var g_node = null;
            var g_ApX = null;
            var g_ApY = null;
            var g_startApList = [];
            var mapName= $stateParams.editData;
            $scope.mapname=mapName;
            //console.log("222222222222"+mapName);
            function getRcString(attrName){
                return Utils.getRcString("editmap_rc",attrName).split(',');
            }
            $scope.back=function(){
                $state.go('^.networkmap0');
            };
            //获取AP接口
            function getApList(cBack) {
                return $http({
                    method:"GET",
                    url:"/v3/apmonitor/web/aplist?devSN="+$scope.sceneInfo.sn,
                }).success(function(data){
                    cBack(data);
                }).error(function(data){
                    cBack("");
                });
            }

            function getFreeApList(mapName,cBack) {
                return $http({
                    method:"POST",
                    url:"/v3/wloc",
                    data:{
                        Method: "getAplist",
                        Param: {
                            devSN:$scope.sceneInfo.sn
                                }
                    }
                }).success(function(data){
                    cBack(data);
                }).error(function(data){
                    cBack("");
                });
            }

            //保存地图接口
            function addMapInfowithindex(mapName, scale, areaList, apList, type, cBack) {
                return $http({
                    method:"POST",
                    url:"/v3/wloc",
                    data:{
                        Method: "addOrModifyMap",
                        Param: {
                            devSN:$scope.sceneInfo.sn,
                            mapName: mapName,
                            scale: scale,
                            areaList: areaList,
                            apList: apList,
                            type: type
                        }
                    }
                }).success(function(data){
                    cBack(data);
                }).error(function(data){
                    cBack("");
                });
            }

            //
            function getMapInfo(cBack) {
                return $http({
                    method:"POST",
                    url:"/v3/wloc",
                    data:{
                        Method: "getMapInfo",
                        Param: {
                            devSN:$scope.sceneInfo.sn
                        }
                    }
                }).success(function(data){
                    cBack(data);
                }).error(function(data){
                    cBack("");
                });
            }

            function getImage(mapName) {
                return $http({
                    method:"POST",
                    url:"/v3/wloc/image/getMap",
                    data:{
                            devSN:$scope.sceneInfo.sn,
                        mapName: mapName
                    }
                }).success(function(data){
                    cBack(data);
                }).error(function(data){
                    cBack("");
                });
            }

            function deleteArea(mapName, area,cBack) {
                return $http({
                    method:"POST",
                    url:"/v3/wloc_clientsite",
                    data:{
                        Method: "deleteArea",
                        devSN: $scope.sceneInfo.sn,
                        Param: {
                            mapName: mapName,
                            area: area,
                            devSN: $scope.sceneInfo.sn
                        }
                    }
                }).success(function(data){
                    cBack(data);
                }).error(function(data){
                    cBack("");
                });
            }
            //显示AP
            function showApNodesInfo(apList, scene, stage) {
                $.each(apList, function (ap, apInfo) {
                    var posX = apInfo.XCord;
                    var posY = apInfo.YCord;
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
                    //node.font = apInfo.apType;
                    node.text = apInfo.apName;
                    node.textPosition = "Bottom_Center";
                    node.textOffsetY = -10;
                    node.fontColor = '176,23,31';
                    /*node.fontColor = 'transparent';*/
                    scene.add(node);
                    nodeListener(node, stage, scene);
                });
            }

            //显示区域
            function showAreaNodes(areaList, scene, stage, flag) {
                $.each(areaList, function (node, areaValue) {
                    // 区域类型
                    var nodeColor = "";
                    var areaTypeStr = "";
                    if (areaValue.areaType == "location") {
                        areaTypeStr = getRcString("LOCATIONAREA")[0];
                        //nodeColor = "255,255,0";
                        nodeColor = "0,0,255";
                    } else if (areaValue.areaType == "obstacle") {
                        areaTypeStr = getRcString("ZHANGAI")[0];
                        nodeColor = "255,0,0";
                    } else {
                        nodeColor = "60,179,113";
                        areaTypeStr = getRcString("DATALAN")[0];
                    }

                    var nodeName = areaValue.areaName + "_" + areaTypeStr;

                    var nodes = [];
                    var areaNodeXYPos = areaValue.nodes;
                    if(flag){
                        areaNamesArray.push(nodeName);
                    }
                    $.each(areaNodeXYPos, function (xyPos, nodeXYpos) {
                        var cnode = new JTopo.CircleNode(nodeName);
                        cnode.radius = 6;
                        cnode.fontColor = nodeColor;
                        var xPos = parseFloat(nodeXYpos.xPos);
                        var yPos = parseFloat(nodeXYpos.yPos);
                        cnode.setLocation(xPos, yPos);
                        cnode.fillColor = nodeColor;
                        cnode.dragable = true;
                        scene.add(cnode);
                        nodes.push(cnode);
                        areaNodeListener(cnode, stage, scene);
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
            //响应AP右键点击事件
            function handlerApRightButton(event) {
                // 隐藏区域右键菜单
                $("#contextmenu_area").hide();
                if (event.button == 2) {
                    var disX = $("#bgCanvas").offset().left;
                    var disY = $("#bgCanvas").offset().top;
                    $("#contextmenu_ap").css({
                        top: event.clientY - disY + $("#bgCanvas").position().top,
                        left: event.clientX - disX + $("#bgCanvas").position().left
                    }).show();
                }
            }

            function nodeListener(node, stage, scene) {

                var $canvas = $('canvas');

                node.addEventListener('mouseover', function (event) {
                    $canvas.unbind('mousedown');
                });
                node.addEventListener('mouseout', function (event) {
                    $canvas.bind('mousedown.imgview', function (event) {
                        $(this).data('mousedown', true)
                            .data('ps', {
                                x: event.clientX,
                                y: event.clientY
                            })
                            .data('imgPs', {
                                left: parseInt($canvas.css('left')),
                                top: parseInt($canvas.css('top'))
                            });
                        return false;
                    });
                });
                // 选中节点
                node.addEventListener('mousedown', function (event) {


                });
                node.addEventListener('mouseup', function (event) {
                    // 隐藏画布右键菜单
                    $("#contextmenu").hide();
                    // 隐藏区域节点右键菜单
                    $("#contextmenu_area").hide();
                    currentNode = this;
                    // 显示节点右键菜单
                    handlerApRightButton(event);
                    currentSense = null;
                    if(node.text == undefined){
                        handlerRightButton(event);
                    }
                });

                stage.click(function (event) {
                    if (event.button == 0) {
                        $("#contextmenu_ap").hide();
                        //$("#contextmenu_area").hide();
                    }
                });

            }

            //区域监听事件
            function areaNodeListener(node, stage, scene) {
                var $canvas = $('canvas');
                // 选中区域节点
                node.addEventListener('mouseover', function (event) {
                    $canvas.unbind('mousedown');
                });
                node.addEventListener('mouseout', function (event) {
                    $canvas.bind('mousedown.imgview', function (event) {
                        $(this).data('mousedown', true);
                        return false;
                    });
                });
                node.addEventListener('mousedown', function (event) {
                }, false);
                node.addEventListener('mouseup', function (event) {
                    var areaName = this.text;
                    // 取得区域节点信息
                    var dispayNodes = scene.getDisplayedNodes();
                    // 选中相同区域所有节点
                    var selectNodesArray = [];
                    $.each(dispayNodes, function (node, nodeValue) {
                        if (nodeValue.text == areaName) {
                            nodeValue.selected = true;
                            selectNodesArray.push(nodeValue);
                        } else {
                            nodeValue.selected = false;
                        }
                    });

                    // 隐藏画布右键菜单
                    $("#contextmenu").hide();
                    $("#contextmenu_ap").hide();
                    currentAreaNode = this;
                    // 显示区域节点右键菜单
                    handlerAreaRightButton(event);
                    currentSense = null;
                    // 删除区域节点
                    selectNodes.nodes = selectNodesArray;
                });
                // 关闭区域右键菜单
                stage.click(function (event) {
                    if (event.button == 0) {
                        $("#contextmenu_area").hide();
                    }
                });

            }

            //区域右键点击事件
            function handlerAreaRightButton(event) {
                var disX = $("#bgCanvas").offset().left;
                var disY = $("#bgCanvas").offset().top;
                if (event.button == 2) {
                    $("#contextmenu_area").css({
                        top: event.clientY - disY + $("#bgCanvas").position().top,
                        left: event.clientX - disX + $("#bgCanvas").position().left
                    }).show();
                }
            }

            //全局右键点击事件
            function handlerRightButton(event) {
                // 隐藏Ap右键菜单
                $("#contextmenu_ap").hide();
                // 隐藏区域右键菜单
                $("#contextmenu_area").hide();
                // 显示画布右键菜单
                var disX = $("#bgCanvas").offset().left;
                var disY = $("#bgCanvas").offset().top;
                if (event.button == 2) {
                    $("#contextmenu").css({
                        top: event.clientY - disY + $("#bgCanvas").position().top,
                        left: event.clientX - disX + $("#bgCanvas").position().left
                    }).show();
                    g_ApY = event.clientY - disY;
                    g_ApX = event.clientX - disX;

                }
            }

            //添加AP
            function addAp(scene, x, y, text, status) {
                var node = new JTopo.Node(text);
                if (status == 1) {
                    node.setImage('../networkmap0/cocos/res/ap_01.png', true);
                } else if (status == 2) {
                    node.setImage('../networkmap0/cocos/res/ap_02.png', true);
                } else {
                    node.setImage('../networkmap0/cocos/res/ap_02.png', true);
                }
                node.setLocation(x, y);
                /*node.font = "5px Consolas";*/
                node.fontColor = '176,23,31';
                node.textOffsetY = -8;
                node.showSelected = true;
                node.dragable = true;
                scene.add(node);
                return node;
            }

            //添加区域节点
            function addAreaNodes(areaTypeName, scene, stage, motal, nodeColor) {
                var myCanvas = document.getElementById("bgCanvas");
                var nodes = [];
                for (var i = 0; i < parseInt(motal); i++) {
                    var cnode = new JTopo.CircleNode(areaTypeName);
                    cnode.radius = 6;
                    cnode.fontColor = nodeColor;
                    var backX = g_scene.translateX;
                    var backY = g_scene.translateY;
                    var x = Math.random() * 50 + (g_ApX - backX);
                    var y = Math.random() * 50 + (g_ApY - backY);
                    cnode.setLocation(x, y);
                    cnode.fillColor = nodeColor;
                    scene.add(cnode);
                    nodes.push(cnode);
                    // 节点事件
                    areaNodeListener(cnode, stage, scene);
                }

                //$("#contextmenu1").hide();
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
            }

            //获取所有节点
            function getNodesInfo(scene) {
                // 节点信息
                locationInfo.apNodes = [];
                locationInfo.areaNodes = [];
                var dispayNodes = scene.getDisplayedNodes();
                var areaType = "";
                // 取得区域节点信息
                if (areaNamesArray != null) {
                    $.each(areaNamesArray, function (area, areaNameType) {
                        var circleNodeInfoArray = {};
                        var areaName = areaNameType.split("_")[0];
                        var areaTypeName = areaNameType.split("_")[1];
                        if (areaTypeName == getRcString("ZHANGAI")[0]) {
                            areaType = getRcString("ZHANGAI")[0];
                        } else if (areaTypeName == getRcString("LOCATIONAREA")[0]) {
                            areaType = getRcString("LOCATIONAREA")[0];
                        } else {
                            areaType = getRcString("DATALAN")[0];
                        }

                        var circleArrayTmp = [];
                        circleNodeInfoArray.areaName = areaName;
                        circleNodeInfoArray.areaType = areaType;
                        $.each(dispayNodes, function (node, nodeValue) {
                            var nodeInfoArray = {};
                            var circleNodesTmp = {};
                            if (nodeValue.text == areaNameType) {
                                circleNodesTmp.xPos = nodeValue.x;
                                circleNodesTmp.yPos = nodeValue.y;
                                circleArrayTmp.push(circleNodesTmp);
                            }
                        });
                        circleNodeInfoArray.nodes = circleArrayTmp;
                        if(circleNodeInfoArray.nodes.length !== 0){
                            locationInfo.areaNodes.push(circleNodeInfoArray);
                        }
                    });
                }

                // 取得ap节点信息
                $.each(dispayNodes, function (node, nodeValue) {
                    var nodeInfoArray = {};
                    if ($.inArray(nodeValue.text, areaNamesArray) < 0) {
                        nodeInfoArray.text = nodeValue.text;
                        nodeInfoArray.xPos = nodeValue.x;
                        nodeInfoArray.yPos = nodeValue.y;

                        locationInfo.apNodes.push(nodeInfoArray);
                    }
                });
                //return dispayNodes;
                return locationInfo;
                // console.log(locationInfo.areaNodes);
                //console.log(locationInfo.apNodes);
            }
            function updatebgImageNew(index) {
                /*var image = $("#picture img").attr("src");*/
                var data = new Date();
                var imageName = data.getTime();
                var formData = new FormData();

                formData.append("devSN", $scope.sceneInfo.sn);
                formData.append("mapName", g_mapName);
                formData.append("imgData", g_backgroundSrc);
                formData.append("imageName", imageName);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', "/v3/wloc/backgroundnew");
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        console.log("create bg short cut success");
                        //Utils.Base.redirect({np: 'position.apply_manage'});
                        $state.go('^.networkmap0');
                        //hPending.close();
                    }
                }
            }

            function initEvent() {
                //阻止鼠标右键事件
                var canvasBg = document.getElementById("bgCanvas");
                canvasBg.oncontextmenu = function(event){
                    var e = event || window.event;
                    e.preventDefault();
                    e.returnValue = false;
                };



            }
            //点击添加AP按钮
            $scope.apAdd={
                options:{
                    mId:'ap_add',
                    title:getRcString("ADDAP_TITLE")[0],
                    autoClose: false,
                    /*showCancel: true,
                     showFooter:false,
                     buttonAlign: "center",*/
                    //modalSize:'lg',
                    okHandler: function(modal,$ele){

                        var oDom = $("[name = addApForm]").next().children().eq(0);
                        var apName = $("#apNameList").val();
                        if(apName){
                            var apName = $("#apNameList").val().split(":")[1];
                        }
                        if (apName == ""||apName == null ||apName == "?") {
                            $("#addap_error").css({"display": "inline-block"});
                            $("#addap_error").html("参数必须配置");
                        }else{
                            $(oDom[0]).attr("disabled",true);
                            getApList(getApListDone);
                        }

                        //$(".addApForm .button-ok").attr("disabled",true);
                        function getApListDone(data){
                            var apListArr = data.apList;
                            var apList = {};
                            apListArr.forEach(function (ap) {
                                apList[ap.apName] = ap;
                            });
                            //var apName = $scope.apName1;
                            //var apName="ap3"
                            //var apName = $scope.apName1;
                            var backX = g_scene.translateX;
                            var backY = g_scene.translateY;
                            var x = g_ApX - backX;
                            var y = g_ApY - backY;
                            var node = addAp(g_scene, x, y, apName, apList[apName].status);
                            nodeListener(node, g_stage, g_scene);
                            if($(oDom[0]).attr("disabled")){
                                $(oDom[0]).removeAttr("disabled");
                            }
                            $scope.$broadcast('hide#ap_add');
                        }
                    },
                    cancelHandler: function(modal,$ele){
                        //Utils.Pages.closeWindow(Utils.Pages.getWindow($("#verlist")));//关闭窗口
                    },
                    beforeRender: function($ele){
                        return $ele;
                    }
                }
            };
            $scope.addAp=function(){

                var apUsed = {};
                var apNameList = [];
                var locationInfo = getNodesInfo(g_scene);
                for (var i = 0; i < locationInfo.apNodes.length; i++) {
                    //apUsedList.push({apName: locationInfo.apNodes[i].text});
                    apUsed[locationInfo.apNodes[i].text] = locationInfo.apNodes[i].text;
                }
                for (var j in g_apList) {
                    if (j in apUsed) {
                        continue;
                    } else {
                        apNameList.push(j);
                    }
                }
                //$("#apNameList").singleSelect("InitData", apNameList);
                $scope.apNameList = apNameList;
                //$scope.apName1 = apNameList[0];
                $("#contextmenu").hide();
                $("#apNameList").val("");
                $("#addap_error").css({"display": "none"});
                $scope.addApForm.$setPristine();
                $scope.addApForm.$setUntouched();
                $scope.$broadcast('show#ap_add');
            }


            //点击添加区域确定按钮
            $scope.areaAdd={
                options:{
                    mId:'area_add',
                    title:getRcString("ADDAREA_TITLE")[0],
                    autoClose: false,
                    /*showCancel: true,
                     showFooter:false,
                     buttonAlign: "center",*/
                    //modalSize:'lg',
                    okHandler: function(modal,$ele){
                        var areaName = $("#areaName").val();
                        var areaType = $("#areaType").val();
                        //if(areaType){
                        //    var areaType = $("#areaType").val().split(":")[1];
                        //}
                        //var areaType = $scope.areaType;
                        var areaTypeName = areaName + "_" + areaType;
                        var motal = $("#vertices").val();
                        var nodeColor = "";
                        var re = /[^\x00-\xff]/ig;
                        var re1 = /\s/ig;
                        var special=/^(([^\^\.<>%&',;=?$\:#@!~\]\[{}\\/`\|])*)$/ig;
                        if(areaName.match(re1) !==null){
                            $("#areaName_error").html(getRcString("KONGGE_INFO")[0]);
                            $("#areaName_error").css("display","inline-block");
                            return;
                        }
                        if(areaName.match(special)==null){
                            $("#areaName_error").html(getRcString("SPECIAL_INFO")[0]);
                            $("#areaName_error").css("display","inline-block");
                            return;
                        }
                        if (motal == "") {
                            $("#vertices_error").css({"display": "inline-block"});
                            $("#vertices_error").html(getRcString("PARAMMUST_INFO")[0]);
                        } else if (areaName == "") {
                            $("#areaName_error").css({"display": "inline-block"});
                            $("#areaName_error").html(getRcString("PARAMMUST_INFO")[0]);
                        } else if (areaType == ""||areaType == null ||areaType == "?") {
                            $("#areaType_error").css({"display": "inline-block"});
                            $("#areaType_error").html(getRcString("PARAMMUST_INFO")[0]);
                        } else {
                            var i = 0;
                            var len = areaNamesArray.length;
                            for (; i < len; i++) {
                                if (areaTypeName == areaNamesArray[i]) {
                                    break;
                                }
                            }
                            if (Number(motal) >= 2 && Number(motal) <= 10) {
                                if (i == len) {
                                    if (areaType == getRcString("LOCATIONAREA")[0]) {
                                        //nodeColor = "255,255,0";
                                        nodeColor = "0,0,255";
                                    } else if (areaType == getRcString("ZHANGAI")[0]) {
                                        nodeColor = "255,0,0";
                                    } else if (areaType == getRcString("DATALAN")[0]) {
                                        nodeColor = "60,179,113";
                                    }
                                    areaNamesArray.push(areaTypeName);
                                    addAreaNodes(areaTypeName, g_scene, g_stage, motal, nodeColor);
                                    /*nodeListener(node, g_stage, g_scene);*/
                                    //getNodesInfo(g_scene);
                                    $scope.$broadcast('hide#area_add');
                                    //Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addAreaForm")));
                                } else {
                                    $("#areaName_error").css({"display": "inline-block"});
                                    $("#areaName_error").html(getRcString("AREAEXIT_INFO")[0]);
                                }
                            } else {
                                $("#vertices_error").css({"display": "inline-block"});
                                $("#vertices_error").html(getRcString("VERTICEERROR_INFO")[0]);
                            }
                        }

                    },
                    cancelHandler: function(modal,$ele){

                    },
                    beforeRender: function($ele){
                        return $ele;
                    }
                }
            }
            $scope.addArea=function(){
                //var aAreaType = [getRcString("LOCATIONAREA")[0], getRcString("ZHANGAI")[0], getRcString("DATALAN")[0]];
				 var aAreaType = [getRcString("DATALAN")[0]];
                $scope.areaTypeList=aAreaType;
                //$scope.areaType = aAreaType[0];
                //$("#areaType").singleSelect("InitData", aAreaType);
                $("#contextmenu").hide();
                $("#vertices").val("");
                $("#areaName").val("");
                //$("#areaType").val("");
				$('#areaType').attr("disabled",true);
                $("#areaName_error,#vertices_error,#areaType_error").css({"display": "none"});
                //$("#vertices_error").css({"display": "none"});
                $scope.addAreaForm.$setPristine();
                $scope.addAreaForm.$setUntouched();
                $scope.$broadcast('show#area_add');
            }


            /**
             * 重置表单
             */
                //$scope.$on('hidden.bs.modal#account_Add', function () {
                //    // debugger
                //    //$scope.add.themeName = '';
                //    //$scope.add.themeDec = '';
                //    //// 重置表单
                //    //$scope.addForm.themeName.$setPristine();
                //    //$scope.addForm.themeName.$setUntouched();
                //    //$scope.addForm.themeDec.$setPristine();
                //    //$scope.addForm.themeDec.$setUntouched();
                //});

                //$scope.$watch('addAreaForm.$invalid', function (v) {
                //    if (v) {
                //        $scope.$broadcast('disabled.ok#area_add');
                //    } else {
                //        $scope.$broadcast('enable.ok#area_add');
                //    }
                //});
                //$scope.$watch('setScaleForm.$invalid', function (v) {
                //    if (v) {
                //        $scope.$broadcast('disabled.ok#setScale');
                //    } else {
                //        $scope.$broadcast('enable.ok#setScale');
                //    }
                //});
                //点击修改地图
            $scope.mapEdit={
                options:{
                    mId:'map_edit',
                    //title:"修改地图",
                    title:getRcString("EDITMAP_TITLE")[0],
                    autoClose: false,
                    showCancel: true,
                    buttonAlign: "center",
                    okHandler: function(modal,$ele){
                        var locationInfo = getNodesInfo(g_scene);
                        var image = $("#picture1").attr("src");
                        var myCanvas = document.getElementById("bgCanvas");
                        var canvasContain = $("#canvasContain");
                        var img = new Image();
                        if(image == undefined||image == ""){
                            $("#file_error").html(getRcString("UPLOADPIC_INFO")[0]);
                            $("#file_error").css("display","inline-block");
                            return;
                        }
                        img.src = image;
                        img.onload = function () {
                            var disW = img.width / g_width;
                            var disH = img.height / g_height;
                            myCanvas.width = img.width;
                            myCanvas.height = img.height;
                            $("#bgCanvas").css("left", 0);
                            $("#bgCanvas").css("top", 0);
                            if (myCanvas.width < canvasContain.width()) {
                                var leftPos = (canvasContain.width() - myCanvas.width) / 2;
                                $("#bgCanvas").css("left", leftPos);
                            }
                            if (myCanvas.height < canvasContain.height()) {
                                var topPos = (canvasContain.height() - myCanvas.height) / 2;
                                $("#bgCanvas").css("top", topPos);
                            }
                            $("#bgCanvas").css("border","solid 1px grey");
                            g_scene.clear();
                            areaNamesArray = [];
                            g_scene.background = image;
                            $('#canvasContain')
                                .dragger({
                                    width: canvasContain.width(),
                                    height: 600
                                }).trigger('img_loaded')
                            var areaList = locationInfo.areaNodes;
                            var apList = [];
                            $.map(areaList, function (map) {
                                for(var i = 0;i < map.nodes.length; i++){
                                    map.nodes[i].xPos *= disW;
                                    map.nodes[i].yPos *= disH;
                                }
                                if (map.areaType == getRcString("LOCATIONAREA")[0]) {
                                    map.areaType = "location"
                                } else if (map.areaType == getRcString("ZHANGAI")[0]) {
                                    map.areaType = "obstacle"
                                } else {
                                    map.areaType = "rail"
                                }

                            });
                            showAreaNodes(areaList, g_scene, g_stage, true);

                            locationInfo.apNodes.forEach(function (ele) {
                                var obj = {};
                                obj.apName = ele.text;
                                obj.XCord = ele.xPos * disW;
                                obj.YCord = ele.yPos * disH;
                                apList.push(obj);
                            });
                            showApNodesInfo(apList, g_scene, g_stage);
                            g_width = img.width;
                            g_height = img.height;
                        };
                        $scope.$broadcast('hide#map_edit');
                    },
                    cancelHandler: function(modal,$ele){

                    },
                    beforeRender: function($ele){
                        return $ele;
                    }
                }
            }
            $scope.editMap=function(){
                $("#file_error").css("display","none");
                $("#contextmenu").hide();
                $("#upload_file").val();
                $("#picture1").attr("src","");

                $scope.editMapForm.$setPristine();
                $scope.editMapForm.$setUntouched();
                $scope.$broadcast('show#map_edit');
            }

            $scope.uploadfile = function(e){
                //console.log(getObjectURL(e));
                var file = document.getElementById("upload_file");
                var pic = document.getElementById("picture1");
                if(window.FileReader){//chrome,firefox7+,opera,IE10+
                    var fileSize =file.files[0].size;
                    var fileName=file.files[0].name.toLowerCase();
                    if(/\.(gif|jpg|jpeg|JPEG|png|GIF|JPG|PNG|bmp|BMP)$/.test(fileName)){
                        //if(fileStyle=="jpg"||fileStyle=="jpeg"||fileStyle=="gif"||fileStyle=="png"||fileStyle=="bmp"){
                        if(fileSize/1048576 > 2){
                            $("#file_error").html(getRcString("PICBIG_INFO")[0]);
                            $("#file_error").css("display","inline-block");
                            $("#picture1").attr("src","");
                        }else{
                            $("#file_error").css("display","none");
                            var oFReader = new FileReader();
                            oFReader.readAsDataURL(file.files[0]);
                            oFReader.onload = function (oFREvent) {
                                //console.log(oFREvent.target.result);
                                /*pic.src = oFREvent.target.result;*/
                                pic.src = oFREvent.target.result;
                                g_backgroundSrc = pic.src;
                            };
                        }

                    }else{
                        $("#file_error").html(getRcString("PICTYPE_ERROR")[0]);
                        $("#file_error").css("display","inline-block");
                        $("#picture1").attr("src","");
                    }
                }
                //if(window.FileReader){//chrome,firefox7+,opera,IE10+
                //    var oFReader = new FileReader();
                //    oFReader.readAsDataURL(file.files[0]);
                //    oFReader.onload = function (oFREvent) {
                //        //console.log(oFREvent.target.result);
                //        /*pic.src = oFREvent.target.result;*/
                //        pic.src = oFREvent.target.result
                //    };
                //
                //}
                else if (document.all) {//IE9-//IE使用滤镜，实际测试IE6设置src为物理路径发布网站通过http协议访问时还是没有办法加载图片
                    file.select();
                    file.blur();//要添加这句，要不会报拒绝访问错误（IE9或者用ie9+默认ie8-都会报错，实际的IE8-不会报错）
                    var reallocalpath = document.selection.createRange().text//IE下获取实际的本地文件路径
                    //if (window.ie6) pic.src = reallocalpath; //IE6浏览器设置img的src为本地路径可以直接显示图片
                    //else { //非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现，IE10浏览器不支持滤镜，需要用FileReader来实现，所以注意判断FileReader先
                    pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
                    pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';//设置img的src为base64编码的透明图片，要不会显示红xx
                    // }
                }
                else if (file.files) {//firefox6-
                    if (file.files.item(0)) {
                        var url = file.files.item(0).getAsDataURL();
                        pic.src = url;
                    }
                }
                //$('#upload_img').attr("src", e.name);
            }


            //点击修改比例尺
            $scope.setScale={
                options:{
                    mId:'setScale',
                    title:getRcString("SETSCALE_TITLE")[0],
                    autoClose: false,
                    showCancel: true,
                    buttonAlign: "center",
                    okHandler: function(modal,$ele){
                        var oScale = $("#scaleValue").val();
                        //if (Number(oScale) <= 0) {
                        //    $("#scaleValue_error").html(getRcString("SCALE_INFO")[0]);
                        //    $("#scaleValue_error").css("display", "inline-block");
                        //} else {
                        //    g_mapScale = oScale;
                        //    //Utils.Pages.closeWindow(Utils.Pages.getWindow($("#setScaleForm")));
                        //    $scope.$broadcast('hide#setScale');
                        //}
                        if (Number(oScale) < 0.001) {
                            $("#scaleValue_error").html(getRcString("SCALE_INFO")[0]);
                            $("#scaleValue_error").css("display", "inline-block");
                        }else if(Number(oScale) > 1000){
                            $("#scaleValue_error").html(getRcString("SCALE_INFO")[0]);
                            $("#scaleValue_error").css("display", "inline-block");
                        } else {
                            g_mapScale = oScale;
                            //Utils.Pages.closeWindow(Utils.Pages.getWindow($("#setScaleForm")));
                            $scope.$broadcast('hide#setScale');
                        }
                    },
                    cancelHandler: function(modal,$ele){
                    },
                    beforeRender: function($ele){
                        return $ele;
                    }
                }
            }
            $scope.editScale=function(){
                $("#scaleValue_error").css("display", "none");
                //Utils.Base.openDlg(null, {}, {scope: $("#setScaleForm"), className: "modal-large"});
                $("#contextmenu").hide();
                $("#scaleValue").val('');
                $scope.setScaleForm.$setPristine();
                $scope.setScaleForm.$setUntouched();
                $scope.$broadcast('show#setScale');
            }

            $scope.deleteArea=function(){
                $("#contextmenu_area").hide();
                if (selectNodes.nodes != null) {
                    var areaName = selectNodes.nodes[0].text;
                    $.each(selectNodes.nodes, function (node, nodeValue) {
                        g_scene.remove(nodeValue);
                    });
                }
                var index = $.inArray(areaName, areaNamesArray);
                areaNamesArray.splice(index, 1);
            }

            //点击显示AP信息
            $scope.searchAp_modalOptions = {
                mId:'searchAp',
                title:getRcString("SEARCHAP_TITLE")[0],
                autoClose: true,
                showCancel: true,
                //buttonAlign: "center",
                //modalSize:'normal',
                showOk:false,
                cancelText: getRcString("CLOSE")[0],
                cancelHandler: function (modal,$ele){}
            };
            $scope.searchApInfo=function(){
                var macAddr = "";
                for (var i = 0; i < g_AP.length; i++) {
                    if (g_AP[i].apName == currentNode.text) {
                        macAddr = g_AP[i].macAddr;
                        break;
                    }
                }
                $("#info_apName").html(currentNode.text);
                $("#info_apMac").html(macAddr);
                $("#info_X").html(currentNode.x);
                $("#info_Y").html(currentNode.y);
                $scope.$broadcast("show#searchAp");
                //Utils.Base.openDlg(null, {}, {scope: $("#apInfoForm"), className: "modal-small"});
                $("#contextmenu_ap").hide();
                //getNodesInfo(g_scene);
            }


            //点击修改AP坐标
            $scope.updateAp_modalOptions ={
                mId:'updateAp',
                title:getRcString("UPDATEAP_TITLE")[0],
                //modalSize:'normal',
                //okText: $scope.info.submitChange,
                //cancelText: $scope.info.close,
                autoClose: false,
                showCancel: true,
                buttonAlign: "center",
                okHandler: function () {
                    var xupdate = $("#editX").val();
                    var yupdate = $("#editY").val();
                    var myCanvas = document.getElementById("bgCanvas");
                    if (Number(xupdate) < 0 || Number(xupdate) > myCanvas.width) {
                        $("#editX_error").css({"display": "inline-block"});
                        $("#editX_error").html(getRcString("LOCATIONX_INFO")[0]);
                    } else if (Number(yupdate) < 0 || Number(yupdate) > myCanvas.height) {
                        $("#editY_error").css({"display": "inline-block"});
                        $("#editY_error").html(getRcString("LOCATIONY_INFO")[0]);
                    } else {
                        currentNode.setLocation(Number(xupdate), Number(yupdate));
                        //Utils.Pages.closeWindow(Utils.Pages.getWindow($("#editCoordinate")));
                        $scope.$broadcast("hide#updateAp");
                    }
                },
                cancelHandler: function (modal,$ele){}
            };
            $scope.editAp=function(){
                $("#editX").val(currentNode.x);
                $("#editY").val(currentNode.y);
                $("#editX_error").css({"display": "none"});
                $("#editY_error").css({"display": "none"});
                //Utils.Base.openDlg(null, {}, {scope: $("#editCoordinate"), className: "modal-large"});
                $scope.$broadcast("show#updateAp");
                $("#contextmenu_ap").hide();
            }

            //点击删除AP
            $scope.deleteap=function(){
                $("#contextmenu_ap").hide();
                g_scene.remove(currentNode);
            }

            //点击保存
            $scope.save=function(){
                var arrArea = [];
                var aDeleteArea = [];
                var locationInfo = getNodesInfo(g_scene);
                var areaList = locationInfo.areaNodes;
                var apList = []
                var addApList = [];
                $.map(areaList, function (map) {
                    if (map.areaType == getRcString("LOCATIONAREA")[0]) {
                        map.areaType = "location"
                    } else if (map.areaType == getRcString("ZHANGAI")[0]) {
                        map.areaType = "obstacle"
                    } else {
                        map.areaType = "rail"
                    }

                });
                //for (var k = 0; k < locationInfo.apNodes.length; k++) {
                //    var obj = {};
                //    obj.apName = locationInfo.apNodes[k].text;
                //    obj.XCord = locationInfo.apNodes[k].xPos;
                //    obj.YCord = locationInfo.apNodes[k].yPos;
                //    if(obj.apName != undefined){
                //        apList.push(obj);
                //    }
                //}
                locationInfo.apNodes.forEach(function (ele) {
                    var obj = {};
                    obj.apName = ele.text;
                    obj.XCord = ele.xPos;
                    obj.YCord = ele.yPos;
                    if(obj.apName != undefined){
                        apList.push(obj);
                    }
                });
                for (var i = 0; i < apList.length; i++) {
                    for (var j = 0; j < g_AP.length; j++) {
                        if (apList[i].apName == g_AP[j].apName) {
                            apList[i].macAddr = g_AP[j].macAddr;
                            apList[i].radioList = g_AP[j].radioList;
                            break;
                        }
                    }
                }
                for(var a = 0; a < apList.length; a++){
                    for(var b = 0; b < g_startApList.length; b++){
                        if(apList[a].apName == g_startApList[b].apName){
                            break;
                        }
                    }
                    if(b == g_startApList.length){
                        addApList.push(apList[a].apName)
                    }
                }
                var scale = Number(g_mapScale);
                var time = new Date();
                var type = "modify";
                function getFreeApListdone(data){
                    if (data.retCode !== 0) {
                        //Frame.Msg.info("获取可用ap失败");
                        $alert.msgDialogError(getRcString("GETUSEAP_FAILED")[0],'error');
                        return;//粗错
                    }
                    var freeApList = data.data.aplist;
                    for(var q = 0; q < addApList.length; q++){
                        for(var w = 0; w < freeApList.length; w++){
                            if(addApList[q] == freeApList[w].apName){
                                break;
                            }
                        }
                        if(w == freeApList.length){
                            //Frame.Msg.info(addApList[q]+"已在别的地图添加");
                            $alert.msgDialogError(addApList[q]+getRcString("ALERADYADD_INFO")[0],'error');
                            //hPending.close();
                            return;
                        }
                    }
                    function addMapInfowithindexdone(data){
                        if (data.retCode !== 0) {
                            console.log("addMapInfo error errormessage: " + data.errorMessage);
                            return;//粗错
                        }
                        console.log("addMapInfo Success");
                        updatebgImageNew();
                    }
                    addMapInfowithindex(g_mapName, scale, areaList, apList, type,addMapInfowithindexdone);


                    $.map(areaList, function (map) {
                        var str = map.areaName + "_" + map.areaType;
                        arrArea.push(str);
                    });
                    for (var x = 0; x < g_areaList.length; x++) {
                        var areaStr = g_areaList[x].areaName + "_" + g_areaList[x].areaType;
                        for (var y = 0; y < arrArea.length; y++) {
                            if (areaStr == arrArea[y]) {
                                break;
                            }
                        }
                        if (y == arrArea.length) {
                            var obj = {
                                areaName: areaStr.split("_")[0],
                                areaType: areaStr.split("_")[1]
                            }
                            aDeleteArea.push(obj);
                        }
                    }
                    if (aDeleteArea.length != 0) {
                        function  deleteAreadone(){
                            if (data.retCode !== 0) {
                                return;//粗错
                            }
                        }
                        deleteArea(g_mapName, aDeleteArea, deleteAreadone);
                    }

                }
                //$scope.refresh();
                //hPending = Frame.Msg.pending("正在保存...");
                getFreeApList(g_mapName,getFreeApListdone);
            }

            function initData() {
                var myCanvas = document.getElementById("bgCanvas");
                var canvasContain = $("#canvasContain");
                var backCanvas = document.getElementById("backgroundCanvas");
                var context = backCanvas.getContext("2d");
                var img = new Image();
                var _thisApList = [];

                img.onload = function () {
                    g_width = img.width;
                    g_height = img.height;
                    myCanvas.width = img.width;
                    myCanvas.height = img.height;
                    if (myCanvas.width < canvasContain.width()) {
                        var leftPos = (canvasContain.width() - myCanvas.width) / 2;
                        $("#bgCanvas").css("left", leftPos);
                    }
                    if (myCanvas.height < canvasContain.height()) {
                        var topPos = (canvasContain.height() - myCanvas.height) / 2;
                        $("#bgCanvas").css("top", topPos);
                    }
                    $("#bgCanvas").css("border","solid 1px grey");
                    backCanvas.width = img.width;
                    backCanvas.height = img.height;
                    //$("#imgContainer").css({width:myCanvas.width,height:myCanvas.height});
                    var stage = new JTopo.Stage(myCanvas);
                    var scene = new JTopo.Scene(stage);
                    g_stage = stage;
                    g_scene = scene;
                    scene.background = g_bgSrc;
                    /* g_node = new JTopo.Node();
                     g_node.setLocation(0,0);
                     g_node.setImage(g_bgSrc);
                     g_node.setSize(img.width,img.height);
                     g_node.zIndex = 0;
                     g_node.dragable = false;
                     scene.add(g_node);
                     nodeListener(g_node, stage, scene);*/
                    scene.mode = 'select';
                    scene.areaSelect = false;
                    currentSense = stage;
                    stage.click(function (event) {
                        if (event.button == 0) {// 右键
                            // 关闭弹出菜单（div）
                            $("#contextmenu").hide();
                        }
                    });

                    stage.addEventListener('mouseup', function (event) {
                        if (currentSense == null) {
                            currentSense = this;
                        } else {
                            handlerRightButton(event);
                        }
                    });
                    //获取AP
                    /*getApList().done(function (data, textStatus, jqXHR) {
                     var apListArr = data.apList;
                     g_AP = apListArr;
                     });*/
                    //画出AP与区域
                    function getMapInfodo(data){
                        if (data.retCode !== 0) {
                            return;//粗错
                        }
                        var mapList = data.data.mapList;
                        mapList = mapList === "" ? [] : mapList;

                        function getApListdo(data){
                            var apListArr = data.apList;
                            var apList11 = {};
                            g_AP = apListArr;
                            apListArr.forEach(function (ap) {
                                apList11[ap.apName] = ap;
                            });

                            mapList.forEach(function (map) {
                                if (map.mapName == g_mapName) {//找到对应的地图
                                    //g_mapScale = Number(map.scale).toFixed(3);
                                    g_mapScale = map.scale;
                                    $("#mapScale").html(Number(map.scale).toFixed(3));
                                    var areaList = map.areaList;
                                    g_areaList = areaList;
                                    showAreaNodes(areaList, g_scene, g_stage, true);

                                    var apList = map.apList;
                                    _thisApList = apList;
                                    g_startApList = apList;
                                    showApNodesInfo(apList, g_scene, g_stage);
                                }
                            });
                            function getFreeApListdo(data){
                                if (data.retCode !== 0) {
                                    //Frame.Msg.info("获取ap失败");
                                    $alert.msgDialogError(getRcString("GETAP_FAILED")[0],'error');
                                    return;//粗错
                                }
                                (data.data.aplist || []).forEach(function (ap) {
                                    g_apList[ap.apName] = ap;
                                });
                                (_thisApList || []).forEach(function (ap) {
                                    g_apList[ap.apName] = ap
                                })
                            }
                            getFreeApList(g_mapName,getFreeApListdo);
                        }
                        getApList(getApListdo);
                    }
                    getMapInfo(getMapInfodo);
                    context.drawImage(img, 0, 0);
                    g_backgroundSrc = backCanvas.toDataURL("image/jpeg", 0.5);
                    $('#canvasContain')
                        .dragger({
                            width: canvasContain.width(),
                            height: 600
                        }).trigger('img_loaded');
                }
                img.src = g_bgSrc;
            }

            function init() {
                $http({
                    method:"POST",
                    url:"/v3/wloc/image/getMap",
                    data:{
                        'devSN':$scope.sceneInfo.sn,
                        'mapName': g_mapName
                    }
                }).success(function(data){
                    //cBack(data);
                    if (data.retcode !== 0) {
                        //Frame.Msg.info("获取"+g_mapName+"图片失败");
                        //$alert.msgDialogError(getRcString("GETAP_FAILED")[0]+g_mapName+getRcString("PICFAILED_INFO")[0]);
                        $alert.msgDialogError(getRcString("GET_INFO")[0]);
                        return;
                    }
                    g_bgSrc = data.image;
                    initData();
                    initEvent();
                }).error(function(data){
                    cBack("");
                });

            }
            init();
            $scope.refresh=function(){
                init();
            }
            function initImageview() {
                jQuery.fn.dragger = function (config) {

                    // Find Elements
                    var $container = this;
                    if ($container.length == 0) return false;
                    var $img = $container.find('canvas');

                    // console.log($container.width());

                    $img.removeData(['mousedown', 'settings']);

                    // Settings
                    config = jQuery.extend({
                        width: $container.width(),
                        height: 600
                    }, config);

                    // init-data
                    $img.data('mousedown', false);
                    $img.data('settings', config);
                    $img.data('ps', {x: 0, y: 0});
                    $img.data('imgPs', {left: 0, top: 0});

                    // CSS
                    $container
                        .height($img.data('settings').height)
                        .css({overflow: 'hidden', position: 'relative'});

                    $img.css('position', 'absolute').css($img.data('imgPs'));

                    $container.on('img_loaded', function () {
                        if ($img.data('settings').width > $img.width()) {
                            $img.data('imgPs').left = $img.data('settings').width / 2 - $img.width() / 2;
                        } else {
                            $img.data('imgPs').left = 0;
                        }
                        if ($img.data('settings').height > $img.height()) {
                            $img.data('imgPs').top = $img.data('settings').height / 2 - $img.height() / 2;
                        } else {
                            $img.data('imgPs').top = 0;
                        }
                        $img.css($img.data('imgPs'));
                    });
                    loaded();
                    function loaded() {
                        $img.on('mousedown.imgview', function (event) {
                            // console.debug('$img - mousedown.imgview');
                            $img.data('mousedown', true)
                                .data('ps', {
                                    x: event.clientX,
                                    y: event.clientY
                                })
                                .data('imgPs', {
                                    left: parseInt($img.css('left')),
                                    top: parseInt($img.css('top'))
                                });
                            return false;
                        });

                        $(document).on('mouseup.imgview', function (event) {
                            // console.debug('document - mouseup.imgview');
                            $img.data('mousedown', false)
                                .data('imgPs', {
                                    left: parseInt($img.css('left')),
                                    top: parseInt($img.css('top'))
                                });
                            return false;
                        });

                        $container.on('mouseout.imgview', function (event) {
                            // console.debug('$container - mouseout.imgview');

                            $img.data('mousedown', false)
                                .data('imgPs', {
                                    left: parseInt($img.css('left')),
                                    top: parseInt($img.css('top'))
                                });
                            return false;
                        });

                        $container.on('mousemove.imgview', function (event) {
                            // console.debug('$container - mousemove.imgview', $img.data('mousedown'));

                            // console.log('left', $img.css('left'));
                            // console.log('top', $img.css('top'));
                            if ($img.data('mousedown')) {

                                // console.debug('......', $container.width());
                                // console.debug('......', $container.height());

                                // console.debug('$img.height', $img.height());
                                // console.debug('$img.width', $img.width());

                                var dx = event.clientX - $img.data('ps').x;
                                var dy = event.clientY - $img.data('ps').y;

                                $img.data('imgPs').left = $img.data('imgPs').left + dx;
                                $img.data('imgPs').top = $img.data('imgPs').top + dy;

                                if ((dx == 0) && (dy == 0)) {
                                    return false;
                                }

                                if ($img.data('imgPs').left > 0) $img.data('imgPs').left = 0;
                                if ($img.data('imgPs').top > 0) $img.data('imgPs').top = 0;


                                if ($img.data('imgPs').left < $img.data('settings').width - $img.width()) {
                                    $img.data('imgPs').left = $img.data('settings').width - $img.width();
                                    // console.debug('right >>>>>', imgPs.left, $img.data('settings').width - $img.width());
                                }


                                if ($img.data('imgPs').top < $img.data('settings').height - $img.height()) {
                                    $img.data('imgPs').top = $img.data('settings').height - $img.height();
                                    // console.debug('bottom >>>>>', imgPs.top, $img.data('settings').height - $img.height());
                                }


                                if ($img.data('settings').width >= $img.width()) {
                                    $img.data('imgPs').left = $img.data('settings').width / 2 - $img.width() / 2;
                                }
                                if ($img.data('settings').height >= $img.height()) {
                                    $img.data('imgPs').top = $img.data('settings').height / 2 - $img.height() / 2;
                                }
                                // $img.css($img.data('imgPs'));
                                $img.animate({
                                    left: $img.data('imgPs').left,
                                    top: $img.data('imgPs').top
                                }, 100);

                                // console.debug($img.data('ps'), $img.data('imgPs'));
                                $img.data('ps', {x: event.clientX, y: event.clientY});
                            }
                            return false;
                        });
                    }

                    return this;
                };
            }
            initImageview();//dragger 拖动地图
        }]
});
