;(function ($)
{
    var MODULE_NAME = "x_networkcfg.relateid";
    var WeChatData = [];
    var v2path = MyConfig.v2path;
    var clipboard;
    var hPending = null;
    var shopId = "";
    var AS=[];
    var iNow=0;
    var shopappSecret = "";
   /* var pageSize=10;
    var pageNum=8;*/
    var SPID=[];
    var add_empty = [
        '<div class="empty-add" id="AddIdBtn" editType="add">',
        '</div>'
    ].join("");

    var add_notempty = [
        // '<div class="space-44">','</div>',
        // '<div class="space-44">','</div>',
        '<div ><div style = "text-align:right" id="addnumber" class="forbidb"><button  class="btn btn_ok float-right forbid" id="AddIdBtn" addType="add">',
        getRcText("ADD_BTN"),
        // '添加账号'
        '</button></div>'
    ].join("");

    var data_Info = [
        '<div class="wechat-content">',
        '<div  class="detail-content" >',
        '<div class="wechat-img"></div>',
        '<div class="col-xs-11 content-offset">',
        '<div class="col-xs-7 response-block align-left title" style="min-width:560px;">',
        '<span class="float-left">',getRcText("TEXT").split(",")[0], '</span>',
        // '账号类型：'
        '<span class="idType title-value">',
        '[accountType]',    //服务号 订阅号  企业号
        '</span>',
        '<br/>',
        '<span class="float-left">',getRcText("TEXT").split(",")[1],'</span>',
        // '名称：'
        '<span class="idName title-value">',
        '[accountName]',
        '</span>',
        '<br/>',
        '<span class="float-left">','URL：','</span>',
        '<div class="idUrl title-value">',
        '<a class="copyUrl"  accountName=[accountName] data-clipboard-text="this" idurl="[idUrl]">',
        '[idUrl]',//
        '</a>',
        '<div class="divMouse" class="hideMenu" accountName=[accountName]>',
        '<div>',
        '<a>',
        getRcText("TEXT").split(",")[2],
        // '点击复制链接'
        '</a>',
        '</div>',
        '</div>',
        '<br/>',
        '<span style="color:#80878c">',getRcText("TEXT").split(",")[3],'</span>',
        // '(将此url配置到微信公众号平台)'
        '</div>',
        '<div class="v_spaceLine dynamic-margin">','</div>',
        '</div>',
        '<div class="col-xs-4 response-block align-left wifi-ctl">',
        '<button class="btn modify-wechat btn_ok forbid hidenn" "editType="edit" ' +
        'accountName=[accountName]  OwnerName=[OwnerName] Index=[Index] >',
        getRcText("TEXT1").split(",")[0],'</button>',
        // '编辑'
        '<button class="btn btn_ok showshop" editType="reviewshop"  ' +
        'accountName=[accountName] appId=[appId] appSecret=[appSecret] OwnerName=[OwnerName] Index=[Index] >',
        getRcText("TEXT1").split(",")[1],'</button>',
        // '门店信息'
        '<button class="btn btn_danger delete-btn forbid hidenn" editType="delete" ' +
        'accountName=[accountName] OwnerName=[OwnerName] Index=[Index]>',
        getRcText("TEXT1").split(",")[2],'</button>',
        // '删除'
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join("");

    function getWechat(getWechatSuc,getWechatFail){

        var getWechatOpt = {
            type: "GET",
            url: v2path+"/weixinaccount/query?storeId="+FrameInfo.Nasid,
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                ownerName:FrameInfo.g_user.user,
                ascending:true
            }),
            onSuccess:getWechatSuc,
            onFailed:getWechatFail
        };

        Utils.Request.sendRequest(getWechatOpt);
    }


    function delWechat(name,delWechatSuc){
        function delWechatFail(){
            Frame.Msg.info(getRcText("DEL_FAIL"),'error');
            hPending.close();
        }
        var delWechatOpt = {
            type: "POST",
            url: v2path+"/weixinaccount/deletewithoutvalidate",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                storeId:FrameInfo.Nasid, //租户id
                name:name,   //公众号名称
            }),
            onSuccess:delWechatSuc,
            onFailed:delWechatFail
        };

        Utils.Request.sendRequest(delWechatOpt);
    }

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function delWeChatInfo(){
        var accountName;
        var Index ;
        function onCancel()
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#delete_id_form")));
        }

        function onApply()
        {
            function delWechatSuc(data, textStatus, jqXHR){
                try {
                    if (data.errorcode == "1506") {
                        
                        $(".btn-apply").removeClass('disabled');
                        Frame.Msg.info(getRcText("MSG_INFO").split(",")[1], "error");
                        // "该微信公众号已经被绑定，不能删除"
                        return;
                    } else if (data.errorcode == "0") {
                        if (Index === 0) {
                            if ($(".content").length == 0) {
                                $(".main-content").children().remove();
                                $(".main-content").append(add_empty);
                            } else {
                                $(".content[accountname=accountName]").children().remove();
                                //Utils.Base.refreshCurPage();
                            }

                        }
                        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#DeleteIdDlg")));
                        Utils.Base.refreshCurPage();
                        Frame.Msg.info(getRcText("MSG_INFO").split(",")[2]);
                        // "删除成功"

                    } else {
                        $(".btn-apply").removeClass('disabled');
                        //Frame.Msg.info(data.errormsg || getRcText("MSG_INFO").split(",")[3], "error");
                        Frame.Msg.info( getRcText("MSG_INFO").split(",")[3], "error");
                        // "删除失败"
                        return;
                    }
                }catch(error){
                    $(".btn-apply").removeClass('disabled');
                    //Frame.Msg.info(data.errormsg || getRcText("MSG_INFO").split(",")[3], "error");
                    Frame.Msg.info(getRcText("MSG_INFO").split(",")[3], "error");
                    // "删除失败"
                }finally{

                }
            }
            $(".btn-apply").addClass('disabled');
            delWechat(accountName,delWechatSuc);


        }

        $(".btn_danger").live("click",function(){
            $("#delete_id_form").form ("init", "edit", {"title":getRcText("DELETE_USER"),
                "btn_apply":{action: onApply,enable:true}, "btn_cancel":onCancel});
            Utils.Base.openDlg(null, {}, {scope:$("#DeleteIdDlg"),className:"modal-small"});
            accountName = $(this).attr("accountname");
            Index =$(this).attr("Index");
        })
    }

    function initclick(){

        //add
        $("#AddIdBtn").live("click",function () {
            Utils.Base.redirect({ np:"x_networkcfg.addwechat",addType:"add"});
            return false;
        });
        //edit
        $(".modify-wechat").live("click",function () {
            var accountName = $(this).attr("accountname");
            Utils.Base.redirect({ np:"x_networkcfg.addwechat",addType:"edit",accountName:accountName});
            return false;
        });
        //delete
        delWeChatInfo();

        $(".copyUrl").live("mousemove", function (e) {
            var xPos = parseInt(e.pageX+50) + "px";
            var yPos = parseInt(e.pageY+10) + "px";
            $(".divMouse").css("left", xPos);
            $(".divMouse").css("top", yPos);
            $(".divMouse").css("display", "block");

        });
        $(".copyUrl").live("mouseout", function (e) {
            $(".divMouse").css("display", "none");

        });
        $(".showshop").die().live("click",function(){
            isShopListModalShow = 1;
            iNow=$(this).parent().parent().parent().parent().index();
            // var  initbegin=0;
            // ShopInfoAjax(initbegin);
            ShopInfoAjax();
        });
    }
    var isShopListModalShow = 0;
    function initGrid()
    {
        var opt = {
                colNames: getRcText("SHOP_LIST"),
                showOperation:false,
                pageSize:8,
                asyncPaging:false,
                multiSelect:false,
                search:false,
                sortable:false,
                // onPageChange:function(pageNum,pageSize){
                //     var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                //     var valueOflimitnum=pageSize;
                //     ShopInfoAjax(valueOfskipnum,valueOflimitnum);
                // },
                colModel: [
                    {name:'business_name', datatype:"String"}, //business_name branch_name
                    {name:'protocol_type', datatype:"String"},
                    // {name:'available_state',datatype:"String"},//1 系统错误 2 审核中 3 审核通过 4 审核驳回
                    // {name:'categories', datatype:"String"},//categories
                    // {name:'open_time',datatype:"String"},//open_time
                    // {name:'address', datatype:"String"},//province city  district address
                    // {name:'telephone', datatype:"String"}//telephone
                ]
        };
        $("#showList").SList ("head", opt);
    }


     function ShopInfoAjax(valueOfskipnum){
        hPending = Frame.Msg.pending(getRcText("PENDING"));
        var ShopInfoOpt = {
            type:"POST",
            url:MyConfig.v2path + '/wifiShop/getWifishoplist',
            contentType:"application/json",
            dataType:"json",
            timeout: 150000,
            data:JSON.stringify({
                nasid: FrameInfo.Nasid,
                appId:SPID[iNow],
                isAll:1
            }),
            onSuccess:ShopInfoSuc,
            onFailed:ShopInfoFail
        };
        Utils.Request.sendRequest(ShopInfoOpt);
    }
    // function ShopInfoAjax(valueOfskipnum){
    //     var url=v2path+"/wifiShop/getShoplist";
    //     var ShopInfoOpt = {
    //         type:"POST",
    //         url:url,
    //         contentType:"application/json",
    //         dataType:"json",
    //         timeout: 150000,
    //         data:JSON.stringify(
    //             {
    //             nasid: FrameInfo.Nasid,
    //             appId:SPID[iNow],
    //             begin:valueOfskipnum,
    //             appSecret:AS[iNow],
    //             limit:10
    //         }
    //     ),
    //         onSuccess:ShopInfoSuc,
    //         onFailed:ShopInfoFail
    //     };
    //     Utils.Request.sendRequest(ShopInfoOpt);
    // }
    function ShopInfoSuc(data)
       {
            var shopListData = [];
            try {
                if(!(data.data.records instanceof Array && data.data.records.length > 0)){
                    throw (new Error('data.business_list not exist'));
                }
                if (data.errcode !== "0") {
                    if (data.errcode == "-1") {
                        Frame.Msg.info(getRcText("MSG_INFO1").split(",")[0]);
                        // "请到微信公众平台配置ACCESE TOKEN!"
                        console.log("error errormessage: " + JSON.stringify(data.errmsg) + "error code:" + JSON.stringify(data.errcode));
                    }
                    else {
                        Frame.Msg.info(data.errmsg);
                       // console.log("error errormessage: " + JSON.stringify(data.errmsg) + "error code:" + JSON.stringify(data.errcode));
                    }
                    return;
                }
                var shopdata = data.data.records || [];
                $.each(shopdata, function (index, data) {
                    var shopdata1 = {};
                    shopdata1.business_name = data.shop_name;
                    switch (data.protocol_type) {
                        case 0:
                            shopdata1.protocol_type = getRcText("PROTOCOL_TYPE").split(",")[0];
                            break;
                        case 1:
                            shopdata1.protocol_type = getRcText("PROTOCOL_TYPE").split(",")[1];
                            break;
                        case 4:
                            shopdata1.protocol_type = getRcText("PROTOCOL_TYPE").split(",")[2];
                            break;
                        case 5:
                            shopdata1.protocol_type = getRcText("PROTOCOL_TYPE").split(",")[3];
                            break;
                        case 31:
                            shopdata1.protocol_type = getRcText("PROTOCOL_TYPE").split(",")[4];
                            break;
                        case null:
                            shopdata1.protocol_type = getRcText("PROTOCOL_TYPE").split(",")[5];
                            break;
                    }
    

                    // switch (data.base_info.available_state) {
                    //     case 1:
                    //         shopdata1.available_state = getRcText("AVAILABLE_STATE").split(",")[0];
                    //         // "系统错误"
                    //         break;
                    //     case 2:
                    //         shopdata1.available_state = getRcText("AVAILABLE_STATE").split(",")[1];
                    //         // "审核中"
                    //         break;
                    //     case 3:
                    //         shopdata1.available_state = getRcText("AVAILABLE_STATE").split(",")[2];
                    //         // "审核通过"
                    //         break;
                    //     case 4:
                    //         shopdata1.available_state = getRcText("AVAILABLE_STATE").split(",")[3];
                    //         // "审核驳回"
                    //         break;
                    // }
                    // shopdata1.categories = data.base_info.categories[0];
                    // shopdata1.open_time = data.base_info.open_time;
                    // shopdata1.address = data.base_info.province + data.base_info.city + data.base_info.district + data.base_info.address;
                    // shopdata1.telephone = data.base_info.telephone;
                    shopListData.push(shopdata1);
                });
                if(isShopListModalShow){
                    hPending&&hPending.close();
                    $("#shop_form").form ("init", "edit", {"title":getRcText("SHOP_NAME"),
                        "btn_apply":false, "btn_cancel":false});
                    Utils.Base.openDlg(null, {}, {scope:$("#shopDlg"),className:"modal-large"});
                    isShopListModalShow = !isShopListModalShow
                }
                //$("#showList").SList("refresh",{"data":shopListData,"total":data.total_count});
                $("#showList").SList("refresh",shopListData);
            }catch(error){
                hPending&&hPending.close();
                shopListData = [];
                $("#shop_form").form ("init", "edit", {"title":getRcText("SHOP_NAME"),
                    "btn_apply":false, "btn_cancel":false});
                Utils.Base.openDlg(null, {}, {scope:$("#shopDlg"),className:"modal-large"});
                $("#showList").SList("refresh",{"data":shopListData,"total": "0" });
                Frame.Msg.info(getRcText("MSG_INFO").split(",")[4], "error");
                // "门店列表为空"
            }

    }
    function ShopInfoFail()
    {
        Frame.Msg.info(getRcText("MSG_INFO").split(",")[0], "error");
        // "获取门店列表失败"
        hPending&&hPending.close();
    }
    function initData(){
        WeChatData = [];
        SPID=[];
        AS=[];
        function getWechatSuc(data, textStatus, jqXHR){
            var WeChatData1 = [];
            try {
                if (0 !== data.errorcode) {
                    $("#wechat-id").children().remove();
                    console.log("Find wechat base infomation error errormessage: " + data.errormsg);
                   // Frame.Msg.info(getRcText("DATA_ERROR"), "error");
                    return;
                }

                if(!(('data' in data) && (data.data instanceof Array ) && (data.data.length > 0) )){
                    throw(new Error('data.data not exist'));
                }
                WeChatData1 = (data.data === "" ? [] : data.data);
                if (WeChatData1.length == 0) {
                $(".main-content").children().remove();
                $(".main-content").append(add_empty);
                return;
                }

                $(".main-content").children().remove();

                //$(".main-content").parent().prepend(add_notempty);
                //initFenJiFenQuan();
                var count = 0;
                $.map(WeChatData1, function (map, index) {
                    var accountType = map.type;
                    var accountName = map.name;
                    var idUrl = map.url;
                    var appId = map.appId;
                    shopId = map.appId;
                    shopappSecret=map.appSecret;
                    var appSecret = map.appSecret;
                    SPID.push(map.appId);
                    AS.push(map.appSecret);


                    //$(".main-content").children().remove();
                    if (accountType == 1) {
                        var IdType = getRcText("ID_TYPE").split(",")[0];
                        // "订阅号"
                    } else if (accountType == 2) {
                        var IdType = getRcText("ID_TYPE").split(",")[1];
                        // "服务号"
                    } else if (accountType == 3) {
                        var IdType = getRcText("ID_TYPE").split(",")[2];
                        // "企业号"
                    }

                    var dataInfo = data_Info
                        .replace(/\[OwnerName\]/g, FrameInfo.g_user.user)
                        .replace(/\[accountType\]/g, IdType)
                        .replace(/\[accountName\]/g, accountName)
                        .replace(/\[idUrl\]/g, idUrl)
                        .replace(/\[Index\]/g, count)
                        .replace(/\[appId\]/g, appId)
                        .replace(/\[appSecret\]/g, appSecret);

                    // $(".main-content").prepend(dataInfo);
                    $(".main-content").append(dataInfo);
                    initFenJiFenQuan();
                });
                $(".xxb .wechat-content:first-child .detail-content").css("marginTop","10px");
            }catch(error){
                $(".main-content").children().remove();
                $(".main-content").append(add_empty);
               // Frame.Msg.info(getRcText("DATA_ERROR"), "error");
                console.log("Find wechat detail infomation error errormessage: " + JSON.stringify(error));
            }finally{
                if (WeChatData1.length == 0) {
                    $(".main-content").children().remove();
                    $(".main-content").append(add_empty);
                    return;
                }
            }
        }

        function getWechatFail(jqXHR, textStatus, error){
            $(".main-content").children().remove();
            $(".main-content").append(add_empty);
            Frame.Msg.info(getRcText("DATA_ERROR"), "error");
            console.log("Find wechat base infomation error errormessage: " + JSON.stringify(error));
            hPending&&hPending.close();
        }
        getWechat(getWechatSuc,getWechatFail);

    }

    function _init ()
    {
        clipboard = new Clipboard('.copyUrl', {
            //target: function() {
            //return document.querySelector('a[accountname='+this.attr("accountname")+']');
            //}
            text: function (target) {
                return target.getAttribute("idurl");
            }
        });
        clipboard.on('success', function (e) {
            console.log(e);
            //alert("已复制");
            Frame.Msg.info(getRcText("MSG_INFO1").split(",")[1]);
            // "已复制"
        });

        clipboard.on('error', function (e) {
            console.log(e);
        });

        $(".main-content").children().remove();
        initclick();
        initGrid();
        initData();
        //initFenJiFenQuan();
    }
    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu= Frame.Permission.getCurPermission();
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        //3 作具体的“显示、隐藏”处理
        if($.inArray("WRITE",arrayShuZuNew) ==-1){
            //隐藏“写”的功能
            //写
            $(".forbid").css('display','none');
            //$(".forbidb").attr('disabled','true');
            console.log($(".hidenn").remove());
        }
        else{
                if( document.getElementById("addnumber")){
                   return;
                }
            else{
                    $(".main-content").parent().prepend(add_notempty);
                }

        }

    }
    function _resize(jParent)
    {

    }

    function _destroy()
    {
        //$(".showshop").die("click");
        clipboard.destroy();
        hPending&&hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base","Request"]
    });
}) (jQuery);


