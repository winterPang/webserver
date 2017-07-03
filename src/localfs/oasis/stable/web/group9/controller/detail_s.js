define(['utils', 'common9/devices'],function (Utils, Dev) {
    return ['$scope', '$http', '$state', '$window', '$alertService', '$stateParams', '$timeout', function ($scope, $http, $state, $window, $alert, $stateParams, $timeout) {
        function getRcString(attrName) {
            return Utils.getRcString("ap_rc", attrName);
        }

        $scope.return = function () {
            $window.history.back();
        }
        // 上页传来的数据
        var parameter = $stateParams.detailData;
        parameter = JSON.parse(parameter);
        //  处理设备SN和别名
        var devSNPromise = Dev.getAlias($stateParams.nasid);

        var apTableTitle = getRcString("ap-table-title").split(",");
        var getApCloudGroupUrl = '/v3/apmonitor/getApBriefInfoByCloudGroup';

        var addUserData = [];
        var delUserData = [];
        //button disable
        $scope.isCheckUserIn = true;
        $scope.isCheckUserOut = true;


        // apInGroup table
        $scope.apInGroup_table = {
            tId: 'apingrouptid',
            // url: getApInCloudGroupUrl+'?groupId='+$scope[v],
            // url: getApInCloudGroupUrl+'?groupId='+v.groupName,
            clickToSelect: true,
            sidePagination: 'server',
            showCheckBox: true,
            striped: true,
            // searchable: true,
            pagination: true,
            showPageList: false,
            pageSize: 5,
            pageList: [5, 10],
            apiVersion: 'v3',
            // pageParamsType: 'path',
            method: "post",
            contenrType: "application/json",
            dataType: "json",
            // startField: 'skipnum',
            // limitField: 'limitnum',//apiVersion:'v3'中传过了这三个
            beforeAjax: function () {
                return devSNPromise;
            },
            queryParams: function (params) { //数据发送前对数据的处理
                // var chouseBody = {
                //     sortoption: {}
                // };
                // if (params.sort) {
                //     chouseBody.sortoption[params.sort] = (params.order == "macAddr" ? 1 : -1);
                // }
                // params.start = undefined;
                // params.size = undefined;
                // params.order = undefined;
                // return $.extend(true, {}, params, chouseBody);
                //
                return $.extend(true, {"findoption": {}, "sortoption": {}}, params);

            },
            responseHandler: function (data,devSNObj) { //请求成功后的动作（刷数据）
                $.each(data.apInfo.apList, function (e, de) {
                    de.apName = devSNObj[de.apSN] || de.apName;
                    if (de.status == 1) {
                        de.statusStr = "在线"
                    } else {
                        de.statusStr = "离线"
                    }
                })
                return {
                    total: data.apInfo.count_total,
                    rows: data.apInfo.apList
                };
            },
            onCheck: OnUserList,
            onUncheck: OnUserList,
            onCheckAll: OnUserList,
            onUncheckAll: OnUserList,
            columns: [
                // {checkbox: true}, //和showCheckBox: true,功能一样多写出两个           
                {field: 'apName', title: apTableTitle[0], width:'25%'},
                {field: 'apModel', title: apTableTitle[1], width:'25%'},
                {field: 'apSN', title: apTableTitle[2], width:'25%'},
                {field: 'statusStr', title: apTableTitle[3], width:'25%'}
            ]
        };

        $scope.apInG = function (v) {
            $scope.$broadcast('refresh#apingrouptid', {
                url: getApCloudGroupUrl + '?groupId=' + v.groupName
            });
        }

        // apOutGroup table
        $scope.apOutGroup_table = {
            tId: 'apoutgrouptid',
            // url: getApOutCloudGroupUrl+'?topId='+$scope[v]+'&acSN='+$scope.sceneInfo.sn,
            // url: getApOutCloudGroupUrl+'?groupId='+v.topName,
            clickToSelect: true,
            sidePagination: 'server',
            showCheckBox: true,
            striped: true,
            // searchable: true,
            pagination: true,
            showPageList: false,
            pageSize: 5,
            pageList: [5, 10],
            apiVersion: 'v3',
            //pageParamsType: 'path',
            method: "post",
            contenrType: "application/json",
            dataType: "json",
            // startField: 'skipnum',
            // limitField: 'limitnum',
            beforeAjax: function () {
                return devSNPromise;
            },
            queryParams: function (params) {
                // var chouseBody = {
                //     sortoption: {}
                // };
                // if (params.sort) {
                //     chouseBody.sortoption[params.sort] = (params.order == "macAddr" ? 1 : -1);
                // }
                // params.start = undefined;
                // params.size = undefined;
                // params.order = undefined;
                // return $.extend(true, {}, params, chouseBody);
                //
                return $.extend(true, {"findoption": {}, "sortoption": {}}, params);
            },
            responseHandler: function (data,devSNObj) {
                $.each(data.apInfo.apList, function (e, de) {
                    de.apName = devSNObj[de.apSN] || de.apName;
                    if (de.status == 1) {
                        de.statusStr = "在线"
                    } else {
                        de.statusStr = "离线"
                    }
                })
                return {
                    total: data.apInfo.count_total,
                    rows: data.apInfo.apList
                };
            },
            onCheck: outUserList,
            onUncheck: outUserList,
            onCheckAll: outUserList,
            onUncheckAll: outUserList,
            columns: [
                // {checkbox: true}, //和showCheckBox: true,功能一样多写出两个           
                {field: 'apName', title: apTableTitle[0], width:'25%'},
                {field: 'apModel', title: apTableTitle[1], width:'25%'},
                {field: 'apSN', title: apTableTitle[2], width:'25%'},
                {field: 'statusStr', title: apTableTitle[3], width:'25%'}
            ]
        };

        $scope.apOutG = function (v) {
            $scope.$broadcast('refresh#apoutgrouptid', {
                url: getApCloudGroupUrl + '?groupId=' + v.topName
            });
        }


        refreshApData = function (v) {
            $scope.isCheckAPIn = true;
            $scope.isCheckAPOut = true;
            $scope.apInG(v);
            $scope.apOutG(v);
        }

        function OnUserList() {
            $scope.$broadcast("getSelections#apingrouptid", function (data) {
                $scope.$apply(function () {
                    $scope.isCheckUserIn = data.length < 1;
                });
            });
        }

        function outUserList() {
            $scope.$broadcast("getSelections#apoutgrouptid", function (data) {
                $scope.$apply(function () {
                    $scope.isCheckUserOut = data.length < 1;
                });
            });
        }

        $timeout(function () {
            refreshApData(parameter);
        });

        //delete ap from group 
        $scope.deleteApFromGroup = function () {
            $scope.$broadcast("getSelections#apingrouptid", function (data) {
                delUserData = [];
                for (var i = 0; i < data.length; i++) {
                    delUserData.push(data[i].apSN);
                }
                console.log(delUserData);
                $scope.isCheckUserIn = true;
                $scope.isCheckUserOut = true;
            });

            $http({
                url: "/v3/cloudapgroup",
                method: "POST",
                data: {
                    Method: "updateApGroupData",
                    query: {
                        FromGroupId: parameter.groupName,
                        ToGroupId: parameter.topName
                    },
                    data: delUserData
                }
            }).success(function (data) {
                console.log(data);
                $scope.apInG(parameter);
                $scope.apOutG(parameter);
            }).error(function () {
            });
        }

        // Add ap to group 
        $scope.addApToGroup = function () {
            $scope.$broadcast("getSelections#apoutgrouptid", function (data) {
                addUserData = [];
                for (var i = 0; i < data.length; i++) {
                    addUserData.push(data[i].apSN);
                }
                console.log(addUserData);
                $scope.isCheckUserOut = true;
                $scope.isCheckUserIn = true;
            });

            $http({
                url: "/v3/cloudapgroup",
                method: "POST",
                data: {
                    Method: "updateApGroupData",
                    query: {
                        FromGroupId: parameter.topName,
                        ToGroupId: parameter.groupName
                    },
                    data: addUserData
                }
            }).success(function (data) {
                console.log(data);
                $scope.apInG(parameter);
                $scope.apOutG(parameter);
            }).error(function () {
            });
        }

    }]
})