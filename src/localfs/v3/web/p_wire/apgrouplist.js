(function ($){
    var MODULE_BASE = "p_wire";
    var MODULE_NAME = MODULE_BASE + ".apgrouplist";
    var MODULE_RC = "apinfo_aplist_rc";
    var g_apgrouplist={};
    var g_aData=[];
    
    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }

    function bind(){

        var aData2=[];
        for(var i=0,len=g_aData.modelList.length;i<len;i++){
           for(var j=1,len2=parseInt(g_aData.modelList[i].radioNum);j<=len2;j++){
                for(k=0,len3=$("span[class*='checked']").length;k<len3;k++){
                    var obj={};
                    obj={
                        apGroupName:g_apgrouplist.apGroupName ,
                        apModelName:g_aData.modelList[i].model,
                        radioId:j,
                        stName:$($("span[class*='checked']")[k]).parent().next('div').html()
                        };
                    aData2.push(obj);
                }
            }
        }

    	function bindApGroupSuc(){
            Frame.Msg.info("绑定成功");
            Utils.Base.refreshCurPage();
    		
    	}

        function bindApGroupFal(){
        	Frame.Msg.info("绑定失败","error");
    	}
        
        var bindApGroup={
          	type: "POST",
            url: MyConfig.path+"/ant/confmgr", 
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                deviceModule:"stamgr",
                cloudModule:"stamgr",                
                configType:0,
                method:"SSIDBindByAPGroup",  
                param:aData2,            
            }),			                 
            onSuccess: bindApGroupSuc,
            onFailed: bindApGroupFal
        } 
        Utils.Request.sendRequest(bindApGroup);

    }

    function rebind(){

        var aData2=[];
        for(var i=0,len=g_aData.modelList.length;i<len;i++){
           for(var j=1,len2=parseInt(g_aData.modelList[i].radioNum);j<=len2;j++){
                for(k=0,len3=$("span[class*='checked']").length;k<len3;k++){
                    var obj={};
                    obj={
                        apGroupName:g_apgrouplist.apGroupName ,
                        apModelName:g_aData.modelList[i].model,
                        radioId:j,
                        stName:$($("span[class*='checked']")[k]).parent().next('div').html()
                        };
                    aData2.push(obj);
                }
            }
        }
    	
    	function rebindApGroupSuc(){
    		Frame.Msg.info("解除绑定成功");
            Utils.Base.refreshCurPage();
    	}

        function rebindApGroupFal(){
        	Frame.Msg.info("解除绑定失败","error");
    	}
        
        var rebindApGroup={
          	type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",

            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                deviceModule:"stamgr",
                cloudModule:"stamgr",                
                configType:0,
                method: "SSIDUnbindByAPGroup",  
                param:aData2,           
            }),
            onSuccess: rebindApGroupSuc,
            onFailed: rebindApGroupFal
        } 
        Utils.Request.sendRequest(rebindApGroup);
    }

    function initGrid(){
    	var bindListOpt = {
            showHeader: true,
            multiSelect: true,
            pageSize: 5,
            colNames: getRcText("Bind_HEADER"),
            showOperation: false,
            colModel: [
                { name: "stName", datatype: "String"},
                { name: "ssid", datatype: "String"},
                { name: "stDesc", datatype: "String"}
            ],    
            buttons: [
            {
                name: "addgroup",
                value: "解除绑定",
                action: rebind,
                enable: isEnable
            }
            ]      
        };
        $("#bindList").SList("head",bindListOpt);

        var unbindListOpt = {
            showHeader: true,
            multiSelect: true,
            pageSize: 5,
            colNames: getRcText("Unbind_HEADER"),
            showOperation: false,
            colModel: [
                { name: "stName", datatype: "String"},
                { name: "ssid", datatype: "String"},
                { name: "stDesc", datatype: "String"}
            ],  
            buttons: [          
            {
                name: "leavegroup",
                value: "绑定服务",
                action: bind,
                enable: isEnable
            }
            ]        
        };
        $("#unbindList").SList("head",unbindListOpt);
    }

    function isEnable(oData){
        if(0 ==oData.length ){
            return false;
        }else{
            return true;
        }
    }

    function initData(){
        //基于设备序列号和AP组名字获取AP组下绑定服务模板列表和未绑定服务模板列表
        function getApGroupBindstListSuc(aData){
            g_aData=aData;
            $("#unbindList").SList ("refresh",aData.stList.stUnBindList);
    		$("#bindList").SList ("refresh",aData.stList.stBindList);
    	}

        function getApGroupBindstListFal(){
        	console.log("err");
    	}
        
        var getApGroupBindstListOpt={
          	type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapgroupbindstlist",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,  
                    apGroupName:g_apgrouplist.apGroupName,           
                },
            onSuccess: getApGroupBindstListSuc,
            onFailed: getApGroupBindstListFal
        } 
        Utils.Request.sendRequest(getApGroupBindstListOpt);
    }

    function initForm(){
         g_apgrouplist=Utils.Base.parseUrlPara();
         $("#return").click(function(){
            var oUrlPara = {
                np: "p_wire.bindservice",                       
            };
       
            Utils.Base.redirect(oUrlPara);
        }) 
    }

    function _init ()
    {
    	initGrid();
        initForm();
        initData();

    }

    function _destroy()
    {
      
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Minput","SList","Form"],
        "utils": ["Base", "Request"]
    });

}) (jQuery);;