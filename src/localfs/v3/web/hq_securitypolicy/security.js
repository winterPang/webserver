;(function ($) {

var MODULE_BASE = "hq_securitypolicy";
var MODULE_NAME = MODULE_BASE + "." + "security";

var g_sBranchName = ""; // 初始 分分支名称 为空字符串
var g_bBranchCheck = false; // 初始 全局 被选中
var g_bAPCheck = false; // 初始 AP组 被选中

var g_sFirstBranchName, // 存储 分支列表中 第一条数据
	g_sFirstBranchVal;

var  g_nPageSize = 10; // 列表相关配置
	
var g_aCheckData = null; // 多选时选中的数据

var g_aOnOff = getRcText("ON_OFF").split(","); // 开启/关闭

function getRcText(sRcName) {
	return Utils.Base.getRcString("ws_ssid_rc", sRcName);
}
	// on/off 转换 开启/关闭
function getOnOffToText(sOnOff) {
	return ( sOnOff == "on" ? g_aOnOff[1] : g_aOnOff[0] );
}
	// on/off 转换 1/0
function getOnOffToNum(sOnOff) {
	return ( sOnOff == "on" ? 1 : 0 );
}
	// 1/0 转换 on/off
function getNumToOnOff(nNum) {
	return ( nNum == 1 ? "on" : "off" );
}
	// bool 转化 1/-1
function getBoolToNum(bBool) {
	return ( bBool == false ? 1 : -1 );
}

    // 0/1 转换 2.4G/5G
function getNumToRadioMode (nNum) {
    return ( nNum == 0 ? "2.4G" : "5G" );
}

function getRadioModeToNum (sRadioMode) {
    if ( sRadioMode == "2.4G" ) { return 0;}
    if ( sRadioMode == "5G" ) { return 1;}
}

// 初始化 分支下拉框
function initBranchSingleSelect() {

	function getSucc(data) {
		
		var aData = [];
        if( data.branchList == undefined ) { // 无branchList属性情况
            Frame.Msg.info("BrachList Invalid request", "error");
            return;
        }
        if( data.branchList.length == 0 ) { // branchList数据返回为空情况
            Frame.Msg.info("Plase add BrachList", "error");
            return;
        }
        $.each(data.branchList, function (index, ele) {
            aData.push({
                name: ele.branchName,
                value: ele.branchName
            });
        });
		// 存储option第一行数据，稍后设置
		g_sFirstBranchName =  aData[0].name;
		g_sFirstBranchVal = aData[0].value;

        $("#branchSelector").singleSelect("InitData", aData, {
            displayField: "name",
            valueField: "value"
        });

		$("#branchSelector").bind("change", function () {
			g_sBranchName = $(this).val();
			initData();
		});
	}

	function getFail() {
		Frame.Msg.info(getRcText("BRANCH_SELECT_GETFAIL"), "error");	
	}

	var oSendOpts = {
		type: "GET",
        url: MyConfig.path + "/apmonitor/getBranchList?devSN=" + FrameInfo.ACSN,
        dataType: "json",
        onSuccess: getSucc,
        onFailed: getSucc
	};

	Utils.Request.sendRequest(oSendOpts);
}

// 点击分支按钮
function onBranchRadioClick() {
	if( g_bBranchCheck ) { return; }
	g_bBranchCheck = true;
	g_sBranchName = g_sFirstBranchName;
	$("#branchSelectorDiv").removeClass("hide");
	initData();
}

// 点击全局按钮
function onAlloverRadioClick() {
	if ( !g_bBranchCheck ) { return; }
	g_bBranchCheck = false;
	g_sBranchName = "";
	$("#branchSelector").singleSelect("value", g_sFirstBranchVal);
	$("#branchSelectorDiv").addClass("hide");
	initData();
}

// 点击APGroup按钮
function onAPGroupRadioClick() { // 只做隐藏AP显示APGroup操作
	if ( !g_bAPCheck ) { return; }
	g_bAPCheck = false;
	$("#APGroupSList").removeClass("hide");
	$("#APSList").addClass("hide");
}

// 点击AP按钮
function onAPRadioClick() { // 只做隐藏APGroup显示AP操作
	if ( g_bAPCheck ) { return; }
	g_bAPCheck = true;
	$("#APGroupSList").addClass("hide");
	$("#APSList").removeClass("hide");
	$("#APSList").SList("resize");
}

// 初始化APGroup列表
function initAPGroupSList() {
	var oSListOpts = {
		colNames: getRcText("APGROUP_SLIST_TITLE"),
		asyncPaging: true,
        showHeader: true,
        multiSelect: true,
        pageSize: g_nPageSize,
        colModel: [
            {name: 'apGroupName', datatype: "String"},
            {name: 'radioMode', datatype: "Order", data: getRcText("RADIO_MODE")},
			{name: 'natDetectStatus', datatype: "Order", data: getRcText("ON_OFF")},
            {name: 'wipsStatus', datatype: "Order", data: getRcText("ON_OFF"),formatter: formatterWipsShow},
            {name: 'probeStatus', datatype: "Order", data: getRcText("ON_OFF")}
        ],
        buttons: [
            {
            	name: "default", 
            	enable: ">0", 
            	value: getRcText ("SLIST_MODIFY_BTN"), 
            	icon: "slist-add",
            	action: onModifyBtnclick
            }
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {

        	var oParam = {
        		limit: pageSize,
        		skip: (pageNum - 1) * pageSize
        	};

        	if( oFilter ) { // 无任何筛选条件时，oFilter是null
        		
        		if( oFilter.hasOwnProperty("apGroupName") ) {
        			oParam.apGroupName = oFilter.apGroupName;
        		}
        		if ( oFilter.hasOwnProperty("radioMode") ) {
        			oParam.radioMode = getNumToRadioMode(oFilter.radioMode);
        		}
        		if ( oFilter.hasOwnProperty("natDetectStatus") ) {
        			oParam.natDetectStatus = getNumToOnOff(oFilter.natDetectStatus);
        		}
        		if ( oFilter.hasOwnProperty("wipsStatus") ) {
        			oParam.wipsStatus = getNumToOnOff(oFilter.wipsStatus);
        		}
        		if ( oFilter.hasOwnProperty("probeStatus") ) {
        			oParam.probeStatus = getNumToOnOff(oFilter.probeStatus);
        		}

        	}
        	  	
        	if( oSorter ) {
        		oParam.sortName = oSorter.name;
        		oParam.sort = getBoolToNum( oSorter.isDesc );
        	}

        	sendGetAjax("apGroup", pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {

        	var oParam = {
        		limit: g_nPageSize,
        		skip: 0
        	};

        	if( oFilter ) { // 无任何筛选条件时，oFilter是null

        		if( oFilter.hasOwnProperty("apGroupName") ) {
        			oParam.apGroupName = oFilter.apGroupName;
        		}
        		if ( oFilter.hasOwnProperty("radioMode") ) {
        			oParam.radioMode = getNumToRadioMode(oFilter.radioMode);
        		}
        		if ( oFilter.hasOwnProperty("natDetectStatus") ) {
        			oParam.natDetectStatus = getNumToOnOff( oFilter.natDetectStatus );
        		}
        		if ( oFilter.hasOwnProperty("wipsStatus") ) {
        			oParam.wipsStatus = getNumToOnOff( oFilter.wipsStatus );
        		}
        		if ( oFilter.hasOwnProperty("probeStatus") ) {
        			oParam.probeStatus = getNumToOnOff( oFilter.probeStatus );
        		}
        	}
        	  	
        	if( oSorter ) {
        		oParam.sortName = oSorter.name;
        		oParam.sort = getBoolToNum( oSorter.isDesc );
        	}

        	sendGetAjax("apGroup", 1, oParam);
        },
        onSort: function(sName, isDesc) {
        	
        	var oParam = {
        		limit: g_nPageSize,
        		skip: 0,
        		sortName : sName,
        		sort : getBoolToNum( isDesc )
        	};

        	sendGetAjax("apGroup", 1, oParam);
        }
	};

	$("#APGroupSList").SList ("head", oSListOpts);
}

// 初始化AP列表
function initAPSList() {
	var oSListOpts = {
		colNames: getRcText("AP_SLIST_TITLE"),
        showHeader: true,
        multiSelect: true,
        asyncPaging: true,
        pageSize: g_nPageSize,
        colModel: [
            {name: 'apName', datatype: "String"},
            {name: 'radioMode', datatype: "Order", data: getRcText("RADIO_MODE")},
			{name: 'natDetectStatus', datatype: "Order", data: getRcText("ON_OFF")},
            {name: 'wipsStatus', datatype: "Order", data: getRcText("ON_OFF"),formatter: formatterWipsShow},
            {name: 'probeStatus', datatype: "Order", data: getRcText("ON_OFF")}
        ],
        buttons:[
            {
            	name: "default", 
            	enable: ">0", 
            	value: getRcText ("SLIST_MODIFY_BTN"), 
            	icon: "slist-add",
            	action: onModifyBtnclick
            }
        ],
        onPageChange: function (pageNum, pageSize, oFilter, oSorter) {

        	var oParam = {
        		limit: pageSize,
        		skip: (pageNum - 1) * pageSize
        	};

        	if( oFilter ) { // 无任何筛选条件时，oFilter是null
        		
        		if( oFilter.hasOwnProperty("apName") ) {
        			oParam.apName = oFilter.apName;
        		}
        		if ( oFilter.hasOwnProperty("radioMode") ) {
        			oParam.radioMode = getNumToRadioMode(oFilter.radioMode);
        		}
        		if ( oFilter.hasOwnProperty("natDetectStatus") ) {
        			oParam.natDetectStatus = getNumToOnOff( oFilter.natDetectStatus );
        		}
        		if ( oFilter.hasOwnProperty("wipsStatus") ) {
        			oParam.wipsStatus = getNumToOnOff( oFilter.wipsStatus );
        		}
        		if ( oFilter.hasOwnProperty("probeStatus") ) {
        			oParam.probeStatus = getNumToOnOff( oFilter.probeStatus );
        		}
        	}
        	  	
        	if( oSorter ) {
        		oParam.sortName = oSorter.name;
        		oParam.sort = getBoolToNum( oSorter.isDesc );
        	}

        	sendGetAjax("ap", pageNum, oParam);
        },
        onSearch: function (oFilter, oSorter) {

        	var oParam = {
        		limit: g_nPageSize,
        		skip: 0
        	};

        	if( oFilter ) { // 无任何筛选条件时，oFilter是null
        		
        		if( oFilter.hasOwnProperty("apName") ) {
        			oParam.apName = oFilter.apName;
        		}
        		if ( oFilter.hasOwnProperty("radioMode") ) {
        			oParam.radioMode = getNumToRadioMode(oFilter.radioMode);
        		}
        		if ( oFilter.hasOwnProperty("natDetectStatus") ) {
        			oParam.natDetectStatus = getNumToOnOff( oFilter.natDetectStatus );
        		}
        		if ( oFilter.hasOwnProperty("wipsStatus") ) {
        			oParam.wipsStatus = getNumToOnOff( oFilter.wipsStatus );
        		}
        		if ( oFilter.hasOwnProperty("probeStatus") ) {
        			oParam.probeStatus = getNumToOnOff( oFilter.probeStatus );
        		}
        	}
        	  	
        	if( oSorter ) {
        		oParam.sortName = oSorter.name;
        		oParam.sort = getBoolToNum( oSorter.isDesc );
        	}

        	sendGetAjax("ap", 1, oParam);
        },
        onSort:function(sName, isDesc) {
        	
        	var oParam = {
        		limit: 10,
        		skip: 0,
        		sortName : sName,
        		sort : getBoolToNum( isDesc )
        	};

        	sendGetAjax("ap", 1, oParam);
        }
	};

	$("#APSList").SList("head", oSListOpts);
}

// 格式化 Wips 样式
function formatterWipsShow(row, cell, value, columnDef, dataContext, type) {
    if (type == "text") {
        return g_aOnOff[dataContext.wipsStatus];
    }

    return "<a href='javascript:void(0);' class='list-link' radioID='" + dataContext.radioID + "' phishStatus='" + dataContext.phishStatus + "' ctmPhishStatus='" + dataContext.ctmPhishStatus + "' floodStatus='" + dataContext.floodStatus + "'>" + g_aOnOff[dataContext.wipsStatus] + "</a>";
}

// 点击 Wips 事件
function onWipsClick() {

	Utils.Base.openDlg(null, {}, {scope:$("#WipsDetailDlg"),className:"modal-small"});
	if( !g_bAPCheck ) {
		$("#APName").prev().text( getRcText("APGROUP_SLIST_TITLE").split(",")[0] );
	}else {
		$("#APName").prev().text( getRcText("AP_SLIST_TITLE").split(",")[0] );
	}

	var oData = {
		APName: $(this).parent().parent().find("[class*='sl0']").text(),
		radioMode: $(this).parent().parent().find("[class*='sl1']").text(),
		phishStatus: g_aOnOff[$(this).attr("phishstatus")],
		ctmPhishStatus: g_aOnOff[$(this).attr("ctmphishstatus")],
		floodStatus: g_aOnOff[$(this).attr("floodstatus")]
	};

    Utils.Base.updateHtml($("#WipsDetailForm"), oData);
}

// 点击修改按钮
function onModifyBtnclick(aRowData) {
	g_aCheckData = aRowData;
    Utils.Base.openDlg(null, {}, {scope:$("#WipsSetDlg"),className:"modal-super"});
    $("#WipsSetDlg .modal-footer a.btn-apply").removeClass("disabled");
}

	// 点击提交按钮
function submitModifyForm() {

	function getOnOff (id) {
		var bBool = $(id).next().hasClass("checked");
		return ( bBool == true ? "on" : "off" );
	}

	var aParam = [];

	if( g_bAPCheck ) {
		$.each(g_aCheckData, function (index, ele) {
            aParam.push({
                apName: ele.apName,
                radioID: ele.radioID + "",
                radioMode: getRcText("RADIO_MODE").split(",")[ele.radioMode],
                natDetectStatus: getOnOff( "#natDetect" ),
                probeStatus: getOnOff( "#probe" ),
                phishStatus: getOnOff( "#phish"),
                ctmPhishStatus: getOnOff( "#ctmPhish" ),
                floodStatus: getOnOff( "#flood" )
            });
        });
	}else{
		$.each(g_aCheckData, function (index, ele) {
            aParam.push({
                apGroupName: ele.apGroupName,
                radioID: ele.radioID + "",
                radioMode: getRcText("RADIO_MODE").split(",")[ele.radioMode],
                natDetectStatus: getOnOff( "#natDetect" ),
                probeStatus: getOnOff( "#probe" ),
                phishStatus: getOnOff( "#phish"),
                ctmPhishStatus: getOnOff( "#ctmPhish" ),
                floodStatus: getOnOff( "#flood" )
            });
        });
	}
	
	var sName = ( g_bAPCheck == true ? "ap" : "apGroup" );

	sendSetAjax(sName, aParam); 
}

// 获取请求
function sendGetAjax(sName, nPageNum, oAJAXParam) {

	function getSucc(data) {

		if( data.result !== "fail" ) {

			var aData = [];
			$.each(data.result, function (index, ele) {
		        aData[index] = {};
				if( sName == "ap" ) {
					aData[index].apName = ele.apName;
				}
				if( sName == "apGroup" ) {
					aData[index].apGroupName = ele.apGroupName;
				}
		        aData[index].radioID = ele.radioID;
		        aData[index].radioMode = getRadioModeToNum( ele.radioMode );
		        aData[index].natDetectStatus = getOnOffToNum( ele.natDetectStatus );
		        aData[index].wipsStatus = getOnOffToNum( ele.wipsStatus );
		        aData[index].probeStatus = getOnOffToNum( ele.probeStatus );
		        aData[index].phishStatus = getOnOffToNum( ele.phishStatus );
		        aData[index].ctmPhishStatus = getOnOffToNum( ele.ctmPhishStatus );
		        aData[index].floodStatus = getOnOffToNum( ele.floodStatus );
			});
			
			sendGetTotalAjax(sName, nPageNum, oAJAXParam, aData);

		}else{
			Frame.Msg.info(getRcText("SLIST_DATA_GETFAIL"), "error");
		}
	}

	function getFail() {
		Frame.Msg.info(getRcText("SLIST_DATA_GETFAIL"), "error");
	}

    var oData = {
        configType: 1,
        cloudModule: "WIPS",
        // deviceModule: "WIPS",
        devSN: FrameInfo.ACSN,
        method: sName + "StatusGet",
        param: oAJAXParam
    };

    if ( g_sBranchName != "") {
        oData.param.BranchName = g_sBranchName;
    }else{
       delete oData.param.BranchName;
    }

	var oSendOpts = {
        type: "post",
		url: MyConfig.path + '/ant/confmgr',
        contentType:"application/json",
        dataType: "json",
        data: JSON.stringify(oData),
        success: getSucc,
        error: getFail
	};

	Utils.Request.sendRequest(oSendOpts);
}

// total请求
function sendGetTotalAjax(sName, nPageNum, oAJAXParam, aData) {

	function getSucc(data) {
		if ( data.result != "success" ) {

            if ( sName == "ap") {
                var nPageTotal_AP = data.result;
            } else {
                var PageTotal_APGroup = data.result;
            }

            var sListName = ( sName == "ap" ? "#APSList" : "#APGroupSList" );

            $(sListName).SList("refresh", {
				total : ( sName == "ap" ? nPageTotal_AP : PageTotal_APGroup ),
				pageNum : nPageNum,
				data : aData
			});

		}else{
			Frame.Msg.info(getRcText("SLIST_DATA_GETFAIL"), "error");
		}
	}

	function getFail() {
		Frame.Msg.info(getRcText("SLIST_DATA_GETFAIL"), "error");
	}

    delete oAJAXParam.limit;
    delete oAJAXParam.skip;

    var oData = {
        configType: 1,
        cloudModule: "WIPS",
        devSN: FrameInfo.ACSN,
        method: sName + "TotalNumGet",
        param: oAJAXParam
    };

    if ( g_sBranchName != "") {
        oData.param.BranchName = g_sBranchName;
    }else{
       delete oData.param.BranchName;
    }

	var oSendOpts = {
        type: "post",
		url: MyConfig.path + '/ant/confmgr',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(oData),
        success: getSucc,
        error: getFail
	};

	Utils.Request.sendRequest(oSendOpts);
}

// 设置请求
function sendSetAjax(sName, oAJAXParam) {

    function closeWindow(sId) {
        Utils.Pages.closeWindow( Utils.Pages.getWindow( $(sId) ) );
    }

	function getSucc(data) {
		if ( data.result == "success" ) {
            sendSetProbeAjax(sName, oAJAXParam)
			// Frame.Msg.info(getRcText("SET_SUCCESS"));
            // closeWindow("#WipsSetForm");
            // initData();
            // Utils.Base.refreshCurPage();
		}else{
            closeWindow("#WipsSetForm");
			Frame.Msg.info(getRcText("SET_FAIL"), "error");
		}
	}

	function getFail() {
        closeWindow("#WipsSetForm");
		Frame.Msg.info(getRcText("SET_FAIL"), "error");
	}

    var aAJAXParam = [];

    $.each(oAJAXParam, function (index, ele) {
        var obj = {};
        for (var k in ele) {
            if(k == "probeStatus") {
                continue;
            }
            obj[k] = ele[k];
        }
        aAJAXParam.push(obj);
    })

    var oData = {
        configType: 0,
        cloudModule: "WIPS",
        deviceModule: "WIPS",
        devSN: FrameInfo.ACSN,
        method: sName + "StatusSet",
        param: aAJAXParam
    };

	var oSendOpts = {
        type: "post",
		url: MyConfig.path + '/ant/confmgr',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(oData),
        success: getSucc,
        error: getFail
	};

	Utils.Request.sendRequest(oSendOpts);
}

// probe设置请求
function sendSetProbeAjax (sName, oAJAXParam) {

    function closeWindow(sId) {
        Utils.Pages.closeWindow( Utils.Pages.getWindow( $(sId) ) );
    }

    function getSucc(data) {
        if ( data.result == "success" ) {
            Frame.Msg.info(getRcText("SET_SUCCESS"));
            closeWindow("#WipsSetForm");
            initData();
            // Utils.Base.refreshCurPage();
        }else{
            closeWindow("#WipsSetForm");
            Frame.Msg.info(getRcText("SET_FAIL"), "error");
        }
    }

    function getFail() {
        closeWindow("#WipsSetForm");
        Frame.Msg.info(getRcText("SET_FAIL"), "error");
    }

    var oData = {
        configType: 0,
        cloudModule: "WIPS",
        deviceModule: "PROBE",
        devSN: FrameInfo.ACSN,
        method: sName + "StatusSet",
        param: oAJAXParam
    };

    $.each(oData.param, function (index, ele) {
        delete ele.natDetectStatus;
        delete ele.phishStatus;
        delete ele.ctmPhishStatus;
        delete ele.floodStatus;
    })

    var oSendOpts = {
        type: "post",
        url: MyConfig.path + '/ant/confmgr',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(oData),
        success: getSucc,
        error: getFail
    };

    Utils.Request.sendRequest(oSendOpts);
}

function initGrid() {
	initAPGroupSList();
	initAPSList();
}

function initForm() {
	$("#branchFilter").bind("click", onBranchRadioClick);
	$("#alloverFilter").bind("click", onAlloverRadioClick);
	$("#APGroupRadio").bind("click", onAPGroupRadioClick);
	$("#APRadio").bind("click", onAPRadioClick);

	$("#APGroupSList").on("click","a.list-link", onWipsClick);
	$("#APSList").on("click","a.list-link", onWipsClick);

	$("#WipsDetailForm").form("init", "edit", {
        "title": getRcText("WIPS_TITLE"),
        "btn_apply": false,
        "btn_cancel": false,
        "btn_close": true
    });

    $("#WipsSetForm").form("init", "edit", {
        "title": getRcText("WIPS_TITLE"),
        "btn_apply":submitModifyForm
    });
}

function initData() {
	sendGetAjax("apGroup", 1, {
		limit : g_nPageSize,
		skip : 0,
	});

	sendGetAjax("ap", 1, {
		limit : g_nPageSize,
		skip : 0,
	});
}

function _init() {
	initGrid();
	initForm();
	initData();
	initBranchSingleSelect();
}

function _resize(jarent) {
	
}

function _destroy() {
	Utils.Request.clearMoudleAjax(MODULE_NAME);
	g_aCheckData = null;
}

Utils.Pages.regModule(MODULE_NAME, {
	"init": _init,
	"resize": _resize,
	"destroy": _destroy,
	"widgets": ["SList", "SingleSelect", "Minput", "Form"],
	"utils": ["Request", "Base"]
});

})(jQuery);