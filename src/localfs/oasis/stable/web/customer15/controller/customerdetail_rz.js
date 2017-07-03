define(['jquery', 'utils', 'echarts', 'angular-ui-router', 'bsTable'], function ($scope, Utils, echarts) {
    return ['$scope', '$http', '$state', '$window', "$alertService", function ($scope, $http, $state, $window, $alert) {
        function getRcString(attrName) {
            return Utils.getRcString("clients_rc", attrName);
        }

        $scope.return = function () {
            $window.history.back();
        };
        var surplus = [];
        $scope.listOpts = {};
        $scope.curCheckedRadio = "basicInfo";
        $scope.modBtnDisable = true;
        $scope.aCurCheckData = [];
        $scope.leadDevSN = '';

        var URL_GET_CLIENT_VERBOSE_PAGE = '/v3/stamonitor/monitor';

        var tableHeaders = getRcString('TABLE_HEADERS').split(',');
        $scope.tablesOption = {
            url: URL_GET_CLIENT_VERBOSE_PAGE,
            pageSize: 10,
            showPageList: false,
            clickToSelect: false,
            method: 'post',
            sidePagination: 'server',
            contentType: "application/json",
            dataType: "json",
            searchable: true,
            queryParams: function (params) {
                var chouseBody = {
                    sortoption: {},
                    method: 'clientcount_cloud_verbosepage',
                    param: {
                        topId: $scope.topName,
                        groupId: $scope.branchName,
                        dataType: 'auth',
                        devSN: $scope.leadDevSN,
                        skipNum: params.offset,
                        limitNum: params.limit,
                        clientMAC: params.findoption.clientMAC ? params.findoption.clientMAC : '',
                        clientSSID: params.findoption.clientSSID ? params.findoption.clientSSID : ''
                    }
                };
                if (params.sort) {
                    chouseBody.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                params.limit = undefined;
                params.offset = undefined;
                params.skipnum = undefined;
                params.limitnum = undefined;
                return $.extend(true, {}, params, chouseBody);
            },
            responseHandler: function (data) {
                var wheredata = data.response.clientInfo;
                $scope.leadDevSN = data.response.devSN;
                $.each(wheredata, function (i, item) {
                    if (item.clientVendor == "") {
                        item.clientVendor = getRcString('LIST_QOSML');
                    }
                });
                $.each(wheredata, function (i, item) {
                    if (item.clientRadioMode == 1) {
                        item.clientRadioMode = "802.11b";
                    } else if (item.clientRadioMode == 2) {
                        item.clientRadioMode = "802.11a";
                    } else if (item.clientRadioMode == 4) {
                        item.clientRadioMode = "802.11g";
                    } else if (item.clientRadioMode == 8) {
                        item.clientRadioMode = "802.11gn";
                    } else if (item.clientRadioMode == 16) {
                        item.clientRadioMode = "802.11an";
                    } else if (item.clientRadioMode == 64) {
                        item.clientRadioMode = "802.11ac";
                    } else {
                        item.clientRadioMode = getRcString('LIST_QOS');
                    }
                });
                $.extend(surplus, data.response.clientInfo);
                return {
                    total: data.response.count_total,
                    rows: data.response.clientInfo
                };
            },
            columns: [
                {checkbox: true},
                {field: 'clientMAC', title: tableHeaders[0], formatter: showNum, searcher: {}},
                {field: 'clientIP', title: tableHeaders[1]},
                {field: 'clientVendor', title: tableHeaders[2]},
                {field: 'ApName', title: tableHeaders[3]},
                {field: 'clientSSID', title: tableHeaders[4], searcher: {}},
                {field: 'clientRadioMode', title: tableHeaders[5], visible: false},
                {field: 'clientMode', title: tableHeaders[6], visible: false},
                {field: 'clientChannel', title: tableHeaders[7], visible: false},
                {field: 'NegoMaxRate', title: tableHeaders[8], visible: false},
                {field: 'clientTxRate', title: tableHeaders[9], visible: false},
                {field: 'clientRxRate', title: tableHeaders[10], visible: false},
                {field: 'portalUserName', title: tableHeaders[11], visible: false},
                {field: 'portalAuthType', title: tableHeaders[12], visible: false},
                {field: 'portalOnlineTime', title: tableHeaders[13], visible: false}
            ]
        };

        var tableColumns = {
            "showBasic": ['clientMAC', 'clientIP', 'clientVendor', 'ApName', 'clientSSID'],
            "hideBasic": ['clientRadioMode', 'clientMode', 'clientChannel', 'NegoMaxRate', 'clientTxRate', 'clientRxRate', 'portalUserName', 'portalAuthType', 'portalOnlineTime'],
            "showRadio": ['clientMAC', 'clientIP', 'ApName', 'clientRadioMode', 'clientMode', 'clientChannel', 'NegoMaxRate'],
            "hideRadio": ['clientVendor', 'clientSSID', 'clientTxRate', 'clientRxRate', 'portalUserName', 'portalAuthType', 'portalOnlineTime'],
            "showStatistics": ['clientMAC', 'clientIP', 'ApName', 'clientTxRate', 'clientRxRate'],
            "hideStatistics": ['clientRadioMode', 'clientMode', 'clientChannel', 'NegoMaxRate', 'clientVendor', 'clientSSID', 'portalUserName', 'portalAuthType', 'portalOnlineTime'],
            "showUser": ['clientMAC', 'clientSSID', 'portalUserName', 'portalAuthType', 'portalOnlineTime'],
            "hideUser": ['clientIP', 'ApName', 'clientTxRate', 'clientRxRate', 'clientRadioMode', 'clientMode', 'clientChannel', 'NegoMaxRate', 'clientVendor']
        };

        function showNum(value, row, index) {
            return '<a class="list-link">' + value + '</a>';
        }

        $scope.$on('click-cell.bs.table', function (evt, field, value, row, $ele) {
            if (field == 'clientMAC') {
                var g_oTableData = {};
                for (var i = 0; i < surplus.length; i++) {
                    g_oTableData[surplus[i].clientMAC] = surplus[i];
                }
                var oData = g_oTableData[row.clientMAC];
                if (oData.clientVendor == "") {
                    oData.clientVendor = getRcString('LIST_QOSML');
                }
                if (oData.clientRadioMode == 1) {
                    oData.clientRadioMode = "802.11b";
                } else if (oData.clientRadioMode == 2) {
                    oData.clientRadioMode = "802.11a";
                } else if (oData.clientRadioMode == 4) {
                    oData.clientRadioMode = "802.11g";
                } else if (oData.clientRadioMode == 8) {
                    oData.clientRadioMode = "802.11gn";
                } else if (oData.clientRadioMode == 16) {
                    oData.clientRadioMode = "802.11an";
                } else if (oData.clientRadioMode == 64) {
                    oData.clientRadioMode = "802.11ac";
                } else {
                    oData.clientRadioMode = oData.clientRadioMode;
                }
                $scope.$broadcast('show#delogonline');
                updateHtml($("#flowdetail_form"), oData);
            }
        });

        function updateHtml(jScope, oData) {
            $.each(oData, function (sKey, sValue) {
                sKey = sKey.replace(/\./g, "\\.");
                sValue = (null == sValue) ? "" : sValue + "";
                $("#" + sKey, jScope).removeClass("loading-small").html(sValue);
            });
            return;
        }

        $scope.aiyaoption = {
            mId: 'delogonline',
            title: getRcString('SEC_FAIL'),
            autoClose: true,
            showCancel: false,
            modalSize: 'lg',
            showHeader: true,
            showFooter: true,
            okText: getRcString('SEC_TYPEFL')
        };

        function toggleColumns(arrShow, arrHide) {
            $.each(arrShow, function (idx, val) {
                $scope.$broadcast('showColumn', val);
            });
            $.each(arrHide, function (idx, val) {
                $scope.$broadcast('hideColumn', val);
            });
            $scope.$broadcast('refresh', {"pageNumber": 1});
        }

        $scope.clickRadio = function (radioName) {
            $scope.curCheckedRadio = radioName;
            $scope.modBtnDisable = true;
            if ($scope.curCheckedRadio == "basicInfo") {
                toggleColumns(tableColumns.showBasic, tableColumns.hideBasic);
            } else if ($scope.curCheckedRadio == "RadioInfo") {
                toggleColumns(tableColumns.showRadio, tableColumns.hideRadio);
            } else if ($scope.curCheckedRadio == "StatisticsInfo") {
                toggleColumns(tableColumns.showStatistics, tableColumns.hideStatistics);
            } else if ($scope.curCheckedRadio == "UserInfo") {
                toggleColumns(tableColumns.showUser, tableColumns.hideUser);
            }
        };

        $scope.fresh = function () {
            $scope.$broadcast('refresh');
        };

        $scope.export = function () {
            $http({
                url: "/v3/fs/exportClientsListbyCondition",
                method: "post",
                data: {
                    devSN: $scope.sceneInfo.sn,
                    auth: 1
                }
            }).success(function (data) {
                if (data.retCode == 0) {
                    var exportCode = "/../v3" + data.fileName.substring(5);
                    $("#exportFile").get(0).src = exportCode;
                } else {
                    $alert.msgDialogError(getRcString('SAC_WLEEOP'));
                }
            });
        };

        var checkEvt = [
            "check.bs.table", "uncheck.bs.table",
            "check-all.bs.table", "uncheck-all.bs.table"
        ];

        angular.forEach(checkEvt, function (value, key, values) {
            $scope.$on(value, function () {
                $scope.$broadcast("getSelections", function (data) {
                    $scope.$apply(function () {
                        $scope.aCurCheckData = data;
                        $scope.modBtnDisable = !$scope.aCurCheckData.length;
                    });
                });
            });
        });

        $scope.cancellation = function () {
            var dataArray = [];
            $scope.$broadcast('getSelections', function (data) {
                $.each(data, function (i, item) {
                    dataArray.push(item.clientMAC);
                })
            });
            $http({
                url: "/v3/ant/confmgr",
                method: "post",
                data: {
                    cfgTimeout: 5,
                    cloudModule: 'portal',
                    configType: 0,
                    devSN: $scope.sceneInfo.sn,
                    deviceModule: "portal",
                    policy: 'cloudFirst',
                    method: "DeleteUser",
                    param: [
                        {
                            "branchName": "",
                            "userMacAddr": dataArray
                        }
                    ]
                }
            }).success(function (data) {
                if (data.deviceResult[0].result == "success") {
                    $alert.msgDialogSuccess(getRcString('LIST_QOSMODE'));
                } else if (data.deviceResult[0].result == "fail") {
                    $alert.msgDialogError(getRcString('LIST_QSMODE'));
                }
            });
        };

        $scope.cancellationall = function () {
            $http({
                url: "/v3/ant/confmgr",
                method: "post",
                data: {
                    cfgTimeout: 5,
                    cloudModule: 'portal',
                    configType: 0,
                    devSN: $scope.sceneInfo.sn,
                    deviceModule: "portal",
                    policy: 'cloudFirst',
                    method: "DeleteUser",
                    param: [
                        {
                            "branchName": "",
                            "userMacAddr": []
                        }
                    ]
                }
            }).success(function (data) {
                if (data.deviceResult[0].result == "success") {
                    $alert.msgDialogSuccess(getRcString('SEC_TYPE'));
                } else if (data.deviceResult[0].result == "fail") {
                    $alert.msgDialogError(getRcString('SEC_TYPEFAIL'));
                }
            });
        }
    }]
})
;