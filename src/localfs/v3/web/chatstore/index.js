;(function ($)
{
    var MODULE_NAME = "chatstore.index";
    var rc_info = "chatstore_rc";
    var g_ssidArr= [];
    var g_appId,g_appSecret,g_weChatName,hPending;
    var g_del_Status = {};
    var v2path = "/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal";

    var g_fqfj_operateBtn=true;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    
    function editTest(colData){
    }

    function deleteWifiShop(param){

        function delWifiShopSuc(data){
            
            if(data.errcode == 0){
                Frame.Msg.info(g_del_Status.suc);
                Utils.Base.refreshCurPage();
            }else{
                Frame.Msg.info(g_del_Status.fal,"error")
            }
        }

        function delWifiShopFail(err){
            console.log(err);
        }

        var delWifiShopOpt = {
            type:"POST",
            url:MyConfig.v2path+"/wifiShopDb/deleteWifiShop",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify({
                appId:param.appId,
                nasid:FrameInfo.Nasid,
                shop_id:param.shop_id
            }),
            onSuccess: delWifiShopSuc,
            onFailed: delWifiShopFail

        }
        Utils.Request.sendRequest(delWifiShopOpt);
    }

    function deleteShop(param){

        function delShopSuc(data){

            if(data.errcode == 0){
                if(param.shop_id){
                    deleteWifiShop(param);
                }else{
                    Frame.Msg.info(g_del_Status.suc)
                    Utils.Base.refreshCurPage();
                }

            }
        }
        function delShopFail(err){
            console.log(err);
        }

        var delShopOpt = {
            type:"POST",
            url:MyConfig.v2path+"/wifiShopDb/deleteShop",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify({
                appId:param.appId,
                nasid:FrameInfo.Nasid,
                poi_id:param.poi_id
            }),
            onSuccess: delShopSuc,
            onFailed: delShopFail

        }
        Utils.Request.sendRequest(delShopOpt);
    }

    function delTest(colData){

        deleteShop({
            poi_id:colData[0].poi_id,
            shop_id:colData[0].shop_id,
            appId:colData[0].appId
        });
    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";
        if ( "text" == type)
        {
            return "设置";
        }
        var shop_id = dataContext.shop_id;
        var sid = dataContext.sid;
        var checkState = dataContext.checkState;
        var chatName= dataContext.chatName;

        if(!shop_id||!sid||checkState!=3){
            return '<i class="fa fa-cog" style="font-size: 20px"></i>';
        }

        return '<a class="list-link" data-chatName = "'+chatName+'" data-sid = "'+sid+'" data-shopId ="'+shop_id+'" ><i class="fa fa-cog" style="font-size: 20px"></i></a>';
    }


    function redirectStroe(){

        Utils.Base.redirect ({np:"chatstore.storeinfomation"});
    }

    function onDisDetail()
    {
        var shopId = $(this).attr("data-shopId");
        var sid =  $(this).attr("data-sid");
        var chatName = $(this).attr("data-chatName");
        Utils.Base.redirect (
            {   np:"chatstore.config",
                sid:sid,
                shopId:shopId,
                chatName:chatName
              /*  appId:g_appId,
                appSecret:g_appSecret*/
            });
    }

    function showEnable(colData){
        var selecteVal = colData[0];
       /* if(selecteVal.poi_id&&selecteVal.shop_id){
            return true;
        }*/
        if(selecteVal.poi_id){
            return true;
        }
        return false;

    }

    function initGrid()
    {
        var opt = {
            colNames: getRcText ("chatStore_HEADER"),
            // showOperation:true,
            showOperation:g_fqfj_operateBtn,
            pageSize:10,
            colModel: [
                {name:'name',datatype:"String"},
                {name:'chatName', datatype:"String"},
                {name:'ssidName',datatype:"String"},
                {name:'state',datatype:"String"},
                {name:'storeSet',datatype:"String",formatter:showLink}
            ],
            buttons:[
                {name:"edit",enable:false,action:editTest},
                {name:"delete",enable:showEnable,action:delTest},
                {name:"redirect",value:getRcText("redirectBtn"),action:redirectStroe}
            ]
        };

        if(!g_fqfj_operateBtn){
            opt.colModel.pop();
        }

        $("#chatstoreList").SList ("head", opt);

        $("#chatstoreList").on('click', 'a.list-link', onDisDetail);
    }

    function initData()
    {
        getWechatList();
    }
    //获取微信公众号，列表
    function getWechatList(){
        function getChatListSuc(data){

            var aIntList = [];
            $.each(data.data,function(index, value) {
                aIntList.push(value.name);
            });
            $("#PublicWeixin").singleSelect("InitData",aIntList);
            $("#PublicWeixin").singleSelect("value",aIntList[0]);
            
            if(data.data.length<=0)
            {
                hPending.close();
                return;
            }
            g_appId = data.data[0].appId;
            g_appSecret = data.data[0].appSecret;
            g_weChatName = aIntList[0];
            getChatStoreList();
        }

        function getChatListFail(err){
            hPending.close()
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

    function getChatStoreList(){

        function getShopListSuc(data){

            hPending.close();
            if(data.errcode == 0){

                var available_state = getRcText("available_state").split(",");
                var chatStoreInfo = data.base_infos;
                var reDataArr = [];
                function getWifiShopListSuc(wifiData){
                    var refrshData = {};
                    var wifiDataArr = wifiData.datas;
                    $.each(chatStoreInfo,function(i,v){
                        var reData = {};
                        reData.name = v.business_name;
                        reData.appId = v.appId;
                        reData.chatName = v.accountName;
                        reData.state = available_state[v.available_state];
                        reData.checkState = v.available_state;
                        reData.poi_id = v.poi_id||"";
                        reData.storeSet = "";
                        if(v.sid){
                           /* reData.ssidName = "";
                            reData.shop_id ="";
                            reData.sid ="";
                            reData.storeSet = "";*/
                            reData.sid = v.sid;
                            refrshData[v.sid] =reData
                        }else if(!v.branch_name)
                        {
                            refrshData[v.bussiness_name] =reData
                        }
                        else
                        {
                            refrshData[v.bussiness_name+"("+v.branch_name+")"] =reData
                        }

                    })
                    $.each(wifiDataArr,function(i,v){
                        if(refrshData[v.sid]){
                            refrshData[v.sid].ssidName = v.ssid;
                            refrshData[v.sid].shop_id =v.shop_id;
                        }else if(refrshData[v.shop_name]){
                            refrshData[v.shop_name].ssidName = v.ssid;
                            refrshData[v.shop_name].shop_id =v.shop_id;
                        }

                    });
                    $.each(refrshData,function(key,v){
                        reDataArr.push(v);
                    })

                    $("#chatstoreList").SList ("refresh", reDataArr);
                }

                function getWifiShopListFail(wifiErr){
                    console.log(wifiErr);
                }

                var getWifiShopListOpt={
                    type:"POST",
                    url:MyConfig.v2path+"/wifiShopDb/queryWifiShopList",
                    contentType: "application/json",
                    dataType: "json",
                    data:JSON.stringify({
                        appId:g_appId,
                        nasid:FrameInfo.Nasid
                    }),
                    onSuccess:getWifiShopListSuc,
                    onFailed:getWifiShopListFail
                };

                Utils.Request.sendRequest(getWifiShopListOpt);
            }
        }

        function getShopListFail(err){
            hPending.close();
            console.log(err);
        }


        var getShopListOpt={
            type:"POST",
            url:"/v3/ace/oasis/auth-data/restapp/o2oportal/wifiShopDb/queryShopList",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify({
                appId:g_appId,
                nasid:FrameInfo.Nasid
            }),
            onSuccess:getShopListSuc,
            onFailed:getShopListFail
        }
        Utils.Request.sendRequest(getShopListOpt);
    }

    function initForm()
    {

    }

    function getSIIDListInfo()
    {
        hPending = Frame.Msg.pending("获取微信门店列表...");
        function getSSIDListSuc(data){
            $.each(data.ssidList,function(i,v){
                g_ssidArr.push(v.ssid_name);
            });
            initData();
        }

        function getSSIDListFail(err){
            hPending.close();
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

    function _init(oPara)
    {
        
        g_del_Status.suc = getRcText("del_statu").split(",")[0];
        g_del_Status.fal = getRcText("del_statu").split(",")[1];

        initFenJiFenQuan();

        initGrid();
        getSIIDListInfo();
        initForm();

        initFenJiFenQuan();
    };

    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu=[];
        arrayShuZu=Frame.Permission.getCurPermission();
        
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        // console.log(arrayShuZuNew);
            
        //3 作具体的“显示、隐藏”处理
        if($.inArray("WRITE",arrayShuZuNew)==-1){
            //隐藏“写”的功能
            //写
            g_fqfj_operateBtn=false;
            ($(".slist-button[title='导入门店']")) .css('display','none');
        }

    }
    function _destroy()
    {
        g_ssidArr= [];
        g_appId = "";
        g_appSecret = "";
        g_weChatName = "";
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        g_Status = {};
    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect"],
        "utils": ["Base","Request","Device"]
    });
}) (jQuery);
