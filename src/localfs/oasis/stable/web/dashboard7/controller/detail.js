define(["utils", "moment", "echarts"], function (Utils, moment, echarts) {
return ["$rootScope", "$scope", "$http", function ($rootScope, $scope, $http) {
// Code Start

var MODAL_BTN_TEXT = getRcText("MODAL_BTN_TEXT");
var DATE_UNIT = getRcText("DATE_UNIT");
var CLIENT_COUNT = getRcText("CLIENT_COUNT");
var BRANCH_LIST_HEADER = getRcText("BRANCH_LIST_HEADER");
var BRANCH_TYPE = getRcText("BRANCH_TYPE");
var APBYBRANCH_LIST_HEADER = getRcText("APBYBRANCH_LIST_HEADER");
var AUTH_PIE = getRcText("AUTH_PIE");
var UNKNOWN = getRcText("UNKNOWN");
var TERMINAL_LIST_TITLE = getRcText("TERMINAL_LIST_TITLE");
var TERMINAL_LIST_HEADER = getRcText("TERMINAL_LIST_HEADER");
var WLSERVICE_LIST_HEADER = getRcText("WLSERVICE_LIST_HEADER");
var WLSERAP_LIST_HEADER = getRcText("WLSERAP_LIST_HEADER");
var WLSERAPG_LIST_HEADER = getRcText("WLSERAPG_LIST_HEADER");




function getRcText (attrName) {
    var sText = Utils.getRcString("RC", attrName);
    if ( sText.indexOf(",") == -1 ) {
        return sText;
    }else{
        return sText.split(",");
    }
}

function initEcharts (id, options, theme) {
    angular.element("#" + id).css({
        width: options.width,
        height: options.height
    });
    var oEcharts = echarts.init(document.getElementById(id), theme);
    oEcharts.on(echarts.config.EVENT.CLICK, options.click);
    oEcharts.setOption(options);
}

// Log Info
$scope.logInfo = [0,0,0,0];

$http
    .get("/v3/devlogserver/getlogstats?devSN=" + $scope.sceneInfo.sn)
    .success(function (data, status, header, config) {
        var aLogStatus = data.logstats;
        var aLogInfo = [];
        for (var i = 0; i < aLogStatus.length; i += 2) {
            var nLogCount = parseInt(aLogStatus[i]) + parseInt(aLogStatus[i+1]);
            aLogInfo.push(nLogCount);
        }
        $scope.logInfo = aLogInfo;
    })
    .error(function (data, status, header, config) {

    });

// Customer Info
$scope.customerInfo = {
    return: 0,
    new: 0
};

$http
    .get("/v3/visitor/onlinestatistics?devSN=" + $scope.sceneInfo.sn)
    .success(function (data, status, header, config) {
        var oResult = data.result;
        $scope.customerInfo.return = oResult.total_count - oResult.new_count;
        $scope.customerInfo.new = oResult.new_count;
    })
    .error(function (data, status, header, config) {

    });

// AD Info
$scope.adInfo = {
    view: 0,
    click: 0
};

$http
    .get(
        "/v3/ace/oasis/auth-data/o2oportal/advertisement/queryBySpan?devSN=" + $scope.sceneInfo.sn
        + "&ownerName=" + "liuchao" //$rootScope.userInfo.user
        + "&storeId=" + $scope.sceneInfo.nasid
        + "&span=86400000"
        + "&startTime=" + moment().startOf("day").format("x")
        + "&endTime=" + moment().format("x")
    )
    .success(function (data, status, header, config) {
        var oAdStatus = data.data[0];
        $scope.adInfo.view = oAdStatus.pv;
        $scope.adInfo.click = oAdStatus.clickCount;
    })
    .error(function (data, status, header, config) {

    });

// Device Info
function secondsFormatter (nSeconds) {
    var oMoment = moment.unix(nSeconds);
    var sSecond = oMoment.utc().format("ss") + DATE_UNIT[5];
    var sMinute = oMoment.utc().format("mm") + DATE_UNIT[4];
    var sHour = oMoment.utc().format("HH") + DATE_UNIT[3];
    var sDay = oMoment.utc().format("DD") - 1 + DATE_UNIT[2];
    var sMonth = oMoment.utc().format("MM") - 1 + DATE_UNIT[1];
    var sYear = oMoment.utc().format("YYYY");
    if (sDay.length == 2) {
        sDay = "0" + sDay;
    }
    if (sMonth.length == 2) {
        sMonth = "0" + sMonth;
    }
    if ( sYear == "1970" ) {
        sYear = "";
    }else{
        sYear = sYear - "1970" + DATE_UNIT[0];
    }
    return sYear + sMonth + sDay + sHour + sMinute + sSecond;
}

$http
    .get("/v3/devmonitor/devinfo?devSN=" + $scope.sceneInfo.sn)
    .success(function (data, status, header, config) {
        $scope.devInfo = {
            mode: data.devMode,
            serialNum: $scope.sceneInfo.sn,
            baselineVer: data.devBaslineVersion,
            softVer: data.devSoftVersion,
            IPAddress: data.devAddress,
            IPLocation: {
                country: data.devLocation.country,
                province: data.devLocation.province,
                city: data.devLocation.city
            },
            onlineTime: secondsFormatter(data.devOnlineTime),
            startTime: secondsFormatter(data.devUplineTime)
        };

        //function setTime (time) {
        //    $timeout(function () {
        //        $scope.devInfo.onlineTime = secondsFormatter(time + 1);
        //        $scope.devInfo.startTime = secondsFormatter(time + 1);
        //        setTime(time + 1);
        //        console.log(1);
        //    }, 1000);
        //}
        //setTime(data.devUplineTime);

        var oIPLocation = $scope.devInfo.IPLocation;
        angular.element("#IPLocation").tooltip({
            animation: true,
            container: false,
            delay: 0,
            html: true,
            placeholder: "top",
            selector: false,
            template:   "<div class='tooltip'>" +
            "<div class='tooltip-arrow'></div>" +
            "<div class='tooltip-inner'></div>" +
            "</div>",
            title: oIPLocation.country + " - " + oIPLocation.province + " - " + oIPLocation.city,
            trigger: "focus",
            viewport: {selector: "#IPLocation", padding: 0}
        });
    })
    .error(function (data, status, header, config) {

    });

// Customer Change
$scope.customerChangeInfo = {
    curTimeRange: "oneday"
};

function drawCustomerChangeLine (timeRange, data) {

    var oOpts = {
        width: "100%",
        height: "230px",
        tooltip: {
            trigger: "item",
            formatter: function (params) {
                var sTime = moment(params.value[0]).format("YYYY-MM-DD,HH:mm:ss");
                var sTooltip = params.seriesName + "<br/>"
                    + sTime + "<br/>"
                    + params.value[1] + getRcText("PERSON_UNIT");
                return sTooltip;
            }
        },
        legend: {
            y: 0,
            itemWidth: 8,
            textStyle: {color: "#617085", fontSize: "12px"},
            data: [CLIENT_COUNT]
        },
        grid: {
            x: 30, y: 20, x2: 22, y2: 30,
            borderColor: "transparent"
        },
        calculable: false,
        xAxis: [{
            type: "time",
            splitNumber: 6,
            splitLine: {show: false},
            axisLabel: {
                textStyle: {
                    color: "#617085"
                },
                formatter: function (value, index){
                    if (timeRange == "oneday") {
                        return moment(value).format("HH:mm");
                    } else {
                        return moment(value).format("M-D");
                    }
                }
            },
            axisLine: {
                lineStyle: {color: '#AEAEB7', width: 1}
            },
            axisTick : {show : false}
        }],
        yAxis: [{
            type: "value",
            splitLine: {
                lineStyle: {color: ["#eee"]}
            },
            axisLabel: {
                textStyle: {
                    color: "#617085"
                }
            },
            axisLine: {
                show: false
            }
        }],
        animation: false,
        series: [{
            name: CLIENT_COUNT,
            type: "line",
            smooth: true,
            symbol: "none",
            showAllSymbol: true,
            symbolSize: 2,
            itemStyle: {
                normal: {
                    areaStyle: {type: "default"},
                    lineStyle: {width: 0}
                }
            },
            data: data
        }]
    };

    var oTheme = {
        color: ["#4ec1b2"],
        categoryAxis: {
            splitLine: {
                lineStyle: {
                    color : ["#FFF"]
                }
            }
        }
    };

    initEcharts("customerChangeLine", oOpts, oTheme);
}

var getCustomerChangeData = (function (timeRange) {

    this.curTimeRange = timeRange;

    $http
        .get(
            "/v3/stamonitor/histclientstatistic_bycondition" +
            "?devSN=" + $scope.sceneInfo.sn +
            "&dataType=" + timeRange
        )
        .success(function (data, status, header, config) {
            var aClientData = [];
            angular.forEach(data.histclientList, function (value) {
                this.push([moment(value.time)._d, value.totalCount]);
            }, aClientData);
            drawCustomerChangeLine(timeRange, aClientData);
        });

    return arguments.callee;

})($scope.customerChangeInfo.curTimeRange);

$scope.customerChangeInfo.chooseTime = getCustomerChangeData;

// Branch List
$scope.listOpts = {};
$scope.modalOpts = {};

$scope.listOpts.branch = {
    tId: "branch",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 4,
    showPageList: false,
    searchable: true,
    columns: [
        {
            title: BRANCH_LIST_HEADER[0],
            field: "branchName",
            sortable: true,
            searcher: {type: "text"}
        },
        {
            title: BRANCH_LIST_HEADER[1],
            field: "branchType",
            sortable: true,
            formatter: function (value, row, index) {
                if (typeof value == "number") {
                    return BRANCH_TYPE[value];
                } else {
                    return "";
                }
            },
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: 0, text: BRANCH_TYPE[0]},
                    {value: 1, text: BRANCH_TYPE[1]},
                    {value: 2, text: BRANCH_TYPE[2]}
                ]
            }
        },
        {
            title: BRANCH_LIST_HEADER[2],
            field: "apCount",
            sortable: true,
            formatter: function(value, row, index){
                if (value == 0) {
                    return value;
                } else {
                    return '<a class="list-link">' + value + '</a>';
                }
            },
            searcher: {type: "text"}
        }
    ],
    onClickCell: function (field, value, row, $ele) {
        if (field == "apCount" && value != 0) {
            $scope.$broadcast("show#APByBranch");
            $scope.$broadcast("refresh#APByBranch", {
                url: "/v3/apmonitor/getApListPageByBranch?devSN="
                    + $scope.sceneInfo.sn + "&branchName=" + row.branchName
            });
        }
    }
};

$scope.modalOpts.APByBranch = {
    mId: "APByBranch",
    title: getRcText("APBYBRANCH_LIST_TITLE"),
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.APByBranch = {
    tId: "APByBranch",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    searchable: true,
    apiVersion: "v3",
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.totalCount,
            rows: data.apList
        };
    },
    columns: [
        {title: APBYBRANCH_LIST_HEADER[0], field: "apName", sortable: true, searcher: {type: "text"}},
        {title: APBYBRANCH_LIST_HEADER[1], field: "apSN", sortable: true, searcher: {type: "text"}},
        {title: APBYBRANCH_LIST_HEADER[2], field: "macAddr", sortable: true, searcher: {type: "text"}},
        {title: APBYBRANCH_LIST_HEADER[3], field: "clientCount", sortable: true, searcher: {type: "text"}}
    ]
};

