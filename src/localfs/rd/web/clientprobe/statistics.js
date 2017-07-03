;(function ($) {
    var MODULE_BASE = "clientprobe"
    var MODULE_NAME = MODULE_BASE+".statistics";
    /*var NC, MODULE_NC = MODULE_BASE+".NC";*/
    var g_jForm;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("probe_statistics_rc", sRcName);
    }

    function onIntervalChange(oChangeData)
    {
        if(!oChangeData.val)
        {
            $("#filter_time", g_jForm).hide();
            return false;
        }
        $("#filter_time", g_jForm).hide();
        var tNow = new Date();
        var nYear = tNow.getFullYear();
        var nMonth = tNow.getMonth()+1;
        var nDay = tNow.getDate();
        var nHour = tNow.getHours();
        var nMinute = tNow.getMinutes();
        var nSeconds = tNow.getSeconds();

        var nStartHour = nHour-oChangeData.val;
        if(nStartHour < 0)
        {
            nStartHour = nStartHour + 24;
            nDay = nDay - 1;
            if(nDay == 0)
            {
                switch(nMonth)
                {
                    case 2:
                    case 4:
                    case 6:
                    case 8:
                    case 9:
                    case 11:
                        nDay = 31;
                        nMonth--;
                        break;
                    case 5:
                    case 7:
                    case 10:
                    case 12:
                        nDay = 30;
                        nMonth--;
                        break;
                    case 1:
                        nMonth = 12;
                        nDay = 31;
                        nYear--;
                        break;
                    case 3:
                        if( (nYear%4==0)&&(nYear%100!=0)||(nYear%400==0))
                        {
                            nDay = 29;
                        }
                        else
                        {
                            nDay = 28;
                        }
                        break;
                }
            }
        }

        nMonth = oneToTwo(nMonth);
        nDay = oneToTwo(nDay);
        nStartHour = oneToTwo(nStartHour);
        nMinute = oneToTwo(nMinute);
        nSeconds = oneToTwo(nSeconds);
        var sTime = nYear+"-"+nMonth+"-"+nDay+ "T" +nStartHour+":"+nMinute+":"+nSeconds;
        initData(sTime);

    }

    function initForm()
    {
        $("#client_detail, #client_details", g_jForm).on("click", function(){
           Utils.Base.redirect ({np:$(this).attr("href")});
            return false;
        });
        $( "#refresh_Probe", g_jForm).on("click", initData);
        $("#refresh_vender").on("click",  initData);        
        $("#refresh_client").on("click",  initData);        
        $("#refresh_rssi").on("click",  initData);
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
        $("#Interval", g_jForm).on("change", onIntervalChange);
    }

    function drawLine(aData)
    {
        var aData = aData || [];
        var aType = getRcText("TYPE").split(",");
        if(!aData.length)
        {
            return false;
        }
        var aSelectData = [],
            aMax = [],
            aMiddle = [],
            aMin = [],
            aTotal = [],
            aXlabel = [];
        var nGap = (aData.length>20) ? parseInt(aData.length/20) + 1 : 1; 
        for(var i=0; i<aData.length;i+=nGap)
        {
            aSelectData.push(aData[i]);
        }
        $.each(aSelectData, function(index, oSelectData){
            aMax.push(oSelectData.RssiMaxNum);
            aMiddle.push(oSelectData.RssiMiddleNum);
            aMin.push(oSelectData.RssiMinNum);
            aTotal.push(oSelectData.TotalNum);
            var sTime =  oSelectData.Time.split("T")[1].substr(0,5);
            aXlabel.push(sTime);
        });
        var option = {
            height:260,
            calculable: false,
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                      color: '#373737',
                      width: 1,
                      type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                y: 'top',
                x: "right",
                data: aType.slice(1)
            },
            grid: {
                x: 40, 
                y: 50,
                x2:35,
                borderColor: '#FFF'
            },
            xAxis: [
                {
                    name:getRcText("AXIS").split(',')[1],
                    nameTextStyle:{color:"gray"},
                    type: 'category',
                    boundaryGap: false,
                    splitLine:false,
                    axisLabel: {
                        interval:0,
                        rotate:30
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#F6F7F8', width: 1}
                    },
                    axisTick :{
                        show:false
                    },
                    data:aXlabel
                }
            ],
            yAxis: [
                {
                    name:getRcText("AXIS").split(',')[0],
                    nameTextStyle:{color:"gray"},
                    type: 'value',
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
            series: [
                
                
                {
                    type: 'line',
                    stack: 'total', 
                    smooth: true,
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
                    name:aType[1],
                    data: aMax
                },
                {
                    type: 'line',
                    stack: 'total', 
                    smooth: true,
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
                    name:aType[2],
                    data: aMiddle
                },
                {
                    type: 'line', 
                    stack: 'total',
                    smooth: true,
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
                    name:aType[3],
                    data: aMin
                }
            ]

        };
        var oTheme = {
            color: ["rgba(0,150,214,1)","rgba(0,150,214,0.8)","rgba(0,150,214,0.6)","rgba(0,150,214,0.3)"]
        };
        $("#probe_line").echart("init", option, oTheme);
    }

    function drawClientTime(aData)
    {
        var aData = aData || [];
        var aType = getRcText("CLIENTTIME").split(",");
        var aTimeData = [
                {name:aType[0], value:0},
                {name:aType[1], value:0},
                {name:aType[2], value:0},
                {name:aType[3], value:0},
                {name:aType[4], value:0}
            ];
        $.each(aData,function(i, oTemp){
            var oTimeTemp1 = new Date(oTemp.FirstReportTime);
            var oTimeTemp2 = new Date(oTemp.LastReportTime);
            switch(Math.floor((oTimeTemp2 - oTimeTemp1)/1000/60/15))
            {
                case 0:
                {
                    aTimeData[0].value++;
                }
                break;
                case 1:
                {
                    aTimeData[1].value++;
                }
                break;
                case 2:
                case 3:
                {
                    aTimeData[2].value++;
                }
                break;
                case 4:
                case 5:
                case 6:
                case 7:
                {
                    aTimeData[3].value++;
                }
                break;
                default:
                {
                    aTimeData[4].value++;
                }
 
            }
        });
        aTimeData = $.grep(aTimeData,function(oTemp, i){
            return Boolean(oTemp.value);
        });


        var nTotalLength  = 0;
        $.each(aTimeData, function(i, oTemp){
            nTotalLength += oTemp.value;
        });
            
        if(!aData.length)
        {
            var option = {
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
                height:238,
 
                tooltip : {
                    show:true,
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


    function drawPercentChart(jEle, val, sName, sColor)
    {
        var opt = {
            color: sColor,
            bgColor: '#F6F7F8',
            radius:100,
            height: 198,
            series:{
                name:sName,
                center:['45%', '45%'],
                radius:['43%','65%'],
                data: val //nUsed
            },
            title:
                '<div class="text-container middle">'+
                '<div class="title"></div><div class="divide"/>'+
                '<div class="subtitle"></div>'+
                '</div>'
        }
        jEle.echart().echart("pie", opt);
            
        $(".title", jEle).html(val+"%");
        $(".subtitle", jEle).html(sName);
    }

    function drawAssoc(aStatics)
    {
        var sName = getRcText("NAME").split(",")[0];
        var aStatics = aStatics || [];
        if(!aStatics.length)
        {
            drawPercentChart($("#Assco_client"), Math.round(0), sName, "#19A0DA");
            Utils.Base.updateHtml($("#client_block"),{Total_Total:0,
                                                    Total_associated:0,
                                                    Total_dissociated:0
                                                    });

            return false;
        }
        var nAssocNum = 0;
        for(var i = 0; i < aStatics.length; i++)
        {
            if(aStatics[i].DissociativeStatus != true)
            {
                nAssocNum++;
            }
        }
        var nPercent = nAssocNum / aStatics.length;
        var oApClientNum = {Total_Total:aStatics.length,
                            Total_associated:nAssocNum,
                            Total_dissociated:aStatics.length - nAssocNum
                            };
        Utils.Base.updateHtml($("#client_block"),oApClientNum);
        drawPercentChart($("#Assco_client"), Math.round(nPercent*10000/100.00), sName, "#19A0DA")

    }
    function drawAcctive(aStatics)
    {
        var sName = getRcText("NAME").split(",")[1];
        var aStatics = aStatics || [];
        var nTotal = 0;
        if(!aStatics.length)
        {
            drawPercentChart($("#Active_pie"), Math.round(0), sName, "#19A0DA");
            Utils.Base.updateHtml($("#Status_block"),{Total_Active:0,
                            Total_Inactive:0});
            return false;
        }
        for(var i = 0; i < aStatics.length; i++)
        {
            if(aStatics[i].Status == true)
            {
                nTotal++;
            }

        }
        var oApClientNum = {Total_Active:nTotal,
                            Total_Inactive:aStatics.length - nTotal}

        var nPercent = nTotal / aStatics.length;
        Utils.Base.updateHtml($("#Status_block"),oApClientNum);
        drawPercentChart($("#Active_pie"), Math.round(nPercent*10000/100.00), sName, "#19A0DA")

    }

    function drawVender(aData)
    {
        function compare(oArrayDataa, oArrayDatab)
        {
            return oArrayDatab.value - oArrayDataa.value;
        }
        var sName = getRcText("NAME").split(",");
        var aData = aData || [];
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
  

        for(var nNum = 0; nNum < aData.length; nNum++)
        {
            if(!oPhoneVenderList[aData[nNum].Vendor.toLowerCase()])
            {
                continue;
            }
            for(var i = 0; i < aVender.length; i++)
            {
                if(oPhoneVenderList[aData[nNum].Vendor.toLowerCase()].name == aVender[i].name)
                {
                    aVender[i].value++;
                    bTemp = true;
                }
            }
            if(bTemp == false)
            {
                aVender.push({name:oPhoneVenderList[aData[nNum].Vendor.toLowerCase()].name,value:1, itemStyle:labelFromatter});
            }
            bTemp = false;
           
        }
        aVender.sort(compare);

        if(aVender.length > 5)
        {
            aVender = aVender.slice(0, 5);
            aVender.push({name:oPhoneVenderList["others"].name, value:aData.length,itemStyle:labelFromatter});

            for(var nCounter = 0; nCounter < 5; nCounter++)
            {
                aVender[5].value -= aVender[nCounter].value;
            }
        }
        else
        {
            aVender.push({name:oPhoneVenderList["others"].name, value:aData.length,itemStyle:labelFromatter});
            for(var nCounter = 0; nCounter < aVender.length - 1; nCounter++)
            {
                aVender[aVender.length - 1].value -= aVender[nCounter].value;
            }

        }


        if(!aData.length)
        {
            var option = {
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
          var option = {
                calculable : false ,
                height:238,

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
                color: [
                    'rgba(245,105,1,0.8)','rgba(254,132,41, 0.8)','rgba(254,156,84, 0.8)',
                    'rgba(254,185,133, 0.8)','rgba(254,202,163, 0.8)','rgba(255,221,196, 0.8)'
                ]
            };
        }
        $("#Vender_pie").echart("init", option, oTheme);
    }



    function initEchart(aData, aClientProbes, strChoice)
    {
        switch(strChoice)
        {
            case "refresh_vender":
            {               
                drawVender(aClientProbes);
            }
            break;
            case "refresh_rssi":
            {               
                drawClientTime(aClientProbes);
            }
            break;
            case "refresh_client":
            {
                
                drawAssoc(aClientProbes);
                drawAcctive(aClientProbes);

            }
            break;
            case "refresh_Probe":
            case "filter":
            {
                drawLine(aData);
            }
            break;
            default:
            {
                drawLine(aData);
               drawClientTime(aClientProbes);
                drawAssoc(aClientProbes);
                drawAcctive(aClientProbes);
                drawVender(aClientProbes);
 

            }
        }
    }

    function oneToTwo(val)
    {
        if(val<10)
        {
            val = "0"+val;
        }
        return val;
    }

    function onAjaxErr()
    {
        var sProtocal = window.location.protocol.replace(":", "").toUpperCase();
        var sMsg = PageText[PageText.curLang]["net_err"].replace("%s", sProtocal);
        alert(sMsg);
    }
    function getDynUrl(sUrl)
    {
        return  "../../wnm/" + sUrl;
    }
    function initData(sStartTime)
    {
        var strChoice = $(this).attr("id");
        $.ajax({
            url:getDynUrl("statistics.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {
                var aIntervals = getRcText("INTERVAL").split(",");
                var aTimes = [];

                $.each(aIntervals, function(index, val){
                    aTimes.push({name: val, value:index+1});
                });

                $("#Interval", g_jForm).singleSelect("InitData",aTimes,{displayField:"name",valueField:"value"});
                var aProbeStatistics=data.aProbeStatistics;
                var aClientProbes=data.aClientProbes;
                initEchart(aProbeStatistics, aClientProbes,strChoice);
            },
            error: onAjaxErr
        });


        /*function myCallback(aInfos)
        {
            var aProbeStatistics;
            var aClientProbes;
            if(typeof(sStartTime) == "string")
            {
                aProbeStatistics = Utils.Request.getTableRows(NC.ProbeStatistics, aInfos) || [];
            }
            else
            {
                aProbeStatistics = Utils.Request.getTableRows(NC.ProbeStatistics, aInfos) || [];
                aClientProbes = Utils.Request.getTableRows(NC.ClientProbes, aInfos) || [];
            }
            var aIntervals = getRcText("INTERVAL").split(",");
            var aTimes = [];
            $.each(aIntervals, function(index, val){
                aTimes.push({name: val, value:index+1});
            });
            $("#Interval", g_jForm).singleSelect("InitData",aTimes,{displayField:"name",valueField:"value"});
            initEchart(aProbeStatistics, aClientProbes,strChoice);
        }
        var strChoice = $(this).attr("id");
        var tNow = new Date();
        var nYear = tNow.getFullYear();
        var nMonth = oneToTwo(tNow.getMonth()+1);
        var nDay = oneToTwo(tNow.getDate());
        var nHour = "00";
        var nMinute = "00";
        var nSeconds = "00";
        var sTime = (sStartTime && typeof(sStartTime) == 'string') ? sStartTime : (nYear+"-"+nMonth+"-"+nDay+ "T" +nHour+":"+nMinute+":"+nSeconds);
        var oProbeStatistics = Utils.Request.getTableInstance(NC.ProbeStatistics);
        oProbeStatistics.addFilter({Time:sTime});
        var oClientProbes = Utils.Request.getTableInstance(NC.ClientProbes);
        if(typeof(sStartTime) == "string")
        {
            strChoice = "filter";
            Utils.Request.getBulk([oProbeStatistics], myCallback);

        }
        else
        {
            Utils.Request.getBulk([oProbeStatistics, oClientProbes], myCallback);
        }*/

    }

    function _init()
    {
      //  NC = Utils.Pages[MODULE_NC].NC;
        g_jForm = $("#Probe_Monitor");
        initForm();
        initData();
    }

    function _destroy()
    {
        g_jForm = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["Echart", "SingleSelect"], 
        "utils":["Base"]
        //"subModules":[MODULE_NC]
    });
})( jQuery );

