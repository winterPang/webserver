;(function ($) {
    var MODULE_NAME = "city_wips.detail";
    var g_result        = { Device:{}, Attack:{},Statistics:{}};
    var g_stationClassify = ["","授权AP","配置错误AP","非法AP","外部AP","ad hoc网络",
        "mesh网络","潜在授权AP","潜在非法AP","潜在外部AP","无法确认的AP","授权客户端",
        "未授权客户端","误关联客户端","未分类客户端"];
    var g_allAttack         = [[   "",                                          /*0*/
        "AP仿冒攻击",                                /*1*/
        "",                                          /*2*/
        "",                                          /*3*/
        "Client仿冒攻击",                            /*4*/
        "" ,                                         /*5*/
        "Weak IV攻击",                               /*6*/
        "Windows网桥攻击",                           /*7*/
        "客户端开启了禁用802.11n 40MHz模式攻击",     /*8*/
        "软AP攻击",                                  /*9*/
        "客户端节电攻击",                            /*10*/
        "Omerta攻击",                                /*11*/
        "解关联攻击",                                /*12*/
        "解认证攻击",                                /*13*/
        "非法信道攻击",                              /*14*/
        "AP扮演者攻击",                              /*15*/
        "未加密授权AP攻击",                          /*16*/
        "未加密的信任客户端",                        /*17*/
        "热点攻击",                                  /*18*/
        "绿野模式攻击",                              /*19*/
        "关联/重关联DoS攻击",                        /*20*/
        "蜜罐AP攻击",                                /*21*/
        "中间人攻击",                                /*22*/
        "无线网桥攻击",                              /*23*/
        "AP泛洪攻击",                                /*24*/
        "AP信道变化攻击",                            /*25*/
        ""                                           /*26*/
    ],
        [   "Association-request帧",         /*0*/
            "Authentication帧",              /*1*/
            "Beacon帧",                      /*2*/
            "Block ACK帧",                   /*3*/
            "CTS帧",                         /*4*/
            "Deauthentication帧" ,           /*5*/
            "Disassociation帧",              /*6*/
            "EAPOL-Start帧",                 /*7*/
            "Null-data帧",                   /*8*/
            "Probe-request帧",               /*9*/
            "Reassociation-request帧",       /*10*/
            "RTS帧",                         /*11*/
            "EAPOL-Logoff帧",                /*12*/
            "EAP Fail帧",                    /*13*/
            "EAP Success帧",                 /*14*/
        ],
        [   "IE重复的畸形报文",                                       /*0*/
            "Fata-Jack畸形报文",                                      /*1*/
            "IBSS和ESS置位异常的畸形报文",                            /*2*/
            "源地址为广播或者组播的认证和关联畸形报文",               /*3*/
            "畸形Association-request报文",                            /*4*/
            "畸形Authentication报文" ,                                /*5*/
            "含有无效原因值的解除认证畸形报文",                       /*6*/
            "含有无效原因值的解除关联畸形报文",                       /*7*/
            "畸形HT IE报文",                                          /*8*/
            "IE长度非法的畸形报文",                                   /*9*/
            "报文长度非法的畸形报文",                                 /*10*/
            "Duration字段超大的畸形报文",                             /*11*/
            "无效探查响应报文",                                       /*12*/
            "key长度超长的EAPOL报文",                                 /*13*/
            "SSID长度超长的畸形报文",                                 /*14*/
            "多余IE畸形报文"                                          /*15*/
        ]
    ];

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("wips_rc", sRcName).split(",");
    }

    function successDevice(name, message)
    {
        var sum = 0;
        var msg = [];

        g_result.Statistics.RougeAP = 0;
        g_result.Statistics.UnauthorizedClient = 0;
        for(var i = 0; i < message.length; i++)
        {
            var temp = {};

            if(message[i].ClassifyType == 3)
            {
                g_result.Statistics.RougeAP = Number(message[i].Sum);
            }
            if(message[i].ClassifyType == 15)
            {
                g_result.Statistics.UnauthorizedClient = Number(message[i].Sum)
            }
            temp.name = g_stationClassify[message[i].ClassifyType] || "unknow";
            temp.value = message[i].Sum;
            msg.push(temp);
            sum += Number(message[i].Sum);
        }

        g_result[name].info = msg;
        g_result.Statistics[name] = sum;
        if(g_result.Device.info)
        {
            drawDevice();
        }
    }

    function drawDevice()
    {
        if(g_result.Device.info)
        {
            var aAllTitleLan =[];
            var nWidth = $("#attackinfo_bar").parent().width()*0.95;
            if(g_result.Device.info.length)
            {
                var nEnd;
                for(var j = 0 ; j < g_result.Device.info.length; j++)
                {
                    aAllTitleLan.push(g_result.Device.info[j].name);
                }
                nEnd = 100*5/(aAllTitleLan.length || 1);

                for(var m = 0; m < 5 - aAllTitleLan.length; m++)
                {
                    aAllTitleLan.unshift("");
                    g_result.Device.info.unshift({name:"",value:""});
                }
                var option = {
                    color: ["#FBCEB1"],
                    tooltip : {
                        show:false,
                        trigger: 'axis'
                    },
                    height:280,
                    calculable : false,

                    yAxis : [
                        {
                            show : false,
                            axisTick:false,
                            type : 'category',
                            data: aAllTitleLan,
                            splitLine : false,
                            axisLine:false
                        }
                    ],
                    xAxis: [
                        {
                            type:"value",
                            axisLabel:false,
                            splitLine : false,
                            axisLine:false
                        }
                    ],

                    grid:{
                        borderWidth:0,
                        x:25,
                        y:10,
                        x2:80,
                        y2:15
                    },
                    series : [
                        {
                            name:'Number',
                            type:'bar',
                            data:g_result.Device.info,
                            itemStyle : {
                                normal: {
                                    label : {
                                        show: true,
                                        position: 'right',
                                        formatter: function(x){
                                            return x.value;
                                        },
                                        textStyle: {
                                            color:"#a7b7c1"
                                        }
                                    }
                                },
                                emphasis:{
                                }
                            }
                        },
                        {
                            name:'Number',
                            type:'bar',
                            data:g_result.Device.info,
                            color:'rgba(0,0,0,0)',
                            itemStyle : {
                                normal: {
                                    label : {
                                        show: true,
                                        position: 'insideLeft',
                                        formatter: function(x){return x.name;},
                                        textStyle: {color:"#47495d"}
                                    },
                                    color: 'rgba(0,0,0,0)'
                                },
                                emphasis: {
                                    label : {
                                        show: true,
                                        formatter: function(x){return x.name;},
                                        textStyle: {color:"#47495d"}
                                    }
                                    , color: 'rgba(0,0,0,0)'
                                }
                            }

                        }
                    ]
                };
                if(nEnd < 100){
                    option.dataZoom = {
                        show : true,
                        realtime : true,
                        start : 0,
                        end : nEnd,
                        zoomLock: true,
                        orient: "vertical",
                        width: 5,
                        x: nWidth+20,
                        backgroundColor:'#F7F9F8',
                        fillerColor:'#bec6cf',
                        handleColor:'#bec6cf',
                        border:'none'
                    };
                }
                $("#deviceinfo_bar").echart("init", option);
            }

        }
    }
    function successAttacks(name, Message)
    {
        var message = Message || [];
        var msg = {Flood:[], Malf:[], Other:[], FloodNum:0, MalfNum:0, OtherNum:0};

        for(var i = 0; i < message.length; i++)
        {
            var temp = {};
            if(!g_allAttack[Number(message[i].Type)] || !g_allAttack[Number(message[i].Type)][Number(message[i].SubType)])
            {
                continue;
            }
            temp.name = g_allAttack[Number(message[i].Type)][Number(message[i].SubType)];
            temp.value = message[i].Count - 0;
            switch(message[i].Type - 0)
            {
                case 1:
                {
                    if(temp.name)
                    {
                        msg.Flood.push(temp);
                    }
                    msg.FloodNum += temp.value;
                    break;
                }
                case 2:
                {
                    if(temp.name)
                    {
                        msg.Malf.push(temp);
                    }
                    msg.MalfNum += temp.value;
                    break;
                }
                case 0:
                {
                    if(temp.name)
                    {
                        msg.Other.push(temp);
                    }
                    msg.OtherNum += temp.value;
                    break;
                }
            }

        }

        g_result[name] = msg;

        drawAttacks();
    }
    function drawAttacks()
    {
        if(g_result.Attack)
        {
            var nMalf,nFlood,nOthers;
            var aSeriesData = [ g_result.Attack.Flood, g_result.Attack.Malf, g_result.Attack.Other];
            var oForm = {
                Flood_num: g_result.Attack.FloodNum || 0,
                Malformed_num: g_result.Attack.MalfNum,
                other_num: g_result.Attack.OtherNum || 0
            };
            oForm = Utils.Base.addComma(oForm);
            Utils.Base.updateHtml($("#city_wips"), oForm);

            // $("#Flood_num").text();
            // $("#Malformed_num").text();
            // $("#other_num").text();

            var aOption = [];
            var nWidth = $("#attackinfo_bar").parent().width()*0.95;
            var aColorList = ["#FBCEB1", "#C8C3E1", "#FE808B"];
            var aAllTitleLan = [];
            for(var j = 0 ; j < aSeriesData.length; j++)
            {
                var temp = [];
                for(var k = 0; k < aSeriesData[j].length; k++)
                {
                    temp.push(aSeriesData[j][k].name);
                }
                aAllTitleLan.push(temp);
            }
            var nEnd;
            nEnd = 100*5/(aAllTitleLan[2].length || 1);

            for(var m = 0; m < 5 - aAllTitleLan[2].length; m++)
            {
                aAllTitleLan[2].unshift("");
                aSeriesData[2].unshift({name:"",value:""});
            }
            var opt = {
                color: [aColorList[2]],
                tooltip : {
                    show:false,
                    trigger: 'axis'
                },
                height:280,
                calculable : false,

                yAxis : [
                    {
                        show : false,
                        axisTick:false,
                        type : 'category',
                        data: aAllTitleLan[2],
                        splitLine : false,
                        axisLine:false
                    }
                ],
                xAxis: [
                    {
                        type:"value",
                        axisLabel:false,
                        splitLine : false,
                        axisLine:false
                    }
                ],

                grid:{
                    borderWidth:0,
                    x:25,
                    y:10,
                    x2:80,
                    y2:15
                },
                series : [
                    {
                        name:'Number',
                        type:'bar',
                        data:aSeriesData[2],
                        itemStyle : {
                            normal: {
                                label : {
                                    show: true,
                                    position: 'right',
                                    formatter: function(x){
                                        return x.value;
                                    },
                                    textStyle: {
                                        color:"#a7b7c1"
                                    }
                                }
                            },
                            emphasis:{
                            }
                        }
                    },
                    {
                        name:'Number',
                        type:'bar',
                        data:aSeriesData[2],
                        color:'rgba(0,0,0,0)',
                        itemStyle : {
                            normal: {
                                label : {
                                    show: true,
                                    position: 'insideLeft',
                                    formatter: function(x){return x.name;},
                                    textStyle: {color:"#47495d"}
                                },
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                label : {
                                    show: true,
                                    formatter: function(x){return x.name;},
                                    textStyle: {color:"#47495d"}
                                }
                                , color: 'rgba(0,0,0,0)'
                            }
                        }

                    }
                ]
            };
            if(nEnd < 100){
                opt.dataZoom = {
                    show : true,
                    realtime : true,
                    start : 0,
                    end : nEnd,
                    zoomLock: true,
                    orient: "vertical",
                    width: 5,
                    x: nWidth,
                    backgroundColor:'#F7F9F8',
                    fillerColor:'#bec6cf',
                    handleColor:'#bec6cf',
                    border:'none'
                };
            }
            aOption.push(opt);

            $("#attackinfo_bar").echart("init", aOption[0]);
        }
    }
    function initData()
    {


    }
    function getDoubleStr(num) {
        return num >= 10 ? num : "0" + num;
    }
    function drawAttackLine()
    {
        var a = [];
        var len = 0;
        while (len++ < 14) {
            a.push([
                new Date(2016, 6, 11, 8,0, len * 3600),
                parseInt(Math.random() * 3000)
            ]);
        }
        var adata =[];
        for(i=0;i< a.length;i++)
        {
            var temp ={};
            temp.name = (a[i][0].getHours()) + ":" + getDoubleStr(a[i][0].getMinutes());
            temp.value = a[i][1];
            adata.push(temp);
        }
        var option = {

            title : {
                text: ''
            },
            tooltip : {
                trigger: 'axis',
                formatter: function (params){
                    return params.name + '<br/>'
                        + params.seriesName + ' : ' + params.value[1]
                }
            },
            legend: {
                data:['检测到的攻击次数']
            },
            calculable : true,
            xAxis : [
                {
                    type : 'time',
                    splitNumber: a.length,
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px"},
                        formatter: function (data) {
                            console.log(data);
                            return (data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                        }
                    }
                }
            ],
            grid:{x2:450},
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : [
                {
                    name:'检测到的攻击次数',
                    type:'line',
                    data:a,
                    smooth:true,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }
                },
                {
                    type:'pie',

                    tooltip : {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    center: ['80%','50%'],
                    radius : [0, 70],
                    itemStyle :　{
                        normal : {
                            labelLine : {
                                length : 20
                            }
                        }
                    },
                    data:adata
                }

            ]
        };


        $("#attack_line").echart("init", option);

    }
    function drawAttackLineByWeek()
    {
        var a = [];
        var len = 0;
        var value;
        while (len++ < 7) {

            a.push([
                new Date(2016, 6, 4, len * 24,0,0),
                parseInt(Math.random() * 3000)
            ]);
        }
        var adata =[];
        for(i=0;i< a.length;i++)
        {
            var temp ={};
            temp.name = (a[i][0].getMonth() + 1) + "-" + a[i][0].getDate();
            temp.value = a[i][1];
            adata.push(temp);
        }
        var option = {

            title : {
                text: ''
            },
            tooltip : {
                trigger: 'axis',
                formatter: function (params){
                    return params.name + '<br/>'
                        + params.seriesName + ' : ' + params.value[1]
                }
            },
            legend: {
                data:['检测到的攻击次数']
            },
            calculable : true,
            xAxis : [
                {
                    type : 'time',
                    splitNumber: a.length,
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px"},
                        formatter: function (data) {
                            console.log(data);
                            return (data.getMonth() + 1) + "-" + data.getDate();
                        }
                    }
                }
            ],
            grid:{x2:450},
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : [
                {
                    name:'检测到的攻击次数',
                    type:'line',
                    data:a,
                    smooth:true,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }
                },
                {
                    type:'pie',

                    tooltip : {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    center: ['80%','50%'],
                    radius : [0, 70],
                    itemStyle :　{
                        normal : {
                            labelLine : {
                                length : 20
                            }
                        }
                    },
                    data:adata
                }

            ]
        };


        $("#attack_line").echart("init", option);

    }
    function drawAttackLineByYear()
    {
        var a = [];
        var len = 0;
        var nowDate =new Date();
        var count =nowDate.getMonth();
        while (len++ <= count) {
            a.push([
                new Date(2016, 1*len, 1, 0,0, 0),
                parseInt(Math.random() * 3000)
            ]);
        }
        var adata =[];
        for(i=0;i< a.length;i++)
        {
            var temp ={};
            temp.name = (a[i][0].getFullYear()) + "-" + getDoubleStr(a[i][0].getMonth()+1);
            temp.value = a[i][1];
            adata.push(temp);
        }
        var option = {

            title : {
                text: ''
            },
            tooltip : {
                trigger: 'axis',
                formatter: function (params){
                    return params.name + '<br/>'
                        + params.seriesName + ' : ' + params.value[1]
                }
            },
            legend: {
                data:['检测到的攻击次数']
            },
            calculable : true,
            xAxis : [
                {
                    type : 'time',
                    splitNumber: a.length,
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px"},
                        formatter: function (data) {
                            console.log(data);
                            return (data.getFullYear()) + "-" + getDoubleStr(data.getMonth()+1);
                        }
                    }
                }
            ],
            grid:{x2:450},
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : [
                {
                    name:'检测到的攻击次数',
                    type:'line',
                    data:a,
                    smooth:true,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }
                },
                {
                    type:'pie',

                    tooltip : {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    center: ['80%','50%'],
                    radius : [0, 70],
                    itemStyle :　{
                        normal : {
                            labelLine : {
                                length : 20
                            }
                        }
                    },
                    data:adata
                }

            ]
        };


        $("#attack_line").echart("init", option);

    }
    $(".ant-time-zone input:radio").change(function()
    {
        var value = $(this).val();

        switch(Number(value))
        {
            case 0:
            {
                drawAttackLine();
                break;
            }
            case 1:
            {
                drawAttackLineByWeek();
                break;
            }
            case 2:
            {
                break;
            }
            case 3:
            {
                drawAttackLineByYear();
                break;
            }
        }
        initData();
    });
    function initForm()
    {
        $("#areaSelect").singleSelect("InitData", ["海淀区", "昌平区", "东城区"]);
        $("#client_details").on("click",function()
        {
            Utils.Base.redirect ({np:$(this).attr("href")});
            return false;

        });
        var jForm = $("#city_wips");
        $("#city_return",jForm).on("click",function()
        {
            Utils.Base.redirect ({np:"city_wips.index"});
            return false;
        });
    }


    function initGrid()
    {

    }
    var attackMessage = [
        {Type:0,SubType:7,Count:100},
        {Type:0,SubType:1,Count:300},
        {Type:0,SubType:4,Count:400},
        {Type:0,SubType:8,Count:700},
        {Type:0,SubType:9,Count:800},
        {Type:0,SubType:10,Count:1100}
    ];
    var deviceMessage = [
        {ClassifyType:7,Sum:100},
        {ClassifyType:1,Sum:300},
        {ClassifyType:4,Sum:400},
        {ClassifyType:8,Sum:700},
        {ClassifyType:9,Sum:800},
        {ClassifyType:10,Sum:1100}
    ];

    function _init()
    {
        initForm();
        successAttacks("Attack",attackMessage);
        successDevice("Device",deviceMessage);
        drawAttackLine();
        initData();
    }

    function _destroy()
    {
        console.log("*******destory*******");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","SingleSelect", "FullCalendar"],
        "utils":["Request","Base"]
    });
})( jQuery );

