/**
 * Created by Administrator on 2016/9/20.
 */
(function($){
    var PageText = {
        curLang: "cn",
        cn:{
            register_check:[
                "手机号参数错误",
                "手机号已被注册",
                "手机号校验失败",
                "手机验证码参数错误，不能有空格",
                "手机验证码参数不能为空",
                "手机验证码错误",
                "手机验证码校验失败",
                "邮箱参数错误",
                "邮箱已经存在",
                "邮箱校验失败",
                "验证码不能为空",
                "验证码参数错误",
                "用户名已存在",
                "用户名校验失败",
                "用户名参数错误，6-32位，以英文开头，英文字符、数字、下划线",
                "图片验证码校验错误",
                "短信发送失败",
                "密码不能有空格",
                "密码长度至少为8位",
                "密码不一致",
                "用户注册成功",
                "用户已注册",
                "注册失败",
                "获取验证码",
                "重新发送"
            ],
            form_icon:'form-cn',
            title:"华三绿洲|注册",
            register_title:'注册新账号',
            register_page:{
                "telephoneLabel":"手机号码",
                "photoIdentyLabel":"图片验证码",
                "imgCodeAlt":"图片验证码",
                "sendNumber":"获取验证码",
                "identifyLabel":"手机验证码",
                "emailLabel":"邮箱地址",
                "hnameLabel":"用户名",
                "passwordLabel":"登录密码",
                "weak":"弱",
                "middle":"中",
                "strong":"强",
                "conpasswordLabel":"确认密码",
                "registBtn":"注册",
                "backLogin":"返回"
            }
        },
        en:
        {
            register_check:[
                "Invalid phone number format.",
                "The mobile phone number has been used.",
                "Phone number verification failure.",
                "Incorrect verification code.Spaces are not allowed.",
                "This information is required.",
                "Invalid verification code.",
                "Phone number verification failure.",
                "Invalid email address",
                "The email address has been used.",
                "Email address verification failure.",
                "This information is required.",
                "Incorrect Characters.",
                "The username has been used.",
                "Username verification failure.",
                "Enter a string of 6 to 32 characters that contain English characters,underscores,and digits and start the name with English letters.",
                "Incorrect characters.",
                "SMS failure",
                "Spaces are not allowed.",
                "A minimum of 8 characters.",
                "Inconsistent password.",
                "Register success.",
                "You are already registered.",
                "Register failure.",
                "Get verification code",
                "Re-send"
            ],
            form_icon:'form-en',
            title:"H3C OASIS|REGISTER",
            register_title:'Register a new account',
            register_page:{
                "telephoneLabel":"Mobile phone number",
                "photoIdentyLabel":"Characters",
                "imgCodeAlt":"Characters",
                "sendNumber":"Get verification code",
                "identifyLabel":"Verification code",
                "emailLabel":"Msilbox address",
                "hnameLabel":"Username",
                "passwordLabel":"Login password",
                "weak":"Week",
                "middle":"Middle",
                "strong":"Strong",
                "conpasswordLabel":"Confirm password",
                "registBtn":"Regist",
                "backLogin":"Back"
            }
        },
        changeLanguage: function(sLang)
        {
            if(!sLang)
            {
                sLang = ("cn"==this.curLang) ? "cn" : "en";
            }
            this.curLang = sLang;

            document.title = PageText[sLang]["title"];
            //dom 操作
            $('#register_title').html(PageText[sLang].register_title);
            $('#telephoneLabel').html(PageText[sLang].register_page.telephoneLabel);
            $('#photoIdentyLabel').html(PageText[sLang].register_page.photoIdentyLabel);
            $('#imgCode').attr('alt',PageText[sLang].register_page.imgCodeAlt);
            $('#sendNumber').text(PageText[sLang].register_page.sendNumber);
            $('#identifyLabel').html(PageText[sLang].register_page.identifyLabel);
            $('#emailLabel').html(PageText[sLang].register_page.emailLabel);
            $('#hnameLabel').html(PageText[sLang].register_page.hnameLabel);
            $('#passwordLabel').html(PageText[sLang].register_page.passwordLabel);
            $('#weak').html(PageText[sLang].register_page.weak);
            $('#middle').html(PageText[sLang].register_page.middle);
            $('#strong').html(PageText[sLang].register_page.strong);
            $('#conpasswordLabel').html(PageText[sLang].register_page.conpasswordLabel);
            $('#registBtn').text(PageText[sLang].register_page.registBtn);
            $('#backLogin').text(PageText[sLang].register_page.backLogin);


            //图片
            $('#form-icon').removeClass(PageText[sLang].form_icon).addClass(PageText[sLang].form_icon);
        }
    };
    var Cookie =
    {
        get: function (sName)
        {
            // cookies are separated by semicolons
            var aCookie = document.cookie.split("; ");
            for (var i=0; i < aCookie.length; i++)
            {
                // a name/value pair (a crumb) is separated by an equal sign
                var aCrumb = aCookie[i].split("=");
                if (sName == aCrumb[0])
                    return unescape(aCrumb[1]||"");
            }

            // a cookie with the requested name does not exist
            return null;
        },

        set: function (oPara, retentionDuration)
        {
            var sExpres = "";
            var n = parseInt(retentionDuration);
            if(-1 == n)
            {
                // 不老化
                var date = new Date(2099,12,31);
                sExpres = "expires=" + date.toGMTString();
            }
            else if(n>0)
            {
                var date = new Date();
                date.setTime(date.getTime() + n*3600000);
                sExpres = "expires=" + date.toGMTString();
            }

            for (var sName in oPara)
            {
                var sCookie = sName+"="+escape(oPara[sName])+"; path=/;" + sExpres;
                document.cookie = sCookie;
            }
        },
        del: function(sName)
        {
            var date = new Date();
            date.setTime(date.getTime() - 10000);

            var aTemp = sName.split(",");
            for(var i=0; i<aTemp.length; i++)
            {
                var sCookie = aTemp[i] + "=d; path=/; expires=" + date.toGMTString();
                document.cookie = sCookie;
            }
        }
    }

    var slang ;
    function initLanguage(){
        slang = Cookie.get('slang')?Cookie.get('slang'):'cn';
        PageText.changeLanguage(slang)
    }
    initLanguage();
    /*count down function*/
    var checkPhoneExist = "/oasis/stable/web/static/oasis-rest-user/restapp/users/isExistPhone/";
    var checkIdentify = "/oasis/stable/web/static/oasis-rest-emay/restapp/user/checkPhoneCode";
    var checkNameExist = "/oasis/stable/web/static/oasis-rest-user/restapp/users/isExistName/";
    var checkEmailExist = "/oasis/stable/web/static/oasis-rest-user/restapp/users/isExistEmail/";
    var registUser = "/oasis/stable/web/static/oasis-rest-user/restapp/users";
    var getPhoneCode = "/oasis/stable/web/static/oasis-rest-sms/restapp/user/getPhoneCode";
    var getPinCode = "/oasis/stable/web/static/pinserver/getPin?random="+Math.random();
    var telphoneREX = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;



    //daojishi
    function countDownTime(Ele){
        var countdown=90;
        var id=setInterval(function() {
            if (countdown == 0) {
                Ele[0].removeAttribute("disabled");
                Ele[0].innerText=PageText[slang].register_check[23];
                clearInterval(id);
                countdown = 90;
                return;
            } else {
                Ele[0].setAttribute("disabled", true);
                Ele[0].innerText=PageText[slang].register_check[24]+"(" + countdown + ")";
                countdown--;
            }
        },1000);
    }
    //dom set error
    function setError(o,msg,bFlag){
        var errorId = "#"+o.attr('errid');
        if(bFlag){
            o.addClass("warning")
            if(msg&&msg!=""){
                $(errorId).text(msg);
            }
            $(errorId).addClass("error_show");

        }else{
            o.removeClass("warning");
            $(errorId).removeClass("error_show");
        }

    }
    //check length
    function checkEleLength(ele){
        var min = ele.attr('minlength');
        var max = ele.attr('maxlength');
        var val = ele.val();
        if(val.length >= min && val.length <= max)
        {
            return true;
        }
        else
        {
            return false;
        }
    }


    $("#telephone").on( "focusout",function(){
        var element = $(this);
        var tel = element.val();
        /*匹配非13、14、15、17、18开头的*/
        if(!telphoneREX.test(tel))
        {
            setError(element,PageText[slang].register_check[0],true);
            $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
            return false;
        }

        function isUserTel(){
            return $.ajax({
                type: "GET",
                url: checkPhoneExist+tel,
                contentType: "application/json",
                dataType: "json"
            })
        };
        isUserTel().done(function(data){
            if(data && data.code==0){
                if(data.data){
                    setError(element,PageText[slang].register_check[1],true);
                    $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
                }else {
                    if($('#photoIdenty').val().length == 6){
                        $('.send').removeClass('dis').removeAttr('disabled')
                            .css({'cursor':"pointer"});
                    }
                    setError(element,'',false);
                }
            }
        })
        .fail(function(err){
            $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
            setError(element,PageText[slang].register_check[2],true);
         });
    });
    $('#identify').on('focusout',function(){
        var element = $(this);
        var tel = $("#telephone").val();
        var checkCode = element.val();
        if(!/^[^\s]*$/.test(checkCode)){
            setError(element,PageText[slang].register_check[3],true);
            return false;
        }
        if(checkCode.length == 0){
            setError(element,PageText[slang].register_check[4],true);
            return false;
        }else{
            setError(element,'',false);
        }
        function checkPhoneCode(){
            return $.ajax({
                type: "POST",
                url: checkIdentify,
                contentType: "application/json",
                dataType: "json",
                data:JSON.stringify({
                    "phone":tel,
                    "checkCode":checkCode
                })
            })
        };
        checkPhoneCode().done(function(data){
            if(data && data.code==0){
                setError(element,'',false);
            }
            else{
                setError(element,PageText[slang].register_check[5],true);
            }
        }).fail(function(err){
            setError(element,PageText[slang].register_check[6],true);
        });
    });
    $('#email').on( 'focusout',function(){
        var element = $(this);
        var email = element.val();
        if(!/^[\w+\.]+@[\w+\.]+\.\w+$/.test(email)){
            setError(element,PageText[slang].register_check[7],true);
            return false;
        }else{
            setError(element,'',false);
        }

        function checkEmail(){

            return $.ajax({
                type: "GET",
                url: checkEmailExist+email,
                contentType: "application/json",
                dataType: "json"
            })
        };
        checkEmail().done(function(data){
            if(data && data.code==0){
                if(data.data){
                    setError(element,PageText[slang].register_check[8],true);
                }else{
                    setError(element,'',false);
                }
            }
        }).fail(function(err){
            console.log(err);
            setError(element,PageText[slang].register_check[9],true);
        });
    });
    $('#photoIdenty').on("focusout",function(){
        var val = $(this).val();
        if(val.length==4)
        {
            setError($('#photoIdenty'),'',false);
            if(telphoneREX.test($('#telephone').val())&&!$('#telephone').hasClass('warning'))
            {
                $('.send').removeClass('dis').removeAttr('disabled').css({'cursor':"pointer"});
            }

        }
        else if(val.length==0)
        {
            $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
            setError($('#photoIdenty'),PageText[slang].register_check[10],true);
        }
        else
        {
            $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
            setError($('#photoIdenty'),PageText[slang].register_check[11],true);
        }
    });

    function getPinCodeFun(){
        $.get(getPinCode).success(function(data){
            $('.loader').addClass('loader_disabled');
            $('#imgCode').removeClass('img-disabled');
            $('.send').css({ 'margin-left': "10px" });
            $('#imgCode').attr('src',data.buf)
        }).error(function(err){
            console.log(err);
        });
    }

    getPinCodeFun();

    $('#imgCode').on('click',function(){
        $('#imgCode').addClass('img-disabled');
        $('.loader').removeClass('loader_disabled');
        getPinCodeFun();
    });
    $('#hname').on( 'focusout',function(){
        var element = $(this);
        var name = element.val();
        var reg = /^[a-zA-Z]\w{5,31}$/;
        if(reg.test(element.val())&&checkEleLength(element)){
            function checkUserName(){
                return $.ajax({
                    type: "GET",
                    url: checkNameExist+name,
                    contentType: "application/json",
                    dataType: "json"
                })
            };
            checkUserName().done(function(data){
                if(data.data){
                    setError(element,PageText[slang].register_check[12],true);
                }else{
                    setError(element,'',false);
                }
            }).fail(function(err){
                setError(element,PageText[slang].register_check[13],true);
            });
        }
        else
        {
            setError(element,PageText[slang].register_check[14],true);
        }
    });

    $(".send").on('click',function(){
        var tel = $('#telephone').val();
        var code = $('#photoIdenty').val();
        var  ele = $(this);
        function sendMessage(){
            return $.ajax({
                type: "POST",
                url: getPhoneCode+"?pinCode="+code,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "phone":tel
                })
            })
        }
        sendMessage().done(function (data) {
            if(data&&data.code==0)
            {
                countDownTime(ele);
            }
            else if(data&&data.url=='pinserver')
            {
                $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
                setError($("#photoIdenty"),PageText[slang].register_check[15],true);
                getPinCodeFun();
            }
            else
            {
                $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
                setError($("#telephone"),PageText[slang].register_check[16],true);
                getPinCodeFun();
            }
        }).fail(function(err){
            $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
            setError($("#telephone"),PageText[slang].register_check[16],true);
            console.log(err);
        })

    });
    $("#switch").click(function(){
        if($("#password").hasClass('warning')){
            $("#password").removeClass('warning');
            $("#text").addClass('warning');
        }
        else
        {
            if($("#text").hasClass('warning'))
            {
                $("#password").addClass('warning');
            }
            $("#text").removeClass('warning');
        }
        if($(this).hasClass('show_word'))
        {
            $(this).removeClass('show_word');
            $("#text").hide();
            $("#password").show();
            $("#password").val($("#text").val());
        }
        else{
            $(this).addClass('show_word');
            $("#text").show();
            $("#password").hide();
            $("#text").val($("#password").val());
        }
    });
    $("#switch_con").click(function(){
        if($("#conpassword").hasClass('warning')){
            $("#conpassword").removeClass('warning');
            $("#text_con").addClass('warning');
        }else{
            if($("#text_con").hasClass('warning'))
            {
                $("#conpassword").addClass('warning');
            }
            $("#text_con").removeClass('warning');
        }
        if($(this).hasClass('show_word'))
        {
            $(this).removeClass('show_word');
            $("#text_con").hide();
            $("#conpassword").show();
            $("#conpassword").val($("#text_con").val());
        }
        else
        {
            $(this).addClass('show_word');
            $("#text_con").show();
            $("#conpassword").hide();
            $("#text_con").val($("#conpassword").val());
        }
    });
    $("#password,#text").keyup(function(){
        if($(this).attr('id') == 'text'){
            $("#password").val($("#text").val());
        }
        if(!/^[^\s]*$/.test($(this).val())){
            setError($(this),PageText[slang].register_check[17],true);
            return false
        }
        if(!checkEleLength($(this))){
            setError($(this),PageText[slang].register_check[18],true);
            $('.password_strength_text:eq(0)').addClass('password_strength_text_disable');
            $('.password_strength:eq(0)').addClass('password_strength_disable');
            $('.password_strength_text:eq(1)').addClass('password_strength_text_disable');
            $('.password_strength:eq(1)').addClass('password_strength_disable');
            $('.password_strength_text:eq(2)').addClass('password_strength_text_disable');
            $('.password_strength:eq(2)').addClass('password_strength_disable');
            return false
        }else{
            setError($(this),'',false);
        }
        if($('#conpassword').val()){
            if($(this).val() === $('#conpassword').val()){
                setError($('#conpassword'),'',false);
            }else{
                setError($('#conpassword'),PageText[slang].register_check[19],true);
            }
        }
        var val = $(this).val();
        var easyRex_one =/^.[0-9]+$/;
        var easyRex_two =/^.[a-z]+$/;
        var easyRex_three =/^.[A-Z]+$/;
        var easyMid = /^.[A-Za-z0-9]+$/;
        var easycomplex = /^.[A-Za-z0-9\/\?\.\!\@\#\$\%\&\*\^\(\)\-\_\+\,\<\>\\\"\'\:\;\{\}\[\]\~]*$/;
        $('.password_border').removeClass('password_border_disable');
        if(easyRex_one.test(val) || easyRex_two.test(val) ||easyRex_three.test(val))
        {
            $('.password_strength_text:eq(0)').removeClass('password_strength_text_disable');
            $('.password_strength:eq(0)').removeClass('password_strength_disable');
            $('.password_strength_text:eq(1)').addClass('password_strength_text_disable');
            $('.password_strength:eq(1)').addClass('password_strength_disable');
            $('.password_strength_text:eq(2)').addClass('password_strength_text_disable');
            $('.password_strength:eq(2)').addClass('password_strength_disable');
        }
        else if(easyMid.test(val))
        {
            $('.password_strength_text:eq(0)').removeClass('password_strength_text_disable');
            $('.password_strength:eq(0)').removeClass('password_strength_disable');
            $('.password_strength_text:eq(1)').removeClass('password_strength_text_disable');
            $('.password_strength:eq(1)').removeClass('password_strength_disable');
            $('.password_strength_text:eq(2)').addClass('password_strength_text_disable');
            $('.password_strength:eq(2)').addClass('password_strength_disable');
        }
        else if(easycomplex.test(val))
        {
            $('.password_strength_text:eq(0)').removeClass('password_strength_text_disable');
            $('.password_strength:eq(0)').removeClass('password_strength_disable');
            $('.password_strength_text:eq(1)').removeClass('password_strength_text_disable');
            $('.password_strength:eq(1)').removeClass('password_strength_disable');
            $('.password_strength_text:eq(2)').removeClass('password_strength_text_disable');
            $('.password_strength:eq(2)').removeClass('password_strength_disable');
        }else
        {
            $('.password_strength_text:eq(0)').addClass('password_strength_text_disable');
            $('.password_strength:eq(0)').addClass('password_strength_disable');
            $('.password_strength_text:eq(1)').addClass('password_strength_text_disable');
            $('.password_strength:eq(1)').addClass('password_strength_disable');
            $('.password_strength_text:eq(2)').addClass('password_strength_text_disable');
            $('.password_strength:eq(2)').addClass('password_strength_disable');
        }

    });
    $("#conpassword,#text_con").keyup(function(){
        if($(this).attr('id') == 'text_con'){
            $("#conpassword").val($("#text_con").val());
        }
        if($(this).val() === $('#password').val()){
            setError($(this),'',false);
        }else{
            setError($(this),PageText[slang].register_check[18],true);
        }

    });

    $('input[name]').on('keyup focusout',function(){
        var status = 0;
         $('input[name]').each(function(){
             $(this).hasClass("warning") == true?status++:status;
             $(this).val().length == 0 ? status++ :status;
         });
        if (status == 0){
            $("#registBtn").removeAttr('disabled');
        }else{
            $("#registBtn").attr('disabled','disabled');
        }
        $(".register_error").css("display","none");
    });

    $("#registBtn").on("click", function(){

         $.ajax({
                    type: "POST",
                    url: registUser,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({
                        "phone": $("#telephone").val(),
                        "email":$("#email").val(),
                        "name":$("#hname").val(),
                        "password": $("#password").val()
                    }),
                    success: function(data){
                        if (data&&data.code == 0){
                            $.jqueryNotice.show({
                                theme: "info",
                                msg: PageText[slang].register_check[20],
                                title: ""
                            })
                        }
                        else {
                            $.jqueryNotice.show({
                                theme: "danger",
                                msg: PageText[slang].register_check[21],
                                title: ""
                            })
                        }
                    },
                    error:function(err){
                        $.jqueryNotice.show({
                            theme: "danger",
                            msg: PageText[slang].register_check[22],
                            title: ""
                        })
                    }
                });
    });
    $("#backLogin").on("click",function(){
        location.href = "/oasis/web/login.html";
    });
})($);