$http
    .get("/v3/apmonitor/getBranchList?devSN=" + $scope.sceneInfo.sn)
    .success(function (data, status, header, config) {
        $scope.$broadcast("load#branch", data.branchList);
    })
    .error(function (data, status, header, config) {

    });

// Auth Pie
function drawAuthNullPie () {
    var oOpts = {
        height : 200,
        calculable : false,
        series : [
            {
                type : "pie",
                radius : "80%",
                center : ["50%", "40%"],
                itemStyle : {
                    normal : {
                        label : {position : "inner"},
                        labelLine : {show : false}
                    }
                },
                data : [{name : "N/A", value : 1}]
            }
        ]
    };

    var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};

    initEcharts("authTerminalPie", oOpts, oTheme);
}

function drawAuthPie (data) {

    var oOpts = {
        width: "100%",
        height : 200,
        tooltip : {
            formatter: "{b}:<br/> {c} ({d}%)"
        },
        series: [
            {
                type: "pie",
                minAngle: "3",
                radius: ['0','80%'],
                center: ["50%", "40%"],
                itemStyle: {
                    normal: {
                        borderColor: "#FFF",
                        borderWidth: 1,
                        label: {
                            position: "inner",
                            textStyle: {color : "#fff"},
                            formatter: function (value) {
                                var percent = parseInt(value.percent);
                                return value.name + "\n" + percent + "%";
                            }
                        },
                        labelLine: false
                    },
                    emphasis: {
                        label: {show: false},
                        labelLine: false
                    }
                },
                data: data
            }
        ]
        ,
        click: function (oPiece) {
            if (oPiece.name == AUTH_PIE[0]) {
                $scope.$broadcast("show#authTerminal");
                $scope.$broadcast("refresh#authTerminal", {
                    url: "/v3/stamonitor/getclientverbose_page?devSN="
                        + $scope.sceneInfo.sn + "&auth=true"
                });
            }
        }
    };

    var oTheme = {
        color : ["#4ec1b2", "#E7E7E9"]
    };

    initEcharts("authTerminalPie", oOpts, oTheme);
}

