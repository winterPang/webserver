;(function($){
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".campusdashboard_teacher";
    var v2path = MyConfig.v2path;
    var Timer_Interval = null;

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

    //获取在校学生、请假学生、未请假学生数量、从未离校学生数量
    function getStudentPresentSta(oTime) {
        //result:["totalCnt","PresentCnt","leaveCnt","noleaveCnt"]
        function onSuc(aData) {
            if (aData.retCode != 0) {
                drawAllStudentPie(5,4,1,0,0);
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
            years:1472659200000,
            classId:"1",
            baseGrade:0,
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
            timeout:20000,
            onSuccess: onSuc,
            onFailed: function () {
                drawAllStudentPie(5,4,1,0,0);
                console.log("drawAllStudentPie Failed");
            }
        }
        Utils.Request.sendRequest(option);

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
        switch (cell) {
            case 1:
                {
                    var title = value + "班";
                    var value = dataContext["classId"];
                    return "<p title='" + title + "'>" + value + "班</p>";
                }

            default:
                break;
        }
        return false;

    }

    //班内成绩排名
    function drawGradeList() {
        var opt = {
            colNames: getRcText("SLIST_GRADE"),
            showHeader: true,
            multiSelect: false,
            pageSize: 4,
            rowHeight: 45.25,
            //asyncPaging: true,
            colModel: [
                { name: 'studentId', datatype: "String" },
                { name: 'studentName', datatype: "String" },
                { name: 'sex', datatype: "String" },
                { name: 'age', datatype: "String" },
                { name: 'grade', datatype: "String" }
            ]
        };
        $("#gradePrintList").SList("head", opt);

        var slitData = [
            {studentId:"00001",studentName:"管日臻",sex:"男",age:"12",grade:"98"},
            {studentId:"00002",studentName:"袁月坤",sex:"男",age:"13",grade:"94"},
            {studentId:"00003",studentName:"刘新菊",sex:"女",age:"11",grade:"91"},
            {studentId:"00004",studentName:"王大鹏",sex:"男",age:"11",grade:"88"}
        ];

        $("#gradePrintList").SList("refresh", slitData);
    }

    //班内举手详细信息
    function drawRaiseHandDetailList() {
        var opt = {
            colNames: getRcText("SLIST_RAISEHAND"),
            showHeader: true,
            multiSelect: false,
            pageSize: 4,
            rowHeight: 45.25,
            //asyncPaging: true,
            colModel: [
                { name: 'studentId', datatype: "String" },
                { name: 'studentName', datatype: "String" },
                { name: 'sex', datatype: "String" },
                { name: 'age', datatype: "String" },
                { name: 'raiseHand', datatype: "String" }
            ]
        };
        $("#raiseHandDetail").SList("head", opt);

        var slitData = [
            {"studentId":"00004","studentName":"王大鹏",sex:"男",age:"9",raiseHand:"23"},
            {"studentId":"00003","studentName":"刘新菊",sex:"女",age:"8",raiseHand:"12"},
            {"studentId":"00002","studentName":"袁月坤",sex:"男",age:"9",raiseHand:"9"},

            {"studentId":"00001","studentName":"白晓棠",sex:"女",age:"10",raiseHand:"4"},
            {"studentId":"00005","studentName":"张帅",sex:"男",age:"10",raiseHand:"4"},
            {"studentId":"00006","studentName":"张思宇",sex:"女",age:"9",raiseHand:"4"},
            {"studentId":"00007","studentName":"程柯南",sex:"男",age:"8",raiseHand:"4"},
            {"studentId":"00008","studentName":"刘艳梅",sex:"女",age:"9",raiseHand:"4"},
            {"studentId":"00009","studentName":"任文慧",sex:"男",age:"10",raiseHand:"4"},
            {"studentId":"00010","studentName":"宋媛",sex:"女",age:"10",raiseHand:"4"},
            {"studentId":"00011","studentName":"东洋洋",sex:"男",age:"9",raiseHand:"4"},
            {"studentId":"00012","studentName":"李正鹏",sex:"男",age:"8",raiseHand:"4"},
            {"studentId":"00013","studentName":"张半琪",sex:"女",age:"9",raiseHand:"4"},
            {"studentId":"00014","studentName":"李尚林",sex:"男",age:"10",raiseHand:"4"},
            {"studentId":"00015","studentName":"万雨晨",sex:"女",age:"11",raiseHand:"4"},
            {"studentId":"00016","studentName":"李博一",sex:"女",age:"12",raiseHand:"4"},
            {"studentId":"00017","studentName":"陈尔鼎",sex:"男",age:"10",raiseHand:"4"},
            {"studentId":"00018","studentName":"陈佳坤",sex:"女",age:"9",raiseHand:"4"},
            {"studentId":"00019","studentName":"陈鹏旭",sex:"男",age:"10",raiseHand:"4"},
            {"studentId":"00020","studentName":"陈颖柯",sex:"男",age:"8",raiseHand:"4"},
            {"studentId":"00021","studentName":"董晨",sex:"女",age:"11",raiseHand:"4"},
            {"studentId":"00022","studentName":"范木子",sex:"男",age:"11",raiseHand:"4"},
            {"studentId":"00023","studentName":"方淳",sex:"男",age:"10",raiseHand:"4"},
            {"studentId":"00024","studentName":"傅璐瑶",sex:"男",age:"12",raiseHand:"4"},
            {"studentId":"00025","studentName":"顾冠青",sex:"女",age:"12",raiseHand:"4"},
            {"studentId":"00026","studentName":"顾雍戴",sex:"女",age:"11",raiseHand:"3"},
            {"studentId":"00027","studentName":"何心慧",sex:"男",age:"12",raiseHand:"3"},
            {"studentId":"00028","studentName":"施卜爱",sex:"男",age:"10",raiseHand:"3"},
            {"studentId":"00029","studentName":"施雨非",sex:"男",age:"12",raiseHand:"3"},
            {"studentId":"00030","studentName":"孙澜",sex:"女",age:"9",raiseHand:"3"},
            {"studentId":"00031","studentName":"天宇",sex:"男",age:"8",raiseHand:"3"},
            {"studentId":"00032","studentName":"童萧磊",sex:"男",age:"12",raiseHand:"3"},
            {"studentId":"00033","studentName":"图雷鸣",sex:"女",age:"10",raiseHand:"3"},
            {"studentId":"00034","studentName":"王萧宇",sex:"男",age:"11",raiseHand:"3"},
            {"studentId":"00035","studentName":"吴佳辰",sex:"男",age:"12",raiseHand:"3"},
            {"studentId":"00036","studentName":"许智范",sex:"女",age:"12",raiseHand:"3"},
            {"studentId":"00037","studentName":"孙荣达",sex:"男",age:"10",raiseHand:"3"},
            {"studentId":"00038","studentName":"杨宗航",sex:"女",age:"11",raiseHand:"3"},
            {"studentId":"00039","studentName":"孙家燕",sex:"男",age:"12",raiseHand:"3"},
            {"studentId":"00040","studentName":"张艺芳",sex:"女",age:"12",raiseHand:"3"},
            {"studentId":"00041","studentName":"陈轩",sex:"女",age:"10",raiseHand:"3"},
            {"studentId":"00042","studentName":"陈逸昂",sex:"男",age:"12",raiseHand:"3"},
            {"studentId":"00043","studentName":"戴杨钰",sex:"男",age:"8",raiseHand:"3"},
            {"studentId":"00044","studentName":"单文静",sex:"男",age:"12",raiseHand:"2"},
            {"studentId":"00045","studentName":"丁信文",sex:"女",age:"8",raiseHand:"2"},
            {"studentId":"00046","studentName":"丁原",sex:"女",age:"12",raiseHand:"2"},
            {"studentId":"00047","studentName":"方楚",sex:"男",age:"12",raiseHand:"2"},
            {"studentId":"00048","studentName":"郭盈",sex:"男",age:"9",raiseHand:"2"},
            {"studentId":"00049","studentName":"何涛",sex:"男",age:"12",raiseHand:"2"},
            {"studentId":"00050","studentName":"胡启昊",sex:"女",age:"8",raiseHand:"2"},
            {"studentId":"00051","studentName":"何韵颜",sex:"男",age:"12",raiseHand:"2"},
            {"studentId":"00052","studentName":"施然",sex:"女",age:"9",raiseHand:"2"},
            {"studentId":"00053","studentName":"孙素颖",sex:"男",age:"12",raiseHand:"2"},
            {"studentId":"00054","studentName":"杨任叶子",sex:"男",age:"8",raiseHand:"1"},
            {"studentId":"00055","studentName":"汪翰晨",sex:"女",age:"12",raiseHand:"1"},
            {"studentId":"00056","studentName":"王者",sex:"男",age:"9",raiseHand:"1"},
            {"studentId":"00057","studentName":"徐文博",sex:"男",age:"12",raiseHand:"1"},
            {"studentId":"00058","studentName":"陈书北",sex:"女",age:"10",raiseHand:"1"},
            {"studentId":"00059","studentName":"尹伟",sex:"男",age:"12",raiseHand:"1"},
            {"studentId":"00060","studentName":"吴语",sex:"女",age:"11",raiseHand:"1"},

        ];

        $("#raiseHandDetail").SList("refresh", slitData);
    }

    //班内个人健康数据排名(步数)
    function drawHealthList() {
        var opt = {
            colNames: getRcText("SLIST_HEALTH"),
            showHeader: true,
            multiSelect: false,
            pageSize: 4,
            rowHeight: 45.25,
            //asyncPaging: true,
            colModel: [
                { name: 'studentId', datatype: "Number" },
                { name: 'studentName', datatype: "String" },
                { name: 'sex', datatype: "String" },
                { name: 'age', datatype: "String" },
                { name: 'step', datatype: "String" },
                { name: 'rank', datatype: "String" }
            ]
        };
        $("#footPrintList").SList("head", opt);

    }

    function initAddListen(oTime) {
        //pieStyle
        $(".text-style").live("click", function () {
            var stuType = $(this).find("div").attr("type");
            Utils.Base.redirect({ np: "classroom.studentlist_teacher", addType: stuType, startTime: oTime.startTime, endTime: oTime.endTime });
        });
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
                '<span class="leg-title"'+'">'+nItem[j].name+'</span>'+
                '<span class="leg-percent" style="float:right;">'+nPercent+'</span>'+
                '</div>';
            jPanel.append(nHtml);
            if( j == 7){
                return;
            }
        }
    }

    function getStudentRaiseHandSta()
    {
        var option = {
            //height: 170,
            tooltip: {
                trigger: 'item',
                formatter: " {b}: {d}%"
            },
            calculable: false,
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '45%'],
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
                                show : true,
                                position : 'center',
                                textStyle : {
                                    fontSize : '16'
                                },
                                formatter: function (a) {
                                    return (a.name + ":" +"\n"+ a.value + "人");
                                }
                            }
                        }
                    },
                    data: [{value: 57,name: "5次以下"},
                        {value: 1,name: "5-10次"},
                        {value: 1,name: "10-20次"},
                        {value: 1,name: "20次以上"}
                    ]
                }
            ]
        };
        var oTheme = {
            color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
        };
        var Jbody = $("#application_message");
        var Jopt = {
            data: [{value: 57,name: "5次以下"},
                {value: 1,name: "5-10次"},
                {value: 1,name: "10-20次"},
                {value: 1,name: "20次以上"}
            ],
            color: oTheme.color
        };
        /*
         饼状图旁边的图例列表
         */
        createLegend(Jbody, Jopt);
        $("#handRaise").echart("init", option, oTheme);

    }

    //获取学生健康数据 步数
    function getStudentHealthSta()
    {
        //容错
        function getStudentHealthTestSta()
        {
            var slitData = [
                {studentId:"00001",studentName:"管日臻",sex:"男",age:"12",step:"31200",rank:"1"},
                {studentId:"00002",studentName:"袁月坤",sex:"男",age:"13",step:"21200",rank:"2"},
                {studentId:"00003",studentName:"刘新菊",sex:"女",age:"11",step:"11200",rank:"3"},
                {studentId:"00004",studentName:"王大鹏",sex:"男",age:"11",step:"9200",rank:"4"}
            ];

            $("#footPrintList").SList("refresh", slitData);
        }
        function onSuc(aData)
        {
            if (aData.retCode != 0) {
                getStudentHealthTestSta();
                return;
            }
            var oResult = aData.result;
            if (oResult.length == 0)
            {
                return;
            }
            $("#footPrintList").SList("refresh", oResult);
        }

        var oParam = {
            devSn: FrameInfo.ACSN,
            years:1472659200000,
            classId:"1",
            baseGrade:0,
            //startTime:startTime,//开始时间
            //endTime:endTime
        }
        var option = {
            type: "POST",
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getClassHealthRank",
                Param: oParam
            }),
            timeout:20000,
            onSuccess: onSuc,
            onFailed: function () {
                getStudentHealthTestSta();
            }
        }
        Utils.Request.sendRequest(option);
    }


    function setIntervalFlash() {
        var endTime = (new Date()).getTime();
        var startTime = endTime - 10000;
        var oTime = {
            startTime: startTime,
            endTime: endTime
        };
        initAddListen(oTime);
        getStudentPresentSta(oTime);
        getStudentRaiseHandSta();
        getStudentHealthSta();

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
                Method: "getCrowdInfobyClass",
                Param:{
                    devSn:FrameInfo.ACSN,
                    years:1472659200000,
                    classId:"1",
                    baseGrade:0
                }
            }),
            timeout:20000,
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
        if (Timer_Interval) {
            clearInterval(Timer_Interval);
        }

        nError_Interval = 0;

        setIntervalFlash();

        getAlertCount();
        Timer_Interval = setInterval(setIntervalFlash,30000);

    }

    function initGrid() {
        drawHealthList();
        drawGradeList();
        drawRaiseHandDetailList();
    }

    function openDlgDetailInfo()
    {
        $("#Detail_form").form ("init", "edit", {"title":"举手详情",
            "btn_apply":false, "btn_cancel":false/*CancelShop*/});

        $("#RaiseHandDlg").modal("show");
        //var jScope = {scope: $("#RaiseHandDlg"), className: 'modal-super'};
        //Utils.Base.openDlg(null, {},jScope );
    }

    function initEvent()
    {
        function setBreadContent(paraArr){
            
            $("#bread_index").css("display",'inline');
            $("#bread_index a").attr("href","#C_CDashboard");
            $("#bread_index a").text("物联校园(教师)");
            
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
                        {text:'班级概览',href:''}]);
                        
        $("#detailMore").on("click", openDlgDetailInfo);
        $("#serious").click(function(){
            if(g_serious.nEndTime != 0){
                Utils.Base.redirect({ np: "classroom.studentlist_teacher", startTime:g_serious.nStartTime,
                    endTime:g_serious.nEndTime, alarmlevel:g_serious.alarmlevel, years:1472659200000,
                    classId:"1", baseGrade:0, addType:g_serious.alarmlevel});
            }
        });

        $("#general").click(function(){
            if(g_general.nEndTime != 0){
                Utils.Base.redirect({ np: "classroom.studentlist_teacher", startTime:g_general.nStartTime,
                    endTime:g_general.nEndTime, alarmlevel:g_general.alarmlevel, years:1472659200000,
                    classId:"1", baseGrade:0, addType:g_general.alarmlevel});
            }
        });

        $("#normal").click(function(){
            if(g_normal.nEndTime != 0){
                Utils.Base.redirect({ np: "classroom.studentlist_teacher", startTime:g_normal.nStartTime,
                    endTime:g_normal.nEndTime, alarmlevel:g_normal.alarmlevel, years:1472659200000,
                    classId:"1", baseGrade:0, addType:g_normal.alarmlevel});
            }
        });

    }

    function _init() {
        var selectData = ["总成绩","英语","语文","数学"];
        $("#gradeSelect").singleSelect("InitData", selectData);
        initGrid();
        initData();
        initEvent();
    }

    function _destroy() {
        //clearInterval(g_time);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Echart", 'SingleSelect','Form'],
        "utils": ["Request", "Base", 'Device']
    });
})(jQuery);