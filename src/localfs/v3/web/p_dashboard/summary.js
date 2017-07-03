;
(function($) {
    var MODULE_NAME = "p_dashboard.summary";
    var g_bflag = true;
    var g_oLineChart;
    var g_oResizeTimer;
    var g_oTimer;
    var g_sPort;
    var g_sStoreId = FrameInfo.Nasid;
    var g_jForm= null;
    var g_reportsFlag = false;
    var g_oPlotData = false;
    var g_oTimer = false;


    function getRcText(sRcId) {
        return Utils.Base.getRcString("app_syslog_rc", sRcId);
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

    function initClientCount() {
        //当前回头客 当前新宾客
        function getClientCount(onsuccess, onfail) {
            var getClientCountOpt = {
                type: "GET",
                url: MyConfig.path + "/visitor/onlinestatistics?devSN=" + FrameInfo.ACSN,
                dataType: "json",
                onSuccess: onsuccess,
                onFailed: onfail
            }
            Utils.Request.sendRequest(getClientCountOpt);
        }

        function ClientCountSuc(data, textStatus, jqXHR) {
            try {
                if (!('result' in data && data.result instanceof Object && 'new_count' in data.result && 'total_count' in data.result)) {
                    throw (new Error('data unexpected error'));
                }
                $("#online_new_user").text(data.result.new_count);
                $("#client-count").text(data.result.total_count - data.result.new_count);
            } catch (error) {
                console.log(error)
            } finally {

            }
        }

        function ClientCountFail(jqXHR, textStatus, error) {
            console.log("getClientCount Fail, errMsg:" + error);
        }

        getClientCount(ClientCountSuc, ClientCountFail);
    }



    function getCounts(newUserList) {
        var newlength = newUserList.length;
        for (var i = (count - 1); i >= 0; i--) {
            if (i >= newlength) {
                g_pv.push(0);
                g_pu.push(0);
                g_pv_pu.push(0);
                g_clickCount.push(0);
            } else {
                g_pv.push(newUserList[count - 1 - i].pv);
                g_pu.push(newUserList[count - 1 - i].pu);
                g_pv_pu.push(newUserList[count - 1 - i].pv_pu);
                g_clickCount.push(newUserList[count - 1 - i].clickCount);
            }
        }
    }

    function getDataSuc(data) {
        $("#ad-count").text(data.data[0].pv);
        $("#clickCount").text(data.data[0].clickCount);
    }

    function getDataFail() {

    }

    function aj_getnewuserMonth(para) {
        var ajax = {
            url: MyConfig.v2path + "/advertisement/queryBySpan" + "?ownerName=" + FrameInfo.g_user.user + "&storeId=" + g_sStoreId + "&devSN=" + FrameInfo.ACSN + para,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            //onSuccess:drowLoginChart,
            // onSuccess: function (data) {
            //     try {
            //         if(!('errorcode' in data && 'data' in data)){
            //             throw (new Error("data.errorcode"));
            //         }

            //         if (data.errorcode == 0) {
            //             callback(data.data);
            //         }
            //     }
            //     catch(error){
            //         console.log(error);
            //     }
            // },
            // onFailed:function(err){
            //     console.log(err);
            // }
            onSuccess: getDataSuc,
            onFailed: getDataFail
        }

        Utils.Request.sendRequest(ajax);
    }


    function initUserTodayCount() {
        var para;
        // var tenmin = 10 * 60 * 1000;
        // var oneHour = tenmin * 6;
        // var oneDay = oneHour * 24;
        // var oneWeek = oneDay * 7;
        // var oneMonth = oneDay * 30;
        // var oneYear = oneDay * 365;
        // var predate;
        // predate = new Date(curdate - oneDay);
        var weenHours = new Date();
        weenHours.setHours(0);
        weenHours.setMinutes(0);
        weenHours.setSeconds(0);
        var curdate = new Date();
        para = "&span=1296000000" + "&startTime=" + weenHours.getTime() + "&endTime=" + curdate.getTime();
        // aj_getnewuserMonth(para,function(newuser){
        // alert("00")
        // getCounts(newuser);
        // $("#ad-count").text(data.data[0].pu);
        // $("#clickCount").text(data.data[0].clickCount);
        // });
        aj_getnewuserMonth(para);
    }



    function initMonthDay() {

        var ClientList = new Array(30);
        var Nowtime = (new Date()).getTime();
        for (var i = 0; i < 30; i++) {
            ClientList[i] = [(new Date(Nowtime - ((29 - i) * 86400000))), 0];
        }
        return ClientList;

        // var Nowtime = (new Date());
        // var startTime = new Date(Nowtime - 2678400000);
        // var ClientList = new Array(31);
        // for (var i = 0; i < ClientList.length; i++) {
        //     ClientList[i] = [(new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, 0, 0)), 0];
        //     startTime = new Date(startTime.getTime() + 86400000);
        // }
        // return ClientList;
    }

    function initClientWeek() {
        var ClientList = new Array(7);
        var Nowtime = (new Date()).getTime();
        for (var i = 0; i < 7; i++) {
            ClientList[i] = [(new Date(Nowtime - ((6 - i) * 86400000))), 0];
        }
        return ClientList;
    }

    function initClientDay() {
        /*将一天分成24段*/
        var ClientList = new Array(24);
        var Nowtime = (new Date()).getTime();
        for (var i = 0; i < ClientList.length; i++) {
            ClientList[i] = [(new Date(Nowtime - ((ClientList.length - i - 1) * 3600000))), 0];
        }
        return ClientList;
    }

    function getOnlineVisitor(timeType, onSuccess, type) {
        function onFailed(jqXHR, textStatus, error) {
            console.log("getOnlineVisitor type【" + type + "】【error】:" + error);
        }

        var getOnlineStaOpt = {
            type: "GET",
            url: MyConfig.path + "/stamonitor/histclientstatistic" + "?devSN=" + FrameInfo.ACSN + "&statistic_type=" + timeType,
            //data: {
            //    devSN:FrameInfo.ACSN,
            //    startTime:startTime,
            //    endTime:endTime
            //},
            dataType: "json",
            onSuccess: onSuccess,
            onFailed: onFailed
        }

        Utils.Request.sendRequest(getOnlineStaOpt);
    }

    function drawdayClientCount() {
        var Nowtime = (new Date()).getTime();
        var OnedayAgotime = Nowtime - 86400000;
        var EndTime = getEnddate();
        var StartTime = getStartdate(OnedayAgotime);
        var ClientList = initClientDay();
        var fourHours = 60 * 60 * 1000;
        var type = "day";

        function getOnlineStaSuc(data, textStatus, jqXHR) {
            try {
                if (!('client_statistic' in data && data.client_statistic instanceof Array && data.client_statistic.length > 0)) {
                    throw (new Error('client_statistic not exist'));
                }
                for (var i = 0; i < data.client_statistic.length; i++) {

                    if (i != (data.client_statistic.length - 1)) {
                        var currentNode = new Date(data.client_statistic[i].updateTime);
                        var NextNode = new Date(data.client_statistic[i + 1].updateTime);
                        if ((currentNode.getDate() != NextNode.getDate()) ||
                            (currentNode.getMonth != NextNode.getMonth()) ||
                            (currentNode.getHours != NextNode.getHours())) {
                            for (var j = 0; j < ClientList.length; j++) {
                                if (ClientList[j][0].getHours() == currentNode.getHours()) {
                                    //ClientList[j][0] = currentNode;
                                    ClientList[j][1] = data.client_statistic[i].clientcount;
                                    break;
                                }
                            }
                        }
                    } else {
                        for (var h = 0; h < ClientList.length; h++) {

                            if (ClientList[h][0].getHours() == (new Date(data.client_statistic[i].updateTime)).getHours()) {
                                //ClientList[h][0] = new Date(data.OnLineClientList[i].updateTime);
                                ClientList[h][1] = data.client_statistic[i].clientcount;
                                break;
                            }
                        }
                    }
                    // var sub = currentNode - OnedayAgotime;
                    // if (sub > 0) {
                    //     var count = parseInt(sub / fourHours);
                    //     if (ClientList[count][1] < data.OnLineClientList[i].clientcount) {
                    //         ClientList[count][1] = data.OnLineClientList[i].clientcount;
                    //         ClientList[count][0] = currentNode;
                    //     }
                    // }
                }

            } catch (error) {
                console.log(error);

            } finally {
                initUserChange(ClientList);
            }
        }

        getOnlineVisitor("curDay", getOnlineStaSuc, type);

    }

    function drawWeekCliNum(aInData) {
        var aseries = [];
        var splitNumber;
        var Unit = 0;
        var Bandwidth = new Array("人");
        if (aInData.length > 8) {
            splitNumber = 9
        } else {
            splitNumber = aInData.length - 1;
        }
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    },
                    lineStyle: {
                        width: 0
                    }
                }
            },
            name: getRcText ("CLINUM"),
            data: aInData
        };
        aseries.push(oTemp);
        var option = {
            width: "100%",
            height: "230px",
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: function(params) {
                    var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                    if (params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + "人";
                    return string;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: "#94DAD0", //'#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "center",
                // x: "right",
                // itemWidth: 12,//default 20
                itemWidth: 8, //default 20
                // textStyle: { color: '#617085', fontSize: "12px" },
                textStyle: {
                    color: '#9AD4DC',
                    fontSize: "12px"
                },
                data: [getRcText ("CLINUM")]
            },
            grid: {
                x: 40,
                y: 20,
                x2: 22,
                y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [{
                splitNumber: splitNumber,
                type: 'time',
                splitLine: true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#617085',
                        fontSize: "12px"
                    },
                    formatter: function(data) {
                        return (data.getMonth() + 1) + "-" + data.getDate();
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#AEAEB7',
                        width: 1
                    }
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
                name: Bandwidth[Unit],
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#eee']
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#617085',
                        fontSize: "12px",
                        width: 2
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#AEAEB7',
                        width: 1
                    }
                }
            }],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2'],
            categoryAxis: {
                splitLine: {
                    lineStyle: {
                        color: ['#FFF']
                    }
                }
            }
        };
        $("#userchange").echart("init", option, oTheme);
    }

    function drawWeekClientCount() {
        var Nowtime = (new Date()).getTime();
        var OneweeksAgotime = Nowtime - 604800000;
        var EndTime = getEnddate();
        var StartTime = getStartdate(OneweeksAgotime);
        var ClientList = initClientWeek();
        var type = "week";
        //fail
        function getOnlineStaSuc(data, textStatus, jqXHR) {
            try {
                if (!('client_statistic' in data && data.client_statistic instanceof Array && data.client_statistic.length > 0)) {
                    throw (new Error('client_statistic not exist'));
                }
                for (var i = 0; i < data.client_statistic.length; i++) {
                    if (i != (data.client_statistic.length - 1)) {

                        var currentNode = new Date(data.client_statistic[i].time);
                        var NextNode = new Date(data.client_statistic[i + 1].time);
                        if ((currentNode.getDate() != NextNode.getDate()) || (currentNode.getMonth != NextNode.getMonth())) {
                            for (var j = 0; j < ClientList.length; j++) {
                                if (ClientList[j][0].getDate() == currentNode.getDate()) {
                                    //ClientList[j][0] = currentNode;
                                    ClientList[j][1] = data.client_statistic[i].count;
                                    break;
                                }
                            }
                        }
                    } else {
                        for (var h = 0; h < ClientList.length; h++) {

                            if (ClientList[h][0].getDate() == (new Date(data.client_statistic[i].time)).getDate()) {
                                //ClientList[h][0] = new Date(data.OnLineClientList[data.OnLineClientList.length - 1].updateTime);
                                ClientList[h][1] = data.client_statistic[i].count;
                                break;
                            }
                        }
                    }
                }

            } catch (error) {
                console.log(error);
            } finally {
                drawWeekCliNum(ClientList);
            }
        }

        getOnlineVisitor("oneWeek", getOnlineStaSuc, type);

    }

    function drawMonthClientCount() {
        var Nowtime = (new Date()).getTime();
        var OnemounthAgotime = Nowtime - 2678400000;
        var EndTime = getEnddate();
        var StartTime = getStartdate(OnemounthAgotime);
        var ClientList = initMonthDay();
        var type = "month";

        function getOnlineStaSuc(data, textStatus, jqXHR) {
            try {
                if (!('client_statistic' in data && data.client_statistic instanceof Array && data.client_statistic.length > 0)) {
                    throw (new Error('client_statistic not exist'));
                }
                for (var i = 0; i < data.client_statistic.length; i++) {
                    if (i != (data.client_statistic.length - 1)) {

                        var currentNode = new Date(data.client_statistic[i].time);
                        var NextNode = new Date(data.client_statistic[i + 1].time);
                        if ((currentNode.getDate() != NextNode.getDate()) || (currentNode.getMonth() != NextNode.getMonth())) {
                            for (var j = 0; j < ClientList.length; j++) {
                                if ((ClientList[j][0].getDate() == currentNode.getDate()) &&
                                    (ClientList[j][0].getMonth() == currentNode.getMonth())) {
                                    //ClientList[j][0] = currentNode;
                                    ClientList[j][1] = data.client_statistic[i].count;
                                    break;
                                }
                            }
                        }
                    } else {

                        for (var h = 0; h < ClientList.length; h++) {
                            if (ClientList[h][0].getDate() == (new Date(data.client_statistic[i].time))) {
                                ClientList[h][0] = new Date(data.OnLineClientList[i].time);
                                ClientList[h][1] = data.client_statistic[i].count;
                                break;
                            }
                        }
                    }
                }

            } catch (error) {
                console.log('getOnlineStaSuc Error:' + error);

            } finally {
                drawWeekCliNum(ClientList);
            }
        }

        //getOnlineSta(StartTime, EndTime, getOnlineStaSuc, type);
        getOnlineVisitor("oneMonth", getOnlineStaSuc, type);

    }

    function initUserChange1(type) {
        //在线宾客变化
        function getUserChange(startTime, endTime, onsuccess) {
            function onfail(jqXHR, textStatus, error) {
                console.log("getUserChange error:" + error);
            }

            var getUserChangeOpt = {
                type: "GET",
                url: MyConfig.path + "/stamonitor/web/histolclient",
                data: JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    startTime: startTime,
                    endTime: endTime
                }),
                contentType: "application/json",
                dataType: "json",
                onSuccess: onsuccess,
                onFailed: onfail
            }
            Utils.Request.sendRequest(getUserChangeOpt);
        }

        var nowTime = new Date();
        var preTime = (new Date()).setDate(nowTime.getDate() - 1);

        function getUserChangeSuc(data, textStatus, jqXHR) {
            if (!(typeof(data) == "object" && 'OnLineClientList' in data)) {
                console.log('OnLineClientList not exist');
                return;
            }
            data = data.OnLineClientList;
            if (data.length == 0) {
                return;
            }

        }

        getUserChange(preTime, nowTime, getUserChangeSuc);

    }

    function initUserChange(aInData) {
        var aseries = [];
        var Unit = 0;
        var Bandwidth = new Array(getRcText("PEOPLE"));
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    },
                    lineStyle: {
                        width: 0
                    }
                }
            },
            name: getRcText ("CLINUM"),
            data: aInData
        };
        aseries.push(oTemp);
        var option = {
            width: "100%",
            height: "230px",
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: function(params) {
                    var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                    if (params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + getRcText("PEOPLE");
                    return string;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: "#94DAD0", //'#373737',
                        width: 0,
                        type: 'solid'
                    }
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                // x: "right",
                x: "center",
                itemWidth: 8, //default 20
                // itemWidth: 12,//default 20
                textStyle: {
                    color: '#617085',
                    fontSize: "12px"
                },
                // textStyle: { color: '#9AD4DC', fontSize: "12px" },
                data: [getRcText ("CLINUM")]
            },
            grid: {
                x: 30,
                y: 20,
                x2: 22,
                y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [{
                type: 'time',
                splitLine: true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#617085',
                        fontSize: "12px"
                    },
                    formatter: function(data) {
                        return getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#AEAEB7',
                        width: 1
                    }
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
                name: Bandwidth[Unit],
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#eee']
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#617085',
                        fontSize: "12px",
                        width: 2
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#AEAEB7',
                        width: 1
                    }
                }
            }],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2'],
            categoryAxis: {
                splitLine: {
                    lineStyle: {
                        color: ['#FFF']
                    }
                }
            }
        };
        $("#userchange").echart("init", option, oTheme);
    }

    // function Interval()
    // {   
    //     function getApsFlowSuc (data) {
    //         var sTime = new Date();
    //         sTime = sTime.toTimeString().split(" ")[0];
    //         sTime = sTime.split(":")[0]+":"+sTime.split(":")[1];
    //         g_hLine.addPoint([data.ap_statistic.online, data.ap_statistic.offline, data.ap_statistic.other], sTime);
    //         if(g_oTimer)
    //         {
    //             clearTimeout(g_oTimer);
    //         }
    //         g_oTimer = setTimeout(Interval,900000); 
    //     }
    //     function getApsFlowFail (data) {
    //         // body...
    //     }
    //     if(g_hLine)
    //     {  
    //         var apsFlowOpt = {
    //             url: MyConfig.path+"/apmonitor/getApCountByStatus",
    //             type: "GET",
    //             dataType:"json",
    //             data:{
    //                 devSN:FrameInfo.ACSN
    //             },
    //             onSuccess:getApsFlowSuc,
    //             onFailed:getApsFlowFail
    //         } 
    //         Utils.Request.sendRequest(apsFlowOpt); 
    //     }
    // }



    //---------当没有数据时显示的灰色饼图
    function drawEmptyPie(jEle) {
        var option = {
            height: 245,
            calculable: false,
            series: [{
                type: 'pie',
                radius: '55%',
                center: ['50%', '30%'],
                itemStyle: {
                    normal: {
                        // borderColor:"#FFF",
                        // borderWidth:1,
                        labelLine: {
                            show: false
                        },
                        label: {
                            position: "inner"
                        }
                    }
                },
                data: [{
                    name: 'N/A',
                    value: 1
                }]
            }]
        };
        var oTheme = {
            color: ["rgba(216, 216, 216, 0.75)"]
        };

        jEle.echart("init", option, oTheme);
    }



    // function drawEmptyPie () 
    // {
    //     var option = {
    //         height:160,
    //         calculable : false,
    //         series : [
    //             {
    //                 type:'pie',
    //                 minAngle: '3',
    //                 radius : '80%',
    //                 center: ['55%', '50%'],
    //                 itemStyle: {
    //                     normal: {
    //                         labelLine:{
    //                             show:false
    //                         },
    //                         label:
    //                         {
    //                             position:"inner"
    //                         }
    //                     }
    //                 },
    //                 data: [{name:'N/A',value:1}]
    //             }
    //         ]
    //     };
    //     var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
    //    $("#pie_termibal").echart("init", option,oTheme);
    // }

    function getPortalStaSuc(oData) {
        // function getModeList(ArrayT) {
        //     var atemp = [];
        //     $.each(ArrayT, function(index, iArray) {
        //         atemp.push({
        //             "devSN": iArray.devSN,
        //             "devMode": iArray.devMode,
        //         });
        //     });

        //     return atemp;
        // }

        // function onClickPie(oPiece) {
        //     $.ajax({
        //         url: MyConfig.path + "/devmonitor/statistic_bymode_detail",
        //         type: "GET",
        //         dataType: "json",
        //         data: {
        //             devMode: oPiece.name,
        //             skipnum: 0,
        //             limitnum: 100000
        //         },
        //         success: function(data) {
        //             var all = getModeList(data.acList);
        //             $("#ByPortalPopList").SList("refresh", all);
        //             Utils.Base.openDlg(null, {}, {
        //                 scope: $("#ByPortal_diag"),
        //                 className: "modal-super dashboard"
        //             });
        //             return false;
        //         },
        //         error: function() {

        //         }
        //     });
        //     // var all =[{'mac':'AB-32-CD-EF-DD-EE','ip':'192.168.10.2','firm':'苹果','ap':'ap1','ssid':'12345678'}];
        //     // $("#ByPortalPopList").SList("refresh",all);
        //     // Utils.Base.openDlg(null, {}, {scope:$("#ByPortal_diag"),className:"modal-super dashboard"});
        // }
        if (oData.clientList[0].totalCount == 0) {
            drawEmptyPie($("#pie_terminal"));
            return;
        }
        var aSatus = getRcText("PORTALSTA").split(',');
        var data =[
            { name:aSatus[0],value:oData.clientList[0].conditionCount},    
            { name:aSatus[1],value:oData.clientList[0].totalCount - oData.clientList[0].conditionCount}
        ];
        var option = {
            animation: true,
            calculable: false,
            height: 160,
            tooltip: {
                show: true,
                formatter: function(aData) {
                    var sLable = aData[1] + ":<br/> " + aData[2] + " (" + Math.round(aData[3]) + "%)";
                    return sLable;
                }
            },
            series: [{
                    name: 'APs',
                    type: 'pie',
                    minAngle: '3',
                    radius: '100%',
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            borderColor: "#FFF",
                            borderWidth: 1,
            
                            labelLine: false
                        },
                        emphasis: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#000"
                                }
                            },
                            labelLine: false
                        }
                    },
                    data: data
                }

            ]
            // click: onClickPie
        };
        var oTheme = {
            color: ["#4ec1b2", "#E7E7E9"]
        };
        $("#pie_terminal").echart("init", option, oTheme);

    }
    function getPortalStaFail(){
        console.log('...');
    }
    function drawPortalPie(){
        var portalSta = {
            url: MyConfig.path + "/stamonitor/getclientlistbycondition",
            type: "GET",
            dataType: "json",
            data: {
                devSN: FrameInfo.ACSN,
                reqType:'all'
            },
            onSuccess:getPortalStaSuc,
            onFailed: getPortalStaFail
        }
        Utils.Request.sendRequest(portalSta);
    }
    function openDalg(aType, sName, type) {
        // var aData = g_allInfor[aType[nIndex]][sName];
        // if($.isPlainObject(aData))
        // {
        //     aData = g_allInfor[aType[nIndex]][sName].aData;
        // }
        // $("#popList").SList("refresh",aData);
        //根据"ap名/SSID/手机厂商/无线模式"获取终端详细列表
        //第1次获取数据        
        var valueOflimitnum = 10000;

        var dijici = 0;
        var valueOfskipnum = (parseInt(valueOflimitnum)) * (parseInt(dijici));

        getData();


        //方法定义
        function getData() {

            if (type == "ap") {
                var url = MyConfig.path + "/stamonitor/getclientstatisticbyap_detail?devSN=" + FrameInfo.ACSN;
                var valueOfapName = "" + sName + "";
                var valueOfbandType = "" + aType + "";

                // var requestData = {
                //     "apName":valueOfapName,"bandType":valueOfbandType,"skipnum":valueOfskipnum,"limitnum":valueOflimitnum
                // };

                var requestData = "&apName=" + valueOfapName + "&bandType=" + valueOfbandType + "&skipnum=" + valueOfskipnum + "&limitnum=" + valueOflimitnum;
                url = url + requestData;

            } else if (type == "ssid") {
                var url = MyConfig.path + "/stamonitor/getclientstatisticbyssid_detail?devSN=" + FrameInfo.ACSN;
                var valueOfclientSSID = "" + sName + "";
                var valueOfbandType = "" + aType + "";

                // var requestData = {
                //     "clientSSID":valueOfclientSSID,"bandType":valueOfbandType,"skipnum":valueOfskipnum,"limitnum":valueOflimitnum
                // };

                var requestData = "&clientSSID=" + valueOfclientSSID + "&bandType=" + valueOfbandType + "&skipnum=" + valueOfskipnum + "&limitnum=" + valueOflimitnum;
                url = url + requestData;

            } else if (type == "80211wirelessMode") {
                var url = MyConfig.path + "/stamonitor/getclientstatisticbymode_detail?devSN=" + FrameInfo.ACSN;
                var valueOfclientMode = "" + aType + "";

                // var requestData = {
                //     "clientMode":valueOfclientMode,"skipnum":valueOfskipnum,"limitnum":valueOflimitnum
                // };

                var requestData = "&clientMode=" + valueOfclientMode + "&skipnum=" + valueOfskipnum + "&limitnum=" + valueOflimitnum;
                url = url + requestData;

            } else if (type == "MobileCompany") {
                var url = MyConfig.path + "/stamonitor/getclientstatisticbybyod_detail?devSN=" + FrameInfo.ACSN;
                var valueOfclientVendor = "" + aType + "";

                //“其它”的情况
                if (valueOfclientVendor == getRcText("OTHER")) {
                    valueOfclientVendor = "";
                }
                // var requestData = {
                //     "clientVendor":valueOfclientVendor,"skipnum":valueOfskipnum,"limitnum":valueOflimitnum
                // };

                var requestData = "&clientVendor=" + valueOfclientVendor + "&skipnum=" + valueOfskipnum + "&limitnum=" + valueOflimitnum;
                url = url + requestData;

            } else {
                // alert('bu ke neng');
                return;
            }

            $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json",
                dataType: "json",
                // data:JSON.stringify(requestData),
                success: function(data) {
                    // if(data.errorcode == 0)
                    if (!data.errcode) {
                        //ssidDetail list : fu zhi

                        //一次次地刷数据
                        $("#popList").SList("refresh", data.clientList);

                        if (data.clientList.length < valueOflimitnum) {
                            //获取完数据，显示出弹出框
                            Utils.Base.openDlg(null, {}, {
                                scope: $("#client_diag"),
                                className: "modal-super dashboard"
                            });
                            return false;
                        } else {
                            //第2/3/4...次获取数据
                            dijici = 1 + (parseInt(dijici));
                            valueOfskipnum = (parseInt(valueOflimitnum)) * (parseInt(dijici));

                            getData();
                        }
                    } else {
                        // Frame.Msg.error("根据SSID以及无线模式获取终端详细列表信息：失败");
                        var data = [
                            // {"aa":44}
                            {
                                "clientMAC": 1,
                                "clientIP": "2",
                                "clientName": "3",
                                "clientVendor": "4",
                                "ApName": "5",
                                "clientSSID": "6",
                                "signalStrength": 1,
                                "clientTxRate": 3,
                                "clientRxRate": 4,
                                "onlineTime": 5,
                                "clientRadioMode": 6,
                                "clientMode": "cc",
                                "clientChannel": 7,
                                "NegoMaxRate": 77
                            }



                        ];
                        $("#popList").SList("refresh", data);
                        Utils.Base.openDlg(null, {}, {
                            scope: $("#client_diag"),
                            className: "modal-super dashboard"
                        });
                        return false;
                    }
                },
                error: function(err) {
                    // Frame.Msg.error(JSON.stringify(err));
                }
            });
        }
    }

    function drawStaMode(oData) {
        //huo qu bian liang

        // function getModeList(ArrayT) {
        //     var atemp = [];
        //     $.each(ArrayT, function(index, iArray) {
        //         atemp.push({
        //             "devSN": iArray.devSN,
        //             "devMode": iArray.devMode,
        //         });
        //     });

        //     return atemp;
        // }

        // function onClickTypePie(oPiece) {
        //     $.ajax({
        //         url: MyConfig.path + "/devmonitor/statistic_bymode_detail",
        //         type: "GET",
        //         dataType: "json",
        //         data: {
        //             devMode: oPiece.name,
        //             skipnum: 0,
        //             limitnum: 100000
        //         },
        //         success: function(data) {
        //             var all = getModeList(data.acList);
        //             $("#ByTypePopList").SList("refresh", all);
        //             Utils.Base.openDlg(null, {}, {
        //                 scope: $("#ByType_diag"),
        //                 className: "modal-super dashboard"
        //             });
        //             return false;
        //         },
        //         error: function() {

        //         }
        //     });
        //     // var all =[{'mac':'AB-32-CD-EF-DD-EE','ip':'192.168.10.2','firm':'苹果','ap':'ap1','ssid':'12345678'}];
        //     // $("#ByTypePopList").SList("refresh",all);
        //     // Utils.Base.openDlg(null, {}, {scope:$("#ByType_diag"),className:"modal-super dashboard"});
        // }
        var oStaMode = {};
        $.extend(oStaMode,oData);

        oStaMode.Num5G = oStaMode.client_statistic["11a"] + oStaMode.client_statistic["11ac"] + oStaMode.client_statistic["11an"];
        oStaMode.Num2G = oStaMode.client_statistic["11g"] + oStaMode.client_statistic["11gn"] + oStaMode.client_statistic["11b"];

        if (oStaMode.Num5G == 0 && oStaMode.Num2G == 0) {
            drawEmptyPie($("#Terminal_type"));
            return;
        }

        //undefined 声明
        if (oStaMode.Num5G == 0) {
            delete oStaMode.Num5G;
        }
        if (oStaMode.Num2G == 0) {
            delete oStaMode.Num2G;
        }

        //undefined 声明
        if (oStaMode.client_statistic["11ac"] == 0) {
            delete oStaMode.client_statistic["11ac"];
        }
        if (oStaMode.client_statistic["11an"] == 0) {
            delete oStaMode.client_statistic["11an"];
        }
        if (oStaMode.client_statistic["11a"] == 0) {
            delete oStaMode.client_statistic["11a"];
        }
        if (oStaMode.client_statistic["11g"] == 0) {
            delete oStaMode.client_statistic["11g"];
        }
        if (oStaMode.client_statistic["11gn"] == 0) {
            delete oStaMode.client_statistic["11gn"];
        }
        if (oStaMode.client_statistic["11b"] == 0) {
            delete oStaMode.client_statistic["11b"];
        }

        //hua tu
        var option = {
            height: 220,
            tooltip: {
                trigger: 'item',
                formatter: "{a} {b} <br/>{c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                y : 'bottom',
                data: ['802.11ac(5GHz)','802.11an(5GHz)','802.11a(5GHz)',"",'802.11gn(2.4GHz)','802.11g(2.4GHz)','802.11b(2.4GHz)']
            },
            calculable: false,
            animation:true,
            click: function(oInfo) {
                if (oInfo.seriesIndex) {
                    var aType = ["11ac", "11an", "11a", "11gn", "11g", "11b"];
                    openDalg(aType[oInfo.dataIndex], "", "80211wirelessMode");

                }
            },
            series: [{
                type: 'pie',
                radius: '30%',
                center: ['50%', '30%'],

                itemStyle: {
                    normal: {
                        borderColor: "#FFF",
                        borderWidth: 1,
                        labelLine: {
                            show: false
                        },
                        color: function(a, b, c, d) {
                            var colorList = ['#4ec1b2', '#b3b7dd'];
                            // var colorList = ['#4ec1b2','#b3b7dd'];
                            return colorList[a.dataIndex];
                        },
                        label: {
                            // position:"inner",
                            // formatter: '{b}'
                            show: false
                        }
                    }
                },
                data: [{
                    name: '5GHz',
                    value: oStaMode.Num5G
                }, {
                    name: '2.4GHz',
                    value: oStaMode.Num2G
                }]
            }, {
                type: 'pie',
                radius: ['40%', '60%'],
                center: ['50%', '30%'],
                itemStyle: {
                    normal: {
                        borderColor: "#FFF",
                        borderWidth: 1,
                        labelLine: {
                            show: false
                        },
                        label: {
                            position: "inner",
                            // formatter:function(a,b,c,d) {
                            //     return Math.round(a.percent)+"%";
                            // }
                            show: false
                        }
                    }
                },
                data: [{
                    name: '802.11ac(5GHz)',
                    value: oStaMode.client_statistic["11ac"]
                }, {
                    name: '802.11an(5GHz)',
                    value: oStaMode.client_statistic["11an"]
                }, {
                    name: '802.11a(5GHz)',
                    value: oStaMode.client_statistic["11a"]
                }, {
                    name: '802.11gn(2.4GHz)',
                    value: oStaMode.client_statistic["11gn"]
                }, {
                    name: '802.11g(2.4GHz)',
                    value: oStaMode.client_statistic["11g"]
                }, {
                    name: '802.11b(2.4GHz)',
                    value: oStaMode.client_statistic["11b"]
                }]
            }]
        };
        var oTheme = {
            color: ['#4ec1b2', '#78cec3', '#95dad1', '#b3b7dd', '#c8c3e1', '#e7e7e9']
        };

        $("#Terminal_type").echart("init", option, oTheme);
    }

    function drawAp(oData) {
        function onClickPie(oPiece) {
            Utils.Base.redirect({
                np: "apmgr.allaps",
                nIndex: oPiece.dataIndex + 1,
                openMethod: "monitor"
            });
        }
        if (oData[0].value == 0 && oData[1].value == 0)
        {
            drawEmptyPie($("#pie_aps"));
            return;
        }
        var aSatus = getRcText("PORTALSTA");
        var option = {
            animation: true,
            calculable: false,
            height: 160,
            tooltip: {
                show: true,
                formatter: function(aData) {
                    var sLable = aData[1] + ":<br/> " + aData[2] + " (" + Math.round(aData[3]) + "%)";
                    return sLable;
                }
            },
            series: [{
                        name: 'APs',
                        type: 'pie',
                        minAngle: '3',
                        radius: '85%',
                        // selectedMode: "single",
                        // selectedOffset: 10,
                        center: ['50%', '45%'],
                        itemStyle: {
                            normal: {
                                borderColor: "#FFF",
                                borderWidth: 1,
                                label: {
                                    position: 'inner',
                                    formatter: function(a, b, c, d) {
                                        return Math.round(a.percent) + "%";
                                    }
                                },
                                labelLine: false
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: "#000"
                                    }
                                },
                                labelLine: false
                            }
                        },
                        // data: [
                        //     {name:aSatus[0], value:oData.online  || undefined},
                        //     {name:aSatus[1], value:oData.offline || undefined},
                        //     // {name:aSatus[2], value:oData.other || undefined}
                        // ],
                        data: oData
                    }

                ]
                // ,click: onClickPie
        };
        var oTheme = {
            color: ["#78CEC3", "#FF9C9E", "#E7E7E9"]
        };
        $("#pie_aps").echart("init", option, oTheme);
    }

    function drawStaByod(alegend,data) {
        var deviceLength = data.length;
        if (deviceLength == 0) {
            drawEmptyPie($("#Terminal_firm"));
            return;
        }
        var option = {
            height: 210,
            tooltip: {
                trigger: 'item',
                formatter: "{a} {b} <br/>{c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                y: 'bottom',
                data:alegend,
            },

            calculable: false,
            // click: function(oInfo) {
            //     openDalg(oInfo.name, "", "MobileCompany");
            // },
            series: [{
                type: 'pie',
                radius: ['40', '60%'],
                center: ['50%', '30%'],
                itemStyle: {
                    normal: {
                        borderColor: "#FFF",
                        borderWidth: 1,
                        labelLine: {
                            show: false
                        },
                        label: {
                            // position:"inner",
                            // formatter: function(a,b,c,d){
                            //     return Math.round(a.percent)+"%";
                            // }
                            show: false
                        }
                    }
                },
                data: data
            }]
            // click: onClickFirmPie
        };
        var oTheme = {
            color: ['#4ec1b2', '#fbceb1', '#b3b7dd', '#4fc4f6', '#fe808b', '#e7e7e9']
        };
        $("#Terminal_firm").echart("init", option, oTheme);
          //手动拼装lengend
        // var aLHtml=[],aRHtml=[];
        // for(var i=0;i<alegend.length;i++){
        //     if(i%2==0){
        //         var sHtml ='<li class="lengend-icon mt11" style="background:'+oTheme.color[i] + '">'+
        //                     '<span class="lengend-num">'+alegend[i]+'</span></li>';
        //         aLHtml.push(sHtml);
        //     }else{
        //         var sHtml ='<li class="lengend-icon mt11" style="background:'+oTheme.color[i] + '">'+
        //                     '<span class="lengend-num">'+alegend[i]+'</span></li>';
        //         aRHtml.push(sHtml);            
        //     }
        // }
        
        // $("#staFirm").empty()
        //              .append(aLHtml.join(""));
        // $("#staRFirm").empty()
        //              .append(aRHtml.join(""));
        
        
    }

    function aj_getPlaceInfo(callback) {

        function success(data) {
            if (data.error_code == 0) {
                callback(data.place_info.name);
            } else {
                callback('');
            }
        }

        function fail(err) {
            callback('');
        }
        var PlaceInfoOpt = {
            type: "post",
            url: MyConfig.v2path + "/getPlaceInfo",
            contentType: "application/json",
            data: JSON.stringify({
                "user_name": FrameInfo.g_user.attributes.name,
                "dev_sn": FrameInfo.ACSN
            }),
            onSuccess: success,
            onFailed: fail
        }

        Utils.Request.sendRequest(PlaceInfoOpt);
    }

    function aj_getWanInfo(callback) {
        aj_getPlaceInfo(function(shop_name) {

            var opt = {
                type: "POST",
                url: MyConfig.path + "/ant/confmgr",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "configType": 1,
                    "sceneFlag": "true",
                    "sceneType": 2,
                    "userName": FrameInfo.g_user.user,
                    "shopName": shop_name,
                    "cfgTimeout": 60,
                    "cloudModule": "xiaoxiaobeicfg",
                    "deviceModule": "xiaoxiaobei",
                    //"method": "BandWidthUpdate",
                    "method": "GetScenariosCfg",
                    "param": [{
                        "userName": FrameInfo.g_user.user,
                        "sceneName": shop_name,
                        "type": "1"
                    }]
                }),
                onSuccess: function(data) {
                    try {
                        if (!('result' in data && 'upBandwidth' in data.result && 'downBandwidth' in data.result)) {
                            throw (new Error('paragram not exist'));
                        }
                        callback(data.result.upBandwidth, data.result.downBandwidth);
                    } catch (error) {
                        callback(0, 0);
                    }
                },
                onFailed: function(err) {
                    callback(0, 0);
                }
            }

            Utils.Request.sendRequest(opt);
        });
    }

    function initScorePie(score, status) {
        if (status == 1) {
            score = score || 0;
        } else {
            score = 100;
        }
        var centerPieStyle = {
            normal: {
                color: 'white',
                label: { show: true, position: 'center' },
                labelLine: { show: false }
            },
            emphasis: {
                label: {
                    show: true,
                    formatter: function (params) {
                        if (status == 1) {
                            return params.data.score;
                        } else {
                            return getRcText("LEAVE");
                        }
                    },
                    textStyle: (status == 1 ? {
                        baseline: "middle",
                        fontSize: "30",
                        color: "#646D77",
                    } : {
                            baseline: "middle",
                            fontSize: "20",
                            color: "#646D77",
                        })
                }
            }
        };
        var otherStyle = {
            normal: {
                color: "white",
                labelLine: { show: false, }
            }
        }
        var scoreStyle = {
            normal: {
                color: (status == 1 ? ((score >= 80 ? "#4ec1b2" : (score >= 60 ? "#fbceb1" : "#fe808b"))) : "#f5f5f5"),//"#fe808b",
                labelLine: { show: false, }
            }
        }
        var option = {
            height: "180px",
            width: "215px",
            series: [
                {
                    type: "pie",
                    // center:["70%","50%"],
                    radius: [0, 50],
                    max: 100,
                    itemStyle: {
                        normal: {
                            label: {
                                formatter: function (params) {
                                    if (status == 1) {
                                        return params.data.score;
                                    } else {
                                        return "0";
                                    }
                                },
                                textStyle: (status == 1 ? {
                                    baseline: "middle",
                                    fontSize: "30",
                                    color: "#646D77",
                                } : {
                                        baseline: "middle",
                                        fontSize: "40",
                                        color: "#646d77",
                                    })
                            }
                        }
                    },
                    data: [
                        { value: 100, score: score, itemStyle: centerPieStyle }
                    ]
                },
                {
                    type: "pie",
                    // center:["70%","50%"],
                    radius: [50, 58],
                    max: 100,
                    clockWise: false,
                    data: [
                        { value: 100 - score, itemStyle: otherStyle },
                        { value: score, itemStyle: scoreStyle }
                    ]
                }
            ]
        }
        $("#score-pie").echart("init", option);
    }
    function initHealthScore() {
        function updataHealthScore(healthData) {
            if (!healthData) {
                healthData = {
                    finalscore: 0,
                    wanspeed: 0,
                    APpercent: 0,
                    clientspeed: 0,
                    security: 0,
                    wireless: 0,
                    system: 0,
                    Bpercent: 0
                };
            }
            if (healthData.finalscore == 0) {
            } else if (healthData.finalscore < 40) {
                $("#terminalMessage").css("color", "#fe8086").css("fontFamily", "arial,"+getRcText("HUAWENXIHEI")).css("textShadow", "none");
                $("#terminalMessage").html(getRcText("TIP_PROFIX1") + healthData.Bpercent + getRcText("TIP1"));
            } else if (healthData.finalscore < 70) {
                $("#terminalMessage").css("color", "#fbceb1").css("fontFamily", "arial,"+getRcText("HUAWENXIHEI")).css("textShadow", "none");
                $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP2"));
            } else if (healthData.finalscore <= 100) {
                $("#terminalMessage").css("color", "#4ec1b2").css("fontFamily", "arial,"+getRcText("HUAWENXIHEI")).css("textShadow", "none");
                if (healthData.finalscore < 80) {
                    $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP3"));
                } else if (healthData.finalscore < 90) {
                    $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP4"));
                } else {
                    $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP5"));
                }
            }

            function drawtext(score, id, mode) {
                if (score <= 1) {
                    $("#" + id + " .boxname .cir").css("background", "#fe8086");
                    $("#" + id + " .boxcont").html("<p><span class='tx'>" + getRcText("TX") + "</span>" + getRcText(mode).split(',')[0] + "</p>");
                }
                else if (score <= 3) {
                    $("#" + id + " .boxname .cir").css("background", "#fbceb1");
                    $("#" + id + " .boxcont").html("<p><span class='jy'>" + getRcText("JY") + "</span>" + getRcText(mode).split(',')[1] + "</p>");
                }
                else if (score <= 5) {
                    $("#" + id + " .boxname .cir").css("background", "#4ec1b2");
                    $("#" + id + " .boxcont").html("<p><span>" + getRcText(mode).split(',')[2] + "</span></p>");
                }

            }

            // Internet带宽
            drawtext(healthData.wanspeed, "Bandwidth-speed", "BANDWIDTH_SPEED");
            // 设备疲劳度
            drawtext(healthData.APpercent, "internal-utilization", "MEMORY_UTLIZATION");
            // 优质终端比例
            drawtext(healthData.clientspeed, "wifi-terminal", "WIFI_TERMINAL");
            // 环境无线干扰
            drawtext(healthData.security, "wifi-environment", "WiFi_ENVIROMENT");
            // 系统运行状态
            drawtext(healthData.wireless, "cpu-utilization", "CPU_TILIZATION");
            // 设备在线率
            drawtext(healthData.system, "safety-evaluation", "SAFE_VALUATION");



            $('#raty_score_1').raty({readOnly: true, score: healthData.wanspeed, path: 'libs/jquery_raty/img/'});
            $('#raty_score_2').raty({readOnly: true, score: healthData.APpercent, path: 'libs/jquery_raty/img/'});
            $('#raty_score_3').raty({readOnly: true, score: healthData.clientspeed, path: 'libs/jquery_raty/img/'});
            $('#raty_score_4').raty({readOnly: true, score: healthData.security, path: 'libs/jquery_raty/img/'});
            $('#raty_score_5').raty({readOnly: true, score: healthData.wireless, path: 'libs/jquery_raty/img/'});
            $('#raty_score_6').raty({readOnly: true, score: healthData.system, path: 'libs/jquery_raty/img/'});
            g_reportsFlag = true;

            initScorePie(healthData.finalscore, 1);
        }
        function getHealthFlowSuc (data) {
            var healthData = JSON.parse(data) || "";
            updataHealthScore(healthData);
        }
        function getHealthFlowFail (argument) {
            Frame.Msg.info(getRcText("ERROR"));     
        }
        var healthFlowOpt = {
            url : MyConfig.path+"/health/home/health?acSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType:"json",
            onSuccess:getHealthFlowSuc,
            onFailed:getHealthFlowFail
        }
        Utils.Request.sendRequest(healthFlowOpt);
    }

    function showSystem (argument) {
        Utils.Base.openDlg(null, {},{scope: $("#devDlg"),className: "modal-super"});
    }
    function onOpenAddDlg(oRowData, type) {
        console.log(oRowData);
        console.log(type);
        $("#AddInternetForm").form("init", "edit", {
            title: getRcText("ADD_TITLE"),
            "btn_apply": function() {
                //AddPro()
                var downband = $("#downband_id").val();
                var upband = $("#upband_id").val();
                if ((downband == "") || (upband == "")) {
                    return;
                }

                aj_UpadteWanInfo(upband, downband, function(err) {
                    if (err == 0) {
                        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddApDlg")));
                        initHealthScore();
                    }
                });

            }
        });

        //$("div").find("a").removeClass('disabled');
        Utils.Base.openDlg(null, {}, {
            scope: $("#AddApDlg"),
            className: "modal-small"
        });
    }

    function getApSuc(data) {
        $("#Current").html(data.ap_statistic.online);
        $("#totalAp").html(data.ap_statistic.online + data.ap_statistic.offline + data.ap_statistic.other);
        var datas = [{
            name: getRcText("ONLINEAP"),
            value: data.ap_statistic.online
        }, {
            name: getRcText("OFFLINEAP"),
            value: data.ap_statistic.offline
        }]
        drawAp(datas);
    }

    function getApFail(data) {
        // body...
    }

    function timeStatus(time) {
        // body...
        if (time < 10) {
            return "0" + time;
        }
        return time;
    }

    function drawChart(oData) {
        var aSpeedUp = [];
        var aSpeedDown = [];
        var aTimes = [];
        oData = oData.reverse();
        $.each(oData, function(i, oData) {
            aSpeedUp.push(oData.speed_up);
            aSpeedDown.push(-oData.speed_down);
            var temp = new Date(oData.updateTime);
            aTimes.push(timeStatus(temp.getHours()) + ":" + timeStatus(temp.getMinutes()) + ":" + timeStatus(temp.getSeconds()));
        });
        var aStream = getRcText("STREAM").split(",");
        var option = {
            width: "100%",
            height: 210,
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
                formatter: function(y, x) {
                    var sTips = y[0][1];
                    for (var i = 0; i < y.length; i++) {
                        sTips = sTips + "<br/>" + y[i][0] + ":" + Utils.Base.addComma(Math.abs(y[i][2]), "rate", 1);
                    }
                    return sTips;
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "center",
                data: aStream
            },
            grid: {
                x: 65,
                y: 40,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                splitLine: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#80878C',
                        width: 2
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#80878C',
                        width: 2
                    }
                },
                axisTick: {
                    show: false
                },
                data: aTimes
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#80878C',
                        width: 2
                    },
                    formatter: function(nNum) {
                        return Utils.Base.addComma(Math.abs(nNum), 'rate', 1);
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#80878C',
                        width: 2
                    }
                }
            }],
            series: [{
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                name: aStream[0],
                data: aSpeedUp
            }, {
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                name: aStream[1],
                data: aSpeedDown
            }]

        };
        var oTheme = {
            color: ["rgba(242,188,152,1)", "rgba(120,206,192,0.6)"],
        };
        g_oLineChart = $("#usage").echart("init", option, oTheme);
        // Interval();
    }

    function drawChartWan(aData) {
        var aSpeedUp = [];
        var aSpeedDown = [];
        var aSpeedUp2 = [];
        var aSpeedDown2 = [];
        var aTimes = [];
        var aServices = [];
        var aLegend = [];
        var aTooltip = [];
        var reg = /./;
        var reg2 = /G\d{1,2}/;
        var aStream = getRcText("STREAM").split(",");
        var aColor = ["rgba(120,206,195,1)", "rgba(254,240,231,1)", "rgba(144,129,148,1)", "rgba(254,184,185,1)"];
        $.each(aData, function(i, oData) {
            var aUp = [];
            var aDown = [];
            aData[i] = aData[i].reverse();
            $.each(aData[i], function(j, oData) {
                aUp.push(oData.speed_up);
                aDown.push(-oData.speed_down);
            });

            var aName = (aData[i][0].interfaceName).match(reg) + (aData[i][0].interfaceName).split('/').pop();
            var oUp = {
                symbol: "none",
                type: 'line',
                smooth: true,
                stack: getRcText("ZONGLIANG"),
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default',
                            color: aColor[i]
                        }
                    }
                },
                name: aName + getRcText("LIULIANG"),
                data: aUp
            };
            var oDown = {
                symbol: "none",
                type: 'line',
                smooth: true,
                stack: getRcText("ZONGLIANG"),
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default',
                            color: aColor[i]
                        }
                    }
                },
                name: aName + getRcText("LIULIANG"),
                data: aDown
            };
            aServices.push(oUp);
            aServices.push(oDown);
            aLegend.push(aName + getRcText("LIULIANG"));
            aTooltip.push(aName + aStream[0]);
            aTooltip.push(aName + aStream[1]);
        });
        aTooltip = aTooltip.reverse();
        $.each(aData[0], function(i, oData) {
            var temp = new Date(oData.updateTime);
            aTimes.push(timeStatus(temp.getHours()) + ":" + timeStatus(temp.getMinutes()) + ":" + timeStatus(temp.getSeconds()));
        });

        var option = {
            width: "100%",
            height: 210,
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
                formatter: function(y, x) {
                    var sTips = y[0][1];
                    var temp = y[0][0].match(reg2)[0];
                    for (var j = 0; j < aTooltip.length; j++) {
                        if (temp == aTooltip[j].match(reg2)[0]) {
                            break;
                        }
                    }
                    for (var i = 0; i < y.length; i++) {
                        sTips = sTips + "<br/>" + aTooltip[j + i] + ":" + Utils.Base.addComma(Math.abs(y[i][2]), "rate", 1);
                    }
                    return sTips;
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "center",
                data: aLegend
            },
            grid: {
                x: 60,
                y: 40,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                splitLine: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#80878C',
                        width: 2
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#80878C',
                        width: 2
                    }
                },
                axisTick: {
                    show: false
                },
                data: aTimes
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#80878C',
                        width: 2
                    },
                    formatter: function(nNum) {
                        return Utils.Base.addComma(Math.abs(nNum), 'rate', 1);
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#80878C',
                        width: 2
                    }
                }
            }],
            series: aServices,
        };
        var oTheme = {
            color: ["rgba(120,206,195,1)", "rgba(254,240,231,1)", "rgba(144,129,148,1)", "rgba(254,184,185,1)"],
        };
        g_oLineChart = $("#usage").echart("init", option, oTheme);
    }

    function configUpPort() {
        function setUpLinkInterfaceSuc(data) {
            //造假使用
            data.errcode = '0';
            if ('{"errcode":"illegal access"}' == data) {
                // console.log("没有权限")
            } else {
                if (data.errcode == '0') {
                    $("#config").addClass("hide");
                    $("#charts").removeClass("hide");
                    $("#usage_block").addClass("hide");
                    var aData = JSON.parse(data.histdataList[0]);
                    drawChart(aData.dataList);
                } else {
                    // console.log("设置失败")
                };
            }
        }

        function setUpLinkInterfaceFial(data) {
            // body...
        }
        g_sPort = $("#ConfigUpport").val();
        if (!g_sPort) return;
        var setUpLinkInterfaceFlowOpt = {
            url: MyConfig.path + '/devmonitor/setUpLinkInterface',
            type: "GET",
            dataType: "json",
            data: {
                devSN: FrameInfo.ACSN,
                interfaceName: g_sPort
            },
            onSuccess: setUpLinkInterfaceSuc,
            onFailed: setUpLinkInterfaceFial
        };
        Utils.Request.sendRequest(setUpLinkInterfaceFlowOpt);
    }

    function setConfigUpport() {
        function setUpLinkInterfaceSuc(data) {
            if ('{"errcode":"illegal access"}' == data) {
                // console.log("没有权限")
            } else {
                if (data.errcode == '0') {
                    var aData = JSON.parse(data.histdataList[0]);
                    drawChart(aData.dataList);
                } else {
                    // console.log("设置失败")
                };
            }
        }

        function setUpLinkInterfaceFial(data) {
            // body...
        }
        $("#usage_block").toggle();
        g_sPort = $("#SetfigUpport").val();
        if (!g_sPort) return;
        var setUpLinkInterfaceFlowOpt = {
            url: MyConfig.path + '/devmonitor/setUpLinkInterface',
            type: "GET",
            dataType: "json",
            data: {
                devSN: FrameInfo.ACSN,
                interfaceName: g_sPort
            },
            onSuccess: setUpLinkInterfaceSuc,
            onFailed: setUpLinkInterfaceFial
        };
        Utils.Request.sendRequest(setUpLinkInterfaceFlowOpt);
    }

    function statStatus(aData) {
        var nTotal = aData.length;
        var nEmerg = aData[0] + aData[1]; /*0*/
        var nAlert = aData[2] + aData[3]; /*1*/
        var nCritical = aData[4] + aData[5]; /*2*/
        var nError = aData[6] + aData[7]; /*3*/
        $("#total .number").html(nTotal);
        $("#emergency .number").html(nEmerg);
        $("#critical .number").html(nCritical);
        $("#error .number").html(nError);
        $("#alert .number").html(nAlert);

    }

    function getSyslogFlowSuc(data) {
        statStatus(data.logstats);
    }

    function getSyslogFlowFail() {
        console.log("Request getdevlog fail");
    }

    function loadEnd() {
        var syslogFlowOpt = {
            url: MyConfig.path + "/devlogserver/getlogstats?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess: getSyslogFlowSuc,
            onFailed: getSyslogFlowFail
        }
        Utils.Request.sendRequest(syslogFlowOpt);
    }
    
    function getSystemInfo () {
        return $.ajax({
            url: MyConfig.path+"/devmonitor/web/system",
            type: "GET",
            dataType:"json",
            data:{
                devSN:FrameInfo.ACSN
            }
        });
    }
    
    function changeBarColor(Usage)
    {
        if(0 == Usage)
        {
            return '#F6F7F8';
        }
        return (Usage>=80)?'#f88e98':'#7FCAEA';
    }
    
    function drawChartScore (jEle, val, sName) {
        var labelTop = {
                normal : {
                    label : {
                        show : true,
                        position : 'center',
                        formatter : '{b}',
                        textStyle: {
                            baseline : 'bottom'
                        }
                    },
                    labelLine : {
                        show : false
                    }
                }
            };
        var labelFromatter = {
            normal : {
                label : {
                    formatter : function (params){
                        return 100 - params.value + '%'
                    },
                    textStyle: {
                        baseline : 'top'
                    }
                }
            },
        }
        var labelBottom = {
                normal : {
                    color: '#ccc',
                    label : {
                        show : true,
                        position : 'center'
                    },
                    labelLine : {
                        show : false
                    }
                },
                emphasis: {
                    color: 'rgba(0,0,0,0)'
                }
            };
        var radius = [40, 55];
        var option = {
            height: "250px",
            width: "250px",
            series : [
                {
                    type : 'pie',
                    center : ['40%', '50%'],
                    
                    radius : radius,
                    x: '0%', // for funnel
                    itemStyle : labelFromatter,
                    data : [
                        {name:'other', value:100-val, itemStyle : labelBottom},
                        {name:sName, value:val,itemStyle : labelTop}
                    ]
                }
            ]
        };
        jEle.echart("init", option);             
    }
    
    function getSystemFlowSuc (data) {
        var nCpu = parseInt(data.cpuRatio);
        var nMem = parseInt(data.memoryRatio);
        drawChartScore ($("#gauge_cpu"), nCpu, getRcText("cpu"));
        drawChartScore ($("#gauge_mem"), nMem, getRcText("memory"));
        data.SerialNumber = FrameInfo.ACSN;
        Utils.Base.updateHtml($("#version_block"),data);
    }
    
    function getSystemFlowFail (data) {
        // body...
    }
    function initGrid() {
        var opt = {
            colNames: getRcText("SLIST_ONE_LABELS"),
            showHeader: true,
            multiSelect: false,
            pageSize: 4,
            rowHeight: 45.25,
            colModel: [
                // {name: 'ssid',datatype: 'String'}, 
                // {name: 'ssidStatus',datatype: "String"}, 
                // {name: 'ssidType',datatype: "String"}, 
                // {name: 'authType',datatype: "String"}, 
                // {name: 'clientNum',datatype: "String"}, 
                // {name: 'apNum',datatype: "String"}, 
                // {name: 'apGroupNum',datatype: "String"}
                {name:'ssid',datatype:'String'},
                {name:'ssidStatus', datatype: "Order", data: getRcText("STATUS")},
                {name:'ssidType', datatype:"Order", data: getRcText("WL_SSID_TYPE")},
                {name:'authType', datatype:"Order", data: getRcText("WL_AUTH_TYPE")},
                {name:'clientNum', datatype:"String"},
                {name:'apNum', datatype:"String"},
                {name:'apGroupNum', datatype:"String"}
            ]
        };
        $("#slist_one_list").SList("head", opt);
        // $("#slist_one_list").SList ("refresh", [{"ssid":'12345',"ssidStatus":'开启',"ssidType":'商业Wi-Fi',"authType":"不认证","clientNum":'50',"apNum":'30',"apGroupNum":'10'}]);
        var optPortalPop = {
            colNames: getRcText("PORTAL_TERMINAL"),
            showHeader: true,
            colModel: [{
                name: "mac",
                datatype: "String"
            }, {
                name: "ip",
                datatype: "String"
            }, {
                name: "firm",
                datatype: "String"
            }, {
                name: "ap",
                datatype: "String"
            }, {
                name: "ssid",
                datatype: "String"
            }]
        };
        $("#ByPortalPopList").SList("head", optPortalPop);
        $("#ByPortalPopList").SList("resize");
        $("#ByTypePopList").SList("head", optPortalPop);
        $("#ByTypePopList").SList("resize");
        $("#ByFirmPopList").SList("head", optPortalPop);
        $("#ByFirmPopList").SList("resize");
    }

    function initData() {
        initHealthScore();
        var apsFlowOpt = {
            url: MyConfig.path + "/apmonitor/getApCountByStatus",
            type: "GET",
            dataType: "json",
            data: {
                devSN: FrameInfo.ACSN
            },
            onSuccess: getApSuc,
            onFailed: getApFail
        }
        Utils.Request.sendRequest(apsFlowOpt);


        drawPortalPie();


        function getStabymodeOK(data) {
            if (!data.errcode) {
                drawStaMode(data);
            } else {

            }
        }

        function getStabymodeFail(err) {
            console.log("ajax request fail:" + err);
        }
        var getStabymode = {
            type: "GET",
            url: MyConfig.path + "/stamonitor/getclientstatisticbymode?devSN=" + FrameInfo.ACSN,
            contentType: "application/json",
            dataType: "json",
            onSuccess: getStabymodeOK,
            onFailed: getStabymodeFail
        };

        Utils.Request.sendRequest(getStabymode);



        function getStaByodOK(data) {
            // if(data.errorcode == 0)
            if (!data.errcode) {
                var oData = data.client_statistic;

                var aLegend = [];
                var aData = [];
                $.each(oData, function(i, item) {
                    aLegend[i] = item.clientVendor || getRcText("WEIZHI");
                    aData[i] = {};
                    aData[i].name = item.clientVendor || getRcText("WEIZHI");
                    aData[i].value = item.count || undefined;
                });
                // drawMobileDevice(legendOfOK,dataOfOK);
                var i=0;
                aLegend.forEach(function(e,idx,arr){
                    if(idx!=0&&idx%3==0){
                        arr.splice(idx+i,0,'');
                        i++;
                    }
                })
                drawStaByod(aLegend,aData);
            } else {

            }
        }

        function getStaByodFail(err) {
            console.log("ajax request fail:" + err);
        }
        var getStaByod = {
            type: "GET",
            url: MyConfig.path + "/stamonitor/getclientstatisticbybyod?devSN=" + FrameInfo.ACSN,
            contentType: "application/json",
            dataType: "json",
            onSuccess: getStaByodOK,
            onFailed: getStaByodFail
        };

        Utils.Request.sendRequest(getStaByod);

        //--------------------------------------------------------------------------------------------------------------



        //无线服务
        /**
        加载页面数据初始化
        **/
        function getSsidFlowSuc(data) {
            if ('{"errcode":"illegal access"}' == data) {
                // console.log("没有权限")
            } else {
                var aData = [];
                $.each(data.ssidList,function(index,iDate){
                    aData.push({
                        stName:  iDate.stName,
                        ssidStatus: iDate.status - 1,//aStatus[iDate.status],
                        ssid: iDate.ssidName,
                        ssidType: iDate.description,
                        authType: iDate.lvzhouAuthMode,
                        apNum: iDate.ApCnt,
                        apGroupNum: iDate.ApGroupCnt,
                        clientNum: iDate.clinetCount,
                        stName: iDate.stName
                    });
                });
                $("#slist_one_list").SList("refresh", aData);
            }
        }

        function getSsidFlowFail(data) {
            // body...
        }
        var ssidFlowOpt = {
             url: MyConfig.path + "/ssidmonitor/getssidinfobrief?devSN=" + FrameInfo.ACSN
            + "&shopName=" + Utils.Device.deviceInfo.shop_name
            + "&ownerName=" + FrameInfo.g_user.user,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess: getSsidFlowSuc,
            onFailed: getSsidFlowFail
        };
        Utils.Request.sendRequest(ssidFlowOpt);



        function getAllInterfacesSuc(data) {
            function getWanInterfaceSuc(data2) {
                var aData = [];
                for (var i = 0; i < data2.histdataList.length; i++) {
                    var temp = JSON.parse(data2.histdataList[i]);
                    aData[i] = temp.dataList;
                }
                $("#config").addClass("hide");
                $("#charts").removeClass("hide");
                $("#filter_usage").addClass("hide");
                $("#usage_block").addClass("hide");
                drawChartWan(aData);
            }

            function getWanInterfaceFail(data2) {
                // body...
            }

            function getUpLinkInterfaceSuc(data2) {
                var aData = JSON.parse(data2.histdataList[0]);
                $("#config").addClass("hide");
                $("#charts").removeClass("hide");
                $("#usage_block").addClass("hide");
                drawChart(aData.dataList);
                var aIntList = [];
                $.each(data.InterfaceList, function(i, o) {
                    aIntList.push(o.interfaceName);
                });
                $("#SetfigUpport").singleSelect("InitData", aIntList);
            }

            function getUpLinkInterfaceFail(data) {
                // body...
            }

            for (var i = 0; i < data.InterfaceList.length; i++) {
                if (data.InterfaceList[i].interfaceType == 1) {
                    var wanInterfaceFlowOpt = {
                        url: MyConfig.path + "/devmonitor/getUpLinkInterfaceData",
                        type: "GET",
                        dataType: "json",
                        data: {
                            devSN: FrameInfo.ACSN,
                            interfaceType: 1
                        },
                        onSuccess: getWanInterfaceSuc,
                        onFailed: getWanInterfaceFail
                    };
                    Utils.Request.sendRequest(wanInterfaceFlowOpt);
                    return;
                }
            }
            for (var i = 0; i < data.InterfaceList.length; i++) {
                if (data.InterfaceList[i].interfaceType == 3) {
                    var UpLinkInterfaceFlowOpt = {
                        url: MyConfig.path + "/devmonitor/getUpLinkInterfaceData",
                        type: "GET",
                        dataType: "json",
                        data: {
                            devSN: FrameInfo.ACSN,
                            interfaceType: 2
                        },
                        onSuccess: getUpLinkInterfaceSuc,
                        onFailed: getUpLinkInterfaceFail
                    };
                    Utils.Request.sendRequest(UpLinkInterfaceFlowOpt);
                    return;
                }
            }
            var aIntList = [];
            $.each(data.InterfaceList, function(i, o) {
                aIntList.push(o.interfaceName);
            });
            $("#ConfigUpport").singleSelect("InitData", aIntList);
            $("#SetfigUpport").singleSelect("InitData", aIntList);
        }

        function getAllInterfacesFail(data) {
            // body...
            var data = {
                "InterfaceList": [{
                    "interfaceName": "GigabitEthernet1/0/1",
                    "interfaceType": 3
                }, {
                    "interfaceName": "GigabitEthernet1/0/2",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/3",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/4",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/5",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/6",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/7",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/8",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/9",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/10",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/11",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/12",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/13",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/14",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/15",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/16",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/17",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/18",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/19",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/20",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/21",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/22",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/23",
                    "interfaceType": 2
                }, {
                    "interfaceName": "GigabitEthernet1/0/24",
                    "interfaceType": 2
                }, {
                    "interfaceName": "Ten-GigabitEthernet1/0/25",
                    "interfaceType": 2
                }, {
                    "interfaceName": "Ten-GigabitEthernet1/0/26",
                    "interfaceType": 2
                }, {
                    "interfaceName": "Ten-GigabitEthernet1/0/27",
                    "interfaceType": 2
                }, {
                    "interfaceName": "Ten-GigabitEthernet1/0/28",
                    "interfaceType": 2
                }]
            };

            function getUpLinkInterfaceSuc(data2) {
                var aData = JSON.parse(data2.histdataList[0]);
                $("#config").addClass("hide");
                $("#charts").removeClass("hide");
                $("#usage_block").addClass("hide");
                drawChart(aData.dataList);
                var aIntList = [];
                $.each(data.InterfaceList, function(i, o) {
                    aIntList.push(o.interfaceName);
                });
                $("#SetfigUpport").singleSelect("InitData", aIntList);
            }

            function getUpLinkInterfaceFail(data2) {
                // body...
                var data2 = {
                    "histdataList": ["{\"interfaceName\":\"GigabitEthernet1/0/1\",\"dataList\":[{\"_id\":\"5742bff25a35950100bbc6b0\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T08:31:46.949Z\",\"__v\":0},{\"_id\":\"5742bb425a35950100bbc406\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T08:11:46.697Z\",\"__v\":0},{\"_id\":\"5742b6925a35950100bbc15c\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T07:51:46.767Z\",\"__v\":0},{\"_id\":\"5742b1e25a35950100bbbeb2\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T07:31:46.684Z\",\"__v\":0},{\"_id\":\"5742ad325a35950100bbbc08\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T07:11:46.709Z\",\"__v\":0},{\"_id\":\"5742a8825a35950100bbb95e\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T06:51:46.728Z\",\"__v\":0},{\"_id\":\"5742a3d25a35950100bbb6b4\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T06:31:46.633Z\",\"__v\":0},{\"_id\":\"57429f225a35950100bbb40a\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T06:11:46.570Z\",\"__v\":0},{\"_id\":\"57429a725a35950100bbb16a\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T05:51:46.570Z\",\"__v\":0},{\"_id\":\"574295c25a35950100bbaec0\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-23T05:31:46.450Z\",\"__v\":0}]}"]
                };
                var aData = JSON.parse(data2.histdataList[0]);
                $("#config").addClass("hide");
                $("#charts").removeClass("hide");
                $("#usage_block").addClass("hide");
                drawChart(aData.dataList);
                var aIntList = [];
                $.each(data.InterfaceList, function(i, o) {
                    aIntList.push(o.interfaceName);
                });
                $("#SetfigUpport").singleSelect("InitData", aIntList);
            }
            for (var i = 0; i < data.InterfaceList.length; i++) {
                if (data.InterfaceList[i].interfaceType == 3) {
                    var UpLinkInterfaceFlowOpt = {
                        url: MyConfig.path + "/devmonitor/getUpLinkInterfaceData",
                        type: "GET",
                        dataType: "json",
                        data: {
                            devSN: FrameInfo.ACSN,
                            interfaceType: 2
                        },
                        onSuccess: getUpLinkInterfaceSuc,
                        onFailed: getUpLinkInterfaceFail
                    };
                    Utils.Request.sendRequest(UpLinkInterfaceFlowOpt);
                    return;
                }
            }
            var aIntList = [];
            $.each(data.InterfaceList, function(i, o) {
                aIntList.push(o.interfaceName);
            });
            $("#ConfigUpport").singleSelect("InitData", aIntList);
            $("#SetfigUpport").singleSelect("InitData", aIntList);
        }
        var allInterfaceFlowOpt = {
            url: MyConfig.path + "/devmonitor/getAllInterfaces",
            type: "GET",
            dataType: "json",
            data: {
                devSN: FrameInfo.ACSN
            },
            onSuccess: getAllInterfacesSuc,
            onFailed: getAllInterfacesFail
        };
        Utils.Request.sendRequest(allInterfaceFlowOpt);
        var systemFlowOpt = {
        url: MyConfig.path+"/devmonitor/web/system",
        type: "GET",
        dataType:"json",
        data:{
            devSN:FrameInfo.ACSN
        },
        onSuccess:getSystemFlowSuc,
        onFailed:getSystemFlowFail
    };
    Utils.Request.sendRequest(systemFlowOpt);

    function get_DevStatusSuc( data )
    {
        var adev_statuslist=data.dev_statuslist || [];
        var Connect_Sta=getRcText("Connect_Sta").split(",");
        if(adev_statuslist.length==1){
            if(adev_statuslist[0].dev_status==1)
            {
                $("#devCloudConnectionState").text(Connect_Sta[0]);
            }
            else{
                $("#devCloudConnectionState").text(Connect_Sta[1]);
            }
        }else{
            $("#devCloudConnectionState").text(Connect_Sta[1]);
        }
    };

    function get_DevStatusFail()
    {

    };

    var get_DevStatus = {
        url: MyConfig.v2path+"/getDevStatus",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        //username :MyConfig.username,
        //password : MyConfig.password,
        data: JSON.stringify({
            tenant_name:FrameInfo.g_user.attributes.name,
            dev_snlist: [FrameInfo.ACSN],
        }),
        onSuccess: get_DevStatusSuc,
        onFailed: get_DevStatusFail 
    };
    Utils.Request.sendRequest( get_DevStatus );

    function get_DevSuc( data )
    {
        var statust=data.status || [];
        var Connect_Sta=getRcText("Connect_Stav3").split(",");
            if(statust == 0)
            {
                $("#devv3CloudConnectionState").text(Connect_Sta[0]);

            }else{
                $("#devv3CloudConnectionState").text([Connect_Sta[1]]);
            }
    };

    function get_DevFail()
    {

    };

    var get_Dev = {
        url: MyConfig.path+"/base/getDev",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({devSN: FrameInfo.ACSN}),
        onSuccess: get_DevSuc,
        onFailed: get_DevFail 
    };
    Utils.Request.sendRequest( get_Dev );
    }

    function initForm() {
        g_jForm = $("#system_form");
        g_jForm.form("init", "edit", {"title":getRcText("FORM_TITLE"), "btn_apply": false});
        $("#submit_scan").on("click", function() {
            // Utils.Base.redirect ({np:$(this).attr("href")});
            window.location.hash = "#M_LOG";
            return false;
        });
        $("#refresh_logs").on("click", loadEnd);
        $("#refresh_usage").on("click", initData);
        $("#filter_usage").on("click", function() {
            $("#usage_block").toggle();
        });
        $("#SetfigUpport").on("change", setConfigUpport);
        $("#submit").on("click", configUpPort); /*确认按钮*/
        drawdayClientCount();

        $("#days").click(function() {
            /*获取当前时间往前推一天的在线用户数*/
            $("div a.time-link").removeClass("active");
            $(this).addClass("active");
            drawdayClientCount();
        });
        $("#weeks").click(function() {
            $("div a.time-link").removeClass("active");
            $(this).addClass("active");
            drawWeekClientCount();
        });
        $("#mounth").click(function() {
            $("div a.time-link").removeClass("active");
            $(this).addClass("active");
            drawMonthClientCount();
        });
        $("#report").click(function() {
            $("div.health_box span.boxname").next().hide().first().show();
            Utils.Base.openDlg(null, {}, {
                scope: $("#reportdetail"),
                className: "modal-small"
            });
        });
        $("#device_Internet").click(function(event) {
            onOpenAddDlg();
        });
        // Internet 带宽设置
        $("#reports").click(function() {
            onOpenAddDlg();
        });
        $("#system").on('click',function () {
            showSystem();
        });
        // $("#refresh_ssid").on("click", drawAp);
    }
    function _init() {
        initForm();
        initGrid();
        initData();
        loadEnd();
        initClientCount();
        initUserTodayCount();
        initUserChange();
        

    }

    function _resize(jParent) {
        if (g_oResizeTimer) {
            clearTimeout(g_oResizeTimer);
        }
        g_oResizeTimer = setTimeout(function() {
            g_oLineChart && g_oLineChart.chart && g_oLineChart.resize();
        }, 200);
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _destroy() {
        g_oLineChart = null;
        g_sPort = null;
        clearTimeout(g_oTimer);
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        g_bChartInit = false;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Mlist", "Echart", "SList", "SingleSelect", "Panel", "DateTime", "Form"],
        "utils": ["Base", "Device", "Request"],
        "subModules": []
    });

})(jQuery);