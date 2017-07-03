define(['echarts', 'utils', 'angular-ui-router', 'bsTable'], function (ecahrts, Utils) {
    return ['$scope', '$rootScope', '$http', '$window', '$alertService', '$state', function ($scope, $rootScope, $http, $window, $) {
        var USER_ROOT = $rootScope.userRoles.userRoot;
        var USER_NAME = $scope.userInfo.attributes.name;
        var NASID = $scope.sceneInfo.nasid;
        var GROUP_NAME = $scope.branchName;
        var TOP_NAME = $scope.topName;
        var DEV_SN = $scope.sceneInfo.sn;
        // get url 
        var URL_GET_AP_INFO_LIST = '/v3/apmonitor/getApInfoListByCloudGroup?topId=%s&midId=%s';
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
        $scope.selectVal = 'base';

        function initData(bFlag) {
            var tId, columns = [];
            if (bFlag == 'base') {
                tId = "baseApList";
                columns = [
                    {checkbox: true},
                    {field: 'apName', title: getRcString("LIST_HEADER")[0]},
                    {field: 'apModel', title: getRcString("LIST_HEADER")[1]},
                    {field: 'apSN', title: getRcString("LIST_HEADER")[2]},
                    {field: 'branchName', title: getRcString("LIST_HEADER")[3], visible: false},
                    {field: 'status', title: getRcString("LIST_HEADER")[4]},
                    {field: 'apGroupName', title: getRcString("LIST_HEADER")[5]},
                    {searcher: {}, field: 'macAddr', title: getRcString("LIST_HEADER")[6]},
                    {field: 'ipv4Addr', title: getRcString("LIST_HEADER")[7]}
                ];
            } else if (bFlag == 'radio') {
                tId = "radioApList";
                columns = [
                    {checkbox: true},
                    {field: 'apName', title: getRcString("LIST_HEADER_SP")[0]},
                    {field: 'apModel', title: getRcString("LIST_HEADER_SP")[1]},
                    {field: 'apSN', title: getRcString("LIST_HEADER_SP")[2]},
                    {field: 'branchName', title: getRcString("LIST_HEADER_SP")[3], visible: false},
                    {field: 'status', title: getRcString("LIST_HEADER_SP")[4]},
                    {field: 'radioId', title: getRcString("LIST_HEADER_SP")[5]},
                    {field: 'radioChannel', title: getRcString("LIST_HEADER_SP")[6]},
                    {field: 'radioPower', title: getRcString("LIST_HEADER_SP")[7]}
                ];
            } else if (bFlag == 'link') {
                tId = "linkApList";
                columns = [{checkbox: true},
                    {field: 'apName', title: getRcString("LIST_HEADER_TJ")[0]},
                    {field: 'apModel', title: getRcString("LIST_HEADER_TJ")[1]},
                    {field: 'apSN', title: getRcString("LIST_HEADER_TJ")[2]},
                    {field: 'branchName', title: getRcString("LIST_HEADER_TJ")[3], visible: false},
                    {field: 'status', title: getRcString("LIST_HEADER_TJ")[4]},
                    {field: 'onlineTime', title: getRcString("LIST_HEADER_TJ")[5]},
                    {searcher: {}, field: 'macAddr', title: getRcString("LIST_HEADER_TJ")[6]},
                    {field: 'ipv4Addr', title: getRcString("LIST_HEADER_TJ")[7]}
                ];
            }
            /*else if(bFlag == 'client'){
             tId = "clientApList";
             columns = [
             {checkbox: true},
             {field: 'apName', title: getRcString("LIST_HEADER_YH")[0]},
             {field: 'apModel', title:  getRcString("LIST_HEADER_YH")[1]},
             {field: 'apSN', title: getRcString("LIST_HEADER_YH")[2]},
             {field: 'branchName', title:  getRcString("LIST_HEADER_YH")[3],visible:false},
             {field: 'status', title: getRcString("LIST_HEADER_YH")[4],formatter:function (v) {
             return v==1?'在线':'不在线';
             }},
             {field: 'clientCount5', title: getRcString("LIST_HEADER_YH")[5]},
             {field: 'clientCount2', title: getRcString("LIST_HEADER_YH")[6]}
             ];
             }*/

            $scope.clients_list_jb = {
                tId: tId,
                url: sprintf(URL_GET_AP_INFO_LIST, TOP_NAME, GROUP_NAME),
                pageSize: 10,
                pageList: [10, 20, 30],
                method: "post",
                // searchable:true,
                apiVersion: 'v3',
                sidePagination: 'server',
                dataField: 'apList',
                totalField: 'count_total',
                columns: columns,
                queryParams: function (params) {
                    params.findoption = {
                        "findOptInGrp": params.findoption
                    };
                    params.sortoption = {
                        "sortOptInGrp": params.sortoption
                    };
                    return params;
                },
                responseHandler: function (data) {
                    var apList = [];

                    var refreshData = {};
                    if (bFlag == 'base') {
                        angular.forEach(data.apInfo.apList, function (value, key, values) {
                            var iDate = {};
                            iDate.apName = value.apName;
                            iDate.apModel = value.apModel;
                            iDate.apSN = value.apSN;
                            iDate.status = value.status == 1 ? getRcString('ap_status')[0] : getRcString('ap_status')[1];
                            iDate.apGroupName = value.apGroupName;
                            iDate.macAddr = value.macAddr;
                            iDate.ipv4Addr = value.ipv4Addr;
                            apList.push(iDate);
                        });
                    }
                    else if (bFlag == 'radio') {

                        angular.forEach(data.apInfo.apList, function (value, key, values) {
                            angular.forEach(value.radioList, function (value1, key1, values1) {
                                var iDate = {};
                                iDate.apName = value.apName;
                                iDate.apModel = value.apModel;
                                iDate.apSN = value.apSN;
                                iDate.status = value.status == 1 ? getRcString('ap_status')[0] : getRcString('ap_status')[1];
                                iDate.radioId = value1.radioId;
                                iDate.radioChannel = value1.radioChannel;
                                iDate.radioPower = value1.radioPower;
                                apList.push(iDate);
                            });
                        });
                    }
                    else if (bFlag == 'link') {

                        angular.forEach(data.apInfo.apList, function (value, key, values) {
                            var iDate = {};
                            iDate.apName = value.apName;
                            iDate.apModel = value.apModel;
                            iDate.apSN = value.apSN;
                            iDate.status = value.status == 1 ? getRcString('ap_status')[0] : getRcString('ap_status')[1];
                            iDate.onlineTime = onLineTime(value);
                            iDate.macAddr = value.macAddr;
                            iDate.ipv4Addr = value.ipv4Addr;
                            apList.push(iDate);
                        });
                    }
                    // else if(bFlag == 'client')
                    // {
                    //
                    //     angular.forEach(data.apInfo.apList,function(value, key, values){
                    //         var iDate = {};
                    //         iDate.apName = value.apName;
                    //         iDate.apModel = value.apModel;
                    //         iDate.apSN = value.apSN;
                    //         iDate.clientCount5 = value.client5GNum;
                    //         iDate.clientCount2 = value.client24GNum;
                    //         apList.push(iDate);
                    //     });
                    // }
                    refreshData.count_total = data.apInfo.count_total;
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