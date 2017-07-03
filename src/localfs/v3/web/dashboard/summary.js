(function ($)
{
    var MODULE_NAME = "dashboard.summary";
    var g_aAllAppName = [];
    var g_aUserAppUP=[], g_aUserAppDown=[];
    var g_oLineChart;
    var g_oResizeTimer;
    var g_oTimer ;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("dashboard_rc", sRcName);
    }

    function drawAppflow(AppData)
    {
        var aAPPname=[]
        var aAPPListup=[];
        var aAPPListdown=[];
        for(var i= 0;i<AppData.length;i++)
        {
            aAPPname.push(AppData[i].APPName);
            aAPPListup.push(Math.round(AppData[i].PktBytes));
            aAPPListdown.push(Math.round(AppData[i].DropPktBytes));
        }

        var option = {
            height:"140px",
            width:"100%",
            grid: {
                x: '60px', y: '20px', x2: '10px', y2: '22px',
                borderColor: '#FFFFFF'
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "right",
                textStyle:{
                    color:'#617085',
                    fontSize:'14px'
                },
                data: getRcText("TIPS").split(",")
            },
            tooltip : {
                show: true,
                trigger: 'axis',
                formatter:function(y,x){
                    var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + y[0][2] + "KB"+"<br/>";
                    if(y.length==2)
                    {
                        sTips = sTips+ y[1][0] + ":" + y[1][2] + "KB";
                    }
                    return sTips;
                },

                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#fff',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    nameTextStyle:{
                        color:'#617085',
                        fontSize:'14px'
                    },
                    axisLine:
                    {
                        show:true,
                        lineStyle :{color: '#AEAEB7', width: 1}
                    },
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2},
                        formatter:function(val)
                        {
                            if(val.length>3)
                            {
                                val=val.substr(0,3)+'...';
                            }
                            return val;
                        }
                    },
                    axisTick:{show:false},
                    data : aAPPname,
                    splitLine : {
                        show : false
                    },
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLine: {
                        show:true,
                        lineStyle :{color: '#AEAEB7', width: 1}
                    },
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2},
                        formatter:function(data){
                            return Utils.Base.addComma(data,'memory');
                        }
                    },
                    axisTick : {show: false},
                    splitLine : {
                        show : false
                    },
                    splitNumber:6
                }
            ],
            series : [
                {
                    name:getRcText("TIPS").split(",")[0],
                    type:'bar',
                    barCategoryGap: '40%',
                    data: aAPPListup,
                    stack: 'sum',
                    itemStyle : {
                        normal: {
                            label : {
                                show: false,
                                position: 'inside'
                            }
                        }
                    }
                },
                {
                    name:getRcText("TIPS").split(",")[1],
                    type:'bar',
                    data: aAPPListdown,
                    stack: 'sum',
                    itemStyle : {
                        normal: {
                            label : {
                                show: false,
                                position: 'inside',
                                formatter: function(x, y, val){return val;}
                            }
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color: ['#4ec1b2','#e7e7e9']
        };
        $("#appflow").echart ("init", option,oTheme);
    }

    function drawEmptyPie()
    {
        var option = {
            height:200,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : '85%',
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ]
        };
        var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};

        $("#accessterminal").echart("init", option,oTheme);
    }

    function drawAccessterminal(oInfor)
    {
        $("#Current").text( Utils.Base.addComma(oInfor.Total));
        if(oInfor.Total == 0)
        {
            drawEmptyPie();
            return ;
        }
       
        var aType = [
            {name:'802.11ac(5GHz)',value:oInfor.wsm64},
            {name:'802.11an(5GHz)',value:oInfor.wsm16},
            {name:'802.11a(5GHz)',value:oInfor.wsm2},
            {name:'802.11g(2.4GHz)',value:oInfor.wsm4},
            {name:'802.11gn(2.4GHz)',value:oInfor.wsm8},
            {name:'802.11b(2.4GHz)',value:oInfor.wsm1}
        ];
 
        var aLType = [];
        (oInfor.Num5G != 0)?aLType.push({name:'5GHz',value:oInfor.Num5G}):aLType.push({});
        (oInfor.Num2G != 0)?aLType.push({name:'2.4GHz',value:oInfor.Num2G}):aLType.push({});
        (oInfor.Numb != 0)?aLType.push({name:'802.11b',value:oInfor.Numb}):aLType.push({});

        var option = {
            height:200,
            tooltip : {
                show : true,
                trigger: 'item',
                formatter: function(aData){
                    return aData[1]+'<br/>' + aData[2] +' (' + Math.round(aData[2]/this._option.nTotal*100) +'%)';
                }
            },
            calculable : false,
             myLegend:{
                 scope : "#accessLegend",
                 width: "45%",
                 right: 20,
                 top: 6,
             },
            nTotal : oInfor.Total,
            series : [
                {
                    type:'pie',
                    radius : ['60%','85%'],
                    center: ['25%', '50%'],
                    itemStyle: {
                        normal : {
                             label : {
                                 position : 'inner',
                                 formatter : function (a,b,c,d) {
                                     return ""
                                 }
                             },
                            labelLine : {
                                show:false
                            }
                        }
                    },
                    data: aType
                }
                ,{
                    type:'pie',
                    radius : '50%',
                    center: ['25%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            color: function(a) {
                                var colorList = ['#78cec3','#c8c3e1','#e7e7e9'];
                                return colorList[a.dataIndex];
                            },
                            label:
                            {
                                position:"inner",
                                formatter: '{b}'

                            }

                        }
                    },
                    data: aLType
                }
            ]
        };
        var oTheme={
               color: ['#4ec1b2','#78cec3','#95dad1','#c8c3e1','#b3b7dd','#e7e7e9']
        };

        $("#accessterminal").echart("init", option,oTheme);
    }

    function drawTerminaltype(aAllApp)
    {
        aAllApp = aAllApp.sort(function(a,b){
            return b.value-a.value
         }).slice(0,8);

        var option = {
            height:"80%",
            tooltip : {
                show:true,
                trigger: 'item',
                formatter: "{b}<br/> {c} ({d}%)"
            },
            calculable : false,
            myLegend:{
                scope : "#myLegend",
                width: "45%",
                right: 20,
                top: 0 ,
            },
            series : [
                {
                    type:'pie',
                    radius : ['50%', '85%'],
                    center: ['25%', '55%'],
                    itemStyle : {
                        normal : {
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
                    data: aAllApp
                }
            ],
        };
        var oTheme = {
            color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
        };
        $("#terminaltype").echart ("init", option,oTheme);
    }

    function getPieData(aAppflow)
    {
        var i;
        var oAllApp = {};
        var sumBytes= 0,sumDropBytes=0
        for(i = 0; i < aAppflow.length; i++)
        {
            var sName = aAppflow[i].APPName;
            if(!oAllApp[sName])
            {
                oAllApp[sName] = aAppflow[i];
            }
            else
            {
                oAllApp[sName].PktBytes = Number(oAllApp[sName].PktBytes) + Number(aAppflow[i].PktBytes);
                oAllApp[sName].DropPktBytes = Number(oAllApp[sName].DropPktBytes) + Number(aAppflow[i].DropPktBytes);
            }
        }
        var aRet=[],aTemp = [];
        for(key in oAllApp)
        {
            aTemp.push(oAllApp[key]);
        }
        aTemp = aTemp.sort(function(a,b){
            return b.PktBytes-a.PktBytes;
        });

        var max=aTemp.length>7 ? 7 :aTemp.length;
        for(i=0;i<max;i++)
        {
            g_aAllAppName.push(aTemp[i].APPName);
            sumBytes+=aTemp[i].PktBytes;
            sumDropBytes+=aTemp[i].DropPktBytes;
            aRet.push(aTemp[i]);
        }
        if(i==7)
        {
            aRet[7]={
                "APPName":getRcText("LABELS"),
                "PktBytes":sumBytes,
                "DropPktBytes":sumDropBytes
            };
        }

        for(i=7;i<aTemp.length;i++)
        {
            aRet[7].PktBytes=Number(aRet[7].PktBytes) + Number(aTemp[i].PktBytes);
            aRet[7].DropPktBytes=Number(aRet[7].DropPktBytes) + Number(aTemp[i].DropPktBytes);
        }
        return aRet;
    }

    function get_Health()
    {
        function getHealthSucData(data){
            console.log("suc summary ccccccccccccccccc");
            var obj = JSON.parse(data);
            if(obj)
            {
                $("#bandwidth").html(inMode(obj.wanspeed));
                $("#appercent").html(inMode(obj.APpercent));
                $("#clientspeed").html(inMode(obj.clientspeed));
                $("#security").html(inMode(obj.security));
                $("#wireless").html(inMode(obj.wireless));
                $("#system").html(inMode(obj.system));
            }
            $("#score").text(JSON.parse(data).finalscore||0);
            var score = JSON.parse(data).finalscore || 0;
            var currentClass = $("#health").attr("class");
            if(score >= 80)
            {
                $("#health").removeClass(currentClass);
                $("#health").addClass("healthimgreen");
            }
            else if(score >= 60 && score < 80)
            {
                $("#health").removeClass(currentClass);
                $("#health").addClass("healthimgyellow");
            }
            else
            {
                $("#health").removeClass(currentClass);
                $("#health").addClass("healthimgred");
            }
        }

        function getHealthFailData(err){
            console.log("summary fail");
        }

        var getHealthOpt = {
            url: MyConfig.path + "/health/home/health?acSN=" + FrameInfo.ACSN,
            type:"GET",
            onSuccess:getHealthSucData,
            onFailed:getHealthFailData
        }
        Utils.Request.sendRequest(getHealthOpt);
    };

    function get_clientcount()
    {
        function cientNumSuc(data){
            console.log("suc summary ccccccccccccccccc")
            clientnum = data["clientnum"];

            function getStaticNumSuc(data){
                var clientStatistic = data["client_statistic"];
                var oInfor = {
                    Total:clientnum,
                    wsm1 : clientStatistic["b"],  //802.11b
                    wsm2 : clientStatistic["a"],  //802.11a
                    wsm4 : clientStatistic["g"],  //802.11g
                    wsm8 : clientStatistic["gn"],  //802.11gn
                    wsm16 : clientStatistic["an"], //802.11an
                    wsm64 : clientStatistic["ac"]  //802.11ac
                };
                oInfor.Num5G = oInfor.wsm2 + oInfor.wsm16 + oInfor.wsm64;
                oInfor.Num2G = oInfor.wsm4 + oInfor.wsm8;
                oInfor.Numb = oInfor.wsm1;
                drawAccessterminal(oInfor);
            };

            function getStaticNumFail(err){
                console.log("error");
            };

            var getClientstatistic={
                type:"GET",
                url: "/v3/stamonitor/clientstatistic?devSN=" + FrameInfo.ACSN,
                dataType:"json",
                onSuccess:getStaticNumSuc,
                onFailed:getStaticNumFail
            }

            Utils.Request.sendRequest(getClientstatistic);

            var wdNum = 0;
            var oNum = {
                wlNum:clientnum,
                wdNum:wdNum
            }
            Utils.Base.updateHtml($("#terminalNum"), oNum);
        };

        function clientNumFail(err){
            console.log("fail summary ccccccccccccccccc")
            clientnum = 0;
            var wdNum = 0;
            var oNum = {
                wlNum:clientnum,
                wdNum:wdNum
            }
            Utils.Base.updateHtml($("#terminalNum"), oNum);
        }

        var getClientnum = {
            url: MyConfig.path + "/stamonitor/web/clientcount?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess:cientNumSuc,
            onFailed:clientNumFail
        }
        Utils.Request.sendRequest(getClientnum);
    };

    function get_clientList()
    {
        function clinetList(data)
        {
            console.log("success summary dddddddddd");
            var clientList = data["clientList"];
            var aDeviceType = [];
            var oList = {};
            clientList.forEach(function(client){
                var name = client["clientVendor"];
                if(name == "")
                {
                    name = "other";
                }
                if (!(name in oList)){
                    oList[name] = {
                        name: name,
                        value: 0
                    }
                }
                oList[name].value++;
            });
            for (var key in oList){
                aDeviceType.push(oList[key]);
            }
            drawTerminaltype(aDeviceType);
        }

        function clientListFail()
        {

        };
        var getClientnum = {
            url: MyConfig.path+"/stamonitor/web/stationlist?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess:clinetList,
            onFailed: clientListFail
        };
        Utils.Request.sendRequest(getClientnum);
    }

    function get_AppUpFlow()
    {
        var date = new Date();
        var startTime = date.setHours(0, 0, 0);
        var endTime = date.setHours(24, 0, 0);

        function getAppUpFlow(upData){
            console.log("success summary dddddddddd");
            var up = upData.message ||[];
            var aData=[];
            for(var i= 0;i<up.length;i++)
            {
                var oUserApp=
                {
                    "APPName":up[i].APPName,
                    "PktBytes":up[i].PktBytes,
                    "DropPktBytes":up[i].DropPktBytes
                }
                aData.push(oUserApp);
            }
            g_aUserAppUP = getPieData(aData);
            drawAppflow(g_aUserAppUP);
        }
        var getAppFlow = {
            url: MyConfig.path+"/ant/read_dpi_app",
            dataType: "json",
            type: "POST",
            data: {
                Method: 'GetApp',
                Param: {
                    family: "0",
                    direct: "0",
                    ACSN: FrameInfo.ACSN,
                    StartTime: (startTime/1000).toFixed(0),
                    EndTime: (endTime/1000).toFixed(0)
                },
                Return: [
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                    "FirstTime",
                    "LastTime",
                    "APPName"
                ]
            },
            onSuccess:getAppUpFlow
        };
        Utils.Request.sendRequest(getAppFlow);
    };

    function get_AppDownFlow()
    {
        var date = new Date();
        var startTime = date.setHours(0, 0, 0);
        var endTime = date.setHours(24, 0, 0);
        function getDownFlowData(downData){
            var down = downData.message||[];

            var aData=[];
            for(var i= 0;i<down.length;i++)
            {
                var oUserApp=
                {
                    "APPName":down[i].APPName,
                    "PktBytes":down[i].PktBytes,
                    "DropPktBytes":down[i].DropPktBytes
                }
                aData.push(oUserApp);
            }

            g_aUserAppDown = getPieData(aData);
        }

        var getAppDownFlow = {
            url: MyConfig.path+"/ant/read_dpi_app",//接收
            dataType: "json",
            type: "POST",
            data: {
                Method: 'GetApp',
                Param: {
                    family: "0",
                    direct: "1",
                    ACSN: FrameInfo.ACSN,
                    StartTime: (startTime/1000).toFixed(0),
                    EndTime: (endTime/1000).toFixed(0)
                },
                Return: [
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                    "FirstTime",
                    "LastTime",
                    "APPName"
                ]
            },
            onSuccess:getDownFlowData
        };
        Utils.Request.sendRequest(getAppDownFlow);
    };

    function inMode(oInfor)
    {
        var status ="";
        var ostatus =getRcText("Envquality").split(",");
        switch(oInfor){
            case 5:
                status =ostatus[0];
                break;
            case 4:
                status =ostatus[1];
                break;
            case 3:
                status =ostatus[2];
                break;
            case 2:
                status =ostatus[3];
                break;
            case 1:
                status =ostatus[4];
                break;
        }
        return status;
    }
    function initData()
    {
        get_AllInterface_Init();

        get_Health();

        get_clientcount();

        //drawTerminaltype
        get_clientList();

        //AppUpFlow
        get_AppUpFlow();

        //AppDownFlow
        get_AppDownFlow();

    }

    function get_AcUpdateProgressSuc( odata )
    {
        var data= odata || {};

        if(data.error_code==0)
        {
            var per=data.data.percent;
            var i = per;
            var t = setInterval(addNum,20);
            function addNum() {
                if(i<100){
                    i++;
                    $('canvas.process').text(i+"%");
                    $('.num').text(i+"%");
                    drawProcess();
                }else{
                    clearInterval(t);
                }
            }

            function drawProcess() {
                $('canvas.process').each(function() {
                    var text = $(this).text();
                    var process = text.substring(0, text.length-1);
                    var canvas = this;
                    var context = canvas.getContext('2d');
                    context.clearRect(0, 0, 48, 48);
                    context.beginPath();
                    context.moveTo(24, 24);
                    context.arc(24, 24, 24,  0, Math.PI * 2, false);
                    context.closePath();
                    context.fillStyle = '#ddd';
                    context.fill();

                    context.beginPath();
                    context.moveTo(24, 24);
                    context.arc(24, 24, 24, 0, Math.PI * 2 * process / 100, false);
                    context.closePath();
                    context.fillStyle = '#4ec1b2';
                    context.fill();

                    context.beginPath();
                    context.moveTo(24, 24);
                    context.arc(24, 24, 20, 0, Math.PI * 2, true);
                    context.closePath();
                    context.fillStyle = 'rgba(255,255,255,1)';
                    context.fill();

                    context.beginPath();
                    context.arc(24, 24, 17.5, 0, Math.PI * 2, true);
                    context.closePath();
                    context.strokeStyle = '#ddd';
                    context.stroke();
                    context.font = "bold 9pt Arial";
                    context.fillStyle = 'white'//'#2a2';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.moveTo(24, 24);
                    context.fillText(text, 24, 24);
                });
            }
        }
        else{
            $('canvas.process').text("");

    };

    function get_AcUpdateProgressFail()
    {

    };

    var get_AcUpdateProgress = {
        url: MyConfig.v2path + "/getAcUpgradeProgress?acSN="+FrameInfo.ACSN+"&user_name="+$("#username"),
        type:"GET",
        dataType: "json",
        contentType: "application/json",
        onSuccess:get_AcUpdateProgressSuc,
        onFail: get_AcUpdateProgressFail
    };
    Utils.Request.sendRequest(get_AcUpdateProgress);
}

    function timeStatus (time)
    {
        // body...
        if (time < 10)
        {
            return "0" + time;
        }
        return time;
    }

    /* 画wan口流量数据 */
    function drawChartWan(aData) {
        var aSpeedUp = [];
        var aSpeedDown = [];
        var aSpeedUp2 = [];
        var aSpeedDown2 = [];
        var aTimes = [];
        var aServices = [];
        var aLegend = [];
        var aTooltip = [];
        var reg = /./;
        var reg2 = /G\d{1,2}/;
        var aStream = getRcText("UP_DOWN_WAN").split(",");
        var aColor = ["rgba(120,206,195,1)","rgba(254,240,231,1)","rgba(144,129,148,1)","rgba(254,184,185,1)"];
        $.each(aData,function (i,oData) {
            var aUp = [];
            var aDown = [];
            aData[i] = aData[i].reverse();
            $.each(aData[i],function(j,oData){
                aUp.push(oData.speed_up);
                aDown.push(-oData.speed_down);
            });

            var aName = (aData[i][0].interfaceName).match(reg) + (aData[i][0].interfaceName).split('/').pop();
            /* 判断接口是不是G5 */
            if (aData[0][i].interfaceName == "GigabitEthernet1/0/5")
            {
                var oG5_Up = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default', color: aColor[0]}}},
                    name: aStream[0],
                    data: aUp
                };
                var oG5_Down = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default', color: aColor[1]}}},
                    name: aStream[1],
                    data: aDown
                };

                aServices.push(oG5_Up);
                aServices.push(oG5_Down);
                aTooltip.push(aStream[0]);
                aTooltip.push(aStream[1]);
            }
            /* 判断接口是不是G6 */
            if (aData[0][i].interfaceName == "GigabitEthernet1/0/6")
            {
                var oG6_Up = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default', color: aColor[2]}}},
                    name: aStream[2],
                    data: aUp
                };
                var oG6_Down = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default', color: aColor[3]}}},
                    name: aStream[3],
                    data: aDown
                };

                aServices.push(oG6_Up);
                aServices.push(oG6_Down);
                aTooltip.push(aStream[2]);
                aTooltip.push(aStream[3]);
            }


        });
        aTooltip = aTooltip.reverse();
        $.each(aData[0],function(i,oData){
            var temp = new Date(oData.updateTime);
            aTimes.push(timeStatus(temp.getHours())+":"+timeStatus(temp.getMinutes())+":"+timeStatus(temp.getSeconds()));
        });

        var option = {
            width:"100%",
            height:210,
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#80878C',
                        width: 2,
                        type: 'solid'
                    }
                },
                formatter:function(y,x){
                    var sTips = y[0][1];
                    var temp = y[0][0].match(reg2)[0];
                    for (var j = 0; j < aTooltip.length; j++) {
                        if(temp == aTooltip[j].match(reg2)[0])
                        {
                            break;
                        }
                    }
                    for(var i = 0; i < y.length; i++)
                    {
                        sTips = sTips + "<br/>" + aTooltip[j+i] + ":" + Utils.Base.addComma(Math.abs(y[i][2]),"rate",1);
                    }
                    return sTips;
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "center",
                data: [aStream[0],aStream[1]]
            },
            grid: {
                x: 60, y: 40,
                borderColor: '#FFF'
            },
            calculable: false,
            dataZoom: {
                type: 'slider',
                show: true,
                xAxisIndex:[0],
                start:80,
                end:100,
                fillerColor:'#69C4C5',
                handleColor:'#617085',
                backgroundColor:'#E6F5F6'
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:true,
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#80878C', width: 2}
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#80878C', width: 2}
                    },
                    axisTick :{
                        show:false
                    },
                    data: aTimes
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#80878C', width: 2},
                        formatter:function(nNum){
                            return Utils.Base.addComma(Math.abs(nNum),'rate',1);
                        }
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#80878C', width: 2}
                    }
                }
            ],
            series: aServices,
        };
        var oTheme = {
            color: ["rgba(120,206,195,1)","rgba(254,240,231,1)","rgba(144,129,148,1)","rgba(254,184,185,1)"],
        };
        g_oLineChart = $("#usage").echart ("init", option,oTheme);
    }
    
    /* 流量监控：配置上行口 */
    function configUpPort()
    {
        function setUpLinkInterfaceSuc (data) {
            if('{"errcode":"illegal access"}' == data){
                console.log("没有权限")
            }
            else{
                if(data.errcode == '0') {
                    $("#config").addClass("hide");
                    $("#charts").removeClass("hide");
                    $("#usage_block").addClass("hide");
                    var aData = JSON.parse(data.histdataList[0]);
                    drawChart(aData.dataList);
                }
                else{
                    console.log("设置失败")
                };
            }
        }
        function setUpLinkInterfaceFial (data) {
            // body...
        }
        g_sPort = $("#ConfigUpport").val();
        if(!g_sPort)return;
        var setUpLinkInterfaceFlowOpt = {
            url: MyConfig.path +'/devmonitor/setUpLinkInterface',
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN,
                interfaceName:g_sPort
            },
            onSuccess:setUpLinkInterfaceSuc,
            onFailed:setUpLinkInterfaceFial
        };
        Utils.Request.sendRequest(setUpLinkInterfaceFlowOpt);
    }

    /*流量监控：选择上行口*/
    function setConfigUpport ()
    {
        function setUpLinkInterfaceSuc (data) {
            if('{"errcode":"illegal access"}' == data){
                console.log("没有权限")
            }
            else{
                if(data.errcode == '0') {
                    var aData = JSON.parse(data.histdataList[0]);
                    drawChart(aData.dataList);
                }
                else{
                    console.log("设置失败")
                };
            }
        }
        function setUpLinkInterfaceFial (data) {
            // body...
        }
        $("#usage_block").toggle();
        g_sPort = $("#SetfigUpport").val();
        if(!g_sPort)return;
        var setUpLinkInterfaceFlowOpt = {
            url: MyConfig.path +'/devmonitor/setUpLinkInterface',
            type: "GET",
            dataType: "json",
            data:{
                devSN:FrameInfo.ACSN,
                interfaceName:g_sPort
            },
            onSuccess:setUpLinkInterfaceSuc,
            onFailed:setUpLinkInterfaceFial
        };
        Utils.Request.sendRequest(setUpLinkInterfaceFlowOpt);
    }

    /* 初始化表头，注册点击事件 */
    function initForm()
    {
        /*给出口速率echrt添加点击事件*/
        $("#filter_usage").on("click", function(){
            $("#usage_block").toggle();
        });                                                         /*过滤按钮的点击事件*/
        $("#refresh_usage").on("click", get_AllInterface_Init);         /*刷新按钮*/
        $("#SetfigUpport").on("change",setConfigUpport);            /*设置上行口*/
        $("#submit").on("click", configUpPort);                     /*确认按钮*/

        $("#sendmsg").on("click", function(){
            $(this).css("color","#343e4e");
            $("#recvmsg").css("color","#80878c");
            drawAppflow(g_aUserAppUP);
        });
        $("#recvmsg").on("click", function(){
            $(this).css("color","#343e4e");
            $("#sendmsg").css("color","#80878c");
            drawAppflow(g_aUserAppDown);
        });
        $("#health").on("click", function(){
            Utils.Base.openDlg("health.healthcheck", {}, {className:"modal-super"});
            return false
        });

    }

    /* 设备概览->出口速率 */
    function get_AllInterface_Init ()
    {
        function getAllInterfacesSuc (data) {
            /* 三层口，获取上行口流量信息成功。 */
            function getWanInterfaceSuc (data2) {
                var aData=[];
                for (var i = 0; i < data2.histdataList.length; i++)
                {
                    var temp = JSON.parse(data2.histdataList[i]);
                    aData[i] = temp.dataList;
                }
                $("#config").addClass("hide");
                $("#charts").removeClass("hide");
                $("#filter_usage").addClass("hide");
                $("#usage_block").addClass("hide");
                drawChartWan(aData);
            }
            function getWanInterfaceFail (data2) {
                // body...

            }

            /* uplink，获取上行口流量信息成功 */
            function getUpLinkInterfaceSuc (data2) {
                var aData = JSON.parse(data2.histdataList[0]);
                $("#config").addClass("hide");
                $("#charts").removeClass("hide");
                $("#usage_block").addClass("hide");
                drawChart(aData.dataList);
                var aIntList = [];
                $.each(data.InterfaceList,function(i,o){
                    aIntList.push(o.interfaceName);
                });
                $("#SetfigUpport").singleSelect("InitData",aIntList);
            }
            function getUpLinkInterfaceFail (odata) {
                // body...
            }

            /* 遍历并判断是否有具有三层口 */
            for(var i = 0; i < data.InterfaceList.length; i++)
            {
                /* 如果有三层口，直接获取上行口流量的信息。并返回，不再继续向下判断 */
                if(data.InterfaceList[i].interfaceType == 1)
                {

                    var wanInterfaceFlowOpt = {
                        url:  MyConfig.path +"/devmonitor/getUpLinkInterfaceData",
                        type: "GET",
                        dataType:"json",
                        data:{
                            devSN:FrameInfo.ACSN,
                            interfaceType:1
                        },
                        onSuccess:getWanInterfaceSuc,
                        onFailed:getWanInterfaceFail
                    };
                    Utils.Request.sendRequest(wanInterfaceFlowOpt);
                    return;
                }
            }
            /* 如果没有三层口，就判断是否设置了uplink上行二层口 */
            for(var i = 0; i < data.InterfaceList.length; i++)
            {
                /* 如果有上行二层的信息，就获取上行口数据 */
                if(data.InterfaceList[i].interfaceType == 3)
                {
                    var UpLinkInterfaceFlowOpt = {
                        url:  MyConfig.path +"/devmonitor/getUpLinkInterfaceData",
                        type: "GET",
                        dataType:"json",
                        data:{
                            devSN:FrameInfo.ACSN,
                            interfaceType:2
                        },
                        onSuccess:getUpLinkInterfaceSuc,
                        onFailed:getUpLinkInterfaceFail
                    };
                    Utils.Request.sendRequest(UpLinkInterfaceFlowOpt);
                    return;
                }
            }
            var aIntList = [];
            $.each(data.InterfaceList,function(i,o){
                aIntList.push(o.interfaceName);
            });
            $("#ConfigUpport").singleSelect("InitData",aIntList);
            $("#SetfigUpport").singleSelect("InitData",aIntList);
        }
        function getAllInterfacesFail (data) {
            // body...
        }

        /* 先获取所有接口的列表信息 */
        var allInterfaceFlowOpt = {
            url:  MyConfig.path +"/devmonitor/getAllInterfaces",
            type: "GET",
            dataType:"json",
            data:{
                devSN:FrameInfo.ACSN
            },
            onSuccess:getAllInterfacesSuc,
            onFailed:getAllInterfacesFail
        };
        Utils.Request.sendRequest(allInterfaceFlowOpt);
    }

    function drawChart(oData)
    {
        var aSpeedUp = [];
        var aSpeedDown = [];
        var aTimes = [];
        oData = oData.reverse();
        $.each(oData,function(i,oData){
            aSpeedUp.push(oData.speed_up);
            aSpeedDown.push(-oData.speed_down);
            var temp = new Date(oData.updateTime);
            aTimes.push(timeStatus(temp.getHours())+":"+timeStatus(temp.getMinutes())+":"+timeStatus(temp.getSeconds()));
        });
        var aStream = getRcText("UP_DOWN").split(",");
        var option = {
            width:"100%",
            height:210,
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#80878C',
                        width: 2,
                        type: 'solid'
                    }
                },
                formatter:function(y,x){
                    var sTips = y[0][1];
                    for(var i = 0; i < y.length; i++)
                    {
                        sTips = sTips + "<br/>" + y[i][0] + ":" + Utils.Base.addComma(Math.abs(y[i][2]),"rate",1);
                    }
                    return sTips;
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "center",
                data: aStream
            },
            grid: {
                x: 65, y: 40,
                borderColor: '#FFF'
            },
            calculable: false,
            dataZoom: {
                type: 'slider',
                show: true,
                xAxisIndex:[0],
                start:80,
                end:100,
                fillerColor:'#69C4C5',
                handleColor:'#617085',
                backgroundColor:'#E6F5F6'
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:true,
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#80878C', width: 2}
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#80878C', width: 2}
                    },
                    axisTick :{
                        show:false
                    },
                    data: aTimes
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#80878C', width: 2},
                        formatter:function(nNum){
                            return Utils.Base.addComma(Math.abs(nNum),'rate',1);
                        }
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#80878C', width: 2}
                    }
                }
            ],
            series: [
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: aStream[0],
                    data: aSpeedUp
                },
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: aStream[1],
                    data: aSpeedDown
                }
            ]

        };
        var oTheme = {
            color: ["rgba(242,188,152,1)","rgba(120,206,192,0.6)"],
        };
        g_oLineChart = $("#usage").echart ("init", option,oTheme);
    }

    function _init ()
    {
        initData();
        initForm();

        var opt = {
            type:"topology"
        };
        $("#topology").Panel("init",opt);
    }
    function _resize (jParent)
    {
        if(g_oResizeTimer)
        {
            clearTimeout(g_oResizeTimer);
        }
        g_oResizeTimer = setTimeout(function(){
            g_oLineChart && g_oLineChart.chart && g_oLineChart.resize();
        }, 200);
    }

    function _destroy()
    {
        console.log("00000000000 destroy");
        g_oLineChart = null;
        clearTimeout(g_oTimer);
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Panel","Minput","SingleSelect"],
        "utils": ["Base", "Device","Request"]

    });

}) (jQuery);