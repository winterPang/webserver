/**
 * Created by Administrator on 2015/11/14.
 */
//var selectedFriendName = new Array();
//var selectedFriends = [];
;(function ($) {
    var allFriends = [];
    var groupMember=[];

    function chatAddSessionInitData(){
        allFriends = [];
        for(var i in chatDbm["friendList"]){
            var name = chatDbm["friendList"][i]["name"];
            if(chatDbm["friendList"][i]["state"] == "ready" &&
                (name != "系统" &&  !isKefu(name))){
                allFriends.push({name:chatDbm["friendList"][i]["name"],uid:chatDbm["friendList"][i]["uid"]});
            }
        }
    }

    function chatAddSessionInitPage(){
        $("#chatAddSessionWaitSelectContent").children().remove();
        $("#chatAddSessionSelectedContent").children().remove();
        for(var i in allFriends){
            var waitSelectStr = prepareWaitSelectLinkString(allFriends[i]["name"], allFriends[i]["uid"]);
            $("#chatAddSessionWaitSelectContent").append(waitSelectStr);
        }
    }

    /*准备左侧待选标签*/
    function prepareWaitSelectLinkString(name, uid){
        var headImg=chatDbm["userHeadImg"][uid]?chatDbm["userHeadImg"][uid]["image"]:g_chatDefaultHeadImg;
        var tempDiv = $("<div></div>");
        var a = $("<a class='chatAddSessionWaitSelectLink list-group-item' uid='"+uid+"'></a>");
        var imgPortrait = $("<img class='img-circle chatAddSessionWaitSelectPortrait' src='"+headImg+"' headimg_uid='"+ uid +"'>");
        var pre = $("<pre  class='chatAddSessionWaitSelectName'></pre>");
        var imgCircle = $("<img class='chatAddSessionWaitSelectCircle' src='../image/check-off.png'>");

        pre.text(name);
        a.append(imgPortrait, pre, imgCircle);
        tempDiv.append(a);
        return tempDiv.html();
    }

    /*准备右侧已选标签*/
    function prepareSelectedLinkString(name, uid){
        var headImg=chatDbm["userHeadImg"][uid]?chatDbm["userHeadImg"][uid]["image"]:g_chatDefaultHeadImg;
        var tempDiv=$("<div></div>");
        var a = $("<a class='chatAddSessionSelectedLink list-group-item' uid='"+uid+"'></a>");
        var imgPortrait = $("<img class='img-circle chatAddSessionSelectedPortrait' src='"+headImg+"' headimg_uid='"+ uid +"'>");
        var pre = $("<pre  class='chatAddSessionSelectedName'></pre>");
        var imgCancel = $("<img class='chatAddSessionSelectedCancel' src='../image/close.png'>");

        pre.text(name);
        a.append(imgPortrait, pre, imgCancel);
        tempDiv.append(a);
        return tempDiv.html();
    }

    /*确定按钮的使能与去使能*/
    function toggleOkBtnActive(){
        if($("#chatAddSessionSelectedContent").children().length!=0){
            $("#chatAddSessionOkBtn").removeClass("disabled");
        }else{
            $("#chatAddSessionOkBtn").addClass("disabled");
        }
    }
    function toggleNoteInfo(){
        var len = $("#chatAddSessionSelectedContent").children().length;
        if(len == 0){
            if(opType == "add"){
                $("#chatAddSessionNoteElement").text("请选择要添加的联系人");
            }else if(opType =="del"){
                $("#chatAddSessionNoteElement").text("请选择要删除的组内成员");
            }

        }else{
            if(opType == "add"){
                $("#chatAddSessionNoteElement").text("已选择了"+len+"个联系人");
            }else if(opType =="del"){
                $("#chatAddSessionNoteElement").text("您将要把以下"+len+"个成员移出该群");
            }
        }
    }

    /*点击添加用户*/
    $(document).on("click", ".chatAddSessionWaitSelectLink", function (){
        var uid = $(this).attr("uid");
        var name = $(this).find("pre[class='chatAddSessionWaitSelectName']").text();

        $("#chatAddSessionWaitSelectContent").children("a.atv").removeClass("atv");
        $(this).addClass("atv");

        if($(this).hasClass("fixed")){
            return;
        }

        if ($(this).hasClass("ready")) {
            $("#chatAddSessionSelectedContent").find("a[uid='"+uid+"']").remove();
            $(this).removeClass("ready");
            $(this).find("img[class='chatAddSessionWaitSelectCircle']").attr("src","../image/check-off.png");
        }
        else{
            var selectedStr = prepareSelectedLinkString(name, uid);

            $("#chatAddSessionSelectedContent").append(selectedStr);

            $(this).find("img[class='chatAddSessionWaitSelectCircle']").attr("src","../image/check-on.png");

            $(this).addClass("ready");
        }
        toggleOkBtnActive();
        toggleNoteInfo();
    })

    /*点击取消该用户的按钮*/
    $(document).on("click", ".chatAddSessionSelectedCancel", function (){
        var uid = $(this).parent().attr("uid");
        $("#chatAddSessionWaitSelectContent").find("a[uid='"+uid+"']").removeClass("ready");
        $("#chatAddSessionWaitSelectContent").find("a[uid='"+uid+"']").find("img[class='chatAddSessionWaitSelectCircle']").attr("src","../image/check-off.png");
        $(this).parent().remove();
        toggleOkBtnActive();
        toggleNoteInfo();
    })

    function chatGroupAddUserInitData(sid){
        allFriends = [];
        groupMember=[];
        for(var i=0 in chatDbm["friendList"]){
            var name = chatDbm["friendList"][i]["name"];
            if(chatDbm["friendList"][i]["state"] == "ready" &&
                (name != "系统" && !isKefu(name))){
                allFriends.push({name:chatDbm["friendList"][i]["name"],uid:chatDbm["friendList"][i]["uid"]});
            }
        }

        for(var i=0 in chatDbm["groupList"]){
            if(chatDbm["groupList"][i]["sid"]==sid){
                groupMember =  chatDbm["groupList"][i]["members"];
            }
        }
    }
    function chatGroupDelUserInitData(sid){
        groupMember=[];
        for(var i=0 in chatDbm["groupList"]){
            if(chatDbm["groupList"][i]["sid"]==sid){
                for(var j in chatDbm["groupList"][i]["members"]){
                    if(chatDbm["groupList"][i]["members"][j]["uid"] != g_chatUid){
                        groupMember.push({uid:chatDbm["groupList"][i]["members"][j]["uid"], nickname:chatDbm["groupList"][i]["members"][j]["nickname"]})
                    }
                }
            }
        }
    }
    function chatGroupAddUserInitPage(){
        $("#chatAddSessionWaitSelectContent").children().remove();
        $("#chatAddSessionSelectedContent").children().remove();
        for(var i in allFriends){
            var waitSelectStr = prepareWaitSelectLinkString(allFriends[i]["name"], allFriends[i]["uid"]);
            $("#chatAddSessionWaitSelectContent").append(waitSelectStr);

        }
        $("#chatAddSessionWaitSelectContent a").each(function() {
            for(var j in groupMember){
                if($(this).attr("uid") == groupMember[j]["uid"]){
                    $(this).addClass("fixed");
                    $(this).find("img[class='chatAddSessionWaitSelectCircle']").attr("src","../image/check-on-fixed.png");
                }
            }
        })
    }

    function chatGroupDelUserInitPage(){
        $("#chatAddSessionWaitSelectContent").children().remove();
        $("#chatAddSessionSelectedContent").children().remove();
        for(var i in groupMember){
            var waitSelectStr = prepareWaitSelectLinkString(groupMember[i]["nickname"], groupMember[i]["uid"]);
            $("#chatAddSessionWaitSelectContent").append(waitSelectStr);
        }
    }
    function chatInitSearch(){
        $("#chatSearchFriend").val("");
        $('#chatSearchFriend').hideseek({
            list:"#chatAddSessionWaitSelectContent"
        })
    }

    $(document).on("click", "#chatAddDialogLink, #chatGroupListLableAddGroupLink", function (){
        opType = "add";
        chatAddSessionInitData();
        chatAddSessionInitPage();
        chatInitSearch();
        toggleOkBtnActive();
        toggleNoteInfo();
        $("#chatAddSessionOkBtn").attr("action","newgroup");
    })
    $(document).on("click", "#chatGroupAddUserLink", function (){
        var isGroupMember = false;
        var sid=$("#chatGroupAddUserLink").attr("sid");
        /*判断自己还是不是该组的成员如果不是直接返回*/
        for(var i in chatDbm["groupList"]){
            if(sid==chatDbm["groupList"][i]["sid"]){
                for(var j in chatDbm["groupList"][i]["members"]){
                    if(g_chatUid==chatDbm["groupList"][i]["members"][j]["uid"]){
                        isGroupMember = true;
                    }
                }
            }
        }
        if(!isGroupMember){
            blinkNote("抱歉，您已不再是该群成员，不能添加。");
            return false;
        }
        $('#chatAddSessionModal').modal('show')
        opType = "add";

        chatGroupAddUserInitData(sid);
        chatGroupAddUserInitPage();
        chatInitSearch();
        toggleOkBtnActive();
        toggleNoteInfo();
        $("#chatAddSessionOkBtn").attr("action","groupadduser");
        $("#chatAddSessionOkBtn").attr("sid",sid);
    })

    $(document).on("click", "#chatGroupDelUserLink", function(){
        opType = "del";
        var sid  = $("#chatGroupInfoContent").attr("sid");
        chatGroupDelUserInitData(sid);
        chatGroupDelUserInitPage();
        chatInitSearch();
        toggleOkBtnActive();
        toggleNoteInfo();
        $("#chatAddSessionOkBtn").attr("action","groupdeluser");
        $("#chatAddSessionOkBtn").attr("sid",sid);
    })

    function showNote(note){
        $("#chatTips p").text(note);
        $( "#chatTips" ).dialog( "open" );
        //$("#chatEnterNote").text(note).show();
    }
    function hideNote(){
        //$("#chatEnterNote").hide();
        $( "#chatTips" ).dialog( "close" );

    }
    function blinkNote(note){
        showNote(note);
        setTimeout(hideNote,1700);
    }
})(jQuery);