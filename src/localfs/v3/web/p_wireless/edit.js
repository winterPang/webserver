(function($) {
    var MODULE_BASE = "p_wireless";
    var MODULE_NAME = MODULE_BASE+".edit";
    var MODULE_RC = "p_wireless_indexConfigure";
    var g_Data="";
    var g_aFoo=[];
    var g_status="";
    
    function getRcText(sRcName) {
        return Utils.Base.getRcString(MODULE_RC, sRcName); 
    }
    //查询认证模板
    function queryTemplate(){
        function queryTemplateSuc(aData){ 
            //写入到选择认证模板下拉框  
            var aData2=[];
            for(var i=0,len=aData.data.length;i<len;i++){
                var obj=aData.data[i].authCfgTemplateName;
                aData2.push(obj);
            } 
            $("#input1").singleSelect("InitData",aData2);                    
        }

        function queryTemplateFail(){
           console.log("err");
        }

        var queryTemplateOpt={
            type: "GET",
            url: MyConfig.v2path+"/authcfg/query",
            dataType: "json",
            contentType: "application/json",
            data:{
                    ownerName:FrameInfo.g_user.attributes.name,                                             
                },           
            onSuccess: queryTemplateSuc,
            onFailed: queryTemplateFail
        } 
        Utils.Request.sendRequest(queryTemplateOpt); 
    }
    //查询页面模板
    function queryThemeTemplate(){
        function queryThemeTemplateSuc(aData){ 
            //写入到查询认证模板下拉框 
            var aData2=[];
            for(var i=0,len=aData.data.length;i<len;i++){
                var obj=aData.data[i].themeName;
                aData2.push(obj);
            } 
            $("#input2").singleSelect("InitData",aData2);                         
        }

        function queryThemeTemplateFail(){
           console.log("err");
        }

        var queryThemeTemplateOpt={
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/query",
            dataType: "json",
            contentType: "application/json",
            data:{
                    ownerName:FrameInfo.g_user.attributes.name,                                             
                },           
            onSuccess: queryThemeTemplateSuc,
            onFailed: queryThemeTemplateFail
        } 
        Utils.Request.sendRequest(queryThemeTemplateOpt);
    }
    //查询微信公众号
    function queryWeixinAccount(){
        function queryWeixinAccountSuc(aData){ 
            //写入到选择微信公众号下拉框 
            var aData2=[];
            for(var i=0,len=aData.data.length;i<len;i++){
                var obj=aData.data[i].name;
                aData2.push(obj);
            } 
            $("#input3").singleSelect("InitData",aData2);                        
        }

        function queryWeixinAccountFail(){
           console.log("err");
        }

        var queryWeixinAccountOpt={
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query",
            dataType: "json",
            contentType: "application/json",
            data:{
                    ownerName:FrameInfo.g_user.attributes.name,                                             
                },           
            onSuccess: queryWeixinAccountSuc,
            onFailed: queryWeixinAccountFail
        } 
        Utils.Request.sendRequest(queryWeixinAccountOpt);
    }
    //查询基本配置
    function getssidlist(){
    	function getssidlistSuc(aData){ 
    		//判断商业还是内部Wi-Fi
            if(aData.ssidList[0].description=="2"){
            	$("#wifi2").click();
            }else{
            	$("#wifi1").click();
            }

            //判断加密服务是否开启
            if(aData.ssidList.akmMode==1){
            	$("#pwdOn").click();
            }else{
            	$("#pwdOff").click();
            }
    		//判断无线服务是否开启
            if(aData.ssidList.status==2){
            	$("#wireless_closed").click();
            }else{
            	$("#wireless_open").click();
            }
            
                                
        }

        function getssidlistFail(){
           console.log("err");
        }

        var getssidlistOpt={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getssidlist",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN, 
                    stName:g_Data.stName                                            
                },           
            onSuccess: getssidlistSuc,
            onFailed: getssidlistFail
        } 
        Utils.Request.sendRequest(getssidlistOpt);
    }
    //查询当前发布管理器
    function queryPubmng(){
        function queryPubmngSuc(aData){  
           //先获取认证模板、页面模板名称，在查询详情 
               
            var theTemName=aData.data.themeTemplateName;     
            if(aData.data){        		         
	            if(theTemName==g_Data.stName){
	            	g_themeStatus=1;
	            	$("#btn5").click();
	            }else if(theTemName!=g_Data.stName){
	            	g_themeStatus=2;
	           		$("#btn6").click();
	           		input(theTemName);	            	
	            }  

	            function input(data){
	            	$("#input2").singleSelect("value",data);
	            }

	            $("#input3").singleSelect("value",aData.data.weixinAccountName);

	            queryTemplate_detail(aData.data.authCfgName);
            }else{
            	g_status=0;
            	$("#btn0").click();
            } 	
            
            judgeAuth();
            
        }

        function queryPubmngFail(){
            Frame.Msg.info("操作失败,请稍后再试","error");
        }

        var queryPubmngOpt={
            type: "GET",
            url: MyConfig.v2path+"/pubmng/querybyname",
            dataType: "json",
            contentType: "application/json",
            data:{
                    ownerName:FrameInfo.g_user.attributes.name,           
                    shopName: Utils.Device.deviceInfo.shop_name, 
                    name:g_Data.stName                                     
                },           
            onSuccess: queryPubmngSuc,
            onFailed: queryPubmngFail
        } 
        Utils.Request.sendRequest(queryPubmngOpt); 
    }
    //查询当前认证模板信息
    function queryTemplate_detail(aData){
        function queryTemplateSuc(aData2){
        	if(aData2.data.authCfgTemplateName!=g_Data.stName){
            		g_status=3;
	           		$("#btn3").click();
	            	$("#input1").singleSelect("value",aData2.data.authCfgTemplateName);
	        }else if(aData2.data.authType==1){
	            	g_status=1;
	            	$("#btn1").click();
            }else if(aData2.data.authType==2){
            	$("#wifi1").prop("checked")?g_status=4:g_status=2;	            	
            	$("#btn2").click();	            	
            }else{
            	return;
            }

           for(var i=0,len=aData2.data.uamAuthParamList.length;i<len;i++){
        		switch(aData2.data.uamAuthParamList[i].authParamName){
        			case "ONLINE_MAX_TIME":
        				$("#onlineTime").val(aData2.data.uamAuthParamList[i].authParamValue/60);
        				break;
        			case "URL_AFTER_AUTH":
        				$("#url").val(aData2.data.uamAuthParamList[i].authParamValue);
        				break;
        			case "IDLE_CUT_TIME":
        				$("#cutTime").val(aData2.data.uamAuthParamList[i].authParamValue);
        				break;
        			case "IDLE_CUT_FLOW":
        				$("#cutFlow").val(aData2.data.uamAuthParamList[i].authParamValue);
        				break;
        			case "NO_SENSATION_TIME":
        				if(aData2.data.uamAuthParamList[i].authParamValue==0){
        					$("#feelauth2").click();
        				}else if(aData2.data.uamAuthParamList[i].authParamValue!=0){
        					$("#feelauth1").click();
        					$("#impose_auth_time").val(aData2.data.uamAuthParamList[i].authParamValue);
        				};       				
        		}           
        	}
        }

        function queryTemplateFail(){
           console.log("err");
        }

        var queryTemplateOpt={
            type: "GET",
            url: MyConfig.v2path+"/authcfg/querybyname",
            dataType: "json",
            contentType: "application/json",
            data:{
                    ownerName:FrameInfo.g_user.attributes.name, 
                    authCfgTemplateName:aData,                                           
                },           
            onSuccess: queryTemplateSuc,
            onFailed: queryTemplateFail
        } 
        Utils.Request.sendRequest(queryTemplateOpt); 
    }
    //查询当前页面模板信息-备
    function queryThemeTemplate_detail(aData){
        function queryThemeTemplateSuc(aData2){ 
            //由于目前页面只有简约一个选项所以不必获取页面模板信息，留待以后备用                      
        }

        function queryThemeTemplateFail(){
           console.log("err");
        }

        var queryThemeTemplateOpt={
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/querybyname",
            dataType: "json",
            contentType: "application/json",
            data:{
                    ownerName:FrameInfo.g_user.attributes.name,
                    themeName:"834_20160712101605927",                                              
                },           
            onSuccess: queryThemeTemplateSuc,
            onFailed: queryThemeTemplateFail
        } 
        Utils.Request.sendRequest(queryThemeTemplateOpt);
    }
    //判断当前无线服务是否有自定义认证模板
    function judgeAuth(){
    	function judgeAuthSuc(aData){ 
           if(aData.errorcode==1103){
           	   g_aFoo.push("addTemplate");
           }else{
           	   g_aFoo.push("modifyTemplate");	
           }
           
        }

        function judgeAuthFail(){
           console.log("err");
        }

        var judgeAuthOpt={
            type: "GET",
            url: MyConfig.v2path+"/authcfg/querybyname",
            dataType: "json",
            contentType: "application/json",
            data:{
                    ownerName:FrameInfo.g_user.attributes.name, 
                    authCfgTemplateName:g_Data.stName,                                           
                },           
            onSuccess: judgeAuthSuc,
            onFailed: judgeAuthFail
        } 
        Utils.Request.sendRequest(judgeAuthOpt);
    }
    //判断当前无线服务是否有自定义页面模板
    function judgeTheme(){
    	function judgeThemeSuc(aData){ 
           if(aData.errorcode==1206){
           	   g_aFoo.push("addThemeTemplate");
           }else{
           	   g_aFoo.push("modifyThemeTemplate");	
           }
        }

        function judgeThemeFail(){
           console.log("err");
        }

        var judgeThemeOpt={
            type: "GET",
            url: MyConfig.v2path+"/authcfg/querybyname",
            dataType: "json",
            contentType: "application/json",
            data:{
                    ownerName:FrameInfo.g_user.attributes.name, 
                    authCfgTemplateName:g_Data.stName,                                           
                },           
            onSuccess: judgeThemeSuc,
            onFailed: judgeThemeFail
        } 
        Utils.Request.sendRequest(judgeThemeOpt);
    }

    //修改基本配置
    function ssidUpdate(){
    	var des,sta;
        g_temName=$("#server").val();
        $("#wifi1").prop("checked")?des=1:des=2;
        $("#wireless_open").prop("checked")?sta=1:sta=2;
        if($("#pwdOn").prop("checked")){
            aData=[{
                    stName:$("#server").val(),
                    ssidName:$("#SSID").val(),
                    akmMode:1,
                    cipherSuite:20,
                    securityIE:3,
                    psk:$("#passw").val(),
                    status:sta,
                    description:des
                }] 
        }else if($("#pwdOff").prop("checked")){
            aData=[{
                    stName:$("#server").val(),
                    ssidName:$("#SSID").val(),             
                    status:sta,
                    description:des
            }]
        }

        function ssidUpdateSuc(){
          	view();                            
        }

        function ssidUpdateFail(){
           Frame.Msg.info("添加失败,请稍后再试","error");
        }
        
        var ssidUpdateOpt={
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    devSN:FrameInfo.ACSN, 
                    configType:0,
                    cloudModule:"stamgr",
                    deviceModule:"stamgr",
                    method:"SSIDUpdate",
                    param:aData                             
                }),           
            onSuccess: ssidUpdateSuc,
            onFailed: ssidUpdateFail
        } 
        Utils.Request.sendRequest(ssidUpdateOpt); 
    }
    //修改认证配置
	//认证模板模块  
    function judgeTemplate(){
    	if($("#wifi2").prop("checked")){
    		if(g_status==0){//初始为不认证状态
	    		if($("#btn1").prop("checked")||$("#btn2").prop("checked")){//修改为一键登录或者账号登录 
		    		//查询发布模板-a.无该发布模板：增加发布模板 
		    		//			   b.存在该发布模板：修改发布模板    		 
		    		//增加发布管理-发布
		    		judgeAuth();
		    		g_aFoo.push("addPubmng");
		    	}else if($("#btn3").prop("checked")){//修改为模板登录 
		    		//增加发布管理-发布        			    			
		    		g_aFoo.push("addPubmng"); 
	    		}
	    	}else if(g_status==1){//初始为一键登录
	    		if($("#btn0").prop("checked")){//修改为不认证 
	    			//取消发布-删除发布管理
	    			g_aFoo.push("disPublish"); 
		    		g_aFoo.push("deletePubmng");	    		 	 
	    		}else if($("#btn1").prop("checked")){//修改高级设置
	    			//修改认证模板
	    			g_aFoo.push("modifyTemplate"); 			
	    		}else if($("#btn2").prop("checked")){//修改为账号登录 
	    			//修改认证模板
	    			g_aFoo.push("modifyTemplate");
	    		}else if($("#btn3").prop("checked")){//修改为模板登录 
	    			//取消发布-修改发布管理-发布
	    			g_aFoo.push("disPublish"); 
		    		g_aFoo.push("modifyPubmng");;
	    		}  		
	    	}else if(g_status==2||g_status==4){//初始为账号登录
	    		if($("#btn0").prop("checked")){//修改为不认证 
	    			//取消发布-删除发布管理 
	    			g_aFoo.push("disPublish"); 
		    		g_aFoo.push("deletePubmng"); 
	    		}else if($("#btn1").prop("checked")){//修改为一键登录 
	    			//修改认证模板
	    			g_aFoo.push("modifyTemplate"); 			
	    		}else if($("#btn2").prop("checked")){//更换账号登录方式或高级配置
	    			// 修改认证模板
	    			g_aFoo.push("modifyTemplate"); 
	    		}else if($("#btn3").prop("checked")){//修改为模板登录 
	    			//取消发布-修改发布管理-发布
	    			g_aFoo.push("disPublish");
	    			g_aFoo.push("modifyPubmng");     			
	    		}
	    	}else if(g_status==3){//初始为模板登录
	    		if($("#btn0").prop("checked")){//修改为不认证 
	    			//取消发布-删除发布管理 
	    			g_aFoo.push("disPublish");
	    			g_aFoo.push("deletePubmng"); 
	    		}else if($("#btn1").prop("checked")||$("#btn2").prop("checked")){//修改为修改为一键登录或者账号登录 取消发布
	    			g_aFoo.push("dispublish");  	    			
	    			//查询发布模板-a.无该页面模板：增加页面模板 
	    			//			   b.存在该页面模板：修改页面模板    		 
		    		//修改发布管理-发布	  
		    		judgeAuth();
		    		g_aFoo.push("modifyPubmng");  		
		    	}else if($("#btn3").prop("checked")){//更换模板 
		    		//取消发布-修改发布管理-发布
		    		g_aFoo.push("disPublish");
		    		g_aFoo.push("modifyPubmng"); 
		    	} 
		    }
    	}else if($("#wifi1").prop("checked")){
    		if(g_status==0){//初始为不认证状   		
	    		judgeAuth();
	    		g_aFoo.push("addPubmng");	    		    		
	    	}else if(g_status==1){//初始为一键登录	    		
    			//修改认证模板
    			g_aFoo.push("modifyTemplate");	    	  		
	    	}else if(g_status==2||g_status==4){//初始为账号登录    					
    			// 修改认证模板
    			g_aFoo.push("modifyTemplate"); 	    		
	    	}else if(g_status==3){//初始为模板登录
	    		g_aFoo.push("dispublish"); 
	    		judgeAuth();
	    		g_aFoo.push("modifyPubmng");		    	 
		    }
    	}
    	 		
    }
    //页面模板模块  
    function judgeThemeTemplate(){
    	if(g_themeStatus==1){//简约  		
    		if($("#btn6").prop("checked")){//改为模板 
    			//取消发布-修改发布-发布 
    			g_aFoo.push("disPublish");
	    		g_aFoo.push("modifyPubmng");
    		}		
    	}else{//模板
    		if($("#btn5").prop("checked")){//改为简约 
    			//取消发布-查询页面模板-a.无该页面模板：增加页面模板 
	    		//			   			b.存在该页面模板：修改页面模板		   
    			//修改发布管理-发布
    			judgeTheme();
    			g_aFoo.push("modifyPubmng");
    		}else if($("#btn6").prop("checked")){//修改模板 
    			//取消发布-修改发布管理-发布
    			g_aFoo.push("disPublish");
	    		g_aFoo.push("modifyPubmng");
    		}    		
    	}
    }  
    //收集者
    function view(){
    	if(g_status!=0||!$("#btn0").prop("checked")){
    		judgeTemplate();
    		judgeThemeTemplate(); 
	    	if(g_aFoo.indexOf("disPublish")!=-1){
	    		disPublish();
	    	};
	    	if(g_aFoo.indexOf("deletePubmng")!=-1){
	    		deletePubmng();
	    	};	
	    	if(g_aFoo.indexOf("modifyTemplate")!=-1){
	    		modifyTemplate();
	    	};
	    	if(g_aFoo.indexOf("addTemplate")!=-1){
	    		addTemplate();
	    	};
	    	if(g_aFoo.indexOf("modifyThemeTemplate")!=-1){
	    		modifyThemeTemplate();
	    	};
	    	if(g_aFoo.indexOf("addThemeTemplate")!=-1){
	    		addThemeTemplate();
	    	};
	    	if(g_aFoo.indexOf("addPubmng")!=-1){
	    		addPubmng();
	    	};
	    	if(g_aFoo.indexOf("modifyPubmng")!=-1){
	    		modifyPubmng();
	    	};
    	}   	
    }
    

    //增加认证模板
    function addTemplate(){
    	var nosen;
        if($("#feelauth1").prop("checked")){
            $("#impose_auth_time").val()==""?nosen=7:nosen=$("#impose_auth_time").val();
        }else if($("#feelauth2").prop("checked")){
            nosen=0;
        }

        function addTemplateSuc(){ 
                                         
            }

        function addTemplateFail(){
           Frame.Msg.info("操作失败,请稍后再试","error");
        }

        var addTemplateOpt={
            type: "POST",
            url: MyConfig.v2path+"/authcfg/add",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    ownerName:FrameInfo.g_user.attributes.name,
                    authCfgTemplateName:g_Data.stName,
                    authType:1,   
                    isEnableSms:0,
                    isEnableWeixin:0,
                    isEnableAccount:0,
                    isWeixinConnectWifi:0,
                    isEnableAli:0,
                    isEnableQQ:0,  
                    uamAuthParamList:[
                        {authParamName:"ONLINE_MAX_TIME",authParamValue:$("#onlineTime").val()==""?21600:$("#onlineTime").val()*60},
                        {authParamName:"URL_AFTER_AUTH",authParamValue:$("#url").val()==""?"":$("#url").val()},
                        {authParamName:"IDLE_CUT_TIME",authParamValue:$("#cutTime").val()==""?30:$("#cutTime").val()},
                        {authParamName:"IDLE_CUT_FLOW",authParamValue:$("#cutFlow").val()==""?10240:$("#cutFlow").val()},
                        {authParamName:"NO_SENSATION_TIME",authParamValue:nosen}
                    ]                           
                }),           
            onSuccess: addTemplateSuc,
            onFailed: addTemplateFail
        } 
        Utils.Request.sendRequest(addTemplateOpt);        
    }
    //修改认证模板
    function modifyTemplate(){
    	var nosen;
        if($("#feelauth1").prop("checked")){
            $("#impose_auth_time").val()==""?nosen=7:nosen=$("#impose_auth_time").val();
        }else if($("#feelauth2").prop("checked")){
            nosen=0;
        }

        function modifyTemplateSuc(aData){         
           
        }

        function modifyTemplateFail(){
           console.log("err");
        }


        var  modifyTemplateOpt={
            type: "POST",
            url: MyConfig.v2path+"/authcfg/modify",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    ownerName:FrameInfo.g_user.attributes.name,
                    authCfgTemplateName:g_Data.stName,
                    authType:1,   
                    isEnableSms:0,
                    isEnableWeixin:0,
                    isEnableAccount:0,
                    isWeixinConnectWifi:0,
                    isEnableAli:0,
                    isEnableQQ:0,  
                    uamAuthParamList:[
                        {authParamName:"ONLINE_MAX_TIME",authParamValue:$("#onlineTime").val()==""?21600:$("#onlineTime").val()*60},
                        {authParamName:"URL_AFTER_AUTH",authParamValue:$("#url").val()==""?"":$("#url").val()},
                        {authParamName:"IDLE_CUT_TIME",authParamValue:$("#cutTime").val()==""?30:$("#cutTime").val()},
                        {authParamName:"IDLE_CUT_FLOW",authParamValue:$("#cutFlow").val()==""?10240:$("#cutFlow").val()},
                        {authParamName:"NO_SENSATION_TIME",authParamValue:nosen}
                    ]                           
                }),           
            onSuccess: modifyTemplateSuc,
            onFailed: modifyTemplateFail
        } 
        Utils.Request.sendRequest( modifyTemplateOpt);         
    }
    //删除认证模板
    function deleteTemplate(){
        function deleteTemplateSuc(){ 
                                    
        }

        function deleteTemplateFail(){
           
        }
   
        var deleteTemplateOpt={
            type: "POST",
            url: MyConfig.v2path+"/authcfg/add",
            dataType: "json",
            contentType: "application/json",
            data:{
                    ownerName:FrameInfo.g_user.attributes.name,
                    authCfgTemplateName:g_Data.stName,                                           
                },           
            onSuccess: deleteTemplateSuc,
            onFailed: deleteTemplateFail
        } 
        Utils.Request.sendRequest(deleteTemplateOpt);
    }       
    
    //增加页面模板
    function addThemeTemplate(){
    	function addThemeTemplateSuc(){ 
                                       
        }

        function addThemeTemplateFail(){
           Frame.Msg.info("增加页面模板失败,请稍后再试","error");
        }

        var addThemeTemplateOpt={
            type: "POST",
            url: MyConfig.v2path+"/themetemplate/add",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    ownerName:FrameInfo.g_user.attributes.name,           
                    themeName:g_Data.stName,
                    v3flag:0,
                    description:"auto themeTemplate"                           
                }),           
            onSuccess: addThemeTemplateSuc,
            onFailed: addThemeTemplateFail
        } 
        Utils.Request.sendRequest(addThemeTemplateOpt);                  
    }
    //修改页面模板
    function modifyThemeTemplate(){
        if($("#btn5").prop("checked")){
            function addThemeTemplateSuc(){ 
                g_themeTemplateName=g_temName;
                addPubmng();                             
            }

            function addThemeTemplateFail(){
               Frame.Msg.info("添加失败,请稍后再试","error");
            }

            var addThemeTemplateOpt={
                type: "POST",
                url: MyConfig.v2path+"/themetemplate/add",
                dataType: "json",
                contentType: "application/json",
                data:JSON.stringify({
                        ownerName:FrameInfo.g_user.attributes.name,           
                        themeName:$("#server").val(),
                        v3flag:0,
                        description:"auto themeTemplate"                           
                    }),           
                onSuccess: addThemeTemplateSuc,
                onFailed: addThemeTemplateFail
            } 
            Utils.Request.sendRequest(addThemeTemplateOpt);            
        }else{
            g_themeTemplateName=$("#input2").val();
            addPubmng(); 
        }
    }
    //删除页面模板
    function deleteThemeTemplate(){
        if($("#btn5").prop("checked")){
            function addThemeTemplateSuc(){ 
                g_themeTemplateName=g_temName;
                addPubmng();                             
            }

            function addThemeTemplateFail(){
               Frame.Msg.info("添加失败,请稍后再试","error");
            }

            var addThemeTemplateOpt={
                type: "POST",
                url: MyConfig.v2path+"/themetemplate/add",
                dataType: "json",
                contentType: "application/json",
                data:JSON.stringify({
                        ownerName:FrameInfo.g_user.attributes.name,           
                        themeName:$("#server").val(),
                        v3flag:0,
                        description:"auto themeTemplate"                           
                    }),           
                onSuccess: addThemeTemplateSuc,
                onFailed: addThemeTemplateFail
            } 
            Utils.Request.sendRequest(addThemeTemplateOpt);            
        }else{
            g_themeTemplateName=$("#input2").val();
            addPubmng(); 
        }
    }
    

    //增加发布管理
    function addPubmng(){
    	var auth;
    	if($("#wifi2").prop("checked")){
    		$("#btn3").prop("checked")?auth=$("#input1").val():auth=g_Data.stName;
    	}else if($("#wifi1").prop("checked")){
    		auth=g_Data.stName;
    	}

        function addPubmngSuc(){  
            publish();                             
        }

        function addPubmngFail(){
            Frame.Msg.info("操作失败,请稍后再试","error");
        }

        var addPubmngOpt={
            type: "POST",
            url: MyConfig.v2path+"/pubmng/add",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    ownerName:FrameInfo.g_user.attributes.name,           
                    name:g_Data.stName,
                    shopName: Utils.Device.deviceInfo.shop_name,
                    weixinAccountName:$("#input3").val(),
                    authCfgName:auth, 
                    themeTemplateName:$("#btn6").prop("checked")?$("#input2").val():g_Data.stName                       
                }),           
            onSuccess: addPubmngSuc,
            onFailed: addPubmngFail
        } 
        Utils.Request.sendRequest(addPubmngOpt); 
    }
    //修改发布管理
    function modifyPubmng(){
    	var auth;
    	if($("#wifi2").prop("checked")){
    		$("#btn3").prop("checked")?auth=$("#input1").val():auth=g_Data.stName;
    	}else if($("#wifi1").prop("checked")){
    		auth=g_Data.stName;
    	}

        function modifyPubmngSuc(){  
            publish();                             
        }

        function modifyPubmngFail(){
        }

        var modifyPubmngOpt={
            type: "POST",
            url: MyConfig.v2path+"/pubmng/modify",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    ownerName:FrameInfo.g_user.attributes.name,           
                    name:g_Data.stName,
                    shopName: Utils.Device.deviceInfo.shop_name,
                    weixinAccountName:$("#input3").val(),
                    authCfgName:auth, 
                    themeTemplateName:$("#btn6").prop("checked")?$("#input2").val():g_Data.stName                      
                }),           
            onSuccess: modifyPubmngSuc,
            onFailed: modifyPubmngFail
        } 
        Utils.Request.sendRequest(modifyPubmngOpt); 
    }
    //删除发布管理
    function deletePubmng(){
        function deletePubmngSuc(){  
                                        
        }

        function deletePubmngFail(){
            Frame.Msg.info("操作失败,请稍后再试","error");
        }

        var deletePubmngOpt={
            type: "POST",
            url: MyConfig.v2path+"/pubmng/delete",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    ownerName:FrameInfo.g_user.attributes.name,                             
                    shopName: Utils.Device.deviceInfo.shop_name, 
                    name:g_Data.stName                                        
                }),           
            onSuccess: deletePubmngSuc,
            onFailed: deletePubmngFail
        } 
        Utils.Request.sendRequest(deletePubmngOpt); 
    }
    
    //发布
    function publish(){
        function publishSuc(){                               
        }

        function publishFail(){
           Frame.Msg.info("添加失败,请稍后再试","error");
        }

        var publishOpt={
            type: "POST",
            url: MyConfig.v2path+"/pubmng/publish",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    ownerName:FrameInfo.g_user.attributes.name, 
                    shopName: Utils.Device.deviceInfo.shop_name,          
                    name:g_temName,
                    isPublish:true                          
                }),           
            onSuccess: publishSuc,
            onFailed: publishFail
        } 
        Utils.Request.sendRequest(publishOpt);
    }
    //取消发布
    function disPublish(){
        function publishSuc(){                               
        }

        function publishFail(){
           Frame.Msg.info("添加失败,请稍后再试","error");
        }

        var publishOpt={
            type: "POST",
            url: MyConfig.v2path+"/pubmng/publish",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    ownerName:FrameInfo.g_user.attributes.name, 
                    shopName: Utils.Device.deviceInfo.shop_name,          
                    name:g_temName,
                    isPublish:false                          
                }),           
            onSuccess: publishSuc,
            onFailed: publishFail
        } 
        Utils.Request.sendRequest(publishOpt);
    } 
 
    function initData() {
        $("#server").val(g_Data.stName);
        $("#SSID").val(g_Data.ssidName); 

        queryTemplate();
        queryThemeTemplate();
        queryWeixinAccount();  
        getssidlist(); 
        queryPubmng(); 
    };

    function initForm() {
    	$("#return").click(function(){
            var oUrlPara = {
                np: "p_wireless.index",                       
            };
       
            Utils.Base.redirect(oUrlPara);
        })       

        $("#pwdOn,#wifi1").click(function(){
            $("#pwd").show(300);
            $("#pwdOn").next("span").addClass("checked");
            $("#pwdOff").next("span").removeClass("checked");
        })

        $("#pwdOff,#wifi2").click(function(){
            $("#pwd").hide(300);
            $("#pwdOff").next("span").addClass("checked");
            $("#pwdOn").next("span").removeClass("checked");
        })

        $("#wifi1").click(function(){
            $("#innerwifi").show();
            $("#buswifi").hide();  
            $("#advanceBtn").unbind().click(function () {
	            $("#gaojishezhiArea").toggle();
	            $("#AdvanceClose").toggleClass("advan_set3");
	            return false;
	        })          
        })

        $("#wifi2").click(function(){
            $("#innerwifi").hide();
            $("#buswifi").show();
        })
           
        $("#APGroup").click(function(){
            $("APZone").addClass("hide");
            $("APGroupZone").removeClass("hide");           
        })

        $("#AP").click(function(){
            $("APZone").removeClass("hide");
            $("APGroupZone").addClass("hide");          
        })

        $("#btn5").click(function(){
            $("#s2id_input2").css("display","none");
        })

        $("#btn6").click(function(){
            $("#s2id_input2").css("display","block");
        })

        $("#btn3").click(function(){
            $("#s2id_input1").css("display","block");
            $("#gaojishezhiArea").hide();
            $("#advanceBtn").unbind();
        })

        $("#btn0,#btn1,#btn2,").click(function(){
            $("#s2id_input1").css("display","none");
            $("#advanceBtn").unbind().click(function () {
	            $("#gaojishezhiArea").toggle();
	            $("#AdvanceClose").toggleClass("advan_set3");
	            return false;
	        })
        })

        $("#advanceBtn").click(function () {
            $("#gaojishezhiArea").toggle();
            $("#AdvanceClose").toggleClass("advan_set3");
            return false;
        });

        $("#feelauth1").click(function(){
            $("#anthTime").show();
        })

        $("#feelauth2").click(function(){
            $("#anthTime").hide();
        })  

        $("#saveModify").click(function(){
        	ssidUpdate();
        })
    }

    function _init() {
    	g_Data=Utils.Base.parseUrlPara();
        initForm();
        initData();
    }
   
    function _destroy() {
        console.log("destory**************");
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Minput","SList","Form","SingleSelect"],
        "utils": ["Base", "Request", "Device"],
    });

})(jQuery);;