/**
 * Created by Administrator on 2016/1/5.
 */
/*
* 调用此JS 请先引用socket.io.js,并将chat文件夹拷贝至你的工程内
* */

/*
 *参数说明：
 * xiaoBeiPath 聊聊首页chat.html的路径,如"../chat/cn/chat.html"
 * sessionId 用户认证后WEBSERVER分配的SESSIONID
 * */

/*
* 事件说明：
* "newMsg":
*          回调参数：1、e
*                   2、data  false/true false没有新消息，true有新消息
*
* 用法示例：
 var chat = $("#online_service").xiaoBeiChat({xiaobeiPath:"../chat/cn/chat.html",sessionId:"aaaaaaaaaaaa"})
 chat.bind("newMsg",function(e, data){
     if(data){
        console.log("您有新消息");
     }else{
        console.log("消息已经被收取");
     }
 })
 chat.bind("chatHeadImg",function(e, data){
     if(data){
         设置自己的头像
        $("#chatHeadImg").attr("src", data);
     }
 })
* */

/*(function( global, factory ) {

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        // For CommonJS and CommonJS-like environments where a proper window is present,
        // execute the factory and get jQuery
        // For environments that do not inherently posses a window with a document
        // (such as Node.js), expose a jQuery-making factory as module.exports
        // This accentuates the need for the creation of a real window
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "jQuery requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this,function ($) {

        $.fn.xiaoBeiChat=function(option){
            var defaults = {
                xiaobeiPath: "",
                sessionId: "",
            }
            var chatWin;
            var chatQuerySocket;
            var options = $.extend(defaults, option);
            var chatUid;
            var me=this;

            $(this).bind("click", function () {
                if(!options.sessionId || options.sessionId==""){
                    console.log("ERROR:sessionId = "+ options.sessionId);
                    return false;
                }
                chatWin = window.open(options.xiaobeiPath + "?" + "sessionid=" + options.sessionId, 'xiaobei');
            })
            $(window).bind('beforeunload',function(){
                if(chatWin){
                    chatWin.onbeforeunload = null;
                    chatWin.close();
                    chatWin = undefined;
                }
            });

            //chatQuerySocket = io.connect('ws://172.27.8.185:3010');
            //chatQuerySocket = io.connect('ws://h3crd-wlan1.chinacloudapp.cn:3010');
            chatQuerySocket = io.connect("https://lvzhouchat.h3c.com",{secure:true});

            chatQuerySocket.on('connect', function(){
                console.log("connect_success");
                chatQuerySocket.emit('authentication', {chatid:options.sessionId,query:true}, function(a){
                });
            })
            chatQuerySocket.on('authenticated', function(info){
                console.log("authenticated_" + info);
                chatQuerySocket.emit("getselfinfo",{}, function(data){
                    console.log("getselfinfo_"+JSON.stringify(data));
                    chatUid = data["uid"];
                    getSelfHeadImg();
                })
            })

            chatQuerySocket.on("queryNewMsg",function(data){
                console.log("queryNewMsg_"+JSON.stringify(data));
                $(me).trigger("newMsg", data["newMsg"]);
            })

            chatQuerySocket.on("photoChg",function(data){
                console.log("photoChg_"+JSON.stringify(data));
                if(data["result"]=="success"){
                    if(chatUid == data["body"]["uid"]){
                        getSelfHeadImg(data);
                    }
                }
            })

            function getSelfHeadImg(){
                chatQuerySocket.emit("userPhotoGet",{uid:chatUid},function(data){
                    //console.log("userPhotoGet_"+JSON.stringify(data));
                    if(data["result"]=="success" && data["body"]["photoid"] && data["body"]["image"]){
                        convertHeadImg(data["body"]["image"],function(img){
                            $(me).trigger("chatHeadImg", img);
                        })
                    }else if(data["result"]=="failed") {
                        console.log("获取头像失败");
                    }
                })
            }

            function readBlobAsDataURL(blob, callback) {
                var a = new FileReader();
                a.onload = function() {callback(a.result);};
                a.readAsDataURL(blob);
            }
            function convertHeadImg(img,cback) {
                var image = JSON.parse(img);
                //console.log(image);
                var arr = [];
                for (var i in image) {
                    arr[i] = image[i];
                }
                if (arr.length > 0) {
                    var ia = new Uint8Array(arr);
                    myresizedImage = (new Blob([ia], {type: "image/png"}));
                    readBlobAsDataURL(myresizedImage, function (dataurl) {
                        //console.log(dataurl);
                        cback(dataurl);
                    });
                }
            }

            return this;
        }
    //})(jQuery);
}(jQuery)));*/


