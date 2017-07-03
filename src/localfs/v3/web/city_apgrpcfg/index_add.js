(function($) {
    var MODULE_NAME = "city_wireless.index_add";

    function getRcText(sRcName) {
        return Utils.Base.getRcString("release_rc", sRcName);

    }

    function Fresh() {
        Utils.Base.refreshCurPage();
    }

    function initGrid() {


    }

    function initData() {
        ssidListData();
        authListData();
        pageListData();
        chatListData();
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

    function onAddPubmng() {
        var sRname = $("#name").text();
        var sRdesc = $("#description").text()||'';
        var sRssid = $("#ssidName").singleSelect("value");
        var sRweixin = $("#weixinAccountName").singleSelect("value");
        var sRauth = $("#authCfgName").singleSelect("value");
        var sRtheme = $("#themeTemplateName").singleSelect("value");

        var shopName = Utils.Device.deviceInfo.shop_name;

        var addPubMngOpt = {
            type: "GET",
            url: MyConfig.v2path+"/pubmng/add",
            contentType:"application/json",
            dataType:"json",
            data:{"ownerName":FrameInfo.g_user.attributes.name
                ,"name":sRname
                ,"shopName":shopName
                ,"ssidName":sRssid
                ,"weixinAccountName":sRweixin
                ,"authCfgName":sRauth
                ,"themeTemplateName":sRtheme
                ,"description":sRdesc
            },
            onSuccess: addPubMngSuc,
            onFailed: addPubMngFail
        }


        function addPubMngSuc(data){
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

        function addPubMngFail(){
            console.log("fail6");
        }

        Utils.Request.sendRequest(addPubMngOpt);

    }

    function onSubmit() {
        onAddPubmng();
    }

    function onCancel() {
        alert(1);
    }

    function initForm() {
        // $("#view_release_form").form("init", "add", {"title":getRcText("ADD_TITLE"),"btn_apply": onSubmit});
        var oEdit =  {"title": getRcText("ADD_TITLE"), "btn_apply": onSubmit, "btn_cancel":onCancel};
        $("#view_release_form").form("init", "edit", oEdit);
    }

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
        "widgets": ["Form","SingleSelect"],
        "utils": ["Base", "Device", "Request"]
    });
})(jQuery);;