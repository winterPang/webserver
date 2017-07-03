; (function($) {
    var MODULE_NAME = "x_summary.index";
    var g_sShopName = null; 
    var g_hPending = null;
    var g_UserCondition = ['onehour','oneday','oneweek','onemonth'];

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

    function getOnlineSta(startTime, endTime, onSuccess, type) {
        function onFailed(jqXHR, textStatus, error) {
            g_hPending&&g_hPending.close();
            console.log("getOnlineSta type【" + type + "】【error】:" + error);
        }

        var getOnlineStaOpt = {
            type: "GET",
            url: MyConfig.path + "/stamonitor/web/histolclient" + "?devSN=" + FrameInfo.ACSN + "&startTime="
            + startTime + "&endTime=" + endTime,
            //data: {
            //    devSN:FrameInfo.ACSN,
            //    startTime:startTime,
            //    endTime:endTime
            //},
            dataType: "json",
            timeout: 150000,
            onSuccess: onSuccess,
            onFailed: onFailed
        };

        Utils.Request.sendRequest(getOnlineStaOpt);
    }

    function getOnlineVisitor(timeType, onSuccess, type) {
        function onFailed(jqXHR, textStatus, error) {
            g_hPending&&g_hPending.close();
            console.log("getOnlineVisitor type【" + type + "】【error】:" + error);
        }

        var getOnlineStaOpt = {
            type: "GET",
            url: MyConfig.path + "/stamonitor/histclientstatistic" + "?devSN=" + FrameInfo.ACSN + "&statistic_type="
            + timeType,
            //data: {
            //    devSN:FrameInfo.ACSN,
            //    startTime:startTime,
            //    endTime:endTime
            //},
            dataType: "json",
            timeout: 150000,
            onSuccess: onSuccess,
            onFailed: onFailed
        };

        Utils.Request.sendRequest(getOnlineStaOpt);
    }
    //function aj_getUser(modetest, callback) {
    //    var ajax = {
    //        url:MyConfig.path+"/stamonitor/histclientstatistic_bycondition?devSN=" + FrameInfo.ACSN + "&dataType=" + modetest + "&nasId=" + FrameInfo.Nasid,
    //        type: "GET",
    //        dataType: "json",
    //        contentType: "application/json",
    //        onSuccess: function (data) {
    //            try {
    //                callback(data);
    //            }catch(error){
    //                console.log(error);
    //            }
    //        },
    //        onFailed:function(err){
    //            g_hPending.close();
    //            console.log(err);
    //        }
    //    }
    //    Utils.Request.sendRequest(ajax);
    //}
    //带宽变化
    function getFlowInfo(startTime, endTime, onSuccess, type) {
        function onFailed(jqXHR, textStatus, error) {
            g_hPending&&g_hPending.close();
            console.log("getFlowInfo type【" + type + "】【error】:" + error);
        }

        var getFlowInfoOpt = {
            type: "GET",
            url: MyConfig.path + "/devmonitor/web/hiswantraffic" + "?devSN=" + FrameInfo.ACSN + "&startTime="
            + startTime + "&endTime=" + endTime,
            //data: {
            //    devSN: FrameInfo.ACSN,
            //    startTime: startTime,
            //    endTime: endTime
            //},
            dataType: "json",
            timeout: 150000,
            onSuccess: onSuccess,
            onFailed: onFailed
        };

        Utils.Request.sendRequest(getFlowInfoOpt);
    }

    function initUserChangeToday(xArr,yArr) {
        var aseries = [];
        var Unit =0;
        var Bandwidth = new Array(getRcText("UNIT"));
        // "个"
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {normal: {areaStyle: {type: 'default'}, lineStyle: {width: 1}}},
            name: getRcText("CLIENT_ACCOUNT"),
            // "宾客数"
            data: yArr
        };
        aseries.push(oTemp);
        var option = {
            width: "100%",
            height: "230px",
            tooltip : {
                trigger: 'axis'
            },

            /*tooltip: {
             show: true,
             trigger: 'axis',
             formatter: function (params) {
             var newTime = params.value[0],
             newMonth = newTime.getMonth()+1,
             newDate = newTime.getDate(),
             newHour = newTime.getHours(),
             newMinute = newTime.getMinutes(),
             newSeconds = newTime.getSeconds();
             newMonth = newMonth < 10 ? '0'+newMonth :newMonth;
             newDate = newDate < 10 ? '0'+newDate :newDate;
             newHour = newHour < 10 ? '0'+newHour :newHour;
             newMinute = newMinute < 10 ? '0'+newMinute :newMinute;
             newSeconds = newSeconds < 10 ? '0'+newSeconds :newSeconds;
             var time = newTime.getFullYear()+"-"+newMonth+"-"+newDate+","+newHour+":"+newMinute+":"+newSeconds;
             if (params.value[1] < 0)
             params.value[1] = -params.value[1];
             var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + getRcText("UNIT");
             // "个"

             return string;
             },
             axisPointer: {
             type: 'line',
             lineStyle: {
             color: "#94DAD0",//'#373737',
             width: 0,
             type: 'solid'
             }
             },
             position: function (p){
             var width = $("#userchange").width() * 0.5;
             var height = $("#userchange").height() * 0.5;
             var w = p[0];
             var h = p[1];
             if (p[0] > width){
             w = p[0] - 160;
             }

             if (p[1] > height){
             h = p[1] - 80;
             }
             return [w,h];
             }
             },*/
            /*tooltip: {
                show: true,
                trigger: 'axis',
                formatter: function (params) {
                    var newTime = params.value[0],
                        newMonth = newTime.getMonth()+1,
                        newDate = newTime.getDate(),
                        newHour = newTime.getHours(),
                        newMinute = newTime.getMinutes(),
                        newSeconds = newTime.getSeconds();
                    newMonth = newMonth < 10 ? '0'+newMonth :newMonth;
                    newDate = newDate < 10 ? '0'+newDate :newDate;
                    newHour = newHour < 10 ? '0'+newHour :newHour;
                    newMinute = newMinute < 10 ? '0'+newMinute :newMinute;
                    newSeconds = newSeconds < 10 ? '0'+newSeconds :newSeconds;
                    if(newHour==0){
                        newHour=24;
                        var time = newTime.getFullYear()+"-"+newMonth+"-"+newDate+","+(newHour-1)+":"+newMinute+":"+newSeconds;
                    }
                    else{
                        var time = newTime.getFullYear()+"-"+newMonth+"-"+newDate+","+(newHour-1)+":"+newMinute+":"+newSeconds;
                    }
                    if (params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + Bandwidth[Unit];
                    return string;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                },
                position: function (p){
                    var width = $("#tape_change").width() * 0.5;
                    var height = $("#tape_change").height() * 0.5;
                    var w = p[0];
                    var h = p[1];
                    if (p[0] > width){
                        w = p[0] - 160;
                    }

                    if (p[1] > height){
                        h = p[1] - 80;
                    }
                    return [w,h];
                }
            },*/
            legend: {
                orient: "horizontal",
                y: 0,
                // x: "right",
                x: "center",
                itemWidth: 8,//default 20
                // itemWidth: 12,//default 20
                textStyle: {color: '#617085', fontSize: 12},
                //textStyle: { color: '#9AD4DC', fontSize: "12px" },
                data: [getRcText("CLIENT_ACCOUNT")]
                // '宾客数'
            },
            grid: {
                x: 30, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    show:true,
                    type: 'category',
                    splitLine: true,
                    boundaryGap:false,
                    axisLabel: {
                        interval:4,
                        show: true,
                        textStyle: {color: '#617085', fontSize:12}
                        /*formatter: function (data) {
                            console.log(getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes()),data);
                            return getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                        }*/
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    },
                    axisTick: {
                        show: false
                    },
                    data:xArr
                }
            ],
            yAxis: [
                {
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
                        textStyle: {color: '#617085', fontSize: 12, width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 0}
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2'],
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#FFF']}}
            }
        };
        $("#userchange").echart("init", option, oTheme);
    }
    function initUserChangeWeek(xArr,yArr) {
        var aseries = [];
        var Unit =0;
        var Bandwidth = new Array(getRcText("UNIT"));
        // "个"
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {normal: {areaStyle: {type: 'default'}, lineStyle: {width: 1}}},
            name: getRcText("CLIENT_ACCOUNT"),
            // "宾客数"
            data: yArr
        };
        aseries.push(oTemp);
        var option = {
            width: "100%",
            height: "230px",
            tooltip : {
                trigger: 'axis'
            },
            /* tooltip: {
             show: true,
             trigger: 'axis',
             formatter: function (params) {
             var newTime = params.value[0],
             newMonth = newTime.getMonth()+1,
             newDate = newTime.getDate(),
             newHour = newTime.getHours(),
             newMinute = newTime.getMinutes(),
             newSeconds = newTime.getSeconds();
             newMonth = newMonth < 10 ? '0'+newMonth :newMonth;
             newDate = newDate < 10 ? '0'+newDate :newDate;
             newHour = newHour < 10 ? '0'+newHour :newHour;
             newMinute = newMinute < 10 ? '0'+newMinute :newMinute;
             newSeconds = newSeconds < 10 ? '0'+newSeconds :newSeconds;
             var time = newTime.getFullYear()+"-"+newMonth+"-"+newDate+","+newHour+":"+newMinute+":"+newSeconds;
             if (params.value[1] < 0)
             params.value[1] = -params.value[1];
             var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + getRcText("UNIT");
             // "个"

             return string;
             },
             axisPointer: {
             type: 'line',
             lineStyle: {
             color: "#94DAD0",//'#373737',
             width: 0,
             type: 'solid'
             }
             },
             position: function (p){
             var width = $("#userchange").width() * 0.5;
             var height = $("#userchange").height() * 0.5;
             var w = p[0];
             var h = p[1];
             if (p[0] > width){
             w = p[0] - 160;
             }

             if (p[1] > height){
             h = p[1] - 80;
             }
             return [w,h];
             }
             },*/
            legend: {
                orient: "horizontal",
                y: 0,
                // x: "right",
                x: "center",
                itemWidth: 8,//default 20
                // itemWidth: 12,//default 20
                textStyle: {color: '#617085', fontSize: 12},
                //textStyle: { color: '#9AD4DC', fontSize: "12px" },
                data: [getRcText("CLIENT_ACCOUNT")]
                // '宾客数'
            },
            grid: {
                x: 30, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    show:true,
                    type: 'category',
                    boundaryGap:false,
                    splitLine: true,
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize:12}
                        /*formatter: function (data) {
                         console.log(getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes()),data);
                         return getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                         }*/
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    },
                    axisTick: {
                        show: false
                    },
                    data:xArr
                }
            ],
            yAxis: [
                {
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
                        textStyle: {color: '#617085', fontSize: 12, width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 0}
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2'],
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#FFF']}}
            }
        };
        $("#userchange").echart("init", option, oTheme);
    }
    function initUserChangeMonth(xArr,yArr) {
        var aseries = [];
        var Unit =0;
        var Bandwidth = new Array(getRcText("UNIT"));
        // "个"
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {normal: {areaStyle: {type: 'default'}, lineStyle: {width: 1}}},
            name: getRcText("CLIENT_ACCOUNT"),
            // "宾客数"
            data: yArr
        };
        aseries.push(oTemp);
        var option = {
            width: "100%",
            height: "230px",
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                orient: "horizontal",
                y: 0,
                // x: "right",
                x: "center",
                itemWidth: 8,//default 20
                // itemWidth: 12,//default 20
                textStyle: {color: '#617085', fontSize: 12},
                //textStyle: { color: '#9AD4DC', fontSize: "12px" },
                data: [getRcText("CLIENT_ACCOUNT")]
                // '宾客数'
            },
            grid: {
                x: 30, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    show:true,
                    type: 'category',
                    splitLine: true,
                    boundaryGap:false,
                    axisLabel: {
                        //rotate:-30,
                        interval:6,
                        show: true,
                        textStyle: {color: '#617085', fontSize:12}
                        /*formatter: function (data) {
                         console.log(getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes()),data);
                         return getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                         }*/
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    },
                    axisTick: {
                        show: false
                    },
                    data:xArr
                }
            ],
            yAxis: [
                {
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
                        textStyle: {color: '#617085', fontSize: 12, width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 0}
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2'],
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#FFF']}}
            }
        };
        $("#userchange").echart("init", option, oTheme);
    }

    function drawWeekCliNum(aInData) {
        var aseries = [];
        var splitNumber;
        var Unit = 0;
        var Bandwidth = new Array(getRcText("UNIT"));
        // "个"
        if (aInData.length > 8) {
            splitNumber = 9
        }
        else {
            splitNumber = aInData.length - 1;
        }
        var oTemp = {
            type: 'line',
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {normal: {areaStyle: {type: 'default'}, lineStyle: {width: 0}}},
            name: getRcText("CLIENT_ACCOUNT"),
            // "宾客数"
            data: aInData
        };
        aseries.push(oTemp);
        var option = {
            width: "100%",
            height: "230px",
            tooltip : {
                show:false,
                trigger: 'axis'
            },
            /*tooltip: {
                show: true,
                trigger: 'item',
                /!*formatter: function (params) {
                    var t_time = params.value[0];
                                                                                                                                               r time = t_time.getFullYear() + "-" + (t_time.getMonth() + 1) + "-" + t_time.getDate();
                    if (params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + getRcText("UNIT");
                    // "个"
                    return string;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: "#94DAD0",//'#373737',
                        width: 0,
                        type: 'solid'
                    }
                },
                position: function (p){
                    var width = $("#userchange").width() * 0.5;
                    var height = $("#userchange").height() * 0.5;
                    var w = p[0];
                    var h = p[1];
                    if (p[0] > width){
                        w = p[0] - 160;
                    }
                    
                    if (p[1] > height){
                        h = p[1] - 80;
                    }
                    return [w,h];
                }*!/
            },*/
            legend: {
                orient: "horizontal",
                y: 0,
                x: "center",
                // x: "right",
                // itemWidth: 12,//default 20
                itemWidth: 8,//default 20
                textStyle: { color: '#617085', fontSize: 12 },
                //textStyle: {color: '#9AD4DC', fontSize: "12px"},
                data: [getRcText("CLIENT_ACCOUNT")]
                // '宾客数'
            },
            grid: {
                x: 30, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    splitNumber: splitNumber,
                    type: 'time',
                    splitLine: true,
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize:12},
                        formatter: function (data) {
                            return (data.getMonth() + 1) + "-" + data.getDate();
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
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
                        textStyle: {color: '#617085', fontSize:12, width: 2}
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2'],
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#FFF']}}
            }
        };
        $("#userchange").echart("init", option, oTheme);
    }

    function drawOutletflow(aData1, aData2,aData3) {
        console.log("(aData1, aData2,aData3)",aData1, aData2,aData3);
        //var interNum=1;
        //if(aData1.length>=48){
        //    interNum=4;
        //}else if(aData1.length>=36){
        //    interNum=3;
        //}else if(aData1.length>=12){
        //    interNum=2;
        //}
        var Data1=[];
        var Data2=[];
        for(var i=0;i<aData1.length;i++){
            Data1.push(aData1[i]);
            Data2.push(aData2[i]);
            aData2[i]=0-aData2[i];
        }
        Data1 = Data1.sort(function (data1, data2) {
            return data2 - data1;
        });
        Data2 = Data2.sort(function (data1, data2) {
            return data2 - data1;
        });
        var Unit = 0;
        while ((Data1[0] > 1024) || (Data2[0] > 1024)) {
            Data1[0]=Data1[0]/1024;
            Data2[0]=Data2[0]/1024;
            for (i = 0; i < aData1.length; i++) {
                aData1[i] = (aData1[i]/ 1024).toFixed(3);;
                aData2[i] = (aData2[i]/ 1024).toFixed(3);
            }
            Unit++;
        }
        //console.log(Unit,"Unit");
        var Bandwidth = new Array("Kbps", "Mbps", "Gbps", "Tbps");
        var aseries = [];
        var oTemp1 = {
            symbol: "none",
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {
                normal: {
                    areaStyle: {type: 'default'},
                    lineStyle: {width: 1}
                }
            },
            name: getRcText("BAND_WIDTH").split(",")[0],
            // "上行带宽"
            data: aData1
        };
        aseries.push(oTemp1);

        var oTemp2 = {
            symbol: "none",
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {normal: {areaStyle: {type: 'default'}, lineStyle: {width: 1}}},
            name: getRcText("BAND_WIDTH").split(",")[1],
            // "下行带宽"
            data: aData2
        };
        aseries.push(oTemp2);

        var option = {
            width: "100%",
            height: "100%",
            tooltip : {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                },
                formatter:function(params){
                    return params[0].name+"<br/>"+params[0].seriesName+params[0].value+Bandwidth[Unit]+"<br/>"+params[1].seriesName+params[1].value*(-1)+Bandwidth[Unit];
                }
            },
            /*tooltip: {
                show: true,
                trigger: 'item',
                formatter: function (params) {
                    var newTime = params.value[0],
                        newMonth = newTime.getMonth()+1,
                        newDate = newTime.getDate(),
                        newHour = newTime.getHours(),
                        newMinute = newTime.getMinutes(),
                        newSeconds = newTime.getSeconds();
                    newMonth = newMonth < 10 ? '0'+newMonth :newMonth;
                    newDate = newDate < 10 ? '0'+newDate :newDate;
                    newHour = newHour < 10 ? '0'+newHour :newHour;
                    newMinute = newMinute < 10 ? '0'+newMinute :newMinute;
                    newSeconds = newSeconds < 10 ? '0'+newSeconds :newSeconds;
                    if(newHour==0){
                        newHour=24;
                        var time = newTime.getFullYear()+"-"+newMonth+"-"+newDate+","+(newHour-1)+":"+newMinute+":"+newSeconds;
                    }
                    else{
                        var time = newTime.getFullYear()+"-"+newMonth+"-"+newDate+","+(newHour-1)+":"+newMinute+":"+newSeconds;
                    }
                    if (params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + Bandwidth[Unit];
                    return string;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                },
                position: function (p){
                    var width = $("#tape_change").width() * 0.5;
                    var height = $("#tape_change").height() * 0.5;
                    var w = p[0];
                    var h = p[1];
                    if (p[0] > width){
                        w = p[0] - 160;
                    }
                    
                    if (p[1] > height){
                        h = p[1] - 80;
                    }
                    return [w,h];
                }
            },*/
            legend: {
                orient: "horizontal",
                y: 0,
                // x: "right",
                x: "center",
                itemWidth: 8,//default 20
                // itemWidth: 12,//default 20
                textStyle: {
                    color: '#617085',
                    fontSize: 12
                },
                data: [getRcText("BAND_WIDTH").split(",")[0], getRcText("BAND_WIDTH").split(",")[1]]
                // "上行带宽""下行带宽"
            },
            grid: {
                x: 40, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    boundaryGap:false,
                    type: 'category',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        interval:4,
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px"},
                        /*formatter: function (data) {
                            if(data.getHours()==0){
                                return getDoubleStr(23) + ":" + getDoubleStr(data.getMinutes());
                            }else{
                                return getDoubleStr(data.getHours()-1) + ":" + getDoubleStr(data.getMinutes());
                            }
                        }*/
                    },
                    data:aData3,
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    name: Bandwidth[Unit],
                    type: 'value',
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px", width: 2},
                        formatter: function (data) {
                            return data < 0 ? -data : data;
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2', '#f2bc98'],
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#FFF']}}
            }
        };
        $("#tape_change").echart("init", option, oTheme);
    }

    function drawOutletflowWeek(aData1, aData2) {
        //aData1.forEach(function(data) {
        //    data[1] = (data[1] > 0 ? 1 : -1) * data[1];
        //}, this);
        //
        //aData2.forEach(function(data) {
        //    data[1] = (data[1] > 0 ? -1 : 1) * data[1];
        //}, this);
        var Data1 = new Array();
        var Data2 = new Array();
        for (var i = 0; i < aData1.length; i++) {
            Data1[i] = aData1[i][1] * 1000;
            aData1[i][1] = aData1[i][1] * 1000;
        }
        for (i = 0; i < aData2.length; i++) {
            Data2[i] = aData2[i][1] * -1000;
            aData2[i][1] = aData2[i][1] * 1000;
        }
        Data1 = Data1.sort(function (data1, data2) {
            return data2 - data1;
        });
        Data2 = Data2.sort(function (data1, data2) {
            return data2 - data1;
        });

        var Unit = 0;
        while ((Data1[0] > 1000) || (Data2[0] > 1000)) {
            Data1[0] = Data1[0] / 1000;
            for (i = 0; i < aData1.length; i++) {
                aData1[i][1] = aData1[i][1] / 1000;
            }
            Data2[0] = Data2[0] / 1000;
            for (i = 0; i < aData2.length; i++) {
                aData2[i][1] = aData2[i][1] / 1000;
            }
            Unit++;
        }

        var Bandwidth = new Array("Kbps", "Mbps", "Gbps", "Tbps");
        var aseries = [];
        var oTemp1 = {
            symbol: "none",
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {
                normal: {
                    areaStyle: {type: 'default'},
                    lineStyle: {width: 0}
                }
            },
            name: getRcText("BAND_WIDTH").split(",")[0],
            // "上行带宽"
            data: aData1
        };
        aseries.push(oTemp1);

        var oTemp2 = {
            symbol: "none",
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {normal: {areaStyle: {type: 'default'}, lineStyle: {width: 0}}},
            name: getRcText("BAND_WIDTH").split(",")[1],
            // "下行带宽"
            data: aData2
        };
        aseries.push(oTemp2);
        var splitNumber;
        if (aData1.length > 8) {
            splitNumber = 7;
        }
        else {
            splitNumber = aData1.length - 1;
        }


        var option = {
            width: "100%",
            height: "100%",
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: function (params) {
                    var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                    if (params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string = params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + Bandwidth[Unit];
                    return string;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                },
                position: function (p){
                    var width = $("#tape_change").width() * 0.5;
                    var height = $("#tape_change").height() * 0.5;
                    var w = p[0];
                    var h = p[1];
                    if (p[0] > width){
                        w = p[0] - 160;
                    }
                    
                    if (p[1] > height){
                        h = p[1] - 80;
                    }
                    return [w,h];
                }
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "center",
                // x: "right",
                itemWidth: 8,//default 20
                // itemWidth: 12,//default 20
                textStyle: {
                    color: '#617085',
                    fontSize: '14px'
                },
                data: [getRcText("BAND_WIDTH").split(",")[0], getRcText("BAND_WIDTH").split(",")[1]]
                // "上行带宽""下行带宽"
            },
            grid: {
                x: 40, y: 20, x2: 22, y2: 30,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    splitNumber: splitNumber,
                    type: 'time',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        interval:4,
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px"},
                        //formatter: function(data) {
                        //    return getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                        //}
                        formatter: function (data) {
                            return (data.getMonth() + 1) + "-" + data.getDate();
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    name: Bandwidth[Unit],
                    type: 'value',
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: ['#eee']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px", width: 2},
                        formatter: function (data) {
                            return data < 0 ? -data : data;
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#AEAEB7', width: 1}
                    }
                }
            ],
            animation: false,
            series: aseries
        };
        var oTheme = {
            color: ['#4ec1b2', '#f2bc98'],
            // color: ['#4ec1b2', '#f2bc98'],
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#FFF']}}
            }
        };
        $("#tape_change").echart("init", option, oTheme);
    }

    function initMonthDay() {
        
        var ClientList = new Array(30);
        var Nowtime = (new Date()).getTime();
        for (var i = 0; i < 30; i++) {
            ClientList[i] = [(new Date(Nowtime - ((30 - i) * 86400000))), 0];
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
            ClientList[i] = [(new Date(Nowtime - ((7 - i) * 86400000))), 0];
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
    
    function initClientYesterDay() {
        /*昨天一天的数据*/
        var ClientList = new Array(24);
        var Curtime = new Date();
        var Nowtime = new Date(Curtime.getFullYear(), Curtime.getMonth(), Curtime.getDate()+1, 0, 0, 0);
        for (var i = 0; i < ClientList.length; i++) {
            ClientList[i] = [(new Date(Nowtime - ((ClientList.length - i -1) * 3600000))), 0];
        }
        return ClientList;
    }

    function doubNum(n){
        var str=n+"";
        if(str.length==1){
            return "0"+n;
        }else{
            return n;
        }
    }
    function todayClientCount(Today){
        var ajax = {
            url:MyConfig.path+"/stamonitor/monitor",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify({
                "method":"getOnlineClientDayStatByDevSN",
            
                "param":{
                   "devSN": FrameInfo.ACSN,
                    "dateTime":Today,
                    "datatype":""
                }
            }),
            onSuccess: function (data) {
                var initData=[];
                var xArr=[];
                var yArr=[];
                for(var i=0;i<data.response.length;i++){
                    xArr.push(doubNum(i)+":00");
                    yArr.push(data.response[i].totalCount);
                }
                initUserChangeToday(xArr,yArr);

            },
            onFailed:function(err){
                g_hPending&&g_hPending.close();
                console.log(err);
            }
        };
        Utils.Request.sendRequest(ajax);
    }
    function drawdayClientCount() {
        var Curtime = new Date();
        var Today = new Date(Curtime.getFullYear(), Curtime.getMonth(), Curtime.getDate());
        todayClientCount(Today);
        //var ClientList = initClientYesterDay();
        //var type = "day";
        //function getOnlineStaSuc(data, textStatus, jqXHR) {
        //    try {
        //        if (!('histclientList' in data && data.histclientList instanceof Array && data.histclientList.length > 0)) {
        //           throw (new Error('histclientList not exist'));
        //        }
        //        for (var i = 0; i < data.histclientList.length; i++) {
        //
        //            if (i != (data.histclientList.length - 1)) {
        //                var currentNode = new Date(data.histclientList[i].time);
        //                var NextNode = new Date(data.histclientList[i + 1].time);
        //                if ((currentNode.getDate() != NextNode.getDate()) ||
        //                    (currentNode.getMonth != NextNode.getMonth()) ||
        //                    (currentNode.getHours != NextNode.getHours())) {
        //                    for (var j = 0; j < ClientList.length; j++) {
        //                        if (ClientList[j][0].getHours() == currentNode.getHours()) {
        //                            //ClientList[j][0] = currentNode;
        //                            ClientList[j][1] = data.histclientList[i].totalCount;
        //                            break;
        //                        }
        //                    }
        //                }
        //            }else{
        //                for (var h = 0; h < ClientList.length; h++) {
        //
        //                    if (ClientList[h][0].getHours() == (new Date(data.histclientList[i].time)).getHours()) {
        //
        //                        ClientList[h][1] = data.histclientList[i].totalCount;
        //                        break;
        //                    }
        //                }
        //            }
        //        }
        //
        //    } catch (error) {
        //        console.log(error);
        //
        //    }finally{
        //        initUserChange(ClientList);
        //    }
        //}
        //
        ////getOnlineVisitor("curDay", getOnlineStaSuc, type);
        //aj_getUser(g_UserCondition[1], getOnlineStaSuc);

    }
    function weekClientCount(){
        var ajax = {
            url:MyConfig.path+"/stamonitor/monitor",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify({
                "method":"getclientcountbydevSN_oneweek",
                "param":{
                    "devSN": FrameInfo.ACSN,
                    "datatype":" "
                }
            }),
            onSuccess: function (data) {
                //var numArr=[];
                //var xArr=[];
                //var yArr=[];
                //var oDate=new Date();
                //oDate.setTime(oDate.getTime()-1000*60*60*24*6);
                //var oWeek=oDate.getDay();
                //var sevDay=oWeek;
                //for(var i=0;i<data.response.length-1;i++){
                //    numArr.push(sevDay);
                //    sevDay++;
                //    if(sevDay>=data.response.length){
                //        sevDay=0;
                //    }
                //}
                //console.log(xArr);
                //for(var i=0;i<7;i++){
                //    xArr.push(getRcText("ONE_WEEK").split(",")[numArr[i]]);
                //    yArr.push(data.response[i].totalCount);
                //    //initData.push({"name":doubNum(i)+":00","value":100});
                //}
                //xArr.splice(xArr.length-1,1,"今日");
                //console.log(xArr,yArr);
                //initUserChange(xArr,yArr);
                var xArr=[];
                var yArr=[];
                for(var i=data.response.length-1;i>=0;i--){
                    var oDate=new Date();
                    oDate.setTime(oDate.getTime()-1000*60*60*24*(i+1));
                    xArr.push((oDate.getMonth()+1)+"/"+oDate.getDate());
                    yArr.push(data.response[i].totalCount);
                }
                 yArr.reverse();
                initUserChangeWeek(xArr,yArr);
            },
            onFailed:function(err){
                g_hPending&&g_hPending.close();
                console.log(err);
            }
        };
        Utils.Request.sendRequest(ajax);
    }
    





    
    function drawWeekClientCount() {
        weekClientCount();
        //// var Nowtime = (new Date()).getTime();
        //// var OneweeksAgotime = Nowtime - 604800000;
        //// var EndTime = getEnddate();
        //// var StartTime = getStartdate(OneweeksAgotime);
        //var ClientList = initClientWeek();
        //var type = "week";
        ////fail
        //function getOnlineStaSuc(data, textStatus, jqXHR) {
        //    try {
        //        if (!('histclientList' in data && data.histclientList instanceof Array && data.histclientList.length > 0)) {
        //            throw (new Error('histclientList not exist'));
        //        }
        //        for (var i = 0; i < data.histclientList.length; i++) {
        //            if (i != (data.histclientList.length - 1)) {
        //
        //                var currentNode = new Date(data.histclientList[i].time);
        //                var NextNode = new Date(data.histclientList[i + 1].time);
        //                if ((currentNode.getDate() != NextNode.getDate()) || (currentNode.getMonth != NextNode.getMonth())) {
        //                    for (var j = 0; j < ClientList.length; j++) {
        //                        if (ClientList[j][0].getDate() == (currentNode.getDate() - 1)) {
        //                            //ClientList[j][0] = currentNode;
        //                            ClientList[j][1] = data.histclientList[i].totalCount;
        //                            break;
        //                        }
        //                    }
        //                }
        //            }else {
        //                for (var h = 0; h < ClientList.length; h++) {
        //
        //                    if ((ClientList[h][0].getDate() + 1) == (new Date(data.histclientList[i].time)).getDate()) {
        //                        //ClientList[h][0] = new Date(data.OnLineClientList[data.OnLineClientList.length - 1].updateTime);
        //                        ClientList[h][1] = data.histclientList[i].totalCount;
        //                        break;
        //                    }
        //                }
        //            }
        //        }
        //
        //    } catch (error) {
        //        console.log(error);
        //    }finally{
        //        drawWeekCliNum(ClientList);
        //    }
        //}
        //
        ////getOnlineVisitor("oneWeek", getOnlineStaSuc, type);
        //aj_getUser(g_UserCondition[2], getOnlineStaSuc);

    }
    function rnd(n,m){
        return parseInt(Math.random()*(m-n)+n);
    }
    function monthClientCount(){
        var ajax = {
            url:MyConfig.path+"/stamonitor/monitor",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify({
                "method":"getclientcountbydevSN_onemonth",
                "cfgTimeout": 120,
                "param":{
                    "devSN": FrameInfo.ACSN,
                    "datatype":" "
                }
            }),
            onSuccess: function (data) {
                var xArr=[];
                var yArr=[];
                for(var i=data.response.length-1;i>=0;i--){
                    var oDate=new Date();
                    oDate.setTime(oDate.getTime()-1000*60*60*24*(i+1));
                    xArr.push((oDate.getMonth()+1)+"/"+oDate.getDate());
                    yArr.push(data.response[i].totalCount);
                }
                yArr.reverse();
                initUserChangeMonth(xArr,yArr);
            },
            onFailed:function(err){
                g_hPending&&g_hPending.close();
                console.log(err);
            }
        }
        Utils.Request.sendRequest(ajax);
    }
    function drawMonthClientCount() {
        monthClientCount();
        //// var Nowtime = (new Date()).getTime();
        //// var OnemounthAgotime = Nowtime - 2678400000;
        //// var EndTime = getEnddate();
        //// var StartTime = getStartdate(OnemounthAgotime);
        //var ClientList = initMonthDay();
        //var type = "month";
        //
        //function getOnlineStaSuc(data, textStatus, jqXHR) {
        //    try {
        //        if (!('histclientList' in data && data.histclientList instanceof Array && data.histclientList.length > 0)) {
        //            throw (new Error('histclientList not exist'));
        //        }
        //        for (var i = 0; i < data.histclientList.length; i++) {
        //            if (i != (data.histclientList.length - 1)) {
        //
        //                var currentNode = new Date(data.histclientList[i].time);
        //                var NextNode = new Date(data.histclientList[i + 1].time);
        //                if ((currentNode.getDate() != NextNode.getDate()) || (currentNode.getMonth() != NextNode.getMonth())) {
        //                    for (var j = 0; j < ClientList.length; j++) {
        //                        if ((ClientList[j][0].getDate() == (currentNode.getDate() - 1))&&
        //                            (ClientList[j][0].getMonth() == currentNode.getMonth())) {
        //                            //ClientList[j][0] = currentNode;
        //                            ClientList[j][1] = data.histclientList[i].totalCount;
        //                            break;
        //                        }
        //                    }
        //                }
        //            }else {
        //
        //                for (var h = 0; h < ClientList.length; h++) {
        //                    if ((ClientList[h][0].getDate() + 1) == (new Date(data.histclientList[i].time)).getDate()) {
        //                        //ClientList[h][0] = new Date(data.histclientList[i].time);
        //                        ClientList[h][1] = data.histclientList[i].totalCount;
        //                        break;
        //                    }
        //                }
        //            }
        //        }
        //
        //    } catch (error) {
        //        console.log('getOnlineStaSuc Error:' + error);
        //
        //    }finally{
        //        drawWeekCliNum(ClientList);
        //    }
        //}
        //
        ////getOnlineSta(StartTime, EndTime, getOnlineStaSuc, type);
        ////getOnlineVisitor("oneMonth", getOnlineStaSuc, type);
        //aj_getUser(g_UserCondition[3], getOnlineStaSuc);

    }

    function drawDayflow() {
        var Curtime = new Date();
        var nowTime=Curtime;
        //Curtime.setMonth(1);
        Curtime.setHours(0);
        Curtime.setMinutes(0);
        Curtime.setSeconds(0);
        var EndTime =  new Date();
        var StartTime =nowTime;
        //var fourHours = 4 * 60 * 60 * 1000;
        //var upFlow = initClientYesterDay();
        //var downFlow = initClientYesterDay();
        var upFlow = [];
        var downFlow = [];
        var type = 'dayflow';

        function onSuccess(data) {
            try{
                /*时间坐标*/
                //var xTime = new Date();
                //xTime.setHours(0);
                //xTime.setMinutes(0);
                //xTime.setSeconds(0);
                //var arrTime=[];
                //for(var i=0;i<48;i++){
                //    xTime.setTime(xTime.getTime()+30*60*1000);
                //    arrTime.push(doubNum(xTime.getHours())+":"+doubNum(xTime.getMinutes()));
                //}
                /*时间轴*/
                var xArr=[];
                for(var i=0;i<24;i++){
                    xArr.push(doubNum(i)+":00");
                }
                /*时间数量不定，一小时只取一组数据*/
                var upFlowData=[];
                var downFlowData=[];
                for(var i=0;i<24;i++){
                    upFlowData.push(0);
                    downFlowData.push(0);
                }
                //console.log("upFlowData,downFlowData",upFlowData,downFlowData);
                for(var i=0;i<data.trafficList.length;i++){
                    for(var j=0;j<(new Date()).getHours();j++){
                        var oDate=(new Date(data.trafficList[i].updateTime));
                        if(oDate.getHours()==j){
                            if(upFlowData[j]<=data.trafficList[i].upflow){
                                upFlowData[j]=data.trafficList[i].upflow||0;
                            }
                            if(downFlowData[j]<=data.trafficList[i].downflow){
                                downFlowData[j]=data.trafficList[i].downflow||0;
                            }
                        }
                    }
                }
                //for(var i=0;i<(24-upFlowData.length);i++){
                //    upFlowData.push(0);
                //    downFlowData.push(0);
                //}
                //cosnole.log("24-upFlowData.length",24-upFlowData.length);
                drawOutletflow(upFlowData,downFlowData,xArr);
            }catch(err){
                console.log(err);
                var xArr=[];
                /*无数据时*/
                for (var i = 0; i < 24; i++) {
                    xArr.push(doubNum(i) + ":00");
                    upFlow.push(0);
                    downFlow.push(0);
                }
                drawOutletflow(upFlow, downFlow, xArr);
            }

            //console.log("upFlowData,downFlowData",upFlowData,downFlowData,xArr);
        }
        getFlowInfoTody(StartTime, EndTime, onSuccess, type);
    }
    /*补零*/
    function doubNum(n){
        var str=n+"";
        if(str.length==1){
            return "0"+n;
        }else{
            return n;
        }
    }
    /*获取今日带宽数据*/
    function getFlowInfoTody(StartTime, EndTime,onSuccess, type){
        function onFailed(jqXHR, textStatus, error) {
            g_hPending&&g_hPending.close();
            console.log("getFlowInfo type【" + type + "】【error】:" + error);
        }

        var getFlowInfoOpt = {
            type: "GET",
            url: MyConfig.path + "/devmonitor/web/hiswantraffic" + "?devSN=" + FrameInfo.ACSN + "&startTime="
            + StartTime + "&endTime=" + EndTime,
            dataType: "json",
            timeout: 150000,
            onSuccess: onSuccess,
            onFailed: onFailed
        };

        Utils.Request.sendRequest(getFlowInfoOpt);
    }

    function getWeekflowSpeed() {
        var Nowtime = (new Date()).getTime();
        var OneweekAgotime = Nowtime - 604800000;
        var EndTime = getEnddate();
        var StartTime = getStartdate(OneweekAgotime);
        var upFlow = initClientWeek();
        var downFlow = initClientWeek();
        var type = "weekflowspeed";

        function onSuccess(data, textStatus, jqXHR) {
            try {
                if (!('trafficList' in data && data.trafficList instanceof Array && data.trafficList.length > 0 )) {
                    throw (new Error('trafficList not exist'));
                }
                for (var i = 0; i < data.trafficList.length; i++) {
                    if (i != (data.trafficList.length - 1)) {

                        var currentNode = new Date(data.trafficList[i].updateTime);
                        var NextNode = new Date(data.trafficList[i + 1].updateTime);
                        if ((currentNode.getDate() != NextNode.getDate()) || (currentNode.getMonth != NextNode.getMonth())) {
                            for (var j = 0; j < upFlow.length; j++) {
                                if (upFlow[j][0].getDate() == currentNode.getDate()) {
                                    upFlow[j][1] = data.trafficList[i].upflow / 1024;
                                    downFlow[j][1] = data.trafficList[i].downflow / 1024 * -1;
                                    break;
                                }
                            }
                        }
                    }else {
                        for (var h = 0; h < upFlow.length; h++) {

                            if (upFlow[h][0].getDate() == (new Date(data.trafficList[i].updateTime)).getDate()) {
                                upFlow[h][1] = data.trafficList[i].upflow / 1024;
                                downFlow[h][1] = data.trafficList[i].downflow / 1024 * -1;
                                break;
                            }
                        }
                    }
                }

            } catch (error) {
                console.log("getWeekflowSpeed error:" + error);
            }finally{
                initSpeedBar("#uploadSpeed-bar", "#4ec1b2", upFlow);
                initSpeedBar("#downloadSpeed-bar", '#f2bc98', downFlow);
            }
        }

        getFlowInfo(StartTime, EndTime, onSuccess, type);
    }

    function drawWeekflow(Nowtime, agoTime) {
        var EndTime = getEnddate();
        var StartTime = getStartdate(agoTime);
        var upFlow = initClientWeek();
        var downFlow = initClientWeek();
        var type = "weekflow";

        function onSuccess(data, textStatus, jqXHR) {
            try {
                if (!('trafficList' in data && data.trafficList instanceof Array && data.trafficList.length > 0 )) {
                    throw (new Error('trafficList not exist'));
                }
                for (var i = 0; i < data.trafficList.length; i++) {

                    if (i != (data.trafficList.length - 1)) {
                        var currentNode = new Date(data.trafficList[i].updateTime);
                        var NextNode = new Date(data.trafficList[i + 1].updateTime);
                        if ((currentNode.getDate() != NextNode.getDate()) || (currentNode.getMonth != NextNode.getMonth())) {
                            for (var j = 0; j < upFlow.length; j++) {
                                if (upFlow[j][0].getDate() == currentNode.getDate()) {
                                    //upFlow[j][0] = currentNode;
                                    //downFlow[j][0] = currentNode;
                                    upFlow[j][1] = data.trafficList[i].speed_up / 1000;
                                    downFlow[j][1] = data.trafficList[i].speed_down / 1000 * -1;
                                    break;
                                }
                            }
                        }
                    }else {
                        for (var h = 0; h < upFlow.length; h++) {
                            if (upFlow[h][0].getDate() == (new Date(data.trafficList[i].updateTime)).getDate()) {
                                //upFlow[h][0] = new Date(data.trafficList[i].updateTime);
                                upFlow[h][1] = data.trafficList[i].speed_up / 1000;
                                downFlow[h][1] = data.trafficList[i].speed_down / 1000 * -1;
                                break;
                            }
                        }
                    }
                }

            } catch (error) {
                console.log("drawWeekflow error:" + error);
            } finally{
                drawOutletflowWeek(upFlow, downFlow);
            }
        }

        getFlowInfo(StartTime, EndTime, onSuccess, type);

    }

    function drawMounthFlow() {
        var Nowtime = (new Date()).getTime();
        var OnemounthAgotime = Nowtime - 2678400000;
        var EndTime = getEnddate();
        var StartTime = getStartdate(OnemounthAgotime);
        var upFlow = initMonthDay();
        var downFlow = initMonthDay();
        var type = "MounthFlow";

        function onSuccess(data, textStatus, jqXHR) {
            try {
                if (!('trafficList' in data && data.trafficList instanceof Array && data.trafficList.length > 0 )) {
                    throw (new Error('trafficList not exist'));
                }
                for (var i = 0; i < data.trafficList.length; i++) {
                   if (i != (data.trafficList.length - 1)) {
                        var currentNode = new Date(data.trafficList[i].updateTime);
                        var NextNode = new Date(data.trafficList[i + 1].updateTime);
                        if ((currentNode.getDate() != NextNode.getDate()) || (currentNode.getMonth != NextNode.getMonth())) {
                            for (var j = 0; j < upFlow.length; j++) {
                                if ((upFlow[j][0].getDate() == currentNode.getDate())&&
                                    (upFlow[j][0].getMonth() == currentNode.getMonth())) {
                                    //upFlow[j][0] = currentNode;
                                    //downFlow[j][0] = currentNode;
                                    upFlow[j][1] = data.trafficList[i].speed_up / 1000;
                                    downFlow[j][1] = data.trafficList[i].speed_down / 1000 * -1;
                                    break;
                                }
                            }
                        }
                    }else {
                        for (var h = 0; h < upFlow.length; h++) {

                            if ((upFlow[h][0].getDate() == (new Date(data.trafficList[i].updateTime)).getDate())&&
                            (upFlow[h][0].getMonth() == (new Date(data.trafficList[i].updateTime)).getMonth())) {
                                //upFlow[h][0] = new Date(data.trafficList[i].updateTime);
                                upFlow[h][1] = data.trafficList[i].speed_up / 1000;
                                downFlow[h][1] = data.trafficList[i].speed_down / 1000 * -1;
                                break;
                            }
                        }
                    }
                }


            } catch (error) {
                console.log("draw month flow error:" + error);
            }finally{
                drawOutletflowWeek(upFlow, downFlow);
            }
        }

        getFlowInfo(StartTime, EndTime, onSuccess, type);
    }

    function initScorePie(score, status) {
        if (status == 1) {
            score = score || 0;
        } else {
            score = 100;
        }
        var centerPieStyle = {
            normal: {
                color: 'white',//red yellow green
                label: {show: true, position: 'center'},
                labelLine: {show: false}
            },

            emphasis: {
                label: {
                    show: true,
                    formatter: function (params) {
                        if (status == 1) {
                            return params.data.score;
                        } else {
                            return "0";
                        }
                    },
                    textStyle: (status == 1 ? {
                        baseline: "middle",
                        fontSize: "38",
                        color: "#646D77",
                    } : {
                        baseline: "middle",
                        fontSize: "38",
                        color: "#646D77",
                    })
                }
            }

        };
        var otherStyle = {
            normal: {
                color: "#ccc",
                labelLine: {show: false,}
            }
        };
        var scoreStyle = {
            normal: {
                color: (status == 1 ? ((score >= 80 ? "#4ec1b2" : (score >= 60 ? "#fbceb1" : "#fe808b"))) : "#f5f5f5"),//"#fe808b",
                labelLine: {show: false,}
            }
        };
        var option = {
            height: "200px",
            width: "240px",
            series: [
                {
                    type: "pie",
                    radius: [0, 47],
                    // radius: [0, 50],
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
                                    fontSize: "38",
                                    color: "#646D77",
                                } : {
                                    baseline: "middle",
                                    fontSize: "38",
                                    color: "#646D77",
                                })
                            }
                        }
                    },
                    data: [
                        {value: 100, score: score, itemStyle: centerPieStyle}
                    ]
                },
                {
                    type: "pie",
                    radius: [47, 58], //65 80
                    // radius: [50, 58], //65 80
                    max: 100,
                    clockWise: false,
                    data: [
                        {value: 100 - score, itemStyle: otherStyle},
                        {value: score, itemStyle: scoreStyle}
                    ]
                }
            ]
        }
        $("#score-pie").echart("init", option);
    }

    function initSpeedBar(id, color, flowData) {
        var DateTemp = new Array(flowData.length);
        var DateTempbg = new Array(flowData.length);
        var maxflow = 100;
        /*动态生成最大值*/
        for (var j = 0; j < flowData.length; j++) {
            if (flowData[j][1] > 100 || (-1 * flowData[j][1]) > 100) {
                if (flowData[j][1] < 0) {
                    maxflow = -1 * flowData[j][1];
                }
                else {
                    maxflow = flowData[j][1];
                }
            }
        }
        for (var i = 0; i < flowData.length; i++) {
            if (flowData[i][1] < 0) {
                DateTemp[i] = -1 * flowData[i][1];
                DateTempbg[i] = maxflow - DateTemp[i];
            }
            else {
                DateTemp[i] = flowData[i][1];
                DateTempbg[i] = maxflow - DateTemp[i];
            }
        }
        var option = {
            height: "30px",
            width: "100px",
            grid: {borderWidth: 0, x: 0, y: 0, y2: 0, x2: 0},
            xAxis: [
                {
                    type: 'category',
                    show: false,
                    data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'map']//['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'map']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    show: false,
                    axisLine: {show: false}
                }
            ],
            series: [
                {
                    type: 'bar',
                    barWidth: 10,
                    barCategoryGap: "80%",
                    stack: 'sum',
                    itemStyle: {
                        normal: {
                            color: color,
                            label: {show: false},
                        }
                    },
                    data: DateTemp//[12, 21, 10, 4, 12, 5, 6, 5, 9]
                },
                {
                    type: 'bar',
                    barWidth: 10,
                    barCategoryGap: "80%",
                    stack: 'sum',
                    itemStyle: {
                        normal: {
                            color: "#f5f5f5",
                            label: {show: false},
                        }
                    },
                    data: DateTempbg//[30 - 12, 30 - 21, 30 - 10, 30 - 4, 30 - 12, 30 - 5, 30 - 6, 30 - 5, 30 - 9]
                }
            ]
        };
        $(id).echart("init", option);
    }

    function aj_UpadteWanInfo(upband, downband, callback) {
        g_hPending = Frame.Msg.pending(getRcText("PANGING_INFO").split(",")[0]);
        var opt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                "configType": 0,
                "sceneFlag": "true",
                "sceneType": 2,
                "userName": FrameInfo.g_user.user,
                "shopName": g_sShopName ,
                "cfgTimeout": 120,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "method": "ScenariosUpdate",
                "policy":"cloudFirst",
                "param": [{
                    "userName": FrameInfo.g_user.user,
                    "nasId": FrameInfo.Nasid,
                    "sceneName": g_sShopName ,
                    "upBandwidth": upband,
                    "downBandwidth": downband,
                    "type": "1"
                }]
            }),
            onSuccess:function (data) {
                    if(typeof(data) == "object") {
                        if(data.serviceResult =="success") {
                            var aErrList = [];
                            for (var i = 0; i < data.deviceResults.length; i++) {
                                if ((data.deviceResults[i].communicateResult != "success") || (data.deviceResults[i].deviceResult.result != "success")) {
                                    aErrList.push(data.deviceResults[i].devSN);
                                }
                            }
                            if (aErrList.length == 0) {
                                Frame.Msg.info(getRcText("MSG_INFO").split(",")[0]);
                                callback(0);
                            }
                            else {
                                Frame.Msg.info(getRcText("FAIL_INFO") + aErrList.join(", "));
                                callback(1);
                            }
                        }
                        else{
                            Frame.Msg.info(getRcText("MSG_INFO").split(",")[1],"error");
                            callback(1);
                        }
                        g_hPending&&g_hPending.close();
                            return;
                        //if("serviceResult" in data && data.serviceResult == "success"){
                        //    var datasuc = [];
                        //    for(i=0;i<data.deviceResults.length;i++){
                        //        datasuc.push(data.deviceResults[i].communicateResult);
                        //    }
                        //    if(datasuc.join('').indexOf("fail") == -1 ){
                        //        g_hPending.close();
                        //        Frame.Msg.info(getRcText("MSG_INFO").split(",")[0]);
                        //        callback(0);
                        //    }
                        //    else{
                        //        g_hPending.close();
                        //         Frame.Msg.info(getRcText("FAIL_INFO"));
                        //        callback(1);
                        //    }
                        //}
                        //else{
                        //    g_hPending.close();
                        //    Frame.Msg.info(getRcText("MSG_INFO").split(",")[1],"error");
                        //    callback(1);
                        //}
                    }
            },
            onFailed:function (err) {
                g_hPending&&g_hPending.close();
                //Frame.Msg.info("配置失败", "error");
                Frame.Msg.info(getRcText("MSG_INFO").split(",")[1],"error");
                callback(1);
            }
        };

        Utils.Request.sendRequest(opt);
    }

    function aj_getWanInfo(callback) {
        var opt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                "configType": 1,
                "sceneFlag": "true",
                "sceneType": 2,
                "userName": FrameInfo.g_user.user,
                "shopName": g_sShopName ,
                "cfgTimeout": 120,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                //"method": "BandWidthUpdate",
                "method": "GetScenariosCfg",
                "param": [{
                    "userName": FrameInfo.g_user.user,
                    "nasId": FrameInfo.Nasid,
                    "sceneName": g_sShopName ,
                    "type": "1"
                }]
            }),
            onSuccess:function (data) {
                try {
                    if(!('result' in data && 'upBandwidth' in data.result && 'downBandwidth' in data.result)){
                        throw (new Error('paragram not exist'));
                    }
                    callback(data.result.upBandwidth, data.result.downBandwidth);
                }catch(error){
                    callback(0, 0);
                }
            },
            onFailed:function (err) {
                g_hPending&&g_hPending.close();
                callback(0, 0);
            }
        };

        Utils.Request.sendRequest(opt);
    }

