define(['jquery', 'utils', 'echarts3', 'echartNodataPie', 'css!../css/index'], function($, Utils, echarts) {
    // body...
    return ['$scope', '$http', '$q', function($scope, $http, $q) {

        function getRcString(attrName) {
            return Utils.getRcString("interview88", attrName);
        }
        //var visitedListUrl = Utils.getUrl('POST', '', '/ant/read_dpi_app', '/init/interview88/vistedData.json');
        //var visitedListUrl = { url: '../../init/interview88/vistedData.json' };
        var visutedUserEchart = echarts.init(document.getElementById('visited_user'));
        var visutedFlowEchart = echarts.init(document.getElementById('visited_flow'));
        var startTime = new Date();
        var endTime = new Date();
        var topColorArr = ['top-one', "top-two", "top-three", "top-four", "top-five"];
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);


        window.onresize = function() {
            visutedFlowEchart.resize();
            visutedUserEchart.resize()
        };

        var visutedUserPieOption = {
            color: ['#fbceb1', '#f2bc98', '#4ec1b2', '#78cec3', '#78cec3', '#4fc4f6', '#ff9c9e', '#fe808b', '#e7e7e9'],
            tooltip: {
                trigger: 'item',
                formatter: "{b}({d}%)<br/>访问人次 : {c}",
                position: ['50%', '50%']
            },
            legend: {
                show: true,
                orient: 'horizontal',
                top: '80%',
                //   bottom: '2%',
                // bottom:'10%',
                // left: 'middle',
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
                data: []
            },
            series: [{
                name: '访问人次',
                type: 'pie',
                center: ['50%', '40%'],
                radius: ['45%', '75%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                minAngle: 3,
                label: {
                    normal: {
                        show: false,
                        position: 'outside',
                        formatter: '{b}'
                    },
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 1,
                        borderType: 'solid',
                    }
                },
                data: []
            }]
        };

        visutedUserEchart.setOption(visutedUserPieOption);

        $scope.showNodataFlag = false;
        var legendNames = [];

        function drawVisutedUser(data) {
            //data = [];
            if (data.length <= 0) {
                $scope.showNodataFlag = true;
            }
            angular.forEach(data, function(v, k) {
                var visutedUserObj = {};
                var legendObj = {};
                if (k > 4) {
                    return false;
                }
                visutedUserObj.name = Utils.getLang() == "cn" ? v.APPNameCN : v.APPName;
                visutedUserObj.value = v.Count;
                legendObj.name = visutedUserObj.name;
                legendObj.icon = "pin";
                visutedUserPieOption.legend.data.push(legendObj)
                    //legendNames.push(visutedUserObj.name);
                visutedUserPieOption.series[0].data.push(visutedUserObj);
            });
            //visutedUserEchart.hideLoading();
            visutedUserEchart.setOption(visutedUserPieOption);
        }

        function repaintVistedTop(data) {
            var transformData = [];
            var total = Number(data[0] && data[0].Count);
            angular.forEach(data, function(v, k) {
                var transformObj = {};
                if (k > 4) return false;
                transformObj.percent = parseInt(v.Count / total * 100) + "%";
                transformObj.name = Utils.getLang() == "cn" ? v.APPNameCN : v.APPName;
                transformObj.value = v.Count;
                transformObj.color = topColorArr[k];
                transformData.push(transformObj);
            })
            $scope.topVistedList = transformData;
        }
        $http({
            method: "post",
            url: "/v3/ant/read_dpi_app",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: {
                "method": "getAppUseCountTop10",
                "param": {
                    "family": "0",
                    "ACSN": $scope.sceneInfo.sn,
                    "startTime": startTime.getTime(),
                    "endTime": endTime.getTime()
                }
            }
        }).success(function(data, status, config, headers) {
            if (data.retCode == 0) {
                drawVisutedUser(data.message);
                repaintVistedTop(data.message);
            } else {
                $scope.showNodataFlag = true;
            }
        }).error(function(data, status, config, headers) {
            //debugger
        });
        var visutedFlowPieOption = {
            color: ['#fbceb1', '#f2bc98', '#4ec1b2', '#78cec3', '#78cec3', '#4fc4f6', '#ff9c9e', '#fe808b', '#e7e7e9'],
            tooltip: {
                trigger: 'item',
                // formatter: "{b}({d}%)<br/>访问流量 : {c} "
                formatter: function(param) {
                    //debugger
                    return param.name + "：(" + param.percent + "%)<br/>" + param.seriesName + "：" + Utils.addComma(param.value, 'memory', 0, 2);
                },
                position: ['50%', '50%']
            },
            legend: {
                show: true,
                orient: 'horizontal',
                top: '80%',
                // bottom:'10%',
                // left: 'middle',
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
                data: []
            },
            series: [{
                name: '访问流量',
                type: 'pie',
                center: ['50%', '40%'],
                radius: ['45%', '75%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                minAngle: 3,
                label: {
                    normal: {
                        show: false,
                        position: 'outside',
                        formatter: '{b}'
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 1,
                        borderType: 'solid',
                    }
                },
                data: []
            }]
        };
        // visutedFlowEchart.on('click', function (params) {
        // 	alert(11111111);
        // });
        visutedFlowEchart.setOption(visutedFlowPieOption);

        function repaintVistedFlowTop(data) {
            var transformData = [];
            var total = Number(data[0] && data[0].TotalBytes);
            angular.forEach(data, function(v, k) {
                var transformObj = {};
                if (k > 4) return false;
                transformObj.percent = parseInt(v.TotalBytes / total * 100) + "%";
                transformObj.name = Utils.getLang() == "cn" ? v.APPNameCN : v.APPName;
                transformObj.value = Utils.addComma(v.TotalBytes, 'memory', 0, 2);;
                transformObj.color = topColorArr[k];
                transformData.push(transformObj);
            })
            $scope.topVistedFlowList = transformData;
        }
        $scope.showFlowNodataFlag = false;

        function drawVisutedFlow(data) {
            if (data.length <= 0) {
                $scope.showFlowNodataFlag = true;
            }
            angular.forEach(data, function(v, k) {
                var visutedFlowObj = {};
                var legendObj = {};
                if (k > 4) return false;
                visutedFlowObj.name = Utils.getLang() == "cn" ? v.APPNameCN : v.APPName;
                visutedFlowObj.value = v.TotalBytes;
                legendObj.name = visutedFlowObj.name;
                legendObj.icon = "pin";
                visutedFlowPieOption.legend.data.push(legendObj);
                visutedFlowPieOption.series[0].data.push(visutedFlowObj);
            })
            visutedFlowEchart.setOption(visutedFlowPieOption);
        }
        $http({
            method: "post",
            url: "/v3/ant/read_dpi_app",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: {
                "method": "getAppFlowTop10",
                "param": {
                    "family": "0",
                    "ACSN": $scope.sceneInfo.sn,
                    "startTime": startTime.getTime(),
                    "endTime": endTime.getTime()
                }
                //"Return":[]
            }
        }).success(function(data, status, config, headers) {
            if (data.retCode == 0) {
                drawVisutedFlow(data.message);
                repaintVistedFlowTop(data.message);
            } else {
                $scope.showFlowNodataFlag = true;
            }
        }).error(function(data, status, config, headers) {
            //debugger
        })

        function addFlowUnit(strPktBytes) {
            var nKb = 1024,
                nMb = 1024 * nKb,
                nGb = 1024 * nMb,
                nTb = 1024 * nGb;
            var nPktBytes = Number(strPktBytes) || 0;

            if (nPktBytes < nKb) {
                strPktBytes = nPktBytes + "(Byte)"
            } else if (nPktBytes < nMb) {
                strPktBytes = (nPktBytes / nKb).toFixed(2) + "(KB)";
            } else if (nPktBytes < nGb) {
                strPktBytes = (nPktBytes / nMb).toFixed(2) + "(MB)";
            } else if (nPktBytes < nTb) {
                strPktBytes = (nPktBytes / nGb).toFixed(2) + "(GB)";
            } else {
                strPktBytes = (nPktBytes / nTb).toFixed(2) + "(TB)";
            }

            return strPktBytes;
        };

        function dealTimeFun(nTmpDate) {
            var oDate = new Date(nTmpDate * 1000);
            var nYear = oDate.getFullYear();
            var nMonth = dealTimeByTen(oDate.getMonth() + 1);
            var nDate = dealTimeByTen(oDate.getDate());
            var nHours = dealTimeByTen(oDate.getHours());
            var nMinutes = dealTimeByTen(oDate.getMinutes());
            var nSeconds = dealTimeByTen(oDate.getSeconds());

            return nYear + '/' + nMonth + '/' + nDate + ' ' + nHours + ':' + nMinutes + ':' + nSeconds;
        }

        function dealOnlineTime(time) {
            var onlineTime = "";
            var tNow = new Date();
            var nHourNow = tNow.getHours();
            var nMinuteNow = tNow.getMinutes();
            var nSecondsNow = tNow.getSeconds();
            var nHour = (time / 3600).toFixed(0);
            if (nHour > 168) {
                onlineTime = (144 + nHour) + ":" + dealTimeByTen(nMinuteNow) + ":" + dealTimeByTen(nSecondsNow);
            } else {
                nHour = dealTimeByHundred(parseInt(time / 3600));
                nMinute = dealTimeByTen(parseInt(time % 3600 / 60));
                nSeconds = dealTimeByTen(parseInt(time % 3600 % 60 % 60));
                onlineTime = nHour + ":" + nMinute + ":" + nSeconds;
            }
            return onlineTime;
        }

        function dealTimeByHundred(nTime) {
            return nTime > 99 ? nTime : (nTime > 9 ? ('0' + nTime) : ('00' + nTime));
        }

        function dealTimeByTen(nNum) {
            return Number(nNum) < 10 ? ('0' + nNum) : nNum;
        }

        function setAppGroup(APPGroupName) {
            var appGroupName = "";
            switch (APPGroupName) {
                case "Life":
                    {
                        appGroupName = getRcString("Life");
                        break;
                    }
                case "Office":
                    {
                        appGroupName = getRcString("Office");
                        break;
                    }
                case "Communication":
                    {
                        appGroupName = getRcString("Communication");
                        break;
                    }
                case "Video":
                    {
                        appGroupName = getRcString("Video");
                        break;
                    }
                case "Game":
                    {
                        appGroupName = getRcString("Game");
                        break;
                    }
                case "Tool":
                    {
                        appGroupName = getRcString("Tool");
                        break;
                    }
                case "News":
                    {
                        appGroupName = getRcString("News");
                        break;
                    }
                case "Navigation":
                    {
                        appGroupName = getRcString("Navigation");
                        break;
                    }
                case "Finance":
                    {
                        appGroupName = getRcString("Finance");
                        break;
                    }
                default:
                    {
                        appGroupName = getRcString("Unknown");
                        break;
                    }
            }
            return appGroupName;
        }
        var totalCount = 0;
        function disposeFlowData(flowData) {
            var dealData = {};
            var data = []
            if(flowData.totalCount&&totalCount!=flowData.totalCount){
                totalCount = flowData.totalCount;
            }
            angular.forEach(flowData.data, function(value, k) {
                var dataObj = {};
                dataObj = value;
                //dataObj['_id'] = value._id;
                dataObj.AppGroupName = value.APPGroupNameCN && Utils.getLang() == "cn" ? value.APPGroupNameCN : value.APPGroupName
                dataObj.AppName = value.APPNameCN && Utils.getLang() == "cn" ? value.APPNameCN : value.APPName
                dataObj.onlineTime = Utils.transformOnlineTimeStr("ms", value.TotalTime);
                dataObj.UpByte = addFlowUnit(value.UpBytes);
                dataObj.UserMAC = value.UserMAC;
                dataObj.DownByte = addFlowUnit(value.DownBytes);
                dataObj.firstTime = Utils.transformTimeStr("yyyy-mm-dd hh:mm:ss", value.FirstTime);
                data.push(dataObj);
            })
            dealData.clientData = data;
            dealData.totalCount = totalCount;
            return dealData;
        }

        function handerDealParams(param) {
            var tab_first, tab_first;
            //delete param.findoption;
            //delete param.sortoption;
            delete param.pageNumber;
            delete param.pageSize;
            delete param.skipnum;
            param["method"] = "getAppPageData";
            param["param"] = {
                "family": "0",
                "ACSN": $scope.sceneInfo.sn,
                "startTime": startTime.getTime(),
                "endTime": endTime.getTime(),
                'limit': param.limitnum
            }
            for(var key in param.sortoption){
                if( key == 'AppName'&&Utils.getLang() == "cn"){
                    param.param.sortName = 'APPNameCN';
                }
                else if(key == 'AppName'){
                    param.param.sortName = 'APPName';
                }
                if(key == 'AppGroupName'&&Utils.getLang() == "cn"){
                    param.param.sortName =   "APPGroupNameCN"
                }else if(key == 'AppGroupName'){
                    param.param.sortName =   "APPGroupName"
                }
            
                if(key == 'onlineTime') param.param.sortName = "TotalTime";
                if(key == 'UpByte') param.param.sortName = "UpBytes";
                if(key == 'DownByte') param.param.sortName = "DownBytes";
                if(key == 'firstTime') param.param.sortName = "FirstTime";
                if(key == 'UserMAC') param.param.sortName = "UserMAC";
                if(param.sortoption[key] == -1){
                    param.param.sortRule = "descending"
                }else{
                    param.param.sortRule = "ascending"
                }
            }
            for(var k in param.findoption){
                
                if(k == 'AppName'&& Utils.getLang() == "cn"){
                    param.param['APPNameCN'] = param.findoption[k];
                }else if(k == 'AppName'){
                    param.param['APPName'] = param.findoption[k];
                }

                if(k == 'AppGroupName'&& Utils.getLang() == "cn"){
                    param.param['APPGroupNameCN'] = param.findoption[k];
                }else if(k == 'AppGroupName'){
                    param.param['APPGroupName'] = param.findoption[k];
                }

                if(k == 'UserMAC')  param.param['UserMAC'] = param.findoption[k];
            }
            param["local"] = {};
            $scope.$broadcast('getData#visitedDetailList', function(data) {
                tab_first = data[0];
                tab_last = data[data.length - 1];
            });
            if (param.pageChangeFlag == 'first') {
 				param["param"].action = 'firstPage';
            }else if(param.pageChangeFlag == 'pre'){
				param["param"].action = 'previousPage';
                //tab_first.firstTime = new Date(tab_first.firstTime).getTime();
                param["local"] = tab_first;
               // param["local"].FirstTime = tab_first.firstTime;
            }else if(param.pageChangeFlag == 'next'){
            	param["param"].action = 'nextPage';
               // tab_last.firstTime = new Date(tab_last.firstTime).getTime();
                // delete tab_last.AppName;
                // delete tab_last.AppGroupName;
                // delete tab_last.UpByte;
                // delete tab_last.DownByte;
                // delete tab_last.onlineTime;
                // delete tab_last.firstTime;
                param["local"] = tab_last;
               // param["local"].FirstTime = tab_last.firstTime;
            }else{
            	param["param"].action = 'lastPage';
            }
            return param;
        }

        $scope.visitedDetailList = {
            tId: 'visitedDetailList',
            url: "/v3/ant/read_dpi_app",
            method: "post",
            contentType: 'application/json',
            dataType: 'json',
            pageSize: 10,
            pageList: [10, 20, 50],
            apiVersion: 'v3',
            searchable: true,
            paginationSize: 'sm',
            queryParamsType: "limit",
            sidePagination: 'server',
            pageListChange: {
                pageNumber: 1,
                pageChangeFlag:'first'
            },
            queryParams: function(param) {
                return handerDealParams(param);
            },
            responseHandler: function(data) {
                //debugger
                var resData = { clientData: [], totalCount: 0 };
                if (data.retCode == 0) {
                    resData = disposeFlowData(data.message);
                }
                return resData;
            },
            dataField: 'clientData',
            totalField: 'totalCount',
            columns: [
                { searcher: {}, sortable: true, field: 'AppName', title: "应用名称" },
                { searcher: {}, sortable: true, field: 'AppGroupName', title: "应用类型" },
                { searcher: {}, sortable: true, field: 'UserMAC', title: "用户MAC" },
                { sortable: true, field: 'UpByte', title: "上行流量" },
                { sortable: true, field: 'DownByte', title: "下行流量" },
                { sortable: true, field: 'onlineTime', title: "在线时长" },
                { sortable: true, field: 'firstTime', title: "开始访问时刻" },
            ]
        };

    }];


});
