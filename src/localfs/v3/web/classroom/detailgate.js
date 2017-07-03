/**
 * Created by Administrator on 2016/9/7.
 */
(function ($) {
    var MODULE_NAME = "classroom.detailgate";
    var g_oPara = null;
    var g_gateName = null;
    var g_Ap = [];
    var eGate = [];
    var dGate=[];
    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("gate_rc",sRcName);
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

    //读取大门信息接口
    function getDoorConfig(pageSize, pageNum, doorName,oFilter) {
        pageSize = pageSize || 10;
        pageNum = pageNum || 1;
        var Param = {
            devSn: FrameInfo.ACSN,
            doorName: doorName,
            startRowIndex: pageSize * (pageNum-1),
            maxItem: pageSize
        };
        $.extend(Param,oFilter);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getDoorConfig',
                Param: Param
            }),
            onSuccess: function (data) {
                var oData = data.result.data;
                eGate = oData;
                var aGate = [];
                for (var i = 0; i < oData.length; i++) {
                    var oTemp2 = {
                        placeName: oData[i].placeName != "null" ? oData[i].placeName : "",
                        type:oData[i].type != "null" ? oData[i].type : "",
                        apName: oData[i].apName != "null" ? oData[i].apName : "",
                        apSerialId: oData[i].apSerialId != "null" ? oData[i].apSerialId : "",
                        moduleId: oData[i].moduleId != "null" ? oData[i].moduleId : "",
                        moduleSerialId: oData[i].moduleSerialId != "null" ? oData[i].moduleSerialId : ""
                    };
                    aGate.push(oTemp2);
                }
                $("#gate-detail").SList("refresh", {data: aGate, total: data.result.rowCount});

            },
            onFailed:function(jqXHR,textstatus,error){
                Frame.Msg.info("读取大门失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }
    //删除大门接口
    /*
        devSn:FrameInfo.ACSN,
        doorName:doorName,
        placeName:placeName,位置信息
        apName,ap名称
        apSerialId,ap序列号
        moduleId,模块ID
        serialId模块serialID
     */
    function delDoorConfig(oParam,onSuc) {
        var Param = {
            devSn: FrameInfo.ACSN
        }
        $.extend(Param,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampuswrite',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'delDoorConfig',
                Param: Param
            }),
            onSuccess:onSuc,
            onFailed: function (jqXHR,textstatus,error) {
                Frame.Msg.info("删除大门失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }

    //创建大门的接口
    /*
    * placeName
    * apName
    * apSerialId
    * moduleId
    * serialId
    *
    * */
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
                Method:"setDoorConfig",
                Param:oParam1
            }),
            onSuccess:onSuc/*function(){
                //getDoorConfig(10,1,g_gateName);
                Utils.Base.refreshCurPage();
            }*/,
            onFailed:onFail
        }
        Utils.Request.sendRequest(Option);
    }

    function addGateData(gateData,onSuc,onFail){
        var apSerial="";
        if(gateData["apType"]=="AP"){
            for (var x = 0; x < g_Ap.length; x++) {
                if (gateData["editgateAP"] == g_Ap[x].apName) {
                    apSerial = g_Ap[x].apSN;
                }
            }
            var oTemp2 = {

                placeName: gateData["editLocation"] || "null",
                type:gateData["apType"] || "null",
                apName: gateData["editgateAP"] || "null",
                apSerialId: apSerial || "null",
                moduleId: gateData["editgateModule"] || "null",
                moduleSerialId: gateData["editgateSerial"] || "null"
            };
        }else{
            var oTemp2 = {
                placeName: gateData["editLocation"] || "null",
                type:gateData["apType"] || "null",
                apName: gateData["scanner"] || "null",
                apSerialId: gateData["scannerSerial"] || "null",
                moduleId: "null",
                moduleSerialId: "null"
            };
        }
        oTemp2.doorName = g_gateName;
        setDoorConfig(oTemp2,onSuc,onFail);

    }

    function delGate(param,gateData){
        //console.log(param)
        if(gateData){

            delGateData();

        }else{
            Frame.Msg.confirm("是否确定删除？",function(){

                delGateData();

            })
        }
        function delGateData(){
            for(var i=0;i<param.length;i++){
                var oTempDel={
                    //doorName:param[i].doorName,
                    placeName: param[i].placeName || "null",
                    type:param[i].type || "null",
                    apName: param[i].apName || "null",
                    apSerialId: param[i].apSerialId || "null",
                    moduleId: param[i].moduleId || "null",
                    moduleSerialId: param[i].moduleSerialId || "null"
                };
                oTempDel.doorName=g_gateName;
                delDoorConfig(oTempDel,onSuc);
            }
        }
        function onSuc(aData){
            if(aData.retCode != 0){
                return;
            }
            if(gateData){
                addGateData(gateData,onEditSuc,onEditFail);
            }

            if(!gateData){
                Utils.Base.refreshCurPage();
            }

        }
        function onEditSuc(data){
            if(data.retCode != 0){
                Frame.Msg.info("编辑大门AP失败！")
            }else{
                Frame.Msg.info("编辑大门AP成功！")
            }
            Utils.Base.refreshCurPage();
        }
        function onEditFail(){
            Frame.Msg.info("编辑大门AP失败！")
        }
    }
    //大门表单,添加大门ap信息
    function addData(){
        initEvent();
        var closeGateWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#editAp_form")));
        };
        var oTempTable = {
            index: [],
            column: [
                'editLocation',
                'apType',
                'editgateAP',
                'scanner',
                'scannerSerial',
                'editgateModule',
                'editgateSerial'
            ]
        }

        $("#editAp_form").form("init", "edit", {
            "title": "新建Ap",
            "btn_apply": function () {
                var gateData = $("#editAp_form").form("getTableValue", oTempTable);
                //console.log(gateData);
                if($("#editgateSerial").val()!="" && $("#editgateModule").val()==""){
                    $("#editgateModule_error").css({display:"inline-block",height:"22px",width:"130px"});
                    $("#editgateModule_error").html("请添加模块名称");
                }else {
                    addGateData(gateData,onAddSuc,onAddFail);
                    function onAddSuc(data){
                        if(data.retCode != 0){
                            if(data.retCode == -2){
                                Frame.Msg.info("ap与模块不能重复绑定，新建大门AP失败！")
                            }else{
                                Frame.Msg.info("新建大门AP失败！")
                            }

                        }else{
                            Frame.Msg.info("新建大门AP成功！")
                        }
                        Utils.Base.refreshCurPage();
                    }
                    function onAddFail(){
                        Frame.Msg.info("新建大门AP失败！")
                    }
                    closeGateWindow();
                }
            }, "btn_cancel": closeGateWindow
        });
        $("input[type=text]",$("#editAp_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("input[type=number]",$("#editAp_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("singleSelect",$("#editAp_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });

        $("#editAp_form").form('updateForm', {
            'editLocation':"未选择",
            'apType':"未选择",
            'editgateAP':"未选择",
            'scanner':"",
            'scannerSerial':"",
            'editgateModule':"未选择",
            'editgateSerial':""
        });
        Utils.Base.openDlg(null, {}, { scope: $("#EditApDlg"), className: "modal-super" });
        $("#s2id_editLocation .select2-arrow b").attr("style","display:block");
        $("#editLocation_label,#editgateAP_label").addClass("required");
        $("#gate_label").addClass("required");
        $("#editLocation_error,#apType_error,#editgateAP_error,#scanner_error,#scannerSerial_error,#editgateModule_error,#editgateSerial_error,").css({display:"none"});
        $("#editLocation").removeAttr("disabled","disabled");
    }
    function editData(param){
        initEvent();
        dGate = param;
        var oTempTable = {
                index: [],
                column: [
                    'editLocation',
                    'apType',
                    'editgateAP',
                    'scanner',
                    'scannerSerial',
                    'editgateModule',
                    'editgateSerial'
                ]
            }
        var closeGateWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#editAp_form")));
        };
        $("#editAp_form").form('updateForm', {
            'editLocation':"未选择",
            'apType':"未选择",
            'editgateAP':"未选择",
            'editgateModule':"未选择",
            'scanner':"",
            'scannerSerial':"",
            'editgateSerial':""
        });
        $("#editAp_form").form("init", "edit", {
            "title": "编辑AP",
            "btn_apply": function () {
                //var gateData1 = {};
                var gateData = $("#editAp_form").form("getTableValue", oTempTable);
                if($("#editgateSerial").val()!="" && $("#editgateModule").val()==""){
                    $("#editgateModule_error").css({display:"inline-block",height:"22px",width:"130px"});
                    $("#editgateModule_error").html("请添加模块名称");
                }else {
                    delGate(dGate,gateData);
                    closeGateWindow();
                }
            }, "btn_cancel": closeGateWindow
        });

        $("#editAp_form").each(function() {
            Utils.Widget.setError($(this),"");
        });

        Utils.Base.openDlg(null, {}, { scope: $("#EditApDlg"), className: "modal-super" });
        if(param[0].type){
            if(param[0].type=="AP"){
                $("#scannerDiv,#scannerSerialDiv").css("display","none");
                $("#gateApDiv,#moduleDiv,#moduleSerialDiv").css("display","block");
                $("#editAp_form").form('updateForm', {
                    'editLocation':param[0].placeName,
                    'apType':param[0].type,
                    'editgateAP':param[0].apName,
                    'editgateModule':param[0].moduleId,
                    'editgateSerial':param[0].moduleSerialId
                });
            }else if(param[0].type=="阅读器"){
                $("#scannerDiv,#scannerSerialDiv").css("display","block");
                $("#gateApDiv,#moduleDiv,#moduleSerialDiv").css("display","none");
                $("#editAp_form").form('updateForm', {
                    'editLocation':param[0].placeName,
                    'apType':param[0].type,
                    'scanner':param[0].apName,
                    'scannerSerial':param[0].apSerialId
                });
            }
        }else{
            $("#scannerDiv,#scannerSerialDiv").css("display","none");
            $("#gateApDiv,#moduleDiv,#moduleSerialDiv").css("display","block");
            $("#editAp_form").form('updateForm', {
                'editLocation':param[0].placeName,
                'apType':param[0].type,
                'editgateAP':param[0].apName,
                'editgateModule':param[0].moduleId,
                'editgateSerial':param[0].moduleSerialId
            });
        }

        $("#s2id_editLocation .select2-arrow b").attr("style","display:none");
        $("#editLocation_label,#editgateAP_label").removeClass("required");
        $("#editLocation_error,#apType_error,#editgateAP_error,#scanner_error,#scannerSerial_error,#editgateModule_error,#editgateSerial_error,").css({display:"none"});
        $("#editLocation").attr("disabled","disabled");
    }

    function initSlist(gateName) {
        var option = {
            colNames: getRcText("GATE_DETAIL"),
            multiSelect: true,
            showOperation:true,
            pageSize: 10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.placeNameWeak = oFilter.placeName;
                    oFilt.typeWeak = oFilter.type;
                    oFilt.apNameWeak= oFilter.apName;
                    oFilt.apSerialIdWeak = oFilter.apSerialId;
                    oFilt.moduleId = oFilter.moduleId;
                    oFilt.moduleSerialIdWeak = oFilter.moduleSerialId;
                }
                getDoorConfig(pageSize,pageNum,gateName,oFilt)
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.placeNameWeak = oFilter.placeName;
                    oFilt.typeWeak = oFilter.type;
                    oFilt.apNameWeak= oFilter.apName;
                    oFilt.apSerialIdWeak = oFilter.apSerialId;
                    oFilt.moduleId = oFilter.moduleId;
                    oFilt.moduleSerialIdWeak = oFilter.moduleSerialId;
                }
                getDoorConfig(10,1,gateName,oFilt)
            },
            colModel: [
                {name: 'placeName', value: 'String'},
                {name: 'type', value: 'String'},
                {name: 'apName', value: 'String'},
                {name: 'apSerialId', value: 'String'},
                {name: 'moduleId', value: 'String'},
                {name: 'moduleSerialId', value: 'String'},

            ],
            buttons: [
                {
                    name: 'class_newadd',
                    enable: "<1",
                    value:"添加",
                    mode: Frame.Button.Mode.CREATE,
                    action:addData
                },
                {name: 'edit',value:'编辑',action:editData},
                { name: 'delete', action: delGate }
            ]
        }
        $("#gate-detail").SList('head', option);

    }
    function initEvent(){
        var re=/[^(0-9A-Za-z)]/g;
        $("#editgateSerial").on("input",function(){
            var str=this.value;
            if(re.test(str)){
                $("#editgateSerial_error").css({display:"inline-block",height:"22px",width:"142px"});
                $("#editgateSerial_error").html("必须为数字和字母");
                this.value=str.replace(re,"");
            }
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
    function initSingleSelect(){
        var apName=[];
        var arrAp=[];
        var count=0;
        getAp(count,onSuccess);
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
                g_Ap=arrAp;
                $('#editgateAP').singleSelect('InitData', apName);
            }
        }
        var moName=["1","2","3"];
        $('#classModule').singleSelect('InitData', moName);
        $('#editclassModule').singleSelect('InitData', moName);
        $('#gateModule').singleSelect('InitData', moName);
        $('#editgateModule').singleSelect('InitData', moName);
        //初始化位置下拉列表
        var placeName=["门内","门外"]
        $('#location').singleSelect('InitData', placeName);
        $('#editLocation').singleSelect('InitData', placeName);
        var aApType=["AP","阅读器"];
        $("#apType").singleSelect('InitData',aApType);
    }

    function initData(gateName){
        initSlist(gateName);
        //console.log(gateName)
    }
    function returnPage(){
        //返回至首页面
        Utils.Base.redirect({np: 'classroom.typicalbuild'});
        return false;
    }

    function _init () {
        g_oPara = Utils.Base.parseUrlPara();
        g_gateName = decodeURI(g_oPara.gatename);
        $("#gate_name").html(g_gateName+getRcText("Detail"));
        $("#return").on('click', returnPage);
        initSingleSelect();
        initData(g_gateName);
        //getApInfo(g_gateName);
        getDoorConfig(10,1,g_gateName);
    }

    function _destroy() {
        g_oPara = null;
        g_gateName = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","Form","SingleSelect"],
        "utils":["Request","Base"]
    });
})(jQuery);