$http
    .get(
        "/v3/stamonitor/getclientlistbycondition?devSN="
        + $scope.sceneInfo.sn + "&reqType=all"
    )
    .success(function (data, status, header, config) {
        if (data  && data.clientList[0].totalCount != 0 && data.errcode !== "illegal access") {
            var aData = [
                { name:AUTH_PIE[0], value:data.clientList[0].conditionCount},
                { name:AUTH_PIE[1], value:data.clientList[0].totalCount - data.clientList[0].conditionCount}
            ];
            drawAuthPie(aData);
        } else {
            drawAuthNullPie();
            //aData = [
            //    { name:AUTH_PIE[0], value:10},
            //    { name:AUTH_PIE[1], value:10}
            //];
            //drawAuthPie(aData);
        }
    })
    .error(function (data, status, header, config) {

    });

$scope.modalOpts.authTerminal = {
    mId: "authTerminal",
    title: TERMINAL_LIST_TITLE,
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.authTerminal = {
    tId: "authTerminal",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    apiVersion: "v3",
    searchable: true,
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.clientList.count_total,
            rows: data.clientList.clientInfo
        };
    },
    columns: [
        {title: TERMINAL_LIST_HEADER[0], field: "clientMAC", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[1], field: "clientIP", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[2], field: "clientVendor", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[3], field: "ApName", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[4], field: "clientSSID", sortable: true, searcher: {type: "text"}}
    ]
};

