;(function ($) {
     var MODULE_BASE = "netLog";
     var MODULE_NAME = MODULE_BASE + ".log";
     var g_sn = FrameInfo.ACSN;
      function getRcText(sRcName) {
        return Utils.Base.getRcString("User_monitor_rc", sRcName);
    }
    
   function showcfg(row, cell, value, columnDef, dataContext, type)
   {
         value = value || "";
        if ( "text" == type)
        {
            return "设置";
        }
        var shop_id = dataContext.shop_id;
        var sid = dataContext.sid;
        var checkState = dataContext.checkState;
        var chatName= dataContext.chatName;

        /*if(!shop_id||!sid||checkState!=3){
            return '<i class="fa fa-cog" style="font-size: 20px"></i>';
        }*/

        return '<a class="list-link" data-chatName = "'+chatName+'" data-sid = "'+sid+'" data-shopId ="'+shop_id+'" ><i class="fa fa-cog" style="font-size: 20px"></i></a>';
   }
   function onDisDetail()
   {

   }
   function initChart()
   { 
        var aUrldata = [24,71,53,23,66,13,97,15,92,84,63];
        var aTime =    ["1/31","2/31","3/31","4/31","5/31","6/31","7/31","8/31","9/31","10/31","11/31"];
        var option = { 
            height: 500, 
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
            grid: {
                x: 70,
                y: 50,
                x2: 30,
                y2: 50, //45
                borderColor: '#415172', 
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
                    nameTextStyle: {color: "gray"},
                    axisLabel: { 
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
                    //name:"次数",
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
                   // name: "下载",
                    data: aUrldata
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
        $("#cfgChart").echart("init", option, oTheme);  
         
   }
   function showList()
   {
      $("#chartID").addClass("hide");
      $("#listID").removeClass("hide");
      initList();
   }
   function showChart()
   {
     $("#listID").addClass("hide");
      $("#chartID").removeClass("hide");
      initChart();
   }
    function initForm()
    {
        $("#cfgListID").on("click",showList);
        $("#concer1").on("click",showChart);
        
    }  
    function initList()
    {
        var data = [{user:"Lee.linfeng",heaGread:88,opeDes:"5G优先",time:"2016/07/22"},
        {user:"启动系统",heaGread:93,opeDes:"调整信道",time:"2016/07/22"}]
        $("#cfgList").SList ("refresh", data);
    }
    function initData()
    {
        initList();
        initChart();
    }
    function initGrid()
    {  
        var opt = {
            colNames: getRcText ("list_HEAD"),
            //showOperation:true,
            pageSize:10,
            colModel: [
                {name:'user',datatype:"String"},
                {name:'heaGread', datatype:"String"},
                {name:'opeDes',datatype:"String"}, 
                {name:'cfgCom',datatype:"String",formatter:showcfg},
                {name:'cfgDel',datatype:"String",formatter:showcfg},
                {name:'cfgExp',datatype:"String",formatter:showcfg},
                {name:'cfgBack',datatype:"String",formatter:showcfg},
                {name:'time',datatype:"String"}
            ] 
        };
        $("#cfgList").SList ("head", opt);

        $("#cfgList").on('click', 'a.list-link', onDisDetail);
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

