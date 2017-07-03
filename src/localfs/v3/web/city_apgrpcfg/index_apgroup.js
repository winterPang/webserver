(function($) {
    var MODULE_BASE = "city_apgrpcfg";
    var MODULE_NAME = MODULE_BASE + ".index_apgroup";
    var MODULE_RC = "apgrp_indexConfigure";
    //var MODULE_NP_H_WIRELESS = MODULE_BASE + ".index_detial";
    var g_oTableData = {};
    // var g_detial={};
    var deleteData = {};
    var g_oPara;
    var SKIP = 0;
    var LIMIT = 100;

    function getRcText(sRcName) {
        return Utils.Base.getRcString(MODULE_RC, sRcName); //MODULE_RC指的是apinfo_aplist_rc这个div，这句话看框架源码即可知道返回的是那个div里的具体sRcName的值
    }
	
	function onAddCityLoaction(){
		return true;
	}
	
	
	function synSSID(){
		return false;
	}
    
	function onDelSSID() {
		return false;
	}
	
	function showLinkAP(row, cell, value, columnDef, dataContext, type) {
        value = value || "";

        if ("text" == type) {
            return value;
        }
        return '<a class="list-link" cell="' + cell + '"' + ' ApGroupName="' + dataContext.group_name + '">' + value + '</a>';

    }
	
	function onDisApList()
    {
        var ApGroupName = $(this).attr("ApGroupName");
        //var oData = g_oTableData[ApGroupName];
        //Utils.Base.updateHtml($("#view_client_form"), oData);//这句话是在弹出框中加入数据
		
        var demoData02 = [{ap_name:'ap1',serial_number:'AD13-SD23-SDSD',mac_address:'SDFS-SDSD-JGJG',ip_address:'192.168.20.136',group_name:'default-group'}]; 
		$("#flowdetail_listAP").SList("refresh", demoData02);
		Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlgAP"),className:"modal-super"});
    }
	
	function editApGroup(dataContext) {

        var group_name =  dataContext[0].group_name ;

        $("#apgroup_name").val(group_name);
        $("#apgroup_name").attr("readOnly",true);
        Utils.Widget.setError($("#apgroup_name"),"");
		Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlgEditAP"),className:"modal-large"});
	}

    function addApGroup(dataContext) {

        Utils.Widget.setError($("#apgroup_name02"),"");
        Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlgAddAP"),className:"modal-large"});
    }

    function onViewDetial(data) {
        var oUrlPara = {
            np: MODULE_BASE + ".index_detial",
            ssid_name: data[0].ssid_name
        };
        Utils.Base.redirect(oUrlPara);
    }
    function initGrid() {

        function showAddUser(data) { //修改按钮
            //alert(1);
            var oUrlPara = {
                np: MODULE_BASE + ".index_modify",
                stName: data[0].sp_name,
                ssidName: data[0].ssid_name,
                status: data[0].status,
                authType:data[0].AuthType
            };
            Utils.Base.redirect(oUrlPara);
        }
        var oSApGroupHead = { //初始化表头信息，并且写出具体字段，字段值和ajax返回的值要对应上
            height: "70",
            showHeader: true,
            showOperation: true,
            multiSelect: true,
            pageSize: 10,
            colNames: getRcText("ALLAPGROUP_HEADER2"),
            colModel: [{name: "group_name",datatype: "String",width: 80},
					   {name: "description",datatype: "String",width: 80},
					   {name: "ap_list",datatype: "String",width: 80,formatter:showLinkAP}, 
					   {name: "location_name",datatype: "String",width: 80}
					   /*, {name: "opertion",datatype: "String",width: 80,formatter: del}*/
					   ],
            buttons: [{name: "add",value: "添加",action: addApGroup,enable: 1},
					  {name: "sync",value: getRcText("SYN"),action: synSSID},
					  {name: "deleteapgroup",value: getRcText("DELETEALL"),action: synSSID},
					  {name: "edit",action: editApGroup}, 
					  {name: "delete",action: Utils.Msg.deleteConfirm(onDelSSID),enable: 1}
					]
        };
        $("#apgrp_cfg").SList("head", oSApGroupHead);
		$("#apgrp_cfg").on('click','a.list-link',onDisApList);
        var demoData01 = [{group_name:'default-group',description:'智慧城市',ap_list:'300',location_name:'昌平区'}];
		$("#view_client_form").form("init", "edit", {"title":getRcText("TITLE_TERINFO"),"btn_apply": false,"btn_cancel":false});
        $("#apgrp_cfg").SList("refresh", demoData01);
		
		
		var oSApListHead = { //初始化表头信息，并且写出具体字段，字段值和ajax返回的值要对应上
            height: "70",
            showHeader: true,
            multiSelect: true,
            pageSize: 10,
            colNames: getRcText("ALLAPLIST_HEADER2"),
            colModel: [{name: "ap_name",datatype: "String",width: 80},
					   {name: "serial_number",datatype: "String",width: 80},
					   {name: "mac_address",datatype: "String",width: 80}, 
					   {name: "ip_address",datatype: "String",width: 80},
					   {name: "group_name",datatype: "String",width: 80}
					   /*, {name: "opertion",datatype: "String",width: 80,formatter: del}*/
					   ],
            buttons: [{name: "addapgroup",value: getRcText("ADDAPGROUP"),action: onAddCityLoaction}, 
					  {name: "leftapgroup",value: getRcText("LEFTAPGROUP"),action: synSSID},
					  {name: "edit",action: editApGroup}, 
					  {name: "delete",action: Utils.Msg.deleteConfirm(onDelSSID),enable: 1}
					]
        };
		$("#flowdetail_listAP").SList("head", oSApListHead);
        var demoData02 = [{ap_name:'ap1',serial_number:'AD13-SD23-SDSD',mac_address:'SDFS-SDSD-JGJG',ip_address:'192.168.20.136',group_name:'default-group'}];

		$("#view_client_form01").form("init", "edit", {"title":getRcText("TITLE_EDITAPGROUP"),"btn_apply": true,"btn_cancel":true});
        $("#view_client_form02").form("init", "add", {"title":getRcText("TITLE_ADDAPGROUP"),"btn_apply": true,"btn_cancel":true});
    }

    function initForm()
    {
        //$("#apgrp_cfg").on('click','a.list-link',onDisApList);
    }
    function _init() {
        g_oPara = Utils.Base.parseUrlPara(); //这句话是把在url中的地址取到
        initGrid();
        //initData();
    }

    function _resize(jParent) {}

    function _destroy() {
        console.log("destory**************");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "Minput", "SList", "Form", "SingleSelect"],
        "utils": ["Base", "Request", "Device"],

    });

})(jQuery);;