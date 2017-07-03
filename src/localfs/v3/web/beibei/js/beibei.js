/* beibei.js */
//右键菜单
var isindex = true;
var aiState = "";
var visitor = "xxx";
var sayTimerHandler = undefined;
var moveTimerHandler = 0;
var aiAddr = "http://www.tuling123.com/openapi/api";
var aiKey = "828507344169c6ff7fbdad2abbcb00a9";
jQuery(document).ready(function ($) {
    var forbidenSelectFlag = false;
    var isEmotionPlaying = false;
    var _move = false;
    var ismove = false; //移动标记
    var _x, _y; //鼠标离控件左上角的相对位置
    var xiaobeiAIIsActive = false;
    var socket={};
    var f;

    var emotionArray = ["like","happy","sad","alone","fight","cool","jeer","love","hug","miss","surprise","sick","tired","enjoy","awkward","scared","speechless","crazy","calm","hungry"];

    $(document).on("click","#online_service",function(){
        if(xiaobeiAIIsActive){
            return;
        }
        initAI();
    })
    $(document).on("click","#xiaobeiai_close",function(){
        finiAI();
    })

    $(document).on("mouseover", "#xiaobeiai", function (){
        $("#xiaobeiai_close").show();
    })
    $(document).on("mouseleave", "#xiaobeiai", function (){
        $("#xiaobeiai_close").hide();
    })

    $(document).on("click", "#aiQuestionLink", function (){
        aiState = "writing";
        $("#message").hide();
        $("#aiQuertionInput").show();
        $("#aiQuertionInput").focus();
    })

    function interactWithAI(msg){
        var userName = $("#username").text();
        aiState = "waitting";
        $("#aiQuertionInput").hide();
        $("#aiQuertionInput").val("");
        console.log(msg);
        socket.emit("querybeibei",{url:aiAddr,key:aiKey,userid:userName,info:escape(msg)},function(data){
            console.log(JSON.stringify(data));
            if(data["result"]=="success"){
                var m = JSON.parse(data["body"]).text;
                showMessage(m, 20000);
                aiState = "";
                $("#beibei").focus();
                resetBeibeiActiveTimer();
                beibeiEmotionPlay(data["text"]);
            }

        })
        //$.ajax({
        //    url: aiAddr,
        //    method:"post",
        //    data: {
        //        key:aiKey,
        //        info:msg,
        //        userid:escape(userName)
        //    },
        //    success: function( data ) {
        //        showMessage(data["text"], 50000);
        //        aiState = "";
        //        $("#beibei").focus();
        //        resetBeibeiActiveTimer();
        //        beibeiEmotionPlay(data["text"]);
        //    }
        //});
    }

    $(document).on("keydown", "#aiQuertionInput", function (event){
        /*enter*/
        //if(window.event.keyCode == 13){
        if(event.keyCode==13){
            var msg = $("#aiQuertionInput").val().trim();
            if(msg == ""){
                aiState = "";
                $("#aiQuertionInput").hide();
                $("#beibei").focus();
            }else{
                interactWithAI(msg);
            }
        }
        /*ESC*/
        if(event.keyCode == 27){
            aiState = "";
            $("#aiQuertionInput").hide();
        }
    });
    $(document).on("selectstart","body",function(){
        if(forbidenSelectFlag){
            return false;
        }
    });
    $(document).on("blur", "#aiQuertionInput",function(){
        $("#aiQuertionInput").hide();
        aiState = "";

    })

    //$(document).on("mouseenter", "#beibei", function(){
    //    if(!ismove){
    //        //beibeiEmotionPlayForRandom();
    //        //showMessage("我隐身了你看不见我。", 4000);
    //        $("#beibei").fadeTo("300", 0.2);
    //
    //        resetBeibeiActiveTimer();
    //    }
    //})
    //$(document).on("mouseleave", "#beibei", function(){
    //    if(!ismove){
    //        //beibeiEmotionPlayForRandom();
    //        //showMessage("我又出来了。", 4000);
    //        $("#beibei").fadeTo("300", 1);
    //
    //        resetBeibeiActiveTimer();
    //    }
    //})

    $(document).on("click", "#beibei", function () {
        if (!ismove && aiState == ""){
            aiState = "writing";
            $("#message").hide();
            $("#aiQuertionInput").show();
            $("#aiQuertionInput").focus();
        }else{
            ismove = false;
            forbidenSelectFlag = false;
        }
    })

    function beibeiEmotionPlayForMsg(msg){
        function beibeiFindEmotion(msg, cback){
            var i = Math.floor(Math.random() * emotionArray.length);
            cback(emotionArray[i]);
        }
       beibeiFindEmotion(msg, beibeiEmotionPlay);
    }
    function beibeiEmotionPlayForInit(){
        beibeiEmotionPlay("like");
    }

    function beibeiEmotionPlayForRandom(){
       var i = Math.floor(Math.random() * emotionArray.length);
        beibeiEmotionPlay(emotionArray[i]);
    }

    function beibeiEmotionPlay(emotionName){
        //var path = "../beibei/img/";
        //var extend = ".png";
        //var emotionPath = path + emotionName +extend;
        //if(!isEmotionPlaying){
        //    var timer = 0;
        //    var emotion  = new Image;
        //    var len = 0;
        //    var t = 0;
        //    emotion.src = emotionPath;
        //    emotion.onload = function(){
        //        len = parseInt(emotion.width / 148);
        //        isEmotionPlaying = true;
        //        timer = setInterval(function(){
        //            $("#beibei").css("background",  "url(" + emotionPath + ") no-repeat " + 148 * -t + "px 0");
        //            t++;
        //            if(t > len){
        //                $("#beibei").css("background","url(../beibei/img/small.png) no-repeat");
        //                isEmotionPlaying = false;
        //                clearInterval(timer);
        //            }
        //        },82);
        //    }
        //}
    }

    $(document).on("keydown","#beibei",function(event){
        /*ESC*/
        if(window.event.keyCode == 27){
            aiState = "";
            $("#aiQuertionInput").hide();
        }else{
            aiState = "writing";
            $("#aiQuertionInput").val("");
            $("#message").hide();
            $("#message").css("display","none");
            $("#aiQuertionInput").show();
            $("#aiQuertionInput").focus();
            event.stopPropagation();
            return false;
        }
    })

    //显示消息函数
    function showMessage(a, b) {
        if (b == null) b = 10000;
        jQuery("#message").hide().stop();
        jQuery("#message").html(a);
        //jQuery("#message").fadeIn();
        $("#message").css("display","inline-block");
        jQuery("#message").fadeTo("1", 1);
        jQuery("#message").fadeOut(b);
        //jQuery("#message").stop();
        //jQuery("#message").html(a);
        //jQuery("#message").fadeIn();
        //jQuery("#message").fadeOut(b);
    };

    ////鼠标在消息上时
    //$("#message").hover(function () {
    //    if(aiState == ""){
    //        $("#message").stop();
    //        $("#message").fadeTo("100", 1);
    //    }
    // });s


    ////鼠标在上方时
    //$("#beibei").mouseover(function () {
    //    if(aiState == ""){
    //        $("#beibei").fadeTo("300", 0.1);
    //        msgs = ["我隐身了，你看不到我", "我会隐身哦！嘿嘿！", "别动手动脚的，把手拿开！", "把手拿开我才出来！","你看不见我"];
    //        var i = Math.floor(Math.random() * msgs.length);
    //        showMessage(msgs[i]);
    //    }
    //});
    //$("#beibei").mouseout(function () {
    //    $("#beibei").fadeTo("300", 1)
    //});

    /*初始化*/
    function initAI(){
        if(FrameInfo.g_user.JSESSIONID == undefined || FrameInfo.g_user.JSESSIONID ==""){
            console.log("ERROR_SESSIONID: "+ FrameInfo.g_user.JSESSIONID);
            return;
        }
        xiaobeiAIIsActive = true;
        forbidenSelectFlag = false;
        isEmotionPlaying = false;
        _move = false;
        ismove = false; //移动标记
        f = $("#xiaobeiai").offset().top;
        visitor = $("#username").text();
        if (isindex) { //如果是主页
            var now = (new Date()).getHours();
            if (now > 0 && now <= 6) {
                showMessage(visitor + ' 你是夜猫子呀？还不睡觉？', 6000);
            } else if (now > 6 && now <= 11) {
                showMessage(visitor + ' 认识你好开心哦！', 6000);
            } else if (now > 11 && now <= 14) {
                showMessage(visitor + ' 中午了，吃饭了么？不要饿着了！', 6000);
            } else if (now > 14 && now <= 18) {
                showMessage(visitor + ' 下午好，很高兴我们又见面了。', 6000);
            } else {
                showMessage(visitor + ' 你好我叫贝贝，快来逗我玩吧！', 6000);
            }
        }

        $("#xiaobeiai").animate(
            {
                top: $("#xiaobeiai").offset().top+300,
                left: document.body.offsetWidth-160
            },
            {
                queue: false,
                duration: 1000,
                complete:beibeiEmotionPlayForInit
            }
        );
        $("#beibei").focus();

        sayTimerHandler = setInterval(aiSay, 35000);

        socket = io.connect("https://lvzhouchat.h3c.com",{secure:true});
        //socket = io.connect("https://localChatTest.h3c.com:3011",{secure:true});
        socket.on('connect', function(){
            console.log("beibei_connect");

            socket.emit('authentication', {chatid:FrameInfo.g_user.JSESSIONID,query:true}, function(){
            });
            //socket.emit('authentication', {user:"liuchao",query:true}, function(){
            //});
        })

        socket.on('authenticated', function(info){
            console.log("beibei_authenticated_" + info);
        })


    }
    function finiAI(){
        xiaobeiAIIsActive = false;
        if(sayTimerHandler){
            clearInterval(sayTimerHandler);
            sayTimerHandler = undefined;
        }
        $("#xiaobeiai_close").css("display","none");

        //$("#xiaobeiai").css({top:"-200px",left:"160px"});
        $("#xiaobeiai").animate(
            {
                top: -200,
                left: 160
            },
            {
                queue: false,
                duration: 1000,
            }
        );
        if(socket!={}){
            socket.close();
            socket = {};
        }
    }


    function aiSay(){
        if(aiState == "" && !ismove){
            var msgs = [{msg:"陪我聊天吧！",action:"alone"},
                        {msg:"好无聊哦，你都不陪我玩！",action:"alone"},
                        {msg:"我可爱吧！嘻嘻!",action:"like"},
                        {msg:"主人我好喜欢你哦！",action:"love"},
                        {msg:"你看我裤不裤？",action:"cool"},
                        {msg:"要抱抱！！！",action:"hug"},
                        {msg:"好开心哦，又呲成长快乐了.",action:"happy"},
                        {msg:"阀开心! 你都不陪我聊天",action:"sad"}];
            var i = Math.floor(Math.random() * msgs.length);
            showMessage(msgs[i]["msg"], 7000);
            beibeiEmotionPlay(msgs[i]["action"]);
        }
    }
    function resetBeibeiActiveTimer(){
        if(sayTimerHandler){
            clearInterval(sayTimerHandler);
            sayTimerHandler = setInterval(aiSay, 35000);
        }
    }

    //
    ////无聊动动
    //moveTimerHandler =setInterval(function () {
    //    if(aiState == ""){
    //        var msgs = ["乾坤大挪移！", "我飘过来了！~", "我飘过去了", "我得意地飘！~飘！~"];
    //        var i = Math.floor(Math.random() * msgs.length);
    //        s = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6,0.7,0.75,-0.1, -0.2, -0.3, -0.4, -0.5, -0.6,-0.7,-0.75];
    //        var i1 = Math.floor(Math.random() * s.length);
    //        var i2 = Math.floor(Math.random() * s.length);
    //        $("#xiaobeiai").animate({
    //            left: document.body.offsetWidth/2*(1+s[i1]),
    //            top:  document.body.offsetHeight/2*(1+s[i1])
    //        },
    //        {
    //            duration: 2000,
    //            complete: showMessage(msgs[i])
    //        });
    //    }
    //
    //}, 70000);


    //滚动条移动
    $(window).scroll(function () {
        $("#xiaobeiai").animate({
            top: $(window).scrollTop() + f +300
        },
        {
            queue: false,
            duration: 1000
        });
    });

    $("#beibei").mousedown(function (e) {
        forbidenSelectFlag = true;
        _move = true;
        _x = e.pageX - parseInt($("#xiaobeiai").css("left"));
        _y = e.pageY - parseInt($("#xiaobeiai").css("top"));
     });
    $(document).mousemove(function (e) {
        if (_move) {
            var x = e.pageX - _x;
            var y = e.pageY - _y;
            var wx = $(window).width() - $('#xiaobeiai').width();
            var dy = $(document).height() - $('#xiaobeiai').height();
            if(x >= 0 && x <= wx && y > 0 && y <= dy) {
                $("#xiaobeiai").css({
                    top: y,
                    left: x
                }); //控件新位置
            ismove = true;
            }
        }
    }).mouseup(function () {
        _move = false;
        forbidenSelectFlag = false;
    });

});


