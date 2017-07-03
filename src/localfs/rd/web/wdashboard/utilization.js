var g_oPlotData = false;
;(function ($) {
var MODULE_NAME = "WDashboard.Utilization";
var NC, MODULE_NC = "WDashboard.NC";

var g_oTimer = false;

function getRcText(sRcId)
{
    return Utils.Base.getRcString("app_utilization_rc", sRcId);
}
function getCpuMemUsage(Index)
{
    function myCallback(oInfos)
    {
        var aEntityExtInfo = Utils.Request.getTableRows(NC.DeviceExtPhysicalEntities, oInfos);

        var nCpu = parseInt(aEntityExtInfo[0].CpuUsage);
        var nMem = parseInt(aEntityExtInfo[0].MemUsage);
        //for test
        nCpu = parseInt(Math.random()*100);
        nMem = parseInt(Math.random()*100);
        
        drawChart ($("#gauge_cpu"), nCpu, "cpu");
        drawChart ($("#gauge_mem"), nMem, "memory");
        if(g_oTimer)
        {
            clearTimeout(g_oTimer);
        }
        g_oTimer = setTimeout(function(){getCpuMemUsage(Index);},2000);
    }

    var oExtPhysicalEntities = Utils.Request.getTableInstance(NC.DeviceExtPhysicalEntities);
    oExtPhysicalEntities.addFilter({"PhysicalIndex" : Index});  
    Utils.Request.getAll([oExtPhysicalEntities], myCallback);
}

function getVersionInfor(nIndex)
{
    function myCallback(oInfos)
    {
        var aInfo = Utils.Request.getTableRows(NC.DeviceVersionEntities, oInfos);
        var oInfor = {
            "HardwareRev" : false, 
            "FirmwareRev" : false, 
            "SoftwareRev" : false, 
            "SerialNumber" : false
        }, bFlag = false;

        for(var i=0;i<aInfo.length;i++)
        {
            bFlag = true;
            for(key in oInfor)
            {
                oInfor[key] = oInfor[key] || aInfo[i][key];
                if(!oInfor[key])
                {
                    bFlag = false;
                }
            }

            if(bFlag)
            {
                break;
            }
        }
        Utils.Base.updateHtml($("#version_block"),oInfor);
    }

    var oEntityInfo = Utils.Request.getTableInstance(NC.DeviceVersionEntities);
    Utils.Request.getAll([oEntityInfo], {onSuccess:myCallback,showMsg:false,showErrMsg:false});
}

function getMasterPhysicalIndex()
{
    /*function myCallback(oInfos)
    {
        var nPhysicalIndex = 0;
        var aBoard = Utils.Request.getTableRows(NC.DeviceBoards, oInfos);
        $.each(aBoard,function(i){
            if(2 == aBoard[i].Role)
            {
                nPhysicalIndex = aBoard[i].PhysicalIndex;
            }
        });
        if(nPhysicalIndex)
        {
            getCpuMemUsage(nPhysicalIndex);
        }
    }

    var oBoards = Utils.Request.getTableInstance(NC.DeviceBoards);
  
    Utils.Request.getAll([oBoards], myCallback);*/

    function myCallback(oInfos)
    {
        var aEntityExtInfo = Utils.Request.getTableRows(NC.DeviceExtPhysicalEntities, oInfos);
        var nPhysicalIndex = aEntityExtInfo[0].PhysicalIndex;
        if(nPhysicalIndex)
        {
            getCpuMemUsage(nPhysicalIndex);
            getVersionInfor(nPhysicalIndex);
        }

    }

    var oExtPhysicalEntities = Utils.Request.getTableInstance(NC.DeviceExtPhysicalEntities);
    oExtPhysicalEntities.addMatchFilter({"CpuUsage" : "notLess:0"});  
    Utils.Request.getAll([oExtPhysicalEntities], myCallback);
}

function changeBarColor(Usage)
{
    if(0 == Usage)
    {
        return '#F6F7F8';
    }
    return (Usage>=80)?'#f88e98':'#7FCAEA';
}

function drawChart (jEle, val, sName)
{
    var sColor = changeBarColor(val);
    var opt = {
        color: sColor,
        bgColor: '#F6F7F8',
        radius: 65,
        height: 163,
        series:{
            name:sName,
	        radius:["65%","90%"],
            center:['50%', '50%'],
            data: val //nUsed
        },
        title:
            '<div class="text-container">'+
            '<div class="title"></div><div class="divide"/>'+
            '<div class="subtitle"></div>'+
            '</div>'
    }
    jEle.echart().echart("pie", opt);
        
    $(".title", jEle).html(val+"%");
    $(".subtitle", jEle).html(getRcText(sName));
}

function initForm(){
    var jForm = $("#utilization_page");
    $(".link-detail",jForm).on("click",function(){
        Utils.Base.redirect ({np:"WDashboard.index",ID:$(this).attr("id")});
       return false;
    });
    $("#refresh_utilization").on("click", getMasterPhysicalIndex);
}
function _init()
{
    NC = Utils.Pages[MODULE_NC].NC;
    initForm();
    getMasterPhysicalIndex();
}

function _resize(jParent)
{
}

function _destroy()
{
    g_bChartInit = false;
    clearTimeout(g_oTimer);
}
Utils.Pages.regModule(MODULE_NAME, {
    "init": _init, 
    "destroy": _destroy,
    "resize": _resize, 
    "widgets": ["Echart"], 
    "utils":["Request","Device", "Timer"],
    "subModules":[MODULE_NC]
});

})( jQuery );
