;(function ($) {
    var g_oPlotData = false;
    var MODULE_NAME = "h_dashboard.utilization";

var g_oTimer = false;

function getRcText(sRcId)
{
    return Utils.Base.getRcString("app_utilization_rc", sRcId);
}
// function getCpuMemUsage(Index)
// {
//     var aEntityExtInfo = [{"PhysicalIndex":"1","AdminState":"1","OperState":"3","CpuUsage":"40","MemUsage":"50","MAC":"38-22-D6-59-5A-00"}];
//     var nCpu = parseInt(aEntityExtInfo[0].CpuUsage);
//     var nMem = parseInt(aEntityExtInfo[0].MemUsage);
    
//     drawChart ($("#gauge_cpu"), nCpu, getRcText("cpu"));
//     drawChart ($("#gauge_mem"), nMem, getRcText("memory"));
// }

// function getVersionInfor(nIndex)
// {
//     var oInfor = {"devHardVersion":"Ver.B","devBootWare":"2.12","devSoftVersion":"7.1.048 B732201","SerialNumber":"210231A85LH119000026"};
//     Utils.Base.updateHtml($("#version_block"),oInfor);
// }

// function getMasterPhysicalIndex()
// {
//     var nPhysicalIndex = "1";
//     getCpuMemUsage(nPhysicalIndex);
//     getVersionInfor(nPhysicalIndex);
// }

function getSystemInfo () {
    return $.ajax({
        url: MyConfig.path+"/devmonitor/web/system",
        type: "GET",
        dataType:"json",
        data:{
            devSN:FrameInfo.ACSN
        }
    });
}
function changeBarColor(Usage)
{
    if(0 == Usage)
    {
        return '#F6F7F8';
    }
    return (Usage>=80)?'#f88e98':'#7FCAEA';
}

function drawChart (jEle, val, sName) {
    var labelTop = {
            normal : {
                label : {
                    show : true,
                    position : 'center',
                    formatter : '{b}',
                    textStyle: {
                        baseline : 'bottom'
                    }
                },
                labelLine : {
                    show : false
                }
            }
        };
    var labelFromatter = {
        normal : {
            label : {
                formatter : function (params){
                    return 100 - params.value + '%'
                },
                textStyle: {
                    baseline : 'top'
                }
            }
        },
    }
    var labelBottom = {
            normal : {
                color: '#ccc',
                label : {
                    show : true,
                    position : 'center'
                },
                labelLine : {
                    show : false
                }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };
    var radius = [40, 55];
    var option = {
        height: "250px",
        width: "200px",
        series : [
            {
                type : 'pie',
                center : ['40%', '50%'],
                
                radius : radius,
                x: '0%', // for funnel
                itemStyle : labelFromatter,
                data : [
                    {name:'other', value:100-val, itemStyle : labelBottom},
                    {name:sName, value:val,itemStyle : labelTop}
                ]
            }
        ]
    };
    jEle.echart("init", option);             
}

function initForm()
{
    g_jForm = $("#system_form");
    g_jForm.form("init", "edit", {"title":getRcText("FORM_TITLE"), "btn_apply": false});
}
function getSystemFlowSuc (data) {
    var nCpu = parseInt(data.cpuRatio);
    var nMem = parseInt(data.memoryRatio);
    drawChart ($("#gauge_cpu"), nCpu, getRcText("cpu"));
    drawChart ($("#gauge_mem"), nMem, getRcText("memory"));
    data.SerialNumber = FrameInfo.ACSN;
    Utils.Base.updateHtml($("#version_block"),data);
}
function getSystemFlowFail (data) {
    // body...
}
function _init()
{
    initForm();
    var systemFlowOpt = {
        url: MyConfig.path+"/devmonitor/web/system",
        type: "GET",
        dataType:"json",
        data:{
            devSN:FrameInfo.ACSN
        },
        onSuccess:getSystemFlowSuc,
        onFailed:getSystemFlowFail
    };
    Utils.Request.sendRequest(systemFlowOpt);

    function get_DevStatusSuc( data )
    {
        var adev_statuslist=data.dev_statuslist || [];
        var Connect_Sta=getRcText("Connect_Sta").split(",");
        if(adev_statuslist.length==1){
            if(adev_statuslist[0].dev_status==1)
            {
                $("#devCloudConnectionState").text(Connect_Sta[0]);
            }
            else{
                $("#devCloudConnectionState").text(Connect_Sta[1]);
            }
        }else{
            $("#devCloudConnectionState").text(Connect_Sta[1]);
        }
    };

    function get_DevStatusFail()
    {

    };

    var get_DevStatus = {
        url: MyConfig.v2pathDev + "/oasis-rest-shop-dev/restshop/o2oportal" + "/getDevStatus",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        //username :MyConfig.username,
        //password : MyConfig.password,
        data: JSON.stringify({
            tenant_name:FrameInfo.g_user.attributes.name,
            dev_snlist: [FrameInfo.ACSN],
        }),
        onSuccess: get_DevStatusSuc,
        onFailed: get_DevStatusFail 
    };
    // Utils.Request.sendRequest( get_DevStatus ); /*v2v3融合，统称设备通道状态*/

    function get_DevSuc( data )
    {
        var statust=data.status || [];
        var Connect_Sta=getRcText("Connect_Stav3").split(",");
            if(statust == 0)
            {
                $("#devv3CloudConnectionState").text(Connect_Sta[0]);

            }else{
                $("#devv3CloudConnectionState").text([Connect_Sta[1]]);
            }
    };

    function get_DevFail()
    {

    };

    var get_Dev = {
        url: MyConfig.path+"/base/getDev",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({devSN: FrameInfo.ACSN}),
        onSuccess: get_DevSuc,
        onFailed: get_DevFail 
    };
    Utils.Request.sendRequest( get_Dev );
}

function _resize(jParent)
{
}

function _destroy()
{
    g_bChartInit = false;
    clearTimeout(g_oTimer);
    Utils.Request.clearMoudleAjax(MODULE_NAME);
}

Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "Form"],
        "utils": ["Request", "Base","Timer"]
    });
})(jQuery);