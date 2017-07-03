/**
 * Created by Administrator on 2015/11/26.
 */
(function ($)
{
    var MODULE_NAME = "h_systemmanage.smsconfigure";
    var v2path = MyConfig.v2path;
    var g_PercentMax = 100;

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
            if(oStData.name.length<6 || oStData.name.length>20 || checkName.test(oStData.name)==false)
            {
                Utils.Widget.setError($("#chatname"),"���Ʊ�����6-20����ĸ�����֡��»��߻���ŵ����");
                return false;
            }
            else{
                var re=/^[a-zA-Z]{1}$/;
                if(!re.test(oStData.name.substring(0,1)))
                {
                    Utils.Widget.setError($("#chatname"),"���Ʊ�������ĸ��ͷ");
                    return false;
                }
            }

            var checkToken=/^[a-zA-Z0-9]*$/;
            if(oStData.token.length<3 || oStData.token.length>32 || checkToken.test(oStData.token)==false)
            {
                Utils.Widget.setError($("#token"),"Token������3-32��Ӣ�Ļ�����");
                return false;
            }

            var checkKey=/^[a-zA-Z0-9]*$/;
            if(oStData.encodingAesKey.length<43 || oStData.encodingAesKey.length>43 || checkKey.test(oStData.encodingAesKey)==false)
            {
                Utils.Widget.setError($("#encodingAesKey"),"encodingAesKey������Ӣ�Ļ�����");
                return false;
            }

            if(oStData.appId.indexOf(" ")!= -1){
                Utils.Widget.setError($("#appId"),"APP ID�����пո�");
                return false;
            }
            if(oStData.appSecret.indexOf(" ")!= -1){
                Utils.Widget.setError($("#appSecret"),"APP SECRET�����пո�");
                return false;
            }
            var checkThemeName=/^[a-zA-Z0-9]*$/;
            if(oStData.themeName.length<0 || oStData.themeName.length>32 || checkThemeName.test(oStData.themeName)==false)
            {
                Utils.Widget.setError($("#themeName"),"themeName������1-32���ַ�");
            }
            //check
            var url=v2path;
            if(sName == "add"){
                url +="/weixinaccount/add"
            }else{
                url +="/weixinaccount/modify"
            }
            var requestData= $.extend(chatData,oStData);

            //$.ajax({
            //    type: "POST",
            //    url: url,
            //    contentType:"application/json",
            //    dataType:"json",
            //    data:JSON.stringify(requestData),
            //    //username:username,
            //    //password:password,
            //    success:function(data){
            //        if(data.errorcode==0){
            //            onSuccess();
            //            Frame.Msg.info("���óɹ�");
            //        }else{
            //            onSuccess();
            //            Frame.Msg.info(data.errormsg);
            //        }
            //    },
            //    error:function(err){
            //        //TODO ajax�·�������
            //        // Frame.Msg.error("������");
            //    }
            //
            //})
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

        $("#rand").on("click", function(){
            jFormChat.form("updateForm",{
                encodingAesKey:randomString(43)
            });
            return false;
        });

        if(sName == "add") //Add
        {
            $("#chatname",jFormChat).attr("readonly",false);
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
            jFormChat.form ("init", "edit", {"btn_apply": onSubmitChat, "btn_cancel":onCancel});
            jFormChat.form("updateForm",oRowdata);
            $("input[type=text]",jFormChat).each(function(){
                Utils.Widget.setError($(this),"");
            });
        }
    }
    function onDelChat(oData)
    {
        //$.ajax({
        //    type: "post",
        //    url: v2path+"/weixinaccount/delete",
        //    contentType:"application/json",
        //    dataType:"json",
        //    data:JSON.stringify({ownerName:FrameInfo.g_user.attributes.name,"name":oData.name}),
        //    //username:username,
        //    //password:password,
        //    success:function(data){
        //        if(data.errorcode == "1506")
        //        {
        //            Frame.Msg.error("��΢�Ź��ں��Ѿ����󶨣�����ɾ��");
        //        }else if(data.errorcode == "0") {
        //            Frame.Msg.info("ɾ���ɹ�");
        //        }else{
        //            Frame.Msg.info(data.errormsg||"ɾ��ʧ��");
        //        }
        //        Utils.Base.refreshCurPage();
        //    },
        //    error:function(err){
        //        //TODO ajax�·�������
        //    }
        //
        //})
    }


    function initData(jScope)
    {
        //  alert(FrameInfo.g_user.user)
        chatListData();
    }


    function chatListData(){

        var chatdata  = [];
        chatdata.push(
        {
            "name":"ceshi_sss",
            "appId": "11111",
            "appSecret":'1111111',
            "token":"444444"
         });
        $("#chatList").SList ("refresh", chatdata);
        //$.ajax({
        //    type: "GET",
        //    url: v2path+"/weixinaccount/query",
        //    contentType:"application/json",
        //    dataType:"json",
        //    data:{"ownerName":FrameInfo.g_user.attributes.name},
        //    //username:username,
        //    //password:password,
        //    success:function(data){
        //        //alert("suc"+data);
        //        //alert(JSON.stringify(data));
        //        if(data.errorcode == 0){
        //            $.each(data.data,function(key,value){
        //                var authTemplate={}
        //                authTemplate.name=value.name;
        //                authTemplate.appId=value.appId;
        //                authTemplate.appSecret=value.appSecret;
        //                authTemplate.token=value.token;
        //                authTemplate.type=value.type;
        //                authTemplate.encodingAesKey=value.encodingAesKey;
        //                authTemplate.cipherMode=value.cipherMode;
        //                authTemplate.ifWeixinAuth=value.ifWeixinAuth;
        //                authTemplate.url=value.url;
        //                authTemplate.description=value.description;
        //
        //                chatdata.push(authTemplate);
        //            })
        //            $("#chatList").SList ("refresh", chatdata);
        //        }else {
        //            //TODO errorcode����
        //            Frame.Msg.error("��ѯ�����쳣");
        //        }
        //    },
        //    error:function(err){
        //        // Frame.Msg.error(JSON.stringify(err));
        //    }
        //});
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
        $("#chatList").SList ("head", optchat);

    }

    function initForm(){
        $("#simpledraw").on("click",function(){
            Frame.Util.openpage(
                {
                    pageURL:this.value,
                    height:"500px",
                    hotkeys:"no"
                })
            return false;
        });
        $("#feelauth1").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").removeClass("hide");
        });
        $("#feelauth2").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").addClass("hide");
        });
        $("#authType2").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").removeClass("hide");
        });
        $("#authType1").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").addClass("hide");
        });

        //��������ҳ��
        $("#detail").on("click", function(){
            Utils.Base.redirect ({np:"h_mchannel.drawpage"});
            return false;
        });
    }
    function _init ()
    {
        initGrid();
        initData();
        initForm();
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
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base"]
    });
}) (jQuery);

