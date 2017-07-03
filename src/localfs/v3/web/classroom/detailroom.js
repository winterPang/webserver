/**
 * Created by Administrator on 2016/10/12.
 */
(function ($) {
    var MODULE_NAME = "classroom.detailroom";
    var g_oPara = null;
    var g_roomName = null;
    var g_Ap = [];
    var dRoom=[];
    var eGate = [];
    var dGate = [];

    function getRcText(sRcName) {
        return Utils.Base.getRcString("room_rc", sRcName);
    }

    //获取AP，得到现有ap与ap序列号
    function getAp(Number, onSuccess) {
        var Option = {
            type: "GET",
            url: MyConfig.path + "/apmonitor/app/aplist?devSN=" + FrameInfo.ACSN + "&startNum=" + Number,
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                startNum: Number
            }),
            onSuccess: onSuccess,
            onFailed: function (jqXHR, textstatus, error) {
                Frame.Msg.info("获取AP失败", "error");
            }
        };
        Utils.Request.sendRequest(Option);
    }

    //获取AP信息，得到AP的信息
    function getApInfo(apSN) {
        var Option = {
            type: "GET",
            url: MyConfig.path + "/apmonitor/app/apinfo?devSN=" + FrameInfo.ACSN + "&apSN=" + apSN,
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                apSN: apSN
            }),
            onSuccess: function (data) {
                //console.log(data);
            },
            onFailed: function (jqXHR, textstatus, error) {
                Frame.Msg.info("获取AP失败", "error");
            }
        };
        Utils.Request.sendRequest(Option);
    }
    //添加房间AP的接口
    function setRoomConfig(oParam,onSuc,onFail){
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
                Method:"setRoomConfig",
                Param:oParam1
            }),
            onSuccess:onSuc,
            onFailed:onFail
        }
        Utils.Request.sendRequest(Option);
    }
    //获取房间信息的接口
    function getRoomConfig(pageSize, pageNum, roomName,oParam) {
        pageSize = pageSize || 5;
        pageNum = pageNum || 1;
        var oParam1 = {
            devSn:FrameInfo.ACSN,
            startRowIndex:pageSize * (pageNum-1),
            maxItem:pageSize,
            roomName:roomName
        }
        $.extend(oParam1,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getRoomConfig',
                Param: oParam1
            }),
            onSuccess: function (data) {
                var oData=data.result.data;
                var aRoom=[];
                for(var i=0;i<oData.length;i++){
                    var oTemp1 = {
                        type:oData[i].type != "null" ? oData[i].type : "",
                        apName: oData[i].apName == "null" ? "" : oData[i].apName,
                        apSerialId: oData[i].apSerialId == "null" ? "" : oData[i].apSerialId,
                        moduleId: oData[i].moduleId == "null" ? "" : oData[i].moduleId,
                        moduleSerialId: oData[i].moduleSerialId == "null" ? "" : oData[i].moduleSerialId
                    };
                    aRoom.push(oTemp1);
                }
                $("#room-detail").SList ("refresh", {data: aRoom, total: data.result.rowCount});
            },
            onFailed: function (err) {
                Frame.Msg.info("读取房间AP失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }
    //删除房间AP的接口
    function delRoomConfig(oParam,onSuc) {
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
                Method: 'delRoomConfig',
                Param: Param
            }),
            onSuccess:onSuc,
            onFailed: function (jqXHR,textstatus,error) {
                Frame.Msg.info("删除房间AP失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }
    function addRoom() {
        initEvent();
        $("#add_form").form('updateForm', {
            'apType':"未选择",
            'classAP':"未选择",
            'scanner':"",
            'scannerSerial':"",
            'classModule':"未选择",
            'serial':''
        });
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#add_form")));
        };
        var oTempTable = {
            index: [],
            column: [
                'apType',
                'classAP',
                'scanner',
                'scannerSerial',
                'classModule',
                'serial'
            ]
        };
        $("#add_form").form("init", "edit", {
            "title": "新建房间AP",
            "btn_apply": function () {
                var oStData = $("#add_form").form("getTableValue", oTempTable);
                if ($("#serial").val() != "" && $("#classModule").val() == "") {
                    $("#classModule_error").css({display: "inline-block", height: "22px", width: "130px"});
                    $("#classModule_error").html("请添加模块名称");
                } else {
                    addRoomData(oStData);
                    closeWindow();
                }
            }, "btn_cancel": closeWindow
        });
        $("#classAP,#classModule,#serial").val("");
        $("#s2id_classAP .select2-chosen,#s2id_classModule .select2-chosen").html("请选择…");
        $("#s2id_classAP abbr,#s2id_classModule abbr").css({background: "none"});
        $("#classAP_error,#apType_error,#scanner_error,#scannerSerial_error,#classModule_error,#serial_error").css({display: "none"});
        $("input[type=text]", $("#add_form")).each(function () {
            Utils.Widget.setError($(this), "");
        });
        $("#s2id_classAP .select2-arrow b").attr("style","display:block");
        $("#classAP").removeAttr("disabled");
        Utils.Base.openDlg(null, {}, {scope: $("#AddDlg"), className: "modal-super"});
    }

//添加房间数据
    function addRoomData(roomData) {
        var apSerial = "";

        if(roomData["apType"]=="AP"){
            for (var j = 0; j < g_Ap.length; j++) {
                if (roomData["classAP"] == g_Ap[j].apName) {
                    apSerial = g_Ap[j].apSN;
                }
            }
            var oTemp1 = {
                roomName: g_roomName,
                type:roomData["apType"] || "null",
                apName: roomData["classAP"] || "null",
                apSerialId: apSerial || "null",
                moduleId: roomData["classModule"] || "null",
                moduleSerialId: roomData["serial"] || "null"
            };
        }else{
            var oTemp1 = {
                roomName: g_roomName,
                type:roomData["apType"] || "null",
                apName: roomData["scanner"] || "null",
                apSerialId: roomData["scannerSerial"] || "null",
                moduleId: "null",
                moduleSerialId: "null"
            };
        }

        setRoomConfig(oTemp1, onSuc, onFail);
        function onSuc(data) {
            if (data.retCode != 0) {
                if (data.retCode == -2) {
                    Frame.Msg.info("ap与模块不能重复绑定，新建房间AP失败！");
                } else {
                    Frame.Msg.info("新建房间AP失败！");
                }
                Utils.Base.refreshCurPage();
                return;
            }
            Frame.Msg.info("新建房间AP成功！");
            Utils.Base.refreshCurPage();
        }

        function onFail() {
            Frame.Msg.info("新建房间AP失败！");
        }
    }

//编辑房间数据
    function modifyRoomData(roomData) {
        var apSerial = "";
        if(roomData["apType"]=="AP"){
            for (var j = 0; j < g_Ap.length; j++) {
                if (roomData["classAP"] == g_Ap[j].apName) {
                    apSerial = g_Ap[j].apSN;
                }
            }
            var oTemp1 = {
                roomName: g_roomName,
                type:roomData["apType"] || "null",
                apName: roomData["classAP"] || "null",
                apSerialId: apSerial || "null",
                moduleId: roomData["classModule"] || "null",
                moduleSerialId: roomData["serial"] || "null"
            };
        }else{
            var oTemp1 = {
                roomName: g_roomName,
                type:roomData["apType"] || "null",
                apName: roomData["scanner"] || "null",
                apSerialId: roomData["scannerSerial"] || "null",
                moduleId: "null",
                moduleSerialId: "null"
            };
        }
        setRoomConfig(oTemp1, onSuc, onFail);
        function onSuc(data) {
            if (data.retCode != 0) {
                Frame.Msg.info("编辑房间AP失败！");
                Utils.Base.refreshCurPage();
                return;
            }
            Frame.Msg.info("编辑房间AP成功！");
            Utils.Base.refreshCurPage();
        }

        function onFail() {
            Frame.Msg.info("编辑房间AP失败！");
        }
    }

//编辑房间弹出框
    function editRoom(param) {
        initEvent();
        dRoom = param;
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#add_form")));
        };
        var oTempTable = {
            index: [],
            column: [
                'apType',
                'classAP',
                'scanner',
                'scannerSerial',
                'classModule',
                'serial'
            ]
        };
        $("#add_form").form("init", "edit", {
            "title": "编辑房间",
            "btn_apply": function () {
                var oStData = $("#add_form").form("getTableValue", oTempTable);
                if ($("#serial").val() != "" && $("#classModule").val() == "") {
                    $("#classModule_error").css({display: "inline-block", height: "22px", width: "130px"});
                    $("#classModule_error").html("请添加模块名称");
                } else {
                    delRoom(dRoom, oStData);
                    closeWindow();
                }
            }, "btn_cancel": closeWindow
        });
        if (param[0].type) {
            if (param[0].type == "AP") {
                $("#scannerDiv,#scannerSerialDiv").css("display", "none");
                $("#gateApDiv,#moduleDiv,#moduleSerialDiv").css("display", "block");
                $("#add_form").form('updateForm', {
                    'apType': param[0].type,
                    'classAP': param[0].apName,
                    'classModule': param[0].moduleId,
                    'serial': param[0].moduleSerialId
                });
            } else if (param[0].type == "阅读器") {
                $("#scannerDiv,#scannerSerialDiv").css("display", "block");
                $("#gateApDiv,#moduleDiv,#moduleSerialDiv").css("display", "none");
                $("#add_form").form('updateForm', {
                    'apType': param[0].type,
                    'scanner': param[0].apName,
                    'scannerSerial': param[0].apSerialId
                });
            }
        }else{
            $("#scannerDiv,#scannerSerialDiv").css("display", "none");
            $("#gateApDiv,#moduleDiv,#moduleSerialDiv").css("display", "block");
            $("#add_form").form('updateForm', {
                'apType': param[0].type,
                'classAP': param[0].apName,
                'classModule': param[0].moduleId,
                'serial': param[0].moduleSerialId
            });
        }
        if (!(param[0].moduleId)) {
            $("#s2id_classModule .select2-chosen").html("请选择…");
            $("#s2id_classModule abbr").css({display: "none"});
            $("#classModule").val("");
        }
        $("input[type=text]", $("#add_form")).each(function () {
            Utils.Widget.setError($(this), "");
        });
        //$("#s2id_classAP .select2-arrow b").attr("style","display:none");
        $("#apType_error,#classAP_error,#scanner_error,#scannerSerial_error,#classModule_error,#serial_error").css({display: "none"});
        Utils.Base.openDlg(null, {}, {scope: $("#AddDlg"), className: "modal-super"});
        //$("#classAP").attr({ disabled: "disabled" });
    }

    //删除房间数据
    function delRoom(param, oStData) {
        var len = param.length;
        if (oStData != "default" && oStData) {

            delRoomData();

        } else {
            Frame.Msg.confirm("是否确定删除？", function () {

                delRoomData();

            })
        }
        function delRoomData() {
            for (var i = 0; i < param.length; i++) {
                var oTempDel = {
                    roomName: g_roomName,
                    type:param[i].type || "null",
                    apName: param[i].apName || "null",
                    apSerialId: param[i].apSerialId || "null",
                    moduleId: param[i].moduleId || "null",
                    moduleSerialId: param[i].moduleSerialId || "null"
                };
                delRoomConfig(oTempDel, onSuc);
            }
        }

        function onSuc(aData) {
            len--;
            if (aData.retCode != 0) {
                Frame.Msg.info("删除房间AP失败")
                Utils.Base.refreshCurPage();
                return;
            }
            if (oStData != "default" && oStData) {
                modifyRoomData(oStData);
            }
            if ((!oStData || oStData == "default") && len == 0) {
                Utils.Base.refreshCurPage();
            }

        }

    }

    function initEvent(){
        var re=/[^(0-9A-Za-z)]/g;
        $("#serial").on("input",function(){
            var str=this.value;
            if(re.test(str)){
                $("#serial_error").css({display:"inline-block",height:"22px",width:"142px"});
                $("#serial_error").html("必须为数字和字母");
                this.value=str.replace(re,"");
            }
        });
        $("#classAP").on("change",function(){
            $("#s2id_classAP abbr").css({"background-image": "url('libs/select2/select2.png')","background-position":"right top"});
        });
        $("#classModule").on("change",function(){
            $("#s2id_classModule abbr").css({"background-image": "url('libs/select2/select2.png')","background-position":"right top"});
        });
        $("#apType").on("change",function(){
            if(this.value=="AP"){
                $("#scannerDiv,#scannerSerialDiv").css("display","none");
                $("#gateApDiv,#moduleDiv,#moduleSerialDiv").css("display","block");
            }else{
                $("#scannerDiv,#scannerSerialDiv").css("display","block");
                $("#gateApDiv,#moduleDiv,#moduleSerialDiv").css("display","none");
            }
        })
    }

    function initSingleSelect() {
        var apName = [];
        var arrAp = [];
        var count = 0;
        getAp(count, onSuccess);
        function onSuccess(data) {
            count += 10;
            for (var i = 0; i < data.apList.length; i++) {
                arrAp.push(data.apList[i])
            }
            if (data.apList.length >= 10) {
                getAp(count, onSuccess);
            } else {
                for (var j = 0; j < arrAp.length; j++) {
                    apName.push(arrAp[j].apName);
                }
                g_Ap = arrAp;
                $('#classAP').singleSelect('InitData', apName);
                $('#editclassAP').singleSelect('InitData', apName);
            }
        }

        var moName = ["1", "2", "3"];
        $('#classModule').singleSelect('InitData', moName);
        $('#editclassModule').singleSelect('InitData', moName);
        var aApType=["AP","阅读器"];
        $("#apType").singleSelect('InitData',aApType);
    };
    function returnPage() {
        //返回至首页面
        Utils.Base.redirect({np: 'classroom.typicalbuild'});
        return false;
    }

    function initSlist(g_roomName){
        var optInfo = {
            colNames: getRcText("ROOM_HEAD"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            pageSize:10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.typeWeak = oFilter.type;
                    oFilt.apNameWeak= oFilter.apName;
                    oFilt.apSerialIdWeak = oFilter.apSerialId;
                    oFilt.moduleId = oFilter.moduleId;
                    oFilt.moduleSerialIdWeak = oFilter.moduleSerialId;
                }
                getRoomConfig(pageSize, pageNum, g_roomName, oFilt);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.typeWeak = oFilter.type;
                    oFilt.apNameWeak= oFilter.apName;
                    oFilt.apSerialIdWeak = oFilter.apSerialId;
                    oFilt.moduleId = oFilter.moduleId;
                    oFilt.moduleSerialIdWeak = oFilter.moduleSerialId;
                }
                getRoomConfig(10, 1, g_roomName, oFilt);
            },
            colModel: [
                {name: 'type'},
                {name:'apName'},
                {name:'apSerialId'},
                {name:'moduleId'},
                {name:'moduleSerialId'}
            ],
            buttons: [
                {
                    name: 'class_newadd',
                    enable: "<1",
                    value:"添加",
                    mode: Frame.Button.Mode.CREATE,
                    action:addRoom
                },
                { name: 'default', value: '删除', enable: ">0", icon: 'slist-del', action: delRoom },
                { name: 'edit', action: editRoom },
                { name: 'delete', action: delRoom }
            ]
        };
        $("#room-detail").SList ("head", optInfo);
    }
    function initData(g_roomName){
        initSlist(g_roomName);
    }
    function _init() {
        g_oPara = Utils.Base.parseUrlPara();
        g_roomName = decodeURI(g_oPara.roomname);
        $("#room_name").html(g_roomName + getRcText("Detail"));
        $("#return").on('click', returnPage);
        initSingleSelect();
        initData(g_roomName);
        getRoomConfig(10, 1, g_roomName);
    }

    function _destroy() {
        g_oPara = null;
        g_roomName = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Echart", "Form", "SingleSelect"],
        "utils": ["Request", "Base"]
    });
})(jQuery);
