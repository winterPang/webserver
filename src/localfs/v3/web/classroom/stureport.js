/**
 * Created by Administrator on 2016/7/5.
 */
;(function ($) {
    var MODULE_NAME = "classroom.stureport";
    var g_today= new Date();
    var g_oStuList ={};


    // function returnPage(){
    //     //返回至首页面
    //     Utils.Base.redirect({np:'classroom.scholastic'});
    //     return false;
    // }

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("c_stureport_rc", sRcName);
    }

    function downloadImg(jId)
    {
        //下载报告
        var mycanvas = document.getElementById(jId);
        var ctx = canvas.getContext("2d");
        var image = mycanvas.toDataURL("")
    }

    //获取学生
    function getStudent() {
        return Utils.Request.sendRequest({
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getStudent',
                Param: {
                    devSn: FrameInfo.ACSN,
                }
            }),
            onFailed:function(){
                //var yearTime = (new Date(parseInt(g_oPara.years))).getFullYear();
                //$("#stuName").html(g_oPara.studentName);
                //$("#stuSex").html(g_oPara.sex);
                //$("#handMac").html(g_oPara.birthday);
                //$("#gradeId").html(g_oPara.gradeId);
                //$("#classId").html(g_oPara.classId+"班");
                //$("#stuNum").html(g_oPara.studentId);
                //$("#years").html("("+yearTime+"级)");
                //var oResult = {
                //    "sequenceNumInGrade":190,
                //    "sequenceNumInClass":6
                //};
                //$("#grade-range").html(aResult.sequenceNumInGrade);
                //$("#class-range").html(aResult.sequenceNumInClass);
            }
        });
    }

    //获取班级年级排名
    function getRange(oParam)
    {
        //{Result:{"sequenceNumInGrade","sequenceNumInClass"},retCode}
        /*
            years
            classId
            wristbandId
            gradeType
            baseGrade
            gradeConf
            startTime
            endTime
         */
        var oPara = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oPara,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data:JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    Method: "getOneStudentActivetySta",
                    Param: oPara
                }),
            onFailed:function(){
                debugger;
                var oResult = {
                    "sequenceNumInGrade":190,
                    "sequenceNumInClass":6
                };
                $("#grade-range").html(oResult.sequenceNumInGrade);
                $("#class-range").html(oResult.sequenceNumInClass);
            }
        };
        return Utils.Request.sendRequest(option);
    }

    //获取举手次数
    function getHandUp(oParam)
    {
        /*
         wristbandId
         startTime
         endTime
         */
        //{Result:["handupCnt","time"],retCode}
        var oPara = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oPara,oParam);
        var option = {
                type: 'POST',
                url: MyConfig.path + '/smartcampusread',
                contentType: 'application/json',
                dataType: 'json',
                data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    Method:"getOneStudentHandupSta",
                    Param:oPara}),
                onFailed:function(){
                    var xData = [1469341274316,1469343074316,1469344874316,1469346674316,1469348474316,1469350274316,
                        1469352074316,1469353874316,1469355674316,1469357474316,1469359274316,1469361074316,
                        1469362874316,1469364674316,1469366474316,1469368274316,1469370074316,1469371874316];
                    var yHandUpData = [0,0,0,0,0,0,0,0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,20,20,20,20,20];
                    activeEchart("举手次数",yHandUpData,xData,'day');
                    debugger;
                }
        };
        return Utils.Request.sendRequest(option);
    }

    //获取心率
    function getHeartRate(oParam)
    {
        /*
         wristbandId
         startTime
         endTime
         */
        //{Result:["heartbeatCnt","time"],retCode}
        var oPara = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oPara,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getOneStudentOnsiteSta",
                Param:oPara}),
            onFailed:function(){
                var xData = [1469341274316,1469343074316,1469344874316,1469346674316,1469348474316,1469350274316,
                    1469352074316,1469353874316,1469355674316,1469357474316,1469359274316,1469361074316,
                    1469362874316,1469364674316,1469366474316,1469368274316,1469370074316,1469371874316];
                var yHeartData = [70,73,72,78,76,80,81,83,78,79,87,89,90,92,93,94,88,84,83,82,80,65,64];
                initHeartEchart(xData,"心率",yHeartData,'day');
                debugger;
            }
        };
        return Utils.Request.sendRequest(option);
    }
    //获取步数
    function getPrintCnt(oParam)
    {
        /*
         wristbandId
         startTime
         endTime
         */
        //{Result:["stepCnt","time"],retCode}
        var oPara = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oPara,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getOneStudentOnsiteSta",
                Param:oPara}),
            onFailed:function(){
                var xData = [1469341274316,1469343074316,1469344874316,1469346674316,1469348474316,1469350274316,
                    1469352074316,1469353874316,1469355674316,1469357474316,1469359274316,1469361074316,
                    1469362874316,1469364674316,1469366474316,1469368274316,1469370074316,1469371874316];
                var yStepData = [1700,1700,1700,1700,1700,2600,3600,4300,4440,4490,5520,6650,6670,7370,7370,10370,12370,13270,15800,24000,28000,30000];
                initPrintEchart(xData,"步数",yStepData,'day');
            }
        };
        return Utils.Request.sendRequest(option);
    }

    //获取体脂比
    function getBMI(oParam)
    {
        /*
         wristbandId
         startTime
         endTime
         */
        //{Result:["avoirdupoisSta","time"],retCode}
        var oPara = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oPara,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getOneStudentAvoirdupoisSta",
                Param:oPara}),
            onFailed:function(){
                var xData = [1469341274316,1469343074316,1469344874316,1469346674316,1469348474316,1469350274316,
                    1469352074316,1469353874316,1469355674316,1469357474316,1469359274316,1469361074316,
                    1469362874316,1469364674316,1469366474316,1469368274316,1469370074316,1469371874316];
                var yHealthData = [20,21.1,22.1,21.2,18,17.4,20.6,22.7,20,18.5,21.9,20.5,18,21,22,17,18,21,17.8,19,23,21,22,24.5,21.5];
                initHealthEchart(xData,"体质比",yHealthData,"day");
                debugger;
            }
        };
        return Utils.Request.sendRequest(option);
    }

    //初始化步数echart   xData时间轴   yData 数值轴  aType 步数
    function initPrintEchart(xData,aType,yData,method)
    {
        xData.sort(function(a,b){
            return a-b;
        });
        var aXData = [];
        function reverString(method,data){
            switch (method) {
                case "hour":
                {
                     return data.toTimeString().slice(0,5);

                }
                case "day": case "week":case "month": case "year":
                {
                    return (data.toLocaleDateString()+'\n' +data.toTimeString().slice(0,5));

                }

                default:
                    return;
            }
        }
        for(var i=0;i<xData.length;i++)
        {
            var nData = new Date(xData[i]);
            aXData.push(reverString(method,nData));
        }
        var option = {
            width:1200,
            height:320,
            grid: {
                show:false,
                x: 60,
                y: 50,
                x2:35,
                y2:50,
                borderColor: '#ccc'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                },
                formatter : function (params) {
                    var sTooltip = "时间:"+params[0].name+"<br/>"
                        + params[0].seriesName+":"+params[0].value+"步";
                    return sTooltip;
                }
            },
            xAxis : [
                {
                    type : 'category',
                    splitNumber:10,
                    name:getRcText("AXIS").split(',')[0],
                    nameTextStyle:{color:"gray"},
                    splitLine:true,
                    boundaryGap: false,
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    //axisLabel: {
                    //    interval:"auto",
                    //    rotate:0
                    //},
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#F6F7F8', width: 1}
                    },
                    data:aXData
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:getRcText("AXIS").split(',')[3],
                    nameTextStyle:{color:"gray"},

                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#9da9b8', fontSize: "12px", width: 2 }
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
                            //areaStyle: {
                            //    color:"rgba(0,150,214,0.2)",
                            //    type: 'default'
                            //},
                            //lineStyle:{
                            //    width:1
                            //}
                        }
                    },
                    smooth:true,
                    symbol:'circle',
                    symbolSize:0,
                    name:aType,
                    data: yData
                }
            ]
        }
        $("#printStep").echart("init", option);

    }

    ////初始化步数echart   xData时间轴   yData 数值轴  aType 体脂比
    function initHealthEchart(xData,aType,yData,method)
    {
        xData.sort(function(a,b){
            return a-b;
        });
        var aXData = [];
        function reverString(method,data){
            switch (method) {
                case "hour":
                {
                    return data.toTimeString().slice(0,5);

                }
                case "day": case "week": case "month": case "year":
                {
                     return (data.toLocaleDateString()+'\n' +data.toTimeString().slice(0,5));

                }

                default:
                    return;
            }
        }
        for(var i=0;i<xData.length;i++)
        {
            var nData = new Date(xData[i]);
            aXData.push(reverString(method,nData));
        }
        var option = {
            width:1200,
            height:320,
            grid: {
                show:false,
                x: 60,
                y: 50,
                x2:35,
                y2:50,
                borderColor: '#ccc'

            },
            legend: {
                //borderWidth:2,
                data:[
                    '偏瘦: <=18.5',
                    '正常范围：18.5~23.9',
                    '偏胖范围：24~27.9',
                    '超重范围：>=28'
                ]
            },
            tooltip : {
                trigger: 'axis',
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                },
                formatter : function (params) {
                    var sTooltip = "时间:"+params[0].name+"<br/>"
                        + params[0].seriesName+":"+params[0].value+"kg/cm^2";
                    return sTooltip;
                }
            },
            xAxis : [
                {
                    type : 'category',
                    splitNumber:10,
                    name:getRcText("AXIS").split(',')[0],
                    nameTextStyle:{color:"F6F7F8"},
                    splitLine:true,
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    boundaryGap : false,
                    //axisLabel: {
                    //    interval:"auto",
                    //    rotate:0
                    //},
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#F6F7F8', width: 1}
                    },
                    data:aXData
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:getRcText("AXIS").split(',')[2],
                    nameTextStyle:{color:"gray"},

                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#9da9b8', fontSize: "12px", width: 2 }
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
                            color:"#0195d7",
                            lineStyle:{
                                color:'#0195d7'
                            }
                        }
                    },
                    smooth:true,
                    symbol:'circle',
                    symbolSize:0,
                    name:aType,
                    data: yData,
                    //markLine : {
                    //    smooth:true,
                    //    precision:4,
                    //    symbol:'',
                    //    itemStyle:{
                    //       lineStyle:{
                    //           color:'gray',
                    //           type:'solid',
                    //           width:1
                    //       },
                    //    },
                    //    data : [
                    //        [
                    //            {
                    //                // 当xAxis为类目轴时，数值1会被理解为类目轴的index，通过xAxis:-1|MAXNUMBER可以让线到达grid边缘
                    //                name: '正常范围：18.5~23.9',
                    //                value:18.5,
                    //                xAxis: xData[0],
                    //                yAxis:18.5,
                    //                itemStyle:{
                    //                    normal: {
                    //                        //borderWidth:5,
                    //                        color: '#f2bc98'
                    //                    }
                    //                }
                    //            },
                    //            {
                    //                // 当xAxis为类目轴时，字符串'周三'会被理解为与类目轴的文本进行匹配
                    //                name: '',
                    //                xAxis: xData[xData.length-1],
                    //                yAxis: 18.5
                    //            },
                    //        ],
                    //        [
                    //            {
                    //                // 当xAxis为类目轴时，数值1会被理解为类目轴的index，通过xAxis:-1|MAXNUMBER可以让线到达grid边缘
                    //                name: '偏胖范围：24~27.9',
                    //                value:24,
                    //                xAxis: xData[0],
                    //                yAxis:24,
                    //                itemStyle:{
                    //                   normal:{
                    //                       borderWidth:1,
                    //                       color:'#4ec1b2'
                    //                   }
                    //                }
                    //            },
                    //            {
                    //                // 当xAxis为类目轴时，字符串'周三'会被理解为与类目轴的文本进行匹配
                    //                name: '',
                    //                xAxis: xData[xData.length-1],
                    //                yAxis: 24
                    //            },
                    //        ],
                    //        [
                    //            {
                    //                // 当xAxis为类目轴时，数值1会被理解为类目轴的index，通过xAxis:-1|MAXNUMBER可以让线到达grid边缘
                    //                name: '超重范围：>=28',
                    //                value:28,
                    //                xAxis: xData[0],
                    //                yAxis:28,
                    //                itemStyle:{
                    //                    normal: {
                    //                        borderWidth:1,
                    //                        color: '#fe808b',
                    //
                    //                    }
                    //                }
                    //            },
                    //            {
                    //                // 当xAxis为类目轴时，字符串'周三'会被理解为与类目轴的文本进行匹配
                    //                name: '',
                    //                xAxis: xData[xData.length-1],
                    //                yAxis: 28
                    //            },
                    //        ]
                    //    ]
                    //}
                }
            ]
        }

        $("#healthData").echart("init", option);

    }

    ////初始化步数echart   xData时间轴   yData 数值轴  aType 举手次数
    function activeEchart(aType,yData,xData,method)
    {
        xData.sort(function(a,b){
            return a-b;
        });
        var aXData = [];
        function reverString(method,data){
            switch (method) {
                case "hour":
            {
                return data.toTimeString().slice(0,5);

            }
                case "day": case "week":case "month": case "year":
            {
                return (data.toLocaleDateString()+'\n' +data.toTimeString().slice(0,5));

            }

                default:
                    return;
            }
        }
        for(var i=0;i<xData.length;i++)
        {
            var nData = new Date(xData[i]);
            aXData.push(reverString(method,nData));
        }
        var option = {
            //width:1000,//加年级班级排名的
            width:1200,
            height:320,
            grid: {
                show:false,
                x: 60,
                y: 50,
                x2:35,
                y2:50,
                borderColor: '#ccc'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                },
                formatter : function (params) {
                    var sTooltip = "时间:"+params[0].name+"<br/>"
                        + params[0].seriesName+":"+params[0].value+"次";
                    return sTooltip;
                }
            },
            xAxis : [
                {
                    type : 'category',
                    splitNumber:10,
                    name:getRcText("AXIS").split(',')[0],
                    nameTextStyle:{color:"gray"},
                    splitLine:true,
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    boundaryGap : false,
                    axisLabel: {
                        interval:"auto",
                        rotate:0
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#F6F7F8', width: 1}
                    },
                    data:aXData
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:getRcText("AXIS").split(',')[1],
                    nameTextStyle:{color:"gray"},

                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#9da9b8', fontSize: "12px", width: 2 }
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
                            //areaStyle: {
                            //    color:"rgba(0,150,214,0.2)",
                            //    type: 'default'
                            //},
                            //lineStyle:{
                            //    width:1
                            //}
                        }
                    },
                    smooth:true,
                    symbol:'circle',
                    symbolSize:0,
                    name:aType,
                    data: yData
                }
            ]
        }

        $("#activeData").echart("init", option);

    }
    ////初始化心率echart   xData时间轴   yData 数值轴  aType 心率
    function initHeartEchart(xData,aType,yData,method)
    {

        xData.sort(function(a,b){
            return a-b;
        });
        var aXData = [];
        function reverString(method,data){
            switch (method) {
                case "hour":
                {
                    return data.toTimeString().slice(0,5);

                }
                case "day": case "week":case "month": case "year":
                {
                    return (data.toLocaleDateString()+'\n' +data.toTimeString().slice(0,5));

                }

                default:
                    return;
            }
        }
        for(var i=0;i<xData.length;i++)
        {
            var nData = new Date(xData[i]);
            aXData.push(reverString(method,nData));
        }
        var option = {
            width:1200,
            height:320,
            grid: {
                show:false,
                x: 60,
                y: 50,
                x2:35,
                y2:50,
                borderColor: '#ccc'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                },
                formatter : function (params) {
                    var sTooltip = "时间:"+params[0].name+"<br/>"
                                + params[0].seriesName+":"+params[0].value+"次每分钟";
                    return sTooltip;
                }
            },
            xAxis : [
                {
                    type : 'category',
                    splitNumber:10,
                    name:getRcText("AXIS").split(',')[0],
                    nameTextStyle:{color:"gray"},
                    splitLine:true,
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    boundaryGap : false,
                    //axisLabel: {
                    //    interval:"auto",
                    //    rotate:0
                    //},
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#F6F7F8', width: 1}
                    },
                    data:aXData
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:getRcText("AXIS").split(',')[4],
                    nameTextStyle:{color:"gray"},
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#9da9b8', fontSize: "12px", width: 2 }
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
                            //areaStyle: {
                            //    color:"rgba(0,150,214,0.2)",
                            //    type: 'default'
                            //},
                            //lineStyle:{
                            //    width:1
                            //}
                        }
                    },
                    smooth:true,
                    symbol:'circle',
                    symbolSize:0,
                    name:aType,
                    data: yData
                }
            ]
        }
        $("#heartRateData").echart("init", option);
        //setTimeout(function(){$("#HistoryCount").echart("init", option, oTheme);},500);
    }

    //获取基本信息
    function getBaseInfo(aStudentInfo,g_oPara,yearTime) {
        $("#stuName").html(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName);
        $("#stuSex").html(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].sex);
        $("#handMac").html(g_oPara.birthday);
        $("#gradeId").html(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade);
        $("#classId").html(g_oPara.classId + "班");
        $("#stuNum").html(g_oPara.studentId);
        $("#years").html("(" + yearTime + "级)");
    }

    //获取排名
    function getRangeFun(oParam){
        getRange(oParam).done(function(aData){
            //{Result:{"sequenceNumInGrade","sequenceNumInClass"},retCode}
            if(aData.retCode != 0)
            {
                console.log("get range info failed");
                return;
            }
            var oResult = aData.result?aData.result:{};
            $("#grade-range").html(oResult.sequenceNumInGrade||0);
            $("#class-range").html(oResult.sequenceNumInClass||0);

        });
    }

    //获取举手次数
    function getHandUpFun(oHand){
        getHandUp(oHand).done(function(aData){
            //{Result:["handupCnt","time"],retCode
            if(aData.retCode != 0)
            {
                console.log("get handupCnt failed");
                return;
            }
            var yHandUpData = [];
            var xData = [];
            var aResult = aData.result?aData.result:[];
            $.each(aResult,function(index,item){
                xData.push(item.time);
                yHandUpData.push(item.handupCnt);
            });
            activeEchart("举手次数",yHandUpData,xData,"day");
        });
    }

    //获取心率
    function getHeartRateFun(oHeart){
        getHeartRate(oHeart).done(function(aData){
            //{Result:["heartbeatCnt","time"],retCode}
            if(aData.retCode != 0)
            {
                console.log("get handupCnt failed");
                return;
            }
            var yHeartData = [];
            var xData = [];
            var aResult = aData.result?aData.result:[];
            $.each(aResult,function(index,item){
                xData.push(item.time);
                yHeartData.push(item.heartbeatCnt);
            });
            initHeartEchart(xData,"心率",yHeartData,"day");
        });
    }

    //获取步数
    function getPrintCntFun(oParam) {
        getPrintCnt(oParam).done(function (aData) {
            //{Result:["stepCnt","time"],retCode}
            if (aData.retCode != 0) {
                console.log("get handupCnt failed");
                return;
            }
            var yStepData = [];
            var xData = [];
            var aResult = aData.result ? aData.result : [];
            $.each(aResult, function (index, item) {
                xData.push(item.time);
                yStepData.push(item.step);
            });
            initPrintEchart(xData, "步数", yStepData, "day");
        });
    }

    //获取体质比
    function getBMIFun(oParam) {
        getBMI(oParam).done(function (aData) {
            //{Result:["avoirdupoisSta","time"],retCode}
            if (aData.retCode != 0) {
                console.log("get handupCnt failed");
                var xData = [1469341274316, 1469343074316, 1469344874316, 1469346674316, 1469348474316, 1469350274316,
                    1469352074316, 1469353874316, 1469355674316, 1469357474316, 1469359274316, 1469361074316,
                    1469362874316, 1469364674316, 1469366474316, 1469368274316, 1469370074316, 1469371874316];
                var yHealthData = [20, 21.1, 22.1, 21.2, 18, 17.4, 20.6, 22.7, 20, 18.5, 21.9, 20.5, 18, 21, 22, 17, 18, 21, 17.8, 19, 23, 21, 22, 24.5, 21.5];
                initHealthEchart(xData, "体质比", yHealthData, "day");
                return;
            }
            var yHealthData = [];
            var xData = [];
            var aResult = aData.result ? aData.result : [];
            $.each(aResult, function (index, item) {
                xData.push(item.time);
                var nAvoird = item.avoirdupoisSta;
                if(nAvoird != Math.floor(nAvoird)){
                    nAvoird = nAvoird.toFixed(2);
                }
                yHealthData.push(nAvoird);
            });
            initHealthEchart(xData, "体质比", yHealthData, "day");
        });
    }

    function  initData(g_oPara)
    {
        //假数据
        //var xData = ["01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
        //var yHandUpData = [0,0,0,0,0,0,0,0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,20,20,20,20,20];
        //var yStepData = [1700,1700,1700,1700,1700,2600,3600,4300,4440,4490,5520,6650,6670,7370,7370,10370,12370,13270,15800,24000,28000,30000];
        //var yHeartData = [70,73,72,78,76,80,81,83,78,79,87,89,90,92,93,94,88,84,83,82,80,65,64];
        //var yHealthData = [20,21.1,22.1,21.2,18,17.4,20.6,22.7,20,18.5,21.9,20.5,18,21,22,17,18,21,17.8,19,23,21,22,24.5,21.5];
        //var aType1=getRcText("AXIS").split(',')[1];
        //var aType2=getRcText("AXIS").split(',')[2];
        //var aType3=getRcText("AXIS").split(',')[3];
        //var aType4=getRcText("AXIS").split(',')[4];
        //initHeartEchart(xData,"心率",yHeartData);
        //activeEchart("举手次数",yHandUpData,xData);
        //initPrintEchart(xData,"步数",yStepData);
        //initHealthEchart(xData,"体质比",yHealthData);

        //真数据
        var oTime = {
            startTime:(new Date()).getTime()-3600000*24,
            endTime:(new Date()).getTime()
        }
        //真数据
        //var yearTime = (new Date(parseInt(g_oPara.years))).getFullYear();
        //$("#stuName").html(g_oPara.studentName);
        //$("#stuSex").html(g_oPara.sex);
        //$("#handMac").html(g_oPara.birthday);
        //$("#gradeId").html(g_oPara.gradeId);
        //$("#classId").html(g_oPara.classId+"班");
        //$("#stuNum").html(g_oPara.studentId);
        //$("#years").html("("+yearTime+"级)");
        //getActiveData(oTime,"day");
        //getHeartRateInfo(oTime,"day");
        //getPrint(oTime,"day");
        //getBMIData(oTime,"day");

        //获取举手次数
        getStudent().done(function (data) {
            var stuList = data.result.data;
            //保存学生信息
            g_oStuList = {};
            var aStudentInfo = [],
                oStudentInfo = {};

            // 这里 分类处理班级和 学生信息
            var oStuList = {},
                aGradeList = [],
                aClassList = [];

            data.result.data.forEach(function (stu, index) {
                //保存学生信息
                g_oStuList[stu.grade]=g_oStuList[stu.grade]||{};
                g_oStuList[stu.grade][stu.classId]=g_oStuList[stu.grade][stu.classId]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.grade][stu.classId][stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName].years = stu.years;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentId = stu.studentId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].wristbandId = stu.wristbandId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].gradeType = stu.gradeType;
                g_oStuList[stu.grade][stu.classId][stu.studentName].baseGrade = stu.baseGrade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].classId = stu.classId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].grade = stu.grade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentName = stu.studentName;

                //查询years  studentId
                aStudentInfo[stu.years]=aStudentInfo[stu.years]||{};
                aStudentInfo[stu.years][stu.classId]=aStudentInfo[stu.years][stu.classId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId]=aStudentInfo[stu.years][stu.classId][stu.studentId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId].studentName = stu.studentName;
                aStudentInfo[stu.years][stu.classId][stu.studentId].grade = stu.grade;
                aStudentInfo[stu.years][stu.classId][stu.studentId].years = stu.years;
                aStudentInfo[stu.years][stu.classId][stu.studentId].wristbandId = stu.wristbandId;
                aStudentInfo[stu.years][stu.classId][stu.studentId].sex = stu.sex;

            });

            var yearTime = (new Date(parseInt(g_oPara.years))).getFullYear();

            if(g_oStuList
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)]){

                var studentInfo = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)];

            }else{
                var studentInfo = {};
            }
            //获取基本信息
            getBaseInfo(aStudentInfo,g_oPara,yearTime);
            var oParam = {};
            oParam.years = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].years||undefined;
            oParam.classId = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].classId||undefined;
            oParam.wristbandId = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].wristbandId||undefined;
            oParam.gradeType = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].gradeType||undefined;
            oParam.baseGrade = (g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].baseGrade
                             ||g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].baseGrade==0)
                                    ?g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].baseGrade:undefined;
            oParam.startTime = oTime.startTime;
            oParam.endTime = oTime.endTime;
            oParam.method = "day";
            oParam.studentId = g_oPara.studentId;
            //获取排名
            //getRangeFun(oParam);
            var oHand = {};
            oHand.wristbandId = oParam.wristbandId;
            oHand.method = "day";
            $.extend(oHand,oTime);
            //获取举手次数
            getHandUpFun(oHand);
            //获取心率
            var oHeart = {};
            oHeart.wristbandId = oParam.wristbandId;
            oHeart.method = "day";
            $.extend(oHeart,oTime);
            getHeartRateFun(oHeart)
            //获取步数
            getPrintCntFun(oParam);
            //获取体质比
            getBMIFun(oParam);
        });

    }

    //获取举手次数
    function getActiveData(oTime,sMethod)
    {
        //假数据
        //var oResult = {
        //    "sequenceNumInGrade":190,
        //    "sequenceNumInClass":6
        //};
        //$("#grade-range").html(oResult.sequenceNumInGrade);
        //$("#class-range").html(oResult.sequenceNumInClass);

        //获取举手次数
        getStudent().done(function (data) {
            var stuList = data.result.data;

            var aStudentInfo = [],
                oStudentInfo = {};

            //保存学生信息
            g_oStuList = {};
            // 这里 分类处理班级和 学生信息
            var oStuList = {},
                aGradeList = [],
                aClassList = [];

            data.result.data.forEach(function (stu, index) {
                //保存学生信息
                g_oStuList[stu.grade]=g_oStuList[stu.grade]||{};
                g_oStuList[stu.grade][stu.classId]=g_oStuList[stu.grade][stu.classId]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.grade][stu.classId][stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName].years = stu.years;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentId = stu.studentId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].wristbandId = stu.wristbandId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].gradeType = stu.gradeType;
                g_oStuList[stu.grade][stu.classId][stu.studentName].baseGrade = stu.baseGrade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].classId = stu.classId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].grade = stu.grade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentName = stu.studentName;

                //查询years  studentId
                aStudentInfo[stu.years]=aStudentInfo[stu.years]||{};
                aStudentInfo[stu.years][stu.classId]=aStudentInfo[stu.years][stu.classId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId]=aStudentInfo[stu.years][stu.classId][stu.studentId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId].studentName = stu.studentName;
                aStudentInfo[stu.years][stu.classId][stu.studentId].grade = stu.grade;
                aStudentInfo[stu.years][stu.classId][stu.studentId].years = stu.years;
                aStudentInfo[stu.years][stu.classId][stu.studentId].wristbandId = stu.wristbandId;
                aStudentInfo[stu.years][stu.classId][stu.studentId].sex = stu.sex;
            });

            if(g_oStuList
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)]){

                var studentInfo = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)];

            }else{
                var studentInfo = {};
            }

            //var yearTime = (new Date(parseInt(g_oPara.years))).getFullYear();
            //$("#stuName").html(g_oPara.studentName);
            //$("#stuSex").html(g_oPara.sex);
            //$("#handMac").html(g_oPara.birthday);
            //$("#gradeId").html(g_oPara.gradeId);
            //$("#classId").html(g_oPara.classId+"班");
            //$("#stuNum").html(g_oPara.studentId);
            //$("#years").html("("+yearTime+"级)");

            var oParam = {};
            oParam.years = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].years||undefined;
            oParam.classId = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].classId||undefined;
            oParam.wristbandId = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].wristbandId||undefined;
            oParam.gradeType = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].gradeType||undefined;
            oParam.baseGrade = (g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].baseGrade
            ||g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].baseGrade==0)
                ?g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].baseGrade:undefined;
            oParam.startTime = oTime.startTime;
            oParam.endTime = oTime.endTime;
            oParam.method = sMethod;

            //获取排名
            //getRangeFun(oParam)

            //获取举手次数
            var oHand = {};
            oHand.wristbandId = oParam.wristbandId;
            oHand.method = sMethod;
            $.extend(oHand,oTime);
            getHandUpFun(oHand);
            //getHandUp(oHand).done(function(aData){
            //    //{Result:["handupCnt","time"],retCode
            //    if(aData.retCode != 0)
            //    {
            //        console.log("get handupCnt failed");
            //        return;
            //    }
            //    var yHandUpData = [];
            //    var xData = [];
            //    var aResult = aData.result?aData.result:[];
            //    $.each(aResult,function(index,item){
            //        xData.push(item.time);
            //        yHandUpData.push(item.handupCnt);
            //    });
            //    activeEchart("举手次数",yHandUpData,xData,sMethod);
            //});

        });
    }

    function getHeartRateInfo(oTime,sMethod)
    {
        //获取心率
        getStudent().done(function (data) {
            var stuList = data.result.data;
            var aStudentInfo = [],
                oStudentInfo = {};
            //保存学生信息
            g_oStuList = {};
            // 这里 分类处理班级和 学生信息
            var oStuList = {},
                aGradeList = [],
                aClassList = [];

            data.result.data.forEach(function (stu, index) {
                //保存学生信息
                g_oStuList[stu.grade]=g_oStuList[stu.grade]||{};
                g_oStuList[stu.grade][stu.classId]=g_oStuList[stu.grade][stu.classId]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.grade][stu.classId][stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName].years = stu.years;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentId = stu.studentId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].wristbandId = stu.wristbandId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].gradeType = stu.gradeType;
                g_oStuList[stu.grade][stu.classId][stu.studentName].baseGrade = stu.baseGrade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].classId = stu.classId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].grade = stu.grade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentName = stu.studentName;

                //查询years  studentId
                aStudentInfo[stu.years]=aStudentInfo[stu.years]||{};
                aStudentInfo[stu.years][stu.classId]=aStudentInfo[stu.years][stu.classId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId]=aStudentInfo[stu.years][stu.classId][stu.studentId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId].studentName = stu.studentName;
                aStudentInfo[stu.years][stu.classId][stu.studentId].grade = stu.grade;
                aStudentInfo[stu.years][stu.classId][stu.studentId].years = stu.years;
                aStudentInfo[stu.years][stu.classId][stu.studentId].wristbandId = stu.wristbandId;
                aStudentInfo[stu.years][stu.classId][stu.studentId].sex = stu.sex;
            })

            if(g_oStuList
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)]){

                var studentInfo = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)];

            }else{
                var studentInfo = {};
            }

            var oParam = {};
            oParam.wristbandId = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].wristbandId||undefined;
            oParam.method = sMethod;

            //var oParam = {};
            //oParam.wristbandId = g_oStuList[g_oPara.gradeId][g_oPara.classId][g_oPara.studentName].wristbandId||undefined;
            //oParam.method = sMethod;

            var oHeart = {};
            oHeart.wristbandId = oParam.wristbandId;
            oHeart.method = sMethod;
            $.extend(oHeart,oTime);
            getHeartRateFun(oHeart);
            //getHeartRate(oHeart).done(function(aData){
            //    //{Result:["heartbeatCnt","time"],retCode}
            //    if(aData.retCode != 0)
            //    {
            //        console.log("get handupCnt failed");
            //        return;
            //    }
            //    var yHeartData = [];
            //    var xData = [];
            //    var aResult = aData.result?aData.result:[];
            //    $.each(aResult,function(index,item){
            //        xData.push(item.time);
            //        yHeartData.push(item.heartbeatCnt);
            //    });
            //    initHeartEchart(xData,"心率",yHeartData,sMethod);
            //});

        });

    }

    function getPrint(oTime,sMethod)
    {
        //获取步数
        getStudent().done(function (data) {
            var stuList = data.result.data;
            var aStudentInfo = [],
                oStudentInfo = {};
            //保存学生信息
            g_oStuList = {};
            // 这里 分类处理班级和 学生信息
            var oStuList = {},
                aGradeList = [],
                aClassList = [];

            data.result.data.forEach(function (stu, index) {
                //保存学生信息
                g_oStuList[stu.grade]=g_oStuList[stu.grade]||{};
                g_oStuList[stu.grade][stu.classId]=g_oStuList[stu.grade][stu.classId]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.grade][stu.classId][stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName].years = stu.years;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentId = stu.studentId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].wristbandId = stu.wristbandId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].gradeType = stu.gradeType;
                g_oStuList[stu.grade][stu.classId][stu.studentName].baseGrade = stu.baseGrade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].classId = stu.classId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].grade = stu.grade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentName = stu.studentName;

                //查询years  studentId
                aStudentInfo[stu.years]=aStudentInfo[stu.years]||{};
                aStudentInfo[stu.years][stu.classId]=aStudentInfo[stu.years][stu.classId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId]=aStudentInfo[stu.years][stu.classId][stu.studentId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId].studentName = stu.studentName;
                aStudentInfo[stu.years][stu.classId][stu.studentId].grade = stu.grade;
                aStudentInfo[stu.years][stu.classId][stu.studentId].years = stu.years;
                aStudentInfo[stu.years][stu.classId][stu.studentId].wristbandId = stu.wristbandId;
                aStudentInfo[stu.years][stu.classId][stu.studentId].sex = stu.sex;
            })

            if(g_oStuList
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)]){

                var studentInfo = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)];

            }else{
                var studentInfo = {};
            }

            var oParam = {};
            oParam.wristbandId = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].wristbandId||undefined;
            oParam.method = sMethod;

            //var oParam = {};
            //oParam.wristbandId = g_oStuList[g_oPara.gradeId][g_oPara.classId][g_oPara.studentName].wristbandId||undefined;
            //oParam.method = sMethod;
            $.extend(oParam,oTime);
            getPrintCntFun(oParam)
            //getPrintCnt(oParam).done(function(aData){
            //    //{Result:["stepCnt","time"],retCode}
            //    if(aData.retCode != 0)
            //    {
            //        console.log("get handupCnt failed");
            //        return;
            //    }
            //    var yStepData = [];
            //    var xData = [];
            //    var aResult = aData.result?aData.result:[];
            //    $.each(aResult,function(index,item){
            //        xData.push(item.time);
            //        yStepData.push(item.step);
            //    });
            //    initPrintEchart(xData,"步数",yStepData,sMethod);
            //});

        });

    }

    function getBMIData(oTime,sMethod)
    {
        //获取体脂比
        getStudent().done(function (data) {
            var stuList = data.result.data;
            var aStudentInfo = [],
                oStudentInfo = {};
            //保存学生信息
            g_oStuList = {};
            // 这里 分类处理班级和 学生信息
            var oStuList = {},
                aGradeList = [],
                aClassList = [];

            data.result.data.forEach(function (stu, index) {
                //保存学生信息
                g_oStuList[stu.grade]=g_oStuList[stu.grade]||{};
                g_oStuList[stu.grade][stu.classId]=g_oStuList[stu.grade][stu.classId]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.grade][stu.classId][stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName]=g_oStuList[stu.studentName]||{};
                g_oStuList[stu.grade][stu.classId][stu.studentName].years = stu.years;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentId = stu.studentId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].wristbandId = stu.wristbandId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].gradeType = stu.gradeType;
                g_oStuList[stu.grade][stu.classId][stu.studentName].baseGrade = stu.baseGrade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].classId = stu.classId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].grade = stu.grade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentName = stu.studentName;

                //查询years  studentId
                aStudentInfo[stu.years]=aStudentInfo[stu.years]||{};
                aStudentInfo[stu.years][stu.classId]=aStudentInfo[stu.years][stu.classId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId]=aStudentInfo[stu.years][stu.classId][stu.studentId]||{};
                aStudentInfo[stu.years][stu.classId][stu.studentId].studentName = stu.studentName;
                aStudentInfo[stu.years][stu.classId][stu.studentId].grade = stu.grade;
                aStudentInfo[stu.years][stu.classId][stu.studentId].years = stu.years;
                aStudentInfo[stu.years][stu.classId][stu.studentId].wristbandId = stu.wristbandId;
                aStudentInfo[stu.years][stu.classId][stu.studentId].sex = stu.sex;
            })

            if(g_oStuList
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId]
                &&g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)]){

                var studentInfo = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)];

            }else{
                var studentInfo = {};
            }

            var oParam = {};
            oParam.wristbandId = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].wristbandId||undefined;
            oParam.method = sMethod;
            oParam.years = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].years||undefined;
            oParam.classId = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].classId||undefined;
            oParam.wristbandId = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].wristbandId||undefined;
            oParam.gradeType = g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].gradeType||undefined;
            oParam.baseGrade = (g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].baseGrade
            ||g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].baseGrade==0)
                ?g_oStuList[(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].grade)][g_oPara.classId][(aStudentInfo[g_oPara.years][g_oPara.classId][g_oPara.studentId].studentName)].baseGrade:undefined;
            oParam.startTime = oTime.startTime;
            oParam.endTime = oTime.endTime;
            oParam.studentId = g_oPara.studentId;
            //var oParam = {};
            //oParam.wristbandId = g_oStuList[g_oPara.gradeId][g_oPara.classId][g_oPara.studentName].wristbandId||undefined;
            //oParam.method = sMethod;
            $.extend(oParam,oTime);
            getBMIFun(oParam);
            //getBMI(oParam).done(function(aData){
            //    //{Result:["avoirdupoisSta","time"],retCode}
            //    if(aData.retCode != 0)
            //    {
            //        console.log("get handupCnt failed");
            //        var xData = [460111213122,460111013122,460111213121,460111213022,460111013122,461110213122,461111213122,460121213122,460211213122,460311213122];
            //        var yHealthData = [20,21.1,22.1,21.2,18,17.4,20.6,22.7,20,18.5,21.9,20.5,18,21,22,17,18,21,17.8,19,23,21,22,24.5,21.5];
            //        initHealthEchart(xData,"体质比",yHealthData,"day");
            //        return;
            //    }
            //    var yHealthData = [];
            //    var xData = [];
            //    var aResult = aData.result?aData.result:[];
            //    $.each(aResult,function(index,item){
            //        xData.push(item.time);
            //        yHealthData.push(item.avoirdupoisSta);
            //    });
            //    initHealthEchart(xData,"体质比",yHealthData,sMethod);
            //});

        });

    }

    function initForm()
    {
         function setBreadContent(paraArr){
            
            if(paraArr[0].text != ""){
                $("#bread_1").css("display",'inline');
                $("#bread_1 a").attr("href",paraArr[0].href);
                $("#bread_1 a").text(paraArr[0].text);
            }else{
                $("#bread_1").css("display",'none');
            }
            
            if(paraArr[1].text != ""){
                $("#bread_2").css("display",'inline');
                $("#bread_2 a").attr("href",paraArr[1].href);
                $("#bread_2 a").text(paraArr[1].text);
            }else{
                $("#bread_2").css("display",'none');
            }
            
            if(paraArr[2].text != ""){
                $("#bread_active").css("display",'inline');
                $("#bread_active").text(paraArr[2].text);
            }else{
                $("#bread_active").css("display",'none');
            }
        }
        setBreadContent([{text:'',href:''},
                        {text:'学生管理',href:'#C_SManage'},
                        {text:'个人报告',href:''}]);
               
        var oTime = {};
        $("a#handupdays").on("click",function(e){
            $("#handup-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24;
            oTime.endTime = (new Date()).getTime();
            getActiveData(oTime,"day");
        });

        $("a#handupweeks").on("click",function(e){
            $("#handup-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*7;
            oTime.endTime = (new Date()).getTime();
            getActiveData(oTime,"week");
        });

        $("a#handupmounth").on("click",function(e){
            $("#handup-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*30;
            oTime.endTime = (new Date()).getTime();
            getActiveData(oTime,"month");
        });

        $("a#handupyears").on("click",function(e){
            $("#handup-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*365;
            oTime.endTime = (new Date()).getTime();
            getActiveData(oTime,"year");
        });

        $("a#hearthours").on("click",function(e){
            $("#heart-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000;
            oTime.endTime = (new Date()).getTime();
            getHeartRateInfo(oTime,"hour");
        });

        $("a#heartdays").on("click",function(e){
            $("#heart-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24;
            oTime.endTime = (new Date()).getTime();
            getHeartRateInfo(oTime,"day");
        });

        $("a#heartweeks").on("click",function(e){
            $("#heart-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*7;
            oTime.endTime = (new Date()).getTime();
            getHeartRateInfo(oTime,"week");
        });

        $("a#heartmounth").on("click",function(e){
            $("#heart-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*30;
            oTime.endTime = (new Date()).getTime();
            getHeartRateInfo(oTime,"month");
        });

        $("a#heartyears").on("click",function(e){
            $("#heart-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*365;
            oTime.endTime = (new Date()).getTime();
            getHeartRateInfo(oTime,"year");
        });

        $("a#stepdays").on("click",function(e){
            $("#step-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24;
            oTime.endTime = (new Date()).getTime();
            getPrint(oTime,"day");
        });

        $("a#stepweeks").on("click",function(e){
            $("#step-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*7;
            oTime.endTime = (new Date()).getTime();
            getPrint(oTime,"week");
        });

        $("a#stepmounth").on("click",function(e){
            $("#step-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*30;
            oTime.endTime = (new Date()).getTime();
            getPrint(oTime,"month");
        });

        $("a#stepyears").on("click",function(e){
            $("#step-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*365;
            oTime.endTime = (new Date()).getTime();
            getPrint(oTime,"year");
        });

        $("a#healthdays").on("click",function(e){
            $("#bmi-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24;
            oTime.endTime = (new Date()).getTime();
            getBMIData(oTime,"day");
        });

        $("a#healthweeks").on("click",function(e){
            $("#bmi-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*7;
            oTime.endTime = (new Date()).getTime();
            getBMIData(oTime,"week");
        });

        $("a#healthmounth").on("click",function(e){
            $("#bmi-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*30;
            oTime.endTime = (new Date()).getTime();
            getBMIData(oTime,"month");
        });

        $("a#healthyears").on("click",function(e){
            $("#bmi-date.station-change .xb-link").removeClass("active");
            $(this).addClass("active");
            oTime.startTime = (new Date()).getTime()-3600000*24*365;
            oTime.endTime = (new Date()).getTime();
            getBMIData(oTime,"year");
        });

    }

    function initAddListen()
    {
        // $("#return").on('click', returnPage);
        //打印设置样式
        //var cssStyle = [
        //    "../../web/frame/libs/css/bootstrap.css",
        //    "../../web/frame/libs/css/bootstrap-responsive.css",
        //    "../../web/frame/css/other.css",
        //    "../../web/frame/css/frame.css",
        //    "../../web/frame/css/widget.css",
        //    "../../web/frame/css/plugin.css",
        //    "../../web/frame/css/private.css",
        //    "../../web/frame/css/businessac.css",
        //    "../../web/frame/libs/css/font.css",
        //    "../beibei/css/beibei.css"
        //];
        //$("#down-load").on('click',function(e){
        //    var bdhtml = window.document.body.innerHTML;
        //    sprnstr = "<!--startprint-->";
        //    eprnstr = "<!--endprint-->";
        //    prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
        //    prnhtml=  prnhtml.substring(0,prnhtml.indexOf(eprnstr));
        //    window.document.body.innerHTML=prnhtml;
        //    window.print();
        //    window.document.body.innerHTML=bdhtml;
        //});

    }

    function _init()
    {
        g_oPara = Utils.Base.parseUrlPara();
        //$(".daterangepicker.dropdown-menu.opensright").attr("style","left: 974.81px;");
        initAddListen();
        initForm();
        initData(g_oPara);
    };

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_today =null;
        g_startTime=null;
        g_endTime=null;
        g_day = null;
        g_oStuList = null
        //g_result        = {AP:{}, Client:{}, Attack:{},Statistics:{}};
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        //$("#client_details").off();
        //$(".box-footer img", "#wips_monitor").off();
        //$(".#WT1,.#WT2,.#WT3,.#WT4,.#WT5", "#wips_monitor").off();
        //$("#daterange", "#wips_monitor").off();
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Form","Echart","SingleSelect","DateTime","DateRange","SList","Switch",'Cocos'],
        "utils":["Request","Base","Msg","Timer",'Device']
    });
})( jQuery );

