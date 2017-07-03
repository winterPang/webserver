;(function ($) {
    var MODULE_BASE = "b_log";
    var MODULE_NAME = MODULE_BASE + ".log";
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("log_monitor_rc", sRcName);
    }

    function compLogLevalNum(aData)
    {
        var oCrit = {},oError = {},oWarn = {},oInfo = {};
        var aSendLogMsg = [];
        oCrit.name = getRcText("CRIT"),oCrit.value = 0;
        oError.name = getRcText("ERROR"),oError.value = 0;
        oWarn.name = getRcText("WARN"),oWarn.value = 0;
        oInfo.name = getRcText("COMMON"),oInfo.value = 0;

        /*计算各个级别的个数*/
        for(var i=0;i<aData.length;i++)
        {
            if(aData[i].level == oCrit.name)
            {
                oCrit.value += 1;
                continue;
            }
            if(aData[i].level == oWarn.name)
            {
                oWarn.value += 1;
                continue;
            }
            if(aData[i].level == oError.name)
            {
                oError.value += 1;
                continue;
            }
            if(aData[i].level == oInfo.name)
            {
                oInfo.value += 1;
                continue;
            }
        }

        aSendLogMsg.push(oCrit,oError,oWarn,oInfo);
        return aSendLogMsg;
    }
    function initLogType_Option(aData)
    {
        var nToatal = aData[0].value+aData[1].value+aData[2].value+aData[3].value;
        if (!nToatal) 
        {
            var ncrit = aData[0].value;
			var nerror = aData[1].value;
			var nwarn = aData[2].value;
			var ninfo = aData[3].value;
             var option = {
                calculable : false,
                height:250,
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius : 80,
                        center: ['50%', '55%'],
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    show:false
                                }
                            }
                        },
                        data: [{name:getRcText("CRIT"),value:ncrit},{name:getRcText("ERROR"),value:nerror},
                            {name:getRcText("WARN"),value:nwarn},{name:getRcText("COMMON"),value:ninfo}]

                    }
                ]
            };
            var oTheme = {color: ['#F5F5F5']};
            $("#loganalysis").echart("init", option,oTheme);
			$("#TotalNumber").html(nToatal);
			$("#crit").html(ncrit);
			$("#error").html(nerror);
			$("#warn").html(nwarn);
			$("#info").html(ninfo);
        }
        else
        {
            var nToatal = aData[0].value+aData[1].value+aData[2].value+aData[3].value;
        var ncrit = aData[0].value;
        var nerror = aData[1].value;
        var nwarn = aData[2].value;
        var ninfo = aData[3].value;
        var labelFromatter = {
            normal : {
                label : {
                    textStyle: {
                        color:"gray"
                    }
                }
            }
        };
        $.each(aData, function(i, oTemp){
            $.extend(oTemp,{itemStyle:labelFromatter});
        });
        var option = {
            height:250,
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b}: {d}%"
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : 80,
                    center: ['50%', '55%'],
                    data: [{name:getRcText("CRIT"),value:ncrit},{name:getRcText("ERROR"),value:nerror},
                        {name:getRcText("WARN"),value:nwarn},{name:getRcText("COMMON"),value:ninfo}]
                }
            ]
        };
        var oTheme={
            color: ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800']
        };
        $("#loganalysis").echart("init", option,oTheme);
        $("#TotalNumber").html(nToatal);
        $("#crit").html(ncrit);
        $("#error").html(nerror);
        $("#warn").html(nwarn);
        $("#info").html(ninfo);
        }
        
    }


    function compLogMoudelNum(aData)
    {
        var aMondulNum = [];
        var nCount = 0;
        /*计算不同模块的个数*/
        for(var i=0;i<aData.length;i++)
        {
            aData[i].value = 1;
            if(aData[i].remove == 1)
            {
                continue;
            }
            for(var j=1;j<aData.length;j++)
            {
                if(aData[i].module == aData[j].module)
                {
                    aData[i].value++;
                    aData[j].remove = 1;
                }
            }
            aMondulNum[nCount] = aData[i];
            nCount++;
        }
        for(var i=0;i<aMondulNum.length;i++)
        {
            aMondulNum[i].name = aMondulNum[i].module;
            delete aMondulNum[i].ip;
            delete aMondulNum[i].module;
            delete aMondulNum[i].level;
            delete aMondulNum[i].message;
            delete aMondulNum[i].stamp;
            delete aMondulNum[i].user;
        }
        /*取出前五名*/
        for(i=0;i<aMondulNum.length-1;i++)
        {
            for(j=i+1;j<aMondulNum.length;j++)
            {
                if(aMondulNum[j].value>aMondulNum[i].value)
                {
                    var temp = aMondulNum[j];
                    aMondulNum[j] = aMondulNum[i];
                    aMondulNum[i] = temp;
                }
            }
        }
        aMondulNum = (aMondulNum.length>5)?aMondulNum.splice(0,5):aMondulNum;
        return aMondulNum;

    }
    function initLogModule_Option(aData)
    {
        if (!aData.length) 
            {
             var option = {
                calculable : false,
                height:250,
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius : 80,
                        center: ['50%', '55%'],
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    show:false
                                }
                            }
                        },
                        data: [{name:"",value:1}]
                    }
                ]
            };
            var oTheme = {color: ['#F5F5F5']};
            $("#logmodul").echart("init", option,oTheme);
            }
       else
       {
            var labelFromatter = {
            normal : {
                label : {
                    textStyle: {
                        color:"gray"
                    }
                }
            }
        };
        $.each(aData, function(i, oTemp){
            $.extend(oTemp,{itemStyle:labelFromatter});
        });
        var option = {
            height:250,
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b}: {d}%"
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : 80,
                    center: ['50%', '55%'],
                    data:aData
                }
            ]
        };
        var oTheme={
            color: ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800']
        };
        $("#logmodul").echart("init", option,oTheme);
       }
        
    }
    function initLogType()
    {
      /*  initLogType_Option();//test*/
        $.ajax({
            url:  MyConfig.path+"/ant/logmgr",
            dataType: "json",
            type:"post",
            data:{
                devSN:FrameInfo.ACSN,
                method:"getLog",
                ret:[
                    "level"
                ]
            },
            success: function (data)
            {
                var LogMsg = data.message;
                var LogNum = compLogLevalNum(LogMsg);
                initLogType_Option(LogNum);
            },
        });
    }

    function initLogModule()
    {
       /* initLogModule_Option();//test*/
        $.ajax({
            url:  MyConfig.path+"/ant/logmgr",
            dataType: "json",
            type:"post",
            data:{
                devSN:FrameInfo.ACSN,
                method:"getLog",
                ret:[
                    "module"
                ]
            },
            success: function (data)
            {
                var LogMsg = data.message;
                var LogMoudel = compLogMoudelNum(LogMsg);
                initLogModule_Option(LogMoudel);
            },
        });
    }
    /*function testAdd()
    {
        $.ajax({
            url:  MyConfig.path+"/ant/logmgr",
            dataType: "json",
            type:"post",
            data:{
                devSN:FrameInfo.ACSN,
                method:"addLog",
                module:"mod1",
                level:"crit",
                message:"test log",
            },
            success: function ()
            {
                console.log("seccess!")
            },

        });
    }*/
    function Logchart_option(aTime,oData)
    {
        var option = {
            height:240,
            legend: {
                data:[getRcText("CRIT"),getRcText("WARN"),getRcText("COMMON"),getRcText("ERROR")]
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },

            grid: {
                x: 55, y: 40,x2:35,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:false,
                   // name:getRcText("SHOWTIME"),
                    //nameTextStyle:{color:"gray"},
                    axisLabel: {
                        rotate:45
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E6E6FA', width: 1}
                    },
                    axisTick :{
                        show:false
                    },
                    data:aTime
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name:getRcText("NUMBER"),
                    nameTextStyle:{color:"gray"},
                    splitLine:false,
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
            series: [
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: getRcText("CRIT"),
                    data:oData.crit
                },
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: getRcText("WARN"),
                    data :oData.warn
                },
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: getRcText("COMMON"),
                    data:oData.common
                },
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: getRcText("ERROR"),
                    data:oData.error
                },
            ]

        };
        var oTheme = {
            color: ['#0096d6','#31A9DC','#62BCE2','#7BC7E7'],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFF']}},
                axisLabel:{textStyle: {color: [ '#abbbde']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };
        $("#log_chart").echart("init", option, oTheme);
    }

    function initLogChart()
    {
        var nDATA = 30;
        var tNow = new Date();
        var nYear = tNow.getFullYear();
        var nMonth = tNow.getMonth()+1;
        var nDay = tNow.getDate();
        var nOneDay = 24*3600*1000;

        var aFlowOptTime = [];
        var oData = {};

        oData.crit = [];
        oData.warn = [];
        oData.common = [];
        oData.error = [];

        for(var i=0;i<nDATA;i++)
        {
            aFlowOptTime[i] = tNow - nOneDay*(nDATA-i-1);
            oData.crit[i] = 0;
            oData.warn[i] = 0;
            oData.common[i] = 0;
            oData.error[i] = 0;
        }

        $.ajax({
            url:  MyConfig.path+"/ant/logmgr",
            dataType: "json",
            type:"post",
            data:{
                devSN:FrameInfo.ACSN,
                sessionID:"00001",
                method:"getLog",
                ret:[
                    "level"
                ]
            },
            success: function (data)
            {
                var LogMsg = data.message;

                for(var i=1;i<aFlowOptTime.length;i++)
                {
                    for(var j=0;j<LogMsg.length;j++)
                    {
                        var dataTimeStamp = LogMsg[j].stamp * 1000;
                        if((dataTimeStamp>=aFlowOptTime[i]-nOneDay) && (dataTimeStamp<=aFlowOptTime[i]))
                        {
                            if(LogMsg[j].level == getRcText("CRIT"))
                            {
                                oData.crit[i-1] +=1;
                            }
                            else if(LogMsg[j].level == getRcText("WARN"))
                            {
                                oData.warn[i-1] +=1;
                            }
                            else if(LogMsg[j].level == getRcText("COMMON"))
                            {
                                oData.common[i-1] +=1;
                            }
                            else if(LogMsg[j].level == getRcText("ERROR"))
                            {
                                oData.error[i-1] +=1;
                            }
                        }
                    }
                }

                for(var i=0;i<aFlowOptTime.length;i++)
                {
                    aFlowOptTime[i] = new Date(aFlowOptTime[i]);
                    aFlowOptTime[i] = aFlowOptTime[i].toLocaleDateString();
                }
                Logchart_option(aFlowOptTime,oData);
            },
        });
    }

    function refreshlog()
    {
        initLogType();
        initLogModule();
        initLogChart();
    }
    function initForm()
    {
        $("#loginfo_detail").on("click", function(){
            Utils.Base.redirect ({np:"log.loginfo",ID:$(this).attr("id")});
            return false;
        });
        $("#refreshlog").on("click",refreshlog);
    }
    function initData()
    {
        //testAdd();
        initLogType();
        initLogModule();
        initLogChart();
    }
    function initGrid()
    {
    }
    function _init()
    {
        initForm();
        initGrid();
        initData();
    };

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart"],
        "utils":["Base"]
    });
})( jQuery );