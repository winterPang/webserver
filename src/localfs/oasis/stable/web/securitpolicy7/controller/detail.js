define(["utils"], function (Utils) {
return ["$scope", "$http", "$alertService", function ($scope, $http, $alert) {

// Code Start
        var nAPGTotal = 0;
        var nAPTotal = 0;
        var setSuccess = {
            WIPS: false,
            Nat: false,
            Probe: false,
            time: 0
        };
        const OFF_ON = getRcText("OFF_ON");
        const MSG_INFO = getRcText("MSG_INFO");

        function getRcText(attrName) {
            var sText = Utils.getRcString("RC", attrName);
            if (sText.indexOf(",") == -1) {
                return sText;
            } else {
                return sText.split(",");
            }
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

        $scope.modBtnDisable = true;

	$scope.isChecked = {
	    overall: true,
	    APG: true
	};

	$scope.oBranch = {
	    data: [],
	    cur: null
	};

	$scope.modifyModal = {
	    natDetectStatus: false,
	    probeStatus: false,
	    phishStatus: false,
	    ctmPhishStatus: false,
	    floodStatus: false
	};

    $scope.selectOpts = {
        allowClear: false
    };

	$scope.clickRadio = function (sRadio) {
	    var clearCheckArr = true;
	    switch (true) {
	        case ( sRadio == "allover" && !$scope.isChecked.overall ):
	            $scope.isChecked = {
	                overall: true,
	                APG: true
	            };
	            $scope.oBranch.cur = $scope.oBranch.data[0];
	            $scope.$broadcast("refresh#APG");
	            break;

	        case ( sRadio == "branch" && $scope.isChecked.overall ):
	            $scope.isChecked = {
	                overall: false,
	                APG: true
	            };
	            $scope.$broadcast("refresh#APG");
	            break;

	        case ( sRadio == "APG" && !$scope.isChecked.APG ):
	            $scope.isChecked.APG = true;
	            $scope.$broadcast("refresh#APG");
	            break;

	        case ( sRadio == "AP" && $scope.isChecked.APG ):
	            $scope.isChecked.APG = false;
	            $scope.$broadcast("refresh#AP");
	            break;

	        default: 
	            return clearCheckArr = false;
	    }
	    if (clearCheckArr) {
	        $scope.aCurCheckData = [];
	        $scope.modBtnDisable = true;
	    }
	};

	$scope.selectBranch = function () {
	    $scope.isChecked.APG = true;
	    $scope.$broadcast("refresh#APG");
	};

	$http
	    .get("/v3/apmonitor/getBranchList?devSN=" + $scope.sceneInfo.sn)
	    .success(function (data, status, header, config) {
	        // data = {branchList: [{branchName: "branch01"}, {branchName: "branch02"}, {branchName: "branch03"}]};
	        angular.forEach(data.branchList, function (value, key, values) {
	            this.push({
	                name: value.branchName
	            });
	        }, $scope.oBranch.data);
	        $scope.oBranch.cur = $scope.oBranch.data[0];
	    })
	    .error(function (data, status, header, config) {

	    });

$scope.APGListOpts = {
    tId: "APG",
    showCheckBox: true,
    showRowNumber: false,
    search: false,
    searchable: true,
    showPageList: false,
    clickToSelect: false,
    toolbar: "#APGBtnGroup",
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
        }, params.findoption);

        if ( !$scope.isChecked.overall ) {
            oParam.branchName = $scope.oBranch.cur.name;
        }

        var oTotalParam = $.extend({}, params.findoption);

        nAPGTotal = getTotalData("APG", oTotalParam);

        return {
            cloudModule: "WIPS",
            configType: 1,
            devSN: $scope.sceneInfo.sn,
            method: "apGroupStatusGet",
            param: oParam
        };
    },
    responseHandler: function (data) {
        return {
            total: nAPGTotal,
            rows: data.result
        };
    },
    columns: [
        {
            title: getRcText("APG_LIST_HEADER")[0],
            field: "apGroupName",
            sortable: true,
            searcher: {type: "text"}
        },
        {
            title: getRcText("APG_LIST_HEADER")[1],
            field: "radioMode",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "radioValue",
                textField: "radioText",
                data: [
                    {radioValue: "2.4G", radioText: "2.4G"},
                    {radioValue: "5G", radioText: "5G"}
                ]
            }
        },
        {
            title: getRcText("APG_LIST_HEADER")[2],
            field: "natDetectStatus",
            sortable: true,
            formatter: function (value, row, index) {
                return getOffOnToText(value);
            },
            searcher: {
                type: "select",
                valueField: "natDetectValue",
                textField: "natDetectText",
                data: [
                    {natDetectValue: "off", natDetectText: OFF_ON[0]},
                    {natDetectValue: "on", natDetectText: OFF_ON[1]}
                ]
            }
        },
        {
            title: getRcText("APG_LIST_HEADER")[3],
            field: "wipsStatus",
            sortable: true,
            formatter: function (value, row, index) {
                return "<a class='list-link'>" + getOffOnToText(value) + "</a>";
            },
            searcher: {
                type: "select",
                valueField: "wipsValue",
                textField: "wipsText",
                data: [
                    {wipsValue: "off", wipsText: OFF_ON[0]},
                    {wipsValue: "on", wipsText: OFF_ON[1]}
                ]
            }
        },
        {
            title: getRcText("APG_LIST_HEADER")[4],
            field: "probeStatus",
            sortable: true,
            formatter: function (value, row, index) {
                return getOffOnToText(value);
            },
            searcher: {
                type: "select",
                valueField: "probeValue",
                textField: "probeText",
                data: [
                    {probeValue: "off", probeText: OFF_ON[0]},
                    {probeValue: "on", probeText: OFF_ON[1]}
                ]
            }
        }
    ]
};

$scope.APListOpts = {
    tId: "AP",
    showCheckBox: true,
    showRowNumber: false,
    search: false,
    searchable: true,
    showPageList: false,
    clickToSelect: false,
    toolbar: "#APBtnGroup",
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

        if ( !$scope.isChecked.overall ) {
            oParam.branchName = $scope.oBranch.cur.name;
        }

        var oTotalParam = $.extend({}, params.findoption);

        nAPTotal = getTotalData("AP", oTotalParam);

        return {
            cloudModule: "WIPS",
            configType: 1,
            devSN: $scope.sceneInfo.sn,
            method: "apStatusGet",
            param: oParam
        };
    },
    responseHandler: function (data) {
        return {
            total: nAPTotal,
            rows: data.result
        };
    },
    columns: [
        {
            title: getRcText("AP_LIST_HEADER")[0],
            field: "apName",
            sortable: true,
            searcher: {type: "text"}
        },
        {
            title: getRcText("AP_LIST_HEADER")[1],
            field: "radioMode",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "radioValue",
                textField: "radioText",
                data: [
                    {radioValue: "2.4G", radioText: "2.4G"},
                    {radioValue: "5G", radioText: "5G"}
                ]
            }
        },
        {
            title: getRcText("AP_LIST_HEADER")[2],
            field: "natDetectStatus",
            sortable: true,
            formatter: function (value, row, index) {
                return getOffOnToText(value);
            },
            searcher: {
                type: "select",
                valueField: "natDetectValue",
                textField: "natDetectText",
                data: [
                    {natDetectValue: "off", natDetectText: OFF_ON[0]},
                    {natDetectValue: "on", natDetectText: OFF_ON[1]}
                ]
            }
        },
        {
            title: getRcText("AP_LIST_HEADER")[3],
            field: "wipsStatus",
            sortable: true,
            formatter: function (value, row, index) {
                return "<a class='list-link'>" + getOffOnToText(value) + "</a>";
            },
            searcher: {
                type: "select",
                valueField: "wipsValue",
                textField: "wipsText",
                data: [
                    {wipsValue: "off", wipsText: OFF_ON[0]},
                    {wipsValue: "on", wipsText: OFF_ON[1]}
                ]
            }
        },
        {
            title: getRcText("AP_LIST_HEADER")[4],
            field: "probeStatus",
            sortable: true,
            formatter: function (value, row, index) {
                return getOffOnToText(value);
            },
            searcher: {
                type: "select",
                valueField: "probeValue",
                textField: "probeText",
                data: [
                    {probeValue: "off", probeText: OFF_ON[0]},
                    {probeValue: "on", probeText: OFF_ON[1]}
                ]
            }
        }
    ]
};