// Type Pie
function drawTypeNullPie () {
    var oOpts = {
        animation : true,
        height : 255,
        calculable : false,
        legend : {
            orient : "vertical",
            y : "bottom",
            data : [
                "802.11ac(5GHz)",
                "802.11an(5GHz)",
                "802.11a(5GHz)",
                "",
                "802.11gn(2.4GHz)",
                "802.11g(2.4GHz)",
                "802.11b(2.4GHz)"
            ]
        },
        series : [
            {
                type : "pie",
                radius : "50%",
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        label : {position : "inner"},
                        labelLine : {show : false}
                    }
                },
                data : [
                    {name : "N/A", value : 1}
                    ,
                    { name:'802.11ac(5GHz)', itemStyle:{normal :{color:'#4ec1b2'}}},
                    { name:'802.11an(5GHz)', itemStyle:{normal :{color:'#95dad1'}}},
                    { name:'802.11a(5GHz)', itemStyle:{normal :{color:'#caece8'}}},
                    { name:'802.11gn(2.4GHz)', itemStyle:{normal :{color:'#b3b7dd'}}},
                    { name:'802.11g(2.4GHz)', itemStyle:{normal :{color:'#d1d4eb'}}},
                    { name:'802.11b(2.4GHz)', itemStyle:{normal :{color:'#e8e9f5'}}}
                ]
            }
        ]
    };

    var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};

    initEcharts("terminalTypePie", oOpts, oTheme);
}

function drawTypePie (data) {
    var oData = data.client_statistic;
    var aData = [];
    var aTotal = [];
    $.each(oData, function(index,ele){
        var sGHz = index.indexOf("a") == -1?"(2.4GHz)":"(5GHz)";
        if(ele == "0"){
            aData.push({name : "802." + index + sGHz});
            return;
        };
        aData.push({
            name : "802." + index + sGHz,
            value : ele
        });
    });
    var nB = oData["11b"];
    var nG = oData["11g"];
    var nGn = oData["11gn"];
    var nA = oData["11a"];
    var nAn = oData["11an"];
    var nAc = oData["11ac"];
    var nT = nB + nG + nGn;
    var nF = nA + nAn + nAc;
    if(nT != 0){aTotal.push({name : "2.4GHz", value : nT, itemStyle:{normal:{color:"#b3b7dd"}}})}
    if(nF != 0){aTotal.push({name : "5GHz", value : nF, itemStyle:{normal:{color:"#4ec1b2"}}})}
    var oOpts = {
        animation : true,
        calculable : false,
        height : 255,
        legend : {
            orient : "vertical",
            y : "bottom",
            data : [
                "802.11ac(5GHz)",
                "802.11an(5GHz)",
                "802.11a(5GHz)",
                "",
                "802.11gn(2.4GHz)",
                "802.11g(2.4GHz)",
                "802.11b(2.4GHz)"
            ]
        },
        tooltip : {
            show:true,
            formatter: "{b}:<br/> {c} ({d}%)"
        },
        series : [
            {
                type : "pie",
                clockWise: true,//false,
                radius : [0, "30%"],
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        borderColor : "#fff",
                        borderWidth : 1,
                        label : {
                            position : "inner",
                            textStyle : {
                                color : "#fff"
                            }
                        },
                        labelLine : false
                    }
                },
                data : aTotal
            },
            {
                type : "pie",
                clockWise: true,//false,
                radius : ['38%','60%'],
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        borderColor : "#FFF",
                        borderWidth : 1,
                        label : {
                            position : "inner",
                            textStyle : {color : "#fff"},
                            formatter : function(value){
                                var percent = parseInt(value.percent);
                                if (percent == 0) {
                                    return "";
                                }
                                return percent + "%";
                            }
                        },
                        labelLine : false
                    }
                },
                data: aData
            }
        ],
        click : function (oPiece) {
            if (oPiece.seriesIndex == "1") {
                $scope.$broadcast("show#terminalType");
                $scope.$broadcast("refresh#terminalType", {
                    url: "/v3/stamonitor/getclientlist_bymodeorvendor?devSN="
                        + $scope.sceneInfo.sn
                        + "&mode=" + oPiece.name.split("(")[0]
                });
            }
        }
    };

    var oTheme = {color : ["#4ec1b2","#95dad1","#caece8","#b3b7dd","#d1d4eb","#e8e9f5"]};

    initEcharts("terminalTypePie", oOpts, oTheme);
}

$http
    .get("/v3/stamonitor/getclientstatisticbymode?devSN=" + $scope.sceneInfo.sn)
    .success(function (data, status, header, config) {
        var oClient = data.client_statistic;
        var nTotal = oClient["11b"] + oClient["11g"]
            + oClient["11gn"] + oClient["11a"]
            + oClient["11an"] + oClient["11ac"];

        if (data && data.errcode !== "illegal access" && nTotal) {
            drawTypePie(data);
        } else {
            drawTypeNullPie();
            //drawTypePie({"client_statistic":{"11b":10,"11g":10,"11gn":10,"11a":10,"11an":10,"11ac":10}});
        }
    })
    .error(function (data, status, header, config) {
        drawTypeNullPie();
    });

