;(function ($) {
    var MODULE_NAME = "b_wips.summary";
    var strAnt = MyConfig.path + '/ant';
    var g_a = [];
    var stationClassify = [0,"授权AP","配置错误AP","非法AP","外部AP","ad hoc网络",
        "mesh网络","潜在授权AP","潜在非法AP","潜在外部AP","无法确认的AP","授权客户端",
        "未授权客户端","误关联客户端","未分类客户端"];
    var packetClassify = [[
        "Assoc req",            /*0*/
        "Assoc resp",           /*1*/
        "Reassoc req",          /*2*/
        "Reassoc resp",         /*3*/
        "Probe req",            /*4*/
        "Probe resp",           /*5*/
        0,                      /*6*/
        0,                      /*7*/
        "Beacon",               /*8*/
        0,                      /*9*/
        "Disassoc",             /*10*/
        "Auth",                 /*11*/
        "Deau",                 /*12*/
        ]
        ,[
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        "ACK"
        ]
        ,[
        "Data",
        "Data",
        "Data",
        "Data",
    ]];
    var g_result = {};
    var RougeApType = 3;
    var UnauthoredType = 12;

    var oMessageInit = {
        isExecute:{
            packet:true,
            vendorInfo:true,
            sensorApInfo:true,
            titleHead:true,
            apAndClient:true,
            stationClassify:false,
            titleFirst:true,
            apInfo:true,
            clientInfo:true
        },
        ajaxSendMsg : function(oData, moduleName){
            var oName = moduleName;
            $.ajax({
                url:oData.url,
                dataType: "json",
                type:oData.Type,
                data:oData.data,
                success: function (Data)
                {
                    // if(!g_result[oName])
                    // {
                        g_result[oName] = Data;
                        dealResult();
                    // }
                },
                error: function(error){
                    // g_result[oName] = -1;
                }
            });
        },
        getVendor:function(oData,strVSDname){
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_client",
                Type:"post",
                data:{
                    Method:"GetVendor",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime
                    },
                    Return:{
                    }
                }
            };
            for(var i in oData)
            {
                options.data.Param[i] = oData[i];
            }
            if(strVSDname)
            {
                options.data.Param.VsdName = strVSDname;
            }
            oMessageInit.ajaxSendMsg(options, "VENDOR")
        },
        getSensorNum:function(oData){
            var options = {
                url:strAnt+'/confmgr',
                Type:"post",
                data:{
                    cloudModule:"WIPS",
                    deviceModule:'WIPS',
                    configType:1,
                    devSN:FrameInfo.ACSN,
                    method:"getSensorNum",
                    param:{
                        devSN:FrameInfo.ACSN
                    },
                }
            };
            for(var i in oData)
            {
                options.data.Param[i] = oData[i];
            }

            oMessageInit.ajaxSendMsg(options, "SENSOR_NUM")
        },
        getApList:function() {
            var options = {
                url:MyConfig.path+'/apmonitor/web/aplist',
                Type:"get",
                data:{
                    devSN:FrameInfo.ACSN,
                }
            };
            oMessageInit.ajaxSendMsg(options, "AP_LIST")
        },
        getApClassify:function(strVSDname){
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_ap",
                Type:"post",
                data:{
                    Method:"GetApClassify",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime
                    }
                }
            };
            if(strVSDname)
            {
                options.data.Param.VsdName = strVSDname;
            }
            oMessageInit.ajaxSendMsg(options, "AP_CLASSIFY")

        },
        getClientClassify:function(strVSDname){
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_client",
                Type:"post",
                data:{
                    Method:"GetClientClassify",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime
                    }
                }
            };
            if(strVSDname)
            {
                options.data.Param.VsdName = strVSDname;
            }
            oMessageInit.ajaxSendMsg(options, "CLIENT_CLASSIFY")

        },
        getPacket:function(oData){
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_statistics",
                Type:"post",
                data:{
                    Method:"GetPacket",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime

                    }
                }
            };
            for(var i in oData)
            {
                options.data.Param[i] = oData[i];
            }
            oMessageInit.ajaxSendMsg(options, "PACKET")
        },
        getRougeApNum:function(oData,strVSDname){
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_ap",
                Type:"post",
                data:{
                    Method:"GetSpecifyApNum",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime,
                        ClassifyType:RougeApType
                    }
                }
            };
            if(strVSDname)
            {
                options.data.Param.VsdName = strVSDname;
            }
            oMessageInit.ajaxSendMsg(options, "ROUGE_AP")

        },
        getUnAuthoredClientNum:function(oData,strVSDname){
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_client",
                Type:"post",
                data:{
                    Method:"GetSpecifyClientNum",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime,
                        ClassifyType:UnauthoredType
                    }
                }
            };
            if(strVSDname)
            {
                options.data.Param.VsdName = strVSDname;
            }
            oMessageInit.ajaxSendMsg(options, "UNAUTHORED_CLIENT")

        },
        getApNum:function(oData, strVSDname){
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_ap",
                Type:"post",
                data:{
                    Method:"GetApSum",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime
                    }
                }
            };
            for(var i in oData)
            {
                options.data.Param[i] = oData[i];
            }
            if(strVSDname)
            {
                options.data.Param.VsdName = strVSDname;
            }
            oMessageInit.ajaxSendMsg(options, "AP_SUM")
        },
        getClientNum:function(oData, strVSDname){
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_client",
                Type:"post",
                data:{
                    Method:"GetClientSum",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime
                    }
                }
            };
            for(var i in oData)
            {
                options.data.Param[i] = oData[i];
            }
            if(strVSDname)
            {
                options.data.Param.VsdName = strVSDname;
            }
            oMessageInit.ajaxSendMsg(options, "CLIENT_SUM")

        },
        getApInfo:function(oData, strVSDname)
        {
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_ap",
                Type:"post",
                data:{
                    Method:"GetStationInfo",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime
                    },
                    Return:[
                        "MacAddress",
                        "ClassifyType",
                        "LastReportTime"
                    ]
                }
            }; 
            oMessageInit.ajaxSendMsg(options, "AP_INFO")
        
        },
        getClientInfo:function(oData, strVSDname)
        {
            var oTime = getStartEndTime();
            var options = {
                url:strAnt+"/wips_client",
                Type:"post",
                data:{
                    Method:"GetStationInfo",
                    Param:{
                        ACSN:FrameInfo.ACSN,
                        StartTime:oTime.StartTime,
                        EndTime:oTime.EndTime
                    },
                    Return:[
                        "MacAddress",
                        "ClassifyType",
                        "LastReportTime"
                    ]                
                }
            }; 
            oMessageInit.ajaxSendMsg(options, "CLIENT_INFO")
        
        },   
        dealResult:function(){
            oMessageInit.isExecute.sensorApInfo && g_result.SENSOR_NUM && g_result.AP_LIST && ApAndSensor_pie() && (oMessageInit.isExecute.sensorApInfo = false);
            oMessageInit.isExecute.packet && g_result.PACKET && initPacket_pie() && (oMessageInit.isExecute.packet = false);
            //oMessageInit.isExecute.vendorInfo && g_result.VENDOR && initVendor_pie()&& ( oMessageInit.isExecute.vendorInfo = false);
            oMessageInit.isExecute.titleHead && (g_result.ROUGE_AP>=0) && (g_result.UNAUTHORED_CLIENT>=0) && initTitleHead() && ( oMessageInit.isExecute.titleHead = false);
            oMessageInit.isExecute.apAndClient && g_result.CLIENT_SUM&& (g_result.AP_SUM>=0) && ApAndClientpro_pie() && ( oMessageInit.isExecute.apAndClient = false);
            oMessageInit.isExecute.stationClassify && g_result.AP_CLASSIFY&& g_result.CLIENT_CLASSIFY && initApClientClassify() && ( oMessageInit.isExecute.stationClassify = false);
        }

    };
    function judgeStatus()
    {
        var jedgeHead = $(".head-area-center");
        if(g_result.UNAUTHORED_CLIENT.message || g_result.ROUGE_AP || g_result.OTHER_ATTACK)
        {
            jedgeHead.removeClass("background-wips-icon-good");
            jedgeHead.addClass("background-wips-icon-bad");
            return -1;
        }
        else{
            if(g_result.ATTACK)
            {
                jedgeHead.removeClass("background-wips-icon-good");
                jedgeHead.addClass("background-wips-icon-normal");
                return 0;
            }
            else{
                return 1;
            }
        }
    }

    function dealResult()
    {
        if(oMessageInit.isExecute.sensorApInfo && g_result.SENSOR_NUM && g_result.AP_LIST)
        {
            oMessageInit.isExecute.sensorApInfo = false;
            ApAndSensor_pie();
        } 
        if(oMessageInit.isExecute.packet && g_result.PACKET)
        {
            oMessageInit.isExecute.packet = false;
            initPacket_pie();
        } 
        if(oMessageInit.isExecute.titleHead && (g_result.ROUGE_AP>=0) && (g_result.UNAUTHORED_CLIENT))
        {
            oMessageInit.isExecute.titleHead = false;
            initTitleHead();
        } 
        if(oMessageInit.isExecute.apAndClient && g_result.CLIENT_SUM&& (g_result.AP_SUM>=0))
        {
            oMessageInit.isExecute.apAndClient = false;
            ApAndClientpro_pie();
        }
        if(oMessageInit.isExecute.stationClassify && g_result.AP_CLASSIFY&& g_result.CLIENT_CLASSIFY)
        {
            oMessageInit.isExecute.stationClassify = false;
            initApClientClassify();
        }
        if(oMessageInit.isExecute.titleFirst &&  (g_result.ATTACK >= 0) &&  (g_result.OTHER_ATTACK >= 0) &&
             (g_result.ROUGE_AP>=0) && g_result.UNAUTHORED_CLIENT)
        {
            oMessageInit.isExecute.titleFirst = false;
            judgeStatus();
        }
        if(oMessageInit.isExecute.apInfo && g_result.AP_INFO )
        {
            oMessageInit.isExecute.apInfo = false;
            preDealStationInfo(g_result.AP_INFO);
            dealStationInfo();
        }
        if(oMessageInit.isExecute.clientInfo && g_result.CLIENT_INFO )
        {
            oMessageInit.isExecute.clientInfo = false;
            preDealStationInfo(g_result.CLIENT_INFO.message);
            dealStationInfo();
        }
    }
    function clearSlist(jedge)
    {
        jedge.SList("refresh", [])
    }
    function preDealStationInfo(aData)
    {
        var msg = aData;
        for(var i = 0;i < aData.length; i++)
        {
            var date = new Date(aData[i].LastReportTime * 1000);
            aData[i].ClassifyType = stationClassify[aData[i].ClassifyType];
            aData[i].LastReportTime = date.toLocaleString();
        }
    }
    function dealStationInfo()
    {
        if($("#ap_info").hasClass("active"))
        {
            $("#station_list").SList("refresh", g_result.AP_INFO);
        }
        else{
            $("#station_list").SList("refresh", g_result.CLIENT_INFO.message);
        }
    }
    //获取初始时间
    function getStartEndTime()
    {
        var oDay = new Date();
        var oDayStart = new Date(oDay.getFullYear(), oDay.getMonth(), oDay.getDate());
        return {StartTime:parseInt(oDayStart.getTime()/1000),
            EndTime:parseInt(oDay.getTime()/1000)};
       
    }
    //标题中的数值rouge ap & unauthored client
    function initTitleHead()
    {
        $("#rougeAp_id").text(g_result.ROUGE_AP);
        $("#unauthored_id").text(g_result.UNAUTHORED_CLIENT.message);

    }
    //
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("wips_summary_rc", sRcName);
    }

    //sensor 的 ap
    function ApAndSensor_pie()
    {
        var nAP = g_result.AP_LIST.apList.length || 0;
        var nSensor = 0;
        if(g_result.SENSOR_NUM.result.length)
        {
           nSensor = g_result.SENSOR_NUM.result[0].sensorSum;
        }
        if(nSensor > nAP)
        {
            nSensor = nAP;
        }
        var jEle = $("#sensor_Num");
        sColor = "blue";

        var labelTop = {
            normal:{
                label:{
                    show:true,
                    position:'center',
                    formatter:function(e){return e.name;},
                    textStyle:{
                        baseline:'bottom',
                        color:"black",
                        fontSize:20

                    },
                },
                labelLine:{
                    show:false
                }
            }
        };
        var labelFromatter = {
            normal: {
                label: {
                    formatter:function(e)
                    {return (100 - e.percent) + "%"},
                    textStyle: {
                        baseline: 'top',
                        color:"black",
                        fontSize:20

                    }
                }
            }
        };
        var labelBottom = {
            normal: {
                color:'#ccc',

                label: {
                    show:true,
                    position:'center',

                },
                labelLine:{
                    show:false
                },

            },
            emphasis:{
                color:"rgba(0,0,0,0)"
            }
        };
        var choice = [labelTop,labelBottom]
        var aname= [
            {name:"探测器", value:nSensor, itemStyle:labelTop},
            {name:"AP", value:nAP-nSensor, itemStyle:labelBottom}

        ];

        var radius = ['35%','55%'];
        opt = {
            calculable : false,
            height:275,
            series : [
                {
                    type: 'pie',
                    radius : radius,
                    center: ['50%', '45%'],
                    itemStyle:labelFromatter,
                    data: aname
                }
            ]

        };

        jEle.echart("init", opt);
        return true;
    }
    //AP and Client proportion
    function ApAndClientpro_pie(aData)
    {
        var labelFromatter = {
            normal : {
                label : {
                    textStyle: {
                        color:"black"
                    }
                }
            }
        };
        var option = {};
        var oTheme = {};

        var oTempData = [{value:g_result.CLIENT_SUM.message, name:'Client',itemStyle:labelFromatter},
            {value:g_result.AP_SUM, name:'AP',itemStyle:labelFromatter} ];
        if(g_result.CLIENT_SUM.message == 0 && g_result.AP_SUM == 0 )
        {
            oTempData = [{name:"", value:1}];
            option = {
                calculable : false,
                height:238,
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
            var oTheme = {color: ['#F6F7F8']};
        }
        else
        {
            option = {
                height:275,
                tooltip : {
                    show:true,
                    trigger: 'item',
                    formatter: "{b}<br/> {c} ({d}%)"
                },

                series : [
                    {
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '45%'],
                        data:oTempData
                    }
                ]
            };
            oTheme={
                color: ['#FAD860','#F3A43B','#0096d6','#31ADB4']
            };
         }

       $("#apAndClientPre").echart("init", option,oTheme);
        return true;

    }
    //packet
    function initPacket_pie(aData)
    {
        var packetData = g_result.PACKET.message || [];
        var packetName = [];
        var packetValue = [];
        var dataNum = 0;
        var strChoice = 0;

        var a = [[],[],[]];

        for(var i = 0; i < packetData.length; i++)
        {
            if(packetClassify[packetData[i].Type][packetData[i].SubType] == "Data")
            {
                dataNum += packetData[i].Count;
                continue;
            }

            if(packetClassify[packetData[i].Type][packetData[i].SubType])
            {
                if(a[packetData[i].Type])
                {
                    a[packetData[i].Type][packetData[i].SubType] = packetData[i].Count;
                    if((packetData[i].Count > 1000) && !strChoice)
                    {
                        strChoice = 1;
                    }
                }
            }
        }
        for(var i = 0; i < 13; i++)
        {
            if(i == 6 || i == 7 || i == 9)
            {
                continue;
            }
            packetName.push(packetClassify[0][i]);
            packetValue.push((a[0][i]?a[0][i]:0));

        }
        packetName.push(packetClassify[1][13]);
        packetValue.push((a[1][13]?a[1][13]:0));
        packetName.push("Data");
        packetValue.push(dataNum);
        if((dataNum > 1000) && !strChoice)
        {
            strChoice = 1;
        }
        var option = {
            height:275,
            tooltip:{
                trigger:'item',
                formatter: function(a){
                    switch (a.name)
                    {

                        case "Assoc req":
                        {
                            return a.seriesName + "<br/>" + "Association request" + ":" + a.value;
                            break;
                        }
                        case "Assoc resp":
                        {
                            return a.seriesName + "<br/>" + "Association response" + ":" + a.value;
                            break;
                        }
                        case "Reassoc req":
                        {
                            return a.seriesName + "<br/>" + "Reassociation request" + ":" + a.value;
                            break;
                        }
                        case "Reassoc resp":
                        {
                            return a.seriesName + "<br/>" + "Reassociation response" + ":" + a.value;
                            break;
                        }
                        case "Probe req":
                        {
                            return a.seriesName + "<br/>" + "Reassociation response" + ":" + a.value;
                            break;
                        }
                        case "Probe resp":
                        {
                            return a.seriesName + "<br/>" + "Probe request" + ":" + a.value;
                            break;
                        }
                        case "Beacon":
                        {
                            return a.seriesName + "<br/>" + "Probe response" + ":" + a.value;
                            break;
                        }
                        case "Disassoc":
                        {
                            return a.seriesName + "<br/>" + "Disassociation" + ":" + a.value;
                            break;
                        }
                        case "Auth":
                        {
                            return a.seriesName + "<br/>" + "Authentication" + ":" + a.value;
                            break;
                        }
                        case "Deau":
                        {
                            return a.seriesName + "<br/>" + "Deauthentication" + ":" + a.value;
                            break;
                        }
                        default :
                        {
                            return a.seriesName + "<br/>" + a.name + ":" + a.value;
                            break;
                        }
                    }
                }
            },
            grid: {
                borderWidth: 0,
                x:50,
                x2:30,
                y: 30,
                y2: 80
            },
            xAxis: [
                {
                    type: 'category',
                    show: true,
                    splitLine:{
                        show:false
                    },
                    axisLabel:{
                        show:true,
                        interval:"auto",
                        rotate:45
                    },
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:"#f2f2f2",
                            width:1
                        }
                    },
                    data: packetName
                }
            ],
            yAxis: [
                {
                    type: strChoice?"log":"value",
                    show: true,
                    logLabelBase:2,
                    min:1,
                    // max:1000000,
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:"#f2f2f2",
                            type:"dashed"
                        }
                    },
                    axisLabel:{
                        show:true,
                        textStyle: {
                            color: "#585858"
                        }
                    },
                    axisLine:{
                        show:false,
                        lineStyle:{
                            color:"#f2f2f2",
                            width:1
                        }
                    },

                }
            ],
            series: [
                {
                    name: '报文信息',
                    type: 'bar',
                    barCategoryGap:'40%',
                    itemStyle: {
                        normal: {
                            barBorderRadius:[5,5,0,0],
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },

                        }
                    },
                    data: packetValue ,

                }
            ]
        };

        $("#Message").echart("init", option);
        return true;

    }
    //厂商信息
    function initVendor_pie()
    {
        var aTmpData = [
            {value:40,name: 'Apple'},
            {value:60,name: 'Huawei'},
            {value:60,name: 'MeiZu'}
        ];
        var oVendor = g_result.VENDOR || aTmpData;
        var option = {
            height:275,
            series : [
                {
                    type:'pie',
                    radius : 75,
                    center: ['50%', '45%'],
                    data:oVendor
                }
            ]
        };
        var oTheme={
            color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800']
        };
        $("#vendor_pie").echart("init", option,oTheme);
        return true;
    }
    //ap & client 分类
    function initApClientClassify()
    {
        var aTempData = [];
        var stationAp = g_result.AP_CLASSIFY||[];
        var stationClient = g_result.CLIENT_CLASSIFY.message||[];
        for(var i = 0; i < stationAp.length; i++)
        {
            aTempData.push({value:stationAp[i].Sum, name:stationClassify[stationAp[i].ClassifyType]})
        }
        for(var i = 0; i < stationClient.length; i++)
        {
            aTempData.push({value:stationClient[i].Sum, name:stationClassify[stationClient[i].ClassifyType]})
        }
        if(stationClient.length == 0 && stationAp.length == 0)
        {
            var option = {
                calculable : false,
                height:375,
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius : 100,
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
            var oTheme = {color: ['#F6F7F8']};
        }
        else
        {
            var option = {
                height:375,
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },

                calculable : false,
                series : [
                    {
                        name:'设备分类',
                        type:'pie',
                        radius : [0, 100],
                        data:aTempData,
                    }
                ]
            };
            var oTheme={
                color : ['#999999','#3399cc','#60C0DD','#D7504B','#C6E579', '#F4E001',
                    '#F0805A','#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                    '#FE8463','#9BCA63','#FAD860','#26C0C0','#F3A43B']
            };

        }
        $("#all_classify").echart("init", option, oTheme);
        return true;
    }
    function changeViews(jedge, dest, functionItem)
    {
        var tileID = jedge;
        var itemNum = Number(dest);
        var jedgeItem = $(tileID +" .carousel-inner-new .item");
        $(tileID +" li.active").removeClass("active");
        $(tileID + " li").eq(itemNum).addClass("active");
        jedgeItem.addClass("hidden");
        jedgeItem.eq(itemNum).toggleClass("hidden");

        functionItem[itemNum].init() ;


    }

    /*画攻击检测饼图*/
    function drawAnalysisPie(oPieData,aID)
    {
        if(!oPieData.length)
        {
            var option = {
            calculable : false,
            height:230,
            tooltip : {
                show:false
            },
            series : [
                {
                    type: 'pie',
                    radius : ['40%', '70%'],
                    center: ['15%', '50%'],
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
        var oTheme = {color: ['#F5F5F5']};
		oData = {seriesName:aID[2]};
		drawAnalysisLine("",oData);
        $(aID[0]).echart ("init", option,oTheme);
        }
        else
        {
             var aType  = oPieData;
            var option = {
                height:230,
                tooltip : {
                    show:true,
                    trigger: 'item',
                    formatter: "{b}<br/> {c} ({d}%)"
                },
                calculable : false,
                myLegend:{
                    scope : aID[1],//"#anaylsis_pie-Legend",
                    width: "45%",
                    height:"90%",
                    right: 125,
                    top: 20,
                },
                series : [
                    {
                        name:aID[2],
                        type:'pie',
                        radius : ['40%', '70%'],
                        center: ['15%', '50%'],
                        itemStyle : {
                            normal : {
                                borderColor:'#fff',
                                borderWidth:2,
                                label : {
                                    position : 'inner',
                                    formatter : function (a,b,c,d) {
                                        return ""
                                    }
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    formatter : "{b}\n{d}%"
                                }
                            }
                        },
                        data:aType
                    }
                ],
                click: ajaxdrawAnalysisLine
            };
            var oTheme = {
                color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
            };
            $(aID[0]).echart ("init", option,oTheme);

        oData = {name:oPieData[0].name,seriesName:aID[2]};
        ajaxdrawAnalysisLine(oData);
        }
    }
    /*攻击检测折线图*/
    function drawAnalysisLine(oData,oSubName)
    {
        if((oData.length==0)||(oData == ""))
        {
            var  nHour = new Date().getHours();
            var nOneHour = 3600*1000;//
            var nDATA = 24;//
            var tNow = new Date();
            var aTime = [];
            for(var i=0;i<nDATA;i++)
            {
                aTime[i] = tNow - nOneHour*(nDATA-i-1);
                aTime[i] = new Date(aTime[i]);
                aTime[i] = (aTime[i].toTimeString()).slice(0,5);
            }

            var option = {
                width:'100%',
                height:230,

                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                            color: '#fff',
                            width: 0,
                            type: 'solid'
                        }
                    },
                },
                grid: {
                    x: '50', y: '30',x2:'40',y2:'35',
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            interval:1,
                            rotate:30
                        },
                        splitLine:{
                            show:false
                        },
                        /*  axisLabel: {
                         show:true,
                         textStyle:{color: '#617085', fontSize:"12px", width:2}
                         },*/
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#d4d4d4', width: 1}
                        },
                        axisTick :{
                            show:false,
                            lineStyle:{color:'#d4d4d4', width: 1}
                        },
                        data: aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:"Mbps",
                        splitLine:{
                            show:false,
                            lineStyle:{color:'#d4d4d4', width: 1}
                        },
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#617085', fontSize:"12px", width:2}
                        },
                        axisLine  : {
                            show:false,
                            lineStyle :{color: '#617085', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        name : oSubName.name,
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
                        data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    }
                ]

            };
            var oTheme = {
                color: ['#53B9E7']
            };
            $(oSubName.seriesName).echart ("init", option,oTheme);
        }
        else
        {
            var aTime = oData.time;
            for(var i=0;i<aTime.length;i++)
            {
                aTime[i] = new Date(aTime[i]);
                aTime[i] = (aTime[i].toTimeString()).slice(0,5);
            }
            var aFloodNumToTime = oData.StatisticNumToTime;

            // var aTime = [1,2,3,4,5,6,7,8,9];
            // var aFloodNumToTime = [12,8,71,6,50,14,32,12,10];

            var option = {
                width:'100%',
                height:230,
                title:{
                    text:oSubName.name,
                    x:70
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                            color: '#fff',
                            width: 0,
                            type: 'solid'
                        }
                    },
                },
                grid: {
                    x: '50', y: '30',x2:'40',y2:'35',
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            interval:1,
                            rotate:30
                        },
                        splitLine:{
                            show:false
                        },
                        /*  axisLabel: {
                         show:true,
                         textStyle:{color: '#617085', fontSize:"12px", width:2}
                         },*/
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#d4d4d4', width: 1}
                        },
                        axisTick :{
                            show:false,
                            lineStyle:{color:'#d4d4d4', width: 1}
                        },
                        data: aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:"Mbps",
                        splitLine:{
                            show:false,
                            lineStyle:{color:'#d4d4d4', width: 1}
                        },
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#617085', fontSize:"12px", width:2}
                        },
                        axisLine  : {
                            show:false,
                            lineStyle :{color: '#617085', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        name : oSubName.name,
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
                        data:aFloodNumToTime
                    }
                ]

            };
            var oTheme = {
                color: ['#53B9E7']
            };
            $(oSubName.seriesName).echart ("init", option,oTheme);
        }
    }
    function ajaxdrawAnalysisLine(oData)
    {
        var nYear = new Date().getFullYear();
        var nMonth = new Date().getMonth();
        var nDay = new Date().getDate();
        var nHour = new Date().getHours();
        var nStartTime = new Date(nYear,nMonth,nDay).getTime()/1000;
        var nEndTime = new Date().getTime()/1000;
        $.ajax({
            url: MyConfig.path+"/ant/wips_statistics",
            dataType: "json",
            type:"post",
            data:{
                Method:'GetStatisticNumToTime',
                Time:nHour,
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                    // Type:"Flood",
                    SubType:oData.name,//需要从前面获取
                    //  SensorMacAddress:"00-11-22-33-44-55-66",

                },
                Return: [
                    "SubType",
                    "Count",
                    "ReportTime",
                ]

            },
            success: function (data)
            {
                var message = data.message;
                drawAnalysisLine(message,oData)
            },

        });
        // drawAnalysisLine("",oData)

    }


    var functionItem = {
        myCarousel:[
            {
                init:function(){
                    ApAndSensor_pie();
                    ApAndClientpro_pie();
                    initPacket_pie();
                    return true;
                }
            },
            {
                init:function(){
                    initApType();
                    return true;
                }
            },
            {
                init:function(){
                    initVendor();
                    return true;
                }
            }
        ],
        /*yuzhiqiang ykf5851 attack and ctm ajax req Code start */

        dispaly_block1:[
            {
                init:function(){
                    var nYear = new Date().getFullYear();
                    var nMonth = new Date().getMonth();
                    var nDay = new Date().getDate();
                    var nHour = new Date().getHours();
                    var nMinute = new Date().getMinutes();
                    var nSeconds = new Date().getSeconds();
                    var nStartTime = (new Date(nYear,nMonth,nDay).getTime()/1000);
                    var nEndTime = (new Date().getTime()/1000);
                    $.ajax({
                        url: MyConfig.path+"/ant/wips_statistics",
                        dataType: "json",
                        type:"post",
                        data:{
                            Method:'GetStatisticNum',
                            Time:nHour,
                            Param: {
                                ACSN:FrameInfo.ACSN,
                                StartTime:nStartTime,
                                EndTime:nEndTime,
                                Type:0


                            },
                            Return: [
                                "SubType",
                                "Count",
                                "ReportTime",
                            ]

                        },
                        success: function (data)
                        {
                            var message = data.message;
                            var aIdName = ["#other_pie","#other_pie-Legend","#other"];
                            drawAnalysisPie(message,aIdName);
                        },

                    });
                    /* var aIdName = ["#other_pie","#other_pie-Legend","#other"];
                     var data = [{value:100,name:"other1"},{value:100,name:"ctm1"},{value:100,name:"ctm2"},{value:100,name:"ctm3"}]
                     drawAnalysisPie(data,aIdName);*/
                    return true;
                }
            },
            {
                init:function(){
                    var nYear = new Date().getFullYear();
                    var nMonth = new Date().getMonth();
                    var nDay = new Date().getDate();
                    var nHour = new Date().getHours();
                    var nMinute = new Date().getMinutes();
                    var nSeconds = new Date().getSeconds();
                    var nStartTime = (new Date(nYear,nMonth,nDay).getTime()/1000);
                    var nEndTime = (new Date().getTime()/1000);
                    $.ajax({
                        url: MyConfig.path+"/ant/wips_statistics",
                        dataType: "json",
                        type:"post",
                        data:{
                            Method:'GetStatisticNum',
                            Time:nHour,
                            Param: {
                                ACSN:FrameInfo.ACSN,
                                StartTime:nStartTime,
                                EndTime:nEndTime,
                                Type:1
                            },
                            Return: [
                                "SubType",
                                "Count",
                                "ReportTime"
                            ]

                        },
                        success: function (data)
                        {
                            var message = data.message;
                            var aIdName = ["#anaylsis_pie","#anaylsis_pie-Legend","#usage"];
                            drawAnalysisPie(message,aIdName);
                        },

                    });
                    /*  var aIdName = ["#anaylsis_pie","#anaylsis_pie-Legend","#usage"];
                     var data = [{value:123,name:"flood"},{value:321,name:"ass1"},{value:524,name:"ass2"},{value:254,name:"ass3"}]
                     drawAnalysisPie(data,aIdName);*/
                    return true;
                }
            },
            {
                init:function(){
                    var nYear = new Date().getFullYear();
                    var nMonth = new Date().getMonth();
                    var nDay = new Date().getDate();
                    var nHour = new Date().getHours();
                    var nMinute = new Date().getMinutes();
                    var nSeconds = new Date().getSeconds();
                    var nStartTime = (new Date(nYear,nMonth,nDay).getTime()/1000);
                    var nEndTime = (new Date().getTime()/1000);
                    $.ajax({
                        url: MyConfig.path+"/ant/wips_statistics",
                        dataType: "json",
                        type:"post",
                        data:{
                            Method:'GetStatisticNum',
                            Time:nHour,
                            Param: {
                                ACSN:FrameInfo.ACSN,
                                StartTime:nStartTime,
                                EndTime:nEndTime,
                                Type:2
                            },
                            Return: [
                                "SubType",
                                "Count",
                                "ReportTime"
                            ]

                        },
                        success: function (data)
                        {
                            var message = data.message;
                            var aIdName = ["#jixingMessage_pie","#jixingMessage_pie-Legend","#jixingMessage"];
                            drawAnalysisPie(message,aIdName);
                        },

                    });
                    /* var aIdName = ["#jixingMessage_pie","#jixingMessage_pie-Legend","#jixingMessage"]
                     var data = [{value:100,name:"ctmctm"},{value:100,name:"ctm1"},{value:100,name:"ctm2"},{value:100,name:"ctm3"}]
                     drawAnalysisPie(data,aIdName);*/
                    return true;
                }
            }
        ]
    }



    function drawAttalckList()
    {
        $("#cmt").hasClass("active") && $("#cmt").removeClass("active");
        $("#station_class").hasClass("active") && $("#station_class").removeClass("active");
        !$("#attack").hasClass("active") && $("#attack").addClass("active");
        /*test list start*/
        /* $("#attactID").removeClass("hide");
         $("#cmtID").addClass("hide");
         var IntName = [
         {"Date":12,"Log":"this is attack this is attack this is attack this is attack"}
         ]
         $("#attact_list").SList("refresh",IntName);*/
        /*test list end*/
        !$("#ap_client").hasClass("hide") && $("#ap_client").addClass("hide");
        !$("#ctm_log").hasClass("hide") && $("#ctm_log").addClass("hide");
        $("#attack_log").hasClass("hide") && $("#attack_log").removeClass("hide");
        /*隐藏显示的描述*/
        // $("#Attackdes").removeClass("hide");
        // $("#ctmdes").addClass("hide");
        /*隐藏list表*/
        // $("#attactID").removeClass("hide");
        // $("#cmtID").addClass("hide");

        var nYear = new Date().getFullYear();
        var nMonth = new Date().getMonth();
        var nDay = new Date().getDate();
        var nHour = new Date().getHours();
        var nMinute = new Date().getMinutes();
        var nSeconds = new Date().getSeconds();
        var nStartTime = (new Date(nYear,nMonth,nDay).getTime()/1000);
        var nEndTime = (new Date().getTime()/1000);
        $.ajax({
            url: MyConfig.path+"/ant/wips_statistics",
            dataType: "json",
            type:"post",
            data:{
                Method:'AttackList',
                Time:nHour,
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [
                    "ReportTime",
                    "SensorMacAddress",
                    "SubType",
                    "Type"
                ]

            },
            success: function (data)
            {
                var oData = data.message;
                // var oData = data;
                var oLastDate = oData.lastDate;
                var aListData = oData.aSendList;
                for(var i=0;i<aListData.length;i++)
                {
                    aListData[i].date = new Date(aListData[i].date*1000).toLocaleString();
                }
                if(!oLastDate.date)
                {
                    $("#inputDate").html(getRcText("WU"));
                    $("#inputLog").html(getRcText("WU"));
                }
                else
                {
                    $("#inputDate").html(oLastDate.date);
                    $("#inputLog").html(oLastDate.log);
                }
                //var IntName = oData.aSendList;
                $("#attact_list").SList("refresh",aListData);
            },
        });
    }
    function drawCmtList()
    {
        /*list test start*/
        /*$("#inputDate").html("2016-1-24 12:00");
         $("#inputLog").html("fjaoisdgoisfjgoisfjgoisfjgoisvbfg");
         $("#inputctmDate").html("2016-1-24 12:00");
         $("#inputctmLog").html("dfjafgiosgnosdfgjnoksdfjgsdfjgokfdj");

         $("#cmtID").removeClass("hide");
         $("#attactID").addClass("hide");

         var IntName = [
         {"Date":12,"Log":"this is cmt this is cmt this is cmt this is cmt"}
         ]
         $("#cmt_list").SList("refresh",IntName);*/
        /*lest test end*/
        /*隐藏显示的描述*/
        $("#station_class").hasClass("active") && $("#station_class").removeClass("active");
        $("#attack").hasClass("active") && $("#attack").removeClass("active");
        !$("#cmt").hasClass("active") && $("#cmt").addClass("active");

        !$("#ap_client").hasClass("hide") && $("#ap_client").addClass("hide");
        !$("#attack_log").hasClass("hide") && $("#attack_log").addClass("hide");
        $("#ctm_log").hasClass("hide") && $("#ctm_log").removeClass("hide");

/*        $("#ctmdes").removeClass("hide");
        $("#Attackdes").addClass("hide");

        隐藏list表
        $("#cmtID").removeClass("hide");
        $("#attactID").addClass("hide");
*/
        var nYear = new Date().getFullYear();
        var nMonth = new Date().getMonth();
        var nDay = new Date().getDate();
        var nHour = new Date().getHours();
        var nMinute = new Date().getMinutes();
        var nSeconds = new Date().getSeconds();
        var nStartTime = (new Date(nYear,nMonth,nDay).getTime()/1000);
        var nEndTime = (new Date().getTime()/1000);
        $.ajax({
            url: MyConfig.path+"/ant/wips_statistics",
            dataType: "json",
            type:"post",
            data:{
                Method:'CtmList',
                Time:nHour,
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [
                    "CounterTime",
                    "SensorName",
                    "MacAddress",
                ]

            },
            success: function (data)
            {
                var oData = data.message;
                //var oData = data;
                var oLastDate = oData.lastDate;
                var aListData = oData.aSendList;
                for(var i=0;i<aListData.length;i++)
                {
                    aListData[i].date = new Date(aListData[i].date*1000).toLocaleString();
                }
               if(!oLastDate.date)
                {
                    $("#inputctmDate").text(getRcText("WU"));
                    $("#inputctmLog").text(getRcText("WU"));
                }
                else
                {
                    $("#inputctmDate").text(oLastDate.date);
                    $("#inputctmLog").text(oLastDate.log);
                }
                // var IntName = oData.aSendList;
                $("#cmt_list").SList("refresh",aListData);
            },

        });
    }
    function compAttackAndCtmNum()
    {
        var nYear = new Date().getFullYear();
        var nMonth = new Date().getMonth();
        var nDay = new Date().getDate();
        var nStartTime = (new Date(nYear,nMonth,nDay).getTime()/1000);
        var nEndTime = (new Date().getTime()/1000);
        $.ajax({
            url: MyConfig.path+"/ant/wips_statistics",
            dataType: "json",
            type:"post",
            data:{
                Method:'TotalCtmNumber',
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [

                ]
            },
            success: function (data)
            {
                var number  = data.message;
                $("#ctmnum").text(number);
            },
        });
        $.ajax({
            url: MyConfig.path+"/ant/wips_statistics",
            dataType: "json",
            type:"post",
            data:{
                Method:'TotalOtherNumber',
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                    Type:0
                },
                Return: [

                ]
            },
            success: function (data)
            {
                g_result.OTHER_ATTACK  = data.message;
                dealResult();
            },
        });
        $.ajax({
            url: MyConfig.path+"/ant/wips_statistics",
            dataType: "json",
            type:"post",
            data:{
                Method:'TotalAttackNumber',
                Param: {
                    ACSN:FrameInfo.ACSN,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [

                ]
            },
            success: function (data)
            {
                g_result.ATTACK = data.message;
                dealResult();
                var number  = data.message;
                $("#attacknum").text(number);
            },
        });
    }
    function initAttackAndCtm()
    {
        functionItem.dispaly_block1[0].init();   // yuzhiqiang ykf5851 pie and chart satrt
        compAttackAndCtmNum();
    }
    /*yuzhqiang ykf5851 req attack and ctm  ajax end*/


    //页面获取数据
    function initData()
    {
        g_result = {};
        oMessageInit.getUnAuthoredClientNum();
        oMessageInit.getRougeApNum();
        oMessageInit.getSensorNum();
        oMessageInit.getApList();
        oMessageInit.getApClassify();
        oMessageInit.getClientClassify();
        oMessageInit.getPacket();
        oMessageInit.getApNum();
        oMessageInit.getClientNum();
        initAttackAndCtm();
    }
    //其他初始化
    function initForm()
    {
        $('#carousel-example-generic').on('slide.bs.carousel', function (e) {

            for(var i= 0; i < g_station.length; i++)
            {
                g_station[i].resize();
            }

        });
        $('#carousel-example-generic1').on('slide.bs.carousel', function (e) {
            for(var i= 0; i < g_station.length; i++)
            {
                g_station[i].resize();
            }
        });

        $(".btn-choice").on("click",function(e){
            var tileID = $(this).attr("data-slide-to");
            var nowTitle = $(".btn-choice.active").attr("data-slide-to");
            if(tileID == nowTitle)
            {
                return false;
            }
            $(".btn-choice.active").removeClass("active");
            $(".btn-choice").eq(tileID).addClass("active");
            changeViews("#dispaly_block1", tileID, functionItem["dispaly_block1"]);

        });


        $(".head-area-center").on("click",function(e){

            $("#station_info,#countermeasure1 .app-box").toggleClass("blur-result");
            $("#ap_client_attack_ctm").toggleClass("new-position");
            if( $("#ap_client_attack_ctm").hasClass("new-position"))
            {
                if(g_result.CLIENT_INFO)
                {
                    dealStationInfo();
                }
                else{
                    oMessageInit.isExecute.clientInfo = true;
                    oMessageInit.getClientInfo();
                }
                oMessageInit.isExecute.stationClassify = true;
                dealResult();
            }
        });

        /*yuzhiqiang ykf5851 choice attack or ctm to list start*/
        $("#attack").on("click",drawAttalckList);
        $("#cmt").on("click",drawCmtList);
        $("#station_class").on("click",function(){
            $("#attack").hasClass("active") && $("#attack").removeClass("active");
            $("#cmt").hasClass("active") && $("#cmt").removeClass("active");
            !$("#station_class").hasClass("active") && $("#station_class").addClass("active");

            !$("#attack_log").hasClass("hide") && $("#attack_log").addClass("hide");
            !$("#ctm_log").hasClass("hide") && $("#ctm_log").addClass("hide");
            $("#ap_client").hasClass("hide") && $("#ap_client").removeClass("hide");
            initApClientClassify();
        });
        /*yuzhiqiang  ykf5851 cjoice attack or ctm to list end*/

        $("#ap_info").on("click",function(e){
            $("#client_info").hasClass("active") && $("#client_info").removeClass("active");
            !$("#ap_info").hasClass("active") && $("#ap_info").addClass("active");
            if(g_result.AP_INFO)
            {
                clearSlist($("#station_list"));
                dealStationInfo();
            }
            else{
                oMessageInit.isExecute.apInfo = true;
                clearSlist($("#station_list"));
                oMessageInit.getApInfo();
            }
        });
        $("#client_info").on("click",function(e){
            $("#ap_info").hasClass("active") && $("#ap_info").removeClass("active");
            !$("#client_info").hasClass("active") && $("#client_info").addClass("active");
            if(g_result.CLIENT_INFO)
            {
                clearSlist($("#station_list"));
                dealStationInfo();
            }
            else{
                oMessageInit.isExecute.clientInfo = true;
                clearSlist($("#station_list"));
                oMessageInit.getClientInfo();
            }

        });

    }
    function initGrid()
    {
        /*yuzhiqiang ykf5851 add list head start*/
        var optUser= {
            colNames: getRcText ("ATTACK_HEAD"),
            showHeader: true,
            search:true,
            pageSize:7,
            colModel: [
                {name: "date", datatype: "Integer", width:200},
                {name: "log", datatype: "String"}
            ]
        };
        g_a[0] = $("#attact_list").SList ("head", optUser);

        var User= {
            colNames: getRcText ("ATTACK_HEAD"),
            showHeader: true,
            search:true,
            pageSize:7,
            colModel: [
                {name: "date", datatype: "Integer", width:200},
                {name: "log", datatype: "String"},

            ]
        };
        g_a[1] = $("#cmt_list").SList ("head", User);
        /*yuzhiqiang ykf5851 add list head end*/
        var Station= {
            colNames: getRcText ("STATION_HEAD"),
            showHeader: true,
            search:true,
            pageSize:7,
            colModel: [
                {name: "MacAddress", datatype: "String"},
                {name: "ClassifyType", datatype: "String"},
                {name: "LastReportTime", datatype: "String"},

            ]
        };

        g_a[2] = $("#station_list").SList ("head", Station);
    }
    function _init()
    {
        initForm();
        initGrid();
        initData();


    };

    function _resize(jParent)
    {
        for(var i = 0; i < 3; i++)
        {
            g_a[i].resize();
        }
        initData();
    }

    function _destroy()
    {
        g_result = {};
        for(var i in oMessageInit.isExecute)
        {
            oMessageInit.isExecute[i] = true;
        }
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "resize": _resize,
        "widgets": ["Echart","SingleSelect","SList"],
        "utils":["Request","Base","Msg"],
    });
})( jQuery );

