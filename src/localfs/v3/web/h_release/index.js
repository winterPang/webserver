(function($) {
    var MODULE_NAME = "h_release.index";

    function getRcText(sRcName) {
        return Utils.Base.getRcString("release_rc", sRcName);

    }

    function publishMng(sRname,shopName,status) {
        var PubMngOpt = {
            type: "POST",
            url: MyConfig.v2path+"/pubmng/publish",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({"ownerName":FrameInfo.g_user.attributes.name
                ,"name":sRname
                ,"shopName":shopName
                ,"isPublish":status
            }),
            onSuccess: PubMngSuc,
            onFailed: PubMngFail
        }


        function PubMngSuc(data){
            if(data.errorcode == 0){
                Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));
                updataForm();
                initData();
                Frame.Msg.info("配置成功");
            }
            else{
                Frame.Msg.error(data.errormsg);
            }
        }

        function PubMngFail(){
            console.log("fail6");
        }

        Utils.Request.sendRequest(PubMngOpt);
    }

    function updataForm()
    {
        $("input[type=text],input[type=password],select",jForm).each(function() {
            Utils.Widget.setError($(this),"");
        });
        // eye();
        jForm.form("updateForm",{
            name:"",
            ssidName:"",
            weixinAccountName:"",
            authCfgName:"",
            themeTemplateName:"",
            description:""
        });
    }
    function onCancel()
    {
        updataForm();
        Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));
    }

    function onSubmitAddPubmng(){
        var sRname = $("#name").val();
        var sRdesc = $("#description").val()||'';
        var sRssid = $("#ssidName").singleSelect("value");
        var sRweixin = $("#weixinAccountName").singleSelect("value");
        var sRauth = $("#authCfgName").singleSelect("value");
        var sRtheme = $("#themeTemplateName").singleSelect("value");
        var sRisPublished = $("#isPublished").MCheckbox("getState");
        var shopName = Utils.Device.deviceInfo.shop_name;

        var addPubMngOpt = {
            type: "POST",
            url: MyConfig.v2path+"/pubmng/add",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({"ownerName":FrameInfo.g_user.attributes.name
                ,"name":sRname
                ,"shopName":shopName
                ,"ssidName":sRssid
                ,"weixinAccountName":sRweixin
                ,"authCfgName":sRauth
                ,"themeTemplateName":sRtheme
                ,"description":sRdesc
            }),
            onSuccess: addPubMngSuc,
            onFailed: addPubMngFail
        }


        function addPubMngSuc(data){
            if(data.errorcode == 0){
                publishMng(sRname,shopName,sRisPublished);
            }
            else{
                Frame.Msg.error(data.errormsg);
            }
        }

        function addPubMngFail(){
            console.log("fail6");
        }

        Utils.Request.sendRequest(addPubMngOpt);
    }
    function onSubmitEditPubmng(){
        var sRname = $("#name").val();
        var sRdesc = $("#description").val()||'';
        var sRssid = $("#ssidName").singleSelect("value");
        var sRweixin = $("#weixinAccountName").singleSelect("value");
        var sRauth = $("#authCfgName").singleSelect("value");
        var sRtheme = $("#themeTemplateName").singleSelect("value");
        var sRisPublished = $("#isPublished").MCheckbox("getState");
        var shopName = Utils.Device.deviceInfo.shop_name;

        var editPubMngOpt = {
            type: "POST",
            url: MyConfig.v2path+"/pubmng/modify",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({"ownerName":FrameInfo.g_user.attributes.name
                ,"name":sRname
                ,"shopName":shopName
                ,"ssidName":sRssid
                ,"weixinAccountName":sRweixin
                ,"authCfgName":sRauth
                ,"themeTemplateName":sRtheme
                ,"description":sRdesc
            }),
            onSuccess: editPubMngSuc,
            onFailed: editPubMngFail
        }


        function editPubMngSuc(data){
            if(data.errorcode == 0){
                publishMng(sRname,shopName,sRisPublished);
            }
            else{
                Frame.Msg.error(data.errormsg);
            }
        }

        function editPubMngFail(){
            console.log("fail6");
        }

        Utils.Request.sendRequest(editPubMngOpt);
    }

    function AddRelease(oRowData,type) {
        jForm = $("#view_release_form");
        var jDlg = $("#AddReleaseDlg");
        Utils.Base.resetForm(jForm);
        if(jDlg.children().length)
        {
            $("#pageToggle").show().insertAfter($(".modal-header",jDlg));
        }
        else
        {
            $("#pageToggle").show().appendTo(jDlg);
        }

        if(type=="add")
        {
            $("#name",jForm).attr("readonly",false);
            jForm.form("init", "edit", {"title":getRcText("ADD_PUBMNG"),"btn_apply": onSubmitAddPubmng,"btn_cancel":onCancel});
            getReleaseData();

        }
        else{
            
            $("#name",jForm).val(oRowData[0].name);
            $("#name",jForm).attr("readonly",true);
            $("#description",jForm).val(oRowData[0].description);
            $("#ssidName").singleSelect("value",oRowData[0].ssidName);
            $("#weixinAccountName").singleSelect("value",oRowData[0].weixinAccountName);
            $("#authCfgName").singleSelect("value",oRowData[0].authCfgName);
            $("#themeTemplateName").singleSelect("value",oRowData[0].themeTemplateName);

            if(oRowData[0].isPublished == 0)
            {
                $("#isPublished").MCheckbox("setState",false);
            }
            else
            {
                $("#isPublished").MCheckbox("setState",true);
            }

            jForm.form("init", "edit", {"title":getRcText("EDIT_PUBMNG"),"btn_apply": onSubmitEditPubmng, "btn_cancel":onCancel});
            
        }
        Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
    }

    function Fresh() {
        Utils.Base.refreshCurPage();
    }

    function EditShow(aRows)
    {
        if (aRows.length > 0)
        {
            return true;
        }
        return false;
    }

    function RemovePubmng(oRowData){
        
        var sRname = oRowData[0].name;
        var shopName = Utils.Device.deviceInfo.shop_name;
        var removePubMngOpt = {
            type: "POST",
            url: MyConfig.v2path+"/pubmng/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({"ownerName":FrameInfo.g_user.attributes.name
                ,"name":sRname
                ,"shopName":shopName
            }),
            onSuccess: removePubMngSuc,
            onFailed: removePubMngFail
        }


        function removePubMngSuc(data){
            if(data.errorcode == 0){
                // Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));
                // updataForm();
                initData();
                Frame.Msg.info("删除成功");
            }
            else{
                Frame.Msg.error(data.errormsg);
            }
        }

        function removePubMngFail(){
            console.log("fail6");
        }

        Utils.Request.sendRequest(removePubMngOpt);
    }

    function initGrid() {
        var opt = {
            multiSelect: false,
            showOperation:true,
            colNames: getRcText("RELEASE_HEAD"),
            colModel: [
                {name: "name",datatype: "String"}
                ,{name: "ssidName",datatype: "String"}
                ,{name: "weixinAccountName",datatype: "String"}
                ,{name: "authCfgName",datatype: "String"}
                ,{name: "themeTemplateName",datatype: "String"}
                ,{name: "description",datatype: "String"}
                ,{name: "sPublished",datatype: "String"}
            ],
            buttons: [
                {name: "add", action: AddRelease}
                ,{name:"edit",enable:EditShow,action:AddRelease}
                ,{name:"delete",action:RemovePubmng}
                ,{name: "default",value: getRcText("FLUSH"),action: Fresh}
            ]
        };
        $("#release_list").SList("head", opt);

    }

    function getReleaseData() {
        var aStatue = getRcText("STATUS").split(',');
        // $("#release_list").SList("refresh", data.ssidList);
        function getReleaseDataSuc(data) {
            if(("errorcode" in data) && (data.errorcode != 0)){
                return;
            }
            if( data.data.length > 0) {
                $.each(data.data,function(key,value){
                    value.sPublished = aStatue[value.isPublished];
                });
                $("#release_list").SList("refresh", data.data);
            }else{
                $("#release_list").SList("refresh", []);
            }
        }

        function getReleaseDataFail(err) {
            console.log("err")
        }
        var shopName = Utils.Device.deviceInfo.shop_name;
        var release = {
            url: MyConfig.v2path + "/pubmng/query?ownerName=" + FrameInfo.g_user.attributes.name +"&shopName="+shopName,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess: getReleaseDataSuc,
            onFailed: getReleaseDataFail
        }
        Utils.Request.sendRequest(release);
    }

    function ssidListData(){
        var ssiddata  = [];
        var ssidQueryOpt = {
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getssidlist?devSN="+ FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            onSuccess: ssidQuerySuc,
            onFailed: ssidQueryFail
        }

        function ssidQuerySuc(data){
            if(!data)
            {
                return;
            }
            var ssidList = data.ssidList;
            $.each(ssidList,function(key,value){
                ssiddata.push(value.ssidName);
            });
            $("#ssidName").singleSelect("InitData",ssiddata);
        }

        function ssidQueryFail(){
            console.log("fail6");
        }

        Utils.Request.sendRequest(ssidQueryOpt);
    }

    function authListData(){

        var authdata  = [];
        var authcfgQueryOpt = {
            type: "GET",
            url: MyConfig.v2path+"/authcfg/query",
            contentType:"application/json",
            dataType:"json",
            data:{"ownerName":FrameInfo.g_user.attributes.name},
            onSuccess: authcfgQuerySuc,
            onFailed: authcfgQueryFail
        }

        function authcfgQuerySuc(data){
            console.log("sec6");

            if(data.errorcode == 0){
                $.each(data.data,function(key,value){
                    var authTemplate={};

                    authTemplate.authCfgTemplateName=value.authCfgTemplateName;
                    if(value.authType==1){
                        authTemplate.authType = getRcText ("AUTH_Status").split(",")[1];
                    }else{
                        authTemplate.authType = getRcText ("AUTH_Status").split(",")[0];
                    }
                    authTemplate.isEnableSms=getRcText ("AUTH_Status").split(",")[value.isEnableSms];
                    authTemplate.isEnableWeixin=getRcText ("AUTH_Status").split(",")[value.isEnableWeixin];
                    authTemplate.isWeixinConnectWifi=getRcText ("AUTH_Status").split(",")[value.isWeixinConnectWifi];
                    authTemplate.isEnableAccount=getRcText ("AUTH_Status").split(",")[value.isEnableAccount];
                    authTemplate.ONLINE_MAX_TIME=value.uamAuthParamList[0].authParamValue;
                    authTemplate.URL_AFTER_AUTH=value.uamAuthParamList[1].authParamValue;
                    authTemplate.IDLE_CUT_TIME=value.uamAuthParamList[2].authParamValue;
                    authTemplate.IDLE_CUT_FLOW=value.uamAuthParamList[3].authParamValue;
                    authdata.push(authTemplate.authCfgTemplateName);
                })
                // $("#authList").SList ("refresh", authdata);
                $("#authCfgName").singleSelect("InitData",authdata);
            }else {
                //TODO errorcode处理
                //   Frame.Msg.error("查询数据异常");

            }
        }

        function authcfgQueryFail(){
            console.log("fail6");
        }

        Utils.Request.sendRequest(authcfgQueryOpt);
    }

    function pageListData(){
        var aPageModelData  = [];
        var themetemplateQueryOpt = {
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/query?ownerName="+FrameInfo.g_user.attributes.name,
            contentType:"application/json",
            dataType:"json",
            onSuccess: themetemplateQuerySuc,
            onFailed: themetemplateQueryFail
        }

        function themetemplateQuerySuc(data){
            console.log("sec7");
            if(data.errorcode == 0){
                $.each(data.data,function(key,value){
                    var PageTemplate={}
                    PageTemplate.themeName=value.themeName;
                    PageTemplate.description = value.description;
                    PageTemplate.simpledraw = "/o2o/uam/theme/"+ value.pathname +"/draw.xhtml?templateId="+ value.id +"&type=1";
                    aPageModelData.push(PageTemplate.themeName);
                })
                // $("#pageList").SList ("refresh", aPageModelData);
                $("#themeTemplateName").singleSelect("InitData",aPageModelData);
            }else {
                //TODO errorcode处理
                Frame.Msg.info("查询数据异常","error");

            }
        }

        function themetemplateQueryFail(){
            console.log("fail7");
        }

        Utils.Request.sendRequest(themetemplateQueryOpt);
    }

    function chatListData(){

        var chatdata  = [];
        var weixinaccountQueryOpt = {
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query",
            contentType:"application/json",
            dataType:"json",
            data:{"ownerName":FrameInfo.g_user.attributes.name},
            onSuccess: weixinaccountQuerySuc,
            onFailed: weixinaccountQueryFail
        }

        function weixinaccountQuerySuc(data){
            console.log("sec3");
            if(data.errorcode == 0){
                $.each(data.data,function(key,value){
                    var authTemplate={}
                    authTemplate.name=value.name;
                    authTemplate.appId=value.appId;
                    authTemplate.appSecret=value.appSecret;
                    authTemplate.token=value.token;
                    authTemplate.type=value.type;
                    authTemplate.encodingAesKey=value.encodingAesKey;
                    authTemplate.cipherMode=value.cipherMode;
                    authTemplate.ifWeixinAuth=value.ifWeixinAuth;
                    authTemplate.url=value.url;
                    authTemplate.description=value.description;

                    chatdata.push(authTemplate.name);
                })
                // $("#chatList").SList ("refresh", chatdata);
                $("#weixinAccountName").singleSelect("InitData",chatdata);
            }else {
                //TODO errorcode处理
                Frame.Msg.info("查询数据异常","error");
            }
        }

        function weixinaccountQueryFail(){
            console.log("fail3");
        }

        Utils.Request.sendRequest(weixinaccountQueryOpt);
    }

    function initForm() {             
        
    }

    function initData() {
        getReleaseData();
        ssidListData();
        authListData();
        pageListData();
        chatListData();
    };

    function _init() {
        initGrid();
        initForm();
        initData();

    }

    function _resize(jParent) {}

    function _destroy() {
        g_allData = null;
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList", "Form","SingleSelect","Minput"],
        "utils": ["Base", "Device", "Request"]
    });
})(jQuery);;