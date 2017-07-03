define(["utils"], function (Utils) {
return [
    "$rootScope", "$scope", "$http", "$stateParams", "$alertService", "$window",
    function  ($rootScope, $scope, $http, $stateParams, $alert, $window) {
// Code Start
var g_aModelList;

const WLSER_LIST_HEADER = getRcText("WLSER_LIST_HEADER");
const WL_SSID_TYPE = getRcText("WL_SSID_TYPE");
const WL_AUTH_TYPE = getRcText("WL_AUTH_TYPE");
const WL_ST_STATUS = getRcText("WL_ST_STATUS");
const BIND_INFO = getRcText("BIND_INFO");
const UNBIND_INFO = getRcText("UNBIND_INFO");

function getRcText (attrName) {
            var sText = Utils.getRcString("RC", attrName);
            if ( sText.indexOf(",") == -1 ) {
                return sText;
            }else{
                return sText.split(",");
            }
        }

$scope.curAPGInfo = {
    name: $stateParams.name,
    modelList: []
};
$scope.btn = {
    unbindDisabled: true,
    bindDisabled: true,
    click: clickBtn
};
$scope.listOpts = {};
$scope.clickReturnBtn = function () {
    $window.history.back();
};

// WLSerByAPG List Options
$scope.listOpts.WLSerByAPG = {
    tId: "WLSerByAPG",
    showCheckBox: true,
    showRowNumber: false,
    toolbar: "#unbindBtnDiv",
    pageSize: 10,
    showPageList: false,
    searchable: true,
    method: "post",
    contentType: "application/json",
    dataType: "json",
    url: "/v3/ssidmonitor/getapgroupbindstlist?devSN=" + $scope.sceneInfo.sn
        + "&apGroupName=" + $scope.curAPGInfo.name
        + "&nasId=" + $scope.sceneInfo.nasid
        + "&ownerName=" + $rootScope.userInfo.user,
    queryParams: function (params) {
        return {findoption: {}, sortoption: {}};
    },
    responseHandler: function (data) {
        var oModelList = data.modelList;
        for (var i = 0; i < oModelList.length; i ++) {
            var radioNum = oModelList[i].radioNum;
            var apModelName = oModelList[i].model;
            for (var j = 0; j < radioNum; j ++) {
                $scope.curAPGInfo.modelList.push({
                    apModelName: apModelName,
                    radioId: j + 1
                });
            }
        }
        return {
            total: data.stList.bindTotalCnt,
            rows: data.stList.stBindList
        };
    },
    columns: [
        {title: WLSER_LIST_HEADER[0], field: "stName", sortable: true, searcher: {type: "text"}},
        {title: WLSER_LIST_HEADER[1], field: "ssidName", sortable: true, searcher: {type: "text"}},
        {
            title: WLSER_LIST_HEADER[2],
            field: "description",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: "0", text: WL_SSID_TYPE[0]},
                    {value: "1", text: WL_SSID_TYPE[1]}
                ]
            },
            formatter: function (value, row, index) {
                if (typeof value == "string") {
                    return WL_SSID_TYPE[value];
                } else {
                    return "";
                }
            }
        },
        {
            title: WLSER_LIST_HEADER[3],
            field: "lvzhouAuthMode",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: 0, text: WL_AUTH_TYPE[1]},
                    {value: 1, text: WL_AUTH_TYPE[2]},
                    {value: 2, text: WL_AUTH_TYPE[3]}
                ]
            },
            formatter: function (value, row, index) {
                if (value == -1) {
                    return "";
                } else if(value>=0 && value <= 2 ) {
                    return WL_AUTH_TYPE[value + 1];
                } else {
                    return "";
                }
            }
        },
        {
            title: WLSER_LIST_HEADER[4],
            field: "status",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: 1, text: WL_ST_STATUS[0]},
                    {value: 2, text: WL_ST_STATUS[1]}
                ]
            },
            formatter: function (value, row, index) {
                if (typeof value == "number") {
                    return WL_ST_STATUS[value - 1];
                } else {
                    return "";
                }
            }
        }
    ]
};

