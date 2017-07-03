;(function ($) {

var MODULE_BASE = "hq_wlanconfig";
var MODULE_NAME = MODULE_BASE + "." + "j_bindbranch";
var MODULE_RC = "bindBranch_rc";

var g_WLSerByWhichBranch = "";
var g_nPageSize_10 = 10;
    
function getRcText (sRcName) {
    return Utils.Base.getRcString(MODULE_RC, sRcName);
}

function BoolToNum (bBool) {
    return ( bBool == false ? 1 : -1 );
}

function initGrid() {

    function onBindBtnClick(param) {

        function getSucc (data) {
            if(data.result == "success") {
                Utils.Base.refreshCurPage();
                Frame.Msg.info("绑定成功","ok");
            }else{
                Frame.Msg.info(data.reason,"error");
            }
        }

        function getFail() {
            getDataFail();
        }

        var oParam = {
            branchList: [g_WLSerByWhichBranch],
            stNameList: []
        };

        $.each(param, function (index, ele) {
            oParam.stNameList.push(ele.stName);
        });


        var oSendOpts={
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                deviceModule: "stamgr",
                cloudModule: "stamgr",
                policy: "cloudFirst",
                method: "SSIDBindByAPGroup",
                param: oParam
            }),
            onSuccess: getSucc,
            onFailed: getFail
        } 

        Utils.Request.sendRequest(oSendOpts);

    }

    function onUnbindBtnClick(param) {

        function getSucc (data) {
            if(data.result == "success") {
                Frame.Msg.info("解除绑定成功","ok");
                Utils.Base.refreshCurPage();
            }else{
                Frame.Msg.info(data.reason,"error");
            }
        }

        function getFail() {
            getDataFail();
        }

        var oParam = {
            branchList: [g_WLSerByWhichBranch],
            stNameList: []
        };

        $.each(param, function (index, ele) {
            oParam.stNameList.push(ele.stName);
        });


        var oSendOpts={
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                deviceModule: "stamgr",
                cloudModule: "stamgr",
                policy: "cloudFirst",
                method: "SSIDUnbindByAPGroup",
                param: oParam
            }),
            onSuccess: getSucc,
            onFailed: getFail
        } 

        Utils.Request.sendRequest(oSendOpts);
    }

	var oListOpts = {
        showHeader: true,
        multiSelect: true,
        showOperation: false,
        asyncPaging: false,
        pageSize: g_nPageSize_10,
        colNames: getRcText("WLSER_BYBRANCH_LIST_HEADER"),
        colModel: [
            { name: "stName", datatype: "String"},
            { name: "ssidName", datatype: "String"},
            { name: "description", datatype: "Order", data: getRcText("WL_ST_TYPE")},
            { name: "lvzhouAuthMode", datatype: "Order", data: getRcText("WL_AUTH_TYPE")},
            { name: "status", datatype: "Order", data: getRcText("WL_ST_STATUS")}
        ],    
        buttons: [
            {
                name: "bind",
                value: getRcText("BIND_BTN"),
                enable: ">0",
                action: onBindBtnClick
            },
            {
                name: "unbind",
                value: getRcText("UNBIND_BTN"),
                enable: ">0",
                action: onUnbindBtnClick
            }
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
        //     sendWLSerByBranchAjax(pageNum, oParam);
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
        //         var oFilt = {};
        //         $.each(oFilter, function (index, ele) {
        //             if(index == "status") {
        //                 oFilt.status = parseInt(ele) +  1;
        //             }else{
        //                 oFilt[index] = ele;
        //             }
        //         });
        //         oParam.body.findoption = oFilt;
        //     }
        //     if( oSorter ) {
        //         oParam.body.sortoption[oSorter.name] = BoolToNum( oSorter.isDesc );
        //     }
        //     sendWLSerByBranchAjax(1, oParam);
        // },
        // onSort:function (sName, isDesc) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_10,
        //         body: { sortoption: { } }
        //     };
        //     oParam.body.sortoption[sName] = BoolToNum( isDesc );
        //     sendWLSerByBranchAjax(1, oParam);
        // }
    };

    $("#WLSerByBranch_List").SList("head", oListOpts);
}

function sendWLSerByBranchAjax (nPageNum, oParam) {

    function getSucc (data) {

        var aData = [];
        $.each(data.ssidList, function (index, ele) {
            aData.push({
                stName: ele.stName,
                ssidName: ele.ssidName,
                description: ele.description,
                lvzhouAuthMode: ele.lvzhouAuthMode,
                status: ele.status - 1
            });
        });

        $("#WLSerByBranch_List").SList("refresh", aData
        // {
        //     total: data.ssidTotalCnt,
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
            + "/ssidmonitor/getssidinfobrief?devSN=" + FrameInfo.ACSN
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

function initForm(){
    $("#return").click(function () {
        var oUrlPara = {
            np: "hq_wlanconfig.index_stbind",                      
        };
        Utils.Base.redirect(oUrlPara);
    });

    g_WLSerByWhichBranch = decodeURI( Utils.Base.parseUrlPara().curBranch );
    $("#curBranch").text( g_WLSerByWhichBranch ); 

 }

function initData(){
    sendWLSerByBranchAjax(1, {
        limitnum: g_nPageSize_10, 
        skipnum: 0, 
        body: {findoption: {}, sortoption: {}}
    });
}

function _init() {
    initGrid();
    initForm();
    initData();
}

function _destroy() {
    Utils.Request.clearMoudleAjax(MODULE_NAME);  
}

Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "widgets": ["SList","Form"],
    "utils": ["Base","Device", "Request"]
});

}) (jQuery);;