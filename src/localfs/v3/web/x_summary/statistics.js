;(function ($) {
    var MODULE_BASE = "x_summary"
    var MODULE_NAME = MODULE_BASE+".statistics";
    var g_jForm;
    var g_aStatus = false;
	var strAnt = MyConfig.path + '/ant';
    var g_type = 0;
    var g_map = 0;
    var g_hotmap = 0;
    var g_judge = [];
    var g_timeout = 0;
    var g_preStatus = 0;
    var hPending = null;
    var ostatistics = {};
    var oProbeChoice = {
        TimeClassify:"statistics",
        GetDayStatistic:"statistics",
        GetClient:"clientprobe",
        GetAssoc:"association",
        StatusClassify:"status",
        GetVendor:"vendor",
        GetDuration:"duration",
        GetSsid:"ssid",
        GetAllData:"alldata",
        DaysInfo:"alldata"
    }

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("probe_statistics_rc", sRcName);
    }

    function GetDayNow(endTime)
    {
        var nowDay = new Date();

    }

    function dealData(data)
    {
        var oVendor = {};
        var aVendor = [];
        var oAssoc = {};
        var aAssoc = [];
        var oDuration = {};
        var aDuration = [];
        var aClientCount = [];
        var oSsid = {};
        var aSsid = [];

        for(var i = 0; i < data.length; i++)
        {
            var vendorTmp = data[i].Vendor;
            //vendor
            for(var j = 0; j < vendorTmp.length; j++)
            {
                oVendor[vendorTmp[j].Vendor] ? (oVendor[vendorTmp[j].Vendor] += vendorTmp[j].Count) : (oVendor[vendorTmp[j].Vendor] = vendorTmp[j].Count);
            }
            //assoc

            if(data[i].hasOwnProperty("DisAssoc") && data[i].hasOwnProperty("Count"))
            {
                oAssoc['disassociation'] ? (oAssoc['disassociation'] += data[i].DisAssoc) : (oAssoc['disassociation'] = data[i].DisAssoc);

                oAssoc['association'] ? (oAssoc['association'] += (data[i].Count - data[i].DisAssoc) ) : (oAssoc['association'] = (data[i].Count - data[i].DisAssoc));
            }

            //Duration
            for(var n = 0; n < data[i].Duration.length; n++)
            {
                var temp = n + 1;
                var tempName = "time" + temp;
                oDuration[tempName] ? (oDuration[tempName] += data[i].Duration[n]) : (oDuration[tempName] = data[i].Duration[n]);
            }
            //Rssi
            var tmpCount = {};

            tmpCount.value = data[i].Count;
            tmpCount.name = data[i].Date;
            aClientCount.push(tmpCount);

            //Ssid
            var tempSsid = data[i].Ssid;
            for(var s = 0; s < tempSsid.length; s++)
            {
                if(!tempSsid[s].Ssid)
                {
                    continue;
                }

                oSsid[tempSsid[s].Ssid] ? (oSsid[tempSsid[s].Ssid] += tempSsid[s].Count) : (oSsid[tempSsid[s].Ssid] = tempSsid[s].Count);
            }

        }
        //将数据加工到直接使用的类型
        for(var q in oVendor)
        {
            var temp = {Vendor:q, Sum:oVendor[q]};
            aVendor.push(temp);
        }
        for(var q in oAssoc)
        {
            if(q == 'disassociation')
            {
                aAssoc.push({DissociativeStatus:true, Sum:oAssoc[q]});
            }
            else
            {
                aAssoc.push({DissociativeStatus:false, Sum:oAssoc[q]});
            }
        }

        for(var q in oSsid)
        {
            var temp = {Ssid:q, Sum:oSsid[q]};
            aSsid.push(temp);
        }

        drawAssoc(aAssoc);
        drawClientTime(oDuration);
        drawVender(aVendor);
        drawSsid(aSsid);
        if(ostatistics.data.Param.EndTime - ostatistics.data.Param.StartTime > 24 * 60 * 60 * 1000)
        {
            drawAcctive([{Status:true, Count:0},{Status:true, Count:(aAssoc[0].Sum + aAssoc[1].Sum)}]);
            drawLine(aClientCount,ostatistics.data.Param.StartTime,ostatistics.data.Param.EndTime);
        }

    }

    function getAllData()
    {
        function myCallback(ainfo){
            var data = ainfo.alldata || [];
            if(data.length == undefined)
            {
                data = [data];
            }
            judgeResult();
            dealData(data);
        }
        var association = {
            url:strAnt+"/read_probeclient",
            data:{
                Method:"GetAllData",
                Param:{
                    ACSN:FrameInfo.ACSN,
                    StartTime:ostatistics.data.Param.StartTime,
                    EndTime:ostatistics.data.Param.EndTime,
                },
                Return:[]
            }
        };
        if(ostatistics.data.Param.EndTime - ostatistics.data.Param.StartTime >24 * 60 * 60 * 1000 )
        {
            association.data.Method = "DaysInfo";
        }
        ajax2server([association], myCallback, func_error);
    }

    function judgeResult()
    {
        var nlength = 2;
        if(ostatistics.data.Param.EndTime - ostatistics.data.Param.StartTime > 24 * 60 * 60 * 1000)
        {
            nlength = 1;
        }
        g_judge.push(1);
        if(g_judge.length == nlength)
        {
            clearTimeout(g_timeout);
            g_judge = [];
            $(".forbidden-click").removeClass("on");
            $(".forbidden-click").addClass("off");
        }
    }

    function DealChoice(nValue)
    {
         var dayTime = new Date();
         var dayNow = new Date(dayTime.toDateString()) - 0;

         switch (nValue)
         {
             case "0":
             {
                 ostatistics.data.Method = "GetAllData";
                 //ostatistics.data.Param.StartTime = parseInt(dayTime.getTime() - 24 * 60 * 60*1000 );
                 ostatistics.data.Param.StartTime = dayNow ;
                 ostatistics.data.Param.EndTime = new Date() - 0;
                 break;
             }
             case "1":
             {
                 ostatistics.data.Method = "DaysInfo";
                 ostatistics.data.Param.StartTime = dayNow - 7 * 24 * 60 * 60*1000 ;
                 ostatistics.data.Param.EndTime = dayNow;
                 break;
             }
             case "2":
             {
                 ostatistics.data.Method = "DaysInfo";
                 ostatistics.data.Param.StartTime =  dayNow - 30 * 24 * 60 * 60*1000;
                 ostatistics.data.Param.EndTime = dayNow;
                 break;
             }
             case "3":
             {
                 ostatistics.data.Method = "DaysInfo";
                 ostatistics.data.Param.StartTime = dayNow - 365 * 24 * 60 * 60*1000;
                 ostatistics.data.Param.EndTime = dayNow;
                 break;
             }
             case "4":
             {
                  break;
             }
         }
        if(nValue != 4)
            $("#cycle_date").text(getRcText("DATE_CYCLE").split(",")[nValue]);
        initData();
    }

    function forbiddenClick()
    {
        $(".forbidden-click").removeClass("off");
        $(".forbidden-click").addClass("on");
        g_judge = [];
        g_timeout = setTimeout(function(){
            $(".forbidden-click").removeClass("on");
            $(".forbidden-click").addClass("off");
            g_judge = [];
        },2*60*1000);
    }

    function drawHotMap()
    {

        function random(min,max){
            var r = Math.round(Math.random() * (max-min));
            return r + min ;
        }

        function randomDataArray() {
            var d = [];
            var len = 50;
            var len1 = 80;
            var len2 = 30;
            while (len--) {
                d.push([
                    random(100,250),
                    random(300,500),
                    Math.random()
                ]);
            }
            while (len1--) {
                d.push([
                    random(130,300),
                    random(80,250),
                    Math.random()
                ]);
            }
            while (len2--) {

                d.push([
                    random(500,700),
                    random(50,200),
                    Math.random()
                ]);
            }

            return d;
        }

        var option = {
            width:900,
            height:600,
            title : {
                text: getRcText("CHERT").split(",")[0]
            },
            series : [
                {
                    type : 'heatmap',
                    data : randomDataArray(),
                    hoverable : false
                },
                {
                    name:'sss',
                    type:'scatter',
                    symbol:'circle',
                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    data: [[25,50,30]],
                    markPoint : {
                        symbol:'circle',
                        effect:{
                            show: true,

                            loop: true,
                            period: 30,
                            scaleSize : 20,
                            bounceDistance: 1,
                            color :'rgba(160,195,255,1)',
                            shadowColor : '#32AAFF',
                            shadowBlur : 30
                        },
                        data : [
                            {name: 'getRcText("CHERT").split(",")[1]', value: 100,xAxis: 25, yAxis:50},
                        ],

                    },

                },
                {
                    name:'scatter2',
                    type:'scatter',
                    symbol:'circle',

                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    data: [[300,150,30]],
                    markPoint : {
                        symbol:'circle',
                        effect:{
                            show: true,

                            loop: true,
                            period: 30,
                            scaleSize : 20,
                            bounceDistance: 1,
                            color :'rgba(160,195,255,1)',
                            shadowColor : '#32AAFF',
                            shadowBlur : 30
                        },
                        data : [
                            {name: 'getRcText("CHERT").split(",")[1]', value: 100,x: 300, y:150},
                        ],

                    },
                },

                {
                    name:'sss',
                    type:'scatter',
                    symbol:'circle',
                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    data: [[100,175,30]],
                    markPoint : {
                        symbol:'circle',
                        effect:{
                            show: true,

                            loop: true,
                            period: 30,
                            scaleSize : 15,
                            bounceDistance: 1,
                            color :'rgba(160,195,255,1)',
                            shadowColor : '#32AAFF',
                            shadowBlur : 30
                        },
                        data : [
                            {name: 'getRcText("CHERT").split(",")[1]', value: 100,xAxis: 100, yAxis:175},
                        ],

                    },

                }
            ]
        };
        var oColor = ['red','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B','#91B2D2','#D7DDE4'];
        var otheme = {color:oColor};
        return $("#HotMapprobe").echart("init", option, otheme);
    }

    function drawMap()
    {
        function random(duration,min){
            var r = Math.round(Math.random() * duration);
            return r + min ;
        }

        function randomDataArray() {
            var d = [];
            var len = 50;
            var len1 = 80;
            var len2 = 30;
            while (len--) {
                d.push([
                    random(30,10),
                    random(70,10),
                    30,
                ]);
            }
            while (len1--) {
                d.push([
                    random(40,10),
                    random(100,100),
                    30,
                ]);
            }
            while (len2--) {
               
                d.push([
                    random(30,90),
                    random(50,150),
                    30,
                ]);
            }

            return d;
        }

        var option = {
            width:900,
            height:600,
            backgroundColor:'rgba(0,0,0,0)',

            grid:{
                borderWidth:0
            },

            xAxis : [
                {
                    type : 'value',
                    splitNumber: 4,
                    scale: true,
                    max:200,
                    min:0,
                    axisLine:{
                        show:false
                    },
                    splitLine:{
                        show:false
                    },
                    splitArea:{
                        show:false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitNumber: 4,
                    scale: true,
                    max:200,
                    min:0,
                    axisLine:{
                        show:false
                    },
                    splitLine:{
                        show:false
                    },
                    splitArea:{
                        show:false
                    }


                }
            ],
            series : [
                {
                    name:'scatter1',
                    type:'scatter',
                    symbol:'droplet',
                    symbolRotate:180,
                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    data: randomDataArray()
                },

                {
                    name:'sss',
                    type:'scatter',
                    symbol:'image://./css/image/mappin.png',
                    symbolSize:15,
                    data: [[25,50,30]],
                    markPoint : {
                        symbol:'circle',
                        effect:{
                           show: true,

                            loop: true,
                            period: 25,
                            scaleSize : 20,
                            bounceDistance: 1,
                            color :'rgba(160,195,255,1)',
                            shadowColor : '#32AAFF',
                            shadowBlur : 30
                        },
                        data : [
                            {name: 'getRcText("CHERT").split(",")[1]', xAxis: 25, yAxis:50},
                        ],

                    },

                },
                {
                    name:'scatter2',
                    type:'scatter',
                    symbol:'image://./css/image/mappin.png',
                    symbolSize:15,                    
                    data: [[30,150,30]],
                    markPoint : {
                        symbol:'circle',
                        effect:{
                           show: true,

                            loop: true,
                            period: 25,
                            scaleSize : 20,
                            bounceDistance: 1,
                            color :'rgba(160,195,255,1)',
                            shadowColor : '#32AAFF',
                            shadowBlur : 30
                        },
                        data : [
                            {name: 'getRcText("CHERT").split(",")[1]',xAxis: 30, yAxis:150},
                        ],

                    },
                },

                {
                    name:'sss',
                    type:'scatter',
                    symbol:'image://./css/image/mappin.png',
                    symbolSize:15,
                    data: [[100,175,30]],
                    markPoint : {
                        symbol:'circle',
                        effect:{
                            show: true,

                            loop: true,
                            period: 25,
                            scaleSize : 15,
                            bounceDistance: 1,
                            color :'rgba(160,195,255,0.5)',
                            shadowColor : '#32AAFF',
                            shadowBlur : 30
                        },
                        data : [
                            {name: 'getRcText("CHERT").split(",")[1]', value: 100,xAxis: 100, yAxis:175},
                        ],

                    },

                }
            ]
        };
        var oColor = ['rgba(5,147,3,1)','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B','#91B2D2','#D7DDE4'];
        var otheme = {color:oColor};
        return $("#probeHotMap").echart("init", option, otheme);
    }

    function drawLine(aData, startTime, endTime)
    {
        aData.sort(function(a,b){
            return a.name - b.name;
        });
        var xData = [];
        var yData = [];
        var data = [];
        var aType = getRcText("TYPE");

        if(ostatistics.data.Param.EndTime - ostatistics.data.Param.StartTime <= 60 * 24 * 60 * 1000)
        {
            for(var i = 0; i < aData.length; i++)
            {
                var tmpName = new Date(aData[i].name)
                xData.push(tmpName.toTimeString().slice(0,5));
                yData.push(aData[i].value);
                data.push([tmpName, aData[i].value]);
            }
            //xData.pop();
            //var tempNow = new Date();
            //xData[xData.length - 1] =(tempNow.toTimeString().slice(0,5));
        }
        else{
            for(var i = 0; i < aData.length; i++) {
                var tmpName = new Date(aData[i].name)
                xData.push(tmpName.toLocaleDateString());
                yData.push(aData[i].value);
                data.push([tmpName, aData[i].value]);
            }
        }
        var option = {
            height:320,

            grid: {
                x: 60,
                y: 50,
                x2:35,
                borderColor: '#FFF'
            },
            xAxis : [
                {
                    type : 'category',
                    splitNumber:10,
                    name:getRcText("AXIS").split(',')[1],
                    nameTextStyle:{color:"gray"},
                    splitLine:false,
                    boundaryGap : false,
                    axisLabel: {
                        interval:"auto",
                        rotate:0
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#F6F7F8', width: 1}
                    },
                    data:xData
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:getRcText("AXIS").split(',')[0],
                    nameTextStyle:{color:"gray"},

                    splitLine:{
                        show:true,
                        lineStyle :{color: '#F6F7F8', width: 1}
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#373737'}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E5E8E8', width: 1}
                    }
                }
            ],
            series : [
                {
                    type:"line",
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                color:"rgba(0,150,214,0.2)",
                                type: 'default'
                            },
                            lineStyle:{
                                width:1
                            }
                        }
                    },
                    smooth:true,
                    symbol:'circle',
                    symbolSize:0,

                    name:aType,
                    data: yData
                }
            ]
        };

        if(!data.length )
        {
            option = {
                height:300,
                grid: {
                    x: 40,
                    y: 50,
                    x2:35,
                    borderColor: '#FFF'
                },

                xAxis : [
                    {
                        type : 'category',
                        data : [''],
                        splitLine:false,
                        boundaryGap : false,
                        axisLabel: {
                            interval:"auto",
                            rotate:0
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#F6F7F8', width: 1}
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine:{
                            show:true,
                            lineStyle :{color: '#F6F7F8', width: 1}
                        },
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#373737'}
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#E5E8E8', width: 1}
                        }
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'line',
                        smooth:true,
                        symbol:'circle',
                        symbolSize:0,
                        data:[0]
                    }
                ]
            };
        }
        if(ostatistics.data.Param.EndTime - ostatistics.data.Param.StartTime >= 20 * 60 * 24 * 60 * 1000)
        {
            option.dataZoom = { show: true,start :0};

        }
        var oTheme = {
            color: ["rgba(0,150,214,1)","rgba(0,150,214,0.8)","rgba(0,150,214,0.6)","rgba(0,150,214,0.3)"]
        };
        $("#probe_line").echart("init", option, oTheme);


    }

    function drawClientTime(aData)
    {
        var aData = aData ;
        var aType = getRcText("CLIENTTIME").split(",");
        var aTimeData = [
                {name:aType[0], value:aData.time1},
                {name:aType[1], value:aData.time2},
                {name:aType[2], value:aData.time3},
                {name:aType[3], value:aData.time4},
                {name:aType[4], value:aData.time5}
            ];
        aTimeData = $.grep(aTimeData,function(oTemp, i){
            return Boolean(oTemp.value);
        });


        if(!aTimeData.length)
        {
            var option = {
                calculable : false,
                height:280,
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
            var labelFromatter = {
               normal : {
                    label : { 
                        textStyle: {
                          color:"black"
                        }
                    }
                }
            };
            $.each(aTimeData, function(i, oTemp){
                $.extend(oTemp,{itemStyle:labelFromatter});
            });
            var option = {
                calculable : false,
                height:280,
 
                tooltip : {
                    show:true,
                   // trigger: 'item',
                   formatter: "{b}:<br/> {c} ({d}%)"
                },
                series : [
                    {
                        type: 'pie',
                        radius : 75,
                        center: ['50%', '50%'],
                        data: aTimeData
                    }
                ]
            };
            var oTheme = {
                color: [
                    '#0096d6','#31A9DC','#62BCE2',
                    '#93D0EA','#C4E3F0'
                ]
            };
        }
        $("#Rssi_Pie").echart("init", option, oTheme);
    }

    function drawPercentChart(jEle, nval, sName, sColor)
    {

        var labelTop = {
            normal:{
                label:{
                    show:true,
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
        var labelFromatter = {
            normal: {
                label: {
                    formatter:nval + '%',
                    textStyle: {
                        baseline: 'top'
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
                color:'rgba(0,0,0,0)'
            }
        };
        var choice = [labelTop,labelBottom]
        var aname= [
            {name:sName, value:nval, itemStyle:labelTop},
            {name:"other", value:100-nval, itemStyle:labelBottom}

        ];

        var radius = ['55%','70%'];
        opt = {
            calculable : false,
            height:238,
            series : [
                {
                    type: 'pie',
                    radius : radius,
                    center: ['50%', '50%'],
                    itemStyle:labelFromatter,
                    data: aname
                }
            ]

        };
        jEle.echart("init", opt);

    }

    function drawAssoc(aStatics)
    {
        var sName = getRcText("NAME").split(",")[0];
        var nDisassocNum = 0;
        var nAssocNum = 0;
        var nSum = 0;
        if(!aStatics.length)
        {
            drawPercentChart($("#Assco_client"), Math.round(0), sName, "#19A0DA");
            Utils.Base.updateHtml($("#client_block"),{Total_Total:0,
                Total_associated:0,Total_dissociated:0});
            return false;
        }
        aStatics.forEach(function(i){
            if(i.DissociativeStatus == true){
                nDisassocNum = i.Sum;
            }
            if(i.DissociativeStatus == false){
                nAssocNum = i.Sum;
            }
        })

        nSum =nDisassocNum + nAssocNum;
        var nPercent = nAssocNum / nSum || 0;
        var oApClientNum = {Total_Total:nSum,
                            Total_associated:nAssocNum,
                            Total_dissociated:nDisassocNum
        };
        Utils.Base.updateHtml($("#client_block"),oApClientNum);
        drawPercentChart($("#Assco_client"), Math.round(nPercent*100.00), sName, "#19A0DA")

    }
    function drawAcctive(aStatics)
    {
        var sName = getRcText("NAME").split(",")[1];
        var aStatics = aStatics || [];
        var nactive = 0;
        var ninactive = 0;
        var ntotal = 0;
        if(!aStatics.length)
        {
            drawPercentChart($("#Active_pie"), Math.round(0), sName, "#19A0DA");
            Utils.Base.updateHtml($("#Status_block"),{Total_Active:0,
                            Total_Inactive:0});
            return false;
        }
        aStatics.forEach(function(i){
            if(i.Status != true){
                nactive = i.Count;
            }
            else
            {
                ninactive = i.Count;
            }
        })
        ntotal = nactive + ninactive;


        var oApClientNum = {Total_Active:nactive,
                            Total_Inactive:ninactive}

        var nPercent = nactive / ntotal || 0;
        Utils.Base.updateHtml($("#Status_block"),oApClientNum);
        drawPercentChart($("#Active_pie"), Math.round(nPercent*100.00), sName, "#19A0DA")

    }

    function drawVender(aData)
    {
        function compare(oArrayDataa, oArrayDatab)
        {
            return oArrayDatab.value - oArrayDataa.value;
        }
        var aVender = [];
        var bTemp = false;
        var oPhoneVenderList = $.MyLocale.PhoneVender;
        var labelFromatter = {
               normal : {
                    label : { 
                        textStyle: {
                          color:"black"
                        }
                    }
                }
            };
        var nSum0ther = 0;
        var specailUnkonwn = 0;
        aData.forEach(function(i){
            if( i.Vendor.toLowerCase() == "unknown")
            {
                specailUnkonwn = {name:getRcText("RC_UNKNOWN"),value: i.Sum, itemStyle:labelFromatter};
            }
            else
            {
                aVender.push({name:i.Vendor,value: i.Sum, itemStyle:labelFromatter});
            }

            nSum0ther+=i.Sum;
        });

        var oOthters = {name:getRcText("RC_OTHERS"),value:nSum0ther, itemStyle:labelFromatter};

        aVender.sort(compare);
        var oColor = ['#0195D7','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B','#91B2D2','#D7DDE4'];

        if(aVender.length > 9)
        {
            aVender = aVender.slice(0, 9);

            for(var nCounter = 0; nCounter < 9; nCounter++)
            {
                if(aVender[nCounter].name == "unknown")
                {
                    specailUnkonwn = 0;
                }
                oOthters.value -= aVender[nCounter].value;
            }
            if(specailUnkonwn)
            {
                oOthters.value -= specailUnkonwn.value;
                var tmmp = aVender.pop();
                oOthters.value += tmmp.value;
                aVender.push(specailUnkonwn);
                if(oOthters.value > 0){
                    aVender.push(oOthters);
                }
            }
        }
        else{
            var lastcolor = oColor.pop();
            if(specailUnkonwn)
            {
                oColor = oColor.slice(0,aVender.length);
                aVender.push(specailUnkonwn);
                oColor.push(lastcolor);
            }
        }


        if(!aData.length)
        {
            var option = {
                calculable : false,
                height:280,
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
          var option = {
                calculable : false ,
                height:280,

                tooltip : {
                    show:true,
                    formatter: "{b}:<br/> {c} ({d}%)"
                },
                series : [
                    {
                        type: 'pie',
                        radius : 75,
                        center: ['50%', '50%'],

                        data: aVender
                    }
                ]
            };
            var oTheme = {
                color:oColor
            };
        }
        $("#Vender_pie").echart("init", option, oTheme);
    }

    function topChange(top, lineHeight,sum, mixTop)//中间点距离上边高度， 行高， 数量， 最小上边距
    {
        if(mixTop != undefined)
        {
            if(top - sum * lineHeight / 2 < mixTop)
            {
                return mixTop;
            }
        }
        return parseInt(top - sum * lineHeight / 2);
    }

    function drawSsid(aType)
    {
        function compare(oArrayDataa, oArrayDatab)
        {
            return oArrayDatab.value - oArrayDataa.value;
        }
        var aData=[];
        var nSum = 0;
        var themeColor = 0;

        aType.forEach(function(i){
            var oTmp = {};
            oTmp.name =i.Ssid;
            oTmp.value = i.Sum;
            if(!oTmp.name)
            {
                oTmp.name = "Unknown";
            }
            else
            {
                aData.push(oTmp);
                nSum +=  i.Sum;
            }
        });
        aData.sort(compare);
        aData = aData.slice(0,6);
        var oOthers = {name:"Others", value:nSum};
        for(var i = 0; i < aData.length; i++)
        {
            oOthers.value-=aData[i].value;
        }
        if(oOthers.value){
            aData.push(oOthers);
        }
        if(!aData.length)
        {
            aData.push({name:'', value:1});
            themeColor = {color : ['#ccc']};
        }

        var option = {
            height:280,
            tooltip : {
                show:true,
                trigger: 'item',
                formatter: "{b}<br/> {c} ({d}%)"
            },
            calculable : false,
            myLegend:{
                scope : "#probe_Ssid",
                width: "51%",
                right: "-1%",
                top: topChange(130, 31, aData.length, 8),
            },
            series : [
                {
                    name:'anaylsis',
                    type:'pie',
                    radius : ['30%', '55%'],
                    center: ['25%', '50%'],
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
                    data:aData
                }
            ]
        };
        var oTheme = {};
        if(themeColor)
        {
            oTheme = themeColor;
        }
        else{
            oTheme = {
                color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
            };
        }

        $("#probe_Ssid_pie").echart("init", option,oTheme);
    }
    function optionPush(){
        function parseQuery(location) {
            var query = location.search.replace('?', '');
            var params = query.split('&');
            var result = {};
            $.each(params, function () {
                var temp = this.split('=');
                result[temp[0]] = temp.length === 2 ? temp[1] : undefined;
            });
            return result;
        }
        /*var $panel = $('#scenes_panel'), //  下拉面板
         $trigger = $('#change_scenes_trigger'),  //  点击展开的按钮
         $btnChange = $('#switchScenesBtn'),  //  确认按钮
         $selectedScene = $('#selectedScene'),  //  场景选择下拉框
         $devSn = $('#devSn'),  //  设备管理下拉
         $devContain = $('#device-contain'),
         $contain = $('#scene-contain');  //  容器*/
        var $panel = $('#reDevSelect #scenes_panel'), //  下拉面板
            $trigger = $('#reDevSelect #change_scenes_trigger'),  //  点击展开的按钮
            $btnChange = $('#reDevSelect #switchScenesBtn'),  //  确认按钮
            $selectedScene = $('#reDevSelect #selectedScene'),  //  场景选择下拉框
            $devSn = $('#reDevSelect #devSn'),  //  设备管理下拉
            $devContain = $('#reDevSelect #device-contain'),
            $contain = $('#reDevSelect #scene-contain');  //  容器
        //  if first load,set devsn value param's devsn
        var firstLoad = true, //   是否首次加载
            locales = {
                cn: {
                    trigger: '切换设备',
                    device: '选择设备',
                    shop: '选择场所',
                    online: '在线',
                    offline: '不在线'
                },
                en: {
                    trigger: 'Switch Device',
                    device: 'Device',
                    shop: 'Shop',
                    online: 'Online',
                    offline: 'Offline'
                }
            },
            _lang = $.cookie('lang') || 'cn';

        var senceInfo = parseQuery(window.location),
            model = senceInfo.model,  // 存储model信息
            sn = senceInfo.sn,
            nasid = senceInfo.nasid,
            sceneDevList = {}, //   场景和设备的关联关系
            sceneModelObj = {}, //  场景和model的对应关系  {shopId:model}
            devInfoList = {};  //  设备信息列表  {devSN:{devInfo}}

        $('#reDevSelect #switch-text').html(locales[_lang].trigger);  //  点击展开的文本
        $('#reDevSelect #switch-shop').html(locales[_lang].shop);   //  选择场所label
        $('#reDevSelect #switch-device').html(locales[_lang].device);   //   选择设备label

        /**
         * 生成dev下拉框并设置值
         */
        function fillDevField() {
            var val = $selectedScene.val(), devs = sceneDevList[val], devHtml = [];
            $devSn.html('');
            var selectedModel = sceneModelObj[val];
            //  model是1的时候，隐藏设备选择   model是1的时候是小小贝
            //$devContain[selectedModel === 1 ? 'hide' : 'show']();
            var devSnList = [];
            $.each(devs, function (i, d) {
                devSnList.push(d.devSN);
            });

            /**
             * 获取设备在线状态   1:不在线   0:在线
             * 微服务: renwenjie
             */
            $.post('/base/getDevs', {devSN: devSnList}, function (data) {
                var statusList = JSON.parse(data).detail, devList = [];
                $.each(devs, function (i, dev) {
                    $.each(statusList, function (j, sta) {
                        if (dev.devSN === sta.devSN) {
                            dev.status = sta.status;
                            devList.push(dev);
                        }
                    });
                });
                callback(devList);
            }, 'html');

            /**
             * 拼接select下拉框的数据
             * @param devs   所有的设备信息
             */
            function callback(devs) {
                $.each(devs, function (i, dev) {
                    devHtml.push('<option value="', dev.devSN, '">',
                        dev.devName + '(' + (dev.status == 0 ? locales[_lang].online : locales[_lang].offline) + ')',
                        '</option>');
                });
                //  如果是第一次加载就现在进来的sn，如果不是第一次进页面就选择默认的
                $devSn.html(devHtml.join('')).val((devs.length && !firstLoad) ? devs[0].devSN : sn);
                firstLoad = false;
            }
        }

        /**
         * 获取场景信息
         * @param sceneDevList
         * @param devInfoList
         */
        function getSceneList(sceneDevList, devInfoList) {
            $.get("/v3/web/cas_session?refresh=" + Math.random(), function (data) {
                $.post('/v3/scenarioserver', {
                    Method: 'getdevListByUser',
                    param: {
                        userName: data.user
                    }
                }, function (data) {
                    data = JSON.parse(data);
                    if (data && data.retCode == '0') {
                        var sceneHtmlList = [];
                        var sceneObj = {};
                        $.each(data.message, function (i, s) {
                            var devInfo = {
                                devName: s.devName,
                                devSN: s.devSN,
                                url: s.redirectUrl
                            };
                            if (!sceneDevList[s.scenarioId]) {
                                sceneDevList[s.scenarioId] = [];
                            }
                            // 设备信息
                            devInfoList[s.devSN] = devInfo;
                            //  {场景ID:devList}  场景和设备的对应关系
                            sceneDevList[s.scenarioId].push(devInfo);
                            //  {场所ID:场所名称}
                            sceneObj[s.scenarioId] = s.shopName;
                            //  {场所ID:场所model}
                            sceneModelObj[s.scenarioId] = Number(s.model);
                        });
                        // 拼接select框的option
                        $.each(sceneObj, function (k, v) {
                            sceneHtmlList.push('<option value="', k, '">', v, '</option>');
                        });
                        $selectedScene.html(sceneHtmlList.join('')).val(nasid);
                        // 填充设备列表
                        fillDevField();
                    }
                }, 'html');
            });
        }

        getSceneList(sceneDevList, devInfoList);
        $trigger.off('click').on('click', function () {
            $panel.toggle();
        });

        //$btnChange.off('click').on('click', function () {
        //    $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
        //    $panel.hide();
        //});

        $devSn.off("change").on("change",function(){
            $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
            //$panel.hide();
        });

        $selectedScene.off('change').on('change', fillDevField);

        $(document).on('click', function (e) {
            var $target = $(e.target);
            if ($target != $contain && !$.contains($contain.get(0), e.target)) {
                //$panel.hide();
            }
        });
        // ==============  选择场所，end  ==============
        $panel.show();
        function getuserSession() {
            $.ajax({
                url: MyConfig.path + "/scenarioserver",
                type: "POST",
                headers: {Accept: "application/json"},
                contentType: "application/json",
                data: JSON.stringify({
                    "Method": "getdevListByUser",
                    "param": {
                        "userName": FrameInfo.g_user.attributes.name

                    }
                }),
                dataType: "json",
                timeout: 150000,
                success: function (data) {
                    var AcInfo = [];
                    if (data.retCode == 0 && data.message) {
                        var snList = [];
                        var aclist = data.message;
                        for (var i = 0; i < aclist.length; i++) {
                            if (aclist[i].shopName) {
                                AcInfo.push({
                                    shop_name: aclist[i].shopName,
                                    sn: aclist[i].devSN,
                                    placeTypeName: aclist[i].scenarioName,
                                    redirectUrl: aclist[i].redirectUrl,
                                    nasid: aclist[i].scenarioId
                                });
                                snList.push(aclist[i].devSN);
                            } else if (aclist[i].devSN) {
                                snList.push(aclist[i].devSN);
                            }
                        }

                    } else {
                        Frame.Debuger.error("[ajax] error,url=====" + MyConfig.path + "/scenarioserver");
                    }
                    getAcInfo(AcInfo);
                }
            });
        }

        getuserSession();

        function getAcInfo(aclist) {
            var opShtmlTemple = "<li data_sn=vals  sel data-url=urls>palce</li>";
            var ulhtml = '<div class="select">' +
                '<p>' +
                '</p>' +
                '<ul>' +
                '</ul>' +
                '</div>';
            $("#station").append(ulhtml);
            for (var i = 0; i < aclist.length; i++) {
                if (window.location.host == "v3webtest.h3c.com") {
                    aclist[i].redirectUrl = aclist[i].redirectUrl.replace("lvzhouv3.h3c.com", "v3webtest.h3c.com");
                }
                var newHtmTemple = opShtmlTemple.replace(/vals/g, aclist[i].sn)
                    .replace(/urls/g, aclist[i].redirectUrl).replace(/palce/g, aclist[i].shop_name);
                var newHtmlTemple_1 = "";
                if (FrameInfo.ACSN == aclist[i].sn) {
                    $(".select > p").text($(newHtmTemple).text());
                } else {
                    newHtmlTemple_1 = newHtmTemple.replace(/sel/g, "");
                }
                $(".content .select ul").append(newHtmlTemple_1);

            }
            $(".select").click(function (e) {
                $(".select").toggleClass('open');
                return false;
            });

            $(".content .select ul li").on("click", function () {
                var _this = $(this);
                $(".select > p").text(_this.html());
                $.cookie("current_menu", "");
                var redirectUrl = $(this).attr("data-url");
                window.location.href = redirectUrl;
                _this.addClass("selected").siblings().removeClass("selected");
                $(".select").removeClass("open");
            });
            $(document).on('click', function () {
                $(".select").removeClass("open");
            })
        }
    }
    function func_error(error){
        hPending.close();
    }

    function oneToTwo(val)
    {
        if(val<10)
        {
            val = "0"+val;
        }
        return val;
    }

    function ajax2server(aData, onSuccess, onError){
        var count = 0;
        var errorCount = 0;
        var getData = {};
        for(var i = 0; i < aData.length; i++){
            var ajaxMsg = {
                url:aData[i].url,
                dataType: "json",
                type:"post",
                data:aData[i].data,
                success: function (Data)
                {
                    count++;
                    getData[oProbeChoice[Data.Method]] = Data.Message;
                    if(count == aData.length){
                        onSuccess(getData);
                    }
                },
                error: function(error){
                    errorCount++;
                    if(errorCount==1)
                    {
                        onError(error);
                    }
                    hPending.close();
                }
            };
            Utils.Request.sendRequest(ajaxMsg);
        }
    }

    function initLine(startTime, endTime)
    {
        function myCallback(ainfo){
            judgeResult();
            var data = ainfo["statistics"] || [];
            drawLine(data, ostatistics.data.Param.StartTime, ostatistics.data.Param.EndTime);
        }
        ostatistics.data.Method = "TimeClassify";
        ajax2server([ostatistics], myCallback, func_error);

    }
    
    function initStatus(startTime, endTime)
    {
        function myCallback(ainfo){
            judgeResult();
            var data = ainfo.status;
            drawAcctive(data);
        }
        ostatistics.data.Method = "StatusClassify";
        ajax2server([ostatistics], myCallback, func_error);

    }

    function initForm()
    {
        $(".toppannel #switch-text").html(getRcText("switchBtn"));
        $(".cancel-actions", "#tabContent").on("click",function(){
            $(this).parent().toggleClass("hide");
        });
        $("#daterange", "#tabContent").on("inputchange.datarange", function(e){
            forbiddenClick();
            var orange = $(this).daterange("getRangeData");
            var startTime = new Date(orange.startData) - 0;
            var endTime = new Date(orange.endData) - 0;
            var today = new Date() - 0;

            g_preStatus = '4';
            ostatistics.data.Param.StartTime = startTime ;
            if(endTime + 24 * 60 * 60 * 1000 > today)
            {
                ostatistics.data.Param.EndTime = today ;
            }
            else
            {
                ostatistics.data.Param.EndTime = (endTime + 24 * 60 * 60 * 1000);
            }
            $("#cycle_date").text("（" + orange.startData + "-" + orange.endData + "）");
            DealChoice(g_preStatus);
        });

        $(".form-actions .icon-remove", "#tabContent").on("click", function(){
            $(".top-box").toggleClass("hide");
        });

        $(".box-footer #senior_filter", "#tabContent").on("click", function(){
            $(".top-box").toggleClass("hide");
        });
        $(".app-box #WT1,.app-box #WT2,.app-box #WT3,.app-box #WT4,.app-box #WT5", "#tabContent").on("click", function(){
            if($(this).val() == g_preStatus)
            {
                return;
            }
            if(g_preStatus == 4)
            {
                $("#daterange",".page-row").val("");
            }
            g_preStatus = $(this).val();
            if($(".app-box #WT5:checked").length)
            {
                $(".top-box #timezone").removeClass("hide");
                $(".page-row .form-actions .icon-ok").removeClass("hide");

                return;
            }
            else
            {
                $(".page-row .top-box #timezone").addClass("hide");
                $(".page-row .form-actions .icon-ok").addClass("hide");

                forbiddenClick();
                var value = $(".page-row input:checked").val();
                DealChoice(value);

            }
        });
        $("#client_detail, #client_details", g_jForm).on("click", function(){
            Utils.Base.redirect ({np:$(this).attr("href"),value:ostatistics.data.Param.StartTime+'-'+ostatistics.data.Param.EndTime});
            return false;
        });

        $("#refresh_all", "#tabContent").on("click",  function(){
            initData();
        });
        $("#filter", g_jForm).on("click", function(){$("#filter_time", g_jForm).toggle();});
        $(document).on("mousedown", function(e){
            var e = e || window.event;
            var elem = e.target || e.srcElement;
            while(elem)
            {
                if(elem.id && elem.id == "filter_time")
                {
                    return false;
                }
                elem = elem.parentNode;
            }
            $("#filter_time", g_jForm).hide();
        });
        $("#map_btn", "#tabContent").on("click",function(){
            Utils.Base.openDlg(null, {}, {scope:$("#warnnigDlg"),className:"modal-super"});
            if(!g_map)
            {
                g_map = drawMap();
            }
            g_map.resize();
        });
        $("#hotmap_btn", "#tabContent").on("click",function(){
            Utils.Base.openDlg(null, {}, {scope:$("#warnnigDlg1"),className:"modal-super"});
            if(!g_hotmap)
            {
                g_hotmap = drawHotMap();
            }
            g_hotmap.resize();
        });
    }

    function initData(sStartTime, sEndTime)
    {
        forbiddenClick();
        getAllData()
        if(ostatistics.data.Param.EndTime - ostatistics.data.Param.StartTime <= 24 * 60 * 60 * 1000)
        {
            initLine();
            initStatus();
        }

    }

    function setCalendarDate() {
        /*设置日历背景图的日期*/
        var todayDate = new Date().getDate();

        if (1 == todayDate) {
            $(".set-background").css("padding-left", "23px");
        }
        else if(9 >= todayDate && 1 != todayDate) {
            $(".set-background").css("padding-left", "22px");
        }
        else if (11 == todayDate) {
            $(".set-background").css("padding-left", "19px");
        }
        else if(10 < todayDate && 20 > todayDate && 11 != todayDate) {
            $(".set-background").css("padding-left", "18px");
        }
        else {
            $(".set-background").css("padding-left", "18px");
        }

        $(".set-background").html(todayDate);
    }

    function _init()
    {
        g_jForm = $("#Probe_Monitor");
        g_aStatus = false;
        strAnt = MyConfig.path + '/ant';
        g_type = 0;

        var dayNow = new Date();

        ostatistics = {
            url:strAnt+"/read_probeclient",
            data:{
                Method:"GetAllData",
                Param:{
                    ACSN:FrameInfo.ACSN,
                    StartTime:new Date(dayNow.toDateString()) - 0,
                    EndTime:dayNow.getTime()
                },
                Return:[]
            }
        };

        setCalendarDate();
        initForm();
        initData();
        optionPush();
    }

    function _destroy()
    {
        g_jForm = null;
        g_aStatus = false;
        strAnt = MyConfig.path + '/ant';
        g_type = 0
        g_map = 0;
        g_hotmap = 0;
        g_judge = [];
        g_timeout = 0;
        g_preStatus = 0;
        ostatistics = {};
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        hPending&&hPending.close();
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["Echart", "SingleSelect","DateTime","DateRange"],
        "utils":["Request","Base"],
    });
})( jQuery );

