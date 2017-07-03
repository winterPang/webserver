;(function ($){

var MODULE_BASE = "hq_wlanconfig";
var MODULE_NAME = MODULE_BASE + ".j_bindap";
var MODULE_RC = "bindAP_rc";

var g_nPageSize_5 = 5;
var g_WLSerByWhichAP = "";
var g_aAPInfo = [];
var g_aAPAllInfo = [];
    
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
function initWLSerByAP_List() {

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

        g_aAPAllInfo = [];

        $.each(aParam, function (index, ele) {
            var stName = ele.stName;

            $.each(g_aAPInfo, function (index, ele) {
                g_aAPAllInfo.push({
                    apSN: ele.apSN,
                    radioId: parseInt(ele.radioId),
                    stName: stName
                });
            });
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
                method: "SSIDUnbindByAP",
                param: g_aAPAllInfo
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
        colNames: getRcText("WLSER_BYAP_LIST_HEADER"),
        colModel: [
            { name: "stName", datatype: "String"},
            { name: "ssidName", datatype: "String"},
            { name: "stType", datatype: "Order", data: getRcText("WL_ST_TYPE")},
            { name: "authType", datatype: "Order", data: getRcText("WL_AUTH_TYPE")},
            { name: "status", datatype: "Order", data: getRcText("WL_ST_STATUS")}
        ],    
        buttons: [
            {
                name: "unbindBtn",
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
        //     sendWLSerByAPAjax(pageNum, oParam);
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
        //     sendWLSerByAPAjax(1, oParam);
        // },
        // onSort:function (sName, isDesc) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_5,
        //         body: { sortoption: { } }
        //     };
        //     oParam.body.sortoption[sName] = BoolToNum( isDesc );
        //     sendWLSerByAPAjax(1, oParam);
        // }
    };

    $("#WLSerByAP_List").SList("head", oListOpts);
}

function sendWLSerByAPAjax (nPageNum, oParam) {

    function getSucc (data) {

        g_aAPInfo = [];
        for(var i = 0; i < data.radioNum; i++) {
            g_aAPInfo.push({
                apSN: data.apSN,
                radioId: i + 1
            });
        }

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

function getWLSerByAP_Data() {

   sendWLSerByAPAjax(1, {
        limitnum: g_nPageSize_5, 
        skipnum: 0, 
        body: {findoption: {}, sortoption: {}}
    }); 
}


// 其他无线服务列表
function initOWLSerByAP_List() {

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

        g_aAPAllInfo = [];
        $.each(aParam, function (index, ele) {
            var stName = ele.stName;

            $.each(g_aAPInfo, function (index, ele) {
                g_aAPAllInfo.push({
                    apSN: ele.apSN,
                    radioId: parseInt(ele.radioId),
                    stName: stName
                });
            });
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
                method: "SSIDBindByAP",
                param: g_aAPAllInfo
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
        colNames: getRcText("WLSER_BYAP_LIST_HEADER"),
        colModel: [
            { name: "stName", datatype: "String"},
            { name: "ssidName", datatype: "String"},
            { name: "stType", datatype: "Order", data: getRcText("WL_ST_TYPE")},
            { name: "authType", datatype: "Order", data: getRcText("WL_AUTH_TYPE")},
            { name: "status", datatype: "Order", data: getRcText("WL_ST_STATUS")}
        ],    
        buttons: [
            {
                name: "bindBtn",
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
        //     sendOWLSerByAPAjax(pageNum, oParam);
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
        //     sendOWLSerByAPAjax(1, oParam);
        // },
        // onSort:function (sName, isDesc) {
        //     var oParam = {
        //         skipnum: 0,
        //         limitnum: g_nPageSize_5,
        //         body: { sortoption: { } }
        //     };
        //     oParam.body.sortoption[sName] = BoolToNum( isDesc );
        //     sendOWLSerByAPAjax(1, oParam);
        // }
    };

    $("#OWLSerByAP_List").SList("head", oListOpts);
}

function sendOWLSerByAPAjax (nPageNum, oParam) {

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


        $("#OWLSerByAP_List").SList("refresh", aData
        // {
        //     total: data.stList.stUnBindTotalCnt,
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

function getOWLSerByAP_Data() {

   sendOWLSerByAPAjax(1, {
        limitnum: g_nPageSize_5, 
        skipnum: 0, 
        body: {findoption: {}, sortoption: {}}
    }); 
}

function initGrid(){
    initWLSerByAP_List();
    initOWLSerByAP_List();
}

function initForm() {

    $("#return").click(function(){
        var oUrlPara = {
            np: "hq_wlanconfig.index_stbind",                       
        };
        Utils.Base.redirect(oUrlPara);
    });

    g_WLSerByWhichAP = decodeURI( Utils.Base.parseUrlPara().curAP );
    $(".curAP").text( g_WLSerByWhichAP ); 
}

function initData(){
    getWLSerByAP_Data();
    getOWLSerByAP_Data();   
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
    "utils": ["Base", "Device", "Request"]
});

})(jQuery);