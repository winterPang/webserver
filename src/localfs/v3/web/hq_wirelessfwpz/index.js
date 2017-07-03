(function($) {
    var MODULE_BASE = "hq_wirelessfwpz";
    var MODULE_NAME = MODULE_BASE+".index";
    var MODULE_RC = "p_wireless_indexConfigure";
    var g_temName="";
    var g_templateName="";
    var g_themeTemplateName="";
    
    function getRcText(sRcName) {
        return Utils.Base.getRcString(MODULE_RC, sRcName); 
    }

    //添加按钮
    function onZengjia(){
        $("#zengjia_form").form ("init", "edit", {"title":getRcText("ADD_SER"),
            "btn_apply":onRenzheng, 
            "btn_cancel":true});
        Utils.Base.openDlg(null, null, {scope:$("#zengjia"),className:"modal-super"});               
    }
    //跳转认证配置
    function onRenzheng(){
        var des,sta,aData;
        g_temName=$("#server").val();
        $("#wifi1").prop("checked")?des=0:des=1;
        $("#wireless_open").prop("checked")?sta=0:sta=1;
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
            if($("#pNo").next("span").hasClass("checked")){
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#zengjia"))); 
            }else{
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#zengjia"))); 
                $("#renzheng_form").form ("init", "edit", {"title":getRcText("Renzheng"),
                    "btn_apply":onBangding, 
                    "btn_cancel":true});
                Utils.Base.openDlg(null, null, {scope:$("#renzheng"),className:"modal-super"});

                if($("#wifi1").next("span").hasClass("checked")){
                    $("#buswifi").hide();
                    $("#innerwifi").show();
                }else{
                    $("#buswifi").show();
                    $("#innerwifi").hide(); 
                }           
            }              
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
    //跳转绑定详情页
    function onBangding(){
        addTemplate();
        if($("#goBind").next("span").hasClass("checked")){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#renzheng")));
            var oUrlPara = {
                np: MODULE_BASE + ".bind",            
            };
            Utils.Base.redirect(oUrlPara); 
        }else{
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#renzheng")));
        }
    }
    //同步按钮
    function onTongbu(){

        function ssidDeleteSuc(){
            Frame.Msg.info("同步成功");                
        }

        function ssidDeleteFail(){
           Frame.Msg.info("同步失败","error");
        }
        
        var ssidDeleteOpt={
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    devSN:FrameInfo.ACSN, 
                    configType:0,
                    cloudModule:"stamgr",
                    deviceModule:"stamgr",
                    method:"SyncSSIDList"                             
                }),           
            onSuccess: ssidDeleteSuc,
            onFailed: ssidDeleteFail
        } 
        Utils.Request.sendRequest(ssidDeleteOpt);   
    }
    //编辑按钮
    function onEdit(aData){
        var oUrlPara = {
            np: MODULE_BASE + ".edit", 
            stName:aData[0].stName,
            ssidName:aData[0].ssidName           
            };           
        Utils.Base.redirect(oUrlPara);       
    }
    //绑定按钮
    function onBind(aData){
        var oUrlPara = {
            np: MODULE_BASE + ".bind", 
            stName:aData[0].stName,            
            };           
        Utils.Base.redirect(oUrlPara); 
    }
    //删除按钮
    function onDelete(aData){
        function ssidDeleteSuc(aData2){
            if(aData2.deviceResult[0].result=="success"){
                Frame.Msg.info("删除成功"); 
                Utils.Base.refreshCurPage(); 
            }else{
                Frame.Msg.info("该无线服务上绑定有AP/AP组,请先解绑再进行删除操作","error");
            }              
        }

        function ssidDeleteFail(){
           Frame.Msg.info("删除失败","error");
        }
        
        var ssidDeleteOpt={
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    devSN:FrameInfo.ACSN, 
                    configType:0,
                    cloudModule:"stamgr",
                    deviceModule:"stamgr",
                    method:"SSIDDelete",
                    param:[
                        {stName:aData[0].stName}
                    ]            
                }),
            onSuccess: ssidDeleteSuc,
            onFailed: ssidDeleteFail
        } 
        Utils.Request.sendRequest(ssidDeleteOpt);  
    }
    
    //link start      
    function showLinkAP(row, cell, value, columnDef, dataContext, type) {
        value = value || "";

        if(""!= value){ 
            return '<a class="list-link" cell="'+cell+'"'+'stName="'+dataContext.stName+'">'+value+'</a>';
        }else{
            return '<a class="list-link" cell="'+cell+'"'+'stName="'+dataContext.stName+'">'+0+'</a>';
        }
    }

    function showLinkAPGroup(row, cell, value, columnDef, dataContext, type) {
        value = value || "";

        if(""!= value){           
            return '<a class="list-link"  type="apName" cell="'+cell+'"'+' stName="'+dataContext.stName +'">'+value+'</a>';
        }else{
            return '<a class="list-link"  type="apName" cell="'+cell+'"'+' stName="'+dataContext.stName +'">'+0+'</a>';
        }
    }

    function onDisDetailAP() {
        var sType =$(this).attr("cell");
        getssidinfobrief2($(this).attr("stname"));

        if(sType==5){
            $("#AP_form").form ("init", "edit", {"title":getRcText("WIRELESS_SER2"),
                "btn_apply":false, 
                "btn_cancel":false});
            Utils.Base.openDlg(null, null, {scope:$("#AP"),className:"modal-super"});  
        }else if(sType==4){           
            $("#APGroup_form").form ("init", "edit", {"title":getRcText("WIRELESS_SER"),
                "btn_apply":false, 
                "btn_cancel":false});
            Utils.Base.openDlg(null, null, {scope:$("#APGroup"),className:"modal-super"}); 
        }             
    }
    //link end

    //无线服务信息总览
    function getssidinfobrief() {
        function getssidinfobriefSuc(aData){
            for(var i=0,len=aData.ssidList.length;i<len;i++){
                aData.ssidList[i].status==1?(aData.ssidList[i].status=getRcText("STATUS").split(",")[0]):(aData.ssidList[i].status=getRcText("STATUS").split(",")[1])               
                if(aData.ssidList[i].lvzhouAuthMode==0){
                    aData.ssidList[i].lvzhouAuthMode=getRcText("AUTHEN_TYPE").split(",")[0]
                }else if(aData.ssidList[i].lvzhouAuthMode==1){
                    aData.ssidList[i].lvzhouAuthMode=getRcText("AUTHEN_TYPE").split(",")[1]
                }else if(aData.ssidList[i].lvzhouAuthMode==2){
                    aData.ssidList[i].lvzhouAuthMode=getRcText("AUTHEN_TYPE").split(",")[2]
                }
            }
            $("#peizhi_list").SList("refresh",aData.ssidList);                 
        }

        function getssidinfobriefFail(){
            console.log("err");
        }
        
        var getssidinfobriefOpt={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getssidinfobrief",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,
                    ownerName:FrameInfo.g_user.attributes.name,
                    shopName:Utils.Device.deviceInfo.shop_name
                },
            onSuccess: getssidinfobriefSuc,
            onFailed: getssidinfobriefFail
        } 
        Utils.Request.sendRequest(getssidinfobriefOpt);   
    }
    //单个无线服务信息详情
    function getssidinfobrief2(data) {

        function getssidinfobriefSuc(aData){
            var aData2=[],oData={},aData3=[],oData2={};
            for(var i=0,len=aData.ssidList[0].bindApList.length;i<len;i++){
                if(!oData[aData.ssidList[0].bindApList[i].ApName]&&aData.ssidList[0].bindApList[i].isInherit==0){
                    oData[aData.ssidList[0].bindApList[i].ApName]=true;
                    aData2.push(aData.ssidList[0].bindApList[i]);
                }
            }
            for(var i=0,len=aData.ssidList[0].bindApGroupList.length;i<len;i++){
                if(!oData2[aData.ssidList[0].bindApGroupList[i].ApGroupName]){
                    oData2[aData.ssidList[0].bindApGroupList[i].ApGroupName]=true;
                    aData3.push(aData.ssidList[0].bindApGroupList[i]);
                }
            }

            $("#APList").SList ("refresh",aData2);
            $("#APGruopList2").SList ("refresh",aData3);             
        }

        function getssidinfobriefFail(){
            console.log("err");
        }
        
        var getssidinfobriefOpt={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getssidinfobrief",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,  
                    stName:data,                
                },
            onSuccess: getssidinfobriefSuc,
            onFailed: getssidinfobriefFail
        } 
        Utils.Request.sendRequest(getssidinfobriefOpt);  
    }
    //这是干嘛的？？？？好像没什么用啊
    function getapbindstcount() {
       
        function getapbindstcountSuc(aData){
                     
        }

        function getapbindstcountFail(){
            console.log("err");
        }
        
        var getapbindstcountOpt={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapbindstcount",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,                 
                },
            onSuccess: getapbindstcountSuc,
            onFailed: getapbindstcountFail
        } 
        Utils.Request.sendRequest(getapbindstcountOpt);  
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

    //增加认证模板
    function addTemplate(){
        if($("#btn3").prop("checked")){
            
        }else if($("#btn4").prop("checked")||$("#btn5").prop("checked")||$("#btn7").prop("checked")){
            var at;
            $("#btn4").prop("checked")?at=1:at=2;

            function addTemplateSuc(){ 
                g_templateName=$("#server").val();
                addThemeTemplate();                         
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
                        authCfgTemplateName:$("#server").val(),
                        authType:at,   
                        isEnableSms:0,
                        isEnableWeixin:0,
                        isEnableAccount:0,
                        isWeixinConnectWifi:0,
                        isEnableAli:0,
                        isEnableQQ:0,  
                        uamAuthParamList:[
                            {authParamName:"ONLINE_MAX_TIME",authParamValue:$("#onlineTime").val()==""?21600:$("#onlineTime").val()},
                            {authParamName:"URL_AFTER_AUTH",authParamValue:$("#url").val()==""?"":$("#url").val()},
                            {authParamName:"IDLE_CUT_TIME",authParamValue:$("#cutTime").val()==""?30:$("#cutTime").val()},
                            {authParamName:"IDLE_CUT_FLOW",authParamValue:$("#cutFlow").val()==""?10240:$("#cutFlow").val()},
                            {authParamName:"NO_SENSATION_TIME",authParamValue:$("#impose_auth_time").val()==""?7:$("#impose_auth_time").val()}
                        ]                           
                    }),           
                onSuccess: addTemplateSuc,
                onFailed: addTemplateFail
            } 
            Utils.Request.sendRequest(addTemplateOpt); 
        }else{
            g_templateName=$("#input1").val();
            addThemeTemplate();
        }
    }
    //增加页面模板
    function addThemeTemplate(aData){
        if($("#btn1").prop("checked")){
            function addThemeTemplateSuc(){ 
                g_themeTemplateName=$("#server").val();
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
    //增加发布管理器
    function addPubmng(){
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
                    name:g_temName,
                    shopName: Utils.Device.deviceInfo.shop_name,
                    weixinAccountName:$("#input3").val(),
                    authCfgTemplateName:g_templateName, 
                    themeTemplateName:g_themeTemplateName                       
                }),           
            onSuccess: addPubmngSuc,
            onFailed: addPubmngFail
        } 
        Utils.Request.sendRequest(addPubmngOpt); 
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
                    name:g_temName,
                    isPublish:true                          
                }),           
            onSuccess: publishSuc,
            onFailed: publishFail
        } 
        Utils.Request.sendRequest(publishOpt);
    }
    
    function initData() {
        var oSListHead = {
            showHeader: true,
            showOperation: true,
            multiSelect: false,
            pageSize: 10,
            colNames: getRcText("ALLAP_HEADER2"),
            colModel: [
                {name: "stName",datatype: "String"},
                {name: "ssidName",datatype: "String"},
                {name: "lvzhouAuthMode",datatype: "String"},
                {name: "status",datatype: "String"},
                {name: "ApGroupCnt",datatype:"Number",formatter:showLinkAPGroup},
                {name: "ApCnt",datatype:"Number",formatter:showLinkAP}               
            ],
            buttons: [
                {name: "add",value:getRcText("ADD"),action:onZengjia},          
                {name: "default", value: getRcText("SYN"),action:onTongbu},               
                {name: "detail",action:onBind}, 
                {name: "edit",action:onEdit},  
                {name: "delete",action:onDelete}                 
            ]
        };
        $("#peizhi_list").SList("head", oSListHead);
        $("#peizhi_list").on('click','a.list-link',onDisDetailAP);

        var APGruopListOpt={
            showHeader:true,
            multiSelect:false,
            pageSize:10,
            colNames: getRcText("Bind_HEADER2"),
            showOperation: false,
            colModel: [
                { name: "ApGroupName", datatype: "String"},
                { name: "ApModel", datatype: "String"}
            ],
        }
        $("#APGruopList2").SList("head", APGruopListOpt);

        var APListOpt={
            showHeader:true,
            multiSelect:false,
            pageSize:10,
            colNames: getRcText("Bind_HEADER"),
            showOperation: false,
            colModel: [
                { name: "ApName", datatype: "String"},
                { name: "ApModel", datatype: "String"},            
            ],
        }
        $("#APList").SList("head", APListOpt);

        getssidinfobrief();
        queryTemplate();
        queryThemeTemplate();
        queryWeixinAccount();
    };

    function initForm() {
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