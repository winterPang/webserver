(function ($)
{
    var MODULE_NAME = "h_dashboard.clients";

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("app_ssid_rc", sRcId);
    }

    function drawEmptyPie()
    {
        var option = {
            height:210,
            calculable : false,
            series : [
                {
                    type:'pie',
                    minAngle: '3',
                    radius : '80%',
                    center: ['55%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ]
        };
        var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
        
        $("#board_ws_pie").echart("init", option,oTheme);
    }

    function drawWireless(oInfor)
    {
        $("#Current").text( Utils.Base.addComma(oInfor.Total));
        if(oInfor.Total == 0)
        {
            drawEmptyPie();
            return ;
        }
        var option = {
            height:210,
            tooltip : {
                trigger: 'item',
                formatter: function(aData){
                    return aData[1]+'<br/>' + aData[2] +' (' + Math.round(aData[2]/this._option.nTotal*100) +'%)';
                }
            },
            // legend: {
            //     orient : 'vertical',
            //     x : '75%',
            //     y : 30,
            //     data: ['802.11ac(5GHz)','802.11an(5GHz)','802.11a(5GHz)','802.11gn(2.4GHz)','802.11g(2.4GHz)','802.11b(2.4GHz)']
            // },
            calculable : false,
            nTotal : oInfor.Total,
            series : [
                {
                    type:'pie',
                    radius : '40%',
                    center: ['55%', '50%'],
                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            labelLine:{
                                show:false
                            },
                            color: function(a,b,c,d) {
                                var colorList = ['#78cec3','#c8c3e1'];
                                return colorList[a.dataIndex];
                            },
                            label:
                            {
                                position:"inner",
                                formatter: '{b}'
                            }
                        }
                    },
                    data: [
                        {name:'5GHz',value:oInfor.Num5G||undefined},
                        {name:'2.4GHz',value:oInfor.Num2G||undefined}
                    ]
                },
                {
                    type:'pie',
                    radius : ['50%','70%'],
                    center: ['55%', '50%'],
                    itemStyle: {
                        normal: {
                            borderColor:"#FFF",
                            borderWidth:1,
                            labelLine:{
                                show:true,
                                length:10
                            },
                            label:
                            {
                                position:"outer",
                                textStyle:{color: '#80878C'}
                                // formatter: function(a,b,c,d){
                                //     return Math.round(a.value/this._option.nTotal*100)+"%";
                                // }
                            }
                        }
                    },
                    data: [
                        {name:'802.11ac(5GHz)',value:oInfor["11ac"] || undefined},
                        {name:'802.11an(5GHz)',value:oInfor["11an"] || undefined},
                        {name:'802.11a(5GHz)',value:oInfor["11a"] || undefined},
                        {name:'802.11gn(2.4GHz)',value:oInfor["11gn"] || undefined},
                        {name:'802.11g(2.4GHz)',value:oInfor["11g"] || undefined},
                        {name:'802.11b(2.4GHz)',value:oInfor["11b"] || undefined}      
                    ]
                }
            ]
        };
        var oTheme={
                color: ['#4ec1b2','#78cec3','#95dad1','#b3b7dd','#c8c3e1','#e7e7e9']
        };       
        $("#board_ws_pie").echart("init", option,oTheme);
    }

    function getClientsFlowSuc (mode) {
        mode.client_statistic.Num5G = mode.client_statistic["11ac"] + mode.client_statistic["11an"] + mode.client_statistic["11a"];
        mode.client_statistic.Num2G = mode.client_statistic["11gn"] + mode.client_statistic["11g"] + mode.client_statistic["11b"];
        mode.client_statistic.Total = mode.client_statistic.Num5G + mode.client_statistic.Num2G;
        drawWireless(mode.client_statistic); 
    }
    function getClientsFlowFail (data) {
        // body...
    }
    function getportalUserCountSuc (data) {
        $("#portalusercount").text( Utils.Base.addComma(data.portalusercount));
    }
    function getportalUserCountFail (data) {
        // body...
    }
    function initData ()
    {
        var clientsFlowOpt = {
            url: MyConfig.path+"/stamonitor/getclientstatisticbymode",
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN
            },
            onSuccess:getClientsFlowSuc,
            onFailed:getClientsFlowFail
        };
        Utils.Request.sendRequest(clientsFlowOpt);
        var portalUserCountOpt = {
            url: MyConfig.path+"/portalmonitor/portalusercount",
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN
            },
            onSuccess:getportalUserCountSuc,
            onFailed:getportalUserCountFail
        };
        Utils.Request.sendRequest(portalUserCountOpt);
    }
    function initForm()
    {
        var jForm = $("#vlans_page");
        $(".link-detail",jForm).on("click",function()
        {
            Utils.Base.redirect ({np:"h_dashboard.client_detail",tab:$(this).attr("tab")});
            return false;
        });
        $("#refresh_ssid").on("click", initData);
    }
    function _init ()
    {
        initForm();
        initData();
    }

    function _destroy ()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart"],
        "utils": [],
        "subModules": []
    });
}) (jQuery);
