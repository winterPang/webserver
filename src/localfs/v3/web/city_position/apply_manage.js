(function ($) {
    var MODULE_NAME = "city_position.apply_manage";
    var g_BackgroundLayer;
    var g_WallLayer;
    var g_ApLayer;
    var g_TopLayer;
    var editflag = false;

    var g_Template = [
        '<div class="col-xs-6 app-colum">',
        '<div class="box-body no-height">',
        '<div class="simple-list col-xs-12">',
        '<div class="slist-body">',
        '<div class="slist-head">',
        '<div class="head-check check-column"></div>',
        '<div class="title">',
        '<div style="margin-right:100px;overflow:hidden;">',
        '[mapName]',
        '</div>',
        '<span class="text-right link-container" style="top:0;">',
        '<a class="oper-btn edit_map" title="修改">',
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
        '<a class="edit_map">',
        '<img class="img-responsive" style="margin: 0 auto;" dialogType="[type]" src=[imageSrc] mapName=[mapName] bgSrc="[bgSrc]">',
        '</a>',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join("");

    function getRcText(sRcId) {
        return Utils.Base.getRcString("apply_manage_rc", sRcId);
    }

    function getStrLen(sTem){
        var len = 0;
        for (var i=0; i<sTem.length; i++) {
            if (sTem.charCodeAt(i)>127 || sTem.charCodeAt(i)==94) {
                len += 2;
            } else {
                len ++;
            }
        }
        return len;
    }
    function getMapImage() {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc/getMapFile",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getMapallurl",
                Param: {
                    devSN: FrameInfo.ACSN //这个有问题  使用acsn获取地图信息没有数据返回
                },
                Return: ["url", "mapName", "filename"]
            })
        });
    }

    function getMapInfo() {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getMapwithindex",
                Param: {
                    devSN: FrameInfo.ACSN,
                },
                Return: ["mapName", "scale", "wallList", "apList", "bgInfo","index"]
            })
        });
    }

    function getMapFileNew(index,type) {
        return $.ajax({
            type: "GET",
            url: "/v3/wloc/image/" +FrameInfo.ACSN +'/' +  index + '/' + type,
            contentType: "application/json",
            dataType: "json"
        });
    }


    function addMapInfo(mapName, scale, wallList, apList, bgInfo,index) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "addMap",
                Param: [
                    {
                        devSN: FrameInfo.ACSN,
                        mapName: mapName,
                        scale: scale,
                        wallList: wallList,
                        apList: apList,
                        bgInfo: bgInfo,
                        index :index
                    }
                ]
            })
        });
    }

    function addMapInfowithindex(mapName, scale, wallList, apList, bgInfo,index) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "addbyindex",
                Param: [
                    {
                        devSN: FrameInfo.ACSN,
                        mapName: mapName,
                        scale: scale,
                        wallList: wallList,
                        apList: apList,
                        bgInfo: bgInfo,
                        index :index
                    }
                ]
            })
        });
    }

    function delMapFile(mapName) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc/delMapAndDir",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "delbyindex",
                Param: [{
                    mapName: mapName,
                    devSN: FrameInfo.ACSN
                }]
            })
        })
    }

    function getApList() {
        return $.ajax({
            type: "GET",
            url: MyConfig.path + "/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
            contentType: "application/json",
            dataType: "json",
        });
    }

    function getFreeApList(mapName) {
        return $.ajax({
            type: "POST",
            url: "/v3/wloc",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getFreeAplistByIndex",
                mapName: mapName,
                Param: [{
                    devSN: FrameInfo.ACSN
                }]
            })
        });
    }


    function initCanvas() {
        var BackgroundLayer = $("canvas").cocos("BackgroundLayer");
        var WallLayer = $("canvas").cocos("WallLayer");
        var ApLayer = $("canvas").cocos("ApLayer");

        var HelloWorldScene = cc.Scene.extend({
            onEnter: function () {
                this._super();
                cc.director.setDisplayStats(false);
                var bgLayer = new BackgroundLayer(true);
                this.addChild(bgLayer);
                g_BackgroundLayer = bgLayer;

                var wallLayer = new WallLayer(false);
                this.addChild(wallLayer);
                g_WallLayer = wallLayer;

                var apLayer = new ApLayer(true);
                this.addChild(apLayer);
                g_ApLayer = apLayer;


                var TopLayer = $("canvas").cocos("TopLayer");
                var topLayer = new TopLayer();
                g_TopLayer = topLayer;
                this.addChild(topLayer);
            }
        });

        cc.game.onStart = function () {
            cc.LoaderScene.preload([], function () {
                cc.director.runScene(new HelloWorldScene());
            }, this);
        };
        cc.game.run("gameCanvas");
    }

    function initGrid() {
        $("a.add_icon, #addMapBtn").live("click", function () {//添加地图按钮
            g_BackgroundLayer.clean();
            g_WallLayer.clean();
            g_ApLayer.clean();
            $("#upload_file").val("");
            $("#mapName").val("").removeAttr("disabled");
            Utils.Base.openDlg(null, {}, { scope: $("#verlist"), className: "modal-super dashboard" });
        });

        $(".edit_map").live("click", function () {
            var self = this;
            $(self).removeClass("edit_map");
            setTimeout(function () {
                $(self).addClass("edit_map");
            }, 50);
            if (editflag === true){
                return;
            }
            else{
                editflag = true;
                $("#addWallBtn").removeClass().addClass("add-wall-btn");
                g_BackgroundLayer.setEditAble(true);
                g_WallLayer.setEditAble(false);
                g_BackgroundLayer.clean();
                g_WallLayer.clean();
                g_ApLayer.clean();
                $("#upload_file").val("");

                var $img = $(this).parents("div.slist-body").find("img");
                var imgUrl = $img.attr("bgSrc");
                var imgbackground = new Image();
                imgbackground.width =700;
                imgbackground.height = 350;
                imgbackground.onload = function(){
                    var canvas1 = document.createElement('CANVAS');
                    canvas1.width = 700;
                    canvas1.height = 350;
                    var ctx = canvas1.getContext("2d");
                    ctx.drawImage(imgbackground,0, 0, 700, 350, 0, 0, 700, 350);
                    var imagebase64 = canvas1.toDataURL("image/jpeg");
                    cc.loader.loadImg(imagebase64, { isCrossOrigin: false }, function (err, img) {
                        g_BackgroundLayer.setBackgroundImage(img);
                    });

                }
                imgbackground.src = imgUrl;
                var mapNameValue =  $img.attr("mapName")
                var mapName = $.trim(mapNameValue);
                
                 $("#mapName").val(mapName).attr("disabled", "disabled");
                getMapInfo().done(function (data, textStatus, jqXHR) {
                    if (data.retCode !== 0) {
                        return;//粗错
                    }
                    g_BackgroundLayer.setBackgroundInfo(data.data.bgInfo);
                    var mapList = data.data.maplist;
                    mapList = mapList === "" ? [] : mapList;

                    getApList().done(function (data, textStatus, jqXHR) {
                        var apListArr = data.apList;
                        var apList11 = {};
                        apListArr.forEach(function (ap) {
                            apList11[ap.apName] = ap;
                        });

                        mapList.forEach(function (map) {
                            if (map.mapName == mapName) {//找到对应的地图
                                cc.scale = map.scale;

                                var wallList = map.wallList;
                                g_WallLayer.drawWallNodes(wallList);

                                var apList = map.apList;
                                apList.forEach(function (ap) {
                                    var apName = ap.apName;
                                    if (apName in apList11) {
                                        ap.status = apList11[apName].status;
                                    }
                                    else {
                                        console.log(apName + "not in apList");
                                    }
                                })
                                g_ApLayer.drawApNodes(apList);
                            }
                        });
                        Utils.Base.openDlg(null, {}, { scope: $("#verlist"), className: "modal-super dashboard" });
                    });

                });

            }

        });

        $(".delete_map").live("click",function () {
            console.log("delete");
            editflag = false;
            //弹窗
            //$("#deleteMapOK").attr("")
            var $img = $(this).parents("div.slist-body").find("img");
            var mapName = $img.attr("mapName");
            Utils.Base.openDlg(null, {}, { scope: $("#deleteMapForm"), className: "modal-small" });

            $("#deleteMapOK").live("click",function () {
                delMapFile(mapName).done(function (data, textStatus, jqXHR) {
                    if (data.retCode !== 0) {
                        return;//粗错
                    }
                    console.log("delete map success");
                    initData();
                });
            });
        });

        $("#upload_file").change(function (e) {//预览图片
            var reader = new FileReader();
            reader.onload = function (e) {
                var logoData = e.target.result;
                cc.loader.loadImg(logoData, { isCrossOrigin: false }, function (err, img) {
                    g_BackgroundLayer.setBackgroundImage(img);
                });
            }
            reader.readAsDataURL(e.target.files[0]);
        });

        function saveShortCutImage(mapName, callback) {
            
            //var mycanvas = $("canvas")[0];
            var mycanvas = $("canvas")[1];
            var image = mycanvas.toDataURL("image/jpeg", 0.8);

            $("#createShortCutImg").attr("src", image);
            var canvas1 = $("canvas")[0];
            var ctx = canvas1.getContext("2d");
            ctx.drawImage($("#createShortCutImg")[0], 50, 50, 700, 350, 0, 0, 700, 350);

            image = canvas1.toDataURL("image/jpeg", 0.8);

            var data = new Date();
            var imageName = data.getTime();
            var formData = new FormData();

            formData.append("devSN", FrameInfo.ACSN);
            formData.append("mapName", $("#mapName").val());
            formData.append("imgData", image);
            formData.append("imageName", imageName);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', "/v3/wloc/upload_shortcut");
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log("create short cut success");
                    callback();
                }
            }
        }

        function saveShortCutImageNew(mapName, index ,callback) {

            //var mycanvas = $("canvas")[0];
            var mycanvas = $("canvas")[1];
            var image = mycanvas.toDataURL("image/jpeg",0.5);

            $("#createShortCutImg").attr("src", image);
            var canvas1 = $("canvas")[0];
            var ctx = canvas1.getContext("2d");
            ctx.drawImage($("#createShortCutImg")[0], 50, 50, 700, 350, 0, 0, 700, 350);

            image = canvas1.toDataURL("image/jpeg",0.5);

            var data = new Date();
            var imageName = data.getTime();
            var formData = new FormData();

            formData.append("devSN", FrameInfo.ACSN);
            formData.append("mapName", $("#mapName").val());
            formData.append("imgData", image);
            formData.append("imageName", imageName);
            formData.append("index", index);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', "/v3/wloc/shortcut");
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log("create short cut success");
                    callback(index);
                }
            }
        }

        function updatebgImage() {
            var mycanvas = $("canvas")[1];
            g_WallLayer.clean();
            g_ApLayer.clean();
            setTimeout(function () {
                var image = mycanvas.toDataURL("image/jpeg", 0.8);

                $("#createShortCutImg").attr("src", image);
                var canvas1 = $("canvas")[0];
                var ctx = canvas1.getContext("2d");
                ctx.drawImage($("#createShortCutImg")[0], 50, 50, 700, 350, 0, 0, 700, 350);

                image = canvas1.toDataURL("image/jpeg", 0.8);

                var data = new Date();
                var imageName = data.getTime();
                var formData = new FormData();
                
                formData.append("devSN", FrameInfo.ACSN);
                formData.append("mapName", $("#mapName").val());
                formData.append("imgData", image);
                formData.append("imageName", imageName);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', "/v3/wloc/upload_shortcut");
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        console.log("create bg short cut success");
                        //callback();
                        initData();//reload map list
                        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#verlist")));
                    }
                }
            }, 500);
        }

        function updatebgImageNew(index) {
            var mycanvas = $("canvas")[1];
            g_WallLayer.clean();
            g_ApLayer.clean();
            g_ApLayer.scheduleOnce(function () {
                var image = mycanvas.toDataURL("image/jpeg", 0.5);

                $("#createShortCutImg").attr("src", image);
                var canvas1 = $("canvas")[0];
                var ctx = canvas1.getContext("2d");
                ctx.drawImage($("#createShortCutImg")[0], 50, 50, 700, 350, 0, 0, 700, 350);

                image = canvas1.toDataURL("image/jpeg",0.5);

                var data = new Date();
                var imageName = data.getTime();
                var formData = new FormData();

                formData.append("devSN", FrameInfo.ACSN);
                formData.append("mapName", $("#mapName").val());
                formData.append("imgData", image);
                formData.append("imageName", imageName);
                formData.append("index", index);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', "/v3/wloc/background");
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        console.log("create bg short cut success");
                        //callback();
                        flashShortcut();//reload map list
                        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#verlist")));
                    }
                }
            },0);
        }
        


        $("#saveMap").click(function () {
            editflag = false;
            var mapName = $("#mapName").val();
            var wallList = g_WallLayer.getWallList();
            var apList = g_ApLayer.getApList();
            var bgInfo = g_BackgroundLayer.getBackgroundInfo();
            var time = new Date();
            var index = time.getTime() + "";
            if (mapName === "") {
                alert("地图名不能为空");
                return;
            }
            var regular = /\s+/g;
            if (regular.test(mapName)) {
                alert('地图名不能输入空格!');
                return false;
            }

            addMapInfowithindex(mapName, cc.scale, wallList, apList, bgInfo, index).done(function (data, textStatus, jqXHR) {
                if (data.retCode !== 0) {
                    console.log("addMapInfo error errormessage: " + data.errorMessage);
                    return;//粗错
                }
                console.log("addMapInfo Success");

                saveShortCutImageNew(mapName, index,updatebgImageNew);
            });
        });

        $("#closeMap").click(function () {
            editflag = false;
            return;
        });

        $(".close").click(function () {
            editflag = false;
            return;
        });

        $("#addApOkBtn").click(function () {

            getApList().done(function (data, textStatus, jqXHR) {
                var apListArr = data.apList;
                var apList = {};
                apListArr.forEach(function (ap) {
                    apList[ap.apName] = ap;
                });

                var apName = $("#apNameList").val();
                var size = cc.winSize;
                g_ApLayer.drawApNodes([{
                    apName: apName,
                    macAddr: apList[apName].macAddr,
                    status: apList[apName].status,
                    XCord: size.width / 2,
                    YCord: size.width / 4,
                }]);
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addApForm")));
            });
        });
    }
    
    var addImg = [
        '<div class="add">',
        '<a href="#" class="add_icon" data-toggle="modal" data-target="#foraddicon"></a>',
        '</div>'
    ].join("");

    function flashShortcut(){
        getMapInfo().done(function (data, textStatus, jqXHR){
            if (data.data.retCode !== 0) {
                return;//粗错
            }
            var mapInfoList = (data.data.maplist === "" ? [] : data.data.maplist);

            if (mapInfoList.length === 0) {
                $("#MapList").append(addImg);
                return;//空数据 当前没有地图信息
            }
            $.map(mapInfoList, function (map){
                getMapFileNew(map.index, 'shortcut');
                getMapFileNew(map.index, 'background');
                initData();
            });

        })
    }
    

    function initData() {
        getMapInfo().done(function (data, textStatus, jqXHR) {
            if (data.data.retCode !== 0) {
                return;//粗错
            }
            var mapInfoList = (data.data.maplist === "" ? [] : data.data.maplist);
            $("#MapList").children().remove();
            if (mapInfoList.length === 0) {
                $("#MapList").append(addImg);
                return;//空数据 当前没有地图信息
            }
            $("#MapList").append($.map(mapInfoList, function (map) {
                var mapPath  = "/v3/wloc/image/" + FrameInfo.ACSN + '/'+ map.mapName +'/'+'shortcut';
                var bgPath = "/v3/wloc/image/" + FrameInfo.ACSN + '/'+ map.mapName +'/'+'background';
                var s = g_Template
                    .replace(/\[imageSrc\]/g, mapPath)
                    .replace(/\[mapName\]/g, map.mapName)
                    .replace(/\[type\]/g, "edit")
                    .replace(/\[bgSrc\]/g, bgPath);
                return s;
            }).join(""));
        });
    }

    function _init() {
        initCanvas();
        initGrid();
        initData();

        $("#Cocos2dGameContainer")
            .append('<div class="scale-small-btn" id="scaleSmallBtn" style=" cursor:pointer;" title="'+(getRcText("scaleSmallBtn").split(","))+'"></div>')
            .append('<div class="scale-big-btn" id="scaleBigBtn" style=" cursor:pointer;" title="'+(getRcText("scaleBigBtn").split(","))+'"></div>')
            .append('<div class="add-ap-btn"  id="addApBtn" style=" cursor:pointer;" title="'+(getRcText("addApBtn").split(","))+'"></div>')
            .append('<div class="add-wall-btn" id="addWallBtn" style=" cursor:pointer;" title="'+(getRcText("addWallBtn").split(","))+'"></div>')
            .append('<div class="set-scale-btn" id="setScaleBtn" style=" cursor:pointer;" title="'+(getRcText("setScaleBtn").split(","))+'"></div>');

        $("#addApBtn").click(function () {
            console.log("app ap btn");
            var mapName = $("#mapName").val();
            getFreeApList(mapName).done(function (data, textStatus, jqXHR) {
                if (data.retCode !== 0) {
                    return;//粗错
                }
                var apList = {};
                (data.data.aplist || []).forEach(function (ap) {
                    apList[ap.apName] = ap;
                });

                var apUsedList = g_ApLayer.getApList();
                apUsedList.forEach(function (ap) {
                    if (ap.apName in apList) {
                        delete apList[ap.apName];
                    }
                });

                var apNameList = [];
                for (var apName in apList) {
                    apNameList.push(apName);
                }
                $("#apNameList").singleSelect("InitData", apNameList);
                Utils.Base.openDlg(null, {}, { scope: $("#addApForm"), className: "modal-small" });
            });
        });
        $("#addWallBtn").click(function () {
            if ($(this).hasClass("add-wall-btn")) {
                $(this).removeClass("add-wall-btn").addClass("add-wall-close-btn");
                g_BackgroundLayer.setEditAble(false);
                g_WallLayer.setEditAble(true);
            }
            else {
                $(this).removeClass("add-wall-close-btn").addClass("add-wall-btn");
                g_BackgroundLayer.setEditAble(true);
                g_WallLayer.setEditAble(false);
            }
        });

        $("#scaleBigBtn").click(function () {
            //console.log(g_BackgroundLayer.Scale);
            g_BackgroundLayer.setBgScale(0.2);
        });

        $("#scaleSmallBtn").click(function () {
            g_BackgroundLayer.setBgScale(-0.2);
        });

        $("#setScaleBtn").click(function () {
            $("#scaleValue").val(cc.scale);
            Utils.Base.openDlg(null, {}, { scope: $("#setScaleForm"), className: "modal-small" });
        });

        $("#setScaleOk").click(function () {
            var scale = $("#scaleValue").val();
            cc.scale = scale;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#setScaleForm")));
        });

        function MouseMove(divbtn){
            $(divbtn).mouseover(function(e){
                var tooltip="<div id='tooltip'>"+this.title+"</div>";
                $("body").append(tooltip);
                $("#tooltip")
                    .css({
                        "top": e.pageY + "px",
                        "left": e.pageX + "px"
                    }).show("fast");
            }).mouseout(function(){
                $("#tooltip").remove();
            });
        }
        MouseMove("#scaleBigBtn");
        MouseMove("#scaleSmallBtn");
        MouseMove("#addApBtn");
        MouseMove("#addWallBtn");
        MouseMove("#setScaleBtn");
        Utils.Widget.autoCheckForm($("#verlist"));
    }

    function _destroy() {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form", "SList", "SingleSelect", "Cocos"],
        "utils": ["Base", "Widget"],
    });
})(jQuery);