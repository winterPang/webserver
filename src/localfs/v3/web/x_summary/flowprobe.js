;(function ($) {
    var MODULE_BASE = "x_summary"
    var MODULE_NAME = MODULE_BASE+".flowprobe";
    var g_jForm;
    var g_aStatus = false;
	var strAnt = MyConfig.path + '/ant';
    var g_type = 0;
    var g_map = 0;
    var g_hotmap = 0;
    var g_sum=0;
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
        g_sum=0;
        var oVendor = {};
        var aVendor = [];
        var oDuration = {};
        var aDuration = [];
        var aClientCount = [];

        for(var i = 0; i < data.length; i++)
        {
            var vendorTmp = data[i].Vendor;
            //vendor
            for(var j = 0; j < vendorTmp.length; j++)
            {
                oVendor[vendorTmp[j].Vendor] ? (oVendor[vendorTmp[j].Vendor] += vendorTmp[j].Count) : (oVendor[vendorTmp[j].Vendor] = vendorTmp[j].Count);
            }

            //Total
            if(data[i].hasOwnProperty("Count")){
                g_sum+=data[i].Count;         
            }
            $('.client_total').html(g_sum);
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

        }
        //将数据加工到直接使用的类型
        for(var q in oVendor)
        {
            var temp = {Vendor:q, Sum:oVendor[q]};
            aVendor.push(temp);
        }

        drawClientTime(oDuration);
        drawVender(aVendor);
        if(ostatistics.data.Param.EndTime - ostatistics.data.Param.StartTime > 24 * 60 * 60 * 1000)
        {
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
        }
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
                var tmpName;
                if(i===aData.length-1){
                    tmpName = getRcText("nowTime");
                    xData.push(tmpName);
                }else{
                    tmpName = new Date(aData[i].name);
                    xData.push(tmpName.toTimeString().slice(0,5));
                }             
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
            tooltip:{
                trigger: 'axis',
                borderRadius: 0,
                
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
                        //interval:'auto',
                        rotate:0
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#F6F7F8', width: 1}
                    },
                    data:xData//['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','当前']
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
                    data: yData//[0,0,0,0,0,0,0,0,0,0,6,231,123,11,12]
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

    function drawClientTime(aData)//停留时间饼图
    {
        var aData = aData ;        
        var aType = getRcText("CLIENTTIME").split(",");
        /*var aLegend=[];
        aLegend=[aType[0],aType[1],aType[2],"",aType[3],aType[4]]*/
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
                        radius : 80,
                        center: ['50%', '60%'],
                        
                        itemStyle: {
                            normal: {
                                labelLine:{                                  
                                    show:false                                   
                                }
                                
                            },
                            emphasis: {
                                color:"#EDF9F7"
                            }
                        },
                        data: [{name:"",value:1}]
                    }
                ]
            };
            var oTheme = {color: ['#EDF9F7']};//#F6F7F8
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
                /*legend:{
                    y:'bottom',
                    data:aLegend
                },*/
                tooltip : {
                    show:true,
                   // trigger: 'item',
                   formatter: "{b}:<br/> {c} ({d}%)"
                },
                series : [
                    {
                        type: 'pie',
                        radius : 75,
                        center: ['45%', '60%'],
                        itemStyle:{
                            normal:{
                                labelLine:{
                                    show:true,
                                    length:12
                                }
                            }
                        },
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

    function drawVender(aData)//终端类型饼图
    {
        function compare(oArrayDataa, oArrayDatab)
        {
            return oArrayDatab.value - oArrayDataa.value;
        }
        var alegend=[];
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
        aData.forEach(function(i,index){
            //debugger
            if( i.Vendor.toLowerCase() == "unknown")
            {
                //alegend[index]="未知";
                specailUnkonwn = {name:getRcText("RC_UNKNOWN"),value: i.Sum, itemStyle:labelFromatter};
            }
            else
            {
                //alegend[index]=i.Vendor;
                aVender.push({name:i.Vendor,value: i.Sum, itemStyle:labelFromatter});
            }
            nSum0ther+=i.Sum;
        });
        //alegend.splice(5,0,"");
        var oOthters = {name:getRcText("RC_OTHERS"),value:nSum0ther, itemStyle:labelFromatter};
        aVender.sort(compare);
        //var oColor = ['#D7DDE4','#91B2D2', '#CC324B', '#FF8800','#FFBB33', '#92C888','#69C4C5','#31ADB4','#53B9E7','#0195D7'];
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
                /*legend:{
                    show:true,
                    y:bottom,
                    data:alegend
                },*/
                series : [
                    {
                        type: 'pie',
                        radius : 75,
                        center: ['45%', '60%'],
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    show:false
                                }
                            },
                            emphasis: {
                                color:"#EDF9F7"
                            }
                        },
                        data: [{name:"",value:1}]
                    }
                ]
            };
            var oTheme = {color: ['#EDF9F7']};
        }
        else 
        {
          var option = {
                calculable : false ,
                height:280,
                /*legend:{
                    orient: 'horizontal',
                    y:'bottom',
                    data:alegend
                },*/
                tooltip : {
                    show:true,
                    formatter: "{b}:<br/> {c} ({d}%)"
                },
                series : [
                    {
                        type: 'pie',
                        radius : 75,
                        center: ['45%', '60%'],
                        itemStyle:{
                            normal:{
                                labelLine:{
                                    show:true,
                                    length:5
                                }
                            }
                        },
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
        g_type = 0

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

