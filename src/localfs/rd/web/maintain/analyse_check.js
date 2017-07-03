(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_check";


    function getRcText(sRcName){
        return Utils.Base.getRcString("check_rc",sRcName);
    }

    /*获取体检分析饼状图、柱状图数据*/
    function getCheckData(){

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getunusualUser',
            type:'get',
            dataType:'json',
            success:function(data){
                drawCheckPie(data.Spread);
                drawPoint(data.Point);
            },
            error:function(){

                Frame.Msg.error("数据获取异常,请联系客服");
            }
        })
    }

    /*获取体检分析折线图数据*/
    function getCheckData_line(oDate){

        var response = getDate(oDate);
        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getunusualSelectDate',
            type:'post',
            dataType:'json',
            data:{
                timestamp:response.timestamp
            },
            success:function(data){

                /*draw体检分析折线图*/
                drawTendency(data,response.xlist);
            },
            error:function(){

            }
        })

    }

    /*问题概览饼状图*/
    function drawCheckPie(percent){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:
                [
                    {
                        name:"弱信号终端过多",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"AP负载过高",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"Radio负载不均衡",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"协商速率低终端过多",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"空口占用率过高",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"存在干扰",
                        textStyle:{color:"white"}
                    }
                ]
            },
            calculable : true,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : [20, 80],
                    center : ['50%', 140],
                    roseType : 'radius',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:percent
                }
            ]
        };
        var oTheme = {};
        $("#problem").echart("init",option);
    }


    /*趋势折线图*/
    function drawTendency(data,xlist){

        var option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:
                [
                    {
                        name:"弱信号终端过多",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"AP负载过高",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"Radio负载不均衡",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"协商速率低终端过多",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"空口占用率过高",
                        textStyle:{color:"white"}
                    },
                    {
                        name:"存在干扰",
                        textStyle:{color:"white"}
                    }
                ]
            },
            calculable : true,
            grid:{
              y:100
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px"}
                    },
                    data :xlist
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px"}
                    }
                }
            ],
            series : [
                {
                    name:'弱信号终端过多',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.rssi
                },
                {
                    name:'AP负载过高',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.apload2
                },
                {
                    name:'Radio负载不均衡',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.apload1
                },
                {
                    name:'协商速率低终端过多',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.consule
                },
                {
                    name:'空口占用率过高',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.rxbusy2
                },
                {
                    name:'存在干扰',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:data.rxbusy1
                }
            ]
        };
        var oTheme = {
            color : ['gray','blue','#69C4C5','#FFBB33','#FF8800','#CC324B']
        };
        $("#tendency").echart("init",option);
    }


    /*局点分布柱状图*/
    function drawPoint(data){

        /*解析成柱状图识别的格式*/
        var user = new Array();
        var userData = new Array();
        for( var i = 0; i < data.length ;i++){
            if( (data[i].userName == "") || (data[i].userName == null)){
                continue;
            }
            user.push(data[i].userName);
            userData.push(data[i].number);
        }

        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : user,
                    axisLabel:{
                        show:true,
                        textStyle:{color:'#e6e6e6'}
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        show:true,
                        textStyle:{color:'#e6e6e6'}
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    data:userData,
                    itemStyle:{
                        normal:{
                            color:function(params) {
                                var colorList = [
                                    'green','gray','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }
            ]
        };
        $("#point").echart("init",option);
    }


    /*获取最近一周，最近一月，最近一年的时间数组*/
    function getDate(oDate){
        var resTimeStamp = new Array();
        var resXlist = new Array();
        var monthFilter;
        var response = {};

        if(oDate == "一周")
        {
            for(var i = 6 ; i >=0 ; i--){
                var timestamp = new Date().setDate(new Date().getDate() - i);
                var currentYear = new Date(timestamp).getFullYear();
                var currentMonth = new Date(timestamp).getMonth() + 1;
                var currentDay = new Date(timestamp).getDate();

                if(currentMonth < 10){
                    currentMonth = "0" + currentMonth;
                }

                if(currentDay < 10){
                    currentDay = "0" + currentDay;
                }
                var temp = {};
                temp.startTime = currentYear + "-" + currentMonth + "-" + currentDay + " " +"00:00:00";
                temp.endTime = currentYear + "-" + currentMonth + "-" + currentDay + " " + "23:59:59";
                resTimeStamp.push(temp);
                resXlist.push(currentYear + "-" + currentMonth + "-" + currentDay);
            }
            response.timestamp = resTimeStamp;
            response.xlist = resXlist;
            return response;
        }
        else if(oDate == "一月")
        {
            for(var i = 29 ; i >= 0 ; i--){
                var timestamp = new Date().setDate(new Date().getDate() - i);
                var currentYear = new Date(timestamp).getFullYear();
                var currentMonth = new Date(timestamp).getMonth() + 1;
                var currentDay = new Date(timestamp).getDate();

                if( currentMonth < 10){
                    currentMonth = "0" + currentMonth;
                }

                if( currentDay < 10){
                    currentDay = "0" + currentDay;
                }
                var temp = {};
                temp.startTime = currentYear + "-" + currentMonth + "-" + currentDay + " " + "00:00:00";
                temp.endTime = currentYear + "-" + currentMonth + "-" + currentDay + " " + "23:59:59";
                resTimeStamp.push(temp);
                resXlist.push(currentMonth + "/" + currentDay);
            }
                response.timestamp = resTimeStamp;
                response.xlist = resXlist;
                return response;

        }
        else if(oDate == "一年")
        {
            var currentYear = new Date().getFullYear() - 1;
            var currentMonth = new Date().getMonth() + 1;

            for(var i = currentMonth ; i <= 12 ; i++){
                var temp = {};

                if(i < 10){
                    monthFilter = "0" + i;
                }
                else
                {
                    monthFilter = i;
                }
                temp.startTime = currentYear + "-" + monthFilter + "-" + "01" + " " + "00:00:00";
                temp.endTime = currentYear + "-" + monthFilter + "-" + "31" + " " + "23:59:59";
                resTimeStamp.push(temp);
                resXlist.push(currentYear + "-" + monthFilter);
            }

            currentYear += 1;
            for(var j = 1; j <= currentMonth; j++){
                var temp = {};

                if( j < 10){
                    monthFilter = "0" + j;
                }
                else
                {
                    monthFilter = j;
                }
                temp.startTime = currentYear + "-" + monthFilter + "-" + "01" + " " + "00:00:00";
                temp.endTime = currentYear + "-" + monthFilter + "-" + "31" + " " + "23:59:59";
                resTimeStamp.push(temp);
                resXlist.push(currentYear + "-" + monthFilter);
            }
            response.timestamp = resTimeStamp;
            response.xlist = resXlist;
            return response;
        }
    }

    function initData(){

        /*获取体检分析饼状图，柱状图数据*/
        getCheckData();
        /*获取体检分析折线图数据*/
        getCheckData_line("一周");
    }

    function getSelectTimeData(oDate){

        var response = getDate(oDate);

        $.ajax({
            url:MyConfig.path + '/diagnosis_read/web/getunusualSelectDate',
            type:'post',
            dataType:'json',
            data:{
                timestamp:response.timestamp
            },
            success:function(data){

                /*趋势折线图*/
                drawTendency(data,response.xlist);
            },
            error:function(){

            }
        })
    }

    function _init(){

        initData();
        initGrid();
        initForm();
    }

    function initForm(){

        $("#week").on("click",function(){
            $("#week").addClass('select');
            $("#month").removeClass('select');
            $("#year").removeClass('select');
            getSelectTimeData("一周");
        });

        $("#month").click(function(){
            $("#month").addClass('select');
            $("#week").removeClass('select');
            $("#year").removeClass('select');
            getSelectTimeData("一月");
        });

        $("#year").click(function(){
            $("#year").addClass('select');
            $("#week").removeClass('select');
            $("#month").removeClass('select');
            getSelectTimeData("一年");
        })
    }

    function initGrid(){

    }

    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","Echart","SingleSelect","DateTime","DateRange","SList","Mlist"],
        "utils":["Request","Base","Msg"]
    })

})(jQuery);