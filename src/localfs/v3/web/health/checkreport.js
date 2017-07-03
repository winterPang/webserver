;(function($){
    var MODULE_BASE = "health";
    var MODULE_NAME = MODULE_BASE + '.checkreport';

    function getRcText(sRcId){
        return Utils.Base.getRcString("checkreport_rc",sRcId);
    }

    function getRcString(sRcId,sRcName){
        return $("#"+sRcId).attr(sRcName);
    }

   
    function  radarRender(data){
        var resultdata = data.chartData;
        if (!resultdata) {
            resultdata = {
                finalscore: 0,
                wanspeed: 0,
                APpercent: 0,
                clientspeed: 0,
                security: 0,
                wireless: 0,
                system: 0,
                Bpercent: 0
            };
        }
        var title = getRcText('title').split(',');
        var option = {
            height: "370px",
            width:"450px",
            calculable: false,
            polar: [
                {
                    indicator: [
                        {text: title[0], max: 5},
                        {text: title[1], max: 5},
                        {text: title[2], max: 5},
                        {text: title[3], max: 5},
                        {text: title[4], max: 5},
                        {text: title[5], max: 5}
                    ],
                    radius: 120,
                    name: {
                        textStyle: {color: '#616e7f', fontFamily: 'arial', fontSize:14}
                    }
                }

            ],
            series: [
                {
                    name: '评分',
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                color: "rgba(105,196,197, 0.5)"
                            },
                            lineStyle: {
                                width: 1,
                                fontFamily: '华文细黑',
                                type: 'solid'//'solid' | 'dotted' | 'dashed'
                            },
                            color: "rgba(200,200,200,0.1)"
                        },
                        emphasis: {
                            areaStyle: {color: "rgba(105,196,197,0.8)"}
                        }
                    },
                    data: [
                        {
                            value: [
                                resultdata.wanspeed,
                                resultdata.APpercent,
                                resultdata.clientspeed,
                                resultdata.security,
                                resultdata.wireless,
                                resultdata.system
                            ],
                            name: '',
                            symbol: 'circle',
                            symbolSize: 0

                        }
                    ]
                }
            ]
        };
                        $("#apphealth").echart("init",option)
    }

    /*获取在线诊断，体检分析的数据*/
    function diagnosis(date){

        var resultFlowOpt = {
            url:MyConfig.path + '/diagnosis_read/web/result?devSN='+FrameInfo.ACSN,
            type:'post',
            dataType:'json',
            data:{
                date:date
            },
            onSuccess:getResultFlowSuc,
            onFailed:getResultFlowFail
        };

        Utils.Request.sendRequest(resultFlowOpt);
    }

    /*获取体检分析数据成功的回调*/
    function getResultFlowSuc(data){

        initDiagnosis_Data(data);

    }

    /*获取体检分析数据失败的回调*/
    function getResultFlowFail(){

        Frame.Msg.error("云巡检数据获取异常，请联系客服");

    }


    function initDiagnosis_Data(data) {
        if ((data != null) && (data[0] != undefined) && (data != "")) {
            $("#loadValue").html(data[0].loadValue);
            $("#loadAnalyse").html(data[0].loadAnalyse);
            $("#apValue").html(data[0].apValue);
            $("#rssiValue").html(data[0].rssiValue);
            $("#loadResouce2").html(data[0].loadResouce2);
            $("#loadResouce3").html(data[0].loadResouce3);
            $("#loadResouce4").html(data[0].loadResouce4);
            $("#loadResouce5").html(data[0].loadResouce5);
            $("#clientConsultValue").html(data[0].clientConsultValue);
            $("#clientFlowValue").html(data[0].clientFlowValue);
            $("#rssiAnalyse").html(data[0].rssiAnalyse);
            $("#clientRssi1").html(data[0].clientRssi1);
            $("#clientRssi2").html(data[0].clientRssi2);
            $("#clientRssi3").html(data[0].clientRssi3);
            $("#clientRssi4").html(data[0].clientRssi4);
            $("#clientRssi5").html(data[0].clientRssi5);
            $("#clientRssi6").html(data[0].clientRssi6);
            $("#clientRssi7").html(data[0].clientRssi7);
            $("#clientConsultAnalyse").html(data[0].clientConsultAnalyse);
            $("#consult1").html(data[0].consult1);
            $("#consult2").html(data[0].consult2);
            $("#consult3").html(data[0].consult3);
            $("#consult4").html(data[0].consult4);
            $("#consult5").html(data[0].consult5);
            $("#consult6").html(data[0].consult6);
            $("#apAnalyse").html(data[0].apAnalyse);
            $("#clienttooR1").html(data[0].clienttooR1);
            $("#clienttooR2").html(data[0].clienttooR2);
            $("#clienttooR3").html(data[0].clienttooR3);
            $("#clienttooR4").html(data[0].clienttooR4);
            $("#clientfiveR1").html(data[0].clientfiveR1);
            $("#clientfiveR2").html(data[0].clientfiveR2);
            $("#clientfiveR3").html(data[0].clientfiveR3);
            $("#clientfiveR4").html(data[0].clientfiveR4);
            $("#clientFlowAnalyse").html(data[0].clientFlowAnalyse);
            $("#clientRX1").html(data[0].clientRX1);
            $("#clientRX2").html(data[0].clientRX2);
            $("#clientRX3").html(data[0].clientRX3);
            $("#clientRX4").html(data[0].clientRX4);
            $("#clientRX5").html(data[0].clientRX5);
            $("#clientRX6").html(data[0].clientRX6);
            $("#clientTX1").html(data[0].clientTX1);
            $("#clientTX2").html(data[0].clientTX2);
            $("#clientTX3").html(data[0].clientTX3);
            $("#clientTX4").html(data[0].clientTX4);
            $("#clientTX5").html(data[0].clientTX5);
            $("#clientTX6").html(data[0].clientTX6);
        }
    }

    /*获取云巡检状态概览的数据*/
    function getdiagnosis_leftData(date){

        var pollingFlowOpt = {
            url:MyConfig.path + '/diagnosis_read/web/pollingInfo?devSN='+FrameInfo.ACSN,
            type:'post',
            dataType:'json',
            data:{
                date:date
            },
            onSuccess:getPollingInfoFlowSuc,
            onFailed:getPollingInfoFlowFail
        };

        Utils.Request.sendRequest(pollingFlowOpt);
    }

    /*获取云巡检状态概览数据成功的回调*/
    function getPollingInfoFlowSuc(data){

        initDiagnosis_left_Data(data);

    }

    /*获取云巡检状态概览数据失败的回调*/
    function  getPollingInfoFlowFail(){

    }

    function initDiagnosis_left_Data(data){
        renderApStatistic(data);
        renderClientSpeed(data);
        renderWansSpeed(data);
        renderSystem(data);
        renderWirelessEnv(data);
        renderSecurity(data);
        radarRender(data);
    }

   
    function renderApStatistic(data) {
        if ((data != undefined) && (data != null) && (data != "")) {
            if( (data.pollData != null) && (data.pollData != "") && ( data.pollData != undefined)) {
                var aPpercentId = "#APpercent";
                var apOnlinenumId = "#APOnlinenum";
                var apOfflinenumId = "#APOfflinenum";
                var apStatistic = data.pollData.ap_statistic;
                var aPpercentText = apStatistic.onlineRate + "%";
                var apOnlinenumText = apStatistic.online + getRcText('count');
                var apOfflinenumText = apStatistic.offline + getRcText('count');

                $(aPpercentId).text(aPpercentText);
                $(apOnlinenumId).text(apOnlinenumText);
                $(apOfflinenumId).text(apOfflinenumText);
            }
        }
    }

   
    function renderClientSpeed(data) {
        if ((data != undefined) && (data != null) && (data != "")) {
            if( (data.pollData != null) && (data.pollData != "") && ( data.pollData != undefined)) {
                var termstatisticsId = "#Termstatistics";
                var highestrateId = "#highestrate";
                var averagerate1Id = "#averagerate2";
                var lowestrateId = "#lowestrate";
                var clientData = data.pollData.clientSpeedData;

                var termstatisticsText = clientData.clientCount + getRcText('count');
                var highestrateText = clientData.maxSpeed + "Mbps";
                var averagerate1Text = clientData.averageSpeed + "Mbps";
                var lowestrateText = clientData.minSpeed + "Mbps";

                $(termstatisticsId).text(termstatisticsText);
                $(highestrateId).text(highestrateText);
                $(averagerate1Id).text(averagerate1Text);
                $(lowestrateId).text(lowestrateText);
            }
        }
    }

    
    function renderWansSpeed(data) {
        if ((data != null) && (data != "") && (data != undefined)) {
            if( (data.pollData != null) && (data.pollData != "") && ( data.pollData != undefined)) {
            var wan_speed = data.pollData.wan_speed;
            if( wan_speed.length != 0) {
                var portNameId = "#Portname";
                var DescripinfoId = "#Descripinfo";
                var UplinkrateId = "#Uplinkrate";
                var DescendingrateId = "#Descendingrate";

                var portNameText = wan_speed[0].name;
                var DescripinfoText = wan_speed[0].description;
                var UplinkrateText = wan_speed[0].speed_up + "Kbps";
                var DescendingrateText = wan_speed[0].speed_down + "Kbps";

                $(portNameId).text(portNameText);
                $(DescripinfoId).text(DescripinfoText);
                $(UplinkrateId).text(UplinkrateText);
                $(DescendingrateId).text(DescendingrateText);
            }
            }
        }
    }

   
    function renderSystem(data) {
        if ((data != "") && (data != undefined) && (data != null)) {
            if( (data.pollData != null) && (data.pollData != "") && ( data.pollData != undefined)) {
                var cpuutilizationId = "#cpuutilization";
                //var cputemperatureId = "#cputemperature";
                var memoryutilizationId = "#Memoryutilization";
                var flashId = "#flash";
                var systemData = data.pollData.systemData;

                var cpuutilizationText = systemData.cpuRatio + "%";
                //var cputemperatureText = "0";
                var memoryutilizationText = systemData.memoryRatio + "%";
                var flashText = "";


                if ((typeof (systemData.diskRemain)) === "number") {
                    flashText = ((systemData.diskRemain) >> 20) + "M";
                }
                else {
                    flashText = "0M";
                }

                $(cpuutilizationId).text(cpuutilizationText);
                //$(cputemperatureId).text(cputemperatureText);
                $(memoryutilizationId).text(memoryutilizationText);
                $(flashId).text(flashText);
            }
        }
    }

    
    function renderWirelessEnv(data) {
        if ((data != "") && (data != undefined) && (data != null)) {
            if( (data.pollData != null) && (data.pollData != "") && ( data.pollData != undefined)) {
                var beststate2GId = "#beststate1";
                var beststate5GId = "#beststate2";
                var betterstate2GId = "#betterstate1";
                var betterstate5GId = "#betterstate2";
                var generalstate2GId = "#generalstate1";
                var generalstate5GId = "#generalstate2";
                var poorerstate2GId = "#poorerstate1";
                var poorerstate5GId = "#poorerstate2";
                var worsestate2GId = "#worsestate1";
                var worsestate5GId = "#worsestate2";

                var _2G = data.pollData.wirelessData.Rd2d4G;
                var _5G = data.pollData.wirelessData.Rd5G;
                var beststate2GText = _2G.BestNum;
                var beststate5GText = _5G.BestNum;
                var betterstate2GText = _2G.BetterNum;
                var betterstate5GText = _5G.BetterNum;
                var generalstate2GText = _2G.GoodNum;
                var generalstate5GText = _5G.GoodNum;
                var poorerstate2GText = _2G.BadNum;
                var poorerstate5GText = _5G.BadNum;
                var worsestate2GText = _2G.WorstNum;
                var worsestate5GText = _5G.WorstNum;

                $(beststate2GId).text(beststate2GText);
                $(beststate5GId).text(beststate5GText);
                $(betterstate2GId).text(betterstate2GText);
                $(betterstate5GId).text(betterstate5GText);
                $(generalstate2GId).text(generalstate2GText);
                $(generalstate5GId).text(generalstate5GText);
                $(poorerstate2GId).text(poorerstate2GText);
                $(poorerstate5GId).text(poorerstate5GText);
                $(worsestate2GId).text(worsestate2GText);
                $(worsestate5GId).text(worsestate5GText);
            }
        }
    }

   
    function renderSecurity(data) {
        if( (data != "") && ( data != undefined) && (data != null)) {
          if( (data.pollData != "") && (data.pollData != undefined) && (data.pollData != null) && (data.pollData.securityData != undefined)) {
              var illegalapId = "#illegalap";
              var privateagentId = "#Privateagent";
              var illegalapText = data.pollData.securityData.rogueApCount + getRcText('count');
              var privateagentText = data.pollData.securityData.privateNatCount + getRcText('count');

              $(illegalapId).text(illegalapText);
              $(privateagentId).text(privateagentText);
          }
        }
    }

    function initData(oPara){
        diagnosis(oPara);
        getdiagnosis_leftData(oPara);
    }

    function _init(oPara){
       initData(oPara);
    }

    function _destroy(){

        Utils.Request.clearMoudleAjax(MODULE_NAME);

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart"],
        "utils": [ "Device","Request"]
      })
})(jQuery);
function displayDetail(num)
{
    if(num == "one")
    {
        var obj = $(this).attr("togglebutton1");
        var tab = $(this).attr("Table1");
    }
    else if(num == "two")
    {
        var obj = $(this).attr("togglebutton2");
        var tab = $(this).attr("Table2");
    }
    else if(num == "three")
    {
        var obj = $(this).attr("togglebutton3");
        var tab = $(this).attr("Table3");
    }
    else if(num == "four")
    {
        var obj = $(this).attr("togglebutton4");
        var tab = $(this).attr("Table4");
    }
    else
    {
        var obj = $(this).attr("togglebutton5");
        var tab = $(this).attr("Table5");
    }
    if(tab.style.display == "none")
    {
        $("#togglebutton"+num).removeClass('row-open');
        tab.style.display = "table";
    }
    else
    {
        $("#togglebutton"+num).addClass('row-open');
        tab.style.display = "none";
    }
}

function displayDetail2(num)
{
    if(num == "one")
    {
        var obj = $(this).attr("toggle-btn1");
        var tab = $(this).attr("toggleTable11");
    }
    else if(num == "two")
    {
        var obj = $(this).attr("toggle-btn2");
        var tab = $(this).attr("toggleTable12");
    }
    else if(num == "three")
    {
        var obj = $(this).attr("toggle-btn3");
        var tab = $(this).attr("toggleTable13");
    }
    else if(num == "four")
    {
        var obj = $(this).attr("toggle-btn4");
        var tab = $(this).attr("toggleTable14");
    }
    else if(num == "five")
    {
        var obj = $(this).attr("toggle-btn5");
        var tab = $(this).attr("toggleTable15");
    }
    else
    {
        var obj = $(this).attr("loadButton6");
        var tab = $(this).attr("toggleTable16");
    }
    if(tab.style.display == "none")
    {
        $('#toggle-btn'+num).removeClass("row-open");
        tab.style.display = "table";
    }
    else
    {

        $('#toggle-btn'+num).addClass("row-open");
        tab.style.display = "none";
    }
}