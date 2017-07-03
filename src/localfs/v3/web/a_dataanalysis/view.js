/**
 * Created by Administrator on 2016/2/23.
 */
/**
 * Created by Administrator on 2015/12/1.
 */
/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "a_dataanalysis.view";

    var g_devSNList = {devSNList:[]};
    var g_dataType = {type:"today", startDay:"", endDay:""};
    var g_dataTypeMap = {"today":0, "oneWeek":1, "oneMonth":2, "oneYear":3};

    var up = "../soon/image/up.png",
        down = "../soon/image/down.png";
    var oTheme = {
     color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
     };

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("view_rc", sRcName);
    }

    function makeoptionSmall(ave, data) {
        var option = {
            height:300,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'center',
                y : 180,
                data: data
            },
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : ['45%', '80%'],
                    center: ['50%', '30%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true,
                                position: 'center',
                                distance: 8,
                                textStyle: {
                                    color : '#4ec1b2',
                                    fontFamily : '微软雅黑',
                                    fontSize : 20,
                                    fontWeight : 'bolder'
                                },
                                formatter: function(){
                                    return ave
                                }
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : false,
                                position : 'center',
                                textStyle : {
                                    fontSize : '30',
                                    fontWeight : 'bold'
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


    function showPingJunDaoFangLv()
    {
        var urlPrefix = MyConfig.path +'/data_analysis_read/getvisitsratio?';
        var reqUrl;

        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        function displayPingJunDaoFangLv(data)
        {
            if(data.errInfo == null)
            {
                var visit_ratio_ave = data.visit_ratio_ave;
                var ratio = (Number(visit_ratio_ave) *100).toFixed(1) + '%';
                var option = makeoptionSmall(ratio, data.visit_ratio);

                $("#averge_into_shop_rate").echart("init", option, oTheme);

            }
            else{
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:g_devSNList,
            success:displayPingJunDaoFangLv,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }


    function showPingJunZhuLiuLv()
    {
        var urlPrefix = MyConfig.path +'/data_analysis_read/getlingeringratio?';
        var reqUrl;

        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        function displayPingJunZhuLivLv(data)
        {
            if(data.errInfo == null)
            {
                var lingering_ratio_ave = data.lingering_ratio_ave;
                var ratio = (Number(lingering_ratio_ave) *100).toFixed(1) + '%';
                var option = makeoptionSmall(ratio, data.lingering_ratio);

                $("#averge_reside_rate").echart("init", option, oTheme);

            }
            else{
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:g_devSNList,
            success:displayPingJunZhuLivLv,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }


    function showXinGuKeBiLv()
    {
        var urlPrefix = MyConfig.path +'/data_analysis_read/getnewcustomerratioforview?';
        var reqUrl;

        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        function displayXinGuKeBiLv(data)
        {
            if(data.errInfo == null)
            {
                var new_customer_ave = data.new_customer_ave;
                var ratio = (Number(new_customer_ave) *100).toFixed(1) + '%';
                var option = makeoptionSmall(ratio, data.new_customer_ratio);

                $("#new_customers_rate").echart("init", option, oTheme);

            }
            else{
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:g_devSNList,
            success:displayXinGuKeBiLv,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }


    function showPingJunDaoFangCiShu()
    {
        var urlPrefix = MyConfig.path +'/data_analysis_read/getvisitsnumber?';
        var reqUrl;

        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        function displayPingJunDaoFangCiShu(data)
        {
            if(data.errInfo == null)
            {
                var visits_number_ave = data.visits_number_ave;
                var times = Number(visits_number_ave).toFixed(1) + '次';
                var option = makeoptionSmall(times, data.visits_number);

                $("#averge_into_shop_many").echart("init", option, oTheme);
            }
            else{
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:g_devSNList,
            success:displayPingJunDaoFangCiShu,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function showPingJunZhuLiuShiChang()
    {
        var urlPrefix = MyConfig.path +'/data_analysis_read/getlingeringtime?';
        var reqUrl;

        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        function displayPingJunZhuLivShiChang(data)
        {
            if(data.errInfo == null)
            {
                var lingering_time_ave = data.lingering_time_ave;
                var times = lingering_time_ave/60;
                if(times >= 720)
                {
                    time = Number(times/720).toFixed(1) + '天';
                }
                else if(times >= 60)
                {
                    time = Number(times/60).toFixed(1) + '时';
                }
                else
                {
                    var time = parseInt(times) + '分';
                }
                var option = makeoptionSmall(time, data.lingering_time);

                $("#averge_reside_time_rate").echart("init", option, oTheme);

            }
            else{
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:g_devSNList,
            success:displayPingJunZhuLivShiChang,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function ShowViewBriefInfo()
    {
        var urlPrefix = MyConfig.path +'/data_analysis_read/getviewbaseinfo?';
        var reqUrl;

        reqUrl = urlPrefix + "statistics_type=" + g_dataType.type;
        if(g_dataType.type == "custom")
        {
            reqUrl += "&startTime=" + g_dataType.startDay + "&endTime=" + g_dataType.endDay;
        }

        function displayViewBriefInfo(data)
        {
            if(data.errInfo == null)
            {
                var viewbaseinfo = data.viewbaseinfo;

                var passengers_total = viewbaseinfo.passengers_total;
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

                var cur_total_visitors = viewbaseinfo.cur_total_visitors;
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

                var cur_total_customers = viewbaseinfo.cur_total_customers;
                if(cur_total_customers >= 1000)
                {
                    cur_total_customers = Number(cur_total_customers/10000).toFixed(1);
                    $("#unit_total_customer").html("万人次");
                }
                else
                {
                    $("#unit_total_customer").html("人次");
                }
                $("#total_customer_count").html(cur_total_customers);

                var cur_total_newCustomers = viewbaseinfo.cur_total_newCustomers;
                if(cur_total_newCustomers >= 1000)
                {
                    cur_total_newCustomers = Number(cur_total_newCustomers/10000).toFixed(1);
                    $("#unit_increase_customer").html("万人次");
                }
                else
                {
                    $("#unit_increase_customer").html("人次");
                }
                $("#increase_customer_count").html(cur_total_newCustomers);

                var lingering_time_ave = viewbaseinfo.lingering_time_ave/60;
                if(lingering_time_ave >= 720)
                {
                    lingering_time_ave = Number(lingering_time_ave/720).toFixed(1);
                    $("#unit_averge_reside").html("天");
                }
                else if(lingering_time_ave >= 60)
                {
                    lingering_time_ave = Number(lingering_time_ave/60).toFixed(1);
                    $("#unit_averge_reside").html("小时");
                }
                else
                {
                    lingering_time_ave = parseInt(lingering_time_ave);
                    $("#unit_averge_reside").html("分钟");
                }
                $("#averge_reside_time").html(lingering_time_ave);

                var passengers_total_compare = Math.abs(viewbaseinfo.passengers_total_compare);
                if(passengers_total_compare >= 1000)
                {
                    passengers_total_compare = Number(passengers_total_compare/10000).toFixed(1);
                    $("#unit_total_traffic_than").html("万人次");
                }
                else
                {
                    $("#unit_total_traffic_than").html("人次");
                }
                $("#total_traffic_than").html(passengers_total_compare);
                if(viewbaseinfo.passengers_total_compare < 0)
                {
                    $("#total_traffic_img").attr("src", down);
                }
                else
                {
                    $("#total_traffic_img").attr("src", up);
                }

                var cur_total_visitors_compare = Math.abs(viewbaseinfo.cur_total_visitors_compare);
                if(cur_total_visitors_compare >= 1000)
                {
                    cur_total_visitors_compare = Number(cur_total_visitors_compare/10000).toFixed(1);
                    $("#unit_into_shop_than").html("万人次");
                }
                else
                {
                    $("#unit_into_shop_than").html("人次");
                }
                $("#into_shop_than").html(cur_total_visitors_compare);
                if(viewbaseinfo.cur_total_visitors_compare < 0)
                {
                    $("#into_shop_img").attr("src", down);
                }
                else
                {
                    $("#into_shop_img").attr("src", up);
                }

                var cur_total_customers_compare = Math.abs(viewbaseinfo.cur_total_customers_compare);
                if(cur_total_customers_compare >= 1000)
                {
                    cur_total_customers_compare = Number(cur_total_customers_compare/10000).toFixed(1);
                    $("#unit_total_customer_than").html("万人次");
                }
                else
                {
                    $("#unit_total_customer_than").html("人次");
                }
                $("#total_customer_than").html(cur_total_customers_compare);
                if(viewbaseinfo.cur_total_customers_compare < 0)
                {
                    $("#total_customer_img").attr("src", down);
                }
                else
                {
                    $("#total_customer_img").attr("src", up);
                }

                var cur_total_newCustomers_compare = Math.abs(viewbaseinfo.cur_total_newCustomers_compare);
                if(cur_total_newCustomers_compare >= 1000)
                {
                    cur_total_newCustomers_compare = Number(cur_total_newCustomers_compare/10000).toFixed(1);
                    $("#unit_increase_customer_than").html("万人次");
                }
                else
                {
                    $("#unit_increase_customer_than").html("人次");
                }
                $("#increase_customer_than").html(cur_total_newCustomers_compare);
                if(viewbaseinfo.cur_total_newCustomers_compare < 0)
                {
                    $("#increase_customer_img").attr("src", down);
                }
                else
                {
                    $("#increase_customer_img").attr("src", up);
                }


                var lingering_time_ave_compare = parseInt(Math.abs(viewbaseinfo.lingering_time_ave_compare)/60);
                if(lingering_time_ave_compare >= 720)
                {
                    lingering_time_ave_compare = Number(lingering_time_ave_compare/720).toFixed(1);
                    $("#unit_averge_reside_than").html("天");
                }
                else if(lingering_time_ave_compare >= 60)
                {
                    lingering_time_ave_compare = Number(lingering_time_ave_compare/60).toFixed(1);
                    $("#unit_averge_reside_than").html("小时");
                }
                else
                {
                    lingering_time_ave_compare = parseInt(lingering_time_ave_compare);
                    $("#unit_averge_reside_than").html("分钟");
                }
                $("#averge_reside_than").html(lingering_time_ave_compare);
                if(viewbaseinfo.lingering_time_ave_compare < 0)
                {
                    $("#averge_reside_img").attr("src", down);
                }
                else
                {
                    $("#averge_reside_img").attr("src", up);
                }
            }
            else
            {
                Frame.Msg.error(data.errInfo);
            }
        }

        $.ajax({
            url:reqUrl,
            type:'post',
            dataType:'json',
            data:g_devSNList,
            success:displayViewBriefInfo,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        });
    }

    function initData()
    {
        ShowViewBriefInfo();
        showPingJunDaoFangCiShu();
        showPingJunDaoFangLv();
        showPingJunZhuLiuLv();
        showPingJunZhuLiuShiChang();
        showXinGuKeBiLv();
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

    function getPlaceInfo()
    {
        function getPlaceList(data)
        {
            g_devSNList.devSNList = [];
            var devSNList = data.devSNList;
            for(var i = 0; i < devSNList.length; i++)
            {
                g_devSNList.devSNList.push({devSN:devSNList[i].devSN});
            }

            initData();
        }

        $.ajax({
            url:MyConfig.path +'/data_analysis_read/getdevsn',
            type:'get',
            dataType:'json',
            success:getPlaceList,
            error:function(){
                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    function initFrom(){

        /*点击刷新页面事件*/
        $("#refresh_view").on("click", initData);

        /*周期上下滑动事件*/
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

        /*自定义周期的选择事件*/
        $("#daterange").on("inputchange.datarange", function(){
            var orange = $(this).daterange("getRangeData");

            $("#cycle_date").text("（" + orange.startData + "-" + orange.endData + "）");
            g_dataType.startDay = orange.startData;
            g_dataType.endDay = orange.endData;
            g_dataType.type = "custom";
        });
    }


    function _init()
    {
        g_dataType.type = $("#WT1, #WT2, #WT3, #WT4, #WT5").val();
        setCalendarDate();
        getPlaceInfo();
        initFrom();
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
        "widgets": ["Echart","Minput","DateRange"],
        "utils": ["Base"]
    });
}) (jQuery);
