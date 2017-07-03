(function($) {
    var MODULE_BASE = "p_wireless";
    var MODULE_NAME = MODULE_BASE+".detail";
    var MODULE_RC = "ap_detail_rc";
    
    function getRcText(sRcName) {
        return Utils.Base.getRcString(MODULE_RC, sRcName); 
    }

    
    function initData() {
    	var APGroupBindListOpt = {
            showHeader: true,
            multiSelect: false,
            pageSize: 5,
            colNames: getRcText("APGROUPBIND"),
            showOperation: false,
            colModel:[
                { name: "apGroupName", datatype: "String"},
                { name: "apGrpDesc", datatype: "String"},
                              
            ],           
            buttons:[
            	{ name: "leavegroup",value: "解除绑定",/*action: apBind,*/enable: 1}
            ] 
        };
        $("#APGroupBindList").SList("head",APGroupBindListOpt);


        APGroupUnbindList
        var APGroupUnbindListOpt = {
            showHeader: true,
            multiSelect: false,
            pageSize: 5,
            colNames: getRcText("APGROUPBIND"),
            showOperation: false,
            colModel: [
                { name: "apGroupName", datatype: "String"},
                { name: "apGrpDesc", datatype: "String"},
                               
            ],           
            buttons:[
            	{ name: "leavegroup",value: "绑定AP组",/*action: apBind,*/enable: 1}
            ] 
        };
        $("#APGroupUnbindList").SList("head",APGroupUnbindListOpt);

       
        var APBindListOpt = {
            showHeader: true,
            multiSelect: false,
            pageSize: 5,
            colNames: getRcText("APBIND"),
            showOperation: false,
            colModel: [
                { name: "apName", datatype: "String"},
                { name: "SSID", datatype: "String"},
                { name: "apDesc", datatype:"String"},               
            ],           
            buttons:[
            	{ name: "leavegroup",value: "绑定AP",/*action: apBind,*/enable: 1}
            ] 
        };
        $("#APBindList").SList("head",APBindListOpt);

        var APUnbindListOpt = {
            showHeader: true,
            multiSelect: false,
            pageSize: 5,
            colNames: getRcText("APBIND"),
            showOperation: false,
            colModel: [
                { name: "apName", datatype: "String"},
                { name: "SSID", datatype: "String"},
                { name: "apDesc", datatype:"String"},               
            ],           
            buttons:[
            	{ name: "leavegroup",value: "解除绑定",/*action: apBind,*/enable: 1}
            ] 
        };
        $("#APUnbindList").SList("head",APUnbindListOpt);
        $("#APZone").hide();
    }

    function initForm() {
    	$("#return").click(function(){
            var oUrlPara = {
                np: "p_wireless.index",                       
            };
       
            Utils.Base.redirect(oUrlPara);
        })

        $("#APGroup").click(function(){
        	$("#APZone").hide();
        	$("#APGroupZone").show();
        })

        $("#AP").click(function(){
        	$("#APGroupZone").hide();
        	$("#APZone").show();
        })
 
    }

    function _init() {
        initForm();
        initData();
    }

    function _resize(jParent) {}

    function _destroy() {
        console.log("destory**************");
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Minput","SList","Form","SingleSelect"],
        "utils": ["Base", "Request", "Device"],
    });

})(jQuery);;