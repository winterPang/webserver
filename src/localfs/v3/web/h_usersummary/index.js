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
    var MODULE_NAME = "h_usersummary.index";

    function getDoubleStr(num)
    {
        return num >=10 ? num:"0"+num;
    }

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("custom_rc", sRcName);
    }

    function initGrid()
    {

    }



    function initData()
    {

    }

    function initForm(){

    }

    function initUserTotal_chart(aInData)
    {
        var aseries = [];
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol : "none",
            showAllSymbol: true,
            symbolSize : 2,
            itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
            name: "终端数",
            data: aInData
            };
        aseries.push(oTemp);
        var option = {
            width:"100%",
            height:"280px",
            tooltip: {
                show: true,
                trigger: 'item',
                formatter:function(params){
                    var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                    if(params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string =params.seriesName + "<br/>" + time + "<br/>" + params.value[1];
                    return string;
                },
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "right",
                textStyle:{color: '#9AD4DC', fontSize:"12px"},
                data:['终端数']
            },
            // legend: {
            //     orient: "horizontal",
            //     y: 0,
            //     x: "right",
            //     textStyle:{color: '#617085', fontSize:"12px"},
            //     data: getRcText("UP_DOWN").split(",")
            // },
            grid: {
                x:60, y:20, x2:22, y2:70,
                borderColor: '#FFF'
            },
            calculable: false,
            //dataZoom: {
            //    show: true,
            //    start : 30,
            //    end : 70,
            //    fillerColor:'#69C4C5',
            //    handleColor:'#617085',
            //    backgroundColor:'#E6F5F6'
            //},

            xAxis: [
                {
                    type: 'time',
                    splitLine:true,
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#617085', fontSize:"12px"},
                        formatter:function(data){
                            return getDoubleStr(data.getHours()) + ":"+ getDoubleStr(data.getMinutes());
                        }
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#AEAEB7', width: 1}
                    },
                    axisTick :{
                        show:false
                    }
                }
            ],
            yAxis: [
                {
                    name: "",
                    type: 'value',
                    splitLine : {
                        show : false
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2}
                        //formatter:function(data){
                        //    data = data < 0 ? -data : data;
                        //    return Utils.Base.addComma(data,'rate');
                        //},
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#AEAEB7', width: 1}
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#98D6DA','#B4E2E2'],
            // valueAxis:{
            //     splitLine:{lineStyle:{color:[ '#FFF']}},
            //     axisLabel:{textStyle: {color: [ '#abbbde']}}
            // },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };
        $("#UserTotal_chart").echart ("init", option,oTheme);
    }

    function initUserHis_chart(aData)
    {
        var aseries = [];
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol : "none",
            showAllSymbol: true,
            symbolSize : 2,
            itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
            name: "终端数",
            data: aData
            };
        aseries.push(oTemp);
        var option = {
            width:"100%",
            height:"280px",
            tooltip: {
                show: true,
                trigger: 'item',
                formatter:function(params){
                    var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                    if(params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string =params.seriesName + "<br/>" + time + "<br/>" + params.value[1];
                    return string;
                },
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "right",
                textStyle:{color: '#9AD4DC', fontSize:"12px"},
                data:['终端数']
            },
            // legend: {
            //     orient: "horizontal",
            //     y: 0,
            //     x: "right",
            //     textStyle:{color: '#617085', fontSize:"12px"},
            //     data: getRcText("UP_DOWN").split(",")
            // },
            grid: {
                x:60, y:20, x2:22, y2:70,
                borderColor: '#FFF'
            },
            calculable: false,
            //dataZoom: {
            //    show: true,
            //    start : 30,
            //    end : 70,
            //    fillerColor:'#69C4C5',
            //    handleColor:'#617085',
            //    backgroundColor:'#E6F5F6'
            //},

            xAxis: [
                {
                    type: 'time',
                    splitLine:true,
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#617085', fontSize:"12px"},
                        formatter:function(data){
                            return getDoubleStr(data.getMonth()) + "-"+ getDoubleStr(data.getDate());
                        }
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#AEAEB7', width: 1}
                    },
                    axisTick :{
                        show:false
                    }
                }
            ],
            yAxis: [
                {
                    name: "",
                    type: 'value',
                    splitLine : {
                        show : false
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2}
                        //formatter:function(data){
                        //    data = data < 0 ? -data : data;
                        //    return Utils.Base.addComma(data,'rate');
                        //},
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#AEAEB7', width: 1}
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#98D6DA','#B4E2E2'],
            // valueAxis:{
            //     splitLine:{lineStyle:{color:[ '#FFF']}},
            //     axisLabel:{textStyle: {color: [ '#abbbde']}}
            // },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };
        $("#UserHis_chart").echart ("init", option,oTheme);
    }

    function initUserType_chart(aInData)
    {
        var option = {
            height:280,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['45%','65%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                length:10
                            },
                            label:
                            {
                                position:"outer",
                                textStyle:{
                                        color: "#484A5E"
                                    },
                                formatter: " {b} "
                            }
                        }
                    },
                    data: aInData
                },
            ]
            // ,click:onClickChannelPie    
        };
        var oTheme={
                color: ['#FA5A66','#E483A0','#E28F34','#F7C762','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']     
        };
        $("#UserType_chart").echart ("init", option,oTheme);
        var appendTohtml = [
            '<div class="text-style"><div ',
            '><span style="font-size: 23px;display: block;float: left;margin-left: 2px;">',
            '用户类型',
            '</span>',
            '</div></div>'
            ].join(" ");
        $(appendTohtml).appendTo($("#UserType_chart"));
    }

    /*------------------------------------------------------------------------------*/
    function initUserTime_chart(aInData)
    {
        var option = {
            height:280,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['45%','65%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                length:10
                            },
                            label:
                            {
                                position:"outer",
                                textStyle:{
                                        color: "#484A5E"
                                    },
                                formatter: " {b} "
                            }
                        }
                    },
                    data: aInData
                },
            ]
            // ,click:onClickChannelPie    
        };
        var oTheme={
                color: ['#FA5A66','#E483A0','#E28F34','#F7C762','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']     
        };
        $("#UserTime_chart").echart ("init", option,oTheme);
        var appendTohtml = [
            '<div class="text-style"><div ',
            '><span style="font-size: 23px;display: block;float: left;margin-left: 2px;">',
            '驻留时长',
            '</span>',
            '</div></div>'
            ].join(" ");
        $(appendTohtml).appendTo($("#UserTime_chart"));
    }

    function TerminalType_chart(aInData)
    {
        var option = {
            height:280,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['45%','65%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                length:10
                            },
                            label:
                            {
                                position:"outer",
                                textStyle:{
                                        color: "#484A5E"
                                    },
                                formatter: " {b} "
                            }
                        }
                    },
                    data: aInData
                },
            ]
            // ,click:onClickChannelPie    
        };
        var oTheme={
                color: ['#FA5A66','#E483A0','#E28F34','#F7C762','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']     
        };
        $("#TerminalType_chart").echart ("init", option,oTheme);
        var appendTohtml = [
            '<div class="text-style"><div ',
            '><span style="font-size: 23px;display: block;float: left;margin-left: 2px;">',
            '终端类型',
            '</span>',
            '</div></div>'
            ].join(" ");
        $(appendTohtml).appendTo($("#TerminalType_chart"));
    }
    /*------------------------------------------------------------------------------*/

    function _init(oPara)
    {
        var aInData = [[new Date(2016,2,14,12,23,34),10],
            [new Date(2016,2,14,12,25,34), 30],
            [new Date(2016,2,14,12,26,34), 50],
            [new Date(2016,2,14,12,28,34), 20],
            [new Date(2016,2,14,12,32,34), 100],
            [new Date(2016,2,14,12,35,34), 65],
            [new Date(2016,2,14,12,37,12), 47]
        ];
        var aData = [
            [new Date(2016,2,8,12,23,34),10],
            [new Date(2016,2,9,12,25,34), 30],
            [new Date(2016,2,10,12,26,34), 50],
            [new Date(2016,2,11,12,28,34), 80],
            [new Date(2016,2,12,12,32,34), 54],
            [new Date(2016,2,13,12,35,34), 10],
            [new Date(2016,2,14,12,23,34),10],
            [new Date(2016,2,15,12,25,34), 30],
            [new Date(2016,2,16,12,26,34), 50],
            [new Date(2016,2,17,12,28,34), 60],
            [new Date(2016,2,18,12,32,34), 70],
            [new Date(2016,2,19,12,35,34), 120],
            [new Date(2016,2,20,12,37,12), 47]
        ];
        var aType = [
            {name:'一键认证',value:20},
            {name:'短信认证',value:15},
            {name:'微信公众号认证',value:19},
            {name:'固定帐号认证',value:1},
            {name:'绿洲APP认证',value:11}
        ];

        var aType1 = [
            {name:'1h-2h',value:8},
            {name:'2h-5h',value:2},
            {name:'>5h',value:5},
            {name:'30min',value:15},
            {name:'30min-1h',value:70}
        ];

         var aType2 = [
            {name:'Android',value:20},
            {name:'IOS',value:20},
            {name:'其他',value:40}
        ];
        

        initGrid();
        initData();
        initForm();
        initUserTotal_chart(aInData);
        initUserHis_chart(aData);
        initUserType_chart(aType);
        initUserTime_chart(aType1);
        TerminalType_chart(aType2);
    };

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
        "widgets": ["Echart","Form"],
        "utils": ["Base"]
    });
}) (jQuery);
