;(function ($)
{
    var MODULE_NAME = "chatstore.storeinfomation";
    var rc_info = "storeinfomation_rc";
    var g_wifiShopList = [],g_ShopList = [];
    var g_appId = "";
    var g_appSecret="";
    var g_shopNum = 0;//门店初始化循环
    var g_wifiShopNum = 0;//wifi门店初始化循环
    var hPending;
    var v2path = MyConfig.v2path;

    function getRcText(sRcName){

        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function comeback(){

        Utils.Base.redirect ({np:"chatstore.index"});
    }

    function getSecretKey(operateWifiFlag,wifiShopInfo,operateShopFlag,shopInfo){

        function getSecretKeySuc(data){

            if(data.errcode == 0){

                wifiShopInfo.secretkey = data.data.secretkey;
                updateOrSaveWifiShop(operateWifiFlag,wifiShopInfo,operateShopFlag,shopInfo);
            }else{
                if($.MyLocale.ErrCode_WeiXin[data.errcode]){
                    hPending.close();
                    Frame.Msg.info($.MyLocale.ErrCode_WeiXin[data.errcode], "error");
                }else{
                    hPending.close();
                    Frame.Msg.info("获取门店信息失败", "error");
                }
            }

        }

        function getSecretKeyail(err){

            console.log(err);
        }

        var getSecretKeyOpt= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShop/getWifishopSecretkey",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                shop_id:wifiShopInfo.shop_id,
                ssid:wifiShopInfo.ssid,
                reset:false
            }),
            onSuccess: getSecretKeySuc,
            onFailed: getSecretKeyail
        }

        Utils.Request.sendRequest(getSecretKeyOpt);
    }

    function updateOrSaveWifiShop(operateWifiFlag,wifiShopInfo,operateShopFlag,shopInfo){

        function wifiShopInfoSuc(data){

            if( data.errcode === "0" ){
                updateOrSaveShop(operateShopFlag,shopInfo);
            }else{
                Frame.Msg.info(getRcText("insertWifiShopFail"),"error");
            }
        }

        function wifiShopInfoFail(err){
            Frame.Msg.info(getRcText("insertWifiShopFail"),"error");
        }

        var url = "" , reqData = {};

        if(operateWifiFlag === "save"){

            url = "/wifiShopDb/saveWifiShop";

            reqData = {
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                data:wifiShopInfo
            };

        }else if(operateWifiFlag === "update"){

            url = "/wifiShopDb/updateWifiShop";

            reqData = {
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                update_data:wifiShopInfo
            };
        }

        var wifiShopOpt = {

            type: "POST",
            url: MyConfig.v2path + url,
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify(reqData),
            onSuccess: wifiShopInfoSuc,
            onFailed: wifiShopInfoFail

        };

        Utils.Request.sendRequest(wifiShopOpt);
    }

    function updateOrSaveShop(operateShopFlag,shopInfo){

        function shopInfoSuc(data){

            if( data.errcode === "0" ){
                Frame.Msg.info(getRcText("insertSuc"));
            }else{
                Frame.Msg.info(getRcText("insertShopFail"),"error")
            }
        }

        function shopInfoFail(err){
            Frame.Msg.info(getRcText("insertShopFail"),"error")
        }

        var _url = "" , _reqData = {};

        if(operateShopFlag === "save"){

            _url = "/wifiShopDb/saveShop";

            _reqData = {

                nasid:FrameInfo.Nasid,
                appId:g_appId,
                base_info:shopInfo

            };

        }else if(operateShopFlag === "update"){

            _url = "/wifiShopDb/updateShop";

            _reqData = {
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                update_info:shopInfo
            };
        }

        var shopOpt = {

            type: "POST",
            url: MyConfig.v2path + _url,
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify(_reqData),
            onSuccess: shopInfoSuc,
            onFailed: shopInfoFail

        };

        Utils.Request.sendRequest(shopOpt);  
    }
    
    function getSidFunction(shopInfo,wifiShopInfo){
        function getUUIDSuc(data){
            console.log(data);
            if(data.errcode == 0){
                var uuid = data.uuid
                getLvzhouShopInfo(shopInfo,wifiShopInfo,uuid);
            }
        }

        function getUUIDFail(err){
            console.log(data);
        }

        var getUUidOpt={
            type:"GET",
            url:v2path+"/weixinUtils/utils?type=getuuid",
            contentType: "application/json",
            dataType: "json",
            onSuccess:getUUIDSuc,
            onFailed:getUUIDFail
        };

        Utils.Request.sendRequest(getUUidOpt);
    }

    function getLvzhouShopInfo(shopInfo,wifiShopInfo,uuid){

        function getShopSuc(data){

            if(data.errcode == 0){

                function getWifiShopSuc(wifidata){

                    if(wifidata.errcode == 0){

                        shopInfo.sid = uuid;
                        wifiShopInfo.sid = uuid;

                        if(!wifidata.data&&data.base_info){
                            
                            if(!wifiShopInfo.ssid){
                              
                                //不需要getSecretKey ---- 保存wifi --- 更新微信门店
                                updateOrSaveWifiShop("save",wifiShopInfo,"update",shopInfo)

                            }else{

                                getSecretKey("save",wifiShopInfo,"update",shopInfo);
                                //需要getSecretKey ---- 保存wifi --- 更新微信门店
                                
                            }

                        }else if(wifidata.data&&!data.base_info){
    
                            if(!wifiShopInfo.ssid){
                                
                                updateOrSaveWifiShop("update",wifiShopInfo,"save",shopInfo);
                               //不需要getSecretKey ---- 更新wifi --- 保存微信门店
                                
                            }else{

                                getSecretKey("update",wifiShopInfo,"save",shopInfo);
                                //需要getSecretKey ---- 更新wifi --- 保存微信门店
                                
                            }
                        }else if(!wifidata.data&&!data.base_info){
                            
                            if(!wifiShopInfo.ssid){

                                updateOrSaveWifiShop("save",wifiShopInfo,"save",shopInfo);
                                //不用调用getSecretkey-----保存wifi --- 保存微信门店
                                
                            }else{

                                getSecretKey("save",wifiShopInfo,"save",shopInfo);
                                //调用获取getSecretkey -----保存wifi --- 保存微信门店
                            }
                        }else{
                            
                            if(!wifiShopInfo.ssid){

                                updateOrSaveWifiShop("update",wifiShopInfo,"update",shopInfo);
                                //不用调用getSecretkey-----更新wifi --- 更新微信门店
                                
                            }else{
                                //调用获取getSecretkey -----更新wifi --- 更新微信门店
                                getSecretKey("update",wifiShopInfo,"update",shopInfo);
                                
                            }
                        }

                    }else{
                        Frame.Msg.info(getRcText("insertShopFail"),"error")
                    }
                }
                function getWifiShopFail(err){
                    console.log(err);
                }


                if(!wifiShopInfo.shop_id)
                {
                    Frame.Msg.info("wifiShopInfo.shop_id empty","error");
                    return
                }
                var getWifiShopOpt = {
                    type: "POST",
                    url: MyConfig.v2path+"/wifiShopDb/queryWifiShop",
                    dataType: "json",
                    contentType: "application/json",
                    data:JSON.stringify({
                        nasid:FrameInfo.Nasid,
                        appId:g_appId,
                        shop_id:wifiShopInfo.shop_id
                    }),
                    onSuccess: getWifiShopSuc,
                    onFailed: getWifiShopFail
                }

                Utils.Request.sendRequest(getWifiShopOpt);


            }else{
                Frame.Msg.info(getRcText("getLvzhouShop_Err"),"error")
            }
        }
        function getShopFail(err){
            console.log(err);
        }

        if(!shopInfo.poi_id){
            Frame.Msg.info(getRcText("poiIdNotExist_Err"),"error");
            return
        }

        var getShopOpt= {
            type: "POST",
            url: MyConfig.v2path+"/wifiShopDb/queryShop",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                nasid:FrameInfo.Nasid,
                appId:g_appId,
                poi_id:shopInfo.poi_id
            }),
            onSuccess: getShopSuc,
            onFailed: getShopFail
        }

        Utils.Request.sendRequest(getShopOpt);
    }


    function insert (datainfo)
    {

       var shopInfo = {};
        var wifiShopInfo = {};
        $.each(g_ShopList,function(i,v){
            if(v.base_info.poi_id&& v.base_info.poi_id == datainfo[0].poi_id){
                shopInfo = v.base_info;
            }
        })
        $.each(g_wifiShopList,function(i,v){
            if(v.shop_id&& v.shop_id == datainfo[0].shop_id){
                wifiShopInfo = v;
            }
        })
        getSidFunction(shopInfo,wifiShopInfo);
    }

    function showEnable(colData)
    {
        var selecteVal = colData[0];
        if(selecteVal.numState == 3){
            return true;
        }
        return false;
    }

    function initGrid()
    {
        var opt = {
            colNames: getRcText ("storeInfomation_HEADER"),
            showOperation:true,
            pageSize:10,
            colModel: [
                {name:'shop_name', datatype:"String"},
                {name:'ssid_name',datatype:"String"},
                {name: 'state',datatype:"String"}

              ],
            buttons:[
                 {name:"import",enable:showEnable,action:insert},
                {name:"comeback",value:getRcText ("comeback"),enable:true,action:comeback}
            ]
            };
        $("#storeinfomationList").SList ("head", opt);
    }

    function initData()
    {
        function getChatListSuc(data){

            var aIntList = [];
            $.each(data.data,function(index, value) {
                aIntList.push(value.name);
             });

            $("#PublicWeixin").singleSelect("InitData",aIntList);
            $("#PublicWeixin").singleSelect("value",aIntList[0]);
            if( data.data.length <= 0 ){
               // hPending.close();
                return;
            }
            g_appId = data.data[0].appId;
            g_appSecret = data.data[0].appSecret;
            getChatStoreList(data.data[0].appId,data.data[0].appSecret);
        }

        function getChatListFail(err){
            console.log(err);
        }

        var getChatListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query?storeId="+FrameInfo.Nasid,
            dataType: "json",
            contentType: "application/json",
            onSuccess: getChatListSuc,
            onFailed: getChatListFail

        }

        Utils.Request.sendRequest(getChatListOpt);
    }

    function refreshSlist()
    {
        hPending.close(400);
        var reDataArr = [];
        var refrshData = {};

        $.each(g_wifiShopList,function(i,value){
            var reData = {};
            reData.ssid_name = value.ssid;
            reData.shop_id=value.shop_id;
            if(value.sid){
                reData.sid = value.sid;
                refrshData[value.sid] =reData
            }
            else if(value.shop_name)
            {
                refrshData[value.shop_name] =reData
            }

        })

        $.each(g_ShopList,function(i,spValue){
            if(refrshData[spValue.base_info.sid]){
                refrshData[spValue.base_info.sid].shop_name = spValue.base_info.business_name;
                refrshData[spValue.base_info.sid].available_state=getRcText("available_state").split(",")[spValue.base_info.available_state-1];
                refrshData[spValue.base_info.sid].update_status=spValue.base_info.update_status;
                refrshData[spValue.base_info.sid].poi_id=spValue.base_info.poi_id;
                refrshData[spValue.base_info.sid].numState = spValue.base_info.available_state;
                refrshData[spValue.base_info.sid].state = getRcText("available_state").split(",")[spValue.base_info.available_state-1]+"";
            }else if(!spValue.base_info.branch_name&&refrshData[spValue.base_info.business_name]){
                refrshData[spValue.base_info.business_name].shop_name = spValue.base_info.business_name;
                refrshData[spValue.base_info.business_name].available_state=getRcText("available_state").split(",")[spValue.base_info.available_state-1];
                refrshData[spValue.base_info.business_name].update_status=spValue.base_info.update_status;
                refrshData[spValue.base_info.business_name].poi_id=spValue.base_info.poi_id;
                refrshData[spValue.base_info.business_name].numState = spValue.base_info.available_state;
                refrshData[spValue.base_info.business_name].state = getRcText("available_state").split(",")[spValue.base_info.available_state-1]+"";

            }else if(spValue.base_info.branch_name && refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"]){

                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].shop_name = spValue.base_info.business_name;
                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].available_state=getRcText("available_state").split(",")[spValue.base_info.available_state-1];
                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].update_status=spValue.base_info.update_status;
                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].poi_id=spValue.base_info.poi_id;
                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].state = getRcText("available_state").split(",")[spValue.base_info.available_state-1]+"";
                refrshData[spValue.base_info.business_name+"("+spValue.base_info.branch_name+")"].numState = spValue.base_info.available_state;
            }else{
                //不满足条件则删除数据。
              if(key in refrshData){
                  delete refrshData[key];
                }
            }

        });
        $.each(refrshData,function(key,v){
            if(Object.prototype.toString.call(v.shop_name) === "[object String]")
            {
                reDataArr.push(v);
            }
        })

        $("#storeinfomationList").SList ("refresh", reDataArr);
    }

    function getAllWifiStoreList(appId,appSecret)
    {
        function getWifishopListSuc(wifiData)
        {
            console.log(wifiData);
            if(wifiData.errcode==0)
            {
                g_wifiShopNum++;
                $.merge( g_wifiShopList, wifiData.data.records );
                if(g_wifiShopNum * 20 < wifiData.data.totalcount )
                {
                    getAllWifiStoreList(appId,appSecret);
                }
                else
                {
                    console.log( g_wifiShopList );
                    refreshSlist();
                }
            }else{
                if($.MyLocale.ErrCode_WeiXin[wifiData.errcode]){
                    hPending.close();
                    Frame.Msg.info($.MyLocale.ErrCode_WeiXin[wifiData.errcode], "error");
                }else{
                    hPending.close();
                    Frame.Msg.info("获取门店信息失败", "error");
                }
            }

        }

        function getWifishopListFail(err){
            hPending.close();
            console.log(err);
        }

        var getWifishopListOpt={
            type:"POST",
            url:"/v3/ace/oasis/auth-data/o2oportal/wifiShop/getWifishoplist",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify({
                appId:appId,
                nasid:FrameInfo.Nasid,
                pagesize:20,
                pageindex:g_wifiShopNum+1
            }),
            onSuccess:getWifishopListSuc,
            onFailed:getWifishopListFail
        };

        Utils.Request.sendRequest(getWifishopListOpt);
    }

    function getChatStoreList(appId,appSecret){

            hPending = Frame.Msg.pending("获取微信门店列表...");

            function getShopListSuc(shopData){

                if(shopData.errcode==0)
                {
                    g_shopNum++;
                    $.merge( g_ShopList, shopData.business_list );
                    if(g_shopNum * 50 < shopData.total_count )
                    {
                        getChatStoreList(appId,appSecret);
                    }
                    else
                    {
                        getAllWifiStoreList(appId,appSecret);
                    }
                }
                else if(shopData.errcode==-1)
                {
                    hPending.close(200);

                    Frame.Msg.info(getRcText("WechatNotFind"),"error");
                    $("#storeinfomationList").SList ("refresh", []);
                }
                else
                {
                    hPending.close(400);
                    console.log(shopData);
                }
            }

            function getShopListFail(err){
                hPending.close();
                console.log(err);
            }

            var getShopListOpt={
                type:"POST",
                url:"/v3/ace/oasis/auth-data/o2oportal/wifiShop/getShoplist",
                contentType: "application/json",
                dataType: "json",
                data:JSON.stringify({
                    appId:appId,
                    nasid:FrameInfo.Nasid,
                    begin:g_shopNum * 50,
                    limit:50
                }),
                onSuccess:getShopListSuc,
                onFailed:getShopListFail
                }

            Utils.Request.sendRequest(getShopListOpt);
        }

    function activeStore(){

        var chatName = $("#PublicWeixin").singleSelect("value");

        function getStoreInfoSuc(data){

            for(var i=0,len=data.data.length;i<len;i++){
                if(data.data[i].name==chatName){
                    g_appId = data.data[i].appId;
                    g_appSecret = data.data[i].appSecret;
                    g_wifiShopList=[];//循环wifi门店列表初始化化
                    g_ShopList=[];///循环门店列表初始化化
                    g_shopNum = 0;//门店初始化循环
                    g_wifiShopNum = 0;//wifi门店初始化循环
                   getChatStoreList(data.data[i].appId,data.data[i].appSecret);

                }
            }
        }

        function getStoreInfoFail(err){
            console.log(err);
        }

        var getStoreInfoOpt = {
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query?storeId="+FrameInfo.Nasid,
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    name:chatName
                }),
            onSuccess: getStoreInfoSuc,
            onFailed: getStoreInfoFail

        }
        Utils.Request.sendRequest(getStoreInfoOpt);
    }

    function initForm()
    {
        //$("#filter_weixinstore").on("click", function(){
            //$("#weixinstore_block").toggle();
            $("#PublicWeixin").on("change",activeStore)
        //});
       
    }



    function _init(oPara)
    {
        initGrid();
        initData();
        initForm();
    }

    function _resize()
    {

    }
    function _destroy()
    {
        g_wifiShopList=[];
        g_ShopList=[];
        g_appId = "";
        g_appSecret="";
        g_shopNum = 0;//门店初始化循环
        g_wifiShopNum = 0;//wifi门店初始化循环
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect"],
        "utils": ["Base","Request"]
    });
}) (jQuery);
