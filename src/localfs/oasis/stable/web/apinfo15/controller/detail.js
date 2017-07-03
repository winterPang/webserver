define(['echarts', 'utils', 'angular-ui-router', 'bsTable', 'css!apinfo15/css/apinfocss'], function (ecahrts, Utils) {
    return ['$scope', '$rootScope', '$http', '$alertService', '$state', function ($scope, $rootScope, $http, $) {
        var USER_ROOT = $rootScope.userRoles.userRoot;
        var USER_NAME = $scope.userInfo.attributes.name;
        var NASID = $scope.sceneInfo.nasid;
        var GROUP_NAME = $scope.branchName;
        var TOP_NAME = $scope.topName;
        var DEV_SN = $scope.sceneInfo.sn;

        var URL_GET_AP_STATUS = '/v3/apmonitor/getApStatusCountByCloudGroup';
        var URL_GET_AP_COUNT_MODEL = '/v3/apmonitor/getApModelCountByCloudGroup';
        var URL_POST_AP_INFO_LIST = '/v3/apmonitor/getApBriefInfoByParentCloudGroup?topId=%s&midId=%s';
        var URL_GET_AP_TRANSMITRAFFIC = '/v3/apmonitor/getTop5ApTransmitTrafficByCloudGroup?topId=%s&midId=%s';
        var URL_GET_AP_CLIENT = '/v3/stamonitor/monitor';

        //tool Function
        function getRcString(attrName) {
            return Utils.getRcString("apinfo_rc", attrName).split(',');
        }

        //AP info list
        $scope.ApGroup_list = {
            tId: 'grouplist',
            url: sprintf(URL_POST_AP_INFO_LIST, TOP_NAME, GROUP_NAME),
            contentType: 'application/json',
            method: "post",
            apiVersion: 'v3',
            dataType: 'json',
            pageSize: 5,
            pageList: [5, 10],
            sidePagination: 'server',
            dataField: 'apInfo.apList',
            totalField: 'apInfo.count_total',
            queryParams: function (params) {
                params.findoption = {
                    "findOptInGrp": params.findoption
                };
                params.sortoption = {
                    "sortOptInGrp": params.sortoption
                };
                return params;
            },
            columns: [
                {field: 'apName', title: getRcString("group_header")[0]},
                {field: 'apModel', title: getRcString("group_header")[1]},
                {field: 'apSN', title: getRcString("group_header")[2]}
            ],
            paginationPreText: '&lsaquo;',   //    分页条上一页显示的文本
            paginationNextText: '&rsaquo;',  //    分页条下一页显示的文本
            paginationFirstText: '&laquo;',  //    第一页显示的文本  默认是两个小于号
            paginationLastText: '&raquo;',   //    最后一页显示的文本  默认是两个大于号
            paginationSize: 'sm',        //    分页条显示大小，normal正常样式，sm是只显示上一页下一页第一页最后一页
            showPageList: false
        };

        //click base on client num pie for table
        $scope.apInfoByClientList = {
            tId: 'apInfoByClientList',
            method: "post",
            contentType: 'application/json',
            dataType: 'json',
            pageSize: 5,
            pageList: [5, 10, 15],
            apiVersion: 'v3',
            searchable: true,
            sidePagination: 'server',
            dataField: 'apList',
            totalField: 'totalCount',
            columns: [
                {field: 'apName', title: getRcString("ap_info_type")[0]},
                {field: 'apModel', title: getRcString("ap_info_type")[1]},
                {field: 'clientCount', title: getRcString("ap_info_type")[2]}
            ]
        };

        //click base on client num pie for modal
        $scope.apInfoByClientOption = {
            mId: 'apInfoByClient',
            title: getRcString('AP_LIST'),
            autoClose: true,
            showCancel: false,
            showOk: false,
            modalSize: 'lg',
            showHeader: true,
            showFooter: false,
            showClose: true
        };

        //top 5
        $scope.ApTransmitTraffic_list = {
            tId: 'apTransmitTraffic',
            url: sprintf(URL_GET_AP_TRANSMITRAFFIC, TOP_NAME, GROUP_NAME),
            contentType: 'application/json',
            dataType: 'json',
            // onlyInfoPagination: "true",
            showRowNumber: true,
            paginationSize: "sm",
            pagination: false,
            pageSize: 5,
            pageList: [5, 10],
            dataField: 'ApTransmitTrafficList',
            // queryParams:function(params){
            //     params.devSN=$scope.sceneInfo.sn;
            //     return params;
            // },
            columns: [
                {field: 'apName', title: getRcString("ApTransmitTraffic_header")[0]},
                {
                    field: 'transmitTraffic',
                    title: getRcString("ApTransmitTraffic_header")[1],
                    formatter: function (value, rows) {
                        var nKB = 1,
                            nMB = 1024 * nKB,
                            nGB = 1024 * nMB,
                            nTB = 1024 * nGB;
                        if (value >= nTB) {
                            return (value / nTB).toFixed(2) + " TB";
                        } else if (value >= nGB) {
                            return (value / nGB).toFixed(2) + " GB";
                        } else if (value >= nMB) {
                            return (value / nMB).toFixed(2) + " MB";
                        } else {
                            return (value / nKB).toFixed(2) + " KB";
                        }
                    }
                },
                {field: 'branchName', title: getRcString("ApTransmitTraffic_header")[2], visible: false},
                {
                    field: 'status', title: getRcString("ApTransmitTraffic_header")[3], formatter: function (v) {
                    return v == 1 ? getRcString('ap_status')[0] : getRcString('ap_status')[1];
                }
                }
            ],
            showPageList: false
        };

        function drawEmptyPie(jEle) {
            var oTheme = {color: ["rgba(216, 216, 216, 0.75)"]};
            var piechart = echarts.init(document.getElementById(jEle), oTheme);
            var option = {
                height: 245,
                calculable: false,
                series: [
                    {
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '35%'],
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
                        data: [{name: 'N/A', value: 1}]
                    }
                ]
            };

            piechart.setOption(option);
        }

        function APModel_bar(aModels, aModelData) {
            var OnlineApCount = [];
            var OfflineApCount = [];
            for (var i = 0; i < aModelData.length; i++) {
                OnlineApCount.push(aModelData[i].OnlineApCount);
                OfflineApCount.push(aModelData[i].OfflineApCount);
            }
            var nEnd = parseInt(700 / aModels.length) - 1;
            var nWidth = 523;
            var totalchart = echarts.init(document.getElementById('APModel_bar'));

            var option = {
                // color: ['#4ec1b2'],
                width: nWidth,
                height: 284,
                grid: {
                    x: '20%', y: 0, x2: 50, y2: 25,
                    borderColor: 'rgba(0,0,0,0)'
                },
                tooltip: {
                    show: true,
                    formatter: function (args) {
                        var s1 = args[0], s2 = args[1];
                        return s1.name + '<br/>' +
                            s2['seriesName'] + ':' + s2['value'] + '<br/>' +
                            s1['seriesName'] + ':' + s1['value'];
                    },//格式化输出格式
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#fff',
                            width: 0,
                            type: 'solid'
                        }
                    }
                },
                calculable: false,
                dataZoom: {
                    show: true,
                    realtime: true,
                    start: 0,
                    zoomLock: true,
                    orient: "vertical",
                    width: 10,
                    x: nWidth - 10,
                    end: nEnd,
                    backgroundColor: '#F7F9F8',
                    fillerColor: '#BEC7CE',
                    handleColor: '#BEC7CE'
                },
                xAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: aModels
                    }
                ],
                series: [
                    {
                        name: getRcString('AP_Count')[0],
                        type: 'bar',
                        itemStyle: {
                            normal: {color: '#CDCDCD'}
                        },
                        data: OfflineApCount
                    },
                    {
                        name: getRcString('AP_Count')[1],
                        type: 'bar',
                        itemStyle: {
                            normal: {color: '#42BAA9'}
                        },
                        data: OnlineApCount
                    }
                ]
            };

            totalchart.setOption(option);
        }

        function terminal(aData) {
            var oTheme = {
                color: ['#E7E7E9', '#4fcff6', '#78cec3', '#4EC1B2', '#fbceb1', '#f9ab77', '#ff9c9e', '#fe808b']
            };
            var piechart = echarts.init(document.getElementById("According_client"), oTheme);

            var dataStyle = {
                normal: {
                    label: {
                        show: false,
                        position: 'inner',
                        formatter: '{d}%'
                    },
                    labelLine: {
                        show: false
                    },
                    borderColor: '#FFF',
                    borderWidth: 1
                }
            };

            var option = {
                height: 245,
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '25%',
                    y: '18%',
                    data: ['0', '1~10', '11~20', '21~40', "", '41~60', '61~80', '81~100', getRcString('apClientType')[8]]
                },
                calculable: false,
                series: [
                    {
                        type: 'pie',
                        radius: ['37%', '55%'],
                        center: ['80%', '35%'],
                        itemStyle: dataStyle,
                        data: aData
                    }
                ]
            };

            piechart.setOption(option);
        }

        function getApCount() {
            http_getApCountByStatus(function (data) {
                if (data != "") {
                    var tempdata = data.ap_statistic;
                    $scope.unhealth_ap = tempdata.other;
                    $scope.online_ap = tempdata.online;
                    $scope.offline_ap = tempdata.offline + tempdata.unmatched;
                }
            });
        }

        function getApModel() {
            http_getApModel(function (data) {
                if (data != "") {
                    var tempdata = data.apCountList;
                    var names = [];
                    var values = [];

                    for (var i = 0; i < tempdata.length; i++) {
                        if(tempdata[i].ApModel=='unmatched'){
                            tempdata[i].ApModel='other';
                        }
                        names.push(tempdata[i].ApModel);
                        values.push({
                            name: tempdata[i].ApModel,
                            value: tempdata[i].ApCount,
                            OnlineApCount: tempdata[i].OnlineApCount,
                            OfflineApCount: tempdata[i].OfflineApCount
                        });
                    }

                    APModel_bar(names, values);
                }
            });
        }

        function getClientNum() {
            http_getClientNum(function (data) {
                if (data != "") {
                    var tempdata = data.response;
                    if (data.response.totalCount == 0) {
                        drawEmptyPie("According_client");
                    }
                    else {
                        var datas = data.response.statistics;
                        var type = [
                            {
                                name: getRcString('apClientType')[0],
                                value: (datas[0].count == 0) ? undefined : datas[0].count
                            },
                            {
                                name: getRcString('apClientType')[1],
                                value: (datas[1].count == 0) ? undefined : datas[1].count
                            },
                            {
                                name: getRcString('apClientType')[2],
                                value: (datas[2].count == 0) ? undefined : datas[2].count
                            },
                            {
                                name: getRcString('apClientType')[3],
                                value: (datas[3].count == 0) ? undefined : datas[3].count
                            },
                            {
                                name: getRcString('apClientType')[5],
                                value: (datas[4].count == 0) ? undefined : datas[4].count
                            },
                            {
                                name: getRcString('apClientType')[6],
                                value: (datas[5].count == 0) ? undefined : datas[5].count
                            },
                            {
                                name: getRcString('apClientType')[7],
                                value: (datas[6].count == 0) ? undefined : datas[6].count
                            },
                            {
                                name: getRcString('apClientType')[8],
                                value: (datas[7].count == 0) ? undefined : datas[7].count
                            }
                        ];
                        terminal(type);
                    }
                }
            });
        }

        function http_getApCountByStatus(cBack) {
            $http({
                method: 'GET',
                url: URL_GET_AP_STATUS,
                params: {'topId': TOP_NAME, 'midId': GROUP_NAME}
            }).success(function (data) {
                cBack(data);
            }).error(function (data) {
                cBack("");
            });
        }

        function http_getApModel(cBack) {
            $http({
                method: 'GET',
                url: URL_GET_AP_COUNT_MODEL,
                params: {'topId': TOP_NAME, 'midId': GROUP_NAME}
            }).success(function (data) {
                cBack(data);
            }).error(function (data) {
                cBack("");
            });
        }

        function http_getClientNum(cBack) {
            $http({
                method: 'POST',
                url: URL_GET_AP_CLIENT,
                data: {
                    method: 'apstatic_cloud_clientnum',
                    param: {
                        topId: TOP_NAME,
                        groupId: GROUP_NAME
                    }
                }
            }).success(function (data) {
                cBack(data);
            }).error(function (data) {
                cBack("");
            });
        }

        //init
        function init() {
            getApCount();
            getApModel();
            getClientNum();
        }

        init();
    }]
});

