/**
 * Created by Administrator on 2016/11/9.
 */
(function ($) {
    var MODULE_NAME = "position.apply_manage";
    var g_mapName = "";
    var g_AP = [];
    var hPending = null;
    //没有地图列表时，添加此数据
    var addImg = [
        '<div class="add">',
        '<a href="#" class="add_icon" data-toggle="modal" data-target="#foraddicon"></a>',
        '</div>'
    ].join("");
    //js生成地图列表元素
    var g_Template = [
        '<div class="col-xs-6 app-colum">',
        '<div class="box-body no-height">',
        '<div class="simple-list col-xs-12">',
        '<div class="slist-body">',
        '<div class="slist-head">',
        '<div class="head-check check-column"></div>',
        '<div class="title">',
        '<div style="margin-right:100px;overflow:hidden;">地图名：',
        '[mapName]',
        '</div>',
        '<span class="text-right link-container" style="top:0;">',
        '<a class="oper-btn edit_map_a" title="修改">',
        '修改',
        '</a>',
        ' | ',
        '<a class="oper-btn delete_map" style="margin-right: 8px;" title="删除 ">',
        '删除',
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
    //添加地图接口
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
    function getMapInfo(pageNum) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                Method: "getMapInfo",
                Param: {
                    devSN: FrameInfo.ACSN,
                    startRowIndex: 4 * (pageNum - 1),
                    maxItem: 4
                }
            })
        });
    }
    //获取图片字符串
    function getImage(mapName){
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
    //删除地图接口
    function delMapFile(mapName) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc/delMapAndDirNew",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                Method: "deleteMap",
                Param: {
                    mapName: mapName,
                    devSN: FrameInfo.ACSN
                }
            })
        })
    }
    //获取AP接口
    function getApList() {
        return $.ajax({
            type: "GET",
            url: MyConfig.path + "/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
            contentType: "application/json",
            dataType: "json"
        });
    }
    function initForm(){
        $("#verlist").form("init", "edit", {"title":'添加地图',
            "btn_apply": function(){
                saveMapCallback();
            },
            "btn_cancel":function(){
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#verlist")));//关闭窗口
            }
        });
    }
    function updatebgImageNew() {
        var image = $("#picture img").attr("src");

        var data = new Date();
        var imageName = data.getTime();
        var formData = new FormData();

        formData.append("devSN", FrameInfo.ACSN);
        formData.append("mapName", $("#mapName").val());
        formData.append("imgData", image);
        formData.append("imageName", imageName);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', "/v3/wloc/backgroundnew");
        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("create bg short cut success");
                //flashShortcut();//reload map list
                Utils.Base.refreshCurPage();
                hPending.close();
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#verlist")));
            }
        }
    }
    function saveMapCallback() {
        var mapName = $("#mapName").val();
        var image = $("#picture img").attr("src");
        var areaList = [];
        var apList = [];
        var scale = Number($("#scaleValue").val());
        var type = "add";
        var re = /[^\x00-\xff]/ig;
        var re1 = /\s/ig;
        /*var bgInfo = {
         posX: 0,
         posY: 0,
         scale: 1
         };*/
        var time = new Date();
        if(Number(scale) < 0.001){
            $("#mapScale_error").html("输入参数最小为0.001");
            $("#mapScale_error").css("display","inline-block");
            return;
        }
        if(Number(scale) > 1000){
            $("#mapScale_error").html("输入参数最大为1000");
            $("#mapScale_error").css("display","inline-block");
            return;
        }
        if(mapName.match(re) && mapName.match(re).length >10){
            $("#mapName_error").html("参数输入错误");
            $("#mapName_error").css("display","inline-block");
            return;
        }
        if(mapName.match(re1) !==null){
            $("#mapName_error").html("参数不能输入空格");
            $("#mapName_error").css("display","inline-block");
            return;
        }
        if(image == undefined){
            $("#file_error").html("请上传图片");
            $("#file_error").css("display","inline-block");
            return;
        }
        $(".btn.btn-apply").attr("disabled",true);
        //if(mapName.match(re).length)
        addMapInfowithindex(mapName, scale, areaList, apList,type).done(function (data, textStatus, jqXHR) {
            if($(".btn.btn-apply").attr("disabled")){
                $(".btn.btn-apply").removeAttr("disabled");
            }
            if (data.retCode !== 0) {
                if(data.retCode == -2){
                    $("#mapName_error").css("display","inline-block");
                    $("#mapName_error").html("地图名已存在");
                    $("#mapName").focus();
                    return;
                }
                Frame.Msg.info("添加地图失败");
                console.log("addMapInfo error errormessage: " + data.errorMessage);
                return;//粗错
            }
            //console.log("addMapInfo Success");
            hPending = Frame.Msg.pending("正在添加...");
            updatebgImageNew();
        });
    }
    //显示AP
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
                node.setImage('../position/cocos/res/ap_01.png', true);
            }else if(status == 2){
                node.setImage('../position/cocos/res/ap_02.png', true);
            }else{
                node.setImage('../position/cocos/res/ap_02.png', true);
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
                cnode.fontColor="0,0,0";
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
    function initEvent(){
        $("a.add_icon, #addMapBtn").live("click", function () {//添加地图按钮
            $("#upload_file").val("");
            //$("#mapName").val("").removeAttr("disabled");

            $("#verlist").form("updateForm", {
                'mapName': '',
                'scaleValue': '',
                'upload_file': ''
            })
            //Utils.Widget.setError($('#mapName'), '');
            $("#picture").empty();
            $("#file_error,#mapScale_error,#mapName_error").css("display","none");
            if($(".btn.btn-apply").attr("disabled")){
                $(".btn.btn-apply").removeAttr("disabled");
            }
            Utils.Base.openDlg(null, {}, { scope: $("#tableDlg"), className: "modal-super dashboard" });
        });
        //上传图片
        $("#upload_file").change(function (e) {//预览图片
            e.stopPropagation();
            if (!e.target.value){
                return ;
            }
            var fileSize = e.target.files[0].size;
            if(fileSize/1048576 > 2){
                $("#file_error").html("图片大小不能超过2M");
                $("#file_error").css("display","inline-block");
            }else{
                $("#file_error").css("display","none");
                var reader = new FileReader();
                reader.onload = function (e) {
                    var logoData = e.target.result;
                    cc.loader.loadImg(logoData, { isCrossOrigin: false }, function (err, img) {
                        $("#picture").empty();
                        $("#picture").append(img);
                        //scene.background =img;
                    });
                }
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        //点击修改跳转到编辑页面
        $(".edit_map_a").live("click", function () {
            var img=$($($($(this).parent()).parent()).parent()).parent();
            //var $canvas = $(".img-responsive")[0];
            var img1=$(img).find("canvas");
            var mapName = img1.attr('mapname');
            Utils.Base.redirect({np: 'position.edit_apply',mapName:mapName});
        });
        //点击刷新按钮
        $("#refresh").click(function(){
            Utils.Base.refreshCurPage();
        })
        //删除地图
        $(".delete_map").live("click",function () {
            //弹窗
            //$("#deleteMapOK").attr("")
            Utils.Base.openDlg(null, {}, { scope: $("#deleteMapForm"), className: "modal-small" });
            var $canvas = $(".img-responsive");
            var $img = $(this).parents("div.slist-body").find($canvas);
            var mapName = $img.attr("mapName");
            g_mapName=mapName;
        });

        $("#deleteMapOK").die("click").live("click",function () {
            delMapFile(g_mapName).done(function (data, textStatus, jqXHR) {
                if (data.retCode !== 0) {
                    Frame.Msg.info("删除地图失败");
                    return;//粗错
                }
                console.log("delete map success");
                Utils.Base.refreshCurPage();
            });
        });
        /*//地图名不能输入空格
        $("#mapName").on("input",function(){
            this.value = this.value.replace(re,"");
        });*/
    }
    function callBackData(pageNum){
        var i = 0;
        getMapInfo(pageNum).done(function (data, textStatus, jqXHR) {
            if (data.retCode !== 0) {
                Frame.Msg.info("获取地图信息失败");
                return;//粗错
            }
            var mapInfoList = (data.data.mapList === "" ? [] : data.data.mapList);
            $.map(mapInfoList,function(map){
                map.index = i++;
            });
            $("#MapList").children().remove();
            $("#MapList").append($.map(mapInfoList, function (map) {
                //var bgPath = "";
                var s = g_Template
                    .replace(/\[index\]/g, map.index)
                    .replace(/\[mapName\]/g, map.mapName)
                    .replace(/\[type\]/g, "edit")
                return s;
            }).join(""));
            $.map(mapInfoList,function(map){
                getImage(map.mapName).done(function(data){
                    if(data.retcode !==0){
                        Frame.Msg.info("获取"+map.mapName+"图片失败");
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
                    img.onload = function(){
                        scaleX = img.width / 514;
                        scaleY = img.height / 257;
                        scene.background = data.image;
                        // 显示所有节点
                        showApNodes(map.apList, scene, stage, scaleX, scaleY);
                        // 显示区域
                        showAreaNodes(map.areaList, scene, stage, scaleX, scaleY);
                    }
                    img.src = data.image
                })
            })
        })
    }
    function initData(pageNum) {
        var i = 0;
        getMapInfo(pageNum).done(function (data, textStatus, jqXHR) {
            if (data.retCode !== 0) {
                Frame.Msg.info("获取地图信息失败");
                return;//粗错
            }
            var mapInfoList = (data.data.mapList === "" ? [] : data.data.mapList);
            $.map(mapInfoList,function(map){
                map.index = i++;
            });
            $("#MapList").children().remove();
            if (mapInfoList.length === 0) {
                $("#MapList").append(addImg);
                return;//空数据 当前没有地图信息
            }
            $("#MapList").append($.map(mapInfoList, function (map) {
                var bgPath = "";
                var s = g_Template
                    .replace(/\[index\]/g, map.index)
                    .replace(/\[mapName\]/g, map.mapName)
                    .replace(/\[type\]/g, "edit")
                    .replace(/\[bgSrc\]/g, bgPath);
                return s;
            }).join(""));
            $.map(mapInfoList,function(map){
                getImage(map.mapName).done(function(data){
                    if(data.retcode !==0){
                        Frame.Msg.info("获取"+map.mapName+"图片失败");
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
                    img.onload = function(){
                        scaleX = img.width / 514;
                        scaleY = img.height / 257;
                        scene.background = data.image;
                        // 显示所有节点
                        getApList().done(function (data, textStatus, jqXHR) {
                            var apListArr = data.apList;
                            g_AP = apListArr;
                            showApNodes(map.apList, scene, stage, scaleX, scaleY);
                        });

                        // 显示区域
                        showAreaNodes(map.areaList, scene, stage, scaleX, scaleY);
                    }
                    img.src = data.image
                })
            })
            $(".tcdPageCode").createPage({
                pageCount:Math.ceil(data.rowCount / 4),
                current:1,
                backFn:function(p){
                    callBackData(p);
                }
            });
        });
    }
    function _init(){
        initData(1);
        initEvent();
        initForm();
    }
    function _destroy() {

    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form", "SList", "SingleSelect", "Cocos"],
        "utils": ["Base", "Widget"]
    });
})(jQuery);
