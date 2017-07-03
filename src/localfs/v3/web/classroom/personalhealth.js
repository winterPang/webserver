;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".personalhealth";
    var Timer_Interval = null;
    var g_oPara = null;
    var g_splitNumber = 10;
    var g_yStr = "";
    var g_num = 10000;
    var g_expStr = "步数（单位：步）";
    var g_class = null;
    var g_year = null;
    var g_baseGrade = null;
    var g_studentId = null;
    var g_studentName = null;
    var g_timer = null;
    
    function getRcText(sRcName) {
        return Utils.Base.getRcString("healthMessage_rc", sRcName);
    }
    
    function test() {
        var oFilt = null;
        // {
        //                 studentIdWeak: 0
        //             }
        initStudentData(oFilt);
    }
    $("#frash").live("click",function () {
        $("#weight").text("");
        $("#stature").text("");
        $("#stepnumber").text("");
        $("#HeartrateDate").text("");
        var oFilt = null;
        // {
        //                 studentIdWeak: 0
        //             }
        initStudentData(oFilt);
    })
    
    function http_getStepHistInfo(cBack) {
        var oParam = {
            devSn:FrameInfo.ACSN,
            method: 'aMonth',
            studentId:g_studentId
        };
        
        function onSuccess(aData)
        {
            if(aData.retCode == 0)
            {
                cBack(aData.result);
               
            }else{
                cBack("");
            }
        }

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            timeout:60000,
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getOneStudentHistoryStep",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed:function(textStatus,jqXHR,error)
            {
                cBack("");
            }
        }
        Utils.Request.sendRequest(option);
    }
    
    function drawHistoryHealthMessage(aInData, aTime, type, g_range,promptname,Datastr) {
        // var splitNumber;
        var arr = [];
        // aInData.forEach(function (item) {
        //     arr.push(item.StudentPresentRatio);
        // });
        var option = {
            height: 250,
            width: 550,
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#4ec1b2',
                        width: 2,
                        type: 'solid'
                    }
                },
                // formatter: '{b}<br/>{a} : {c}',
                // function (y, x, z, w) {
                //     var stringName = y[0].seriesName;
                //     var aa = y[0].series.data[parseInt(x.split(":")[1])] * 100;
                //     var val = aa.toFixed(2) + "%";
                //     var time = (new Date(y[0].name)).getFullYear() + "/" + ((new Date(y[0].name)).getMonth() + 1) + "/" + ((new Date(y[0].name)).getDate()) + "&nbsp;&nbsp;" + getDoubleStr((new Date(y[0].name)).getHours()) + ":" + getDoubleStr((new Date(y[0].name)).getMinutes()) + ":" + getDoubleStr((new Date(y[0].name)).getSeconds());
                //     var string = time + '<br/>' + stringName + ":" + val;
                //     return string;
                // }
            },
            legend: {
            orient: "horizontal",
            y: 0,
            x: "center",
            data: [type]//图例文字
            },
            grid: {
                x: 40, y: 30,
                borderColor: '#FF0000'
            },
            calculable: false,
            xAxis:[
                {
                    name:promptname.xname,
                    type: 'category',
                    //splitNumber: splitNumber,
                    boundaryGap: false,
                    splitLine: true,
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#80878C', width: 2 }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#80878C', width: 2 },
                        // formatter: function (data) {
                        //     return getDoubleStr((new Date(data)).getHours()) + ":" + getDoubleStr((new Date(data)).getMinutes()) + ":" + getDoubleStr((new Date(data)).getSeconds());
                        // }
                    },
                    axisTick: {
                        show: false
                    },
                    data: aTime
                    //data: ["00:12:33","01:12:33","02:12:33","03:12:33","04:12:33","05:12:33", "06:32:33", "07:52:33", "08:12:33", "09:32:33", "10:52:33", "11:12:33", "12:32:33", "13:52:33", "14:12:33"]
                }
            ],//
            yAxis: [
                {
                    name:promptname.yname,
                    type: 'value',
                    min:g_range.min,
                    max:g_range.max,
                    //scale:true,
                    //splitNumber: g_splitNumber,//纵轴的格数 默认0到1。
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#80878C', width: 2 },
                        // formatter: function (nNum) {
                        //     return nNum ;//g_num + g_yStr;
                        // }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#80878C', width: 2 }
                    }
                }
            ],
            series: [
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: 'default' } } },
                    name: Datastr,
                    data: aInData
                    // data: arr//纵轴
                }//多条数据 在次添加
            ]
        };
        
        var oTheme = {
            color: ["rgba(174,226,219,1)", "rgba(120,206,195,1)", "rgba(255,196,197,1)", "rgba(255,156,158,1)"],
        };
        $("#HistoryHealthMessage").echart("init", option, oTheme);
    }
    
    function getDoubleStr(num) {
        return num >= 10 ? num : "0" + num;
    }
    
    function getStudentPresentRatio(oTime) {
       
        switch (oTime.method) {
            case 'STEPNUM':
                {
                    http_getStepHistInfo(function(result){
                        var promptname = {yname:"步", xname:"号"};
                        var aResult = [];
                        var aTime = [];
                        if(result != ""){
                            for(var i in result){
                                aTime.push(i);
                                aResult.push(result[i]);
                            }
                        }else{
                            var end = (new Date()).getTime() - 60000 * 60 * 24 * 7;
                            aResult = [2900, 3500, 4000, 4500, 1900, 1600, 1780];
                            for(var i=0; i<7; i++){
                                aTime.push((new Date(end).getDate()));
                                end += 60000 * 60 * 24;
                            }
                        }
                        
                        g_expStr = "步数（单位：步）";
                        var str = "步数";
                        drawHistoryHealthMessage(aResult, aTime, g_expStr, {min:0,max:6000},promptname,str);
                    });
                    
                    // var promptname = {yname:"步", xname:"号"};
                    // var end = (new Date()).getTime() - 60000 * 60 * 24 * 7;
                    
                    // for(var i=0; i<7; i++){
                    //     aTime.push((new Date(end).getDate()));
                    //     end += 60000 * 60 * 24;
                    // }
                
                    // aResult = [2900, 3500, 4000, 4500, 1900, 1600, 1780];
                    // g_expStr = "步数（单位：步）";
                    // var str = "步数";
                    // drawHistoryHealthMessage(aResult, aTime, g_expStr, {min:0,max:6000},promptname,str);
                    break;
                }
            case 'CALORIE'://卡路里
                {
                    
                    var aResult = [];
                    var aTime = [];
                    var promptname = {yname:"焦", xname:"日"};
                    var end = (new Date()).getTime() - 60000 * 60 * 24 * 7;
                    
                    for(var i=0; i<7; i++){
                        aTime.push((new Date(end).getDate()));
                        end += 60000 * 60 * 24;
                    }
                
                    aResult = [1888, 1965, 1901, 2500, 1900,1600,1780];
                    //aTime = ['11','12','1','2','3','4','5','6','7','8','9','10'];
                    
                    g_expStr = "卡路里（单位：焦）";
                    var str = "卡路里";
                    drawHistoryHealthMessage(aResult, aTime, g_expStr, {min:1000,max:5000},promptname,str);
                    break;
                }
            case 'STATURE'://身高
                {
                    var aResult = [];
                    var aTime = [];
                    var promptname = {yname:"CM", xname:"月"};
                    aResult = [150.5, 151.2, 152.8, 153.1, 153.5,153.9,153.9,154.1,154.1,154.4, 155.5, 155.6];
                    aTime = ['11','12','1','2','3','4','5','6','7','8','9','10'];
                    
                    // g_yStr = "米";
                    g_expStr = "身高（单位:CM）";
                    var str = "身高";
                    drawHistoryHealthMessage(aResult, aTime, g_expStr, {min:140,max:200},promptname,str);
                    break;
                }
            case 'WEIGHT'://体重
                {
                    var aResult = [];
                    var aTime = [];
                    var promptname = {yname:"kg", xname:"月"};
                    aResult = ['40.1', '43.1', '45.8', '48.6', '45.3','45.5','46.8','47.0','48.5','48.0','48.5','48.0'];
                    aTime = ['11','12','1','2','3','4','5','6','7','8','9','10'];
                    
                    // g_yStr = "米";
                    g_expStr = "体重（单位：kg）";
                    var str = "体重";
                    drawHistoryHealthMessage(aResult, aTime, g_expStr, {min:30,max:80},promptname,str);
                    break;
                }
            
            default:
                break;
        }
        
        return;
    }
    
    function getStudentHealthReport(oPara) {
        var oParam = {
            devSn:FrameInfo.ACSN
        };
        $.extend(oParam,oPara);
        //$.extend(oParam,g_oTime);
        function onSuccess(aData)
        {
            
            //result:["HeartbeatCnt","time"]
            if(aData.retCode != 0)
            {
                console.log("get StudentInfo Failed!");
                return;
            }
            //debugger;
            var aResult = aData.result.data?aData.result.data:[];
            $.each(aResult,function(index,item){
                item.heartbeat = item.heartbeat?item.heartbeat:0;
                item.step = item.step?item.step:0;
                //根据学号 姓名筛选 个人信息
                if(item.studentId == g_studentId && item.studentName == g_studentName){
                    $("#weight").text(item.weight);
                    $("#stature").text(item.stature);
                    $("#stepnumber").text(item.step);
                    $("#HeartrateDate").text(item.heartbeat);
                    //添加姓名 班级
                }
                 
            })
            // $("#health-detail").SList('refresh', { data:aResult, total: aData.result.rowCount });

        }

        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getStudentHealthReport",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed:function(textStatus,jqXHR,error)
            {
                var data = [
                    {
                        studentId: 1234,
                        studentName: '小明',
                        years:2015,
                        grade: '一年级',
                        baseGrade:'0',
                        classId: '1',
                        age: '10',
                        sex: '男',
                        heartbeat: '10',
                        step: '10',
                        stautre: '10',
                        weight: '10',
                        temperature:'10',
                        wristbandId:'11-11-12-13-11-21'
                    },
                    {
                        studentId: 1234,
                        studentName: '小刚',
                        baseGrade:'0',
                        years:2015,
                        grade: '一年级',
                        classId: '1',
                        age: '10',
                        sex: '男',
                        heartbeat: '10',
                        step: '10',
                        stautre: '10',
                        weight: '10',
                        temperature:'10',
                        wristbandId:'11-11-12-13-12-21'
                    }
                ]
                // $("#health-detail").SList('refresh', data);
                //debugger;
            }
        }
        Utils.Request.sendRequest(option);
    }
    
    function getStudentHealthReport1(params) {
        function onSuccess(aData)
        {
            
            //result:["HeartbeatCnt","time"]
            if(aData.retCode != 0)
            {
                console.log("get StudentInfo Failed!");
                return;
            }
            //debugger;
            var aResult = aData.result?aData.result:[];
             aResult.heartrate = aResult.heartrate?aResult.heartrate:61;
                aResult.heartrate = aResult.heartrate > 200 ? 151 : aResult.heartrate;
                aResult.step = aResult.step?aResult.step:4501;
                aResult.calorie = aResult.calorie?aResult.calorie:3501;
                aResult.distance = aResult.distance?aResult.distance:aResult.step/2;
                aResult.stature = aResult.stature?aResult.stature:181;
                aResult.weight = aResult.weight?aResult.weight:61;
                    $("#weight").text(aResult.weight);
                    $("#stature").text(aResult.stature);
                    $("#stepnumber").text(aResult.step+"步");
                    $("#HeartrateDate").text(aResult.heartrate);
                    
                    //新增卡路里 和 距离
                    $("#distancedata").text(aResult.distance+"米");
                    $("#Caloriedata").text(aResult.calorie+"焦");

        }
        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            timeout:20000,
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getStudentHealthInfo",
                Param:params
            }),
            onSuccess:onSuccess,
            onFailed:function(textStatus,jqXHR,error)
            {
                $("#weight").text("74");
                $("#stature").text("165");
                $("#stepnumber").text("3361步");
                $("#HeartrateDate").text(71);
                
                //新增卡路里 和 距离
                $("#distancedata").text("6011米");
                $("#Caloriedata").text("3761焦");
                // $("#health-detail").SList('refresh', data);
                //debugger;
            }
        }
        Utils.Request.sendRequest(option);
    }
    
    function initStudentData(oFilter) {
        // var pageSize = pageSize || 10;
            var Num =  1;
            var oFilter = oFilter || {};
            var oParam = {
                devSn: FrameInfo.ACSN,
                startRowIndex: 0,
                maxItem: 100,
                classId: g_class,
                years: g_year,
                baseGrade:g_baseGrade
            };
            
            //$.extend(oParam,oResult);
            $.extend(oParam, oFilter);
            
            var oParam1 = {
                devSn:FrameInfo.ACSN,
                studentId:g_studentId,
                wristbandId:g_wristbandId
                // devSn:"210231A5AUB164000010",
                // studentId:'1920160228'
            }
            
            // getStudentHealthReport(oParam);
            getStudentHealthReport1(oParam1);
    }
    //1.分别为闰年与平年设置了每月天数2.为右上角的选择按钮设置了点击事件3.设置默认显示的是STEPNUM数据
    function initData() {
        
        g_oPara = Utils.Base.parseUrlPara();
        //先从前个页面获取值并显示
        // $("#weight").text(g_oPara.weight);
        // $("#stature").text(g_oPara.stature);
        // $("#stepnumber").text(g_oPara.step);
        // $("#HeartrateDate").text(g_oPara.heartbeat);
        // $("#HeartrateDate").text(g_oPara.heartbeat);
        //添加姓名 班级 
        g_class = g_oPara.classId;
        g_year = g_oPara.years;
        g_baseGrade = g_oPara.baseGrade;
        g_studentId = g_oPara.studentId;
        g_studentName = g_oPara.studentName;
        g_wristbandId = g_oPara.wristbandId;
        //调前一个页面的接口 定时获取数据并刷新页面
        var oFilt = {
                        studentIdWeak: 0
                        // studentNameWeak: oFilter.studentName,
                        // grade:oFilter.grade,
                        // classIdWeak: oFilter.classId,
                        // age: oFilter.age,
                        // sex: oFilter.sex,
                        // heartbeat: oFilter.heartbeat,
                        // step: oFilter.step,
                        // stature: oFilter.stature,
                        // weight: oFilter.weight,
                        // temperature:oFilter.temperature
                    }
        initStudentData(oFilt);
        
        g_timer = setInterval(function(){test()},5000); 
        
        $(".xx-link").removeClass("active");
        $("#STEPNUM.xx-link").addClass("active");
        g_oTime = {
            method:'STEPNUM'
        }
        
        getStudentPresentRatio(g_oTime);
        $(".xx-link").on('click',function(e){
            $(".xx-link").removeClass("active");
            $(this).addClass("active");
        });
        if (Timer_Interval) {
            clearInterval(Timer_Interval);
        }

    }
    
    function initGrid() {
        
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
                        {text:'健康管理',href:'#C_SHealth'},
                        {text:'个人健康',href:''}]);
                        
        $(".xx-link").on('click',function(e){
            $(".xx-link").removeClass("active");
            $(this).addClass("active");
            var sId = $(this).attr("id");
            switch (sId) {
                case 'STEPNUM':
                    {
                        g_oTime = {
                            method: 'STEPNUM'
                        }
                        break;
                    }
                case 'CALORIE':
                    {
                        g_oTime = {
                            method: 'CALORIE'
                        }
                        break;
                    }
                case 'STATURE':
                    {
                        g_oTime = {
                            method: 'STATURE'
                        }
                        break;
                    }
                case 'WEIGHT':
                    {
                        g_oTime = {
                            method: 'WEIGHT'
                        }
                        break;
                    }
                default:
                    {
                        g_oTime = {
                            method: 'STEPNUM'
                        };
                        break;
                    }
            }
            //getStudentPresentRatio(g_oTime);
        });
    }
    
    // function returnPage() {
    //     Utils.Base.redirect({np: 'classroom.healthdetail'});
    //     return false;
    // }
    
    function _init() {
    //    $("#return").on('click', returnPage);
       initGrid();
       initData();
    }
    
    function _destroy() {
        clearInterval(g_timer);

    }
    
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Echart", 'SingleSelect'],
        "utils": ["Request", "Base", 'Device']
    });
})(jQuery);