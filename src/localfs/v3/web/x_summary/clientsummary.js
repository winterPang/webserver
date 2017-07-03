/**
 * Created by KF5783 on 2016/3/23.
 */
;(function ($) {
    var MODULE_BASE = "x_summary"
    var MODULE_NAME = MODULE_BASE+".clientsummary";
    var LIST_NAME   = "#probe_list .simple-list";
    var ECHART_NAME = "#probe_map .myEchart";
    var nowTime     = new Date();
    var StartTime   = new Date(nowTime.toDateString()) - 0;
    var EndTime     = nowTime.getTime();
    var g_choice    = 1;
    var g_mac       = 0;
    var g_condition = {ACSN:FrameInfo.ACSN, StartTime:StartTime, EndTime:EndTime,Count:0};
    var g_timelinedata  = [];
    var g_anaysize_choice = 0;
    var hPending = null;
    function topChange(top, lineHeight,sum, mixTop)//中间点距离上边高度， 行高， 数量， 最小上边距
    {
        if(mixTop != undefined)
        {
            if(top - sum * lineHeight / 2 < mixTop)
            {
                return mixTop;
            }
        }
        return parseInt(top - sum * lineHeight / 2);
    }

    function CheckMac(value)
    {
        //mac地址正则表达式
        var reg_name=/[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}/;
        if(!reg_name.test(value)){
            return false;
        }
        return true;
    }


    var listInfo    = {
        listScope   :"#probe_list .simple-list",
        headOpt     :{
            colNames    : Utils.Base.getRcString("probe_rc","LIST_HEADER"),
            showHeader  : true,
            search      :true,
            pageSize    :13,
            colModel    : [
                {name: "MacAddress", datatype:"String"},
                {name: "FirstTime", datatype:"String"},
                {name: "LastTime", datatype:"String"},
                {name: "Ssid", datatype:"String"},
                {name: "Vendor", datatype:"String"},
            ]
        },
        clientOpt   :{
            colNames    : Utils.Base.getRcString("probe_rc","CLIENT_HEADER"),
            showHeader  : true,
            search      :true,
            pageSize    :13,
            colModel    : [
                {name: "MacAddress", datatype:"String"},
                {name: "ReportTime", datatype:"String"},
                {name: "Channel", datatype:"String"},
                //{name: "Bssid", datatype:"String"},
                {name: "Rssi", datatype:"String"},
                {name: "Status",  datatype:"Order",data:getRcText("PROBE_STATUS")},
                {name: "SensorName", datatype:"String"},
            ]
        }
    };

    var dealEvent   = {
        nowState : {},
        nowRadio : 0,
        scope    : "",
        currentid:"",
        init: function(){
            var jscope = $(".probe-choice");
            for(var i = 0; i < jscope.length; i++)
            {
                dealEvent.nowState[jscope[i].getAttribute("id")] = 1;
            }
        },
        liOnClick: function(e){
            var scope = $(this);
            if(scope.val() == dealEvent.nowState[dealEvent.currentid])
            {
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                return false;
            }
            else
            {
                dealEvent.nowState[dealEvent.currentid] = scope.val();
                $(".current-state", dealEvent.scope).text(scope.text());
                $(".choice-show", dealEvent.scope).removeClass("height-change");
            }
            $("#body_over").addClass("hide");

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
        },
        inputClick:function(e){
            if($("#body_over").hasClass("hide"))
            {
                dealEvent.currentid = $(this).closest(".probe-choice").attr("id");
                dealEvent.scope = "#" + dealEvent.currentid;
                $("#body_over").removeClass("hide");
                $(".choice-show", dealEvent.scope).addClass("height-change");
            }
            else
            {
                $("#body_over").addClass("hide");
                $(".choice-show", dealEvent.scope).removeClass("height-change");
            }

            return false;
        },
        blackClick:function(e){
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).hasClass("height-change") && $(".choice-show", dealEvent.scope).removeClass("height-change");
        },
        searchClick:function(e){
            if(!CheckMac($(".choice-show input", dealEvent.scope).val()))
            {
                $(".choice-show input", dealEvent.scope).addClass("wrong-mac");
                return;
            }
            $(".choice-show input", dealEvent.scope).removeClass("wrong-mac");

            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($(".probe-input").val());

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],parm:$(".probe-input").val()});

        },
        timeClick: function (e) {
            $("#probe_timechoice").addClass("hide");
            //
            //$(dealEvent.scope).trigger({type:"probechange.probe", data:dealEvent.nowState});
            //
        },
        dateChange: function (e) {
            dealEvent.nowState[dealEvent.currentid] = 0;
            var orange = $(this,dealEvent.scope).daterange("getRangeData");
            $(".current-state", dealEvent.scope).text(orange.startData + '-' +orange.endData);
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            StartTime = new Date(orange.startData)-0;
            EndTime = new Date(orange.endData)-0;
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],startTime:StartTime,endTime:EndTime});
        }
    };

    var ajaxInfo    = {
        url         :MyConfig.path + '/ant' + "/read_probeclient",
        dataType    :"json",
        timeout: 150000,
        type        :"post",
        ACSN        :FrameInfo.ACSN,
        data        : {},
    };

    var drawMsg     ={
        judgeData:function(aMessage){
            var xData = [];
            var y1Data = [],y2Data = [],y3Data = [];
            aMessage.sort(function(a, b){
                return Number(a.Date) - Number(b.Date);
            });

            for(var i = 0; i < aMessage.length; i++){
                var temp = new Date(aMessage[i].Date);
                xData.push(temp.toLocaleDateString().slice(5));
                y3Data.push(aMessage[i].Count);
                y1Data.push(aMessage[i].NewClient);
                y2Data.push(aMessage[i].Count - aMessage[i].NewClient);
            }

            return [xData, y1Data, y2Data, y3Data];
        },
        drawTimeLine : function(aData, dateState)
        {
            var timeNow = new Date();
            var xData = [];
            var y1Data = [],y2Data = [],y3Data = [];

            if(aData)
            {
                var aMessage = aData;
                if(!dateState)
                {
                    aMessage.newClient.sort(function(a, b){
                        return Number(a.name) - Number(b.name);
                    });
                    aMessage.oldClient.sort(function(a, b){
                        return Number(a.name) - Number(b.name);
                    });
                    for(var i = (aMessage.oldClient.length < aMessage.newClient.length?aMessage.oldClient.length:aMessage.newClient.length); i--;){
                        var temp = new Date(aMessage.newClient[i].name);
                        xData.unshift(temp.toTimeString().slice(0,5));
                        y1Data.unshift(aMessage.newClient[i].value);
                        y2Data.unshift(aMessage.oldClient[i].value);
                        y3Data.unshift(aMessage.newClient[i].value + aMessage.oldClient[i].value);
                    }
                }
                else
                {
                    var a  = drawMsg.judgeData(aMessage);
                    xData  = a[0];
                    y1Data = a[1];
                    y2Data = a[2];
                    y3Data = a[3];
                }
                g_timelinedata = [xData, y1Data, y2Data, y3Data];
            }
            else{
                xData  = g_timelinedata[0];
                y1Data = g_timelinedata[1];
                y2Data = g_timelinedata[2];
                y3Data = g_timelinedata[3];
            }

            var option = {
                height:350,
                tooltip : {
                    trigger: 'item'
                },
                grid:{
                    x:50,
                    y:80,
                    x2:30,
                    borderWidth:0
                },
                calculable : false,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : xData,
                        splitLine:{
                            show:false,
                        },
                        axisLabel: {
                            rotate:0,
                            textStyle:{color: '#ffffff'}

                        },
                        axisLine  : {
                            show:false,
                            lineStyle :{color: '#F6F7F8', width: 1}
                        }

                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitNumber:4,
                        splitLine:{
                            show:true,
                            lineStyle :{color: '#475C81', width: 1}
                        },
                        axisLabel: {
                            formatter: '{value}',
                            show: true,
                            textStyle:{color: '#ffffff'}
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#475C81', width: 1}
                        }

                    }
                ],
                legend: {
                    data:[getRcText("LEGEND_DATA").split(",")[0],getRcText("LEGEND_DATA").split(",")[1],getRcText("LEGEND_DATA").split(",")[2]],
                    // '全部客户''新客户''老客户'
                    x:"right",
                    y:"top",
                    textStyle:{"color":"#fff"},
                    padding:[30,100]

                },
                series : [
                    {
                        name:getRcText("LEGEND_DATA").split(",")[0],
                        // "全部客户"
                        type:'line',
                        smooth:true,
                        symbol:'circle',
                        symbolSize:0,
                        data:y3Data,
                        itemStyle: {
                            normal: {
                                lineStyle:{
                                    width:1,
                                    color:"#FF9D9E"
                                }
                            },
                            emphasis: {
                                lineStyle:{
                                    width:1,
                                    color:"#FF9D9E"
                                }
                            }
                        }
                    },
                    {
                        name:getRcText("LEGEND_DATA").split(",")[1],
                        // "新客户"
                        type:'line',
                        smooth:true,
                        symbol:'circle',
                        symbolSize:0,
                        data:y1Data,
                        itemStyle: {
                            normal: {
                                lineStyle:{
                                    width:1,
                                    color:"#4EC1B2"
                                }
                            },
                            emphasis: {
                                lineStyle:{
                                    width:1,
                                    color:"#4EC1B2"
                                }
                            }
                        }
                    },
                    {
                        name:getRcText("LEGEND_DATA").split(",")[2],
                        // "老客户"
                        type:'line',
                        smooth:true,
                        symbol:'circle',
                        symbolSize:0,
                        data:y2Data,
                        itemStyle: {
                            normal: {
                                lineStyle:{
                                    width:1,
                                    color:"#FBCEB1"

                                }
                            },
                            emphasis: {
                                lineStyle:{
                                    width:1,
                                    color:"#FBCEB1"

                                }
                            }
                        }


                    },
                ]
            };
            option.series[g_choice-1].itemStyle.normal.lineStyle.width = 3;
            option.series[g_choice-1].itemStyle.emphasis.lineStyle.width = 3;
            option.series[g_choice-1].itemStyle.normal.lineStyle.color = "#9DE274";
            option.series[g_choice-1].itemStyle.emphasis.lineStyle.color = "#9DE274";
            ////delete(option.series[g_choice-1].itemStyle );
            var oTheme = {
                color: ["#FF9D9E","#4EC1B2","#FBCEB1"]
            };
            oTheme.color[g_choice-1] =  "#9DE274";
            $("#probe_line").echart("init", option, oTheme);

        },
        drawSlist: function (aData) {
            var aMessage = aData || [];
            for(var i = 0; i < aMessage.length; i++){
                aMessage[i].FirstTime           = (new Date(aMessage[i].FirstTime)).toLocaleString();
                aMessage[i].LastTime            = (new Date(aMessage[i].LastTime)).toLocaleString();
                aMessage[i].DissociativeStatus  = getRcText("LIST_YES_NO").split(",")[aMessage[i].DissociativeStatus];
                (aMessage[i].Vendor == "unknown") && (aMessage[i].Vendor = getRcText("VENDOR"));
                // "未知"
            }

            $("#probe_slist").SList("refresh", aMessage);
        },

        drawPie: function(aData, dateState)
        {
            var nSumClient = 0;
            var nPer = 0;
            var nTemp = 0;
            var nDataLength = aData.length;
            for(i = 0; i < nDataLength; i++)
            {
                nSumClient += aData[i].Sum;
            }
            var nAll = nSumClient;
            var nShowNumber = 7;
            var nPerAll = nAll / nShowNumber;
            var nSumTemp = 0;
            var aPieData = [];
            var nFirst = 1;
            var nLast  = 0;

            if(nDataLength <= 7)
            {
                for(var i = 0; i < nDataLength; i++)
                {
                    aPieData.push({name:((aData[i].Count + getRcText("TEXT").split(",")[0])), value:aData[i].Sum});
                    // "次"
                }
            }

            else{
                for(i = 0; i < nDataLength; i++)
                {
                    nLast    = aData[i].Count;
                    nSumTemp += aData[i].Sum;
                    nAll -= aData[i].Sum;

                    if(nSumTemp >= nPerAll)
                    {
                        aPieData.push({name:((nFirst == nLast)?(nFirst + getRcText("TEXT").split(",")[0]):(nFirst + "~" + nLast + getRcText("TEXT").split(",")[0])), value:nSumTemp});
                        // "次""次"
                        nShowNumber--;
                        if(nShowNumber == 1)
                        {
                            aPieData.push({name:((getRcText("TEXT").split(",")[1]+ nLast + getRcText("TEXT").split(",")[0])), value:nAll});
                            //"大于" "次"
                            break;
                        }
                        nFirst = nLast + 1;
                        nSumTemp = 0;
                        nPerAll = nAll / nShowNumber;
                    }

                }
            }

            if(!aPieData.length)
            {
                var option = {
                    calculable : false,
                    height:350,
                    tooltip : {
                        show:false
                    },
                    title:{
                        text:getRcText("TEXT").split(",")[2],
                        // '访客频率统计'
                        x:"center",
                        y:60,
                        textStyle:{
                            fontSize: 15,
                            fontWeight: 'bolder',
                            color: '#fff'
                        }

                    },
                    series : [
                        {
                            type: 'pie',
                            radius : 75,
                            center: ['50%', '60%'],
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
                var oTheme = {color: ['#ccc']};
            }
            else 
            {
              var option = {
                  height:350,
                  tooltip : {
                      show:true,
                      trigger: 'item',
                      formatter: "{b}<br/> {c} ({d}%)"
                  },
                  calculable : false,
                  myLegend:{
                      scope : "#probe_Ssid",
                      width: "40%",
                      right: "15%",
                      top: topChange(190, 31, aPieData.length, 8),
                  },
                  title:{
                      text:getRcText("TEXT").split(",")[2],
                    //   '访客频率统计'
                      x:"center",
                      y:60,
                      textStyle:{
                          fontSize: 15,
                          fontWeight: 'bolder',
                          color: '#fff'
                      }

                  },
                  series : [
                      {
                          name:getRcText("TEXT").split(",")[2],
                        //   '访客频率统计'
                          type:'pie',
                          radius : [35, 75],
                          center: ['25%', '50%'],
                          itemStyle : {
                              normal : {
                                  label : {
                                      position : 'inner',
                                      formatter : function (a,b,c,d) {
                                          return ""
                                      }
                                  },
                                  labelLine : {
                                      show : false
                                  }
                              },
                              emphasis : {
                                  label : {
                                      formatter : "{b}\n{d}%"
                                  }
                              }
                          },
                          data:aPieData
                      }
                  ]
              };
                var oTheme = {
                    color:['#0195D7','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B','#91B2D2','#D7DDE4']
                };
            }
            $("#probe_pie").echart("init", option, oTheme);

        },

        drawTablePie: function(aMessage, dateState)
        {
            var aData = [];
            var option = 0;
            var oTheme = 0;
            var labelTop = {
                normal:{
                    color:'#31A9DC',

                    label:{
                        show:true,
                        position:'center',
                        formatter:'{b}',
                        textStyle:{
                            baseline:'bottom'
                        },
                    },
                    labelLine:{
                        show:false
                    }
                }
            };
            var labelFromatter = {
                normal : {
                    label : {
                        formatter : function (params){
                            return (100 - params.value).toFixed(2) + '%'
                        },
                        textStyle: {
                            baseline : 'top',
                            color:'#fff'
                        }
                    }
                },
            }
            var labelBottom = {
                normal: {
                    color:'#5E78A4',

                    label: {
                        show:true,
                        position:'center',

                    },
                    labelLine:{
                        show:false
                    },

                },
                emphasis:{
                    color:'rgba(0,0,0,0)'
                }
            };
            if(aMessage[0] < aMessage[1])
            {
                var tmp = (aMessage[0]*100/aMessage[1]).toFixed(1) - 0;
                aData.push({name:getRcText("CLIENT_ACCOUNT").split(",")[0],value:100 - tmp, itemStyle : labelBottom});
                // "访客总数"
                aMessage[0] && aData.push({name:getRcText("CLIENT_ACCOUNT").split(",")[1],value:tmp,itemStyle: labelTop});
                // "访客数量"
            }
            else{
                var tmp = (aMessage[1]*100/aMessage[0]).toFixed(1) - 0;

                aMessage[1] && aData.push({name:getRcText("CLIENT_ACCOUNT").split(",")[1],value:tmp,itemStyle: labelTop});
                // "访客数量"
                aData.push({name:getRcText("CLIENT_ACCOUNT").split(",")[0],value:100 - tmp, itemStyle : labelBottom});
                // "访客总数"
            }


            var radius = [40, 75];
            option = {
                height:350,
                title:{
                    text:getRcText("TEXT").split(",")[3],
                    // '访客总量占比'
                    x:"center",
                    y:60,
                    textStyle:{
                        fontSize: 15,
                        fontWeight: 'bolder',
                        color: '#fff'
                    }

                },
                series : [
                    {
                        type : 'pie',
                        center : ['50%', '50%'],
                        radius : radius,
                        //x: '0%',
                        itemStyle : labelFromatter,
                        data : aData
                    }
                ]
            };

            //if(!aData.length)
            //{
            //    option = {
            //        calculable : false,
            //        height:350,
            //        tooltip : {
            //            show:false
            //        },
            //        series : [
            //            {
            //                type: 'pie',
            //                radius : 75,
            //                center: ['50%', '60%'],
            //                title:{
            //                    text:'访客历史比例',
            //                    x:"center",
            //                    y:'bottom',
            //                    textStyle:{
            //                        fontSize: 15,
            //                        fontWeight: 'bolder',
            //                        color: '#fff'
            //                    }
            //
            //                },
            //                data: [{name:"",value:1}]
            //            }
            //        ]
            //    };
            //    oTheme = {color: ['#ccc']};
            //
            //}
            //else{
            //
            //    option = {
            //        height:350,
            //        tooltip : {
            //            show:true,
            //            trigger: 'item',
            //            formatter: "{b}<br/> {c} ({d}%)"
            //        },
            //        calculable : false,
            //        title:{
            //            text:'访客总比例',
            //            x:"center",
            //            y:'bottom',
            //            textStyle:{
            //                fontSize: 15,
            //                fontWeight: 'bolder',
            //                color: '#fff'
            //            }
            //
            //        },
            //
            //        series : [
            //            {
            //                name:'访客总比例',
            //                type:'pie',
            //                radius : 75,
            //                center: ['50%', '50%'],
            //                itemStyle : {
            //
            //                    emphasis : {
            //                        label : {
            //                            formatter : "{b}\n{d}%"
            //                        }
            //                    }
            //                },
            //                data:aData
            //            }
            //        ]
            //    };
            //    oTheme = {
            //        color : ['#53B9E7','#FFBB33','#FF8800','#F8C972']
            //    };
            //}


            

            $("#probe_sumary_pie").echart("init", option);
        }
    };

    function loadingFunc(scope){
        $(scope).echart("init", {height:0}, []);
    }

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("probe_rc", sRcName);
    }

    function send2server(oParam, successFunc, errorFunc){
        var ajaxMsg = {
            url         :ajaxInfo.url,
            dataType    :ajaxInfo.dataType,
            type        :ajaxInfo.type,
            data        :oParam,
            onSuccess     :successFunc,
            onFailed       :errorFunc
        };

        Utils.Request.sendRequest(ajaxMsg);
    }


    function initData(e)
    {
        if(g_choice != 0 && g_anaysize_choice == 0)
        {
            initTimeClient();
            initSimpleSlist();
        }
        else if(g_choice != 0 && g_anaysize_choice == 1)
        {
            initCountStatistic();
            initSummaryPie();
            initSimpleSlist();
        }
        else
        {
            initClientSlist(e);
        }
    }
    function initClientSlist(strMac)
    {
        function callback(adoc)
        {
            var aMessage = adoc.Message || [];
            for(var i = 0; i < aMessage.length; i++){
                aMessage[i].ReportTime  = (new Date(aMessage[i].ReportTime)).toLocaleString();
                aMessage[i].Rssi        = aMessage[i].Rssi + '';
            }


            $("#probe_slist").SList("refresh", aMessage);
        }
        var data = {};
        data.Param = g_condition;
        data.Method = "GetClientInfo";
        data.Param.MacAddress = strMac;

        data.Return = [];
        $(listInfo.listScope).children().remove();
        $(listInfo.listScope).SList("head", listInfo.clientOpt);
        send2server(data,callback,errorFunc)
    }


    function initTimeClient()
    {
        function callback(adoc){
            drawMsg.drawTimeLine(adoc.Message, dateState);
        }
        var dateState = 0;
        var data = {};
        data.Param = g_condition;
        if(EndTime - StartTime <= 24 * 60 * 60 * 1000)
        {
            dateState = 0;
            data.Param.Count = 3;
            data.Method = "MultiClassify";
        }
        else{
            dateState = 1;
            data.Method = "DaysInfo";
            data.Return = ["Date", "Count", "NewClient"];
        }
        send2server(data,callback,errorFunc)
    }

    function initSimpleSlist()
    {
        function callback(adoc)
        {
            drawMsg.drawSlist(adoc.Message);
        }
        var data = {};
        data.Param = g_condition;
        data.Method = "GetAllClients";

        data.Return = ["MacAddress", "FirstTime", "LastTime", "Count"];
        $(listInfo.listScope).children().remove();
        $(listInfo.listScope).SList("head", listInfo.headOpt);

        send2server(data,callback,errorFunc)
    }

    function initCountStatistic()
    {
        function callback(adoc){
            drawMsg.drawPie(adoc.Message);
        }
        var data = {};
        data.Param = g_condition;
        data.Method = "ClientCountStatistic";
        send2server(data,callback,errorFunc);
    }

    function initSummaryPie()
    {
        function callback(adoc){
            aResult.push(adoc.Message);
            if(aResult.length == 2)
            {
                drawMsg.drawTablePie(aResult);
            }
        }
        var aResult = [];
        var ajaxMsg = {
            url         :ajaxInfo.url,
            dataType    :ajaxInfo.dataType,
            type        :ajaxInfo.type,
            data        :{
                Method : "SummaryClient",
                Param  : {
                    ACSN:FrameInfo.ACSN,
                    StartTime:1,
                    EndTime:(new Date() - 0)
                }
            },
            onSuccess     :callback,
            onFailed       :errorFunc
        };
        var ajaxMsg2 = {
            url         :ajaxInfo.url,
            dataType    :ajaxInfo.dataType,
            type        :ajaxInfo.type,
            data        :{
                Method : "SummaryClient",
                Param  : {
                    ACSN:FrameInfo.ACSN,
                    StartTime:StartTime,
                    EndTime:EndTime
                }
            },
            onSuccess     :callback,
            onFailed       :errorFunc
        };
        Utils.Request.sendRequest(ajaxMsg);
        Utils.Request.sendRequest(ajaxMsg2);

    }

    function errorFunc(error){
        hPending&&hPending.close();
        console.log(error);
    }

    function optionPush(){
        $(".toppannel #switch-text").html(getRcText("switchBtn"));
        function parseQuery(location) {
            var query = location.search.replace('?', '');
            var params = query.split('&');
            var result = {};
            $.each(params, function () {
                var temp = this.split('=');
                result[temp[0]] = temp.length === 2 ? temp[1] : undefined;
            });
            return result;
        }
        /*var $panel = $('#scenes_panel'), //  下拉面板
         $trigger = $('#change_scenes_trigger'),  //  点击展开的按钮
         $btnChange = $('#switchScenesBtn'),  //  确认按钮
         $selectedScene = $('#selectedScene'),  //  场景选择下拉框
         $devSn = $('#devSn'),  //  设备管理下拉
         $devContain = $('#device-contain'),
         $contain = $('#scene-contain');  //  容器*/
        var $panel = $('#reDevSelect #scenes_panel'), //  下拉面板
            $trigger = $('#reDevSelect #change_scenes_trigger'),  //  点击展开的按钮
            $btnChange = $('#reDevSelect #switchScenesBtn'),  //  确认按钮
            $selectedScene = $('#reDevSelect #selectedScene'),  //  场景选择下拉框
            $devSn = $('#reDevSelect #devSn'),  //  设备管理下拉
            $devContain = $('#reDevSelect #device-contain'),
            $contain = $('#reDevSelect #scene-contain');  //  容器
        //  if first load,set devsn value param's devsn
        var firstLoad = true, //   是否首次加载
            locales = {
                cn: {
                    trigger: '切换设备',
                    device: '选择设备',
                    shop: '选择场所',
                    online: '在线',
                    offline: '不在线'
                },
                en: {
                    trigger: 'Switch Device',
                    device: 'Device',
                    shop: 'Shop',
                    online: 'Online',
                    offline: 'Offline'
                }
            },
            _lang = $.cookie('lang') || 'cn';

        var senceInfo = parseQuery(window.location),
            model = senceInfo.model,  // 存储model信息
            sn = senceInfo.sn,
            nasid = senceInfo.nasid,
            sceneDevList = {}, //   场景和设备的关联关系
            sceneModelObj = {}, //  场景和model的对应关系  {shopId:model}
            devInfoList = {};  //  设备信息列表  {devSN:{devInfo}}

        $('#reDevSelect #switch-text').html(locales[_lang].trigger);  //  点击展开的文本
        $('#reDevSelect #switch-shop').html(locales[_lang].shop);   //  选择场所label
        $('#reDevSelect #switch-device').html(locales[_lang].device);   //   选择设备label

        /**
         * 生成dev下拉框并设置值
         */
        function fillDevField() {
            var val = $selectedScene.val(), devs = sceneDevList[val], devHtml = [];
            $devSn.html('');
            var selectedModel = sceneModelObj[val];
            //  model是1的时候，隐藏设备选择   model是1的时候是小小贝
            //$devContain[selectedModel === 1 ? 'hide' : 'show']();
            var devSnList = [];
            $.each(devs, function (i, d) {
                devSnList.push(d.devSN);
            });

            /**
             * 获取设备在线状态   1:不在线   0:在线
             * 微服务: renwenjie
             */
            $.post('/base/getDevs', {devSN: devSnList}, function (data) {
                var statusList = JSON.parse(data).detail, devList = [];
                $.each(devs, function (i, dev) {
                    $.each(statusList, function (j, sta) {
                        if (dev.devSN === sta.devSN) {
                            dev.status = sta.status;
                            devList.push(dev);
                        }
                    });
                });
                callback(devList);
            }, 'html');

            /**
             * 拼接select下拉框的数据
             * @param devs   所有的设备信息
             */
            function callback(devs) {
                $.each(devs, function (i, dev) {
                    devHtml.push('<option value="', dev.devSN, '">',
                        dev.devName + '(' + (dev.status == 0 ? locales[_lang].online : locales[_lang].offline) + ')',
                        '</option>');
                });
                //  如果是第一次加载就现在进来的sn，如果不是第一次进页面就选择默认的
                $devSn.html(devHtml.join('')).val((devs.length && !firstLoad) ? devs[0].devSN : sn);
                firstLoad = false;
            }
        }

        /**
         * 获取场景信息
         * @param sceneDevList
         * @param devInfoList
         */
        function getSceneList(sceneDevList, devInfoList) {
            $.get("/v3/web/cas_session?refresh=" + Math.random(), function (data) {
                $.post('/v3/scenarioserver', {
                    Method: 'getdevListByUser',
                    param: {
                        userName: data.user
                    }
                }, function (data) {
                    data = JSON.parse(data);
                    if (data && data.retCode == '0') {
                        var sceneHtmlList = [];
                        var sceneObj = {};
                        $.each(data.message, function (i, s) {
                            var devInfo = {
                                devName: s.devName,
                                devSN: s.devSN,
                                url: s.redirectUrl
                            };
                            if (!sceneDevList[s.scenarioId]) {
                                sceneDevList[s.scenarioId] = [];
                            }
                            // 设备信息
                            devInfoList[s.devSN] = devInfo;
                            //  {场景ID:devList}  场景和设备的对应关系
                            sceneDevList[s.scenarioId].push(devInfo);
                            //  {场所ID:场所名称}
                            sceneObj[s.scenarioId] = s.shopName;
                            //  {场所ID:场所model}
                            sceneModelObj[s.scenarioId] = Number(s.model);
                        });
                        // 拼接select框的option
                        $.each(sceneObj, function (k, v) {
                            sceneHtmlList.push('<option value="', k, '">', v, '</option>');
                        });
                        $selectedScene.html(sceneHtmlList.join('')).val(nasid);
                        // 填充设备列表
                        fillDevField();
                    }
                }, 'html');
            });
        }

        getSceneList(sceneDevList, devInfoList);
        $trigger.off('click').on('click', function () {
            $panel.toggle();
        });

        //$btnChange.off('click').on('click', function () {
        //    $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
        //    $panel.hide();
        //});

        $devSn.off("change").on("change",function(){
            $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
            //$panel.hide();
        });

        $selectedScene.off('change').on('change', fillDevField);

        $(document).on('click', function (e) {
            var $target = $(e.target);
            if ($target != $contain && !$.contains($contain.get(0), e.target)) {
                //$panel.hide();
            }
        });
        // ==============  选择场所，end  ==============
        $panel.show();
        function getuserSession() {
            $.ajax({
                url: MyConfig.path + "/scenarioserver",
                type: "POST",
                headers: {Accept: "application/json"},
                contentType: "application/json",
                data: JSON.stringify({
                    "Method": "getdevListByUser",
                    "param": {
                        "userName": FrameInfo.g_user.attributes.name

                    }
                }),
                dataType: "json",
                success: function (data) {
                    var AcInfo = [];
                    if (data.retCode == 0 && data.message) {
                        var snList = [];
                        var aclist = data.message;
                        for (var i = 0; i < aclist.length; i++) {
                            if (aclist[i].shopName) {
                                AcInfo.push({
                                    shop_name: aclist[i].shopName,
                                    sn: aclist[i].devSN,
                                    placeTypeName: aclist[i].scenarioName,
                                    redirectUrl: aclist[i].redirectUrl,
                                    nasid: aclist[i].scenarioId
                                });
                                snList.push(aclist[i].devSN);
                            } else if (aclist[i].devSN) {
                                snList.push(aclist[i].devSN);
                            }
                        }

                    } else {
                        Frame.Debuger.error("[ajax] error,url=====" + MyConfig.path + "/scenarioserver");
                    }
                    getAcInfo(AcInfo);
                }
            });
        }

        getuserSession();

        function getAcInfo(aclist) {
            var opShtmlTemple = "<li data_sn=vals  sel data-url=urls>palce</li>";
            var ulhtml = '<div class="select">' +
                '<p>' +
                '</p>' +
                '<ul>' +
                '</ul>' +
                '</div>';
            $("#station").append(ulhtml);
            for (var i = 0; i < aclist.length; i++) {
                if (window.location.host == "v3webtest.h3c.com") {
                    aclist[i].redirectUrl = aclist[i].redirectUrl.replace("lvzhouv3.h3c.com", "v3webtest.h3c.com");
                }
                var newHtmTemple = opShtmlTemple.replace(/vals/g, aclist[i].sn)
                    .replace(/urls/g, aclist[i].redirectUrl).replace(/palce/g, aclist[i].shop_name);
                var newHtmlTemple_1 = "";
                if (FrameInfo.ACSN == aclist[i].sn) {
                    $(".select > p").text($(newHtmTemple).text());
                } else {
                    newHtmlTemple_1 = newHtmTemple.replace(/sel/g, "");
                }
                $(".content .select ul").append(newHtmlTemple_1);

            }
            $(".select").click(function (e) {
                $(".select").toggleClass('open');
                return false;
            });

            $(".content .select ul li").on("click", function () {
                var _this = $(this);
                $(".select > p").text(_this.html());
                $.cookie("current_menu", "");
                var redirectUrl = $(this).attr("data-url");
                window.location.href = redirectUrl;
                _this.addClass("selected").siblings().removeClass("selected");
                $(".select").removeClass("open");
            });
            $(document).on('click', function () {
                $(".select").removeClass("open");
            })
        }
    }

    function initForm()
    {
        $(listInfo.listScope).SList("head", listInfo.headOpt);
        $(listInfo.listScope).SList("refresh", [{},{},{}]);
        $(".choice-head").click(dealEvent.inputClick);
        $(".choice-show li").click(dealEvent.liOnClick);
        $("#body_over").click(dealEvent.blackClick);
        $(".probesearch-icon").click(dealEvent.searchClick);
        $("#probe_timechoice").click(dealEvent.timeClick);
        $("#daterange").on("inputchange.datarange",dealEvent.dateChange);
        $("#datechoice").on("probechange.probe",function(e, param){
            switch (param.value)
            {
                case 0:
                {
                    g_mac = param.parm.toLowerCase();
                    g_condition.Count = g_choice = 0;
                    g_condition.MacAddress = param.parm;
                    $("#probe_line").children().remove();
                    $("#datechoice1").addClass("position-up");
                    $("#datechoice1").parent().addClass("position-hide")
                    initData(param.parm);
                    return;
                }
                case 2:
                {
                    g_choice = 2;
                    g_condition.Count = 1;
                    break;
                }
                case 3:
                {
                    g_choice = 3;
                    g_condition.Count = 2;
                    break;
                }
                default :
                {
                    g_choice = 1;
                    g_condition.Count = 0;
                }
            }
            $("#datechoice1").removeClass("position-up");
            $("#datechoice1").parent().removeClass("position-hide");

            if(g_anaysize_choice == 1)
            {
                initSimpleSlist();
                return;
            }

            if(g_timelinedata.length)
            {
                initSimpleSlist();
                drawMsg.drawTimeLine();
            }
            else{
                initData();
            }
        });
        $("#datechoice1").on("probechange.probe",function(e, param){
            var daytemp = new Date();
            var daynow = new Date(daytemp.toDateString()) - 0;

            switch (param.value)
            {
                case 0:
                {
                    {
                        StartTime   = param.startTime;
                        EndTime     = param.endTime;
                        if(EndTime > (daytemp - 0))
                        {
                            EndTime = (daytemp - 0);
                        }

                        break;
                    }
                }
                case 1:
                {
                    StartTime   = daynow;
                    EndTime     = daytemp - 0;
                    break;
                }
                case 2:
                {
                    StartTime   = daynow - 8 *24 * 60 * 60 * 1000;
                    EndTime     = daynow;
                    break;
                }
                case 3:
                {
                    StartTime   = daynow  - 31 *24 * 60 * 60 * 1000;
                    EndTime     = daynow;
                    break;
                }
                case 4:
                {
                    StartTime   = daynow - 366 *24 * 60 * 60 * 1000;
                    EndTime     = daynow;
                    break;
                }
            }
            g_condition.StartTime   = StartTime;
            g_condition.EndTime     = EndTime;

            if(g_choice == 0 && g_mac){
                initData(g_mac);
                return;
            }
            initData();
        });

        $("#analysize_choice").on("probechange.probe", function(e, param){
            g_anaysize_choice = ((param.value == 1)?0:1);
            if(g_anaysize_choice)
            {
                $("#probe_line").addClass("hide").empty();
                $("#probe_drawpie").removeClass("hide");
                initCountStatistic();
                initSummaryPie();
            }
            else{
                $("#probe_drawpie").addClass("hide").children().empty();
                $("#probe_line").removeClass("hide");
                initTimeClient();
            }
        });
    }

    function _init()
    {
        dealEvent.init();
        initForm();
        initData();
        optionPush();
    }

    function _destroy()
    {
        nowTime     = new Date();
        StartTime   = new Date(nowTime.toDateString()) - 0;
        EndTime     = nowTime.getTime();
        g_choice    = 1;
        g_mac       = 0;
        g_anaysize_choice = 0;
        g_condition = {ACSN:FrameInfo.ACSN, StartTime:StartTime, EndTime:EndTime,Count:0};
        g_timelinedata  = [];
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        hPending&&hPending.close();
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart","SingleSelect","SList","DateRange"],
        "utils":["Request","Base"],
    });
})( jQuery );

