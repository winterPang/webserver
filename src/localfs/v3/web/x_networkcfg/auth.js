/**
 * Created by Administrator on 2016/11/2.
 */
(function($){

    var MODULE_BASE = "x_networkcfg";
    var MODULE_NAME = MODULE_BASE +　".auth";
    var g_sShopName = null;
    var g_ssid = null;
    var hPending = null;
    var g_Userpara1  = {};
    var g_Userpara2 = {};
    var g_registerInfo = [];
    var g_IsRegister = "";
    var g_IsRegisterArr = [];
    var g_onLine = [];//存储在线下发失败的设备
    var g_devsn = [];

    /*判断用户是否腾讯认证注册，渲染相关数据*/
    function initPage(){

         hPending = Frame.Msg.pending(getRcText('ACCOUNT_INFO'));

         getSsid(function(data){
		    data = data.result || [];
		    for(var i = 0 , l = data.length ; i < l ; i++){
                if( data[i].spName == "sp_visitor_03")
                {
                  g_ssid = data[i].ssidName;
                  break;
                }
            }


             getAuthInfo(function(res){

                hPending.close();
                initUserInfo(res);
             });
         });
    }
    /*获取ssid*/
    function getSsid(callback){
        var opt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                "configType": 1,
                "sceneFlag": "true",
                "sceneType": 2,
                "userName": FrameInfo.g_user.user,
                "shopName": g_sShopName,
                "cfgTimeout": 60,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "nasId": FrameInfo.Nasid,
                "method": "GetSsisCfg",
                "param": [{
                    "userName": FrameInfo.g_user.user,
                    "nasId": FrameInfo.Nasid,
                    "sceneName": g_sShopName
                }]
            }),
            onSuccess:function(data){

                callback(data);
            },
            onFailed:function(){
                Frame.Msg.info(getRcText('GETWIFI_ERROR'), "error");
                hPending.close();
            }
        };

        Utils.Request.sendRequest(opt);
    }

    //检查数据库中该用户是否腾讯认证注册过
    function getAuthInfo(cBack){

        var opt = {
            url: MyConfig.path + "/ant/confmgr",
            type:'POST',
            dataType:'json',
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify({
                "configType": 1,
                "sceneFlag": "true",
                "sceneType": 2,
                "userName": FrameInfo.g_user.user,
                "shopName": g_sShopName,
                "cfgTimeout": 60,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "nasId": FrameInfo.Nasid,
                "method": "UserIsRegistered",
                "param": [
                    {
                        "nasId":FrameInfo.Nasid,
                        "devSN":FrameInfo.ACSN,
                        "ssidName":g_ssid
                    }
                ]
            }),
            onSuccess:function(data){

                if(data.result == "fail"||data.result.length == 0) //表示用户没有腾讯认证注册
                {
                    cBack(data.result);
                }
                else
                {
                    if( data.result.length == 2){ // 表示用户腾讯认证注册了(两个radio都腾讯认证注册了)
                        cBack(data.result);
                        g_Userpara1 = {
                            "ssidName": data.result[0].ssidName,
                            "userName": data.result[0].userName,
                            "rid": data.result[0].rid,
                            "ticket": data.result[0].ticket,
                            "enable": data.result[0].enable,
                            "sessionKey": data.result[0].sessionKey,
                            "authrequestUrl": data.result[0].authrequestUrl,
                            "authredirectUrl": data.result[0].authredirectUrl,
                            "preadvrequestUrl": data.result[0].preadvrequestUrl,
                            "preadvredirectUrl": data.result[0].preadvredirectUrl,
                            "radio":data.result[0].radio,
                            'businessName': data.result[0].businessName,
                            'address': data.result[0].address,
                            'postCode': data.result[0].postCode,
                            'manager': data.result[0].manager,
                            'phone': data.result[0].phone,
                            'email': data.result[0].email
                        };
                        g_Userpara2 = {
                            "ssidName": data.result[1].ssidName,
                            "userName": data.result[1].userName,
                            "rid": data.result[1].rid,
                            "ticket": data.result[1].ticket,
                            "enable": data.result[1].enable,
                            "sessionKey": data.result[1].sessionKey,
                            "authrequestUrl": data.result[1].authrequestUrl,
                            "authredirectUrl": data.result[1].authredirectUrl,
                            "preadvrequestUrl": data.result[1].preadvrequestUrl,
                            "preadvredirectUrl": data.result[1].preadvredirectUrl,
                            "radio":data.result[1].radio,
                            'businessName': data.result[1].businessName,
                            'address': data.result[1].address,
                            'postCode': data.result[1].postCode,
                            'manager': data.result[1].manager,
                            'phone': data.result[1].phone,
                            'email': data.result[1].email
                        }
                    }
                    else //表示用户没有腾讯认证注册(只有一个radio认证注册了)
                    {
                        cBack("fail");
                        g_IsRegister = "noRegister";
                        g_IsRegisterArr = data.result;
                    }
                }
            },
            onFailed:function(){

                cBack("fail");
            }
        };

        Utils.Request.sendRequest(opt);
    }

    //将用户腾讯认证注册信息显示到页面上
    function initUserInfo(data){

        if (data == "fail"||data.length == 0){
            $("#auth_TX").addClass('hide');
            $("#authBtn").removeClass('open');
            $("#authDescribe").html(getRcText('NOT_TENCENT_CERTIFIED'));
            return;
        }
        if(data[0].enable == false) //已腾讯认证，未使能
        {
            $("#authBtn").removeClass('open');
            $("#authDescribe").html(getRcText('TENCENT_CERTIFIED_CLOSE'));
        }
        else  //已腾讯认证，使能
        {
            $("#authBtn").addClass('open');
            $("#authDescribe").html(getRcText('TENCENT_CERTIFIED_OPEN'));
        }

        //提供给修改注册信息
        g_registerInfo = data;

        //将返回的数据显示在页面上
        $("#auth_TX").removeClass('hide');
        $("#name").html(data[0].businessName || "");
        $("#address").html(data[0].address || "");
        $("#postcode").html(data[0].postCode || "");
        $("#apName").html(data[0].manager || "");
        $("#apPhone").html(data[0].phone || "");
        $("#apEmail").html(data[0].email || "");
        $("#devSNS").html(data[0].devSN || "");
        $("#ssid").html(data[0].ssidName || "");
        $("#userName").html(data[0].userName || "");
    }


    function initData(){

        //判断用户是否腾讯认证注册，渲染相关数据
        initPage();
    }

    function _init(){

        g_sShopName = Utils.Device.deviceInfo.shop_name;

        /*事件控制*/
        initForm();
        initData();
        optionPush();
    }


    function initForm(){

        /*腾讯认证按钮事件*/
        $("#authBtn").on("click",function(){

            if( $("#authBtn").hasClass('open') == true) // 表示按钮开启。已腾讯认证,使能状态
            {
                //当前认证按钮要进行关闭操作，因为腾讯认证成功后是无法进行去认证操作的，所以只能下发去使能操作。
                Frame.Msg.confirm(getRcText('CLOSE_TENCENT_CERTIFIED'),function(){

                    disableAuth();
                });
            }
            else // 表示按钮关闭。判断是未使能关闭还是未腾讯认证注册
            {
               if( g_Userpara1.enable == false) //已腾讯认证注册，但是未使能
               {
                   Frame.Msg.confirm(getRcText('OPEN_TENCENT_CERTIFIED'),function(){

                        enableAuth();
                   });
               }
               else //未腾讯认证注册
               {
                   promptAuthDlg();
               }
            }
        });

        //输入框绑定的事件
        /*商户名称*/
        $("#business_name").blur(function(){
            var value = $("input[name='business_name']").val();
            if( value == "")
            {
                $("input[name='business_name']").attr('style','border:1px solid red');
                $("#business_name_errorMsg").show();
            }
        });

        $("#business_name").on("input",function(){
            var value = $("input[name='business_name']").val();
            if( value == "")
            {
                $("input[name='business_name']").attr('style','border:1px solid red');
                $("#business_name_errorMsg").show();
                $("#authSubmitBtn").addClass('gray');
            }
            else
            {
                $("#business_name").attr('style','border:1px solid #e7e7e9');
                $("#business_name_errorMsg").hide();

                //检查是否符合消息下发的条件
                checkSendAuthMsg();
            }
        });

        /*商户地址*/
        $("#business_address").blur(function(){
            var value = $("input[name='business_address']").val();
            if(value == "")
            {
                $("input[name='business_address']").attr('style','border:1px solid red');
                $("#business_address_errorMsg").show();
            }
        });

        $("#business_address").on("input",function(){
            var value = $("input[name='business_address']").val();
            if(value == "")
            {
                $("input[name='business_address']").attr('style','border:1px solid red');
                $("#business_address_errorMsg").show();
                $("#authSubmitBtn").addClass('gray');
            }
            else
            {
                $("#business_address").attr('style','border:1px solid #e7e7e9');
                $("#business_address_errorMsg").hide();

                //检查是否符合消息下发的条件
                checkSendAuthMsg();
            }
        });

        /*商户邮编*/
        $("#business_postcode").blur(function(){
            var value = $("input[name='business_postcode']").val();
            if(value == "")
            {
                $("input[name='business_postcode']").attr('style','border:1px solid red');
                $("#business_postcode_errorMsg").show();
                $("#business_postcode_errorMsg").html(getRcText('POSTCODE'));
            }
        });

        $("#business_postcode").on("input",function(){
            var value = $("input[name='business_postcode']").val();
            var reg_postcode = /^[0-9]{6}$/;
            if( value == "")
            {
                $("input[name='business_postcode']").attr('style','border:1px solid red');
                $("#business_postcode_errorMsg").show();
                $("#business_postcode_errorMsg").html(getRcText('POSTCODE'));
                $("#authSubmitBtn").addClass('gray');
            }
            else if( !reg_postcode.test(value))
            {
                $("#business_postcode").attr('style','border:1px solid red');
                $("#business_postcode_errorMsg").show();
                $("#business_postcode_errorMsg").html(getRcText('POSTCODE_FORMAT'));
                $("#authSubmitBtn").addClass('gray');
            }
            else
            {
                $("#business_postcode").attr('style','border:1px solid #e7e7e9');
                $("#business_postcode_errorMsg").html("");
                $("#business_postcode_errorMsg").hide();

                //检查是否符合消息下发的条件
                checkSendAuthMsg();
            }
        });

        /*AP管理员名称*/
        $("#ap_manager").blur(function(){
            var value = $("input[name='ap_manager']").val();
            if( value == "")
            {
                $("input[name='ap_manager']").attr('style','border:1px solid red');
                $("#ap_manager_errorMsg").show();
            }
        });

        $("#ap_manager").on("input",function(){
            var value = $("input[name='ap_manager']").val();
            if( value == "")
            {
                $("input[name='ap_manager']").attr('style','border:1px solid red');
                $("#ap_manager_errorMsg").show();
                $("#authSubmitBtn").addClass('gray');
            }
            else
            {
                $("#ap_manager").attr("style","border:1px solid #e7e7e9");
                $("#ap_manager_errorMsg").hide();

                //检查是否符合消息下发的条件
                checkSendAuthMsg();
            }
        });

        /*AP管理员电话*/
       $("#ap_phone").blur(function(){
           var value = $("input[name='ap_phone']").val();
           if( value == "")
           {
               $("input[name='ap_phone']").attr('style','border:1px solid red');
               $("#ap_phone_errorMsg").show();
               $("#ap_phone_errorMsg").html(getRcText('PHONE'));
           }
       });

        $("#ap_phone").on("input",function(){
            var value = $("input[name='ap_phone']").val();
            var reg_phone = /(0\d{2,3}-)?\d{7,8}(-\d{1,5})?/;
            var reg_tel = /^1[0-9]{10}$/;
            if( value == "")
            {
                $("input[name='ap_phone']").attr('style','border:1px solid red');
                $("#ap_phone_errorMsg").show();
                $("#ap_phone_errorMsg").html(getRcText('PHONE'));
                $("#authSubmitBtn").addClass('gray');
            }
            else if((!reg_phone.test(value)) && (!reg_tel.test(value)))
            {
                $("input[name='ap_phone']").attr('style','border:1px solid red');
                $("#ap_phone_errorMsg").show();
                $("#ap_phone_errorMsg").html(getRcText('PHONE_FORMAT'));
                $("#authSubmitBtn").addClass('gray');
            }
            else
            {
                $("#ap_phone").attr("style","border:1px solid #e7e7e9");
                $("#ap_phone_errorMsg").html("");
                $("#ap_phone_errorMsg").hide();

                //检查是否符合消息下发的条件
                checkSendAuthMsg();
            }
        });

        /*AP管理员邮箱*/
        $("#ap_email").blur(function(){
            var value = $("input[name='ap_email']").val();
            if( value == "")
            {
                $("input[name='ap_email']").attr('style','border:1px solid red');
                $("#ap_email_errorMsg").show();
                $("#ap_email_errorMsg").html(getRcText('EMAIL'));
            }
        });

        $("#ap_email").on("input",function(){
            var value = $("input[name='ap_email']").val();
            var reg = /^\w+@[0-9a-zA-Z]+\.com$/;
            if( value == "")
            {
                $("input[name='ap_email']").attr('style','border:1px solid red');
                $("#ap_email_errorMsg").show();
                $("#ap_email_errorMsg").html(getRcText('EMAIL'));
                $("#authSubmitBtn").addClass('gray');
            }
            else if( !reg.test(value) )
            {
                $("input[name='ap_email']").attr('style','border:1px solid red');
                $("#ap_email_errorMsg").show();
                $("#ap_email_errorMsg").html(getRcText('EMAIL_FORMAT'));
                $("#authSubmitBtn").addClass('gray');
            }
            else
            {
                $("#ap_email").attr("style","border:1px solid #e7e7e9");
                $("#ap_email_errorMsg").html("");
                $("#ap_email_errorMsg").hide();

                //检查是否符合消息下发的条件
                checkSendAuthMsg();
            }
        });

        //关闭按钮
        document.getElementById('authCancleBtn').onclick = function(){
            $("#business_name").val("");
            $("#business_address").val("");
            $("#business_postcode").val("");
            $("#ap_manager").val("");
            $("#ap_phone").val("");
            $("#ap_email").val("");

            $("#business_name_errorMsg").hide();
            $("#business_address_errorMsg").hide();
            $("#business_postcode_errorMsg").hide();
            $("#ap_manager_errorMsg").hide();
            $("#ap_phone_errorMsg").hide();
            $("#ap_email_errorMsg").hide();
            $("#business_postcode_errorMsg").html("");
            $("#ap_phone_errorMsg").html("");
            $("#ap_email_errorMsg").html("");

            $("input[name='business_name']").attr("style","border:1px solid #e7e7e9");
            $("input[name='business_address']").attr("style","border:1px solid #e7e7e9");
            $("input[name='business_postcode']").attr("style","border:1px solid #e7e7e9");
            $("input[name='ap_manager']").attr("style","border:1px solid #e7e7e9");
            $("input[name='ap_phone']").attr("style","border:1px solid #e7e7e9");
            $("input[name='ap_email']").attr("style","border:1px solid #e7e7e9");

            $("#authSubmitBtn").addClass('gray');
        };

        //修改认证注册信息
        $("#changeRegisterInfo").on("click",function(){

            if( g_registerInfo.length != 2)
            {
                Frame.Msg.info(getRcText('NOT_TENCENT_REGISTER'),"error");
                return;
            }
            else
            {
                if( (g_registerInfo[0].enable == false) && (g_registerInfo[1].enable == false) )
                {
                    Frame.Msg.info(getRcText('OPEN_TENCENT'),"error");
                    return;
                }

                $("#authDlg").modal('show');
                $("#business_name").val(g_registerInfo[0].businessName);
                $("#business_address").val(g_registerInfo[0].address);
                $("#business_postcode").val(g_registerInfo[0].postCode);
                $("#ap_manager").val(g_registerInfo[0].manager);
                $("#ap_phone").val(g_registerInfo[0].phone);
                $("#ap_email").val(g_registerInfo[0].email);

                $("#authSubmitBtn").addClass('gray');
            }

            //修改注册信息后，提交注册信息
            $("#authSubmitBtn").unbind("click").on("click",function()
            {
                //下发腾讯认证注册信息
                var hPending = Frame.Msg.pending(getRcText('TENCENT_REGISTER'));

                getAdvertUrl(function(sUrl){

                    sendAuthMsg(sUrl,hPending);
                });
            })
        });
    }

    //去使能腾讯认证
    function disableAuth(){

        var tenxun_para1 = {"rid": g_Userpara1.rid,"ticket": g_Userpara1.ticket, "sessionKey": g_Userpara1.sessionKey,"radio":g_Userpara1.radio,'businessName': g_Userpara1.businessName,
            'address': g_Userpara1.address,'postCode': g_Userpara1.postCode,'manager': g_Userpara1.manager,'phone': g_Userpara1.phone,'email': g_Userpara1.email};
        var url_para1 = {"authrequestUrl": g_Userpara1.authrequestUrl,
            "authredirectUrl": g_Userpara1.authredirectUrl,
            "preadvrequestUrl": g_Userpara1.preadvrequestUrl,
            "preadvredirectUrl": g_Userpara1.preadvredirectUrl};

        var tenxun_para2 = {"rid": g_Userpara2.rid,"ticket": g_Userpara2.ticket, "sessionKey": g_Userpara2.sessionKey,"radio":g_Userpara2.radio,'businessName': g_Userpara2.businessName,
            'address': g_Userpara2.address,'postCode': g_Userpara2.postCode,'manager': g_Userpara2.manager,'phone': g_Userpara2.phone,'email': g_Userpara2.email};
        var url_para2 = {"authrequestUrl": g_Userpara2.authrequestUrl,
            "authredirectUrl": g_Userpara2.authredirectUrl,
            "preadvrequestUrl": g_Userpara2.preadvrequestUrl,
            "preadvredirectUrl": g_Userpara2.preadvredirectUrl};

        hPending = Frame.Msg.pending(getRcText('CLOSEING_TENCENT'));
        saveCfg(0, tenxun_para1, url_para1, tenxun_para2, url_para2, function(res){

            hPending.close();
            if(res == 0)
            {
                Frame.Msg.info(getRcText('CLOSE_SUCCESS'));
                g_Userpara1.enable = false;
                g_Userpara2.enable = false;
                $("#authBtn").removeClass('open');
                $("#authDescribe").html(getRcText('TENCENT_CERTIFIED_CLOSE'));
            }
            else
            {
                Frame.Msg.info(getRcText('CLOSE_ERROR'), "error");
            }
        });
    }
    //下发请求到设备上保存相关数据
    function saveCfg(status, tenxunData1, url1, tenxunData2, url2, cBack){

        var opt = {
            url: MyConfig.path + "/ant/confmgr",
            type:'POST',
            dataType:'json',
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify({
                "configType": 0,
                "sceneFlag": "false",
                "policy":"cloudFirst",
                "userName": FrameInfo.g_user.user,
                "shopName": g_sShopName,
                "devSN":FrameInfo.ACSN,
                "cfgTimeout": 60,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "nasId": FrameInfo.Nasid,
                "method": "TencentWiFi",
                "param": [
                    {
                        "nasId":FrameInfo.Nasid,
                        "devSN":FrameInfo.ACSN,
                        "ssidName":g_ssid,
                        "enable": status,
                        "rid":tenxunData1.rid,
                        "sessionKey":tenxunData1.sessionKey,
                        "ticket":tenxunData1.ticket,
                        "radio":tenxunData1.radio,
                        'businessName': tenxunData1.businessName,
                        'address': tenxunData1.address,
                        'postCode': tenxunData1.postCode,
                        'manager': tenxunData1.manager,
                        'phone': tenxunData1.phone,
                        'email': tenxunData1.email,
                        "preadvrequestUrl": url1.preadvrequestUrl,
                        "preadvredirectUrl": url1.preadvredirectUrl,
                        "authrequestUrl": url1.authrequestUrl,
                        "authredirectUrl": url1.authredirectUrl,
                        'method':'reg',
                        'spName':"sp_visitor_03",
                        'token': 'fou680nge4d5zaw9pjtbicmxvhyk21l7rs3q',
                        'devModel':FrameInfo.Model,
                        'userName':FrameInfo.g_user.user,
                        'platform':getRcText('PLATFORM')
                    },
                    {
                        "nasId":FrameInfo.Nasid,
                        "devSN":FrameInfo.ACSN,
                        "ssidName":g_ssid,
                        "enable": status,
                        "rid":tenxunData2.rid,
                        "sessionKey":tenxunData2.sessionKey,
                        "ticket":tenxunData2.ticket,
                        "radio":tenxunData2.radio,
                        'businessName': tenxunData2.businessName,
                        'address': tenxunData2.address,
                        'postCode': tenxunData2.postCode,
                        'manager': tenxunData2.manager,
                        'phone': tenxunData2.phone,
                        'email': tenxunData2.email,
                        "preadvrequestUrl": url2.preadvrequestUrl,
                        "preadvredirectUrl": url2.preadvredirectUrl,
                        "authrequestUrl": url2.authrequestUrl,
                        "authredirectUrl": url2.authredirectUrl,
                        'method':'reg',
                        'spName':"sp_visitor_03",
                        'token': 'fou680nge4d5zaw9pjtbicmxvhyk21l7rs3q',
                        'devModel':FrameInfo.Model,
                        'userName':FrameInfo.g_user.user,
                        'platform':getRcText('PLATFORM')
                    }
                ]
            }),
            onSuccess:function(data){

                // if(data.serviceResult == "success") //下配置成功
                // {
                //     cBack(0);
                // }
                // else //下配置失败
                // {
                //     cBack(1);
                // }

                g_onLine=[];
        if(data.serviceResult =="success") {
            var aErrList = [];
            if (data.reason == "Failed to set cfg to device.") {
                hPending.close();
                Frame.Msg.info(getRcText("TIPS"),"error"); 
                return;
            }
            else{
                cBack(0);
            }
            
        }
        else{
            cBack(1);
        }
            },
            onFailed:function(){

                cBack(1);
            }
        };

        Utils.Request.sendRequest(opt);
    }

    //使能腾讯认证
    function enableAuth(){

        var tenxun_para1 = {"rid": g_Userpara1.rid,"ticket": g_Userpara1.ticket, "sessionKey": g_Userpara1.sessionKey,"radio":g_Userpara1.radio,'businessName': g_Userpara1.businessName,
            'address': g_Userpara1.address,'postCode': g_Userpara1.postCode,'manager': g_Userpara1.manager,'phone': g_Userpara1.phone,'email': g_Userpara1.email};
        var url_para1 = {"authrequestUrl": g_Userpara1.authrequestUrl,
            "authredirectUrl": g_Userpara1.authredirectUrl,
            "preadvrequestUrl": g_Userpara1.preadvrequestUrl,
            "preadvredirectUrl": g_Userpara1.preadvredirectUrl};

        var tenxun_para2 = {"rid": g_Userpara2.rid,"ticket": g_Userpara2.ticket, "sessionKey": g_Userpara2.sessionKey,"radio":g_Userpara2.radio,'businessName': g_Userpara2.businessName,
            'address': g_Userpara2.address,'postCode': g_Userpara2.postCode,'manager': g_Userpara2.manager,'phone': g_Userpara2.phone,'email': g_Userpara2.email};
        var url_para2 = {"authrequestUrl": g_Userpara2.authrequestUrl,
            "authredirectUrl": g_Userpara2.authredirectUrl,
            "preadvrequestUrl": g_Userpara2.preadvrequestUrl,
            "preadvredirectUrl": g_Userpara2.preadvredirectUrl};

        var hPending = Frame.Msg.pending(getRcText('OPENING_TENCENT'));

        saveCfg(1,tenxun_para1,url_para1,tenxun_para2,url_para2,function(res){

            hPending.close();
            if( res == 0) //使能成功
            {
                Frame.Msg.info(getRcText('OPEN_SUCCESS'));
                g_Userpara1.enable = true;
                g_Userpara2.enable = true;
                $("#authBtn").addClass('open');
                $("#authDescribe").html(getRcText('TENCENT_CERTIFIED_OPEN'));
            }
            else
            {
                Frame.Msg.info(getRcText('OPEN_ERROR'),"error");
            }
        })
    }


    /*弹出腾讯认证注册模态框页面*/
    function promptAuthDlg(){

        $("#authDlg").modal('show'); //弹出腾讯认证注册模态框，输入框清空
        $("#business_name").val("");
        $("#business_address").val("");
        $("#business_postcode").val("");
        $("#ap_manager").val("");
        $("#ap_phone").val("");
        $("#ap_email").val("");


        $("#authSubmitBtn").on("click",function(){

            //下发腾讯认证注册信息
            var hPending = Frame.Msg.pending(getRcText('TENCENT_REGISTER'));

            getAdvertUrl(function(sUrl){

                sendAuthMsg(sUrl,hPending);
            });
        });
    }


    //获取广告的url
    function getAdvertUrl(cBack){

        var option = {
            type: "post",
            url: MyConfig.v2path + "/getAdUrl",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                "nas_id": FrameInfo.Nasid
            }),
            onSuccess:function(data){

                if(data.response_code == 0)
                {
                    cBack(data.ad_url);
                }else{
                    cBack("");
                }
            },
            onFailed:function(){
                cBack("");
            }
        };

        Utils.Request.sendRequest(option);
    }


    /*下发腾讯认证注册信息*/
    function sendAuthMsg(url,hPending){

        var business_name     = $("#business_name").val();
        var business_address  = $("#business_address").val();
        var business_postcode = $("#business_postcode").val();
        var ap_manager = $("#ap_manager").val();
        var ap_phone   = $("#ap_phone").val();
        var ap_email   = $("#ap_email").val();

        if(!business_name || !business_address || !business_postcode || !ap_manager || !ap_phone || !ap_email)
        {
            hPending.close();
            return;
        }

        if( g_IsRegister == "noRegister") //一个Radio腾讯认证注册了，一个Radio没有腾讯认证注册
        {
            var radio;
            if( g_IsRegisterArr[0].radio == 1)
            {
                radio = 2;
            }
            else
            {
                radio = 1;
            }
            var opt = {
                url: MyConfig.path + "/ant/confmgr",
                type:'POST',
                dataType:'json',
                timeout: 150000,
                contentType: "application/json",
                data:JSON.stringify({
                    "configType": 0,
                    "sceneFlag": "false",
                    "policy":"cloudFirst",
                    "userName": FrameInfo.g_user.user,
                    "shopName": g_sShopName,
                    "nasId": FrameInfo.Nasid,
                    "cfgTimeout": 60,
                    "cloudModule": "xiaoxiaobeicfg",
                    "deviceModule": "xiaoxiaobei",
                    "devSN":FrameInfo.ACSN,
                    "method": "TencentWiFi",
                    "param":[
                        {
                            'businessName': business_name,
                            'address': business_address,
                            'postCode': business_postcode,
                            'manager': ap_manager,
                            'phone': ap_phone,
                            'email': ap_email,
                            'platform':getRcText('PLATFORM'),
                            'userName':FrameInfo.g_user.user,
                            'devSN':FrameInfo.ACSN,
                            'devModel':FrameInfo.Model,
                            'token': 'fou680nge4d5zaw9pjtbicmxvhyk21l7rs3q',
                            'ssidName': g_ssid,
                            'nasId':FrameInfo.Nasid,
                            'spName':"sp_visitor_03",
                            "preadvrequestUrl":"",
                            "preadvredirectUrl":"",
                            "authrequestUrl":url,
                            "authredirectUrl":"",
                            'enable':1,
                            'method':'reg',
                            'radio':radio
                        }
                    ]
                }),
                onSuccess:function(data){
                    hPending.close();

                    if( data.serviceResult == "fail") //注册失败
                    {
                        $("#authDlg").modal('hide');
                        Frame.Msg.info(getRcText('TENCENT_FAIL'),"error");
                        $("#authBtn").removeClass('open');
                        $("#authDescribe").html(getRcText('NOT_TENCENT_CERTIFIED'));
                    }
                    else if( data.serviceResult == "success")  //注册成功
                    {
                        if(data.reason == "Failed to set cfg to device."){
                            hPending&&hPending.close();
                            Frame.Msg.info(getRcText("TIPS"),"error"); 
                            return;
                        }
                        else{
                           $("#authDlg").modal('hide');
                           Frame.Msg.info(getRcText('TENCENT_SUCCESS'));
                           g_IsRegister = "";
                           g_IsRegisterArr = [];
                        }
                        //重新获取数据
                        initPage();
                    }
                },
                onFailed:function(){
                    hPending.close();
                    Frame.Msg.info(getRcText('TENCENT_FAIL'),"error");
                    $("#authBtn").removeClass('open');
                    $("#authDescribe").html(getRcText('NOT_TENCENT_CERTIFIED'));
                }
            }
        }
        else  //正常腾讯认证注册
        {
            var opt = {
                url: MyConfig.path + "/ant/confmgr",
                type:'POST',
                dataType:'json',
                timeout: 150000,
                contentType: "application/json",
                data:JSON.stringify({
                    "configType": 0,
                    "sceneFlag": "false",
                    "policy":"cloudFirst",
                    "userName": FrameInfo.g_user.user,
                    "shopName": g_sShopName,
                    "nasId": FrameInfo.Nasid,
                    'devSN':FrameInfo.ACSN,
                    "cfgTimeout": 60,
                    "cloudModule": "xiaoxiaobeicfg",
                    "deviceModule": "xiaoxiaobei",
                    "method": "TencentWiFi",
                    "param":[
                        {
                            'businessName': business_name,
                            'address': business_address,
                            'postCode': business_postcode,
                            'manager': ap_manager,
                            'phone': ap_phone,
                            'email': ap_email,
                            'platform':getRcText('PLATFORM'),
                            'userName':FrameInfo.g_user.user,
                            'devSN':FrameInfo.ACSN,
                            'devModel':FrameInfo.Model,
                            'token': 'fou680nge4d5zaw9pjtbicmxvhyk21l7rs3q',
                            'ssidName': g_ssid,
                            'nasId':FrameInfo.Nasid,
                            'spName':"sp_visitor_03",
                            "preadvrequestUrl":"",
                            "preadvredirectUrl":"",
                            "authrequestUrl":url,
                            "authredirectUrl":"",
                            'enable':1,
                            'method':'reg',
                            'radio':1
                        },
                        {
                            'businessName': business_name,
                            'address': business_address,
                            'postCode': business_postcode,
                            'manager': ap_manager,
                            'phone': ap_phone,
                            'email': ap_email,
                            'platform':getRcText('PLATFORM'),
                            'userName':FrameInfo.g_user.user,
                            'devSN':FrameInfo.ACSN,
                            'devModel':FrameInfo.Model,
                            'token': 'fou680nge4d5zaw9pjtbicmxvhyk21l7rs3q',
                            'ssidName': g_ssid,
                            'nasId':FrameInfo.Nasid,
                            'spName':"sp_visitor_03",
                            "preadvrequestUrl":"",
                            "preadvredirectUrl":"",
                            "authrequestUrl":url,
                            "authredirectUrl":"",
                            'enable':1,
                            'method':'reg',
                            'radio':2
                        }
                    ]
                }),
                onSuccess:function(data){
                    hPending.close();

                    if( data.serviceResult == "fail") //腾讯认证注册失败（无法知道是一个Radio注册失败了，还是两个Radio注册失败了）
                    {
                        $("#authDlg").modal('hide');
                        Frame.Msg.info(getRcText('TENCENT_FAIL'),"error");
                        $("#authBtn").removeClass('open');
                        $("#authDescribe").html(getRcText('NOT_TENCENT_CERTIFIED'));
                    }
                    else if(data.serviceResult == "success") //腾讯认证注册成功
                    {
                        $("#authDlg").modal('hide');
                        Frame.Msg.info(getRcText('TENCENT_SUCCESS'));

                        initPage();
                    }
                },
                onFailed:function(){
                    hPending.close();

                    Frame.Msg.info(getRcText('TENCENT_FAIL'),"error");
                    $("#authBtn").removeClass('open');
                    $("#authDescribe").html(getRcText('NOT_TENCENT_CERTIFIED'));
                }
            };
        }

        Utils.Request.sendRequest(opt);
    }
    function optionPush(){
        $(".toppannel #switch-text").html(getRcText("switchBtn"));
        function parseQuery(location) {
            var query = location.search.replace('?', '');
            var params = query.split('&');
            var result = {};
            $.each(params, function () {
                var temp = this.split('=');
                result[temp[0]] = temp.length === 2 ? temp[1] : undefined;
            });
            return result;
        }
        /*var $panel = $('#scenes_panel'), //  下拉面板
         $trigger = $('#change_scenes_trigger'),  //  点击展开的按钮
         $btnChange = $('#switchScenesBtn'),  //  确认按钮
         $selectedScene = $('#selectedScene'),  //  场景选择下拉框
         $devSn = $('#devSn'),  //  设备管理下拉
         $devContain = $('#device-contain'),
         $contain = $('#scene-contain');  //  容器*/
        var $panel = $('#reDevSelect #scenes_panel'), //  下拉面板
            $trigger = $('#reDevSelect #change_scenes_trigger'),  //  点击展开的按钮
            $btnChange = $('#reDevSelect #switchScenesBtn'),  //  确认按钮
            $selectedScene = $('#reDevSelect #selectedScene'),  //  场景选择下拉框
            $devSn = $('#reDevSelect #devSn'),  //  设备管理下拉
            $devContain = $('#reDevSelect #device-contain'),
            $contain = $('#reDevSelect #scene-contain');  //  容器
        //  if first load,set devsn value param's devsn
        var firstLoad = true, //   是否首次加载
            locales = {
                cn: {
                    trigger: '切换设备',
                    device: '选择设备',
                    shop: '选择场所',
                    online: '在线',
                    offline: '不在线'
                },
                en: {
                    trigger: 'Switch Device',
                    device: 'Device',
                    shop: 'Shop',
                    online: 'Online',
                    offline: 'Offline'
                }
            },
            _lang = $.cookie('lang') || 'cn';

        var senceInfo = parseQuery(window.location),
            model = senceInfo.model,  // 存储model信息
            sn = senceInfo.sn,
            nasid = senceInfo.nasid,
            sceneDevList = {}, //   场景和设备的关联关系
            sceneModelObj = {}, //  场景和model的对应关系  {shopId:model}
            devInfoList = {};  //  设备信息列表  {devSN:{devInfo}}

        $('#reDevSelect #switch-text').html(locales[_lang].trigger);  //  点击展开的文本
        $('#reDevSelect #switch-shop').html(locales[_lang].shop);   //  选择场所label
        $('#reDevSelect #switch-device').html(locales[_lang].device);   //   选择设备label

        /**
         * 生成dev下拉框并设置值
         */
        function fillDevField() {
            var val = $selectedScene.val(), devs = sceneDevList[val], devHtml = [];
            $devSn.html('');
            var selectedModel = sceneModelObj[val];
            //  model是1的时候，隐藏设备选择   model是1的时候是小小贝
            //$devContain[selectedModel === 1 ? 'hide' : 'show']();
            var devSnList = [];
            $.each(devs, function (i, d) {
                devSnList.push(d.devSN);
            });

            /**
             * 获取设备在线状态   1:不在线   0:在线
             * 微服务: renwenjie
             */
            $.post('/base/getDevs', {devSN: devSnList}, function (data) {
                var statusList = JSON.parse(data).detail, devList = [];
                $.each(devs, function (i, dev) {
                    $.each(statusList, function (j, sta) {
                        if (dev.devSN === sta.devSN) {
                            dev.status = sta.status;
                            devList.push(dev);
                        }
                    });
                });
                callback(devList);
            }, 'html');

            /**
             * 拼接select下拉框的数据
             * @param devs   所有的设备信息
             */
            function callback(devs) {
                $.each(devs, function (i, dev) {
                    devHtml.push('<option value="', dev.devSN, '">',
                        dev.devName + '(' + (dev.status == 0 ? locales[_lang].online : locales[_lang].offline) + ')',
                        '</option>');
                });
                //  如果是第一次加载就现在进来的sn，如果不是第一次进页面就选择默认的
                $devSn.html(devHtml.join('')).val((devs.length && !firstLoad) ? devs[0].devSN : sn);
                firstLoad = false;
            }
        }

        /**
         * 获取场景信息
         * @param sceneDevList
         * @param devInfoList
         */
        function getSceneList(sceneDevList, devInfoList) {
            $.get("/v3/web/cas_session?refresh=" + Math.random(), function (data) {
                $.post('/v3/scenarioserver', {
                    Method: 'getdevListByUser',
                    param: {
                        userName: data.user
                    }
                }, function (data) {
                    data = JSON.parse(data);
                    if (data && data.retCode == '0') {
                        var sceneHtmlList = [];
                        var sceneObj = {};
                        $.each(data.message, function (i, s) {
                            var devInfo = {
                                devName: s.devName,
                                devSN: s.devSN,
                                url: s.redirectUrl
                            };
                            if (!sceneDevList[s.scenarioId]) {
                                sceneDevList[s.scenarioId] = [];
                            }
                            // 设备信息
                            devInfoList[s.devSN] = devInfo;
                            //  {场景ID:devList}  场景和设备的对应关系
                            sceneDevList[s.scenarioId].push(devInfo);
                            //  {场所ID:场所名称}
                            sceneObj[s.scenarioId] = s.shopName;
                            //  {场所ID:场所model}
                            sceneModelObj[s.scenarioId] = Number(s.model);
                        });
                        // 拼接select框的option
                        $.each(sceneObj, function (k, v) {
                            sceneHtmlList.push('<option value="', k, '">', v, '</option>');
                        });
                        $selectedScene.html(sceneHtmlList.join('')).val(nasid);
                        // 填充设备列表
                        fillDevField();
                    }
                }, 'html');
            });
        }

        getSceneList(sceneDevList, devInfoList);
        $trigger.off('click').on('click', function () {
            $panel.toggle();
        });

        //$btnChange.off('click').on('click', function () {
        //    $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
        //    $panel.hide();
        //});


        $devSn.off("change").on("change",function(){
            $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
            //$panel.hide();
        });

        $selectedScene.off('change').on('change', fillDevField);

        $(document).on('click', function (e) {
            var $target = $(e.target);
            if ($target != $contain && !$.contains($contain.get(0), e.target)) {
                //$panel.hide();
            }
        });
        // ==============  选择场所，end  ==============
        $panel.show();
        function getuserSession() {
            $.ajax({
                url: MyConfig.path + "/scenarioserver",
                type: "POST",
                headers: {Accept: "application/json"},
                contentType: "application/json",
                timeout: 150000,
                data: JSON.stringify({
                    "Method": "getdevListByUser",
                    "param": {
                        "userName": FrameInfo.g_user.attributes.name

                    }
                }),
                dataType: "json",
                success: function (data) {
                    var AcInfo = [];
                    if (data.retCode == 0 && data.message) {
                        var snList = [];
                        var aclist = data.message;
                        for (var i = 0; i < aclist.length; i++) {
                            if (aclist[i].shopName) {
                                AcInfo.push({
                                    shop_name: aclist[i].shopName,
                                    sn: aclist[i].devSN,
                                    placeTypeName: aclist[i].scenarioName,
                                    redirectUrl: aclist[i].redirectUrl,
                                    nasid: aclist[i].scenarioId
                                });
                                snList.push(aclist[i].devSN);
                            } else if (aclist[i].devSN) {
                                snList.push(aclist[i].devSN);
                            }
                        }

                    } else {
                        Frame.Debuger.error("[ajax] error,url=====" + MyConfig.path + "/scenarioserver");
                    }
                    getAcInfo(AcInfo);
                }

            });
        }

        getuserSession();

        function getAcInfo(aclist) {
            var opShtmlTemple = "<li data_sn=vals  sel data-url=urls>palce</li>";
            var ulhtml = '<div class="select">' +
                '<p>' +
                '</p>' +
                '<ul>' +
                '</ul>' +
                '</div>';
            $("#station").append(ulhtml);
            for (var i = 0; i < aclist.length; i++) {
                if (window.location.host == "v3webtest.h3c.com") {
                    aclist[i].redirectUrl = aclist[i].redirectUrl.replace("lvzhouv3.h3c.com", "v3webtest.h3c.com");
                }
                var newHtmTemple = opShtmlTemple.replace(/vals/g, aclist[i].sn)
                    .replace(/urls/g, aclist[i].redirectUrl).replace(/palce/g, aclist[i].shop_name);
                var newHtmlTemple_1 = "";
                if (FrameInfo.ACSN == aclist[i].sn) {
                    $(".select > p").text($(newHtmTemple).text());
                } else {
                    newHtmlTemple_1 = newHtmTemple.replace(/sel/g, "");
                }
                $(".content .select ul").append(newHtmlTemple_1);

            }
            $(".select").click(function (e) {
                $(".select").toggleClass('open');
                return false;
            });

            $(".content .select ul li").on("click", function () {
                var _this = $(this);
                $(".select > p").text(_this.html());
                $.cookie("current_menu", "");
                var redirectUrl = $(this).attr("data-url");
                window.location.href = redirectUrl;
                _this.addClass("selected").siblings().removeClass("selected");
                $(".select").removeClass("open");
            });
            $(document).on('click', function () {
                $(".select").removeClass("open");
            })
        }
    }
    //检查当前是否可以下发注册信息
    function checkSendAuthMsg(){

        var business_name     = $("#business_name").val();
        var business_address  = $("#business_address").val();
        var business_postcode = $("#business_postcode").val();
        var ap_manager = $("#ap_manager").val();
        var ap_phone   = $("#ap_phone").val();
        var ap_email   = $("#ap_email").val();
        var business_postcode_error = $("#business_postcode_errorMsg").html();
        var ap_phone_error = $("#ap_phone_errorMsg").html();
        var ap_email_error = $("#ap_email_errorMsg").html();

        if( g_registerInfo.length == 0) //注册情况下判断是否可以下发消息
        {
            if(business_name && business_address && business_postcode && ap_manager && ap_phone && ap_email &&
                (business_postcode_error == "") && (ap_phone_error == "") && (ap_email_error == ""))
            {
                $("#authSubmitBtn").removeClass('gray');
            }
            else
            {
                $("#authSubmitBtn").addClass('gray');
            }
        }
        else  //更新情况下判断是否可以下发消息
        {
            if( ((business_name != g_registerInfo[0].businessName) || (business_address != g_registerInfo[0].address) || (business_postcode != g_registerInfo[0].postCode)
                || (ap_manager != g_registerInfo[0].manager) || (ap_phone != g_registerInfo[0].phone) || (ap_email != g_registerInfo[0].email)) &&
                (business_name && business_address && business_postcode && ap_manager && ap_phone && ap_email &&
                (business_postcode_error == "") && (ap_phone_error == "") && (ap_email_error == "")))
            {
                $("#authSubmitBtn").removeClass('gray');
            }
            else
            {
                $("#authSubmitBtn").addClass('gray');
            }
        }
    }

    function _destroy(){

        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _resize(){

    }

    function getRcText(sRcName) {

        return Utils.Base.getRcString("auth_rc", sRcName);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Minput", "SingleSelect", "Form", "DateTime"],
        "utils": ["Base", "Request","Device"]
    });
})(jQuery);