;(function ($) {
    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".main";
    var LIST_NAME = "wirelessterminal_mlist";
    var LIST_NAMET = "ap_info_mlist";

    function getRcText(sRcName){
        return getRcString("rc", sRcName);
    }

    function getRcString(sRcId, sRcName){
        return $("#"+sRcId).attr(sRcName) || "";
    }

    /*
      异常统计模块
    */
    function initTotal(){
        $.get(MyConfig.path+'/maintenance/total', function(maintenanceData){

            analyseTotalData(maintenanceData);
        });

        function analyseTotalData(maintenanceData){

            maintenanceData = JSON.parse(maintenanceData);
            var Total = maintenanceData.total;
            var Deactive = maintenanceData.deactive;
            var Active = maintenanceData.active;
            var New = maintenanceData.new;

            $('#sumnumber1').text(Total);
            $('#sumnumber2').text(Deactive);
            $('#sumnumber3').text(Active);
            $('#sumnumber4').text(New);
        }
    }


    /*
     列表模块,紧急异常
     */
    function initEmergency(){
        $.get(MyConfig.path+'/maintenance/emergency', function(maintenanceData){

            analyseEmergencyData(maintenanceData);
        });

        function analyseEmergencyData(maintenanceData){

            var data2 = JSON.parse(maintenanceData);
            var opt = {
                colNames: getRcText ("AP_LABELS"),
                showHeader: true,
                multiSelect: false,
				search:false,
                showPages:false,
                columnChange:false,
                colModel: [
				    {name:'time', datatype:"String",width:120},
                    {name:'handler', datatype:"String",width:80,formatter:showEmergencySum},
                    {name:'module', datatype:"String",width:70},
                    {name:'product', datatype:"String",width:80}					
                ],
				buttons:[
				    {name:"edit",enable:false},
                    {name:"delete",enable:false},
                    {name:"add",enable:false},
                    {name:"detail",enable:false}
				]		
            };

            //异常分析数据解析
            var apData = [];
            for (var i = 0; i < data2.length; i++)
            {
                apData[i] = {};
				apData[i].time =  data2[i].date+' '+data2[i].time;              
                apData[i].handler = data2[i].handler;
                apData[i].module = data2[i].module;
                apData[i].product = data2[i].product;
				apData[i].core = data2[i].core;
            }

            $("#ap_info_mlist").mlist ("head", opt);
            $("#ap_info_mlist").mlist ("refresh", apData);
        }
    }

    /*
     柱状图（竖向）
     */
    function drawBar(xlist, vlist){
        // 使用
        require(
            [
                'echarts',
                'echarts/chart/bar' // 按需加载使用的图形模块
            ],
            function (ec){
               // 基于准备好的dom,初始化echarts图表
                var myChart = ec.init(document.getElementById('bar'));
                var option = {
                    title : {
                        subtext: '',
                        x:'center',
                        y:"60"
                    },
                    tooltip : {
                        show:true,
                        trigger: 'axis',
                        axisPointer:{
                            lineStyle:{
                                width:0
                            }
                        }
                    },
                    calculable : false,
                    grid :
                    {
                        x:40, y:26, x2:50, y2:20,
                        borderColor : '#fff'
                    },
                    xAxis : [
                        {
                            name:"模块",
                            boundaryGap: true,
                            splitLine:false,
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#9da9b8', width: 1}
                            },
                            axisTick:{show:false},
                            axisLabel:{
                                show:true,
                                textStyle:{color: '#e6e6e6',fontSize:'8px'},
                                formatter:function (value){
                                    return value;
                                },
                                interval:0
                            },

                            // axisTick:"item",
                            type : 'category',
                            data : xlist
                        }
                    ],
                    yAxis : [
                        {
                            name:"异常次数",
                            splitLine:false,
                            axisLabel: {
                                show:true,
                                textStyle:{color: '#e6e6e6',fontSize:'8px'}
                            },
                            axisLine : {
                                show:true,
                                lineStyle :{color: '#9da9b8'}
                            },
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:"yistLine",
                            type:'bar',
                            barCategoryGap: '35%',
                            data:vlist,
                            itemStyle : {
                                normal: {
                                    color:
                                        function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                'green','gray','#FCCE10','#E87C25','#27727B',
                                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}'
                                    }
                                }
                            }
                        }
                    ]
                };

                //为echarts对象加载数据
                myChart.setOption(option);
            }
        )
    }

    /*异常分布竖向柱状图数据的获取*/
    function initModule(){
        $.get(MyConfig.path+'/maintenance/module', function(maintenanceData){

            analyseModuleData(maintenanceData);
        });

        function analyseModuleData(maintenanceData){

            //解析异常分析数据
            var data2 = JSON.parse(maintenanceData);
            var xlist = [];
            var vlist = [];
            for (var i in data2)
            {
                xlist.push(data2[i].module);
                vlist.push(data2[i].count);
            }

            drawBar(xlist, vlist);
        }
    }

    /*
     柱状图（横向）
     */
    function drawRate(ylist, vlist){
        // 使用
        require(
            [
                'echarts',
                'echarts/chart/bar' // 按需加载使用的图形模块
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('rate'));

                var option= {
                    title : {
                        subtext: '',
                        x:'center',
                        y:"60"
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
                        }
                    },
                    calculable : false,
                    grid :
                    {
                        x:80, y:40, x2:80, y2:25,
                        borderColor : '#fff'
                    },
                    xAxis : [
                        {
                            name:"租户分布",
                            splitLine:false,
                            axisLabel: {
                                show:true,
                                textStyle:{color: '#e6e6e6'}
                            },
                            axisLine : {
                                show:true,
                                lineStyle :{color: '#617085', width: 1}
                            },
                            type : 'value'
                        }
                    ],
                    yAxis : [
                        {
                            type : 'category',
							axisLabel: {
								show:true,
								textStyle:{color: '#e6e6e6'}
                            },
                            data : ylist
                        }
                    ],
                    series : [
                        {
                            data:vlist,
                            name:"yistLine",
                            type:'bar',
                            barCategoryGap: '40%',
                            itemStyle : {
                                normal: {
                                    color:
                                        function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                'green','#26C0C0','#FCCE10','#E87C25','#27727B',
                                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
                                    label: {
                                        show: true,
                                        position: 'right',
                                        formatter: '{c}'
                                    }
                                }
                            }
                        }
                    ]
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        )
    }

    /*异常分布横向柱状图数据的获取*/
    function initSetpoint(){
        $.get(MyConfig.path+'/maintenance/setpoint', function(maintenanceData){

            analyseSerpointData(maintenanceData);
        });

        function analyseSerpointData(maintenanceData) {

            //异常分析数据
            var data2 = JSON.parse(maintenanceData);
            var ylist = [];
            var vlist = [];
            for (var i in data2) {
                if ((data2[i].setpoint == null) || (data2[i].setpoint == "")) {
                    continue;
                }
                else {
                    ylist.push(data2[i].setpoint);
                    vlist.push(data2[i].count);
                }
            }
            drawRate(ylist, vlist);
        }
    }

    /*
     饼状图
     */
    function drawPie(atempData){
        //使用
        require(
            [
                'echarts',
                'echarts/chart/pie' // 按需加载使用的图形模块
            ],
            function drawPie(ec) {

                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('terminaltype'));
                var option = {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {
                                show: true,
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        x: '25%',
                                        width: '80%',
                                        funnelAlign: 'center',
                                        max: 1548
                                    }
                                }
                            },
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    series : [
                        {
                            name:'访问来源',
                            type:'pie',
                            radius : ['50%', '80%'],
                            itemStyle: {
                                normal: {
                                    areaStyle: {
                                        type: 'default'
                                    },
                                    label:{
                                        formatter: "{d}%"
                                    },
                                    labelLine: {
                                        length: 1
                                    }
                                },
                                emphasis : {
                                    label : {
                                        show : true,
                                        position : 'center',
                                        textStyle : {
                                            fontSize : '20',
                                            fontWeight : 'bold'
                                        }
                                    }
                                }
                            },
                            data:
                                atempData

                        }
                    ]
                };
                var oTheme = {
                    color : ['gray','blue','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
                };

                // 为echarts对象加载数据
                myChart.setOption(option,oTheme.color);

                Legend($("#myLegend"),{
                    type: 'legend',
                    data: atempData,
                    color: oTheme.color
                })

            }
        )
    }

    /*异常分布原因数据的获取*/
    function initErrortype(){
        $.get(MyConfig.path+'/maintenance/errortype', function(maintenanceData){

            analyseErrortypeData(maintenanceData);
        });

        function analyseErrortypeData(maintenanceData) {

            //异常分析数据解析
            var data2 = JSON.parse(maintenanceData);
            var aType = getRcText('APPINFO').split(',');
            var atempData = [];
            for (var i = 0; i < data2.length; i++) {
                atempData[i] = {};
                atempData[i].name = aType[data2[i].errortype];
                atempData[i].value = data2[i].count;
            }

            drawPie(atempData);
        }
    }

    /*
     折线图
     */
    function drawLine(xlist, vlist1, vlist2){
        require(
            [
                'echarts',
                'echarts/chart/line' // 按需加载使用的图形模块
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = require('echarts').init(document.getElementById('legend'));
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:
                        [
                            {
                                name:"未修复",
                                textStyle:{color:'white'}
                            },
                            {
                                name:"每日新增",
                                textStyle:{color:'white'}
                            }
                        ]
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            name :'日期',
                            type : 'category',
                            boundaryGap : false,
							axisLabel: {
								show:true,
								textStyle:{color: '#e6e6e6',fontSize:'8px'}
                            },
                            data : xlist
                        }
                    ],
                    yAxis : [
                        {
                            name :'个数',
                            type : 'value',
							axisLabel: {
								show:true,
								textStyle:{color: '#e6e6e6',fontSize:'8px'}
                            }
                        }
                    ],
                    series : [
                        {
                            name:'未修复',
                            type:'line',
                            stack: '总量',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:vlist1
                        },
                        {
                            name:'每日新增',
                            type:'line',
                            stack: '总量',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:vlist2
                        }
                    ]
                };

                var oTheme = {
                    color : ['yellow','#red']
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        )
    }

    /*趋势模块数据的获取*/
    function initTendency(){
        $.get(MyConfig.path+'/maintenance/tendency', function(maintenanceData){

            analyseTendencyData(maintenanceData);
        });

        function  analyseTendencyData(maintenanceData) {

            //异常分析数据解析
            var data2 = JSON.parse(maintenanceData);
            var xlist = [];
            var vlist1 = [];
            var vlist2 = [];
            for (var i in data2) {
                xlist.push(data2[i].date);
                vlist1.push(data2[i].old);
                vlist2.push(data2[i].new);
            }

            drawLine(xlist, vlist1, vlist2);
        }
    }

    /*
     散点图
     */
    function drawScatter(xlist, ylist, vlist){

        //去掉日期里面相同的元素
        var Hash = {};
        var xlistFilter = new Array();
        for(var i = 0; i < xlist.length ; i++){
            if( !Hash[xlist[i]]){
                xlistFilter.push(xlist[i]);
                Hash[xlist[i]] = true;
            }
        }


        //去掉版本数组里面相同的元素
        var hash = {};
        var ylistFilter = new Array();
        for(var i = 0; i < ylist.length ; i++){
            if(!hash[ylist[i]]){
                ylistFilter.push(ylist[i]);
                hash[ylist[i]] = true;
            }
        }

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/scatter' //按需加载使用的图形模块
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('scatter'));
                var option = {
                    tooltip : {
                        show:true,
                        trigger: 'axis',
                        axisPointer:{
                            show: true,
                            type : 'cross',
                            lineStyle: {
                                type : 'dashed',
                                width : 1
                            }
                        }
                    },
                    dataZoom: {
                        show: true,
                        realtime: true,
                        start : 0,
                        end : 100
                    },
                    legend : {
                        data :
                        [
                            {
                                name:"未修复",
                                textStyle:{color:'white'}
                            }
                        ]
                    },
                    dataRange: {
                        min: 0,
                        max: 100,
                        orient: 'horizontal',
                        y: 30,
                        x: 'center',
                        color:['lightgreen','orange']
                    },
                    xAxis : [
                        {
                            type : 'category',
                            axisLabel: {
                                formatter : function(v) {
                                    return v;
                                },
								textStyle:{color: '#e6e6e6'}
                            },
                            data : xlistFilter
                        }
                    ],
                    yAxis : [
                        {
                            type : 'category',
                            axisLabel: {
                                formatter : function(v) {
                                    return v;
                                },
								textStyle:{color: '#e6e6e6'}
                            },
                            data : ylistFilter
                        }
                    ],
                    grid:{
                        x:120
                    },
                    animation: false,
                    series : [
                        {
                            name:'未修复',
                            type:'scatter',
                            tooltip : {
                                trigger: 'item',
                                formatter : function (params) {
                                    return params[0] + ' （'  + params[2][0] + '）<br/>'
                                        + params[2][1] + ', '
                                        + params[2][2];
                                },
                                axisPointer:{
                                    show: true
                                }
                            },
                            symbolSize: function (value){
                                return Math.round(value[2]/2);
                            },
                            data: vlist
                        }
                    ]
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        )
    }

    /*版本异常统计模块数据的获取*/
    function initVersion(){
        $.get(MyConfig.path+'/maintenance/versiontest', function(maintenanceData){

            analyseVersionData(maintenanceData);
        });

        function analyseVersionData(maintenanceData){

            var data2 = JSON.parse(maintenanceData);
            var xlist = [];
            var ylist = [];
            var vlist = [];
            var lastData = [];
            var y = 0;

            if( data2.length == 0){

                drawScatter(xlist,ylist,vlist);
                return;
            }

            if( data2.length == 1){

                xlist.push(data2[0].date);
                ylist.push(data2[0].version);
                vlist.push([data2[0].date,data2[0].version,data2[0].count]);
                drawScatter(xlist,ylist,vlist);
                return;
            }

            data2.sort(compare("date"));

            function compare(prob){
                return function(obj1,obj2){
                    var val1 = obj1[prob];
                    var val2 = obj2[prob];
                    if( val1 < val2){
                        return -1;
                    }
                    else if( val1 > val2){
                        return 1;
                    }
                    else{
                        return 0;
                    }
                }
            }

            var prob = data2[0];
            for(var i = 1 ; i < data2.length; i++){
                if( (prob.date == data2[i].date) && (prob.version == data2[i].version)){
                     ++prob.count;
                     if( i == data2.length -1){
                         lastData[y] = prob;
                     }
                }
                else
                {
                    lastData[y] = prob;
                    ++y;
                    prob = data2[i];
                    if( i == data2.length -1){
                        lastData[y] = prob;
                    }
                }
            }

            for(var k = 0 ; k < lastData.length ; k++){
                xlist.push(lastData[k].date);
                ylist.push(lastData[k].version);
                vlist.push([lastData[k].date,lastData[k].version,lastData[k].count]);
            }

            drawScatter(xlist,ylist,vlist);
        }
    }

    /*
     列表模块，异常列表
     */
    function initAll(){

        $.get(MyConfig.path+'/maintenance/all', function(maintenanceData){

            analyseAllData(maintenanceData);
        });

        function analyseAllData(maintenanceData) {

            var data2 = JSON.parse(maintenanceData);
            var opt_WIRELESSTERMINAL = {
                colNames: getRcText("WIRELESSTERMINAL"),
                showHeader: true,
                multiSelect: false,
                columnChange: false,
                colModel: [
                    {name: 'time', datatype: "String", width: 115},
                    {name: 'handler', datatype: "String", width: 80, formatter: showSum},
                    {name: 'module', datatype: "String", width: 70},
                    {name: 'setpoint', datatype: "String", width: 80},
                    {name: 'status', datatype: "String", width: 70},
                    {name: 'level', datatype: "String", width: 60, formatter: showSum},
                    {name: 'errortype', datatype: "String", width: 90, formatter: showSum},
                    {name: 'product', datatype: "String", width: 80},
                    {name: 'version', datatype: "String", width: 110}
                ],
                buttons: [
                    {name: "edit", enable: false},
                    {name: "delete", enable: false},
                    {name: "add", enable: false},
                    {name: "detail", enable: false},
                    {name: "refresh", enable: false}
                ]
            };

            var apData_WIRELESSTERMINAL = [];
            for (var i = 0; i < data2.length; i++) {
                apData_WIRELESSTERMINAL[i] = {};
                apData_WIRELESSTERMINAL[i].time = data2[i].date + ' ' + data2[i].time;
                apData_WIRELESSTERMINAL[i].handler = data2[i].handler;
                apData_WIRELESSTERMINAL[i].module = data2[i].module;
                apData_WIRELESSTERMINAL[i].setpoint = data2[i].setpoint;
                apData_WIRELESSTERMINAL[i].status = data2[i].handlemode;
                apData_WIRELESSTERMINAL[i].level = data2[i].level;
                apData_WIRELESSTERMINAL[i].errortype = data2[i].errortype;
                apData_WIRELESSTERMINAL[i].product = data2[i].product;
                apData_WIRELESSTERMINAL[i].version = data2[i].version;
                apData_WIRELESSTERMINAL[i].gdbinfo = data2[i].gdbinfo;
                apData_WIRELESSTERMINAL[i].core = data2[i].core;
                apData_WIRELESSTERMINAL[i].handlemode = data2[i].handlemode;

                if (apData_WIRELESSTERMINAL[i].status == "1") {
                    apData_WIRELESSTERMINAL[i].status = "未分配";
                } else if (apData_WIRELESSTERMINAL[i].status == "2") {
                    apData_WIRELESSTERMINAL[i].status = "未定位";
                } else if (apData_WIRELESSTERMINAL[i].status == "3") {
                    apData_WIRELESSTERMINAL[i].status = "已修改";
                } else if (apData_WIRELESSTERMINAL[i].status == "4") {
                    apData_WIRELESSTERMINAL[i].status = "已修复";
                }

                if (apData_WIRELESSTERMINAL[i].level == "1") {
                    apData_WIRELESSTERMINAL[i].level = "致命";
                } else if (apData_WIRELESSTERMINAL[i].level == "2") {
                    apData_WIRELESSTERMINAL[i].level = "严重";
                } else if (apData_WIRELESSTERMINAL[i].level == "3") {
                    apData_WIRELESSTERMINAL[i].level = "一般";
                }

                if (apData_WIRELESSTERMINAL[i].errortype == "1") {
                    apData_WIRELESSTERMINAL[i].errortype = "数组访问越界";
                } else if (apData_WIRELESSTERMINAL[i].errortype == "2") {
                    apData_WIRELESSTERMINAL[i].errortype = "指针访问越界";
                } else if (apData_WIRELESSTERMINAL[i].errortype == "3") {
                    apData_WIRELESSTERMINAL[i].errortype = "访问空指针";
                } else if (apData_WIRELESSTERMINAL[i].errortype == "4") {
                    apData_WIRELESSTERMINAL[i].errortype = "访问无效指针";
                } else if (apData_WIRELESSTERMINAL[i].errortype == "5") {
                    apData_WIRELESSTERMINAL[i].errortype = "除零错误";
                } else if (apData_WIRELESSTERMINAL[i].errortype == "6") {
                    apData_WIRELESSTERMINAL[i].errortype = "内存未初始化";
                } else if (apData_WIRELESSTERMINAL[i].errortype == "7") {
                    apData_WIRELESSTERMINAL[i].errortype = "数据计算溢出";
                } else if (apData_WIRELESSTERMINAL[i].errortype == "8") {
                    apData_WIRELESSTERMINAL[i].errortype = "多线程访问资源";
                } else if (apData_WIRELESSTERMINAL[i].errortype = "9") {
                    apData_WIRELESSTERMINAL[i].errortype = "重复释放内存";
                } else if (apData_WIRELESSTERMINAL[i].errortype = "10") {
                    apData_WIRELESSTERMINAL[i].errortype = "堆栈写坏";
                }
            }

            $("#wirelessterminal_mlist").mlist("head", opt_WIRELESSTERMINAL);
            $("#wirelessterminal_mlist").mlist("refresh", apData_WIRELESSTERMINAL);
        }
    }

    function initUserinfo(){
        $.get(MyConfig.path+'/maintenance/userinfo',function(data){

        var data2 = JSON.parse(data);
        var opt_head = {
            colNames: getRcText ("device_status"),
            showHeader: true,
            multiSelect: false,
            columnChange:false,
            colModel:[
                {name:"time",dataType:"string",width:80},
                {name:"sn",dataType:"string",width:100},
                {name:"user",dataType:"string",width:70},
                {name:"product",dataType:"string",width:80},
                {name:"status",dataType:"string",width:90},
                {name:"sysFileExists",dataType:"string",width:60}
            ],
            buttons:[
                {name:"edit",enable:false},
                {name:"delete",enable:false},
                {name:"add",enable:false},
                {name:"detail",enable:false},
                {name:"refresh",enable:false}
            ]
        };

            var userinfo_data = [];
            for( var i =0; i < data2.length;i++){
                userinfo_data[i] = {};
                userinfo_data[i].time = data2[i].time;
                userinfo_data[i].sn = data2[i].devsn;
                userinfo_data[i].user = data2[i].userName;
                userinfo_data[i].product = data2[i].product;
                userinfo_data[i].status = data2[i].internalversion;
                userinfo_data[i].sysFileExists = data2[i].sysFileExists;

                if( data2[i].newequipment == true){
                        userinfo_data[i].status = userinfo_data[i].status + "(新增设备)";
                }
                else
                {
                    if( data2[i].versionchange == true){
                        userinfo_data[i].status = userinfo_data[i].status + "(版本变更)";
                    }
                }

                if( userinfo_data[i].sysFileExists == false){

                    userinfo_data[i].sysFileExists = "否";

                }else if( (userinfo_data[i].sysFileExists == true) || (userinfo_data[i].sysFileExists == undefined))
                {
                    userinfo_data[i].sysFileExists = "是";
                }

            }

            $("#deviceStatus").mlist("head",opt_head);
            $("#deviceStatus").mlist("refresh",userinfo_data);

        })
    }

	function initForm()
	{
	   g_jMlist.on('click','.show-sum',onShowSums);
       $("#ap_info_mlist").on('click','.show-sum',onShowEmergencySums);
	}


    function onShowSums()
	{
	   var jThis = $(this);
       var sCore = jThis.attr("core");
	   var nType = jThis.attr("type");
	   var jScope = $("#Opendlg");
	   var oPara = {core: sCore || "",type:"dlg"};
	   var oScope = {scope :jScope,className:"modal-super"};
	   switch(nType)
	   {
	     case "0":
	     {
	        Utils.Base.openDlg("maintain.displayapplyhander",oPara,oScope);
		    break;
	     }
             case "1":
             {
                Utils.Base.openDlg("maintain.displayapplyhander",oPara,oScope);
                break;
             }
             case "2":
             {
                Utils.Base.openDlg("maintain.displayapplyhander",oPara,oScope);
                break;
             }
	        default:
		    break;
	   }
	   return false;
	} 
    
    function showSum(row,cell,value,columnDef,dataContext,type)
	{ 
	    if(!value)
		{
		  return "";
		} 
	    if((value == "") || (type == "text"))
	    {
		  return value;
		}
           switch(cell) {
            case 1:
            {
                return "<a class='show-sum' type='0'  core='" + dataContext["core"] +"'>" + dataContext["handler"] + "</a>";
                break;
            }
            case 5:
            {
                return "<a class='show-sum' type='1'  core='" + dataContext["core"] + "'>" + dataContext["level"] + "</a>";
                break;
            }
            case 6:{
                return "<a class='show-sum' type='2'  core='" + dataContext["core"] + "'>" + dataContext["errortype"] + "</a>";
                break;
            }
            default:
                break;
          }
	}

    function onShowEmergencySums(){
        var jThis = $(this);
        var sCore = jThis.attr("core");
        var nType = jThis.attr("type");
        var jScope = $("#Opendlg");
        var oPara = {core: sCore || "",type:"dlg"};
        var oScope = {scope :jScope,className:"modal-super"};
        switch(nType)
        {
            case "0":
            {
                Utils.Base.openDlg("maintain.displayapplyhander",oPara,oScope);
                break;
            }
            default:
             break;
        }
        return false;
    }


    function showEmergencySum(row,cell,value,columnDef,dataContext,type)
    {
        if(!value)
        {
            return "";
        }
        if((value == "") || (type == "text"))
        {
            return value;
        }
        switch(cell)
        {
            case 1:
            {
                return "<a class='show-sum' type='0'  core='" + dataContext["core"] + "'>" + dataContext["handler"] + "</a>";
                break;
            }
            default:
                break;
        }
    }

    function Legend(jPanel,opt)
    {
        var _jPanel = jPanel;
        var aList = opt.data || [],
            aColor = opt.color || [],
            nTotal = 0;

        _jPanel.addClass('leg-panel').empty();
        for(var i=0;i<aList.length;i++)
        {
            if( aList[i].name === '_padding' || aList[i].name === "") continue;
            nTotal += aList[i].value;
        }

        for(var i=0;i<aList.length;i++)
        {
            var oItem = aList[i], sHtml, nPercent;
            if( oItem.name == '_padding'  || oItem.name === "") continue;

            var nPercent = Math.round((oItem.value / nTotal) * 100) + "%";
            sHtml = '<div class="leg-row"><span class="leg-icon" style="background:'
                + aColor[i] + '"></span><span class="leg-title" style="color:#f5f5f5">'
                + oItem.name +  '</span><span class="leg-percent" style="float:right;color:#f5f5f5">'
                + nPercent+'</span></div>';
            _jPanel.append(sHtml);
        }
    }

    function show() {
        $("#button").click(function () {
            $("#drop").slideToggle(200);
        });
    }


    function initData()
    {
        initTotal();
        initEmergency();
        initModule();
        initSetpoint();
        initErrortype();
        initTendency();
        initVersion();
        initAll();
        initUserinfo();
    }


    function _init()
    {
        //  NC = Utils.Pages[MODULE_NC].NC;
        g_jForm = $("#UserSelects");
	    g_jMlist = $("#"+LIST_NAME);
        g_jMlistT = $("#"+LIST_NAMET);
        initData();
        initForm();
        show();
    }

    function _destroy()
    {
        g_aUserUp = null;
        g_aUserDown = null;
        g_jForm = null;
        g_aInterfaces = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Mlist","SList","Echart"],
        "utils":["Base"]
        //  "subModules":[MODULE_NC]
    });

})( jQuery );
