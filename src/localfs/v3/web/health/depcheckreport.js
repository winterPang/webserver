(function($){
    var MODULE_BASE = "health";
    var MODULE_NAME = MODULE_BASE +".depcheckreport";
    var g_date;

    function getRcText(sRcId){
        return Utils.Base.getRcString("depcheckreport_rc",sRcId);
    }

    function getRcString(sRcId,sRcName){
        return $("#"+sRcId).attr(sRcName);
    }

    /*获取当前日期空口质量报告的数据*/
    function getQualityReport_Data(date){

        var reportFlowOpt = {
            url:MyConfig.path + '/diagnosis_read/web/report?devSN='+FrameInfo.ACSN,
            type:'post',
            dataType:'json',
            data:{
                date:date
            },
            onSuccess:getReportFlowSuc,
            onFailed:getReportFlowFail
        };

        Utils.Request.sendRequest(reportFlowOpt)

    }

    /*获取空口质量报告数据成功的回调*/
    function getReportFlowSuc(data){

        analyseQualityReport_Data(data);
    }

    /*获取空口质量报告数据失败的回调*/
    function getReportFlowFail(){

        Frame.Msg.error("深度体检数据获取异常，请联系客服");
    }

    /*解析后台返回的当前日期的空口质量报告数据*/
    function analyseQualityReport_Data(data){
        var ApreportData;
        var reportData = [];
        var rrmserverData = [];
        var apreport = data.apreport;
        var rrmreport = data.rrmreport;
        var ClbSuggestionList = [];

        try {
            if (apreport.length != 0) {
                for (var i = 0; i < apreport.length; i++) {
                    reportData[i] = {};
                    reportData[i].ApName = apreport[i].ApName;
                    reportData[i].RadioId = apreport[i].RadioId;
                    reportData[i].RadioType = apreport[i].RadioType;
                    reportData[i].workingchl = apreport[i].workingchl;
                    ApreportData = apreport[i].ApreportData;

                    if( ApreportData[0].AQRpt != undefined) {
                        for (var j = 0; j < ApreportData.length; j++) {
                            if (apreport[i].workingchl == ApreportData[j].AQRpt.ChlNum) {
                                reportData[i].AvgAQ = ApreportData[j].AQRpt.AvgAQ;
                                break;
                            }
                        }
                    }else{
                                reportData[i].AvgAQ = "无法获取(此AP不支持频谱分析)";
                    }
                }
            }

            if( rrmreport.length != 0) {
                for(var n = 0; n < rrmreport.length ; n++) {
                    ClbSuggestionList = rrmreport[n].ClbSuggestionList;
                    if (ClbSuggestionList.length != 0) {
                        for (var k = 0; k < ClbSuggestionList.length; k++) {
                            rrmserverData[k] = {};
                            rrmserverData[k].ApName = ClbSuggestionList[k].ApName;
                            rrmserverData[k].RadioID = ClbSuggestionList[k].RadioID;
                            rrmserverData[k].RadioType = ClbSuggestionList[k].RadioType;
                            rrmserverData[k].ChlNum = ClbSuggestionList[k].RdEnvAftChg.ChlNum;
                            rrmserverData[k].PwrLvl = ClbSuggestionList[k].RdEnvAftChg.PwrLvl;
                            rrmserverData[k].ReasBitMap = ClbSuggestionList[k].ReasBitMap;
                        }
                    }
                }
            }
        }catch(exception){

        }
          if( rrmreport.length != 0) {

              displayQualityReport_Data(reportData, rrmserverData);

          }else{

              displayqualityreport(reportData);

          }
    }

    /*显示当前日期下的空口质量报告head部分*/
    function displayQualityReport_head() {
        var opt_head = {
            colNames: getRcText("qualityReportTitle"),
            showHeader: true,
            multiSelect: false,
            pageSize: 5,
            colModel: [
                {name: "ApName", datatype: "String", width: 60},
                {name: "RadioType", datatype: "String", width: 60},
                {name: "workingchl", datatype: "String", width: 60},
                {name: "AvgAQ", datatype: "String", width: 80},
                {name: "ReasBitMap", datatype: "String", width: 60},
                {name: "suggest", datatype: "String", width: 130},
                {name: "chls",datetype:"String",width:80,formatter:showSum}
            ]
        };
            $("#qualityReport_slist").SList("head", opt_head);
    }

    /*显示空口质量报告的body部分*/
    function displayQualityReport_Data(qualityReportData,rrmserverData){
        var reportData = [];
        try {
            if ((rrmserverData.length != 0) && (qualityReportData.length != 0)) {
                for(var i = 0; i < qualityReportData.length; i++){
                    reportData[i] = {};
                    reportData[i].ApName = qualityReportData[i].ApName;
                    reportData[i].RadioType = qualityReportData[i].RadioType;
                    reportData[i].workingchl = qualityReportData[i].workingchl;
                    reportData[i].AvgAQ = qualityReportData[i].AvgAQ;
                    reportData[i].chls = "点击查看";

                    for( var j = 0; j < rrmserverData.length; j++){
                        if( (qualityReportData[i].ApName == rrmserverData[j].ApName) && (qualityReportData[i].RadioId == rrmserverData[j].RadioID)) {
                            reportData[i].ReasBitMap = rrmserverData[j].ReasBitMap;
                            reportData[i].suggest = getRcText('chl') + rrmserverData[j].ChlNum + ',' + getRcText('por') + rrmserverData[i].PwrLvl;
                            break;
                        }
                    }
                }
            }
            else if ((rrmserverData.length == 0) && (qualityReportData.length != 0)) {
                for (var k = 0; k < qualityReportData.length; k++) {
                    reportData[k] = {};
                    reportData[k].ApName = qualityReportData[k].ApName;
                    reportData[k].RadioType = qualityReportData[k].RadioType;
                    reportData[k].workingchl = qualityReportData[k].workingchl;
                    reportData[k].AvgAQ = qualityReportData[k].AvgAQ;
                    reportData[k].ReasBitMap = getRcText('ReasBitMap');
                    reportData[k].suggest = getRcText('suggest');
                    reportData[k].chls = "点击查看";
                }
            }
                for(var i = 0;i < reportData.length;i++){
                    if( reportData[i].ReasBitMap == 0){
                        reportData[i].ReasBitMap = getRcText('reason0')
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

    /*在没有rrmserver数据的情况下，只显示空口质量报告*/
    function displayqualityreport(qualityreportdata){

        var qualityreport_data = [];

        for(var i = 0; i < qualityreportdata.length;i++){
             qualityreport_data[i] = {};
             qualityreport_data[i].ApName = qualityreportdata[i].ApName;
             qualityreport_data[i].RadioType = qualityreportdata[i].RadioType;
             qualityreport_data[i].workingchl = qualityreportdata[i].workingchl;
             qualityreport_data[i].AvgAQ = qualityreportdata[i].AvgAQ;
             qualityreport_data[i].ReasBitMap = "";
             qualityreport_data[i].suggest = "";
             qualityreport_data[i].chls = "点击查看";
        }
             $("#qualityReport_slist").SList("refresh",qualityreport_data);
    }

    /*获取当前日期干扰设备报告的数据*/
    function getInterfereReport_Data(date){

        var interfReportFlowOpt = {
            url:MyConfig.path +"/diagnosis_read/web/interfReport?devSN="+FrameInfo.ACSN,
            type:'post',
            dataType:'json',
            data:{
                date:date
            },
            onSuccess:getInterfReportFlowSuc,
            onFailed:getInterfReportFlowFail
        };

        Utils.Request.sendRequest(interfReportFlowOpt);
    }

    /*获取干扰设备报告成功的回调*/
    function getInterfReportFlowSuc(data){

        analyseInterfereReport_Data(data);

    }

    /*获取干扰设备报告失败的回调*/
    function getInterfReportFlowFail(){

    }

    /*解析当前日期干扰设备报告返回的数据*/
    function analyseInterfereReport_Data(data){
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

    /*显示当前日期下的干扰设备报告的head部分*/
    function displayInterfereReport_head(){
        var opt_head ={
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

    /*显示当前日期下干扰报告的内容部分*/
    function displayInterfereReport_Data(data){

         if((data.length != 0) && (data != "")) {
             $("#interfereReport_slist").SList("refresh", data);
         }
    }

    /*干扰信道报告弹出模态框*/
    function showSum(row, cell, value, columnDef, dataContext, type){

        value = value || "";
        if("text" == type)
        {
            return value;
        }

        return '<a class="list-link" cell="'+cell+'"'+'  ApName="'+dataContext.ApName+'" RadioType="'+dataContext.RadioType+'">'+value+'</a>';
    }

    /*干扰信道报告弹出模态框*/
    function onShowSums(){

        var sType = $(this).attr("cell");
        var data = {};
        data.ApName = $(this).attr("ApName");
        data.date = g_date;
        data.RadioType = $(this).attr("RadioType");

        if(sType == 6){

            Utils.Base.openDlg("health.chlreport",data,{className:"modal-super"});

        }
    }

    function initData(date){
         displayQualityReport_head();
         displayInterfereReport_head();
         getQualityReport_Data(date);
         getInterfereReport_Data(date);
    }



    function initForm(){

        $("#qualityReport_slist").on('click','a.list-link',onShowSums);

    }

    function _init(oPara){
        initData(oPara);
        initForm();
        g_date = oPara;
    }

    function _destroy(){

        Utils.Request.clearMoudleAjax(MODULE_NAME);

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart","SList"],
        "utils": [ "Device","Request"]
   })
})(jQuery);