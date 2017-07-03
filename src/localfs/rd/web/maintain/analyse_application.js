(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".analyse_application";
    var g_SelectTime = 0;//0: 今天；1：七天;2：一月;3: 一年
    var g_UrlType = 0;
    var g_SelectType = 0;
    var g_Legend = 0;
    var g_type ="pie";
    var g_websiteType = "pie";
    var g_applicationData;
    var g_websiteData;

    /*获取所有的ACSN，解析成ACSNlist*/
    function getACSN(startTime,endTime,oTime){

        $.ajax({
            url:MyConfig.path + '/devmonitor/web/aclist',
            type:'get',
            dataType:'json',
            success:function(data){
                /*解析成ACSNList,所有需要查找的ACSN*/
                var ACSNList = new Array();
                if( data != null){
                    var acList = data.acList;
                }
                for(var i = 0;i < acList.length;i++){
                    ACSNList.push(acList[i].devSN);
                }
                /*获取最受欢迎的应用数据*/
                getWelcomeApplication(ACSNList,startTime,endTime);
                /*获取最受欢迎的网站数据*/
                getWelcomeWebsite(ACSNList,startTime,endTime);
                /*获取流量数据*/
                getFlow(ACSNList,startTime,endTime);
                /*获取流量折线图数据*/
                getFlowLine(ACSNList,startTime,endTime,oTime);
            },
            error:function(){
                Frame.Msg.error("数据获取失败,请联系客服");
            }
        })
    }

    /*获取当天最受欢迎的应用数据*/
    function getWelcomeApplication(ACSNList,startTime,endTime){

        $.ajax({
            url:MyConfig.path + '/ant/read_dpi_app',
            type:'post',
            dataType:'json',
            data:{
                Method:"WelComeApp",
                Param:{
                    family: "0",
                    direct: "0",
                    ACSNList:ACSNList,
                    StartTime: startTime,
                    EndTime: endTime
                }
            },
            success:function(data){

                /*解析当天最受欢迎的应用数据*/
                analyseApplicationData(data);
            },
            error:function(){

            }
        })
    }

    /*解析当天最受欢迎的应用饼状图数据*/
    function analyseApplicationData(data){
        data = data.message || [];

        var totalData = [];
        var applicationData = new Array();

        for(var i = 0; i < data.length;i++){
            totalData = totalData.concat(data[i]);
        }

        for(var k = 0; k < totalData.length; k++){
            if( (totalData[k].name == "") || (totalData[k].name == null)){
                continue;
            }
            var temp = {};
            temp.name = totalData[k].name;
            temp.value = totalData[k].value;
            applicationData.push(temp);
        }

        /*最受欢迎的应用数据要进行合并统计处理，处理完毕后给全局数组，显示更多列表*/
        applicationData = sortObject(applicationData);
        g_applicationData = applicationData;

        /*画最受欢迎的应用,应用访问统计饼状图,加上没有数据时的容错处理*/
        if(applicationData.length == 0){
            applicationData.push({name:"无",value:1});
            var panelData = [];
            drawApplication(applicationData,panelData);
            drawApplicationCount(applicationData,panelData,g_type);
        }
        else
        {
            drawApplication(applicationData,applicationData);
            drawApplicationCount(applicationData,applicationData,g_type);
        }
    }

    /*画当天最受欢迎的应用饼状图*/
    function drawApplication(applicationData,panelData){

        var option = {
            tooltip: {
                trigger: 'item',
                formatter: " {b}: {d}%"
            },
            calculable: false,
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['25%', '55%'],
                    itemStyle: {
                        normal: {
                            labelLine: {
                                show: false
                            },
                            label: {
                                position: "inner",
                                formatter: function (a) {
                                    return "";
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                formatter: "{b}\n{d}%"
                            }
                        }
                    },
                    data: applicationData
                }
            ]
        };
        var oTheme = {
            color: ['#0195D7', '#53B9E7', '#31ADB4', '#69C4C5', '#92C888', '#FFBB33', '#FF8800', '#CC324B']

        };
        var Jbody = $("#application_message");
        var Jopt = {
            data: panelData,
            color: oTheme.color
        };
        /*
         饼状图旁边的列表
         */
        createLegend(Jbody, Jopt);
        $("#application").echart("init", option, oTheme);
    }

    /*获取最受欢迎的网站数据*/
    function getWelcomeWebsite(ACSNList,startTime,endTime){

        $.ajax({
            url:MyConfig.path + '/ant/read_dpi_url',
            type:'post',
            dataType:'json',
            data:{
                Method:"WelComeUrl",
                Param:{
                    family: "0",
                    direct: "0",
                    ACSNList: ACSNList,
                    StartTime: startTime,
                    EndTime: endTime
                },
                Return: [
                    "name",
                    "value"
                ]
            },
            success:function(data){

                /*解析当天最受欢迎的网站饼状图*/
                analyseWebsiteData(data);
            },
            error:function(){

            }
        })
    }

    /*解析当天最受欢迎的网站数据*/
    function analyseWebsiteData(data){

        data = data.message || [];
        var totalData = [];

        for(var i=0; i < data.length ;i++){
            totalData = totalData.concat(data[i])
        }
        var websiteData = sortObject(totalData);
        g_websiteData = websiteData;

        /*最受欢迎的网站数据和网站访问统计饼状图，加上没有数据时的容错处理*/
        if( websiteData.length == 0){
            websiteData.push({name:"无",value:1});
            var panelData = [];
            drawWebsite(websiteData,panelData);
            drawWebsiteCount(websiteData,panelData,g_websiteType);
        }
        else
        {
            drawWebsite(websiteData,websiteData);
            drawWebsiteCount(websiteData,websiteData,g_websiteType);
        }
    }

    /*最受欢迎的网站*/
    function drawWebsite(websiteData,panelData){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: " {b}: {d}%"
            },
            calculable : false,
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : ['40%', '70%'],
                    center: ['25%', '55%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner",
                                formatter: function(a){
                                    return"";
                                }
                            }
                        },
                        emphasis : {
                            label : {
                                formatter : "{b}\n{d}%"
                            }
                        }
                    },
                    data:websiteData
                }
            ]
        };
        var oTheme={
            color : ['#0195D7','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B']

        };
        var Jbody = $("#website_message");
        var Jopt = {
            data:panelData,
            color:oTheme.color
        };

        /*
         图形旁边列表
        */
        createLegend(Jbody,Jopt);

        $("#website").echart("init",option,oTheme);
    }


    /*获取流量饼状图数据*/
    function getFlow(ACSNList,startTime,endTime){

        $.ajax({
            url:MyConfig.path + '/ant/read_dpi_app',
            type:'post',
            dataType:'json',
            data:{
                Method:"GetFlow",
                Param:{
                    family:"0",
                    direct:"0",
                    ACSNList:ACSNList,
                    StartTime:startTime,
                    EndTime:endTime
                },
                Return:[
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt"
                ]
            },
            success:function(data){

                /*解析流量饼状图数据*/
                analyseFlowData(data);
            },
            error:function(){

            }
        })
    }

    /*解析流量饼状图数据*/
    function analyseFlowData(data){

        if( (data == null) || (data == "")){
                return;
        }
        data = data.message || [];
        var totalUpFlow = 0;
        var totalDownFlow = 0;
        var totalDropFlow = 0;
        var nKb = 1024, nMb = nKb*1024, nGb = nMb*1024, nTb = nGb*1024;

        for( var i = 0; i < data.length ; i++){
            totalUpFlow = totalUpFlow + data[i].upflow.nFlowUpNum;
            totalDownFlow = totalDownFlow + data[i].downflow.nFlowDownNum;
            totalDropFlow = totalDropFlow + data[i].upflow.nDropUpFlowNum + data[i].downflow.nDropDownFlowNum;
        }
        var totalFlow = totalUpFlow + totalDownFlow;

        /*上行流量转换对应单位*/
        if( (0 <= totalUpFlow) && (totalUpFlow <nMb)){
            totalUpFlow = (totalUpFlow/nKb).toFixed(2);
            $("#upflow").html(totalUpFlow +"Kb");
        }
        else if( (nMb <= totalUpFlow) && (totalUpFlow <nGb))
        {
            totalUpFlow = (totalUpFlow/nMb).toFixed(2);
            $("#upflow").html(totalUpFlow + "Mb");
        }
        else if( (nGb<= totalUpFlow) && ( totalUpFlow <nTb))
        {
            totalUpFlow = (totalUpFlow/nGb).toFixed(2);
            $("#upflow").html(totalUpFlow + "Gb");
        }
        else if(nTb <= totalUpFlow)
        {
            totalUpFlow = (totalUpFlow/nTb).toFixed(2);
            $("#upflow").html(totalUpFlow + "Tb");
        }

        /*下行流量转换对应单位*/
        if( (0 <= totalDownFlow) && (totalDownFlow <nMb)){
            totalDownFlow = (totalDownFlow/nKb).toFixed(2);
            $("#downflow").html(totalDownFlow + "Kb");
        }
        else if( (nMb <= totalDownFlow) && (totalDownFlow <nGb))
        {
            totalDownFlow = (totalDownFlow/nMb).toFixed(2);
            $("#downflow").html(totalDownFlow + "Mb");
        }
        else if( (nGb<= totalDownFlow) && ( totalDownFlow <nTb))
        {
            totalDownFlow = (totalDownFlow/nGb).toFixed(2);
            $("#downflow").html(totalDownFlow + "Gb");
        }
        else if(nTb <= totalDownFlow)
        {
            totalDownFlow = (totalDownFlow/nTb).toFixed(2);
            $("#downflow").html(totalDownFlow + "Tb");
        }

        /*总流量转换单位*/
        if( (0 <= totalFlow) && (totalFlow <nMb)){
            totalFlow = (totalFlow/nKb).toFixed(2);
            $("#TotalFlow").html(totalFlow + "Kb");
        }
        else if( (nMb <= totalFlow) && (totalFlow <nGb))
        {
            totalFlow = (totalFlow/nMb).toFixed(2);
            $("#TotalFlow").html(totalFlow + "Mb");
        }
        else if( (nGb<= totalFlow) && ( totalFlow <nTb))
        {
            totalFlow = (totalFlow/nGb).toFixed(2);
            $("#TotalFlow").html(totalFlow + "Gb");
        }
        else if(nTb <= totalFlow)
        {
            totalFlow = (totalFlow/nTb).toFixed(2);
            $("#TotalFlow").html(totalFlow + "Tb");
        }

        /*总丢弃流量转换对应单位*/
        if( (0<= totalDropFlow) && (totalDropFlow< nMb))
        {
            totalDropFlow = (totalDropFlow/nKb).toFixed(2);
            $("#dropFlow").html(totalDropFlow + "Kb");
        }
        else if( (nMb <= totalDropFlow) && (totalDropFlow < nGb))
        {
            totalDropFlow = (totalDropFlow/nMb).toFixed(2);
            $("#dropFlow").html(totalDropFlow + "Mb");
        }
        else if( (nGb<= totalDropFlow) && (totalDropFlow <nTb))
        {
            totalDropFlow = (totalDropFlow/nGb).toFixed(2);
            $("#dropFlow").html(totalDropFlow + "Gb");
        }
        else if(nTb<= totalDropFlow)
        {
            totalDropFlow = (totalDropFlow/nTb).toFixed(2);
            $("#dropFlow").html(totalDropFlow + "Tb");
        }

        var flowData = [
            {name:"上行流量",value:totalUpFlow},
            {name:"下行流量",value:totalDownFlow},
            {name:"丢弃流量",value:totalDropFlow}
        ];

        drawFlow(flowData);
    }


    /*流量(饼图)*/
    function drawFlow(data){

        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} {b}: {d}%"
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : 80,
                    center: ['50%', '55%'],
                    data:data
                }
            ]
        };
        var oTheme={
            color: ['#0096d6','#31A9DC','#7BC7E7']
        };
        $("#flow").echart("init",option,oTheme);
    }


    /*获取流量折线图数据*/
    function getFlowLine(ACSNList,startTime,endTime,oTime){

        var nHour = new Date().getHours();

        $.ajax({
            url:MyConfig.path + '/ant/read_dpi_app',
            type:'post',
            dataType:'json',
            data:{
                Method:"GetFlowChart",
                requestType:"getTotalFlowChart",
                Time:nHour,
                Param:{
                    family:"0",
                    direct:"0",
                    ACSNList:ACSNList,
                    StartTime:startTime,
                    EndTime:endTime
                }
            },
            success:function(data){

                /*解析流量折线图数据*/
                analyseFlowLine(data,oTime);
            },
            error:function(){

            }
        })
    }


    /*解析流量折线图数据*/
    function analyseFlowLine(data,oTime){

        data = data.message || [];
        var totalUpflow = new Array();
        var totalDownflow = new Array();
        var totalDropflow = new Array();
        if( data.length != 0){
            var time = data[0].time || [];
        }
        else
        {
            var time = [];
        }
        var xTime = new Array();

        for( var i = 0 ; i < data.length ; i++){
            totalUpflow.push(data[i].upFlow);
            totalDownflow.push(data[i].downFlow);
            totalDropflow.push(data[i].dropFlow);
        }

        /*所有的流量数组要进行合并统计处理*/
        totalUpflow = mergeFlowData(totalUpflow);
        totalDownflow = mergeFlowData(totalDownflow);
        totalDropflow = mergeFlowData(totalDropflow);


        switch(oTime){//0:当天, 1:一周 , 2:一月, 3:一年
            case "0":{
                for(var k = 0 ; k < time.length ; k++){
                    var hour = new Date(time[k]).getHours();
                    if( hour < 10 ){
                        hour = "0" + hour;
                    }
                    xTime.push(hour +":00");
                }
		break;
            }
            case "1":{
                for(var i = 0 ; i < time.length ;i++){
                    var currentMonth = new Date(time[i]).getMonth() +1;
                    var currentDay = new Date(time[i]).getDate();
                    if( currentMonth < 10){
                        currentMonth = "0" + currentMonth;
                    }

                    if( currentDay < 10){
                        currentDay = "0" + currentDay;
                    }
                    xTime.push(currentMonth + "-" + currentDay);
                }
		break;
            }
            case "2":{

                //TODO 修改
                for(var k = 0 ; k < time.length ; k++){
                    var hour = new Date(time[k]).getHours();
                    if( hour < 10 ){
                        hour = "0" + hour;
                    }
                    xTime.push(hour +":00");
                }
		break;
            }
            case "3":{

                //TODO 修改
                for(var k = 0 ; k < time.length ; k++){
                    var hour = new Date(time[k]).getHours();
                    if( hour < 10 ){
                        hour = "0" + hour;
                    }
                    xTime.push(hour +":00");
                }
		break;
            }
        }

        /*流量折线图*/
        drawFlowLine(totalUpflow,totalDownflow,totalDropflow,xTime);
    }


    /*流量（折线图）*/
    function drawFlowLine(totalUpflow,totalDownflow,totalDropflow,xTime){

        var option = {
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
                data:["上行流量","下行流量","丢弃流量"],
                textStyle:{
                    color:"gray"
                }
            },
            dataZoom:{
                show: true,
                realtime: true,
                start: 60,
                end: 80,
                height:15
            },
            grid: {
                x:70,
                y:80,
                x2:30,
                y2:70, //45
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:false,
                    name:"时间",
                    nameTextStyle:{color:"gray"},
                    axisLabel: {
                        rotate:45
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E6E6FA', width: 1}
                    },
                    axisTick :{
                        show:false
                    },
                    data:xTime
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name:"流量(B)",
                    nameTextStyle:{color:"gray"},
                    splitLine:false,
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#47495d', width: 2}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E6E6FA', width: 1}
                    }
                }
            ],
            series: [
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "上行流量",
                    data:totalUpflow
                },
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: "下行流量",
                    data: totalDownflow
                },
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name:"丢弃流量",
                    data: totalDropflow
                }
            ]
        };
        var oTheme = {
            color: ['#0096d6','#31A9DC','#62BCE2']
        };
        $("#flow_line").echart("init",option,oTheme);
    }


    /*应用访问统计*/
    function drawApplicationCount(applicationData,panelData,type){

        if( type == "pie") {
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                calculable: false,
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['35%', '55%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position: "inner",
                                    formatter: function (a) {
                                        return "";
                                    }
                                }
                            },
                            emphasis: {
                                label: {
                                    formatter: "{b}\n{d}%"
                                }
                            }
                        },
                        data:applicationData
                    }
                ]
            };
            var oTheme = {
                color: ['#0195D7', '#53B9E7', '#31ADB4', '#69C4C5', '#92C888', '#FFBB33', '#FF8800', '#CC324B']

            };
            var Jbody = $("#application_count_message");
            var Jopt = {
                data: panelData,
                color: oTheme.color
            };

            /*
             图形旁边列表
             */
            createLegend(Jbody, Jopt);
            $("#application_count_pie").echart("init", option, oTheme);
        }
        else
        {
            /*将数据解析成折线图识别的格式*/
            var name = new Array();
            var value = new Array();

            for(var i in data){
                name.push(data[i].name);
                value.push(data[i].value);
            }

            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : name
                    }
                ],
                yAxis : [
                    {
                        name:'次数',
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'line',
                        stack: '总量',
                        areaStyle: {normal: {}},
                        data:value
                    }
                ]
            };
            $("#application_count_line").echart("init",option);
        }
    }


    /*网站访问统计*/
    function drawWebsiteCount(websiteData,panelData,g_websiteType){

        if( g_websiteType == "pie") {

            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                calculable: false,
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['35%', '55%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position: "inner",
                                    formatter: function (a) {
                                        return "";
                                    }
                                }
                            },
                            emphasis: {
                                label: {
                                    formatter: "{b}\n{d}%"
                                }
                            }
                        },
                        data: websiteData
                    }
                ]
            };
            var oTheme = {
                color: ['#0195D7', '#53B9E7', '#31ADB4', '#69C4C5', '#92C888', '#FFBB33', '#FF8800', '#CC324B']

            };
            var Jbody = $("#website_count_message");
            var Jopt = {
                data: panelData,
                color: oTheme.color
            };

            /*图形旁边列表模块*/
            createLegend(Jbody, Jopt);
            $("#website_count").echart("init", option,oTheme);
        }
        else
        {
            //TODO 后续折线图处理

        }
    }

    function initData(){

        /*获取默认（当天）的时间戳*/
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() + 1;
        var currentDay = new Date().getDate();
        var startTime = new Date(currentYear +" "+currentMonth +" "+currentDay +" "+"00:00:00").getTime();
        startTime = Math.round(startTime/1000);
        var endTime = new Date().getTime();
        endTime = Math.round(endTime/1000);

        /*获取所有ACSN*/
        getACSN(startTime,endTime,"0");
    }

    function _init(){

        //当前的日期显示到日历中
        $("#setTime").html(new Date().getDate());

        initData();
        initForm();
    }


    function initForm(){

        /*
         应用访问统计模块
         */
        /*以饼图显示或者折线图显示*/
        $("#changeDraw").on("change",function(){
            var value = $("#changeDraw").val();/*var value = $(this).attr("value")*/
            switch(value)
            {
                case "pie":
                {
                    g_Legend = 0;
                    g_type = "pie";
                    $("#application_count_line").addClass('hide');
                    $("#application_count_message").removeClass('hide');
                    $("#application_count_pie").removeClass('hide');
                    //drawApplicationCount(g_type);
                    break;
                    //TODO 后续优化，不能以隐藏显示的方式显示出来，要重新画图
                }
                case "line":
                {
                    g_Legend = 1;
                    g_type = "line";
                    $("#application_count_line").removeClass('hide');
                    $("#application_count_message").addClass('hide');
                    $("#application_count_pie").addClass('hide');
                    //drawApplicationCount(g_type);
                    break;
                }
                default:
                    break;
            }
        });

        /*选择不同的时间去显示（今天，七天，一月，一年）*/
        $("#changeTime").on("change",function(){
            var value = $(this).attr("value");
            //TODO 后续处理，到底是以什么样的形式去向后台获取对应的数据（v3里面是以对应的时间戳去获取数据的）
            switch(value)
            {
                case "today":
                {
                    g_SelectTime = 0;
                    break;
                }
                default:
                    break;
            }
            Frame.Msg.alert("正在开发中");
        });

        /*选择不同的类型url去显示*/
        $("#changeUrlType").on("change",function(){
            //TODO 后续处理
            Frame.Msg.alert("正在开发中");
        });

        /*选择人次或者时长去显示*/
        $("#changeCount").on("change",function(){
            //TODO 后续处理
            Frame.Msg.alert("正在开发中");
        });


        /*
        网站访问统计模块
        */
        $("#changeTime_website").on("change",function(){
            //TODO 后续处理
            Frame.Msg.alert("正在开发中");
        });

        $("#changeUrlType_website").on("change",function(){
            //TODO 后续处理
            Frame.Msg.alert("正在开发中");
        });

        $("#changeCount_website").on("change",function(){
            //TODO 后续处理
            Frame.Msg.alert("正在开发中");
        });

        $("#changeDraw_website").on("change",function(){
            //TODO 后续处理
            Frame.Msg.alert("正在开发中");
        });


        //TODO 该需求有问题，后续进行bug修改
        /*饼状图中更多按钮操作(应用)*/
        $("#applicationMore").on("click",function(){
            var oPara = g_applicationData;
            Utils.Base.openDlg("maintain.detail",oPara,{className:'modal-super'});
        });

        /*饼状图中更多按钮操作(网站)*/
        $("#websiteMore").on("click",function(){
            var oPara = g_websiteData;
            Utils.Base.openDlg("maintain.detail",oPara,{className:'modal-super'});
        });


        /*选择日期弹出框*/
        $("#setTime").click(function(){
            $("#selectTime").slideToggle(0.5);
        });

        /*获取当前选择是哪天（今天，一周，一年，一月，其他）*/
        $("#today,#week,#month,#year,#other").click(function(){
            var oData = $("input[name='SelectTime']");
            var oTime;
            for( var i = 0 ; i < oData.length ; i++){
                if( $(oData[i])[0].checked){
                    oTime = $(oData[i]).val();
                }
            }
            //0:当天 1:一周 2:一月 3:一年 4:其他
            switch(oTime){
                case "0":{
                    $("#date").html("(今天)");
                    initTodayData(oTime);
                    break;
                }
                case "1":{
                    $("#date").html("(一周)");
                    initWeekData(oTime);
                    break;
                }
                case "2":{
                    $("#date").html("(一月)");
                    initMonthData(oTime);
                    break;
                }
                case "3":{
                    $("#date").html("(一年)");
                    initYearData(oTime);
                    break;
                }
                case "4":{
                    $("#date").html("(其他)");
                    Frame.Msg.alert("正在开发中....");
                    break;
                }
                default:
                    break;
            }
        })
    }

    /*获取当天数据，渲染到页面上*/
    function initTodayData(oTime){

        /*获取默认（当天）的时间戳*/
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() + 1;
        var currentDay = new Date().getDate();
        var startTime = new Date(currentYear +" "+currentMonth +" "+currentDay +" "+"00:00:00").getTime();
        startTime = Math.round(startTime/1000);
        var endTime = new Date().getTime();
        endTime = Math.round(endTime/1000);

        getACSN(startTime,endTime,oTime);
    }

    /*获取一周数据，渲染到页面上*/
    function initWeekData(oTime){
        var startTime = new Date().setDate(new Date().getDate() - 6);
        startTime = Math.round(startTime/1000);
        var endTime = new Date().getTime();
        endTime = Math.round(endTime/1000);

        getACSN(startTime,endTime,oTime);
    }

    /*获取一月数据，渲染到页面上*/
    function initMonthData(oTime){
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth();
        var currentDay = new Date().getDate();
        var startTime = new Date(currentYear + " " + currentMonth + " " + currentDay + " " + "00:00:00").getTime();
        startTime = Math.round(startTime/1000);
        var endTime = new Date().getTime();
        endTime = Math.round(endTime/1000);

        getACSN(startTime,endTime,oTime);
    }

    /*获取一年数据，渲染到页面上*/
    function initYearData(oTime){

       var currentYear = new Date().getFullYear() -1;
       var currentMonth = new Date().getMonth() +1;
       var currentDay = new Date().getDate();
       var startTime = new Date(currentYear + " " + currentMonth + " " + currentDay + " " + "00:00:00").getTime();
       startTime = Math.round(startTime/1000);
       var endTime = new Date().getTime();
       endTime = Math.round(endTime/1000);

        getACSN(startTime,endTime,oTime);
    }


    /*创建列表*/
    function createLegend(Jbody,Jopt){
        var jPanel = Jbody.addClass('leg-panel');
        var nItem = Jopt.data;
        var nColor = Jopt.color;
        var nTotal = 0;
        var nPercent;

        if( nItem.length == 0){
            return;
        }

        /*根据value值对数组中的对象进行排序处理，只显示列表中占比较多的前8个*/
        nItem.sort(compare("value"));

        function compare(prob){

            return function(obj1,obj2){
                var val1 = obj1[prob];
                var val2 = obj2[prob];
                if( val1 < val2){
                    return 1;
                }else if( val1 > val2){
                    return -1;
                }else{
                    return 0;
                }
            }
        }

        for( var i = 0; i < nItem.length ; i++){
            if( (nItem[i].value == "") || (nItem[i].value == null)){
                continue;
            }
            else
            {
                nTotal = nTotal + nItem[i].value;
            }
        }

        //先清空列表，防止列表无限的添加下去（因为用的是append方法，添加到被选元素结尾之处，会无限的添加下去）
        jPanel.empty();

        for( var j = 0; j < nItem.length; j++){
            nPercent = ((nItem[j].value/nTotal)*100).toFixed(2) +"%";
            var nHtml = '<div class="leg-row">' +
                    '<span class="leg-icon" style="background-color:'+nColor[j]+'"></span>' +
                    '<span class="leg-title" style="color:#E1E8EC">'+nItem[j].name+'</span>'+
                    '<span class="leg-percent" style="float:right;color:#E1E8EC">'+nPercent+'</span>'+
                '</div>';
            jPanel.append(nHtml);
            if( j == 7){
                return;
            }
        }
    }


    /*数组里面的对象进行排序处理，然后进行统计*/
    function sortObject(data){

        if( (data.length == 0) || (data.length == 1)){
            return data;
        }

        function compare(prob){
            return function(obj1,obj2){
                var val1 = obj1[prob];
                var val2 = obj2[prob];
                if( val1 < val2){
                    return -1;
                }else if( val1 > val2)
                {
                    return 1;
                }else{
                    return 0
                }
            }
        }
        data.sort(compare("name"));

        var probName = data[0].name;
        var probValue = data[0].value;
        var lastData = [];
        var y = 0;
        for(var i=1; i < data.length; i++){
            if( probName == data[i].name){
                probValue = probValue + data[i].value;
                if( i == data.length - 1){
                    lastData[y] = {};
                    lastData[y].name = probName;
                    lastData[y].value = probValue;
                }
            }
            else
            {
                lastData[y] = {};
                lastData[y].name = probName;
                lastData[y].value = probValue;
                ++y;
                probName = data[i].name;
                probValue = data[i].value;

                if( i == data.length - 1){
                    lastData[y] = {};
                    lastData[y].name = probName;
                    lastData[y].value = probValue;
                }
            }
        }
        return lastData;
    }

    /*对二维数组里面的数组进行合并统计处理*/
    function mergeFlowData(data){

        if(data.length == 0){
            return data;
        }

        if( data.length == 1){
            return data[0];
        }

        var mergeData = new Array();
        var k = 0;
        for(var j = 0; j < data[0].length ; j++){
            mergeData.push(0);
        }

        for(var i = 0 ; i < data.length ; i++){
            mergeData[k] += data[i][k];
            if( i == data.length -1){
                i = -1;
                ++k;
                if( k == data[0].length){
                    break;
                }
            }
        }
        return mergeData;
    }

    function _destroy(){

    }

    /*创建饼状图旁边列表*/

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart"],
        "utils":["Base"]
    })

})(jQuery);