;(function ($) {
    var MODULE_NAME     = "wlanenvironment.summary";
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("chinese_rc", sRcName);
    }

    function drawChannel()
    {
        var option = {
            height:200,
            calculable: true,
            title: {
                x: 20,
                text: 'AP信道质量',
                textStyle:{
                    fontSize: 14,
                    fontWeight: 'bolder',
                    color: '#6C6E6F'
                }
            },
            grid: {
                borderWidth: 0,
                y: 50,
                y2: 20
            },
            yAxis: [
                {
                    type: 'category',
                    show: true,
                    data: ['优', '良', '差']
                }
            ],
            xAxis: [
                {
                    type: 'value',
                    show: true
                }
            ],
            series: [
                {
                    barWidth:10,
                    barMaxWidth:10,
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                var colorList = ['#B5C334','#FCCE10','#C1232B'];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: true,
                                position: 'right',
                                formatter: '{c}'
                            }
                        }
                    },
                    data: [90,8,2]
                }
            ]
        };
        $("#qulity-channel").echart("init",option);
    }
    function drawNetSpeed()
    {
        var option = {
            height:200,
            calculable: true,
            title: {
                x: 20,
                text: '终端网速',
                textStyle:{
                    fontSize: 14,
                    fontWeight: 'bolder',
                    color: '#6C6E6F'
                }
            },
            legend: {
                y : 30,
                data:['上行','下行']
            },
            grid: {
                borderWidth: 0,
                y: 50,
                y2: 30
            },
            yAxis: [
                {
                    type: 'category',
                    show: true,
                    data: ['最高', '平均', '最低']
                }
            ],
            xAxis: [
                {
                    type: 'value',
                    show: true
                }
            ],
            series: [
                {
                    name:"上行",
                    type: 'bar',
                    barWidth:10,
                    barMaxWidth:10,

                    data: [90,8,2]

                },
                {
                    name:"下行",
                    type: 'bar',
                    barWidth:10,
                    barMaxWidth:10,

                    data: [90,8,2]

                }
            ]
        };
        var otheme = {color:['#B5C334','#FCCE10','#C1232B']};
        $("#net-speed").echart("init",option,otheme);
    }

    function drawChannelClassify()
    {
        var option = {
            height:200,
            // legend: {
            //     orient : 'horizontal',
            //     x : 'center',
            //     y : 40,
            //     data:['2.4GHz','5GHz']
            // },
            title: {
                x: 20,
                text: '终端2.4G/5G接入占比',
                textStyle:{
                    fontSize: 14,
                    fontWeight: 'bolder',
                    color: '#6C6E6F'
                }
            },

            calculable : false,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[
                        {value:335, name:'2.4GHz'},
                        {value:310, name:'5GHz'}
                    ]
                }
            ]
        };

        $("#radio-ratio").echart("init",option);
    }
    function drawPacketLossRate()
    {
        var option = {
            height:200,
            // legend: {
            //     orient : 'horizontal',
            //     x : 'center',
            //     y : 40,
            //     data:['丢包数','发送包数']
            // },
            title: {
                x: 20,
                text: '终端丢包率',
                textStyle:{
                    fontSize: 14,
                    fontWeight: 'bolder',
                    color: '#6C6E6F'
                }
            },

            calculable : false,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[
                        {value:335, name:'丢包数'},
                        {value:310, name:'发送包数'}
                    ]
                }
            ]
        };

        $("#packet-loss-rate").echart("init",option);
    }
    function drawAssociateFailRate()
    {
        var option = {
            height:200,
            // legend: {
            //     orient : 'horizontal',
            //     x : 'center',
            //     y : 40,
            //     data:['关联失败','关联成功']
            // },
            title: {
                x: 20,
                text: '关联失败率',
                textStyle:{
                    fontSize: 14,
                    fontWeight: 'bolder',
                    color: '#6C6E6F'
                }
            },

            calculable : false,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[
                        {value:335, name:'关联失败'},
                        {value:310, name:'关联成功'}
                    ]
                }
            ]
        };

        $("#assosciation-rate").echart("init",option);
    }

    function drawChannelOccupancy()
    {
        var option = {
            height:200,
            // legend: {
            //     orient : 'horizontal',
            //     x : 20,
            //     y : 40,
            //     data:['高','中','低']
            // },
            title: {
                x: 20,
                text: '信道占用率',
                textStyle:{
                    fontSize: 14,
                    fontWeight: 'bolder',
                    color: '#6C6E6F'
                }
            },

            calculable : false,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[
                        {value:335, name:'高'},
                        {value:335, name:'中'},
                        {value:310, name:'低'}
                    ]
                }
            ]
        };


        $("#channel-occupancy-rate").echart("init",option);       
    }
    function drawChannelJamming()
    {
        var option = {
            height:200,
            // legend: {
            //     orient : 'horizontal',
            //     x : 'center',
            //     y : 40,
            //     data:['强','中','弱']
            // },
            title: {
                x: 20,
                text: '信道干扰率',
                textStyle:{
                    fontSize: 14,
                    fontWeight: 'bolder',
                    color: '#6C6E6F'
                }
            },

            calculable : false,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[
                        {value:335, name:'强'},
                        {value:335, name:'中'},
                        {value:310, name:'弱'}
                    ]
                }
            ]
        };

        $("#channel-jamming-rate").echart("init",option);       
    }
    function drawRssiRatio()
    {
        var option = {
            height:200,
            title: {
                x: 20,
                text: '弱信号比',
                textStyle:{
                    fontSize: 14,
                    fontWeight: 'bolder',
                    color: '#6C6E6F'
                }
            },
            // legend: {
            //     orient : 'horizontal',
            //     x : 'center',
            //     y:40,
            //     data:['信号强','信号中','信号弱']
            // },

            calculable : false,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[
                        {value:335, name:'信号强'},
                        {value:335, name:'信号中'},
                        {value:310, name:'信号弱'}
                    ]
                }
            ]
        };

        $("#rssi-ratio").echart("init",option);
    }

    function drawApStationList()
    {
        $("#apList").empty();
        var aphead = {
            colNames    : Utils.Base.getRcString("chinese_rc","AP_HEADER"),
            showHeader  : true,
            search      :true,
            pageSize    :8,
            colModel    : [
                {name: "ApName", datatype:"String"},
                {name: "CPU", datatype:"String"},
                {name: "Memory", datatype:"String"},
                {name: "Temprature", datatype:"String"},
                {name: "Status",  datatype:"Order",data:getRcText("STATUS_ON_OFF")}
            ]
        }

        $("#apList").SList("head",aphead);

        var data = [
            {ApName:"ap1", CPU:"20%", Memory:"30%",Temprature:"20度",Status:0},
            {ApName:"ap2", CPU:"20%", Memory:"30%",Temprature:"20度",Status:0},
            {ApName:"ap3", CPU:"20%", Memory:"30%",Temprature:"20度",Status:0},
            {ApName:"ap4", CPU:"20%", Memory:"30%",Temprature:"20度",Status:0},
            {ApName:"ap5", CPU:"20%", Memory:"30%",Temprature:"20度",Status:0},
            {ApName:"ap6", CPU:"20%", Memory:"30%",Temprature:"20度",Status:0},
            {ApName:"ap7", CPU:"20%", Memory:"30%",Temprature:"20度",Status:0},
        ];
        $("#apList").SList("refresh",data);
    }

    function initForm()
    {
        $("#ApStationForm").form("init", "edit", {
            "title": "AP系统状态",
            "btn_apply":false,
            "btn_cancel":true,
            "btn_close":true
        });
        $("#cpu_info").on("click",function(){
            Utils.Base.openDlg(null, {}, {scope:$("#ApStationDlg"),className:"modal-super"});
            drawApStationList();
        });
    }
    function initData()
    {
        drawChannel();
        drawNetSpeed();
        drawChannelClassify();
        initForm();
        drawRssiRatio();
        drawAssociateFailRate();
        drawPacketLossRate();
        drawChannelOccupancy();
        drawChannelJamming();

    }

    function _init()
    {
        initData();
    };

    function _resize(jParent)
    {
    }

    function _destroy()
    {


    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Form","Echart","SList"],
        "utils":["Request","Base","Msg"],
    });
})( jQuery );

