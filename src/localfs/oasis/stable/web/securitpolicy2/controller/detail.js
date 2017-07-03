define(["utils", "securitpolicy2/directive/directives"], function (Utils) {
    return ["$scope", "$http", "$alertService", "$q", function ($scope, $http, $alert, $q) {

        var setSuccess = {
            WIPS: false,
            Nat: false,
            Probe: false,
            time: 0
        };

        var OFF_ON = getRcText("off_on");

        $scope.modBtnDisable = true;
        $scope.modifyPopData = {
            natDetectStatus: false,
            probeStatus: false,
            phishStatus: false,
            ctmPhishStatus: false,
            floodStatus: false
        };

        function getRcText(attrName) {
            return Utils.getRcString("security_rc", attrName).split(",");
        }

        function getOffOnToText(sOffOn) {
            if (sOffOn == "off") {
                return OFF_ON[0];
            }
            if (sOffOn == "on") {
                return OFF_ON[1];
            }
        }

        function getBooleanToOffOn(bBoolean) {
            if (bBoolean === true) {
                return "on";
            }
            if (bBoolean === false) {
                return "off";
            }
            return "";
        }

        function getOffOnToBoolean(sOffOn) {
            if (sOffOn === "on") {
                return true;
            }
            if (sOffOn === "off") {
                return false;
            }
        }

        function OnAPListCheck() {
            $scope.$broadcast("getSelections#AP", function (data) {
                $scope.$apply(function () {
                    $scope.curCheckData = data;
                    $scope.modBtnDisable = !data.length;
                });
            });
        }

        function OnApListClickCell(field, value, row, $ele) {
            if (field == "wipsStatus") {
                $scope.$apply(function () {
                    $scope.detailPopData = {
                        name: row.apGroupName || row.apName,
                        radio: row.radioMode,
                        phishStatus: getOffOnToText(row.phishStatus),
                        ctmPhishStatus: getOffOnToText(row.ctmPhishStatus),
                        floodStatus: getOffOnToText(row.floodStatus)
                    };
                });
                $scope.$broadcast("show#detail");
            }
        }

        $scope.APListOpts = {
            tId: "AP",
            showCheckBox: true,
            showRowNumber: false,
            showPageList: false,
            searchable: true,
            clickToSelect: false,
            beforeAjax: function (params) {
                return $http({
                    method: "POST",
                    url: "/v3/ant/confmgr",
                    data: {
                        cloudModule: "WIPS",
                        configType: 1,
                        devSN: $scope.sceneInfo.sn,
                        method: "apTotalNumGet",
                        param: params.param
                    }
                });
            },
            //toolbar: "#APListToolbar",
            sidePagination: "server",
            method: "post",
            url: "/v3/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            queryParams: function (params) {

                var oParam = $.extend({}, {
                    skip: params.offset,
                    limit: params.limit,
                    sortName: params.sort,
                    sort: ( params.order == "asc" ? 1 : -1 )
                },  params.findoption);

                return {
                    cloudModule: "WIPS",
                    configType: 1,
                    devSN: $scope.sceneInfo.sn,
                    method: "apStatusGet",
                    param: oParam
                };
            },
            responseHandler: function (rowsData, totalData) {
                return {
                    total: totalData.data.result,
                    rows: rowsData.result
                };
            },
            onCheck: OnAPListCheck,
            onUncheck: OnAPListCheck,
            onCheckAll: OnAPListCheck,
            onUncheckAll: OnAPListCheck,
            onClickCell: OnApListClickCell,
            columns: [
                {
                    title: getRcText("ap_list_header")[0],
                    field: "apName",
                    width: "20%",
                    sortable: true,
                    searcher: {type: "text"}
                },
                {
                    title: getRcText("ap_list_header")[1],
                    field: "radioMode",
                    width: "20%",
                    sortable: true,
                    searcher: {
                        type: "select",
                        valueField: "value",
                        textField: "text",
                        data: [
                            {value: "2.4G", text: "2.4G"},
                            {value: "5G", text: "5G"}
                        ]
                    }
                },
                {
                    title: getRcText("ap_list_header")[2],
                    field: "natDetectStatus",
                    width: "20%",
                    sortable: true,
                    formatter: function (value) {
                        return getOffOnToText(value);
                    },
                    searcher: {
                        type: "select",
                        valueField: "value",
                        textField: "text",
                        data: [
                            {value: "off", text: OFF_ON[0]},
                            {value: "on", text: OFF_ON[1]}
                        ]
                    }
                },
                {
                    title: getRcText("ap_list_header")[3],
                    field: "wipsStatus",
                    width: "20%",
                    sortable: true,
                    formatter: function (value) {
                        return "<a class='list-link'>" + getOffOnToText(value) + "</a>";
                    },
                    searcher: {
                        type: "select",
                        valueField: "value",
                        textField: "text",
                        data: [
                            {value: "off", text: OFF_ON[0]},
                            {value: "on", text: OFF_ON[1]}
                        ]
                    }
                },
                {
                    title: getRcText("ap_list_header")[4],
                    field: "probeStatus",
                    width: "20%",
                    sortable: true,
                    formatter: function (value) {
                        return getOffOnToText(value);
                    },
                    searcher: {
                        type: "select",
                        valueField: "value",
                        textField: "text",
                        data: [
                            {value: "off", text: OFF_ON[0]},
                            {value: "on", text: OFF_ON[1]}
                        ]
                    }
                }
            ]
        };

        $scope.detailModalOpts = {
            mId: "detail",
            title: getRcText("model_header"),
            autoClose: true,
            showCancel: false,
            modalSize: "normal", // normal、sm、lg
            showHeader: true,
            showFooter: false,
            okHandler: function (modal, $ele) {
            },
            cancelHandler: function (modal, $ele) {
            },
            beforeRender: function ($ele) {
            }
        };

        $scope.modifyModalOpts = {
            mId: "modify",
            title: getRcText("model_header"),
            autoClose: true,
            showCancel: true,
            modalSize: "lg", // normal、sm、lg
            showHeader: true,
            showFooter: true,
            okHandler: function (modal, $ele) {
                var aSetWIPSData = [];
                var aSetNatData = [];
                var aSetProbeData = [];

                angular.forEach($scope.curCheckData, function (value, key, values) {
                    var oWIPS = {
                        apName: value.apName,
                        ctmPhishStatus: getBooleanToOffOn($scope.modifyPopData.ctmPhishStatus),
                        floodStatus: getBooleanToOffOn($scope.modifyPopData.floodStatus),
                        phishStatus: getBooleanToOffOn($scope.modifyPopData.phishStatus),
                        radioID: value.radioID + ""
                    };
                    aSetWIPSData.push(oWIPS);

                    var oNat = {
                        apName: value.apName,
                        natDetectStatus: getBooleanToOffOn($scope.modifyPopData.natDetectStatus)
                    };
                    aSetNatData.push(oNat);

                    var oProbe = {
                        apName: value.apName,
                        probeStatus: getBooleanToOffOn($scope.modifyPopData.probeStatus),
                        radioID: value.radioID + ""
                    };
                    aSetProbeData.push(oProbe);
                });
                setWIPSReq(aSetWIPSData);
                setNatReq(aSetNatData);
                setProbeReq(aSetProbeData);
            },
            cancelHandler: function (modal, $ele) {},
            beforeRender: function ($ele) {}
        };

        function setWIPSReq(params) {
            $http
                .post("/v3/ant/confmgr", {
                    cloudModule: "WIPS",
                    configType: 0,
                    devSN: $scope.sceneInfo.sn,
                    deviceModule: "WIPS",
                    method: "radioConfigure",
                    param: params
                })
                .success(function (data) {
                    setSuccessFinal("WIPS", data);
                })
                .error(function () {
                    $alert.msgDialogError(getRcText("msg_info")[1]);
                });
        }

        function setNatReq(params) {
            $http
                .post("/v3/ant/confmgr", {
                    cloudModule: "WIPS",
                    deviceModule: "WIPS",
                    configType: 0,
                    devSN: $scope.sceneInfo.sn,
                    method: "apEnableNatDetect",
                    param: params
                })
                .success(function (data) {
                    setSuccessFinal("Nat", data);
                })
                .error(function () {
                    $alert.msgDialogError(getRcText("msg_info")[1]);
                });
        }

        function setProbeReq(params) {
            $http
                .post("/v3/ant/confmgr", {
                    cloudModule: "PROBE",
                    configType: 0,
                    devSN: $scope.sceneInfo.sn,
                    deviceModule: "PROBE",
                    method: "probeEnable",
                    param: params
                })
                .success(function (data) {
                    setSuccessFinal("Probe", data);
                })
                .error(function () {
                    $alert.msgDialogError(getRcText("msg_info")[1]);
                });
        }

        function setSuccessFinal (method, data) {
            setSuccess.time ++;
            if (data.result == "success"
                && data.serviceResult == "success"
                && data.deviceResult[0].result == "success") {
                setSuccess[method] = true;
            }

            if (setSuccess.time !== 3) {return;}

            if (setSuccess.WIPS && setSuccess.Nat && setSuccess.Probe) {
                $alert.msgDialogSuccess(getRcText("msg_info")[0]);
            } else {
                $alert.msgDialogError(getRcText("msg_info")[1]);
            }

            setSuccess = {
                WIPS: false,
                Nat: false,
                Probe: false,
                time: 0
            };
            $scope.modBtnDisable = true;
            //getTotalCnt({});
            $scope.$broadcast("refresh#AP");
        }

        $scope.clickModifyBtn = function () {
            $scope.$broadcast("getSelections#AP", function (data) {
                if (data.length == 1) {
                    $scope.modifyPopData = {
                        natDetectStatus: getOffOnToBoolean(data[0].natDetectStatus),
                        probeStatus: getOffOnToBoolean(data[0].probeStatus),
                        phishStatus: getOffOnToBoolean(data[0].phishStatus),
                        ctmPhishStatus: getOffOnToBoolean(data[0].ctmPhishStatus),
                        floodStatus: getOffOnToBoolean(data[0].floodStatus)
                    };
                } else {
                    $scope.modifyPopData = {
                        natDetectStatus: false,
                        probeStatus: false,
                        phishStatus: false,
                        ctmPhishStatus: false,
                        floodStatus: false
                    };
                }
            });
            $scope.$broadcast('show#modify');
        };

    }];
});