$scope.modalOpts.terminalType = {
    mId: "terminalType",
    title: TERMINAL_LIST_TITLE,
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.terminalType = {
    tId: "terminalType",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    apiVersion: "v3",
    searchable: true,
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.clientList.count_total,
            rows: data.clientList.clientInfo
        };
    },
    columns: [
        {title: TERMINAL_LIST_HEADER[0], field: "clientMAC", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[1], field: "clientIP", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[2], field: "clientVendor", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[3], field: "ApName", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[4], field: "clientSSID", sortable: true, searcher: {type: "text"}}
    ]
};

// Firm Pie
function drawFirmNullPie () {
    var oOpts = {
        height : 255,
        series : [
            {
                type : "pie",
                radius : "50%",
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        label : {position : "inner"},
                        labelLine : {show : false}
                    }
                },
                data : [
                    {name : "N/A", value : 1}
                ]
            }
        ]
    };

    var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};

    initEcharts("terminalFirmPie", oOpts, oTheme);
}

function drawFirmPie (data) {
    var aData = data.client_statistic;
    var aFirm = [];
    var alegendData =[];
    $.each(aData, function (index, ele){
        aFirm.push({name:ele.clientVendor || UNKNOWN,value:ele.count})
    });
    $.each(aData, function (index, ele){
        alegendData.push(ele.clientVendor || UNKNOWN)
        if( (index + 1) % 3 == 0) {
            alegendData.push("");
        }
    });
    var oOpts = {
        animation : true,
        calculable : false,
        height : 255,
        legend : {
            orient : "vertical",
            x : "center",
            y : "bottom",
            data : alegendData
        },
        tooltip : {
            show:true,
            formatter: "{b}:<br/> {c} ({d}%)"
        },
        series : [
            {
                type : "pie",
                minAngle : "3",
                radius : ['38%','60%'],
                center : ["50%", "30%"],
                itemStyle : {
                    normal : {
                        borderColor : "#FFF",
                        borderWidth : 1,
                        label : {
                            position : "inner",
                            textStyle : {color : "#fff"},
                            formatter : function(value){
                                var percent = parseInt(value.percent);
                                if(percent == 0) {
                                    return "";
                                }
                                return percent + "%"
                            }
                        },
                        labelLine : false
                    }
                },
                data:aFirm
            }
        ],
        click : function (oPiece) {
            if (oPiece.seriesIndex == "0") {
                $scope.$broadcast("show#terminalFirm");
                $scope.$broadcast("refresh#terminalFirm", {
                    url: "/v3/stamonitor/getclientlist_bymodeorvendor?devSN="
                    + $scope.sceneInfo.sn
                    + "&vendor=" + (oPiece.name == UNKNOWN ? "" : oPiece.name)
                });
            }
        }
    };

    var oTheme = {color : ["#fbceb1","#4ec1b2","#b3b7dd","#4fcff6","#fe808b","#e7e7e9"]};

    initEcharts("terminalFirmPie", oOpts, oTheme);
}

$http
    .get("/v3/stamonitor/getclientstatisticbybyod?devSN=" + $scope.sceneInfo.sn)
    .success(function (data, status, header, config) {
        if (data.client_statistic.length==0 || data.errcode == "illegal access") {
            drawFirmNullPie();
        } else {
            drawFirmPie(data);
        }
    })
    .error(function (data, status, header, config) {
        drawFirmNullPie();
    });

$scope.modalOpts.terminalFirm = {
    mId: "terminalFirm",
    title: TERMINAL_LIST_TITLE,
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.terminalFirm = {
    tId: "terminalFirm",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    apiVersion: "v3",
    searchable: true,
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.clientList.count_total,
            rows: data.clientList.clientInfo
        };
    },
    columns: [
        {title: TERMINAL_LIST_HEADER[0], field: "clientMAC", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[1], field: "clientIP", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[2], field: "clientVendor", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[3], field: "ApName", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[4], field: "clientSSID", sortable: true, searcher: {type: "text"}}
    ]
};

