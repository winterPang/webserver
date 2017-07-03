(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_wan";


    /*获取上下行速率和上下行流量*/
    function getData(oDate){

        var response = getDate(oDate);

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getWanHisTraffic',
            type:'post',
            dataType:'json',
            data:{
                timestamp:response.timestamp
            },
            success:function(data){

                //解析折线图数据
                drawSpeed(response.xlist,data);
                drawFlow(response.xlist,data);
            },
            error:function(){

            }
        })
    }

    /*获取一周、一月、一年日期数组*/
    function getDate(oDate){
        var resTimeStamp = new Array();
        var resXlist = new Array();
        var response = {};
        switch(oDate){
            case "一天":
            {
                var currentDate = new Date().toLocaleDateString();
                for(var i = 1 ; i <=24 ; i++){
                    var temp = {};
                    if( i < 10){
                       var filterI = "0" + i;
                    }
                    else
                    {
                        var filterI = i;
                    }
                    temp.startTime = currentDate + " " + filterI + ":00:00";
                    temp.endTime = currentDate + " " + filterI +":59:59";
                    resTimeStamp.push(temp);
                    resXlist.push(filterI + ":00");
                }
                response.timestamp = resTimeStamp;
                response.xlist = resXlist;
                break;
            }
            case "一周":
            {
               for(var i = 6 ; i >= 0 ; i--){
                   var timestamp    = new Date().setDate(new Date().getDate() - i);
                   var currentYear  = new Date(timestamp).getFullYear();
                   var currentMonth = new Date(timestamp).getMonth() + 1;
                   var currentDay   = new Date(timestamp).getDate();
                   var temp = {};
                   temp.startTime = currentYear + "-" + currentMonth + "-" + currentDay + " " + "00:00:00";
                   temp.endTime = currentYear + "-" + currentMonth + "-" + currentDay + " " + "23:59:59";
                   resTimeStamp.push(temp);
                   resXlist.push(currentYear + "-" + currentMonth + "-" + currentDay);
               }
                response.timestamp = resTimeStamp;
                response.xlist = resXlist;
                break;
            }
            case "一月":
            {
                for(var i = 29 ; i >= 0 ; i--){
                    var timestamp    = new Date().setDate(new Date().getDate() - i);
                    var currentYear  = new Date(timestamp).getFullYear();
                    var currentMonth = new Date(timestamp).getMonth() + 1;
                    var currentDay   = new Date(timestamp).getDate();
                    var temp = {};
                    temp.startTime = currentYear + "-" + currentMonth + "-" + currentDay + " " + "00:00:00";
                    temp.endTime = currentYear + "-" + currentMonth + "-" + currentDay + " " + "23:59:59";
                    resTimeStamp.push(temp);
                    resXlist.push(currentMonth + "/" + currentDay);
                }
                response.timestamp = resTimeStamp;
                response.xlist = resXlist;
                break;
            }
            default:
                break;
        }
        return response;
    }


    /*上下行速率折线图*/
    function drawSpeed(xlist,ylist){

        var speed_up = new Array();
        var speed_down = new Array();
        for(var i = 0 ; i < ylist.length; i++){
            speed_up.push(ylist[i].speed_up_Avg.toFixed(2));
            speed_down.push(ylist[i].speed_down_Avg.toFixed(2));
        }

        var option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:
                [
                    {
                        name:"上行",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"下行",
                        textStyle:{color:"white"}
                    }
                ]
            },
            calculable : false,
            xAxis : [
                {
                    name:'日期',
                    type : 'category',
                    boundaryGap : false,
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px", width:2}
                    },
                    data :xlist
                }
            ],
            yAxis : [
                {
                    name:'Kb/S',
                    type : 'value',
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px", width:2}
                    }
                }
            ],
            series : [
                {
                    name:'上行',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:speed_up
                },
                {
                    name:'下行',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:speed_down
                }
            ]
        };
        $("#rate").echart("init",option);
    }


    /*上下行流量折线图*/
    function drawFlow(xlist,ylist){

        var flow_up = new Array();
        var flow_down = new Array();

        for(var i = 0; i < ylist.length ; i++){
            flow_up.push((ylist[i].upflow_Avg/1000).toFixed(2));
            flow_down.push((ylist[i].downflow_Avg/1000).toFixed(2));
        }

        var option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:
                [
                    {
                        name:"上行",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"下行",
                        textStyle:{color:"white"}
                    }
                ]
            },
            calculable : false,
            xAxis : [
                {
                    name:'日期',
                    type : 'category',
                    boundaryGap : false,
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px", width:2}
                    },
                    data :xlist
                }
            ],
            yAxis : [
                {
                    name:'Mb',
                    type : 'value',
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px", width:2}
                    }
                }
            ],
            series : [
                {
                    name:'上行',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:flow_up
                },
                {
                    name:'下行',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:flow_down
                }
            ]
        };
        var oTheme = {
            color:['#FFBB33','#FF8800']
        };
        $("#flow").echart("init",option,oTheme);
    }

    /*wan口类型*/
    function drawWan(){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                y:10,
                data: ['移动','联通','电信','铁通']
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'移动'},
                        {value:310, name:'联通'},
                        {value:234, name:'电信'},
                        {value:135, name:'铁通'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color:[]
        };
        $("#wan").echart("init",option);
    }


    /*多wan行为饼状图*/
    function drawWanAction(){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                y:10,
                data: ['ipsec','sslvpn','未使用vpn']
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:123, name:'ipsec'},
                        {value:232, name:'sslvpn'},
                        {value:455, name:'未使用vpn'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color:[]
        };
        $("#wanAction").echart("init",option);
    }

    /*多wan饼状图*/
    function drawMoreWan(){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                y:10,
                data: ['使用多wan','未使用多wan']
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:123, name:'使用多wan'},
                        {value:232, name:'未使用多wan'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color:['gray','yellow']
        };
        $("#moreWan").echart("init",option,oTheme);
    }


    function initData(){

        /*获取上下行速率和上下行流量*/
        getData("一天");

        drawWan();
        drawWanAction();
        drawMoreWan();
    }


    function _init(){

        initData();
        initForm();
    }

    function initForm(){

        $("#speed_day").on("click",function(){

            $("#speed_day").addClass('select');
            $("#speed_week").removeClass('select');
            $("#speed_month").removeClass('select');
            getSpeedData("一天");
        });

        $("#speed_week").on("click",function(){

            $("#speed_week").addClass('select');
            $("#speed_day").removeClass('select');
            $("#speed_month").removeClass('select');
            getSpeedData("一周");
        });

        $("#speed_month").on("click",function(){

            $("#speed_month").addClass('select');
            $("#speed_day").removeClass('select');
            $("#speed_week").removeClass('select');
            getSpeedData("一月");
        });

        $("#flow_day").on("click",function(){

            $("#flow_day").addClass('select');
            $("#flow_week").removeClass('select');
            $("#flow_month").removeClass('select');
            getFlowData("一天");
        });

        $("#flow_week").on("click",function(){

            $("#flow_week").addClass('select');
            $("#flow_day").removeClass('select');
            $("#flow_month").removeClass('select');
            getFlowData("一周");
        });

        $("#flow_month").on("click",function(){

            $("#flow_month").addClass('select');
            $("#flow_week").removeClass('select');
            $("#flow_day").removeClass('select');
            getFlowData("一月");
        })
    }


    /*上下行速率一天、一周、一月数据渲染*/
    function getSpeedData(oDate){

        var response = getDate(oDate);

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getWanHisTraffic',
            type:'post',
            dataType:'json',
            data:{
                timestamp:response.timestamp
            },
            success:function(data){

                //draw 上下行速率
                drawSpeed(response.xlist,data)
            },
            error:function(){

            }
        })
    }

    /*上下行流量一天、一周、一月数据渲染*/
    function getFlowData(oDate){

        var response = getDate(oDate);

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getWanHisTraffic',
            type:'post',
            dataType:'json',
            data:{
                timestamp:response.timestamp
            },
            success:function(data){

                //draw 上下行速率
                drawFlow(response.xlist,data)
            },
            error:function(){

            }
        })
    }

    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart"],
        "utils":["Base"]
    })
})(jQuery);