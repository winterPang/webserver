/**
 * Created by rkf6419 on 2016/10/12.
 */
;(function ($) {
    var MODULE_NAME = "classroom.sensor";
    //初始化选择列表内容
    var aSensorMac = [];

    //使用中文
    function getRcText(sRcName) {
        return Utils.Base.getRcString("sensor_rc", sRcName);
    }

    //验证合法性 0-9a-zA-Z
    function testString(str){
        var re=/[^(0-9A-Za-z)]/gi;
        return re.test(str);
    }

    //获取传感器信息接口
    function getSensorListAjax(oPara){
        function onSuc(aData){
            if(aData.retCode == -1){
                Frame.Msg.info("获取传感器信息失败！");
                /*
                 假数据
                 */
                var aSensor = [
                    {"sensorName":"传感器1","sensorId":"11-22-33-22-11-22","oxygen":true,"humidity":true,"temperature":false},
                    {"sensorName":"传感器2","sensorId":"22-33-44-22-11-11","oxygen":false,"humidity":false,"temperature":true},
                    {"sensorName":"传感器3","sensorId":"33-11-22-11-22-11","oxygen":true,"humidity":true,"temperature":false},
                    {"sensorName":"传感器4","sensorId":"44-22-33-11-22-11","oxygen":true,"humidity":true,"temperature":true}
                ];
                $("#sensorList").SList("refresh",{data:aSensor,total:4});
                return;
            }
            $("#sensorList").SList("refresh",{ data: aData.result.data, total: aData.result.rowCount });

        }

        var opt = {
            type:"POST",
            url:MyConfig.path+"/wristbandread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getSensorBaseConfig",
                Param:oPara
            }),
            onSuccess:onSuc,
            onFailed:function(jqXHR,textstatus,error){
                var aSensor = [
                    {"sensorName":"传感器1","sensorId":"11-22-33-22-11-22","oxygen":true,"humidity":true,"temperature":false},
                    {"sensorName":"传感器2","sensorId":"22-33-44-22-11-11","oxygen":false,"humidity":false,"temperature":true},
                    {"sensorName":"传感器3","sensorId":"33-11-22-11-22-11","oxygen":true,"humidity":true,"temperature":false},
                    {"sensorName":"传感器4","sensorId":"44-22-33-11-22-11","oxygen":true,"humidity":true,"temperature":true}
                ];
                $("#sensorList").SList("refresh",{data:aSensor,total:4});
                Frame.Msg.info("获取传感器信息超时", "error");
                /*
                 假数据
                 */

            }
        }
        Utils.Request.sendRequest(opt);
    }

    ////获取全部传感器接口
    //function getSensorsAjax(){
    //    function onSuc(aData){
    //        if(aData.result.retCode == -1){
    //            Frame.Msg.info("获取在线传感器失败!");
    //            return;
    //        }
    //        var aSensorMac = aData.result.data?aData.result.data:[];
    //        $("sensorId").singleSelect("InitData",aSensorMac);
    //    }
    //    var opt = {
    //        type:"POST",
    //        url:MyConfig.path+"/wristbandread",
    //        contentType:"application/json",
    //        data:JSON.stringify({
    //            devSN:FrameInfo.ACSN,
    //            Method:"unbindSensor",
    //            Param:{
    //                devSn:FrameInfo.ACSN /*设备序列号*/
    //            }
    //        }),
    //        onSuccess:onSuc,
    //        onFailed:function(jqXHR,textstatus,error){
    //            Frame.Msg.info("获取在线传感器超时", "error");
    //        }
    //    }
    //    Utils.Request.sendRequest(opt);
    //}

    //删除传感器接口函数
    function delSensorAjax(oPara){
        function onSuc(aData){
           if(aData.retCode == -1){
               Frame.Msg.info("删除传感器失败！", "error");
               return;
           }
           Utils.Base.refreshCurPage();
           //Frame.Msg.info("删除传感器成功！", "error");
        }
        var oSensorId = oPara||undefined;
        var oParam = {
            devSn:FrameInfo.ACSN, /*设备序列号*/
            sensorId:oSensorId
        }
        //$.extend(oParam,oPara);
        var opt = {
            type:"POST",
            url:MyConfig.path+"/wristbandwrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"delSensorBaseConfig",
                Param:oParam
            }),
            onSuccess:onSuc,
            onFailed:function(jqXHR,textstatus,error){
                Frame.Msg.info("删除传感器超时！", "error");
            }
        }
        Utils.Request.sendRequest(opt);
    }

    //新建\编辑传感器接口
    /*
    * oParam:
    * devSn:FrameInfo.ACSN
    * type:type, //number  0 new  1 edit
    * mac:mac,//string   符合mac地址格式
    * sensorName://传感器名称
    * boundBuilding//绑定建筑
    *
    * return：
    * {
    *   result:result,
    *   retCode:retCode
    * }
    * */
    function newSensorAjax(oPara,oType){
        function onSuc(aData){
            if(aData.retCode ==-1){

            }else if(aData.retCode == -2){

            }
            Utils.Base.refreshCurPage();
            if(oType.type == 0) {
                Frame.Msg.info("新建传感器成功");
            }else if(oType.type == 1){
                Frame.Msg.info("编辑传感器成功");
            }
        }
        var oParam = {
            devSn:FrameInfo.ACSN /*设备序列号*/
        }
        $.extend(oParam,oPara);
        var opt = {
            type:"POST",
            url:MyConfig.path+"/wristbandwrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"setSensorBaseConfig",
                Param:oParam
            }),
            onSuccess:onSuc,
            onFailed:function(jqXHR,textstatus,error){

                if(oType.type == 0) {
                    Frame.Msg.info("新建传感器超时", "error");
                }else if(oType.type == 1){
                    Frame.Msg.info("编辑传感器超时","error");
                }
            }
        }
        Utils.Request.sendRequest(opt);
    }

    //新建或者新绑定传感器函数
    function newSensorFun(oParam,dlgType){
        $("label#sensorType_error.error").css({display:"none"}).html("");
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addSensor_form")));
        };
        var oTempTable = {
            index: [],
            column: [
                'sensorId',
                'sensorName',
                'temperature',
                'humidity',
                'oxygen',
            ]
        };
        var title = "";
        var oType = {};
        if(dlgType=="class_newadd"){
            title = getRcText("DLGTITLE").split(",")[0];
            oType = {type:0};
        }else if(dlgType==undefined){
            title = getRcText("DLGTITLE").split(",")[1];
            oType = {type:1};
        }
        $("#addSensor_form").form("init", "edit", {
            "title": title,
            "btn_apply": function () {
                var oStData = $("#addSensor_form").form("getTableValue", oTempTable);
                $.extend(oStData,oType);
                if(oStData.humidity == "true"){
                    oStData.humidity = true;
                }else if(oStData.humidity == "false"){
                    oStData.humidity = false;
                }

                if(oStData.oxygen == "true"){
                    oStData.oxygen = true;
                }else if(oStData.oxygen == "false"){
                    oStData.oxygen = false;
                }

                if(oStData.temperature == "true"){
                    oStData.temperature = true;
                }else if(oStData.temperature == "false"){
                    oStData.temperature = false;
                }
                //if(oType.type == 1){
                //    $("label#sensorId_error.error").css({display:"none"});
                //}else if(oType.type == 0){
                //
                //}
                if(!oStData.temperature&&!oStData.oxygen&&!oStData.humidity){
                    $("label#sensorType_error.error").css({display:"inline-block"}).html("请选择一个属性");
                    return;
                }
                newSensorAjax(oStData,oType);
                closeWindow();

            }, "btn_cancel": closeWindow
        });
        $(".seterror",$("#addSensor_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        if(dlgType=="class_newadd"){
            $("#addSensor_form .select2-choice").css({border:"1px solid #e7e7e9"});//background-color: none
            $("#addSensor_form span.select2-arrow").css({display:"inline-block"});
            //$("#sensorId").singleSelect("enable");
            //$("#addSensor_form input[type='text']").css({border:"1px solid #e7e7e9"});
            $("input#sensorId[type='text']").css({border:"1px solid #e7e7e9"}).addClass("required");
            $("#addSensor_form label.info-explain").css({display:"inline-block"});
            $("#addSensor_form label.col-sm-3.control-label").addClass("required");
            $("#addSensor_form").form('updateForm', {
                'sensorId':'',
                'sensorName':'',
                'temperature':'',
                'humidity':'',
                'oxygen':'',
            });

            ////假数据
            //getSensorsAjax();
            //aSensorMac = ["11-22-33-22-11-22","22-33-44-22-11-11","33-11-22-11-22-11","44-22-33-11-22-11"];
            //$("#sensorId").singleSelect("InitData",aSensorMac);
            //$("#sensorId").singleSelect("value","");
        }else if(dlgType==undefined){
            //$("#sensorId").singleSelect("InitData", [oParam[0].sensorId]);
            $("#addSensor_form .editSensor").css({display: "inline-block"});
            $("#addSensor_form").form('updateForm', {
                'sensorId': oParam[0].sensorId,
                'sensorName': oParam[0].sensorName,
                'temperature': oParam[0].temperature + '',
                'humidity': oParam[0].humidity + '',
                'oxygen': oParam[0].oxygen + '',
            });
            //$("#addSensor_form .select2-choice").css({border: "none"})//background-color: none
            $("input#sensorId[type='text']").css({border:"none"}).removeClass("required");
            $("#addSensor_form label.info-explain").css({display: "none"});
            $("label.sensorName_error.info-explain").css({display: "inline-block"});
            //$("#addSensor_form span.select2-arrow").css({display: "none"});
            $("#addSensor_form label.col-sm-3.control-label").removeClass("required");
            $("#sensor-name").addClass("required");
            //$("#sensorId").singleSelect("disable");
        }
        Utils.Base.openDlg(null, {}, { scope: $("#addSensorDlg"), className: "modal-super" });
    }

    //删除传感器
    function deleteSensor(aData){
        Frame.Msg.confirm(getRcText("CONFIRMINFO").split(",")[0], function(){
            $.each(aData,function(index,item){
                delSensorAjax(item.sensorId);
            });
        });
    }

    //列表显示格式
    function  showListStyle(row, cell, value, columnDef, dataContext, type){
        value = value ||"";
        if("text" == type)
        {
            return value;
        }
        switch(cell) {
            case 2:
                if(typeof dataContext["temperature"] == "boolean" && dataContext["temperature"]){
                    return '<p><span class="glyphicon icon-ok"></span></p>'
                }else if(typeof dataContext["temperature"] == "boolean" && dataContext["temperature"]==false){
                    return '<p><span class="glyphicon icon-remove"></span></p>'
                }
                break;
            case 3:
                if(typeof dataContext["humidity"] == "boolean" && dataContext["humidity"]){
                    return '<p><span class="glyphicon icon-ok"></span></p>'
                }else if(typeof dataContext["humidity"] == "boolean" &&dataContext["humidity"]==false){
                    return '<p><span class="glyphicon icon-remove"></span></p>'
                }
                break;
            case 4:
                if(typeof dataContext["oxygen"] == "boolean" && dataContext["oxygen"]){
                    return '<p><span class="glyphicon icon-ok"></span></p>'
                }else if(typeof dataContext["oxygen"] == "boolean" && dataContext["oxygen"]==false){
                    return '<p><span class="glyphicon icon-remove"></span></p>'
                }
                break;
            default:
               break;
        }
    }

    //初始化列表头部
    function initSensorOpt(){
        var option = {
            colNames: getRcText("SENSORLIST"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            pageSize: 10,
            asyncPaging: true,
            sort:false,
            onSearch: function (oFilter, oSorter) {
                //if(oFilter != null)
                //{
                //    var oFilt = {
                //
                //    };
                //}
                initSensorSlist(0, 10, oFilter);
            },
            onPageChange: function (pageSize, pageNum, oFilter) {
                    initSensorSlist(pageNum, pageSize, oFilter);
            },
            colModel: [
                { name: 'sensorId'},
                { name: 'sensorName'},
                { name: 'temperature',formatter:showListStyle},
                { name: 'humidity',formatter:showListStyle},
                { name: 'oxygen',formatter:showListStyle},
            ],
            buttons: [
                { name: "class_newadd",value:getRcText("BUTTONNAME").split(",")[1],mode: Frame.Button.Mode.CREATE,enable: "<1",action:newSensorFun},
                { name: 'default', value:getRcText("BUTTONNAME").split(",")[0], enable: ">0", icon: 'slist-del', action:deleteSensor},
                { name: 'edit' ,action:newSensorFun},
                { name: 'delete', action: deleteSensor}
            ]
        };

        $("#sensorList").SList("head", option);

    }

    //刷新传感器列表
    function initSensorSlist(pageNum, pageSize, oPara){
        pageSize = pageSize || 10;
        pageNum = pageNum || 1;
        oPara = oPara || {};
        var Param = {
            devSn: FrameInfo.ACSN,
            startRowIndex: pageSize * (pageNum-1),
            maxItem: pageSize
        }
        $.extend(Param, oPara);
        getSensorListAjax(Param);
    }

    //初始化Form表的函数---初始化各种对话框
    function initForm(){
        //getSensorsAjax();
    }

    //初始化监听事件
    function initEvent(aMac,aBuild){
        //var aMac = aMac||[];
        //var aBuild = aBuild||[];
        //$("#sensorMac").singleSelect("InitData",aMac);
        //$("#boundBuilding").singleSelect("InitData",aBuild)
    }

    //刷新传感器整个页面数据
    function initSensorData(){
        initSensorOpt();
        initSensorSlist();
    }

    function _init(){
        //initForm();
        //initEvent();
        function setBreadContent(paraArr){
            
            $("#bread_index").css("display",'inline');
            $("#bread_index a").attr("href","#C_CDashboard");
            $("#bread_index a").text("网络管理");
            
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
                        {text:'传感器配置',href:''}]);
        initSensorData();
    }

    function _destroy(){
        aSensorMac = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput","Form","SingleSelect"],
        "utils":["Request","Base"]
    });
})(jQuery);
