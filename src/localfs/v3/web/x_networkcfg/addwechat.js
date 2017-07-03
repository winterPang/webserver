;(function ($) {
        var MODULE_NAME = "x_networkcfg.addwechat";
        var oPara = null;
        var ownerName = null;
        var v2path = MyConfig.v2path;
        var hPending = null;
        //获取url中的参数
        function getUrlParam(name)
        {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.hash.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }

        function getRcText(sRcName) {
            return Utils.Base.getRcString("we_chat_rc", sRcName);
        }

        function getWeChatDetail(ownerName, name, getWeChatDetailSuc, getWeChatDetailFail) {
                var getWeChatDetailOpt = {
                    type: "GET",
                    url: v2path + "/weixinaccount/querybyname?storeId=" + FrameInfo.Nasid + "&name=" + name,
                    contentType: "application/json",
                    dataType: "json",
                    timeout: 150000,
                    // data: JSON.stringify({
                    //     ownerName: ownerName,
                    //     name: name
                    // }),
                    onSuccess: getWeChatDetailSuc,
                    onFailed: getWeChatDetailFail
                };

                Utils.Request.sendRequest(getWeChatDetailOpt);
        }

        //url_add:v2path+"/weixinAccount/add"
        //url_modify:v2path+"/weixinAccount/modify"
        function OperaWeChatAjax(odata, url, OperaWeChatSuc, OperaWeChatFail) {
            if (!odata && !url) {
                return;
            }
            var getWeChatDetailOpt = {
                type: "POST",
                url: url,
                contentType: "application/json",
                dataType: "json",
                timeout: 150000,
                data: JSON.stringify(odata),
                onSuccess: OperaWeChatSuc,
                onFailed: OperaWeChatFail
            };
            Utils.Request.sendRequest(getWeChatDetailOpt);
        }
        function getRcText(sRcName)
            {
                return Utils.Base.getRcString("x_addWeChat_rc", sRcName);
            }
        function check(oStData) {
            Utils.Widget.setError($("#chatname"), "");
            Utils.Widget.setError($("#chat"), "");
            Utils.Widget.setError($("#appId"), "");
            Utils.Widget.setError($("#token"), "");
            Utils.Widget.setError($("#encodingAesKey"), "");
            Utils.Widget.setError($("#appSecret"), "");
            if(oStData.biz.length < 3){
                Utils.Widget.setError($("#chatname"), getRcText("BIZ_CHECKMSG").split("，")[0]);
                //名称长度不能小于3个字符
                return false;
            }
            else if(oStData.biz.length >30){
                Utils.Widget.setError($("#chatname"), getRcText("BIZ_CHECKMSG").split("，")[1]);
                //名称长度不能大于30个字符
                return false;
            }
            else{
                var  checkBizwx = new RegExp(getRcText("WEIXIN"));
                //var  checkBizf = /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im;
                var  checkBizf = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                if (checkBizwx.test(oStData.biz)) {
                    Utils.Widget.setError($("#chatname"),getRcText("BIZ_CHECKMSG").split("，")[2]);
                    // 名称不能包含“微信”等保留字
                    return false;
                }
                if(checkBizf.test(oStData.biz)){
                    Utils.Widget.setError($("#chatname"),getRcText("BIZ_CHECKMSG").split("，")[3]);
                    // 名称不能包含特殊字符
                    return false;
                }
            }
            var checkName = /^[a-zA-Z0-9\_\-]*$/;
            if (oStData.name.length < 6) {
                Utils.Widget.setError($("#chat"), getRcText("NAME_CHECKMSG").split(",")[0]);
            //    名称不能小于6个字符
                return false;
            } else if (checkName.test(oStData.name) == false) {
                Utils.Widget.setError($("#chat"), getRcText("NAME_CHECKMSG").split(",")[1]);
                // 名称必须是字母、数字、下划线或减号的组合
                return false;
            } else {
                var re = /^[a-zA-Z]{1}$/;
                if (!re.test(oStData.name.substring(0, 1))) {
                    Utils.Widget.setError($("#chat"),getRcText("NAME_CHECKMSG").split(",")[2]);
                    // "名称必须以字母开头"
                    return false;
                }
                
            }

            var checkID = /^[a-zA-Z0-9]*$/;
            if (oStData.appId.length > 64) {
                Utils.Widget.setError($("#appId"),getRcText("APPID_CHECKMSG").split(",")[0]);
                // "APPID不能大于64个字符"
                return false;
            }else if(oStData.appId.length <= 0){
                Utils.Widget.setError($("#appId"),getRcText("APPID_CHECKMSG").split(",")[1] );
                // "APPID不能空"
                return false;
            }else if (checkID.test(oStData.appId) == false) {
                Utils.Widget.setError($("#appId"),getRcText("APPID_CHECKMSG").split(",")[2]);
                //  "APPID只能包含字母或数字"
                return false;
            }
            
            var checkToken = /^[a-zA-Z0-9]*$/;
            if (oStData.token.length < 3 || oStData.token.length > 32 || checkToken.test(oStData.token) == false) {
                Utils.Widget.setError($("#token"), getRcText("TOKEN_CHECKMSG").split(",")[0]);
                // "Token必须是3-32个英文或数字"
                return false;
            }

            var checkKey = /^[a-zA-Z0-9]*$/;
            if (oStData.encodingAesKey) {
                if (oStData.encodingAesKey.length < 43 || oStData.encodingAesKey.length > 43 || checkKey.test(oStData.encodingAesKey) == false) {
                    Utils.Widget.setError($("#encodingAesKey"), getRcText("KEY_CHECKMSG").split(",")[0]);
                    // "encodingAesKey必须是英文或数字"
                    return false;
                    }
            } 

            if (oStData.appSecret.indexOf(" ") != -1) {
                Utils.Widget.setError($("#appSecret"), getRcText("APP_CHECKMSG").split(",")[0]);
                // "APP SECRET不能有空格"
                return false;
            }else if(oStData.appSecret.length <= 0){
                Utils.Widget.setError($("#appSecret"), getRcText("APP_CHECKMSG").split(",")[1]);
                // "APP SECRET不能空"
                return false;
            }
            
            return true;
        }

    function editData(ownerName, addEdit, oData) {
        function onSubmitData(addEdit) {
                oData.ownerName = ownerName;
                oData.storeId = FrameInfo.Nasid;
                oData.biz = $("#chatname").val();
                oData.name = $("#chat").val();
                oData.appId = $("#appId").val();
                oData.token = $("#token").val();
                oData.appSecret = $("#appSecret").val();
                oData.encodingAesKey = $("#encodingAesKey").val();
                oData.ifWeixinAuth = 1;
                oData.description = "";

                var publicNumber1 = $("#publicNumber1").MCheckbox("getState");
                var publicNumber2 = $("#publicNumber2").MCheckbox("getState");
                var publicNumber3 = $("#publicNumber3").MCheckbox("getState");
                var encryptionType1 = $("#encryptionType1").MCheckbox("getState");
                var encryptionType2 = $("#encryptionType2").MCheckbox("getState");
                var encryptionType3 = $("#encryptionType3").MCheckbox("getState");
                if (publicNumber1 && (!publicNumber2) && (!publicNumber3)) {
                    oData.type = 1;
                } else if (publicNumber2 && (!publicNumber1) && (!publicNumber3)) {
                    oData.type = 2;
                } else if (publicNumber3 && (!publicNumber2) && (!publicNumber1)) {
                    oData.type = 3;
                }
                if (encryptionType1 && (!encryptionType2) && (!encryptionType3)) {
                    oData.cipherMode = 1;
                } else if (encryptionType2 && (!encryptionType1) && (!encryptionType3)) {
                    oData.cipherMode = 2;
                } else if (encryptionType3 && (!encryptionType2) && (!encryptionType1)) {
                    oData.cipherMode = 3;
                }
                //check(oData);
                var ajaxUrl = null;
                if (addEdit == "edit") {
                    ajaxUrl = v2path + "/weixinaccount/modify";
                } else if (addEdit == "add") {
                    ajaxUrl = v2path + "/weixinaccount/add";
                }
                //check(oData)
                if (!check(oData)) {
                    Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[0],"error");
                    // "提交数据格式错误"
                    return;//无法下发配置
                }
                function OperaWeChatSuc(data, textStatus, jqXHR) {
                    try {
                        if (data.errorcode == 0)
                        {
                            //onSuccess();
                            $(".error").attr("style", "style:'display:none'");
                            $("input.text-error").css("border", " 1px solid #e7e7e9");
                            Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[1]);
                            // "配置成功"
                        }else {
                            if (data.errorcode == 1001)
                            {
                                if (oData.cipherMode !== 3) {
                                    $(".error").attr("style", "style:'display:none'");
                                    $("input.text-error").css("border", " 1px solid #e7e7e9");
                                    Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[1]);
                                    // "配置成功"
                                } else {
                                    return true;
                                }
                            }
                            else if(data.errorcode == 1504){
                                Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[4], "error");
                            }
                            else if(data.errorcode == 1507){
                                Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[5], "error");
                            }
                            else if(data.errorcode == 2002){
                                Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[6], "error");
                            }
                            else if(data.errorcode == 2003){
                                Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[7], "error");
                            }
                            else if(data.errorcode == 40013){
                                Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[8], "error");
                            }
                            else if(data.errorcode == 40125){
                                Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[9], "error");
                            }
                            else if (data.errorcode == 90013) {
                                Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[10], "error");
                            }
                            else {
                                $(".error").attr("style", "style:'display:none'");
                                $("input.text-error").css("border", " 1px solid #e7e7e9");
                                Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[2], "error");
                                // "网络服务异常"
                            }
                        }
                    }catch (error) {
                        Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[3], 'error');
                        // "提交数据异常"
                        console.log("Submit" + " wechat detail infomation error errormessage: " + JSON.stringify(error));
                    }finally{
                        $("#cancelInfo").trigger("click");
                    }
                }

                function OperaWeChatFail(jqXHR, textStatus, error) {
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("SUBMIT_CHECKMSG").split(",")[3], "error");
                    // "提交数据异常"
                    console.log("Submit" + UrlType + " wechat detail infomation error errormessage: " + JSON.stringify(error));
                    
                    $("#cancelInfo").trigger("click");
                }

                OperaWeChatAjax(oData, ajaxUrl, OperaWeChatSuc, OperaWeChatFail);
        }
        $("#applyInfo").click(function () {
            onSubmitData(addEdit);
        });

    }


    function initForm() {
        $("#publicNumber1").MCheckbox("setState", true);
        $("#publicNumber2").MCheckbox("setState", false);
        $("#publicNumber3").MCheckbox("setState", false);
        //名称
        $("#chatname").val("");
        //微信号
        $("#chat").val("");
        //appId
        $("#appId").val("");
        //token
        $("#token").val("");
        //app secret
        $("#appSecret").val("");
        $("#encryptionType1").MCheckbox("setState", true);
        $("#encryptionType2").MCheckbox("setState", false);
        $("#encryptionType3").MCheckbox("setState", false);
        //加密密钥
        $("#encodingAesKey").val("");
        $("#advanceBtn").click(function () {
            $("#WeChat_Toggle").toggle();
            $("#AdvanceClose").toggleClass("advan_set3");
            return false;
        });

        $("#cancelInfo").click(function () {
            initForm();
            Utils.Base.redirect({np: "x_networkcfg.relateid"});
            //return false;
        });

        $("input[name=cipherMode]").change(function(){
            if ($("#encryptionType1").MCheckbox("getState")){
                //$("#encodingAesKey").val("");
                //oData.cipherMode = 1;
            }
        });

        $("input.text-error").change(function(){
            this.parent('div.edit-content').children('.error').attr("style", "style:'display:none'");
            this.css("border", " 1px solid #e7e7e9");
        });
    }

    function initData(ownerName, oData) {
        var jFormChat = $("#adduser_form");
        oPara = Utils.Base.parseUrlPara();
        var addType = oPara.addType ? oPara.addType : "";
        var typeName = oPara.accountName ? oPara.accountName : "";
        if ($.trim(addType) == $.trim("add")) {
            oData = {};
            $("#chat").attr("readonly", false);
             // oData.url="http://lvzhouv3.h3c.com//null";
            //oData.encodingAesKey="aaaaaaaaaabbbbbbbbbbccccccccccddddddddddabc";
            $("#Title").text("");
            $("#Title").text(getRcText("TITLE_TEXT").split(",")[0]);
            // "新增微信公众号"
            editData(ownerName, addType, oData);

        } else if ($.trim(addType) == $.trim("edit")) {
            $("#Title").text("");
            $("#Title").text(getRcText("TITLE_TEXT").split(",")[1]);
            // "编辑微信公众号"
            $(".control-label[name=name]").removeClass('required');
            $(".info-explain[name=name]").remove();
            $("input[type=text]", jFormChat).each(function () {
                Utils.Widget.setError($(this), "");
            });
            function getWeChatSuc(data, textStatus, jqXHR) {
                try {
                    if (0 !== data.errorcode) {
                        if (!data.encodingAesKey) {
                            return true;
                        }
                        Frame.Msg.info(getRcText("GETDATA_ERROR").split(",")[0], "error");
                        // "查询数据异常"
                        console.log("Find wechat detail infomation error errormessage: " + JSON.stringify(data.errormsg));
                    }

                    if (!('data' in data && data.data instanceof Object)) {
                        throw (new Error('data.data not exist'))
                    }
                    var value = data.data ? data.data : "";
                    if (value) {
                        oData.biz = value.biz;
                        oData.name = value.name;
                        oData.appId = value.appId;
                        oData.appSecret = value.appSecret;
                        oData.token = value.token;
                        oData.type = value.type;
                        oData.encodingAesKey = value.encodingAesKey;
                        oData.cipherMode = value.cipherMode;
                        oData.ifWeixinAuth = value.ifWeixinAuth;
                        oData.url = value.url;
                        oData.description = value.description;
                    }
                    //1订阅号  2服务号号  3企业号
                    if (1 == oData.type) {
                        $("#publicNumber1").MCheckbox("setState", true);
                        $("#publicNumber2").MCheckbox("setState", false);
                        $("#publicNumber3").MCheckbox("setState", false);
                    } else if (2 == oData.type) {
                        $("#publicNumber2").MCheckbox("setState", true);
                        $("#publicNumber1").MCheckbox("setState", false);
                        $("#publicNumber3").MCheckbox("setState", false);
                    } else if (3 == oData.type) {
                        $("#publicNumber3").MCheckbox("setState", true);
                        $("#publicNumber1").MCheckbox("setState", false);
                        $("#publicNumber2").MCheckbox("setState", false);
                    }
                    //微信名称
                    $("#chatname").val(oData.biz);
                    //微信号
                    $("#chat").val(oData.name);
                    //appId
                    $("#appId").val(oData.appId);
                    //token
                    $("#token").val(oData.token);
                    //app secret
                    $("#appSecret").val(oData.appSecret);
                    //加密解密类型 1明文 2兼容  3安全
                    if (1 == oData.cipherMode) {
                        $("#encryptionType1").MCheckbox("setState", true);
                        $("#encodingAesKey").val("");
                        $("#encryptionType2").MCheckbox("setState", false);
                        $("#encryptionType3").MCheckbox("setState", false);
                    } else if (2 == oData.cipherMode) {
                        $("#encryptionType2").MCheckbox("setState", true);
                        $("#encryptionType1").MCheckbox("setState", false);
                        $("#encryptionType3").MCheckbox("setState", false);
                    } else if (3 == oData.cipherMode) {
                        $("#encryptionType3").MCheckbox("setState", true);
                        $("#encryptionType1").MCheckbox("setState", false);
                        $("#encryptionType2").MCheckbox("setState", false);
                    }
                    //加密密钥
                    $("#encodingAesKey").val(oData.encodingAesKey);
                    $("#chat").attr("readonly", true);
                } catch (error) {
                    Frame.Msg.info(getRcText("GETDATA_ERROR").split(",")[0], "error");
                    // "查询数据异常"
                    console.log("Find wechat detail infomation error errormessage: " + JSON.stringify(data.errormsg));
                } finally {

                }
            }

            function getWeChatFail(jqXHR, textStatus, error) {
                Frame.Msg.info(getRcText("GETDATA_ERROR").split(",")[0], "error");
                // "查询数据异常"
                console.log("Find wechat detail infomation error errormessage: " + JSON.stringify(error));
            }

            getWeChatDetail(ownerName, typeName, getWeChatSuc, getWeChatFail);
            editData(ownerName, addType, oData);
        }

    }

    function _init(){
        var oData = {};
        ownerName = FrameInfo.g_user.user;
        initForm();
        initData(ownerName, oData);
    }

    function _destroy(){
        hPending&&hPending.close();
        ownerName = null;
        oPara = null;
        $("#Title").text("");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _resize(){

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList", "SingleSelect", "Minput", "Form", "MSelect"],
        "utils": ["Base","Request"]
    });

})(jQuery);