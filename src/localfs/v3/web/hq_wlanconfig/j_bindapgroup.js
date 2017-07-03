;(function ($){

var MODULE_BASE = "hq_wlanconfig";
var MODULE_NAME = MODULE_BASE + ".j_bindapgroup";
var MODULE_RC = "bindAPGroup_rc";

var g_nPageSize_5 = 5;
var g_WLSerByWhichAPGroup = "";
var g_aAPGroupInfo = [];
var g_aAPGroupAllInfo = [];
    
function getRcText (sRcName) {
    return Utils.Base.getRcString(MODULE_RC, sRcName);
}

function getDataFail() {
    Frame.Msg.info(getRcText("MSG_INFO_ERROR"), "error");
}

function BoolToNum (bBool) {
    return ( bBool == false ? 1 : -1 );
}

// 已绑定无线服务列表
function initWLSerByAPGroup_List() {

    function onUnbindBtnClick(aParam) {
        
        function getSucc (data) {
            if(data.communicateResult == "success" && data.serviceResult == "success") {
                Utils.Base.refreshCurPage();
                Frame.Msg.info("解除绑定成功","ok");
            }else{
                Frame.Msg.info(data.reason,"error");
            }
        }

        function getFail() {
            getDataFail();
        }

        g_aAPGroupAllInfo = [];
        $.each(aParam, function (index, ele) {
            var stName = ele.stName;

            for (var i = 0; i < g_aAPGroupInfo.length; i ++) {
                g_aAPGroupAllInfo.push({
                    apGroupName: g_WLSerByWhichAPGroup,
                    apModelName: g_aAPGroupInfo[i].apModelName,
                    radioId: g_aAPGroupInfo[i].radioId,
                    stName: stName
                });
            }
        });

        var oSendOpts={
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                configType: 0,
                devSN: FrameInfo.ACSN,
                deviceModule: "stamgr",
                cloudModule: "stamgr",
                module: "stamgr",
                method: "SSIDUnbindByAPGroup",
                param: g_aAPGroupAllInfo
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
        pageSize: g_nPageSize_5,
        colNames: getRcText("WLSER_BYAPGROUP_LIST_HEADER"),
        colModel: [
            { name: "stName", datatype: "String"},
            { name: "ssidName", datatype: "String"},
            { name: "stType", datatype: "Order", data: getRcText("WL_ST_TYPE")},
            { name: "authType", datatype: "Order", data: getRcText("WL_AUTH_TYPE")},
            { name: "status", datatype: "Order", data: getRcText("WL_ST_STATUS")}
        ],    
        buttons: [
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
        //     sendWLSerByAPGroupAjax(pageNum, oParam);
        // },
        // onSearch: function (oFilter, oSorter) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_5,
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
        //         limitnum: g_nPageSize_5,
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

        g_aAPGroupInfo = [];

        $.each(data.modelList, function (index, ele) {
            var radioNum = ele.radioNum;
            var apModelName = ele.model;

            for(var i = 0; i < radioNum; i ++) {
                g_aAPGroupInfo.push({
                    apModelName: apModelName,
                    radioId: i + 1
                });
            }

        });

        var aData = [];
        $.each(data.stList.stBindList, function (index, ele) {
            aData.push({
                stName: ele.stName,
                ssidName: ele.ssidName,
                stType: ele.description,
                authType: ele.lvzhouAuthMode,
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

function getWLSerByAPGroup_Data() {

   sendWLSerByAPGroupAjax(1, {
        limitnum: g_nPageSize_5, 
        skipnum: 0, 
        body: {findoption: {}, sortoption: {}}
    }); 
}

// 其他无线服务列表
function initOWLSerByAPGroup_List() {

    function onBindBtnClick(aParam) {

        function getSucc (data) {
            if(data.communicateResult == "success" && data.serviceResult == "success") {
                Utils.Base.refreshCurPage();
                Frame.Msg.info("绑定成功","ok");
            }else{
                Frame.Msg.info(data.reason,"error");
            }
        }

        function getFail() {
            getDataFail();
        }

        g_aAPGroupAllInfo = [];
        $.each(aParam, function (index, ele) {
            var stName = ele.stName;

            for (var i = 0; i < g_aAPGroupInfo.length; i ++) {
                g_aAPGroupAllInfo.push({
                    apGroupName: g_WLSerByWhichAPGroup,
                    apModelName: g_aAPGroupInfo[i].apModelName,
                    radioId: g_aAPGroupInfo[i].radioId,
                    stName: stName
                });
            }
        });

        var oSendOpts={
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                configType: 0,
                devSN: FrameInfo.ACSN,
                deviceModule: "stamgr",
                cloudModule: "stamgr",
                module: "stamgr",
                method: "SSIDBindByAPGroup",
                param: g_aAPGroupAllInfo
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
        pageSize: g_nPageSize_5,
        colNames: getRcText("WLSER_BYAPGROUP_LIST_HEADER"),
        colModel: [
            { name: "stName", datatype: "String"},
            { name: "ssidName", datatype: "String"},
            { name: "stType", datatype: "Order", data: getRcText("WL_ST_TYPE")},
            { name: "authType", datatype: "Order", data: getRcText("WL_AUTH_TYPE")},
            { name: "status", datatype: "Order", data: getRcText("WL_ST_STATUS")}
        ],    
        buttons: [
            {
                name: "bind",
                value: getRcText("BIND_BTN"),
                enable: ">0",
                action: onBindBtnClick
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
        //     sendOWLSerByAPGroupAjax(pageNum, oParam);
        // },
        // onSearch: function (oFilter, oSorter) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_5,
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
        //     sendOWLSerByAPGroupAjax(1, oParam);
        // },
        // onSort:function (sName, isDesc) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_5,
        //         body: { sortoption: { } }
        //     };
        //     oParam.body.sortoption[sName] = BoolToNum( isDesc );
        //     sendOWLSerByAPGroupAjax(1, oParam);
        // }
    };

    $("#OWLSerByAPGroup_List").SList("head", oListOpts);
}

function sendOWLSerByAPGroupAjax (nPageNum, oParam) {

    function getSucc (data) {

        var aData = [];
        $.each(data.stList.stUnBindList, function (index, ele) {
            aData.push({
                stName: ele.stName,
                ssidName: ele.ssidName,
                stType: ele.description,
                authType: ele.lvzhouAuthMode,
                status: ele.status - 1
            });
        });
        $("#OWLSerByAPGroup_List").SList("refresh", aData 
        // {
        //     total: data.stList.unBindTotalCnt,
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

function getOWLSerByAPGroup_Data() {
    sendOWLSerByAPGroupAjax(1, {
        limitnum: g_nPageSize_5, 
        skipnum: 0, 
        body: {findoption: {}, sortoption: {}}
    });
}

function initGrid(){
    initWLSerByAPGroup_List();
    initOWLSerByAPGroup_List();
}

function initForm() {

    $("#return").click(function(){
        var oUrlPara = {
            np: "hq_wlanconfig.index_stbind",                       
        };
        Utils.Base.redirect(oUrlPara);
    });

    g_WLSerByWhichAPGroup = decodeURI( Utils.Base.parseUrlPara().curAPGroup );
    $(".curAPGroup").text( g_WLSerByWhichAPGroup ); 

}

function initData(){
    getWLSerByAPGroup_Data();
    getOWLSerByAPGroup_Data();
}


function _init() {
    initGrid();
    initForm();
    initData();
}

function _destroy() {
    Utils.Request.clearMoudleAjax(MODULE_NAME); 
}

Utils.Pages.regModule(MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "widgets": ["SList","Form"],
    "utils": ["Base","Device",  "Request"]
});

})(jQuery);