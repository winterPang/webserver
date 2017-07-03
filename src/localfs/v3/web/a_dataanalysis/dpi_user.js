;(function ($) {
     var MODULE_BASE = "a_dataanalysis";
     var MODULE_NAME = MODULE_BASE + ".dpi_user";
     var g_sn = FrameInfo.ACSN;
      function getRcText(sRcName) {
        return Utils.Base.getRcString("User_monitor_rc", sRcName);
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
    /*上网类别信息的饼图*/
    function  initAppType_pie(type)
    {
       var adata = [{name:"下载",value:12},{name:"通讯",value:21},{name:"工具",value:32},{name:"金融",value:89},{name:"导航",value:33},{name:"新闻",value:50}];
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
                    scope: "#AppType_message",
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
            
            
        if(type == "app")
        {
            option.myLegend.scope = "#AppType_message"; 
            $("#AppType_pie").echart("init", option, oTheme);  
        }
        else
        {
            var adata = [{name:"娱乐",value:50},{name:"购物",value:21},{name:"科技",value:32},{name:"搜索",value:89},{name:"导航",value:33},{name:"新闻",value:50}];
            option.myLegend.scope = "#UrlType_message";
            option.series[0].data = adata;
            $("#UrlType_pie").echart("init", option, oTheme);  
        }
    }  
    /*上网名称饼图*/
    function initAppName(type)
    {
        var adata = [{name:"360",value:900},{name:"京东",value:21},{name:"淘宝",value:32},{name:"股票",value:89},{name:"聚美",value:33}]; 
        var adata1 = [{name:"QQ",value:12},{name:"微信",value:21},{name:"微博",value:32},{name:"快手",value:89},{name:"贴吧",value:55}];  
        var adata2 = [{name:"好压",value:12},{name:"有道",value:21},{name:"高德",value:900},{name:"优步",value:89},{name:"滴滴",value:33}]; 
        var adata3 = [{name:"股票360",value:12},{name:"微信",value:21},{name:"微博",value:32},{name:"有道",value:900},{name:"聚美",value:33}]; 
        var adata4 = [{name:"高德",value:12},{name:"谷歌",value:21},{name:"百度地图",value:32},{name:"优步",value:89},{name:"易道",value:900}]; 
        var adata5 = [{name:"网易",value:12},{name:"腾讯",value:900},{name:"CCTV",value:32},{name:"凤凰",value:89},{name:"有道",value:33}]; 
        
         color : ['#53B9E7','#D7DDE4','#69C4C5','#FFBB33','#FF8800','#CC324B']
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
            
        if(type == "app")
        {
            $("#AppName_pie").echart("init", option, oTheme); 
             option.myLegend.scope = "#AppName1_message";
             option.series[0].data = adata1;
             oTheme.color = aColor[1];
            $("#AppName1_pie").echart("init", option, oTheme); 
             option.myLegend.scope = "#AppName2_message";
             option.series[0].data = adata2;
              oTheme.color = aColor[2];
            $("#AppName2_pie").echart("init", option, oTheme); 
            option.myLegend.scope = "#AppName3_message";
             option.series[0].data = adata3;
              oTheme.color = aColor[3];
            $("#AppName3_pie").echart("init", option, oTheme); 
            option.myLegend.scope = "#AppName4_message";
             option.series[0].data = adata4;
              oTheme.color = aColor[4];
            $("#AppName4_pie").echart("init", option, oTheme); 
            option.myLegend.scope = "#AppName5_message";
             option.series[0].data = adata5;
              oTheme.color = aColor[5];
            $("#AppName5_pie").echart("init", option, oTheme);   
        }
        else
        { 
            var adata = [{name:"www.360.com",value:900},{name:"www.jigndong.com",value:21},{name:"www.taobao.com",value:32},{name:"www.gupiao.com",value:89},{name:"www.jumai.com",value:33}]; 
            var adata1 = [{name:"www.QQ.com",value:12},{name:"www.weixin.com",value:21},{name:"www.weibo.com",value:32},{name:"www.kushou.com",value:89},{name:"www.tieba.com",value:55}];  
            var adata2 = [{name:"www.haoya.com",value:12},{name:"www.youdao.com",value:21},{name:"www.gaode.com",value:900},{name:"www.youbu.com",value:89},{name:"www.didi.com",value:33}]; 
            var adata3 = [{name:"www.gu360.com",value:12},{name:"www.weixin.com",value:21},{name:"www.weibo.com",value:32},{name:"www.youdao.com",value:900},{name:"www.jumei.com",value:33}]; 
            /*var adata4 = [{name:"高德",value:12},{name:"谷歌",value:21},{name:"百度地图",value:32},{name:"优步",value:89},{name:"易道",value:900}]; 
            var adata5 = [{name:"网易",value:12},{name:"腾讯",value:900},{name:"CCTV",value:32},{name:"凤凰",value:89},{name:"有道",value:33}]; */
            option.series[0].data = adata;
            option.myLegend.scope = "#UrlName_message";
            $("#UrlName_pie").echart("init", option, oTheme); 

             option.myLegend.scope = "#UrlName1_message";
             option.series[0].data = adata1;
             oTheme.color = aColor[1];
            $("#UrlName1_pie").echart("init", option, oTheme);

            /* option.myLegend.scope = "#UrlName2_message";
             option.series[0].data = adata2;
              oTheme.color = aColor[2];
            $("#UrlName2_pie").echart("init", option, oTheme); */

            option.myLegend.scope = "#UrlName3_message";
             option.series[0].data = adata2;
              oTheme.color = aColor[3];
            $("#UrlName3_pie").echart("init", option, oTheme); 

            option.myLegend.scope = "#UrlName4_message";
             option.series[0].data = adata2;
              oTheme.color = aColor[4];
            $("#UrlName4_pie").echart("init", option, oTheme); 

           /* option.myLegend.scope = "#UrlName5_message";
             option.series[0].data = adata5;
              oTheme.color = aColor[5];
            $("#UrlName5_pie").echart("init", option, oTheme);  */
        }
        
    }
    /*上网信息折线图*/
    function initApptype_Chart(type)
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
                    name: "下载",
                    data: aUrldata
                },
                 {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "通讯",
                    data: aUrldata2
                },
                 {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "金融",
                    data: aUrldata1
                },
                 {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "导航",
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
         

        initAppType_pie("app");
        initAppName("app");
        initApptype_Chart("app");
    }
    /*显示上网信息的网站信息*/
    function showUrl()
    {
        $("#showUrl").removeClass("hide");
        $("#showApp").addClass("hide");
        $("#urlType_chart").removeClass("hide");
        $("#appType_chart").addClass("hide");
        
        initAppType_pie("url");
        initAppName("url");
        initApptype_Chart("url");
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
    function dpiData()
    {
        initAppType_pie("app");
        initAppName("app");
        initApptype_Chart("app"); 
    }
    function localtionData()
    {
        initLocaltionType_pie("like");
        initLocaltionName_pie("like");
        initLocaltiontype_Chart("like"); 
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

    }
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
         dpiData();  
    }
    /*显示位置信息*/
    function SelectLocation()
    {
        $("#showNetplayMsg").addClass("hide");
        $("#showLocaltionMsg").removeClass("hide");
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
    function initForm()
    {
        /*选择位置信息与上网信息*/
        $("#NetplayMsg").on('click',SelectNetplay);
        $("#LocationMsg").on('click',SelectLocation);
        /*选择应用与网站按钮*/
        $("#DpiApp,#DpiUrl").on("click",SelectDpiType); 
        /*选择用户喜欢的位置和不喜欢的位置*/
        $("#WecomeLocation,#NotWelcomeLocaltion").on('click',SelectLocationType);
        /*跳转到详情页面*/
          /*本地*/
        $("#userDpi_details").on("click", function(){
            Utils.Base.redirect ({np:"DpiUser.UserDpiDetail",ID:$(this).attr("id")});
            return false;
        }); 
          /*云上*/
         /* $("#userDpi_details").on("click", function(){
            Utils.Base.redirect ({np:"a_dataanalysis.UserDpiDetail",ID:$(this).attr("id")});
            return false;
        });*/
        /*选择点击详细信息和用户走向的按钮*/
        $("#UserDetail,#UserTrend").on("click",SelectUserDeltailOrTrend)
        
    }  

    function initData()
    {
        
        dpiData();  
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

