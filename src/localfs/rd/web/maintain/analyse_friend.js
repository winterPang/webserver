(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE +".analyse_friend";



    /*用户好友数量分布饼状图*/
    function drawUserFriends(){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'left',
                y : 10,
                data:["jixiaoei","liuchao","test","jinfeng","wushun","chenxu"]
            },
            calculable : false,
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
                    data:[
                        {name:"jixiaoei",value:30},
                        {name:"liuchao",value:50},
                        {name:"test",value:60},
                        {name:"jinfeng",value:80},
                        {name:"wushun",value:40},
                        {name:"chenxu",value:20}
                    ]
                }
            ]
        };
        var oTheme = {};
        $("#userFriends").echart("init",option);
    }

    /*用户添加好友次数统计折线图*/
    function drawAddFriends(){

        var option = {
            tooltip : {
                trigger: 'axis'
            },
            grid:{
                y:100
            },
            legend:{
                data:["liuchao","jixaiowei","jinfeng","xiaoming","test","fyh"]
            },
            calculable : true,
            xAxis : [
                {
                    name:'时间',
                    type : 'category',
                    boundaryGap : false,
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px", width:2}
                    },
                    data :['6.11','6.12','6.13','6.14','6.15','6.16','6.17']
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
                    name:'liuchao',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[11,22,13,24,15,26,17]
                },
                {
                    name:'jixaiowei',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[11,2,3,4,5,6,17]
                },
                {
                    name:'jinfeng',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[5,3,33,44,15,6,17]
                },
                {
                    name:'xiaoming',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[1,2,3,4,5,6,7]
                },
                {
                    name:'test',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[11,25,3,42,5,6,77]
                },
                {
                    name:'fyh',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[14,23,3,42,51,62,71]
                }
            ]
        };
        var oTheme = {
            color:['#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0','#60C0DD']
        };
        $("#addFriends").echart("init",option,oTheme);
    }

    /*用户聊天统计折线图*/
    function drawChatCount(){

        var option = {
            tooltip : {
                trigger: 'axis'
            },
            grid:{
                y:100
            },
            legend:{
                data:["liuchao","jixaiowei","jinfeng","xiaoming","test","fyh"]
            },
            calculable : true,
            xAxis : [
                {
                    name:'时间',
                    type : 'category',
                    boundaryGap : false,
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px", width:2}
                    },
                    data :['6.11','6.12','6.13','6.14','6.15','6.16','6.17']
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
                    name:'liuchao',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[11,22,13,24,15,26,17]
                },
                {
                    name:'jixaiowei',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[11,2,3,4,5,6,17]
                },
                {
                    name:'jinfeng',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[5,3,33,44,15,6,17]
                },
                {
                    name:'xiaoming',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[1,2,3,4,5,6,7]
                },
                {
                    name:'test',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[11,25,3,42,5,6,77]
                },
                {
                    name:'fyh',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[14,23,3,42,51,62,71]
                }
            ]
        };
        var oTheme = {
            color:[]
        };
        $("#chatCount").echart("init",option);
    }


    /*用户消息统计折线图*/
    function drawMessageCount(){

        var option = {
            tooltip : {
                trigger: 'axis'
            },
            grid:{
                y:100
            },
            legend:{
                data:["liuchao","jixaiowei","jinfeng","xiaoming","test","fyh"]
            },
            calculable : true,
            xAxis : [
                {
                    name:'时间',
                    type : 'category',
                    boundaryGap : false,
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px", width:2}
                    },
                    data :['6.11','6.12','6.13','6.14','6.15','6.16','6.17']
                }
            ],
            yAxis : [
                {
                    name:'条',
                    type : 'value',
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#e6e6e6', fontSize:"12px", width:2}
                    }
                }
            ],
            series : [
                {
                    name:'liuchao',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[11,22,13,24,15,26,17]
                },
                {
                    name:'jixaiowei',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[11,2,3,4,5,6,17]
                },
                {
                    name:'jinfeng',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[5,3,33,44,15,6,17]
                },
                {
                    name:'xiaoming',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[1,2,3,4,5,6,7]
                },
                {
                    name:'test',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[11,25,3,42,5,6,77]
                },
                {
                    name:'fyh',
                    type:'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[14,23,3,42,51,62,71]
                }
            ]
        };
        var oTheme = {
            color:[]
        };
        $("#messageCount").echart("init",option);
    }

    /*活跃用户柱状图*/
    function drawActiveUser(){

    var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data:['jixaiowei','jinfeng','liuchao','chengshubei','test_123']
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
                    data : [6.11,6.12,6.13,6.14,6.15,6.16,6.17]
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'jixaiowei',
                    type:'bar',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'jinfeng',
                    type:'bar',
                    stack: '广告',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'liuchao',
                    type:'bar',
                    stack: '广告',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'chengshubei',
                    type:'bar',
                    stack: '广告',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'test_123',
                    type:'bar',
                    stack: '搜索引擎',
                    data:[62, 82, 91, 84, 109, 110, 120]
                }
            ]
        };
        $("#activeUser").echart("init",option);
    }

    function initData(){

        drawUserFriends();
        drawChatCount();
        drawMessageCount();
        drawAddFriends();
        drawActiveUser();
    }


    function _init(){

        initData();
    }

    function _destroy(){

    }


    Utils.Pages.regModule(MODULE_NAME,{
        "init":_init,
        "destroy":_destroy,
        "widgets": ["Echart"],
        "utils":["Request","Base","Msg"]
    })

})(jQuery);