// WLAN Service
$scope.listOpts.WLService = {
    tId: "WLService",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 4,
    showPageList: false,
    searchable: true,
    columns: [
        {title: WLSERVICE_LIST_HEADER[0], field: "stName", sortable: true, searcher: {type: "text"}},
        {title: WLSERVICE_LIST_HEADER[1], field: "ssidName", sortable: true, searcher: {type: "text"}},
        {
            title: WLSERVICE_LIST_HEADER[2],
            field: "status",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: 1, text: getRcText("ON_OFF")[0]},
                    {value: 2, text: getRcText("ON_OFF")[1]}
                ]
            },
            formatter: function (value, row, index) {
                if (typeof value == "number") {
                    return getRcText("ON_OFF")[value - 1];
                } else {
                    return "";
                }
            }
        },
        {
            title: WLSERVICE_LIST_HEADER[3],
            field: "description",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: "1", text: getRcText("WL_SSID_TYPE")[0]},
                    {value: "2", text: getRcText("WL_SSID_TYPE")[1]}
                ]
            },
            formatter: function (value, row, index) {
                if (typeof value == "string") {
                    return getRcText("WL_SSID_TYPE")[value];
                } else {
                    return "";
                }
            }
        },
        {
            title: WLSERVICE_LIST_HEADER[4],
            field: "lvzhouAuthMode",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: 0, text: getRcText("WL_AUTH_TYPE")[1]},
                    {value: 1, text: getRcText("WL_AUTH_TYPE")[2]},
                    {value: 2, text: getRcText("WL_AUTH_TYPE")[3]}
                ]
            },
            formatter: function (value, row, index) {
                if (value == -1) {
                    return "";
                } else if(value>=0 && value <= 2 ) {
                    return getRcText("WL_AUTH_TYPE")[value + 1];
                } else {
                   return "";
                }
            }
        },
        {
            title: WLSERVICE_LIST_HEADER[5],
            field: "clientCount",
            sortable: true,
            searcher: {type: "text"},
            formatter: function(value, row, index){
                if (value == 0) {
                    return value;
                } else {
                    return '<a class="list-link">' + value + '</a>';
                }
            }
        },
        {
            title: WLSERVICE_LIST_HEADER[6],
            field: "ApCnt",
            sortable: true,
            searcher: {type: "text"},
            formatter: function(value, row, index){
                if (value == 0) {
                    return value;
                } else {
                    return '<a class="list-link">' + value + '</a>';
                }
            }
        },
        {
            title: WLSERVICE_LIST_HEADER[7],
            field: "ApGroupCnt",
            sortable: true,
            searcher: {type: "text"},
            formatter: function(value, row, index){
                if (value == 0) {
                    return value;
                } else {
                    return '<a class="list-link">' + value + '</a>';
                }
            }
        }
    ],
    onClickCell: function (field, value, row, $ele) {
        if (field == "clientCount" && value != 0) {
            $scope.$broadcast("show#WLSerClient");
            $scope.$broadcast("refresh#WLSerClient", {
                url: "/v3/stamonitor/getclientinfo_byssid?devSN="
                + $scope.sceneInfo.sn + "&ssid=" + row.ssidName
            });
        }
        if (field == "ApCnt" && value != 0) {
            $scope.$broadcast("show#WLSerAP");
            $scope.$broadcast("refresh#WLSerAP", {
                url: "/v3/ssidmonitor/getstbindlist?devSN="
                + $scope.sceneInfo.sn + "&stName=" + row.stName
            });
        }
        if (field == "ApGroupCnt" && value != 0) {
            $scope.$broadcast("show#WLSerAPG");
            $scope.$broadcast("refresh#WLSerAPG", {
                url: "/v3/ssidmonitor/getstbindlist?devSN="
                + $scope.sceneInfo.sn + "&stName=" + row.stName
            });
        }
    }
};

$http
    .get(
        "/v3/ssidmonitor/getssidinfobrief?devSN=" + $scope.sceneInfo.sn
        + "&nasId=" + $scope.sceneInfo.nasid
        + "&ownerName=" + $rootScope.userInfo.user
    )
    .success(function (data, status, header, config) {
        $scope.$broadcast("load#WLService", data.ssidList);
    })
    .error(function (data, status, header, config) {

    });

$scope.modalOpts.WLSerClient = {
    mId: "WLSerClient",
    title: getRcText("CLIENT_LIST_TITLE"),
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.WLSerClient = {
    tId: "WLSerClient",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    apiVersion: "v3",
    searchable: true,
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.clientList.count_total,
            rows: data.clientList.clientInfo
        };
    },
    columns: [
        {title: TERMINAL_LIST_HEADER[0], field: "clientMAC", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[1], field: "clientIP", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[2], field: "clientVendor", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[3], field: "ApName", sortable: true, searcher: {type: "text"}},
        {title: TERMINAL_LIST_HEADER[4], field: "clientSSID", sortable: true, searcher: {type: "text"}}
    ]
};

$scope.modalOpts.WLSerAP = {
    mId: "WLSerAP",
    title: getRcText("WLSERAP_LIST_TITLE"),
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.WLSerAP = {
    tId: "WLSerAP",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    apiVersion: "v3",
    searchable: true,
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.stBindList.apTotalCnt,
            rows: data.stBindList.bindApList
        };
    },
    columns: [
        {title: WLSERAP_LIST_HEADER[0], field: "apName", sortable: true, searcher: {type: "text"}},
        {title: WLSERAP_LIST_HEADER[1], field: "apGroupName", sortable: true, searcher: {type: "text"}},
        {title: WLSERAP_LIST_HEADER[2], field: "branch", sortable: true, searcher: {type: "text"}}
    ]
};