function getTotalData (method, params) {
    var sMethod = ( method == "APG" ? "apGroupTotalNumGet" : "apTotalNumGet" );
    var nTotal = 0;
    var oData = {
        cloudModule: "WIPS",
        configType: 1,
        devSN: $scope.sceneInfo.sn, // "210235A1JTB15A000007"
        method: sMethod,
        param: params
    };
    if ( !$scope.isChecked.overall ) {
        oData.param.branchName = $scope.oBranch.cur.name;
    }
    $.ajax({
        async: false,
        type: "POST",
        url: "/v3/ant/confmgr",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(oData),
        success: function (data) {
            nTotal = data.result;
        },
        error: function () {

        }
    });
    return nTotal;
}

$scope.WIPSStatusModalOpts = {
    mId: "WIPSStatus",
    title: getRcText("MODAL_HEADER"),
    autoClose: true,
    showCancel: false,
    modalSize: "normal", // normal、sm、lg
    showHeader: true,
    showFooter: false,
    okHandler: function (modal, $ele) {},
    cancelHandler: function (modal, $ele) {},
    beforeRender: function ($ele) {}
};

var clickCellEvt = ["click-cell.bs.table#APG", "click-cell.bs.table#AP"];

angular.forEach(clickCellEvt, function (value, key, values) {
    $scope.$on(value, function (evt, field, value, row, $ele) {
        if ( field == "wipsStatus" ) {
            $scope.$apply(function () {
                $scope.WIPSStatus = {
                    name: row.apGroupName || row.apName,
                    radio: row.radioMode,
                    phishStatus: getOffOnToText(row.phishStatus),
                    ctmPhishStatus: getOffOnToText(row.ctmPhishStatus),
                    floodStatus: getOffOnToText(row.floodStatus)
                };
            });
            $scope.$broadcast("show#WIPSStatus");
        }
    });
});

