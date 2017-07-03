/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "chatstore.config";
    var rc_info = "storeinfomation_rc";
    var g_ssidArr = [];
    var g_flag,g_oPara;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function initGrid()
    {

    }

    function getWifiStore(){

        function getWifiStoreSuc(data){
            console.log(data);
            if(data.errcode == 0){
                var wifiStoreInfo = data.data;
                if($.inArray(wifiStoreInfo.ssid,g_ssidArr) != -1){
                    $("#ssidList").singleSelect("value",wifiStoreInfo.ssid);
                }
                //判断是否portal设备注册
                if(wifiStoreInfo.ssid){
                    g_flag = true;
                }else{
                    g_flag = false;
                }
            }
        }

        function getWifiStoreFail(err){
            console.log(err);
        }

        var wifiStoreOpt = {
            type: "POST",
            url: MyConfig.v2path+"/wifiShopDb/queryWifiShop",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                appId: g_oPara.appId,
                appSecret:g_oPara.appSecret,
                nasid:FrameInfo.Nasid,
                shop_id:g_oPara.shopId,
                sid:g_oPara.sid
            }),
            onSuccess: getWifiStoreSuc,
            onFailed:  getWifiStoreFail
        }

        Utils.Request.sendRequest(wifiStoreOpt);
    }

    function getSIIDListInfo(){

        function getSSIDListSuc(data){
            console.log(data);
            $.each(data.ssidList,function(i,v){
                g_ssidArr.push(v.ssidName);
            });
            $("#ssidList").singleSelect("InitData",g_ssidArr);
            getWifiStore();
        }

        function getSSIDListFail(err){
            console.log(err);
        }
        var ssidListOpt = {
            type: "GET",
            url: "/v3/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess: getSSIDListSuc,
            onFailed:  getSSIDListFail
        }

        Utils.Request.sendRequest(ssidListOpt);
    }

    function getTwo_dimension_code(param){

        function getDimensionCodeSuc(data){
            console.log(data);
            if(data.errcode == 0){
               $("#img").attr("src",data.data.qrcode_url);
                $("#down").attr("src",data.data.qrcode_url);
                $("#down").attr("href",data.data.qrcode_url);
            }
        }

        function getDimensionCodeFail(err){
            console.log(err);
        }

        var dimensionCodeOpt = {
            type: "POST",
            url: MyConfig.v2path+"/wifiConn/getQrCode",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                appId:g_oPara.appId,
                nasid: FrameInfo.Nasid,
                appSecret:g_oPara.appSecret,
                shop_id:g_oPara.shopId,
                img_id:param
            }),
            onSuccess: getDimensionCodeSuc,
            onFailed:  getDimensionCodeFail
        }

        Utils.Request.sendRequest(dimensionCodeOpt);
    }

    function initData()
    {
      /*  var docList = getRcText("docListStr").split(",");
        $("#docList").singleSelect("InitData",docList);
        $("#docList").singleSelect("value",docList[0]);*/
        getSIIDListInfo();
        //
        getTwo_dimension_code(0)
    }


    function updateLvzouWifi(param,secret){

        function updateLvzhouWifiSuc(data){
            console.log(data);
            var resultTips =  getRcText("operateResilt").split(",");
            if(data.errcode == 0){
               // var val = $("input[name='erweima']:checked").val();
                //���¶�ά��
                Frame.Msg.info(resultTips[0]);
                Utils.Base.refreshCurPage();
            }else{
                Frame.Msg.info(resultTips[1],"error");
            }
        }

        function updateLvzhouWifiFail(err){
            console.log(err)
        }


        var updateLvzhouWifiOpt = {
            type: "POST",
            url: MyConfig.v2path+"/wifiShopDb/updateWifiShop",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                appId: g_oPara.appId,
                appSecret:g_oPara.appSecret,
                nasid:FrameInfo.Nasid,
                update_data:{
                    shop_id:g_oPara.shopId,
                    sid:g_oPara.sid,
                    ssid:param,
                    secretkey:secret
                }

            }),
            onSuccess: updateLvzhouWifiSuc,
            onFailed:  updateLvzhouWifiFail
        }

        Utils.Request.sendRequest(updateLvzhouWifiOpt);


    }

    function cleanWifishopFun(ssid)
    {

        function cleanWifishopSuc(data)
        {
            console.log(data);
            if(data.errcode == 0)
            {
                getSecretKey(ssid);
            }
            else
            {
                Frame.Msg.info(getRcText("clear_Err"),"error");
            }
        }

        function cleanWifishopFail(err)
        {
            console.log(err);

        }

        var cleanWifishopOpt = {
            type: "POST",
            url: MyConfig.v2path+"/wifiShop/cleanWifishop",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                appId: g_oPara.appId,
                nasid: FrameInfo.Nasid,
                appSecret: g_oPara.appSecret,
                shop_id:g_oPara.shopId
            }),
            onSuccess: cleanWifishopSuc,
            onFailed:  cleanWifishopFail
        }

        Utils.Request.sendRequest(cleanWifishopOpt);

    }

    function updatetWifiWechat(ssid)
    {
        var tips = getRcText("operateResilt").split(",");

        function updateWechatSuc(data){
            console.log(data);
            if(data.errcode == 0)
            {
                getSecretKey(ssid);
            }
            else if(data.errcode == 9002008)//暂时不支持多个ssid
            {
                cleanWifishopFun(ssid);
            }
            else if(data.errcode == 9002004)//需要先注册portal设备
            {
                getSecretKey(ssid);
            }

            else{
                Frame.Msg.info(tips[1],"error");
            }
        }

        function updateWechatFail(err){
            console.log(err);
        }

        var updateWechatOpt = {
            type: "POST",
            url: MyConfig.v2path+"/wifiShop/updateWifishop",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                appId: g_oPara.appId,
                nasid: FrameInfo.Nasid,
                appSecret: g_oPara.appSecret,
                shop_id:g_oPara.shopId,
                ssid:ssid
            }),
            onSuccess: updateWechatSuc,
            onFailed:  updateWechatFail
        }

        Utils.Request.sendRequest(updateWechatOpt);
    }

    function getSecretKey(ssid)
    {
        function getSecretKeySuc(data)
        {
            console.log(data);
            if(data.errcode == 0){
                //TODO
                //updatetWifiWechat(ssid);
                var secretkey = data.data.secretkey
                if(secretkey)
                {
                    updateLvzouWifi(ssid,secretkey);
                }

            }

        }

        function getSecretKeyail(err)
        {
            console.log(err);
        }

        var getSecretKeyOpt= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShop/getWifishopSecretkey",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                appId: g_oPara.appId,
                nasid: FrameInfo.Nasid,
                appSecret: g_oPara.appSecret,
                shop_id:g_oPara.shopId,
                ssid:ssid,
                reset:false
            }),
            onSuccess: getSecretKeySuc,
            onFailed: getSecretKeyail
        }

        Utils.Request.sendRequest(getSecretKeyOpt);
    }

    function updateWechatWifi()
    {
        var ssid =  $("#ssidList").singleSelect("value");
       // var docTemplate =  $("#docList").singleSelect("value");
      //  var template = $("#templateList").singleSelect("value");
        if(g_flag){
            updatetWifiWechat(ssid);
        }else{
            getSecretKey(ssid);
        }
        // updatetWifiWechat(ssid);
        //getSecretKey(ssid);
    }


    function comeback()
    {
        Utils.Base.redirect ({np:"chatstore.index"});
    }
    function initForm()
    {
        $("#chun").on("click",function(){
            var val = $(this).val();
            getTwo_dimension_code(val);
        });

        $("#wuliao").on("click",function(){
            var val = $(this).val();
            getTwo_dimension_code(val);
        });

        $("#wifiUpdate").on("click",updateWechatWifi);

        $("#back_chatStore").on('click',comeback);
    }

    function getWechatInfo(){

        function getWechatInfoSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0 && data.data){
                g_oPara.appId = data.data.appId ;
                g_oPara.appSecret = data.data.appSecret;
                initData();
            }

        }

        function getWechatInfoFail(err)
        {
            console.log(err);
        }

        var getWechatInfoOpt= {
            type: "GET",
            url: "/v3/ace/oasis/auth-data/o2oportal/weixinaccount/querybyname",
            dataType: "json",
            contentType: "application/json",
            data:{
                storeId:FrameInfo.Nasid,
                name:g_oPara.chatName
            },
            onSuccess: getWechatInfoSuc,
            onFailed: getWechatInfoFail
        }

        Utils.Request.sendRequest(getWechatInfoOpt);
    }

    function _init(oPara)
    {
        g_oPara = Utils.Base.parseUrlPara();
        initGrid();

        getWechatInfo();
        initForm();
    };

    function _destroy()
    {
        g_ssidArr = [];
        g_flag = "";
        g_oPara = "";
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect"],
        "utils": ["Base","Request"]
    });
}) (jQuery);
