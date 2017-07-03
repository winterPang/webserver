define(["utils"], function (Utils) {
    return ["$rootScope", "$scope", "$http", "$alertService", function($rootScope, $scope, $http, $alert) {
        // Code Start
        const URL_blacklist = Utils.getUrl(
            "GET", "v3", "/ace/oasis/auth-data/o2oportal/registuser/query",
            "/init/fixedaccount5/get_userlist.json");
        const BLACK_LIST_HEADER = getRcText("BLACK_LIST_HEADER");
        const USER_TYPE = getRcText("USER_TYPE");
        const CONFIGURE_SUCCESS = getRcText("CONFIGURE_SUCCESS");
        const CONFIGURE_ERROR = getRcText("CONFIGURE_ERROR");
        function getRcText(attrName) {
            var sText = Utils.getRcString("RC", attrName);
            if (sText.indexOf(",") == -1) {
                return sText;
            } else {
                return sText.split(",");
            }
        }

        $scope.blacklistBtn = {
            addDisabled: true,
            removeDisabled: true,
            click: clickBlacklistBtn
        };

        $scope.blacklistOpts = {
            tId: "blacklist",
            showCheckBox: true,
            showRowNumber: false,
            searchable: true,
            showPageList: false,
            // singleSelect: true,
            clickToSelect: true,
            pageSize: 10,
            pageList: [10, 25, 50, 100, "All"],
            toolbar: "#blacklistBtnGrp",
            startField: "startRowIndex",
            limitField: "maxItems",
            sortField: "sortColumn",
            orderField: "ascending",
            sidePagination: "server",
            method: URL_blacklist.method.toLowerCase(),
            url: URL_blacklist.url + "?" + $.param({
                ownerName: $rootScope.userInfo.user,
                storeId: $scope.sceneInfo.nasid,
                isUsingNickName: true
            }),
            contentType: "application/json",
            dataType: "json",
            queryParams: function (params) {

                params.ascending = (params.ascending == "asc" ? true : false);

                $.extend(params, params.findoption);

                delete params.findoption;
                delete params.start;
                delete params.size;

                return params;
            },
            responseHandler: function (data) {
                return {
                    total: data.rowCount,
                    rows: data.data
                };
            },
            columns: [
                {
                    title: BLACK_LIST_HEADER[0],
                    field: "userName",
                    sortable: true,
                    searcher: {type: "text"},
                    formatter: function (value, row, index) {
                        if (row.isBlackUser) {
                            return "<div class='black'>" + value + "</div>";
                        } else {
                            return value;
                        }

                    }
                },
                {
                    title: BLACK_LIST_HEADER[1],
                    field: "userType",
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (value > 0 && value < 9) {
                            return USER_TYPE[value-1];
                        }
                        if (value == 100) {
                            return USER_TYPE[8];
                        }
                    },
                    searcher: {
                        type: "select",
                        valueField: "typeValue",
                        textField: "typeText",
                        data: [
                            {typeValue: 1, typeText: USER_TYPE[0]},
                            {typeValue: 2, typeText: USER_TYPE[1]},
                            {typeValue: 3, typeText: USER_TYPE[2]},
                            {typeValue: 4, typeText: USER_TYPE[3]},
                            {typeValue: 5, typeText: USER_TYPE[4]},
                            {typeValue: 6, typeText: USER_TYPE[5]},
                            {typeValue: 7, typeText: USER_TYPE[6]},
                            {typeValue: 8, typeText: USER_TYPE[7]},
                            {typeValue: 100, typeText: USER_TYPE[8]}
                        ]
                    }
                }
            ]
        };

        var checkEvt = [
            "check.bs.table#blacklist",
            "uncheck.bs.table#blacklist",
            "check-all.bs.table#blacklist",
            "uncheck-all.bs.table#blacklist"
        ];

        angular.forEach(checkEvt, function (value, key, values) {
            $scope.$on(value, function () {
                $scope.$broadcast("getSelections#blacklist", function (data) {
                    $scope.$apply(function () {

                        $scope.aCurCheckData = data;
                        $scope.blacklistBtn.addDisabled = true;
                        $scope.blacklistBtn.removeDisabled = true;
                        if ($scope.aCurCheckData.length == 0) {return;}
                        angular.forEach($scope.aCurCheckData, function (value, key, values) {
                            if (value.isBlackUser) {
                                $scope.blacklistBtn.removeDisabled = false;
                            } else {
                                $scope.blacklistBtn.addDisabled = false;
                            }
                        });

                    });
                });
            });
        });

        // Click Blacklist Btn
        function  clickBlacklistBtn (btn) {

            var sUrl = "/v3/ace/oasis/auth-data/o2oportal/registuser/";
            if (btn == "add") {
                 sUrl += "addtoblackLists";
            }
            if (btn == "remove") {
                sUrl += "removefromblackLists";
            }

            var aBody = [];

            angular.forEach($scope.aCurCheckData, function (value, key, values) {
                this.push({
                    ownerName: $rootScope.userInfo.user,
                    storeId:  $scope.sceneInfo.nasid,
                    userName: value.realName,
                    userType: value.userType
                });
            }, aBody);

            $http
                .post(sUrl, aBody)
                .success(function (data) {
                    /*if (data.errorcode == 0) {
                        $alert.msgDialogSuccess(CONFIGURE_SUCCESS);
                    } else {
                        $alert.msgDialogError(CONFIGURE_ERROR);
                    }*/
                    $alert.msgDialogSuccess(CONFIGURE_SUCCESS);
                    $scope.$broadcast("refresh#blacklist");
                    $scope.blacklistBtn.addDisabled = true;
                    $scope.blacklistBtn.removeDisabled = true;
                })
                .error(function () {
                    $alert.msgDialogError(CONFIGURE_ERROR);
                    $scope.blacklistBtn.addDisabled = true;
                    $scope.blacklistBtn.removeDisabled = true;
                });

        }


    }];
});