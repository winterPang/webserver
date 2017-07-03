(function($) {
    var MODULE_BASE = "p_wireless";
    var MODULE_NAME = MODULE_BASE+".bind";
    var MODULE_RC = "ap_detail_rc";
    var g_stName="";
    
    function getRcText(sRcName) {
        return Utils.Base.getRcString(MODULE_RC, sRcName); 
    }

    function onApBind(aData){
        var aData2=[];
        for(var i=0,len=aData.length;i<len;i++){
            for(j=1,len2=parseInt(aData[i].radioNum);j<=len2;j++){
                var obj={};
                obj={                   
                        apSN:aData[i].apSN,
                        radioId:j,
                        stName:g_stName.stName,
                        apName:aData[i].apName
                     };
                aData2.push(obj);
            }       
        }

    	function apBindOptSuc(){
    		Frame.Msg.info("绑定成功");
            Utils.Base.refreshCurPage();
    	}

        function apBindOptFal(){
            Frame.Msg.info("绑定失败","error");
    	}
        
        var apBindOpt={
          	type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
			data:JSON.stringify({
				devSN:FrameInfo.ACSN,
                deviceModule:"stamgr",
                cloudModule:"stamgr",                
                configType:0,
				method : "SSIDBindByAP",  
				param:aData2	
                   
			}),
            onSuccess:apBindOptSuc,
            onFailed:apBindOptFal,
        } 
        Utils.Request.sendRequest(apBindOpt);
    }

    function onApUnbind(aData){
        var aData2=[];
        for(var i=0,len=aData.length;i<len;i++){
            for(j=1,len2=parseInt(aData[i].radioNum);j<=len2;j++){
                var obj={};
                obj={                   
                        apSN:aData[i].apSN,
                        radioId:j,
                        stName:g_stName.stName,
                        apName:aData[i].apName
                     };
                aData2.push(obj);
            }       
        }
        
    	function rebindApGroupSuc(){
            Frame.Msg.info("解除绑定成功");
            Utils.Base.refreshCurPage();
    	}

        function rebindApGroupFal(){
        	Frame.Msg.info("解除绑定失败","error");
    	}
        var sName = $("span[class*='checked']").parent().next('div').html();
        var rebindApGroup={
          	type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
			data:JSON.stringify({
				devSN:FrameInfo.ACSN,
				deviceModule:"stamgr",
                cloudModule:"stamgr",
				method:"SSIDUnbindByAP",  
                configType:0,
				param:aData2		    
			}),
            onSuccess:rebindApGroupSuc,
            onFailed: rebindApGroupFal 
        } 
        Utils.Request.sendRequest(rebindApGroup);
    }

    function onApGroupBind(aData){
    	var aData2=[];
    	for(i=0,len=aData.length;i<len;i++){
	        for(var j=0,len2=aData[i].modelList.length;j<len2;j++){
	           for(var k=1,len3=parseInt(aData[i].modelList[j].radioNum);k<=len3;k++){
                    var obj={};
                    obj={
                        apGroupName:aData[i].apGroupName ,
                        apModelName:aData[i].modelList[j].model,
                        radioId:k,
                        stName:g_stName.stName
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

    function onApGroupUnbind(aData){
        var aData2=[];
    	for(i=0,len=aData.length;i<len;i++){
	        for(var j=0,len2=aData[i].modelList.length;j<len2;j++){
	           for(var k=1,len3=parseInt(aData[i].modelList[j].radioNum);k<=len3;k++){
	                    var obj={};
	                    obj={
	                        apGroupName:aData[i].apGroupName ,
	                        apModelName:aData[i].modelList[j].model,
	                        radioId:k,
	                        stName:g_stName.stName
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

    function isEnable(oData){
    	if(0 ==oData.length ){
    		return false;
    	}else{
    		return true;
    	}
    }

    function getstbindaplist() {

        function getstbindaplistSuc(aData){   	       	
        	$("#APBindList").SList("refresh",aData.bindApList);
        	$("#APUnbindList").SList("refresh",aData.unbindApList);
        	$("#APZone").hide();
        }

        function getstbindaplistFail(){
            console.log("err");
        }
        
        var getstbindaplistOpt={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getstbindaplist",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,  
                    stName:g_stName.stName               
                },
            onSuccess: getstbindaplistSuc,
            onFailed: getstbindaplistFail
        } 
        Utils.Request.sendRequest(getstbindaplistOpt);  
    }

    function getstbindapgrouplist() {

        function getstbindapgrouplistSuc(aData){   	       	
        	$("#APGroupBindList").SList("refresh",aData.bindApGroupList);
        	$("#APGroupUnbindList").SList("refresh",aData.unbindApGroupList);
        	$("#APZone").hide();
        }

        function getstbindapgrouplistFail(){
            console.log("err");
        }
        
        var getstbindapgrouplistOpt={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getstbindapgrouplist",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,  
                    stName:g_stName.stName               
                },
            onSuccess: getstbindapgrouplistSuc,
            onFailed: getstbindapgrouplistFail
        } 
        Utils.Request.sendRequest(getstbindapgrouplistOpt);  
    }

    function initData() {
    	var APGroupBindListOpt = {
            showHeader: true,
            multiSelect: true,
            pageSize: 5,
            colNames: getRcText("APGROUPBIND"),
            showOperation: false,
            colModel:[
                { name: "apGroupName", datatype: "String"},
                { name: "description", datatype: "String"},                              
            ],           
            buttons:[
            	{ 
            	  name: "leavegroup",
            	  value: getRcText("REBIND"),
            	  action:onApGroupUnbind,
            	  enable: isEnable
            	} 
            ] 
        };
        $("#APGroupBindList").SList("head",APGroupBindListOpt);

        var APGroupUnbindListOpt = {
            showHeader: true,
            multiSelect: true,
            pageSize: 5,
            colNames: getRcText("APGROUPBIND"),
            showOperation: false,
            colModel: [
                { name: "apGroupName", datatype: "String"},
                { name: "description", datatype: "String"}                              
            ],           
            buttons:[
            	{ 
            		name:"joingroup",
            		value: getRcText("APG_BIND"),
            		action:onApGroupBind,
            		enable: isEnable
            	}
            ] 
        };
        $("#APGroupUnbindList").SList("head",APGroupUnbindListOpt);
      
        var APBindListOpt = {
            showHeader: true,
            multiSelect: true,
            pageSize: 5,
            colNames: getRcText("APBIND"),
            showOperation: false,
            colModel: [
                { name: "apName", datatype: "String"},
                { name: "SSID", datatype: "String"},
                { name: "apDesc", datatype:"String"},               
            ],           
            buttons:[
            	{ name: "leaveap",value:getRcText("REBIND"),action: onApUnbind,enable: isEnable}
            ] 
        };
        $("#APBindList").SList("head",APBindListOpt);

        var APUnbindListOpt = {
            showHeader: true,
            multiSelect: true,
            pageSize: 5,
            colNames: getRcText("APBIND"),
            showOperation: false,
            colModel: [
                { name: "apName", datatype: "String"},
                { name: "SSID", datatype: "String"},
                { name: "apDesc", datatype:"String"},               
            ],           
            buttons:[
            	{ name: "joinap",value:getRcText("AP_BIND"),action: onApBind,enable: isEnable}
            ] 
        };
        $("#APUnbindList").SList("head",APUnbindListOpt);

        getstbindaplist();
        getstbindapgrouplist();
    }

    function initForm() {
    	g_stName=Utils.Base.parseUrlPara();

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