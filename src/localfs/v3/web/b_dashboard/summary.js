;(function ($) {
    var MODULE_NAME = "b_dashboard.summary";
    var MODULE_RC   = "wifi_dashboard_rc";

    //echart变量
    var g_hLine,g_hPie;

    //假数据变量
    var g_aAlert = [];
    var g_aRestart = [];

    var aInData = [];
    var aListData = [];

    var aHealthData = [];
    var aApOnlineData = [];
    var  aClientAuthData = [];


    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }

    function timeStatus (time) {
        // body...
        if (time < 10)
        {
            return "0" + time;
        }
        return time;
    }



    function drawEmptyPie(){

    }

    function drawPie(sColor,$sPieName,aCenter,aRadius,sName,nData1,nData2,bFlag){
            var labelTop = {
                normal : {
                    color: "#f5f5f5",
                    label : {
                        show : false,
                    },
                    labelLine : {
                        show : false
                    }
                }
            };
            var labelBottom = {
                normal : {
                    color: sColor,
                    label : {
                        show : false,
                    },
                    labelLine : {
                        show : false
                    }
                },
                emphasis: {
                    color: 'rgba(0,0,0,0)'
                }
            };

            var aSeries = [
                {
                    type : 'pie',
                    center : aCenter,
                    radius : aRadius,
                    //itemStyle : labelFromatter,
                    data :  [
                        {name:sName, value:nData1, itemStyle : labelBottom},
                        {name:'', value:nData2,itemStyle : labelTop}
                    ]
                }
            ];

            var option = {
                width: "120%",
                height: "100%",
                //height: 170,
                series : aSeries,
            };
            var ecConfig = require('echarts/config');
            gMychart=$sPieName.echart("init",option);

            var nData = 15;
            var appendTohtml = [
                '<div class="text-style"><div title="',
                 sName,
                '"><span class="pieStyle">',
                nData,
                '</span></div></div>'
            ].join("");
            if(bFlag == 1) {
                $(appendTohtml).appendTo($sPieName);
            }else{
                return true;
            }
    }

    function drawDashboardPie(nDevData,nDevTotal,nAPData,nAPTotal){

        //在线设备
        var $OnlineDev = $("#onlineDev");
        var sColor = "#78cec3";
        var aCenter = ['48%', '50%'];
        var aRadius = [33,43];
        var nData1 = nDevData;
        var nData2 = nDevTotal-nDevData;
        var sName = 'onlineDev';

        drawPie(sColor,$OnlineDev,aCenter,aRadius,sName,nData1,nData2,0);
        //离线设备

        var $OfflineDev = $("#offlineDev");
        var sColor = "rgba(128,135,140,0.5)";
        var aCenter = ['50%', '50%'];
        var aRadius = [33,43];
        var nData1 = nDevTotal-nDevData;
        var nData2 = nDevData;
        var sName = 'offlineDev';

        drawPie(sColor,$OfflineDev,aCenter,aRadius,sName,nData1,nData2,0);


        //在线AP
        var $OnlineAp = $("#onlineAP");
        var aCenter = ['50%', '50%'];
        var sColor = "#b3b7dd";
        var aRadius = [33,43];
        var nData1 = nAPData;
        var nData2 = nAPTotal-nAPData;
        var sName = 'onlineAP';

        drawPie(sColor,$OnlineAp,aCenter,aRadius,sName,nData1,nData2,0);

        //离线AP
        var $OfflineAp = $("#offlineAp");
        var sColor = "rgba(128,135,140,0.5)";
        var aCenter =['50%', '50%'];
        var aRadius = [33,43];
        var nData1 = nAPTotal-nAPData;
        var nData2 = nAPData;
        var sName = 'OfflineAp';

        drawPie(sColor,$OfflineAp,aCenter,aRadius,sName,nData1,nData2,0);

    }

    function ChangeDevInfo(row, cell, value, columnDef, dataContext, type)
    {
        value = value ||"";
        if("text" == type)
        {
            return value;
        }
        switch(cell) {
            case 0 :
            {
                var titletest = getRcText("DEV_STATUS").split(',')[0];
                if(dataContext["status"] =="0")
                {
                    titletest = getRcText("DEV_STATUS").split(',')[2];
                    return "<p class='float-left' type='0'>"+dataContext["devname"]+"</p><p title='"+titletest+"' class='index_icon_count index_icon_offline'></p>";
                    //return dataContext["Name"];
                }else if(dataContext["status"] =="1"){
                    titletest = getRcText("DEV_STATUS").split(',')[1];
                    return "<p class='float-left' type='0'>"+dataContext["devname"]+"</p><p title='' class='index_icon_count index_icon_online'></p>";
                }
                return "<p class='float-left' type='0'></p><p title='' class='index_icon_count'></p>";
                break;

            }
            case 1:
            {
                var color = (value > 80) ? "#4ec1b2" : (value > 60 ? "#fbceb1" : "#fe808b");

                return '<a style="color:' + color + ';" cell="' + cell + '">' + value + '</a>';
                break;
            }
            default:
                break;
        }
        return false;

    }

    function clickPie($List,oData){
        $("#dev_form").form ("init", "edit", {"title":getRcText("DEV_NAME"),
            "btn_apply":false, "btn_cancel":false/*CancelShop*/});
        $("#devDlg .simple-list").addClass("hide");
        $List.removeClass("hide");
        Utils.Base.openDlg(null, {}, {scope:$("#devDlg"),className:"modal-super"});
        $List.SList("resize");
        $List.SList("refresh",oData);
    }


    //改
    function drawHealthPie(nTotal,nHealth40,nHealth60,nHealth80){

        //health40
        var $health40 = $("#health40");
        var sColor = "#fe808b";
        var aCenter = ['50%', '50%'];
        var aRadius = [43,58];
        var nData1 = nHealth40;
        var nData2 = nTotal-nHealth40;
        var sName = 'health40';

        drawPie(sColor,$health40,aCenter,aRadius,sName,nData1,nData2,1);
        //health60

        var $health60 = $("#health60");
        var sColor = "#f2bc98";
        var aCenter = ['50%', '50%'];
        var aRadius = [43,58];
        var nData1 = nHealth60;
        var nData2 = nTotal- nHealth60;
        var sName = 'health60';

        drawPie(sColor,$health60,aCenter,aRadius,sName,nData1,nData2,1);

        //health80
        var $health80 = $("#health80");
        var aCenter = ['50%', '50%'];
        var sColor = "#4ec1b2";
        var aRadius = [43,58];
        var nData1 = nHealth80;
        var nData2 = nTotal-nHealth80;
        var sName = 'health80';

        drawPie(sColor,$health80,aCenter,aRadius,sName,nData1,nData2,1);


    }

    function drawAPOlinePie(nTotal,nAP100,nAP99,nAP79,nAP60){
        //ap100
        var $AP100= $("#ap100");
        var sColor = "#4ec1b2";
        var aCenter = ['50%', '50%'];
        var aRadius = [43,58];
        var nData1 = nTotal-nAP100;
        var nData2 = nAP100;
        var sName = 'ap100';

        drawPie(sColor,$AP100,aCenter,aRadius,sName,nData1,nData2,1);

        //ap99

        var $AP99 = $("#ap99");
        var sColor = "#4ec1b2";
        var aCenter = ['50%', '50%'];
        var aRadius = [43,58];
        var nData1 = nTotal-nAP99;
        var nData2 = nAP99;
        var sName = 'ap99';

        drawPie(sColor,$AP99,aCenter,aRadius,sName,nData1,nData2,1);



        //AP79
        var $AP79 = $("#ap79");
        var aCenter =['50%', '50%'];
        var sColor = "#4ec1b2";
        var aRadius = [43,58];
        var nData1 = nTotal-nAP79;
        var nData2 = nAP79;
        var sName = 'ap79';

        drawPie(sColor,$AP79,aCenter,aRadius,sName,nData1,nData2,1);


        //AP60
        var $AP60 = $("#ap60");
        var sColor = "#4ec1b2";
        var aCenter = ['50%', '50%'];
        var aRadius = [43,58];
        var nData1 = nAP60;
        var nData2 = nTotal - nAP60;
        var sName = 'ap60';

        drawPie(sColor,$AP60,aCenter,aRadius,sName,nData1,nData2,1);

    }

    function drawClientNumPie(nTotal,nClient10,nClient30,nClient60,nClient61){
        //CLIENT10
        var $Client1 = $("#client10");
        var sColor = "#b3b7dd";
        var aCenter = ['50%', '50%'];
        var aRadius = [43,58];
        var nData1 = nClient10;
        var nData2 = nTotal - nClient10;
        var sName = 'CLIENT10';

        drawPie(sColor,$Client1,aCenter,aRadius,sName,nData1,nData2,1);


        //CLIENT30
        var CLIENT30 = $("#client30");
        var sColor = "#b3b7dd";
        var aCenter =['50%', '50%'];
        var aRadius = [43,58];
        var nData1 = nClient30;
        var nData2 = nTotal - nClient30;
        var sName = 'CLIENT30';

        drawPie(sColor,CLIENT30,aCenter,aRadius,sName,nData1,nData2,1);



        //CLIENT60
        var $CLIENT60 = $("#client60");
        var aCenter = ['50%', '50%'];
        var sColor = "#b3b7dd";
        var aRadius = [43,58];
        var nData1 = nClient60;
        var nData2 = nTotal - nClient60;
        var sName = 'CLIENT60';

        drawPie(sColor,$CLIENT60,aCenter,aRadius,sName,nData1,nData2,1);


        //CLIENT61
        var $CLIENT61 = $("#client61");
        var sColor = "#b3b7dd";
        var aCenter = ['50%', '50%'];
        var aRadius = [43,58];
        var nData1 =  nClient61;
        var nData2 = nTotal - nClient61;
        var sName = 'CLIENT61';

        drawPie(sColor,$CLIENT61,aCenter,aRadius,sName,nData1,nData2,1);

    }

    function drawHistoryDev(aOnline, aOffline) {

        var aSeries = [];
        var oTemp1 = {
            symbol: "none",
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {
                normal: {
                    areaStyle: {type: 'default'},
                    lineStyle: {width: 0}
                }
            },
            name: "在线",
            data: aOnline
        };
        aSeries.push(oTemp1);


        var oTemp2 = {
            symbol: "none",
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {normal: {areaStyle: {type: 'default'}, lineStyle: {width: 0}}},
            name: "离线",
            data: aOffline
        };
        aSeries.push(oTemp2);

        var option = {
            width: "100%",
            height: "100%",
            tooltip: {
                show: true,
                trigger: 'item',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "right",
                //x: "center",
                itemWidth: 8,//default 20
                // itemWidth: 12,//default 20
                textStyle: {
                    color: '#617085',
                    fontSize: '14px'
                },
                data: ["在线", "离线"]
            },
            calculable : false,
            xAxis : [
                {
                    type: 'time',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px"},
                        formatter: function (data) {
                            return getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis : [
                {
                    name:"",
                    type: 'value',
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px", width: 2},
                        formatter: function (data) {
                            return data < 0 ? -data : data;
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    }
                }
            ],
            animation: false,
            series:aSeries

        };


        var oTheme = {
            color: ['#4ec1b2', '#f2bc98'],
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#FFF']}}
            }
        };
        $("#tape_change").echart("init", option, oTheme);
    }

    function initEchatLineData(){
        var aOnline = [];
        var aOffline = [];
        drawHistoryDev(aOnline, aOffline);
    }

    function initOpt(){

        function initAlertOpt(){
            var opt = {
                height:"50",
                showHeader:true,
                multiSelect: false,
                pageSize : 5,
                colNames: getRcText("ALERTLIST"),
                colModel: [
                    {name: "devName", datatype: "String"},
                    {name: "alertTime", datatype: "String"},
                    {name: "alertContent", datatype: "String"}
                ]
            };
            $("#Alert_list").SList("head", opt);
        }

        function initRestartOpt(){
            var opt = {
                height:"50",
                showHeader:true,
                multiSelect: false,
                pageSize : 5,
                colNames: getRcText("RESTARTDEV"),
                colModel: [
                    {name: "devName", datatype: "String"},
                    {name: "restartTime", datatype: "String"},
                    {name: "restartResult", datatype: "String"},
                ]
            };
            $("#Restart_list").SList("head", opt);
        }

        function initDevOpt(){
            var opt = {
                height:"50",
                showHeader:true,
                multiSelect: false,
                pageSize : 5,
                colNames: getRcText("RESTARTDEV"),
                colModel: [
                    {name: "devName", datatype: "String"},
                    {name: "restartTime", datatype: "String"},
                    {name: "restartResult", datatype: "String"},
                ]
            };
            $("#Restart_list").SList("head", opt);
        }

        function initHealthOpt(){
            //初始化综合健康度列表
            var opt = {
                colNames: getRcText ("DEV_HEALTH"),
                showHeader: true,
                multiSelect: false,
                showOperation:false,
                pageSize:10,
                colModel: [
                    {name:'devname', datatype:"String",formatter:ChangeDevInfo,width:200}, //设备名
                    {name:'score', datatype:"String",formatter:ChangeDevInfo,width:200}//评分
                ]
                //,
                //buttons:[
                //    {name: "detail", action:showDetail}
                //]
            };

            $("#healthList").SList("head",opt);
        }

        function initApOnlineOpt(){
            //ap在线率列表
            var opt = {
                colNames: getRcText ("DEV_ONLINE"),
                showHeader: true,
                multiSelect: false,
                showOperation:false, //不需要button必须设为false
                pageSize:10,
                colModel: [
                    {name:'devname', datatype:"String",formatter:ChangeDevInfo,width:200}, //设备名
                    {name:'onlinetime', datatype:"String",width:200},//在线时长
                    {name:'offlinetime', datatype:"String",width:200}//离线时长
                ]
                //,
                //buttons:[
                //    {name: "detail", action:showDetail}
                //]
            };

            $("#apList").SList("head",opt);
        }

        function initAuthClientOpt(){
            //认证终端数列表
            var opt = {
                colNames: getRcText ("DEV_AUTH_CLIENT"),
                showHeader: true,
                multiSelect: false,
                showOperation:false,
                pageSize:10,
                colModel: [
                    {name:'devname', datatype:"String",formatter:ChangeDevInfo,width:200}, //设备名
                    {name:'clientTotal', datatype:"String",width:200},//在线时长
                    {name:'authClient', datatype:"String",width:200}//离线时长
                ]
                //,
                //buttons:[
                //    {name: "detail", action:showDetail}
                //]
            };

            $("#clientList").SList("head",opt);
        }

        initAlertOpt();
        initRestartOpt();
        initHealthOpt();
        initApOnlineOpt();
        initAuthClientOpt();

    }
    function initDashboardData(){
        var nDevData = 1000;
        var nDevTotal = 8000;
        var nAPData = 7000;
        var nAPTotal = 18000;
        drawDashboardPie(nDevData,nDevTotal,nAPData,nAPTotal);

        var nTotal = 12000;
        var nHealth40 = 5000;
        var nHealth60  = 3000;
        var nHealth80 = 4000;

        drawHealthPie(nTotal,nHealth40,nHealth60,nHealth80);

        var nAP100 = 5000;
        var nAP99  = 1000;
        var nAP79 = 4000;
        var nAP60 = 2000;
        drawAPOlinePie(nTotal,nAP100,nAP99,nAP79,nAP60);

        var nClient61 = 2000;
        var nClient10 = 5000;
        var nClient30  = 1000;
        var nClient60 = 4000;
        drawClientNumPie(nTotal,nClient10,nClient30,nClient60,nClient61);

    }


    function initAlertData(){
        g_aAlert = [
            {"devName":"dev1","alertTime":"2016/4/28 11:10:20","alertContent":"内存不足"},
            {"devName":"dev2","alertTime":"2016/4/27 16:19:30","alertContent":"内存不足"},
        ]

        $("#Alert_list").SList("refresh", g_aAlert);


    }

    function initRestartData(){
        g_aRestart = [
            {"devName":"dev1","restartTime":"2016/4/28 11:10:20","restartResult":"内存不足"},
            {"devName":"dev2","restartTime":"2016/4/27 16:19:30","restartResult":"内存不足"},
        ]

        $("#Restart_list").SList("refresh", g_aRestart);
    }

    function initListData(){
        //listData = [
        //    {"devname":"test_dev1","score":"30","status":"0","onlinetime":"5","offlinetime":"10","clientTotal":"23","authClient":"12"},
        //    {"devname":"test_dev2","score":"70","status":"1","onlinetime":"5","offlinetime":"20","clientTotal":"33","authClient":"21"},
        //    {"devname":"test_dev3","score":"90","status":"1","onlinetime":"5","offlinetime":"12","clientTotal":"23","authClient":"22"}
        //];
        aHealthData =[
            /*
             "devsn":"sn2324","devgroup":"2","devlocation":"beijing","apcount":"34","usercount":"12","onlinetime":"11:00-12:00",
             "devsn":"sn2324","devgroup":"2","devlocation":"beijing","apcount":"4","usercount":"23","onlinetime":"11:00-12:00",
             "devsn":"sn2324","devgroup":"2","devlocation":"beijing","apcount":"134","usercount":"123","onlinetime":"11:00-12:00",
             ,"devsn":"sn2324","devgroup":"2","devlocation":"beijing","apcount":"5","usercount":"230","onlinetime":"11:00-12:00"
             */
            {"devname":"abcs","score":"79","status":"1"},
            {"devname":"abs","score":"13","status":"0"},
            {"devname":"acs","score":"69","status":"0"},
            {"devname":"as","score":"90","status":"1"}
        ];
        //$("#healthList").SList("refresh",aHealthData);

        aApOnlineData = [
            {"devname":"abcs","onlinetime":"79","offlinetime":"1","status":"1"},
            {"devname":"abs","onlinetime":"79","offlinetime":"1","status":"0"},
            {"devname":"acs","onlinetime":"79","offlinetime":"1","status":"0"},
            {"devname":"as","onlinetime":"79","offlinetime":"1","status":"1"}
        ];
        //$("#apList").SList("refresh",aApOnlineData);

        aClientAuthData = [
            {"devname":"abcs","clientTotal":"23","authClient":"12","status":"1"},
            {"devname":"abs","clientTotal":"23","authClient":"12","status":"0"},
            {"devname":"acs","clientTotal":"23","authClient":"12","status":"0"},
            {"devname":"as","clientTotal":"23","authClient":"12","status":"1"}
        ];
        //$("#clientList").SList("refresh",aClientAuthData);
    }

    function initForm()
    {
        $("#Map").click(function(){
            Utils.Base.redirect({ np:"b_device.device_location"});
        });
        $(".score-detail").on("click",function(){
            clickPie($("#healthList"),aHealthData);
        });
        $("div[title=health60]").on("click",function(){
            clickPie($("#healthList"),aHealthData);
        });
        $("div[title=health40]").on("click",function(){
            clickPie($("#healthList"),aHealthData);
        });
        $("div[title=health80]").on("click",function(){
            clickPie($("#healthList"),aHealthData);
        });
        $("div[title=ap100]").on("click",function(){
            clickPie($("#apList"),aApOnlineData);
        });
        $("div[title=ap99]").on("click",function(){
            clickPie($("#apList"),aApOnlineData);
        });
        $("div[title=ap79]").on("click",function(){
            clickPie($("#apList"),aApOnlineData);
        });
        $("div[title=ap60]").on("click",function(){
            clickPie($("#apList"),aApOnlineData);
        });
        $("div[title=CLIENT10]").on("click",function(){
            clickPie($("#clientList"),aClientAuthData);
        });
        $("div[title=CLIENT30]").on("click",function(){
            clickPie($("#clientList"),aClientAuthData);
        });
        $("div[title=CLIENT60]").on("click",function(){
            clickPie($("#clientList"),aClientAuthData);
        });
        $("div[title=CLIENT61]").on("click",function(){
            clickPie($("#clientList"),aClientAuthData);
        });

    }

    function drawWeekCliNum(aInData1,aInData2,aTimes) {
        var aseries = [];
        var splitNumber;
        if (aInData1.length > 8) {
            splitNumber = 9
        }
        else {
            splitNumber = aInData1.length - 1;
        }
        var oTemp1 = {
            stack: '总量',
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle: {width: 0}}},
            name: "在线",
            data: aInData1
        };
        aseries.push(oTemp1);
        var oTemp2 = {
            stack: '总量',
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {normal: {areaStyle: {type: 'default'}, lineStyle: {width: 0}}},
            name: "离线",
            data: aInData2
        };
        aseries.push(oTemp2);
        var option = {
            width: "100%",
            height:400,
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: function (params) {
                    //
                    //var time = params[1].toISOString().split(".")[0].split("T").toString();
                    //if (params.value < 0)
                    //    params.value = -params.value;
                    //var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1];
                    //return string;
                    return params["0"];
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: "#94DAD0",//'#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            //legend: {
            //    orient: "horizontal",
            //    y: 0,
            //    x: "center",
            //    // x: "right",
            //    // itemWidth: 12,//default 20
            //    itemWidth: 8,//default 20
            //    // textStyle: { color: '#617085', fontSize: "12px" },
            //    textStyle: {color: '#9AD4DC', fontSize: "12px"},
            //    data: ['在线','离线']
            //},
            grid: {
                x: 30, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:true,
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#80878C', width: 1}
                    },
                    axisLabel: {
                        show: true,
                        interval:1,
                        textStyle:{color: '#80878C', width: 1}
                    },
                    axisTick :{
                        show:false
                    },
                    data: aTimes

                }
            ],
            yAxis: [
                {
                    name: "",
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    splitNumber:8,
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#80878C', fontSize: "12px", width: 2},
                        lineStyle :{color: '#80878C', width: 1}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#80878C', width: 1}
                    },
                }

            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#78cec3',"#fef0e7"],
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#FFF']}}
            }
        };
        $("#devHistory").echart("init", option, oTheme);
    }

    function initDevHisData(){
        //假数据是真时间   2016-05-04T10:01:00.622Z是世界时间有8小时时差，new Date()转一下才可使用
        aInData = [
            {
                "online": 80,
                "offline": 60,
                "updateTime" : "2016-05-04T02:01:00.622Z"
            },
            {
                "online": 50,
                "offline": 40,
                "updateTime": "2016-05-04T02:02:00.622Z"
            },
            {
                "online": 30,
                "offline": 40,
                "updateTime": "2016-05-04T02:03:00.622Z"
            },
            {
                "online": 50,
                "offline": 50,
                "updateTime": "2016-05-04T02:04:00.622Z"
            },
            {
                "online": 40,
                "offline": 20,
                "updateTime": "2016-05-04T02:05:00.622Z"
            },
            {
                "online": 30,
                "offline": 20,
                "updateTime": "2016-05-04T02:06:00.622Z"
            },
            {
                "online": 20,
                "offline": 40,
                "updateTime": "2016-05-04T02:07:00.622Z"
            },
            {
                "online": 50,
                "offline": 50,
                "updateTime": "2016-05-04T02:08:00.622Z"
            },
            {
                "online": 40,
                "offline": 40,
                "updateTime": "2016-05-04T02:09:00.622Z"
            },
            {
                "online": 80,
                "offline": 75,
                "updateTime": "2016-05-04T02:10:00.622Z"
            },
            {
                "online": 70,
                "offline": 40,
                "updateTime": "2016-05-04T02:11:00.622Z"
            },
            {
                "online": 50,
                "offline": 40,
                "updateTime": "2016-05-04T02:12:00.622Z"
            }

        ]
        var aOnlineData = [];
        var aOfflineData= [];
        var aTimes = [];

        $.each(aInData,function(i,oData){
            aOnlineData.push(oData.online);
            aOfflineData.push(oData.offline);
            var temp = new Date(oData.updateTime);
            aTimes.push(timeStatus(temp.getHours())+":"+timeStatus(temp.getMinutes()));
        });


        drawWeekCliNum(aOnlineData,aOfflineData,aTimes);
    }

    function initData()
    {
        initEchatLineData();
        initDashboardData();
        initAlertData();
        initRestartData();
        initDevHisData();
        initListData();

    }

    function _init()
    {
        initOpt();
        initData();
        initForm();

    }

    function _destroy()
    {
        g_aAlert = [];
        g_aRestart = [];
        aInData = [];
        aListData = [];
        aHealthData = [];
        aApOnlineData = [];
        aClientAuthData = [];

    }


    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form","Echart"],
        "utils":["Request","Base"],
        "subModules":[]
    });
})( jQuery );


