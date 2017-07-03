define(["utils", "moment", "echarts", "bootstrap-daterangepicker", "css!bootstrap_daterangepicker_css"], function (Utils, moment, echarts) {
return ["$scope", "$http", "$alertService", "$interval", function ($scope, $http, $alert, $interval) {
// Code Start

function getRcText (attrName) {
    var sText = Utils.getRcString("RC", attrName);
    if ( sText.indexOf(",") == -1 ) {
        return sText;
    }else{
        return sText.split(",");
    }
}

$scope.timer = null;

$scope.options = {};

$scope.mapInfo = {
    locationImage: [],
    curMapIterm: {},
    heatData: [],
    clientTotal: 0,
    selectMap: function () {
        $scope.$broadcast("$destroy");
        $scope.isChecked.realTime = true;
    },
    areaData: [],
    onMouseClick: onMouseClick,
    clickClientTotal: clickClientTotal
};

$scope.isChecked = {
    realTime: true,
    checkTimeMethod: function (timeMethod) {
        if ( timeMethod == "realTime" && !this.realTime ) {
            this.realTime = !this.realTime;
            drawHeatMapLayer();
            $scope.timer = $interval(function () {
                drawHeatMapLayer();
            }, 10000);
            $scope.$on("$destroy", function () {
                $interval.cancel($scope.timer);
            });

        }
        if ( timeMethod == "timeRange" && this.realTime ) {
            this.realTime = !this.realTime;
            $scope.$broadcast("$destroy");
        }
    }
};

// Init DatePicker
angular.element("#datetimeRange").daterangepicker(
    {
        startDate: moment().startOf("day"),
        endDate: moment(),
        maxDate: moment(),
        dateLimit: {days: 7},
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: true,
        opens: "left",
        locale: {
            format: "YYYY/MM/DD HH:mm:ss",
            applyLabel : getRcText("DRP_APPLYLABEL"),
            cancelLabel : getRcText("DRP_CANCELLABEL"),
            fromLabel : getRcText("DRP_FROMLABEL"),
            toLabel : getRcText("DRP_TOLABEL"),
            customRangeLabel : getRcText("DRP_CUSTOMRANGELABEL"),
            daysOfWeek : getRcText("DRP_DAYSOFWEEK"),
            monthNames : getRcText("DRP_MONTHNAMES"),
        }
    }
    ,
    function(start, end, label) {
        //console.log(
        //    start.format("YYYY/MM/DD HH:mm:ss") + " - " + end.format("YYYY/MM/DD HH:mm:ss")
        //);
    }
);

angular.element("#datetimeRange").on("apply.daterangepicker", function (evt, picker) {
    //console.log(picker.startDate.format("YYYY-MM-DD HH:mm:ss"));
    //console.log(picker.endDate.format("YYYY-MM-DD HH:mm:ss"));
    $http
        .post("/v3/ace/o2oportal/location/timeLocationClient", {
            userId: "oasis_test",
            shopName: "龙冠实验局",
            locationName: $scope.mapInfo.curMapIterm.locationName,
            startTime: picker.startDate.format("YYYY-MM-DD HH:mm:ss"),
            endTime: picker.endDate.format("YYYY-MM-DD HH:mm:ss")
        })
        .success(function (data, status, header, config) {
            $scope.mapInfo.heatData = [];
            angular.forEach(data.client, function (value, key, values) {
                this.push([
                    value.posX * $scope.mapInfo.power,
                    value.posY * $scope.mapInfo.power,
                    0.1
                ]);
            }, $scope.mapInfo.heatData);
            $scope.mapInfo.clientTotal = data.client.length;
            drawHeatMapChart();
        })
        .error(function (data, status, header, config) {

        });
});

// get UserMap And Image
$http
    .post("/v3/ace/o2oportal/location/LocationImage", {
        userId: "oasis_test",
        shopName: "龙冠实验局"
    })
    .success(function (data, status, header, config) {

        $scope.mapInfo.locationImage = data.locationImage;
        $scope.mapInfo.curMapIterm = data.locationImage[0];
        $("#mapImage").bind("load", function () {
            $scope.$apply(function () {
                $scope.style = {
                    relative: {"position": "relative"},
                    map: {
                        "position": "absolute",
                        "top": 0
                    }
                };
            });
            $scope.$apply(resetSize);
            drawHeatMapLayer();
            drawAreaLayer();
            $scope.timer = $interval(function () {
                drawHeatMapLayer();
            }, 10000);
            $scope.$on("$destroy", function () {
                $interval.cancel($scope.timer);
            });
        });

    })
    .error(function (data, status, header, config) {

    });

// resetSize
function resetSize () {

    var nImageOW = angular.element("#mapImage").width();
    var nImageOH = angular.element("#mapImage").height() || 600;
    var nImageParentW = angular.element("#mapImage").parent().width();
    var nImageW = nImageParentW > nImageOW ? nImageOW : nImageParentW;
    var nPower = nImageW / nImageOW;
    $scope.mapInfo.power = nPower;
    var nImageH = nImageOH * nPower;
    $scope.style = {
        relative: {"position": "relative", "height": nImageH + 25},
        map: {
            "position": "absolute",
            "top": 0,
            "width": nImageW,
            "height": nImageH
        }
    };
    angular.element("#areaCanvas").attr("width", nImageW);
    angular.element("#areaCanvas").attr("height", nImageH);
    if ( nPower == 1 ) {
        $scope.style.map.left = ( nImageParentW - nImageW ) / 2 + 30;
    }
}

// heatMapLayer
function drawHeatMapLayer () {
    $http
        .post("/v3/ace/o2oportal/location/allLocationClient", {
            userId: "oasis_test",
            shopName: "龙冠实验局",
            locationName: $scope.mapInfo.curMapIterm.locationName
        })
        .success(function (data, status, header, config) {
            $scope.mapInfo.heatData = [];
            angular.forEach(data.client, function (value, key, values) {
                this.push([
                    value.posX * $scope.mapInfo.power,
                    value.posY * $scope.mapInfo.power,
                    0.1
                ]);
            }, $scope.mapInfo.heatData);
            if (data.client.length == 0) {
                $scope.mapInfo.heatData = [[0,0,0]];
            }
            $scope.mapInfo.clientTotal = data.client.length;
            drawHeatMapChart();
        })
        .error(function (data, status, header, config) {

        });
}

function drawHeatMapChart () {
    var heatMapChart = echarts.init(document.getElementById("heatMap"));
    var oOpts = {
        series: [{
            type: 'heatmap',
            minAlpha: 0.3,
            opacity: 0.6,
            gradientColors: [
                {offset: 0.4, color: 'green'},
                {offset: 0.5, color: 'yellow'},
                {offset: 0.8, color: 'orange'},
                {offset: 1, color: 'red'}
            ],
            data: $scope.mapInfo.heatData
        }]
    };
    heatMapChart.setOption(oOpts);
}

// areaLayer
function drawAreaLayer () {
    $http
        .post("/v3/ace/o2oportal/location/locationArea", {
            userId: "oasis_test",
            shopName: "龙冠实验局",
            locationName: $scope.mapInfo.curMapIterm.locationName
        })
        .success(function (data, status, header, config) {

            var data = {
                locationArea: [
                    {
                        areaName: "餐区一",
                        areaType: 4,
                        areaPoint: "M10.0 10.0L800.0 10.0L800.0 300.0L10.0 300.0z"
                    },
                    {
                        areaName: "餐区二",
                        areaType: 4,
                        areaPoint: "M800.0 400.0L1400.0 400.0L1100.0 600.0z"
                    }
                ]
            };

            $scope.mapInfo.areaData = [];
            angular.forEach(data.locationArea, function (value, key, values) {
                var aPoint = value.areaPoint.slice(1, value.areaPoint.length-1).split("L");
                var aAreaPoint = [];
                for(var i = 0; i < aPoint.length; i ++) {
                    aAreaPoint.push({
                        x: aPoint[i].split(" ")[0] * $scope.mapInfo.power,
                        y: aPoint[i].split(" ")[1] * $scope.mapInfo.power
                    });
                }
                this.push({
                    areaName: value.areaName,
                    areaType: value.areaType,
                    areaPoint: aAreaPoint
                });
            }, $scope.mapInfo.areaData);

            drawAreaBlock();
        })
        .error(function (data, status, header, config) {

        });
}

function drawAreaBlock () {
    var ctx = document.getElementById("areaCanvas").getContext("2d");

    var aAreaData = $scope.mapInfo.areaData;

    for (var i = 0; i < aAreaData.length; i ++) {
        var aAreaPoint = aAreaData[i].areaPoint
        for (var j = 0; j < aAreaPoint.length; j ++) {
            if ( j == 0 ) {
                ctx.beginPath();
                ctx.moveTo(aAreaPoint[j].x, aAreaPoint[j].y);
            }else if ( j == aAreaPoint.length-1 ) {
                ctx.lineTo(aAreaPoint[j].x, aAreaPoint[j].y);
                ctx.closePath();
                ctx.lineWidth = 4;
                ctx.lineJoin = "round";
                ctx.strokeStyle = "blue";
                ctx.stroke();
            }else{
                ctx.lineTo(aAreaPoint[j].x, aAreaPoint[j].y);
            }
        }
        for (var k = 0; k < aAreaPoint.length; k ++) {
            ctx.beginPath();
            ctx.arc(aAreaPoint[k].x, aAreaPoint[k].y, 8, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();
        }
    }
}

function isInsidePolygon(pt, poly) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}

angular.element("#areaCanvas").bind("mousemove", function (evt) {
    var oPt = {
        x: evt.offsetX,
        y: evt.offsetY
    };

    angular.forEach($scope.mapInfo.areaData, function (value, key, values) {
        var isInside = isInsidePolygon(oPt, value.areaPoint);
        if (isInside) {
            // TODO: show Text
            console.log(value.areaName);
        }
    });
});

function onMouseClick ($event) {

    var oPt = {
        x: $event.offsetX,
        y: $event.offsetY
    };
    angular.forEach($scope.mapInfo.areaData, function (value, key, values) {
        var isInside = isInsidePolygon(oPt, value.areaPoint);
        if (isInside) {
            // TODO: show modal
            $scope.$broadcast("show#client");
        }
    });
}

// init clientModal
$scope.options.clientModal = {
    mId: "client",
    title: getRcText("CLIENT_MODAL_HEADER"),
    autoClose: true,
    showCancel: false,
    modalSize: 'lg', // normal,sm,lg
    showHeader: true,
    showFooter: true,
    okHandler: function (modal,$ele) {},
    cancelHandler: function (modal,$ele) {},
    beforeRender: function ($ele) { return $ele; }
};

// init clientTable
$scope.options.clientTable = {
    tId: "client",
    showCheckBox: false,
    showRowNumber: false,
    columns: [
        {title: getRcText("CLIENT_TABLE_HEADER")[0], field: "clientMac", sortable: true},
        {title: getRcText("CLIENT_TABLE_HEADER")[1], field: "clientIp", sortable: true},
        {title: getRcText("CLIENT_TABLE_HEADER")[2], field: "weChatName", sortable: true},
        {title: getRcText("CLIENT_TABLE_HEADER")[3], field: "phone", sortable: true},
        {title: getRcText("CLIENT_TABLE_HEADER")[4], field: "userName", sortable: true},
        {title: getRcText("CLIENT_TABLE_HEADER")[5], field: "stayTime", sortable: true},
        {title: getRcText("CLIENT_TABLE_HEADER")[6], field: "visitTime", sortable: true},
        {title: getRcText("CLIENT_TABLE_HEADER")[7], field: "leaveTime", sortable: true}
    ],
    data: [
        {
            clientMac: "ee34-efef-5566-hh56",
            clientIp: "192.168.0.1",
            weChatName: "Jone",
            phone: "15032211111",
            userName: "Jone Don",
            stayTime: "1h",
            visitTime: moment().subtract(1, "hours").format("YYYY/MM/DD HH:mm:ss"),
            leaveTime: moment().format("YYYY/MM/DD HH:mm:ss")
        }
    ]
};

function clickClientTotal () {
    $scope.$broadcast("show#client");
}




























}];
});