// OWLSerByAPG List Options
$scope.listOpts.OWLSerByAPG = {
    tId: "OWLSerByAPG",
    showCheckBox: true,
    showRowNumber: false,
    toolbar: "#bindBtnDiv",
    pageSize: 10,
    showPageList: false,
    searchable: true,
    method: "post",
    contentType: "application/json",
    dataType: "json",
    url: "/v3/ssidmonitor/getapgroupbindstlist?devSN=" + $scope.sceneInfo.sn
        + "&apGroupName=" + $scope.curAPGInfo.name
        + "&nasId=" + $scope.sceneInfo.nasid
        + "&ownerName=" + $rootScope.userInfo.user,
    queryParams: function (params) {
        return {findoption: {}, sortoption: {}};
    },
    responseHandler: function (data) {
        return {
            total: data.stList.unbindTotalCnt,
            rows: data.stList.stUnBindList
        };
    },
    columns: [
        {title: WLSER_LIST_HEADER[0], field: "stName", sortable: true, searcher: {type: "text"}},
        {title: WLSER_LIST_HEADER[1], field: "ssidName", sortable: true, searcher: {type: "text"}},
        {
            title: WLSER_LIST_HEADER[2],
            field: "description",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: "0", text: WL_SSID_TYPE[0]},
                    {value: "1", text: WL_SSID_TYPE[1]}
                ]
            },
            formatter: function (value, row, index) {
                if (typeof value == "string") {
                    return WL_SSID_TYPE[value];
                } else {
                    return "";
                }
            }
        },
        {
            title: WLSER_LIST_HEADER[3],
            field: "lvzhouAuthMode",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: 0, text: WL_AUTH_TYPE[1]},
                    {value: 1, text: WL_AUTH_TYPE[2]},
                    {value: 2, text: WL_AUTH_TYPE[3]}
                ]
            },
            formatter: function (value, row, index) {
                if (value == -1) {
                    return "";
                } else if(value>=0 && value <= 2 ) {
                    return WL_AUTH_TYPE[value + 1];
                } else {
                    return "";
                }
            }
        },
        {
            title: WLSER_LIST_HEADER[4],
            field: "status",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: 1, text: WL_ST_STATUS[0]},
                    {value: 2, text: WL_ST_STATUS[1]}
                ]
            },
            formatter: function (value, row, index) {
                if (typeof value == "number") {
                    return WL_ST_STATUS[value - 1];
                } else {
                    return "";
                }
            }
        }
    ]
};

var checkEvt = [
    "check.bs.table#WLSerByAPG",
    "uncheck.bs.table#WLSerByAPG",
    "check-all.bs.table#WLSerByAPG",
    "uncheck-all.bs.table#WLSerByAPG",
    "check.bs.table#OWLSerByAPG",
    "uncheck.bs.table#OWLSerByAPG",
    "check-all.bs.table#OWLSerByAPG",
    "uncheck-all.bs.table#OWLSerByAPG"
];

angular.forEach(checkEvt, function (value, key, values) {
    $scope.$on(value, function () {
        $scope.$broadcast("getSelections#" + value.split("#")[1], function (data) {
            $scope.$apply(function () {
                if (value.split("#")[1] == "WLSerByAPG") {
                    $scope.curAPGInfo.checkBindData = data;
                    $scope.btn.unbindDisabled = !$scope.curAPGInfo.checkBindData.length;
                }
                if (value.split("#")[1] == "OWLSerByAPG") {
                    $scope.curAPGInfo.checkUnbindData = data;
                    $scope.btn.bindDisabled = !$scope.curAPGInfo.checkUnbindData.length;
                }
            });
        });
    });
});

function clickBtn (btn, checkData) {
    var sMethod = (btn == "unbind" ? "SSIDUnbindByAPGroup" : "SSIDBindByAPGroup");
    var oMsgText = (btn == "bind" ? BIND_INFO : UNBIND_INFO);
    var aParam = [];
    for (var i = 0; i < checkData.length; i ++) {
        var stName = checkData[i].stName;
        for (var j = 0; j < $scope.curAPGInfo.modelList.length; j ++) {
            aParam.push({
                apGroupName: $scope.curAPGInfo.name,
                apModelName: $scope.curAPGInfo.modelList[j].apModelName,
                radioId: $scope.curAPGInfo.modelList[j].radioId,
                stName: stName
            });
        }
    }

    $http
        .post("/v3/ant/confmgr", {
            devSN: $scope.sceneInfo.sn,
            configType: 0,
            deviceModule: "stamgr",
            cloudModule: "stamgr",
            policy: "cloudFirst",
            method: sMethod,
            param: aParam
        })
        .success(function (data, status, header, config) {
            if(data.result == "success") {
                $alert.msgDialogSuccess(oMsgText[0]);
                $scope.$broadcast("refresh#WLSerByAPG");
                $scope.$broadcast("refresh#OWLSerByAPG");
                $scope.btn.bindDisabled = true;
                $scope.btn.unbindDisabled = true;
            }else{
                $alert.msgDialogError(oMsgText[1]);
            }
        })
        .error(function (data, status, header, config) {
            $alert.msgDialogError(oMsgText[1]);
        });
}


}];
});