;(function ($) {
    $.fn.xiaoBeiChat=function(option){
        var defaults = {
            xiaobeiPath: "",
            sessionId: "",
        }
        var chatWin;
        var chatQuerySocket;
        var options = $.extend(defaults, option);
        var chatUid;
        var me=this;

        $(this).bind("click", function () {
            if(!options.sessionId || options.sessionId==""){
                console.log("ERROR:sessionId = "+ options.sessionId);
                return false;
            }
            chatWin = window.open(options.xiaobeiPath + "?" + "sessionid=" + options.sessionId, 'xiaobei');
        })
        $(window).bind('beforeunload',function(){
            if(chatWin){
                chatWin.onbeforeunload = null;
                chatWin.close();
                chatWin = undefined;
            }
        });

        //chatQuerySocket = io.connect('ws://172.27.8.185:3010');
        //chatQuerySocket = io.connect('ws://h3crd-wlan1.chinacloudapp.cn:3010');
        chatQuerySocket = io.connect("https://lvzhourdchat.h3c.com",{secure:true});

        chatQuerySocket.on('connect', function(){
            console.log("connect_success");
            chatQuerySocket.emit('authentication', {chatid:options.sessionId,query:true}, function(a){
            });
        })
        chatQuerySocket.on('authenticated', function(info){
            console.log("authenticated_" + info);
            chatQuerySocket.emit("getselfinfo",{}, function(data){
                console.log("getselfinfo_"+JSON.stringify(data));
                chatUid = data["uid"];
                getSelfHeadImg();
            })
        })

        chatQuerySocket.on("queryNewMsg",function(data){
            console.log("queryNewMsg_"+JSON.stringify(data));
            $(me).trigger("newMsg", data["newMsg"]);
        })

        chatQuerySocket.on("photoChg",function(data){
            console.log("photoChg_"+JSON.stringify(data));
            if(data["result"]=="success"){
                if(chatUid == data["body"]["uid"]){
                    getSelfHeadImg(data);
                }
            }
        })

        function getSelfHeadImg(){
            chatQuerySocket.emit("userPhotoGet",{uid:chatUid},function(data){
                //console.log("userPhotoGet_"+JSON.stringify(data));
                if(data["result"]=="success" && data["body"]["photoid"] && data["body"]["image"]){
                    convertHeadImg(data["body"]["image"],function(img){
                        $(me).trigger("chatHeadImg", img);
                    })
                }else if(data["result"]=="failed") {
                    console.log("获取头像失败");
                }
            })
        }

        function readBlobAsDataURL(blob, callback) {
            var a = new FileReader();
            a.onload = function() {callback(a.result);};
            a.readAsDataURL(blob);
        }
        function convertHeadImg(img,cback) {
            var image = JSON.parse(img);
            //console.log(image);
            var arr = [];
            for (var i in image) {
                arr[i] = image[i];
            }
            if (arr.length > 0) {
                var ia = new Uint8Array(arr);
                myresizedImage = (new Blob([ia], {type: "image/png"}));
                readBlobAsDataURL(myresizedImage, function (dataurl) {
                    //console.log(dataurl);
                    cback(dataurl);
                });
            }
        }

        return this;
    }
})(jQuery);
