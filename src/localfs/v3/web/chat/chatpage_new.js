/**
 * Created by Administrator on 2015/11/18.
 */
//var g_chatUserName = "liuxiaolong";
//var g_chatUserName = "guoxuzhen";
//var g_chatUserName = "liuchao";
//var g_chatUserName = "wanghao";
//var g_chatUserName = "yuanlidi";
//var g_chatUserName = "fanxiaoyan";
//var g_chatUserName = "huadong";
//var g_chatUserName = "jixiaokai";
var g_chatUserName = "lxl";
var g_chatDefaultHeadImg = "../friendportrait/defaultheadimg.png";
var g_chatUid = "";
//var g_chatHeadImg =g_chatDefaultHeadImg;
var g_sessionId;
var chatDbm = new Object();
chatDbm["friendList"]=[];
chatDbm["groupList"]=[];
chatDbm["msgRecord"]=[];
chatDbm['userHeadImg']=[];
var socket = 0;
var kefu1 = "wangzhen";
var kefu2 = "xiaobei";

var kefu1_nickname = "客服：小振";
var kefu2_nickname = "客服：楠楠";
function isKefu(name){
    if(name == kefu1 || name == kefu2){
        return true;
    }else{
        return false;
    }
}
function isKefuNname(name){
    if(name == kefu1_nickname || name == kefu2_nickname){
        return true;
    }else{
        return false;
    }
}
function getKefuNname(name){
    if(name == kefu1){
        return kefu1_nickname;
    }else if(name == kefu2){
        return kefu2_nickname;
    }
}

