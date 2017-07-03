$(function(){
    var PageText = {
        curLang: "cn",
        cn:{
            findPwd_check:[
                "密码不能有空格",
                "密码长度至少为8位",
                "密码不一致",
                "用户名参数错误，6-32位，英文字符和数字组合",
                "验证码不能为空",
                "验证码参数错误",
                "手机验证码参数错误，不能有空格",
                "手机验证码参数不能为空",
                "发送验证码",
                "验证码已发送到您注册的手机",
                "还剩",
                "秒",
                "发送验证码",
                "请输入正确的图片验证码",
                "请求发送失败",
                "修改密码成功"
            ],
            form_icon:'form-cn',
            title:"华三绿洲|找回密码",
            findPwd_title:'找回密码',
            findPwd_page:{
                "nameLabel":"用户名",
                "photoIdentyLabel":"图片验证码",
                "imgCodeAlt":"图片验证码",
                "sendNumber":"获取验证码",
                "identifyLabel":"手机验证码",
                "passwordLabel":"新密码",
                "weak":"弱",
                "middle":"中",
                "strong":"强",
                "conpasswordLabel":"确认新密码",
                "submit":"确定",
                "backLogin":"返回"
            }
        },
        en:
        {
            findPwd_check:[
                "Spaces are not allowed.",
                "A minimum of 8 characters.",
                "Inconsistent password.",
                "Invalid username.The username must be a combination of 6 to 32 English characters and digits.",
                "The information is required.",
                "Incorrect code.",
                "Incorrect verification code.Spaces are not allowed.",
                "The information is required.",
                "Send Verification Code",
                "The verification code has been sent to your registered phone.",
                "left",
                "seconds",
                "Send Verification Code",
                "Please enter the correct picture verification code.",
                "Failed to request a verification code.",
                "Password modified successfully"
            ],
            form_icon:'form-en',
            title:"H3C OASIS|FIND PASSWORD",
            findPwd_title:'FIND PASSWORD',
            findPwd_page:{
                "nameLabel":"Username",
                "photoIdentyLabel":"Characters",
                "imgCodeAlt":"Characters",
                "sendNumber":"Send Verification code",
                "identifyLabel":"Verification code",
                "passwordLabel":"New password",
                "weak":"Week",
                "middle":"Middle",
                "strong":"Strong",
                "conpasswordLabel":"Confirm password",
                "submit":"Submit",
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
            $('#findPwd_title').html(PageText[sLang].findPwd_title);
            $('#nameLabel').html(PageText[sLang].findPwd_page.nameLabel);
            $('#photoIdentyLabel').html(PageText[sLang].findPwd_page.photoIdentyLabel);
            $('#imgCode').attr('alt',PageText[sLang].findPwd_page.imgCodeAlt);
            $('#sendNumber').text(PageText[sLang].findPwd_page.sendNumber);
            $('#identifyLabel').html(PageText[sLang].findPwd_page.identifyLabel);
            $('#passwordLabel').html(PageText[sLang].findPwd_page.passwordLabel);
            $('#weak').html(PageText[sLang].findPwd_page.weak);
            $('#middle').html(PageText[sLang].findPwd_page.middle);
            $('#strong').html(PageText[sLang].findPwd_page.strong);
            $('#conpasswordLabel').html(PageText[sLang].findPwd_page.conpasswordLabel);
            $('#submit').text(PageText[sLang].findPwd_page.submit);
            $('#backLogin').text(PageText[sLang].findPwd_page.backLogin);

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

    var getPinCode = "/oasis/stable/web/static/pinserver/getPin?random"+Math.random();
    var reg = /^[A-Za-z][A-Za-z0-9_][^\s]*$/;
    var telphoneREX = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    //点击密码可见
    $("#switch").click(function(){
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
    //点击确认密码可见
    $("#switch_con").click(function(){
        if($(this).hasClass('show_word'))
        {
            $(this).removeClass('show_word');
            $("#text_con").hide();
            $("#conpassword").show();
            $("#conpassword").val($("#text_con").val());
        }
        else{
            $(this).addClass('show_word');
            $("#text_con").show();
            $("#conpassword").hide();
            $("#text_con").val($("#conpassword").val());
        }
    });

    $("#password,#text").keyup(function(){
        if($(this).attr('id') == 'text'){
            $("#password").val($("#text").val());
        }else{
            $("#text").val($("#password").val());
        }
        if(!/^[^\s]*$/.test($(this).val())){
            setError($(this),PageText[slang].findPwd_check[0],true);
            return false
        }
        if(!checkEleLength($(this))){
            setError($(this),PageText[slang].findPwd_check[1],true);
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
        }else{
            $("#text_con").val($("#conpassword").val());
        }

        if($(this).val() === $('#password').val()){
            setError($("#conpassword"),'',false);
            setError($("#text_con"),'',false);
        }else{
            setError($("#conpassword"),PageText[slang].findPwd_check[2],true);
           // setError($("#conpassword"),'密码不一致',true);
        }
    });

     
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

    $('#name').on('focusout',function(){
        var element = $(this);
        var name = element.val();
        if(reg.test(element.val())&&checkEleLength(element)){
            setError(element,"",false);       
            return false;
        }else{
            setError(element,PageText[slang].findPwd_check[3],true);
        }
    });
    $('#photoIdenty').on("focusout",function(){
        var val = $(this).val();
        if(val.length==4)
        {
            setError($('#photoIdenty'),'',false);
            if(reg.test($('#name').val())&&checkEleLength($('#name')))
            {
                $('.send').removeClass('dis').removeAttr('disabled').css({'cursor':"pointer"});
            }
        }
        else if(val.length==0)
        {
            $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
            setError($('#photoIdenty'),PageText[slang].findPwd_check[4],true);
        }
        else
        {
            $('.send').addClass('dis').attr('disabled','disabled').css({'cursor':"no-drop"});
            setError($('#photoIdenty'),PageText[slang].findPwd_check[5],true);
        }
    });

    $('#checkCode').on('focusout',function(){
        var element = $(this);
        // var tel = $("#telephone").val();
        var checkCode = element.val();
        if(!/^[^\s]*$/.test(checkCode)){
            setError(element,PageText[slang].findPwd_check[6],true);
            return false;
        }
        else if(checkCode.length == 0){
            setError(element,PageText[slang].findPwd_check[7],true);
            return false;
        }else{
            setError(element,'',false);
        }
    });

    $('input[name]').on('keyup',function(){
        var status = 0;
          $('input[name]').each(function(){
             $(this).hasClass("warning") == true?status++:status;
             $(this).val().length == 0 ? status++ :status;
         });
        console.log("status:",status);
        if (status == 0){
            $("#submit").removeAttr('disabled');
        }else{
            $("#submit").attr('disabled','disabled');
        }
    });
    //获取图片验证码
   /* function getPinCodeFun(){

             $.ajax({
                type:"get",
                url:getPinCode,
                headers: { "Content-Type":'application/json',"Accept":'application/json' },
                success:function(data){
                    document.getElementById("imgCode").setAttribute('src',data.buf);
                },
                error:function(err){
                    console.log(err);
                }
            });
    }
    getPinCodeFun();*/
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
        getPinCodeFun();
    });
    $("#send").on('click',function(){
        sendCode(this);
    })
    function sendCode(obj) {
        if($("#photoIdenty").val()!=""){
            var pincode = $("#photoIdenty").val();
        }else{
            $("#photoIdenty_error").show();
        }
        if($("#name").val() == ""){
            $("#name_error").show();
        }else{
            $("#name_error").hide();
            $("#name").removeClass("error");
        }
        if (!$("#name").hasClass("error")) {
            var name = $("#name").val();
            $.ajax({
                type:"get",
                url:'/oasis/stable/web/static/oasis-rest-sms/restapp/user/sendCodeByUserName?user_name='+name+'&pinCode=' +pincode,
                success:function(data){
                    var data = JSON.parse(data);
                    if(data.code == 0){
                        $.jqueryNotice.show({
                            theme: "info",
                            msg: PageText[slang].findPwd_check[9],
                            title: ""
                        });
                        var time = 90;
                        $(obj).html(PageText[slang].findPwd_check[10] + time + PageText[slang].findPwd_check[11]);
                        var setTime = setInterval(function() {
                            time--;
                            if (time < 0) {
                                clearInterval(setTime);
                                $(obj).html( PageText[slang].findPwd_check[12]);
                            } else {
                                $(obj).html(PageText[slang].findPwd_check[10] + time + PageText[slang].findPwd_check[11]);
                            }
                        }, 1000);
                    }else if(data.retCode == -1){
                        $.jqueryNotice.show({
                            theme: "danger",
                            msg: (data.reason == "mismatch")?PageText[slang].findPwd_check[13]:data.reason,
                            title: ""
                        });
                    }else if(data.code == 1){
                        $.jqueryNotice.show({
                            theme: "danger",
                            msg: data.message,
                            title: ""
                        });
                    }
                },
                error:function(data){
                    $.jqueryNotice.show({
                        theme: "danger",
                        msg: PageText[slang].findPwd_check[14],
                        title: ""
                    });
                }
            });
        }
    }

    $("#submit").on('click',function(){
        submitForm();
    })
    function submitForm(){
        if($("#name").val() == ""){
            $("#name_error").show();
        }else{
            $("#name_error").hide();
            $("#name").removeClass("error");
        }
        // if(){
            var data = {};
            data.name = $("#name").val();
            data.password = $("#password").val();
            data.checkCode = $("#checkCode").val();
            console.log(data);
            $.ajax({
                type:"post",
                //url:'/o2oui/user/oasis-user/restapp/users/resetPwdWithCheck',
                url:'/oasis/stable/web/static/oasis-rest-user/restapp/users/resetPwdWithCheck',
                headers: { "Content-Type":'application/json',"Accept":'application/json' },
                data: JSON.stringify(data),
                success:function(data){
                    console.log(data);                
                    if(data.code == 0){
                        $.jqueryNotice.show({
                            theme: "info",
                            msg: PageText[slang].findPwd_check[15],
                            title: ""
                        });
                        //location.href = "/oasis/web/login.html";
                    }else{
                        $.jqueryNotice.show({
                            theme: "danger",
                            msg: data.message,
                            title: ""
                        });
                    }
                },
                error:function(data){
                    $.jqueryNotice.show({
                        theme: "danger",
                        msg:  PageText[slang].findPwd_check[14],
                        title: ""
                    });
                }
            });
        // }
    }
    $("#backLogin").on("click",function(){
        location.href = "/oasis/web/login.html";
    });
});


