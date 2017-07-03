(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_auth";


    /*获取认证方式分布数据*/
    function getAuthSpread(){

        $.ajax({
            url:MyConfig.path + '/portalmonitor/web/getusercountbyauthtype',
            type:'get',
            dataType:'json',
            success:function(data){

                /*解析认证分布数据*/
                analyseAuthSpreadData(data);
            },
            error:function(){

                Frame.Msg.error("数据获取失败，请联系客服");
            }
        })
    }

    /*解析认证分布方式数据*/
    function analyseAuthSpreadData(data){
        var authData = data.portalUserNum || [];
        var authType = new Array();
        var authSparedData = new Array();

        for(var i = 0 ; i < authData.length ; i++){
            if( (authData[i].AuthTypeStr == "") || (authData[i].AuthTypeStr == null)){
                continue;
            }
            authType.push(authData[i].AuthTypeStr);
            var temp = {};
            temp.name = authData[i].AuthTypeStr;
            temp.value = authData[i].Count;
            authSparedData.push(temp);
        }

        /*画认证方式分布饼状图*/
        drawAuthDistribution(authType,authSparedData);
    }


    /*认证方式分布饼状图*/
    function drawAuthDistribution(authType,authSparedData){

        var new_authType = new Array();
        for(var i in authType){
            var temp = {};
            temp.name = authType[i];
            temp.textStyle = {color:"white"};

            new_authType.push(temp);
        }


        /*无数据时处理加上容错处理*/
        if( authSparedData.length != 0) {
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x: 'center',
                    y: 'bottom',
                    data: new_authType
                },
                calculable: true,
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: [20, 80],
                        center: ['50%', 180],
                        roseType: 'radius',
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
                        data: authSparedData
                    }
                ]
            };
            var oTheme = {
                color: []
            };
            $("#authDistribution").echart("init", option);
        }
        else
        {
            var option_demo = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x: 'center',
                    y: 'bottom',
                    data:[]
                },
                calculable: true,
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: [20, 80],
                        center: ['50%', 180],
                        roseType: 'radius',
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
                        data:[
                            {name:"",value:0}
                        ]
                    }
                ]
            };
            var oTheme = {
                color: []
            };
            $("#authDistribution").echart("init", option_demo);
        }
    }


    /*获取认证失败统计数据*/
    function getAuthFailCount(oDate){

        //获取一周、一月、一年所对应的时间戳数组
        var response = getDate(oDate);

        $.ajax({
            url:MyConfig.path + '/portalmonitor/getauthfailcount',
            type:'post',
            dataType:'json',
            data:{
                timestampArr:response.timestamp
            },
            success:function(data){

                //解析认证失败数据
                analyseAuthFailData(response.xlist,data);
            },
            error:function(){

            }
        })
    }

    /*获取日期*/
    function getDate(oDate){

        var resTimeStamp = new Array();
        var resXlist = new Array();
        var response = {};
        if(oDate == "一周")
        {
            for(var i = 7 ; i >= 1; i--) {
                var timestamp = new Date().setDate(new Date().getDate() - i);
                var currentYear = new Date(timestamp).getFullYear();
                var currentMonth = new Date(timestamp).getMonth() + 1;
                var currentDay = new Date(timestamp).getDate();
                var temp = {};
                temp.startTime = new Date(currentYear +" "+ currentMonth +" "+currentDay +" "+ "00:00:00").getTime();
                temp.endTime = new Date(currentYear +" "+currentMonth +" "+currentDay +" "+ "23:59:59").getTime();
                resTimeStamp.push(temp);
                resXlist.push(currentYear+"-"+currentMonth+"-"+currentDay);
            }
            response.timestamp = resTimeStamp;
            response.xlist = resXlist;
            return response;
        }
        else if( oDate == "一月")
        {
            for(var j = 30 ; j >= 1 ; j--){
                var timestamp = new Date().setDate(new Date().getDate() -j);
                var currentYear = new Date(timestamp).getFullYear();
                var currentMonth = new Date(timestamp).getMonth() + 1;
                var currentDay = new Date(timestamp).getDate();
                var temp = {};
                temp.startTime = new Date(currentYear +" "+ currentMonth +" "+ currentDay +" "+ "00:00:00").getTime();
                temp.endTime = new Date(currentYear +" "+ currentMonth + " " +currentDay + " " + "23:59:59").getTime();
                resTimeStamp.push(temp);
                resXlist.push(currentMonth + "/" + currentDay);
            }
            response.timestamp = resTimeStamp;
            response.xlist = resXlist;
            return response;
        }
        else if( oDate == "一年")
        {
            var response = {};
            var currentYear = new Date().getFullYear() - 1;
            var currentMonth = new Date().getMonth() + 1;
            var resTimeStamp = new Array();
            var resXlist = new Array();
            for(var i = currentMonth ; i <= 12 ; i++){
                var temp = {};
                temp.startTime = new Date(currentYear + " " + i + " " + "01" + " " + "00:00:00").getTime();
                temp.endTime = new Date(currentYear + " " + i + " " + "31" + " " + "23:59:59").getTime();
                resTimeStamp.push(temp);
                resXlist.push(currentYear + "-" + i);
            }

            currentYear = currentYear + 1;
            for(var j = 1 ; j < currentMonth ; j++){
                var temp = {};
                temp.startTime = new Date(currentYear + " " + j + " " + "01" + " " + "00:00:00").getTime();
                temp.endTime = new Date(currentYear + " " + j + " " + "31" + " " + "23:59:59").getTime();
                resTimeStamp.push(temp);
                resXlist.push(currentYear + "-" + j);
            }

            response.timestamp = resTimeStamp;
            response.xlist = resXlist;

            return response;
        }
    }

    /*解析认证失败统计数据*/
    function analyseAuthFailData(xlist,ylist){

        /*画认证失败折线图*/
        ylist = ylist.failCount || [];
        drawAuthFail(xlist,ylist);
    }

    /*认证失败折线图*/
    function  drawAuthFail(xlist,ylist){

        var option = {
            tooltip : {
                trigger: 'axis'
            },
            grid:{
                y:100
            },
            calculable : true,
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
                    name:'次',
                    type : 'value',
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px", width:2}
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:ylist
                }
            ]
        };

        var oTheme = {
            color:[]
        };
        $("#authFail").echart("init",option);
    }


    /*Portal认证饼状图*/
    function drawPortalAuth(){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:['一键登录','短信认证','微信认证','微信连wifi','固定账号认证']
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
                    data:[
                        {value:235, name:'一键登录'},
                        {value:335, name:'短信认证'},
                        {value:310, name:'微信认证'},
                        {value:274, name:'微信连wifi'},
                        {value:235, name:'固定账号认证'}
                    ]
                }
            ]
        };
        var oTheme = {
            color:[]
        };
        $("#authPortal").echart("init",option);
    }


    /*认证耗时柱状图*/
    function drawAuthTime(){

        var option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['小于1秒','1到3秒','大于3秒']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        name:'日期',
                        type : 'category',
                        data : [6.11,6.12,6.13,6.14,6.15,6.16,6.17]
                    }
                ],
                yAxis : [
                    {
                        name:'次',
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'小于1秒',
                        type:'bar',
                        data:[320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name:'1到3秒',
                        type:'bar',
                        stack: '广告',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'大于3秒',
                        type:'bar',
                        stack: '广告',
                        data:[220, 182, 191, 234, 290, 330, 310]
                    }
                ]
            };
            $("#authTime").echart("init",option);
    }

    function initData(){

        /*获取认证方式分布数据*/
        getAuthSpread();
        /*获取认证失败统计*/
        getAuthFailCount("一周");




        //TODO  暂时为demo,后续修改为真实数据
        drawPortalAuth();
        drawAuthTime();
    }

    function initForm(){

        $("#week").click(function(){
           $("#week").addClass('change');
           $("#month").removeClass('change');
           $("#year").removeClass('change');
           //获取数据
            getAuthFailCount("一周");
        });

        $("#month").click(function(){
            $("#month").addClass('change');
            $("#week").removeClass('change');
            $("#year").removeClass('change');
            //获取数据
            getAuthFailCount("一月");
        });

        $("#year").click(function(){
            $("#year").addClass('change');
            $("#week").removeClass('change');
            $("#month").removeClass('change');
            //获取数据
            getAuthFailCount("一年");
        });
    }

    function _init(){

        initData();
        initForm();
    }

    function _destroy(){

    }


    Utils.Pages.regModule(MODULE_NAME,{
        "init":_init,
        "destroy": _destroy,
        "widgets": ["Echart"],
        "utils":["Base"]
    })

})(jQuery);