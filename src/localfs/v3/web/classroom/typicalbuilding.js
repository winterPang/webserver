/**
 * Created by Administrator on 2016/8/16.
 */
;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".typicalbuilding";
    var dRoom=[];
    var dGate=[];
    var minFlag=0;
    var maxFlag=0;
    var minFlag1=0;
    var maxFlag1=0;
    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("c_net_infor_rc",sRcName);
    }

    //获取AP，得到现有ap与ap序列号
    function getAp(Number,onSuccess){
        var Option = {
            type:"GET",
            url:MyConfig.path + "/apmonitor/app/aplist?devSN=" + FrameInfo.ACSN+"&startNum="+Number,
            contentType:"application/json",
            data:JSON.stringify({
                devSN: FrameInfo.ACSN,
                startNum:Number
            }),
            onSuccess:onSuccess,
            onFailed: function (jqXHR, textstatus, error) {
                Frame.Msg.info("获取AP失败", "error");
            }
        };
        Utils.Request.sendRequest(Option);
    }

    //获取AP信息，得到AP的信息
    function getApInfo(apSN){
        var Option = {
            type:"GET",
            url:MyConfig.path + "/apmonitor/app/apinfo?devSN=" + FrameInfo.ACSN+"&apSN="+apSN,
            contentType:"application/json",
            data:JSON.stringify({
                devSN: FrameInfo.ACSN,
                apSN:apSN
            }),
            onSuccess:function(data){
                //console.log(data);
            },
            onFailed: function (jqXHR, textstatus, error) {
                Frame.Msg.info("获取AP失败", "error");
            }
        };
        Utils.Request.sendRequest(Option);
    }
    //创建房间的接口
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
                Method:"setRoomBaseConfig",
                Param:oParam1
            }),
            onSuccess:onSuc,
            onFailed:onFail
        }
        Utils.Request.sendRequest(Option);
    }
    //创建大门的接口
    /*
    *devSn:FrameInfo.ACSN,
    * doorName:doorName,
    * administrators:administrators,
    * apNum:apNum,
    * checkUpTime
     */
    function setDoorConfig(oParam,onSuc,onFail){
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
                Method:"setDoorBaseConfig",
                Param:oParam1
            }),
            onSuccess:onSuc,
            onFailed:onFail
        }
        Utils.Request.sendRequest(Option);
    }
    //读取房间信息接口
    function getRoomConfig(pageSize, pageNum, oParam) {
        pageSize = pageSize || 5;
        pageNum = pageNum || 1;
        var oParam1 = {
            devSn:FrameInfo.ACSN,
            startRowIndex:pageSize * (pageNum-1),
            maxItem:pageSize
        }
        $.extend(oParam1,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getRoomBaseConfig',
                Param: oParam1
            }),
            onSuccess: function (data) {
                var oData = data.result.data || [];

                var aRoom = [];
                for(var i=0;i<oData.length;i++){
                    /*{name:'roomTemperature'},
                     {name:'sensorNumber',formatter:formateRoom}*/
                    var oTemp1 = {
                        roomName:oData[i].roomName,
                        apNum :oData[i].apNum,
                        crowdThreshold :oData[i].crowdThreshold,
                        crowdThresholdMax :oData[i].crowdThresholdMax,
                        cameraNum:oData[i].cameraNum,
                        roomTemperature:oData[i].roomTemperature ,
                        sensorNumber:oData[i].sensorNumber
                    };
                    aRoom.push(oTemp1);
                }
                console.log(aRoom);
                $("#classRoomList").SList ("refresh", {data: aRoom, total: data.result.rowCount});
            },
            onFailed: function (err) {
                Frame.Msg.info("读取房间失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }
    //读取大门信息接口
    /*
    * devSn:FrameInfo.ACSN,
    * doorName:doorName,
    * administrators:administrators
    * apNum:apNum
    * checkUpTime,
    * startRowIndex
    * maxItem
    *
    * */
    function getDoorConfig(pageSize, pageNum, oParam) {
        pageSize = pageSize || 5;
        pageNum = pageNum || 1;
        var oParam1 = {
            devSn:FrameInfo.ACSN,
            startRowIndex:pageSize * (pageNum-1),
            maxItem:pageSize
        }
        $.extend(oParam1,oParam);
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getDoorBaseConfig",
                Param:oParam1
            }),
            onSuccess:function(aData){
                if(aData.retCode != 0){
                    $("#gateList").SList("refresh", {data: [], total: aData.result.rowCount});
                }else{
                    var aResult = aData.result.data || [];
                    $("#gateList").SList("refresh", {data: aResult, total: aData.result.rowCount});
                }

                //debugger;
            },
            onFailed:function(jqXHR,textstatus,error){
                Frame.Msg.info("获取大门基本信息失败", "error");
            }
        }
        Utils.Request.sendRequest(Option);

    }

    //删除房间接口
    function delRoomConfig(oParam,onSuc) {
        var Param = {
            devSn: FrameInfo.ACSN,
            roomName:oParam
        };
        //$.extend(Param,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampuswrite',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'delRoomBaseConfig',
                Param: Param
            }),
            onSuccess:onSuc,
            onFailed: function (jqXHR,textstatus,error) {
                Frame.Msg.info("删除房间失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }

    //删除大门基本信息的接口
    /**
     *
     * @param oPara
     * devSn:FrameInfo.ACSN
     * doorName:doorName
     * administrators:administrators
     * apNum
     * checkUpTime
     */
    function delDoorConfig(oPara,onSuc){
        var oParam = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam,oPara);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampuswrite',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'delDoorBaseConfig',
                Param: oParam
            }),
            onSuccess: onSuc,
            onFailed: function (jqXHR,textstatus,error) {
                Frame.Msg.info("删除大门信息失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }

    //添加房间弹出框
    function addRoom(){
        initEvent();
         $("#add_form").form('updateForm', {
             'classroom':'',
             'crowdThreshold':'',
             'crowdThresholdMax':''
         });
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#add_form")));
        };
        var oTempTable = {
            index: [],
            column: [
                'classroom',
                'crowdThreshold',
                'crowdThresholdMax'
            ]
        };
        $("#add_form").form("init", "edit", {

            "title": "新建房间",
            "btn_apply": function () {
                var oStData = $("#add_form").form("getTableValue", oTempTable);
                if(Number($("#crowdThreshold").val()) >= Number($("#crowdThresholdMax").val())){
                    if(minFlag1==1){
                        $("#crowdThreshold_error").css({display:"inline-block",height:"22px",width:"200px"});
                        $("#crowdThreshold_error").html("阈值下限必须小于阈值上限");
                    }
                    if(maxFlag1==1){
                        $("#crowdThresholdMax_error").css({display:"inline-block",height:"22px",width:"200px"});
                        $("#crowdThresholdMax_error").html("阈值上限必须大于阈值下限");
                    }
                }else{
                    addRoomData(oStData);
                    closeWindow();
                }
            }, "btn_cancel": closeWindow
        });
        $("#classroom,#crowdThreshold").val("");
        $("#classroom_error,#crowdThreshold_error").css({display:"none"});
        $("input[type=text]",$("#add_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $('#classroom').removeAttr("disabled");
        Utils.Base.openDlg(null, {}, { scope: $("#AddRoomDlg"), className: "modal-super" });
    }
    //添加房间数据
    function addRoomData(roomData){
        var oTemp1 = {
            roomName:roomData["classroom"] || "null",
            crowdThreshold:Number(roomData["crowdThreshold"]),
            crowdThresholdMax:Number(roomData["crowdThresholdMax"]),
            roomTemperature:0
        };
        oTemp1.apNum = 0;
        oTemp1.cameraNum = 0;
        oTemp1.sensorNumber = 0;
        oTemp1.type = 0;
        setRoomConfig(oTemp1,onSuc,onFail);
        function onSuc(data){
            if(data.retCode!=0){
                if(data.retCode == -2){
                    Frame.Msg.info("房间名字不能重复，新建房间失败！");
                }else{
                    Frame.Msg.info("新建房间失败！");
                }
                Utils.Base.refreshCurPage();
                return;
            }
            Frame.Msg.info("新建房间成功！");
            Utils.Base.refreshCurPage();
        }
        function onFail(){
            Frame.Msg.info("新建房间失败！");
        }
    }
    //编辑房间数据
    function modifyRoomData(roomData){
        var oTemp1 = {
            roomName:roomData["classroom"] || "null",
            crowdThreshold:roomData["crowdThreshold"],
            crowdThresholdMax:roomData["crowdThresholdMax"],
            roomTemperature:0
        };
        oTemp1.apNum = dRoom[0].apNum;
        oTemp1.cameraNum = dRoom[0].cameraNum;
        oTemp1.sensorNumber = dRoom[0].sensorNumber;
        oTemp1.type = 1;
        setRoomConfig(oTemp1,onSuc,onFail);
        function onSuc(data){
            if(data.retCode!=0){
                Frame.Msg.info("编辑房间失败！");
                Utils.Base.refreshCurPage();
                return;
            }
            Frame.Msg.info("编辑房间成功！");
            Utils.Base.refreshCurPage();
        }
        function onFail(){
            Frame.Msg.info("编辑房间失败！");
        }
    }
    //编辑房间弹出框  
    function editRoom(param){
        initEvent();
        dRoom=param;
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#add_form")));
        };
        var oTempTable = {
            index: [],
            column: [
                'classroom',
                'crowdThreshold',
                'crowdThresholdMax'
            ]
        };
        $("#add_form").form("init", "edit", {
            "title": "编辑房间",
            "btn_apply": function () {
                var oStData = $("#add_form").form("getTableValue", oTempTable);
                if(Number($("#crowdThreshold").val()) >= Number($("#crowdThresholdMax").val())){
                    if(minFlag1==1){
                        $("#crowdThreshold_error").css({display:"inline-block",height:"22px",width:"200px"});
                        $("#crowdThreshold_error").html("阈值下限必须小于阈值上限");
                    }
                    if(maxFlag1==1){
                        $("#crowdThresholdMax_error").css({display:"inline-block",height:"22px",width:"200px"});
                        $("#crowdThresholdMax_error").html("阈值上限必须大于阈值下限");
                    }
                }else{
                    modifyRoomData(oStData);
                    closeWindow();
                }
            }, "btn_cancel": closeWindow
        });
        if (param.length > 0) {
            $("#add_form").form('updateForm', {
                'classroom': param[0].roomName,
                'crowdThreshold':param[0].crowdThreshold,
                'crowdThresholdMax':param[0].crowdThresholdMax
            });
        } else {
            $("#add_form").form('updateForm', {
                'classroom': '',
                'crowdThreshold':'',
                'crowdThresholdMax':''
            });
        }
        $("input[type=text]",$("#add_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("input[type=number]",$("#add_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("#classroom_error,#crowdThreshold_error").css({display:"none"});
        Utils.Base.openDlg(null, {}, { scope: $("#AddRoomDlg"), className: "modal-super" });
        $('#classroom').attr({ disabled: "disabled" });
    }
    //删除房间数据
    function delRoom(param){
        var oRoomName=[];
        for(var n=0; n<param.length;n++) {
            var oTemp = param[n].roomName;
            oRoomName.push(oTemp);
        }

        Frame.Msg.confirm("是否确定删除？",function(){

            delRoomConfig(oRoomName,onSuc);

        })

        function onSuc(aData){
            if(aData.retCode != 0){
                if(aData.retCode == -2){
                    Frame.Msg.info("删除房间失败,请先解除绑定关系")
                    Utils.Base.refreshCurPage();
                    return;
                }
                Frame.Msg.info("删除房间失败")
                Utils.Base.refreshCurPage();
                return;
            }
            Utils.Base.refreshCurPage();
        }

    }
    //添加大门弹出框
    function addGate(){
        initEvent();
        //大门表单
        var oTempTableedit = {
            index: [],
            column: [
                'doorName',
                'administrators',
                'apNum',
                'checkUpTime',
                'checkUpTimeMax'
            ]
        }
        var closeGateWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addGate_form")));
        };

        $("#addGate_form").form("init", "edit", {
            "title": "新建大门",
            "btn_apply": function () {
                var gateData = $("#addGate_form").form("getTableValue", oTempTableedit);
                if(Number($("#checkUpTime").val()) >= Number($("#checkUpTimeMax").val())){
                    if(minFlag==1){
                        $("#checkUpTime_error").css({display:"inline-block",height:"22px",width:"200px"});
                        $("#checkUpTime_error").html("上限时间必须大于下限时间");
                    }
                    if(maxFlag==1){
                        $("#checkUpTimeMax_error").css({display:"inline-block",height:"22px",width:"200px"});
                        $("#checkUpTimeMax_error").html("上限时间必须大于下限时间");
                    }
                }else{
                function onSuc(aData) {
                    if (aData.retCode != 0) {
                        if (aData.retCode == -2) {
                            Frame.Msg.info("大门名称不能重复,新建失败！");
                            Utils.Base.refreshCurPage();
                        } else {
                            Frame.Msg.info("新建大门失败！");
                        }
                    } else {
                        Utils.Base.refreshCurPage();
                        Frame.Msg.info("新建大门成功！");
                    }

                }
                function onFail(){
                    Frame.Msg.info("新建大门失败！");
                }
                gateData.type = 0;
                gateData.apNum = 0;
                gateData.cameraNum = 0;
                setDoorConfig(gateData, onSuc,onFail);
                closeGateWindow();
                }
                //setDoorConfig(gateData,onSuc);
            }, "btn_cancel": closeGateWindow
        });
        $("#addGate_form").form('updateForm', {
            'doorName':"",
            'administrators':"",
            'apNum':"",
            'checkUpTime':"",
            'checkUpTimeMax':""
        });
        Utils.Base.openDlg(null, {}, { scope: $("#AddGateDlg"), className: "modal-super" });
        $("#doorName_label").addClass("required");
        $("input[type=text]",$("#addGate_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("input[type=number]",$("#addGate_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("#doorName").removeAttr("disabled");
    }
    function editGate(param){
        initEvent();
        dGate=param[0];
        var oTempTableedit = {
            index: [],
            column: [
                'doorName',
                'administrators',
                'apNum',
                'checkUpTime',
                'checkUpTimeMax'
            ]
        }

        //大门表单
        var closeGateWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addGate_form")));
        };

        $("#addGate_form").form("init", "edit", {
            "title": "编辑大门",
            "btn_apply": function () {
                var gateData = $("#addGate_form").form("getTableValue", oTempTableedit);
                if(Number($("#checkUpTime").val()) >= Number($("#checkUpTimeMax").val())){
                    if(minFlag==1){
                        $("#checkUpTime_error").css({display:"inline-block",height:"22px",width:"190px"});
                        $("#checkUpTime_error").html("上限时间必须大于下限时间");
                    }
                    if(maxFlag==1){
                        $("#checkUpTimeMax_error").css({display:"inline-block",height:"22px",width:"190px"});
                        $("#checkUpTimeMax_error").html("上限时间必须大于下限时间");
                    }
                }
                else{
                    gateData.apNum = dGate.apNum;
                    gateData.cameraNum = dGate.cameraNum;
                    gateData.type=1;
                    function onSuc(aData) {
                        if (aData.retCode != 0) {
                            Frame.Msg.info("编辑大门失败！");
                            Utils.Base.refreshCurPage();
                        }
                        Frame.Msg.info("编辑大门成功！");
                        Utils.Base.refreshCurPage();
                    }
                    function onFail(){
                        Frame.Msg.info("编辑大门失败！");
                    }
                    setDoorConfig(gateData, onSuc,onFail);
                    closeGateWindow();
                }

            }, "btn_cancel": closeGateWindow
        });

        Utils.Base.openDlg(null, {}, { scope: $("#AddGateDlg"), className: "modal-super" });
        $("#gate_label").removeClass("required");
        $("input[type=text]",$("#addGate_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("input[type=number]",$("#addGate_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });

        $("#doorName").val(param[0].doorName);
        $("#administrators").val(param[0].administrators);
        $("#apNum").val(param[0].apNum);
        $("#checkUpTime").val(param[0].checkUpTime);
        $("#checkUpTimeMax").val(param[0].checkUpTimeMax);
        $("#doorName").attr("disabled","disabled");
    }
    function delGate(param){
        Frame.Msg.confirm("是否确定删除？",function() {
            var len = param.length;
            for (var i = 0; i < param.length; i++) {
                var oTempDel = {
                    doorName: param[i].doorName,
                    administrators: param[i].administrators,
                    checkUpTime: param[i].checkUpTime,
                    apNum: param[i].apNum,
                    checkUpTimeMax: param[i].checkUpTimeMax,
                    cameraNum: param[i].cameraNum
                };

                delDoorConfig(oTempDel, onSuc);
            }
            function onSuc(aData) {
                len--;
                if (aData.retCode != 0) {
                    if(aData.retCode == -2){
                        Frame.Msg.info("删除大门信息失败,请先解除绑定关系！");
                        Utils.Base.refreshCurPage();
                        return;
                    }
                    Frame.Msg.info("删除大门信息失败！");
                    Utils.Base.refreshCurPage();
                    return;
                }
                //Frame.Msg.info("删除大门信息成功！");
                if (len == 0) {
                    Utils.Base.refreshCurPage();
                }
            }
        })

    }
    //查看AP列表
    function enterApList(){
        var oData = JSON.parse($(this).attr("oData"));
        Utils.Base.redirect({np: 'classroom.detailgate',gatename:oData.doorName});
    }
    function enterRoomApList(){
        var oData = JSON.parse($(this).attr("oData"));
        Utils.Base.redirect({np: 'classroom.detailroom',roomname:oData.roomName});
    }
    function enterCameraDetail(){

        var oData = JSON.parse($(this).attr("oData"));
        console.log(oData);
        if(oData.roomName){
            Utils.Base.redirect({np: 'classroom.cameradetail',roomname:oData.roomName});
        }else if(oData.doorName){
            Utils.Base.redirect({np: 'classroom.cameradetail',doorname:oData.doorName});
        }
        //Utils.Base.redirect({np: 'classroom.cameradetail',buildname:oData.roomName});
    }
    function enterSensorDetail(){
        var oData = JSON.parse($(this).attr("oData"));
        Utils.Base.redirect({np: 'classroom.detailsensor',buildname:oData.roomName});
    }
    //初始化显示列表
    function initList(){
        function formate(row, cell, value, columnDef, dataContext, type) {
            if (type == 'text') {
                return value;
            }
            switch(cell) {
                case 2:
                    var oDataContext1 = JSON.stringify(dataContext);
                    return  "<a href='javascript:;' class='slist-link ap-count' oData="+oDataContext1+" >" + value + "</a>";
                    break;
                case 5:
                    var oDataContext2 = JSON.stringify(dataContext);
                    return  "<a href='javascript:;' class='slist-link camera-count' oData="+oDataContext2+" >" + value + "</a>";
                    break;
                default:
                    break;
            }
        }
        function formateRoom(row, cell, value, columnDef, dataContext, type) {
            if (type == 'text') {
                return value;
            }
            switch(cell) {
                case 1:
                    var oDataContext1 = JSON.stringify(dataContext);
                    return  "<a href='javascript:;' class='slist-link ap-count' oData="+oDataContext1+" >" + value + "</a>";
                    break;
                case 4:
                    var oDataContext2 = JSON.stringify(dataContext);
                    return  "<a href='javascript:;' class='slist-link camera-count' oData="+oDataContext2+" >" + value + "</a>";
                    break;
                case 6:
                    var oDataContext3 = JSON.stringify(dataContext);
                    return  "<a href='javascript:;' class='slist-link sensor-count' oData="+oDataContext3+" >" + value + "</a>";
                    break;
                default:
                    break;
            }
        }
        var optInfo = {
            colNames: getRcText("ROOM_HEAD"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            pageSize:5,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.roomNameWeak = oFilter.roomName;
                    oFilt.apNum = oFilter.apNum;
                    oFilt.crowdThreshold = oFilter.crowdThreshold;
                    oFilt.crowdThresholdMax = oFilter.crowdThresholdMax;
                    oFilt.cameraNum = oFilter.cameraNum;
                    oFilt.roomTemperature = oFilter.roomTemperature;
                    oFilt.sensorNumber = oFilter.sensorNumber;
                }
                getRoomConfig(pageSize, pageNum, oFilt);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.roomNameWeak = oFilter.roomName;
                    oFilt.apNum = oFilter.apNum;
                    oFilt.crowdThreshold = oFilter.crowdThreshold;
                    oFilt.crowdThresholdMax = oFilter.crowdThresholdMax;
                    oFilt.cameraNum = oFilter.cameraNum;
                    oFilt.roomTemperature = oFilter.roomTemperature;
                    oFilt.sensorNumber = oFilter.sensorNumber;
                }
                getRoomConfig(5, 1, oFilt);
            },
            colModel: [
                {name:'roomName'},
                {name:'apNum',formatter:formateRoom},
                {name:'crowdThreshold'},
                {name:'crowdThresholdMax'},
                {name:'cameraNum',formatter:formateRoom},
                {name:'roomTemperature'},
                {name:'sensorNumber',formatter:formateRoom}
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
        $("#classRoomList").SList ("head", optInfo);
        $("#classRoomList").on('click','a.ap-count',enterRoomApList);
        $("#classRoomList").on('click','a.camera-count',enterCameraDetail);
        $("#classRoomList").on('click','a.sensor-count',enterSensorDetail);
        var optInfor = {
            colNames: getRcText("GATE_HEAD"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            pageSize:5,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.doorNameWeak = oFilter.doorName;
                    oFilt.administratorsWeak=oFilter.administrators;
                    oFilt.apNum= oFilter.apNum;
                    oFilt.checkUpTime = oFilter.checkUpTime;
                    oFilt.checkUpTimeMax = oFilter.checkUpTimeMax;
                    oFilt.cameraNum = oFilter.cameraNum;
                }
                getDoorConfig(pageSize, pageNum, oFilt);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.doorNameWeak = oFilter.doorName;
                    oFilt.administratorsWeak=oFilter.administrators;
                    oFilt.apNum= oFilter.apNum;
                    oFilt.checkUpTime = oFilter.checkUpTime;
                    oFilt.checkUpTimeMax = oFilter.checkUpTimeMax;
                    oFilt.cameraNum = oFilter.cameraNum;
                }
                getDoorConfig(5, 1, oFilt);
            },
            colModel: [
                {name:'doorName'},
                {name:'administrators'},
                {name:'apNum',formatter:formate},
                {name:'checkUpTime'},
                {name:'checkUpTimeMax'},
                {name:'cameraNum',formatter:formate}
            ],
            buttons: [
                {
                    name: 'class_newadd',
                    enable: "<1",
                    value:"添加",
                    mode: Frame.Button.Mode.CREATE,
                    action:addGate
                },
                { name: 'default', value: '删除', enable: ">0", icon: 'slist-del', action: delGate },
                { name: 'edit', action: editGate },
                { name: 'delete', action: delGate }
                //{name: "detail", enable: true, value: "详情", action: detailContent}
            ]
        };
        $("#gateList").SList ("head", optInfor);
        $("#gateList").on('click','a.ap-count',enterApList);
        $("#gateList").on('click','a.camera-count',enterCameraDetail);
    }
    function initData(){
        getRoomConfig(5,1);
        getDoorConfig(5,1);
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

        $("#checkUpTime").on("input",function(){
            maxFlag=0;
            $("#checkUpTimeMax_error").css({display:"none"});
            var a=$($("#addGate_form").next()).find('a:first');
            var min=this.value;
            var max=$("#checkUpTimeMax").val();
            if(Number(max) != "" && Number(min)>=Number(max)){
                $("#checkUpTime_error").css({display:"inline-block",height:"22px",width:"200px"});
                $("#checkUpTime_error").html("上限时间必须大于下限时间");
                minFlag=1;
            }
            else{
                $("#checkUpTime_error").css({display:"none"});
                minFlag=0;
            }
        })
        $("#checkUpTimeMax").on("input",function(){
            minFlag=0;
            $("#checkUpTime_error").css({display:"none"});
            var a=$($("#addGate_form").next()).find('a:first');
            var min1=$("#checkUpTime").val();
            var max1=this.value;
            if(min1 != "" && Number(min1) >= Number(max1)){
                $("#checkUpTimeMax_error").css({display:"inline-block",height:"22px",width:"200px"});
                $("#checkUpTimeMax_error").html("上限时间必须大于下限时间");
                maxFlag=1;
            }
            else if(min1 != "" && Number(min1) < Number(max1)){
                $("#checkUpTimeMax_error").css({display:"none"});
                maxFlag=0;
            }
        });
        $("#crowdThreshold").on("input",function(){
            maxFlag1=0;
            $("#crowdThreshold_error").css({display:"none"});
            var min=this.value;
            var max=$("#crowdThresholdMax").val();
            if(max != "" && Number(min)>=Number(max)){
                $("#crowdThreshold_error").css({display:"inline-block",height:"22px",width:"200px"});
                $("#crowdThreshold_error").html("阈值下限必须小于阈值上限");
                minFlag1=1;
            }
            else{
                $("#crowdThreshold_error").css({display:"none"});
                minFlag1=0;
            }
        });
        $("#crowdThresholdMax").on("input",function(){
            minFlag1=0;
            $("#crowdThresholdMax_error").css({display:"none"});
            var min=$("#crowdThreshold").val();
            var max=this.value;
            if(max != "" && Number(min)>=Number(max)){
                $("#crowdThresholdMax_error").css({display:"inline-block",height:"22px",width:"200px"});
                $("#crowdThresholdMax_error").html("阈值上限必须大于阈值下限");
                maxFlag1=1;
            }
            else{
                $("#crowdThresholdMax_error").css({display:"none"});
                maxFlag1=0;
            }
        })
    }
    function _init ()
    {
        function setBreadContent(paraArr){
            
            if(paraArr[0].text != ""){
                $("#bread_1").css("display",'inline');
                $("#bread_1 a").attr("href",paraArr[0].href);
                $("#bread_1 a").text(paraArr[0].text);
            }else{
                $("#bread_1").css("display",'none');
            }
            
            if(paraArr[1].text != ""){
                $("#bread_2").css("display",'inline');
                $("#bread_2 a").attr("href",paraArr[1].href);
                $("#bread_2 a").text(paraArr[1].text);
            }else{
                $("#bread_2").css("display",'none');
            }
            
            if(paraArr[2].text != ""){
                $("#bread_active").css("display",'inline');
                $("#bread_active").text(paraArr[2].text);
            }else{
                $("#bread_active").css("display",'none');
            }
        }
        setBreadContent([{text:'',href:''},
                        {text:'',href:''},
                        {text:'典型建筑',href:''}]);
                        
        initList();
        initData();

    }

    function _destroy ()
    {
       dRoom=[];
       dGate=[];
       maxFlag=null;
       minFlag=null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form",'SingleSelect',"Typehead"],
        "utils":["Request","Base", 'Device']
    });
})( jQuery );
