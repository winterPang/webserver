;(function ($) {

var MODULE_BASE = "hq_wlanconfig";
var MODULE_NAME = MODULE_BASE + "." + "index_stbind";
var MODULE_RC = "stBind_rc";

var g_nPageSize_10 = 10;

var g_APGroupByWhichBranch = "";
var g_WLSerByWhichAPGroup = "";
var g_WLSerByWhichAP = "";



function getRcText(sRcName) {
    return Utils.Base.getRcString(MODULE_RC, sRcName);
}

function BoolToNum (bBool) {
    return ( bBool == false ? 1 : -1 );
}

function getDataFail() {
    Frame.Msg.info(getRcText("MSG_INFO_ERROR"), "error");
}

// 给关闭按钮绑定关闭弹窗事件
function bindCloseDlgEvent(sDlgId) {
    $(sDlgId).on("click", "#closeDlgBtn", function (e) {
        Utils.Pages.closeWindow( Utils.Pages.getWindow( $(sDlgId) ) );
    });
}

// 分支总表
function initBranch_List() {
    // 格式化 - apGroupNum
    function apGroupCntFormat (row, cell, value, columnDef, dataContext, type) {
        if( type == "text" || (type == "html" && value == 0) ) {
            return value;
        }else{
            return "<a class='list-link' name='" + columnDef.field
                + "' branchname='" + dataContext.BranchName + "'>"
                + value + "</a>";
        }
    }
    // 格式化 - 操作"
    function operationFormat (row, cell, value, columnDef, dataContext, type) {
        if(type == "text") {
            return getRcText("OPERATION");
        }
        if(type == "html") {
            return "<a class='list-link' name='" +
            columnDef.field
            + "' branchname='" + dataContext.BranchName
            + "'><i class='fa fa-link' style='font-size: 20px'></i></a>";
        }
    }

    var oListOpts = {
        colNames: getRcText("BRANCH_LIST_HEADER"),
        pageSize: g_nPageSize_10,
        showHeader: true,
        multiSelect: false,
        showOperation: false,
        asyncPaging: false,
        colModel: [
            { name: "BranchName", datatype: "String"},
            { name: "branchType", datatype: "String"},
            { name: "apGroupCount", datatype:"String", formatter: apGroupCntFormat},
            { name: "operation", datatype:"String", formatter: operationFormat}
        ]
    };
    $("#branch_List").SList("head", oListOpts);
}

function getBranchList_Data() {

    function getSucc (data) {
        var aData = [];
        $.each(data.branchList, function (index, ele) {
            aData.push({
                BranchName: ele.branchName,
                branchType: getRcText("BRANCH_TYPE").split(",")[parseInt(ele.branchType)],
                apGroupCount: ele.apGroupCount
            });
        });
        $("#branch_List").SList("refresh", aData);
    }

    function getFail() {
        getDataFail();
    }
        
    var oSendOpts={
        type: "GET",
        url: MyConfig.path
            + "/apmonitor/getBranchList?devSN="
            + FrameInfo.ACSN,
        dataType: "json",
        contentType: "application/json",
        onSuccess: getSucc,
        onFailed: getFail
    } 
    Utils.Request.sendRequest(oSendOpts);
}

// 基于分支的APGroup列表
function initAPGroupByBranch_List() {

    var oListOpts = {
        colNames: getRcText("APGROUP_BYBRANCH_LIST_HEADER"),
        pageSize: g_nPageSize_10,
        showHeader: true,
        multiSelect: false,
        showOperation: false,
        asyncPaging: true,
        colModel: [
            { name: "apGroupName", datatype: "String"},
            { name: "description", datatype: "String"},
            { name: "totalApCnt", datatype:"String"}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {
            var oParam = {
                skipnum: (pageNum - 1) * pageSize,
                limitnum: pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };
            if( oFilter ) { // 无任何筛选条件时，null
                oParam.body.findoption = oFilter;
            }   
            if( oSorter ) { // 无任何筛选条件时，null
                oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
            }
            sendAPGroupByBranchAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {
            var oParam = {
                skipnum: 0,
                limitnum: g_nPageSize_10,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };
            if( oFilter ) { // 无任何筛选条件时，null
                oParam.body.findoption = oFilter;
            }
            if( oSorter ) {
                oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
            }
            sendAPGroupByBranchAjax(1, oParam);
        },
        onSort:function (sName, isDesc) {
            var oParam = {
                skipnum: 0,
                limitnum: g_nPageSize_10,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = BoolToNum( isDesc );
            sendAPGroupByBranchAjax(1, oParam);
        }
    };

    $("#APGroupByBranch_List").SList("head", oListOpts);
}

function sendAPGroupByBranchAjax (nPageNum, oParam) {

    function getSucc (data) {
        $("#APGroupByBranch_List").SList("refresh", {
            total: data.totalCount,
            pageNum: nPageNum,
            data: data.apGroupInfoList
        });
    }

    function getFail() {
        getDataFail();
    }

    var oSendOpts={
        type: "POST",
        url: MyConfig.path
            + "/apmonitor/getApGroupInfoByBranch?devSN=" + FrameInfo.ACSN
            + "&branchName=" + g_APGroupByWhichBranch
            + "&skipnum=" + oParam.skipnum
            + "&limitnum=" + oParam.limitnum,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(oParam.body),
        onSuccess: getSucc,
        onFailed: getFail
    } 

    Utils.Request.sendRequest(oSendOpts);
}

// APGroup总表
function initAPGroup_List() {

    function stCountFormat (row, cell, value, columnDef, dataContext, type) {
        if( type == "text" || (type == "html" && value == 0) ) {
            return value;
        }else{
            return "<a class='list-link' name='" + columnDef.field
                + "' apgroupname='" + dataContext.apGroupName + "'>"
                + value + "</a>";
        }
    }

    function operationFormat (row, cell, value, columnDef, dataContext, type) {
        if(type == "text") {
            return getRcText("OPERATION");
        }
        if(type == "html") {
            return "<a class='list-link' name='" +
            columnDef.field
            + "' apgroupname='" + dataContext.apGroupName
            + "'><i class='fa fa-link' style='font-size: 20px'></i></a>";
        }
    }

    var oListOpts = {
        colNames: getRcText("APGROUP_LIST_HEADER"),
        pageSize: g_nPageSize_10,
        showHeader: true,
        multiSelect: false,
        showOperation: false,
        asyncPaging: true,
        colModel: [
            { name: "apGroupName", datatype: "String"},
            { name: "apGrpDesc", datatype: "String"},
            { name: "stBindCount", datatype:"String", formatter: stCountFormat},
            { name: "operation", datatype:"String", formatter: operationFormat}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {
            var oParam = {
                skipnum: (pageNum - 1) * pageSize,
                limitnum: pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };
            if( oFilter ) { // 无任何筛选条件时，null
                oParam.body.findoption = oFilter;
            }   
            if( oSorter ) { // 无任何筛选条件时，null
                oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
            }
            sendAPGroupAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {
            var oParam = {
                skipnum: 0,
                limitnum: g_nPageSize_10,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };
            if( oFilter ) { // 无任何筛选条件时，null
                oParam.body.findoption = oFilter;
            }
            if( oSorter ) {
                oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
            }
            sendAPGroupAjax(1, oParam);
        },
        onSort:function (sName, isDesc) {
            var oParam = {
                skipnum: 0,
                limitnum: g_nPageSize_10,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = BoolToNum( isDesc );
            sendAPGroupAjax(1, oParam);
        }
    };

    $("#APGroup_List").SList("head", oListOpts);
}

function sendAPGroupAjax (nPageNum, oParam) {

    function getSucc (data) {

        $("#APGroup_List").SList("refresh", {
            total: data.apGroupTotalCnt,
            pageNum: nPageNum,
            data: data.apgroupList
        });
    }

    function getFail() {
        getDataFail();
    }

    var oSendOpts={
        type: "POST",
        url: MyConfig.path
            + "/ssidmonitor/getapgroupbindstcount?devSN=" + FrameInfo.ACSN
            + "&skipnum=" + oParam.skipnum
            + "&limitnum=" + oParam.limitnum,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(oParam.body),
        onSuccess: getSucc,
        onFailed: getFail
    } 

    Utils.Request.sendRequest(oSendOpts);
}

function getAPGroupList_Data() {

    sendAPGroupAjax(1, {
        limitnum: g_nPageSize_10, 
        skipnum: 0, 
        body: {findoption: {}, sortoption: {}}
    });
}

// 基于APGroup的无线服务列表(已绑定)
function initWLSerByAPGroup_List() {

    var oListOpts = {
        colNames: getRcText("WLSER_LIST_HEADER"),
        pageSize: g_nPageSize_10,
        showHeader: true,
        multiSelect: false,
        showOperation: false,
        asyncPaging: false,
        colModel: [
            { name: "stName", datatype: "String"},
            { name: "ssidName", datatype: "String"},
            { name: "description", datatype: "Order", data: getRcText("WL_ST_TYPE")},
            { name: "lvzhouAuthMode", datatype: "Order", data: getRcText("WL_AUTH_TYPE")},
            { name: "status", datatype: "Order", data: getRcText("WL_ST_STATUS")}
        ]
        // ,
        // onPageChange: function (pageNum, pageSize, oFilter, oSorter) {
        //     var oParam = {
        //         skipnum: (pageNum - 1) * pageSize,
        //         limitnum: pageSize,
        //         body : {
        //             findoption: {},
        //             sortoption: {}
        //         }
        //     };
        //     if( oFilter ) { // 无任何筛选条件时，null
        //         oParam.body.findoption = oFilter;
        //     }   
        //     if( oSorter ) { // 无任何筛选条件时，null
        //         oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
        //     }
        //     sendWLSerByAPGroupAjax(pageNum, oParam);
        // },
        // onSearch: function (oFilter, oSorter) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_10,
        //         body : {
        //             findoption: {},
        //             sortoption: {}
        //         }
        //     };
        //     if( oFilter ) { // 无任何筛选条件时，null
        //         oParam.body.findoption = oFilter;
        //     }
        //     if( oSorter ) {
        //         oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
        //     }
        //     sendWLSerByAPGroupAjax(1, oParam);
        // },
        // onSort:function (sName, isDesc) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_10,
        //         body: { sortoption: { } }
        //     };
        //     oParam.body.sortoption[sName] = BoolToNum( isDesc );
        //     sendWLSerByAPGroupAjax(1, oParam);
        // }
    };

    $("#WLSerByAPGroup_List").SList("head", oListOpts);
}

function sendWLSerByAPGroupAjax (nPageNum, oParam) {

    function getSucc (data) {

        var aData = [];
        $.each(data.stList.stBindList, function (index, ele) {
            aData.push({
                stName: ele.stName,
                ssidName: ele.ssidName,
                description: ele.description,
                lvzhouAuthMode: ele.lvzhouAuthMode,
                status: ele.status - 1
            });
        });
        $("#WLSerByAPGroup_List").SList("refresh", aData
        // {
        //     total: data.stList.bindTotalCnt,
        //     pageNum: nPageNum,
        //     data: aData
        // }
        );
    }

    function getFail() {
        getDataFail();
    }

    var oSendOpts={
        type: "POST",
        url: MyConfig.path
            + "/ssidmonitor/getapgroupbindstlist?devSN=" + FrameInfo.ACSN
            + "&apGroupName=" + g_WLSerByWhichAPGroup
            // + "&skipnum=" + oParam.skipnum
            // + "&limitnum=" + oParam.limitnum
            + "&shopName=" + Utils.Device.deviceInfo.shop_name
            + "&ownerName=" + FrameInfo.g_user.user,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(oParam.body),
        onSuccess: getSucc,
        onFailed: getFail
    } 

    Utils.Request.sendRequest(oSendOpts);
}

// AP总表
function initAP_List() {
    
    function stCountFormat (row, cell, value, columnDef, dataContext, type) {
        if( type == "text" || (type == "html" && value == 0) ) {
            return value;
        }else{
            return "<a class='list-link' name='" + columnDef.field
                + "' apname='" + dataContext.apName + "'>"
                + value + "</a>";
        }
    }

    function operationFormat (row, cell, value, columnDef, dataContext, type) {
        if(type == "text") {
            return getRcText("OPERATION");
        }
        if(type == "html") {
            return "<a class='list-link' name='" +
            columnDef.field
            + "' apname='" + dataContext.apName
            + "'><i class='fa fa-link' style='font-size: 20px'></i></a>";
        }
    }

    var oListOpts = {
        colNames: getRcText("AP_LIST_HEADER"),
        pageSize: g_nPageSize_10,
        showHeader: true,
        multiSelect: false,
        showOperation: false,
        asyncPaging: true,
        colModel: [
            { name: "apName", datatype: "String"},
            { name: "stBindCount", datatype:"String", formatter: stCountFormat},
            { name: "operation", datatype:"String", formatter: operationFormat}
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {
            var oParam = {
                skipnum: (pageNum - 1) * pageSize,
                limitnum: pageSize,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };
            if( oFilter ) { // 无任何筛选条件时，null
                oParam.body.findoption = oFilter;
            }   
            if( oSorter ) { // 无任何筛选条件时，null
                oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
            }
            sendAPAjax(pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {
            var oParam = {
                skipnum: 0,
                limitnum: g_nPageSize_10,
                body : {
                    findoption: {},
                    sortoption: {}
                }
            };
            if( oFilter ) { // 无任何筛选条件时，null
                oParam.body.findoption = oFilter;
            }
            if( oSorter ) {
                oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
            }
            sendAPAjax(1, oParam);
        },
        onSort:function (sName, isDesc) {
            var oParam = {
                skipnum: 0,
                limitnum: g_nPageSize_10,
                body: { sortoption: { } }
            };
            oParam.body.sortoption[sName] = BoolToNum( isDesc );
            sendAPAjax(1, oParam);
        }
    };

    $("#AP_List").SList("head", oListOpts);
}

function sendAPAjax (nPageNum, oParam) {

    function getSucc (data) {
        $("#AP_List").SList("refresh", {
            total: data.apTotalCnt,
            pageNum: nPageNum,
            data: data.apList
        });
    }

    function getFail() {
        getDataFail();
    }

    var oSendOpts={
        type: "POST",
        url: MyConfig.path
            + "/ssidmonitor/getapbindstcount?devSN=" + FrameInfo.ACSN
            + "&skipnum=" + oParam.skipnum
            + "&limitnum=" + oParam.limitnum,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(oParam.body),
        onSuccess: getSucc,
        onFailed: getFail
    } 

    Utils.Request.sendRequest(oSendOpts);
}

function getAPList_Data() {
    sendAPAjax(1, {
        limitnum: g_nPageSize_10, 
        skipnum: 0, 
        body: {findoption: {}, sortoption: {}}
    });
}

// 基于AP的无线服务列表(已绑定)
function initWLSerByAP_List() {

    var oListOpts = {
        colNames: getRcText("WLSER_LIST_HEADER"),
        pageSize: g_nPageSize_10,
        showHeader: true,
        multiSelect: false,
        showOperation: false,
        asyncPaging: false,
        colModel: [
            { name: "stName", datatype: "String"},
            { name: "ssidName", datatype: "String"},
            { name: "description", datatype: "Order", data: getRcText("WL_ST_TYPE")},
            { name: "lvzhouAuthMode", datatype: "Order", data: getRcText("WL_AUTH_TYPE")},
            { name: "status", datatype: "Order", data: getRcText("WL_ST_STATUS")}
        ]
        // ,
        // onPageChange: function (pageNum, pageSize, oFilter, oSorter) {
        //     var oParam = {
        //         skipnum: (pageNum - 1) * pageSize,
        //         limitnum: pageSize,
        //         body : {
        //             findoption: {},
        //             sortoption: {}
        //         }
        //     };
        //     if( oFilter ) { // 无任何筛选条件时，null
        //         oParam.body.findoption = oFilter;
        //     }   
        //     if( oSorter ) { // 无任何筛选条件时，null
        //         oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
        //     }
        //     sendWLSerByAPAjax(pageNum, oParam);
        // },
        // onSearch: function (oFilter, oSorter) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_10,
        //         body : {
        //             findoption: {},
        //             sortoption: {}
        //         }
        //     };
        //     if( oFilter ) { // 无任何筛选条件时，null
        //         oParam.body.findoption = oFilter;
        //     }
        //     if( oSorter ) {
        //         oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
        //     }
        //     sendWLSerByAPAjax(1, oParam);
        // },
        // onSort:function (sName, isDesc) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_10,
        //         body: { sortoption: { } }
        //     };
        //     oParam.body.sortoption[sName] = BoolToNum( isDesc );
        //     sendWLSerByAPAjax(1, oParam);
        // }
    };

    $("#WLSerByAP_List").SList("head", oListOpts);
}

function sendWLSerByAPAjax(nPageNum, oParam) {

    function getSucc (data) {

        var aData = [];
        $.each(data.stList.stBindList, function (index, ele) {
            aData.push({
                stName: ele.stName,
                ssidName: ele.ssidName,
                description: ele.description,
                lvzhouAuthMode: ele.lvzhouAuthMode,
                status: ele.status - 1
            });
        });
        $("#WLSerByAP_List").SList("refresh", aData
        // {
        //     total: data.stList.stBindTotalCnt,
        //     pageNum: nPageNum,
        //     data: aData
        // }
        );
    }

    function getFail() {
        getDataFail();
    }

    var oSendOpts={
        type: "POST",
        url: MyConfig.path
            + "/ssidmonitor/getapbindstlist?devSN=" + FrameInfo.ACSN
            + "&apName=" + g_WLSerByWhichAP
            // + "&skipnum=" + oParam.skipnum
            // + "&limitnum=" + oParam.limitnum
            + "&shopName=" + Utils.Device.deviceInfo.shop_name
            + "&ownerName=" + FrameInfo.g_user.user,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(oParam.body),
        onSuccess: getSucc,
        onFailed: getFail
    } 

    Utils.Request.sendRequest(oSendOpts);
}


function initGrid() {
    initBranch_List();
    initAPGroup_List();
    initAP_List();

    initAPGroupByBranch_List();
    initWLSerByAPGroup_List();
    initWLSerByAP_List();
}

function initForm() {
    // 点击radioGroup切换分支、ap组、ap的无线服务列表
    $("#list_RadioGroup").on("click", "input[type='radio']", function (e) {
        var sShowListName = $(this).attr("id").split("_")[0];
        $("#STBind_Lists [class*='simple-list']").addClass("hide");
        $("#" + sShowListName + "_List").removeClass("hide").SList("resize");
    });
    // 分支总表 - 点击apGroupCount
    $("#branch_List").on("click", "[name='apGroupCount']", function (e) {
        Utils.Base.openDlg(null, {}, {scope:$("#APGroupByBranch_Dlg"), className:"modal-super"});
        $("#APGroupByBranch_List").SList("resize");
        bindCloseDlgEvent("#APGroupByBranch_Dlg");
        g_APGroupByWhichBranch = $(this).attr("branchname");

        sendAPGroupByBranchAjax(1, {
            limitnum: g_nPageSize_10, 
            skipnum: 0, 
            body: {findoption: {}, sortoption: {}}
        });
    });
    // 分支总表 - 点击"操作"，跳转页面
    $("#branch_List").on("click", "[name='operation']", function (e) {
        var oUrlPara = {
            np: MODULE_BASE + "." + "j_bindbranch",
            curBranch: encodeURI( $(this).attr("branchname") ), 
            apName: "", 
            apSN: "",
            radioId: ""            
        };
        Utils.Base.redirect(oUrlPara);
    });
    // APGroup总表 - 点击stCount
    $("#APGroup_List").on("click", "[name='stBindCount']", function (e) {
        Utils.Base.openDlg(null, {}, {scope:$("#WLSerByAPGroup_Dlg"), className:"modal-super"});
        $("#WLSerByAPGroup_List").SList("resize");
        bindCloseDlgEvent("#WLSerByAPGroup_Dlg");
        g_WLSerByWhichAPGroup = $(this).attr("apgroupname");

        sendWLSerByAPGroupAjax(1, {
            limitnum: g_nPageSize_10, 
            skipnum: 0, 
            body: {findoption: {}, sortoption: {}}
        });
    });
    // APGroup总表 - 点击"操作"，跳转页面
    $("#APGroup_List").on("click", "[name='operation']", function (e) {
        var oUrlPara = {
            np: MODULE_BASE + "." + "j_bindapgroup",
            curAPGroup: encodeURI( $(this).attr("apgroupname") )            
        };
        Utils.Base.redirect(oUrlPara);
    });
    // AP总表 - 点击stCount
    $("#AP_List").on("click", "[name='stBindCount']", function (e) {
        Utils.Base.openDlg(null, {}, {scope:$("#WLSerByAP_Dlg"), className:"modal-super"});
        $("#WLSerByAP_List").SList("resize");
        bindCloseDlgEvent("#WLSerByAP_Dlg");
        g_WLSerByWhichAP = $(this).attr("apname");

        sendWLSerByAPAjax(1, {
            limitnum: g_nPageSize_10,
            skipnum: 0,
            body: {findoption: {}, sortoption: {}}
        });
    });
    // AP总表 - 点击"操作"，跳转页面
    $("#AP_List").on("click", "[name='operation']", function (e) {
        var oUrlPara = {
            np: MODULE_BASE + "." + "j_bindap",
            curAP: encodeURI( $(this).attr("apname") )            
        };
        Utils.Base.redirect(oUrlPara);
    });

}

function initData() {
    getBranchList_Data();
    getAPGroupList_Data();
    getAPList_Data();
    $("[class*='fa fa-link']").css({
        color: "red",
        fontSize: "20px"
    })
}

function _init() {
    initGrid();
    initForm();
    initData();
}

function _resize (jParent) {}

function _destroy() {
    Utils.Request.clearMoudleAjax(MODULE_NAME);
}

Utils.Pages.regModule(MODULE_NAME, {
    "init": _init,
    "resize": _resize,
    "destroy": _destroy,
    "widgets": ["SList", "Form", "Minput"],
    "utils": ["Base","Device", "Request"]
});

})(jQuery);