$scope.modalOpts.WLSerAPG = {
    mId: "WLSerAPG",
    title: TERMINAL_LIST_TITLE,
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.WLSerAPG = {
    tId: "WLSerAPG",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    apiVersion: "v3",
    searchable: true,
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.stBindList.apGrpTotalCnt,
            rows: data.stBindList.bindApGroupList
        };
    },
    columns: [
        {title: WLSERAPG_LIST_HEADER[0], field: "apGroupName", sortable: true, searcher: {type: "text"}},
        {title: WLSERAPG_LIST_HEADER[1], field: "description", sortable: true, searcher: {type: "text"}},
        {title: WLSERAPG_LIST_HEADER[2], field: "branch", sortable: true, searcher: {type: "text"}}
    ]
};

// monitor
$scope.devMonitor = {
    interfaceList: [],
    curInterfaceName: {},
    rightTopShow: false,
    selectorShow: true,
    echartShow: false,
    filterSelectorShow: false,
    clickFilterBtn: function () {
        this.filterSelectorShow = !this.filterSelectorShow;
    },
    clickRefreshBtn: function () {
        chooseFilterSelector();
    },
    chooseFilterSelector: chooseFilterSelector,
    clickUpLinkSelector: clickUpLinkSelector
};

$http
    .get("/v3/devmonitor/getAllInterfaces?devSN=" + $scope.sceneInfo.sn)
    .success(function (data, status, header, config) {

        $scope.devMonitor.interfaceList = data.InterfaceList;
        $scope.devMonitor.curInterfaceName = data.InterfaceList[0];

        angular.forEach(data.InterfaceList, function (value, key, values) {

            if (value.interfaceType == 1) {
                getUpLinkInterface(1);
            }

            if (value.interfaceType == 3) {
                getUpLinkInterface(3);
            }


        });
    })
    .error(function (data, status, header, config) {

    });

function chooseFilterSelector () {
    $scope.devMonitor.filterSelectorShow = false;

    $http
        .get("/v3/devmonitor/setUpLinkInterface?devSN="
        + $scope.sceneInfo.sn + "&interfaceName=" + $scope.devMonitor.curInterfaceName.interfaceName)
        .success(function (data, status, header, config) {
            if('{"errcode":"illegal access"}' == data){
                console.log("没有权限")
            }
            else{
                if(data.errcode == '0') {
                    var aData = JSON.parse(data.histdataList[0]);
                    drawChart(aData.dataList);
                }
                else{
                    console.log("设置失败");
                }
            }
        })
        .error(function (data, status, header, config) {

        });
}

function clickUpLinkSelector () {
    $.extend($scope.devMonitor, {
        rightTopShow: true,
        selectorShow: false,
        echartShow: true
    });

    $http
        .get("/v3/devmonitor/setUpLinkInterface?devSN="
        + $scope.sceneInfo.sn + "&interfaceName=" + $scope.devMonitor.curInterfaceName.interfaceName)
        .success(function (data, status, header, config) {
            if('{"errcode":"illegal access"}' == data){
                console.log("没有权限")
            }
            else{
                if(data.errcode == '0') {
                    var aData = JSON.parse(data.histdataList[0]);
                    drawChart(aData.dataList);
                }
                else{
                    console.log("设置失败");
                }
            }
        })
        .error(function (data, status, header, config) {

        });
}

function getUpLinkInterface (type) {
    if (type == 1) {
        $.extend($scope.devMonitor, {
            rightTopShow: false,
            selectorShow: false,
            echartShow: true
        });
    }
    if (type == 3) {
        type = 2;
        $.extend($scope.devMonitor, {
            rightTopShow: true,
            selectorShow: false,
            echartShow: true
        });
    }
    $http
        .get("/v3/devmonitor/getUpLinkInterfaceData?interfaceType=" + type + "&devSN=" + $scope.sceneInfo.sn)
        .success(function (data, status, header, config) {
            if (type == 1) {
                var aDataOne=[];
                for (var i = 0; i < data.histdataList.length; i++) {
                    var temp = JSON.parse(data.histdataList[i]);
                    aDataOne[i] = temp.dataList;
                }
                drawChartWan(aDataOne);
            }
            if (type == 2) {
                var aDataThree = JSON.parse(data.histdataList[0]);
                drawChart(aDataThree.dataList);
            }
        })
        .error(function (data, status, header, config) {

        });
}

function timeStatus (time) {
    if (time < 10) {
        return "0" + time;
    }
    return time;
}

function addComma(sNum,Stype/*Stype=rate,.memory*/,nStart,nEnd) {
    function doFormat(num,type,start,end){
        if(!(typeof(num) === "string"||typeof(num)==="number")||Number(num)!=Number(num)){
            return num;
        }
        var max,len,remain,unit,fixed;
        var flag = "";
        start=start||0;
        end = typeof end=="undefined"?3:end;
        switch(type){
            case "memory":
                max = 1000;
                unit=["B","KB","MB","GB"];
                break;
            case "rate":
                max = 1024;
                unit=["bps","Kbps","Mbps","Gbps"];
                break;
            default:
                max = Infinity;
                unit=[""];
                fixed = 0;
                break;
        }
        if(num<0)
        {
            num = -num;
            flag = "-"
        }
        while(num >=max &&start < end){
            num = num/max;
            start++;
            fixed =1;
        }
        num = Number(num).toFixed(fixed).split(".");
        if(fixed){
            unit = "."+num[1]+unit[start];
        }else{
            unit = unit[start];
        }
        num = num[0];
        len = num.length;
        if(len<3){
            return flag + num +unit;
        }
        remain = len % 3;
        if(remain > 0){
            num = num.slice(0,remain)+","+num.slice(remain,len).match(/\d{3}/g).join(",");

        }else{
            num = num.slice(remain,len).match(/\d{3}/g).join(",");
        }
        return flag + num +unit;

    };

    if($.isPlainObject(sNum)){
        for(key in sNum){
            sNum[key] = doFormat(sNum[key],Stype,nStart,nEnd);
        }
    }else{
        sNum = doFormat(sNum,Stype,nStart,nEnd);
    }
    return sNum;
}

