(function ($)
{
    var MODULE_NAME = "dashboard.terminalinfo";
    var g_StartTime, g_EndTime,hTimer;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("terminal_rc", sRcName);
    }

    function onOpenDetailShow(oData)
    {
        function datatime (argument)
        {
            var day  = parseInt(argument/86400);
            var temp = argument%86400;
            var hour = parseInt(temp/3600);
            temp = argument%3600;
            var mini = parseInt(temp/60);
            var sec  = argument%60;
            if (hour < 10)
            {
                var sDatatime = day+":0"+hour;
            }
            else
            {
                var sDatatime = day+":"+hour;
            }
            if (mini < 10)
            {
                 sDatatime = sDatatime+":0"+mini;
            } else
            {
                 sDatatime = sDatatime+":"+mini;
            }
            if (sec < 10)
            {
                sDatatime = sDatatime+":0"+sec;
            } else
            {
                sDatatime = sDatatime+":"+sec;
            }
            return sDatatime;
        }

    }

    function drawSignalstrength(xData,yData)
    {
        var xaData=[],yaData =[];
        for(var i = 1;i< xData.length;i++)
        {
            xaData.push(parseInt(xData[i]));
        }
        for(var i=0;i<yData.length;i++)
        {
            yaData.push(yData[i].subData.length);
        }
        var option = {
            height:180,
            title : {
                subtext: '',
                x:'center',
                y:"60"
            },
            tooltip : {
                show:false,
                trigger: 'axis'
            },
            calculable : false,
            grid :
            {
                x:47, y:42, x2:50, y2:10,
                borderColor : '#fff'
            },
            xAxis : [
                {
                    show:false,
                    name:"dB",
                    type : 'category',
                    data :xaData

                }
            ],
            yAxis : [
                {
                    show:false,
                }
            ],
            series : [
                {
                    name:"yistLine",
                    type:'bar',
                    barCategoryGap: '40%',
                    data:yaData,
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'top',
                                formatter: function(oData){
                                    return oData.value;

                                }
                            },
                            color:function(oData){
                                var aColor = ['#D84B61','#E893A0','#EFB7C0','#F99D41','#F5B638','#C3E7E8','#A5DCDC','#86D0D1','#69C4C5','#45B5BB','#35C5BB'];

                                return aColor[oData.dataIndex];
                            }
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color : ['#229A61','#3DD38C','#79E1CD','#FFDC6D','#F9AB6B','#EF6363','#F09ABF','#BEC7D0']
        };

        $("#signalstrength").echart("init", option, oTheme);

    }

    function drawRate(xData,yData)
    {
        var xaData=[],yaData =[];
        for(var i = 0;i< xData.length;i++)
        {
            xaData.push(parseInt(xData[i]));
        }
        for(var i = 0;i< yData.length;i++)
        {
            yaData.push(yData[i].subData.length);
        }
        var option = {
            height:180,
            title : {
                subtext: '',
                x:'center',
                y:"60"
            },
            tooltip : {
                show: false,
                trigger: 'axis',
                formatter:function(y,x){
                    var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + y[0][2] + "<br/>" +
                        y[1][0] + ":" + (-y[1][2])
                    return y;
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
            grid :
            {
                x:47, y:42, x2:30, y2:10,
                borderColor : '#fff'
            },
            xAxis : [
                {
                    show:false,
                    name:"bps",
                    type : 'category',
                    data : xaData
                }
            ],
            yAxis : [
                {
                    show:false,
                    name:getRcText("RATE"),
                    splitLine:false,
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2}
                    },
                    axisLine : {
                        show:true,
                        lineStyle :{color: '#617085', width: 1}
                    },
                    type : 'value'
                }
            ],
            series : [
                {
                    name:"yistLine",
                    type:'bar',
                    barCategoryGap: '40%',
                    data:yaData,
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'top',
                                formatter: function(oData){
                                    return oData.value;

                                }
                            },
                            color:function(oData){
                                var aColor = ['#D84B61','#E893A0','#EFB7C0','#F99D41','#F5B638','#C3E7E8','#A5DCDC','#86D0D1','#69C4C5','#45B5BB'];

                                return aColor[oData.dataIndex];
                            }
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color : ['#229A61','#3DD38C','#79E1CD','#FFDC6D','#F9AB6B','#EF6363','#F09ABF','#BEC7D0']
        };
        $("#rate").echart("init", option );
    }

    function drawApterminal(aName, aValue)
    {
        /******for text**********/
        var nWidth = $("#apterminal").parent().width()*0.95;
        var nlength = 600/aName.length > 100 ? 100 : 600/aName.length;
        var option = {
            height:"200px",
            grid: {
                x:3, y:20, x2:100, y2:0,
                borderColor: '#FFFFFF'
            },

            tooltip : {
                show: false,
                trigger: 'axis',
                formatter:function(y,x){
                    var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + y[0][2] + "<br/>" +
                        y[1][0] + ":" + (-y[1][2])
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
            dataZoom : {
                show : true,
                realtime : true,
                start : 0,
                end : nlength,
                zoomLock: true,
                orient: "vertical",
                width: 5,
                x: nWidth,
                backgroundColor:'#F7F9F8',
                fillerColor:'#bec6cf',
                handleColor:'#bec6cf',
                border:'none'
            },
            xAxis : [
                {
                    type : 'value',
                    splitLine : {
                        show:false
                    },
                    splitArea : {
                        areaStyle : {
                            color: '#174686'
                        }
                    },
                    axisLine  : {
                        show:false,
                        lineStyle :{color: '#373737', width: 1}
                    },
                    axisLabel : {
                        formatter:function(nNum){
                            return nNum < 0 ? -nNum : nNum;
                        }
                    }
                }
            ],
            yAxis : [
                {
                    //    name: "APP",
                    type : 'category',
                    axisLine  : {
                        show:false,
                        lineStyle :{color: '#373737', width: 1}
                    },
                    axisTick : {show: false},
                    data : aName,
                    splitLine : {
                        show : false
                    }
                }
            ],
            series : [
                {
                    name:'Number',
                    type:'bar',
                    data:aValue,
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'right',
                                formatter: function(oData){
                                    return oData.value;
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
                    barCategoryGap:'60%',
                    type:'bar',
                    data:aName,
                    stack: 'kk',
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'insideLeft',
                                formatter: function(oData){
                                    return oData.name;
                                },
                                textStyle: {color:"#47495d"}
                            },
                            color: 'rgba(0,0,0,0)'
                        },
                        emphasis: {
                            label : {
                                show: true,
                                formatter: function(oData){
                                    return oData.name;
                                },
                                textStyle: {color:"#47495d"}
                            }
                            , color: 'rgba(0,0,0,0)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color: ['#69C4C5','#F6F7F8']
        };
        $("#apterminal").echart ("init", option, oTheme);
    }

    function  drawLabel(jLabel,opt)
    {
        var x1 = opt.x1 || 0, x2 = opt.x2 || 0;
        var aData =opt.data,nLen = aData.length-1;
        var nWidth = jLabel.width() -x1 -x2;
        var nItemWidth = nWidth/nLen;
        var nItemMargin = 0;

        jLabel.empty().css({"margin-left":x1+"px"});

        for(var i=0;i<=nLen;i++)
        {
            var jItem = $('<div>'+aData[i]+'</div>');
            if(nLen == i)
            {
                nItemWidth = 20;
            }
            if(String(aData[i]).length - String(aData[i-1]).length)
            {
                nItemMargin -=5;
            }

            jItem.css({
                "width" : nItemWidth + "px",
                "text-align" : "left",
                "float" : "left",
                "margin-left" : nItemMargin + "px"
            });
            nItemMargin = 0;
            jItem.appendTo(jLabel);
        }
    }

    function updateInfor(aData)
    {

        var oInfor = {
            Total : aData.length, wsm1 : 0, wsm2 : 0, wsm4 : 0, wsm8 : 0, wsm16 : 0, wsm64 : 0
        };

        var oAll = {
            speed : [
                {name:"S10",subData:[]},
                {name:"S15",subData:[]},
                {name:"S20",subData:[]},
                {name:"S25",subData:[]},
                {name:"S30",subData:[]},
                {name:"S35",subData:[]},
                {name:"S40",subData:[]},
                {name:"S45",subData:[]},
                {name:"S50",subData:[]},
                {name:"S55",subData:[]},
                {name:"S60",subData:[]}
            ],
            snr : [
                {name:"S0",subData:[]},
                {name:"S1",subData:[]},
                {name:"S2",subData:[]},
                {name:"S3",subData:[]},
                {name:"S4",subData:[]},
                {name:"S5",subData:[]},
                {name:"S6",subData:[]},
                {name:"S7",subData:[]}
            ]
        };
        for(var i=0;i<oInfor.Total;i++)
        {
            var oTemp = aData[i];

            // oInfor["wsm" + oTemp.WirelessMode]++;

            var nSignal = parseInt(oTemp.signalStrength);
            var nRate = parseInt(oTemp.NegoMaxRate);
            if(nSignal <= 10){
                oAll.speed[0].subData.push(oTemp);
            }else if(nSignal > 10 && nSignal <= 15){
                oAll.speed[1].subData.push(oTemp);
            }else if(nSignal > 15 && nSignal <= 20){
                oAll.speed[2].subData.push(oTemp);
            }else if(nSignal > 20 && nSignal <= 25){
                oAll.speed[3].subData.push(oTemp);
            }else if(nSignal > 25 && nSignal <= 30){
                oAll.speed[4].subData.push(oTemp);
            }else if(nSignal > 30 && nSignal <= 35){
                oAll.speed[5].subData.push(oTemp);
            }else if(nSignal > 35 && nSignal <= 40){
                oAll.speed[6].subData.push(oTemp);
            }else if(nSignal > 40 && nSignal <= 45){
                oAll.speed[7].subData.push(oTemp);
            }else if(nSignal > 45 && nSignal <= 50){
                oAll.speed[8].subData.push(oTemp);
            }else if(nSignal > 50 && nSignal <= 55){
                oAll.speed[9].subData.push(oTemp);
            }else if(nSignal > 55){
                oAll.speed[10].subData.push(oTemp);
            }

            if(nRate <= 6){
                oAll.snr[0].subData.push(oTemp);
            }else if(nRate > 6 && nRate <= 12){
                oAll.snr[1].subData.push(oTemp);
            }else if(nRate > 12 && nRate <= 24){
                oAll.snr[2].subData.push(oTemp);
            }else if(nRate > 24 && nRate <= 36){
                oAll.snr[3].subData.push(oTemp);
            }else if(nRate > 36 && nRate <= 54){
                oAll.snr[4].subData.push(oTemp);
            }else if(nRate > 54 && nRate <= 108){
                oAll.snr[5].subData.push(oTemp);
            }else if(nRate > 108 && nRate <= 450){
                oAll.snr[6].subData.push(oTemp);
            }else if(nRate > 450){
                oAll.snr[7].subData.push(oTemp);
            }

        }

        return oAll;
    }

    //分权分级
    function getLimit(){
        var limit = Frame.Permission.getCurPermission();

        if(limit.indexOf("MONITOR_EXEC") == -1){
            $("exportFile").addClass("hide");
        }
    }

    function initData()
    {
        var nTime = new Date();
        var end = nTime.toISOString().split(".")[0];
            g_EndTime = nTime.getTime();
            g_StartTime = nTime - 43200000;//12H,1H = 3600000
        var start = new Date(g_StartTime).toISOString().split(".")[0];
        // fei guan lian wu xian zhong duan
        aplinkList();
        zhongduantongji();
        wuxianzhiliang();
        guanlianzhongduan();
        yingyongredu();

        getLimit();
    }

    function drawAnalysisPie(AppData)
    {
        var aUserAPPList=[];
        for(var i= 0;i<AppData.length;i++)
        {
            var oName={};
            oName = AppData[i].APPName;
            var a={
                name:oName,
                value:AppData[i].Total
            }
            aUserAPPList.push(a);
        }
        aUserAPPList = aUserAPPList.sort(function(a,b){
                return b.value-a.value
             }).slice(0,8);
        var option = {
            height:220,
            tooltip : {
                show:true,
                trigger: 'item',
                formatter: "{b}<br/> {c} ({d}%)"
            },
            calculable : false,
            myLegend:{
                scope : "#terminaltype_pie-Legend",
                width: "40%",
                right: "10%",
                top: 0,
            },
            series : [
                {
                    name:'App flow anaylsis',
                    type:'pie',
                    radius : ['50%', '90%'],
                    center: ['25%', '45%'],
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
                    data:aUserAPPList
                }
            ]
        };
        var oTheme = {
            color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
        };
        $("#terminaltype").echart ("init", option,oTheme);
    }

    function getPieData(aAppflow)
    {
        var oAllApp = {};
        var allStationTotal=[];
        for(var i = 0; i < aAppflow.length; i++)
        {
            var oAllStation = {};
            var sName = aAppflow[i].APPName;
            if(!oAllApp[sName])
            {
                oAllStation.APPName=aAppflow[i].APPName;
                oAllStation.Total = 1;
                oAllApp[sName] = oAllStation;

            }
            else
            {
                oAllApp[sName].Total++;
            }

        }
        $.each(oAllApp,function(key,value){
            allStationTotal.push(value);
        })

    return allStationTotal;
    }

    function yingyongredu(){
        var date = new Date();
        var startTime = date.setHours(0, 0, 0);
        var endTime = date.setHours(24, 0, 0);

        function getDpiSuc(data){
            console.log("suc terminal sucess");
            var up = data.message;
                var aUserApp=[];
                for(var i=0; i<up.length; i++)
                {
                    var oUserApp={
                        "APPName":up[i].APPName,
                        "UserMAC":up[i].UserMAC
                    }
                     aUserApp.push(oUserApp);
                }

                      var aPieData = getPieData(aUserApp);
                      drawAnalysisPie(aPieData);

        }

        function getDpiFail(err){
            console.log("fail");
        }

        var dpiOpt = {
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
                        "APPName",
                        "UserMAC"
                    ]
                },
            onSuccess:getDpiSuc,
            onFailed:getDpiFail
        }

        Utils.Request.sendRequest(dpiOpt);
        }

    function zhongduantongji() {
        function getSationFlowSuc(data) {
            console.log("suc terminal sucess");
            var clientStatistic = data["client_statistic"];
            var oInfor = {
                SUM: 0,
                wireless: 0,
                wired: 0,
                wsm1: clientStatistic["b"],  //802.11b
                wsm2: clientStatistic["a"],  //802.11a
                wsm4: clientStatistic["g"],  //802.11g
                wsm8: clientStatistic["gn"],  //802.11gn
                wsm16: clientStatistic["an"], //802.11an
                wsm64: clientStatistic["ac"]  //802.11ac
            };
            oInfor.SUM = oInfor.wsm1 + oInfor.wsm2 + oInfor.wsm4 + oInfor.wsm8 + oInfor.wsm16 + oInfor.wsm64;
            oInfor.wireless = oInfor.SUM;
            Utils.Base.updateHtml($("#terminal-num"), oInfor);
        }

        function getSationFlowFail(err) {
            console.log("fail");
        }

        var stationFlowOpt = {
            type: "GET",
            url: MyConfig.path + "/stamonitor/clientstatistic?devSN=" + FrameInfo.ACSN,
            dataType: "json",
            onSuccess: getSationFlowSuc,
            onFailed: getSationFlowFail
        }

        Utils.Request.sendRequest(stationFlowOpt);

    }

    //wuxianzhiliang
    function wuxianzhiliang()
    {
        function getWirelessFlowSuc(data){
            console.log("suc terminal sucess");
            var aTemplate = [];
            var aSignalStrength=[];
            var aClientList = data.clientList||[];
            aClientList.forEach(function(client){
                aTemplate.push({
                    MacAddress: client["clientMAC"],
                    Ipv4Address: client["clientIP"]|| "0.0.0.0",
                    UserName: client[""],
                    Ssid: client["clientSSID"],
                    ApName: client["ApName"],
                    clientVendor: client["clientVendor"],
                    WirelessMode: client["clientName"]
                });

            });
            $("#wirelessterminal_slist").SList ("refresh", aTemplate);

            var aSignalStrength_avg=['0','10','15','20','25','30','35','40','45','50','55','60(dB)'];
            drawLabel($("#signalstrengthLabel"),{
                data : aSignalStrength_avg,
                x1:40,
                x2:50
            });

            //Label_Rate

            var aRate_avg=['0','6','12','24','36','54','108','450','1800(Mbps)'];
            drawLabel($("#rateLabel"),{
                data : aRate_avg,
                x1:40,
                x2:100
            });
            g_allData = updateInfor(aClientList);
            drawSignalstrength(aSignalStrength_avg,g_allData.speed);
            drawRate(aRate_avg,g_allData.snr)

        }

        function getWirelessFlowFail(){
            console.log("fail terminal fail");
        }

        var wirelessFlowOpt = {
            url: MyConfig.path+"/stamonitor/web/stationlist?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess:getWirelessFlowSuc,
            onFailed:getWirelessFlowFail
        }

        Utils.Request.sendRequest(wirelessFlowOpt);

    }

    //ap guan lian zhong duan shu
    function guanlianzhongduan()
    {
        function getStationsAllSuc(data){
            console.log("err terminal sucess");
            var aAssClientNum = data.assClientNum||[];

            var aName=[];
            var aNum=[];
            for(var i=0;i<aAssClientNum.length;i++)
            {
                aName.push(aAssClientNum[i].ApName);
                aNum.push(aAssClientNum[i].Count);
            }
            drawApterminal(aName,aNum);
        }

        function getStationsAllFail(){
            console.log("err terminal fail");
        }

        var stationsAllOpt = {
            url: MyConfig.path+"/stamonitor/web/assclientcount?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess:getStationsAllSuc,
            onFailed:getStationsAllFail
        }

        Utils.Request.sendRequest(stationsAllOpt);

    }
    /* |��?3??????����|��?o?����oy??|���衧a */
    function exportNow(){

        function exportSuc(data){
            // if(data.errorcode == 0)
            if(data.retCode==0)
            {
                $("#exportFile").get(0).src = data.fileName;
            }else{
                console.log('shi bai le');
            }
        }

        function exportFail(error){
            console.log('Export log file failed: ' + error);
        }

        var exportOpt = {
            url: "/v3/fs/exportClientsList",
            type: "POST",
            dataType: "json",
            data: {
                devSN: FrameInfo.ACSN
            },
            onSuccess: exportSuc,
            onFailed: exportFail
        };

        Utils.Request.sendRequest(exportOpt);
    }


    function initGrid()
    {
        var opt = {
                showHeader: true,
                multiSelect: false,
                colNames: getRcText ("WIRELESSTERMINAL"),
                pageSize:8,
                colModel: [
                    {name: "MacAddress", datatype: "String",width:120},
                    {name: "Ipv4Address", datatype: "String",width:100},
                    {name: "UserName", datatype: "String",width:100},
                    {name: "Ssid", datatype: "String",width:100},
                    {name: "ApName", datatype: "String",width:100},
                    {name: "clientVendor", datatype: "String",width:100},
                    {name: "WirelessMode", datatype: "String",width:100}
                ],
                buttons: [
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow}
            ]
            };
            $("#wirelessterminal_slist").SList ("head", opt);

            var opt = {
                showHeader: true,
                multiSelect: false,
                colNames: getRcText ("NWT"),
                pageSize:8,
                colModel: [
                    {name: "MacAddress", datatype: "String",width:100},
                    {name: "ReportSensorNum", datatype: "String",width:60},
                    {name: "FirstReportTime", datatype: "String",width:60},
                    {name: "Channel", datatype: "String",width:60},
                    {name: "Rssi", datatype: "String",width:50},
                    {name: "BSSID", datatype: "String",width:80}
                ]
            };
            $("#nwt_slist").SList ("head", opt);

            var opt = {
                showHeader: true,
                multiSelect: false,
                colNames: getRcText ("WIREDTERMINAL"),
                colModel: [
                    {name: "MacAddress", datatype: "String",width:100},
                    {name: "Ipv4Address", datatype: "String",width:60},
                    {name: "AbbreviatedName", datatype: "String",width:60},
                    {name: "Time", datatype: "String",width:50}
                ]
            };
            $("#wiredterminal_slist").SList ("head", opt);

            var opt = {
                search:false,
                multiSelect: false,
                colNames: getRcText ("detail-list-title"),
                colModel: [
                    {name: "MacAddress", datatype: "String",width:100},
                    {name: "IpAddress", datatype: "String",width:60},
                    {name: "UserName", datatype: "String",width:60},
                    {name: "Ssid", datatype: "String",width:60},
                    {name: "ApName", datatype: "String",width:50},
                    {name: "WirelessMode", datatype: "String",width:80},
                    {name: "VLAN", datatype: "String",width:40},
                    {name: "Throughput", datatype: "String",width:100},
                    {name: "UpTime", datatype: "String",width:80}
                ]
            };
            $("#detail-list").SList ("head", opt);
    }


    function initForm()
    {
        $("#tableForm").form("init", "edit", {"title":getRcText("TITLE_TERINFO"),"btn_apply": false,"btn_cancel":false});
    }

    // fei guan lian wu xian zhong duan
    function aplinkList(){
        var date = new Date();
        var startTime = date.setHours(0, 0, 0);
        var endTime = date.setHours(23, 59, 59);

        function dataUtil(params){
            if(params){
                    var date= new Date(params*1000);
                    date= date.toLocaleString()
                    return date;
                }
            return "";
        }
        function getClientprobeSuc(data){
            console.log("temeral sucess");
            var aClientProbes = data.Message||[];
            /* for text*/
            var aClient=[];
            var quality=[];
            for(var i = 0; i < aClientProbes.length; i++)
            {
                var date =dataUtil(aClientProbes[i].FirstReportTime);
                var oTemp = {
                    MacAddress:aClientProbes[i].MacAddress,
                    ReportSensorNum:aClientProbes[i].ReportSensorNum,
                    Channel:aClientProbes[i].Channel,
                    FirstReportTime:date,
                    Rssi:""+(aClientProbes[i].RssiMax||""),
                    BSSID:""
                };
                aClient.push(oTemp);

                var qualityObj = {
                    MacAddress:aClientProbes[i].MacAddress,
                    Rssi:aClientProbes[i].RssiMax||0

                };
                quality.push(qualityObj);
            }

            /*end*/
            $("#nwt_slist").SList ("refresh", aClient);
            quality.sort(function(a,b){return a.Rssi- b.Rssi });
        }

        function getClientprobeFail(){
            console.log("fail");
        }

        var getClientprobeOpt = {
            url:MyConfig.path + '/ant/read_probeclient',
            type: "POST",
            data:{
                Method:"GetClient",
                Param:{
                    ACSN:FrameInfo.ACSN,
                    StartTime: startTime,
                    EndTime: endTime                    
                },
                return:{}
            },
            dataType: "json",
            onSuccess:getClientprobeSuc,
            onFailed:getClientprobeFail
        }

        Utils.Request.sendRequest(getClientprobeOpt);

    }

    function _init ()
    {
        initData();
        initForm();
        initGrid();
    }

    function _resize(jParent)
    {
        if(hTimer)
        {
            clearTimeout(hTimer);
        }
        hTimer = setTimeout(wuxianzhiliang,200);
    }

    function _destroy()
    {
        console.log("destory**************");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","Echart","Form"],
        "utils": ["Base","Request"]
    });
}) (jQuery);
