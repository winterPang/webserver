/**
 * Created by Administrator on 2016/6/17.
 */
(function ($)
{
    var MODULE_NAME = "a_dataanalysis.lingering";

    var g_val = "";
    var g_placeMapdevSN = {};
    var g_devSNMapPlace = {};
    var g_devSNList = {devSNList:[]};
    var g_dataType = {type:"today", startDay:"", endDay:""};
    var g_placeInfo = "所有场所";
    var g_rankType = 0;/*0---top5  1---last 5*/
    var g_rankIndex = 0; /*显示排名指标 0---驻留时长  1---驻留客流*/
    var g_tendencyType = 0;/* 显示趋势指标0---驻留客流量  1--到访客流量 */
    var g_isCompare = 0;
    var g_CompareType = "";

    var oTheme = {
        color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
    };

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("lingering_rc", sRcName);
    }

    //初始化详细信息列表表头
    function initXiangxiList_head()
    {
        var opt_head =
        {
            colNames: ['场景/区域名称', '总驻留客流', '平均驻留时长', '低驻留人数', '中驻留人数', '高驻留人数', '峰值', '峰值时间'],
            showHeader: true,
            multiSelect: false,
            pageSize: 20,
            colModel: [
                {name: "name", datatype: "String", width: 150},
                {name: "lingering_total", datatype: "String"},
                {name: "lingering_time_ave", datatype: "String"},
                {name: "lingering_low_total", datatype: "String"},
                {name: "lingering_middling_total", datatype: "String"},
                {name: "lingering_high_total", datatype: "String"},
                //{name: "lingering_a_total", datatype: "String"},
                {name: "lingering_apex", datatype: "String"},
                {name: "lingering_apex_time", datatype: "String"}
            ]
        };
        $("#lingeringdetail").SList("head", opt_head);
    }

    //获取场所类型以及请求场所数据
    function getPlaceInfo()
    {
        var result = {
            placeType:0,
            requireData:{}
        };
        if(g_placeInfo == "所有场所")
        {
            result.placeType = 0;
            result.requireData = g_devSNList;
        }
        else
        {
            result.placeType = 1;
            var arr = [];
            arr.push({devSN:g_placeMapdevSN[g_placeInfo]});
            result.requireData["devSNList"] = arr;
        }

        return  result;
    }

    //获取驻留分析实时数据
    function getLingeringCurrentData()
    {
        function writeCurrentData(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var current = data.data.current_lingering;
                var compare = data.data.current_lingering_compare;
                var src;
                compare < 0 ? src = "../soon/image/down.png": src = "../soon/image/up.png";
                $("#currentlingering_img").attr("src", src);

                if (current > 999)
                {
                    current = (current/10000).toFixed(2);
                    $("unit_currentlingering").html("万人次 &nbsp;")
                }
                else
                {
                    $("unit_currentlingering").html("人次 &nbsp;")
                }
                $("#currentlingering").html(current);

                compare = Math.abs(compare);
                if (compare > 999)
                {
                    compare = (compare/10000).toFixed(2);
                    $("unit_currentlingeringchange").html("万人次 &nbsp;")
                }
                else
                {
                    $("unit_currentlingeringchange").html("人次 &nbsp;")
                }
                $("#currentlingering_than").html(compare);
            }
        }
        var reqUrl = MyConfig.path + '/data_analysis_read/getcurrentlingeringinfo';
        var placeInfo = getPlaceInfo();
        $.ajax({
            url: reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:writeCurrentData,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    //获取请求url
    function getReqUrl(path)
    {
        var placeInfo = getPlaceInfo();
        var baseUrl = MyConfig.path + '/data_analysis_read/' + path;
        var reqUrl = baseUrl + "?statistics_type=" + g_dataType.type + "&place_type=" + placeInfo.placeType;
        if (g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        return reqUrl;
    }

    //获取驻留分析峰值数据
    function getLingeringApexData()
    {
        function writeApexData(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var current = data.data.lingering_apex;
                var compare = data.data.lingering_apex_compare;
                var src;
                compare < 0 ? src = "../soon/image/down.png": src = "../soon/image/up.png";
                compare = Math.abs(compare);
                $("#reside_top_img").attr("src", src);

                if (current > 999)
                {
                    current = (current/10000).toFixed(2);
                    $("#unit_apex").html("万人次 &nbsp;");
                }
                else
                {
                    $("#unit_apex").html("人次 &nbsp;");
                }
                $("#reside_top_count").html(current);

                if (compare > 999)
                {
                    compare = (compare/10000).toFixed(2);
                    $("#unit_apexchange").html("万人次 &nbsp;");
                }
                else
                {
                    $("#unit_apexchange").html("人次 &nbsp;");
                }
                $("#reside_top_than").html(compare);
            }
        }

        var reqUrl = getReqUrl("getapexdataforlingering");
        var placeInfo = getPlaceInfo();
        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:writeApexData,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    //获取驻留分析基本数据
    function getLingeringBaseData()
    {
        function writeBaseData(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var up ="../soon/image/up.png";
                var down ="../soon/image/down.png";
                var lingering_total = data.data.lingering_total;
                var lingering_total_compare = data.data.lingering_total_compare;
                var lingering_time_ave = data.data.lingering_time_ave;
                var lingering_time_ave_compare = data.data.lingering_time_ave_compare;
                var src_lingering_total;
                var src_lingering_time_ave;
                lingering_total_compare < 0 ? src_lingering_total = down: src_lingering_total = up;
                lingering_time_ave_compare < 0 ? src_lingering_time_ave = down: src_lingering_time_ave = up;
                $("#lingeringtotal_img").attr("src", src_lingering_total);
                $("#lingeringtime_img").attr("src", src_lingering_time_ave);

                if (lingering_total > 999)
                {
                    lingering_total = (lingering_total/10000).toFixed(2);
                    $("#unit_total").html("万人次 &nbsp;");
                }
                else
                {
                    $("#unit_total").html("人次 &nbsp;");
                }
                $("#lingeringtotal").html(lingering_total);

                lingering_total_compare = Math.abs(lingering_total_compare);
                if (lingering_total_compare > 999)
                {
                    lingering_total_compare = (lingering_total_compare/10000).toFixed(2);
                    $("#unit_totalchange").html("万人次 &nbsp;");
                }
                else
                {
                    $("#unit_totalchange").html("人次 &nbsp;");
                }
                $("#lingeringtotal_than").html(lingering_total_compare);

                if(lingering_time_ave >= 60)
                {
                    lingering_time_ave = (lingering_time_ave/60).toFixed(1);
                    $("#unit_averge_reside").html("小时 &nbsp;&nbsp;");
                }
                else
                {
                    $("#unit_averge_reside").html("分钟 &nbsp;&nbsp;");
                }
                $("#lingeringtime").html(lingering_time_ave);

                lingering_time_ave_compare = Math.abs(lingering_time_ave_compare);
                if(lingering_time_ave_compare >= 60)
                {
                    lingering_time_ave_compare = (lingering_time_ave_compare/60).toFixed(1);
                    $("#unit_averge_reside_than").html("小时");
                }
                else
                {
                    $("#unit_averge_reside_than").html("分钟");
                }

                $("#lingeringtime_than").html(lingering_time_ave_compare);

            }
        }

        var reqUrl = MyConfig.path + '/data_analysis_read/getlingeringbaseinfo?statistics_type=' + g_dataType.type;
        if (g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }
        var placeInfo = getPlaceInfo();
        $.ajax({
            url: reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:writeBaseData,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    //获取 驻留客流数据
    function getBaseData()
    {
        getLingeringCurrentData();
        getLingeringApexData();
        getLingeringBaseData();
    }

    //初始化 占比分析 option 平均驻留率
    function initOptLingeringAvgRatio(center, data)
    {
        var option = {
            height: 125,
            tooltip: {
                trigger: 'item',
                formatter: " {b}: {d}%"
            },
            myLegend: {
                scope: "",
                width: "48%",
                height: 70,
                right: "11%",
                top: topChange(80, 31,data.length,8),
            },
            calculable: false,
            series: [
                {
                    type: 'pie',
                    radius: ['30%', '50%'],
                    center: ['27%', '60%'],
                    itemStyle: {
                        normal: {
                            labelLine: {
                                show: false
                            },
                            label: {
                                position: 'center',
                                distance: 8,
                                textStyle: {
                                    color : '#4ec1b2',
                                    fontFamily : '微软雅黑',
                                    fontSize : 14,
                                    fontWeight : 'bolder'
                                },
                                formatter: function(){
                                    return center
                                }
                            }
                        }
                    },
                    data: data
                }
            ]
        };
        return option;
    }

    //平均驻留时长饼图
    function initOptOfLingeringAvgTime(center, data)
    {
        var option = {
            height: 280,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            myLegend: {
                scope: "",
                width: "55%",
                height: 150,
                right: "22%",
                top: topChange(230, 31,data.length,8),
            },
            calculable : false,

            series : [
                {
                    name:'',
                    type:'pie',
                    radius : [30, 60],
                    center : ['50%', "31%"],
                    //roseType : 'area',
                    x: '100%',               // for funnel
                    max: 40,                // for funnel
                    sort : 'ascending',     // for funnel
                    data:data,
                    itemStyle: {
                        normal: {
                            labelLine: {
                                show: false
                            },
                            label: {
                                position: 'center',
                                distance: 8,
                                textStyle: {
                                    color : '#4ec1b2',
                                    fontFamily : '微软雅黑',
                                    fontSize : 14,
                                    fontWeight : 'bolder'
                                },
                                formatter: function(){
                                    return center
                                }
                            }
                        }
                    }
                }
            ]
        };
        return option;
    }

    //平均驻留时长饼状图
    function getPieOfLingeringAvgTime()
    {
        function drawPieOfLingeringAvgTime(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var lingeringAvgTime = [];
                var center = data.data.time_ave;
                if (center >= 60)
                {
                    center = (center/60).toFixed(1) + '小时';
                }
                else
                {
                    center = center + '分钟';
                }
                var obj = data.data.info;
                var number = 0;
                for (var i in obj)
                {
                    lingeringAvgTime.push({name: i, value: obj[i]});
                    number += obj[i];
                }
                if (number == 0)
                {
                    lingeringAvgTime = [];
                }
                var option = initOptOfLingeringAvgTime(center, lingeringAvgTime);
                option.myLegend.scope = "#legend1";
                $("#lingeringavgtime").echart("init", option , oTheme);
            }
        }
        var reqUrl = getReqUrl("getlingeringtimeave");
        var placeInfo = getPlaceInfo();
        $.ajax({
            url: reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:drawPieOfLingeringAvgTime,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    //平均驻留率饼状图
    function getPieOfLingeringAvgRatio()
    {
        function drawPieOfLingeringAvgRatio(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var lingeringAvgRatio = [];
                var center = data.data.lingering_ave + '%';
                var obj = data.data.info;
                var number = 0;
                for (var i in obj)
                {
                    lingeringAvgRatio.push({name: i, value: obj[i]});
                    number += obj[i];
                }
                if (number == 0)
                {
                    lingeringAvgRatio = [];
                }
                var option = initOptLingeringAvgRatio(center, lingeringAvgRatio);
                option.myLegend.scope = "#legend2";
                $("#lingeringavgratio").echart("init", option , oTheme);
            }
        }
        var reqUrl = getReqUrl("getlingeringratioave");
        var placeInfo = getPlaceInfo();
        $.ajax({
            url: reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:drawPieOfLingeringAvgRatio,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    //驻留时长比率饼状图
    function getPieOfLingeringTimeRatio()
    {
        function drawPieOfLingeringTimeRatio(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var lingeringAvgTime = [
                    {value:0, name:"低驻留"},
                    {value:0, name:"中驻留"},
                    {value:0, name:"高驻留"}
                ];
                var center = data.data.lingering_time_ratio + '%';
                var obj = data.data.info;
                lingeringAvgTime[0].value = obj.l;
                lingeringAvgTime[1].value = obj.m;
                lingeringAvgTime[2].value = obj.h;
                var number = obj.l + obj.m + obj.h;
                if (number == 0)
                {
                    lingeringAvgTime = [];
                }

                var option = initOptLingeringAvgRatio(center, lingeringAvgTime);
                option.myLegend.scope = "#legend3";
                $("#lingeringtimeratio").echart("init", option , oTheme);
            }
        }
        var reqUrl = getReqUrl("getlingeringtimeratio");
        var placeInfo = getPlaceInfo();
        $.ajax({
            url: reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:drawPieOfLingeringTimeRatio,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    //获取 饼图所需数据
    function getDataForPie()
    {
        getPieOfLingeringAvgTime();
        getPieOfLingeringAvgRatio();
        getPieOfLingeringTimeRatio();
    }

    /*饼图图例显示在中间*/
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

    //初始化 驻留客流 排名 条形图 option
    function initRankOpt4Lingering(data1, data2)
    {
        var option = {
            height: 250,
            grid: {
                x:60,
                x2:15,
                y:40,
                y2:5
            },
            tooltip : {
                trigger: 'axis'
            },
            calculable : true,
            xAxis : [
                {
                    type : 'value',
                    position: 'top',
                    axisLabel :{
                        interval:0,
                        //rotate:50,
                        //textStyle:{
                        //    //fontFamily: 'KaiTi_GB2312'
                        //}
                    },
                    boundaryGap : [0, 0.01]
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    axisLabel :{
                        formatter:function(val){
                            return  val.length>4 ? val.substring(0, 4) + '\n' + val.substring(4): val
                        },
                        margin:4,
                        //interval:0,
                        //rotate:50,
                        //textStyle:{
                        //    //fontFamily: 'KaiTi_GB2312'
                        //}
                    },
                    data : data1
                }
            ],
            series : [
                {
                    name:'访问量',
                    type:'bar',
                    itemStyle: {normal: {
                        label : {show: true}
                    }},
                    data:data2
                }
            ]
        };
        return option;
    }
    //获取 驻留客流 排名
    function getRankDataOfLingering()
    {
        function drawRankOfLingering(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var dataName = [],
                    dataLingering = [];
                var rank_data = data.rank_data;

                if(rank_data.length != 0)
                {
                    var number = 0;
                    for (var i = 0; i < rank_data.length; i++) {
                        if (g_placeInfo == "所有场所")
                        {
                            dataName.push(g_devSNMapPlace[rank_data[i].name]);
                        }
                        else
                        {
                            dataName.push(rank_data[i].name);
                        }
                        dataLingering.push(rank_data[i].lingering_total);
                    }
                    if (number == 0)
                    {
                        dataLingering = [];
                    }
                }

                var option = initRankOpt4Lingering(dataName, dataLingering);
                var theme = {
                    color: ['#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
                };
                $("#lingeringrank").echart("init", option, theme);
            }
        }
        var reqUrl = getReqUrl("getrankdataforlingering");
        var placeInfo = getPlaceInfo();
        var rankType = "top";
        if (g_rankType == 1)
        {
            rankType = "behind";
        }
        $.ajax({
            url: reqUrl + "&rank_type=" + rankType + "&rank_number=5",
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:drawRankOfLingering,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    //初始化 驻留时长 option
    function initRankOpt4LingeringTime()
    {
        var placeHoledStyle = {
            normal:{
                barBorderColor:'rgba(0,0,0,0)',
                color:'rgba(0,0,0,0)'
            },
            emphasis:{
                barBorderColor:'rgba(0,0,0,0)',
                color:'rgba(0,0,0,0)'
            }
        };
        var dataStyle = {
            normal: {
                label : {
                    show: true,
                    position: 'insideLeft',
                    formatter: '{c}%',
                    textStyle:{
                        color:'#080808'
                    }
                }
            }
        };
        var option = {
            height: 250,
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter : '{b}<br/>{a0}:{c0}%<br/>{a2}:{c2}%<br/>{a4}:{c4}%<br/>{a6}:{c6}分钟'
            },
            legend: {
                y: 20,
                //itemGap : document.getElementById('main').offsetWidth / 8,
                data:[]
            },
            grid: {
                x:60,
                x2:20,
                y: 40,
                y2: 5
            },
            xAxis : [
                {
                    type : 'value',
                    position: 'top',
                    splitLine: {show: false},
                    axisLabel: {show: false}
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    splitLine: {show: false},
                    axisLabel:{
                        formatter:function(val){
                            return  val.length>4 ? val.substring(0, 4) + '\n' + val.substring(4): val
                        },
                        margin:4,
                        //textStyle:{
                            //fontSize: 15
                            //color:"#222",
                            //fontFamily:"宋体"
                        //}
                    },
                    data : []
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    stack: '总量',
                    itemStyle : dataStyle,
                    data:[]
                },
                {
                    name:'',
                    type:'bar',
                    stack: '总量',
                    itemStyle: placeHoledStyle,
                    data:[]
                },
                {
                    name:'',
                    type:'bar',
                    stack: '总量',
                    itemStyle : dataStyle,
                    data:[]
                },
                {
                    name:'',
                    type:'bar',
                    stack: '总量',
                    itemStyle: placeHoledStyle,
                    data:[]
                },
                {
                    name:'',
                    type:'bar',
                    stack: '总量',
                    itemStyle : dataStyle,
                    data:[]
                },
                {
                    name:'',
                    type:'bar',
                    stack: '总量',
                    itemStyle: placeHoledStyle,
                    data:[]
                },
                {
                    name:'',
                    type:'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            label : {
                                show: true,
                                position: 'inside',
                                formatter: '{c}分钟',
                                textStyle:{
                                    color:'#080808'
                                }
                            }
                        }
                    },
                    data:[]
                },
                {
                    name:'',
                    type:'bar',
                    stack: '总量',
                    itemStyle: placeHoledStyle,
                    data:[]
                }
            ]
        };

        return option;
    }

    //获取 驻留时长 排名
    function getRankDataOfLingeringTime()
    {
        function drawRankOfLingeringTime(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var dataName = [];
                var dataLingeringTimeAvg = [];
                var rank_data = data.rank_data;
                var dataLow = [];
                var dataLow_compare = [];
                var dataMiddle = [];
                var dataMiddle_compare = [];
                var dataHigh = [];
                var dataHigh_compare = [];
                if(rank_data.length != 0)
                {

                    var number = 0;
                    for (var i = 0; i < rank_data.length; i++)
                    {
                        if (g_placeInfo == "所有场所")
                        {
                            dataName.push(g_devSNMapPlace[rank_data[i].name]);
                        }
                        else
                        {
                            dataName.push(rank_data[i].name);
                        }
                        var total = 0;
                        total = rank_data[i].lingering_low_total + rank_data[i].lingering_middling_total + rank_data[i].lingering_high_total;
                        var low = Math.round((rank_data[i].lingering_low_total/total)*100) || 0;
                        var middle = Math.round((rank_data[i].lingering_middling_total/total)*100) || 0;
                        var high = Math.round((rank_data[i].lingering_high_total/total)*100) || 0;
                        dataLow.push(low);
                        dataLow_compare.push(100 - low);
                        dataMiddle.push(middle);
                        dataMiddle_compare.push(100- middle);
                        dataHigh.push(high);
                        dataHigh_compare.push(100 - high);

                        number += rank_data[i].lingering_time_ave;
                        dataLingeringTimeAvg.push(rank_data[i].lingering_time_ave);
                    }
                }
                var option = initRankOpt4LingeringTime();
                var lengend = ['低驻留','中驻留','高驻留','平均驻留时长'];
                option.legend.data = lengend;

                if (0 != number)
                {
                    option.yAxis[0].data = dataName;
                    /*var arr = [];
                     var textStyle = {
                     fontSize: 8
                     };
                     for (var i = 0, l = dataName.length; i < l; i++)
                     {
                     var item = {};
                     if (dataName[i].length > 4)
                     {
                     item.value = dataName[i].substring(0, 4) + '\n' + dataName[i].substring(4);
                     item.textStyle = textStyle;
                     }
                     else
                     {
                     item.value = dataName[i];
                     }
                     //dataName[i].length > 4 ? str = dataName[i].substring(0, 4) + '\n' + dataName[i].substring(4) : str = dataName[i];
                     arr.push(item);
                     //dataName[i] = str;
                     }
                     option.yAxis[0].data = arr;*/
                    option.series[0].name = lengend[0];
                    option.series[0].data = dataLow;
                    option.series[1].name = lengend[0];
                    option.series[1].data = dataLow_compare;
                    option.series[2].name = lengend[1];
                    option.series[2].data = dataMiddle;
                    option.series[3].name = lengend[1];
                    option.series[3].data = dataMiddle_compare;
                    option.series[4].name = lengend[2];
                    option.series[4].data = dataHigh;
                    option.series[5].name = lengend[2];
                    option.series[5].data = dataHigh_compare
                    ;
                    option.series[6].name = lengend[3];
                    option.series[6].data = dataLingeringTimeAvg;
                }
                $("#lingeringrank").echart("init", option, oTheme);
            }
        }
        var reqUrl = getReqUrl("getrankdataforlingeringtime");
        var placeInfo = getPlaceInfo();
        var rankType = "top";
        if (g_rankType == 1)
        {
            rankType = "behind";
        }
        $.ajax({
            url: reqUrl + "&rank_type=" + rankType + "&rank_number=5",
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:drawRankOfLingeringTime,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    //获取 排名条形图所需数据
    function getDataForRank()
    {
        if (g_rankIndex == 0)
        {
            getRankDataOfLingeringTime();
        }
        else
        {
            getRankDataOfLingering();
        }
    }

    //获取 详细信息列表数据
    function getLingeringDetailData()
    {
        function drawDetailLingering(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var placeInfo = getPlaceInfo();
                var detailArray = data.detailInfo;
                if(placeInfo.placeType == 0)
                {
                    for(var i = 0; i < detailArray.length; i++)
                    {
                        var devSN = detailArray[i]['devSN'];
                        detailArray[i]['name'] = g_devSNMapPlace[devSN];
                    }
                }
                else
                {
                    for(var i = 0; i < detailArray.length; i++)
                    {
                        detailArray[i]['name'] = detailArray[i]['areaName'];
                    }
                }
                $("#lingeringdetail").SList("refresh", detailArray);

            }
        }
        var reqUrl = getReqUrl("getlingeringdetailinfo");
        var placeInfo = getPlaceInfo();
        $.ajax({
            url: reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:drawDetailLingering,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    //初始化 趋势分析 option
    function initTendencyOpt(date, data, maxName)
    {
        var option = {
            height: 250,
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[]
            },
            grid:{
                x:45,
                y:25,
                x2:25,
                y2:60
            },
            //grid: {
            //    left: '3%',
            //    right: '4%',
            //    bottom: '3%',
            //    containLabel: true
            //},
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : date
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'',
                    type:'line',
                    //stack: '总量',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    markPoint:
                    {
                        data:
                            [
                                {type:'max', name:maxName}
                            ]
                    },
                    areaStyle: {normal: {}},
                    data:data
                }
            ]
        };
        return option;
    }

    function displaySingleTendency(x_data, title_legend, title_seriesName, y_data, maxName)
    {
        var option = initTendencyOpt(x_data, y_data, maxName);
        option.legend.data = [title_legend];
        option.series[0].name = title_seriesName;

        var dataZoom = {
            show : true,
            realtime : true,
            start : 0,
            end : 100
        };
        if (g_dataType.type == "today")
        {
            option.dataZoom = dataZoom;
        }
        var Color = {
            color: ['#4ec1b2']
        };

        $("#tendency").echart("init", option, Color);
    }

    function displayDoubleTendency(x_data, y1_data, y2_data, compare_date, maxName)
    {
        var option = initTendencyOpt(x_data, y1_data, maxName);
        var today = new Date().toLocaleDateString();
        option.series[0].name = today;
        option.legend.data = [today, compare_date];
        var ser = {
            name:compare_date,
            type:'line',
            //stack: '总量',
            smooth:true,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            markPoint:
            {
                data:
                    [
                        {type:'max', name:maxName}
                    ]
            },
            areaStyle: {normal: {}},
            data:y2_data
        };

        option.series.push(ser);
        var dataZoom = {
            show : true,
            realtime : true,
            start : 0,
            end : 100
        };
        if (g_dataType.type == "today")
        {
            option.dataZoom = dataZoom;
        }
        var Color = {
            color: ['#4ec1b2', '#C0C0C0']
        };

        $("#tendency").echart("init", option, Color);
    }

    //获取 驻留客流 趋势 数据
    function getTendencyData()
    {
        function drawTendency(data)
        {
            if (data.errInfo)
            {
                Frame.Msg.error(data.errInfo);
            }
            else
            {
                var tendency = data.tendency;
                var tendency_compare = data.tendency_compare;
                var maxName = "驻留客流峰值";
                var title_legend = "";
                var title_seriesName = "驻留客流数";
                var time = [];
                var data_y = [];
                var data_compare = [];
                var compareDate;

                if(g_tendencyType != 0)
                {
                    maxName = "到访客流峰值";
                    title_seriesName = "到访客流数";
                }

                if(g_isCompare == 0)
                {
                    for(var s in tendency)
                    {
                        time.push(s);
                        data_y.push(tendency[s]);
                    }

                    if(g_dataType.type == "today")
                    {
                        title_legend = "今日";
                    }
                    else
                    {
                        title_legend =  time[0] + " ~ " + time[time.length-1];
                    }
                    displaySingleTendency(time, title_legend, title_seriesName, data_y, maxName);
                }
                else
                {
                    for(var s in tendency)
                    {
                        time.push(s);
                        data_y.push(tendency[s]);
                    }

                    for(var k in tendency_compare)
                    {
                        if(k != "compareDate")
                        {
                            data_compare.push(tendency_compare[k]);
                        }
                        else
                        {
                            compareDate = tendency_compare[k];
                        }
                    }

                    displayDoubleTendency(time, data_y, data_compare, compareDate, maxName);
                }
            }
        }

        function drawSingleTendency(data)
        {
            if(data.errInfo == null)
            {
                var tendency = data.tendency;
                var maxName = "驻留客流峰值";
                var title_legend = "";
                var title_seriesName = "驻留客流数";
                var time = [];
                var data_y = [];

                if(g_tendencyType != 0)
                {
                    maxName = "到访客流峰值";
                    title_seriesName = "到访客流数";
                }

                for(var s in tendency)
                {
                    time.push(s);
                    data_y.push(tendency[s]);
                }

                if(g_dataType.type == "today")
                {
                    title_legend = "今日";
                }
                else
                {
                    title_legend =  time[0] + " ~ " + time[time.length-1];
                }

                displaySingleTendency(time, title_legend, title_seriesName, data_y, maxName);
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        var reqUrl = MyConfig.path + '/data_analysis_read/gettendencydataforlingering';
        if(g_tendencyType != 0)
        {
            reqUrl = MyConfig.path + '/data_analysis_read/gettendencydataforvisitors';
        }
        var callback;
        var placeInfo = getPlaceInfo();
        reqUrl += "?statistics_type=" + g_dataType.type;
        if(g_dataType.type == "today")
        {
            reqUrl += "&isCompare=" + g_isCompare + "&compare_type=" + g_CompareType;
            $("#cycle_than").removeClass('hide');
            callback = drawTendency;
        }
        else{
            $("#cycle_than").addClass('hide');
            callback = drawSingleTendency;
        }

        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:callback,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });

    }

    //初始化数据
    function initData()
    {

        //获取 实时驻留客流 驻留客流峰值 总驻留客流 平均驻留时长
        getBaseData();

        //获取画echart图所需数据

        //画平均驻留时长饼图 画驻留率 驻留时长比率饼图
        getDataForPie();

        //获取 平均驻留时长排名分析数据 驻留客流排名分析数据
        getDataForRank();

        //获取 驻留客流趋势分析数据
        getTendencyData();

        //获取 详细信息数据
        getLingeringDetailData();

    }

    //场景选择事件
    function changeChangshuo()
    {
        g_placeInfo = $("#changshuoselect").val();
        initData();
    }


    //选择 维度
    function selectRankIndex()
    {
        g_rankIndex = $(this).val();

        getDataForRank();

    }

    //选择 前五 后五
    function selectRankType()
    {
        g_rankType = $(this).val();

        getDataForRank();
    }


    function initSingleSelect()
    {
        function showPlaceList(data)
        {
            g_devSNList.devSNList = [];
            var btn_loupan = ["所有场所"];
            var devSNList = data.devSNList;
            for(var i = 0; i < devSNList.length; i++)
            {
                btn_loupan.push(devSNList[i].placeName);
                g_placeMapdevSN[devSNList[i].placeName] = devSNList[i].devSN;
                g_devSNMapPlace[devSNList[i].devSN] = devSNList[i].placeName;
                g_devSNList.devSNList.push({devSN:devSNList[i].devSN});
            }

            $("#changshuoselect").singleSelect("InitData", btn_loupan);

            g_placeInfo = $("#changshuoselect").val();

            initData();
        }

        $.ajax({
            url:MyConfig.path +'/data_analysis_read/getdevsn',
            type:'get',
            dataType:'json',
            success:showPlaceList,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function selectTendencyIndex()
    {
        g_tendencyType = $(this).val();

        getTendencyData();
    }

    function selectTendencyCompare()
    {
        var val_than = $(this).val();

        if( val_than == g_val)
        {
            g_val = "";
            g_isCompare = 0;
        }
        else
        {
            g_val = val_than;
            g_isCompare = 1;
        }

        switch(g_val)
        {
            case "0":
            {
                $("#week_same_than, #month_same_than").next().removeClass('checked');
                g_CompareType = "yesterday";
                break;
            }
            case "1":
            {
                $("#yesterday_than, #month_same_than").next().removeClass('checked');
                g_CompareType = "weekAgo";
                break;
            }
            case "2":
            {
                $("#yesterday_than, #week_same_than").next().removeClass('checked');
                g_CompareType = "monthAgo";
                break;
            }
            case "":
            {
                $("#yesterday_than, #week_same_than, #month_same_than").next().removeClass('checked');
                g_CompareType = "";
                break;
            }
            default:{
                break;
            }
        }
        getTendencyData();
    }

    //初始化 事件
    function initForm()
    {

        $(".cancel-actions", "#tabContent").on("click",function(){
            $(this).parent().toggleClass("hide");
        });

        $("#changshuoselect").change(changeChangshuo);

        $("#daterange").on("inputchange.datarange", function(){
            var orange = $(this).daterange("getRangeData");
            $("#cycle_date").text("（" + orange.startData + "-" + orange.endData + "）");

            g_dataType.startDay = orange.startData;
            g_dataType.endDay = orange.endData;
            g_dataType.type = "custom";
            initData();

        });

        $(".box-footer #calendar").on("click", function(){
            $(".top-box").toggleClass("hide");
        });

        $("#refresh").on("click", function(){
            initData();
        });

        $("#lingertime, #lingercount").on("click", selectRankIndex);
        $("#paiming_qianwu, #paiming_houwu").on("click", selectRankType);
        $("#zlkll, #dfkll").on("click", selectTendencyIndex);
        $("#yesterday_than, #week_same_than, #month_same_than").on("click", selectTendencyCompare);

        $("#WT1, #WT2, #WT3, #WT4, #WT5").click(function(){
            g_dataType.type = $(this).val();
            var dataTypeMap = {"today":0, "oneWeek":1, "oneMonth":2, "oneYear":3};
            if(g_dataType.type != "custom")
            {
                $("#cycle_date").text(getRcText("DATE_CYCLE").split(",")[dataTypeMap[g_dataType.type]]);
                $("#daterange").addClass('hide');
                initData();
            }
            else
            {
                $("#daterange").removeClass('hide');
            }
        });
    }

    function initSList_head()
    {
        //初始化 详细信息列表 表头
        initXiangxiList_head();
    }

    /*设置日历背景图的日期*/
    function setCalendarDate()
    {

        var todayDate = new Date().getDate();

        if(9 >= todayDate) {
            $(".set-background").css("padding-left", "24px");
        }
        else {
            $(".set-background").css("padding-left", "20px");
        }
        $("#calendar").html(todayDate);
    }

    function _init()
    {
        initSList_head();
        setCalendarDate();
        initSingleSelect();
        initForm();

        g_placeInfo = $("#changshuoselect").val();
    }

    function _destroy()
    {

    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Form", "Echart", "SList", "Minput", "SingleSelect", "DateRange", "DateTime"],
        "utils": ["Base"]
    });
}) (jQuery);