/**
 * Created by Administrator on 2016/6/17.
 */
(function ($)
{
    var MODULE_NAME = "a_dataanalysis.flowtotal";

    var g_placeMapdevSN = {};
    var g_devSNMapPlace = {};
    var g_devSNList = {devSNList:[]};
    var g_dataType = {type:"today", startDay:"", endDay:""};
    var g_dataTypeMap = {"today":0, "oneWeek":1, "oneMonth":2, "oneYear":3};
    var g_placeInfo = "所有场所";
    var g_paimingWeidu = 0;/*0--总客流量  1---到访客流量*/
    var g_paimingType = 0;/*0---top5  1---last 5*/
    var g_tendency_type = 0;
    var g_isCompare = 0;
    var g_CompareType = "";

    var g_val = "";
    var up = "../soon/image/up.png",
        down = "../soon/image/down.png",
        help = "../soon/imgage/help.png";
    var oTheme = {
        color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
    };

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("flowtotal_rc", sRcName);
    }

    //初始化 排名分析 option
    function initRankOpt(data1, data2, name)
    {
        var option = {
            height: 230,
            tooltip : {
                trigger: 'axis'
            },
            grid:{
                x:65,
                x2:25,
                y:40,
                y2:5
            },
            calculable : false,
            xAxis : [
                {
                    type : 'value',
                    axisLabel :{
                        interval:0
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
                        margin:4
                    },
                    data : data1
                }
            ],
            series : [
                {
                    name:name,
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

    function drawRank(data1, data2, name)
    {
        $("#rank_total_help").attr("title", "指定场所指定日期内顾客总人次");
        $("#rank_into_shop_help").attr("title", "指定场所指定日期内到访顾客人次");
        var opt = initRankOpt(data1, data2, name);
        var oTheme = {
            color: ['#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        $("#total_rank_analysis").echart("init", opt, oTheme);
    }

    //初始化 趋势分析 option
    function initTrendOpt(data, data1, data2, maxName)
    {
        var option = {
            height:250,
            title : {
                text: ''
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[]
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : data
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
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data1,
                    markPoint:
                    {
                        data:
                            [
                                {type:'max', name:maxName}
                            ]
                    }
                },
                {
                    name:'',
                    type:'line',
                    smooth:true,
                    data:data2,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    markPoint:
                    {
                        data:
                            [
                                {type:'max', name:maxName}
                            ]
                    }
                }
            ]
        };

        return option;
    }

    //单条折线图
    function initSingleTrendOpt(data, data1, maxName)
    {
        var option = {
            height:250,
            title : {
                text: ''
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[]
            },
            grid:{
                y:25,
                y2:60
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : data
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
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data1,
                    markPoint:
                    {
                        data:
                            [
                                {type:'max', name:maxName}
                            ]
                    }
                }
            ]
        };

        return option;
    }

    function setRateOpt(ave, aData, aPieId)
    {
        var option = {
            height: 250,
            tooltip: {
                trigger: 'item',
                formatter: " {b}: {c}({d}%)"
            },
            myLegend: {
                scope: aPieId[0],
                width: "54%",
                height: "50%",
                right: "-1%",
                top: "40%"
            },
            calculable: false,
            series: [
                {
                    type: 'pie',
                    radius: ['25%', '48%'],
                    center: ['25%', '55%'],
                    itemStyle: {
                        normal: {
                            labelLine: {
                                show: false
                            },
                            label: {
                                show: true,
                                position: 'center',
                                distance: 8,
                                textStyle: {
                                    color : '#4ec1b2',
                                    fontFamily : '微软雅黑',
                                    fontSize : 16,
                                    fontWeight : 'bolder'
                                },
                                formatter: function(){
                                    return ave
                                }
                            }
                        }
                    },
                    data: aData
                }
            ]
        };

        $(aPieId[1]).echart("init", option, oTheme);
    }

    function displaySingleTendency(x_data, title_legend, title_seriesName, y_data, maxName)
    {
        var option = initSingleTrendOpt(x_data, y_data, maxName);
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

        $("#trend_analysis").echart("init", option, Color);
    }

    function displayDoubleTendency(X_data, y1_data, y2_data, compare_data, maxName)
    {
        var option = initTrendOpt(X_data, y1_data, y2_data, maxName);
        var today = new Date().toLocaleDateString();
        option.series[0].name = today;
        option.series[1].name = compare_data;
        option.legend.data = [today, compare_data];
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

        $("#trend_analysis").echart("init", option, Color);
    }

    function drawRateDaofang(ave, data)
    {
        var aPieId = ["#into_shop_rate_message", "#into_shop_rate"];
        setRateOpt(ave, data, aPieId);
    }

    function drawRateLishiDaofang(ave, data)
    {

        var aPieId = ["#average_into_many_message", "#average_into_many"];
        setRateOpt(ave, data, aPieId);
    }

    //选择 维度
    function SelectType()
    {
        g_paimingWeidu = $(this).val();

        showPaiMingFenXi();

    }

    //选择 前五 后五
    function SelectTypeRank()
    {
        g_paimingType = $(this).val();

        showPaiMingFenXi();
    }

    //选择统计指标 总客流量、到访客流量
    function SelectTypeLine()
    {
        g_tendency_type = $(this).val();

        showQuShiFenXi();
    }

    //选择对比周期
    function SelectThan()
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

        showQuShiFenXi();
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

    function showFlowTotalInfo()
    {
        function displayFlowBasicInfo(data)
        {
            if(data.errInfo == null)
            {
                var flowbaseinfo = data.flowbaseinfo;
                var cur_total_visitors = flowbaseinfo.cur_total_visitors;
                if(cur_total_visitors >= 1000)
                {
                    cur_total_visitors = Number(cur_total_visitors/10000).toFixed(1);
                    $("#unit_into_shop").html("万人次");
                }
                else
                {
                    $("#unit_into_shop").html("人次");
                }
                $("#into_shop_count").html(cur_total_visitors);

                var cur_total_visitors_compare = Math.abs(flowbaseinfo.cur_total_visitors_compare);
                if(cur_total_visitors_compare >= 1000)
                {
                    cur_total_visitors_compare = Number(cur_total_visitors_compare/10000).toFixed(1);
                    $("#unit_into_shop_than").html("万人次");
                }
                else
                {
                    $("#unit_into_shop_than").html("人次");
                }
                $("#into_shop_count_than").html(cur_total_visitors_compare);
                if(flowbaseinfo.cur_total_visitors_compare < 0)
                {
                    $("#into_shop_count_img").attr("src", down);
                }
                else
                {
                    $("#into_shop_count_img").attr("src", up);
                }

                var passengers_total = flowbaseinfo.passengers_total;
                if(passengers_total >= 1000)
                {
                    passengers_total = Number(passengers_total/10000).toFixed(1);
                    $("#unit_total_traffic").html("万人次");
                }
                else
                {
                    $("#unit_total_traffic").html("人次");
                }
                $("#total_traffic_count").html(passengers_total);

                var passengers_total_compare = Math.abs(flowbaseinfo.passengers_total);
                if(passengers_total_compare >= 1000)
                {
                    passengers_total_compare = Number(passengers_total_compare/10000).toFixed(1);
                    $("#unit_total_traffic_than").html("万人次");
                }
                else
                {
                    $("#unit_total_traffic_than").html("人次");
                }
                $("#total_traffic_count_than").html(passengers_total_compare);
                if(flowbaseinfo.passengers_total_compare < 0)
                {
                    $("#total_traffic_count_img").attr("src", down);
                }
                else
                {
                    $("#total_traffic_count_img").attr("src", up);
                }

                var visitors_number = flowbaseinfo.visitors_number;
                if(visitors_number >= 1000)
                {
                    visitors_number = Number(visitors_number/10000).toFixed(1);
                    $("#unit_average_into").html("万次");
                }
                else
                {
                    visitors_number = visitors_number.toFixed(1);
                    $("#unit_average_into").html("次");
                }
                $("#average_into_count").html(visitors_number);

                var visitors_number_compare = Math.abs(flowbaseinfo.visitors_number_compare);
                if(visitors_number_compare >= 1000)
                {
                    visitors_number_compare = Number(visitors_number_compare/10000).toFixed(1);
                    $("#unit_average_into_than").html("万次");
                }
                else
                {
                    visitors_number_compare = Number(visitors_number_compare).toFixed(1);
                    $("#unit_average_into_than").html("次");
                }
                $("#averge_into_count_than").html(visitors_number_compare);
                if(flowbaseinfo.visitors_number_compare < 0)
                {
                    $("#average_into_count_img").attr("src", down);
                }
                else
                {
                    $("#average_into_count_img").attr("src", up);
                }
            }
            else{
                Frame.Msg.error(data.errInfo);
            }
        }



        function displayCurrentFlowInfo(data)
        {
            if(data.errInfo == null)
            {
                var current_visitors_med = data.current_visitors;
                var current_visitors = current_visitors_med.current_visitors;
                if(current_visitors >= 1000)
                {
                    current_visitors = Number(current_visitors/10000).toFixed(1);
                    $("#unit_current_traffic").html("万人次");
                }
                else
                {
                    $("#unit_current_traffic").html("人次");
                }
                $("#current_traffic_count").html(current_visitors);

                var current_visitors_compare = Math.abs(current_visitors_med.current_visitors_compare);
                if(current_visitors_compare >= 1000)
                {
                    current_visitors_compare = Number(current_visitors_compare/10000).toFixed(1);
                    $("#unit_current_traffic_than").html("万人次");
                }
                else
                {
                    $("#unit_current_traffic_than").html("人次");
                }
                $("#current_traffic_count_than").html(current_visitors_compare);
                if(current_visitors.current_visitors_compare < 0)
                {
                    $("#current_traffic_count_img").attr("src", down);
                }
                else
                {
                    $("#current_traffic_count_img").attr("src", up);
                }
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        function displayFlowApexInfo(data)
        {
            if(data.errInfo == null)
            {
                var visitors_apex_med = data.visitors_apex;
                var visitors_apex = visitors_apex_med.visitors_apex;
                if(visitors_apex >= 1000)
                {
                    visitors_apex = Number(visitors_apex/10000).toFixed(1);
                    $("#unit_into_shop_top").html("万人次");
                }
                else
                {
                    $("#unit_into_shop_top").html("人次");
                }
                $("#into_shop_top").html(visitors_apex);

                var visitors_apex_compare = Math.abs(visitors_apex_med.visitors_apex_compare);
                if(visitors_apex_compare >= 1000)
                {
                    visitors_apex_compare = Number(visitors_apex_compare/10000).toFixed(1);
                    $("#unit_into_shop_top_than").html("万人次");
                }
                else
                {
                    $("#unit_into_shop_top_than").html("人次");
                }
                $("#into_shop_top_than").html(visitors_apex_compare);
                if(visitors_apex_med.visitors_apex_compare < 0)
                {
                    $("#into_shop_top_img").attr("src", down);
                }
                else
                {
                    $("#into_shop_top_img").attr("src", up);
                }
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/getflowbaseinfo?';
        var urlCurDataPreFix = MyConfig.path + '/data_analysis_read/getcurrentflowbaseinfo?';
        var urlApexPrefix = MyConfig.path + '/data_analysis_read/getbasevisitorsapex?';
        var reqUrl;

        placeInfo = getPlaceInfo();

        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        urlApexPrefix += "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
            urlCurDataPreFix += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
            urlApexPrefix += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displayFlowBasicInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });


        $.ajax({
            url:urlCurDataPreFix,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displayCurrentFlowInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });


        $.ajax({
            url:urlApexPrefix,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displayFlowApexInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function showPingJunDaoFangLv()
    {
        function displacePingJunDaoFangLv(data)
        {
            if(data.errInfo == null)
            {
                var visit_ratio;
                var visit_ratio_ave = Number(data.visit_ratio_ave*100).toFixed(1) +'%';
                if((data.visit_ratio[0].value == 0) && (data.visit_ratio[1].value == 0) && (data.visit_ratio[2].value == 0))
                {
                    visit_ratio = [];
                    $("#into_shop_rate_message").addClass("hide");
                }
                else
                {
                    visit_ratio = data.visit_ratio;
                    $("#into_shop_rate_message").removeClass("hide");
                }

                drawRateDaofang(visit_ratio_ave, visit_ratio);
            }
            else{

                Frame.Msg.error(data.errInfo);
            }
        }

        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/getvisitratioforflow?';
        var reqUrl;

        placeInfo = getPlaceInfo();
        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type + "&place_type=" + placeInfo.placeType;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displacePingJunDaoFangLv,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });

    }

    function showPingJunDaoFangCiShu()
    {
        function displacePingJunDaoCiShu(data)
        {
            if(data.errInfo == null)
            {
                var visit_number;
                var visit_number_ave = Number(data.visit_number_ave).toFixed(1) + '次';
                if((data.visit_number[0].value == 0) && (data.visit_number[1].value == 0) && (data.visit_number[2].value == 0))
                {
                    visit_number = [];
                    $("#average_into_many_message").addClass("hide");
                }
                else
                {
                    visit_number = data.visit_number;
                    $("#average_into_many_message").removeClass("hide");
                }

                drawRateLishiDaofang(visit_number_ave, visit_number);
            }
            else{

                Frame.Msg.error(data.errInfo);
            }
        }

        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/getvisitnumberforflow?';
        var reqUrl;

        placeInfo = getPlaceInfo();
        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type + "&place_type=" + placeInfo.placeType;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displacePingJunDaoCiShu,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function showPaiMingFenXi()
    {
        function displayPaiMingXinXi(data)
        {
            if(data.errInfo == null)
            {
                var rankData;
                var name;
                if(g_paimingWeidu == 0)
                {
                    rankData = data.passengers_rank;
                    name = "总客流";
                }
                else
                {
                    rankData = data.visitors_rank;
                    name = "到访客流";
                }

                if(g_placeInfo == "所有场所")
                {
                    var nameDataArr = [];
                    for(var i = 0; i < rankData.data_name.length; i ++)
                    {
                        nameDataArr.push(g_devSNMapPlace[rankData.data_name[i]]);
                    }
                    drawRank(nameDataArr, rankData.data_value, name);
                }
                else
                {
                    drawRank(rankData.data_name, rankData.data_value, name);
                }

            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        var placeInfo;
        var urlPrefix;
        var reqUrl;
        var paimingType = "top";
        if (g_paimingWeidu == 0) {
            urlPrefix = MyConfig.path + '/data_analysis_read/getpassengersrank?';
        }
        else {
            urlPrefix = MyConfig.path + '/data_analysis_read/getvisitorsrank?';
        }

        if (g_paimingType == 1)
        {
            paimingType = "last";
        }

        placeInfo = getPlaceInfo();
        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type +
            "&place_type=" + placeInfo.placeType + "&rank_type=" +paimingType + "&rank_number="+"5";
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displayPaiMingXinXi,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function showXiangXiXinXi()
    {
        function displayXiangXiXinXi(data)
        {
            if(data.errInfo == null)
            {
                var data_List = data.data_List;

                if(g_placeInfo == "所有场所")
                {
                    for(var i = 0; i < data_List.length; i++)
                    {
                        var devSN = data_List[i]['name'];
                        data_List[i]['name'] = g_devSNMapPlace[devSN];
                    }
                }

                $("#detail_statics_list").SList("refresh", data_List);
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/getflowdetaildata?';
        var reqUrl;

        placeInfo = getPlaceInfo();
        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type + "&place_type=" + placeInfo.placeType;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displayXiangXiXinXi,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function showQuShiFenXi()
    {
        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/getpassengerstrend?';
        var reqUrl;
        var callback;

        function displayQushiInfo(data)
        {
            if(data.errInfo == null)
            {
                var tendency = data.tendency;
                var tendency_compare = data.tendency_compare;
                var maxName = "总客流峰值";
                var title_legend = "";
                var title_seriesName = "总客流量";
                var time = [];
                var data_y = [];
                var data_compare = [];
                var compareDate;

                if(g_tendency_type != 0)
                {
                    maxName = "到访客流峰值";
                    title_seriesName = "到访客流量";
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
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        function displaySingleQuShiInfo(data)
        {
            if(data.errInfo == null)
            {
                var tendency = data.tendency;
                var maxName = "总客流峰值";
                var title_legend = "";
                var title_seriesName = "总客流量";
                var time = [];
                var data_y = [];

                if(g_tendency_type != 0)
                {
                    maxName = "到访客流峰值";
                    title_seriesName = "到访客流量";
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

        if(g_tendency_type != 0)
        {
            urlPrefix = MyConfig.path +'/data_analysis_read/getvisitorstrend?';
        }

        placeInfo = getPlaceInfo();
        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "today")
        {
            reqUrl += "&isNeedCompare=" + g_isCompare + "&compare_type=" + g_CompareType;
            $("#cycle_than").removeClass('hide');
            callback = displayQushiInfo;
        }
        else{
            $("#cycle_than").addClass('hide');
            callback = displaySingleQuShiInfo;
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

    function initData()
    {
        showFlowTotalInfo();
        showPingJunDaoFangLv();
        showPingJunDaoFangCiShu();
        showPaiMingFenXi();
        showXiangXiXinXi();
        showQuShiFenXi();
    }

    function setCalendarDate()
    {
        /*设置日历背景图的日期*/
        var todayDate = new Date().getDate();

        if(9 >= todayDate) {
            $(".set-background").css("padding-left", "24px");
        }
        else {
            $(".set-background").css("padding-left", "20px");
        }
        $("#calendar").html(todayDate);

    }

    //初始化选择按钮
    function initSelectBtn()
    {
        function showPlaceList(data)
        {
            g_devSNList.devSNList = [];
            var btn_changsuo = ["所有场所"];
            var devSNList = data.devSNList;
            for(var i = 0; i < devSNList.length; i++)
            {
                btn_changsuo.push(devSNList[i].placeName);
                g_placeMapdevSN[devSNList[i].placeName] = devSNList[i].devSN;//某个场所所有场地名
                g_devSNMapPlace[devSNList[i].devSN] = devSNList[i].placeName;//各个场所名
                g_devSNList.devSNList.push({devSN:devSNList[i].devSN});
            }

            $("#changshuoselect").singleSelect("InitData", btn_changsuo);

            g_placeInfo = $("#changshuoselect").val();
            g_dataType.type = $("#WT1, #WT2, #WT3, #WT4, #WT5").val();

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

    function initGrid()
    {
        var opt_head = {
            colNames: ['场景/区域名称', '总客流量','总客流占比', '到访客流量', '到访率', '到访客流峰值','峰值时间', '平均到访次数', '历史平均到访次数'],
            showHeader: true,
            multiSelect: false,
            pageSize: 20,
            colModel: [
                {name: "name", datatype: "String", width: 140},
                {name: "passengers_total", datatype: "String", width: 90},
                {name:"passengers_ratio", datatype:"String", width: 104},
                {name: "visitors_total", datatype: "String", width: 104},
                {name: "visitors_ratio", datatype: "String", width: 90},
                {name: "visitors_apex", datatype: "String", width: 115.5},
                {name:"visitors_apex_time", datatype:"String", width: 90},
                {name: "visitors_times_avg", datatype: "String", width: 116.5},
                {name: "history_visitors_times_avg", datatype: "String", width: 140.5}
            ]
        };
        $("#detail_statics_list").SList("head", opt_head);
    }

    function changeChangShuo()
    {
        g_placeInfo = $("#changshuoselect").val();
        initData();
    }

    function initForm()
    {
        /*初始化场所选择按钮*/
        initSelectBtn();
        /*点击刷新页面事件*/
        $("#refresh_flow").on("click", changeChangShuo);

        /*选择周期事件*/
        $("#WT1, #WT2, #WT3, #WT4, #WT5").click(function(){
            g_dataType.type = $(this).val();
            if(g_dataType.type != "custom")
            {
                $("#cycle_date").text(getRcText("DATE_CYCLE").split(",")[g_dataTypeMap[g_dataType.type]]);
                $("#daterange").addClass('hide');

                initData();
            }
            else
            {
                $("#daterange").removeClass('hide');
            }
        });

        /*自定义周期的选择事件*/
        $("#daterange").on("inputchange.datarange", function(){
            var orange = $(this).daterange("getRangeData");

            $("#cycle_date").text("（" + orange.startData + "-" + orange.endData + "）");
            g_dataType.startDay = orange.startData;
            g_dataType.endDay = orange.endData;
            g_dataType.type = "custom";
            initData();
        });

        /*周期上下滑动事件*/
        $("#calendar").on("click", function(){
            $(".top-box").slideToggle(100);
        });

        /*场所选择事件*/
        $("#changshuoselect").change(changeChangShuo);

        /*选择排名事件*/
        $("#total_traffic_rank, #into_shop_rank").on("click", SelectType);

        /*选择前后排名事件*/
        $("#rank_top5, #rank_bottom5").on("click", SelectTypeRank);

        /*选择以总客流量或到访客流量事件*/
        $("#total_traffic_line, #into_shop_line").on("click", SelectTypeLine);

        /*选择与当天周期对比事件*/
        $("#yesterday_than, #week_same_than, #month_same_than").on("click", SelectThan);

    }

    function _init()
    {
        setCalendarDate();
        initGrid();
        initForm();
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
        "widgets": ["Echart","SList", "SingleSelect", "DateRange", "DateTime","Minput"],
        "utils": ["Base"]
    });
}) (jQuery);