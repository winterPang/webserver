(function ($){
    var MODULE_BASE = "p_wire";
    var MODULE_NAME = MODULE_BASE + ".aplist";
    var MODULE_RC = "apinfo_aplist_rc";
    var g_aplist={};
    
    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }

    function apBind(){

        var aData2=[];
        for(var i=1;i<=parseInt(g_aplist.radioId);i++){
            for(j=0,len=$("span[class*='checked']").length;j<len;j++){
                var obj={};
                obj={                   
                        apSN:g_aplist.apSN,
                        radioId:i,
                        stName: $($("span[class*='checked']")[j]).parent().next('div').html(),
                        apName:g_aplist.apName
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

    function apRebind(){
        var aData2=[];
        for(var i=1;i<=parseInt(g_aplist.radioId);i++){
            for(j=0,len=$("span[class*='checked']").length;j<len;j++){
                var obj={};
                obj={                   
                        apSN:g_aplist.apSN,
                        radioId:i,
                        stName: $($("span[class*='checked']")[j]).parent().next('div').html(),
                        apName:g_aplist.apName
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

    function getApBindstList(){
    	
    	
        //基于设备序列号和AP名字获取AP下绑定服务模板列表和未绑定服务模板列表
        function getApBindstListSuc(aData){

        	var  aunBindList=[];
        	var  abindList=[];

        	$.each(aData.stList.stUnBindList,function(key,value){
        		var oUnBind={};
        		oUnBind.stName=value.stName;
        		oUnBind.stDesc=value.stDesc;
        		aunBindList.push(oUnBind);
        	})

        	$.each(aData.stList.stBindList,function(key,value){
        		var oBind={};
        		oBind.stName=value.stName;
        		oBind.stDesc=value.stDesc;
        		abindList.push(oBind);
        	})


    		$("#unbindList").SList ("refresh",aunBindList);
    		$("#bindList").SList ("refresh",abindList);
    		
    	}

        function getApBindstListFal(){
        	console.log("err");
    	}
        
        var getApBindstList={
          	type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapbindstlist",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,   
                    apName:g_aplist.apName,              
                },
            onSuccess: getApBindstListSuc,
            onFailed: getApBindstListFal
        } 
        Utils.Request.sendRequest(getApBindstList);  
    }

    function isEnable(oData){
    	if(0 ==oData.length ){
    		return false;
    	}else{
    		return true;
    	}
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
                name: "apUnbind",
                value: "解除绑定",
                action: apRebind,
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
                action: apBind,
                enable: isEnable
            }
            ]        
        };
        $("#unbindList").SList("head",unbindListOpt);
    }

    function initData(){
        g_aplist=Utils.Base.parseUrlPara();
    	getApBindstList();  
        /*getssidlist();*/
    }

    function initForm(){
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
        "widgets": ["SList", "Form", "Typehead", "Minput"],
        "utils": ["Base","Device","Request"],
        "subModules": []

    });

}) (jQuery);;