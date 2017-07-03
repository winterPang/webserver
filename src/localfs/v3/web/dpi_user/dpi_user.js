;(function ($) {
     var MODULE_BASE = "dpi_user";
     var MODULE_NAME = MODULE_BASE + ".dpi_user";
     var g_userName = FrameInfo.g_user.user;
     var LIMIT_NUMBER = 1000;
     var g_sn = [];
     var g_UserMsg = []  //保存用户id 用户名称  对应的MAC地址数组 存放形式 [{userId:"",name:"",macaddr:[xxx,xxx]}]
     var g_UserMsgCount = 0; 
     /*设置全局变量用于标识当前选择的时间段 0一天，1 一周 2 一月 3 一年 4其他选择的时间*/
     var g_SelectTime = "0";
     /*标识当前选择的上网信息是应用还是网站*/
     var g_dpi_Type = "app";
     /*标识当前选择的是上网信息还是位置信息*/
     var g_SelectNetPlayOrLocaltion = "dpi";
     /*标识上网信息的应用页面当前选择的是哪一种统计方式*/
     var g_DpiAppType = "Durition";/*默认时长*/
    /*标识上网信息的网站页面当前选择的是哪一种统计方式*/
     var g_DpiUrlType = "Durition"; 


    function getRcText(sRcName) {
        return Utils.Base.getRcString("User_monitor_rc", sRcName);
    }
     //获取时间函数
    function getTheDate(str1,str2)
    {
        var nyear = new Date().getFullYear();
        var nmonth = new Date().getMonth();
        var nday = new Date().getDate();
        var nHour = new Date().getHours();
        if(str1=="one")
        { 
            var nDATA = 24
            var tNow = new Date(nyear,nmonth,nday,nDATA); 
            var noneHour = 3600*1000
            
            if(str2=="end")
            {
               
                return tNow-0
            }
            if(str2 =="start")
            {
                
                return tNow - noneHour*(nDATA)
            }
        }
        if(str1=="month")
        {
            var nDATA = 30;
            var aHour = 24*3600*1000;
            var aOptTime = [];
            var tNow = new Date(nyear,nmonth,nday,24); 
            
            if(str2=="end")
            {
                 
                return tNow - 0
            }
            if(str2 =="start")
            {
               
                return tNow - aHour*(nDATA)
            }
        }
        if(str1=="year")
        {
            var nDATA = 365;
            var aHour = 24*3600*1000;
            var aOptTime = [];
           var tNow = new Date(nyear,nmonth,nday,24); 
            
            if(str2=="end")
            {
                
                 return tNow - 0
            }
            if(str2 =="start")
            {
               
               return tNow - aHour*(nDATA)
            }
        }
        if(str1=="aweek")
        {
            var nDATA = 7;
            var aHour = 24*3600*1000;
            var aOptTime = [];
            var tNow = new Date(nyear,nmonth,nday,24); 
          
            if(str2=="end")
            { 
                 return tNow - 0
            }
            if(str2=="start")
            { 
                return tNow - aHour*(nDATA)
            }
        }
    }
     /*饼图图例显示在中间*/
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
    /*上网信息，位置信息饼图*/
    function drowDpiAndLocaltion_pie(aData,aPieId)
    {
        if("string" == typeof aData)
        {
             var option = {
                calculable : false,
                height:200,
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius: ['35%', '65%'],
                        center: ['25%', '47%'],
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
            var oTheme = {color: ['#B7ADAD']};
            
        }
        else
        {
            var oTheme = {
               color : ['#53B9E7','#CC324B','#69C4C5','#FFBB33','#FF8800','#D7DDE4']
            };
            var option = {
                height: 300,
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend: {
                    scope: aPieId[0],
                    width: "48%",
                    height: 150,
                    right: "0%",
                    top: topChange(155, 31,aData.length,8),
                },
                calculable: false,
                series: [
                    {
                        //  name: aID[2],
                        type: 'pie',
                        radius: ['25%', '55%'],
                        center: ['30%', '47%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position:"inner",
                                    formatter: function(a){
                                        return"";
                                    }
                                }
                            }
                        },
                        data: aData
                    }
                ],
            };
        } 
         $(aPieId[1]).echart("init", option, oTheme);  
    }
    
    function drowDpiMsg(aData,aPieId)
    {
        var aColor = [
       ['#C6E5F3','#AEDAEF','#64A5C3','#3F93B9','#199EDA'], 
        ['#CC324B','#E6B7BE','#DE949F','#B75F6C','#D2122E'], 
       ['#A8E1E4','#86D6DA','#57B8BD','#3EB1B7','#22C9D2'],
       ['#CAB48A','#FFBB33','#E0CFAE','#AD9260','#CC9633'],
       ['#FF8800','#EACAA5','#E2B37D','#DAA261','#F1AD5E'],
       ['#DCDFE2','#BCC3CA','#99A4AF','#76828E','#606569']
        ]
        var oTheme = {
             color :aColor[0]  
            };
            var option = {
                height: 150,
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend: {
                    scope: "",
                    width: "42%",
                    height: 70,
                    right: "18%",
                    top: topChange(100, 31,aData.length,8),
                },
                calculable: false,
                series: [
                    {
                        //  name: aID[2],
                        type: 'pie',
                        radius: ['25%', '45%'],
                        center: ['20%', '47%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position:"inner",
                                    formatter: function(a){
                                        return"";
                                    }
                                }
                            }
                        },
                        data: 0
                    }
                ],
            }; 
             option.myLegend.scope = aPieId[0].MsgID;
             option.series[0].data = aData[0];
            $(aPieId[0].PieID).echart("init", option, oTheme); 
             option.myLegend.scope = aPieId[1].MsgID;
             option.series[0].data = aData[1];
             oTheme.color = aColor[1];
            $(aPieId[1].PieID).echart("init", option, oTheme); 
             option.myLegend.scope = aPieId[2].MsgID;
             option.series[0].data = aData[2];
              oTheme.color = aColor[2];
            $(aPieId[2].PieID).echart("init", option, oTheme); 
            option.myLegend.scope = aPieId[3].MsgID;
             option.series[0].data = aData[3];
              oTheme.color = aColor[3];
            $(aPieId[3].PieID).echart("init", option, oTheme); 
            option.myLegend.scope = aPieId[4].MsgID;
             option.series[0].data = aData[4];
              oTheme.color = aColor[4];
            $(aPieId[4].PieID).echart("init", option, oTheme); 
            option.myLegend.scope = aPieId[5].MsgID;
             option.series[0].data = aData[5];
              oTheme.color = aColor[5];
            $(aPieId[5].PieID).echart("init", option, oTheme);  
        
    }
    /*上网名称饼图*/
    function initAppName(type,aData)
    {
        /*测试数据*/
        /*var aData = [];
        var adata = [{name:"360",value:900},{name:"京东",value:21},{name:"淘宝",value:32},{name:"股票",value:89},{name:"聚美",value:33}]; 
        var adata1 = [{name:"QQ",value:12},{name:"微信",value:21},{name:"微博",value:32},{name:"快手",value:89},{name:"贴吧",value:55}];  
        var adata2 = [{name:"好压",value:12},{name:"有道",value:21},{name:"高德",value:900},{name:"优步",value:89},{name:"滴滴",value:33}]; 
        var adata3 = [{name:"股票360",value:12},{name:"微信",value:21},{name:"微博",value:32},{name:"有道",value:900},{name:"聚美",value:33}]; 
        var adata4 = [{name:"高德",value:12},{name:"谷歌",value:21},{name:"百度地图",value:32},{name:"优步",value:89},{name:"易道",value:900}]; 
        var adata5 = [{name:"网易",value:12},{name:"腾讯",value:900},{name:"CCTV",value:32},{name:"凤凰",value:89},{name:"有道",value:33}]; 
        aData.push(adata,adata1,adata2,adata3,adata4,adata5);*/

        if("string" == typeof aData)
        {
            var option = {
                calculable : false,
                height:150,
                tooltip: {
                    show:false 
                },
                series : [
                    {
                        type: 'pie',
                        radius: ['25%', '45%'],
                        center: ['20%', '47%'],
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
            var oTheme = {color: ['#B7ADAD']};
            if(type == "app")
            {
                $("#AppName_pie").echart("init", option, oTheme); 
              
                $("#AppName1_pie").echart("init", option, oTheme); 
                 
                $("#AppName2_pie").echart("init", option, oTheme); 
                 
                $("#AppName3_pie").echart("init", option, oTheme); 
                 
                $("#AppName4_pie").echart("init", option, oTheme); 
                 
                $("#AppName5_pie").echart("init", option, oTheme); 
            }
            else
            {
                $("#UrlName_pie").echart("init", option, oTheme); 
 
                $("#UrlName1_pie").echart("init", option, oTheme);
      
                $("#UrlName3_pie").echart("init", option, oTheme); 
 
                $("#UrlName4_pie").echart("init", option, oTheme);  
            }
               
        }
        else
        {
            var aColor = [
                   ['#C6E5F3','#AEDAEF','#64A5C3','#3F93B9','#199EDA'], 
                   ['#CC324B','#E6B7BE','#DE949F','#B75F6C','#D2122E'], 
                   ['#A8E1E4','#86D6DA','#57B8BD','#3EB1B7','#22C9D2'],
                   ['#CAB48A','#FFBB33','#E0CFAE','#AD9260','#CC9633'],
                   ['#FF8800','#EACAA5','#E2B37D','#DAA261','#F1AD5E'],
                   ['#DCDFE2','#BCC3CA','#99A4AF','#76828E','#606569']
            ]
            var oTheme = {
             color :aColor[0]  
            };
            var option = {
                height: 150,
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend: {
                    scope: "#AppName_message",
                    width: "54%",
                    height: 70,
                    right: "13%",
                    top: topChange(110, 31,aData.length,5),
                },
                calculable: false,
                series: [
                    {
                        //  name: aID[2],
                        type: 'pie',
                        radius: ['25%', '45%'],
                        center: ['20%', '47%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position:"inner",
                                    formatter: function(a){
                                        return"";
                                    }
                                }
                            }
                        },
                        data: aData[0]
                    }
                ],
            }; 
            var option1 = {
                calculable : false,
                height:150,
                tooltip: {
                    show:false 
                },
                series : [
                    {
                        type: 'pie',
                        radius: ['25%', '45%'],
                        center: ['20%', '47%'],
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
            var oTheme1 = {color: ['#B7ADAD']}; 
          
            if(type == "app")
            {
                
                 if(aData[0] != undefined)
                 {
                    option.myLegend.scope = "#AppName_message";
                    option.series[0].data = aData[0];
                    oTheme.color = aColor[0];
                    $("#AppName_pie").echart("init", option, oTheme); 
                 }
                 else
                 {
                    $("#AppName_pie").echart("init", option1, oTheme1); 
                 }
                 
                 if(aData[1] != undefined)
                 {
                     option.myLegend.scope = "#AppName1_message";
                     option.series[0].data = aData[1];
                     oTheme.color = aColor[1];
                    $("#AppName1_pie").echart("init", option, oTheme); 
                 }
                 else
                 {
                    $("#AppName1_pie").echart("init", option1, oTheme1); 
                 }
                if(aData[2] != undefined)
                {
                    option.myLegend.scope = "#AppName2_message";
                    option.series[0].data = aData[2];
                    oTheme.color = aColor[2];
                    $("#AppName2_pie").echart("init", option, oTheme); 
                }
                else
                {
                    $("#AppName2_pie").echart("init", option1, oTheme1); 
                }
                if(aData[3] != undefined)
                {
                    option.myLegend.scope = "#AppName3_message";
                     option.series[0].data = aData[3];
                      oTheme.color = aColor[3];
                    $("#AppName3_pie").echart("init", option, oTheme); 
                }
                else
                {
                    $("#AppName3_pie").echart("init", option1, oTheme1); 
                }
                if(aData[4] != undefined)
                {
                     option.myLegend.scope = "#AppName4_message";
                     option.series[0].data = aData[4];
                      oTheme.color = aColor[4];
                    $("#AppName4_pie").echart("init", option, oTheme); 
                }
                else
                {
                    $("#AppName4_pie").echart("init", option1, oTheme1); 
                }
                if(aData[5] != undefined)
               {
                    option.myLegend.scope = "#AppName5_message";
                     option.series[0].data = aData[5];
                      oTheme.color = aColor[5];
                    $("#AppName5_pie").echart("init", option, oTheme);   
               }
               else
               {
                     $("#AppName5_pie").echart("init", option1, oTheme1);   
               }
                
            }
            else
            { 
                /*测试数据*/
                /*var adata = [{name:"www.360.com",value:900},{name:"www.jigndong.com",value:21},{name:"www.taobao.com",value:32},{name:"www.gupiao.com",value:89},{name:"www.jumai.com",value:33}]; 
                var adata1 = [{name:"www.QQ.com",value:12},{name:"www.weixin.com",value:21},{name:"www.weibo.com",value:32},{name:"www.kushou.com",value:89},{name:"www.tieba.com",value:55}];  
                var adata2 = [{name:"www.haoya.com",value:12},{name:"www.youdao.com",value:21},{name:"www.gaode.com",value:900},{name:"www.youbu.com",value:89},{name:"www.didi.com",value:33}]; 
                var adata3 = [{name:"www.gu360.com",value:12},{name:"www.weixin.com",value:21},{name:"www.weibo.com",value:32},{name:"www.youdao.com",value:900},{name:"www.jumei.com",value:33}]; 
                var aData = [adata,adata1,adata2,adata3];*/


                if(aData[0] != undefined)
                {
                    option.series[0].data = aData[0];
                    option.myLegend.scope = "#UrlName_message";
                    oTheme.color = aColor[0];
                    $("#UrlName_pie").echart("init", option, oTheme); 
                }
                else
                {
                    $("#UrlName_pie").echart("init", option1, oTheme1);  
                }
                if(aData[1] != undefined)
                {
                    option.myLegend.scope = "#UrlName1_message";
                     option.series[0].data = aData[1];
                     oTheme.color = aColor[1];
                    $("#UrlName1_pie").echart("init", option, oTheme);
                }
                else
                {
                    $("#UrlName1_pie").echart("init", option1, oTheme1);
                }
                if(aData[2] != undefined)
                {
                    option.myLegend.scope = "#UrlName3_message";
                    option.series[0].data = aData[2];
                    oTheme.color = aColor[3];
                    $("#UrlName3_pie").echart("init", option, oTheme); 
                }
                else
                {
                    $("#UrlName3_pie").echart("init", option1, oTheme1); 
                }
               if(aData[3] != undefined)
               {
                    option.myLegend.scope = "#UrlName4_message";
                     option.series[0].data = aData[3];
                      oTheme.color = aColor[4];
                    $("#UrlName4_pie").echart("init", option, oTheme);  
               }
               else
               {
                     $("#UrlName4_pie").echart("init", option1, oTheme1);  
               } 
                
            }
        }
        
    }
    /*上网信息折线图*/
    function initApptype_Chart(type,aTime,seriesData)
    {  
        var option = { 
            height: 250, 
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#373737',
                        width: 1,
                        type: 'solid'
                    }
                }
            },
           /*legend: {
                data:['次数']
            },*/
           // dataZoom:dataZoom,
            grid: {
                x: 70,
                y: 50,
                x2: 30,
                y2: 50, //45
                borderColor: '#415172',
              // backgroundColor:"#D7DDE4"
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:{
                            show:true,
                            lineStyle :{color: '#F5F5F5', width: 1}
                        },
                     name:"时间",
                    nameTextStyle: {color: "gray"},
                    axisLabel: {
                       // rotate: 45, //横轴的倾斜程度
                        show: true,
                        textStyle: {color: '#000', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#F5F5F5', width: 1}
                    },
                    axisTick: {
                        show: false
                    },
                    data: aTime,
                }
            ],

            yAxis: [
                {
                    type: 'value',
                    name:"次数",
                    nameTextStyle: {color: "gray"},
                    splitLine:{
                            show:true,
                            lineStyle :{color: '#F5F5F5', width: 1}
                        },
                    axisLabel: {
                        show: true,
                        //textStyle: {color: '#47495d', width: 2}
                        textStyle: {color: '#000', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#F5F5F5', width: 1}
                    }  
                }
            ],
            series: seriesData, 
        };
        var oTheme = {
             color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4'],
            valueAxis: {
                splitLine: {lineStyle: {color: ['#415172']}},
                axisLabel: {textStyle: {color: ['#abbbde']}}
            },
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#415172']}}
            }
        }
        if(type == "app")
        {
            $("#UserAppType_chart").echart("init", option, oTheme);  
        }
        else
        {
            $("#UserType_chart").echart("init", option, oTheme);
        }
        
    } 

    /*位置信息饼图*/
    function  initLocaltionType_pie(type)
    {
       var adata = [{name:"餐饮",value:60},{name:"服装",value:21},{name:"娱乐",value:32},{name:"休息",value:89},{name:"运动",value:33},{name:"休闲",value:50}];
        var oTheme = {
               color : ['#53B9E7','#CC324B','#69C4C5','#FFBB33','#FF8800','#D7DDE4']
            };
            var option = {
                height: 300,
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend: {
                    scope: "#WelcomeType_message",
                    width: "30%",
                    height: 150,
                    right: "15%",
                    top: topChange(155, 31,adata.length,8),
                },
                calculable: false,
                series: [
                    {
                        //  name: aID[2],
                        type: 'pie',
                        radius: ['25%', '55%'],
                        center: ['30%', '47%'],
                        itemStyle: { 
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position:"inner",
                                    formatter: function(a){
                                        return"";
                                    }
                                }
                            }
                        },
                        data: adata
                    }
                ],
            };
           /* var oTheme = {
                color: ['#C72222','#S0E014','#FFFF00','#8A2BE2','#33FF00','#483D8B','#BB860B','#006400']
            };*/
            
            
        if(type == "like")
        {
            option.myLegend.scope = "#WelcomeType_message"; 
            $("#WelcomeType_pie").echart("init", option, oTheme);  
        }
        else
        {
            var adata = [{name:"图书馆",value:42},{name:"逸夫楼",value:21},{name:"大厦",value:32},{name:"科技园",value:89},{name:"东电",value:33},{name:"KFC",value:50}];
            option.series[0].data = adata;
            option.myLegend.scope = "#NotWelcomeType_message" 
            $("#NotWelcomeType_pie").echart("init", option, oTheme);  
        }
    }
    /*位置信息折线图*/
    function initLocaltiontype_Chart(type)
    {
        var aUrldata = [14,51,33,33,26,13,77,25,42,24,23];
        var aUrldata1 = [21,11,43,13,86,63,77,35,22,94,23];
        var aUrldata2 = [24,31,53,53,56,33,57,55,12,14,73];
        var aUrldata3 = [24,71,53,23,66,13,97,15,92,84,63];
        var aTime =    ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00","8:00","9:00","10:00"];
        var option = { 
            height: 250, 
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#373737',
                        width: 1,
                        type: 'solid'
                    }
                }
            },
           /*legend: {
                data:['次数']
            },*/
           // dataZoom:dataZoom,
            grid: {
                x: 70,
                y: 50,
                x2: 30,
                y2: 50, //45
                borderColor: '#415172',
              // backgroundColor:"#D7DDE4"
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:{
                            show:true,
                            lineStyle :{color: '#F5F5F5', width: 1}
                        },
                     name:"时间",
                    nameTextStyle: {color: "gray"},
                    axisLabel: {
                       // rotate: 45, //横轴的倾斜程度
                        show: true,
                        textStyle: {color: '#000', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#F5F5F5', width: 1}
                    },
                    axisTick: {
                        show: false
                    },
                    data: aTime,
                }
            ],

            yAxis: [
                {
                    type: 'value',
                    name:"次数",
                    nameTextStyle: {color: "gray"},
                    splitLine:{
                            show:true,
                            lineStyle :{color: '#F5F5F5', width: 1}
                        },
                    axisLabel: {
                        show: true,
                        //textStyle: {color: '#47495d', width: 2}
                        textStyle: {color: '#000', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#F5F5F5', width: 1}
                    }  
                }
            ],
            series: [
                
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "图书馆",
                    data: aUrldata
                },
                 {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "电影院",
                    data: aUrldata2
                },
                 {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "食堂",
                    data: aUrldata1
                },
                 {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "超市",
                    data: aUrldata3
                }

            ]

        };
        var oTheme = {
             color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4'],
            valueAxis: {
                splitLine: {lineStyle: {color: ['#415172']}},
                axisLabel: {textStyle: {color: ['#abbbde']}}
            },
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#415172']}}
            }
        }
        if(type == "like")
        {
            $("#UserWelcomeType_chart").echart("init", option, oTheme);  
        }
        else
        {
            $("#UserNotwelcomeType_chart").echart("init", option, oTheme);
        }
        
    }  
    /*子位置信息饼图*/
     function initLocaltionName_pie(type)
    {
        var adata = [{name:"一楼",value:900},{name:"超市",value:21},{name:"南区",value:32},{name:"东区",value:89},{name:"二楼",value:33}]; 
        var adata1 = [{name:"西区",value:12},{name:"一楼",value:21},{name:"超市",value:32},{name:"北区",value:89},{name:"超市",value:55}];  
        var adata2 = [{name:"电子室",value:12},{name:"东区",value:21},{name:"休息区",value:900},{name:"超市",value:89},{name:"东区",value:33}]; 
        var adata3 = [{name:"东区",value:12},{name:"食堂",value:21},{name:"超市",value:32},{name:"二楼",value:900},{name:"南区",value:33}]; 
        var adata4 = [{name:"二楼",value:12},{name:"运动区",value:21},{name:"二楼",value:32},{name:"二楼",value:89},{name:"超市",value:900}]; 
        var adata5 = [{name:"便利店",value:12},{name:"一楼",value:900},{name:"东区",value:32},{name:"二楼",value:89},{name:"超市",value:33}]; 
           
        var aColor = [
       ['#C6E5F3','#AEDAEF','#64A5C3','#3F93B9','#199EDA'], 
        ['#CC324B','#E6B7BE','#DE949F','#B75F6C','#D2122E'], 
       ['#A8E1E4','#86D6DA','#57B8BD','#3EB1B7','#22C9D2'],
       ['#CAB48A','#FFBB33','#E0CFAE','#AD9260','#CC9633'],
       ['#FF8800','#EACAA5','#E2B37D','#DAA261','#F1AD5E'],
       ['#DCDFE2','#BCC3CA','#99A4AF','#76828E','#606569']
        ]
        var oTheme = {
             color :aColor[0]  
            };
            var option = {
                height: 150,
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend: {
                    scope: "#WelcomeName_message",
                    width: "42%",
                    height: 70,
                    right: "18%",
                    top: topChange(100, 31,adata.length,8),
                },
                calculable: false,
                series: [
                    {
                        //  name: aID[2],
                        type: 'pie',
                        radius: ['25%', '45%'],
                        center: ['20%', '47%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position:"inner",
                                    formatter: function(a){
                                        return"";
                                    }
                                }
                            }
                        },
                        data: adata
                    }
                ],
            }; 
            
        if(type == "like")
        {
            $("#WelcomeName_pie").echart("init", option, oTheme); 
             option.myLegend.scope = "#WelcomeName1_message";
             option.series[0].data = adata1;
             oTheme.color = aColor[1];
            $("#WelcomeName1_pie").echart("init", option, oTheme); 
             option.myLegend.scope = "#WelcomeName2_message";
             option.series[0].data = adata2;
              oTheme.color = aColor[2];
            $("#WelcomeName2_pie").echart("init", option, oTheme); 
            option.myLegend.scope = "#WelcomeName3_message";
             option.series[0].data = adata3;
              oTheme.color = aColor[3];
            $("#WelcomeName3_pie").echart("init", option, oTheme); 
            option.myLegend.scope = "#WelcomeName4_message";
             option.series[0].data = adata4;
              oTheme.color = aColor[4];
            $("#WelcomeName4_pie").echart("init", option, oTheme); 
            option.myLegend.scope = "#WelcomeName5_message";
             option.series[0].data = adata5;
              oTheme.color = aColor[5];
            $("#WelcomeName5_pie").echart("init", option, oTheme);   
        }
        else
        { 
            option.myLegend.scope = "#NotWelcomeName_message";
            $("#NotWelcomeName_pie").echart("init", option, oTheme); 

             option.myLegend.scope = "#NotWelcomeName1_message";
             option.series[0].data = adata1;
             oTheme.color = aColor[1];
            $("#NotWelcomeName1_pie").echart("init", option, oTheme);

             option.myLegend.scope = "#NotWelcomeName2_message";
             option.series[0].data = adata2;
              oTheme.color = aColor[2];
            $("#NotWelcomeName2_pie").echart("init", option, oTheme); 

            option.myLegend.scope = "#NotWelcomeName3_message";
             option.series[0].data = adata3;
              oTheme.color = aColor[3];
            $("#NotWelcomeName3_pie").echart("init", option, oTheme); 

            option.myLegend.scope = "#NotWelcomeName4_message";
             option.series[0].data = adata4;
              oTheme.color = aColor[4];
            $("#NotWelcomeName4_pie").echart("init", option, oTheme); 

            option.myLegend.scope = "#NotWelcomeName5_message";
             option.series[0].data = adata5;
              oTheme.color = aColor[5];
            $("#NotWelcomeName5_pie").echart("init", option, oTheme);  
        }
        
    }
    /*显示用户流向关系图*/
    function drowChord()
    {
        option = {
            height:250,
            color : [
                '#FBB367','#80B1D2','#FB8070','#CC99FF','#B0D961',
                '#99CCCC','#BEBBD8','#FFCC99','#8DD3C8','#FF9999',
                '#CCEAC4','#BB81BC','#FBCCEC','#CCFF66','#99CC66',
                '#66CC66','#FF6666','#FFED6F','#ff7f50','#87cefa',
            ], 
            tooltip : {
                trigger: 'item',
                formatter : function (params) {
                    if (params.name && params.name.indexOf('-') != -1) {
                        return params.name.replace('-', ' ' + params.seriesName + ' ')
                    }
                    else {
                        return params.name ? params.name : params.data.id
                    }
                }
            },
            legend : {
                data : [
                    '餐饮',
                    '服饰',
                    '娱乐',
                    '休息',
                    '运动',
                    '休闲',
                    '图书区',
                    '家具',
                    '网络',
                    '',
                    '流入',
                    '流出',
                ],
                orient : 'vertical',
                x : 'right'
            },
            /* myLegend: {
                    scope: "#TrendId_message",
                    width: "30%",
                    height: 150,
                    right: "15%",
                    //top: topChange(155, 31,adata.length,8),
                },*/
            series : [
                {
                    "name": "流入",
                    "type": "chord",
                    "showScaleText": false,
                    "clockWise": false,
                    "data": [
                        {"name": "餐饮"},
                        {"name": "服饰"},
                        {"name": "娱乐"},
                        {"name": "休息"},
                        {"name": "运动"},
                        {"name": "休闲"},
                        {"name": "图书区"},
                        {"name": "家具"},
                        {"name": "网络"},
                    ],
                    "matrix": [
                        [0,1,0,0,0,0,1,0,0],
                        [10,0,0,0,0,1,1,0,1],
                        [0,0,0,1,0,0,0,0,0],
                        [0,0,1,0,0,1,0,0,0],
                        [0,0,0,0,0,0,0,0,0],
                        [0,1,0,1,0,0,0,0,0],
                        [10,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0],
                        [0,1,0,0,0,0,0,0,0], 
                    ]
                },
                {
                    "name": "流出",
                    "type": "chord",
                    "insertToSerie": "流入",
                     "data": [
                        {"name": "餐饮"},
                        {"name": "服饰"},
                        {"name": "娱乐"},
                        {"name": "休息"},
                        {"name": "运动"},
                        {"name": "休闲"},
                        {"name": "图书区"},
                        {"name": "家具"},
                        {"name": "网络"},
                    ],
                    "matrix": [
                        [0,0,1,1,0,1,0,0,1],
                        [0,0,0,1,0,0,0,0,0],
                        [1,0,0,0,0,0,1,1,1],
                        [10,1,0,0,0,0,0,0,0],
                        [0,0,0,0,0,1,0,1,0],
                        [10,0,0,0,1,0,1,0,0],
                        [0,0,1,0,0,1,0,0,0],
                        [0,0,1,0,1,0,0,0,0],
                        [1,0,1,0,0,0,0,0,0],
                        
                    ]
                },
            ]
        };
               
        var oTheme = {
               color : ['#53B9E7','#CC324B','#69C4C5','#FFBB33','#FF8800','#D7DDE4']
            };
        $("#TrendId").echart("init", option, oTheme);  
                    
    }

    /*显示上网信息的应用信息*/
    function showApp()
    {
        $("#showUrl").addClass("hide");
        $("#showApp").removeClass("hide");
        $("#urlType_chart").addClass("hide");
        $("#appType_chart").removeClass("hide");  
        g_dpi_Type = "app";
        dpiData("app");  
    }
    /*显示上网信息的网站信息*/
    function showUrl()
    {
        $("#showUrl").removeClass("hide");
        $("#showApp").addClass("hide");
        $("#urlType_chart").removeClass("hide");
        $("#appType_chart").addClass("hide");
        g_dpi_Type = "url";
        dpiData("url");  
       
    }
    /*显示位置信息的欢迎位置的信息*/
    function  showWelcome()
    {
        $("#showNotWelcome").addClass("hide");
        $("#showWelcome").removeClass("hide");
        $("#NotwelcomeType_chart").addClass("hide");
        $("#WelcomeType_chart").removeClass("hide");

        initLocaltionType_pie("like");
        initLocaltionName_pie("like");
        initLocaltiontype_Chart("like"); 

    }
    /*显示位置信息的不欢迎的信息*/
    function  showNotWelcome()
    {
        $("#showWelcome").addClass("hide");
        $("#showNotWelcome").removeClass("hide");
        $("#WelcomeType_chart").addClass("hide");
        $("#NotwelcomeType_chart").removeClass("hide");

        /*initLocaltionType_pie("hate");
        initLocaltionName_pie("hate");
        initLocaltiontype_Chart("hate"); */
        var aMessage = [{LocalName:"KTV",AccessNum:1,AccessTime:"1小时"},
        {LocalName:"超市",AccessNum:0,AccessTime:"0"}]
         $("#NotWelcomeLocaltion_list").SList ("refresh", aMessage);
    }
    /*发送上网信息应用信息请求*/
    function AjaxAppMsg(sStartTime,sEnd)
    { 

        var sNowStart = getTheDate("one", "start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        var nHour = new Date().getHours();  
        
        
        var SendMsg = {
             
            GetAppPieMsg:{
                    url: MyConfig.path + "/ant/read_dpi_app",
                    dataType: "json",
                    type: "post",
                    data: {
                    Method: 'GetAppType',
                    SelectType:g_DpiAppType, 
                    Param: {
                        family: "0",
                        direct: "0",
                        //MACList:g_UserMsg[g_UserMsgCount].macAddr,
                        UserList:[g_UserMsg[g_UserMsgCount].userId], 
                        ACSNList:g_sn,//["210235A1SQC15A000045"/*,"210235A1SQC15A000051"*/],
                        StartTime: nStartTime,
                        EndTime: nEndTime,
                    }, 

                    Return: [

                    ] 
                },
                onSuccess:getMsgSuccess,
                onFailed:getMsgFail
            },
            GetAppChartMsg:{
                url: MyConfig.path + "/ant/read_dpi_app",
                dataType: "json",
                type: "post",
                data: {
                    Method: 'GetAppPersonNumChart', 
                    Time:nHour,
                    SelectType:g_DpiAppType, 
                    Param: {
                        family: "0",
                        direct: "0",
                       // MACList:g_UserMsg[g_UserMsgCount].macAddr, 
                        UserList:[g_UserMsg[g_UserMsgCount].userId],
                        ACSNList:g_sn,//["210235A1SQC15A000045"],
                        StartTime: nStartTime,
                        EndTime: nEndTime,
                    },
                    Return: [

                    ] 
                },
                onSuccess:getMsgSuccessChart,
                onFailed:getMsgFailChart
            }
            
        };
        
        Utils.Request.sendRequest(SendMsg.GetAppPieMsg);
        Utils.Request.sendRequest(SendMsg.GetAppChartMsg);
        
        function getMsgSuccess(data)
        {
           var aMessage = data.message; 
           for(var i=0;i<aMessage[0].length;i++)
           {
             if(aMessage[0][i].name == "")
             {
                aMessage[0].splice(i,1);
                i--;
             }
           }
           var aAppName = aMessage[1];
           for(var i=0;i<aAppName.length;i++)
           {
             for(var j=0;j<aAppName[i].length;j++)
             {
                 if(aAppName[i][j].name == "")
                 {
                    aAppName[i].splice(j,1);
                    j--;
                 }
                 else
                 {
                    if(aAppName[i][j].value == 0)
                    {
                        aAppName[i][j].value = 1;
                    }
                 }
             }
             if(aAppName[i].length == 0)
             {
                aAppName.splice(i,1);
                i--;
             }
            
           }
            /*填充饼图数据*/
            var aPieId = ["#AppType_message","#AppType_pie"];
            drowDpiAndLocaltion_pie(aMessage[0],aPieId);
            initAppName("app",aMessage[1]);
            /*填充各个应用类型名称*/ 
            if("string" == typeof aMessage)
            {
                return;
            }
            if(aMessage[1][0] != undefined){
                if(aMessage[1][0][0].APPGroupName == ""||aMessage[1][0][0].APPGroupName == undefined)
                {
                    aMessage[1][0][0].APPGroupName = "未知";
                }
                $("#AppGroupName").html(aMessage[1][0][0].APPGroupName);
            }
            if(aMessage[1][1] != undefined){
                 if(aMessage[1][1][0].APPGroupName == ""||aMessage[1][1][0].APPGroupName == undefined)
                {
                    aMessage[1][1][0].APPGroupName = "未知";
                }
                $("#AppGroupName1").html(aMessage[1][1][0].APPGroupName);
            }
            if(aMessage[1][2] != undefined){
                 if(aMessage[1][2][0].APPGroupName == ""||aMessage[1][2][0].APPGroupName == undefined)
                {
                    aMessage[1][2][0].APPGroupName = "未知";
                }
              $("#AppGroupName2").html(aMessage[1][2][0].APPGroupName);  
            }
            if(aMessage[1][3] != undefined){
                 if(aMessage[1][3][0].APPGroupName == ""||aMessage[1][3][0].APPGroupName == undefined)
                {
                    aMessage[1][3][0].APPGroupName = "未知";
                }
                $("#AppGroupName3").html(aMessage[1][3][0].APPGroupName); 
            }
            if(aMessage[1][4] != undefined){
                 if(aMessage[1][4][0].APPGroupName == ""||aMessage[1][4][0].APPGroupName == undefined)
                {
                    aMessage[1][4][0].APPGroupName = "未知";
                }
               $("#AppGroupName4").html(aMessage[1][4][0].APPGroupName); 
            }
            if(aMessage[1][5] != undefined){
                 if(aMessage[1][5][0].APPGroupName == ""||aMessage[1][5][0].APPGroupName == undefined)
                {
                    aMessage[1][5][0].APPGroupName = "未知";
                }
               $("#AppGroupName5").html(aMessage[1][5][0].APPGroupName);  
            } 
        };
        function getMsgSuccessChart(data)
        {
           var aMessage = data.message;
           var aGroup = aMessage.aGroupDate;
           var aData = aMessage.aData;
           var aTime = aMessage.aTime;
           var aSeriesData = [];

           /*测试数据*/
            /*var aUrldata = [14,51,33,33,26,13,77,25,42,24,23];
            var aUrldata1 = [21,11,43,13,86,63,77,35,22,94,23];
            var aUrldata2 = [24,31,53,53,56,33,57,55,12,14,73];
            var aUrldata3 = [24,71,53,23,66,13,97,15,92,84,63];
            var aTime =    ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00","8:00","9:00","10:00"];
            var aData = [aUrldata,aUrldata1,aUrldata2,aUrldata3];
            var aGroup = [{APPGroupName:"下载"},{APPGroupName:"通讯"},{APPGroupName:"工具"},{APPGroupName:"金融"}];
            */
            for(var i=0;i<aTime.length;i++)
            {
                var Chart_y = (sEnd-sStartTime)/1000/3600/24;
                if(Chart_y <= 1)
                {
                    aTime[i] = new Date(aTime[i]);
                    aTime[i] = (aTime[i].toTimeString()).slice(0, 2)+":00";
                }
                else
                {
                    aTime[i] = new Date(aTime[i]);
                    aTime[i] = (aTime[i].toLocaleDateString()).slice(5);
                }
                
            }
            if(aData.length == 0)
            {
                for(var i=0;i<aTime.length;i++)
                {
                    aData[i] = 0;
                }
                var oTemp = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},  
                    data: aData
                };
                aSeriesData[0] = oTemp;
            }
            else
            {
               for(var i=0;i<aGroup.length;i++)
               {
                   var oTemp = {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aGroup[i].APPGroupName,
                        data: aData[i]
                    };
                    aSeriesData[i] = oTemp;
               } 
            } 

           initApptype_Chart("app",aTime,aSeriesData);
            
        };
         function getMsgFail() 
        {
            console.log("fail terminal fail!");
        };
        function getMsgFailChart()
        {
            console.log("fail terminal fail!");
        }; 


        /*function getACSNFail()
        {
            console.log("fail terminal fail!");
        };*/ 

        /*测试数据*/ 
        /*var adata = [{name:"下载",value:12},{name:"通讯",value:21},{name:"工具",value:32},{name:"金融",value:89},{name:"导航",value:33},{name:"新闻",value:50}];
        var aPieId = ["#AppType_message","#AppType_pie"];
        drowDpiAndLocaltion_pie(adata,aPieId);*/
        //initAppName("app");
       // initApptype_Chart("app");
        
       
    }
    function AjaxUrlMsg(sStartTime,sEnd)
    {
        var sNowStart = getTheDate("one", "start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        var nHour = new Date().getHours();  
        
        /*饼图AjAx请求 start*/
        var SendMsg = {
            /*GetACSNList:{
                    url: MyConfig.path + "/scenarioserver",
                    dataType: "json",
                    type: "post", 
                    data: { 
                        Method: 'getdevListByUser',
                        param: {
                             userName:g_userName,
                        }
                    },
                    onSuccess:getACSNSuccess,
                    onFailed:getACSNFail 
                },*/
            GetUrlPieMsg:{
                url: MyConfig.path + "/ant/read_dpi_url",
                dataType: "json",
                type: "post",
                data: {
                    Method: 'GetUrlType',
                    SelectType:g_DpiUrlType, 
                    Param: {
                        family: "0",
                        direct: "0",
                        //MACList:g_UserMsg[g_UserMsgCount].macAddr, 
                        UserList:[g_UserMsg[g_UserMsgCount].userId],
                        ACSNList:g_sn,//["210235A1SQC15A000045"/*,"210235A1SQC15A000051"*/],
                        StartTime: nStartTime,
                        EndTime: nEndTime,
                    }, 

                    Return: [

                    ] 
                },
                onSuccess:getPieMsgSuccess,
                onFailed:getPieMsgFail
            },
            GetUrlChartMsg:{
                url: MyConfig.path + "/ant/read_dpi_url",
                dataType: "json",
                type: "post",
                data: {
                    Method: 'GetUrlPersonNumChart', 
                    Time:nHour,
                    SelectType:g_DpiUrlType, 
                    Param: {
                        family: "0",
                        direct: "0",
                       // MACList:g_UserMsg[g_UserMsgCount].macAddr, 
                        UserList:[g_UserMsg[g_UserMsgCount].userId],
                        ACSNList:g_sn,//["210235A1SQC15A000045"],
                        StartTime: nStartTime,
                        EndTime: nEndTime,
                    },
                    Return: [

                    ] 
                },
                onSuccess:getMsgSuccessChart,
                onFailed:getMsgFailChart
            }
            
        };
        Utils.Request.sendRequest(SendMsg.GetUrlPieMsg);
        Utils.Request.sendRequest(SendMsg.GetUrlChartMsg);
        

        function getPieMsgSuccess(data)
        {
            var aMessage = data.message; 
            for(var i=0;i<aMessage[0].length;i++)
               {
                 if(aMessage[0][i].name == "")
                 {
                    aMessage[0].splice(i,1);
                    i--;
                 }
               }
           var aUrlName = aMessage[1];
           for(var i=0;i<aUrlName.length;i++)
           {
             for(var j=0;j<aUrlName[i].length;j++)
             {
                 if(aUrlName[i][j].name == "")
                 {
                    aUrlName[i].splice(i,1);
                    j--;
                 } 
             }
             if(aUrlName[i].length == 0)
             {
                aUrlName.splice(i,1);
                i--;
             }
            
           }
            /*填充饼图数据*/
            var aPieId = ["#UrlType_message","#UrlType_pie"];
            drowDpiAndLocaltion_pie(aMessage[0],aPieId);
            initAppName("url",aMessage[1]);
             if("string" == typeof aMessage)
            {
                return;
            }
            /*填充各个网站类型名称*/
            if(aMessage[1][0] != undefined){
                 if(aMessage[1][0][0].CategoryName == ""||aMessage[1][0][0].CategoryName == undefined)
                {
                    aMessage[1][0][0].CategoryName = "未知";
                }
                $("#UrlGroupName").html(aMessage[1][0][0].CategoryName);
            }
            if(aMessage[1][1] != undefined){
                if(aMessage[1][1][0].CategoryName == ""||aMessage[1][1][0].CategoryName == undefined)
                {
                    aMessage[1][1][0].CategoryName = "未知";
                }
                $("#UrlGroupName1").html(aMessage[1][1][0].CategoryName);
            }
            if(aMessage[1][2] != undefined){
                if(aMessage[1][2][0].CategoryName == ""||aMessage[1][2][0].CategoryName == undefined)
                {
                    aMessage[1][2][0].CategoryName = "未知";
                }
               $("#UrlGroupName2").html(aMessage[1][2][0].CategoryName);
            }
            if(aMessage[1][3] != undefined){
                if(aMessage[1][3][0].CategoryName == ""||aMessage[1][3][0].CategoryName == undefined)
                {
                    aMessage[1][3][0].CategoryName = "未知";
                }
                $("#UrlGroupName3").html(aMessage[1][3][0].CategoryName);
            } 
        } 
        function getMsgSuccessChart(data)
        {
           var aMessage = data.message; 
            var aGroup = aMessage.aGroupDate;
           var aData = aMessage.aData;
           var aTime = aMessage.aTime;
           var aSeriesData = [];

           /*测试数据*/
            /*var aUrldata = [14,51,33,33,26,13,77,25,42,24,23];
            var aUrldata1 = [21,11,43,13,86,63,77,35,22,94,23];
            var aUrldata2 = [24,31,53,53,56,33,57,55,12,14,73];
            var aUrldata3 = [24,71,53,23,66,13,97,15,92,84,63];
            var aTime =    ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00","8:00","9:00","10:00"];
            var aData = [aUrldata,aUrldata1,aUrldata2,aUrldata3];
            var aGroup = [{APPGroupName:"下载"},{APPGroupName:"通讯"},{APPGroupName:"工具"},{APPGroupName:"金融"}];
            */
            for(var i=0;i<aTime.length;i++)
            {
                var Chart_y = (sEnd-sStartTime)/1000/3600/24;
                if(Chart_y <= 1)
                {
                    aTime[i] = new Date(aTime[i]);
                    aTime[i] = (aTime[i].toTimeString()).slice(0, 2)+":00";
                }
                else
                {
                    aTime[i] = new Date(aTime[i]);
                    aTime[i] = (aTime[i].toLocaleDateString()).slice(5);
                }
                
            }
            if(aData.length == 0)
            {
                for(var i=0;i<aTime.length;i++)
                {
                    aData[i] = 0;
                }
                var oTemp = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},  
                    data: aData
                };
                aSeriesData[0] = oTemp;
            }
            else
            {
               for(var i=0;i<aGroup.length;i++)
               {
                   var oTemp = {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aGroup[i].APPGroupName,
                        data: aData[i]
                    };
                    aSeriesData[i] = oTemp;
               } 
            } 
           initApptype_Chart("url",aTime,aSeriesData);
        }

        function getPieMsgFail()
        {
            console.log("fail terminal fail!");
        } 
        function getMsgFailChart()
        {
            console.log("fail terminal fail!");
        }
           

        /*测试数据*/
       /* var adata = [{name:"娱乐",value:50},{name:"购物",value:21},{name:"科技",value:32},{name:"搜索",value:89},{name:"导航",value:33},{name:"新闻",value:50}];
        var aPieId = ["#UrlType_message","#UrlType_pie"];
        drowDpiAndLocaltion_pie(adata,aPieId);
        initAppName("url");*/
        //initApptype_Chart("url"); 
    }
    function dpiData(dpiType)
    {  
        switch(g_SelectTime)
        {
            /*选择一天*/
            case "0":
            {
                var sStarttime = getTheDate("one", "start");
                var sEndTime = getTheDate("one", "end");
                if(g_dpi_Type == "app")
                {
                    AjaxAppMsg(sStarttime,sEndTime);
                }
                else
                {
                    AjaxUrlMsg(sStarttime,sEndTime)
                }
                
                break;
            };
            /*选择一周*/
            case "1":
            {
                var sStarttime = getTheDate("aweek", "start");
                var sEndTime = getTheDate("aweek", "end");
                if(g_dpi_Type == "app")
                {
                    AjaxAppMsg(sStarttime,sEndTime);
                }
                else
                {
                    AjaxUrlMsg(sStarttime,sEndTime)
                }
                break;
            };
            /*选择 一月*/
            case "2":
            {
                var sStarttime = getTheDate("month", "start");
                var sEndTime = getTheDate("month", "end");
                if(g_dpi_Type == "app")
                {
                    AjaxAppMsg(sStarttime,sEndTime);
                }
                else
                {
                    AjaxUrlMsg(sStarttime,sEndTime);
                }
                break;
            };
            /*选择一年*/
            case "3":
            {
                var sStarttime = getTheDate("year", "start");
                var sEndTime = getTheDate("year", "end");
                if(g_dpi_Type == "app")
                {
                    AjaxAppMsg(sStarttime,sEndTime);
                }
                else
                {
                    AjaxUrlMsg(sStarttime,sEndTime)
                }
                break;
            };
            /*选择其他时间*/
            case "4":
            {
                var StartTime = $("input[name='daterangepicker_start']").val();
                var sEndTime = $("input[name='daterangepicker_end']").val(); 
                
                var sStarttime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                var sEndTime = (new Date(Number(sEndTime.slice(0,4)),Number(sEndTime.slice(5,7))-1,Number(sEndTime.slice(8,10)))).getTime();
              
                if(g_dpi_Type == "app")
                {
                    AjaxAppMsg(sStarttime,sEndTime);
                }
                else
                {
                    AjaxUrlMsg(sStarttime,sEndTime)
                }
                break;
            };
            default:
                break;
        }

        /*测试数据*/
        //AjaxAppMsg()
        /*initAppType_pie("app");
        initAppName("app");
        initApptype_Chart("app"); */
    }
    function localtionData()
    {
        initLocaltionType_pie("like");
        initLocaltionName_pie("like");
        initLocaltiontype_Chart("like"); 
    }
    /*获取在当前用户下认证过的所有用户*/
    function getUserName(StartTime,EndTime)
    {
         var nyear = new Date().getFullYear();
         var nmonth = new Date().getMonth();
         var nday = new Date().getDate();
         var nowStartTime = new Date(nyear,nmonth,nday);
         var nowEndTime = new Date(nyear,nmonth,nday,24);
         var sStartTime = StartTime || nowStartTime;
         var sEndTime = EndTime || nowEndTime; 
        /*发送请求获取本用户下的所有用户*/
          var SendMsg = { 
                GetUserName:{
                    url: MyConfig.path + "/useridentity/getUserHistory",
                    dataType: "json",
                    type: "post", 
                    data: { 
                        devSNList:g_sn,
                        startTime:"",//sStartTime.toISOString(),
                        endTime:"",//sEndTime.toISOString(),
                        skipNum:0,
                        limitNum:LIMIT_NUMBER, 
                    },
                    onSuccess:getSuccess,
                    onFailed:getFail 
                },
                GetACSNList:{
                    url: MyConfig.path + "/scenarioserver",
                    dataType: "json",
                    type: "post", 
                    data: { 
                        Method: 'getdevListByUser',
                        param: {
                             userName:g_userName,
                        }
                    },
                    onSuccess:getACSNSuccess,
                    onFailed:getACSNFail 
                }
                
            }
            Utils.Request.sendRequest(SendMsg.GetACSNList);
            function getACSNSuccess(aData)
            {
                var adata = aData.message;
                for(var i=0;i<adata.length;i++)
                {
                    g_sn.push(adata[i].devSN);
                }
                Utils.Request.sendRequest(SendMsg.GetUserName);
            }
            function getACSNFail()
            {
                return;
            }
            function getSuccess(aData)
            {
                var data = aData;
                var mapNameList = []; 
                var length = data.userList.length;
                /*将获取的用户id  用户名 mac地址保存到全局变量*/ 
                for(var i=0;i<length;i++)
                {
                    var otemp = {userId:"",name:"",macAddr:[],headimgurl:"",sex:"",age:"",accessCount:1};
                    otemp.userId = data.userList[i].userId;
                    otemp.name = data.userList[i].name;
                    otemp.macAddr.push(data.userList[i].macAddr);
                    otemp.headimgurl = data.userList[i].headimgurl;
                    otemp.sex = data.userList[i].sex;
                    otemp.age = data.userList[i].age;
                    if(g_UserMsg.length == 0)
                    {
                      g_UserMsg.push(otemp);
                      continue; 
                    }
                    for(var j=0;j<g_UserMsg.length;j++)
                    {
                        if(otemp.userId  == g_UserMsg[j].userId)
                        {  
                            g_UserMsg[j].accessCount++;
                            var macLength = g_UserMsg[j].macAddr.length;
                             /*删除每个用户中MAC地址重复的*/
                            for(var k=0;k<macLength;k++)
                            {
                                if(g_UserMsg[j].macAddr[k] == otemp.macAddr[0])
                                {
                                    break;
                                }
                                if(k == macLength-1)
                                {
                                    g_UserMsg[j].macAddr.push(otemp.macAddr[0]);
                                }
                            }
                            
                            break;
                        }
                        if(otemp.name == g_UserMsg[j].name)
                        {
                            otemp.name = otemp.name +"("+otemp.userId+")";
                        }
                        if(j == g_UserMsg.length -1)
                        {
                           g_UserMsg.push(otemp); 
                           break;
                        } 
                    } 
                }
                for(var i=0;i<g_UserMsg.length;i++)
                {
                    var sUserName = g_UserMsg[i].name
                    
                    mapNameList.push(sUserName);
                    for(var j=0;j<g_UserMsg[i].macAddr.length;j++)
                    {  
                        var sMac   = g_UserMsg[i].macAddr[j].slice(0,2)+g_UserMsg[i].macAddr[j].slice(3,5)+"-"+g_UserMsg[i].macAddr[j].slice(6,8)+g_UserMsg[i].macAddr[j].slice(9,11)+"-"+g_UserMsg[i].macAddr[j].slice(12,14)+g_UserMsg[i].macAddr[j].slice(15,17);
                        g_UserMsg[i].macAddr[j] = sMac.toLowerCase();
                    }
                    
                }

                $("#MapSelect").singleSelect("InitData", mapNameList);
                $("#TotalUserNumber").html("("+mapNameList.length+"人)");
                /*在这里初始化上网信息,位置信息和头部信息  由于上网信息和位置信息需要显示某个人的所以要等到获取到username后才可以初始化*/
                dpiData();
                /*获取头部统计信息*/
                getHeadMsg(); 
                /*填充头像里面的信息*/
                GetPicMsg(); 
            }
            function getFail(error)
            {
                return;
            } 
    }
     /*获取头像信息*/
     function GetPicMsg()
     {
            /*填充头像*/
            var headimgurl = g_UserMsg[g_UserMsgCount].headimgurl;
            if(headimgurl != "")
            {
               $("#headimgurl").attr("src",headimgurl); 
            }
            else
            {
                $("#headimgurl").attr("src","./css/image/pic/userMsg.jpg"); 
            } 
            /*填充姓名*/
            $("#userName").html(g_UserMsg[g_UserMsgCount].name);
            /*填充性别*/
            if(g_UserMsg[g_UserMsgCount].sex == 0)
            {
               $("#UserSex").html("未知"); 
            }
             if(g_UserMsg[g_UserMsgCount].sex == 1)
            {
               $("#UserSex").html("男"); 
            }
             if(g_UserMsg[g_UserMsgCount].sex == 2)
            {
               $("#UserSex").html("女"); 
            } 
            /*填充年龄*/
            $("#UserAge").html(g_UserMsg[g_UserMsgCount].age);
     }
    /*获取头部的显示数据*/
    function getHeadMsg()
    {
        switch(g_SelectTime)
        {
            /*选择一天*/
            case "0":
            {
                var sStarttime = getTheDate("one", "start");
                var sEndTime = getTheDate("one", "end");
                 
                
                break;
            };
            /*选择一周*/
            case "1":
            {
                var sStarttime = getTheDate("aweek", "start");
                var sEndTime = getTheDate("aweek", "end");
                 
                break;
            };
            /*选择 一月*/
            case "2":
            {
                var sStarttime = getTheDate("month", "start");
                var sEndTime = getTheDate("month", "end");
                 
                break;
            };
            /*选择一年*/
            case "3":
            {
                var sStarttime = getTheDate("year", "start");
                var sEndTime = getTheDate("year", "end");
                 
                break;
            };
            /*选择其他时间*/
            case "4":
            {
                var StartTime = $("input[name='daterangepicker_start']").val();
                var sEndTime = $("input[name='daterangepicker_end']").val(); 
                
                var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                var sEndTime = (new Date(Number(sEndTime.slice(0,4)),Number(sEndTime.slice(5,7))-1,Number(sEndTime.slice(8,10)))).getTime();
              
                 
                break;
            };
            default:
                break;
        }
        /*填充头部信息*/ 
        var SendMsg = {
            /*上网时长和流量排行*/
            GetNetPlayAndFlowSort:{
                url: MyConfig.path + "/ant/read_dpi_app",
                dataType: "json",
                type: "post",
                data: {
                    Method: 'SortNetPlayTimeAndFlow',  
                    Param: {
                        family: "0",
                        direct: "0",
                        ACSNList:g_sn,//["210235A1SQC15A000045"/*,"210235A1SQC15A000051"*/],
                        //MACList:g_UserMsg[g_UserMsgCount].macAddr,
                        UserList:[g_UserMsg[g_UserMsgCount].userId],
                        StartTime: sStarttime/1000,
                        EndTime: sEndTime/1000,
                    }, 

                    Return: [

                    ] 
                },
                onSuccess:getSortTimeMsgSuccess,
                onFailed:getSortTimeMsgFail
            },
            /*访问次数排行*/
            /*GetAccessCount:{
                url: MyConfig.path + "/useridentity/getOneUserHistroy",
                dataType: "json",
                type: "post", 
                data: { 
                    devSNList:g_sn,
                    userId:g_UserMsg[g_UserMsgCount].userId,
                    startTime:"",//nStartTime.toISOString(),
                    endTime:"",//nEndTime.toISOString(),
                    skipNum:0,
                    limitNum:LIMIT_NUMBER, 
                },
                onSuccess:getAccessCountSuccess,
                onFailed:getAccessCountFail 
            },*/
            /*访问楼盘数量*/
            GetHouseNum:{
                url: MyConfig.v2path + "/useridentity/getOneUserHistroy",
                dataType: "json",
                type: "post", 
            }
        }
        Utils.Request.sendRequest(SendMsg.GetNetPlayAndFlowSort);
         /*Utils.Request.sendRequest(SendMsg.GetAccessCount);*/
        function getSortTimeMsgSuccess(data)
        {
           var aMessage = data.message; 
            $("#sortTime").html(aMessage.TimeTop);
            $("#sortFlow").html(aMessage.FlowTop);
        }
        function getSortTimeMsgFail()
        {
            console.log("fail terminal fail!");
        } 
       /* function getAccessCountSuccess(data)
        {
            $("#AccessCount").html("1");
        }
        function getAccessCountFail()
        {
            return;
        }*/

        /*访问次数排行*/
        var nUserCount = g_UserMsg[g_UserMsgCount].accessCount;
        var nSort = 1;
        for(var i=0;i<g_UserMsg.length;i++)
        {
            if(nUserCount < g_UserMsg[i].accessCount)
            {
                nSort++;
            }
        }
        $("#AccessCount").html(nSort);
    }
    /*选则应用与网站按钮*/
    function SelectDpiType()
    {
        var val = $(this).val();
        if(val == 0)
        {
            showApp();
        }
        else
        {
           showUrl(); 
        }

    };
    /*选择喜欢与不喜欢按钮*/
    function SelectLocationType()
    {
        var val = $(this).val();
        if(val == 0)
        {
           showWelcome();
        }
        else
        {
           showNotWelcome(); 
        }
    }
     
    /*显示上网信息*/
    function SelectNetplay()
    {
        $("#showLocaltionMsg").addClass("hide");
        $("#showNetplayMsg").removeClass("hide");
        g_SelectNetPlayOrLocaltion = "dpi";
        dpiData();  
    }
    /*显示位置信息*/
    function SelectLocation()
    {
        $("#showNetplayMsg").addClass("hide");
        $("#showLocaltionMsg").removeClass("hide");
        g_SelectNetPlayOrLocaltion = "localtion";
        localtionData();
        
    }
    function SelectUserDeltailOrTrend()
    {
        var val = $(this).val()
        if(val == "0")
        {
            $("#LocaltionTrend").addClass("hide");
            $("#LocaltionDetail").removeClass("hide");
            initLocaltionName_pie("like"); 
        }
        else
        {
            $("#LocaltionDetail").addClass("hide");
            $("#LocaltionTrend").removeClass("hide");
            drowChord();
        }
    }
    function SelectUser()
    {
         var data = $("#MapSelect").singleSelect("getSelectedData");
         var sUserName = data.value;
         for(var i=0;i<g_UserMsg.length;i++)
         {
            if(sUserName == g_UserMsg[i].name)
            {
                g_UserMsgCount = i;
                if(g_SelectNetPlayOrLocaltion == "dpi")
                {
                    dpiData();
                }
                else
                {
                    localtionData();
                }
                GetPicMsg();
                getHeadMsg();
                break;
            }
         }
    };
    function SelectTime()
    {
        $("#today,#aweek,#amonth,#year,#otherTime").removeClass("SelectTime");
        
        g_SelectTime = $(this).attr("value");
        if(g_SelectTime == "")
        {
            g_SelectTime = "4";
            $("#otherTime").addClass("SelectTime");
        } 
        else
        {
            $(this).addClass("SelectTime");
        }

        getHeadMsg();
        if(g_SelectNetPlayOrLocaltion == "dpi")
        {
            dpiData();
        }
        else
        {
            localtionData();
        }
    };
    function SeleceDpiAppType()
    {
        var nValue = $(this).val();
        g_DpiAppType = nValue;
        dpiData();
    }
    function SeleceDpiUrlType()
    {
        var nValue = $(this).val();
        g_DpiUrlType = nValue;
        dpiData();  
    }
    function initForm()
    {
        /*选择列表中的用户*/
        $("#MapSelect").change(function(){
            SelectUser();
        });
        /*选择显示的时间段*/
        $("#today,#aweek,#amonth,#year,.applyBtn").on('click',SelectTime);
        /*选择位置信息与上网信息*/
        $("#NetplayMsg").on('click',SelectNetplay);
        $("#LocationMsg").on('click',SelectLocation);
        /*选择应用与网站按钮*/
        $("#DpiApp,#DpiUrl").on("click",SelectDpiType); 
        /*选择用户喜欢的位置和不喜欢的位置*/
        $("#WecomeLocation,#NotWelcomeLocaltion").on('click',SelectLocationType);
        /*跳转到上网详情页面*/
          /*本地*/
          var UserId = "1234"
        $("#userDpi_details").on("click", function(){
            Utils.Base.redirect ({np:"dpi_user.userdpidetail",ID:$(this).attr("id"),UserId:UserId});
           /* window.location.href="DpiUser.UserDpiDetail";*/
            return false;
        }); 
        /*跳转到位置详情页面*/
         $("#UserLocaltion_details").on("click", function(){
            Utils.Base.redirect ({np:"dpi_user.userlocaltiondetail",ID:$(this).attr("id")});
           /* window.location.href="DpiUser.UserDpiDetail";*/
            return false;
        }); 
          /*云上*/
         /* $("#userDpi_details").on("click", function(){
            Utils.Base.redirect ({np:"a_dataanalysis.UserDpiDetail",ID:$(this).attr("id")});
            return false;
        });*/
        /*选择点击详细信息和用户走向的按钮*/
        $("#UserDetail,#UserTrend").on("click",SelectUserDeltailOrTrend);
        /*点击上网信息 应用页面的时长 流量 次数按钮*/
        $("#DpiAppTime,#DpiAppCount,#DpiAppFlow").on('click',SeleceDpiAppType);
        /*点击上网信息 网站页面的时长 次数按钮*/
        $("#DpiUrlTime,#DpiUrlCount").on('click',SeleceDpiUrlType);
        
    }  

    function initData()
    {
        /*获取用户名*//*其他的数据由于要依赖于获取的UserName所以要在本函数中初始化*/
        getUserName();
         
    }
    function initGrid()
    {  
        var opt = {
            colNames: getRcText ("LocalName"),
            showHeader: true,
            search:true,
            pageSize:5,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [ 
                {name: "LocalName", datatype: "String"},
                {name:"AccessNum",datatype:"String"},
                {name:"AccessTime", datatype:"String"}
            ]
        };
        $("#NotWelcomeLocaltion_list").SList ("head", opt);
    }
    function onAjaxErr()
    {
    }
    function _init()
    {

        initForm();
        initGrid();
        initData();


    };

    function _destroy()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form","Minput","Echart","DateRange","SingleSelect","DateTime","Antmenu"],
        "utils":["Base","Request"]
    });
})( jQuery );