var checkEvt = [
    "check.bs.table#APG",
    "uncheck.bs.table#APG",
    "check-all.bs.table#APG",
    "uncheck-all.bs.table#APG",
    "check.bs.table#AP",
    "uncheck.bs.table#AP",
    "check-all.bs.table#AP",
    "uncheck-all.bs.table#AP"
];

angular.forEach(checkEvt, function (value, key, values) {
    $scope.$on(value, function () {
        $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
            $scope.$apply(function () {
                $scope.aCurCheckData = data;
                $scope.modBtnDisable = !$scope.aCurCheckData.length;
            });
        });
    });
});

$scope.modifyWIPSModalOpts = {
    mId: "modifyWIPS",
    title: getRcText("MODAL_HEADER"),
    autoClose: true,
    showCancel: true,
    modalSize: "lg", // normal、sm、lg
    showHeader: true,
    showFooter: true,
    okHandler: function (modal, $ele) {
        var curChoose = $scope.isChecked.APG ? "apGroup" : "ap";
        var sMethod = curChoose + "StatusSet";
        var sName = curChoose + "Name";
        var aSetWIPSData = [];
        var aSetNatData = [];
        var aSetProbeData = [];
        angular.forEach($scope.aCurCheckData, function (value, key, values) {
            var oWIPS = {
                ctmPhishStatus: getBooleanToOffOn($scope.modifyModal.ctmPhishStatus),
                floodStatus: getBooleanToOffOn($scope.modifyModal.floodStatus),
                phishStatus: getBooleanToOffOn($scope.modifyModal.phishStatus),
                radioID: value.radioID + ""
            };
            oWIPS[sName] = value[sName];
            aSetWIPSData.push(oWIPS);

            var oNat = {natDetectStatus: getBooleanToOffOn($scope.modifyModal.natDetectStatus)};
            oNat[sName] = value[sName];
            aSetNatData.push(oNat);

            var oProbe = {
                probeStatus: getBooleanToOffOn($scope.modifyModal.probeStatus),
                radioID: value.radioID + ""
            };
            oProbe[sName] = value[sName];
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
            var sMethod = $scope.isChecked.APG ? "radioGrpConfigure" : "radioConfigure";
            $http
                .post("/v3/ant/confmgr", {
                    cloudModule: "WIPS",
                    configType: 0,
                    devSN: $scope.sceneInfo.sn, // "210235A1JTB15A000007"
                    deviceModule: "WIPS",
                    method: sMethod,
                    param: params
                })
                .success(function (data, status, header, config) {
                    setSuccessFinal("WIPS", data);

                })
                .error(function (data, status, header, config) {
                    $alert.msgDialogError(MSG_INFO[1]);
                });
        }

        function setNatReq(params) {
            var sMethod = $scope.isChecked.APG ? "apGrpEnableNatDetect" : "apEnableNatDetect";
            $http
                .post("/v3/ant/confmgr", {
                    cloudModule: "WIPS",
                    configType: 0,
                    devSN: $scope.sceneInfo.sn, // "210235A1JTB15A000007"
                    deviceModule: "WIPS",
                    method: sMethod,
                    param: params
                })
                .success(function (data, status, header, config) {
                    setSuccessFinal("Nat", data);
                })
                .error(function (data, status, header, config) {
                    $alert.msgDialogError(MSG_INFO[1]);
                });
        }

        function setProbeReq(params) {
            var sMethod = $scope.isChecked.APG ? "apGroupStatusSet" : "apStatusSet";
            $http
                .post("/v3/ant/confmgr", {
                    cloudModule: "PROBE",
                    configType: 0,
                    devSN: $scope.sceneInfo.sn, // "210235A1JTB15A000007"
                    deviceModule: "PROBE",
                    method: sMethod,
                    param: params
                })
                .success(function (data, status, header, config) {
                    setSuccessFinal("Probe", data);
                })
                .error(function (data, status, header, config) {
                    $alert.msgDialogError(MSG_INFO[1]);
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
                $alert.msgDialogSuccess(MSG_INFO[0]);
            } else {
                $alert.msgDialogError(MSG_INFO[1]);
            }

            setSuccess = {
                WIPS: false,
                Nat: false,
                Probe: false,
                time: 0
            };
            $scope.modBtnDisable = true;
            if ($scope.isChecked.APG) {
                $scope.$broadcast("refresh#APG");
            } else {
                $scope.$broadcast("refresh#AP");
            }
        }

        $scope.click = {
            ModifyWIPSBtn: function () {
                $scope.$broadcast('show#modifyWIPS');
            }
        };

    }];
});