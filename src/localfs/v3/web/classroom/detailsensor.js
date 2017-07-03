/**
 * Created by Administrator on 2016/10/12.
 */
(function ($) {
    var MODULE_NAME = "classroom.detailsensor";
    var g_oPara = null;
    var g_roomName = null;

    function getRcText(sRcName) {
        return Utils.Base.getRcString("sensor_rc", sRcName);
    }
    //获取房间内被绑定的传感器数据
    function getBoundSensorBaseConfig(g_roomName,pageSize, pageNum, oFilt){
        pageSize = pageSize || 10;
        pageNum = pageNum || 1;
        var oParam1 = {
            devSn: FrameInfo.ACSN,
            boundBuilding:g_roomName,
            startRowIndex:pageSize * (pageNum-1),
            maxItem:pageSize
        }
        $.extend(oParam1,oFilt);

        var Option = {
            type: "POST",
            url:MyConfig.path+"/wristbandread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method:'getBoundSensorBaseConfig',
                Param:oParam1
            }),
            onSuccess:function(aData){
                if(aData.result.retCode!= 1){
                    Frame.Msg.info("获取房间传感器信息失败!",'error');
                    return;
                }
                $("#room-detail").SList("refresh",{ data: aData.result.data, total: aData.result.rowCount});
            },
            onFailed: function () {
                Frame.Msg.info("获取房间传感器信息失败",'error');
            }
        };
        Utils.Request.sendRequest(Option);
    }


    //获得未绑定该房间的传感器ID
    function getUnboundSensorNumber() {
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        var Option = {
            type: "POST",
            url:MyConfig.path+"/wristbandread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method:'getUnboundSensorNumber',
                Param:oParam1
            }),
            onSuccess:function(aData){
                if(aData.retCode!=1){
                    Frame.Msg.info("获取传感器MAC失败", "error");
                    return;
                }
                var arrSensor=aData.result?aData.result:[];
                $('#sensorID').singleSelect('InitData', arrSensor);
            },
            onFailed: function (jqXHR, textstatus, error) {
                Frame.Msg.info("获取传感器MAC失败", "error");
            }
        };
        Utils.Request.sendRequest(Option);
    }

    //添加房间传感器的接口
    function bindSensor(sensorId,g_roomName){
        var oParam1 = {
            devSn:FrameInfo.ACSN,
            boundBuilding:g_roomName
        }
        $.extend(oParam1,sensorId);
        var Option = {
            type:"POST",
            url:MyConfig.path+"/wristbandwrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"bindSensor",
                Param:oParam1
            }),
            onSuccess:function(data){
                if (data.retCode != 1) {
                    Frame.Msg.info("添加传感器失败！");
                    return;
                }
                Utils.Base.refreshCurPage();
                Frame.Msg.info("添加传感器成功！");
            },
            onFailed:function(jqXHR,textstatus,error){
                Frame.Msg.info("添加传感器失败！");
            }

        }
        Utils.Request.sendRequest(Option);
    }

    //删除房间传感器的接口
    function unbindSensor(oParam) {
        var oSensorId = oParam||undefined;
        var Param = {
            devSn: FrameInfo.ACSN,
            sensorId:oSensorId
        };
        var option = {
            type: 'POST',
            url:MyConfig.path+"/wristbandwrite",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'unbindSensor',
                Param: Param
            }),
            onSuccess:function(aData){
                if (aData.retCode != 1) {
                    Frame.Msg.info("删除传感器失败！","error");
                    return;
                }
                Utils.Base.refreshCurPage();
                Frame.Msg.info("删除传感器成功！");

            },
            onFailed:function(jqXHR,textstatus,error){
                Frame.Msg.info("删除房间传感器失败！");
            }

        }
        Utils.Request.sendRequest(option);
    }

    //添加传感器
    function addSensor() {
        initSingleSelect();
        $("#add_form").form('updateForm', {
            'sensorID':''
        });
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#add_form")));
        };
        var oTempTable = {
            index: [],
            column: [
                'sensorID'
            ]
        };
        $("#add_form").form("init", "edit", {
            "title": "新建房间传感器",
            "btn_apply": function () {
                var oStData = $("#add_form").form("getTableValue", oTempTable);
                    addSensorData(oStData);
                    closeWindow();

            }, "btn_cancel": closeWindow
        });
        $("#sensorID").val("");
        $("#s2id_classAP .select2-chosen").html("请选择…");
        $("#s2id_classAP abbr").css({background: "none"});
        $("#classAP_error").css({display: "none"});

        $("#s2id_classAP .select2-arrow b").attr("style","display:block");
        $("#sensorID").removeAttr("disabled");
        Utils.Base.openDlg(null, {}, {scope: $("#AddDlg"), className: "modal-super"});
    }

//添加房间数据
    function addSensorData(sensorData) {
        var oTemp1 = {
            sensorId: sensorData["sensorID"] || "null"
        };
        //使传感器和建筑绑定函数
        bindSensor(oTemp1,g_roomName);
    }


//删除房间数据
    function delSensor(param) {
        Frame.Msg.confirm("是否确定删除？", function(){
            $.each(param,function(index,item){
                unbindSensor(item.sensorId);
            });
        });

    }

    function initSingleSelect() {

        getUnboundSensorNumber();
    };
    function returnPage() {
        //返回至首页面
        Utils.Base.redirect({np: 'classroom.typicalbuild'});
        return false;
    }

    function initSlist(g_roomName){
        var optInfo = {
            colNames: getRcText("SENSOR_HEAD"),
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            pageSize:10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.sensorId= oFilter.sensorId;
                    oFilt.sensorName= oFilter.sensorName;
                    oFilt.temperatureValue= oFilter.temperatureValue;
                    oFilt.humidityValue= oFilter.humidityValue;
                    oFilt.oxygenValue= oFilter.oxygenValue;
                }
                getBoundSensorBaseConfig(g_roomName,pageSize, pageNum ,oFilt);
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.sensorId= oFilter.sensorId;
                    oFilt.sensorName= oFilter.sensorName;
                    oFilt.temperatureValue= oFilter.temperatureValue;
                    oFilt.humidityValue= oFilter.humidityValue;
                    oFilt.oxygenValue= oFilter.oxygenValue;
                }
                getBoundSensorBaseConfig(g_roomName,10, 1,oFilt);
            },
            colModel: [
                {name:'sensorId'},
                {name:'sensorName'},
                {name:'temperatureValue'},
                {name:'humidityValue'},
                {name:'oxygenValue'}
            ],
            buttons: [
                {
                    name: 'class_newadd',
                    enable: "<1",
                    value:"添加",
                    mode: Frame.Button.Mode.CREATE,
                    action:addSensor
                },
                { name: 'default', value: '删除', enable: ">0", icon: 'slist-del', action: delSensor},
                //{ name: 'edit', action: editRoom },
                { name: 'delete', action: delSensor}
            ]
        };
        $("#room-detail").SList ("head", optInfo);
    }
    function initData(g_roomName){
        getBoundSensorBaseConfig(g_roomName,10, 1);

    }
    function _init() {
        g_oPara = Utils.Base.parseUrlPara();
        g_roomName = decodeURI(g_oPara.buildname);
        $("#room_name").html(g_roomName + getRcText("Detail"));
        $("#return").on('click', returnPage);
        initData(g_roomName);
        initSlist(g_roomName);

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
