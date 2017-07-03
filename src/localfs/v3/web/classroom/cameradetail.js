/**
 * Created by Administrator on 2016/10/12. 
 */
(function ($) {
    var MODULE_NAME = "classroom.cameradetail";
    var g_oPara = null;
    var g_buildName = null;
    var hPending;

    function getRcText(sRcName) {
        return Utils.Base.getRcString("build_rc", sRcName);
    }
    //获取摄像头名称接口
    function getCameraConfig(onSuc,onFail){
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getCameraConfig",
                Param:oParam1
            }),
            onSuccess:onSuc,
            onFailed:onFail
        }
        Utils.Request.sendRequest(Option);
    }
    //通知后台进行房间摄像头抓拍
    function notifyRoomCapture(oParam,onSuc,onFail){

        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampuswrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"realTimeRoomCapture",
                Param:oParam
            }),
            onSuccess:onSuc,
            onFailed:onFail
        };
        Utils.Request.sendRequest(Option);
    }
    //通知后台进行大门摄像头拍摄
    function notifyDoorCapture(oParam,onSuc,onFail){

        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampuswrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"realTimeDoorCapture",
                Param:oParam
            }),
            onSuccess:onSuc,
            onFailed:onFail
        };
        Utils.Request.sendRequest(Option);
    }
    //获取抓拍房间图片
    function getRoomPhoto(oParam,onSuc,onFail){
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getRoomPhoto",
                Param:oParam
            }),
            onSuccess:onSuc,
            onFailed:onFail
        };
        Utils.Request.sendRequest(Option);
    }
    //获取抓拍大门图片
    function getDoorPhoto(oParam,onSuc,onFail){
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getDoorPhoto",
                Param:oParam
            }),
            onSuccess:onSuc,
            onFailed:onFail
        };
        Utils.Request.sendRequest(Option);
    }
    //添加房间摄像头的接口
    function addCameraDetail(oParam,onSuc,onFail){
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam1,oParam);
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampuswrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"addCameraDetail",
                Param:oParam1
            }),
            onSuccess:onSuc,
            onFailed:onFail
        }
        Utils.Request.sendRequest(Option);
    }
    //获取房间摄像头信息的接口
    function getCameraDetail(pageSize, pageNum, roomName,oParam) {
        pageSize = pageSize || 5;
        pageNum = pageNum || 1;
        var oParam1 = {
            devSn:FrameInfo.ACSN,
            startRowIndex:pageSize * (pageNum-1),
            maxItem:pageSize,
            buildName:roomName
        }
        if(g_oPara.roomname){
            oParam1.buildType = "room";
        }else if(g_oPara.doorname){
            oParam1.buildType = "door";
        }
        $.extend(oParam1,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getCameraDetail',
                Param: oParam1
            }),
            onSuccess: function (data) {
                var oData=data.result.data || [];
                var aBuild=[];
                for(var i=0;i<oData.length;i++){
                    if(g_oPara.roomname){
                        var oTemp1 = {
                            cameraName:oData[i].cameraName,
                            ipAddr:oData[i].ipAddr,
                            port:oData[i].port,
                            userName:oData[i].userName,
                            password:oData[i].password
                        };
                    }else if(g_oPara.doorname){
                        var oTemp1 = {
                            placeName:oData[i].placeName,
                            cameraName:oData[i].cameraName,
                            ipAddr:oData[i].ipAddr,
                            port:oData[i].port,
                            userName:oData[i].userName,
                            password:oData[i].password
                        };
                    }

                    aBuild.push(oTemp1);
                };

                $("#camera_detail").SList ("refresh", {data: aBuild, total:data.result.rowCount });
            },
            onFailed: function (err) {
                Frame.Msg.info("读取摄像头信息失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }
    //删除房间AP的接口
    function delCameraDetail(oParam,onSuc) {
        var Param = {
            devSn: FrameInfo.ACSN
        };
        $.extend(Param,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampuswrite',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'delCameraDetail',
                Param: Param
            }),
            onSuccess:onSuc,
            onFailed: function (jqXHR,textstatus,error) {
                Frame.Msg.info("删除绑定摄像头失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }
    function addCamera() {
        if(g_oPara.roomname){
            $("#add_form").form('updateForm', {
                'cameraName':''
            });
            var closeWindow = function () {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#add_form")));
            };
            var oTempTable = {
                index: [],
                column: [
                    'cameraName'
                ]
            };
            $("#add_form").form("init", "edit", {
                "title": "新建摄像头",
                "btn_apply": function () {
                    var oStData = $("#add_form").form("getTableValue", oTempTable);
                    addCameraData(oStData);
                    closeWindow();

                }, "btn_cancel": closeWindow
            });
            $("#cameraName").val("");
            $("#s2id_cameraName .select2-chosen").html("请选择…");
            //$("#s2id_cameraName abbr").css({background: "none"});
            $("#cameraName_error").css({display: "none"});
            Utils.Base.openDlg(null, {}, {scope: $("#AddDlg"), className: "modal-super"});
        }else if(g_oPara.doorname){
            $("#addGate_form").form('updateForm', {
                'placeName':'',
                'gateCameraName':''
            });
            var closeWindow = function () {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addGate_form")));
            };
            var oTempTable = {
                index: [],
                column: [
                    'placeName',
                    'gateCameraName'
                ]
            };
            $("#addGate_form").form("init", "edit", {
                "title": "新建摄像头",
                "btn_apply": function () {
                    var oStData = $("#addGate_form").form("getTableValue", oTempTable);
                    addCameraData(oStData);
                    closeWindow();
                }, "btn_cancel": closeWindow
            });
            $("#gateCameraName").val("");
            $("#placeName").val("");
            $("#s2id_gateCameraName .select2-chosen,#s2id_placeName .select2-chosen").html("请选择…");
            //$("#s2id_placeName .select2-chosen").html("请选择…");
            //$("#s2id_cameraName abbr").css({background: "none"});
            $("#gateCameraName_error").css({display: "none"});
            $("#placeName_error").css({display: "none"});
            Utils.Base.openDlg(null, {}, {scope: $("#AddGateDlg"), className: "modal-super"});
        }
    }

    //添加房间摄像头数据
    function addCameraData(oData) {
        if(g_oPara.roomname){
            var oTemp1 = {
                buildName: g_buildName,
                buildType: "room",
                cameraName: oData["cameraName"] || "null"
            };
        }else if(g_oPara.doorname){
            var oTemp1 = {
                buildName: g_buildName,
                buildType: "door",
                placeName: oData["placeName"] || "null",
                cameraName: oData["gateCameraName"] || "null"
            };
        }


        addCameraDetail(oTemp1, onSuc, onFail);
        function onSuc(data) {
            if (data.retCode != 0) {
                if (data.retCode == -2) {
                    Frame.Msg.info("摄像头信息已存在，新建摄像头失败！");
                } else {
                    Frame.Msg.info("新建摄像头失败！");
                }
                Utils.Base.refreshCurPage();
                return;
            }
            Frame.Msg.info("新建摄像头成功！");
            Utils.Base.refreshCurPage();
        }

        function onFail() {
            Frame.Msg.info("新建摄像头失败！");
        }
    }

    //删除房间摄像头数据
    function delCamera(param) {
        var len = param.length;
        {
            Frame.Msg.confirm("是否确定删除？", function () {

                delCameraData();

            })
            function delCameraData() {
                for (var i = 0; i < param.length; i++) {
                    if(g_oPara.roomname){
                        var oTempDel = {
                            buildName: g_buildName,
                            buildType: "room",
                            cameraName: param[i].cameraName
                        };
                    }
                    else if(g_oPara.doorname){
                        var oTempDel = {
                            buildName: g_buildName,
                            buildType: "door",
                            placeName: param[i].placeName,
                            cameraName: param[i].cameraName
                        };
                    }
                    delCameraDetail(oTempDel, onSuc);
                }
            }

            function onSuc(aData) {
                len--;
                if (aData.retCode != 0) {
                    Frame.Msg.info("删除房间摄像头失败")
                    Utils.Base.refreshCurPage();
                    return;
                }
                if (len == 0) {
                    Utils.Base.refreshCurPage();
                }

            }

        }
    }
    function initSingleSelect() {
        var aCameraName = [];
        function onSuc(data){
            console.log(data);
            var oData = data.result.data;
            for(var i = 0; i<oData.length; i++){
                aCameraName.push(oData[i].cameraName)
            }
            $('#cameraName').singleSelect('InitData', aCameraName);
            $('#gateCameraName').singleSelect('InitData', aCameraName);
        }
        getCameraConfig(onSuc);
        var aPlaceName = ["门内","门外"];
        $('#placeName').singleSelect('InitData', aPlaceName);
    }
    function returnPage() {
        //返回至首页面
        Utils.Base.redirect({np: 'classroom.typicalbuild'});
        return false;
    }

    function initSlist(g_buildName){

        function formate(row, cell, value, columnDef, dataContext, type) {
            if (type == 'text') {
                return value;
            }
            switch(cell) {
                case 5:
                    var oDataContext = JSON.stringify(dataContext);
                    return  "<a href='javascript:;' class='btn' id='capture' oData="+oDataContext+" >抓拍</a>";
                    break;
                default:
                    break;
            }
        }
        var optInfo = {
            colNames: getRcText("BUILD_HEAD"),
            showHeader: true,
            multiSelect: true,
            //showOperation: true,
            pageSize:10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.cameraNameWeak= oFilter.cameraName;
                    oFilt.ipAddr = oFilter.ipAddr;
                    oFilt.port = oFilter.port;
                    oFilt.userNameWeak = oFilter.userName;
                    oFilt.password = oFilter.password;
                }
                getCameraDetail(pageSize, pageNum, g_buildName, oFilt);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.cameraNameWeak= oFilter.cameraName;
                    oFilt.ipAddr = oFilter.ipAddr;
                    oFilt.port = oFilter.port;
                    oFilt.userNameWeak = oFilter.userName;
                    oFilt.password = oFilter.password;
                }
                getCameraDetail(10, 1, g_buildName, oFilt);
            },
            colModel: [
                {name:'cameraName'},
                {name:'ipAddr'},
                {name:'port'},
                {name:'userName'},
                {name:'password'}
                //{name:'notifyCapture',formatter:formate}
            ],
            buttons: [
                {
                    name: 'class_newadd',
                    enable: "<1",
                    value:"添加",
                    mode: Frame.Button.Mode.CREATE,
                    action:addCamera
                },
                {
                    name: 'default',
                    value: '删除',
                    enable: ">0",
                    icon: 'slist-del',
                    action: delCamera
                },
                {
                    value: '抓拍',
                    enable: "==-1",
                    icon:'',
                    action: notifyCaptureRoom
                },
                {
                    value: '实况',
                    enable: "==-1",
                    icon:'',
                    action: notifyLiveData
                }
                /*{ name: 'edit', action: editRoom },
                { name: 'delete', action: delCamera }*/
            ]
        };
        //$("#camera_detail").on('click','a#capture',notifyCaptureData);

        var optInfo1 = {
            colNames: getRcText("BUILDGATE_HEAD"),
            showHeader: true,
            multiSelect: true,
            //showOperation: true,
            pageSize:10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.placeName = oFilter.placeName;
                    oFilt.cameraNameWeak= oFilter.cameraName;
                    oFilt.ipAddr = oFilter.ipAddr;
                    oFilt.port = oFilter.port;
                    oFilt.userNameWeak = oFilter.userName;
                    oFilt.password = oFilter.password;
                }
                getCameraDetail(pageSize, pageNum, g_buildName, oFilt);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.placeName = oFilter.placeName;
                    oFilt.cameraNameWeak= oFilter.cameraName;
                    oFilt.ipAddr = oFilter.ipAddr;
                    oFilt.port = oFilter.port;
                    oFilt.userNameWeak = oFilter.userName;
                    oFilt.password = oFilter.password;
                }
                getCameraDetail(10, 1, g_buildName, oFilt);
            },
            colModel: [
                {name:'placeName'},
                {name:'cameraName'},
                {name:'ipAddr'},
                {name:'port'},
                {name:'userName'},
                {name:'password'}
                //{name:'notifyCapture',formatter:formate}
            ],
            buttons: [
                {
                    name: 'class_newadd',
                    enable: "<1",
                    value:"添加",
                    mode: Frame.Button.Mode.CREATE,
                    action:addCamera
                },
                {
                    name: 'default',
                    value: '删除',
                    enable: ">0",
                    icon: 'slist-del',
                    action: delCamera
                },
                {
                    value: '抓拍',
                    enable: "==-1",
                    icon:'',
                    action: notifyCaptureDoor
                },
                {
                    value: '实况',
                    enable: "==-1",
                    icon:'',
                    action: notifyLiveData
                }
                /*{ name: 'edit', action: editRoom },
                 { name: 'delete', action: delCamera }*/
            ]
        };
        if(g_oPara.roomname){
            $("#camera_detail").SList ("head", optInfo);
        }else if(g_oPara.doorname){
            $("#camera_detail").SList ("head", optInfo1);
        }
    }

    function notifyCaptureRoom(param){
        var oTemp=param[0]
        var oTime=new Date().getTime();
        var oParam1={
            devIP: oTemp.ipAddr,
            userName: oTemp.userName
        };
        var oParam = {
            msgType: 5,
            devList: [{
                devIP: oTemp.ipAddr,
                userName: oTemp.userName,
                context: {
                    devSn: FrameInfo.ACSN,
                    roomName: g_buildName,
                    cameraName: oTemp.cameraName,
                    port: oTemp.port,
                    password: oTemp.password,
                    time: oTime
                }
            }]
        };
        $.extend(oParam1,oParam.devList[0].context)
        notifyRoomCapture(oParam,onSuc);
        function onSuc(data){
            if(data.result.retCode !=0){
                Frame.Msg.info("通知抓拍失败");
            }else if(data.result.retCode == 0){
                //Frame.Msg.info("通知抓拍成功");
                getRoomPhotoData(oParam1);
            }
        }
    }
    function getRoomPhotoData(oParam){
        //hPending = Frame.Msg.pending("获取抓拍图片...");
        var timer=null;
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#add_form")));
        };
        $('#closePhoto').on("click",function(){
            closeWindow();
        });
        var i=0;
        timer=setInterval(function(){
            getRoomPhoto(oParam,onSuc);
            i++;
        },10000);
        function onSuc(data){
            if(data){
                i=0;
                clearInterval(timer);
                Utils.Base.openDlg(null, {}, {scope: $("#getPhotoDlg"), className: "modal-super"});
            }
        }

    }
    function notifyCaptureDoor(){

    }

    function notifyLiveData(){

    }

    function initData(g_buildName){
        initSlist(g_buildName);
    }
    function _init() {
        g_oPara = Utils.Base.parseUrlPara();
        if(g_oPara.roomname){
            g_buildName = decodeURI(g_oPara.roomname);
        }else if(g_oPara.doorname){
            g_buildName = decodeURI(g_oPara.doorname);
        }

        $("#build_name").html(g_buildName + getRcText("Detail"));
        $("#return").on('click', returnPage);
        initSingleSelect();
        initData(g_buildName);
        getCameraDetail(10, 1, g_buildName);
    }

    function _destroy() {
        g_oPara = null;
        g_buildName = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Echart", "Form", "SingleSelect"],
        "utils": ["Request", "Base"]
    });
})(jQuery);

