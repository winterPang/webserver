;(function ($) {
    var MODULE_BASE = "networkoptimization";
    var MODULE_NAME = MODULE_BASE+".optimization";

    const CON_ACSN = FrameInfo.ACSN;
    const CON_ONEDAY = 0;     //周期的五种类型
    const CON_ONEWEEK = 1;
    const CON_ONEMONTH = 2
    const CON_HALFYEAR = 3;
    const CON_ONEYEAR = 4;
    const CON_OTHERTIME = 5;

    //var g_nRangeType = 0; //记录周期类型
    var g_nStartTime = 0;
    var g_nEndTime = 0;
    var g_Radios, g_PercentMax = 100;
    var g_todayTime = Math.round(new Date().getTime() / 1000);
    var g_aOptionSeriesName = getRcText("SERIES-NAME").split(",");

    /*获得html页面的定义的汉字*/
    function getRcText(sRcName) {
        return Utils.Base.getRcString("optimization_rc", sRcName);
    }
    //获得其它的开始时间和结束时间
    function getOtherRangeTime() {
        var nHourTime = 60 * 60;
        var nDayTime = 24 * nHourTime;
        var orange = $("#inputTime").daterange("getRangeData");

        var strStartTime = orange.startData;
        var strEndTime   = orange.endData;
        var nStartYear  = Number(strStartTime.slice(0, 4));
        var nStartMonth = Number(strStartTime.slice(5, 7)) - 1;
        var nStartDay   = Number(strStartTime.slice(8, 10));
        var nEndYear    = Number(strEndTime.slice(0, 4));
        var nEndMonth   = Number(strEndTime.slice(5, 7)) - 1;
        var nEndDay     = Number(strEndTime.slice(8, 10));

        $("#timeLabel").text("(" + orange.startData + "-" + orange.endData + ")");
        
        g_nStartTime = Math.round((new Date(nStartYear, nStartMonth, nStartDay)).getTime() / 1000);
        g_nEndTime   = Math.round((new Date(nEndYear, nEndMonth, nEndDay)).getTime() / 1000 + nDayTime);
    }
    //获得开始时间和结束时间
    function getRangeTime(nRangeType) {
        var nHourTime = 60 * 60;
        var nDayTime = 24 * nHourTime;
        var nWeekTime = 7 * nDayTime;
        var nMonthTime = 30 * nDayTime;
        var nHalfYear = 183 * nDayTime;
        var nYearTime = 365 * nDayTime;
        var strCurrentDate = new Date().toLocaleDateString();   //获得今天年月日
        var nTodayZeroTime = Math.round(new Date(strCurrentDate).getTime() / 1000);   //获得今天零时的时间

        // g_nEndTime = nTodayZeroTime + nDayTime;
        g_nEndTime = Math.round(new Date().getTime() / 1000);

        switch(nRangeType) {
            case CON_ONEDAY: {
                g_nStartTime = nTodayZeroTime;
                break;
            }
            case CON_ONEWEEK: {
                g_nStartTime = nTodayZeroTime + nDayTime - nWeekTime;
                break;
            }
            case CON_ONEMONTH: {
                g_nStartTime = nTodayZeroTime + nDayTime - nMonthTime;
                break;
            }
            case CON_ONEYEAR: {
                g_nStartTime = nTodayZeroTime + nDayTime - nYearTime;
                break;
            }
            case CON_HALFYEAR: {
                g_nStartTime = nTodayZeroTime + nDayTime - nHalfYear;
                break;
            }
            case CON_OTHERTIME: {
                getOtherRangeTime();
                break;
            }
            default: {
                console.log("Select time range error");
                break;
            }
        }
    }

    function addOneTouchOptimizedHtml() {
        var a_strOneTouchID1 = ["wireless_load1", "radio_resource1", "info_gather1", "terminal_behavior1"];
        var a_strOneTouchID2 = ["'5G_priority0' ", "'AP_load_balance0' ", "'airRate0' ", "'weakSignalMsgOpt0' ",
                                "'ignoreWeakSignalMsg0' ", "'Prohibit5G_LowRadio0' ", "'autoChannelAdjust0' ",
                                "'dynamicPowerAdjust0' ", "'autoPowerAdjust0' ", "'enhanceEnergyInterference0' ",
                                "'ChannelReuseAdjustment0' "];
        var a_strOneTouchLabel = ["5G优先功能", "AP间负载均衡", "空口发送速率动态调整", "弱信号报文优化",
                                "忽略弱信号报文", "禁止使用5G射频的低频段资源", "自动信道调整", "动态功率调整",
                                "自动功率调整", "增强能量干扰能力", "信道重用能力调整"];
        var a_strOneTouchSpan = ["终端会优先连接5G高速的服务", "均衡各个AP上线终端的数量，避免某一个AP负载过高",
                                "射频会动态调整速率，实现通信的最优速率",
                                "动态调整AP感知弱信号的能力，忽略非到达本身的低强度的信号，以提高AP发送报文的机会，同时会减少AP接收正常报文的干扰", 
                                "避免弱信号干扰，提高射频利用率", "避免弱信号干扰，提高射频利用率",
                                "根据当前工作信道的拥情况，自动调整工作信道到最优信道，本优化主要用于高密会环境",
                                "自动调整功率", "blablablablablablablablablablablablabla",
                                "调整能量干扰的门限。本优化主要用于高密会环境", 
                                "开启之后，会根据当前环境，自动调整干扰的阀值dddd"];

        var strStartDiv = "<div class='basic-content'>";
        var strEndDiv = "</div>";
        var strStartIcon = "<span class='checkbox-icon selected-icon'>"; 
        var strEndIcon = "</span>&nbsp;";
        var strInput = "";

        var strStartLabel = "";
        var strEndLabel = "</label>&nbsp;"

        var strStartSpan1 = "<span>";
        var strStartSpan2 = "<span style='display:block; margin-left:18px'>";
        var strEndSpan = "</span>"

        var strLabel = "";
        var strInputIcon = ""; 

        var strHtml = "";
        var nFlag = 0;

        for(var i = 0, j = 0; i < a_strOneTouchID1.length; i++) {
            strHtml = "";
            switch(a_strOneTouchID1[i]) {
                case "wireless_load1": {
                    nFlag = 2; //这个值最好是传过来的值
                    break;
                }
                case "radio_resource1": {
                    nFlag = 9;
                    break;
                }
                case "info_gather1": {
                    nFlag = 0;
                    break;
                }
                case "terminal_behavior1": {
                    nFlag = 0;
                    break;
                }
                default: {
                    console.log("ID ERROR !!!");
                    break;
                } 
            }
            for( ; nFlag && j < a_strOneTouchID2.length; j++, nFlag--) {
                if(44 >= a_strOneTouchLabel[j].length + a_strOneTouchSpan[j].length) {
                    strSpan = strStartSpan1 + a_strOneTouchSpan[j] + strEndSpan;    
                }
                else {
                    strSpan = strStartSpan2 + a_strOneTouchSpan[j] + strEndSpan;
                }

                strInput = "<input type='checkbox' id=" + a_strOneTouchID2[j] + "/>";
                strStartLabel = "<label for=" + a_strOneTouchID2[j] + ">";
                strLabel = strStartLabel + a_strOneTouchLabel[j] + strEndLabel;
                strInputIcon = strStartIcon + strInput + strEndIcon; 

                strHtml = strHtml + strStartDiv + strInputIcon + strLabel + strSpan + strEndDiv;
            }

            $("#" + a_strOneTouchID1[i]).html(strHtml);
        }
        

        // if(44 >= a_strContentLabel[i].length + a_strContentSpan[i].length) {
        //     strSpan = strStartSpan1 + a_strContentSpan[0] + strEndSpan;    
        // }
        // else {
        //     strSpan = strStartSpan2 + a_strContentSpan[0] + strEndSpan;
        // }

        // var strLabel = strStartLabel + a_strContentLabel[0] + strEndLabel;
        // var strInputIcon = strStartIcon + strInput + strEndIcon; 

        

        /* 相当于input的checkbox选择事件绑定 */
        $(".checkbox-icon", '.basic-content').on("click", function(){
            $(this).toggleClass("un-selected-icon").toggleClass("selected-icon");
            var strID = $("input[type='checkbox']", this).attr("id");
        });
    }

    function fillOptApListHead() {
        var opt = {
            colNames: getRcText("ANALYSIS-OF-AP"),
            showHeader: true,
            search:false,
            pageSize:12,
            colModel: [
                {name: "ApName", datatype: "String"},
                {name: "ScoreHealth",datatype: "Integer"},
                {name: "NumTerminal", datatype: "Integer"},
                {name: "NumTrmnlBePrmtd", datatype: "Integer"},
                {name: "Power", datatype: "Integer"},
                {name: "SgnlIntnsty", datatype: "Integer"},
                {name: "State", datatype: "Integer"},
                {name: "Optimization", datatype: "Integer"},
            ]
        };
        $("#optimizeAP_list").SList("head", opt);
    }

    function fillOptAPList() {
        //ajax获得数据
        var aData = [
                {'ApName': 'apple', 'ScoreHealth': '12', 'NumTerminal': 0, 'NumTrmnlBePrmtd': 0, 
                    'Power': 0, 'SgnlIntnsty': 0, 'State': 0, 'Optimization': 0},
                ];

        $("#optimizeAP_list").SList("refresh", aData);
    }

    function optimizeAPList(param) {
        var strTime = param.name;

        // if('今日' != strTime) {
        //     console.log("Error: " + strTime);
        //     return ;
        // }

        Utils.Base.openDlg(null, {}, {scope:$("#optimizeAPlist"),className:"modal-super dashboard"});
        $("#optimizeAP_list").empty();
         
        fillOptApListHead();
        fillOptAPList();
    }

    function fillNoHealthAPBar() {
        var aUnhealthyTypeOfAP = getRcText("UNHEALTHY-TYPE-OF-AP").split(",");

        var option = {
            height : 300,
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: aUnhealthyTypeOfAP
            },
            grid: {
                borderColor: '#FFF',
                x:60, y:30, x2:20, y2:85,
            },
            xAxis : [
                {
                    type : 'category',
                    axisTick : false,
                    splitArea : false,
                    splitLine : false,
                    axisLine : {
                        show: true,
                        lineStyle: {
                            color: '#e7e7e9',
                            style: 'solid',
                            width: 1,
                        }
                    },
                    data : ['7月1日','7月2日','7月3日','7月4日','7月5日','7月6日','今日']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisTick : false,
                    splitArea : false,
                    splitLine : false,
                    axisLine : {
                        show: true,
                        lineStyle: {
                            color: '#e7e7e9',
                            style: 'solid',
                            width: 1,
                        }
                    },
                }
            ],
            series : [
                {
                    name: aUnhealthyTypeOfAP[0],
                    type:'bar',
                    barWidth : 40,
                    stack: aUnhealthyTypeOfAP[4],
                    data:[320, 302, 301, 334, 390, 330, 320]
                },
                {
                    name:aUnhealthyTypeOfAP[1],
                    type:'bar',
                    barWidth : 40,
                    stack: aUnhealthyTypeOfAP[4],
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: aUnhealthyTypeOfAP[2],
                    type:'bar',
                    barWidth : 40,
                    stack: aUnhealthyTypeOfAP[4],
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: aUnhealthyTypeOfAP[3],
                    type:'bar',
                    barWidth : 40,
                    stack: aUnhealthyTypeOfAP[4],
                    data:[150, 212, 201, 154, 190, 330, 410]
                },
            ],
            click:optimizeAPList,
        };

        var oTheme = {
            color : ['#fe808b','#b3b7dd','#f2bc98','#e9e9f5']
        };

        $("#no_health_AP_class_static").echart("init", option, oTheme);     
    }

    function drawNoHealthAPBar(nMode) {
        fillNoHealthAPBar();
    }
    
    function fillTerminalPie(aData) {
        var nFlag = 1;
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
          
            calculable : false,
            series : [
                {
                    name: g_aOptionSeriesName[0],
                    type:'pie',
                    radius : ['35%', '60%'],
                    itemStyle : {
                        normal : {
                            labelLine : {
                                show : true
                            },
                            label: {
                                position:"outer", 
                                textStyle: {
                                    color: '#80878c',
                                }
                            },
                        },
                        emphasis : {
                            label : {
                                show : true,
                                position : 'center',
                                textStyle : {
                                    fontSize : '25',
                                    fontWeight : 'bold',
                                    color: '#80878c',
                                }
                            }
                        }
                    },
                    data:aData,
                }
            ]
        };

        var oTheme = {
               color : ['#FDBFC4', '#FFD9DC', '#F2BC98', '#F8DDCC','#FE808B', '#DDF3F0']
        };

        if(aData.length) {
            for(var i = 0; i < aData.length; i++) {
                if( 0 != aData[i].value && '0' != aData[i].value) {
                    nFlag = 0;
                    break;
                }
            }
        }

        if(nFlag) {
            option.series[0].data = [{value:1, name:'test1'}, {value:0, name:'test2'}];
            option.series[0].itemStyle.normal.labelLine.show = false;
            option.series[0].itemStyle.normal.label.show = false;
            option.series[0].itemStyle.emphasis.label.show = false;
            option.tooltip.show = false;
            option.series.data  = aData;
            var oTheme = {
               color : ['#ccc','#ccc','#ccc','#ccc','#ccc','#ccc']
            };
        }
        
        $("#terminal_pie").echart("init", option, oTheme);
    }
    /*绘制-终端体验-饼图*/
    function drawTerminalPie() {
        function getMsgSuccess(oData) {
            var aData = oData.statistics;
            var oTmpData = [];
            var oTmp = {};
            var aName = getRcText("STATISTC-TERMINAL").split(",");

            for(var i = 0; i < aData.length; i++) {
                if(0 != aData[i]) {
                    switch(i) {
                        case 0: {
                            oTmp = {value:0, name:aName[0]};
                            break;
                        }
                        case 1: {
                            oTmp = {value:0, name:aName[1]};
                            break;
                        }
                        case 2: {
                            oTmp = {value:0, name:aName[2]};
                            break;
                        }
                        case 3: {
                            oTmp = {value:0, name:aName[3]};
                            break;
                        }
                        case 4: {
                            oTmp = {value:0, name:aName[4]};
                            break;
                        }
                    }
                    oTmp.value = aData[i];
                    oTmpData.push(oTmp);
                }
            }
            fillTerminalPie(oTmpData);
        }
        var SendMsg = {
            url: MyConfig.path + '/stamonitor/getclientlist_byrxrate',
            type:"post",
            dataType: "json",
            data:{
                devSN: FrameInfo.ACSN,
                clientRxRate: [0,100,400,1000,2500],
            },
            onSuccess:getMsgSuccess,
            onFailed:function(e){
                console.log(e);
            }
        };
        Utils.Request.sendRequest(SendMsg);
    }

    function drawHealthInfo(){
        function dealHealthInfo(oData){
            var oData = JSON.parse(oData);
            var aDataAnalysis = [
                oData.wanspeed    || 0,
                oData.APpercent   || 0,
                oData.clientspeed || 0,
                oData.security    || 0,
                oData.wireless    || 0,
                oData.system      || 0
            ];

            fillComprehensiveHealthDegree(oData.finalscore || 0, oData.Bpercent || 0);
            fillHealthAnylysis(aDataAnalysis);
        }

        var ajaxInfo = {
            url: MyConfig.path + '/health/home/health',
            type:"get",
            dataType: "json",
            data:{
                acSN: FrameInfo.ACSN
            },

            onSuccess:dealHealthInfo,
            onFailed:function(e){
                console.log(e);
            }
        };

        Utils.Request.sendRequest(ajaxInfo);
    }

    function drawComprehensiveHealthHistory(nMode){
        function pushData(oData, showData, dayMode){
            var strTmpTime = new Date();
            var strPreTime = "";
            var strTime = "";
            var nHourTime = 60 * 60;
            var nDayTime = 24 * nHourTime;
            var nWeekTime = 7 * nDayTime;
            var nMonthTime = 30 * nDayTime;
           
            switch(dayMode) {
                case CON_ONEWEEK: {
                    for(var i = oData.length - 1; i >= 0 ; i--){
                        strTime = new Date(strTmpTime.getTime() - i * nDayTime * 1000);
                        showData.name.push(strTime.getMonth() + 1 + "/" + strTime.getDate());
                        showData.value.push(oData[i].finalscore);
                    }
                    break;    
                }
                case CON_ONEMONTH: {
                    for(var i = oData.length - 1; i >= 0 ; i--) {
                        strTime = new Date(strTmpTime.getTime() - i * nWeekTime * 1000);
                        var str1= strTime.getMonth() + 1 + "/" + strTime.getDate();
                        showData.name.push(str1);
                        showData.value.push(oData[i].finalscore);
                    }
                    break;
                }
                case CON_HALFYEAR: {
                    for(var i = oData.length - 1; i >= 0 ; i--) {
                        strTime = new Date(strTmpTime.getTime() - i * nMonthTime * 1000);
                        var str1 = strTime.getMonth() + 1 + "/" + strTime.getDate();
                        showData.name.push(str1);
                        showData.value.push(oData[i].finalscore);
                    }
                    break;
                }
            }  
        }

        function dealHistoryHealthInfo(oData){
            var oData = JSON.parse(oData);
            var showData = {name:[], value:[]};

            switch(nMode){
                case 3: {
                    pushData(oData, showData, CON_HALFYEAR);
                    break;
                }                
                case 2: {
                    pushData(oData, showData, CON_ONEMONTH);
                    break;
                }
                default: {
                    pushData(oData, showData, CON_ONEWEEK);
                    break;
                }            
            }

            fillComprehensiveHealthHistory(showData);
        }

        var ajaxInfo = {
            url:  MyConfig.path + '/health/home/history/change',
            type:"get",
            dataType: "json",
            data:{
                acSN: FrameInfo.ACSN,
                mode: nMode || 1
            },

            onSuccess:dealHistoryHealthInfo,
            onFailed:function(e){
                console.log(e);
            }
        };
        Utils.Request.sendRequest(ajaxInfo);
    }

    function fillComprehensiveHealthDegree(score, percent) {
        var option = {
            height : 210,
            calculable : false,
            series : [
                {
                    name: g_aOptionSeriesName[0],
                    type: 'pie',
                    radius : ['48%','65%'],
                    center: ['50%', '50%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true,
                                position : 'center',
                                textStyle : {
                                    color : '#80878c',
                                    fontSize : 20
                                }
                                
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : false,
                            }
                        }
                    },
                    data:[
                        {value:percent, name: score + getRcText("SCORE")},
                        {value:(100-percent), name:''},
                 
                    ]
                }
            ]
        };

        var oTheme = {color: ['#77cfc3','#ddf3f0']};

        $("#compre_health_Dgr") .echart("init", option, oTheme);
    }

    function fillHealthAnylysis(aValue) {
        var aName = getRcText("DEPTH-HEALTH-ANALYSIS").split(",");
        var option = {
            height : 210,
            tooltip : {
                trigger: 'axis'
            },
            calculable : false,
            polar : [
                {
                    indicator : [
                        {text : aName[0], max  : 5},
                        {text : aName[1], max  : 5},
                        {text : aName[2], max  : 5},
                        {text : aName[3], max  : 5},
                        {text : aName[4], max  : 5},
                        {text : aName[5], max  : 5}
                    ],
                    radius : 90
                }
            ],
            series : [
                {
                    name: g_aOptionSeriesName[1],
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data : [
                        {
                            value : aValue,
                            name : ['宽带分析','系统健康度','无线环境','安全评价','终端速率','AP在线率']
                        },
                    ]
                }
            ]
        };

        var oTheme = {color: ['#77cfc3']};

        $("#hlth_dgr_analysis").echart("init", option, oTheme);
    }

    function fillComprehensiveHealthHistory(showData) {
        var aTime = showData.name;
        var oData = showData.value;
        var option = {
            height:210,
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#373737',
                        width: 0,
                        type: 'solid',
                    }
                },
            },

            grid: {
                x:40, y:10, x2:35, y2:25,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    type : 'category',
                    axisTick : false,
                    splitArea : false,
                    axisLine : false,
                    splitLine : false,
                    boundaryGap: false,
                    data:aTime
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    // name:"NUMBER",
                    splitLine : {
                        show: true,
                        lineStyle: {
                            color: "#e7e7e9",
                            solid: "dotted",
                            width: 1,
                        },
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#47495d', width: 1}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E6E6FA', width: 1}
                    }
                }
            ],
            series: [{
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: "历史健康数据",
                data: oData,
            },
            ]
        };

        var oTheme = {
            color: ['#4ec1b2'],
        };

        $("#htry_compre_health_Dgr").echart("init", option, oTheme);
    }

    var g_oToatalBandwidth = {bFlag: false, upBandwidth: 0, downBandwidth: 0};
    var g_oBandwidthSpeed = {bFlag: false, aSpeedUp:[], aSpeedDown:[], aRecordDate:[]};

    function getUserSetBandwidth() {
        function getMsgSuccess(oData) {
            g_oToatalBandwidth.bFlag = true;
            g_oToatalBandwidth.upBandwidth = oData.upBandwidth;
            g_oToatalBandwidth.downBandwidth = oData.downBandwidth;

            console.log(g_oBandwidthSpeed);
            console.log(g_oToatalBandwidth);

            if(true == g_oBandwidthSpeed.bFlag) {
                console.log(oData);
                for(var i = 0; i < g_oBandwidthSpeed.aSpeedUp.length; i++) {
                    g_oBandwidthSpeed.aSpeedUp[i] = g_oBandwidthSpeed.aSpeedUp[i] / 1024 * g_oToatalBandwidth.upBandwidth; 
                    g_oBandwidthSpeed.aSpeedDown[i] = g_oBandwidthSpeed.aSpeedDown[i] / 1024 * g_oToatalBandwidth.downBandwidth;
                }

                fillBandwidthAnalysisChart(g_oBandwidthSpeed.aRecordDate, g_oBandwidthSpeed.aSpeedUp, g_oBandwidthSpeed.aSpeedDown);
            }
        }

        var SendMsg = {
            url: "/v3/devmonitor/getbandwidth",
            dataType: "json",
            type: "GET",
            data: {
                devSN : FrameInfo.ACSN,
            },
            onSuccess:getMsgSuccess,
            onFailed:function() {console.log("Error !!!");}
        }
        Utils.Request.sendRequest(SendMsg);
    }

    /*带宽分析*/
    function drawBandwidthAnalysisChart(strTime) {
        function getMsgSuccess(oData) {
            var aData = oData.dataList;
            var aTmp = aData[0].dataList;

            for(var i = 0; i < aTmp.length; i++) {
                g_oBandwidthSpeed.aSpeedUp[i] = 0;
                g_oBandwidthSpeed.aSpeedDown[i] = 0;
                g_oBandwidthSpeed.aRecordDate[i] = "";
            }

            g_oBandwidthSpeed.bFlag = true;
            for(var i = 0; i < aData.length; i++) {
                for(var j = 0; j < aTmp.length; j++) {
                    g_oBandwidthSpeed.aRecordDate[j] = aTmp[j].recordDate;
                    g_oBandwidthSpeed.aSpeedUp[j] += aTmp[j].speed_up;
                    g_oBandwidthSpeed.aSpeedDown[j] += aTmp[j].speed_down;
                }
            }
            
            if(true == g_oToatalBandwidth.bFlag) {
                for(var i = 0; i < g_oBandwidthSpeed.aSpeedUp.length; i++) {
                    g_oBandwidthSpeed.aSpeedUp[i] = Math.round(g_oBandwidthSpeed.aSpeedUp[i] / 1024 / g_oToatalBandwidth.upBandwidth); 
                    g_oBandwidthSpeed.aSpeedDown[i] = Math.round(g_oBandwidthSpeed.aSpeedDown[i] / 1024 * g_oToatalBandwidth.downBandwidth);
                }

                fillBandwidthAnalysisChart(g_oBandwidthSpeed.aRecordDate, g_oBandwidthSpeed.aSpeedUp, g_oBandwidthSpeed.aSpeedDown);
            }
        }

        var SendMsg = {
            url: "/v3/devmonitor/gethistUplinkData",
            dataType: "json",
            type: "GET",
            data: {
                devSN : FrameInfo.ACSN,
                statistic_type: strTime
            },
            onSuccess:getMsgSuccess,
            onFailed:function() {console.log("Error !!!");}
        }
        Utils.Request.sendRequest(SendMsg); 
    }

    function sumData(aData, aName) {
        var nSum = 0;
        var nLength = aData.length;

        for(var i = 0; i < nLength; i++) {
            nSum = nSum + aData[i];
        }

        for(var i = 0; i < nLength; i++) {
            if(0 > aData[i]) {
                aData[i] = -Math.round(aData[i] / nSum * 100 * 10) / 10;
            }
            else {
                aData[i] = Math.round(aData[i] / nSum * 100 * 10) / 10;    
            }
        }

        if(0 < nSum) {
            $("#TotalExportUpBandwidth").text(aName[0] + "：" + nSum + "Mbps");
        }
        else {
            $("#TotalExportDownBandwidth").text(aName[1] + "：" + (-nSum) + "Mbps");
        }
    }

    function fillBandwidthAnalysisChart(aTime, aSpeedUp, aSpeedDown) {
        var aName = getRcText("BANDWIDTH").split(",");
        //var aTime = ["7月1日","7月2日","7月3日","7月4日","7月5日","7月6日"];
        var aSpeedUp = [11,5,6,12,22,5,12];
        var aSpeedDown = [-23,-11,-24,-5,-21,-7,-11];
       
        // sumData(oData1, aName);
        // sumData(oData2, aName);
        var option = {
            height:280,
            legend: {
                data: aName,
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                // formatter: function(params) {
                //     if(0 > params[1][2]) 
                //     {params[1][2] = -params[1][2];}
                //     var str1 = params[0][1] + '<br/>';
                //     var str2 = params[0][0] + ':' + params[0][2] + '%' + '<br/>';
                //     var str3 = params[1][0] + ':' + params[1][2] + '%' + '<br/>';
                //     return str1 + str2 + str3;
                // },
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#373737',
                        width: 0,
                        type: 'solid',
                    }
                },
            },
            grid: {
                x: 55, y: 45,x2:35,
                borderColor: '#FFF'
            },
            xAxis: [
                {
                    show : true,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {show:false},
                    axisLabel:{show: false},
                    axisTick: {show:false},
                    splitLine: {
                      show: true,
                      lineStyle: {
                        type: 'dashed',
                        color: '#ccc',
                        width: 1,
                      },
                    },
                    data:aTime
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    nameTextStyle:{color:"gray"},
                    splitLine:false,
                    axisLabel: {
                        show: true,
                        formatter: function(value){
                            if(0 > value) {
                                value = (-value);
                            }
                            return value + "%";
                        },
                        textStyle:{color: '#47495d', width: 1}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E6E6FA', width: 1}
                    }
                }
            ],
            series: [{
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {areaStyle: {type: 'default'}},
                },
                name: aName[0],
                data: aSpeedUp,
            },
            {
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: aName[1],
                data: aSpeedDown,
            },
            ]
        };

        var oTheme = {
            color: ['#77cfc3','#f2bc98'],
        };

        $("#broadband_analysis").echart("init", option, oTheme);
    }

    function fillUsagePie(usageId, nData, strText, oTheme) {
        var strPercent = 0;
        var nTmp = 0;
        var b_show = true;

        if("undefined" == typeof(nData)) {
            nData = nTmp;
            b_show = false;
            oTheme = {color: ['#ccc','#ccc']};
        }
        strPercent = nData + '%';

        var option = {
            height : 240,
            title: {
                text: strText,
                x: 'center',
                y: 200,
                textStyle: {
                    fontSize: 12,
                    fontWeight: "normal",
                    color: "#80878c"
                }
            },
            series : [
                {
                    name: g_aOptionSeriesName[0],
                    type:'pie',
                    radius : ['50%','70%'],
                    center: ['50%', '45%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : b_show,
                                position : 'center',
                                textStyle : {
                                    color : '#80878c',
                                    fontSize : 20,
                                }
                            },
                            labelLine : {show : false}
                        },
                        emphasis : {
                            label : {show : false}
                        }
                    },
                    data:[
                        {value: nData, name: strPercent},
                        {value:(100-nData), name:''},
                    ]
                }
            ]
        };

        $(usageId).echart("init", option, oTheme);
    }
    /*cpu、内存、存储使用率*/
    function darwUsagePie() {
        function getMsgSuccess(data){
            var aName = getRcText("USAGE-RATE").split(",")
            fillUsagePie("#cpu_usage", data.cpuRatio, aName[0], {color: ['#77cfc3','#ddf3f0']});
            fillUsagePie("#memory_usage", data.memoryRatio, aName[1], {color: ['#fe808b','#ddf3f0']});
            fillUsagePie("#storage_usage", data.diskRatio, aName[2], {color: ['#f2bc98','#ddf3f0']});
        }

        var SendMsg = {
            url: MyConfig.path + "/devmonitor/web/system",
            //dataType: "json",
            type: "GET",
            data: {
                devSN : FrameInfo.ACSN,
            },
            onSuccess:getMsgSuccess
        }
        Utils.Request.sendRequest(SendMsg);
    }

    function drawApOnlineRate() {
        function getMsgSuccess(data) {
            var aData = data.ap_statistic;

            $("#online_AP").text(aData.online);
            $("#offline_AP").text(aData.offline);
            $("#unhealthy_AP").text(aData.other);

            fillApOnlineRate(aData);
        }

        function getMsgFail() {
            console.log("fail terminal fail!");
        }

        var SendMsg = {
            url: MyConfig.path + "/apmonitor/getApCountByStatus",
            dataType: "json",
            type: "GET",
            data: {
                devSN : FrameInfo.ACSN,
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
    }

    function fillApOnlineRate(data) { 
        var aData = [ {value:0, name:getRcText("AP-ONLINE")}, {value:0, name:""} ];
        var oTheme = {};

        if(data.online || data.offline) {
            aData[0].value = data.online;
            aData[1].value = data.offline;
            oTheme = {color: ['#77cfc3','#ddf3f0']};
        }
        else {
            aData[0].value = 1;
            aData[1].value = 1;
            oTheme = {color: ['#ccc','#ccc']}; 
        }
        
        var option = {
            height : 180,
            series : [
                {
                    type:'pie',
                    radius : ['55%', '75%'],
                    center : ['50%', '45%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true,
                                position : 'center',
                                textStyle : {
                                    color : '#80878c',
                                    fontSize : 20
                                }
                            },
                            labelLine : { show : false }
                        },
                        emphasis : {
                            label : { show: false,}
                        }
                    },
                    data:aData
                }
            ]
        };
        
        $("#ApOnlineRate").echart("init", option,oTheme);   
    }
    /*协商速率*/
    function drawNegotiatingSpeed() {
        function getMsgSuccess(data){
            fillTerminalVelocityBar("consult_Chart",data.statistics, aNegoMaxRate, aName[0]);
        }

        function getMsgFail(){
            console.log("fail terminal fail!");
        }

        var aName = getRcText("TERMINAL-SPEED").split(",");
        var aNegoMaxRate = [0,1,4,10,20,50,100,500,1500];
        var SendMsg = {
            url: MyConfig.path + "/stamonitor/clientstatistic_bynegomaxrate",
            dataType: "json",
            type: "post",
            data: {
                devSN : FrameInfo.ACSN,
                NegoMaxRate: aNegoMaxRate
            },
            onSuccess: getMsgSuccess,
            onFailed:getMsgFail
        };
        Utils.Request.sendRequest(SendMsg);
    }
    /*信噪比分布*/
    function drawSignalNoiseRatioDistribution() {
        function getMsgSuccess(data){
            fillTerminalVelocityBar("xinzaobi_Chart", data.statistics, aSignalStrength, aName[1]);
        }

        function getMsgFail(){
            console.log("fail terminal fail!");
        }

        var aName = getRcText("TERMINAL-SPEED").split(",");
        var aSignalStrength = [0,1,4,10,20,50,100,500,1500];
        var SendMsg = {
            url: MyConfig.path + "/stamonitor/clientstatistic_bysignalstrength",
            dataType: "json",
            type: "post",
            data: {
                devSN : FrameInfo.ACSN,
                signalStrength: aSignalStrength
            },
            onSuccess: getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
    }

    function fillTerminalVelocityBar(strID, aData, aXData, strTitle) { 
        var aTmp = [0,0,0,0,0,0,0,0,0,0];
        aData = aData.length ? aData : aTmp;
        // aData = [12,23,3,4,5,12,2,1,6];

        var option = { 
            height: 200, 
            title: {
                show:true,
                text: strTitle,
                x: 'center',
                y: 'top',
                textStyle: {
                    fontSize: 8,
                    color: '#80878c',
                }
            },
            grid: {
                x: 40, y: 30, x2: 45, y2: 20, 
                borderColor: '#fff', 
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    name: "Kbps",
                    nameTextStyle: {
                        color: "000",
                    },
                    boundaryGap: true,
                    splitLine:{show:false},
                    axisLabel: { 
                        show: true,
                        margin:4,
                        textStyle: {color: '#000', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#e6e6fa', width: 1}
                    },
                    axisTick: {show: false},
                    data: aXData,
                }
            ],
            yAxis: [
                {
                    type: 'value', 
                    show:true,
                    nameTextStyle: {color: "#fff"},
                    splitLine:{show:false}, 
                    axisLabel: {
                        show: true, 
                        textStyle: {color: '#000', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#e6e6fa', width: 1}
                    }  
                }
            ],
            series: [
                {
                    symbol: "none",
                    type: 'bar',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {type: 'default'},
                            label : {
                                show: true, 
                                position: 'top',
                            },
                            color: function(param) {
                                var colorList = [
                                    '#FE808B', '#FDBFC4', '#FFD9DC', '#F2BC98', '#F8DDCC',
                                    '#DDF3F0', '#B9E6E1', '#8CD8CE', '#71CDC1', '#4EC1B2' 
                                ];
                                return colorList[param.dataIndex];
                            }
                        }
                    },
                    data: aData,
                } 
            ]
        }; 
        $("#" + strID).echart("init", option); 
    }
    
    function fillListHead(listID) {
        var rougeAPModel = [
                {name:'MacAddress', datatype:"String"},
                {name:'LastReportTime', datatype:"String"},
            ];
        var natDetectModel = [
            {name:'ClientMAC', datatype:"String"},
            {name:'LastTime', datatype:"String"},
        ];
        var opt = {
            colNames: getRcText ("LIST-HEAD"),
            showHeader: true,
            pageSize:6,
            search: false,
            colModel: []
        };

        if("rouge_AP" == listID || "rougeAP_details" == listID) {
            opt.colModel = rougeAPModel;
        }
        else if ("nat_detect" == listID || "nat_detact_details" == listID) {
            opt.colModel = natDetectModel;
        }

        $("#" + listID).SList ("head", opt);
    }
    
    function getLastReporteTime(nTime) {
        var strTime = new Date(nTime * 1000);
        var nYear = strTime.getFullYear();
        var nMonth = strTime.getMonth() + 1;
        var nDate = strTime.getDate();
        var nHours = strTime.getHours();
        var nMinutes = strTime.getMinutes();
        var nSeconds = strTime.getSeconds();
        var retTime = "";

        if(nMonth < 10) {
            nMonth = "0" + nMonth;
        }
        if(nDate < 10) {
            nDate = "0" + nDate;
        }
        if(nHours < 10) {
            nHours = "0" + nHours;
        }
        if(nMinutes < 10) {
            nMinutes = "0" + nMinutes;
        }
        if(nSeconds < 10) {
            nSeconds = "0" + nSeconds;
        }

        retTime = nYear + "-" + nMonth + "-" + nDate + " " + nHours + ":" + nMinutes + ":" + nSeconds;

        return retTime;
    }

    function drawRougeApList(detialsFlag) {
        function getMsgSuccess(data){
            var arrRecv = data.message;
            var length = arrRecv.length;
            var len = detialsFlag ? length : 6;
            var arrData = [];

            // arrData = [{MacAddress:"ec26-ca9f-f234",LastReportTime:"2016-7-5 18:06:15"}];
            if(length) {
                for (var i = 0; i < len; i++) {
                    var jsonData = {"MacAddress": "", "LastReportTime": ""};

                    jsonData["MacAddress"] = arrRecv[i].MacAddress;
                    jsonData["LastReportTime"] = getLastReporteTime(arrRecv[i].LastReportTime);
                    arrData[i] = jsonData;
                }    
            }
            
            if(detialsFlag) {
                $("#rougeAP_details").SList ("refresh", arrData);
            }
            else {
                $("#rougeAP_num").text(length);
                $("#rouge_AP").SList ("refresh", arrData);
                $(".page-bar", "#rouge_AP").remove();
            } 
        }

        var SendMsg = {
            url: MyConfig.path + "/ant/read_wips_ap",
            dataType: "json",
            type: "post",
            data: {
                Method : "GetSpecifyAp",
                Param  : {
                    ACSN      : FrameInfo.ACSN,
                    StartTime : 1,
                    EndTime   : g_todayTime,
                    ClassifyType: 3,
                    Return:[
                        "MacAddress",
                        "LastReportTime"
                    ]
                }
            },
            onSuccess:getMsgSuccess,
            onFailed:function(e) {console.log(e)},
        }
        Utils.Request.sendRequest(SendMsg);
    }

    function drawNatDetectList(detialsFlag) {
        function getMsgSuccess(data){
            var arrRecv = data.message;
            var length = arrRecv.length;
            var len = detialsFlag ? length : 6;
            var arrData = [];

            if(length) {
                for (var i = 0; i < len; i++) {
                    var jsonData = {"ClientMAC": "", "LastTime": ""};

                    jsonData["ClientMAC"] = arrRecv[i].ClientMAC;
                    jsonData["LastTime"] = getLastReporteTime(arrRecv[i].LastTime);
                    arrData[i] = jsonData;
                }    
            }
            
            if(detialsFlag) {
                $("#nat_detact_details").SList ("refresh", arrData);
            }
            else {
                $("#net_detect_num").text(length);
                $("#nat_detect").SList ("refresh", arrData);
                $(".page-bar", "#nat_detect").remove();
            }
        }

        function getMsgFail(){console.log("fail terminal fail!");}

        var SendMsg = {
            url: MyConfig.path + "/ant/nat_detect",
            dataType: "json",
            type: "post",
            data: {
                Method : "GetClient",
                Param  : {
                    ACSN      : FrameInfo.ACSN,
                    StartTime : 1,
                    EndTime   : g_todayTime,
                }
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
    }

    function fillWireEnvPie(objID, oTheme, strTitle, aData){
        var nFlag = 1;
        var option = {
            title: {
                show: true,
                text: strTitle,
                x: "center",
                y: 114,
                textStyle: {
                    color: '#80878c',
                },
            },
            height: 280,
            tooltip: {
                trigger: 'item',
                formatter: " {b}：{d}%"
            }, 
            calculable: false,
            series: [
                { 
                    type: 'pie',
                    radius: ['35%', '52%'],
                    center: ['50%', '45%'],
                    itemStyle: { 
                        normal: {
                            labelLine: {
                                show: true,
                                color:"#000",
                                lineStyle: {
                                    width: 1,
                                }
                            },
                            label: {
                                show:true,
                                position:"outer", 
                                formatter:"{b}: {c}",
                                textStyle: {
                                    color: '#80878c',
                                }
                            }
                        }
                    },
                    data: aData
                }
            ],
        };

        if(aData.length) {
            for(var i = 0; i < aData.length; i++) {
                if( 0 != aData[i].value && '0' != aData[i].value) {
                    nFlag = 0;
                }
            }
        }

        if(nFlag) {
            option.series[0].itemStyle.normal.labelLine.show = false;
            option.series[0].itemStyle.normal.label.show = false;
            option.tooltip.show = false;
            option.series[0].data = [{value:1, name:'test1'}, {value:0, name:'test2'}];
            oTheme = {
               color : ['#ccc','#ccc','#ccc','#ccc','#ccc','#ccc']
            };
        }
        
        $(objID).echart("init", option, oTheme); 
    }

    function fillWireEnvBar(arrRd2d4G, arrRd5G, arrKey){
        var option = { 
            height: 270, 
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#ccc',
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            legend: {
                data:['2.4G','5G']
            }, 
            grid: {
                x: 50, y: 30, x2: 30, y2: 45,
                borderWidth: 0,
                borderColor: '#415172'
            },
           
            xAxis : [
                {
                    type : 'category', 
                    splitLine:{show:false},
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#000', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#e6e6fa', width: 1}
                    },
                    axisTick: {
                        show: false
                    },
                    data: arrKey,
                }
            ],
            yAxis : [
                {
                    type : 'value',  
                    nameTextStyle: {color: "gray"},
                    splitLine:{show:false},
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#000', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#e6e6fa', width: 1}
                    }  
                }
            ],
            series : [
                 {
                    name:'2.4G',
                    type:'bar',
                    data:arrRd2d4G, 
                },
                {
                    name:'5G',
                    type:'bar',
                    data: arrRd5G,  
                }
            ]
        };
        var oTheme = {
             color : ['#FDBFC4','#68CABD']
        }

        $("#Wireless_Bar").echart("init", option, oTheme); 
    }

    function dealWireEnvData(oData, retData, retKey) {
        var aName = getRcText("WIRELESS-ENVIRONMENT").split(",");
        var oTmpData = [];
        var len = oTmpData.length;
        var i = 0, j = 0;

        for(var key in oData) {
            retData[i] = oData[key];

            switch(key) {
                case "BestNum": {
                    retKey[i] = aName[0];
                    if(0 != oData[key]) {
                        var oTmp = {name: aName[0],value: oData[key]};
                    }
                    break;
                }
                case "BetterNum": {
                    retKey[i] = aName[1];
                    if(0 != oData[key]) {
                        var oTmp = {name: aName[1],value: oData[key]};
                    }
                    break;
                }
                case "GoodNum": {
                    retKey[i] = aName[2];
                    if(0 != oData[key]) {
                        var oTmp = {name: aName[2],value: oData[key]};
                    }
                    break;
                }
                case "BadNum": {
                    retKey[i] = aName[3];
                    if(0 != oData[key]) {
                        var oTmp = {name: aName[3],value: oData[key]};
                    }
                    break;
                }
                case "WorstNum": {
                    retKey[i] = aName[4];
                    if(0 != oData[key]) {
                        var oTmp = {name: aName[4],value: oData[key]};
                    }
                    break;
                }
                default : {
                    break;
                }
            }

            if(0 != oData[key]) {
                oTmpData[j] = oTmp;
                j++;
            }
            i++;
        }

        return oTmpData;
    }

    function drawWireEnvPieAndBar() {
        var oTheme = {
           color : ['#FDBFC4', '#FFD9DC', '#F2BC98', '#F8DDCC','#FE808B']
        };
        var oTheme1 = {
           color : ['#CBECE8','#A7E0D9','#82D4C8','#68CABD','#4EC1B2','#D7DDE4']
        };

        var SendMsg = {
            url: MyConfig.path + "/rrmserver",
            dataType: "json",
            type: "post",
            data: {
                Method : "GetACStatistic",
                Param  : {
                    ACSN      : FrameInfo.ACSN,
                    StartTime : 1,
                    EndTime   : 1470215156,
                }
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data){
            var arrRd2d4G = [];
            var arrRd5G = [];
            var arrKey = [];
            var oRd2d4G = dealWireEnvData(data.message.Rd2d4G, arrRd2d4G, arrKey);
            var oRd5G = dealWireEnvData(data.message.Rd5G, arrRd5G, arrKey);
            var aName = getRcText("BAND").split(",");
            
            fillWireEnvPie("#2GDisplay", oTheme, aName[0], oRd2d4G);
            fillWireEnvPie("#5GDisplay", oTheme1, aName[1], oRd5G);   

            fillWireEnvBar(arrRd2d4G, arrRd5G, arrKey);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
    }
    
    function formListDetails(strID, strIDDetails) {
        Utils.Base.openDlg(null, {}, {scope:$("#" + strID),className:"modal-super dashboard"});
        $("#" + strIDDetails).empty();
    }

    function onClickDetails() {
        var strThisID = $(this).attr("id");
        
        switch(strThisID) {
            case "rougeAPDetails": {
                formListDetails("rougeAPForm", "rougeAP_details");
                fillListHead("rougeAP_details");
                drawRougeApList(1);
                break;
            }
            case "nat_detectDetails": {
                formListDetails("nat_detactForm", "nat_detact_details");
                fillListHead("nat_detact_details");
                drawNatDetectList(1);
                break;
            }
            default: {
                console.log("nat_detect List !!!");
                break;
            }
        }
    }

    var nTouchTimer = null;  
    var nTouchbar = 0;
    var nSpecialTimer = null;  
    var nSpecialbar = 0;

    function mouseEnter() {
        console.log("mouseEnter");
        $("#one_touch_optimize, #special_optimization").off("click");
    }

    function mouseLeave() {
        console.log("mouseLeave");
        $("#one_touch_optimize, #special_optimization").on("click", selectOptimizedItem);
    }

    function oneTouchProcessBar() {
        if (nTouchbar < 338) {
            nTouchbar++; 
            $("#onetouchbar").css("width", (nTouchbar + "px"));
        }
        else {
            window.clearInterval(nTouchTimer);
        }
    }

    function specialProcessBar() {
        if (nSpecialbar < 338) {
            nSpecialbar++; 
            $("#specialbar").css("width", (nSpecialbar + "px"));
        }
        else {
            window.clearInterval(nSpecialTimer);
        }
    }

    function processBar(strID) {
        var strID = $(this).attr("id");
        console.log("little bar !!!");
        switch(strID) {
            case "open_touch_icon": {
                nTouchTimer = window.setInterval(oneTouchProcessBar, 50);
                break;
            }
            case "open_special_icon": {
                nSpecialTimer = window.setInterval(specialProcessBar, 50);
                break;
            }
            default :{
                console.log("Error !!!");
                break;
            }
        } 
    }

    function selectOptimizedItem() {
        var strID = $(this).attr("id");

        switch(strID) {
            case "one_touch_optimize": {
                Utils.Base.openDlg(null, {}, {scope:$("#oneTouchOptimForm"),className:"modal-super dashboard"});
                break;
            }
            case "special_optimization": {
                Utils.Base.openDlg(null, {}, {scope:$("#specialOptimForm"),className:"modal-super dashboard"});
                break;
            }
            default : {
                console.log("ID Error !!!!");
                break;
            }
        }
    }

    function optimalAllocation() {
        var strID = $(this).attr("id");

        switch(strID) {
            case "open_touch_icon": {
                Utils.Base.openDlg(null, {}, {scope:$("#oneTouchOptAllocation"),className:"modal-super dashboard"});
                // var tmp = $(".basic-content", "#oneTouchOptimForm").attr("width"); 
                // console.log(tmp);
                break;
            }
            case "open_special_icon": {
                Utils.Base.openDlg(null, {}, {scope:$("#specialOptAllocation"),className:"modal-super dashboard"});
                break;
            }
            default : {
                console.log("ID Error !!!!");
                break;
            }
        }
    }

    //这些时间的命名都是ID和Class
    var g_nTime = 0;
    var g_timeRecord = {
        "executTime1": {"time-hours": 0, "time-minutes": 0, "time-seconds": 0},
        "executTime2": {"time-hours": 0, "time-minutes": 0, "time-seconds": 0},
        "executTime3": {"time-hours": 0, "time-minutes": 0, "time-seconds": 0},
        "executTime4": {"time-hours": 0, "time-minutes": 0, "time-seconds": 0},
        "executTime5": {"time-hours": 0, "time-minutes": 0, "time-seconds": 0},
        "executTime6": {"time-hours": 0, "time-minutes": 0, "time-seconds": 0},
    };
    var g_arrTimeID = ["#executTime1", "#executTime2", "#executTime3", 
                        "#executTime4", "#executTime5", "#executTime6"];
 
    function timeAdjust(e, strClass, strID) {
        if($(e).hasClass("time-up") ) {
            g_nTime = ++g_timeRecord[strID][strClass];  
        }
        else {
            g_nTime = --g_timeRecord[strID][strClass];
        }

        if("time-hours" == strClass) {
            if(23 < g_nTime) {
                g_nTime = 0;
                g_timeRecord[strID]["time-hours"] = 0;
            }
            else if(0 > g_nTime) {
                g_nTime = 23;
                g_timeRecord[strID]["time-hours"] = 23;
            }
        }
        else {
            if(59 < g_nTime) {
                g_nTime = 0;
                g_timeRecord[strID][strClass] = 0;
            }
            else if(0 > g_nTime) {
                g_nTime = 59;
                g_timeRecord[strID][strClass] = 59;
            }
        }

        if(10 > g_nTime) {
            g_nTime = "0" + g_nTime;
        }
    }

    function executTime(e, strClass, strID) {
        switch(strClass) {
            case "time-hours": {
                timeAdjust(e, strClass, strID);
                break;
            }
            case "time-minutes": {
                timeAdjust(e, strClass, strID);
                break;
            }
            case "time-seconds": {
                timeAdjust(e, strClass, strID);
                break;
            }
        }

        $(".Time", "#" + strID + " ." + strClass).text(g_nTime);
    }

    function getAndFillTime(strID) {
        var strHours = 0;
        var strMinutes = 0;
        var strSeconds = 0;
        strHours = $(".Time", "#" + strID + " .time-hours").text();
        strMinutes = $(".Time", "#" + strID + " .time-minutes").text();
        strSeconds = $(".Time", "#" + strID + " .time-seconds").text();

        $("#" + strID).toggleClass("hide");
        $("." + strID).text(strHours + ":" + strMinutes);
        // $("." + strID).text(strHours + ":" + strMinutes + ":" + strSeconds);
    }

    function onSelectRangeTime() {
        var aTimeId = ["AP_ClassificationTime", "TimeOfHealth", "broadbandAnalysisTime"];
        var strID = $(this).closest("table[id]").attr("id");
        var a_oSpan = $(".time-range", ("#" + strID));
        var nMode = 0;

        for(var i = 0; i < a_oSpan.length; i++) {
            $(a_oSpan[i]).removeClass("selected");
        }
        $(this).addClass("selected");

        if($(this).hasClass("one-day")) {
            g_nRangeType = CON_ONEDAY;
            nMode = 0;
        }
        else if($(this).hasClass("one-week")) {
            g_nRangeType = CON_ONEWEEK;
            nMode = 1;
        }
        else if($(this).hasClass("one-month")) {
            g_nRangeType = CON_ONEMONTH;
            nMode = 2;
        }
        else if($(this).hasClass("half-year")) {
            g_nRangeType = CON_HALFYEAR;
            nMode = 3;
        }
        else {
            console.log("Time select has error !!!");
        }

        //getRangeTime(g_nRangeType);
        switch(strID) {
            case "AP_ClassificationTime": {
                drawNoHealthAPBar(nMode); 
                break;
            }
            case "TimeOfHealth": {
                drawComprehensiveHealthHistory(nMode);
                break;
            }
            case "broadbandAnalysisTime": {
                drawBandwidthAnalysisChart(nMode);
                break;
            }
            default: {
                console.log("Time ID select has error !!!");
                break;
            }
        }
    }

    function initForm1() {
        $(".executTime1, .executTime2, .executTime3, .executTime4, .executTime5, .executTime6").on("click",function() {
            var strID = $(this).attr("for");
            $("#" + strID).toggleClass("hide");
            $(".page-over2").toggleClass("hide");
        });

        $(".page-over2").on("click", function() {
            $(this).toggleClass("hide");

            if(!$("#executTime1").hasClass("hide")) {
                getAndFillTime("executTime1");
            }
            if(!$("#executTime2").hasClass("hide")) {
                getAndFillTime("executTime2");
            }
            if(!$("#executTime3").hasClass("hide")) {
                getAndFillTime("executTime3");
            }
            if(!$("#executTime4").hasClass("hide")) {
                getAndFillTime("executTime4");
            }
            if(!$("#executTime5").hasClass("hide")) {
                getAndFillTime("executTime5");
            }
            if(!$("#executTime6").hasClass("hide")) {
                getAndFillTime("executTime6");
            }
        });

        for(var i = 0; i < g_arrTimeID.length; i++) {
            /*小时*/
            $(".time-up, .time-down", g_arrTimeID[i] + " .time-hours").on("click", function() {
                var strClass = $(this).closest("div").attr("class");
                var strID = $(this).closest("div[id]").attr("id");

                executTime(this, strClass, strID);

            });
            /* 分钟 */
            $(".time-up, .time-down", g_arrTimeID[i] + " .time-minutes").on("click", function() {
                var strClass = $(this).closest("div").attr("class");
                var strID = $(this).closest("div[id]").attr("id");

                executTime(this, strClass, strID);
            });
            /* 秒数 */
            $(".time-up, .time-down", g_arrTimeID[i] + " .time-seconds").on("click", function() {
                var strClass = $(this).closest("div").attr("class");
                var strID = $(this).closest("div[id]").attr("id");

                executTime(this, strClass, strID);
            });
        }
    }

    function initForm() {
        initForm1();//一键优化里的时间设定
        $(".down-icon, .up-icon", ".basic-footer").on("click", function() {
            var strID = $(this).attr("for")
            $("#" + strID).toggleClass("hide");
            $(this).toggleClass("down-icon").toggleClass("up-icon");
        });
        /* 优化配置函数 */
        $("#open_touch_icon, #open_special_icon").hover(mouseEnter, mouseLeave);
        $("#open_touch_icon, #open_special_icon").on("click", optimalAllocation);
        $("#one_touch_optimize, #special_optimization").on("click", selectOptimizedItem);

        // $("input[type='submit']", "#input_submit").on("click", onInputSubmit);
        /*详情事假绑定*/
        $("#rougeAPDetails, #nat_detectDetails").on("click", onClickDetails);
        /*一周、一月、半年 周期选择*/
        $(".time-range").on("click", onSelectRangeTime);

        $(".btn", "#oneTouchOptAllocation").on("click", function() {
            var oTmp = $("input[type='checkbox']", "#oneTouchOptAllocation").attr("name");
            console.log(oTmp);
        });
        /* 相当于input的checkbox选择事件绑定 */
        $(".checkbox-icon", '.basic-content').on("click", function(){
            $(this).toggleClass("un-selected-icon").toggleClass("selected-icon");
            var strID = $("input[type='checkbox']", this).attr("id");
        });
    }

    function initGrid() {
        fillListHead("rouge_AP");
        fillListHead("nat_detect");
    }

    function initData() {
        drawTerminalPie();
        drawNoHealthAPBar();
        /* 综合健康度 */
        drawHealthInfo();
        drawComprehensiveHealthHistory(1);
        /* 上行和下行流量统计 */
        getUserSetBandwidth();
        drawBandwidthAnalysisChart("oneWeek");
        darwUsagePie();
        /* 非法AP和私接代理 */
        getRangeTime(3);
        drawRougeApList(0);
        drawNatDetectList(0);
        /* 终端速率 */
        drawNegotiatingSpeed();
        drawSignalNoiseRatioDistribution();
        /* AP在线及不在线统计 */  
        drawApOnlineRate();
        drawWireEnvPieAndBar();
        /*添加一键优化的待优化项的选项*/
        // addOneTouchOptimizedHtml();
        /* 添加专项优化的待优化项的选项 */
        //addSpecialOptimizedHtml();
    }

    function _init(){
        initGrid();
        initForm();
        initData();
    }

    function _destroy() {
        //var g_nRangeType = 0; //记录周期类型
        var g_nStartTime = 0;
        var g_nEndTime = 0;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        // "widgets": ["Echart","SingleSelect","SList","DateRange","Minput","Form","MSelect","DateTime"],
        "widgets": ["Echart","SingleSelect","SList","DateRange","Form"],
        "utils":["Request","Base"],
    });
})( jQuery );