function drawChart(oData) {
    var aSpeedUp = [];
    var aSpeedDown = [];
    var aTimes = [];
    oData = oData.reverse();
    $.each(oData,function(i,oData){
        aSpeedUp.push(oData.speed_up);
        aSpeedDown.push(-oData.speed_down);
        var temp = new Date(oData.updateTime);
        aTimes.push(timeStatus(temp.getHours())+":"+timeStatus(temp.getMinutes())+":"+timeStatus(temp.getSeconds()));
    });
    var aStream = getRcText("STREAM").split(",");
    var option = {
        width:"100%",
        height:210,
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                    color: '#80878C',
                    width: 2,
                    type: 'solid'
                }
            },
            formatter:function(y,x){
                var sTips = y[0][1];
                for(var i = 0; i < y.length; i++)
                {
                    sTips = sTips + "<br/>" + y[i][0] + ":" + addComma(Math.abs(y[i][2]),"rate",1);
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
            x: 65, y: 40,
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                },
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2}
                },
                axisTick :{
                    show:false
                },
                data: aTimes
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2},
                    formatter:function(nNum){
                        return addComma(Math.abs(nNum),'rate',1);
                    }
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                }
            }
        ],
        series: [
            {
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: aStream[0],
                data: aSpeedUp
            },
            {
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: aStream[1],
                data: aSpeedDown
            }
        ]

    };
    var oTheme = {
        color: ["rgba(242,188,152,1)","rgba(120,206,192,0.6)"],
    };
    initEcharts("usage", option, oTheme);

}

function drawChartWan (aData) {
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
    var aColor = ["rgba(120,206,195,1)","rgba(254,240,231,1)","rgba(144,129,148,1)","rgba(254,184,185,1)"];
    $.each(aData,function (i,oData) {
        var aUp = [];
        var aDown = [];
        aData[i] = aData[i].reverse();
        $.each(aData[i],function(j,oData){
            aUp.push(oData.speed_up);
            aDown.push(-oData.speed_down);
        });

        var aName = (aData[i][0].interfaceName).match(reg) + (aData[i][0].interfaceName).split('/').pop();
        var oUp = {
            symbol: "none",
            type: 'line',
            smooth: true,
            stack:'总量',
            itemStyle: {normal: {areaStyle: {type: 'default',color:aColor[i]}}},
            name: aName + '流量',
            data: aUp
        };
        var oDown = {
            symbol: "none",
            type: 'line',
            smooth: true,
            stack:'总量',
            itemStyle: {normal: {areaStyle: {type: 'default',color:aColor[i]}}},
            name: aName + '流量',
            data: aDown
        };
        aServices.push(oUp);
        aServices.push(oDown);
        aLegend.push(aName + '流量');
        aTooltip.push(aName + aStream[0]);
        aTooltip.push(aName + aStream[1]);
    });
    aTooltip = aTooltip.reverse();
    $.each(aData[0],function(i,oData){
        var temp = new Date(oData.updateTime);
        aTimes.push(timeStatus(temp.getHours())+":"+timeStatus(temp.getMinutes())+":"+timeStatus(temp.getSeconds()));
    });

    var option = {
        width:"100%",
        height:210,
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                    color: '#80878C',
                    width: 2,
                    type: 'solid'
                }
            },
            formatter:function(y,x){
                var sTips = y[0][1];
                var temp = y[0][0].match(reg2)[0];
                for (var j = 0; j < aTooltip.length; j++) {
                    if(temp == aTooltip[j].match(reg2)[0])
                    {
                        break;
                    }
                }
                for(var i = 0; i < y.length; i++)
                {
                    sTips = sTips + "<br/>" + aTooltip[j+i] + ":" + Utils.Base.addComma(Math.abs(y[i][2]),"rate",1);
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
            x: 60, y: 40,
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                },
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2}
                },
                axisTick :{
                    show:false
                },
                data: aTimes
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2},
                    formatter:function(nNum){
                        return Utils.Base.addComma(Math.abs(nNum),'rate',1);
                    }
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                }
            }
        ],
        series: aServices
    };
    var oTheme = {
        color: ["rgba(120,206,195,1)","rgba(254,240,231,1)","rgba(144,129,148,1)","rgba(254,184,185,1)"],
    };
    initEcharts("usage", option, oTheme);
}

















}];
});