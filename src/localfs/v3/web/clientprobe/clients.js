;(function ($) {
    var MODULE_BASE = "clientprobe"
    var MODULE_NAME = MODULE_BASE+".clients";
    var LIST_NAME = "client_mlist";
    var g_aProbeReportSensors = [];
    var g_jForm;
    var g_aRadioOfRunAP = [];
	var strAnt = MyConfig.path + '/ant';
    var g_value = 0;
    var g_wait = 0;
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
            showHeader: true,
            search:true,
            pageSize:12,

			colModel: [
                {name: "MacAddress", datatype:"String"},
                {name: "FirstReportTime", datatype:"String"},
                {name: "LastReportTime", datatype:"String"},
                {name: "DurationTime", datatype:"String"},
                {name: "Ssid", datatype: "String"},
                {name: "Status"},
                //{name: "StatusDurationTime",width:100, datatype: "String"},
                {name: "Vendor", datatype: "String"},
                //{name: "ReportSensorNum"},
                //{name: "RssiMax"},
                //{name: "Rssi"}
            ]

        };
        $("#"+LIST_NAME).SList("head", opt);

    }

    function initData()
    {
        function myCallback(oInfos)
        {
            g_wait.close();
            var aClientProbes = oInfos["clientprobe"] || [];
            g_aProbeReportSensors =  [];
            var oVender = $.MyLocale.PhoneVender;
            $.each(aClientProbes, function(index, oClient){
                var oTimeTemp1 = new Date(oClient.FirstTime);
                var oTimeTemp2 = new Date(oClient.LastTime);
                //var nDurationTime = oTimeTemp2 - oTimeTemp1;Duration
                var nDurationTime = oClient.Duration || 0;
                var sTimesuint = getRcText("TIMES").split(',');
                var nDays = Math.floor(nDurationTime / 3600000 / 24);
                var nHours = Math.floor(nDurationTime % (3600000 * 24) / 3600000);
                var nMinutes = Math.ceil(nDurationTime % (3600000) / 60000);
                var oDurationTime = {"DurationTime":( ((nDays > 0)?(nDays + sTimesuint[2]):'') +
                                                      ((nHours > 0)?(nHours + sTimesuint[3]):'') +
                                                      ((nMinutes > 0)?(nMinutes + sTimesuint[0]):'')
                                    )};
                //nDays = Math.floor(oClient.Duration / 3600 / 24);
                //nHours = Math.floor(oClient.Duration % (3600 * 24) / 3600);
                //nMinutes = Math.ceil(oClient.Duration % (3600) / 60);
                //oClient.StatusDurationTime = ((nDays > 0)?(nDays + sTimesuint[2]):'') +
                //                                          ((nHours > 0)?(nHours + sTimesuint[3]):'') +
                //                                          ((nMinutes > 0)?(nMinutes + sTimesuint[0]):'');
                //if(oClient.StatusDurationTime == '')
                //{
                //    oClient.StatusDurationTime = '0' + sTimesuint[0];
                //}
                if(oDurationTime.DurationTime == '')
                {
                    oDurationTime.DurationTime = '0' + sTimesuint[0];
                }
                oClient.FirstReportTime = oTimeTemp1.toLocaleString();
                oClient.LastReportTime = oTimeTemp2.toLocaleString();
                oClient.Vendor = (oClient.Vendor.split(" ")[0] == "Not")?" ":oClient.Vendor.split(" ")[0];
                oClient.Status = oClient.Status?getRcText("STATUS").split(",")[1]:getRcText("STATUS").split(",")[0];
                oClient.Ssid = oClient.Ssid;
                $.extend(oClient, oDurationTime);

                oClient.Vendor = oVender[oClient.Vendor]?oVender[oClient.Vendor].name:oClient.Vendor;

            });
            $("#"+LIST_NAME).SList("refresh", aClientProbes);
        }
        g_wait = Utils.Msg.wait("waitting...");
        ajax2server([ oclientProbe], myCallback,func_error);


    }
    var oclientProbe = {
        url:strAnt+"/read_probeclient",

        data:{
            Method:"GetClient",
            Param:{
				ACSN:FrameInfo.ACSN,
            },
            return:{

            }
        }
    };
    function func_error(error){if(g_wait){g_wait.close()}}
    var oProbeChoice = {
        GetStatistic:"statistics",
        GetClient:"clientprobe"
    }

    function ajax2server(aData, onSuccess, onError){
        var count = 0;
        var errorCount = 0;
        var getData = {};
        for(var i = 0; i < aData.length; i++){
            $.ajax({
                url:aData[i].url,
                dataType: "json",
                type:"post",
                data:aData[i].data,
                success: function (Data)
                {
                    count++;
                    getData[oProbeChoice[Data.Method]] = Data.Message;
                    if(count == aData.length){
                        onSuccess(getData);
                    }
                },
                error: function(error){
                    errorCount++;
                    if(errorCount==1)
                    {
                        onError(error);
                    }
                }
            });
        }
    }


    function clearform()
    {
        function onSuccess()
        {
            //Utils.Pages.closeWindow(Utils.Pages.getWindow(g_jForm));
            Utils.Base.refreshCurPage();
            //initData();
        }

        var oResetProbeDevices = [];
        var oData = {"MacAddress":"00-00-00-00-00-00"};
        oResetProbeDevices.addRows(oData);
        Utils.Request.action(oResetProbeDevices, {onSuccess:onSuccess, scope:g_jForm});

    }


    function initForm()
    {
        //g_jMlist.on('click', '.showAp', openDalg);
        $("#Cleardlg #Entry_clear").on('click',clearform);
    }

    function _init()
    {
        LIST_NAME = "client_mlist";
        g_aProbeReportSensors = [];
        g_jForm;
        g_aRadioOfRunAP = [];
        strAnt = MyConfig.path + '/ant';
        g_value = 0;
        g_wait = 0;
        oclientProbe = {
            url:strAnt+"/read_probeclient",

            data:{
                Method:"GetClient",
                Param:{
                    ACSN:FrameInfo.ACSN,
                },
                Return:[]
            }
        };


        var url = window.location.href;
        var nindex = url.indexOf("value=");
        var strTime = url.slice(nindex + "value=".length).split("-");

        var oDate = new Date();
        oclientProbe.data.Param.EndTime = Number(strTime[1]);
        oclientProbe.data.Param.StartTime = Number(strTime[0]);


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
    });
})( jQuery );

