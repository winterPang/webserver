        (function ($){
            var MODULE_BASE = "h_wireless";
            var MODULE_NAME = MODULE_BASE + ".index_add";
            var MODULE_RC = "h_wireless_indexAdd";
            function getRcText(sRcName){
                return Utils.Base.getRcString(MODULE_RC, sRcName);
            }


            $("#go_next").click(function(){
                      var oUrlPara={
                np:MODULE_BASE + ".index_gonext", 
                 apNames:$("#apName").val(),
                 apModel:$("#apModel").val()
            };      
                Utils.Base.redirect(oUrlPara);
        })




                function onDelSSID(oData)
        {
            getSSIDInfo().done(function(data, textStatus, jqXHR){
            if(!data)
                {
                    return;
                }
            var stNameList = {}
            var ssidName = oData.SSID;
            var ssidList = data.ssid_list;
            $.each(ssidList,function(key,value){
                stNameList[value.ssid_name] = value.sp_name;
            });
            var stName = stNameList[ssidName];
            SSIDUnbindByAPGroup(stName).done(function(data, textStatus, jqXHR){
                if(data.communicateResult == "success" && data.serviceResult == "success")
                {
                    SSIDDelete(stName).done(function(data, textStatus, jqXHR){
                       if (("errorcode" in data) && (data.errorcode != 0)){
                            Frame.Msg.info(getRcText("DEL_FAIL"),"error");
                            return;
                        } 
                        else
                        {
                            queryPubMng().done(function(data, textStatus, jqXHR){
                                if(("errorcode" in data) && (data.errorcode != 0)){
                                    return;
                                }else if(data.data.length >0 && data.errorcode ==0)
                                    {
                                        var pubmng_list = data.data;
                                        for(var i=0;i<pubmng_list.length;i++)
                                        {
                                            if(pubmng_list[i].name && pubmng_list[i].ssidName == ssidName && pubmng_list[i].isPublished=="1")
                                            {
                                                PublishPubMng(pubmng_list[i].name, false)
                                                    .done(function(data, textStatus, jqXHR){
                                                        if (data.errorcode==0)
                                                        {
                                                            delPubMng(pubmng_list[i].name).done(function(data, textStatus, jqXHR){
                                                                if (("errorcode" in data) && (data.errorcode != 0)){
                                                                    Frame.Msg.info(getRcText("DEL_FAIL"),"error");//失败哦
                                                                    onSuccess();
                                                                }
                                                                Frame.Msg.info(getRcText("DEL_SUCCESS"));
                                                                synSSID();//发布成功
                                                                // onSuccess();
                                                            })
                                                        }
                                                        // Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                                                        // onSuccess();
                                                    });
                                            }else if(pubmng_list[i].ssidName == ssidName || pubmng_list[i].isPublished=="0" ){
                                                Frame.Msg.info(getRcText("DEL_SUCCESS"));
                                                synSSID();
                                            }
                                        }
                                    }
                                else{
                                    Frame.Msg.info(getRcText("DEL_SUCCESS"));
                                    synSSID();
                                }
                            })
                        }
                    })
                }
                else{
                    Frame.Msg.info(getRcText("LINK_delete"),"error");
                    Utils.Base.refreshCurPage();
                    return; 
                }
            })
            
        })
        }

            function showSSID(oRowdata, sName){
            function onCancel()
            {
                console.log("finish")
                jFormSSID.form("updateForm",oRowdata);
                $("input[type=text]",jFormSSID).each(function(){
                    Utils.Widget.setError($(this),"");
                });
                return true;
            }


            function onSuccess(){
                    if(sName == "edit")
                    {
                        Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                    }
                    Utils.Base.refreshCurPage();
            }

            function onSubmitSSID(){

                function operatePubMng(loginPage, authCfg){//3.选登录模板 更改发布模板 
                if (!oRowdata.pubMngName||!("pubMngName" in oRowdata)){//发布模板不存在 创建发布模板
                    getDeviceInfo().done(function(data, textStatus, jqXHR){
                        if (data.dev_list.length <= 0){
                            return ;//无法获取场所列表
                        }
                        var shopName = data.dev_list[0].shop_name;
                        addPubMng(name, shopName, ssidName, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR){
                            if (("errorcode" in data) && (data.errorcode != 0)){
                                return;
                            }
                            oRowdata.pubMngName = name;
                            oRowdata.WeChartList = WeChart;
                            oRowdata.AuthCfgList = authCfg;
                            oRowdata.LoginPageList = loginPage;
                            PublishPubMng(name, true)
                                .done(function(data, textStatus, jqXHR){
                                    if (("errorcode" in data) && (data.errorcode != 0)){
                                        return;//发布失败
                                    }
                                    Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                                    onSuccess();
                                });
                            
                        });
                    });
                }
                else {//修改发布模板
                    var pubMng = oRowdata.pubMngName;
                    modPubMng(pubMng, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR){
                        if (("errorcode" in data) && (data.errorcode != 0)){
                            return; 
                        }
                        PublishPubMng(pubMng, true).done(function(data, textStatus, jqXHR){
                            if (("errorcode" in data) && (data.errorcode != 0)){
                                 return;
                            }
                            Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                            onSuccess();
                        });
                    });
                }
            }
                var date = new Date(); 
                var authType = $("input[name=AuthenType]:checked").attr("id");
                var loginType = $("input[name=LoginPage]:checked").attr("id");
                var WeChart = $("#WeChartList").val();
                var ssidName = oRowdata.SSID || $("#SSID",jFormSSID).val();
                var authCfg = $("#AuthCfgList").val();
                var loginPage = $("#LoginPageList").val();
                var time=Frame.DataFormat.getStringTime(new Date());
                // console.log("time:::"+time);
                var name = "";
                if(ssidName.length>15){
                    name = ssidName.replace(/\s+/g,"").slice(0,15);
                }else{
                    name = ssidName;
                }
                 name =name+time;

                if (authType == "AT1"){//1.不认证 删除发布模板 取消发布
                    if (!("pubMngName" in oRowdata)){//发布模板不存在
                        Frame.Msg.info(getRcText("DEL_PUB_SUCC"));
                        onSuccess();
                        return ;
                    }
                    delPubMng(oRowdata.pubMngName).done(function(data, textStatus, jqXHR){
                        if (("errorcode" in data) && (data.errorcode != 0)){
                            Frame.Msg.info(getRcText("DEL_AUTH_FAIL"),"error");//失败哦
                            onSuccess();
                        }
                        Frame.Msg.info(getRcText("DEL_PUB_SUCC"));//发布成功
                        onSuccess();
                    })
                }
                else if ((authType == "AT2") || (authType == "AT3")){//2.gm 创建新的登录模板
                    var authType = (authType == "AT2" ? 1 : 2);//at2 一键上网 at3 账号登陆
                    var enableMsg = ($("#Message").is(":checked") ? 1 : 0);
                    var enableWeChart = ($("#WeChart").is(":checked") ? 1 : 0);
                    var enableAccount = ($("#FixAccount").is(":checked") ? 1 : 0);
                    var enableWechatWifI = ($("#isWeChatWifi").is(":checked") ? 1 : 0);
                    var nauthParamValue = $("#auto_study_enable").MCheckbox("getState") ? $("#impose_auth_time",jFormSSID).val() : "0";

                    addAuthPub(name, authType, enableMsg, enableWeChart, enableAccount,enableWechatWifI, nauthParamValue).done(function(data, textStatus, jqXHR){
                        if (("errorcode" in data) && (data.errorcode != 0)){
                            return ;
                        }
                        authCfg = name;
                        if (loginType == "LP4"){
                            operatePubMng(loginPage, authCfg);
                        }
                        else {
                            //创建新的页面模板
                            addLoginPage(name).done(function(data, textStatus, jqXHR){
                                if (("errorcode" in data) && (data.errorcode != 0)){
                                    return ;
                                }
                                loginPage = name;
                                operatePubMng(loginPage, authCfg);
                            })
                        } 
                    }); 
                }
                else if (authType == "AT4"){
                    if (loginType == "LP4"){
                        operatePubMng(loginPage, authCfg);
                    }
                    else {
                        //创建新的页面模板
                        addLoginPage(name).done(function(data, textStatus, jqXHR){
                            if (("errorcode" in data) && (data.errorcode != 0)){
                                return ;
                            }
                            loginPage = name;
                            operatePubMng(loginPage, authCfg);
                        })
                    } 
                }
                //onSuccess();
            }

            var jFormSSID = $("#toggle_form"), sType, sStName;
            var CurrentPercent = oRowdata || {};
            CurrentPercent = CurrentPercent.Percent || 0;
            CurrentPercent = g_PercentMax + CurrentPercent*1;
            $("#percentMax").html(CurrentPercent);
            $("#Percent").attr("max",CurrentPercent);
            CurrentPercent >= 1 ? $("#Percent_Block").show() : $("#Percent_Block").hide();
            if(sName == "add") //Add
            {
                sType = "create";
                sStName = Frame.Util.generateID("ST");
                var jDlg = $("#AddSsidDlg");
                if(jDlg.children().length)
                {
                    $("#ssidToggle").show().insertAfter($(".modal-header",jDlg));
                }
                else
                {
                    $("#ssidToggle").show().appendTo(jDlg);
                }
                $("#SSID",jFormSSID).attr("readonly",false);
                jFormSSID.form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": onSubmitSSID});
                jFormSSID.form("updateForm",{
                    SSID : "",
                    StType : "1",
                    UserIsolation : "false"
                });
                $("input[type=text]",jFormSSID).each(function(){
                    Utils.Widget.setError($(this),"");
                });
                Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
            }
            else //Edit
            {
                sType = "merge";
                sStName = oRowdata.Name;

                jFormSSID.form ("init", "edit", {"btn_apply": onSubmitSSID, "btn_cancel":onCancel});
                
                jFormSSID.form("updateForm",oRowdata);
                $("input[type=text]",jFormSSID).each(function(){
                    Utils.Widget.setError($(this),"");
                });
                if(oRowdata.auto_study_enable == false)
                {
                    $("#auto_study_enable", jFormSSID).MCheckbox("setState",false);
                    $(".Learn-MAC", jFormSSID).hide();
                }
                else
                {
                    $("#auto_study_enable").MCheckbox("setState",true);
                    $(".Learn-MAC", jFormSSID).show();
                }
            }
        }
            function initForm(){

                $("#view_client_form").form("init", "edit", {"title":getRcText("TERINFO"),"btn_apply": false,"btn_cancel":false});
                $("#return").on('click',function(){ history.back();});
             
            }
            function initData(){
               
                     var aa={   
                                "apName":"",
                                "apSN":"固定账号认证",
                                "apModel":"",
                                "apGroupName":"去使能",
                                "radioList1":"694",
                                "onlineTime1":"75"
                        }
                Utils.Base.updateHtml($("#view_client_form"), aa);
                // $("#apName").val($("#apName").text());
                // $("#apModel").val($("#apModel").text());
                $("#apName").val(aa.apName);
                $("#apModel").val(aa.apModel);
                // $("#apSN").val(aa.apSN);
                // $("#apGroupName").val(aa.apGroupName);
                // $("#radioList1").val(aa.radioList1);
                // $("#onlineTime1").val(aa.onlineTime1);
                     
            }
            function initGrid()
            {
            // var optSsid = {
            //     colNames: getRcText ("SSID_HEADER"),
            //     multiSelect: false,
            //     colModel: [
            //         {name:'apName', datatype:"String"},
            //         {name:'apModel', datatype:"String"}
            //     ]
            //     // onToggle : {
            //     //     action : showSSID,
            //     //     jScope : $("#ssidToggle"),
            //     //     BtnDel : {
            //     //         show : true,
            //     //         action : onDelSSID
            //     //     }
            //     // },
            //     // buttons:[
            //     //     {name: "add", action: onAddSSID},
            //     //     {name: "default",value:getRcText("SYN"),action: synSSID}
            //     // ]

            // };
            // $("#ssidList").SList ("head", optSsid);
            
            $("input[name=StType],input[name=AccPwdStaff]").bind("change",function(){
                var aContent = $(this).attr("content");
                var sCtrlBlock = $(this).attr("ctrlBlock") || "";
                $(sCtrlBlock).hide();
        
                if(!aContent) return true;
        
                aContent = aContent.split(",");
                for(var i=0;i<aContent.length;i++)
                {
                    if(!aContent[i])continue;
                    $(aContent[i]).show();
                }
                $("input[name=AccPwdCorpo]").MRadio("setValue",'2',true);
                $("input[name=AccPwdStaff]").MRadio("setValue",'2');
            });
            
            $(".switch,#impose_auth").bind("minput.changed",function(e,data){
                var sClass = $(this).attr("ctrlBlock");
                this.checked ? $(sClass).show() : $(sClass).hide() ;
            });

            $("input[name=AuthenType], input[name=LoginPage]").bind("change",function(){
                var aContent = $(this).attr("content");
                var sCtrlBlock = $(this).attr("ctrlBlock") || "";
                $(sCtrlBlock).hide();
                if(!aContent) return true;
                aContent = aContent.split(",");
                for(var i=0;i<aContent.length;i++)
                {
                    if(!aContent[i])continue;
                    $(aContent[i]).show();
                }
            });
            
            $("#impose_auth_time").bind("change", function(){
               var value = $(this).val();
               if (value > 30){
                   $(this).val(30);
               }
               else if (value < 1){
                   $(this).val(1)
               }
            });   
        }
            function _init ()
            {
                initGrid();
                initForm();
                initData();
            }
            function _resize (jParent)
            {
            }

            function _destroy()
            {
                console.log("destory**************");
                Utils.Request.clearMoudleAjax(MODULE_NAME);
            }
            Utils.Pages.regModule (MODULE_NAME, {
                "init": _init,
                "destroy": _destroy,
                "resize": _resize,
                "widgets": ["Echart","Minput","SList","Form","SingleSelect"],
                "utils": ["Base", "Request"],
            });

        }) (jQuery);;