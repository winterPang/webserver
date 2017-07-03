(function($){
var MODULE_BASE = "health";
var MODULE_NAME = MODULE_BASE +".dephealth";

/*深度体检报告的显示*/
/*
 获取空口质量报告的数据
 */
function getQualityReportData(){

    var reportFlowOpt = {
        url:MyConfig.path +"/diagnosis_read/web/report?devSN="+FrameInfo.ACSN,
        type:'get',
        dataType:'json',
        onSuccess:getReportFlowSuc,
        onFailed:getReportFlowFail
    };

       Utils.Request.sendRequest(reportFlowOpt);

}

/*
   获取空口质量报告成功的回调
*/
function getReportFlowSuc(data){

    var apreport = data.apreport;
    var rrmreport = data.rrmreport;
    var waitTime = data.rrmreport.WaitTime;

    if( waitTime == undefined){

        analyseReportData(apreport,rrmreport);

    }
    else
    {
        analysereportdata(apreport);


        if( waitTime <= 2000){

            var WaitTime = waitTime + 2000;
            Frame.Msg.alert("频谱分析已经结束，正在计算上报调整信道、功率及调整建议");
            setTimeout(function(){

                var reportFlowOpt = {
                    url:MyConfig.path +'/diagnosis_read/web/report?devSN='+FrameInfo.ACSN,
                    type:'post',
                    dataType:'json',
                    data:{
                        rrm:rrm
                    },
                    onSuccess:getReportSuc,
                    onFailed:getReportFail
                };

                Utils.Request.sendRequest(reportFlowOpt);

            },WaitTime);
        }
        else
        {
            Frame.Msg.alert("频谱分析已经结束，正在计算上报调整信道、功率及调整建议，耗时较长,可去历史记录中查看");
        }
    }

    /*
     再次获取空口质量报告成功的回调
     */
    function getReportSuc(doc){

        var rrmReport = doc.rrmreport;
        if( rrmReport.length != 0) {

            analyseReportData(apreport,rrmReport);
        }
    }

    /*
     再次获取空口质量报告失败的回调
     */
    function getReportFail(){

    }
}


/*
   获取空口质量报告失败的回调
*/
function getReportFlowFail(){

     Frame.Msg.error("获取空口质量报告数据失败");
}


/*
 解析空口质量报告和rrmserver返回的数据
*/
function analyseReportData(qualityReportData,rrmserverData){
    var rrmserver_Data = [];
    var qualityReport_Data = [];
    var ApreportData = [];
    try {
        for (var k = 0; k < qualityReportData.length; k++) {
            qualityReport_Data[k] = {};
            qualityReport_Data[k].ApName = qualityReportData[k].ApName;
            qualityReport_Data[k].RadioId = qualityReportData[k].RadioId;
            qualityReport_Data[k].RadioType = qualityReportData[k].RadioType;
            qualityReport_Data[k].workingchl = qualityReportData[k].workingchl;
            ApreportData = qualityReportData[k].ApreportData;

            if( ApreportData[0].AQRpt != undefined) {
                for (var j = 0; j < ApreportData.length; j++) {
                    if (qualityReportData[k].workingchl == ApreportData[j].AQRpt.ChlNum) {
                        qualityReport_Data[k].AvgAQ = ApreportData[j].AQRpt.AvgAQ;
                        break;
                    }
                }
            }else{
                        qualityReport_Data[k].AvgAQ = "无法获取(此AP不支持频谱分析)";
            }
        }

        var ClbSuggestionList = rrmserverData.ClbSuggestionList;
        if (ClbSuggestionList.length != 0) {
            for (var i = 0; i < ClbSuggestionList.length; i++) {
                rrmserver_Data[i] = {};
                rrmserver_Data[i].ApName = ClbSuggestionList[i].ApName;
                rrmserver_Data[i].RadioID = ClbSuggestionList[i].RadioID;
                rrmserver_Data[i].RadioType = ClbSuggestionList[i].RadioType;
                rrmserver_Data[i].ChlNum = ClbSuggestionList[i].RdEnvAftChg.ChlNum;
                rrmserver_Data[i].PwrLvl = ClbSuggestionList[i].RdEnvAftChg.PwrLvl;
                rrmserver_Data[i].ReasBitMap = ClbSuggestionList[i].ReasBitMap;
            }
        }

    }catch(exception){

    }

            if( ClbSuggestionList != undefined){

                displayQualityReport_Data(qualityReport_Data,rrmserver_Data);
            }
            else {

                analysereportdata(qualityReportData);
            }
}


/*在rrmserver无数据情况下，暂时只显示空口质量报告*/
function analysereportdata(qualityreportdata){
    var qualityreport_data = [];
    var ApreportData;
    try {
        for (var i = 0; i < qualityreportdata.length; i++) {
            qualityreport_data[i] = {};
            qualityreport_data[i].ApName = qualityreportdata[i].ApName;
            qualityreport_data[i].RadioType = qualityreportdata[i].RadioType;
            qualityreport_data[i].workingchl = qualityreportdata[i].workingchl;
            qualityreport_data[i].ReasBitMap = "";
            qualityreport_data[i].suggest = "";
            ApreportData = qualityreportdata[i].ApreportData;

            if( ApreportData[0].AQRpt != undefined) {
                for (var j = 0; j < ApreportData.length; j++) {
                    if (qualityreportdata[i].workingchl == ApreportData[j].AQRpt.ChlNum) {
                        qualityreport_data[i].AvgAQ = ApreportData[j].AQRpt.AvgAQ;
                        break;
                    }
                }
            }else{
                        qualityreport_data[i].AvgAQ = "无法获取(此AP不支持频谱分析)";
            }
        }
    }
    catch(exception){

    }
            $("#qualityReport_slist").SList("refresh",qualityreport_data);
}

/*
  获取干扰设备报告的数据
*/
function getInterfereReportData(){

    var interfReportFlowOpt = {
        url:MyConfig.path +"/diagnosis_read/web/interfReport?devSN="+FrameInfo.ACSN,
        type:"get",
        dataType:"json",
        onSuccess:getInterfReportFlowSuc,
        onFailed:getInterfReportFlowFail
    };

      Utils.Request.sendRequest(interfReportFlowOpt);
}

/*获取干扰设备报告成功的回调*/
function getInterfReportFlowSuc(data){

    analyseInterfereReportData(data);

}

/*获取干扰设备报告失败的回调*/
function getInterfReportFlowFail(){

}

/*
  解析获取的干扰设备报告数据
*/
function analyseInterfereReportData(data){
    var deviceReportData;
    var RdIntfDevInfo;
    var f = 0;
    var h = 0;
    var interfereReportData = [];
    var Chls = [];
    try {
        for (var i = 0; i < data.length; i++) {
            interfereReportData[f] = {};
            interfereReportData[f].ApName = data[i].ApName;
            interfereReportData[f].RadioType = data[i].RadioType;
            deviceReportData = data[i].deviceReportData;
            for (var j = 0; j < deviceReportData.length; j++) {
                RdIntfDevInfo = deviceReportData[j].RdIntfDevInfo;
                interfereReportData[f].DbID = RdIntfDevInfo.DbID;
                interfereReportData[f].SignalStr = RdIntfDevInfo.SignalStr;
                for (var k = 0; k < RdIntfDevInfo.Chls.length; k++) {
                    if(RdIntfDevInfo.Chls[k].Chl != 0) {
                        Chls[h] = RdIntfDevInfo.Chls[k].Chl;
                        h++;
                    }
                }
                interfereReportData[f].Chls = JSON.stringify(Chls);
                f++;
            }
        }
    }catch(exception){

    }
              displayInterfereReport_Data(interfereReportData);
}

/*
  显示空口质量报告的head部分
*/
function displayQualityReport_head(){
    var opt_head ={
        colNames:getRcText("qualityReportTitle"),
        showHeader:true,
        multiSelect:false,
        pageSize:5,
        colModel:[
            {name:"ApName",datatype:"String",width:60},
            {name:"RadioType",datatype:"String",width:60},
            {name:"workingchl",datatype:"String",width:60},
            {name:"AvgAQ",datatype:"String",width:80},
            {name:"ReasBitMap",datatype:"String",width:60},
            {name:"suggest",datatype:"String",width:130}
        ]
    };
            $("#qualityReport_slist").SList("head",opt_head);
}

/*显示空口质量报告的body部分*/
function displayQualityReport_Data(qualityReport_Data,rrmserver_Data){
    var reportData = [];
    try {
        if ((rrmserver_Data.length != 0) && (qualityReport_Data.length != 0)) {
            for( var i =0 ; i < qualityReport_Data.length; i++){
                reportData[i] = {};
                reportData[i].ApName = qualityReport_Data[i].ApName;
                reportData[i].RadioType = qualityReport_Data[i].RadioType;
                reportData[i].workingchl = qualityReport_Data[i].workingchl;
                reportData[i].AvgAQ = qualityReport_Data[i].AvgAQ;

                for( var j = 0; j < rrmserver_Data.length; j++){
                    if( (qualityReport_Data[i].ApName == rrmserver_Data[j].ApName) && (qualityReport_Data[i].RadioId == rrmserver_Data[j].RadioID)){
                        reportData[i].ReasBitMap = rrmserver_Data[j].ReasBitMap;
                        reportData[i].suggest = getRcText('chl') + rrmserver_Data[j].ChlNum + ',' + getRcText('por') + rrmserver_Data[j].PwrLvl;
                        break;
                    }
                }
            }
        }
        else if ((rrmserver_Data.length == 0) && (qualityReport_Data.length != 0)) {
            for (var k = 0; k < qualityReport_Data.length; k++) {
                reportData[k] = {};
                reportData[k].ApName = qualityReport_Data[k].ApName;
                reportData[k].RadioType = qualityReport_Data[k].RadioType;
                reportData[k].workingchl = qualityReport_Data[k].workingchl;
                reportData[k].AvgAQ = qualityReport_Data[k].AvgAQ;
                reportData[k].ReasBitMap = getRcText('ReasBitMap');
                reportData[k].suggest = getRcText('suggest');
            }
        }
             for( var i = 0; i < reportData.length;i++){
                 if( reportData[i].ReasBitMap == 0){
                     reportData[i].ReasBitMap = getRcText('reason0');
                 }
                 else if( reportData[i].ReasBitMap == 2){
                     reportData[i].ReasBitMap = getRcText('reason');
                 }
                 else if( reportData[i].ReasBitMap == 8){
                     reportData[i].ReasBitMap = getRcText('reason1');
                 }
                 else if( reportData[i].ReasBitMap == 16){
                     reportData[i].ReasBitMap = getRcText('reason2');
                 }
                 else if( reportData[i].ReasBitMap == 32){
                     reportData[i].ReasBitMap = getRcText('reason3');
                 }
                 else if( reportData[i].ReasBitMap == 64){
                     reportData[i].ReasBitMap = getRcText('reason4');
                 }
                 else if( reportData[i].ReasBitMap == 256){
                     reportData[i].ReasBitMap = getRcText('reason5');
                 }
             }
    }catch(exception){

    }
                $("#qualityReport_slist").SList("refresh",reportData);
}

/*
  显示干扰设备报告的head部分
*/
function displayInterfereReport_head(){
    var opt_head = {
        colNames:getRcText("interfereReportTitle"),
        showHeader:true,
        multiSelect:false,
        pageSize:5,
        colModel:[
            {name:"DbID",datatype:"String",width:100},
            {name:"SignalStr",datatype:"String",width:80},
            {name:"Chls",datatype:"String",width:80},
            {name:"ApName",datatype:"String",width:80},
            {name:"RadioType",datatype:"String",width:80}
        ]
    };
           $("#interfereReport_slist").SList("head",opt_head);
}

/*
  显示干扰设备报告的body部分
*/
function displayInterfereReport_Data(interfereReportData) {

    if ((interfereReportData != "") && (interfereReportData.length != 0)){
        $("#interfereReport_slist").SList("refresh", interfereReportData);
    }
}

function getRcText(sRcId){
    return Utils.Base.getRcString("dep_health_rc",sRcId);
}

function getRcString(sRcId,sRcName){
    return $("#"+sRcId).attr(sRcName);
}

function _init(){

    var date = (new Date()).toLocaleDateString();
    var year = date.split('/')[0];
    var month = date.split('/')[1];
    var day = date.split('/')[2];

    if(month < 10){
        month = "0"+ month;
    }
    if(day < 10){
        day = "0" + day;
    }
    var currentDate = year + "-" + month + "-" + day;

    judgeDeepCheck(currentDate);
}

/*循环定时器每隔20秒钟查看下是否深度体检成功*/
function judgeDeepCheck(currentDate){
    var timeout = 0;
    var num = 1;
    var interval = setInterval(function () {

        var existFlowOpt = {
            url: MyConfig.path +'/diagnosis_read/web/existreport?devSN=' + FrameInfo.ACSN,
            type: 'post',
            dataType: 'json',
            data: {
                date: currentDate,
                num:num
            },
            onSuccess:getReportSuc,
            onFailed:getReportFail
        };

            Utils.Request.sendRequest(existFlowOpt);

        /*获取深度体检报告成功的回调*/
        function getReportSuc(data){

            if( data.click > 0){
                clearInterval(interval);
                $("#load").addClass('hide');
                $("#qualityReport").removeClass('hide');
                $("#interfereReport").removeClass('hide');
                $("#btnCancel").removeClass('hide');
                displayQualityReport_head();
                displayInterfereReport_head();
                getQualityReportData();

                if( data.interf > 0) {
                    getInterfereReportData();
                }
                addLog_success();
            }else{
                timeout++;
                num++;
            }
            if(timeout > 9){
                clearInterval(interval);
                $("#load").addClass('hide');
                addLog_fail();
                deepcheckfail();
            }
        }

        /*获取深度体检报告失败的回调*/
        function getReportFail(){
            clearInterval(interval);
            $("#load").addClass('hide');
            addLog_fail();
            deepcheckfail();
        }
    },20000);
}

/*深度体检失败后的处理*/
function deepcheckfail(){

    $("#dep_health_fail").removeClass('hide');
    $("#btnCancel_fail").removeClass('hide');
    $("#dep_health_form").css('height',"0px");

    $("#deepcheck").on("click",function(){
        $("#dep_health_form").css('height',"700px");
        $("#dep_health_fail").addClass('hide');
        $("#btnCancel_fail").addClass('hide');
        $("#load").removeClass('hide');
        deep_check();
    })
}

/*
 下发使能配置进行深度体检
 */
function deep_check(){
    var date  = (new Date()).toLocaleDateString();
    var year = date.split('/')[0];
    var mon = date.split('/')[1];
    var day = date.split('/')[2];

    if( mon < 10){
        mon = "0" + mon;
    }

    if( day < 10){
        day = "0" + day;
    }

    var currentData = year + "-" + mon +"-" + day;

    var configFlowOpt = {
        url:MyConfig.path +"/ant/confmgr",
        dataType:"json",
        type:"post",
        data:
        {configType:0,
            devSN:FrameInfo.ACSN,
            cloudModule:"maintain",
            deviceModule:"wsa",
            method:"specturmAnalysis"
        },
        onSuccess:sendCfgSuc,
        onFailed:sendCfgFail
    };

        Utils.Request.sendRequest(configFlowOpt);

    /*下发配置成功的回调*/
    function sendCfgSuc(data){
        try{
            if( data.communicateResult == "fail"){

                $("#dep_health_fail").removeClass('hide');
                $("#btnCancel_fail").removeClass('hide');
                $("#dep_health_form").css("height","0px");
                $("#load").addClass('hide');

            }else if( data.communicateResult == "success"){

                judgeDeepCheck(currentData);

            }
        }catch(exception){

        }
    }

    /*下发配置失败的回调*/
    function sendCfgFail(){
        Frame.Msg.error("设备连接异常");
        $("#dep_health_fail").removeClass('hide');
        $("#btnCancel_fail").removeClass('hide');
        $("#dep_health_form").css("height","0px");
        $("#load").addClass('hide');
    }
}

/*深度体检成功后，添加日志*/
function addLog_success(){

    var logSucFlowOpt = {
        url:MyConfig.path +'/ant/logmgr',
        type:'post',
        dataType:'json',
        data:{
            method:"addLog",
            devSN:FrameInfo.ACSN, //string,设备SN号
            module:"深度体检",//string,模块
            level:"普通",//string 级别
            message: "成功"//string,日志内容
        },
        onSuccess:addLogFlowSuc,
        onFailed:addLogFlowFail
    };

        Utils.Request.sendRequest(logSucFlowOpt);
}


/*深度体检成功后添加日志，成功后的回调*/
function addLogFlowSuc(){

}

/*深度体检成功后添加日志，失败的回调*/
function  addLogFlowFail(){

}

/*深度体检失败后，添加日志*/
function addLog_fail(){

    var logFailFlowOpt = {
        url:MyConfig.path +'/ant/logmgr',
        type:'post',
        dataType:'json',
        data:{
            method:"addLog",
            devSN:FrameInfo.ACSN, //string,设备SN号
            module:"深度体检",//string,模块
            level:"普通",//string 级别
            message: "失败"//string,日志内容
        },
        onSuccess:addLogFailFlowSuc,
        onFailed:addLogFailFlowFail
    };

        Utils.Request.sendRequest(logFailFlowOpt);
}

/*深度体检失败后，添加日志成功的回调*/
function addLogFailFlowSuc(){

}

/*深度体检失败后，添加日志失败的回调*/
function addLogFailFlowFail(){

}

function _destroy(){

    Utils.Request.clearMoudleAjax(MODULE_NAME);

}

Utils.Pages.regModule(MODULE_NAME,{
    "init": _init,
    "destroy": _destroy,
    "widgets": ["Echart","Panel","Minput","Form","SList"],
    "utils": [ "Device","Request"]
})

})(jQuery);