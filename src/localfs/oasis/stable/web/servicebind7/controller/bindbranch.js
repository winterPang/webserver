define(["utils"], function (Utils) {
return [
    "$rootScope", "$scope", "$http", "$stateParams", "$alertService", "$window",
    function  ($rootScope, $scope, $http, $stateParams, $alert, $window) {
// Code Start
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

$scope.curBranchInfo = {
    name: $stateParams.name
};
$scope.bindBtn = {
    disabled: true,
    click: clickBtn
};
$scope.listOpts = {};
$scope.clickReturnBtn = function () {
    $window.history.back();
};

// WLSerByBranch List Options
$scope.listOpts.WLSerByBranch = {
    tId: "WLSerByBranch",
    showCheckBox: true,
    showRowNumber: false,
    toolbar: "#bindBtnGroup",
    pageSize: 10,
    showPageList: false,
    searchable: true,
    method: "get",
    url: "/v3/ssidmonitor/getssidinfobrief?devSN=" + $scope.sceneInfo.sn
        + "&nasId=" + $scope.sceneInfo.nasid
        + "&ownerName=" + $rootScope.userInfo.user,
    responseHandler: function (data) {
        return {
            total: data.ssidTotalCnt,
            rows: data.ssidList
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
    "check.bs.table#WLSerByBranch",
    "uncheck.bs.table#WLSerByBranch",
    "check-all.bs.table#WLSerByBranch",
    "uncheck-all.bs.table#WLSerByBranch"
];

angular.forEach(checkEvt, function (value, key, values) {
    $scope.$on(value, function () {
        $scope.$broadcast("getSelections#WLSerByBranch", function (data) {
            $scope.$apply(function () {
                $scope.curBranchInfo.checkData = data;
                $scope.bindBtn.disabled = !$scope.curBranchInfo.checkData.length;
            });
        });
    });
});


function clickBtn (btn, checkData) {
    var sMethod = (btn == "bind" ? "SSIDBindByAPGroup" : "SSIDUnbindByAPGroup");
    var oMsgText = (btn == "bind" ? BIND_INFO : UNBIND_INFO);
    var oParam = {
        branchList: $stateParams.name,
        stNameList: []
    };
    angular.forEach(checkData, function (value, key, values) {
        this.push(value.stName);
    }, oParam.stNameList);

    $http
        .post("/v3/ant/confmgr", {
            devSN: $scope.sceneInfo.sn,
            configType: 0,
            deviceModule: "stamgr",
            cloudModule: "stamgr",
            policy: "cloudFirst",
            method: sMethod,
            param: oParam
        })
        .success(function (data, status, header, config) {
            if(data.result == "success") {
                $alert.msgDialogSuccess(oMsgText[0]);
                $scope.$broadcast("refresh#WLSerByBranch");
                $scope.bindBtn.disabled = true;
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