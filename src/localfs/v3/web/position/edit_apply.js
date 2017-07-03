/**
 * Created by Administrator on 2016/11/10.
 */
(function ($) {
    var MODULE_NAME = "position.edit_apply";
    var g_oPara = null;
    var g_mapName = null;
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
    //获取AP接口
    function getApList() {
        return $.ajax({
            type: "GET",
            url: MyConfig.path + "/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
            contentType: "application/json",
            dataType: "json"
        });
    }

    function getFreeApList(mapName) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                Method: "getAplist",
                Param: {
                    devSN: FrameInfo.ACSN
                }
            })
        });
    }

    //保存地图接口
    function addMapInfowithindex(mapName, scale, areaList, apList, type) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                Method: "addOrModifyMap",
                Param: {
                    devSN: FrameInfo.ACSN,
                    mapName: mapName,
                    scale: scale,
                    areaList: areaList,
                    apList: apList,
                    type: type
                }
            })
        });
    }

    //
    function getMapInfo() {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                Method: "getMapInfo",
                Param: {
                    devSN: FrameInfo.ACSN
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

    function deleteArea(mapName, area) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc_clientsite",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                Method: "deleteArea",
                devSN: FrameInfo.ACSN,
                Param: {
                    mapName: mapName,
                    area: area,
                    devSN: FrameInfo.ACSN
                }
            })
        })
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
                node.setImage('../position/cocos/res/ap_01.png', true);
            } else if (status == 2) {
                node.setImage('../position/cocos/res/ap_02.png', true);
            } else {
                node.setImage('../position/cocos/res/ap_02.png', true);
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
                areaTypeStr = "定位区域";
                nodeColor = "0,0,255";
            } else if (areaValue.areaType == "obstacle") {
                areaTypeStr = "障碍物";
                nodeColor = "255,0,0";
            } else {
                nodeColor = "60,179,113";
                areaTypeStr = "数字围栏";
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
            node.setImage('../position/cocos/res/ap_01.png', true);
        } else if (status == 2) {
            node.setImage('../position/cocos/res/ap_02.png', true);
        } else {
            node.setImage('../position/cocos/res/ap_02.png', true);
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
                if (areaTypeName == "障碍物") {
                    areaType = "障碍物";
                } else if (areaTypeName == "定位区域") {
                    areaType = "定位区域";
                } else {
                    areaType = "数字围栏";
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

        formData.append("devSN", FrameInfo.ACSN);
        formData.append("mapName", g_mapName);
        formData.append("imgData", g_backgroundSrc);
        formData.append("imageName", imageName);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "/v3/wloc/backgroundnew");
        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("create bg short cut success");
                Utils.Base.redirect({np: 'position.apply_manage'});
                hPending.close();
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
        $("#back").on("click", function () {
            Utils.Base.redirect({np: 'position.apply_manage'});
        })
        //点击添加AP按钮
        $("#addApOkBtn").click(function () {
            $(this).attr("disabled",true);
            getApList().done(function (data, textStatus, jqXHR) {
                var apListArr = data.apList;
                var apList = {};
                apListArr.forEach(function (ap) {
                    apList[ap.apName] = ap;
                });

                var apName = $("#apNameList").val();
                var backX = g_scene.translateX;
                var backY = g_scene.translateY;
                var x = g_ApX - backX;
                var y = g_ApY - backY;
                var node = addAp(g_scene, x, y, apName, apList[apName].status);
                nodeListener(node, g_stage, g_scene);
                //getNodesInfo(g_scene);
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addApForm")));
            });
        });
        $("#addAP_a").click(function () {
            // var apUsedList = [];
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
            $("#apNameList").singleSelect("InitData", apNameList);
            $("#contextmenu").hide();
            if($("#addApOkBtn").attr("disabled")){
                $("#addApOkBtn").removeAttr("disabled");
            }
            Utils.Base.openDlg(null, {}, {scope: $("#addApForm"), className: "modal-small"});
            //});
        });
        $("#addArea_a").click(function () {
            var aAreaType = ["定位区域", "障碍物", "数字围栏"];
            $("#areaType").singleSelect("InitData", aAreaType);
            $("#contextmenu").hide();
            $("#vertices").val("");
            $("#areaName").val("");
            $("#areaName_error,#vertices_error,#areaType_error").css({"display": "none"});
            if($("#addAreaOkBtn").attr("disabled")){
                $("#addAreaOkBtn").removeAttr("disabled");
            }
            //$("#vertices_error").css({"display": "none"});
            Utils.Base.openDlg(null, {}, {scope: $("#addAreaForm"), className: "modal-large"});
        });
        //点击添加区域确定按钮
        $("#addAreaOkBtn").click(function () {
            //var areaTypeName = $("#areaName").val() + "_" + $("#areaType").val();
            var areaName = $("#areaName").val();
            var areaType = $("#areaType").val();
            var areaTypeName = areaName + "_" + areaType;
            var motal = $("#vertices").val();
            var nodeColor = "";
            var re = /[^\x00-\xff]/ig;
            if (motal == "") {
                $("#vertices_error").css({"display": "inline-block"});
                $("#vertices_error").html("参数必须配置");
            } else if (areaName == "") {
                $("#areaName_error").css({"display": "inline-block"});
                $("#areaName_error").html("参数必须配置");
            } else if (areaType == "") {
                $("#areaType_error").css({"display": "inline-block"});
                $("#areaType_error").html("参数必须配置");
            } else if(areaName.match(re) && areaName.match(re).length >10){
                $("#areaName_error").css({"display": "inline-block"});
                $("#areaName_error").html("参数输入错误");
            }else {
                var i = 0;
                var len = areaNamesArray.length;
                for (; i < len; i++) {
                    if (areaTypeName == areaNamesArray[i]) {
                        break;
                    }
                }
                if (Number(motal) >= 2 && Number(motal) <= 10) {
                    $("#addAreaOkBtn").attr("disabled",true);
                    if (i == len) {
                        if (areaType == "定位区域") {
                            nodeColor = "0,0,255";
                        } else if (areaType == "障碍物") {
                            nodeColor = "255,0,0";
                        } else if (areaType == "数字围栏") {
                            nodeColor = "60,179,113";
                        }
                        areaNamesArray.push(areaTypeName);
                        addAreaNodes(areaTypeName, g_scene, g_stage, motal, nodeColor);
                        /*nodeListener(node, g_stage, g_scene);*/
                        //getNodesInfo(g_scene);
                        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addAreaForm")));
                    } else {
                        $("#areaName_error").css({"display": "inline-block"});
                        $("#areaName_error").html("该区域已存在");
                    }
                } else {
                    $("#vertices_error").css({"display": "inline-block"});
                    $("#vertices_error").html("顶点应为2-10");
                }
            }

        });
        //点击修改地图
        $("#editMap_a").click(function () {
            $("#verlist").form("updateForm", {
                'upload_file': ''
            });
            $("#picture").empty();
            $("#file_error").css("display","none");
            Utils.Base.openDlg(null, {}, {scope: $("#tableDlg"), className: "modal-large dashboard"});
            $("#contextmenu").hide();
        });
        //
        $("#upload_file").change(function (e) {//预览图片
            e.stopPropagation();
            if (!e.target.value) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var logoData = e.target.result;
                cc.loader.loadImg(logoData, {isCrossOrigin: false}, function (err, img) {
                    $("#picture").empty();
                    $("#picture").append(img);
                    g_backgroundSrc = img.src;
                    //scene.background =img;
                });
            }
            reader.readAsDataURL(e.target.files[0]);
        });
        //点击修改比例尺
        $("#editScale_a").click(function () {
            $("#scaleValue_error").css("display", "none");
            Utils.Base.openDlg(null, {}, {scope: $("#setScaleForm"), className: "modal-large"});
            $("#contextmenu").hide();
        });
        //点击修改比例尺确定按钮
        $("#setScaleOk").click(function () {
            var oScale = $("#scaleValue").val();
            if (Number(oScale) < 0.001) {
                $("#scaleValue_error").html("输入参数最小为0.001");
                $("#scaleValue_error").css("display", "inline-block");
            }else if(Number(oScale) > 1000){
                $("#scaleValue_error").html("输入参数最大为1000");
                $("#scaleValue_error").css("display", "inline-block");
            } else {
                g_mapScale = oScale;
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#setScaleForm")));
            }
            //console.log(g_mapScale);
        });
        //点击删除区域
        $("#deleteArea_a").on("click", function () {
            $("#contextmenu_area").hide();
            if (selectNodes.nodes != null) {
                var areaName = selectNodes.nodes[0].text;
                $.each(selectNodes.nodes, function (node, nodeValue) {
                    g_scene.remove(nodeValue);
                });
            }
            var index = $.inArray(areaName, areaNamesArray);
            areaNamesArray.splice(index, 1);
        });
        //点击显示AP信息
        $("#APInfo_a").click(function () {
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
            Utils.Base.openDlg(null, {}, {scope: $("#apInfoForm"), className: "modal-small"});
            $("#contextmenu_ap").hide();
            //getNodesInfo(g_scene);
        });
        //点击修改AP坐标
        $("#editAP_a").click(function () {
            $("#editX").val(currentNode.x);
            $("#editY").val(currentNode.y);
            $("#editX_error").css({"display": "none"});
            $("#editY_error").css({"display": "none"});
            Utils.Base.openDlg(null, {}, {scope: $("#editCoordinate"), className: "modal-large"});
            $("#contextmenu_ap").hide();
        });
        $("#editOkBtn").click(function () {
            var xupdate = $("#editX").val();
            var yupdate = $("#editY").val();
            var myCanvas = document.getElementById("bgCanvas");
            if (Number(xupdate) < 0 || Number(xupdate) > myCanvas.width) {
                $("#editX_error").css({"display": "inline-block"});
                $("#editX_error").html("参数应该大于0小于图片显示宽度");
            } else if (Number(yupdate) < 0 || Number(yupdate) > myCanvas.height) {
                $("#editY_error").css({"display": "inline-block"});
                $("#editY_error").html("参数应该大于0小于图片显示高度");
            } else {
                currentNode.setLocation(Number(xupdate), Number(yupdate));
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#editCoordinate")));
            }
        });
        //点击删除AP
        $("#deleteAP_a").on("click", function () {
            $("#contextmenu_ap").hide();
            g_scene.remove(currentNode);
        });
        //点击保存
        $("#save").on("click", function () {
            var arrArea = [];
            var aDeleteArea = [];
            var locationInfo = getNodesInfo(g_scene);
            var areaList = locationInfo.areaNodes;
            var apList = [];
            var addApList = [];
            $.map(areaList, function (map) {
                if (map.areaType == "定位区域") {
                    map.areaType = "location"
                } else if (map.areaType == "障碍物") {
                    map.areaType = "obstacle"
                } else {
                    map.areaType = "rail"
                }

            });
            /*for (var k = 0; k < locationInfo.apNodes.length; k++) {
                var obj = {};
                obj.apName = locationInfo.apNodes[k].text;
                obj.XCord = locationInfo.apNodes[k].xPos;
                obj.YCord = locationInfo.apNodes[k].yPos;
                if(obj.apName != undefined){
                    apList.push(obj);
                }
            }*/
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
            hPending = Frame.Msg.pending("正在保存...");
            getFreeApList(g_mapName).done(function (data, textStatus, jqXHR) {
                if (data.retCode !== 0) {
                    Frame.Msg.info("获取可用ap失败");
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
                        Frame.Msg.info(addApList[q]+"已在别的地图添加");
                        hPending.close();
                        return;
                    }
                }
                addMapInfowithindex(g_mapName, scale, areaList, apList, type).done(function (data, textStatus, jqXHR) {
                    if (data.retCode !== 0) {
                        console.log("addMapInfo error errormessage: " + data.errorMessage);
                        return;//粗错
                    }
                    console.log("addMapInfo Success");
                    updatebgImageNew();
                });

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
                    deleteArea(g_mapName, aDeleteArea).done(function (data, textStatus, jqXHR) {
                        if (data.retCode !== 0) {
                            return;//粗错
                        }
                    });
                }


            })

        });

    }

    function initForm() {
        $("#verlist").form("init", "edit", {
            "title": '修改图片',
            "btn_apply": function () {
                var locationInfo = getNodesInfo(g_scene);
                var image = $("#picture img").attr("src");
                var myCanvas = document.getElementById("bgCanvas");
                var canvasContain = $("#canvasContain");
                var img = new Image();
                if(image == undefined){
                    $("#file_error").html("请上传图片");
                    $("#file_error").css("display","inline-block");
                    return;
                }
                img.src = image;
                img.onload = function () {
                    //g_width = img.width;
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
                        if (map.areaType == "定位区域") {
                            map.areaType = "location"
                        } else if (map.areaType == "障碍物") {
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

                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#verlist")));
            },
            "btn_cancel": function () {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#verlist")));//关闭窗口
            }
        });
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
            //画出AP与区域
            getMapInfo().done(function (data, textStatus, jqXHR) {
                if (data.retCode !== 0) {
                    return;//粗错
                }
                var mapList = data.data.mapList;
                mapList = mapList === "" ? [] : mapList;

                getApList().done(function (data, textStatus, jqXHR) {
                    var apListArr = data.apList;
                    var apList11 = {};
                    g_AP = apListArr;
                    apListArr.forEach(function (ap) {
                        apList11[ap.apName] = ap;
                    });

                    mapList.forEach(function (map) {
                        if (map.mapName == g_mapName) {//找到对应的地图
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
                    getFreeApList(g_mapName).done(function (data, textStatus, jqXHR) {
                        if (data.retCode !== 0) {
                            Frame.Msg.info("获取ap失败");
                            return;//粗错
                        }
                        (data.data.aplist || []).forEach(function (ap) {
                            g_apList[ap.apName] = ap;
                        });
                        (_thisApList || []).forEach(function (ap) {
                            g_apList[ap.apName] = ap
                        })
                    })
                });

            });
            context.drawImage(img, 0, 0);
            g_backgroundSrc = backCanvas.toDataURL("image/jpeg", 0.5);
            $('#canvasContain')
                .dragger({
                    width: canvasContain.width(),
                    height: 600
                }).trigger('img_loaded')
        }
        img.src = g_bgSrc;
    }

    function _init() {
        g_oPara = Utils.Base.parseUrlPara();
        g_mapName = decodeURI(g_oPara.mapName);
        getImage(g_mapName).done(function (data) {
            if (data.retcode !== 0) {
                Frame.Msg.info("获取"+g_mapName+"图片失败");
                return;
            }
            g_bgSrc = data.image;
            initData();
            initEvent();
            initForm();
        });

    }

    function _destroy() {
        areaNamesArray = [];
        g_apList = {};
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form", "SList", "SingleSelect", "Cocos"],
        "utils": ["Base", "Widget"]
    });
})(jQuery);
