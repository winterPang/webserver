/**
 * Created by Administrator on 2015/11/26.
 */
(function ($)
{
    var MODULE_NAME = "auth.index";
    var v2path = MyConfig.v2path;
    var username =MyConfig.username;
    var password = MyConfig.password;
    var g_Radios, g_PercentMax = 100;

    var g_fqfj_operateBtn=true;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    //监听闲置切断时长。当闲置切断时长为0的时候，隐藏闲置切断流量。
    function fn_add_sub(){
        $("#restTime").on("change",function(){
            if ( $("#restTime").val() == 0 )
            {
                $("#idle_flow_cut").addClass("hide");
            }
            else{
                $("#idle_flow_cut").removeClass("hide");
            }
        })
    }

    //判断是不是整数。
    function isInteger(str){
        var reg = /^\d+$/;
        return reg.test(str);
    }


    function showAUth(oRowdata, sName){
        function onCancel()
        {
            if(oRowdata.authType == 1||oRowdata.authType==getRcText ("AUTH_Status").split(",")[1]){
                oRowdata.authType = 1;
                $("#other_auth").addClass("hide");
            }else{
                oRowdata.authType = 2;
                $("#other_auth").removeClass("hide");
            }
            if(oRowdata.isEnableAccount==0||oRowdata.isEnableAccount==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableAccount = 0;
            }else{
                oRowdata.isEnableAccount = 1;
            }
            if(oRowdata.isEnableSms==0||oRowdata.isEnableSms==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableSms = 0;
            }else{
                oRowdata.isEnableSms = 1
            }
            if(oRowdata.isEnableWeixin==0||oRowdata.isEnableWeixin==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableWeixin = 0;
            }else{
                oRowdata.isEnableWeixin = 1;
            }
            if(oRowdata.isWeixinConnectWifi==0||oRowdata.isWeixinConnectWifi==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isWeixinConnectWifi = 0;
            }else{
                oRowdata.isWeixinConnectWifi = 1;
            }
            if(oRowdata.nosension=="0"){
                oRowdata.feelauth = "0";
                $("#anthTime").addClass("hide");
            }else{
                oRowdata.feelauth = "1";
                oRowdata.unauthtime = oRowdata.nosension;
                $("#anthTime").removeClass("hide");
            }
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            return false;
        }

        function onSubmitSSID()
        {
            function onSuccess(){
                if(sName == "add")
                {
                    Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                }
                Utils.Base.refreshCurPage();
               // authListData();
            }

            var oTempTable = {
                index:[],
                column:["authCfgTemplateName","authType","isEnableSms","isEnableWeixin","isWeixinConnectWifi","isEnableAccount","location","feelauth","unauthtime",
                    "ONLINE_MAX_TIME","URL_AFTER_AUTH","IDLE_CUT_TIME","IDLE_CUT_FLOW","NO_SENSATION_TIME"]
            };
            var oStData = jFormSSID.form ("getTableValue", oTempTable);

            if ( !oStData.unauthtime )                   /* 解决添加认证模板时不成功的问题。因为这个字段获取不到所以添加判断 */
            {
                oStData.unauthtime = 0;
            }
            var online_time_Index = oStData.ONLINE_MAX_TIME*60;      //让在线时长和闲置切断时长的单位一置
            oStData.URL_AFTER_AUTH = oStData.URL_AFTER_AUTH || "";   //如果获取不到url就下发一个空字符串

            if(!(isInteger(oStData.ONLINE_MAX_TIME)) || !(isInteger(oStData.IDLE_CUT_TIME))){
                Frame.Msg.error("参数输入错误，请输入正整数");
                return false;
            }


            if ( oStData.IDLE_CUT_TIME == 0)                        //如果切断时长为0，则将切断流量置为默认值。
            {
                oStData.IDLE_CUT_FLOW = 10240;
            }

            var authData={
                ownerName:FrameInfo.g_user.attributes.name,
                isEnableAli:0,
                isEnableQQ:0,
                authType:oStData.authType,
                location:oStData.location,
                v3flag:1,                                            //添加标记位，便于过滤数据
                uamAuthParamList:[
                    {authParamName:"ONLINE_MAX_TIME",authParamValue:online_time_Index},
                    {authParamName:"URL_AFTER_AUTH",authParamValue:oStData.URL_AFTER_AUTH},
                    {authParamName:"IDLE_CUT_TIME",authParamValue:oStData.IDLE_CUT_TIME},
                    {authParamName:"IDLE_CUT_FLOW",authParamValue:oStData.IDLE_CUT_FLOW},
                    {authParamName:"NO_SENSATION_TIME",authParamValue:oStData.unauthtime}
                ]
            };
            if(oStData.unauthtime && oStData.unauthtime.charAt(0) == '0' && oStData.unauthtime.length == 2)
            {
                oStData.unauthtime = oStData.unauthtime.charAt(1);
            }
            if(oStData.feelauth==0){
                oStData.NO_SENSATION_TIME="0";
            }
            if ( oStData.authCfgTemplateName != "")
            {
                authData.authCfgTemplateName = oStData.authCfgTemplateName;
            };
            if(oStData.authType=="1"){                     //一键上网开启时
                authData.isEnableSms =0;
                authData.isEnableAccount=0;
                authData.isEnableWeixin=0;
                authData.isWeixinConnectWifi=0;
            }
            if(oStData.authType == "2")                     //一键上网关闭时    对应的是html中的name
            {
                authData.isEnableSms = oStData.isEnableSms;
                authData.isEnableAccount = oStData.isEnableAccount;
                authData.isEnableWeixin = oStData.isEnableWeixin;
                authData.isWeixinConnectWifi = oStData.isWeixinConnectWifi;
            }
            var url=v2path;
            if(sName == "add"){
                url +="/authcfg/add";                 //接口负责人：heqiao or dukaige
            }else{
                url +="/authcfg/modify";                //接口负责人：heqiao or dukaige
            }
            var requestData = authData;

            requestData.storeId = FrameInfo.Nasid;

            if(requestData.authType=="2" && requestData.isEnableAccount=="0" && requestData.isEnableSms=="0" && requestData.isEnableWeixin=="0" && requestData.isWeixinConnectWifi=="0")
            {
                Frame.Msg.info("用户必须进行一种认证","error");
            }else{
                var authcfgOpt = {
                    type: "POST",
                    url: url,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(requestData),
                    onSuccess: authcfgSuc,
                    onFailed: authcfgFail
                }

                function authcfgSuc(data){
                    console.log("sec1");
                    if(data.errorcode == 1105)
                    {
                        Frame.Msg.info("该认证模板已存在","error");
                        return;
                    }
                    if(data.errorcode == 1106)
                    {
                        Frame.Msg.info("该认证模板不存在","error");
                        return;
                    }
                    if(data.errorcode == 1107)
                    {
                        Frame.Msg.info("无感知时长启用后取值范围为1-30","error");
                        return;
                    }
                    if(data.errorcode == 1101)
                    {
                        Frame.Msg.info("允许上网时长必须为正整数且在1-1440之间","error");
                        return;
                    }
                    if(data.errorcode == 1102)
                    {
                        Frame.Msg.info("url格式为http://或https://","error");
                        return;
                    }
                    if(data.errorcode == 1103)
                    {
                        Frame.Msg.info("闲置切断时长（分）不得超过上网时长（分）且为正整数","error");
                        return;
                    }
                    if(data.errorcode == 1104)
                    {
                        Frame.Msg.info("闲置切断流量为正整数且在1-1024000之间","error");
                        return;
                    }
                    if(data.errorcode==1001){
                        Frame.Msg.info("允许上网时长不能为空，必须是正整数","error");
                        return;
                    }
                    if(data.errorcode==0){
                        onSuccess();
                        Frame.Msg.info("配置成功");
                    }
                    else{
                        Frame.Msg.info(data.errorcode,"error");
                    }
                }

                function authcfgFail(){
                    console.log("fail1");
                }

                Utils.Request.sendRequest(authcfgOpt);
            }
        }
        var jFormSSID = $("#toggle_form");
        if(sName == "add") //Add
        {
            var jDlg = $("#AddAuthTempDlg");
            if(jDlg.children().length)
            {
                $("#authToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#authToggle").show().appendTo(jDlg);
            }

            jFormSSID.form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": onSubmitSSID}); //注册列表，确定按钮回调
            $("#authname",jFormSSID).removeAttr("disabled");
            $("#anthTime").addClass("hide");
            $("#other_auth").addClass("hide");
            jFormSSID.form("updateForm",{
                authCfgTemplateName : "",
                authType : "1",
                isEnableSms:"0",
                isEnableWeixin:"0",
                isWeixinConnectWifi:"0",
                isEnableAccount:"1",
                location:"0",
                feelauth:"0",
                unauthtime:"7",
                ONLINE_MAX_TIME:"360",
                URL_AFTER_AUTH:"https://www.h3c.com",
                IDLE_CUT_TIME:"30",
                IDLE_CUT_FLOW:"10240"
            });
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        }
        else //Edit
        {
            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitSSID, "btn_cancel":onCancel});
           $("#authname",jFormSSID).attr("disabled","disabled");
            if(oRowdata.authType == 1||oRowdata.authType==getRcText ("AUTH_Status").split(",")[1]){
                oRowdata.authType = 1;
                $("#other_auth").addClass("hide");
            }else{
                oRowdata.authType = 2;
                $("#other_auth").removeClass("hide");
            }
            if(oRowdata.isEnableAccount==0||oRowdata.isEnableAccount==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableAccount = 0;
            }else{
                oRowdata.isEnableAccount = 1;
            }
            if(oRowdata.isEnableSms==0||oRowdata.isEnableSms==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableSms = 0;
            }else{
                oRowdata.isEnableSms = 1
            }
            if(oRowdata.isEnableWeixin==0||oRowdata.isEnableWeixin==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableWeixin = 0;
            }else{
                oRowdata.isEnableWeixin = 1;
            }
            if(oRowdata.isWeixinConnectWifi==0||oRowdata.isWeixinConnectWifi==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isWeixinConnectWifi = 0;
            }else{
                oRowdata.isWeixinConnectWifi = 1;
            }

            if(oRowdata.NO_SENSATION_TIME=="0"){
                oRowdata.feelauth = "0";
                $("#anthTime").addClass("hide");
            }else{
                oRowdata.feelauth = "1";
                oRowdata.unauthtime = oRowdata.NO_SENSATION_TIME;
                $("#anthTime").removeClass("hide");
            }

            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
        }
    }

    function onDelSSID(oData)
    {
        var authcfgDelOpt = {
            type: "post",
            url: v2path+"/authcfg/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({storeId:FrameInfo.Nasid,"authCfgTemplateName":oData.authCfgTemplateName}),
            onSuccess: authcfgDelSuc,
            onFailed: authcfgDelFail
        }

        function authcfgDelSuc(data){
            if(data.errorcode == "1109")
            {
                Frame.Msg.info("该认证模板已经被绑定，不能删除","error");
            }else if(data.errorcode == "0") {
                Frame.Msg.info("删除成功");
            }else{
                Frame.Msg.info(data.errormsg||"删除失败","error");
            }
            Utils.Base.refreshCurPage();
            // authListData();
        }

        function authcfgDelFail(){
            console.log("fail4");
        }

        Utils.Request.sendRequest(authcfgDelOpt);
    }

    function initData(jScope)
    {
      //  alert(FrameInfo.g_user.user)
        authListData();
        fn_add_sub();
    }
    function authListData(){

        var authdata  = [];
        var authcfgQueryOpt = {
            type: "GET",
            url: v2path+"/authcfg/query",
            contentType:"application/json",
            dataType:"json",
            data:{"storeId":FrameInfo.Nasid},
            onSuccess: authcfgQuerySuc,
            onFailed: authcfgQueryFail
        }

        function authcfgQuerySuc(data){
            if(data.errorcode == 0){
                $.each(data.data,function(key,value){
                    if ((value.v3flag == 1) || (!(value.v3flag == false))) {  /* 判断标记位，(!(value.v3flag == false)) 是为了兼容之前没有标记位的数据 */
                        var authTemplate = {};
                        var online_max_time_Index = value.uamAuthParamList[0].authParamValue; //让在线时长和闲置切断时长的单位一置
                            online_max_time_Index = online_max_time_Index/60;
                        authTemplate.authCfgTemplateName = value.authCfgTemplateName;
                        if (value.authType == 1) {
                            authTemplate.authType = getRcText("AUTH_Status").split(",")[1];
                        } else {
                            authTemplate.authType = getRcText("AUTH_Status").split(",")[0];
                        }
                        authTemplate.location = value.location || 0;
                        authTemplate.isEnableSms = getRcText("AUTH_Status").split(",")[value.isEnableSms];
                        authTemplate.isEnableWeixin = getRcText("AUTH_Status").split(",")[value.isEnableWeixin];
                        authTemplate.isWeixinConnectWifi = getRcText("AUTH_Status").split(",")[value.isWeixinConnectWifi];
                        authTemplate.isEnableAccount = getRcText("AUTH_Status").split(",")[value.isEnableAccount];
                        authTemplate.ONLINE_MAX_TIME = online_max_time_Index;
                        authTemplate.URL_AFTER_AUTH = value.uamAuthParamList[1].authParamValue;
                        authTemplate.IDLE_CUT_TIME = value.uamAuthParamList[2].authParamValue;
                        authTemplate.IDLE_CUT_FLOW = value.uamAuthParamList[3].authParamValue;
                        authTemplate.NO_SENSATION_TIME = value.uamAuthParamList[4].authParamValue;

                        authdata.push(authTemplate);
                   }
                })
                $("#authList").SList ("refresh", authdata);
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

    function initGrid()
    {
        var optauth = {
            colNames: getRcText ("SSID_HEADER"),
            multiSelect: false,
            colModel: [
                {name:'authCfgTemplateName', datatype:"String"},
                {name:'authType', datatype:"String"},
                {name:'isEnableSms', datatype:"String"},
                {name:'isEnableWeixin', datatype:"String"},
                {name:'isWeixinConnectWifi', datatype:"String"},
                {name:'isEnableAccount', datatype:"String"}
            ],
            onToggle : {
                action : showAUth,
                jScope : $("#authToggle"),
                BtnDel : {
                    show : true,
                    action : onDelSSID
                }
            },
            buttons:[
                {name: "add", action: showAUth}
            ]
        };

        if(!g_fqfj_operateBtn){
            delete optauth.onToggle;
        }

        $("#authList").SList ("head", optauth);

    }

    function initForm(){
        $("#simpledraw").on("click",function(){
            Frame.Util.openpage(
                {
                    pageURL:"http://lvzhou.h3c.com"+this.value,
                    height:"500px",
                    hotkeys:"no"
                })
            return false;
        });
        $("#feelauth1").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").removeClass("hide");
        })
        $("#feelauth2").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").addClass("hide");
        })
        $("#authType2").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").removeClass("hide");
        })
        $("#authType1").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").addClass("hide");
        })

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

