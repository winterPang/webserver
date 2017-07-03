;(function($){
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".campusdashboard";
    var SN = "";
    var g_imgWidth, g_imgHeight, g_scale;
    var v2path = MyConfig.v2path;
    var Timer_Interval = null;
    var g_oTime;
    var Timer_Interval1 = null;

    //假数据
    var aDay = []; 
    var aWeek = [];
    var aMonth = [];
    var aYear = []; 

    var g_normal = {devSn:FrameInfo.ACSN, nStartTime:0, nEndTime:0, alarmlevel:"normal"};
    var g_general = {devSn:FrameInfo.ACSN, nStartTime:0, nEndTime:0, alarmlevel:"general"};
    var g_serious = {devSn:FrameInfo.ACSN, nStartTime:0, nEndTime:0, alarmlevel:"serious"};
 
    function getRcText(sRcName) {
        return Utils.Base.getRcString("c_campus_rc", sRcName);
    }

    function getDoubleStr(num) {
        return num >= 10 ? num : "0" + num;
    }

    function getEnddate() {
        var tNow = new Date();
        // var nYear = tNow.getFullYear();
        // var nMonth = tNow.getMonth() + 1;
        // var nDay = tNow.getDate();
        // var nHour = tNow.getHours();
        // var nMinite = tNow.getMinutes();
        // var nSecond = tNow.getSeconds();
        // var oNowEndTime = nYear + "-" + nMonth + "-" + nDay + "-" + nHour + "-" + nMinite + "-" + nSecond;
        return tNow;
    }

    function getStartdate(time) {
        var tNow = new Date(time);
        // var nYear = tNow.getFullYear();
        // var nMonth = tNow.getMonth() + 1;
        // var nDay = tNow.getDate();
        // var nHour = tNow.getHours();
        // var nMinite = tNow.getMinutes();
        // var nSecond = tNow.getSeconds();
        // var oNowEndTime = nYear + "-" + nMonth + "-" + nDay + "-" + nHour + "-" + nMinite + "-" + nSecond;
        return tNow;
    }

    /*
     * 获取学生坐标
     * data.code   data.message    data.client{locationName,areaName,clientIp,clientMac,posY,posX}   *
     *
     *
     * */

    function getMacInfo() {
        var getMacOpt = {
            type: "POST",
            url: v2path + "/location/locationClientMac",
            contentType: "json",
            data: JSON.stringify({
                devSn: FrameInfo.ACSN,
                Param: {
                    //userId
                    shopName: FrameInfo.ACSN,
                    locationName: mapName,
                    macAddress: mac,
                }
            }),
            onSuccess: getMacSuc,
            onFailed: getMacFail
        };

        Utils.Request.sendRequest(getMacOpt);
    }

    function getAllLocationClient(locationName) {
        var option = {
            type: 'POST',
            url: MyConfig.v2path + '/location/allLocationClient',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                userId: FrameInfo.g_user.user,
                shopName: Utils.Device.deviceInfo.shop_name,
                locationName: locationName
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }
    //获取用户地图图片
    /*
     * reapond:
     * {
     *   "code":0,//0 suc  1 fail
     *   "message":"",//提示信息
     *   shopName：string，场所名
     *   locationImage:[
     *   {
     *       locationName string
     *       imagePath  string
     *   }
     *   ]
     *
     * }
     */
    function getStudentLocation(onSuc){
        var oParam1 = {
            devSn:FrameInfo.ACSN
        };
        var getStuOpt = {
            type: "POST",
            url: MyConfig.path+"/smartcampusread",
            contentType: "application/json",
            data: JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"getStudentLocation",
                Param:oParam1
            }),
            onSuccess:onSuc,
            onFailed: function(jqXHR,textstatus,error){
                //Frame.Msg.info("添加失败！");
            }
        };
        Utils.Request.sendRequest(getStuOpt);
    }
    function getMapInfo() {
        var getMapOpt = {
            type: "POST",
            url: v2path + "/location/LocationImage",
            contentType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getClass",
                Param: {
                    shopName: FrameInfo.ACSN
                }
            }),
            onSuccess: getMapSuc,
            onFailed: getMapFail
        };

        Utils.Request.sendRequest(getMapOpt);
    }

    //获取在校学生、请假学生、未请假学生数量、从未离校学生数量
    function getStudentPresentSta(oTime) {
        //result:["totalCnt","PresentCnt","leaveCnt","noleaveCnt"]
        function onSuc(aData) {
            if (aData.retCode != 0) {
                drawAllStudentPie(0,0,0,0,0);
                console.log("getStudentPresentSta retCode=-1:" + oTime.startTime + "-" + oTime.endTime);
                return;
            }
            var oResult = aData.result || {};
            if(oResult.presentCnt||oResult.leaveCnt||oResult.leaveSchoolCnt||(oResult.neverPresentCnt&&oResult.noStatus)||/*oResult.neverPresentQingjia||oResult.leaveSchoolQingjia||*/oResult.totalCnt) {
                var nArriveStu = oResult.presentCnt || 0; //在位学生数
                var nLeaveStu = oResult.leaveCnt || 0;//请假学生数
                var nLeaveSchoolCnt = oResult.leaveSchoolCnt || 0;//离校学生数
                //var nLeaveSchoolQingjia = oResult.leaveSchoolQingjia || 0;
                var nNeverPresentCnt = oResult.neverPresentCnt+oResult.noStatus||0;//从未到校学生数
                //var nNeverPresentQingjia = oResult.neverPresentQingjia ||0;
                var nTotalStu = oResult.totalCnt || 0;
                console.log("data.result.nostatu:"+oResult.noStatus);
            }else{
                //假数据
                var nArriveStu = 0;
                var nLeaveStu = 0;
                var nLeaveSchoolCnt = 0;
                var nTotalStu = 0;
                var nNeverPresentCnt = 0;
            }
            //学生总数   在校学生数   请假学生数   离校学生数   从未到校学生数
            drawAllStudentPie(nTotalStu,nArriveStu,nLeaveStu,nLeaveSchoolCnt,nNeverPresentCnt/*,nLeaveSchoolQingjia,nNeverPresentQingjia*/);
        }

        var oParam = {
            devSn: FrameInfo.ACSN,
            //startTime:startTime,//开始时间
            //endTime:endTime
        }
        $.extend(oParam,oTime);
        var option = {
            type: "POST",
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getStudentPresentSta",
                Param: oParam
            }),
            onSuccess: onSuc,
            onFailed: function () {
                drawAllStudentPie(0,0,0,0,0);
                console.log("drawAllStudentPie Failed");
            }
        }
        Utils.Request.sendRequest(option);
    }

    //获取心率过速过缓数据
    function getHeartBeatData(oTime) {
        //result:["lowCount","fastCount"]
        //startTime:startTime,//开始时间
        //endTime:endTime
        function onSuc(aData) {
            if (aData.retCode != 0) {
                $("#QuickCount").html(0);
                $("#SlowCount").html(0);
                $("div.smartschool .heart").removeClass("red");
                $("div.smartschool .heart").addClass("green");
                console.log("getStudentPresentSta failed:" + oTime.startTime + "-" + oTime.endTime);
                return;
            }

            var aResult = aData.result ? aData.result : {};
            var nQuick = aResult.fastCount || 0;
            var nSlow = aResult.lowCount || 0;
            $("#QuickCount").html(nQuick);
            $("#SlowCount").html(nSlow);
            if (nQuick > 0 || nSlow > 0) {
                $("div.smartschool .heart").removeClass("green");
                $("div.smartschool .heart").addClass("red");
            } else {
                $("div.smartschool .heart").removeClass("red");
                $("div.smartschool .heart").addClass("green");
            }
        }

        var oParam = {
            devSn: FrameInfo.ACSN,
            //years:years,   //入学年份  不指定查全校
            //classId:classId,//班级  空为全校
            //baseGrade,
            normalHeartBeatMinCnt: 40,//正常心率最小值
            normalHeartBeatMaxCnt: 160,//正常心率最小值
        };
        $.extend(oParam, oTime);
        var option = {
            type: "POST",
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                //"getStudentPresentRatioOneDay/OneHour/OneWeek/OneMonth/OneYear
                Method: "getHeartbeatFastOrSlowSta",
                Param: oParam
            }),
            onSuccess: onSuc,
            onFailed: function () {
                $("#QuickCount").html(0);
                $("#SlowCount").html(0);
                $("div.smartschool .heart").removeClass("red");
                $("div.smartschool .heart").addClass("green");

            }
        }
        Utils.Request.sendRequest(option);
    }

    //获取历史到校率
    function getStudentPresentRatio(oTime) {
        function onSuc(res) {
            
            var aResult = res.result?res.result:[];
            var aData = [];
            var aTime = [];
            if (res.retCode != 0 || aResult == false) {
                   aTime=["12/07","12/08","12/09","12/10","12/11","12/12","12/13"];
                   aDate=[0.78,0.45,0.76,0.87,0.34,0.98,0.93];         
                       
            }else{
                
                for(var o in aResult){
                    aTime.push(o.substring(5));
                    aData.push(aResult[o]);
                }
            }
            
            drawMonthWeekYearChange(aData, aTime);
            // var aResult = aData.result ? aData.result : [];
            // var aTime = [];
            // var aStuInfo = [];
            // $.each(aResult, function (index, item) {
            //     aTime.push(item.time);
            // });
            // switch (oTime.method) {
            //     case 'hour': case 'day':
            //         drawDayChange(aResult, aTime); break;
            //     case 'week': case 'month': case 'year':
            //         drawMonthWeekYearChange(aResult, aTime); break;
            //     default:
            //         break;
            // }
        }

        var oPara = {
            devSn: FrameInfo.ACSN,
            method:oTime.method
        }
        
        // $.extend(oPara, oTime);
        var option = {
            type: "POST",
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            timeout:60000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getStudentHistoryInSchoolRatio",
                Param: oPara
            }),
            onSuccess: onSuc,
            onFailed: function () {
                var aData = [];
                var aTime = [];
                aTime=["12/07","12/08","12/09","12/10","12/11","12/12","12/13"];
                aDate=[0.78,0.45,0.76,0.87,0.34,0.98,0.93];         

                drawMonthWeekYearChange(aDate, aTime);
            }
                 

        }
        Utils.Request.sendRequest(option);
    }

    //获取历史步数排名
    function getYesterDayStepRange(oPara) {
        function onSuc(aData) {
            if (aData.retCode != 0) {
                var aStep=[
                    {
                        averageAge: 9,
                        averageStep: 0,
                        baseGrade: 1,
                        classId: "7",
                        classroom: null,
                        grade: "一年级",
                        studentCnt: 1,
                        years: 1409554800000
                    }
                ];
                $("#footPrintList").SList("refresh", { data: aStep, total: 1 });
                console.log("get step range fail ")
                return;
            }
            var aResult = aData.result ? (aData.result.data ? aData.result.data : []) : [];
            for(var i=0;i<aResult.length;i++){
                if(String(aResult[i].averageAge).indexOf(".")!=-1){
                    aResult[i].averageAge=Number(aResult[i].averageAge).toFixed(1);
                }
                if(String(aResult[i].averageStep).indexOf(".")!=-1){
                    aResult[i].averageStep=Number(aResult[i].averageStep).toFixed(1);
                }
            }
            var rowCount = aData.result ? (aData.result.rowCount ? aData.result.rowCount : 0) : 0;
            $("#footPrintList").SList("refresh", { data: aResult, total: rowCount });
        }
        //result:["eyears","grade","classroom","studentCnt","averageAge","averageStature/*平均身高*/"
        //        "averageStep","teacher","teacherTel" ,"baseGrade","gradeType" ],retCode
        //自然天 00:00-24:00
        var oParam = {
            devSn: FrameInfo.ACSN,
            //startRowIndex:startRowIndex,
            //maxItems:maxItems,
            //startTime:startTime,//开始时间
            //endTime:endTime
        };
        $.extend(oParam, oPara);
        var option = {
            type: "POST",
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getYesterdayAverageStep",
                Param: oParam
            }),
            onSuccess: onSuc,
            onFailed: function () {
                var aStep=[
                    {
                        averageAge: 9,
                        averageStep: 0,
                        baseGrade: 1,
                        classId: "7",
                        classroom: null,
                        grade: "一年级",
                        studentCnt: 1,
                        years: 1409554800000
                    }
                ];
                $("#footPrintList").SList("refresh", { data: aStep, total: 1 });
            }
        }
        Utils.Request.sendRequest(option);
    }


    //获取到校学生、请假学生、未请假学生具体信息
    function getStudentPresentInfo(oPara) {
        //result:["studentId","studentName","classId","sex","houseHolder","comunication"]
        var oParam = {
            devSn: FrameInfo.ACSN,
            //gradeConf:gradeConf, //年级数组
            //gradeType:gradeType,//年级类型
            //gradeMonth:gradeMonth,//升级月份
            //grade:grade,//年级为空表示全校
            //classId:classId,//班级为空表示全校
            //startTime:startTime,//开始时间
            //startRowIndex:startRowIndex,//查询起始行数
            //maxItems:maxItems//每页显示最大行数默认50行
        }
        $.extend(oParam, oPara);
        var option = {
            type: "POST",
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getStudentPresent",
                Param: oParam
            }),
            onFailed: function () {

            }
        }

        Utils.Request.sendRequest(option);
    }



    //获取心率过速过缓学生信息
    function getHeartBeatInfo(oPara, sMethod) {
        //result:[学生信息所有字段]
        var oParam = {
            devSn: FrameInfo.ACSN,
            //years:years,   //入学年份  不指定查全校
            //classId:classId,//班级  空为全校
            //gradeType:gradeType,//年级类型  不指定查询全校
            //baseGrade:baseGrade,
            //gradeMonth:gradeMonth,//升级时间  不指定查全校
            //heartBeatThread:heartBeatThread,//心率阈值 最大值/最小值
            //startTime:startTime,//开始时间
            //endTime:endTime
        };
        $.extend(oParam, oPara);
        var option = {
            type: "POST",
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                //"getStudentPresentRatioOneDay/OneHour/OneWeek/OneMonth/OneYear
                Method: sMethod,//"getCurHeartbeatFast","getCurHeartbeatSlow"
                Param: oParam
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }

    function setheatmap(locationName, imgPath) {
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampuswrite',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'setheatmap',
                Param: {
                    devSn: FrameInfo.ACSN,
                    locationName: locationName,
                    imgPath: imgPath
                }
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }

    function getheatmap(locationName, imgPath) {
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getheatmap',
                Param: {
                    devSn: FrameInfo.ACSN
                }
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }

    function drawStudentChange(aInData, axAxis) {
        // var arr = [];
        // aInData.forEach(function (item) {
        //     arr.push(item.StudentPresentRatio);
        // });
        var option = {
            //height:"100%",
            //height:"100%",
            height: 230,
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#80878C',
                        width: 2,
                        type: 'solid'
                    }
                },
                formatter: function (y, x, z, w) {
                    var stringName = y[0].seriesName;
                    var aa = y[0].series.data[parseInt(x.split(":")[1])] * 100;
                    var val = aa.toFixed(2) + "%";
                    var time = (new Date(y[0].name)).getFullYear() + "/" + ((new Date(y[0].name)).getMonth() + 1) + "/" + ((new Date(y[0].name)).getDate()) + "&nbsp;&nbsp;" + getDoubleStr((new Date(y[0].name)).getHours()) + ":" + getDoubleStr((new Date(y[0].name)).getMinutes()) + ":" + getDoubleStr((new Date(y[0].name)).getSeconds());
                    var string = time + '<br/>' + stringName + ":" + val;
                    return string;
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "center",
                data: [getRcText("STU_IN_SCHOOL")]
            },
            grid: {
                x: 40, 
                x2:10,
                y: 20,
                y2:40,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: axAxis,
            yAxis: [
                {
                    type: 'value',
                    max:1,
                    min:0,
                    scale:true,
                    splitNumber: 10,
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#80878C', width: 2 },
                        formatter: function (nNum) {
                            return nNum * 100 + "%";
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#80878C', width: 2 }
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: 'default' } } },
                    name: getRcText("STU_IN_SCHOOL"),
                    //data: aInData
                    data: aInData
                }
            ]

        };
        var oTheme = {
            // color: ["rgba(120,206,195,1)","rgba(254,240,231,1)","rgba(144,129,148,1)","rgba(254,184,185,1)"],
            color: ["rgba(174,226,219,1)", "rgba(120,206,195,1)", "rgba(255,196,197,1)", "rgba(255,156,158,1)"],
        };
        $("#HistoryCount").echart("init", option, oTheme);
        //setTimeout(function(){$("#HistoryCount").echart("init", option, oTheme);},500);
    }

    function drawDayChange(aInData, aTime) {
        var splitNumber;
        if (aInData.length > 8) {
            splitNumber = 9
        }
        // var aArr = [];
        // aInData.forEach(function (arr) {
        //     arr.time = new Date(arr.time);
        //     aArr.push(arr.StudentPresentRatio);
        // });

        var axAxis = [
            {
                type: 'category',
                splitNumber: splitNumber,
                boundaryGap: false,
                splitLine: false,
                axisLine: {
                    show: true,
                    lineStyle: { color: '#80878C', width: 2 }
                },
                axisLabel: {
                    show: true,
                    textStyle: { color: '#80878C', width: 2 },
                    formatter: function (data) {
                        return getDoubleStr((new Date(data)).getHours()) + ":" + getDoubleStr((new Date(data)).getMinutes()) + ":" + getDoubleStr((new Date(data)).getSeconds());
                    }
                },
                axisTick: {
                    show: false
                },
                data: aTime
                //data: ["00:12:33","01:12:33","02:12:33","03:12:33","04:12:33","05:12:33", "06:32:33", "07:52:33", "08:12:33", "09:32:33", "10:52:33", "11:12:33", "12:32:33", "13:52:33", "14:12:33"]
            }
        ];
        drawStudentChange(aInData, axAxis);
    }

    function drawMonthWeekYearChange(aInData, aTime) {
        var splitNumber;
        if (aInData.length > 8) {
            splitNumber = 8
        } else {
            splitNumber = aInData.length - 1;
        }
        // var aArr = [];
        // aInData.forEach(function (arr) {
        //     arr[0] = new Date(arr[0]);
        //     aArr.push(arr[0]);
        // });
        var axAxis = [
            {
                splitNumber: splitNumber,
                type: 'category',
                splitLine: true,
                axisLabel: {
                    show: true,
                    interval: 2,
                    textStyle: { color: '#617085', fontSize: "12px" },
                    formatter: function (data) {
                        return ((new Date(data)).getMonth() + 1) + "-" + (new Date(data)).getDate();
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: { color: '#AEAEB7', width: 1 }
                },
                axisTick: {
                    show: false
                },
                data: aTime
            }
        ];
        drawStudentChange(aInData, axAxis);
    }
    //色彩   选择符    饼图类别   显示数量   差值   总数
    function drawPie(sColor, $sPieName, sName, nData1, nData2, nTotal, qingjia) {
        var sName1;
        var sName2 = "请假学生";
        switch (sName) {
            case "allStudent":
                sName1 = getRcText("STUDENT_TYPE").split(",")[0];
                break;
            case "leaveupStudent":
                sName1 = getRcText("STUDENT_TYPE").split(",")[1];
                break;
            case "absentStudent":
                sName1 = getRcText("STUDENT_TYPE").split(",")[2];
                break;
            case "noArriveStudent":
                sName1 = getRcText("STUDENT_TYPE").split(",")[3];
                break;
            default:
                break;
        }
        var labelTop = {
            normal: {
                color: "#f5f5f5",
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                }
            }
        };
        var labelBottom = {
            normal: {
                color: sColor,
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };
        if (qingjia == undefined) {
            if (nData1 == 0 && nData2 == 0) {
                var aSeries = [
                    {
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: [38, 53],
                        data: [
                            { name: '', value: 1, itemStyle: labelTop }
                        ]
                    }
                ];
                var option1 = {
                    width: 160,
                    height: 170,
                    series: aSeries
                };
            } else {
                var aSeries = [
                    {
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: [38, 53],
                        //itemStyle : labelFromatter,
                        data: [
                            { name: sName1, value: nData1, itemStyle: labelBottom },
                            { name: '其他学生', value: nData2, itemStyle: labelTop }
                        ]
                    }
                ];

                var option1 = {
                    width: 160,
                    height: 170,
                    tooltip: {
                        show: true,
                        zlevel: 1,
                        trigger: 'item',
                        formatter: function (a, b, c, d) {
                            return (a[5].name + ":" + a[5].value + "人");
                        },
                        showDelay: 50
                    },
                    series: aSeries,
                };
            }
        } else {
            if (nData1 == 0 && nData2 == 0) {
                var aSeries = [
                    {
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: [38, 53],
                        data: [
                            { name: '', value: 1, itemStyle: labelTop }
                        ]
                    }
                ];
                var option1 = {
                    width: 160,
                    height: 170,
                    series: aSeries
                };
            } else {
                var sName3 = '其他' + sName1;
                var aSeries = [
                    {
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: [38, 53],
                        //itemStyle : labelFromatter,
                        data: [
                            { name: sName2, value: nData1, itemStyle: labelBottom },
                            { name: sName3, value: nData2, itemStyle: labelTop }
                        ]
                    }
                ];

                var option1 = {
                    width: 160,
                    height: 170,
                    tooltip: {
                        show: true,
                        zlevel: 1,
                        trigger: 'item',
                        formatter: function (a, b, c, d) {
                            return (a[5].name + ":" + a[5].value + "人");
                        },
                        showDelay: 50
                    },
                    series: aSeries,
                };
            }
        }

        //var ecConfig = require('echarts/config');
        gMychart = $sPieName.echart("init", option1);
        if (qingjia != undefined) {
            var appendTohtml = [
                '<div class="text-style"><div title="',
                sName1, '" type="', sName,
                '"><span class="pieStyle">',
                nTotal,
                '</span></div></div>'
            ].join("");
        } else {
            var appendTohtml = [
                '<div class="text-style"><div title="',
                sName1, '" type="', sName,
                '"><span class="pieStyle">',
                nData1,
                '</span></div></div>'
            ].join("");
        }
        $(appendTohtml).appendTo($sPieName);

    }
    //学生总数   在校学生数   请假学生数   离校学生数   从未到校学生数
    function drawAllStudentPie(nTotal, nAll, nLeaveup, nAbsent, nNoArrive/*, nLeaveSchoolQingjia, nNeverPresentQingjia*/) {

        //nAll  在校学生数
        var $all = $("#allStudent");
        var sColor = "#4ec1b2";
        var aCenter = ['50%', '50%'];
        var nData1 = nAll;
        var nData2 = nTotal - nAll;
        var sName = 'allStudent';
        if (isNaN(nData2)) {
            nData2 = 0;
            nData1 = nData2;
        }
        //色彩   选择符    饼图类别   显示数量   差值   总数
        drawPie(sColor, $all, sName, nData1, nData2, nTotal);
        //nLeaveup
        //请假学生
        var $leaveup = $("#leaveupStudent");
        var sColor = "#f2bc98";
        var aCenter = ['50%', '50%'];
        var aRadius = [43, 58];
        var nData1 = nLeaveup;
        var nData2 = nTotal - nLeaveup;
        var sName = 'leaveupStudent';
        if (isNaN(nData2)) {
            nData2 = 0;
            nData1 = nData2;
        }
        drawPie(sColor, $leaveup, sName, nData1, nData2, nTotal);

        //nAbsent  离校学生
        var $absent = $("#absentStudent");
        var aCenter = ['50%', '50%'];
        var sColor = "#fe808b";
        var aRadius = [43, 58];
        //var nData1 = nLeaveSchoolQingjia;
        //var nData2 = nAbsent - nLeaveSchoolQingjia;
        var nData1 = nAbsent;
        var nData2 = nTotal - nAbsent;
        var sName = 'absentStudent';
        if (isNaN(nData2)) {
            nData2 = 0;
            nData1 = nData2;
        }
        //drawPie(sColor, $absent, sName, nData1, nData2, nAbsent, nLeaveSchoolQingjia);
        drawPie(sColor, $absent, sName, nData1, nData2, nTotal);
        //noarrive  从未到校
        var $noarrive = $("#noArriveStu");
        var aCenter = ['50%', '50%'];
        var sColor = "#c8c3c1";
        var aRadius = [43, 58];
        //var nData1 = nNeverPresentQingjia;
        //var nData2 = nNoArrive - nNeverPresentQingjia;
        var nData1 = nNoArrive;
        var nData2 = nTotal - nNoArrive;
        var sName = 'noArriveStudent';
        if (isNaN(nData2)) {
            nData2 = 0;
            nData1 = nData2;
        }
        //drawPie(sColor, $noarrive, sName, nData1, nData2, nNoArrive, nNeverPresentQingjia);
        drawPie(sColor, $noarrive, sName, nData1, nData2, nTotal);
    }

    function ChangeStuInfo(row, cell, value, columnDef, dataContext, type) {
        value = value || "";
        if ("text" == type) {
            return value;
        }

        //switch(cell){
        //    case 0:{
        //
        //    }
        //
        //}
    }

    function initSlist(pageNum, pageSize, oFilter) {
        function getLastDate(sMonth, sYear) {
            switch (sMonth) {
                case 3:
                    {
                        var year = parseInt(sYear);
                        if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                            return 29;
                        } else {
                            return 28;
                        }
                    }
                case 1:
                case 2:
                case 4:
                case 6:
                case 8:
                case 9:
                case 11:
                    return 31; break;
                case 5: case 7: case 10: case 12:
                    return 30; break;
                default:
                    break;
            }
        }
        var pageSize = pageSize || 4;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var tYesterday = getEnddate();
        var sMonths = (tYesterday.getMonth()) ? tYesterday.getMonth()+1 : 12;
        var sYear = (tYesterday.getMonth()) ? tYesterday.getFullYear() : tYesterday.getFullYear() - 1;
        var sDate = (tYesterday.getDate()-1) ? (tYesterday.getDate() - 1) : getLastDate(sMonths, sYear);
        var nYesterday = (new Date(sYear + "/" + getDoubleStr(sMonths) + "/" + getDoubleStr(sDate) + "  " + "00:00:00")).getTime();
        var oParam = {
            startTime: getStartdate(nYesterday).getTime(),
            endTime: getStartdate(nYesterday + 86400000).getTime(),
            startRowIndex: 4 * (pageNum - 1),
            maxItem: 4
        }
        $.extend(oParam, oFilter);

        getYesterDayStepRange(oParam);
    }

    function ChangeStuInfo(row, cell, value, columnDef, dataContext, type) {
        value = value || "";
        if ("text" == type) {
            return value;
        }
        switch (cell) {
            case 1:
                {
                    var title = value + "班";
                    var value = dataContext["classId"];
                    if(value){
                        return "<p title='" + title + "'>" + value + "班</p>";
                    }

                }

            default:
                break;
        }
        return false;

    }

    function drawStepList() {
        var opt = {
            colNames: getRcText("SLIST_STEP"),
            showHeader: true,
            multiSelect: false,
            pageSize: 4,
            rowHeight: 45.25,
            asyncPaging: true,
            onPageChange: function (pageNum, pageSize, oFilter) {
                initSlist(pageNum, pageSize, oFilter)
            },
            onSearch:function(oFilter,oSorter){
                if(oFilter) {
                    oFilter.classIdWeak = oFilter.classId ? oFilter.classId : undefined;
                    oFilter.grade = oFilter.grade ? oFilter.grade : undefined;
                    oFilter.averageAge = oFilter.averageAge ? oFilter.averageAge : undefined;
                    oFilter.averageStep = oFilter.averageStep ? oFilter.averageStep : undefined;
                    delete oFilter.classId;
                }
                initSlist(0, 4, oFilter);
            },
            colModel: [
                { name: 'grade', datatype: "String" },
                { name: 'classId', datatype: "String", formatter: ChangeStuInfo },
                { name: 'averageAge', datatype: "String" },
                { name: 'averageStep', datatype: "String" }
            ]
        };
        $("#footPrintList").SList("head", opt);
    }

    /*function echartUpdate(heatData) {
        /!*var locationName = $("#s2id_MapSelect span").html();
        getAllLocationClient(locationName).done(function (data) {

            heatData = data.client.reduce(function (res, cur) {
                res.push([cur.posX, cur.posY, 0.1]);
                return res;
            }, []);
            if (!heatData || heatData.length === 0) {
                heatData = [];
                for (var i = 0; i < 20; ++i) {
                    heatData.push([
                        500 + Math.random() * 1000,
                        100 + Math.random() * 800,
                        0.8
                    ]);
                }
            }
            var option = {
                width: g_imgWidth,
                height: g_imgHeight,
                title: {
                    text: ''
                },
                series: [
                    {
                        type: 'heatmap',
                        data: heatData,
                        hoverable: false,
                        gradientColors: [{
                            offset: 0.4,
                            color: 'green'
                        }, {
                                offset: 0.5,
                                color: 'yellow'
                            }, {
                                offset: 0.8,
                                color: 'orange'
                            }, {
                                offset: 1,
                                color: 'red'
                            }],
                        minAlpha: 0.3,
                        valueScale: 2,
                        opacity: 0.6
                    }
                ]
            };
            $("#heat-map").echart("init", option, {});
        })*!/
        /!*getStudentLocation.done(function(data){
            console.log(data)
        })*!/
        getStudentLocation(onSuc);
        function onSuc(data){
            console.log(data);
        }
    }*/
    function echartUpdatebyscale() {
        /*var heatData = [];
        var locationName = $("#s2id_MapSelect span").html();
        getAllLocationClient(locationName).done(function (data) {
            heatData = data.client.reduce(function (res, cur) {
                res.push([cur.posX * g_scale, cur.posY * g_scale, 0.1]);
                return res;
            }, []);
            if (!heatData || heatData.length === 0) {
                heatData = [];
                for (var i = 0; i < 20; ++i) {
                    heatData.push([
                        500 + Math.random() * 1000,
                        100 + Math.random() * 800,
                        0.8
                    ]);
                }
            }
            var option = {
                width: g_imgWidth,
                height: g_imgHeight,
                title: {
                    text: ''
                },
                series: [
                    {
                        type: 'heatmap',
                        data: heatData,
                        hoverable: false,
                        gradientColors: [{
                            offset: 0.4,
                            color: 'green'
                        }, {
                                offset: 0.5,
                                color: 'yellow'
                            }, {
                                offset: 0.8,
                                color: 'orange'
                            }, {
                                offset: 1,
                                color: 'red'
                            }],
                        minAlpha: 0.3,
                        valueScale: 2,
                        opacity: 0.6
                    }
                ]
            };

            $("#heat-map").echart("init", option, {});
        })*/
        var heatData=[];
        var oOpacity=1;
        getStudentLocation(onSuc);
        function onSuc(data){
            heatData = data.result.reduce(function (res, cur) {
                res.push([cur.x * g_scale, cur.y * g_scale, 0.1]);
                return res;
            }, []);
            if(heatData.length == 0){
                heatData=[[200,200,0.1]];
                oOpacity=0;
            }

            var option = {
                width: g_imgWidth,
                height: g_imgHeight,
                title: {
                    text: ''
                }, 
                series: [
                    {
                        type: 'heatmap',
                        data: heatData,
                        hoverable: false,
                        gradientColors: [{
                            offset: 0.2,
                            color: 'blue'
                        }, {
                            offset: 0.4,
                            color: 'green'
                        }, {
                            offset: 0.6,
                            color: 'yellow'
                        }, {
                            offset: 0.8,
                            color: 'orange'
                        }, {
                            offset: 1,
                            color: 'red'
                        }],
                        minAlpha: 0.3,
                        valueScale: 0.5,
                        opacity:oOpacity
                    }
                ]
            };

            $("#heat-map").echart("init", option, {});
        }

    }

    function initAddListen(oTime) {
        //pieStyle
        $(".text-style").live("click", function () {
            var stuType = $(this).find("div").attr("type");
            Utils.Base.redirect({ np: "classroom.studentlist", addType: stuType, startTime: oTime.startTime, endTime: oTime.endTime });
        });
        $("#QuickCount,#SlowCount").on("click", function () {
            var stuType = $(this).attr("type");
            Utils.Base.redirect({ np: "classroom.studentlist", addType: stuType, startTime: oTime.startTime, endTime: oTime.endTime });
        })
    }

    //获取班级活跃度排名
    function getActive(oTime)
    {
        //startTime:startTime,//开始时间
        //endTime:endTime
        //容错
        function setActive()
        {
            $("#Grade0").html("一年级");
            $("#Class0").html("一班");
            $("#Live0").html("0.75");
            $("#Parti0").html("0.75");

        }
        function onSuc(aData) {
            if (aData.retCode != 0) {
                setActive();
                console.log("getClassSta failed:" + oTime.startTime + "-" + oTime.endTime);
                return;
            }
            var aResult = aData.result;
            if (aResult.length == 0)
            {
                return;
            }

            for (var i = 0; i < 5; i++)
            {
                $("#Grade" + i).html();
                $("#Class0" + i).html(aResult[i].classId);
                $("#Live0" + i).html(aResult[i].ActiveCnt);
                $("#Parti0" + i).html(aResult[i].ParticipantCnt);
            }
        }

        var oParam = {
            devSn: FrameInfo.ACSN,
            //years:years,   //入学年份  不指定查全校
            //classId:classId,//班级  空为全校
            //baseGrade,
        };
        $.extend(oParam, oTime);
        var option = {
            type: "POST",
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getClassSta",
                Param: oParam
            }),
            onSuccess: onSuc,
            onFailed: function () {
                setActive();
            }
        }
        //Utils.Request.sendRequest(option);
        setActive();
    }

    function setIntervalFlash() {
        var endTime = (new Date()).getTime();
        var startTime = endTime - 10000;
        var oTime = {
            startTime: startTime,
            endTime: endTime
        }
        initAddListen(oTime);
        getStudentPresentSta(oTime);
        getHeartBeatData(oTime);
        getActive(oTime);
    }

    function insertGlobalData(res){
        $.extend(g_normal,res.normal);
        $.extend(g_general,res.general);
        $.extend(g_serious,res.serious);
    }
    function http_getAlertCount(cBack){

        var demoList = {normal: {nCount: 8, nStartTime: "", nEndTime: ""},
            general: {nCount: 2, nStartTime: "", nEndTime: ""},
            serious: {nCount: 10, nStartTime: "", nEndTime: ""},}
        function onSuccess(data){
            if (data.retCode == 0){ //0 代表成功
                cBack(data.result);
            }else{
                cBack(demoList);
            }
        }

        function onFailed(){
            cBack(demoList);
        }

        var ajax = {
            type: 'POST',
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getCrowdAlarmlNum",
                Param:{
                    devSn:FrameInfo.ACSN
                }
            }),
            onSuccess:onSuccess,
            onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }

    function getAlertCount(){
        http_getAlertCount(function(res){
            insertGlobalData(res);
            document.getElementById("critical").innerText = res.serious.nCount;
            document.getElementById("emergency").innerText = res.general.nCount;
            document.getElementById("warning").innerText = res.normal.nCount;
        });
    }

    function initData() {
        var nMonthDays;
        var nYearDays;
        var endTime = (new Date()).getTime();
        var nGetYear = (new Date(endTime)).getFullYear();
        var nGetMonth = (new Date(endTime)).getMonth() + 1;
        if ((nGetYear%4==0 && nGetYear%100!=0)||(nGetYear%100==0 && nGetYear%400==0) ) {
            nYearDays = 366;
            switch (nGetMonth) {
                case 2:
                    {
                        nMonthDays = 29;
                        break;
                    }
                case 4:
                case 6:
                case 9:
                case 11:
                    {
                        nMonthDays = 30;
                        break;
                    }
                default:
                    nMonthDays = 31;
                    break;
            }
        } else {
            nYearDays = 365;
            switch (nGetMonth) {
                case 2:
                    {
                        nMonthDays = 28;
                        break;
                    }
                case 4:
                case 6:
                case 9:
                case 11:
                    {
                        nMonthDays = 30;
                        break;
                    }
                default:
                    nMonthDays = 31;
                    break;
            }
        }
        var startTime = endTime - 3600000;
        $(".xx-link").removeClass("active");
        $("#week.xx-link").addClass("active");
        g_oTime = {
            startTime:startTime,
            endTime:endTime,
            method:'aWeek'
        }
        getStudentPresentRatio(g_oTime);
        $(".xx-link").on('click',function(e){
            $(".xx-link").removeClass("active");
            $(this).addClass("active");
            var sId = $(this).attr("id");
            switch (sId) {
                // case 'hour':
                //     {
                //         g_oTime = {
                //             startTime: endTime - 3600000,
                //             endTime: endTime,
                //             method: 'hour'
                //         }
                //         break;
                //     }
                // case 'day':
                //     {
                //         g_oTime = {
                //             startTime: endTime - 3600000 * 24,
                //             endTime: endTime,
                //             method: 'day'
                //         }
                //         break;
                //     }
                case 'week':
                    {
                        g_oTime = {
                            startTime: endTime - 3600000 * 24 * 7,
                            endTime: endTime,
                            method: 'aWeek'
                        }
                        break;
                    }
                case 'month':
                    {
                        g_oTime = {
                            startTime: endTime - 3600000 * 24 * nMonthDays,
                            endTime: endTime,
                            method: 'aMonth'
                        }
                        break;
                    }
                // case 'year':
                //     {
                //         g_oTime = {
                //             startTime: endTime - 3600000 * 24 * nYearDays,
                //             endTime: endTime,
                //             method: 'year'
                //         }
                //         break;
                //     }
                default:
                    {
                        g_oTime = {
                            startTime: startTime,
                            endTime: endTime,
                            method: 'aWeek'
                        };
                        break;
                    }
            }
            getStudentPresentRatio(g_oTime);
        });
        if (Timer_Interval) {
            clearInterval(Timer_Interval);
        }

        //nError_Interval = 0;

        setIntervalFlash();

        Timer_Interval = setInterval(setIntervalFlash,10000);

        initSlist();
        getAlertCount();
    }

    function initGrid() {
        drawStepList();

        $("#serious").click(function(){
            if(g_serious.nEndTime != 0){
                Utils.Base.redirect({ np: "classroom.safenotice_campus", nStartTime:g_serious.nStartTime, nEndTime:g_serious.nEndTime, alarmlevel:g_serious.alarmlevel});
            }
        });

        $("#general").click(function(){
            if(g_general.nEndTime != 0){
                Utils.Base.redirect({ np: "classroom.safenotice_campus", nStartTime:g_general.nStartTime, nEndTime:g_general.nEndTime, alarmlevel:g_general.alarmlevel});
            }
        });

        $("#normal").click(function(){
            if(g_normal.nEndTime != 0){
                Utils.Base.redirect({ np: "classroom.safenotice_campus", nStartTime:g_normal.nStartTime, nEndTime:g_normal.nEndTime, alarmlevel:g_normal.alarmlevel});
            }
        });
    }


    function getMapList() {
        return Utils.Request.sendRequest({
            type: 'POST',
            url: MyConfig.v2path + '/location/LocationImage',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                userId: FrameInfo.g_user.user,
                shopName: Utils.Device.deviceInfo.shop_name
            })
        })
    }

    /*function initCanvas(imgPath) {
        var img = new Image();
        img.src = imgPath;
        img.onload = function () {
            var img = this;
            var srcWidth = img.width;
            var srcHeight = img.height;

            var canvas = document.getElementById('myCanvas');
            $('#canvasContain').css({ 'width': srcWidth, height: srcHeight });
            // var parentWidth = canvas.parentElement.offsetWidth;
            // var parentHeight = srcHeight * (parentWidth / srcWidth);
            // canvas.width = parentWidth;
            // canvas.height = parentHeight;
            canvas.width = srcWidth;
            canvas.height = srcHeight;

            var cxt = canvas.getContext('2d');
            cxt.drawImage(img, 0, 0, srcWidth, srcHeight);

            //init echart width & height
            var echart = document.getElementById('heat-map');
            echart.style.width = srcWidth + 'px';
            echart.style.height = srcHeight + 'px';
            g_imgWidth = srcWidth;
            g_imgHeight = srcHeight;


            echartUpdate();
            Timer_Interval1 = setInterval(echartUpdate, 10000);
            //echartUpdate(heatData);
        }
    }*/
    function initCanvasNoscroll(imgPath) {
        var img = new Image();
        img.src = imgPath;
        img.onload = function () {
            var img = this;
            var srcWidth = img.width;
            var srcHeight = img.height;
            var canvas = document.getElementById('myCanvas');
            var parentWidth = canvas.parentElement.offsetWidth;
            var parentHeight = srcHeight * (parentWidth / srcWidth);
            g_scale = parentWidth / srcWidth;
            $('#canvasContain').css({ 'width': parentWidth, height: parentHeight });
            canvas.width = parentWidth;
            canvas.height = parentHeight;
            var cxt = canvas.getContext('2d');
            cxt.drawImage(img, 0, 0, parentWidth, parentHeight);
            //init echart width & height
            /*var echart = document.getElementById('heat-map');
            echart.style.width = parentWidth + 'px';
            echart.style.height = parentHeight + 'px';*/
            $('#heat-map').css({ 'width': parentWidth, height: parentHeight });
            g_imgWidth = parentWidth;
            g_imgHeight = parentHeight;
            //echartUpdate();
            if(Timer_Interval1){
                clearInterval(Timer_Interval1)
            }
            echartUpdatebyscale();
            Timer_Interval1 = setInterval(echartUpdatebyscale, 10000);
            //echartUpdate(heatData);
        }
    }

    function _init() {
        
        function setBreadContent(paraArr){
            
            $("#bread_index").css("display",'inline');
            $("#bread_index a").attr("href","#C_CDashboard");
            $("#bread_index a").text("物联校园(校长)");
            
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
                        {text:'',href:''},
                        {text:'校园概览',href:''}]);
                        
        getMapList().done(function (data) {
            // init singleselect data;
            var aData = data.locationImage;
            var oOpt = {
                displayField: 'locationName',
                valueField: 'imagePath'
            }
            $('#MapSelect').singleSelect('InitData', aData, oOpt);

            $('#MapSelect').on('change', function (e, locationName, imgPath) {
                if (typeof locationName !== "undefined" && typeof imgPath !== "undefined") {
                    sessionStorage.imgPath = imgPath;
                    sessionStorage.locationName = locationName;
                    $("#s2id_MapSelect span.select2-chosen").html(sessionStorage.locationName);
                }
                else {
                sessionStorage.imgPath = $('#MapSelect').singleSelect('value');
                sessionStorage.locationName = $("#s2id_MapSelect span").html();
                }
                // setheatmap(locationName, imgPath);
                initCanvasNoscroll(MyConfig.path + '/wloc/map' + sessionStorage.imgPath);
            });

            // init canvas
            if (typeof sessionStorage.imgPath !== "undefined" &&
                typeof sessionStorage.locationName !== "undefined") {
                initCanvasNoscroll(MyConfig.path + '/wloc/map' + sessionStorage.imgPath);
                $("#s2id_MapSelect span.select2-chosen").html(sessionStorage.locationName);
                $('#MapSelect').trigger('change', [sessionStorage.locationName, sessionStorage.imgPath]);
            }
            else {
                initCanvasNoscroll(MyConfig.path + '/wloc/map' + aData[0].imagePath);
                $("#s2id_MapSelect span.select2-chosen").html(sessionStorage.locationName);
                $('#MapSelect').trigger('change');
            }

        })
        //geMapList();
       aDay = [];
       aWeek = [];
       aMonth = [];
       aYear = [];
       initGrid();
       initData();
    }

    function _destroy() {
        clearInterval(Timer_Interval1);
        clearInterval(Timer_Interval);
        //clearInterval(Timer_Interval1);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Echart", 'SingleSelect'],
        "utils": ["Request", "Base", 'Device']
    });
})(jQuery);