;(function ($) {
     var MODULE_BASE = "DpiUser";
     var MODULE_NAME = MODULE_BASE + ".dpi_User";
     var g_sn = FrameInfo.ACSN;
      function getRcText(sRcName) {
        return Utils.Base.getRcString("User_monitor_rc", sRcName);
    } 
     function AddList()
     { 
  
         var clickListMenu = function(oparam){
              
            var UserName =  $(oparam).attr("param");
            $("#Username").html(UserName);
        };

        g_command = {
            search:{show:true, content:""},
            data:[{name: "张奎", value: 1, param: "张奎", func: clickListMenu,},
            {name: "刘元", value: 2, param: "刘元", func: clickListMenu,},
            {name: "彭汁", value: 3, param: "彭汁", func: clickListMenu,},
            {name: "周娇", value: 4, param: "周娇", func: clickListMenu,},
            {name: "汤唯", value: 5, param: "汤唯", func: clickListMenu,},
            {name: "苏华", value: 6, param: "苏华", func: clickListMenu,},
            {name: "雨花华", value: 6, param: "雨花华", func: clickListMenu,},
            {name: "周顺", value: 6, param: "周顺", func: clickListMenu,},
            {name: "李豁子", value: 6, param: "李豁子", func: clickListMenu,},
            {name: "阿娇", value: 6, param: "阿娇", func: clickListMenu,},
            ],
        };
        $(".antmenu").antmenu("init",g_command);


     }
     function DrowAccessFrequence()
     {
         
        var aUrldata = [14,51,33,33,26,13,77,25,42,24,23];
        var aTime =    ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00","8:00","9:00","10:00"];
        var option = {
             
            height: 300,
             width:800,
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
           legend: {
                data:['访问次数',]
            },
           // dataZoom:dataZoom,
            grid: {
                x: 70,
                y: 70,
                x2: 30,
                y2: 30, //45
                borderColor: '#415172'
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
                   // itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "访问次数",
                    data: aUrldata
                }

            ]

        };
        var oTheme = {
            color: ['#9DE274', '#31A9DC', '#62BCE2'],
            valueAxis: {
                splitLine: {lineStyle: {color: ['#415172']}},
                axisLabel: {textStyle: {color: ['#abbbde']}}
            },
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#415172']}}
            }
        }

        $("#UserAccessFrequ_chart").echart("init", option, oTheme);
     }
     function DrowDpiChart()
     {
        var aAppdata = [12,31,23,43,56,43,67,65,12,34,32];
        var aUrldata = [14,51,33,33,26,13,77,25,42,24,23];
        var aTime =    ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00","8:00","9:00","10:00"];
        var option = {
             
            height: 300,
             width:800,
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
           legend: {
                data:['应用','上网']
            },
           // dataZoom:dataZoom,
            grid: {
                x: 70,
                y: 70,
                x2: 30,
                y2: 30, //45
                borderColor: '#415172'
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
                    name:"数量",
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
                   // itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "应用",
                    data: aAppdata
                },
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                   // itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "上网",
                    data: aUrldata
                }

            ]

        };
        var oTheme = {
            color: ['#9DE274', '#31A9DC', '#62BCE2'],
            valueAxis: {
                splitLine: {lineStyle: {color: ['#415172']}},
                axisLabel: {textStyle: {color: ['#abbbde']}}
            },
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#415172']}}
            }
        }

        $("#UserDpi_chart").echart("init", option, oTheme);
     }
    function DrowDpi()
    {
        DrowDpiChart();
        
    }
    function DrowLocation()
    {
         var adata = [{name:"楼盘1",value:12},{name:"楼盘2",value:25},{name:"楼盘3",value:14},{name:"楼盘4 ",value:46},{name:"楼盘5",value:23}]; 
            var option = {
                height: 200,
               // width:500,
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend: {
                    scope: "#UserAppType_message",
                    width: "30%",
                    height: 150,
                    right: "45%",
                    //top: topChange(140, 31,adata.length,8),
                },
                calculable: false,
                series: [
                    {
                        //  name: aID[2],
                        type: 'pie',
                        radius: ['35%', '65%'],
                        center: ['45%', '47%'],
                        /*itemStyle: {
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
                        },*/
                        data: adata
                    }
                ],
            }; 
            var oTheme = {
                color: ['#31A9DC', '#428BCA', '#08C', '#0096D6', '#5BC0DE','#55AA66', '#44A3BB', '#2BD5D5', '#91B2D2', '#D7DDE4']
            }; 
        $("#UserLocation_Pie").echart("init", option, oTheme);
    }
    function ChickUser()
    {
        var Id = $(this).attr("id"); 
        $(".list-group-item").removeClass("active");
        $("#"+Id).addClass("active");
         
    }
    function ChickAllUser()
    {
        /*取消所有的选中框*/
        $(".list-group-item").removeClass("active");
        /*添加点击全部用户的选中框*/
         $("#UserAll").addClass("active");
        /*显示所有的用户列表 影藏单个用户列表*/
        $("#listmap").removeClass("hide");
        $("#OneUserlistmap").addClass("hide");  
        
    }
     var UserName_temp;
    function getUser()
    {
         var UserValue = $("#Userinput").val();
         if(UserValue == "")
         {
             $("#listmap").removeClass("hide");
             $("#OneUserlistmap").addClass("hide");
             UserName_temp = "";
         }
        if(event.keyCode==13)
        {
           
            var flag = 0
            /*先要确定选中了那几个键*/ 
           
            if( UserValue != UserName_temp)
            {
                UserName_temp = UserValue;
                flag = 1; 
            }   
               
            if(flag == 1 )
            {
                 $("#listmap").addClass("hide");
                 $("#OneUserlistmap").removeClass("hide");
                 var listdiv = $('<div />',{ 
                    class:'new-list-group ',
                    html: '<a href="javascript:void(0)" class="list-group-item  Background"><img src="./css/image/pic/totalUser.jpg" height="50px"><i style="color: #000;">'+UserName_temp+'</i></a>'
                    })
                   listdiv.appendTo("#OneUserlistmap");
            } 
        } 
    }
    
    function initForm()
    {
        $("#AllUser").on("click",ChickAllUser); 
         /*绑定键入的回车键*/
        $("#Userinput").bind("keyup",getUser);
       
    }  

    function initData()
    {
        /*动态添加list*/
        AddList(); 
        DrowDpi();
        DrowLocation();
        DrowAccessFrequence();
        
       
    }
    function initGrid()
    {
         
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
        "widgets": ["SList","Echart","DateRange","SingleSelect","DateTime","Antmenu"],
        "utils":["Base"]
    });
})( jQuery );

