define(["utils", 'bootstrap-daterangepicker','css!bootstrap_daterangepicker_css','css!warning15/views/warning.css'], function (Utils) {
    return ['$scope', '$http', '$alertService', function ($scope, $http, $alert) {
        var levelStr = getRcString("LOGLEVEL").split(',');
        var tableTitle = getRcString("WARING_ITEM").split(",");
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today =  year + '/' + (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day);
        var pageNum = 1;
        var pageSize = 10;
        var startDate = today;
        var endDate = today;
        var logLevel = [];
        var logFilepath;
        $scope.bIsSyncing = false;
        var bIsNeedGetPage = true;
        var g_Count;
        var g_Data;
        var devMode = $scope.sceneInfo.sn;

        (function () {
            var getDevOpt = {
                url: "/v3/devmonitor/web/system?devSN=" + $scope.sceneInfo.sn,
                method: "GET"
            };
            $http(getDevOpt)
                .success(function(data) {
                    if (data && !data.errcode && data.devMode) {
                        devMode = data.devMode;
                    }
                })
                .error(function() {
                    console.error('Get dev mode failed!');
                });
        })();
        function getRcString(attrName) {
            return Utils.getRcString("warning_rc", attrName);
        }

        function tryAgain() {
            $scope.bIsSyncing = false;
            $scope.statusInfo = getRcString("TRYAGAIN");
        }

        function refreshData() {
            bIsNeedGetPage = true;
            dataCount = 0;
            $scope.$broadcast('selectPage', 1);
        }

        function checkLoglevel() {
            var checkInfo = $scope.checkInfo;
            logLevel = [];
            if(checkInfo.jinji){
                logLevel.push(0,1);
            }
            if(checkInfo.weixian){
                logLevel.push(2,3);
            }
            if(checkInfo.jinggao){
                logLevel.push(4,5);
            }
            if(checkInfo.baogao){
                logLevel.push(6,7);
            }

            if(0 == logLevel.length){
                $scope.$broadcast('removeAll');
            }else{
                refreshData();
            }
        }

        /* 从数组中找出logfile的路径 */
        function getLogfilepath(dataArry){
            for(i=0;i<dataArry.length;i++) {
                logFile = dataArry[i].fileName.match(/logfile[0-9]*.log$/);
                if (logFile) {
                    logFilepath = dataArry[i].filePath + "/" + dataArry[i].fileName;
                    break;
                }
            }
        }

        function getLogfile(callback) {
            var getFileinfoOpt = {
                    url: "/v3/fs/",
                    method: "POST",
                    data: {
                        Method: "getDevFileStatus_devlog",
                        devSN: $scope.sceneInfo.sn,
                        pathName: ""
                    }
                };
            $http(getFileinfoOpt)
                .success(function (data) {
                    if(data.retCode === 0) {
                        var dataArray = data.message;
                        getLogfilepath(dataArray);
                        if (logFilepath){
                            callback && callback();
                        }
                        else{
                            $alert.alert(getRcString("NOLOGFILE"));
                        }
                    }else if(data.retCode === 2){
                        $alert.alert(getRcString("NOAUTHORITY"));
                    }
                    else{
                        $alert.alert(getRcString("CONNFAILED") + ' ' + $scope.sceneInfo.sn + ' !');
                    }
                })
                .error(function () {
                    tryAgain();
                });
        }

        $scope.options = {
            ajax: function (request) {
                var opt = {
                    url: "/v3/devlogserver/getdevlog_async",
                    method: 'POST',
                    data: {
                        devSN: $scope.sceneInfo.sn,
                        skip: request.data.offset,
                        limit: request.data.limit,
                        oFilter: {startData: startDate, endData: endDate}
                    }
                };
                if(8 > logLevel.length && 0 < logLevel.length){
                    opt.data.oFilter.logLevel = logLevel;
                }
                if($scope.searchText){
                    opt.data.search = $scope.searchText;
                }
                if(request.data.sort){
                    var oSorter = {sName: request.data.sort};
                    if('desc' == request.data.order){
                        oSorter.isDesc = -1;
                    }else{
                        oSorter.isDesc = 1;
                    }
                    opt.data.oSorter = oSorter;
                }
                $http(opt)
                    .success(function (result) {
                        g_Data = result.devLog;
                        request.success({rows: result.devLog, total: g_Count || 10});
                        $scope.statusInfo = getRcString("LASTSYNC") + (new Date(result.syncTime + 28800000)).toISOString().replace('T', ' ').substr(0, 19);

                        if(bIsNeedGetPage){
                            bIsNeedGetPage = false;
                            var getPageOpt = {
                                url: "/v3/devlogserver/getpagenum",
                                method: "POST",
                                data: opt.data
                            };
                            $http(getPageOpt)
                                .success(function (data) {
                                    if(data && (undefined != data.count)) {
                                        g_Count = data.count;
                                        $scope.$broadcast('load',{rows:g_Data, total:g_Count});
                                    }
                                })
                                .error(function (err) {
                                    console.error('Get page num failed, err: ' + JSON.stringify(err));
                                });
                        }

                    })
                    .error(function (err) {
                        console.error("get devlog error: " + err);
                    });
            },
            columns: [
                {sortable: true, field: "devSN", title: tableTitle[0],
                    formatter: function () {
                        return devMode;
                    }
                },
                {sortable: true, field: "logModule", title: tableTitle[1]},
                {
                    sortable: true, field: "logLevel", title: tableTitle[2],
                    formatter: function (value) {
                        return levelStr[value];
                    }
                },
                {sortable: true, field: "logStr", title: tableTitle[3]},
                {
                    sortable: true, field: "logTime", title: tableTitle[4],
                    formatter: function (value) {
                        return (new Date(value + 28800000)).toISOString().replace('T', ' ').substr(0, 23);
                    }
                }
            ],
            pageList: "[10, 20]",
            pagination: true,
            sidePagination: 'server'
        };
        $scope.$on('page-change.bs.table', function (event, num, size) {
            pageNum = num;
            pageSize = size;
        });
        $scope.syncNow = function () {
            getLogfile(function () {
                $scope.bIsSyncing = true;
                $scope.statusInfo = getRcString("PLEASEWAIT");
                var syncOpt = {
                        url: "/v3/fs/syncLogfile",
                        method: "POST",
                        data: {
                            Method: "downloadFile_devlog",
                            devSN: $scope.sceneInfo.sn,
                            fileName: logFilepath
                        }
                    };
                $http(syncOpt)
                    .success(function (data) {
                        if(!data.retCode){
                            $scope.bIsSyncing = false;
                            refreshData();
                        }else if(2 == data.retCode){
                            $scope.bIsSyncing = false;
                            $alert.alert(getRcString("NOAUTHORITY"));
                        }else{
                            tryAgain();
                        }
                    })
                    .error(function () {
                        tryAgain();
                    });
            });
        };
        $scope.exportLog = function () {
            $scope.$broadcast('getData', function (data) {
                if(!data.length){
                    $alert.alert(getRcString("NOLOGEXPORT"));
                }else{
                    $scope.bIsExporting = true;
                    var exportOpt = {
                        url: "/v3/fs/exportLogfile",
                        method: 'POST',
                        data:{
                            devSN: $scope.sceneInfo.sn,
                            oFilter: {startData: startDate, endData: endDate}
                        }
                    };
                    if(8 > logLevel.length && 0 < logLevel.length){
                        exportOpt.data.oFilter.logLevel = logLevel;
                    }

                    $http(exportOpt)
                        .success(function (data) {
                            $("#exportFile").get(0).src = data.fileName.replace('../../fs', '/v3/fs');
                            $scope.bIsExporting = false;
                        })
                        .error(function (err) {
                            $scope.bIsExporting = false;
                        });
                }
            });
        };
        $scope.refresh = function () {
            refreshData();
        };
        // chu li checkbox
        $scope.checkInfo = {
            all: true,
            jinji: true,
            weixian: true,
            jinggao: true,
            baogao: true
        };
        $scope.checkAll = function () {
            var checkInfo = $scope.checkInfo;
            checkInfo.jinji = checkInfo.all;
            checkInfo.weixian = checkInfo.all;
            checkInfo.jinggao = checkInfo.all;
            checkInfo.baogao = checkInfo.all;
            checkLoglevel();
        };
        $scope.checkLoglevel = function () {
            var checkInfo = $scope.checkInfo;
            if(!checkInfo.all && checkInfo.jinji && checkInfo.weixian && checkInfo.jinggao && checkInfo.baogao){
                checkInfo.all = true;
            }
            if(checkInfo.all && (!checkInfo.jinji || !checkInfo.weixian || !checkInfo.jinggao || !checkInfo.baogao)){
                checkInfo.all = false;
            }
            checkLoglevel();
        };

        //chu li daterangepicker
        var dateRangeOpt = {
            "startDate": today,
            "endDate": today,
            "opens": "left",
            "locale": {format: "YYYY/MM/DD"}
        };
        $("#daterange").daterangepicker(dateRangeOpt, function (start, end) {
            startDate = start.format('YYYY/MM/DD');
            endDate = end.format('YYYY/MM/DD');
            refreshData();
        });

        //lan jie shi jian
        $(document).on('click','.daterangepicker.dropdown-menu', function(e){
            e.stopPropagation();
        });

        $(document).on('click', ".prev,.next", function (e) {
            e.stopPropagation();
        });

        //guan jian zi sou suo
        var oTimer = false;
        $scope.search = function() {
            if(oTimer){
                clearTimeout(oTimer);
            }
            oTimer = setTimeout(function(){
                refreshData();
            },500);
        };
    }];
});