;(function ($) {

    var chatfavicon;
    var chatRecoverMsgIndex;
    var chatFaviconCount = 0;

    $(document).ready(function () {

        init();

        /*点击会话链接*/
        $(document).on("click", "#chatDialogSumEntryLink", function (){
            $("#chatDialogIcon").css("background-position","711px 351px");//active
            $("#chatDialogLable").css("color","white");
            $("#chatFriendIcon").css("background-position","897px 412px")//normal
            $("#chatFriendLable").css("color","rgb(24, 146, 124)");

            $("#chatNavEntityDialogSumContent").show();
            $("#chatNavEntityFriendListContent").hide();
            $("#chatFriendInfoContent").hide();
            $("#chatSearchEntityContent").hide();
            $("#chatSearchInput").text();
            $("#chatNewFriendEntityContent").hide();
            $("#chatSearchInput").val("");
            $("#chatGroupInfoContent").hide();
            /*当没有会话链接被选中时，右侧框显示为欢迎页面*/
            if(0!=$("#chatNavEntityDialogSum .atv").length){
                $("#chatDialogContent").show();
                $("#chatWelcomeContent").hide();
            }else{
                $("#chatWelcomeContent").show();
                $("#chatDialogContent").hide();
            }
            $("#chatNavContent").children("a.atv").removeClass("atv");
            $(this).addClass("atv");
            chatDialogTurnToBottom();
            newMsgRedPointToggel();
        })

        /*点击好友链接*/
        $(document).on("click", "#chatFriendListEntryLink", function (){
            $("#chatFriendIcon").css("background-position","897px 351px")//active
            $("#chatFriendLable").css("color","white");
            $("#chatDialogLable").css("color","rgb(24, 146, 124)");
            $("#chatDialogIcon").css("background-position"," 711px 412px");//normal

            if($("#chatNavEntityFriendList .atv").attr("id")=="chatNewFriendEntryLink"){
                $("#chatNavEntityFriendListContent").hide();
                $("#chatNewFriendEntityContent").show();
            }else{
                $("#chatNavEntityFriendListContent").show();
            }
            $("#chatNavEntityDialogSumContent").hide();
            $("#chatDialogContent").hide();
            $("#chatSearchEntityContent").hide();
            $("#chatSearchInput").text();
            $("#chatFriendRedPoint").hide();
            $("#chatSearchInput").val("");
            /*当没有会话链接被选中时，右侧框显示为欢迎页面*/
            if(0!=$("#chatNavEntityFriendList .atv").length){
                if($("#chatNavEntityFriendList .atv").attr("id")=="chatNewFriendEntryLink"){
                    /*此处先不考虑新朋友的详细信息页面,用欢迎页面代替*/
                    $("#chatFriendInfoContent").hide();
                    $("#chatGroupInfoContent").hide();
                    $("#chatWelcomeContent").show();
                }else if($("#chatNavEntityFriendList .atv").attr("dialogType")=="couple"){
                    $("#chatWelcomeContent").hide();
                    $("#chatFriendInfoContent").show();
                    $("#chatGroupInfoContent").hide();
                }else{
                    $("#chatWelcomeContent").hide();
                    $("#chatFriendInfoContent").hide();
                    $("#chatGroupInfoContent").show();
                }
            }else{
                $("#chatWelcomeContent").show();
                $("#chatFriendInfoContent").hide();
                $("#chatGroupInfoContent").hide();
            }
            $("#chatNavContent").children("a.atv").removeClass("atv");
            $(this).addClass("atv");
        })

        function createNewGroup(){
            var friendUid = new Array();

            /*找出已选用户的UID*/
            $("#chatAddSessionSelectedContent a").each(function(){
                var uid = $(this).attr("uid");
                var name = $(this).find("pre[class='chatAddSessionSelectedName']").text();
                friendUid.push(uid);
            })
            if(friendUid.length == 1){
                for(var i in chatDbm["friendList"]){
                    if(chatDbm["friendList"][i]["uid"] == friendUid[0]){
                        var sid=chatDbm["friendList"][i]["sid"];
                        var uid=chatDbm["friendList"][i]["uid"];
                        var title=chatDbm["friendList"][i]["name"];
                        if(sid){//如果缩略会话中存在该用户
                            if(0==$("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").length){
                                var sumDialogStr = createDialogCoupleSumString(sid, title,uid);
                                $("#chatNavEntityDialogSum").prepend(sumDialogStr);
                            }
                            $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").trigger("click");
                            $("#chatDialogSumEntryLink").trigger("click");
                        }
                    }
                }
            }else{
                socket.emit("groupCreate",{title:escape("群聊"), members:friendUid}, function(data){
                    console.log("groupCreate_"+JSON.stringify(data));
                    if(data["result"] == "success"){
                        /*保存群列表*/
                        chatDbm["groupList"].push(data["body"]);

                        /*创建群列表*/
                        var sid=data["body"]["sid"];
                        var title=unescape(data["body"]["title"]);
                        var date = data["body"]["date"];

                        var groupListStr = createGroupListString(sid, title);
                        $("#chatFriendListGroupContent").append(groupListStr);

                        /*创建群缩略会话*/
                        var sumDialogStr = createDialogMutipleSumString(sid, title);
                        $("#chatNavEntityDialogSum").prepend(sumDialogStr);
                        var sureMember = [];
                        for(var i in data["body"]["members"]) {
                            if (data["body"]["members"][i]["uid"] != g_chatUid) {
                                sureMember.push(data["body"]["members"][i]["nickname"]);
                            }
                        }
                        var msg = "您将 "+sureMember.toString()+" 加入了群聊。";
                        updataDialogSum(sid, undefined, undefined,date,"系统："+msg);
                        chatSaveSystemMsg("system",sid,msg,date,false);

                        $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").trigger("click");
                        $("#chatDialogSumEntryLink").trigger("click");

                        groupNoteLableToggle();
                        updataGroupHeadImgForOneGroup(sid);
                    }
                });
            }
        }
        function groupAddUserOwnerProc(sid, friendInfo,date){
            var title = "";
            var friendName = new Array();
            /*更新数据结构*/
            for(var i in chatDbm["groupList"]){
                if(sid == chatDbm["groupList"][i]["sid"]){
                    for(var j in friendInfo){
                        chatDbm["groupList"][i]["members"].push(friendInfo[j]);
                        friendName.push(friendInfo[j]["nickname"]);
                    }
                    title = chatDbm["groupList"][i]["title"];
                    break;
                }
            }

            /*更新组成员列表页面*/
            if($("#chatGroupInfoContent").attr("sid")==sid){
                for(var i in friendInfo){
                    var friendStr = createGroupMenberString(friendInfo[i]["nickname"], friendInfo[i]["uid"])
                    $("#chatGroupInfoMenbersContent").append(friendStr);
                }
            }

            var msg = "您将 "+friendName.toString()+" 加入了该群";
            chatSaveSystemMsg("system",sid,msg,date,true);
            /*创建提示信息*/
            if(0==$("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").length){
                var groupSumStr = createDialogMutipleSumString(sid, title);
                $("#chatNavEntityDialogSum").prepend(groupSumStr);
            }else{
                if($("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").hasClass("atv")){
                    setMsgDate(date);
                    var systemMsgStr = createSystemInfoString(msg);
                    $("#chatDialogEntityContentAuto").append(systemMsgStr);
                    chatDialogTurnToBottom();
                }
                sortDialogSumLink(sid);
            }
            updataDialogSum(sid ,undefined, undefined, date, "系统: "+msg);

            $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").trigger("click");

            $("#chatDialogSumEntryLink").trigger("click");

            /*更新组头像*/
            updataGroupHeadImgForOneGroup(sid);
        }
        function groupAddUserMenberProc(actor, sid, members,date){
            var title = "";

            var actorName = "";
            /*更新数据结构*/
            for(var i in chatDbm["groupList"]){
                if(sid == chatDbm["groupList"][i]["sid"]){
                    for(var j in members){
                        chatDbm["groupList"][i]["members"].push(members[j]);

                    }
                    title = chatDbm["groupList"][i]["title"];
                    break;
                }
            }

            /*更新组成员列表页面*/
            if($("#chatGroupInfoContent").attr("sid")==sid){
                for(var i in members){
                    var friendStr = createGroupMenberString(members[i]["nickname"], members[i]["uid"])
                    $("#chatGroupInfoMenbersContent").append(friendStr);
                }
            }
            /*查找ACTOR的名字*/
            for(var i in chatDbm["groupList"]){
                if (sid == chatDbm["groupList"][i]["sid"]){
                    for(var j in chatDbm["groupList"][i]["members"]){
                        if(actor == chatDbm["groupList"][i]["members"][j]["uid"]){
                            actorName = chatDbm["groupList"][i]["members"][j]["nickname"];
                            break;
                        }
                    }
                }
                if(actorName != ""){
                    break;
                }
            }
            var membersName = [];
            for(var i in members){
                membersName.push(members[i]["nickname"]);
            }
            var msg = actorName+" 将 "+membersName.toString()+" 加入了该群";
            chatSaveSystemMsg("system",sid,msg,date,true);
            if(0==$("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").length){
                var groupSumStr = createDialogMutipleSumString(sid, title);
                $("#chatNavEntityDialogSum").prepend(groupSumStr);
            }else{
                if($("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").hasClass("atv")){
                    setMsgDate(date);
                    var systemMsgStr = createSystemInfoString(msg);
                    $("#chatDialogEntityContentAuto").append(systemMsgStr);
                    chatDialogTurnToBottom();
                }
                sortDialogSumLink(sid);
            }
            updataDialogSum(sid ,undefined, undefined, date, "系统: "+msg);

            /*获取新人的头像*/
            for(var i in members){
                var uid = members[i]["uid"];
                if(!chatDbm["userHeadImg"][uid]){
                    chatDbm["userHeadImg"][uid]={photoid:"",image:g_chatDefaultHeadImg};
                    (function (uid){
                        socket.emit("userPhotoGet",{uid:uid},function(data){
                            if(data["result"]=="success" && data["body"]["photoid"] && data["body"]["image"]){
                                convertHeadImg(data["body"]["image"],function(img){
                                    var pid=data["body"]["photoid"];

                                    chatDbm["userHeadImg"][uid]={photoid:pid,image:img};

                                    /*更新个人头像*/
                                    updateHeadImgForOneUser(uid);

                                    /*更新群列表中的头像和群缩略页面中的头像*/
                                    updateGroupHeadImgForOneUid(uid);
                                })
                            }else if(data["result"]=="failed") {
                                alert("获取好友头像失败,UID="+uid + " 原因:"+JSON.stringify(data))
                            }
                        })
                    })(uid);
                }
            }
            /*更新头像*/
            updataGroupHeadImgForOneGroup(sid);
        }

        /*处理组添加自己*/
        function groupAddUserNewUserProc(actor, sid, members,date,groupinfo){
            var title = "";
            var friendName;
            var actorName = "";
            groupinfo["title"] = unescape(groupinfo["title"]);
            var title =groupinfo["title"];

            /*删除可能存在的残留数据*/
            for(var i in chatDbm["groupList"]){
                if(sid== chatDbm["groupList"][i]["sid"]){
                    chatDbm["groupList"].splice(i, 1);
                }
            }
            /*更新数据结构*/
            groupinfo["sid"] = sid;
            chatDbm["groupList"].push(groupinfo);

            /*查找ACTOR的名字*/
            for(var i in chatDbm["groupList"]){
                if (sid == chatDbm["groupList"][i]["sid"]){
                    for(var j in chatDbm["groupList"][i]["members"]){
                        if(actor == chatDbm["groupList"][i]["members"][j]["uid"]){
                            actorName = chatDbm["groupList"][i]["members"][j]["nickname"];
                            break;
                        }
                    }
                }
                if(actorName != ""){
                    break;
                }
            }

            var msg = actorName+" 将您加入了该群";
            chatSaveSystemMsg("system",sid,msg,date,false);
            /*此时该用户可能是被删除然后又被添加的，如果他的页面正好是组列表页面*/
            if(0!=$("#chatFriendListGroupContent").find("a[sid='"+sid+"']").length){
                if($("#chatFriendListGroupContent").find("a[sid='"+sid+"']").hasClass("atv")){
                    $("#chatGroupInfoMenbersContent").children().remove();
                    /*显示组成员*/
                    var groupMenberString;
                    for(var i=0 in chatDbm["groupList"]){
                        if(sid==chatDbm["groupList"][i]["sid"]){
                            /*显示加号*/
                            groupMenberString = createGroupAddUserString(sid);
                            $("#chatGroupInfoMenbersContent").append(groupMenberString);

                            /*显示减号*/
                            if( chatDbm["groupList"][i]["owner"] == g_chatUid){
                                groupMenberString = createGroupDelUserString(sid);
                                $("#chatGroupInfoMenbersContent").append(groupMenberString);
                            }

                            /*显示成员*/
                            var thisGroupMembers;
                            var ownerNickname;
                            thisGroupMembers =  chatDbm["groupList"][i]["members"].concat();
                            for(var j in thisGroupMembers){
                                if(thisGroupMembers[j]["uid"] == chatDbm["groupList"][i]["owner"]){
                                    ownerNickname = thisGroupMembers[j]["nickname"];
                                    /*将群主摘除*/
                                    thisGroupMembers.splice(j,1);
                                }
                            }

                            /*显示OWNER*/
                            var groupOwnerString = createGroupOwnerString(ownerNickname, chatDbm["groupList"][i]["owner"]);

                            $("#chatGroupInfoMenbersContent").append(groupOwnerString);

                            for(var k in thisGroupMembers){
                                groupMenberString = createGroupMenberString(thisGroupMembers[k]["nickname"], thisGroupMembers[k]["uid"]);
                                $("#chatGroupInfoMenbersContent").append(groupMenberString);
                            }
                            break;
                        }
                    }
                }
            } else{
                /*添加组列表页面*/
                var groupListStr = createGroupListString(sid, title);
                $("#chatFriendListGroupContent").append(groupListStr);
            }

            /*此时该用户可能是被删除然后又被添加的，如果他的页面正好是该SID会话页面*/
            if(0 !=$("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").length){
                if($("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").hasClass("atv")){
                    updataDialogSum(sid ,undefined, undefined, date, "系统: "+msg);
                    setMsgDate(date);
                    var systemMsgStr = createSystemInfoString(msg);
                    $("#chatDialogEntityContentAuto").append(systemMsgStr);
                    chatDialogTurnToBottom();
                }else{
                    var count;
                    var sumContentStr = $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").find("pre[class='chatDialogSumCount']").text();
                    if(sumContentStr == ""){
                        count = 1;
                    }else{
                        count = parseInt(sumContentStr.match(/\d+/g)[0]) +1;
                    }
                    updataDialogSum(sid ,undefined, count, date, "系统: "+msg);
                }
            }else{
                /*添加组缩略页面*/
                var groupDialogSumStr = createDialogMutipleSumString(sid, title);
                $("#chatNavEntityDialogSum").prepend(groupDialogSumStr);

                updataDialogSum(sid ,undefined, 1, date, "系统: "+msg);
            }
            /*声音*/
            /*小红点*/
            newMsgRedPointToggel();
            titleBadgeToggel();
            chatNewMsgSoundPlay();

            /*获取新人的头像*/
            for(var i in members){
                var uid = members[i]["uid"];
                if(!chatDbm["userHeadImg"][uid]){
                    chatDbm["userHeadImg"][uid]={photoid:"",image:g_chatDefaultHeadImg};
                    (function (uid){
                        socket.emit("userPhotoGet",{uid:uid},function(data){
                            if(data["result"]=="success" && data["body"]["photoid"] && data["body"]["image"]){
                                convertHeadImg(data["body"]["image"],function(img){
                                    var pid=data["body"]["photoid"];

                                    chatDbm["userHeadImg"][uid]={photoid:pid,image:img};

                                    /*更新个人头像*/
                                    updateHeadImgForOneUser(uid);

                                    /*更新群列表中的头像和群缩略页面中的头像*/
                                    updateGroupHeadImgForOneUid(uid);
                                })
                            }else if(data["result"]=="failed") {
                                alert("获取好友头像失败,UID="+uid + " 原因:"+JSON.stringify(data))
                            }
                        })
                    })(uid);
                }
            }
            /*更新头像*/
            updataGroupHeadImgForOneGroup(sid);
        }

        function groupAddUser(sid){
            var friendUid = new Array();
            var friendName = new Array();
            var friendInfo = [];

            /*找出已选用户的UID*/
            $("#chatAddSessionSelectedContent a").each(function(){
                var uid = $(this).attr("uid");
                var name = $(this).find("pre[class='chatAddSessionSelectedName']").text();
                friendUid.push(uid);
                friendInfo.push({uid:uid,nickname:name});
                friendName.push(name);
            })

            socket.emit("groupAddUser",{sid:sid, members:friendInfo}, function(data){
                console.log("groupAddUser_"+JSON.stringify(data));
                if(data["result"] != "success"){
                    alert("添加成员失败");
                    return;
                }
                var date = data["body"]["date"];
                groupAddUserOwnerProc(sid, friendInfo,date);
            })
        }
        function groupDelUser(sid){

            var friendUid = new Array();
            var friendInfo = [];

            /*找出已选用户的UID*/
            $("#chatAddSessionSelectedContent a").each(function(){
                var uid = $(this).attr("uid");
                var name = $(this).find("pre[class='chatAddSessionSelectedName']").text();
                friendUid.push(uid);
                friendInfo.push({uid:uid,nickname:name});
            })
            socket.emit("groupDelUser",{sid:sid, members:friendInfo}, function(data){
                console.log("groupDelUser_"+JSON.stringify(data));
                if(data["result"] != "success"){
                    alert("删除成员失败");
                    return;
                }
                var date = data["body"]["date"];
                groupDelUserOwnerProc(sid, friendInfo, date);
            })
        }
        function groupDelUserOwnerProc(sid ,members, date){
            var title="";
            /*更新数据结构*/
            for(var i in chatDbm["groupList"]){
                if(sid == chatDbm["groupList"][i]["sid"]){
                    title = chatDbm["groupList"][i]["title"];
                    for(var j in members){
                        for(var k in chatDbm["groupList"][i]["members"]){
                            if(chatDbm["groupList"][i]["members"][k]["uid"] == members[j]["uid"]){
                                chatDbm["groupList"][i]["members"].splice(k,1);
                            }
                        }
                    }
                }
            }

            /*更新组成员*/
            if($("#chatGroupInfoContent").attr("sid")==sid){
                for(var i in members){
                    $("#chatGroupInfoMenbersContent").find("a[uid='"+members[i].uid+"']").remove();
                }
            }

            /*设置提示信息*/
            var membersName = [];
            for(var i in members){
                membersName.push(members[i]["nickname"]);
            }
            var msg = "您将 "+membersName.toString()+" 移出了该群";
            chatSaveSystemMsg("system",sid,msg,date,false);

            if(0==$("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").length){
                var groupSumStr = createDialogMutipleSumString(sid, title);
                $("#chatNavEntityDialogSum").prepend(groupSumStr);
            }else{
                if($("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").hasClass("atv")){
                    setMsgDate(date);
                    var systemMsgStr = createSystemInfoString(msg);
                    $("#chatDialogEntityContentAuto").append(systemMsgStr);
                    chatDialogTurnToBottom();
                }
                sortDialogSumLink(sid);
            }
            updataDialogSum(sid ,undefined, undefined, date, "系统: "+msg);

            /*更新组头像*/
            updataGroupHeadImgForOneGroup(sid);
        }

        function groupDelUserTargetProc(sid, members, date) {
            var title="";
            /*更改数据结构*/
            for (var i in chatDbm["groupList"]) {
                if (sid == chatDbm["groupList"][i]["sid"]) {
                    title = chatDbm["groupList"][i]["title"];
                    for (var j in chatDbm["groupList"][i]["members"]) {
                        if (chatDbm["groupList"][i]["members"][j]["uid"] == g_chatUid) {
                            chatDbm["groupList"][i]["members"].splice(j, 1);
                        }
                    }
                }
            }
            /*更改群MEMBER信息*/
            if ($("#chatGroupInfoContent").attr("sid") == sid) {
                for (var i in members) {
                    $("#chatGroupInfoMenbersContent").find("a[uid='" + members[i].sid + "']").remove();
                }
            }

            /*设置提示信息*/
            var msg = "群主已将您从该群移出";
            chatSaveSystemMsg("system",sid,msg,date,false);
            if (0 == $("#chatNavEntityDialogSum").find("a[sid='" + sid + "']").length) {
                var groupSumStr = createDialogMutipleSumString(sid, title);
                $("#chatNavEntityDialogSum").prepend(groupSumStr);

                updataDialogSum(sid, undefined, 1, date, "系统: " + msg);
            } else {
                if ($("#chatNavEntityDialogSum").find("a[sid='" + sid + "']").hasClass("atv")) {
                    setMsgDate(date);
                    var systemMsgStr = createSystemInfoString(msg);
                    $("#chatDialogEntityContentAuto").append(systemMsgStr);
                    chatDialogTurnToBottom();
                    updataDialogSum(sid, undefined, undefined, date, "系统: " + msg);
                }else{
                    var count;
                    var sumContentStr = $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").find("pre[class='chatDialogSumCount']").text();
                    if(sumContentStr == ""){
                        count = 1;
                    }else{
                        count = parseInt(sumContentStr.match(/\d+/g)[0]) +1;
                    }
                    updataDialogSum(sid, undefined, count, date, "系统: " + msg);
                }

                sortDialogSumLink(sid);
            }

            if ($("#chatFriendListGroupContent").find("a[sid='" + sid + "']").length) {
                if ($("#chatFriendListGroupContent").find("a[sid='" + sid + "']").hasClass("atv")){
                    $("#chatGroupInfoMenbersContent").find("a[uid='"+g_chatUid+"']").remove();
                }
             }


            /*声音及小红点*/
            titleBadgeToggel();
            chatNewMsgSoundPlay();
            newMsgRedPointToggel();

            /*更新组头像*/
            updataGroupHeadImgForOneGroup(sid);
        }

        function groupDelUserMemberProc(sid ,members, date){
            var title="";
            /*更改数据结构*/
            for(var i in chatDbm["groupList"]){
                if(sid == chatDbm["groupList"][i]["sid"]){
                    title = chatDbm["groupList"][i]["title"];
                    for(var j in members){
                        for(var k in chatDbm["groupList"][i]["members"]){
                            if(chatDbm["groupList"][i]["members"][k]["uid"] == members[j]["uid"]){
                                chatDbm["groupList"][i]["members"].splice(k,1);
                            }
                        }
                    }
                }
            }
            /*更新组成员*/
            if($("#chatGroupInfoContent").attr("sid")==sid){
                for(var i in members){
                    $("#chatGroupInfoMenbersContent").find("a[uid='"+members[i].uid+"']").remove();
                }
            }

            /*设置提示信息*/
            var membersName = [];
            for(var i in members){
                membersName.push(members[i]["nickname"]);
            }
            var msg = "群主将 "+membersName.toString()+" 移出了该群";
            chatSaveSystemMsg("system",sid,msg,date,false);

            if(0==$("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").length){
                var groupSumStr = createDialogMutipleSumString(sid, title);
                $("#chatNavEntityDialogSum").prepend(groupSumStr);
            }else{
                if($("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").hasClass("atv")){
                    setMsgDate(date);
                    var systemMsgStr = createSystemInfoString(msg);
                    $("#chatDialogEntityContentAuto").append(systemMsgStr);
                    chatDialogTurnToBottom();
                }
                sortDialogSumLink(sid);
            }
            updataDialogSum(sid ,undefined, undefined, date, "系统: "+msg);

            /*更新组头像*/
            updataGroupHeadImgForOneGroup(sid);
        }

        /* 点击模态框确定按钮 */
        $(document).on("click", "#chatAddSessionOkBtn", function (){
            var action = $("#chatAddSessionOkBtn").attr("action");
            var sid=$("#chatAddSessionOkBtn").attr("sid");
            if(action =="newgroup"){
                createNewGroup();
            }
            if(action == "groupadduser"){
                groupAddUser(sid);
            }
            if(action == "groupdeluser"){
                groupDelUser(sid);
            }
        });

        /*点击上传头像确定按钮*/
        $('#chatSettingBtnOk').click(function(){
            if(0 != g_ia) {
                socket.emit('userPhotoSet', {image: JSON.stringify(g_ia)}, function (aa) {
                    if (aa.result == "success") {
                        g_ia=0;
                        $("#chatSettingPortraintContent").hide();
                        $("#chatSettingHeadImgToolsChoise").val("");

                        //获取本地用户上传的头像
                        socket.emit('userPhotoGet', {uid:g_chatUid, name:g_chatUserName}, function(info){
                            if(info.result == "success"){
                                convertHeadImg(info.body.image,function(dataurl){
                                    chatDbm['userHeadImg'][g_chatUid]={photoid:info["body"]["potoid"],image:dataurl};
                                    updateHeadImgForOneUser(g_chatUid);
                                    updateGroupHeadImgForOneUid(g_chatUid);
                                    var image = document.getElementById('chatLocalBigHeadimg');
                                    chatfavicon.image(image);
                                })
                            }
                        });
                    }
                });
            }
        });

        /*单击缩略页面的连接*/
        $(document).on("click", ".chatDialogSumLink", function () {
            $("#chatInputTextarea").focus();
            if ($(this).hasClass("atv")) {
                return;
            }
            procDraft(this);
            var sid= $(this).attr("sid");
            var type=$(this).attr("dialogType");
            var title =$(this).find("pre[class=chatDialogSumTitle]").text();

            /*将该标签置为atv*/
            $("#chatNavEntityDialogSum").children("a.atv").removeClass("atv");
            $(this).addClass("atv");

            /*设置对话框属性*/
            $("#chatDialogContent").attr("sid",sid);
            $("#chatDialogContent").attr("dialogType",type);

            /*设置对话框的TITLE*/
            $("#chatDialogTitle").text(title);

            $("#chatWelcomeContent").hide();
            $("#chatDialogContent").show();

            /*恢复聊天对话记录*/
            $("#chatDialogEntityContentAuto").children().remove();
            recoverMsgRecord(sid,type);

            chatDialogTurnToBottom();

            /*将COUNT置为0*/
            updataDialogSum(sid,undefined,0, undefined,undefined);

            newMsgRedPointToggel();
            titleBadgeToggel();
        })

        /*单击好友列表的连接*/
        $(document).on("click", ".chatFriendListLink", function () {
            if ($(this).hasClass("atv")) {
                return;
            }
            var sid=$(this).attr("sid");
            var type=$(this).attr("dialogType");
            var name = $(this).find(".chatFriendListName").text();

            var uid=$(this).attr("uid");

            /*将该标签置为atv*/
            $("#chatNavEntityFriendList").find(".atv").removeClass("atv");
            $(this).addClass("atv");

            $("#chatWelcomeContent").hide();

            $("#chatGroupInfoContent").hide();
            $("#chatFriendInfoContent").show();

            /*设置好友INFO框属性里边BTN的属性*/
            $("#chatFriendInfoContent").attr("sid", sid);
            $("#chatFriendInfoContent").attr("dialogType", type);
            $("#chatFriendInfoContent").attr("userName", name);
            $("#chatFriendInfoContent").attr("uid", uid);

            if(name == "系统" || isKefuNname(name)){
                $("#chatFriendInfoBtnDelFreind").addClass("disabled");
            }else{
                $("#chatFriendInfoBtnDelFreind").removeClass("disabled");
            }

            $("#chatFriendInfoPortrait").attr("src",chatDbm["userHeadImg"][uid]["image"]);

            //if(isKefu(name)){
            //    name = getKefuNname(name)
            //}

            $("#chatFriendInfoName").text(name);
            //$("#chatFriendInfoSum").text("个人信息：xxxxxxxxxxxxxxxxxx");
        })

        /*单击组列表的连接*/
        $(document).on("click", ".chatGroupListLink", function () {
            if ($(this).hasClass("atv")) {
                return;
            }
            var sid = $(this).attr("sid");
            var title;
            var ownerid;
            /*查找组TITLE*/
            for(var i in chatDbm["groupList"]){
                if(sid==chatDbm["groupList"][i]["sid"]){
                    title = chatDbm["groupList"][i]["title"];
                    ownerid = chatDbm["groupList"][i]["owner"]
                    break;
                }
            }

            /*将该标签置为atv*/
            $("#chatNavEntityFriendList").find(".atv").removeClass("atv");
            $(this).addClass("atv");
            $("#chatWelcomeContent").hide();
            $("#chatFriendInfoContent").hide();
            $("#chatGroupInfoContent").show();

            /*设置GROUP框的属性*/
            $("#chatGroupInfoContent").attr("sid", sid);

            /*显示TITLE*/
            $("#chatGroupInfoTitle").text(unescape(title));


            /*设置谁可以编辑群名*/
            if(g_chatUid == ownerid){
                //$("#chatEditTitleLink").show();
                $("#chatGroupInfoTitle").addClass("chatChangTitleBtn");
            }else{
                //$("#chatEditTitleLink").hide();
                $("#chatGroupInfoTitle").removeClass("chatChangTitleBtn");
            }

            $("#chatGroupInfoMenbersContent").children().remove();
            /*显示组成员*/
            var groupMenberString;
            for(var i=0 in chatDbm["groupList"]){
                if(sid==chatDbm["groupList"][i]["sid"]){
                    /*显示加号*/
                    groupMenberString = createGroupAddUserString(sid);
                    $("#chatGroupInfoMenbersContent").append(groupMenberString);

                    /*显示减号*/
                    if( chatDbm["groupList"][i]["owner"] == g_chatUid){
                        groupMenberString = createGroupDelUserString(sid);
                        $("#chatGroupInfoMenbersContent").append(groupMenberString);
                    }

                    /*显示成员*/
                    var thisGroupMembers;
                    var ownerNickname;
                    thisGroupMembers =  chatDbm["groupList"][i]["members"].concat();
                    for(var j in thisGroupMembers){
                        if(thisGroupMembers[j]["uid"] == chatDbm["groupList"][i]["owner"]){
                            ownerNickname = thisGroupMembers[j]["nickname"];
                            /*将群主摘除*/
                            thisGroupMembers.splice(j,1);
                        }
                    }

                    /*显示OWNER*/
                    var groupOwnerString = createGroupOwnerString(ownerNickname, chatDbm["groupList"][i]["owner"]);

                    $("#chatGroupInfoMenbersContent").append(groupOwnerString);

                    for(var k in thisGroupMembers){
                        groupMenberString = createGroupMenberString(thisGroupMembers[k]["nickname"], thisGroupMembers[k]["uid"]);
                        $("#chatGroupInfoMenbersContent").append(groupMenberString);
                    }
                    break;
                }
            }
        })

        /*点击会话页面TITLE上的链接*/
        $(document).on("click","#chatDialogTitleLink",function(){
            var dialogType = $("#chatDialogContent").attr("dialogtype");
            if(dialogType == "mutiple"){
                $('#collapseOne').collapse('show');
            }else{
                var title = $("#chatDialogTitle").text();
                if(isKefuNname(title)){
                    $('#collapseTwo').collapse('show');
                }else{
                    $('#collapseThr').collapse('show');
                }
            }
            var sid = $("#chatDialogContent").attr("sid");
            $("#chatNavEntityFriendList").find("a[sid='"+sid+"']").trigger("click");
            $("#chatFriendListEntryLink").trigger("click");
            window.setTimeout(function(){
                $("#chatNavEntityFriendList").find("a[sid='"+sid+"']")[0].scrollIntoView();
            },500)
        })

        function coupleDialogCreate(){
            var sid=$("#chatFriendInfoContent").attr("sid");
            var uid;
            //sid="123456"
            /*如果缩略会话中没有与之的对话，那么添加缩略会话*/
            if(0==$("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").length){
                /*获取TITLE 也就是对方的名字*/
                for(var i in chatDbm["friendList"]){
                    if(sid== chatDbm["friendList"][i]["sid"]){
                        var title=chatDbm["friendList"][i]["name"];
                        uid=chatDbm["friendList"][i]["uid"]
                        break;
                    }
                }
                var sumDialogStr = createDialogCoupleSumString(sid, title,uid);
                $("#chatNavEntityDialogSum").prepend(sumDialogStr);
            }
            /*模拟点击缩略会话的链接*/
            $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").trigger("click");

            /*模拟点击会话按钮*/
            $("#chatDialogSumEntryLink").trigger("click");

            $("#chatInputTextarea").focus();

            $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']")[0].scrollIntoView();
        }

        /*点击跟他聊聊按钮*/
        $(document).on("click", "#chatFriendInfoBtnCreateDialog", function(){
            coupleDialogCreate();
        })

        /*双击好友列表*/
        $(document).on("dblclick ", ".chatFriendListLink",function(){
            coupleDialogCreate();
        })

        /*双击组列表*/
        $(document).on("dblclick ", ".chatGroupListLink",function(){
            mutipleDialogCreate();
        })

        function mutipleDialogCreate(){
            var sid =$("#chatGroupInfoContent").attr("sid");
            if(0==$("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").length){
                for(var i in chatDbm["groupList"]){
                    if(chatDbm["groupList"][i]["sid"] == sid){
                        var title = unescape(chatDbm["groupList"][i]["title"]);
                        break;
                    }
                }
                var sumDialogStr = createDialogMutipleSumString(sid, title);
                $("#chatNavEntityDialogSum").prepend(sumDialogStr);
            }
            /*模拟点击缩略会话的链接*/
            $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").trigger("click");

            /*模拟点击会话按钮*/
            $("#chatDialogSumEntryLink").trigger("click");

            $("#chatInputTextarea").focus();

            $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']")[0].scrollIntoView();

            updataGroupHeadImgForOneGroup(sid);
        }

        /*点击群INFO中的“进入聊天”按钮*/
        $(document).on("click","#chatGroupInfoBtnCreateDialog", function(){
            mutipleDialogCreate();
        })

        /*点击删除好友*/
        $(document).on("click","#chatFriendInfoBtnDelFreind", function(){
            $("#chatDelFriendConfirm p").text("确定要删除该好友吗？");
            $("#chatDelFriendConfirm").dialog("open");
        })

        /*点击删除好友取消按钮*/
        $(document).on("click","#chatDelFriendCancel",function(){
            $("#chatDelFriendConfirm").dialog("close");
        })

        /*点击删除好友确认按钮*/
        $(document).on("click","#chatDelFriendOk",function(){
            var uid=$("#chatFriendInfoContent").attr("uid");
            var type= $("#chatFriendInfoContent").attr("dialogType");
            var name=$("#chatFriendInfoContent").attr("userName");
            var sid = "";
            for(var i in chatDbm["friendList"]){
                if(uid==chatDbm["friendList"][i]["uid"]){
                    sid = chatDbm["friendList"][i]["sid"];
                }
            }
            socket.emit("friendDel", {fname:escape(name),uid:escape(uid),sid:sid}, function(data){
                console.log("friendDel_"+JSON.stringify(data));
                if(data["result"] ==  "success"){

                    /*将他从好友列表数据中移除*/
                    for(var j in chatDbm["friendList"]){
                        if(uid==chatDbm["friendList"][j]["uid"]){
                            //chatDbm["friendList"].splice(j,1);
                            chatDbm["friendList"][j]["state"] = "deleted";
                        }
                    }

                    /*将我和他的聊天记录清除*/
                    chatDbm["msgRecord"][sid]="";

                    /*将他的缩略会话删除*/
                    $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").remove();

                    /*将他的好友列表删除*/
                    $("#chatNavEntityFriendList").find("a[uid='"+uid+"']").remove();

                    $("#chatFriendInfoContent").hide();
                    $("#chatWelcomeContent").show();
                    chatFriendNameSort();
                }
            })
            $("#chatDelFriendConfirm").dialog("close");
        })

        /*点击退出该群按钮*/
        $(document).on("click","#chatGroupInfoBtnLeaveGroup", function(){
            $("#chatGroupLeaveConfirm p").text("确定要离开该群吗？");
            $("#chatGroupLeaveConfirm").dialog("open");
        })

        /*点击退出群取消按钮*/
        $(document).on("click","#chatGroupLeaveCancel",function(){
            $("#chatGroupLeaveConfirm").dialog("close");
        })

        /*点击退出群确认按钮*/
        $(document).on("click","#chatGroupLeaveOk",function(){
            var sid = $("#chatGroupInfoContent").attr("sid");
            socket.emit("groupLeave",{sid:sid},function(data){
                console.log("groupLeave_"+JSON.stringify(data));
                if(data["result"] == "success"){
                    for(var i in chatDbm["groupList"]){
                        if(sid == chatDbm["groupList"][i]["sid"]){
                            chatDbm["groupList"].splice(i,1);
                        }
                    }
                    /*将他的缩略会话删除*/
                    $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").remove();

                    /*将他从好友列表删除*/
                    $("#chatNavEntityFriendList").find("a[sid='"+sid+"']").remove();

                    $("#chatGroupInfoContent").hide();
                    $("#chatWelcomeContent").show();

                    groupNoteLableToggle();

                }
            })
            $("#chatGroupLeaveConfirm").dialog("close");
        })
        /*搜索框响应回车按键*/
        $(document).on("keydown", "#chatSearchInput", function (e){
            //if(window.event.keyCode == 13){
            if(e.keyCode==13){
                $("#chatSearchBtn").trigger("click");
                return false;
            }
        });

        isShiftEnter = false;
        /*输入框响应回车函数*/
        $("#chatInputTextarea").keydown(function (e){
            if(e.keyCode==16){
                isShiftEnter = true;
            }
            //if((!window.event.shiftKey) && (window.event.keyCode == 13)){
            if(e.keyCode==13 && !isShiftEnter){
                chatSendProc();
                return false;
            }
        });
        $("#chatInputTextarea").keyup(function (e){
            if(e.keyCode==16){
                isShiftEnter = false;
            }
        });

        /*点击搜索按钮*/
        $(document).on("click","#chatSearchBtn",function(){
            var userName=$("#chatSearchInput").val();
            if (userName.trim() == "") {
                $("#chatSearchInput").val("");
                return;
            }

            $("#chatSearchEntityContent").show();
            $("#chatSearchCannotFindLable").hide();
            $("#chatSearchEntityUserList a").remove();
            //function showLoadingIcon(){
            //    $("#chatSearchLoadingIcon").show();
            //}
            ///*一秒钟后没有收到回应，将菊花显示出来*/
            //var iconTimerHandler = setInterval(showLoadingIcon,1000);
            socket.emit("findUsers",{keyword:escape(userName),startNum:0},function(data){
                //clearInterval(iconTimerHandler);
                console.log("findUsers_"+JSON.stringify(data));
                if(data["result"] == "success"){
                    if(data["body"] && 0==data["body"].length){
                        $("#chatSearchCannotFindLable").show();
                    }else{
                        for(var i in data["body"]){
                            var alreadyFriend = false;
                            /*过滤掉自己*/
                            if(data["body"][i]["uid"] == g_chatUid){
                                continue;
                            }
                            /*过滤掉自己的好友*/
                            for(var j in chatDbm["friendList"]){
                                if(data["body"][i]["uid"] ==  chatDbm["friendList"][j]["uid"]){
                                    if(chatDbm["friendList"][j]["state"] == "ready"){
                                        alreadyFriend = true;
                                        break;
                                    }
                                }
                            }
                            var uid = data["body"][i]["uid"];
                            var name = data["body"][i]["name"];

                            if(alreadyFriend) {
                                var searchStr = createSearchedFriendString(uid, name,true);
                                $("#chatSearchEntityUserList").append(searchStr);
                            }else{
                                var searchStr = createSearchedFriendString(uid, name,false);
                                $("#chatSearchEntityUserList").append(searchStr);
                            }

                            /*获取用户头像*/
                            (function (uid){
                                socket.emit("userPhotoGet", {uid:uid},function(data){
                                    //console.log("userPhotoGet_"+JSON.stringify(data))
                                    if(data["result"]=="success" && data["body"] && data["body"]["image"]){
                                        convertHeadImg(data["body"]["image"],function(img){
                                            $("#chatSearchEntityUserList").find("a[uid='"+uid+"']").find(".chatSearchUserPortrait").attr("src",img);
                                        })
                                    }else{
                                        $("#chatSearchEntityUserList").find("a[uid='"+uid+"']").find(".chatSearchUserPortrait").attr("src",g_chatDefaultHeadImg);
                                    }
                                })
                            })(uid);
                        }
                    }
                }else{
                    alert("获取用户列表失败！");
                }
            })
        })

        /*当搜索框没有任何字符时将搜索实体框隐藏*/
        $(document).on("keyup","#chatSearchInput",function(){
            var userName=$("#chatSearchInput").val();
            if (userName == ""){
                $("#chatSearchEntityContent").hide();
            }
        })

        /*点击添加按钮*/
        $(document).on("click",".chatSearchUserNameListLink button", function(event){
            var _this=$(this);
            var uid=$(this).parent().attr("uid");
            var name=$(this).parent().find("pre").text();
            socket.emit("friendAdd",{fname:escape(name), uid:uid}, function(data){
                console.log("friendAdd_"+JSON.stringify(data));
                if(data["result"] == "success"){
                    _this.text("等待验证");
                    _this.addClass("disabled");
                }else{
                    alert("添加失败！");
                }
                /*他可能在我的新的朋友里边 所以要把他从那里删掉，产生这样的原因是什么呢？是因为他加我，然后我没点接受，我再返过来加他，后台处理成我的添加把他的添加覆盖了，这里设计得真是烂得着不住！！*/
                $("#chatNewFriendListContent").find("a[uid='"+uid+"']").remove();
                newFriendRedPointToggel();
            });
            event.stopPropagation();
        })

        /*点击接受按钮*/
        $(document).on("click",".chatNewFriendListLink button", function(event){
            var name=$(this).parent().find("pre[class='chatNewFriendName']").text();
            var uid=$(this).parent().attr("uid");
            var _this=$(this);
            socket.emit("friendAccept", {fname:escape(name), uid:escape(uid)}, function(data){
                console.log("friendAccept_"+JSON.stringify(data));
                if(data["result"] == "success"){
                    _this.parent().remove();
                    var sid = data["body"]["sid"];
                    var name = data["body"]["name"];
                    var uid = data["body"]["uid"];
                    var date = data["body"]["time"];
                    /*需要将原来的WAIT_ME给删除掉*/
                    for(var i in chatDbm["friendList"]){
                        if(chatDbm["friendList"][i]["uid"] == uid){
                            chatDbm["friendList"].splice(i,1);
                        }
                    }
                    chatDbm["friendList"].push(data["body"]);
                    var friendListStr = createFriendListString(sid, uid,name);
                    $("#chatFriendListFriendContent").append(friendListStr);
                    /*创建一个提示 我们是好朋友了*/
                    if($("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").length ==0){
                        var dialogSumStr = createDialogCoupleSumString(sid, name, uid);
                        $("#chatNavEntityDialogSum").prepend(dialogSumStr);
                    }

                    var msg = "我们已经是好朋友了，开始聊天吧！";
                    updataDialogSum(sid,name,undefined,date, msg );

                    chatSaveSystemMsg("system",sid,msg,date,false);

                    /*当前ENTITY页面可能就是与他聊天的页面*/
                    if($("#chatDialogContent").attr("sid") == sid){
                        var str = createSystemInfoString(msg);
                        $("#chatDialogEntityContentAuto").append(str);
                        chatDialogTurnToBottom();
                    }

                    /*跳转到那个页面去*/
                    $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").trigger("click");
                    $("#chatDialogSumEntryLink").trigger("click");

                    newFriendRedPointToggel();
                    chatFriendNameSort();
                }
            })
        })

        /*点击新的朋友入口*/
        $(document).on("click","#chatNewFriendEntryLink", function(){
            $("#chatNavEntityFriendListContent").hide();
            $("#chatNewFriendEntityContent").show();
            $("#chatWelcomeContent").show();
            $("#chatFriendInfoContent").hide();
            $("#chatGroupInfoContent").hide();

            $("#chatNavEntityFriendList").children("a.atv").removeClass("atv");
            $(this).addClass("atv");
        })

        /*点击新的朋友返回链接*/
        $(document).on("click","#chatNewFriendTitle a", function(){
            $("#chatNavEntityFriendList").children("a.atv").removeClass("atv");
            $("#chatNavEntityFriendListContent").show();
            $("#chatWelcomeContent").show();
            $("#chatNewFriendEntityContent").hide();
        })

        /*点击编辑群TITLE按钮*/
        $(document).on("click","#chatGroupInfoTitle", function(){
            var sid = $("#chatGroupInfoContent").attr("sid");
            for(var i in chatDbm["groupList"]){
                if(chatDbm["groupList"][i]["sid"] == sid){
                    var ownerId = chatDbm["groupList"][i]["owner"];
                }
            }
            if(ownerId != g_chatUid){
                return;
            }
            $("#chatChangeTitleInput").show();
            //$("#chatGroupInfoTitle").css("visibility","hidden");
            $("#chatGroupInfoTitle").hide();
            $("#chatChangeTitleInput")[0].focus();

            var title = $("#chatGroupInfoTitle").text();
            $("#chatChangeTitleInput").val(title);
            $("#chatChangeTitleInput").attr("oldTitle",title);

        })

        /*修改群名称输入框失去焦点*/
        $(document).on("blur","#chatChangeTitleInput", function(){
            //$("#chatGroupInfoTitle").css("visibility","visible");
            $("#chatGroupInfoTitle").show();
            $("#chatChangeTitleInput").hide();
            var title =  $("#chatChangeTitleInput").val();
            title = title.trim();
            var oldTitle =  $("#chatChangeTitleInput").attr("oldTitle");
            if (title == ""|| title ==oldTitle) {
                return;
            }
            var sid =$("#chatGroupInfoContent").attr("sid");
            socket.emit("changeGroupTitle", {sid:sid,title:escape(title)}, function(data){
                console.log("changeGroupTitle_"+JSON.stringify(data));
                if(data["result"]=="success"){
                    /*修改组INFO中的TITLE*/
                    $("#chatGroupInfoTitle").text(title);

                    /*修改群列表中的TITLE*/
                    $("#chatNavEntityFriendList").find("a[sid='"+sid+"']").find(".chatFriendListName").text(title);

                    /*修改缩略页面中的TITLE*/
                    $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").find(".chatDialogSumTitle").text(title);

                    /*修改对话框中的TITLE*/
                    if(sid==$("#chatDialogContent").attr("sid")){
                        $("#chatDialogTitle").text(title);
                    }
                    for(var i in chatDbm["groupList"]){
                        if(sid == chatDbm["groupList"][i]["sid"]){
                            chatDbm["groupList"][i]["title"] = title;
                        }
                    }
                }else{
                    alert("修改群名称失败!");
                }
            })
        })

        /*点击自己的大头像将事件拦截*/
        $(document).on("click","#chatMyBigPortraintContent", function(event){
            event.stopPropagation();
        })

        //$(document).on("click","#chatGroupListLabel", function(event){
        //    console.log("xxxxxxxxx")
        //    $('#collapseOne').collapse('toggle');
        //})
        /*显示连接错误信息*/
        function setConnectErrorInfoAndShow(info){
            $("#chatConnectError").html(info);
            $("#chatConnectError").show();
            $("#chatFrame").css("height", 640);
        }

        /*隐藏连接错误信息*/
        function settConnectErrorInfoHide(){
            $("#chatConnectError").hide();
            $("#chatFrame").css("height", 600);
        }

        /*群组添加提示信息是否显示函数*/
        function groupNoteLableToggle(){
            if(0 == $("#chatNavEntityFriendList").find("a[dialogType='mutiple']").size()){
                $("#chatGroupListNoneLabel").show();
            }else{
                $("#chatGroupListNoneLabel").hide();
            }
        }

        /*加载更多消息记录*/
        function loadMoreMsgRecord(){
            var sid = $("#chatDialogContent").attr("sid");
            var type = $("#chatDialogContent").attr("dialogtype");

            var totalLen = chatDbm["msgRecord"][sid].length;
            var loadMsgLen = 20;
            var index = 0;
            var sigMsg = chatDbm["msgRecord"][sid];

            $("#chatDialogLoadMoreContent").remove();
            for(var i=0; i <loadMsgLen;i++){
                index = chatRecoverMsgIndex-1;
                if(index < 0){
                    return;
                }
                chatRecoverMsgIndex--;

                /*恢复消息*/
                recoverMsgRecordEntity(sigMsg[index],type,sid,true);

                /*放置时间*/
                setMoreMsgDate(sigMsg[index]["date"]);

                sigMsg[index]["is_read"] = true;
            }
        }

        function recoverMsgRecordEntity(sigMsg,type,sid,more){
            if(sigMsg["type"]=="msg"){
                /*根据UID找到名字,组里说话使用的是昵称，昵称是会变的*/
                var uid = sigMsg["uid"];
                var date = sigMsg["date"];
                var msg =  sigMsg["msg"];
                var mid =  sigMsg["mid"];
                var author = sigMsg["author"];
                var appendString;

                if(type=="couple"){
                    if(uid == g_chatUid){
                        author = g_chatUserName;
                    }else{
                        for(var j in chatDbm["friendList"]){
                            if(uid == chatDbm["friendList"][j]["uid"]){
                                author = chatDbm["friendList"][j]["name"];
                                break;
                            }
                        }
                    }
                }else{/*author可能会变，他可以修改自己的NICKNAME，这里先取群列表结构中的NICKNAME如果这厮离开了群 就取消息中的*/
                    for(var j in chatDbm["groupList"]){
                        if(sid == chatDbm["groupList"][j]["sid"]) {
                            for (var k in chatDbm["groupList"][j]["members"]) {
                                if (uid == chatDbm["groupList"][j]["members"][k]["uid"]) {
                                    author = chatDbm["groupList"][j]["members"][k]["nickname"];
                                    break;
                                }
                            }
                        }
                    }
                }

                appendString = chatPrepareMsgRecordString(author, date, msg, mid, type,uid);
            }
            /*恢复系统消息*/
            else if(sigMsg["type"]=="system"){
                var date = sigMsg["date"];
                var systemInfo = sigMsg["msg"];
                appendString = createSystemInfoString(systemInfo);
            }
            if(more){
                $("#chatDialogEntityContentAuto").prepend(appendString);
            }else{
                $("#chatDialogEntityContentAuto").append(appendString);
            }
        }
        /*恢复历史记录*/
        function recoverMsgRecord(sid,type){
            var recoverMsgCount = 20;//恢复30条记录
            chatRecoverMsgIndex = 0;
            if(!chatDbm["msgRecord"][sid]){
                return;
            }
            var sigMsg=chatDbm["msgRecord"][sid];
            chatRecoverMsgIndex = sigMsg.length;
            var totalLen = chatRecoverMsgIndex;
            var index = 0;
            if(chatRecoverMsgIndex<recoverMsgCount){
                recoverMsgCount = chatRecoverMsgIndex;
            }

            for(recoverMsgCount;recoverMsgCount>0;recoverMsgCount--){
                index = totalLen-recoverMsgCount;
                if(index < 0){
                    return;
                }
                /*恢复日期*/
                setMsgDate(sigMsg[index]["date"]);

                /*恢复消息*/
                recoverMsgRecordEntity(sigMsg[index],type,sid,false);

                chatRecoverMsgIndex--;
                chatDbm["msgRecord"][sid][index]["is_read"] = true;
            }
        }

        /*查看更多设置时间*/
        function setMoreMsgDate(date){
            var formatDate = new Date(date).format("yy/MM/dd hh:mm");
            var preDate = $("#chatDialogEntityContentAuto").find("div[class='chatDialogEntityDate']").first().attr("date");
            var firstChirldClass=$("#chatDialogEntityContentAuto").children().first().attr("class");
            //console.log(firstChirldClass);
            var oldDate = Date.parse(preDate);
            var newDate = Date.parse(date);
            //console.log(chatRecoverMsgIndex);
            if((150000<oldDate-newDate) || (chatRecoverMsgIndex==0)&&("chatDialogEntityDate" != firstChirldClass)){
                var dateStr = createDateString(formatDate,date);
                $("#chatDialogEntityContentAuto").prepend(dateStr);
            }
        }

        /*设置时间*/
        function setMsgDate(date){
            var formatDate = new Date(date).format("yy/MM/dd hh:mm");
            /*框是空的 那么先放一个时间进去*/
            if($("#chatDialogEntityContentAuto").children().length == 0){
                var dateStr = createDateString(formatDate,date);
                $("#chatDialogEntityContentAuto").append(dateStr);

            }else{
                /*与前一个时间作比较，如果大于2.5分钟再放一个时间*/
                var preDate = $("#chatDialogEntityContentAuto").find("div[class='chatDialogEntityDate']").last().attr("date");
                var oldDate = Date.parse(preDate);
                var newDate = Date.parse(date);
                if(150000<newDate-oldDate){
                    var dateStr = createDateString(formatDate,date);
                    $("#chatDialogEntityContentAuto").append(dateStr);
                }
            }
        }

        /*准备时间上屏信息*/
        function createDateString(formatDate, date){
            var temp = $("<div></div>");

            var div = $("<div class='chatDialogEntityDate' date='"+date+"'></div>");
            var span = $("<span></span>");
            span.text(formatDate);
            div.append(span);
            temp.append(div);

            return temp.html();
        }

        function createDialogCoupleSumString(sid, title, uid){
        /*准备缩略页面信息*/
            var headImg;
            if(chatDbm["userHeadImg"][uid]){
                headImg = chatDbm["userHeadImg"][uid]["image"];
            }else{
                headImg = g_chatDefaultHeadImg;
            }

            if(isKefu(title)){
                title = getKefuNname(title)
            }

            var temp = $("<div></div>");
            var a = $("<a class='chatDialogSumLink list-group-item' sid='"+ sid +"' dialogType='couple'></a>");
            var img = $("<img  class='img-circle chatDialogSumPortrait' headimg_uid='"+ uid +"' src='"+headImg+"'>");
            var preTitle=$("<pre class='chatDialogSumTitle' title='"+title+"'></pre>");
            var preCount = $("<pre class='chatDialogSumCount'></pre>");
            var preTime = $("<pre  class='chatDialogSumTime'></pre>");
            var preMsg = $("<pre class='chatDialogSumMsg'></pre>");

            preTitle.text(title);
            a.append(img, preTitle,preCount,preTime,preMsg);

            temp.append(a);
            return temp.html();
        }

        /*准备缩略页面信息*/
        function createDialogMutipleSumString(sid, title){
            var temp = $("<div></div>");
            var a = $("<a class='chatDialogSumLink list-group-item' sid='"+ sid +"' dialogType='mutiple'></a>");
            //var img = $("<img  class='img-circle chatDialogSumPortrait' src='../friendportrait/defaultheadimg.png'>");
            var imgContent = $("<div class='chatGroupPortraitContent'></div>");
            var preTitle=$("<pre class='chatDialogSumTitle' title='"+title+"'></pre>");
            var preCount = $("<pre class='chatDialogSumCount'></pre>");
            var preTime = $("<pre  class='chatDialogSumTime'></pre>");
            var preMsg = $("<pre class='chatDialogSumMsg'></pre>");

            preTitle.text(title);

            a.append(imgContent, preTitle,preCount,preTime,preMsg);

            temp.append(a);
            return temp.html();
        }

        /*准备组列表信息*/
        function createGroupListString(sid, title){
            var temp = $("<div></div>");
            var a = $("<a class='chatGroupListLink list-group-item' sid='"+sid+"' dialogType='mutiple'></a>");
            //var img = $("<img class='img-circle chatFriendListPortrait' src='../friendportrait/defaultheadimg.png'>");
            var imgContent = $("<div class='chatGroupPortraitContent'></div>");

            var pre = $("<pre class='chatFriendListName'></pre>");
            pre.text(title);
            a.append(imgContent,pre);
            temp.append(a);

            return temp.html();
        }

        /*准备好友列表信息*/
        function createFriendListString(sid, uid, name ){
            var kefuFlag = false;
            var headImg=chatDbm["userHeadImg"][uid]?chatDbm["userHeadImg"][uid]["image"]:g_chatDefaultHeadImg;

            if(kefuFlag = isKefu(name)){
                name = getKefuNname(name)
            }

            var temp = $("<div></div>");
            if(kefuFlag){
                var a=$("<a class='chatFriendListLink list-group-item' uid='"+ uid +"' sid='"+ sid +"' dialogType='couple'></a>");
            }else{
                var a=$("<a class='chatFriendListLink list-group-item sort_list' uid='"+ uid +"' sid='"+ sid +"' dialogType='couple'></a>");
            }

            var img=$("<img class='img-circle chatFriendListPortrait' headimg_uid='"+ uid +"' src='"+headImg+"'>");
            var pre=$("<pre class='chatFriendListName num_name'></pre>");

            pre.text(name);
            a.append(img,pre);

            temp.append(a);
            return temp.html();
        }

        /*准备好友添加请求信息*/
        function createNewFriendAddString( uid, name ){
            var temp = $("<div></div>");
            var a = $("<a class='chatNewFriendListLink list-group-item' uid='"+uid+"'></a>");
            var img = $("<img class='img-circle chatNewFriendPortrait' headimg_uid='"+ uid +"' src='"+g_chatDefaultHeadImg+"'>");
            var pre = $("<pre class='chatNewFriendName' title='"+name+"'></pre>");
            var btn = $("<button class='btn btn-info btn-small' type='button'></button>");
            var span =$("<span></span>");
            span.text("接受");
            pre.text(name);
            btn.append(span);
            a.append(img, pre, btn);

            temp.append(a);
            return temp.html();
        }

        /*准备搜索到的好友信息*/
        function createSearchedFriendString(uid , name, isAlreadyFriend){
            var temp = $("<div></div>");

            var a = $("<a class='chatSearchUserNameListLink list-group-item' uid='"+ uid +"'> </a>");
            var img = $("<img class='img-circle chatSearchUserPortrait' headimg_uid='"+ uid +"' src='../friendportrait/defaultheadimg.png'>");
            var pre = $("<pre class='chatSearchUserName' title='"+name+"'></pre>");
            var btn = $("<button class='btn btn-info btn-sm' type='button'></button>");
            pre.text(name);
            if(isAlreadyFriend){
                btn.text("好友");
                btn.addClass("disabled");
            }else{
                btn.text("添加");
            }
            a.append(img, pre, btn);

            temp.append(a);
            return temp.html();
        }

        /*准备群成员信息*/
        function createGroupMenberString(name,uid){
            var headImg=chatDbm["userHeadImg"][uid]?chatDbm["userHeadImg"][uid]["image"]:g_chatDefaultHeadImg;

            var temp = $("<div></div>");
            var a = $("<a uid='"+uid+"'></a>");
            var div = $("<div  class='chatGroupInfoMenber'></div>");
            var img = $("<img class='img-circle chatGroupInfoMenbersPortrait' headimg_uid='"+ uid +"' src='"+headImg+"'>");
            var pre = $("<pre class='chatGroupInfoMenbersName'></pre>");
            pre.text(name);
            div.append(img, pre);
            a.append(div);

            temp.append(a);
            return temp.html();
        }

        /*准备群主信息*/
        function createGroupOwnerString(name ,uid){
            var headImg=chatDbm["userHeadImg"][uid]?chatDbm["userHeadImg"][uid]["image"]:g_chatDefaultHeadImg;

            var temp = $("<div></div>");
            var a = $("<a uid='"+uid+"'></a>");
            var div = $("<div  class='chatGroupInfoMenber'></div>");
            var imgHad = $("<img id='chatGroupOwnerFlag' src='../groupownerflag.png'>");
            var img = $("<img class='img-circle chatGroupInfoMenbersPortrait' headimg_uid='"+ uid +"' src='"+headImg+"'>");
            var pre = $("<pre class='chatGroupInfoMenbersName'></pre>");
            pre.text(name);
            div.append(imgHad, img, pre);
            a.append(div);

            temp.append(a);
            return temp.html();
        }

        /*准备群添加成员信息*/
        function createGroupAddUserString(sid){
            var temp = $("<div></div>");
            var a = $("<a id='chatGroupAddUserLink' sid='"+sid+"' data-toggle='modal'></a>");
            var div = $("<div  class='chatGroupInfoMenber'></div>");
            var img = $("<img class='chatGroupInfoMenbersPortrait' src='../chatgroupadduser.png'>");

            div.append(img);
            a.append(div);

            temp.append(a);
            return temp.html();
        }

        /*准备群成员删除信息*/
        function createGroupDelUserString(sid){
            var temp = $("<div></div>");
            var a = $("<a id='chatGroupDelUserLink' sid='"+sid+"' data-target='#chatAddSessionModal' data-toggle='modal'></a>");
            var div = $("<div  class='chatGroupInfoMenber'></div>");
            var img = $("<img class='chatGroupInfoMenbersPortrait' src='../chatgroupdeluser.png'>");

            div.append(img);
            a.append(div);

            temp.append(a);
            return temp.html();
        }

        /*准备上屏消息*/
        function chatPrepareMsgRecordString(author, date, msg, mid, type,uid) {
            var headImg = chatDbm["userHeadImg"][uid] ? chatDbm["userHeadImg"][uid]["image"] : g_chatDefaultHeadImg;
            var divTemp = $("<div></div>");
            if (!(/<img [^>]*>/.test(msg))) {
                /*设置超链接文本格式*/
                msg = msg.replace(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w_-]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g, function ($0, $1, $2, $3, $4) {
                    if ($3) {
                        return '<a href="' + $1 + '" target="_blank">' + $1 + '</a>';
                    } else {
                        return '<a href="http://' + $1 + '" target="_blank">' + $1 + '</a>';
                    }
                });
            }
            /*表情内容转换*/
            //msg = msg.replace(/\[(e1[0-8][0-9])]/g, "<img src=\"http:\/\/ctc.qzonestyle.gtimg.cn\/qzone\/em\/$1.gif\">");
            msg = msg.replace(/\[(em1[0-2][0-9])]/g, "<img src=\"..\/image\/emotion\/$1.gif\">");
            if(author==g_chatUserName){
                var divContent = $("<div class='chatDialogEntity' align='right' mid='"+ mid +"' date='"+ date +"'></div>");
                var divWidth = $("<div  style= 'width: 75%'></div>");
                var img = $("<img src='"+headImg+"' class='img-circle chatDialogEntityPortraint_right' headimg_uid='"+ uid +"'>");
                var spanTriangler = $("<span class='chatDialogEntityTriangler_right'></span>");
                var divMsgContent = $("<div  class='chatDialogEntityMsgContent_right'></div>");
                var preMsg = $("<pre class='chatDialogEntityMsg_right' align='left'></pre>");
                preMsg.append(msg);
                divMsgContent.append(preMsg);
                divWidth.append(img,spanTriangler, divMsgContent);
                divContent.append(divWidth);
            }else{
                var preAuthor= "";

                var divContent = $("<div class='chatDialogEntity' align='left' mid='"+ mid +"' date='"+ date +"'></div>");
                var divWidth = $("<div  style= 'width: 75%'></div>");
                var img = $("<img img src='"+headImg+"' class='img-circle chatDialogEntityPortraint_left' headimg_uid='"+ uid +"'>");
                var spanTriangler = $("<span class='chatDialogEntityTriangler_left'></span>");
                if(type =="mutiple"){
                    var preAuthor = $("<pre class='chatDialogEntityUserName_left'></pre>");
                    preAuthor.text(author);
                }
                var divMsgContent = $("<div  class='chatDialogEntityMsgContent_left'></div>");
                var preMsg = $("<pre class='chatDialogEntityMsg_left' align='left'></pre>");

                preMsg.append(msg);
                divMsgContent.append(preMsg);
                divWidth.append(img, spanTriangler,preAuthor, divMsgContent);
                divContent.append(divWidth);
            }
            hideNote();
            divTemp.append(divContent);
            return divTemp.html();
        }

        /*准备系统信息*/
        function createSystemInfoString(msg){
            var divTemp = $("<div></div>");
            var div = $("<div class='chatDialogEntitySystem'></div>");
            var span = $("<span></span>");
            span.text(msg);
            div.append(span);

            divTemp.append(div);
            return divTemp.html();
        }

        /*处理接收好友列表*/
        function procRcvFriendList(data){
            if(data["result"]!="success"){
                alert("获取用户列表失败！");
                return false;
            }
            $("#chatNavEntityFriendList").find("a[dialogType='couple']").remove();
            $("#chatNewFriendListContent").children().remove();
            $("#chatFriendListKefuContent").children().remove();
            chatDbm["friendList"] = [];
            for(var i in data["body"]){
                var uid= data["body"][i]["uid"];
                data["body"][i]["name"] = unescape(data["body"][i]["name"]);
                var name=data["body"][i]["name"];
                chatDbm["userHeadImg"][uid]={photoid:"",image:g_chatDefaultHeadImg};
                if( data["body"][i]["state"] == "ready"){
                    var sid= data["body"][i]["sid"];
                    var friendListStr = createFriendListString(sid, uid, name);
                    if(isKefu(name)){
                        $("#chatFriendListKefuContent").append(friendListStr);
                    }else{
                        $("#chatFriendListFriendContent").append(friendListStr);
                    }
                }
                if(data["body"][i]["state"] == "wait_me"){
                    var stringNewFriend = createNewFriendAddString(uid ,name);
                    $("#chatNewFriendListContent").append(stringNewFriend);
                    showFriendEntryRedPoint();
                }
            }
            chatDbm["friendList"]=data["body"];

            newFriendRedPointToggel();

            return true;
        }

        /*处理收到的组列表信息*/
        function procRcvGroupList(data){
            if(data["result"] != "success"){
                alert("获取组信息失败!");
                return false;
            }
            $("#chatNavEntityFriendList").find("a[dialogType='mutiple']").remove();
            chatDbm["groupList"] = [];
            for(var i in data["body"]){
                var sid= data["body"][i]["sid"];
                data["body"][i]["title"] = unescape(data["body"][i]["title"]);
                var title = data["body"][i]["title"];

                var groupListStr = createGroupListString(sid, title);
                $("#chatFriendListGroupContent").append(groupListStr);
                chatDbm["groupList"].push(data["body"][i]);
                for(var j in data["body"][i]["members"]){
                    var uid=data["body"][i]["members"][j]["uid"];
                    if(!chatDbm["userHeadImg"][uid]){
                        chatDbm["userHeadImg"][uid]={photoid:"",image:g_chatDefaultHeadImg};
                    }
                }
                updataGroupHeadImgForOneGroup(sid);
            }
            groupNoteLableToggle();

            return true;
        }

        /*DIALOG CONTENT的SID属性为SID时处理收到的消息*/
        function procRcvMsgOnDialogPage(sid, data, type){
            var uid = data["uid"];
            var author = data["name"];
            var date = data["time"];
            var msg = unescape(data["msg"]);
            var mid = data["mid"];

            /*设置时间*/
            setMsgDate(date);

            //msg = msg.replace(/\[(e1[0-8][0-9])]/g, "<img src=\"http:\/\/ctc.qzonestyle.gtimg.cn\/qzone\/em\/$1.gif\">");
            var msgStr = chatPrepareMsgRecordString(author, date, msg, mid,type,uid,uid);
            $("#chatDialogEntityContentAuto").append(msgStr);

            chatSaveMsgRecord("msg", sid, uid, date, msg, mid, true,author);
            chatDialogTurnToBottom();

            /*更新缩略页面消息*/
            if("mutiple" == type){
                msg = author+"："+msg;
            }
            updataDialogSum(sid, undefined,undefined, date, msg);
        }

        /*DIALOG CONTENT的SID属性不是SID时处理收到的消息*/
        function procRcvMsgOutOfDialogPage(sid, data, title, type, opUid){
            var uid = data["uid"];
            var author = data["name"];
            var date = data["time"];
            var msg = unescape(data["msg"]);
            var mid = data["mid"];
            //msg = msg.replace(/\[(e1[0-8][0-9])]/g, "<img src=\"http:\/\/ctc.qzonestyle.gtimg.cn\/qzone\/em\/$1.gif\">");
            chatSaveMsgRecord("msg",sid, uid, date, msg, mid, false,author);
            /*如果缩略页面不存在，则创建*/
            if(0==$("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").length){
                var dialogSumStr
                if(type=="couple"){
                    dialogSumStr = createDialogCoupleSumString(sid, title, opUid)
                }else{
                    dialogSumStr = createDialogMutipleSumString(sid, title);
                }
                $("#chatNavEntityDialogSum").prepend(dialogSumStr);
                updataGroupHeadImgForOneGroup(sid);
            }
            /*更新缩略页面*/
            var count;
            var sumContentStr = $("#chatNavEntityDialogSum").find("a[sid='"+ sid +"']").find("pre[class='chatDialogSumCount']").text();
            if(sumContentStr == ""){
                count = 1;
            }else{
                count = parseInt(sumContentStr.match(/\d+/g)[0]) +1;
            }

            /*更新缩略页面消息*/
            if("mutiple" == type){
                msg = author+"："+msg;
            }
            updataDialogSum(sid, undefined, count,date, msg);

        }

        /*处理收到的消息信息*/
        function procRcvMsgSync(data){
            if(data["result"] != "success"){
                return false;
            }
            for(var i in data["body"]){
                var sid = data["body"][i]["sid"];

                /*找到该SID的最大的MID,为什么要找到这个呢，是因为SERVER端一重启 就会推送一遍已经推送过的消息，后台不愿意改，没有办法，只能我前台来过滤了，简直太过份*/
                //var maxUid = undefined;
                //if(chatDbm["msgRecord"][sid]){
                //    var len = chatDbm["msgRecord"][sid].length;
                //    for(var i in  chatDbm["msgRecord"][sid]){
                //        var t = parseInt(i);
                //        if(chatDbm["msgRecord"][sid][len-t]["mid"]){
                //            maxUid = chatDbm["msgRecord"][sid][len-t]["mid"];
                //            break;
                //        }
                //    }
                //}
                for(var j in data["body"][i]["msgs"]){
                    var sigMsg =  data["body"][i]["msgs"][j];

                    /*过滤掉重复的消息*/
                    //if(undefined != typeof(maxUid) &&  maxUid>=sigMsg["mid"]){
                    //    console.log("filter_ "+sid+" "+sigMsg["mid"]+ " " +sigMsg["msg"]);
                    //    continue;
                    //}

                    var type = sigMsg["type"];
                    var title = undefined;
                    var opUid;
                    /*查找TITLE*/
                    if(type == "couple"){
                        for(var k in chatDbm["friendList"]){
                            if(chatDbm["friendList"][k]["sid"] == sid){
                                title=chatDbm["friendList"][k]["name"];
                                opUid = chatDbm["friendList"][k]["uid"]
                            }
                        }
                    }else{
                        for(var k in chatDbm["groupList"]){
                            if(chatDbm["groupList"][k]["sid"] == sid){
                                title = chatDbm["groupList"][k]["title"];
                            }
                        }
                    }

                    if(!title){
                        alert("未知消息,sid = "+sid);
                        break;
                    }
                    /*如果当前对话框为SID*/
                    if($("#chatDialogContent").attr("sid") == sid){
                        procRcvMsgOnDialogPage(sid,sigMsg,type);
                    }else{
                        procRcvMsgOutOfDialogPage(sid, sigMsg, title, type,opUid);
                    }

                    sortDialogSumLink(sid);
                    chatNewMsgSoundPlay();
                }
                newMsgRedPointToggel();
                titleBadgeToggel();
            }

            return true;
        }

        /*获取好友头像*/
        function getFriendsHeadImg(){
            for(var i in chatDbm["userHeadImg"]){
                var uid=i;
                (function (uid){
                    socket.emit("userPhotoGet",{uid:uid},function(data){
                        if(data["result"]=="success" && data["body"]["photoid"] && data["body"]["image"]){
                            convertHeadImg(data["body"]["image"],function(img){
                                var pid=data["body"]["photoid"];

                                chatDbm["userHeadImg"][uid]={photoid:pid,image:img};

                                /*更新个人头像*/
                                updateHeadImgForOneUser(uid);

                                /*更新群列表中的头像和群缩略页面中的头像*/
                                updateGroupHeadImgForOneUid(uid);
                            })
                        }else if(data["result"]=="failed") {
                            alert("获取好友头像失败,UID="+uid + " 原因:"+JSON.stringify(data))
                        }
                    })
                })(uid);
            }
        }

        function updateHeadImgForOneUser(uid){
            var img = chatDbm["userHeadImg"][uid]?chatDbm["userHeadImg"][uid]["image"]:g_chatDefaultHeadImg;

            ///*更新好友列表中的头像*/
            //$("#chatFriendListFriendContent").find("a[uid='"+uid+"']").find(".chatFriendListPortrait").attr("src",chatDbm["userHeadImg"][uid]["image"]);
            //
            ///*更新缩略会话页面中的头像*/
            //for(var k in chatDbm["friendList"]){
            //    if(chatDbm["friendList"][k]["uid"] == uid){
            //        var sid=chatDbm["friendList"][k]["sid"];
            //        $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").find(".chatDialogSumPortrait").attr("src", img);
            //        break;
            //    }
            //}
            //
            ///*更新新的朋友中的头像*/
            //$("#chatNewFriendListContent").find("a[uid='"+uid+"']").find(".chatNewFriendPortrait").attr("src", img);
            //
            ///*更新自己的头像*/
            //if(uid==g_chatUid){
            //    $('#chatLocalHeadimg').attr('src', img);
            //    $('#chatLocalBigHeadimg').attr('src', img);
            //
            //    //setTimeout(function(){
            //    //    var image = document.getElementById('chatLocalBigHeadimg');
            //    //    chatfavicon.image(image);
            //    //    titleBadgeToggel();
            //    //}, 3000)
            //}
            $("body").find("img[headimg_uid='"+uid+"']").attr("src", img);
        }

        /*更新一个群的群头像*/
        function updataGroupHeadImgForOneGroup(sid){
            var members;
            for(var i in chatDbm["groupList"]){
                if(chatDbm["groupList"][i]["sid"]==sid){
                    members=chatDbm["groupList"][i]["members"].concat();
                }
            }
            for(var i in members){
                var uid=members[i]["uid"];

                if(!chatDbm["userHeadImg"][uid]){
                    chatDbm["userHeadImg"][uid]={photoid:"",image:g_chatDefaultHeadImg};
                    (function (uid,sid,members){
                        socket.emit("userPhotoGet",{uid:uid},function(data){
                            if(data["result"]=="success" && data["body"]["photoid"] && data["body"]["image"]){
                                var pid=data["body"]["photoid"];
                                convertHeadImg(data["body"]["image"],function(img){
                                    chatDbm["userHeadImg"][uid]={photoid:pid,image:img};
                                    updateGroupHeadImgDetail(sid, members, uid);
                                })
                            }
                        })
                    })(uid, sid, members);
                }else{
                    updateGroupHeadImgDetail(sid, members, uid);
                }
            }
        }

        /*更新一个人的群头像*/
        function updateGroupHeadImgForOneUid(uid){
            var groupSid;
            var members;

            for(var i in chatDbm["groupList"]){
                for(var j in chatDbm["groupList"][i]["members"]){
                    if(chatDbm["groupList"][i]["members"][j]["uid"]==uid){
                        groupSid = chatDbm["groupList"][i]["sid"];
                        members = chatDbm["groupList"][i]["members"].concat();
                        updateGroupHeadImgDetail(groupSid, members, uid);
                        break;
                    }
                }
            }
        }

        function updateGroupHeadImgDetail(sid, members, uid){
            var count = members.length;
            var isFind=false;
            var img1="";
            var img2="";
            var img3="";
            var img4="";
            var img5="";

            /*如果群中人数大于五人那么查看自己是否在前五个当中，如果不是直接返回*/
            if(count>5){
                for(var i= 0;i<5;i++){
                    if(members[i]["uid"]==uid){
                        isFind = true;
                        break;
                    }
                }
                if(!isFind){
                    return;
                }
            }

            switch (count){
                case 1:
                    var uid_1=members[0]["uid"];
                    var headImg_1=chatDbm["userHeadImg"][uid_1]?chatDbm["userHeadImg"][uid_1]["image"]:g_chatDefaultHeadImg;
                    img1 = $("<img class='chatGroupPortrait_1 chatGroupPortraitEntity_1_1' src='"+headImg_1+"'>");

                    break;
                case 2:
                    var uid_1=members[0]["uid"];
                    var uid_2=members[1]["uid"];
                    var headImg_1=chatDbm["userHeadImg"][uid_1]?chatDbm["userHeadImg"][uid_1]["image"]:g_chatDefaultHeadImg;
                    var headImg_2=chatDbm["userHeadImg"][uid_2]?chatDbm["userHeadImg"][uid_2]["image"]:g_chatDefaultHeadImg;
                    img1 = $("<img class='chatGroupPortrait_2 chatGroupPortraitEntity_2_1' src='"+headImg_1+"'>");
                    img2 = $("<img class='chatGroupPortrait_2 chatGroupPortraitEntity_2_2' src='"+headImg_2+"'>");

                    break;
                case 3:
                    var uid_1=members[0]["uid"];
                    var uid_2=members[1]["uid"];
                    var uid_3=members[2]["uid"];
                    var headImg_1=chatDbm["userHeadImg"][uid_1]?chatDbm["userHeadImg"][uid_1]["image"]:g_chatDefaultHeadImg;
                    var headImg_2=chatDbm["userHeadImg"][uid_2]?chatDbm["userHeadImg"][uid_2]["image"]:g_chatDefaultHeadImg;
                    var headImg_3=chatDbm["userHeadImg"][uid_3]?chatDbm["userHeadImg"][uid_3]["image"]:g_chatDefaultHeadImg;
                    img1 = $("<img class='chatGroupPortrait_3 chatGroupPortraitEntity_3_1' src='"+headImg_1+"'>");
                    img2 = $("<img class='chatGroupPortrait_3 chatGroupPortraitEntity_3_2' src='"+headImg_2+"'>");
                    img3 = $("<img class='chatGroupPortrait_3 chatGroupPortraitEntity_3_3' src='"+headImg_3+"'>");
                    break;
                case 4:
                    var uid_1=members[0]["uid"];
                    var uid_2=members[1]["uid"];
                    var uid_3=members[2]["uid"];
                    var uid_4=members[3]["uid"];
                    var headImg_1=chatDbm["userHeadImg"][uid_1]?chatDbm["userHeadImg"][uid_1]["image"]:g_chatDefaultHeadImg;
                    var headImg_2=chatDbm["userHeadImg"][uid_2]?chatDbm["userHeadImg"][uid_2]["image"]:g_chatDefaultHeadImg;
                    var headImg_3=chatDbm["userHeadImg"][uid_3]?chatDbm["userHeadImg"][uid_3]["image"]:g_chatDefaultHeadImg;
                    var headImg_4=chatDbm["userHeadImg"][uid_4]?chatDbm["userHeadImg"][uid_4]["image"]:g_chatDefaultHeadImg;
                    img1 = $("<img class='chatGroupPortrait_4 chatGroupPortraitEntity_4_1' src='"+headImg_1+"'>");
                    img2 = $("<img class='chatGroupPortrait_4 chatGroupPortraitEntity_4_2' src='"+headImg_2+"'>");
                    img3 = $("<img class='chatGroupPortrait_4 chatGroupPortraitEntity_4_3' src='"+headImg_3+"'>");
                    img4 = $("<img class='chatGroupPortrait_4 chatGroupPortraitEntity_4_4' src='"+headImg_4+"'>");
                    break;
                default:
                    var uid_1=members[0]["uid"];
                    var uid_2=members[1]["uid"];
                    var uid_3=members[2]["uid"];
                    var uid_4=members[3]["uid"];
                    var uid_5=members[4]["uid"];
                    var headImg_1=chatDbm["userHeadImg"][uid_1]?chatDbm["userHeadImg"][uid_1]["image"]:g_chatDefaultHeadImg;
                    var headImg_2=chatDbm["userHeadImg"][uid_2]?chatDbm["userHeadImg"][uid_2]["image"]:g_chatDefaultHeadImg;
                    var headImg_3=chatDbm["userHeadImg"][uid_3]?chatDbm["userHeadImg"][uid_3]["image"]:g_chatDefaultHeadImg;
                    var headImg_4=chatDbm["userHeadImg"][uid_4]?chatDbm["userHeadImg"][uid_4]["image"]:g_chatDefaultHeadImg;
                    var headImg_5=chatDbm["userHeadImg"][uid_5]?chatDbm["userHeadImg"][uid_5]["image"]:g_chatDefaultHeadImg;
                    img1 = $("<img class='chatGroupPortrait_5 chatGroupPortraitEntity_5_1' src='"+headImg_1+"'>");
                    img2 = $("<img class='chatGroupPortrait_5 chatGroupPortraitEntity_5_2' src='"+headImg_2+"'>");
                    img3 = $("<img class='chatGroupPortrait_5 chatGroupPortraitEntity_5_3' src='"+headImg_3+"'>");
                    img4 = $("<img class='chatGroupPortrait_5 chatGroupPortraitEntity_5_4' src='"+headImg_4+"'>");
                    img5 = $("<img class='chatGroupPortrait_5 chatGroupPortraitEntity_5_5' src='"+headImg_5+"'>");
                    break;
            }
            /*将群头像清空 重新组装*/
            $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").find(".chatGroupPortraitContent").children().remove();
            $("#chatNavEntityFriendList").find("a[sid='"+sid+"']").find(".chatGroupPortraitContent").children().remove();

            $("#chatNavEntityFriendList").find("a[sid='"+sid+"']").find(".chatGroupPortraitContent").append(img1,img2,img3,img4,img5);
            $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").find(".chatGroupPortraitContent").append($(img1).clone(),$(img2).clone(),$(img3).clone(),$(img4).clone(),$(img5).clone());
        }

        /*页面滑动到底部*/
        function chatDialogTurnToBottom(){
            //if(0 != $("#chatDialogEntityContent").children().size()){
                $('#chatDialogEntityContent').slimScroll({ scrollBy: "1000000000000px" });
                //$("#chatDialogEntityContent").children().last()[0].scrollIntoView();
            //}
        }

        /*保存聊天实体消息*/
        function chatSaveMsgRecord(type, sid, uid,date, msg, mid,isRead,author){
            var tempObj = {};
            if(type =="mutiple"){
                for(var i in chatDbm["groupList"]){
                    if(chatDbm["groupList"][i]["sid"]== sid){
                        for(var j in chatDbm["groupList"][i]["members"]){
                            if(uid == chatDbm["groupList"][i]["members"][j]["uid"]){
                                var author = chatDbm["groupList"][i]["members"][j]["nickname"];
                                tempObj["author"] = author;
                                break;
                            }
                        }
                    }
                }
            }
            tempObj["type"] = type;
            tempObj["uid"] = uid;
            tempObj["date"] = date;
            tempObj["msg"] = msg;
            tempObj["mid"] = mid;
            tempObj["is_read"] = isRead;
            tempObj["author"] = author;
            if(!chatDbm["msgRecord"][sid]){
                chatDbm["msgRecord"][sid] = [];
            }
            chatDbm["msgRecord"][sid].push(tempObj);
        }

        /*保存系统信息*/
        function chatSaveSystemMsg(type,sid,msg,date, isRead){
            var tempObj = {};
            tempObj["type"] = type;
            tempObj["msg"] = msg;
            tempObj["date"] = date;
            tempObj["is_read"] = isRead;
            if(!chatDbm["msgRecord"][sid]){
                chatDbm["msgRecord"][sid] = [];
            }
            chatDbm["msgRecord"][sid].push(tempObj);
        }

        /*保存时间*/
        function chatSaveDate(type, sid, date){
            var tempObj = {};
            tempObj["type"] = type;
            tempObj["date"] = date;
            if(!chatDbm["msgRecord"][sid]){
                chatDbm["msgRecord"][sid] = [];
            }
            chatDbm["msgRecord"][sid].push(tempObj);
        }

        /*发送消息*/
        function chatSendProc(image){
            var sMsg;
            //var sMsg =  $("#chatInputTextarea").text();
            var sid = $("#chatDialogContent").attr("sid");
            var type = $("#chatDialogContent").attr("dialogType");

            if (image){
                sMsg = image;
            }else{
                sMsg = $("#chatInputTextarea")[0].innerHTML;
            }

            /* 如果输入为空直接返回 */
            var tmp = sMsg.replace(/(?:&nbsp;)/g, " ").replace(/(?:<div><br><\/div>)/g,"\n").replace(/(?:<br>)/g,"\n");
            tmp = tmp.replace(/(?:<div>)/g,"").replace(/(?:<\/div>)/g,"");
            if (!(/[^\s]/g).test(tmp)){
                $("#chatInputTextarea").text("");

                blinkNote("不要发送空白消息哇>_<...");
                $("#chatInputTextarea").focus();
                return;
            }
            /*验证一下好友*/
            if(type == "couple"){
                for(var i in chatDbm["friendList"]){
                    if(sid == chatDbm["friendList"][i]["sid"]){
                        if(chatDbm["friendList"][i]["name"] == "系统"){
                            blinkNote("暂不支持给 系统 发送消息。");
                            return;
                        }
                        if( chatDbm["friendList"][i]["state"] != "ready"){
                            blinkNote("抱歉，你们不再是好友了，请重新添加。");
                            return;
                        }
                    }
                }
            }else{/*验证一下自己是否还是该组的成员*/
                var isGroupMenber =false;
                for(var i in chatDbm["groupList"]){
                    if(sid== chatDbm["groupList"][i]["sid"]){
                        for(var j in chatDbm["groupList"][i]["members"]){
                            if(g_chatUid == chatDbm["groupList"][i]["members"][j]["uid"]){
                                isGroupMenber = true;
                                break;
                            }
                        }
                        if(!isGroupMenber){
                            blinkNote("抱歉，您已不再是该组成员");
                            return;
                        }
                    }
                }
            }
            /*将表情转换为指定格式*/
            //sMsg = sMsg.replace(/<img src="http:\/\/ctc.qzonestyle.gtimg.cn\/qzone\/em\/(e1[0-8][0-9]).gif">/g, "[$1]");
            sMsg = sMsg.replace(/<img src="\.\.\/image\/emotion\/(em1[0-2][0-9]).gif">/g, "[$1]");
            /*字符过多提示无法发送*/
            if(!image && sMsg.length>300){
                blinkNote("这位客官您写的太多了...");
                return false;
            }
            socket.emit("message",{msg:escape(sMsg),oprSn:0,sid:sid,type:type},function(data){
                console.log("message_"+JSON.stringify(data));
                if(data["result"] == "success"){
                    $("#chatInputTextarea").text("");

                    var date = data["body"]["time"];
                    var mid = data["body"]["mid"];

                    /*设置时间*/
                    setMsgDate(date);

                    var msgString = chatPrepareMsgRecordString(g_chatUserName,date, sMsg, mid, type,g_chatUid);
                    $("#chatDialogEntityContentAuto").append(msgString);
                    chatDialogTurnToBottom();

                    /*如果是组找到自己在组内的昵称,单对单无所谓*/
                    var author;
                    for(var k in chatDbm["groupList"]){
                        if(sid == chatDbm["groupList"][k]["sid"]){
                            for(var g in chatDbm["groupList"][k]["members"]){
                                if(g_chatUid == chatDbm["groupList"][k]["members"][g]["uid"]){
                                    author = chatDbm["groupList"][k]["members"][g]["nickname"];
                                }
                            }
                        }
                    }
                    chatSaveMsgRecord("msg",sid,g_chatUid, date,sMsg, mid, true,author);

                    /*更改缩略页面*/
                    if("mutiple"==type){
                        sMsg = g_chatUserName+"："+sMsg;
                    }
                    updataDialogSum(sid, undefined, undefined, date, sMsg);

                    /*将缩略对话框放在最上面*/
                    sortDialogSumLink(sid);
                }else{
                    alert("发送消息失败，原因："+data["body"]["reason"]);
                }
            })
        }

        /*将缩略对话框放在最上面*/
        function sortDialogSumLink(sid){
            if(sid != $("#chatNavEntityDialogSum").children(":first").attr("sid")){
                var dialogSumLinkStr = $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']");
                $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").remove();
                $("#chatNavEntityDialogSum").prepend(dialogSumLinkStr);
            }
        }

        /*更新缩略页面信息*/
        function updataDialogSum(sid ,title, count, date, msg){
            var a = $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']");
            if(title){
                a.find("pre[class=chatDialogSumTitle]").text(title);
            }
            if(count!=undefined){
                if(count){
                    a.find("pre[class=chatDialogSumCount]").text("("+count+"条)");
                }else{
                    a.find("pre[class=chatDialogSumCount]").text("");
                }
            }
            if(date){
                //var formatDate = new Date(date).format("hh:mm");
                calcSumDialogTime(date,function(date){
                    a.find("pre[class=chatDialogSumTime]").text(date);
                });

            }
            if(msg){
                //msg = msg.replace(/\[(e1[0-8][0-9])]/g, "<img src=\"http:\/\/ctc.qzonestyle.gtimg.cn\/qzone\/em\/$1.gif\">");
                msg = msg.replace(/\[(em1[0-2][0-9])]/g, "<img src=\"..\/image\/emotion\/$1.gif\">");
                a.find("pre[class=chatDialogSumMsg]").text("").append(msg);
            }
        }

        function calcSumDialogTime(date,cback){
            var newData = new Date();
            newData.setHours(0);
            newData.setMinutes(0);
            newData.setSeconds(0);
            newData.setMilliseconds(0);

            var milliseconds1Day = 24 * 60 * 60 * 1000;
            var msgT = Date.parse(date);
            var zeroT = Date.parse(newData);
            if(msgT - zeroT >  milliseconds1Day || zeroT - msgT > 6 * milliseconds1Day){
                /*显示具体时间*/
                var formatDate = new Date(date).format("yy/MM/dd");
                cback(formatDate);

                return;
            }else if(msgT - zeroT < milliseconds1Day && msgT - zeroT >0){
                /*显示为今天 */
                var formatDate = new Date(date).format("hh:mm");
                cback(formatDate);

                return;
            }else if(zeroT - msgT < milliseconds1Day && zeroT - msgT >0){
                /*显示为昨天 */
                cback("昨天");

                return;
            }else{
                /*显示为星期 */
                var dayNames = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
                var weak = dayNames[new Date(date).getDay()];

                cback(weak);
            }
        }

        /*处理收到别人加我为好友的请求*/
        function procRcvAddFriendPush(data){
            if(data["result"] != "success"){
                return;
            }
            var alreadyExist = false;
            var sid = data["body"]["sid"];
            var uid = data["body"]["uid"];
            var user = data["body"]["user"];
            var fname = data["body"]["fname"];
            var fuid = data["body"]["fuid"];
            var date = data["body"]["time"];
            var state = data["body"]["state"];
            /*查找是已经存在该用户的信息，如没有则添加*/
            $("#chatNewFriendListContent pre").each(function(){
                if($(this).text() == user){
                    alreadyExist = true;
                    return;
                }
            })
            if(alreadyExist){
                return;
            }

            var stringNewFriend = createNewFriendAddString(uid ,user);
            $("#chatNewFriendListContent").append(stringNewFriend);

            (function (uid){
                socket.emit("userPhotoGet",{uid:uid},function(data){
                    if(data["result"]=="success"){
                        var pid=data["body"]["photoid"]
                        convertHeadImg(data["body"]["image"],function(img){
                            $("#chatNewFriendListContent").find("a[uid='"+uid+"']").find(".chatNewFriendPortrait").attr("src", img);
                            chatDbm["userHeadImg"][uid] = {photoid:pid,image:img};
                        })
                    }
                })
            })(uid);
            for(var i in chatDbm["friendList"]){
                if(chatDbm["friendList"][i]["uid"] == uid){
                    chatDbm["friendList"].splice(i,1);
                }
            }

            chatDbm["friendList"].push({name:user,uid:uid,sid:"",state:"wait_me"});
            newFriendRedPointToggel();
            showFriendEntryRedPoint();
        }

        /*收到对方删除我的通知*/
        function procRcvFriendDelPush(data){
            if(data["result"] != "success"){
                return;
            }
            var uid = data["body"]["uid"];
            var user = data["body"]["user"];
            var fname = data["body"]["fname"];
            var fuid = data["body"]["fuid"];
            var date = data["body"]["time"];
            var state = data["body"]["state"];
            /*主动*/
            if(uid ==g_chatUid){
                var sid;
                /*找到SID*/
                for(var i in chatDbm["friendList"]){
                    if(fuid==chatDbm["friendList"][i]["uid"]){
                        sid = chatDbm["friendList"][i]["sid"];
                    }
                }
                /*将他从好友列表数据中移除*/
                for(var j in chatDbm["friendList"]){
                    if(fuid==chatDbm["friendList"][j]["uid"]){
                        //chatDbm["friendList"].splice(j,1);
                        chatDbm["friendList"][j]["state"] = "deleted";
                    }
                }

                /*将我和他的聊天记录清除*/
                chatDbm["msgRecord"][sid]="";

                /*将他的缩略会话删除*/
                $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").remove();

                /*将我和他的对话框删除*/
                if($("#chatDialogContent").attr("sid") == sid && $("#chatDialogSumEntryLink").hasClass("atv")){
                    $("#chatDialogContent").hide();
                    $("#chatWelcomeContent").show();
                }

                /*将他的好友列表删除*/
                $("#chatNavEntityFriendList").find("a[uid='"+fuid+"']").remove();

                /*将他的好友信息页面删除*/
                if($("#chatFriendInfoContent").attr("uid") == fuid && $("#chatFriendListEntryLink").hasClass("atv")){
                    $("#chatFriendInfoContent").hide();
                    $("#chatWelcomeContent").show();
                }

            }else{
                /*将这厮从我的好友列表数据结构中删除*/
                for(var i in chatDbm["friendList"]){
                    if(chatDbm["friendList"][i]["uid"] == uid){
                        //chatDbm["friendList"].splice(i,1);
                        chatDbm["friendList"][i]["state"] = "deleted";
                    }
                }
                /*将这厮从我的好友列表中删除*/
                if($("#chatNavEntityFriendList").find("a[uid='"+uid+"']").hasClass("atv")){
                    $("#chatFriendInfoContent").hide();
                    $("#chatWelcomeContent").show();
                }
                $("#chatNavEntityFriendList").find("a[uid='"+uid+"']").remove();
            }
            chatFriendNameSort();
        }

        /*处理我加对方后对方接受时推送给我的消息*/
        function procRcvAcceptPush(data){
            if(data["result"] != "success"){
                return;
            }
            var sid = data["body"]["sid"];
            var uid = data["body"]["uid"];
            data["body"]["user"] = unescape(data["body"]["user"]);
            var user = data["body"]["user"];
            var fname = data["body"]["fname"];
            var fuid = data["body"]["fuid"];
            var date = data["body"]["time"];
            var state = data["body"]["state"];

            /*主动*/
            if(uid==g_chatUid){
                /*需要将原来的WAIT_ME给删除掉*/
                for(var i in chatDbm["friendList"]){
                    if(chatDbm["friendList"][i]["uid"] == fuid){
                        chatDbm["friendList"].splice(i,1);
                    }
                }
                chatDbm["friendList"].push({sid:sid,uid:fuid,name:fname,state:state});
                var friendListStr = createFriendListString(sid, fuid, fname);
                $("#chatFriendListFriendContent").append(friendListStr);
                /*创建一个提示 我们是好朋友了*/
                if($("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").length ==0){
                    var dialogSumStr = createDialogCoupleSumString(sid, fname, fuid);
                    $("#chatNavEntityDialogSum").prepend(dialogSumStr);
                }

                var msg = "我们已经是好朋友了，开始聊天吧！";
                updataDialogSum(sid,undefined,undefined,date, msg );

                chatSaveSystemMsg("system",sid,msg,date,false);

                /*当前ENTITY页面可能就是与他聊天的页面*/
                if($("#chatDialogContent").attr("sid") == sid){
                    var str = createSystemInfoString(msg);
                    $("#chatDialogEntityContentAuto").append(str);
                    chatDialogTurnToBottom();
                }
                $("#chatNewFriendListContent").find("a[uid='"+fuid+"']").remove();
                newFriendRedPointToggel();
                chatFriendNameSort();
                chatDbm["userHeadImg"][uid]={photoid:"",image:g_chatDefaultHeadImg};
                (function (uid){
                    socket.emit("userPhotoGet",{uid:uid},function(data){
                        if(data["result"]=="success" && data["body"] && data["body"]["image"]){
                            var pid=data["body"]["photoid"]
                            convertHeadImg(data["body"]["image"],function(img){
                                chatDbm["userHeadImg"][uid]={photoid:pid,image:img};
                                $("#chatFriendListFriendContent").find("a[uid='"+uid+"']").find(".chatFriendListPortrait").attr("src",img);

                                /*更新缩略会话页面中的头像*/
                                for(var k in chatDbm["friendList"]){
                                    if(chatDbm["friendList"][k]["uid"] == uid){
                                        var sid=chatDbm["friendList"][k]["sid"];
                                        $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").find(".chatDialogSumPortrait").attr("src", img);
                                        break;
                                    }
                                }
                            })
                        }
                    })
                })(fuid);
            }else{
                for(var i in chatDbm["friendList"]){
                    if(chatDbm["friendList"][i]["uid"] == uid){
                        chatDbm["friendList"].splice(i,1);
                    }
                }
                chatDbm["friendList"].push({name:user,uid:uid,sid:sid,state:state});
                var friendListStr = createFriendListString(sid, uid, user);
                if(isKefu(user)){
                    $("#chatFriendListKefuContent").append(friendListStr);
                }else{
                    $("#chatFriendListFriendContent").append(friendListStr);
                }

                /*如果没有，添加缩略会话框*/
                if($("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").length == 0){
                    var dialogSumStr = createDialogCoupleSumString(sid, user, uid);
                    $("#chatNavEntityDialogSum").prepend(dialogSumStr);
                }

                var msg = "我们已经是好朋友了，开始聊天吧！";
                updataDialogSum(sid,undefined,undefined,date, msg );

                chatSaveSystemMsg("system",sid,msg,date,false);
                /*当前ENTITY页面可能就是与他聊天的页面*/
                if($("#chatDialogContent").attr("sid") == sid){
                    var msgString = createSystemInfoString(msg);
                    $("#chatDialogEntityContentAuto").append(msgString);
                    chatDialogTurnToBottom();
                }

                chatFriendNameSort();
                chatDbm["userHeadImg"][uid]={photoid:"",image:g_chatDefaultHeadImg};
                (function (uid){
                    socket.emit("userPhotoGet",{uid:uid},function(data){
                        if(data["result"]=="success" && data["body"] && data["body"]["image"]){
                            var pid=data["body"]["photoid"]
                            convertHeadImg(data["body"]["image"],function(img){
                                chatDbm["userHeadImg"][uid]={photoid:pid,image:img};
                                $("#chatFriendListFriendContent").find("a[uid='"+uid+"']").find(".chatFriendListPortrait").attr("src",img);
                                $("#chatFriendListKefuContent").find("a[uid='"+uid+"']").find(".chatFriendListPortrait").attr("src",img);
                                /*更新缩略会话页面中的头像*/
                                for(var k in chatDbm["friendList"]){
                                    if(chatDbm["friendList"][k]["uid"] == uid){
                                        var sid=chatDbm["friendList"][k]["sid"];
                                        $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").find(".chatDialogSumPortrait").attr("src", img);
                                        break;
                                    }
                                }
                            })
                        }
                    })
                })(uid);
            }
        }

        /*处理收到创建组的推送信息*/
        function procRcvGroupCreatePush(data){
            if(data["result"] == "success"){
                /*创建群列表*/
                var sid=data["body"]["sid"];
                data["body"]["title"] = unescape(data["body"]["title"]);
                var title=data["body"]["title"];
                var date = data["body"]["date"];
                var groupListStr = createGroupListString(sid, title);
                $("#chatFriendListGroupContent").append(groupListStr);

                /*创建群缩略会话*/
                var sumDialogStr = createDialogMutipleSumString(sid,title);
                $("#chatNavEntityDialogSum").prepend(sumDialogStr);

                /*准备系统提示信息并保存至消息记录结构中*/
                var owneruid = data["body"]["owner"];
                var msg;
                var sureMember = [];
                /*当多个相同账号登录时有可能收到自己创建群的消息*/
                if(owneruid == g_chatUid){
                    for(var i in data["body"]["members"]){
                        if( data["body"]["members"][i]["uid"] != g_chatUid){
                            sureMember.push( data["body"]["members"][i]["nickname"]);
                        }
                    }
                    msg = "您将 "+sureMember.toString()+" 加入了群聊。";
                    updataDialogSum(sid, undefined, undefined,date,"系统："+msg);
                } else{
                    var ownerNickName;
                    for(var i=0 in  data["body"]["members"]){
                        /*找到OWNER*/
                        if(data["body"]["members"][i]["uid"]==owneruid){
                            ownerNickName = data["body"]["members"][i]["nickname"];
                        }
                        /*将自己从MEMBERS中摘除*/
                        if(data["body"]["members"][i]["uid"] != g_chatUid && data["body"]["members"][i]["uid"] != owneruid){
                            var nickname = data["body"]["members"][i]["nickname"];
                            sureMember.push(nickname);
                        }
                    }

                    msg = ownerNickName +" 将您加入群会话，其他成员还有 "+sureMember.toString();

                    updataDialogSum(sid, undefined, 1,date,"系统："+msg);
                    newMsgRedPointToggel();
                    titleBadgeToggel();
                    chatNewMsgSoundPlay();
                }
                chatSaveSystemMsg("system",sid,msg,date,false);

                chatDbm["groupList"].push(data["body"]);
                groupNoteLableToggle();

                /*获取组成员的头像并更新*/
                updataGroupHeadImgForOneGroup(sid);

            }
        }

        /*处理收到群成员添加的推送的消息*/
        function procRcvGroupAddUserPush(data){
            if(data["result"]!="success"){
                return;
            }
            var sid = data["body"]["sid"];
            var actor = data["body"]["actor"];
            var date = data["body"]["date"];
            var members = data["body"]["members"];
            var title = "";
            var groupinfo = data["body"]["groupinfo"];

            /*actor是自己*/
            if(actor == g_chatUid){
                groupAddUserOwnerProc(sid, members,date);
                return;
            }
            /*查看该SID是否是自己组列表中的*/
            var isTarget = false;
            for(var i in members){
                if(g_chatUid == members[i]["uid"]){
                    isTarget = true;
                    break;
                }
            }

            if(isTarget){
                groupAddUserNewUserProc(actor, sid, members, date, groupinfo);
            }else {
                groupAddUserMenberProc(actor, sid, members, date);
            }
        }

        /*处理收到群成员删除的推送的消息*/
        function procRcvGroupDelUserPush(data){
            if(data["result"]!="success"){
                return;
            }
            var sid = data["body"]["sid"];
            var date = data["body"]["date"];
            var actor = data["body"]["actor"]
            var members = data["body"]["members"];

            if(actor == g_chatUid){
                groupDelUserOwnerProc(sid,members, date);
            }else{
                var isTarget = false;
                for(var i in members){
                    if(g_chatUid == members[i]["uid"]){
                        isTarget = true;
                        break;
                    }
                }
                if(isTarget){
                    groupDelUserTargetProc(sid, members, date);
                }else{
                    groupDelUserMemberProc(sid, members, date);
                }
            }
        }

        /*处理收到的离开组推送信息*/
        function procRcvLeaveGroupPush(data){
            if(data["result"] == "success"){
                var sid = data["body"]["sid"];
                var date = data["body"]["date"];
                var leaverUid = data["body"]["leaveruid"];
                data["body"]["title"] = unescape(data["body"]["title"]);
                var title =data["body"]["title"];
                var leaverName = "";
                var oldOwnerUid;
                if(leaverUid == g_chatUid){
                    for(var i in chatDbm["groupList"]){
                        if(sid == chatDbm["groupList"][i]["sid"]){
                            chatDbm["groupList"].splice(i,1);
                        }
                    }
                    /*将他的缩略会话删除*/
                    $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").remove();

                    /*将他从好友列表删除*/
                    $("#chatNavEntityFriendList").find("a[sid='"+sid+"']").remove();

                    /*dialogEntity页面可能就是当前SID页面*/
                    if($("#chatDialogContent").attr("sid") == sid){
                        $("#chatDialogContent").hide();
                        $("#chatWelcomeContent").show();
                    }
                    /*当前的右页面可能就是SID页面*/
                    if($("#chatGroupInfoContent").attr("sid")== sid){
                        $("#chatGroupInfoContent").hide();
                        $("#chatWelcomeContent").show();
                    }
                }else{
                    /*找到是谁离开了*/
                    for(var j in chatDbm["groupList"]){
                        if(sid == chatDbm["groupList"][j]["sid"]){
                            oldOwnerUid = chatDbm["groupList"][j]["owner"];
                            for(var k in  chatDbm["groupList"][j]["members"]){
                                if(leaverUid == chatDbm["groupList"][j]["members"][k]["uid"]){
                                    leaverName = chatDbm["groupList"][j]["members"][k]["nickname"];
                                    break;
                                }
                            }
                        }
                        if(leaverName){
                            break;
                        }
                    }

                    /*更新组信息*/
                    for(var i in chatDbm["groupList"]){
                        if(sid == chatDbm["groupList"][i]["sid"]){
                            chatDbm["groupList"].splice(i,1);
                            break;
                        }
                    }
                    delete data["body"]["leaver"];
                    chatDbm["groupList"].push(data["body"]);

                    /*创建一个提示 谁离开了群*/
                    if($("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").length ==0){
                        var dialogSumStr = createDialogMutipleSumString(sid, title);
                        $("#chatNavEntityDialogSum").prepend(dialogSumStr);
                    }

                    var msg = leaverName+" 离开了该群";

                    chatSaveSystemMsg("system",sid,msg,date,false);

                    /*当前ENTITY页面可能就是与该群聊天的页面*/
                    if($("#chatDialogContent").attr("sid") == sid){
                        var str = createSystemInfoString(msg);
                        $("#chatDialogEntityContentAuto").append(str);
                        chatDialogTurnToBottom();
                    }
                    updataDialogSum(sid,undefined,undefined,date, msg );

                    /*群INFO页面可能就是该页面*/
                    if($("#chatGroupInfoContent").attr("sid") == sid){
                        $("#chatGroupInfoMenbersContent").find("a[uid ='"+leaverUid+"']").remove();

                        /*如果离开的是OWNER*/
                        if(oldOwnerUid == leaverUid){
                            var newOwnerUid = data["body"]["owner"];
                            for(var g in  data["body"]["members"]){
                                if(newOwnerUid == data["body"]["members"][g]["uid"]){
                                    var newOwnerName =data["body"]["members"][g]["nickname"];
                                }
                            }
                            $("#chatGroupInfoMenbersContent").find("a[uid ='"+newOwnerUid+"']").remove();
                            var ownerStr = createGroupOwnerString(newOwnerName,newOwnerUid);
                            /*如果自己成了OWNER*/
                            if(g_chatUid == data["body"]["owner"]){
                                $("#chatEditTitleLink").show();
                                var groupDelStr = createGroupDelUserString(sid);
                                $(groupDelStr).insertAfter($("#chatGroupAddUserLink"));
                                $(ownerStr).insertAfter($("#chatGroupDelUserLink"));
                            }else{
                                $(ownerStr).insertAfter($("#chatGroupAddUserLink"));
                            }
                        }
                    }
                    updataGroupHeadImgForOneGroup(sid);
                }
            }
        }

        /*收到修改群名推送消息*/
        function procRcvChangeGroupTitlePush(data){
            if(data["result"]!="success"){
                return;
            }
            var title = unescape(data["body"]["title"]);
            var sid = data["body"]["sid"]
            for(var i in chatDbm["groupList"]){
                if(data["body"]["sid"] == chatDbm["groupList"][i]["sid"]){
                    chatDbm["groupList"][i]["title"] = title;
                }
            }
            /*修改组列表中的TITLE*/
            $("#chatNavEntityFriendList").find("a[sid='"+sid+"']").find(".chatFriendListName").text(title);

            /*修改群INFO中的TITLE*/
            if(sid == $("#chatGroupInfoContent").attr("sid")){
                $("#chatGroupInfoTitle").text(title);
            }

            /*修改缩略页面中的TITLE*/
            $("#chatNavEntityDialogSum").find("a[sid='"+sid+"']").find(".chatDialogSumTitle").text(title);

            /*修改对话框中的TITLE*/
            if(sid==$("#chatDialogContent").attr("sid")){
                $("#chatDialogTitle").text(title);
            }
        }

        /*处理收到消息推送*/
        function procRcvMsgPush(data){
            procRcvMsgSync(data);
        }

        /*处理好友头像变更事件*/
        function procRcvHeadImgChgPush(data){
            if(data["result"]=="success"){
                var uid=data["body"]["uid"];
                socket.emit("userPhotoGet",{uid:uid},function(data){
                    if(data["result"]=="success" && data["body"]["photoid"] && data["body"]["image"]){
                        var pid=data["body"]["photoid"];
                        convertHeadImg(data["body"]["image"],function(img){
                            chatDbm["userHeadImg"][uid]={photoid:pid,image:img};
                            updateHeadImgForOneUser(uid);
                            updateGroupHeadImgForOneUid(uid);
                        })
                    }
                })
            }
        }

        /*SOKIET.IO监听事件*/
        function chatClientListenSocket(){
            socket.on('connect', function(){
                console.log("connect");
                setConnectErrorInfoAndShow("正在认证...");

                var para = {
                    chatid: g_sessionId,
                    query: false
                };

                console.log("session id: %s", g_sessionId);

                socket.emit('authentication', para, function(aa){
                //socket.emit('authentication', {chatid: g_sessionId,query:false}, function(aa){
                    console.log(aa);
                });
            })

            socket.on('unauthorized', function(info) {
                console.log("authorized failed: %s", info && info.message);
            })

            socket.on('authenticated', function(info){
                console.log("authentication_" + info);
                if(info){
                    settConnectErrorInfoHide();
                    /*获取自己的信息*/
                    socket.emit("getselfinfo",{}, function(data){
                        console.log("getselfinfo_"+JSON.stringify(data));
                        g_chatUserName = data["name"];
                        g_chatUid = data["uid"];
                        $("#chatMyName").text(g_chatUserName);
                        $("#chatLocalHeadimg").attr("headimg_uid", g_chatUid);
                        $("#chatLocalBigHeadimg").attr("headimg_uid", g_chatUid);
                        chatDbm["userHeadImg"][g_chatUid]={photoid:"",image:g_chatDefaultHeadImg};

                        /*获取好友列表*/
                        socket.emit("friendsync", {addkefu:true},function(data){
                            console.log("friendsync_"+JSON.stringify(data));
                            if(procRcvFriendList(data)){
                                chatFriendNameSort();
                                /*获取组列表信息*/
                                socket.emit("groupsync",{}, function(data){
                                    console.log("groupsync_"+JSON.stringify(data));
                                    if(procRcvGroupList(data)){
                                        socket.emit("msgSync",{}, function (data){
                                            console.log("msgSync_"+JSON.stringify(data));
                                            if(procRcvMsgSync(data)){
                                                getFriendsHeadImg();
                                            }else{
                                                alert("获取消息失败！")
                                            }
                                        })
                                    }else{
                                        alert("获取组列表失败！");
                                    }
                                })
                            }else{
                                alert("获取好友列表失败！");
                            }
                        })
                    })
                }
                else{
                    setConnectErrorInfoAndShow("认证失败...");
                }
            })
            socket.on("connecting",function(){
                console.log("connecting");
                setConnectErrorInfoAndShow("正在连接...");
            })
            socket.on("connect_failed",function(){
                console.log("connect_failed");
                setConnectErrorInfoAndShow("连接失败！");
            })
            socket.on("reconnecting", function(){
                console.log("reconnectting");
                setConnectErrorInfoAndShow("正在重连...");
            })
            socket.on("reconnect", function(){
                console.log("reconnectting");
                setConnectErrorInfoAndShow("重连成功！");
            })
            socket.on("reconnect_failed", function(){
                console.log("reconnect_failed");
                setConnectErrorInfoAndShow("重连失败!");
            })
            socket.on("disconnect", function(msg){
                console.log("disconnect %s", msg);
                setConnectErrorInfoAndShow("连接断开!");
            })
            socket.on("friendAdd", function(data){
                console.log("friendAdd_"+ JSON.stringify(data));
                procRcvAddFriendPush(data);
            })
            socket.on("friendAccept", function(data){
                console.log("friendAccept_"+JSON.stringify(data));
                procRcvAcceptPush(data);
            })
            socket.on("friendDel", function (data){
                console.log("friendDel_"+JSON.stringify(data));
                procRcvFriendDelPush(data);
            })
            socket.on("groupCreate", function (data){
                console.log("groupCreate_"+JSON.stringify(data));
                procRcvGroupCreatePush(data);
            })
            socket.on("groupAddUser",function(data){
                console.log("groupAddUser_"+JSON.stringify(data));
                procRcvGroupAddUserPush(data);
            })
            socket.on("groupDelUser",function(data){
                console.log("groupDelUser_"+JSON.stringify(data));
                procRcvGroupDelUserPush(data);
            })
            socket.on("groupLeave", function(data){
                console.log("groupLeave_"+JSON.stringify(data));
                procRcvLeaveGroupPush(data);
            })
            socket.on("changeGroupTitle", function(data){
                console.log("changeGroupTitle_"+JSON.stringify(data));
                procRcvChangeGroupTitlePush(data);
            })
            socket.on("message", function(data){
                console.log("message_"+JSON.stringify(data));
                procRcvMsgPush(data);
            })
            socket.on("photoChg",function(data){
                console.log("photoChg_"+JSON.stringify(data));
                procRcvHeadImgChgPush(data);
            })
        }

        function connectServer(){
            //socket = io.connect("https://localChatTest.h3c.com:3011",{secure:true});
            socket = io.connect("https://lvzhourdchat.h3c.com",{forceNew:true, reconnectionDelay:3000, timeout:5000});
        }

        function getCookie(name) {
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }

        /*初始化提示模态框*/
        function initChatTipsModalDialog(){
            $("#chatTips").dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                //draggable:false,
                width:350,
                title:"温馨提示",
                height: 100,
                show: {
                    effect: "explode",
                    duration: 150
                },
                hide: {
                    effect: "explode",
                    duration: 300
                },
                open: function (event, ui) {
                    $(".ui-dialog-titlebar-close").hide();
                    //$(".ui-dialog-titlebar").addClass("chatTipsTitle");
                    $(".ui-dialog-titlebar").css("background-color","rgb(220, 124, 124)");
                }
            });
        }

        /*初始化离开模态框*/
        function initChatGroupLeaveConfirm(){
            $("#chatGroupLeaveConfirm").dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                //draggable:false,
                width:350,
                height: 140,
                title:"温馨提示",
                show: {
                    effect: "explode",
                    duration: 150
                },
                hide: {
                    effect: "explode",
                    duration: 300
                },
                open: function (event, ui) {
                    $(".ui-dialog-titlebar-close").hide();
                    //$(".ui-dialog-titlebar").addClass("chatGroupLeaveTitle");
                    $(".ui-dialog-titlebar").css("background-color","rgb(220, 124, 124)");
                }
            })
        }

        /*初始化删除好友模态框*/
        function initChatDelFriendConfirm(){
            $("#chatDelFriendConfirm").dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                //draggable:false,
                width:350,
                height: 140,
                title:"温馨提示",
                show: {
                    effect: "explode",
                    duration: 150
                },
                hide: {
                    effect: "explode",
                    duration: 300
                },
                open: function (event, ui) {
                    $(".ui-dialog-titlebar-close").hide();
                    //$(".ui-dialog-titlebar").addClass("chatDelFriendTitle");
                    $(".ui-dialog-titlebar").css("background-color","rgb(220, 124, 124)");
                }
            })
        }
        /*初始化滚动条*/
        function initChatSlimscroll(){
            var chatIsLoadingMoreMsg =false;
            $('#chatDialogEntityContent').slimscroll({
                height: '385px',
                disableFadeOut: true
            }).bind('slimscrolling', function(e, pos) {
                if(pos == 0){
                    if(chatRecoverMsgIndex!=0 && chatIsLoadingMoreMsg ==false){
                        chatIsLoadingMoreMsg = true;
                        var oldHeight = $("#chatDialogEntityContentAuto").height();
                        $("#chatDialogEntityContentAuto").prepend("<div id='chatDialogLoadMoreContent'><img id='chatDialogLoadMoreJuHua' src='../login.gif'></div>");
                        setTimeout(function(){
                            loadMoreMsgRecord();
                            chatIsLoadingMoreMsg = false;
                            var newHeight = $("#chatDialogEntityContentAuto").height();
                            $('#chatDialogEntityContent').slimscroll({ scrollBy: newHeight- oldHeight-22});
                        },700)
                    }
                }
            });
            $('#chatNavEntityDialogSum').slimscroll({
                height: '504px',
                disableFadeOut: true
            });
            $('#chatNavEntityFriendList').slimscroll({
                height: '504px',
                disableFadeOut: true
            });
            $('#chatNewFriendListContent').slimscroll({
                height: '480px',
                disableFadeOut: true
            });
            $('#chatSearchEntityUserList').slimscroll({
                height: '504px',
                disableFadeOut: true
            });
            $('#chatInputTextarea').slimscroll({
                height: '79px',
                disableFadeOut: true
            });
        }
        function initToggle(){
            $('#collapseOne').collapse('hide');
            $('#collapseTwo').collapse('hide')
            $('#collapseThr').collapse('hide');
            $('#collapseOne').on('show.bs.collapse', function () {
                $("#chatGroupListToggleIcon").css("background-position","-270px -403px");
            })
            $('#collapseTwo').on('show.bs.collapse', function () {
                $("#chatKefuListToggleIcon").css("background-position","-270px -403px");
            })
            $('#collapseThr').on('show.bs.collapse', function () {
                $("#chatFriendListToggleIcon").css("background-position","-270px -403px");
            })
            $('#collapseOne').on('hide.bs.collapse', function () {
                $("#chatGroupListToggleIcon").css("background-position","-311px -403px");
            })
            $('#collapseTwo').on('hide.bs.collapse', function () {
                $("#chatKefuListToggleIcon").css("background-position","-311px -403px");
            })
            $('#collapseThr').on('hide.bs.collapse', function () {
                $("#chatFriendListToggleIcon").css("background-position","-311px -403px");
            })
        }
        function init(){
            //var array = getCookie("abcd1234");
            //console.log(array);
            //var account= $.cookie('abcd1234');
            //console.log(account);
            /*设置正在连接*/
            setConnectErrorInfoAndShow("正在连接...");
            g_sessionId=getSessionIdFromUrl("sessionid");
            connectServer();
            chatClientListenSocket();
            //$.get("/v3/web/cas_session", function(data) {
            //    g_chatUserName = data.user;
            ////    console.log("username = ", g_chatUserName);
            //
            //    $("#chatMyName").text(g_chatUserName);
            //})
            window.onbeforeunload = chatOnBeforUnload;
            window.onunload = function(){
                socket.close();
            }
            $("#chatNavEntityDialogSum").sortable();

            initChatSlimscroll();
            initChatTipsModalDialog();
            initChatGroupLeaveConfirm();
            initChatDelFriendConfirm();
            initToggle();

            chatfavicon = new Favico({
                animation:'popFade',
            });
        }

        /*时间格式化*/
        Date.prototype.format = function(format) {
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(), //day
                "h+" : this.getHours(), //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
            }
            if(/(y+)/.test(format))
                format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(format))
                    format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        }

        /*消息太多提示*/
        function showNote(note){
            $("#chatTips p").text(note);
            $( "#chatTips" ).dialog( "open" );
            //$("#chatEnterNote").text(note).show();
        }
        function hideNote(){
            $( "#chatTips" ).dialog( "close" );
            $("#chatInputTextarea").focus();
        }
        function blinkNote(note){
            showNote(note);
            setTimeout(hideNote,1700);
        }

        /*新朋友小红点提示开关*/
        function newFriendRedPointToggel(){
            if($("#chatNewFriendListContent a").length != 0){
                $("#chatNewFriendRedPoint").show();
                $("#chatNewFriendLabel").show();
                $("#chatNewFriendEntryLink").show();
            }else{
                $("#chatNewFriendRedPoint").hide();
                $("#chatNewFriendLabel").hide();
                $("#chatNewFriendEntryLink").hide();
            }
        }

        /*好友小红点提示开关*/
        function showFriendEntryRedPoint(){
            if(!$("#chatFriendListEntryLink").hasClass("atv")){
                $("#chatFriendRedPoint").show();
            }
        }

        /*新消息小红点提示开关*/
        function newMsgRedPointToggel(){
            var count = 0;
            $("#chatDialogRedPoint").hide();
            /*会话链接不是ACTIVE的时候收到消息 显示红点*/
            if(!$("#chatDialogSumEntryLink").hasClass("atv")){
                $("#chatDialogRedPoint").show();
                return;
            }
            $("#chatNavEntityDialogSum .chatDialogSumCount").each(function(){
                var sumContentStr = $(this).text();
                if(sumContentStr !=""){
                    count += parseInt(sumContentStr.match(/\d+/g)[0]);
                    if(count>0){
                        $("#chatDialogRedPoint").show();
                        return;
                    }
                }
            })
        }
        /*显示标题中的消息个数*/
        function titleBadgeToggel(){
            var count = 0;
            $("#chatNavEntityDialogSum .chatDialogSumCount").each(function(){
                var sumContentStr = $(this).text();
                if(sumContentStr !=""){
                    count += parseInt(sumContentStr.match(/\d+/g)[0]);
                }
            })
            if(chatFaviconCount != count){
                chatfavicon.badge(count);
                chatFaviconCount = count;
            }
        }

        /*监听页面刷新及关闭事件*/
        function chatOnBeforUnload(){
            return "";
        }

        /*新消息提示音*/
        function chatNewMsgSoundPlay(){
            $("#chatMsgSoundInfo")[0].play();
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
        function getSessionIdFromUrl(key) {
            var href = window.document.location.href;
            if (href.indexOf("?") != -1) {
                var paramStr = href.substring(href.indexOf("?") + 1, href.length);
                if (paramStr.indexOf(key + "=") != -1) {
                    paramStr = paramStr.substring(paramStr.indexOf(key + "="),
                        paramStr.length);
                    if (paramStr.indexOf("&") != -1) {
                        return paramStr.substring(paramStr.indexOf("=") + 1, paramStr
                            .indexOf("&"));
                    } else {
                        return paramStr.substring(paramStr.indexOf("=") + 1,
                            paramStr.length);
                    }
                } else {
                    return "";
                }
            }
        }
        function procDraft(_this){
            var msg = $("#chatInputTextarea")[0].innerHTML;
            if(msg.trim() !=""){
                $("#chatNavEntityDialogSum").find("a.atv").attr("draft",msg);
            }else{
                $("#chatNavEntityDialogSum").find("a.atv").attr("draft","");
            }
            var textarea = $("#chatInputTextarea");
            textarea.html("");
            if($(_this).attr("draft")){
                textarea.html($(_this).attr("draft"));
                po_Last_Div(document.getElementById("chatInputTextarea"));
                textarea.focus();
            }
        }
        function po_Last_Div(obj) {
            if (window.getSelection) {//ie11 10 9 ff safari
                obj.focus(); //解决ff不获取焦点无法定位问题
                var range = window.getSelection();//创建range
                range.selectAllChildren(obj);//range 选择obj下所有子内容
                range.collapseToEnd();//光标移至最后
            }
            else if (document.selection) {//ie10 9 8 7 6 5
                var range = document.selection.createRange();//创建选择对象
                //var range = document.body.createTextRange();
                range.moveToElementText(obj);//range定位到obj
                range.collapse(false);//光标移至最后
                range.select();
            }
        }

        /*发送本地图片*/
        $("#chatImageInput").change(function(event){
            var file=this.files[0];
            if(file == undefined || !(/.(?:jpg|png|gif|JPG|JPEG|PNG|GIF)$/.test(file.name))){
                $("#chatImageInput").val("");
                blinkNote("请选择图片，不要选择奇奇怪怪的文件(⊙﹏⊙)b");
                return;
            }
            if(file.size > 1024*1024){
                $("#chatImageInput").val("");
                blinkNote("发送的图片太大啦~");
                return;
            }
            blinkNote("图片正在发送请稍候...");
            var reader=new FileReader();
            reader.onload=function(){
                var image = '<img src="' + reader.result + '">';
                //var image = '<img class="chatInsertImage" src="../image/emotion/em101.gif" style="max-height: 200px;max-width: 200px" >';
                //$("#chatInputTextarea").append(image);
                //$(".chatInsertImage").attr("src", reader.result);

                chatSendProc(image);
                $("#chatImageInput").val("");
                //g_component.resizeableImage($('.chatInsertImage'));
            };
            reader.readAsDataURL(file);
        });
    })

})(jQuery);

