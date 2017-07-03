/**
 * Created by Administrator on 2016/6/17.
 */
(function ($)
{
    var MODULE_NAME = "a_dataanalysis.upcustomers";

    var g_val = "";
    var g_placeMapdevSN = {};
    var g_devSNMapPlace = {};
    var g_devSNList = {devSNList:[]};
    var g_dataType = {type:"today", startDay:"", endDay:""};
    var g_dataTypeMap = {"today":0, "oneWeek":1, "oneMonth":2, "oneYear":3};
    var g_placeInfo = "所有场所";
    var g_isCompare = 0;
    var g_CompareType = "";
    var g_paimingWeidu = 0;/*0---新增顾客  1---wifi连接*/
    var g_paimingType = 0;/*0---top5  1---last 5*/
    var g_tendency_zhibiao = 0;/* 显示趋势指标0---顾客数  1--wifi连接数 */

    var oTheme = {
        color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
    };

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("upcustomers_rc", sRcName);
    }

    //新顾客比率饼状图
    function displayXinGuKeBiLv(data)
    {
        var aPieId = ["#legend1", "#new_customers_rate"];
        initZhanbiOpt(data, aPieId);
    }

    //wifi使用比率饼状图
    function displayWiFiShiYongBiLv(data)
    {
        var aPieId = ["#legend2", "#wifi_use_rate"];
        initZhanbiOpt(data, aPieId);
    }

    //单条折线图
    function initSingleTrendOpt(x_data, y_data, maxName)
    {
        var option = {
            height:250,
            title : {
                text: ''
            },
            grid:{
                x:45,
                y:25,
                x2:25,
                y2:60
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
                    data : x_data
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
                    data:y_data,
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

    //初始化 趋势分析 option
    function initTrendOpt(x_data, y1_data, y2_data, maxName)
    {
        var option = {
            height:250,
            title : {
                text: ''
            },
            grid:{
                x:45,
                y:25,
                x2:25,
                y2:60
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
                    data : x_data
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
                    data:y1_data,
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
                    data:y2_data,
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

    function displayPaimingXinxi(data1, data2)
    {
        var option = initPaimingOpt(data1, data2);
        var oTheme = {
            color: ['#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        $("#new_customers_rank").echart("init", option, oTheme);
    }

    //初始化 排名分析 option
    function initPaimingOpt(data1, data2)
    {
        var option = {
            height: 230,
            tooltip : {
                trigger: 'axis'
            },
            grid:{
                x:60,
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
                        margin:4,

                        //interval:0
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

    //初始化 占比分析 option
    function initZhanbiOpt(adata, aPieId)
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
                right: "-3%",
                top: "45%"
            },
            calculable: false,
            series: [
                {
                    type: 'pie',
                    radius: ['25%', '48%'],
                    center: ['25%', '57%'],
                    itemStyle: {
                        normal: {
                            labelLine: {
                                show: false
                            },
                            label: {
                                position:"inner",
                                formatter: function(a){
                                    return"";
                                }
                            }
                        }
                    },
                    data: adata
                }
            ]
        };

        $(aPieId[1]).echart("init", option, oTheme);
    }

    //选择 维度
    function SelectType()
    {
        g_paimingWeidu = $(this).val();

        showPaimingInfo();
    }

    //选择 前五 后五
    function SelectTypePaiming()
    {
        g_paimingType = $(this).val();

        showPaimingInfo();
    }

    //选择统计指标 实时顾客数、WiFi连接数
    function SelectTypeLine()
    {
        g_tendency_zhibiao = $(this).val();

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

    //初始化场所选择按钮
    function initSelectBtn()
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

    //显示排名信息
    function showPaimingInfo()
    {
        var placeInfo;
        var urlPrefix;
        var reqUrl;
        var paimingType = "top";
        if (g_paimingWeidu == 0) {
            urlPrefix = MyConfig.path + '/data_analysis_read/getrankingdatafornewcustomer?';
        }
        else {
            urlPrefix = MyConfig.path + '/data_analysis_read/getrankingdataforwifi?';
        }

        if (g_paimingType == 1)
        {
            paimingType = "behind";
        }

        placeInfo = getPlaceInfo();
        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type +
            "&place_type=" + placeInfo.placeType + "&rank_type=" +paimingType + "&rank_number="+"5";
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        function displayPaimingInfo(data)
        {
            if(data.errInfo == null)
            {
                var data1_zlv = [],
                    data2_zlv = [];
                var rank_data = data.rank_data;

                if(rank_data.length != 0)
                {
                    if(g_paimingWeidu == 0)
                    {
                        for(var i = 0; i < rank_data.length; i++)
                        {
                            if(g_placeInfo == "所有场所")
                            {
                                data1_zlv.push(g_devSNMapPlace[rank_data[i].name]);
                            }
                            else
                            {
                                data1_zlv.push(rank_data[i].name);
                            }
                            data2_zlv.push(rank_data[i].customers_new);
                        }
                    }
                    else{

                        for(var i = 0; i < rank_data.length; i++)
                        {
                            if(g_placeInfo == "所有场所")
                            {
                                data1_zlv.push(g_devSNMapPlace[rank_data[i].name]);
                            }
                            else{
                                data1_zlv.push(rank_data[i].name);
                            }
                            data2_zlv.push(rank_data[i].customers_wifi);
                        }
                    }



                }
                displayPaimingXinxi(data1_zlv, data2_zlv);
            }
            else{
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displayPaimingInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });

    }

    function showCustomersBriefInfo()
    {
        function showBreifInfo(data)
        {
            if(data.errInfo == null)
            {
                var result = data.custormerbaseinfo;

                var customers_total = result.customers_total;
                if(customers_total >= 1000)
                {
                    customers_total = (customers_total/10000).toFixed(2);
                    $("#unit_mountainvalue").html("万人次");
                }
                else
                {
                    $("#unit_mountainvalue").html("人次");
                }
                $("#mountainvalue").html(customers_total);

                var customers_total_compare = Math.abs(result.customers_total_compare);
                if(customers_total_compare >= 1000)
                {
                    customers_total_compare = (customers_total_compare/10000).toFixed(2);
                    $("#unit_mountainchange").html("万人次");
                }
                else
                {
                    $("#unit_mountainchange").html("人次");
                }
                if(result.customers_total_compare < 0)
                {
                    $("#mountaincompare").attr('src','../soon/image/down.png');
                }
                else
                {
                    $("#mountaincompare").attr('src','../soon/image/up.png');
                }
                $("#mountainchange").html(customers_total_compare);

                var wificustomers_total = result.wificustomers_total;
                if(wificustomers_total >= 1000)
                {
                    wificustomers_total = (wificustomers_total/10000).toFixed(2);
                    $("#unit_wificonnect").html("万人次");
                }
                else
                {
                    $("#unit_wificonnect").html("人次");
                }
                $("#wificonnect").html(wificustomers_total);

                var wificustomers_total_compare = Math.abs(result.wificustomers_total_compare);
                if(wificustomers_total_compare >= 1000)
                {
                    wificustomers_total_compare = (wificustomers_total_compare/10000).toFixed(2);
                    $("#unit_connectchange").html("万人次");
                }
                else
                {
                    $("#unit_connectchange").html("人次");
                }
                if(result.wificustomers_total_compare < 0)
                {
                    $("#connectcompare").attr('src','../soon/image/down.png');
                }
                else
                {
                    $("#connectcompare").attr('src','../soon/image/up.png');
                }
                $("#connectchange").html(wificustomers_total_compare);

                var customers_new = result.customers_new;
                if(customers_new >= 1000)
                {
                    customers_new = (customers_new/10000).toFixed(2);
                    $("#unit_addcustomer").html("万人次");
                }
                else
                {
                    $("#unit_addcustomer").html("人次");
                }
                $("#addcustomer").html(customers_new);

                var customers_new_compare = Math.abs(result.customers_new_compare);
                if(customers_new_compare >= 1000)
                {
                    customers_new_compare = (customers_new_compare/10000).toFixed(2);
                    $("#unit_addchange").html("万人次");
                }
                else
                {
                    $("#unit_addchange").html("人次");
                }
                if(result.customers_new_compare < 0)
                {
                    $("#addcompare").attr('src','../soon/image/down.png');
                }
                else
                {
                    $("#addcompare").attr('src','../soon/image/up.png');
                }
                $("#addchange").html(customers_new_compare);


                var wificustomers_new = result.wificustomers_new;
                if(wificustomers_new >= 1000)
                {
                    wificustomers_new = (wificustomers_new/10000).toFixed(2);
                    $("#unit_addwifi").html("万人次");
                }
                else
                {
                    $("#unit_addwifi").html("人次")
                }
                $("#addwifi").html(wificustomers_new);

                var wificustomers_new_compare = Math.abs(result.wificustomers_new_compare);
                if(wificustomers_new_compare >= 1000)
                {
                    wificustomers_new_compare = (wificustomers_new_compare/10000).toFixed(2);
                    $("#unit_addwifichange").html("万人次");
                }
                else
                {
                    $("#unit_addwifichange").html("人次");
                }
                if(result.wificustomers_new_compare < 0)
                {
                    $("#addwificompare").attr('src','../soon/image/down.png');
                }
                else
                {
                    $("#addwificompare").attr('src','../soon/image/up.png');
                }
                $("#addwifichange").html(wificustomers_new_compare);
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        function showCurrentCustomersInfo(data)
        {
            if(data.errInfo == null)
            {
                var currentcustomersinfo = data.currentcustomersinfo;
                var current_customers = currentcustomersinfo.current_customers;
                var current_customers_compare = currentcustomersinfo.current_customers_compare;

                if(current_customers >= 1000)
                {
                    current_customers = (current_customers/10000).toFixed(2);
                    $("#unit_currentcustomer").html("万人次");
                }
                else
                {
                    $("#unit_currentcustomer").html("人次");
                }
                $("#currentcustomer").html(current_customers);

                current_customers_compare = Math.abs(current_customers_compare);
                if(current_customers_compare >= 10000)
                {
                    current_customers_compare = (current_customers_compare/10000).toFixed(2);
                    $("#unit_currentchange").html("万人次");
                }
                else
                {
                    $("#unit_currentchange").html("人次");
                }

                if(currentcustomersinfo.current_customers_compare < 0)
                {
                    $("#currentcompare").attr('src','../soon/image/down.png');
                }
                else
                {
                    $("#currentcompare").attr('src','../soon/image/up.png');
                }
                $("#currentchange").html(current_customers_compare);


            }
            else{
                Frame.Msg.error(data.errInfo);
            }
        }

        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/getcustomerbaseinfo?';
        var urlGetCurInfo = MyConfig.path + '/data_analysis_read/getcurrentcustomersinfo';
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
            success:showBreifInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });

        $.ajax({
            url:urlGetCurInfo,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:showCurrentCustomersInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }


    function showNewCustomerRatio()
    {
        function displayNewCustomerRatio(data)
        {
            if(data.errInfo == null)
            {
                var new_customer_ratio = data.new_customer_ratio;

                var data_customers;
                if((new_customer_ratio.customers_new == 0) && (new_customer_ratio.customers_old == 0))
                {
                    data_customers = [];
                    $("#legend1").addClass("hide");
                }
                else{
                    data_customers = [
                        {value:new_customer_ratio.customers_new, name:'新顾客'},
                        {value:new_customer_ratio.customers_old, name:'老顾客'}
                    ];
                    $("#legend1").removeClass("hide");
                }

                displayXinGuKeBiLv(data_customers);
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/getnewcustomerratio?';
        var reqUrl;

        placeInfo = getPlaceInfo();
        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displayNewCustomerRatio,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function showWifiUserRatio()
    {
        function displayWifiUseRatio(data)
        {
            if(data.errInfo == null)
            {
                var data_wifishiyong;
                var wifi_ratio = data.wifi_ratio;
                if((wifi_ratio.customers_wifi == 0) && (wifi_ratio.customers_noWifi == 0))
                {
                    data_wifishiyong = [];
                    $("#legend2").addClass("hide");
                }
                else{
                    data_wifishiyong= [
                        {value:wifi_ratio.customers_wifi, name:'使用WiFi'},
                        {value:wifi_ratio.customers_noWifi, name:'未用WiFi'}
                    ];
                    $("#legend2").removeClass("hide");
                }


                displayWiFiShiYongBiLv(data_wifishiyong);
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/getwifiratio?';
        var reqUrl;

        placeInfo = getPlaceInfo();
        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:placeInfo.requireData,
            success:displayWifiUseRatio,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function showQuShiFenXi()
    {
        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/gettendencydataforcustomers?';
        var reqUrl;
        var callback;

        function displayQushiInfo(data)
        {
            if(data.errInfo == null)
            {
                var tendency = data.tendency;
                var tendency_compare = data.tendency_compare;
                var maxName = "顾客数峰值";
                var title_legend = "";
                var title_seriesName = "顾客数";
                var time = [];
                var data_y = [];
                var data_compare = [];
                var compareDate;

                if(g_tendency_zhibiao != 0)
                {
                    maxName = "WiFi连接数峰值";
                    title_seriesName = "WiFi连接数";
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
                var maxName = "顾客数峰值";
                var title_legend = "";
                var title_seriesName = "顾客数";
                var time = [];
                var data_y = [];

                if(g_tendency_zhibiao != 0)
                {
                    maxName = "WiFi连接数峰值";
                    title_seriesName = "WiFi连接数";
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

        if(g_tendency_zhibiao != 0)
        {
            urlPrefix = MyConfig.path +'/data_analysis_read/gettendencydataforwificustomers?';
        }

        placeInfo = getPlaceInfo();
        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "today")
        {
            reqUrl += "&isCompare=" + g_isCompare + "&compare_type=" + g_CompareType;
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

    function showCustomersDetailInfo()
    {
        var placeInfo;
        var urlPrefix = MyConfig.path +'/data_analysis_read/getcustomersdetaildata?';
        var reqUrl;


        function displayDetailCustomersInfo(data)
        {
            var placeInfo = getPlaceInfo();
            if(data.errInfo == null)
            {
                var slist_data = data.slist_data;

                if(placeInfo.placeType == 0)
                {
                    for(var i = 0; i < slist_data.length; i++)
                    {
                        var devSN = slist_data[i]['name'];
                        slist_data[i]['name'] = g_devSNMapPlace[devSN];
                    }
                }
                $("#xiangxi_list").SList("refresh", slist_data);
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

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
            success:displayDetailCustomersInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function initData()
    {
        showCustomersBriefInfo();
        showNewCustomerRatio();
        showWifiUserRatio();
        showPaimingInfo();
        showQuShiFenXi();
        showCustomersDetailInfo();
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

    //初始化详细信息列表表头
    function initGrid()
    {
        var opt_head =
        {
            colNames:  ['场所/区域名称', '新增顾客数', '累计顾客数', '新增Wi-Fi数', 'Wi-Fi连接数'],
            showHeader: true,
            multiSelect: false,
            pageSize: 20,
            colModel: [
                {name: "name", datatype: "String"},
                {name: "customers_new", datatype: "String"},
                {name: "customers_total", datatype: "String"},
                {name: "wificustomers_new", datatype: "String"},
                {name: "wificustomers_total", datatype: "String"}
            ]
        };

        $("#xiangxi_list").SList("head", opt_head);
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

        /*点击刷新事件*/
        $("#refresh_customers").on("click", changeChangShuo);

        /*周期点击上下滑动事件*/
        $("#calendar").on("click", function(){
            $(".top-box").slideToggle(100);
        });

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

        /*选择自定义周期事件*/
        $("#daterange").on("inputchange.datarange", function(){
            var orange = $(this).daterange("getRangeData");

            $("#cycle_date").text("（" + orange.startData + "-" + orange.endData + "）");
            g_dataType.startDay = orange.startData;
            g_dataType.endDay = orange.endData;
            g_dataType.type = "custom";
            initData();
        });

        /*初始化场所点击事件*/
        $("#changshuoselect").change(changeChangShuo);

        /*选择新增顾客或新增wifi趋势图事件*/
        $("#new_customers_trend, #new_wifi_trend").on("click", SelectType);

        /*选择排名前后事件*/
        $("#paiming_qianwu, #paiming_houwu").on("click", SelectTypePaiming);

        /*选择新增顾客或新增wifi链接事件*/
        $("#current_customers_line, #connect_wifi_line").on("click", SelectTypeLine);

        /*选择与当日同期比较事件*/
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
        "widgets": ["Form", "Echart", "SList", "Minput", "SingleSelect", "DateRange", "DateTime"],
        "utils": ["Base"]
    });
}) (jQuery);