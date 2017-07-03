define(["utils"], function (Utils) {
return ["$rootScope", "$scope", "$http", "$state", function  ($rootScope, $scope, $http, $state) {
// Code Start
const MODAL_BTN_TEXT = getRcText("MODAL_BTN_TEXT");
const BRANCH_LIST_HEADER = getRcText("BRANCH_LIST_HEADER");
const APGBYBRANCH_LIST_HEADER = getRcText("APGBYBRANCH_LIST_HEADER");
const APG_LIST_HEADER = getRcText("APG_LIST_HEADER");
const WLSER_LIST_HEADER = getRcText("WLSER_LIST_HEADER");
const WL_SSID_TYPE = getRcText("WL_SSID_TYPE");
const WL_AUTH_TYPE = getRcText("WL_AUTH_TYPE");
const WL_ST_STATUS = getRcText("WL_ST_STATUS");
const AP_LIST_HEADER = getRcText("AP_LIST_HEADER");

function getRcText (attrName) {
    var sText = Utils.getRcString("RC", attrName);
    if ( sText.indexOf(",") == -1 ) {
        return sText;
    }else{
        return sText.split(",");
    }
}


$scope.radioGrp = {
    branch: true,
    APG: false,
    AP: false,
    click: function (radio) {
        if (!$scope.radioGrp[radio]) {
            $.extend($scope.radioGrp, {
                branch: false,
                APG: false,
                AP: false
            });
            $scope.radioGrp[radio] = true;
        }
    }
};

$scope.listOpts = {};
$scope.modalOpts = {};

// Branch List Options
$scope.listOpts.branch = {
    tId: "branch",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    searchable: true,
    columns: [
        {title: BRANCH_LIST_HEADER[0], field: "branchName", sortable: true, searcher: {type: "text"}},
        {
            title: BRANCH_LIST_HEADER[1],
            field: "branchType",
            sortable: true,
            searcher: {
                type: "select",
                valueField: "value",
                textField: "text",
                data: [
                    {value: 0, text: getRcText("BRANCH_TYPE")[0]},
                    {value: 1, text: getRcText("BRANCH_TYPE")[1]},
                    {value: 2, text: getRcText("BRANCH_TYPE")[2]}
                ]
            },
            formatter: function (value, row, index) {
                if (typeof value == "number") {
                    return getRcText("BRANCH_TYPE")[value];
                } else {
                    return "";
                }
            }
        },
        {
            title: BRANCH_LIST_HEADER[2],
            field: "apGroupCount",
            sortable: true,
            searcher: {type: "text"},
            formatter: function (value, row, index) {
                if (value == 0) {
                    return value;
                } else {
                    return '<a class="list-link">' + value + '</a>';
                }
            }
        },
        {
            title: BRANCH_LIST_HEADER[3],
            field: "operation",
            formatter: function(value, row, index){
                return "<a class='list-link'>" +
                            "<i class='fa fa-link'></i>" +
                        "</a>";
            }
        }
    ],
    onClickCell: function (field, value, row, $ele) {
        if (field == "apGroupCount" && value != 0) {
            $scope.$broadcast("show#APGByBranch");
            $scope.$broadcast("refresh#APGByBranch", {
                url: "/v3/apmonitor/getApGroupInfoByBranch?devSN="
                + $scope.sceneInfo.sn + "&branchName=" + row.branchName
            });
        }
        if (field == "operation") {
            $state.go("^.bindbranch7",{
                name: row.branchName
            });
            //{
            //    "state": "scene.content.netdeploy.bindapgroup",
            //    "url": "/bindapgroup/:name",
            //    "templateUrl": "servicebind5/views/bindapgroup.html",
            //    "controller": "servicebind5/controller/bindapgroup",
            //    "dependencies": []
            //},
        }
    }
};

$http
    .get("/v3/apmonitor/getBranchList?devSN=" + $scope.sceneInfo.sn)
    .success(function (data, status, header, config) {
        $scope.$broadcast("load#branch", data.branchList);
    })
    .error(function (data, status, header, config) {

    });

$scope.modalOpts.APGByBranch = {
    mId: "APGByBranch",
    title: getRcText("APGBYBRANCH_LIST_TITLE"),
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.APGByBranch = {
    tId: "APGByBranch",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    apiVersion: "v3",
    searchable: true,
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.totalCount,
            rows: data.apGroupInfoList
        };
    },
    columns: [
        {title: APGBYBRANCH_LIST_HEADER[0], field: "apGroupName", sortable: true, searcher: {type: "text"}},
        {title: APGBYBRANCH_LIST_HEADER[1], field: "description", sortable: true, searcher: {type: "text"}},
        {title: APGBYBRANCH_LIST_HEADER[2], field: "totalApCnt", sortable: true, searcher: {type: "text"}}
    ]
};

// APG List Options
$scope.listOpts.APG = {
    tId: "APG",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    apiVersion: "v3",
    searchable: true,
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    url: "/v3/ssidmonitor/getapgroupbindstcount?devSN=" + $scope.sceneInfo.sn,
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.apGroupTotalCnt,
            rows: data.apgroupList
        };
    },
    columns: [
        {title: APG_LIST_HEADER[0], field: "apGroupName", sortable: true, searcher: {type: "text"}},
        {title: APG_LIST_HEADER[1], field: "apGrpDesc", sortable: true, searcher: {type: "text"}},
        {
            title: APG_LIST_HEADER[2],
            field: "stBindCount",
            sortable: true,
            searcher: {type: "text"},
            formatter: function (value, row, index) {
                if (value == 0) {
                    return value;
                } else {
                    return '<a class="list-link">' + value + '</a>';
                }
            }
        },
        {
            title: APG_LIST_HEADER[3],
            field: "operation",
            formatter: function(value, row, index){
                return "<a class='list-link'>" +
                    "<i class='fa fa-link'></i>" +
                    "</a>";
            }
        }
    ],
    onClickCell: function (field, value, row, $ele) {
        if (field == "stBindCount" && value != 0) {
            $scope.$broadcast("show#WLSerByAPG");

            var sUrl = "/v3/ssidmonitor/getapgroupbindstlist?devSN=" + $scope.sceneInfo.sn
                + "&apGroupName=" + row.apGroupName
                + "&nasId=" + $scope.sceneInfo.nasid
                + "&ownerName=" + $rootScope.userInfo.user;
            var oBody = {
                findoption: {},
                sortoption: {}
            };
            $http
                .post(sUrl, oBody)
                .success(function (data, status, header, config) {
                    $scope.$broadcast("load#WLSerByAPG", data.stList.stBindList);
                })
                .error(function (data, status, header, config) {

                });

        }
        if (field == "operation") {
            $state.go("^.bindapgroup7",{
                name: row.apGroupName
            });
        }
    }
};

$scope.modalOpts.WLSerByAPG = {
    mId: "WLSerByAPG",
    title: getRcText("WLSER_LIST_TITLE"),
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.WLSerByAPG = {
    tId: "WLSerByAPG",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    searchable: true,
    columns: [
        {title: WLSER_LIST_HEADER[0], field: "stName", sortable: true, searcher: {type: "text"}},
        {title: WLSER_LIST_HEADER[1], field: "ssidName", sortable: true,  searcher: {type: "text"}},
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

// AP List Options
$scope.listOpts.AP = {
    tId: "AP",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    apiVersion: "v3",
    searchable: true,
    sidePagination: "server",
    method: "post",
    contentType: "application/json",
    dataType: "json",
    url: "/v3/ssidmonitor/getapbindstcount?devSN=" + $scope.sceneInfo.sn,
    queryParams: function (params) {
        return params;
    },
    responseHandler: function (data) {
        return {
            total: data.apTotalCnt,
            rows: data.apList
        };
    },
    columns: [
        {title: AP_LIST_HEADER[0], field: "apName", sortable: true, searcher: {type: "text"}},
        {
            title: AP_LIST_HEADER[1],
            field: "stBindCount",
            sortable: true,
            searcher: {type: "text"},
            formatter: function (value, row, index) {
                if (value == 0) {
                    return value;
                } else {
                    return '<a class="list-link">' + value + '</a>';
                }
            }
        },
        {
            title: AP_LIST_HEADER[2],
            field: "operation",
            formatter: function(value, row, index){
                return "<a class='list-link'><i class='fa fa-link'></i></a>";
            }
        }
    ],
    onClickCell: function (field, value, row, $ele) {
        if (field == "stBindCount" && value != 0) {
            $scope.$broadcast("show#WLSerByAP");
            var sUrl = "/v3/ssidmonitor/getapbindstlist?devSN=" + $scope.sceneInfo.sn
                + "&apName=" + row.apName
                + "&nasId=" + $scope.sceneInfo.nasid
                + "&ownerName=" + $rootScope.userInfo.user;
            var oBody = {
                findoption: {},
                sortoption: {}
            };
            $http
                .post(sUrl, oBody)
                .success(function (data, status, header, config) {
                    $scope.$broadcast("load#WLSerByAP", data.stList.stBindList);
                })
                .error(function (data, status, header, config) {

                });

        }
        if (field == "operation") {
            $state.go("^.bindap7",{
                name: row.apName
            });
        }
    }
};

$scope.modalOpts.WLSerByAP = {
    mId: "WLSerByAP",
    title: getRcText("WLSER_LIST_TITLE"),
    autoClose: true,
    showCancel: false,
    modalSize: "lg",
    showHeader: true,
    showFooter: true,
    okText: MODAL_BTN_TEXT[0],
    cancelText: MODAL_BTN_TEXT[1],
    okHandler: function(modal, $ele){},
    cancelHandler: function(modal, $ele){},
    beforeRender: function($ele){
        return $ele;
    }
};

$scope.listOpts.WLSerByAP = {
    tId: "WLSerByAP",
    showCheckBox: false,
    showRowNumber: false,
    pageSize: 10,
    showPageList: false,
    searchable: true,
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
                data: [,
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


}];
});