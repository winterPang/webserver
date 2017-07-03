;(function ($) {
    var MODULE_NAME     = "wips.summary";
    var g_today         = new Date();
    var g_startTime     = parseInt((new Date(g_today.toDateString()) - 0)/1000);
    var g_endTime       = g_startTime + 24 * 60 * 60;
    var g_day           = 0;

    var g_result        = {AP:{}, Client:{}, Attack:{},Statistics:{}};
    var g_stationClassify   = getRcText("DEVICE_TYPE").split(",");
    g_stationClassify.unshift("");
    var stationClassify = ["","授权AP","配置错误AP","非法AP","外部AP","ad hoc网络",
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


    var ajaxInfo            = {
        url:MyConfig.path + '/ant',
        dataType    :"json",
        type        :"post",
        ACSN        :FrameInfo.ACSN,
        data        : {
            Method:"",
            Param: {
                ACSN:FrameInfo.ACSN,
                StartTime : g_startTime,
                EndTime :g_endTime,
            },
        },
    };


    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("wips_summary_rc", sRcName);
    }
    //获取EndTime
    function getTodayInfo()
    {
        var day = new Date();
        return parseInt((new Date(day.toDateString()) - 0 + 24*60*60*1000)/1000);
    }
    function successInfo()
    {

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

    function errorFunc(name, message)
    {
        console.log(name + ":" + message);
    }

    function successDevice(name, message)
    {
        var sum = 0;
        var msg = [];

        if(name == 'AP')
        {
            g_result.Statistics.RougeAP = 0;
            for(var i = 0; i < message.length; i++)
            {
                var temp = {};

                if(message[i].ClassifyType == 3)
                {
                    g_result.Statistics.RougeAP = Number(message[i].Sum);
                }
                temp.name = g_stationClassify[message[i].ClassifyType] || "unknow";
                temp.value = message[i].Sum;
                msg.push(temp);
                sum += Number(message[i].Sum);
            }

        }
        else
        {
            g_result.Statistics.UnauthorizedClient = 0;
            for(var i = 0; i < message.length; i++)
            {
                var temp = {};
                if(message[i].ClassifyType == 15)
                {
                    g_result.Statistics.UnauthorizedClient = Number(message[i].Sum)
                }

                temp.name = g_stationClassify[message[i].ClassifyType] || "unknow";
                temp.value = Number(message[i].Sum);
                msg.push(temp);
                sum += Number(message[i].Sum);
            }

        }

        g_result[name].info = msg;
        g_result.Statistics[name] = sum;
        if(g_result.AP.info && g_result.Client.info)
        {
            drawDevice();
            drawHead();
            drawPercentChart();
        }
    }

    //获取AP信息
    function getApInfo()
    {
        var today               = getTodayInfo();
        var option              = {
            url:MyConfig.path + '/ant' + "/read_wips_ap",
            dataType    :"json",
            type        :"post",
            ACSN        :FrameInfo.ACSN,
            data        : {
                Method:"GetApClassify",
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime : g_startTime,
                    EndTime :g_endTime,
                },
            },
        };

        option.onSuccess          = function(message){
            successDevice("AP", message.message || []);
        };
        option.onFailed           = function(error){
            successInfo("AP", error);
        };

        Utils.Request.sendRequest(option);
    }

    //获取CLIENT信息
    function getClientInfo()
    {
        var today               = getTodayInfo();
        var option              = {
            url:MyConfig.path + '/ant' + "/read_wips_client",
            dataType    :"json",
            type        :"post",
            ACSN        :FrameInfo.ACSN,
            data        : {
                Method:"GetClientClassify",
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime : g_startTime,
                    EndTime :g_endTime,
                },
            },
        };
        option.onSuccess          = function(message){
            successDevice("Client", message.message || []);
        };
        option.onFailed           = function(error){
            successInfo("Client", error);
        };

        Utils.Request.sendRequest(option);
    }

    //获取Attack信息
    function getAttackInfo()
    {
        var today               = getTodayInfo();
        var option              = {
            url:MyConfig.path + '/ant' + "/read_wips_statistics",
            dataType    :"json",
            type        :"post",
            ACSN        :FrameInfo.ACSN,
            data        : {
                Method:"GetAttackClassify",
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime : g_startTime,
                    EndTime :g_endTime,
                },
            },
        };
        option.onSuccess          = function(message){
            successAttacks("Attack", message.message || []);
        };
        option.onFailed           = function(error){
            successInfo("Attack", error);
        };

        Utils.Request.sendRequest(option);
    }
    //获取攻击和反制总数信息
    function getAttackCtmInfo()
    {
        var today               = getTodayInfo();
        var option              = {
            url:MyConfig.path + '/ant' + "/read_wips_statistics",
            dataType    :"json",
            type        :"post",
            ACSN        :FrameInfo.ACSN,
            data        : {
                Method:"TotalAttackNumber",
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime : g_startTime,
                    EndTime :g_endTime,
                },
            },
        };
        option.onSuccess          = function(message){
            attackAndCtm("Attack", message.message || 0);
        };
        option.onFailed           = function(error){
            successInfo("Attack", error);
        };

        Utils.Request.sendRequest(option);
    }
    function getCtmInfo()
    {
        var today               = getTodayInfo();
        var option              = {
            url:MyConfig.path + '/ant' + "/read_wips_statistics",
            dataType    :"json",
            type        :"post",
            ACSN        :FrameInfo.ACSN,
            data        : {
                Method:"TotalCtmNumber",
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime : g_startTime,
                    EndTime :g_endTime,
                },
            },
        };
        option.onSuccess          = function(message){
            attackAndCtm("Ctm", message.message || 0);
        };
        option.onFailed           = function(error){
            successInfo("Ctm", error);
        };

        Utils.Request.sendRequest(option);
    }
    //攻击反制处理函数
    function attackAndCtm(name, message)
    {
        g_result.Statistics[name] = message;

        drawHead();
    }
    //画攻击
    function drawAttackType()
    {
        var aTypeStr = getRcText("ATTACK_TYPE_LAN").split(",");
        var sFlood = g_result.Attack.FloodNum || 0;
        var sOthers = g_result.Attack.OtherNum || 0;
        var sMalf = g_result.Attack.MalfNum ||0;
        var nSum = sFlood+sOthers+sMalf;
        var aAttackType = [];
        var oTheme = {
            color: []
        };
        var option = {};

        sFlood && aAttackType.push({name:aTypeStr[0], value:sFlood})&&oTheme.color.push('#FBCEB1');
        sMalf && aAttackType.push({name:aTypeStr[1], value:sMalf})&&oTheme.color.push('#C8C3E1');
        sOthers && aAttackType.push({name:aTypeStr[2], value:sOthers})&&oTheme.color.push('#FE808B');
        if(!nSum)
        {
            option = {
                calculable : false,
                height:250,
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius : 75,
                        center: ['50%', '50%'],
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    show:false
                                }
                            }
                        },
                        data: [{name:"",value:1}]
                    }
                ]
            };
            var oTheme = {
                color: [
                    '#F5F5F5'
                ]
            };
        }
        else
        {
            option = {
                calculable : false,
                height:250,

                tooltip : {
                    show:true,
                    formatter: "{b}:<br/> {c} ({d}%)"
                },
                series : [
                    {
                        type: 'pie',
                        radius : 75,
                        center: ['50%', '50%'],
                        itemStyle: {

                            normal: {
                                labelLine:{
                                    length:20
                                },
                                label:
                                {
                                    position:"outer",
                                    textStyle:{
                                        color: "#484A5E",
                                        fontFamily : "HPSimplified",
                                    },
                                }
                            }
                        },
                        data: aAttackType
                    }
                ]
            };
        }
        $("#attackType_pie").echart("init", option, oTheme);
    }

    function drawAttacks()
    {
        if(g_result.Attack)
        {
            drawAttackType();
            var nMalf,nFlood,nOthers;
            var aSeriesData = [ g_result.Attack.Flood, g_result.Attack.Malf, g_result.Attack.Other];
            var oForm = {
                Flood_num: g_result.Attack.FloodNum || 0,
                Malformed_num: g_result.Attack.MalfNum,
                other_num: g_result.Attack.OtherNum || 0
            };
            oForm = Utils.Base.addComma(oForm);
            Utils.Base.updateHtml($("#wips_monitor"), oForm);

            // $("#Flood_num").text();
            // $("#Malformed_num").text();
            // $("#other_num").text();

            var aOption = [];
            var nWidth = $("#malf_attack").parent().width()*0.95;
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
            for(var i=0; i<3; i++)
            {
                var nEnd;
                switch(i){
                    case 0:
                        nEnd = 100*5/(aAllTitleLan[0].length || 1);
                        break;
                    case 1:
                        nEnd = 100*5/(aAllTitleLan[1].length || 1);
                        break;
                    case 2:
                        nEnd = 100*5/(aAllTitleLan[2].length || 1);
                        break;
                }
                for(var m = 0; m < 5 - aAllTitleLan[i].length; m++)
                {
                    aAllTitleLan[i].unshift("");
                    aSeriesData[i].unshift({name:"",value:""});
                }
                var opt = {
                    color: [aColorList[i]],
                    tooltip : {
                        show:false,
                        trigger: 'axis'
                    },
                    height:210,
                    calculable : false,

                    yAxis : [
                        {
                            show : false,
                            axisTick:false,
                            type : 'category',
                            data: aAllTitleLan[i],
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
                        x:3,
                        y:10,
                        x2:60,
                        y2:15
                    },
                    series : [
                        {
                            name:'Number',
                            type:'bar',
                            data:aSeriesData[i],
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
                            data:aSeriesData[i],
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
            }
            $("#flood_attack").echart("init", aOption[0]);
            $("#malf_attack").echart("init", aOption[1]);
            $("#other_attack").echart("init", aOption[2]);
        }
    }
    //画头部
    function drawHead()
    {
        if(g_result.Statistics.hasOwnProperty("AP") && g_result.Statistics.hasOwnProperty("Client") && 
            g_result.Statistics.hasOwnProperty("Attack") && g_result.Statistics.hasOwnProperty("Ctm"))
        {
            $("#Title_top1 ").text(g_result.Statistics.Client);
            $("#Title_top2 ").text(g_result.Statistics.UnauthorizedClient);
            $("#Title_top3 ").text(g_result.Statistics.AP);
            $("#Title_top4 ").text(g_result.Statistics.RougeAP);
            $("#Title_top5 ").text(g_result.Statistics.Attack);
            $("#Title_top6 ").text(g_result.Statistics.Ctm);

        }
    }

    //画设备信息
    function drawDevice()
    {
        if(g_result.AP.info && g_result.Client.info)
        {
            var aComData = [];
            aComData = aComData.concat(g_result.AP.info,g_result.Client.info);
            if(!aComData.length)
            {
                var option = {
                    calculable : false,
                    height:300,
                    tooltip : {
                        show:false
                    },
                    series : [
                        {
                            type: 'pie',
                            radius :75,
                            center: ['50%', '50%'],
                            itemStyle: {
                                normal: {
                                    labelLine:{
                                        show:false
                                    },
                                    label:
                                    {
                                        show:false
                                    }
                                }
                            },
                            data: [{name:"",value:1}]
                        }
                    ]
                };
                var oTheme = {color: ["#F5F5F5"]};
            }
            else
            {
                var option = {
                    height: 300,
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} <br/> {c} ({d}%)"
                    },
                    calculable : false,
                    series : [
                        {
                            type:'pie',
                            center: ['50%', '50%'],
                            radius : 75,
                            minAngle:15,
                            itemStyle: {

                                normal: {
                                    labelLine:{
                                        length:20
                                    },
                                    label:
                                    {
                                        position:"outer",
                                        textStyle:{
                                            color: "#484A5E",
                                            fontFamily : "HPSimplified",
                                        },
                                    }
                                }
                            },
                            data:aComData
                        }
                    ]
                };
                var oTheme = {
                    color: [
                        '#4EC1B2','#5FC7B9','#70CDC1','#81D3C8','#92D9CF',
                        '#A2DFD7','#B3E5DE','#C4EBE5','#D5F1ED','#E6F7F4',
                        '#B3B7DD','#C0C3E3','#CCCFE8','#D9DBEE','#E6E7F4',
                        '#F2F3F9'
                    ]
                };
                oTheme.color.splice(g_result.AP.info.length, 10-g_result.AP.info.length);
            }
            $("#device_pie").echart().echart("init", option, oTheme);
        }
    }

    //画AP、client
    function drawPercentChart()
    {
        var apNum = g_result.Statistics.AP || 0;
        var clientNum = g_result.Statistics.Client || 0;
        var nval = ((apNum*100/(apNum + clientNum)).toFixed(2) - 0) || 0;
        var nclientVal = ((clientNum*100/(apNum + clientNum)).toFixed(2) - 0) || 0;

        $("#Total_ap").text(apNum);
        $("#Total_client").text(clientNum);

        var labelTopAp = {
            normal:{
                color:'#4ECFB2',

                label:{
                    show:false,
                    position:'center',
                    formatter:'{b}',
                    textStyle:{
                        baseline:'bottom'
                    },
                },
                labelLine:{
                    show:false
                }
            }
        };
        var labelTopClient = {
            normal:{
                color:'#B3B7DD',

                label:{
                    show:false,
                    position:'center',
                    formatter:'{b}',
                    textStyle:{
                        baseline:'bottom'
                    },
                },
                labelLine:{
                    show:false
                }
            }
        };

        var labelBottom = {
            normal: {
                color:'#F5F5F5',

                label: {
                    show:true,
                    position:'center',

                },
                labelLine:{
                    show:false
                },

            },
            emphasis:{
                color:'rgba(0,0,0,0)'
            }
        };
        var apname= [
            {name:"AP", value:nval, itemStyle:labelTopAp},
            {name:"other", value:100-nval, itemStyle:labelBottom}

        ];
        var clientname= [
            {name:"客户端", value:nclientVal, itemStyle:labelTopClient},
            {name:"other", value:100-nclientVal, itemStyle:labelBottom}
        ];

        var radius = ['35%','45%'];
        var APopt = {
            calculable : false,
            height:300,
            series : [
                {
                    type: 'pie',
                    radius : radius,
                    center: ['50%', '50%'],
                    itemStyle: {normal: {
                        label: {
                            formatter:nval + '%',
                            textStyle: {
                                baseline: ''
                            }
                        }
                    }} ,
                    data: apname
                }
            ]

        };
        var Clientopt = {
            calculable : false,
            height:300,
            series : [
                {
                    type: 'pie',
                    radius : radius,
                    center: ['50%', '50%'],
                    itemStyle: {normal: {
                        label: {
                            formatter:nclientVal + '%',
                            textStyle: {
                                baseline: ''
                            }
                        }
                    }} ,
                    data: clientname
                }
            ]

        };

        $("#Device_block").echart("init", APopt);
        $("#Device_block2").echart("init", Clientopt);

    }


    function  initData()
    {
        g_result  = {AP:{}, Client:{}, Attack:{},Statistics:{}};
        getApInfo();
        getClientInfo();
        getAttackInfo();
        getAttackCtmInfo();
        getCtmInfo();
    }

    function initForm()
    {
     
        $("#client_details").on("click",function()
        {
            Utils.Base.redirect ({np:$(this).attr("href")});
            return false;

        });

        $(".box-footer img", "#wips_monitor").on("click", function(){
            $(".top-box").toggleClass("hide");

        });

        $(".ant-time-zone input:radio").change(function() {
            $("label[for='WT5']").addClass("set-color");
            $("#daterange").val("");
            var value = $(this).val();
            var daynow = new Date();
            var dayStart = parseInt((new Date(daynow.toDateString()) - 0)/1000);
            switch(Number(value))
            {
                case 0:
                {
                    g_startTime = dayStart;
                    g_endTime   = dayStart + 24 * 60 * 60 ;
                    break;
                }                    
                case 1:
                {
                    g_startTime = dayStart - 8 * 24 *60 *60;
                    g_endTime   = dayStart;
                    break;
                }
                case 2:
                {
                    g_startTime = dayStart - 31 * 24 *60 *60;
                    g_endTime   = dayStart;
                    break;
                }
                case 3:
                {
                    g_startTime = dayStart - 366 * 24 *60 *60;
                    g_endTime   = dayStart;
                    break;
                }
            }
            initData();
        });

        $("#daterange", "#wips_monitor").on("inputchange.datarange", function(e){
            $("#WT5").attr("checked", true);
            var orange = $(this).daterange("getRangeData");
            var startTime = new Date(orange.startData);
            var endTime = new Date(orange.endData);
            var today = new Date() - 0;

            $("#cycle_date").text("("+orange.startData + "~" + orange.endData+")");
            $("label[for='WT5']").removeClass("set-color");

            g_startTime = parseInt((startTime - 0)/1000);
            g_endTime   = parseInt((endTime - 0)/1000) + 24 * 60 * 60;

            initData();
        });

        $("#help_detail",".page-row").on("click",function(e){
            Utils.Base.openDlg(null, {}, {scope:$("#helpdetail"),className:"modal-super"});
        });
        $("#helpform").form("init", "edit",
            {"title": "帮助",
            "btn_apply":false
        });

    }
    function _init()
    {
        initForm();
        initData();
    };

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_today         = new Date();
        g_startTime     = parseInt((new Date(g_today.toDateString()) - 0)/1000);
        g_endTime       = g_startTime + 24 * 60 * 60;
        g_day           = 0;

        g_result        = {AP:{}, Client:{}, Attack:{},Statistics:{}};
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        $("#client_details").off();
        $(".box-footer img", "#wips_monitor").off();
        $(".#WT1,.#WT2,.#WT3,.#WT4,.#WT5", "#wips_monitor").off();
        $("#daterange", "#wips_monitor").off();
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Form","Echart","SingleSelect","DateTime","DateRange","SList"],
        "utils":["Request","Base","Msg"],
    });
})( jQuery );

