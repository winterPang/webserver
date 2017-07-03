;(function ($) {
    var MODULE_BASE = "clientprobe"
    var MODULE_NAME = MODULE_BASE+".clients";
    var NC, MODULE_NC = MODULE_BASE+".NC";
    var LIST_NAME = "client_mlist";
    var g_aProbeReportSensors = [];
    var g_jForm;
    var g_aRadioOfRunAP = [];
   
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("client_rc", sRcName);
    }

    function showAp(row, cell, value, columnDef, dataContext, type)
    {
        if(!value)
        {
            return "";
        }
        if("text" == type)
        {
            return value;
        }
        if(value > 0)
        {
            return "<a class='showAp' MacAddress='"+dataContext.MacAddress+"'>"+dataContext.ReportSensorNum+"</a>";
        }
        return false;

    }

    function openEditDlg()
    {
        Utils.Base.openDlg(null, {}, {scope:$("#Cleardlg"),className:"modal-small"});

    }
    
    function initGrid()
    {
        var opt = {
            colNames: getRcText ("LIST_HEADER"),
            colModel: [
                {name: "MacAddress",width:120, datatype: "Mac"},
                {name: "FirstReportTime",width:130, datatype:"String"},
                {name: "LastReportTime",width:130, datatype:"String"},
                {name: "DurationTime",width:100, datatype:"String"},
                {name: "Ssid", datatype: "String"},
                {name: "Status", datatype: "Order",data:getRcText("STATUS")},
                {name: "StatusDurationTime",width:100, datatype: "String"},
                {name: "Vendor", datatype: "String"},               
                {name: "ReportSensorNum",width:80, datatype: "Integer",formatter:showAp},
                {name: "RssiMax", datatype:"Integer"},
                {name: "Rssi", datatype:"Integer"}
            ],
            buttons: [
                {name: "add", enable:false},
                {name: "edit", enable:false},
                {name: "delete", enable:false},
                {id:"btn2", name:"btn2", value:$.MyLocale.Buttons.CLEAR, mode:Frame.Button.Mode.CLEAR, action:openEditDlg}
            ]
        };
        $("#"+LIST_NAME).mlist("head", opt);
        var opt1 = {
            colNames: getRcText ("LIST_SIMPLE_HEADR"),
            showHeader: true,
            search:true,
            colModel: [
                {name: "SensorName",width:100,datatype: "String"},
                {name: "AssociatedMacAddress",width:100,datatype:"Mac"},
                {name: "RadioId",width:100,datatype:"String"},
                {name: "Rssi",width:100,datatype:"Integer"},
                {name: "Channel",width:100,datatype:"Integer"}
            ]
        };
        $('#sensor_Slist').SList("head", opt1);    
    }

    function openDalg(e)
    {
        function myCallback(oInfos)
        {
            g_aRadioOfRunAP = Utils.Request.getTableRows(NC.RadioOfRunAP, oInfos) || [];
            var aData = g_aProbeReportSensors;
            aData = $.grep(aData, function(oTemp, i){
                if(e.target.attributes.macaddress.value == oTemp.DeviceMacAddress)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            });

            $.each(aData, function(i, oTemp){
                var aApsearched = $.grep(g_aRadioOfRunAP, function(oAP, i){
                    return oTemp.SensorName == oAP.ApName && oTemp.RadioId == oAP.RadioID;
                });
                if(aApsearched.length)
                {
                    aData[i].RadioId = Utils.AP.radioDisplay(aApsearched[0].Mode, oTemp.RadioId);
                }

            });

            $("#sensor_Slist").SList("refresh",aData);
            
            Utils.Base.openDlg(null, {}, {scope:$("#Opendlg"),className:"modal-super dashboard"});


        }
        var oRadioOfRunAP = Utils.Request.getTableInstance(NC.RadioOfRunAP); 
        Utils.Request.getAll([oRadioOfRunAP], myCallback);
    }


    function initData()
    {
        function myCallback(oInfos)
        {
            var aClientProbes = Utils.Request.getTableRows(NC.ClientProbes, oInfos) || []; 
            g_aProbeReportSensors = Utils.Request.getTableRows(NC.ProbeReportSensors, oInfos) || [];             
            var oVender = $.MyLocale.PhoneVender; 
            $.each(aClientProbes, function(index, oClient){
                var oTimeTemp1 = new Date(oClient.FirstReportTime);
                var oTimeTemp2 = new Date(oClient.LastReportTime);
                var nDurationTime = oTimeTemp2 - oTimeTemp1;
                var sTimesuint = getRcText("TIMES").split(',');
                var nDays = Math.floor(nDurationTime / 3600000 / 24);
                var nHours = Math.floor(nDurationTime % (3600000 * 24) / 3600000);
                var nMinutes = Math.ceil(nDurationTime % (3600000) / 60000);
                var oDurationTime = {"DurationTime":( ((nDays > 0)?(nDays + sTimesuint[2]):'') +
                                                      ((nHours > 0)?(nHours + sTimesuint[3]):'') +
                                                      ((nMinutes > 0)?(nMinutes + sTimesuint[0]):'')
                                    )};
                nDays = Math.floor(oClient.StatusDurationTime / 3600 / 24);
                nHours = Math.floor(oClient.StatusDurationTime % (3600 * 24) / 3600);
                nMinutes = Math.ceil(oClient.StatusDurationTime % (3600) / 60);
                oClient.StatusDurationTime = ((nDays > 0)?(nDays + sTimesuint[2]):'') +
                                                          ((nHours > 0)?(nHours + sTimesuint[3]):'') +
                                                          ((nMinutes > 0)?(nMinutes + sTimesuint[0]):'');
                if(oClient.StatusDurationTime == '')
                {
                    oClient.StatusDurationTime = '0' + sTimesuint[0];
                }
                if(oDurationTime.DurationTime == '')
                {
                    oDurationTime.DurationTime = '0' + sTimesuint[0];
                }

                $.extend(oClient, oDurationTime);

                oClient.Vendor = oVender[oClient.Vendor]?oVender[oClient.Vendor].name:oClient.Vendor;

            });       
            $("#"+LIST_NAME).mlist("refresh", aClientProbes);
        }
        var oProbeReportSensors = Utils.Request.getTableInstance(NC.ProbeReportSensors);
        var oClientProbes = Utils.Request.getTableInstance(NC.ClientProbes); 
        Utils.Request.getAll([oClientProbes,oProbeReportSensors], myCallback);
    }

    function clearform()
    {
        function onSuccess()
        {
            //Utils.Pages.closeWindow(Utils.Pages.getWindow(g_jForm));
            Utils.Base.refreshCurPage();
            //initData();
        }

        var oResetProbeDevices = Utils.Request.getTableInstance(NC.ResetProbeDevices);
        var oData = {"MacAddress":"00-00-00-00-00-00"};
        oResetProbeDevices.addRows(oData);
        Utils.Request.action(oResetProbeDevices, {onSuccess:onSuccess, scope:g_jForm});

    }


    function initForm()
    {
        g_jMlist.on('click', '.showAp', openDalg);
        $("#Cleardlg #Entry_clear").on('click',clearform);
    }

    function _init()
    {
        NC = Utils.Pages[MODULE_NC].NC; 
        g_jMlist = $('#client_mlist');
        g_jForm = $('#Cleardlg');
        initForm();
        initGrid();
        initData();
    }

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["Mlist","SList"], 
        "utils":["Request","Base"],
        "subModules":[MODULE_NC]
    });
})( jQuery );

