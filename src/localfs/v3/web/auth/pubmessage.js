/**
 * Created by Administrator on 2015/11/26.
 */
;(function ($)
{
    var MODULE_NAME = "auth.pubmessage";
    var v2path = MyConfig.v2path;
    var username =MyConfig.username;
    var password = MyConfig.password;
    var g_Radios, g_PercentMax = 100;

    var g_fqfj_operateBtn=true;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function showChat(oRowdata, sName){
        function onCancel()
        {
            jFormChat.form("updateForm",oRowdata);
            $("input[type=text]",jFormChat).each(function(){
                Utils.Widget.setError($(this),"");
            });
            return false;
        }

        function onSubmitChat()
        {
            function onSuccess(){
                if(sName == "add")
                {
                    Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormChat));
                }
                Utils.Base.refreshCurPage();
            }
            var oTempTable = {
                index:[],
                column:["name","type","appId","appSecret","encodingAesKey","cipherMode","token","ifWeixinAuth","url","description"]
            };
            var oStData = jFormChat.form ("getTableValue", oTempTable);
            var chatData={
                ownerName:FrameInfo.g_user.attributes.name,
            }

            //check
            var checkName=/^[a-zA-Z0-9\_\-]*$/;
            if(checkName.test(oStData.name)==false){
                Utils.Widget.setError($("#chatname"),"名称必须是字母、数字、下划线或减号的组合");
                return false;
            }else if(oStData.name.length<6){
                Utils.Widget.setError($("#chatname"),"名称不能小于6个字符。");
                return false;
            }else{
                var re=/^[a-zA-Z]{1}$/;
                if(!re.test(oStData.name.substring(0,1)))
                {
                    Utils.Widget.setError($("#chatname"),"名称必须以字母开头。");
                    return false;
                }
            }

            var checkToken=/^[a-zA-Z0-9]*$/;
            if(oStData.token.length<3 || oStData.token.length>32 || checkToken.test(oStData.token)==false)
            {
                Utils.Widget.setError($("#token"),"Token必须是3-32个英文或数字且不能包含中文和@、#、¥等特殊字符。");
                return false;
            }

            var checkKey=/^[a-zA-Z0-9]*$/;
            if(oStData.encodingAesKey.length<43 || oStData.encodingAesKey.length>43 || checkKey.test(oStData.encodingAesKey)==false)
            {
                Utils.Widget.setError($("#encodingAesKey"),"encodingAesKey必须是英文或数字。");
                return false;
            }

            if(oStData.appId.indexOf(" ")!= -1){
                Utils.Widget.setError($("#appId"),"APP ID不能有空格。");
                return false;
            }
            if(oStData.appSecret.indexOf(" ")!= -1){
                Utils.Widget.setError($("#appSecret"),"APP SECRET不能有空格。");
                return false;
            }
            //check
            var url=v2path;
            if(sName == "add"){
                url +="/weixinaccount/add"
            }else{
                url +="/weixinaccount/modify"
            }
            var requestData= $.extend(chatData,oStData);

            requestData.storeId = FrameInfo.Nasid;

            var weixinaccountOpt = {
                type: "POST",
                url: url,
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(requestData),
                onSuccess: weixinaccountSuc,
                onFailed: weixinaccountFail
            }

            function weixinaccountSuc(data){
                if(data.errorcode==0){
                    onSuccess();
                    Frame.Msg.info("配置成功");
                }else{
                    if( data.errorcode == 1501 ){
                        Frame.Msg.info("公众号名称不符合规范","error");
                    }else if( data.errorcode == 1502 ){
                        Frame.Msg.info("Token必须为英文或数字","error");
                    }else if( data.errorcode == 1503 ){
                        Frame.Msg.info("加密秘钥格式错误","error");
                    }else if( data.errorcode == 1504 ){
                        Frame.Msg.info("该公众号名称已存在","error");
                    }else if(data.errorcode == 1507){
                        Frame.Msg.info("APP ID已经存在","error");
                    }
                }
            }

            function weixinaccountFail(){
                console.log("fail1");
            }

            Utils.Request.sendRequest(weixinaccountOpt);
        }
        var jFormChat = $("#chattoggle_form");

        function randomString(len) {
            len = len || 43;
            var $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var maxPos = $chars.length;
            var pwd = '';
            for (i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }

        function oSort(arr)
        {
            var result ={};
            var newArr=[];
            for(var i=0;i<arr.length;i++)
            {
                if(!result[arr])
                {
                    newArr.push(arr)
                    result[arr]=1
                }
            }
            return newArr
        }

        function url_randomString(len) {
            len = len || 6;
            var $chars = "0123456789";
            var maxPos = $chars.length;
            var pwd = [];
            for (i = 0; i < len; i++) {
                pwd.push($chars.charAt(Math.floor(Math.random() * maxPos)));
            }
            var newArr=oSort(pwd);
            var newString=newArr[0].join("");
            return "http://oasisauth.h3c.com/weixin/"+newString;
        }
        $(".info-help").addClass('hide');

        $("#rand").on("click", function(){
            jFormChat.form("updateForm",{
                encodingAesKey:randomString(43)
            });
            return false;
        });

        $("#url_rand").on("click", function(){
            jFormChat.form("updateForm",{
                url:url_randomString(6)
            });
            return false;
        });
        $("#chatToggle").find('.info-tip').css({
            color:"#4ec1b2",
            fontSize:"17px",
            margin:"10px 0 10px 15px"
        });
        $("#encodingAesKey",jFormChat).attr("readonly",true);

        
        $("#appSecret").keyup(function(){

            $("#appSecret").val($("#appSecret").val());

        });


        if(sName == "add") //Add
        {
            $("#chatname",jFormChat).attr("readonly",false);
            $("#url").replaceWith('<input type="text" class="url big" id="url" error_id="chatUrl_error"/>');
            $("#url",jFormChat).attr("readonly",true);
            $("#url_rand").show();
            var jDlg = $("#AddChatTempDlg");
            if(jDlg.children().length)
            {
                $("#chatToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#chatToggle").show().appendTo(jDlg);
            }

            jFormChat.form("init", "edit", {"title":getRcText("ADDChat_TITLE"),"btn_apply": onSubmitChat});
            jFormChat.form("updateForm",{
                token: "",
                name:"",
                url:"",
                description:"",
                appId:"",
                appSecret:"",
                encodingAesKey:"",
                type : "1",
                cipherMode:"1",
                ifWeixinAuth:"0"
            });
            
            $("input[type=text]",jFormChat).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        }
        else //Edit
        {
            $("#chatname",jFormChat).attr("readonly",true);
            $("#url",jFormChat).attr("readonly",true);
            $("#url_rand").hide();
            jFormChat.form ("init", "edit", {"btn_apply": onSubmitChat, "btn_cancel":onCancel});
            jFormChat.form("updateForm",oRowdata);
            $("input[type=text]",jFormChat).each(function(){
                Utils.Widget.setError($(this),"");
            });
            $("#url").replaceWith('<label type="text" class="url big" id="url" error_id="chatUrl_error"></label>');
            $("#url").text(oRowdata.url);

        }
    }

    function onDelChat(oData)
    {
        var weixinaccountDelOpt = {
            type: "post",
            url: v2path+"/weixinaccount/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({storeId:FrameInfo.Nasid,"name":oData.name}),
            onSuccess: weixinaccountDelSuc,
            onFailed: weixinaccountDelFail
        }

        function weixinaccountDelSuc(data){
            console.log("sec2");
            if(data.errorcode == "1506")
            {
                Frame.Msg.info("该微信公众号已经被绑定，不能删除","error");
            }else if(data.errorcode == "0") {
                Frame.Msg.info("删除成功");
            }else{
                Frame.Msg.info(data.errormsg||"删除失败","error");
            }
            Utils.Base.refreshCurPage();
        }

        function weixinaccountDelFail(){
            console.log("fail2");
        }

        Utils.Request.sendRequest(weixinaccountDelOpt);
    }


    function initData(jScope)
    {
      //  alert(FrameInfo.g_user.user)
        chatListData();
    }

    function chatListData(){

        var chatdata  = [];
        var weixinaccountQueryOpt = {
            type: "GET",
            url: v2path+"/weixinaccount/query",
            contentType:"application/json",
            dataType:"json",
            data:{"storeId":FrameInfo.Nasid},
            onSuccess: weixinaccountQuerySuc,
            onFailed: weixinaccountQueryFail
        }

        function weixinaccountQuerySuc(data){
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

                    chatdata.push(authTemplate);
                })
                $("#chatList").SList ("refresh", chatdata);
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

    function initGrid()
    {
        var optchat = {
            colNames: getRcText ("Chat_HEADER"),
            multiSelect: false,
            colModel: [
                {name:'name', datatype:"String"},
                {name:'appId', datatype:"String"},
                {name:'appSecret', datatype:"String"},
                {name:'token', datatype:"String"}
                //{name:'type', datatype:"String"},
                //{name:'encodingAesKey', datatype:"String"},
                //{name:'cipherMode', datatype:"String"},
                //{name:'token', datatype:"String"},
                //{name:'ifWeixinAuth', datatype:"String"},
                //{name:'url', datatype:"String"},
                //{name:'description', datatype:"String"}
            ],
            onToggle : {
                action : showChat,
                jScope : $("#chatToggle"),
                BtnDel : {
                    show : true,
                    action : onDelChat
                }
            },
            buttons:[
                {name: "add", action: showChat}
            ]
        };

        if(!g_fqfj_operateBtn){
            delete optchat.onToggle;
        }

        $("#chatList").SList ("head", optchat);

    }

    function initForm(){

        //链接详情页面
        $("#detail").on("click", function(){
            Utils.Base.redirect ({np:"auth.drawpage"});
            return false;
        });
    }
    function _init ()
    {
        initFenJiFenQuan();

        initGrid();
        initData();
        initForm();

        initFenJiFenQuan();
    }

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
            ($(".slist-button[title='添加']")) .css('display','none');
            g_fqfj_operateBtn=false;
        }

    }
    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_PercentMax = 100;
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form","Toggle"],
        "utils": ["Base","Request"]
    });
}) (jQuery);