// Internet带宽设置
    function onOpenAddDlg(oRowData, type) {
        console.log(oRowData);
        console.log(type);
        aj_getWanInfo(function (upbandwidth, downbandwidth) {
            document.getElementById("upband_id").value = upbandwidth;
            document.getElementById("downband_id").value = downbandwidth;
        });
        $("#AddInternetForm").form("init", "edit", {
            title: getRcText("ADD_TITLE"), "btn_apply": function () {
                //AddPro()
                var downband = $("#downband_id").val();
                var upband = $("#upband_id").val();
                if ((downband == "") || (upband == "")) {
                    return;
                }
                if (downband == 0) {
                    Frame.Msg.info(getRcText("MSG_INFO").split(",")[2], 'error');
                    // "下行带宽不能为0"
                    return;
                }

                aj_UpadteWanInfo(upband, downband, function (err) {
                    if (err == 0) {
                        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddApDlg")));
                        initHealthScore();
                    }
                });

            }
        });

        //$("div").find("a").removeClass('disabled');
        Utils.Base.openDlg(null, {}, {scope: $("#AddApDlg"), className: "modal-small"});
    }


    function initForm() {
        /*刷新显示一天的数据*/
        drawDayflow();
        drawdayClientCount();

        $("#days").click(function () {
            /*获取当前时间往前推一天的在线用户数*/
            $("div.station-change a.xx-link").removeClass("active");
            $(this).addClass("active");
            drawdayClientCount();
        });
        $("#weeks").click(function () {
            $("div.station-change a.xx-link").removeClass("active");
            $(this).addClass("active");
            drawWeekClientCount();
        });
        $("#mounth").click(function () {
            $("div.station-change a.xx-link").removeClass("active");
            $(this).addClass("active");
            drawMonthClientCount();
        });

        $("#tape_days").click(function () {
            $("div.flow-change a.xx-link").removeClass("active");
            $(this).addClass("active");
            drawDayflow();
        });

        //$("#tape_weeks").click(function () {
        //    $("div.flow-change a.xx-link").removeClass("active");
        //    $(this).addClass("active");
        //    var Nowtime = (new Date()).getTime();
        //    var OneweekAgotime = Nowtime - 604800000;
        //    drawWeekflow(Nowtime, OneweekAgotime);
        //});
        //
        //$("#tape_mounth").click(function () {
        //    $("div.flow-change a.xx-link").removeClass("active");
        //    $(this).addClass("active");
        //    drawMounthFlow();
        //});
        $("#report").click(function () {
            $("#a_speed").addClass("arrow_active");
            $("#a_internal").removeClass("arrow_active");
            $("#a_terminal").removeClass("arrow_active");
            $("#a_environment").removeClass("arrow_active");
            $("#a_cpu").removeClass("arrow_active");
            $("div.health_box span.boxname").next().hide().first().show();
            Utils.Base.openDlg(null, {}, {scope: $("#reportdetail"), className: "modal-small"});
        });
        // 请先设置Internet带宽
        $("#device_Internet").click(function (event) {
            onOpenAddDlg();

        });
        // Internet 带宽设置
        $("#reports").click(function () {
            onOpenAddDlg();
        });
        $(".boxname").click(function () {
            $(this).next().toggle(100);
            $(this).find("span.arrow").toggleClass("arrow_active");

        });
    }

    function initClientCount() {
        //当前回头客 当前新宾客
        function getClientCount(onsuccess, onfail) {
            var getClientCountOpt = {
                type: "GET",
                url: MyConfig.path + "/stamonitor/getstastatistic?devSN=" + FrameInfo.ACSN,
                dataType: "json",
                timeout: 150000,
                onSuccess: onsuccess,
                onFailed: onfail
            };
            Utils.Request.sendRequest(getClientCountOpt);
        }

        function ClientCountSuc(data, textStatus, jqXHR) {
            try {
                if (!('stationList' in data && data.stationList instanceof Object && 'NewStaCount' in data.stationList && 'OldStaCount' in data.stationList)) {
                    throw (new Error('data unexpected error'));
                }
                $("#online_new_user").text(data.stationList.NewStaCount);
                $("#client-count").text(data.stationList.OldStaCount);
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

    function initApTraffic() {
        //上传速率 下载速率
        function getApTraffic(onsuccess) {
            function onfail(jqXHR, textStatus, error) {
                g_hPending&&g_hPending.close();
                console.log("getApTraffic error:" + error);
            }

            var getApTrafficOpt = {
                type: "GET",
                url: MyConfig.path + "/apmonitor/web/aptraffic?devSN=" + FrameInfo.ACSN,
                dataType: "json",
                timeout: 150000,
                onSuccess: onsuccess,
                onFailed: onfail
            };
            Utils.Request.sendRequest(getApTrafficOpt);
        }

        function calculateSpeed($item, speed) {
            var speeds = speed*8;
            if (speeds > 1000) {
                $($item)
                    .text((speeds / 1024).toFixed(2))
                    .next().text("Mbps");
            }
            else {
                $($item)
                    .text((speeds).toFixed(2))
                    .next().text("Kbps");
            }
        }

        function apTrafficSuc(data, textStatus, jqXHR) {
            try {
                if (!('apList' in data && data.apList instanceof Array && data.apList.length > 0 && ('transmitRate', 'receiveRate') in data.apList[0])) {
                    throw (new Error("('transmitRate','receiveRate') not exist"));
                }
                if (("errcode" in data) && (data.errcode == "illegal access")) {
                    console.log("getClientCount error, errCode:" + data.errcode);
                    return;
                }
                var ap = data.apList[0];
                calculateSpeed("#upload-traffic", ap.transmitRate); //shang chuan
                calculateSpeed("#download-traffic", ap.receiveRate);//xia zai
            } catch (error) {
                console.log("getapTrafficSuc error:" + error);
            }
        }

        getApTraffic(apTrafficSuc);

    }

    function getRcText(sRcName) {
        return Utils.Base.getRcString("x_index_rc", sRcName);
    }
    function initScorePies(){
        var option = {
            calculable : false,
            height:300,
            tooltip : {
                show:false
            },
            series : [
                {
                    type: 'pie',
                    radius: ['35%', '65%'],
                    center: ['25%', '47%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                show:false
                            }
                        }
                    },
                    data: [{name:"",value:1}]
                }
            ]
        };
        var oTheme = {color: ['#B7ADAD']};
    }
    function initHealthScore() {
        function updataHealthScore(healthData) {
            if (!healthData || healthData == -1) {
                healthData = {
                    'finalscore': 0, //综合得分
                    'wanspeed': 0,
                    'security': 0,
                    'clientspeed': 0,
                    'APpercent': 0,
                    'system': 0,
                    'wireless': 0,
                    'Bpercent': 0
                };
                $("#terminalMessage").css('display', 'none');
                initScorePies(healthData.finalscore, 1);
            }
            $("#terminalMessage").css({"position":"absolute","bottom":"-17px","width":"251px","text-align":"center","margin-left":"10px","display":"block"});
            var healthcolor = "rgba(78,193,178, ";
            if(healthData.finalscore == 0){
                healthcolor = "rgba(254,128,139,";
                $("#terminalMessage").css("color", "#fe8086")
                   // .css("fontFamily", "arial,华文细黑")
                    .css("textShadow", "none");
                $("#terminalMessage").html(getRcText("TIP_PROFIX1") +(100 -healthData.Bpercent) + getRcText("TIP0"));
            }
            else if (healthData.finalscore >0&&healthData.finalscore < 40) {
                healthcolor = "rgba(254,128,139,";
                $("#terminalMessage").css("color", "#fe8086")
                   // .css("fontFamily", "arial,华文细黑")
                    .css("textShadow", "none");
                $("#terminalMessage").html(getRcText("TIP_PROFIX1") + (100 -healthData.Bpercent) + getRcText("TIP1"));
            }
            else if (healthData.finalscore < 70) {
                healthcolor = "rgba(251,206,177,";
                $("#terminalMessage").css("color", "#fbceb1")
                   // .css("fontFamily", "arial,华文细黑")
                    .css("textShadow", "none");
                $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP2"));
            }
            else {
                healthcolor = "rgba(78,193,178,";
                $("#terminalMessage")
                    .css("color", "#4ec1b2")
                   // .css("fontFamily", "arial,华文细黑")
                    .css("textShadow", "none");
                if (healthData.finalscore < 80) {
                    $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP3"));
                } else if (healthData.finalscore < 90) {
                    $("#terminalMessage").html(getRcText("TIP_PROFIX2") + healthData.Bpercent + getRcText("TIP4"));
                }
                else {
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
            drawtext(healthData.wireless, "internal-utilization", "MEMORY_UTLIZATION");
            // 优质终端比例
            drawtext(healthData.clientspeed, "wifi-terminal", "WIFI_TERMINAL");
            // 环境无线干扰
            drawtext(healthData.security, "wifi-environment", "WiFi_ENVIROMENT");
            // 系统运行状态
            drawtext(healthData.system, "cpu-utilization", "CPU_TILIZATION");
            // 设备在线率
            drawtext(healthData.APpercent, "safety-evaluation", "SAFE_VALUATION");



            $('#raty_score_1').raty({readOnly: true, score: healthData.wanspeed, path: 'libs/jquery_raty/img/'});
            $('#raty_score_2').raty({readOnly: true, score: healthData.wireless, path: 'libs/jquery_raty/img/'});
            $('#raty_score_3').raty({readOnly: true, score: healthData.clientspeed, path: 'libs/jquery_raty/img/'});
            $('#raty_score_4').raty({readOnly: true, score: healthData.security, path: 'libs/jquery_raty/img/'});
            $('#raty_score_5').raty({readOnly: true, score: healthData.system, path: 'libs/jquery_raty/img/'});
            $('#raty_score_6').raty({readOnly: true, score: healthData.APpercent, path: 'libs/jquery_raty/img/'});
            
            initScorePie(healthData.finalscore, 1);
        }

        function getHealthScore(onSuccess,onFailed) {

            var getHealthScoreOpt = {
                type: "GET",
                url: MyConfig.path + "/health/home/miniBei?apSN=" + FrameInfo.ACSN,
                dataType: "json",
                timeout: 150000,
                onSuccess:onSuccess,
                onFailed:onFailed
            }

            Utils.Request.sendRequest(getHealthScoreOpt);
        }

        getHealthScore(function (data, textStatus, jqXHR) {
            if (typeof (data) != Object) {
                //console.log(data);//error
            }

            //{"_id":"57038910c76aad0100846cef","apSN":"210236A35VA10A101777","finalscore":88,"wanspeed":5,"environment":5,"clientspeed":5,"APpercent":5,"system":1,"devload":5,"Bpercent":11,"__v":0}"
            updataHealthScore(JSON.parse(data));
        },function () {
            updataHealthScore();
        });

        //设置上下行带宽分数显示
        aj_getWanInfo(function (upbandwidth, downbandwidth) {
            document.getElementById("upband_id").value = upbandwidth;
            document.getElementById("downband_id").value = downbandwidth;

            if (upbandwidth != 0) {
                $("#device_Internet").hide();
                $("#raty_score_1").show();
                
                $("#reports").show();

            } else {
                $("#reports").hide();
               // $("#raty_score_1").hide();
                $("#device_Internet").show();
            }
        });
    }

    function optionPush(){
        $(".toppannel #switch-text").html(getRcText("switchBtn"));
        function parseQuery(location) {
            var query = location.search.replace('?', '');
            var params = query.split('&');
            var result = {};
            $.each(params, function () {
                var temp = this.split('=');
                result[temp[0]] = temp.length === 2 ? temp[1] : undefined;
            });
            return result;
        }
        /*var $panel = $('#scenes_panel'), //  下拉面板
         $trigger = $('#change_scenes_trigger'),  //  点击展开的按钮
         $btnChange = $('#switchScenesBtn'),  //  确认按钮
         $selectedScene = $('#selectedScene'),  //  场景选择下拉框
         $devSn = $('#devSn'),  //  设备管理下拉
         $devContain = $('#device-contain'),
         $contain = $('#scene-contain');  //  容器*/
        var $panel = $('#reDevSelect #scenes_panel'), //  下拉面板
            $trigger = $('#reDevSelect #change_scenes_trigger'),  //  点击展开的按钮
            $btnChange = $('#reDevSelect #switchScenesBtn'),  //  确认按钮
            $selectedScene = $('#reDevSelect #selectedScene'),  //  场景选择下拉框
            $devSn = $('#reDevSelect #devSn'),  //  设备管理下拉
            $devContain = $('#reDevSelect #device-contain'),
            $contain = $('#reDevSelect #scene-contain');  //  容器
        //  if first load,set devsn value param's devsn
        var firstLoad = true, //   是否首次加载
            locales = {
                cn: {
                    trigger: '切换设备',
                    device: '选择设备',
                    shop: '选择场所',
                    online: '在线',
                    offline: '不在线'
                },
                en: {
                    trigger: 'Switch Device',
                    device: 'Device',
                    shop: 'Shop',
                    online: 'Online',
                    offline: 'Offline'
                }
            },
            _lang = $.cookie('lang') || 'cn';

        var senceInfo = parseQuery(window.location),
            model = senceInfo.model,  // 存储model信息
            sn = senceInfo.sn,
            nasid = senceInfo.nasid,
            sceneDevList = {}, //   场景和设备的关联关系
            sceneModelObj = {}, //  场景和model的对应关系  {shopId:model}
            devInfoList = {};  //  设备信息列表  {devSN:{devInfo}}

        $('#reDevSelect #switch-text').html(locales[_lang].trigger);  //  点击展开的文本
        $('#reDevSelect #switch-shop').html(locales[_lang].shop);   //  选择场所label
        $('#reDevSelect #switch-device').html(locales[_lang].device);   //   选择设备label

        /**
         * 生成dev下拉框并设置值
         */
        function fillDevField() {
            var val = $selectedScene.val(), devs = sceneDevList[val], devHtml = [];
            $devSn.html('');
            var selectedModel = sceneModelObj[val];
            //  model是1的时候，隐藏设备选择   model是1的时候是小小贝
            //$devContain[selectedModel === 1 ? 'hide' : 'show']();
            var devSnList = [];
            $.each(devs, function (i, d) {
                devSnList.push(d.devSN);
            });

            /**
             * 获取设备在线状态   1:不在线   0:在线
             * 微服务: renwenjie
             */
            $.post('/base/getDevs', {devSN: devSnList}, function (data) {
                var statusList = JSON.parse(data).detail, devList = [];
                $.each(devs, function (i, dev) {
                    $.each(statusList, function (j, sta) {
                        if (dev.devSN === sta.devSN) {
                            dev.status = sta.status;
                            devList.push(dev);
                        }
                    });
                });
                callback(devList);
            }, 'html');

            /**
             * 拼接select下拉框的数据
             * @param devs   所有的设备信息
             */
            function callback(devs) {
                $.each(devs, function (i, dev) {
                    devHtml.push('<option value="', dev.devSN, '">',
                        dev.devName + '(' + (dev.status == 0 ? locales[_lang].online : locales[_lang].offline) + ')',
                        '</option>');
                });
                //  如果是第一次加载就现在进来的sn，如果不是第一次进页面就选择默认的
                $devSn.html(devHtml.join('')).val((devs.length && !firstLoad) ? devs[0].devSN : sn);
                firstLoad = false;
            }
        }

        /**
         * 获取场景信息
         * @param sceneDevList
         * @param devInfoList
         */
        function getSceneList(sceneDevList, devInfoList) {
            $.get("/v3/web/cas_session?refresh=" + Math.random(), function (data) {
                $.post('/v3/scenarioserver', {
                    Method: 'getdevListByUser',
                    param: {
                        userName: data.user
                    }
                }, function (data) {
                    data = JSON.parse(data);
                    if (data && data.retCode == '0') {
                        var sceneHtmlList = [];
                        var sceneObj = {};
                        $.each(data.message, function (i, s) {
                            var devInfo = {
                                devName: s.devName,
                                devSN: s.devSN,
                                url: s.redirectUrl
                            };
                            if (!sceneDevList[s.scenarioId]) {
                                sceneDevList[s.scenarioId] = [];
                            }
                            // 设备信息
                            devInfoList[s.devSN] = devInfo;
                            //  {场景ID:devList}  场景和设备的对应关系
                            sceneDevList[s.scenarioId].push(devInfo);
                            //  {场所ID:场所名称}
                            sceneObj[s.scenarioId] = s.shopName;
                            //  {场所ID:场所model}
                            sceneModelObj[s.scenarioId] = Number(s.model);
                        });
                        // 拼接select框的option
                        $.each(sceneObj, function (k, v) {
                            sceneHtmlList.push('<option value="', k, '">', v, '</option>');
                        });
                        $selectedScene.html(sceneHtmlList.join('')).val(nasid);
                        // 填充设备列表
                        fillDevField();
                    }
                }, 'html');
            });
        }

        getSceneList(sceneDevList, devInfoList);
        $trigger.off('click').on('click', function () {
            $panel.toggle();
        });

        //$btnChange.off('click').on('click', function () {
        //    $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
        //    $panel.hide();
        //});

        /*change直接更换设备*/
        $devSn.off("change").on("change",function(){
            $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
            //$panel.hide();
        });

        $selectedScene.off('change').on('change', fillDevField);

        $(document).on('click', function (e) {
            var $target = $(e.target);
            if ($target != $contain && !$.contains($contain.get(0), e.target)) {
                //$panel.hide();
            }
        });
        $panel.show();
        // ==============  选择场所，end  ==============

        function getuserSession() {
            $.ajax({
                url: MyConfig.path + "/scenarioserver",
                type: "POST",
                headers: {Accept: "application/json"},
                contentType: "application/json",
                data: JSON.stringify({
                    "Method": "getdevListByUser",
                    "param": {
                        "userName": FrameInfo.g_user.attributes.name

                    }
                }),
                dataType: "json",
                timeout: 150000,
                success: function (data) {
                    var AcInfo = [];
                    if (data.retCode == 0 && data.message) {
                        var snList = [];
                        var aclist = data.message;
                        for (var i = 0; i < aclist.length; i++) {
                            if (aclist[i].shopName) {
                                AcInfo.push({
                                    shop_name: aclist[i].shopName,
                                    sn: aclist[i].devSN,
                                    placeTypeName: aclist[i].scenarioName,
                                    redirectUrl: aclist[i].redirectUrl,
                                    nasid: aclist[i].scenarioId
                                });
                                snList.push(aclist[i].devSN);
                            } else if (aclist[i].devSN) {
                                snList.push(aclist[i].devSN);
                            }
                        }

                    } else {
                        Frame.Debuger.error("[ajax] error,url=====" + MyConfig.path + "/scenarioserver");
                    }
                    getAcInfo(AcInfo);
                },
                error:function(err){
                    g_hPending&&g_hPending.close();
                    console.log(err);
                }
            });
        }

        getuserSession();

        function getAcInfo(aclist) {
            var opShtmlTemple = "<li data_sn=vals  sel data-url=urls>palce</li>";
            var ulhtml = '<div class="select">' +
                '<p>' +
                '</p>' +
                '<ul>' +
                '</ul>' +
                '</div>';
            $("#station").append(ulhtml);
            for (var i = 0; i < aclist.length; i++) {
                if (window.location.host == "v3webtest.h3c.com") {
                    aclist[i].redirectUrl = aclist[i].redirectUrl.replace("lvzhouv3.h3c.com", "v3webtest.h3c.com");
                }
                var newHtmTemple = opShtmlTemple.replace(/vals/g, aclist[i].sn)
                    .replace(/urls/g, aclist[i].redirectUrl).replace(/palce/g, aclist[i].shop_name);
                var newHtmlTemple_1 = "";
                if (FrameInfo.ACSN == aclist[i].sn) {
                    $(".select > p").text($(newHtmTemple).text());
                } else {
                    newHtmlTemple_1 = newHtmTemple.replace(/sel/g, "");
                }
                $(".content .select ul").append(newHtmlTemple_1);

            }
            $(".select").click(function (e) {
                $(".select").toggleClass('open');
                return false;
            });

            $(".content .select ul li").on("click", function () {
                var _this = $(this);
                $(".select > p").text(_this.html());
                $.cookie("current_menu", "");
                var redirectUrl = $(this).attr("data-url");
                window.location.href = redirectUrl;
                _this.addClass("selected").siblings().removeClass("selected");
                $(".select").removeClass("open");
            });
            $(document).on('click', function () {
                $(".select").removeClass("open");
            })
        }
    }
    function initData() {
        initClientCount();
        initApTraffic();
        initHealthScore();
        //initUserChange1();
    }
    
    function InitScenarioCfg() {
        var option = {
            type: 'POST',
            url: MyConfig.path + '/ant/confmgr',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                "configType": 1,
                "sceneFlag": "true",
                "sceneType": 2,
                "cfgTimeout": 120,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "method": "InitScenarioCfg",
                "userName": FrameInfo.g_user.user,
                "shopName":g_sShopName ,
                "param": [{
                    "userName": FrameInfo.g_user.user,
                    "nasId": FrameInfo.Nasid,
                    "sceneName": g_sShopName 
                }]
            }),
            onSuccess: function (data) {

                if (data.serviceResult == 'fail') {

                    // Frame.Msg.info("无线配置初始化失败","error");
                   // Frame.Msg.info(getRcText("MSG_INFO").split(",")[3], "error");
                }
                
                return self;
            },
            onFailed: function (err) {
                g_hPending&&g_hPending.close();
                console.log(err);
                return;
            }
        };
        
        Utils.Request.sendRequest(option);
        
    }

    function _init() {
        g_sShopName = Utils.Device.deviceInfo.shop_name;
        //initFenJiFenQuan();
        InitScenarioCfg();   //进入场景 初始化无线配置
        initData();
        initForm();
        getWeekflowSpeed();
        optionPush();
    }
    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu= Frame.Permission.getCurPermission();
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        //3 作具体的“显示、隐藏”处理
        if($.inArray("WRITE",arrayShuZuNew) ==-1){
            //隐藏“写”的功能
            //写
            $("#reports").css('visibility','hidden');
             //$(".health_title").attr('disabled','true');
            $(".modifyhide").css('display','none');

        }
    }
    function _destroy() {
        g_hPending&&g_hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _resize() {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "Panel", "DateTime", "Form"],
        "utils": ["Request", "Base", "Msg", 'Device'],
    });
})(jQuery);