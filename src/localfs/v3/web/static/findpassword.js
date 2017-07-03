$(function(){
    $("#email").change(function(){
        var re = /^[\w+\.]+@[\w+\.]+\.\w+$/;
        re.test($(this).val()) ? $("#mail_err").hide() : $("#mail_err").show();
        re.test($(this).val()) ? $("input[name='email']").removeClass("warning"):$("input[name='email']").addClass("warning")
    });
    $("#hname").change(function(){
        $(this).val().length > 0 ? $("#hname_error").hide() : $("#hname_error").show();
        $(this).val().length > 0 ? $("input[name='hname']").removeClass("warning"):$("input[name='hname']").addClass("warning");
    })
    $("#checknum").change(function(){
        $(this).val().length > 0 ? $("#check_error").hide() : $("#check_error").show();
        $(this).val().length > 0 ? $("input[name='checknum']").removeClass("warning"):$("input[name='checknum']").addClass("warning");
    })
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
    $("#text").keyup(function(){

        $("#password").val($("#text").val());

    });
    $("#text_con").keyup(function(){

        $("#conpassword").val($("#text_con").val());
    });
    $("#password,#text").change(function(){
        $(this).val().length >= 8 ? $("#password_error").hide() : $("#password_error").show();
        $(this).val().length >= 8 ? $("input[name='password']").removeClass("warning"):$("input[name='password']").addClass("warning");
    });
    $("#conpassword,#text_con") .change(function(){
        $(this).val() == $("#password").val() ? $("#conpassword_error").hide() : $("#conpassword_error").show();
        $(this).val() == $("#password").val() ? $("input[name='conpassword']").removeClass("warning"):$("input[name='conpassword']").addClass("warning");
    });

    $("#send").on("click", function(){
            $.ajax({
                type: "get",
                url: "sms?tel="+$("#telephone").val(),
                contentType: "application/json",
                success: function(data){
                    var flag=data; //0 success
                },
                error:function(err){

                }
            })
    });

    $("#hname").blur(function(e){
        if(e.relatedTarget&&e.relatedTarget.id == "backLogin"){
            return false;
        }
        $.ajax({
            type: "get",
            url: "getTel?user_name="+$("#hname").val(),
            contentType: "application/json",
            success: function(data){
                var getData=JSON.parse(data);
                var phone=getData.user_phone;
                if(phone)
                {
                    $("#telephone").val(phone);
                    $(".register_error").html("");
                }else{
                    $("#telephone").val("");
                    $(".register_error").html("用户不存在");
                    $(".register_error").css("display","block");
                }
            },
            error:function(err){
                $(".register_error").html("获取电话号码失败");
            }
        })
    });

    $("#registBtn").on("click", function(){
       var  status = 0;
        $("input[name]").each(function(i){
            $(this).hasClass("warning") == true?status++:status;
        });
        if (status == 0){
            $.ajax({
                type: "get",
                url: "conp?tel="+$("#telephone").val()+"&authNum="+$("#checknum").val()+"&user_name="+$("#hname").val()+"&new_password="+$("#password").val(),
                contentType: "application/json",
                success: function(data){
                    var getData=JSON.parse(data);
                   var flag=getData.error_code;
                    if(flag==0)
                    {
                        $(".register_error").html(getData.error_message);
                        $(".register_error").css("display","block");
                        setTimeout(location.href = "/v3/web/login.html",3000);
                    }else if(flag==1001){
                        $(".register_error").html("验证码错误");
                        $(".register_error").css("display","block");
                    }else if(flag==1002){
                        $(".register_error").html("数据更新失败");
                        $(".register_error").css("display","block");
                    }else{}
                },
                error:function(err){

                }
            })

        }
    });

    $("#backLogin").on("click",function(){
        location.href = "/v3/web/login.html";
    });

})

var countdown=90;

function settime(obj)
{

    if (countdown == 0) {
        obj.removeAttribute("disabled");
        obj.value="免费获取验证码";
        countdown = 90;
        return;
    } else {
        obj.setAttribute("disabled", true);
        obj.value="重新发送(" + countdown + ")";
        countdown--;
    }
    setTimeout(function() {
            settime(obj) }
        ,1000)
}