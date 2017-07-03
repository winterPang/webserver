(function($) {
    var MODULE_BASE = "hq_wirelessfwpz";
    var MODULE_NAME = MODULE_BASE+".edit";
    var MODULE_RC = "p_wireless_indexConfigure";
    var g_Data="";
    
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
            if(aData.ssidList.status==1){
            	$("#wireless_open").prop("checked",true);
            	$("#wireless_open").next("span").addClass("checked");
            	$("#wireless_closed").next("span").removeClass("checked");
            }else if(aData.ssidList.status==2){
            	$("#wireless_closed").prop("checked",true);
            	$("#wireless_closed").next("span").addClass("checked");
            	$("#wireless_open").next("span").removeClass("checked");
            }

            if(aData.ssidList.status==1){
            	$("#wireless_open").prop("checked",true);
            	$("#wireless_open").next("span").addClass("checked");
            	$("#wireless_closed").next("span").removeClass("checked");
            }else{
            	$("#wireless_closed").prop("checked",true);
            	$("#wireless_closed").next("span").addClass("checked");
            	$("#wireless_open").next("span").removeClass("checked");
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
    //查询当前认证模板
    function queryTemplate_detail(){
        function queryTemplateSuc(aData){ 
            aaaa                   
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
                    authcfgTemplateName:g_Data.stName,                                           
                },           
            onSuccess: queryTemplateSuc,
            onFailed: queryTemplateFail
        } 
        Utils.Request.sendRequest(queryTemplateOpt); 
    }
    //查询当前页面模板
    //查询当前发布管理器

    //修改无线服务
    function ssidUpdate(){
    	var des,sta;
        g_temName=$("#server").val();
        $("#wifi1").prop("checked")?des=0:des=1;
        $("#wireless_open").prop("checked")?sta=0:sta=1;

        function ssidUpdateSuc(){
          	//调用更新认证配置接口                                 
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
                    param:[{
                        stName:g_Data.stName,
                        ssidName:g_Data.ssidName,
                        akmMode:1,
                        cipherSuite:20,
                        securityIE:3,
                        psk:$("#passw").val(),
                        status:sta,
                        description:des
                    }]                             
                }),           
            onSuccess: ssidUpdateSuc,
            onFailed: ssidUpdateFail
        } 
        Utils.Request.sendRequest(ssidUpdateOpt); 
    }
    //修改当前认证模板
    //修改当前页面模板
    //修改当前发布管理器

    
    function initData() {
        $("#server").val(g_Data.stName);
        $("#SSID").val(g_Data.ssidName); 

        queryTemplate();
        queryThemeTemplate();
        queryWeixinAccount();  
        getssidlist(); 
        queryTemplate_detail();  
    };

    function initForm() {    	
    	$("#return").click(function(){
            var oUrlPara = {
                np: "hq_wirelessfwpz.index",                       
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
           
        $("#APGroup").click(function(){
            $("APZone").addClass("hide");
            $("APGroupZone").removeClass("hide");           
        })

        $("#AP").click(function(){
            $("APZone").removeClass("hide");
            $("APGroupZone").addClass("hide");          
        })

        $("#btn1").click(function(){
            $("#s2id_input2").css("display","none");
        })

        $("#btn2").click(function(){
            $("#s2id_input2").css("display","block");
        })

        $("#btn6").click(function(){
            $("#s2id_input1").css("display","block");
        })

        $("#btn3,#btn3,#btn5,").click(function(){
            $("#s2id_input1").css("display","none");
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