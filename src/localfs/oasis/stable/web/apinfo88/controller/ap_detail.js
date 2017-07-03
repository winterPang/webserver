define(['echarts', 'utils', 'angular-ui-router', 'bsTable'], function (echarts, Utils) {
    return ['$scope', '$http', '$window', '$alertService', '$state', function ($scope, $http, $window, $) {

        // get url 
        var url_ApList = Utils.getUrl('POST', '', '/apmonitor/app/aplist_page', '/init/apinfo5/get_aplistDetail.json');
        var url_exClient = Utils.getUrl('POST', '', '/fs/exportApsList', '/init/apinfo5/get_aplistDetail.json');

        function getRcString(attrName) {
            return Utils.getRcString("clients_rc", attrName).split(',');
        }

        var aStatus = getRcString('STATUS');
        //authority
        $scope.$watch('permission', function (v) {
            //有权限
            if ($scope.permission.write == true) {
                $scope.exportBtn = true;
            }
            else if ($scope.permission.write == false) {
                //未获取到
                $scope.exportBtn = false;
            } else {
                console.error("Permission GetFailed");
            }
        }, true);

        $scope.selectVal = 'base'

        function initData(bFlag) {
            var tId, columns = [];
            if (bFlag == 'base') {
                tId = "baseApList";
                columns = [
                    {checkbox: true},
                    {searcher: {}, sortable: true, field: 'apName', title: getRcString("LIST_HEADER")[0]},
                    {searcher: {}, sortable: true, field: 'apModel', title: getRcString("LIST_HEADER")[1]},
                    {searcher: {}, sortable: true, field: 'apSN', title: getRcString("LIST_HEADER")[2]},
                    // {searcher: {}, sortable: true, field: 'apGroupName', title: getRcString("LIST_HEADER")[3]},
                    {searcher: {}, sortable: true, field: 'macAddr', title: getRcString("LIST_HEADER")[4]},
                    {searcher: {}, sortable: true, field: 'ipv4Addr', title: getRcString("LIST_HEADER")[5]}
                ];
            } else if (bFlag == 'radio') {
                tId = "radioApList";
                columns = [
                    {checkbox: true},
                    {searcher: {}, sortable: true, field: 'apName', title: getRcString("LIST_HEADER_SP")[0]},
                    {searcher: {}, sortable: true, field: 'apModel', title: getRcString("LIST_HEADER_SP")[1]},
                    {searcher: {}, sortable: true, field: 'apSN', title: getRcString("LIST_HEADER_SP")[2]},
                    {field: 'radioId', title: getRcString("LIST_HEADER_SP")[3]},
                    {field: 'radioChannel', title: getRcString("LIST_HEADER_SP")[4]},
                    {field: 'radioPower', title: getRcString("LIST_HEADER_SP")[5]}
                ];
            } else if (bFlag == 'link') {
                tId = "linkApList";
                columns = [{checkbox: true},
                    {searcher: {}, sortable: true, field: 'apName', title: getRcString("LIST_HEADER_TJ")[0]},
                    {searcher: {}, sortable: true, field: 'apModel', title: getRcString("LIST_HEADER_TJ")[1]},
                    {searcher: {}, sortable: true, field: 'apSN', title: getRcString("LIST_HEADER_TJ")[2]},
                    {field: 'onlineTime', title: getRcString("LIST_HEADER_TJ")[3]},
                    {searcher: {}, sortable: true, field: 'macAddr', title: getRcString("LIST_HEADER_TJ")[4]},
                    {searcher: {}, sortable: true, field: 'ipv4Addr', title: getRcString("LIST_HEADER_TJ")[5]}
                ];
            } else if (bFlag == 'client') {
                tId = "clientApList";
                columns = [
                    {checkbox: true},
                    {searcher: {}, sortable: true, field: 'apName', title: getRcString("LIST_HEADER_YH")[0]},
                    {searcher: {}, sortable: true, field: 'apModel', title: getRcString("LIST_HEADER_YH")[1]},
                    {searcher: {}, sortable: true, field: 'apSN', title: getRcString("LIST_HEADER_YH")[2]},
                    {field: 'clientCount5', title: getRcString("LIST_HEADER_YH")[3]},
                    {field: 'clientCount2', title: getRcString("LIST_HEADER_YH")[4]}
                ];
            }

            $scope.clients_list_jb = {
                tId: tId,
                url: url_ApList.url + "?devSN=" + $scope.sceneInfo.sn,
                pageSize: 10,
                pageList: [10, 20, 30],
                method: "post",
                contentType: 'application/json',
                dataType: 'json',
                apiVersion: 'v3',
                searchable: true,
                sidePagination: 'server',
                dataField: 'apList',
                totalField: 'count_total',
                columns: columns,
                responseHandler: function (data) {
                    var apList = [];

                    var refreshData = {};
                    if (bFlag == 'base') {
                        angular.forEach(data.apList, function (value, key, values) {
                            var iDate = {};
                            iDate.apName = value.apName;
                            iDate.apModel = value.apModel;
                            iDate.apSN = value.apSN;
                            iDate.apGroupName = value.apGroupName;
                            iDate.macAddr = value.macAddr;
                            iDate.ipv4Addr = value.ipv4Addr;
                            apList.push(iDate);
                        });
                    }
                    else if (bFlag == 'radio') {

                        angular.forEach(data.apList, function (value, key, values) {
                            angular.forEach(value.radioList, function (value1, key1, values1) {
                                var iDate = {};
                                iDate.apName = value.apName;
                                iDate.apModel = value.apModel;
                                iDate.apSN = value.apSN;
                                iDate.radioId = value1.radioId;
                                iDate.radioChannel = value1.radioChannel;
                                iDate.radioPower = value1.radioPower;
                                apList.push(iDate);
                            });
                        });
                    }
                    else if (bFlag == 'link') {

                        angular.forEach(data.apList, function (value, key, values) {
                            var iDate = {};
                            iDate.apName = value.apName;
                            iDate.apModel = value.apModel;
                            iDate.apSN = value.apSN;
                            iDate.onlineTime = onLineTime(value);
                            iDate.macAddr = value.macAddr;
                            iDate.ipv4Addr = value.ipv4Addr;
                            apList.push(iDate);
                        });
                    }
                    else if (bFlag == 'client') {

                        angular.forEach(data.apList, function (value, key, values) {
                            var iDate = {};
                            iDate.apName = value.apName;
                            iDate.apModel = value.apModel;
                            iDate.apSN = value.apSN;
                            iDate.clientCount5 = value.client5GNum;
                            iDate.clientCount2 = value.client24GNum;
                            apList.push(iDate);
                        });
                    }
                    refreshData.count_total = data.count_total;
                    refreshData.apList = apList;
                    return refreshData;
                }
            };
        }

        function onLineTime(num) {
            var time = (num.status == 1) ? num.onlineTime :
                ((num.status == 2) ? aStatus[num.status] : aStatus[3]);
            return time;
        }

        function http_getExportClient(succb, errcb) {
            $http({
                method: url_exClient.method,
                url: url_exClient.url,
                data: {devSN: $scope.sceneInfo.sn}
            }).success(function (data) {
                succb(data);
            }).error(function (err) {
                errcb(err);
            });
        }

        function initForm() {
            $scope.bindCheck = function (e) {
                var value = e.target.getAttribute('id');
                $scope.selectVal = value;
                initData(value);
            }

            $scope.refresh = function () {
                initData($scope.selectVal);
            }

            $scope.export = function () {
                function exportSuc(data) {
                    if (data != "") {
                        if (data.retCode == 0) {
                            var url = data.fileName.split('../..');
                            window.location.href = '/v3' + url[1];
                        }
                    }
                }

                function exportFail(error) {
                    console.log('Export log file failed: ' + error);
                }

                http_getExportClient(exportSuc, exportFail);

            }

            $scope.onReturn = function () {
                $window.history.back();
            }

        }

        //初始化init 
        function init() {
            initData("base");
            initForm();
        }

        init();
    }]
});