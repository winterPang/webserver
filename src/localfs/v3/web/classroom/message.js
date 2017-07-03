;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".message";

    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("device_rc",sRcName);
    }

    function showParentInfo(){
        function cancelFun(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#parent_form")));
        }
        $("#parent_form").form ("init", "edit", {"title":getRcText("STATU_NAME"),
            "btn_apply":false, "btn_cancel":cancelFun/*CancelShop*/});
        $("input[type=text]",$("#parent_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        Utils.Base.openDlg(null, {}, {scope:$("#parentDlg"),className:"modal-small"});

        var parentName = $(this).attr("parentname");
        var parentRelate = $(this).attr("parentrelate");
        var parentPhone = $(this).attr("parentphone");
        $("#parentName1").html(parentName);
        $("#parentRelate").html(parentRelate);
        $("#parentPhone").html(parentPhone);

    }

    function initAddListen(){

    }


    function ChangeStuInfo(row, cell, value, columnDef, dataContext, type)
    {
        value = value ||"";
        if("text" == type)
        {
            return value;
        }

        return false;
    }

    //健康通知
    function initHealthOpt()
    {
        var oEditData = {};
        var oTempTableedit = {
            index: [],
            column: [
                'health_mesg',
                'health_mesg_api',
                'health_user_name',
                'secret_code',
                'health_auth',
                'clocktime'
            ]
        }
        //function refresh()
        //{
        //    initHealthMessage();
        //}
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#editHealthInfo_form")));
        }
        function editApp(oPara)
        {
            oStData = {
                health_mesg:$("#health_mesg").val(),
                health_mesg_api:$("#health_mesg_api").val(),
                health_user_name:$("#health_user_name").val(),
                secret_code:$("#secret_code").val(),
                health_auth: $("#health_auth").val(),
                clocktime:$("#clocktime").datetime("getTime")
            }
            var para = {};
            if(oStData.health_mesg == "")
            {
                para.messageName = "null";
            }else{
                para.messageName = oStData.health_mesg;
            }

            if(oStData.health_mesg_api == "")
            {
                para.messageAPI = "null";
            }else{
                para.messageAPI = oStData.health_mesg_api;
            }

            if(oStData.health_user_name == "")
            {
                para.userName = "null";
            }else{
                para.userName = oStData.health_user_name;
            }

            if(oStData.secret_code == "")
            {
                para.password = "null";
            }else{
                para.password = oStData.secret_code;
            }

            if(oStData.health_auth == "")
            {
                para.authority = "null";
            }else{
                para.authority = oStData.health_auth;
            }

            if($("#clocktime").datetime("getTime")=="")
            {
                para.publishTime = "null";
            }else{
                var date = (new Date()).getFullYear()+"/"+((new Date()).getMonth()+1)+"/"+((new Date()).getDate());
                var clock = $("#clocktime").datetime("getTime");
                var tpublishTime = date+"  "+clock;
                para.publishTime = (new Date(tpublishTime)).getTime();
            }

            var para1 = {};
            if(oEditData.health_mesg == "")
            {
                para1.messageName = "null";
            }else{
                para1.messageName = oEditData.health_mesg;
            }

            if(oEditData.health_mesg_api == "")
            {
                para1.messageAPI = "null";
            }else{
                para1.messageAPI = oEditData.health_mesg_api;
            }

            if(oEditData.health_user_name == "")
            {
                para1.userName = "null";
            }else{
                para1.userName = oEditData.health_user_name;
            }

            if(oEditData.secret_code == "")
            {
                para1.password = "null";
            }else{
                para1.password = oEditData.secret_code;
            }

            if(oEditData.health_auth == "")
            {
                para1.authority = "null";
            }else{
                para1.authority = oEditData.health_auth;
            }

            if(oEditData.clocktime == "")
            {
                para1.publishTime = "null";
            }else{
                //var tpublishTime = (new Date()).getFullYear()+"/"+((new Date()).getMonth()+1)+"/"+((new Date()).getDate())+""+$("#clocktime").datetime("getTime");
                para1.publishTime = oEditData.clocktime;
            }

            delEnterSchoolMesg(para1,para,addHealthEnterApp);
        }
        function addHealthEnterApp(oPara)
        {
            var oParam = {
                devSn:FrameInfo.ACSN
            };
            var para = {};
            var onAddSuc=function(aData){};
            var onAddFail=function(){};
            if($.isEmptyObject(oPara)) {
                //var oStData = $("#editHealthInfo_form").form("getTableValue", oTempTableedit);
                oStData = {
                    health_mesg:$("#health_mesg").val(),
                    health_mesg_api:$("#health_mesg_api").val(),
                    health_user_name:$("#health_user_name").val(),
                    secret_code:$("#secret_code").val(),
                    health_auth: $("#health_auth").val(),
                    clocktime:$("#clocktime").datetime("getTime")
                }

                if(oStData.health_mesg == "")
                {
                    para.messageName = "null";
                }else{
                    para.messageName = oStData.health_mesg;
                }

                if(oStData.health_mesg_api == "")
                {
                    para.messageAPI = "null";
                }else{
                    para.messageAPI = oStData.health_mesg_api;
                }

                if(oStData.health_user_name == "")
                {
                    para.userName = "null";
                }else{
                    para.userName = oStData.health_user_name;
                }

                if(oStData.secret_code == "")
                {
                    para.password = "null";
                }else{
                    para.password = oStData.secret_code;
                }

                if(oStData.health_auth == "")
                {
                    para.authority = "null";
                }else{
                    para.authority = oStData.health_auth;
                }

                if($("#clocktime").datetime("getTime")=="")
                {
                    para.publishTime = "null";
                }else{
                    var tpublishTime = (new Date()).getFullYear()+"/"+((new Date()).getMonth()+1)+"/"+((new Date()).getDate())+"  "+$("#clocktime").datetime("getTime");
                    para.publishTime = (new Date(tpublishTime)).getTime();
                }
                $.extend(oParam,para);
                onAddSuc=function(aData)
                {
                    if(aData.retCode != 0)
                    {
                        if(aData.retCode == -2)
                        {
                            Frame.Msg.info("健康消息已存在！");
                        }else{
                            Frame.Msg.info("新建健康消息失败！");
                        }
                        Utils.Base.refreshCurPage();
                        return;
                    }
                    //initEnterSchool();
                    Frame.Msg.info("新建健康消息成功！");
                    Utils.Base.refreshCurPage();
                    closeWindow();

                }
                onAddFail=function(){
                    Frame.Msg.info("新建健康消息失败！");
                    Utils.Base.refreshCurPage();
                    closeWindow();
                }
            }else{
                if(oPara.messageName == "")
                {
                    para.messageName = "null";
                }else{
                    para.messageName = oPara.messageName;
                }

                if(oPara.userName == "")
                {
                    para.userName = "null";
                }else{
                    para.userName = oPara.userName;
                }

                if(oPara.password == "")
                {
                    para.password = "null";
                }else{
                    para.password = oPara.password;
                }

                if(oPara.messageAPI == "")
                {
                    para.messageAPI = "null";
                }else{
                    para.messageAPI = oPara.messageAPI;
                }

                if(oPara.authority == "")
                {
                    para.authority = "null";
                }else{
                    para.authority = oPara.authority;
                }

                if(oPara.publishTime == "")
                {
                    para.publishTime = "null";
                }else{
                    para.publishTime = oPara.publishTime;
                }

                $.extend(oParam,oPara);
                onAddSuc=function(aData)
                {
                    if(aData.retCode != 0)
                    {
                        Frame.Msg.info("编辑健康消息失败！");
                        Utils.Base.refreshCurPage();
                        return;
                    }
                    //initEnterSchool();
                    Frame.Msg.info("编辑健康消息成功！");
                    Utils.Base.refreshCurPage();
                    closeWindow();

                }
                onAddFail=function(){
                    Frame.Msg.info("编辑健康消息失败！");
                    Utils.Base.refreshCurPage();
                    closeWindow();
                }
            }
            var option = {
                type:"POST",
                url:MyConfig.path+"/smartcampuswrite",
                contentType:"application/json",
                data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    Method:"addHealthNotice",
                    Param:oParam
                }),
                onSuccess:onAddSuc,
                onFailed:onAddFail
            }
            Utils.Request.sendRequest(option);
        }
        function delEnterSchoolMesg(para1,oPara,fAdd)
        {
            function onSuc(aData)
            {
                if(aData.retCode!=0)
                {
                   // console.log(aData.errorMsg);
		        return;

                }
                Utils.Base.refreshCurPage();
                if(fAdd) {
                    fAdd(oPara);
                }

            }
            var oParam = {
                devSn:FrameInfo.ACSN
            };
            $.extend(oParam,para1);
            var option = {
                type:"POST",
                url:MyConfig.path+"/smartcampuswrite",
                contentType:"application/json",
                data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    Method:"delHealthNotice",
                    Param:oParam
                }),
                onSuccess:onSuc,
                onFailed:function(){
                    debugger;
                }
            }
            Utils.Request.sendRequest(option);
        }

        function addAll(oParam)
        {

            function cancelFun()
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#editHealthInfo_form")));
            }
            if(oParam.length) {
                $("#editHealthInfo_form").form("init", "edit", {
                    "title": "编辑健康通知信息",
                    "btn_apply":editApp , "btn_cancel": cancelFun/*CancelShop*/
                });
                $("input[type=text]",$("#editHealthInfo_form")).each(function() {
                    Utils.Widget.setError($(this),"");
                });
                Utils.Base.openDlg(null, {}, {scope: $("#editHealthDlg"), className: "modal-large"});
                $('#editHealthDlg .info-explain[name=health_mesg_label]').attr("style","display:none");
                var messageName = oParam[0].messageName;
                var messageAPI = oParam[0].messageAPI;
                var userName = oParam[0].userName;
                var password = oParam[0].password;
                var authority = oParam[0].authority;
                var publishTime = oParam[0].publishTime;
                $("#health_mesg").addClass("required");
                $("#health_mesg").removeAttr("disabled");
                $("#health_mesg").val(messageName);
                $("#health_mesg_api").val(messageAPI);
                $("#health_user_name").val(userName);
                $("#secret_code").val(password);
                $("#health_auth").val(authority);
                $("#health_mesg").attr("disabled","disabled");
                if(publishTime) {
                    $("#clocktime").datetime("setTime", (new Date(publishTime)).getHours() + ":" + (new Date(publishTime)).getMinutes() + ":" + (new Date(publishTime)).getSeconds());
                }
                oEditData = {
                    health_mesg:messageName,
                    health_mesg_api:messageAPI,
                    health_user_name:userName,
                    secret_code:password,
                    health_auth:authority,
                    clocktime:publishTime
                }
                $("#health_mesg").attr("disabled","disabled");
                $("#health_mesg").removeClass("required");
            }else{
                $("#editHealthInfo_form").form("init", "edit", {
                    "title": "新建健康通知信息",
                    "btn_apply": addHealthEnterApp, "btn_cancel": cancelFun/*CancelShop*/
                });
                $("input[type=text]",$("#editHealthInfo_form")).each(function() {
                    Utils.Widget.setError($(this),"");
                });
                Utils.Base.openDlg(null, {}, {scope: $("#editHealthDlg"), className: "modal-large"});
                $('#editHealthDlg .info-explain[name=health_mesg_label]').attr("style","display:inline-block");
                $("#health_mesg").removeAttr("disabled");
                $("#health_mesg").addClass("required");
                $("#health_mesg").val("");
                $("#health_mesg_api").val("");
                $("#health_user_name").val("");
                $("#secret_code").val("");
                $("#health_auth").val("");
                $("#clocktime").datetime("setTime","00:00:00");

            }
        }

        function delAll(oParam)
        {
            Frame.Msg.confirm("是否确定删除健康消息?", function() {
            var oPara = {};
            if(!$.isEmptyObject(oParam[0]))
            {
                oPara.authority = oParam[0].authority ||"null";
                oPara.messageAPI=oParam[0].messageAPI||"null";
                oPara.password=oParam[0].password||"null";
                oPara.messageName=oParam[0].messageName||"null";
                oPara.publishTime=oParam[0].publishTime||"null";
                oPara.userName=oParam[0].userName||"null";
            }
            delEnterSchoolMesg(oPara)
            });
        }

        function format(row, cell, value, columnDef, dataContext, type)
        {
            value = value ||"";
            if("text" == type)
            {
                return value;
            }
            switch(cell) {
                case 3:
                    if(dataContext["password"]) {
                        return "<p>******</p>"
                    }else{
                        return "<p></p>"
                    }
                case 5:
                    if(dataContext["publishTime"]) {
                        var publishTime = getDoubleStr(new Date(dataContext["publishTime"]).getHours()) + ":" + getDoubleStr((new Date(dataContext["publishTime"])).getMinutes());
                        return "<p>" + publishTime + "</p>";
                    }else{
                        return "<p></p>";
                    }
                default:
                    return value;
            }
        }

        var opt = {
            colNames:"消息名称,消息接口,用户名,密码,鉴权方式,消息发布时间",
            showHeader: true,
            multiSelect: false,
            showOperation: true,
            pageSize: 10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                //if(oFilter){
                //    oFilter.messageNameWeak = oFilter.messageName?oFilter.messageName:"";
                //    oFilter.messageAPIWeak = oFilter.messageAPI?oFilter.messageAPI:"";
                //    oFilter.userNameWeak = oFilter.userName?oFilter.userName:"";
                //    oFilter.authorityWeak = oFilter.authority?oFilter.authority:"";
                //    oFilter.publishTimeWeak = oFilter.publishTime?oFilter.publishTime:"";
                //    delete oFilter.messageName;
                //    delete oFilter.messageAPI;
                //    delete oFilter.userName;
                //    delete oFilter.authority;
                //    delete oFilter.publishTime;
                //}
                initHealthMessage(pageNum,10,oFilter);
            },
            onSearch:function(oFilter,oSorter){
                //if(oFilter){
                //    oFilter.messageNameWeak = oFilter.messageName?oFilter.messageName:"";
                //    oFilter.messageAPIWeak = oFilter.messageAPI?oFilter.messageAPI:"";
                //    oFilter.userNameWeak = oFilter.userName?oFilter.userName:"";
                //    oFilter.authorityWeak = oFilter.authority?oFilter.authority:"";
                //    oFilter.publishTimeWeak = oFilter.publishTime?oFilter.publishTime:"";
                //    delete oFilter.messageName;
                //    delete oFilter.messageAPI;
                //    delete oFilter.userName;
                //    delete oFilter.authority;
                //    delete oFilter.publishTime;
                //}
                initHealthMessage(0,10,oFilter)
            },
            colModel:[
                {name: 'messageName', datatype: "String"},
                {name: 'messageAPI', datatype: "String"},
                {name:'userName',datatype:"String"},
                {name: 'password', datatype: "String",formatter:format},
                {name:'authority',datatype:"String"},
                {name: 'publishTime', datatype: "String",formatter:format}

            ],
            buttons: [
                {name:"add_button",value:"添加",icon:"slist-add",action:addAll},
                //{
                //    name: "refresh_button",
                //    value: "刷新",
                //    mode: Frame.Button.Mode.UPDATE,
                //    action: refresh
                //},
                {name: "edit", enable: true, action: addAll},
                {name: "delete", enable: true, action: delAll},
            ]
        }
        $("#healthList a.slist-button").removeAttr("href");
        $("#healthList").SList("head", opt);
    }

    //接入应用通知
    function initEnterAppOpt()
    {
        var oEditData = {};
        var oTempTableedit = {
            index: [],
            column: [
                'appname',
                'app_username',
                'app_password'
            ]
        }
        //function refresh()
        //{
        //    initEnterApp();
        //}
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#editEnAppDlg_form")));
        }
        function editApp(oPara)
        {
            var oStData = $("#editEnAppDlg_form").form("getTableValue", oTempTableedit);
            var para = {};
            if(oStData.appname == undefined)
            {
                para.applyName = "null";
            }else{
                para.applyName = oStData.appname;
            }

            if(oStData.app_username == undefined)
            {
                para.applyUsername = "null";
            }else{
                para.applyUsername = oStData.app_username;
            }

            if(oStData.app_password == undefined)
            {
                para.password = "null";
            }else{
                para.password = oStData.app_password;
            }

            var para1 = {};
            if(oEditData.appname == undefined)
            {
                para1.applyName = "null";
            }else{
                para1.applyName = oEditData.appname;
            }

            if(oEditData.app_username == undefined)
            {
                para1.applyUsername = "null";
            }else{
                para1.applyUsername = oEditData.app_username;
            }

            if(oEditData.app_password == undefined)
            {
                para1.password = "null";
            }else{
                para1.password = oEditData.app_password;
            }
            delEnterSchoolMesg(para1,para,addEnterApp);
        }
        function addEnterApp(oPara)
        {
            var oParam = {
                devSn:FrameInfo.ACSN
            };
            var para = {};
            var onAddSuc=function(aData){};
            var onAddFail=function(){};
            if($.isEmptyObject(oPara)) {
                var oStData = $("#editEnAppDlg_form").form("getTableValue", oTempTableedit);

                if(oStData.appname == undefined)
                {
                    para.applyName = "null";
                }else{
                    para.applyName = oStData.appname;
                }

                if(oStData.app_username == undefined)
                {
                    para.applyUsername = "null";
                }else{
                    para.applyUsername = oStData.app_username;
                }

                if(oStData.app_password == undefined)
                {
                    para.password = "null";
                }else{
                    para.password = oStData.app_password;
                }

                $.extend(oParam,para);

                onAddSuc = function(aData)
                {
                    if(aData.retCode != 0)
                    {
                        if(aData.retCode == -2)
                        {
                            Frame.Msg.info("接入应用已存在！");
                        }else{
                            Frame.Msg.info("新建接入应用失败！");
                        }
                        Utils.Base.refreshCurPage();
                        return;
                    }
                    //initEnterApp();
                    Frame.Msg.info("新建接入应用成功！");
                    Utils.Base.refreshCurPage();
                    closeWindow();
                }
                onAddFail=function(){
                    Frame.Msg.info("新建接入应用失败！");
                    Utils.Base.refreshCurPage();
                    closeWindow();
                }
            }else{
                if(oPara.applyName == undefined)
                {
                    para.applyName = "null";
                }else{
                    para.applyName = oPara.applyName;
                }

                if(oPara.applyUsername == undefined)
                {
                    para.applyUsername = "null";
                }else{
                    para.applyUsername = oPara.applyUsername;
                }

                if(oPara.password == undefined)
                {
                    para.password = "null";
                }else{
                    para.password = oPara.password;
                }

                $.extend(oParam,oPara);

                onAddSuc = function(aData)
                {
                    if(aData.retCode != 0)
                    {
                        Frame.Msg.info("编辑接入应用失败！");
                        Utils.Base.refreshCurPage();
                        return;
                    }
                    Frame.Msg.info("编辑接入应用成功！");
                    Utils.Base.refreshCurPage();
                    closeWindow();
                }
                onAddFail=function(){
                    Frame.Msg.info("编辑接入应用失败！");
                    Utils.Base.refreshCurPage();
                    closeWindow();
                }
            }
            var option = {
                type:"POST",
                url:MyConfig.path+"/smartcampuswrite",
                contentType:"application/json",
                data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    Method:"addApplyManage",
                    Param:oParam
                }),
                onSuccess:onAddSuc,
                onFailed:onAddFail
            }
            Utils.Request.sendRequest(option);
        }
        function delEnterSchoolMesg(para1,oPara,fAdd)
        {
            var oPara1 = {};
            if(!$.isEmptyObject(para1))
            {
                oPara1.applyName = para1.applyName ||"null";
                oPara1.applyUsername=para1.applyUsername||"null";
                oPara1.password=para1.password||"null";
            }
            function onSuc(aData)
            {
                if(aData.retCode!=0)
                {
                   // console.log(aData.errorMsg);
		        return;

                }
                Utils.Base.refreshCurPage();
                if(fAdd) {
                    fAdd(oPara);
                }

            }
            var oParam = {
                devSn:FrameInfo.ACSN
            };
            $.extend(oParam,oPara1);
            var option = {
                type:"POST",
                url:MyConfig.path+"/smartcampuswrite",
                contentType:"application/json",
                data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    Method:"delApplyManage",
                    Param:oParam
                }),
                onSuccess:onSuc,
                onFailed:function(){
                   
                }
            }
            Utils.Request.sendRequest(option);

        }

        function addAll(oParam)
        {

            function cancelFun()
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#editEnAppDlg_form")));
            }
            if(oParam.length) {
                $("#editEnAppDlg_form").form("init", "edit", {
                    "title": "编辑接入应用信息",
                    "btn_apply":editApp , "btn_cancel": cancelFun/*CancelShop*/
                });
                $("input[type=text]",$("#editEnAppDlg_form")).each(function() {
                    Utils.Widget.setError($(this),"");
                });
                Utils.Base.openDlg(null, {}, {scope: $("#editEnAppDlg"), className: "modal-large"});
                $('#editEnAppDlg .info-explain[name=appname_label]').attr("style","display:none");
                var appName = oParam[0].applyName;
                var appUserName = oParam[0].applyUsername;
                var appPassword = oParam[0].password;
                $("#appname").val(appName);
                $("#app_username").val(appUserName);
                $("#app_password").val(appPassword);
                oEditData = {
                    appname:appName,
                    app_username:appUserName,
                    app_password:appPassword
                }
                $("#appname").attr("disabled","disabled");
                $("#appname").removeClass("required");
            }else{
                $("#editEnAppDlg_form").form("init", "edit", {
                    "title": "新建接入应用信息",
                    "btn_apply": addEnterApp, "btn_cancel": cancelFun/*CancelShop*/
                });
                $("input[type=text]",$("#editEnAppDlg_form")).each(function() {
                    Utils.Widget.setError($(this),"");
                });
                Utils.Base.openDlg(null, {}, {scope: $("#editEnAppDlg"), className: "modal-large"});
                $('#editEnAppDlg .info-explain[name=appname_label]').attr("style","display:inline-block");
                $("#appname").removeAttr("disabled","disabled");
                $("#appname").addClass("required");
                $("#appname").val("");
                $("#app_username").val("");
                $("#app_password").val("");

            }
        }

        function delAll(oParam)
        {
            Frame.Msg.confirm("是否确定删除接入应用信息?", function() {
                var oPara = {};
                if(!$.isEmptyObject(oParam[0]))
                {
                    oPara.applyName = oParam[0].applyName ||"null";
                    oPara.applyUsername=oParam[0].applyUsername||"null";
                    oPara.password=oParam[0].password||"null";
                }
                delEnterSchoolMesg(oPara);
            });
        }

        function format1(row, cell, value, columnDef, dataContext, type)
        {
            value = value ||"";
            if("text" == type)
            {
                return value;
            }
            switch(cell) {
                case 2:
                    if(dataContext["password"]) {
                        return "<p>******</p>"
                    }else{
                        return "<p></p>"
                    }
                default:
                    return value;
            }
        }
        var opt = {
            colNames:"应用名称,应用用户名,密码",
            showHeader: true,
            multiSelect: false,
            showOperation: true,
            pageSize: 10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                //if(oFilter){
                //    oFilter.applyNameWeak = oFilter.applyName?oFilter.applyName:"";
                //    oFilter.applyUsernameWeak = oFilter.applyUsername?oFilter.applyUsername:"";
                //    delete oFilter.applyName;
                //    delete oFilter.applyUsername;
                //}
                initEnterApp(pageNum,10,oFilter);
            },
            onSearch:function(oFilter,oSorter){
                //if(oFilter){
                //    oFilter.applyNameWeak = oFilter.applyName?oFilter.applyName:"";
                //    oFilter.applyUsernameWeak = oFilter.applyUsername?oFilter.applyUsername:"";
                //    delete oFilter.applyName;
                //    delete oFilter.applyUsername;
                //}
                initEnterApp(0,10,oFilter);
            },
            colModel:[
                {name: 'applyName', datatype: "String"},
                {name: 'applyUsername', datatype: "String"},
                {name:'password',datatype:"String",formatter:format1}

            ],
            buttons: [
                {name:"add_button",value:"添加",icon:"slist-add",action:addAll},
                //{
                //    name: "refresh_button",
                //    value: "刷新",
                //    mode: Frame.Button.Mode.UPDATE,
                //    action: refresh
                //},
                {name: "edit", enable: true, action: addAll},
                {name: "delete", enable: true, action: delAll},
            ]
        }
        $("#enterAppList a.slist-button").removeAttr("href");
        $("#enterAppList").SList("head", opt);
    }

    //进出校通知
    function initEnterOpt(){
            var oTempTableedit = {
                index: [],
                column: [
                    'messageName',
                    'messageAPI',
                    'userName',
                    'password',
                    'authority'
                ]
            }
            var oEditData = {};
            function refresh()
            {
              initEnterSchool();
                //Utils.Base.refreshCurPage();
            }
            var closeWindow = function () {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addMessage_form")));
            }
            function editSchoolMesg(oPara)
            {
                var oStData = $("#addMessage_form").form("getTableValue", oTempTableedit);
                var para = {};
                var para1 = {};
                if(oStData.messageName == "")
                {
                    para.messageName = "null";
                }else{
                    para.messageName = oStData.messageName;
                }

                if(oStData.messageAPI == "")
                {
                    para.messageAPI = "null";
                }else{
                    para.messageAPI = oStData.messageAPI;
                }

                if(oStData.userName == "")
                {
                    para.userName = "null";
                }else{
                    para.userName = oStData.userName;
                }

                if(oStData.password == "")
                {
                    para.password = "null";
                }else{
                    para.password = oStData.password;
                }

                if(oStData.authority == "")
                {
                    para.authority = "null";
                }else{
                    para.authority = oStData.authority;
                }


                if(oEditData.messageName == "")
                {
                    para1.messageName = "null";
                }else{
                    para1.messageName = oEditData.messageName;
                }

                if(oEditData.messageAPI == "")
                {
                    para1.messageAPI = "null";
                }else{
                    para1.messageAPI = oEditData.messageAPI;
                }

                if(oEditData.userName == "")
                {
                    para1.userName = "null";
                }else{
                    para1.userName = oEditData.userName;
                }

                if(oEditData.password == "")
                {
                    para1.password = "null";
                }else{
                    para1.password = oEditData.password;
                }

                if(oEditData.authority == "")
                {
                    para1.authority = "null";
                }else{
                    para1.authority = oEditData.authority;
                }

                delEnterSchoolMesg(para1,para,addEnterSchoolMesg);
            }
            function addEnterSchoolMesg(oPara)
            {

                var oParam = {
                    devSn:FrameInfo.ACSN
                };
                var para = {};
                var onAddSuc=function(aData){};
                var onAddFail=function(){};
                if($.isEmptyObject(oPara)) {
                    var oStData = $("#addMessage_form").form("getTableValue", oTempTableedit);

                    if(oStData.messageName == "")
                    {
                        para.messageName = "null";
                    }else{
                        para.messageName = oStData.messageName;
                    }

                    if(oStData.messageAPI == "")
                    {
                        para.messageAPI = "null";
                    }else{
                        para.messageAPI = oStData.messageAPI;
                    }

                    if(oStData.userName == "")
                    {
                        para.userName = "null";
                    }else{
                        para.userName = oStData.userName;
                    }

                    if(oStData.password == "")
                    {
                        para.password = "null";
                    }else{
                        para.password = oStData.password;
                    }

                    if(oStData.authority == "")
                    {
                        para.authority = "null";
                    }else{
                        para.authority = oStData.authority;
                    }
                    $.extend(oParam,para)
                    onAddSuc=function(aData)
                    {
                        if(aData.retCode != 0)
                        {
                            if(aData.retCode == -2)
                            {
                                Frame.Msg.info("进出校通知已存在！");
                            }else{
                                Frame.Msg.info("新建进出校通知失败！");
                            }
                            Utils.Base.refreshCurPage();
                            return;
                        }
                        //initEnterSchool();
                        Frame.Msg.info("新建进出校通知成功！");
                        Utils.Base.refreshCurPage();
                        closeWindow();

                    }
                    onAddFail=function(){
                        Frame.Msg.info("新建进出校通知失败！");
                        Utils.Base.refreshCurPage();
                        closeWindow();
                    }
                }else{
                    if(oPara.messageName == "")
                    {
                        para.messageName = "null";
                    }else{
                        para.messageName = oPara.messageName;
                    }

                    if(oPara.messageAPI == "")
                    {
                        para.messageAPI = "null";
                    }else{
                        para.messageAPI = oPara.messageAPI;
                    }

                    if(oPara.userName == "")
                    {
                        para.userName = "null";
                    }else{
                        para.userName = oPara.userName;
                    }

                    if(oPara.password == "")
                    {
                        para.password = "null";
                    }else{
                        para.password = oPara.password;
                    }

                    if(oPara.authority == "")
                    {
                        para.authority = "null";
                    }else{
                        para.authority = oPara.authority;
                    }
                    $.extend(oParam,oPara);
                    onAddSuc=function(aData)
                    {
                        if(aData.retCode != 0)
                        {
                            Utils.Base.refreshCurPage();
                            Frame.Msg.info("编辑进出校通知失败！");
                            return;
                        }
                        //initEnterSchool();
                        Frame.Msg.info("编辑进出校通知成功！");
                        Utils.Base.refreshCurPage();
                        closeWindow();
                    }
                    onAddFail=function(){
                        Frame.Msg.info("编辑进出校通知失败！");
                        Utils.Base.refreshCurPage();
                        closeWindow();
                    }
                }
                var option = {
                    type:"POST",
                    url:MyConfig.path+"/smartcampuswrite",
                    contentType:"application/json",
                    data:JSON.stringify({
                        devSN:FrameInfo.ACSN,
                        Method:"addInOutNotice",
                        Param:oParam
                    }),
                    onSuccess:onAddSuc,
                    onFailed:onAddFail
                }
                Utils.Request.sendRequest(option);
            }
            function delEnterSchoolMesg(para1,oPara,fAdd)
            {
                function onSuc(aData)
                {
                    if(aData.retCode!=0)
                    {

                        Frame.Info.Msg("删除失败");
                    }
                    //initEnterSchool();
                    Utils.Base.refreshCurPage();
                    if(fAdd) {
                        fAdd(oPara);
                    }
                }
                var oParam = {
                    devSn:FrameInfo.ACSN
                };
                $.extend(oParam,para1);
                var option = {
                    type:"POST",
                    url:MyConfig.path+"/smartcampuswrite",
                    contentType:"application/json",
                    data:JSON.stringify({
                        devSN:FrameInfo.ACSN,
                        Method:"delInOutNotice",
                        Param:oParam
                    }),
                    onSuccess:onSuc,
                    onFailed:function(){
                        debugger;
                    }
                }
                Utils.Request.sendRequest(option);
            }
            function addAll(oParam)
            {

                function cancelFun()
                {
                    Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#addMessage_form")));
                }
                if(oParam.length) {
                    $("#addMessage_form").form("init", "edit", {
                        "title": "编辑进出校门通知",
                        "btn_apply": editSchoolMesg, "btn_cancel": cancelFun/*CancelShop*/
                    });
                    var mesgType = ['进校','出校'];
                    //$("#message_name").singleSelect("InitData",mesgType);
                    $("input[type=text]",$("#addMessage_form")).each(function() {
                        Utils.Widget.setError($(this),"");
                    });
                    Utils.Base.openDlg(null, {}, {scope: $("#editDlg"), className: "modal-large"});
                    $("#messageName_error").css({display:"none"});
                    $("#messageName").singleSelect("InitData",mesgType);
                    var messageName = oParam[0].messageName;
                    var messageAPI = oParam[0].messageAPI;
                    var userName = oParam[0].userName;
                    var password = oParam[0].password;
                    var authority = oParam[0].authority;
                    $("#messageName").singleSelect("value",messageName);
                    $("#s2id_messageName .select2-arrow b").attr("style","display:none");
                    $("#messageAPI").val(messageAPI);
                    $("#userName").val(userName);
                    $("#password").val(password);
                    $("#authority").val(authority);
                    $("#messageName").attr("disabled","disabled");
                    $("#messageName").removeClass("required");
                    oEditData = {
                        messageName:messageName,
                        messageAPI:messageAPI,
                        userName:userName,
                        password:password,
                        authority:authority
                    };
                }else{
                    $("#addMessage_form").form("init", "edit", {
                        "title": "新建进出校门通知",
                        "btn_apply":addEnterSchoolMesg, "btn_cancel": cancelFun/*CancelShop*/
                    });
                    var mesgType = ['进校','出校'];
                    //$("#message_name").singleSelect("InitData",mesgType);
                    $("input[type=text]",$("#addMessage_form")).each(function() {
                        Utils.Widget.setError($(this),"");
                    });
                    Utils.Base.openDlg(null, {}, {scope: $("#editDlg"), className: "modal-large"});
                    $("#messageName_error").css({display:"none"});
                    $("#s2id_messageName .select2-arrow b").attr("style","display:block");
                    $("#messageName").removeAttr("disabled","disabled");
                    $("#messageName").addClass("required");
                    $("#messageName").singleSelect("InitData",mesgType);
                    $("#messageName").singleSelect("value","");
                    $("#messageAPI").val("");
                    $("#userName").val("");
                    $("#password").val("");
                    $("#authority").val("");

                }
            }

            function delAll(oParam)
            {
                Frame.Msg.confirm("是否确定删除进出校信息?", function() {
                var oPara = {};
                if(!$.isEmptyObject(oParam[0]))
                {
                    oPara.messageName = oParam[0].messageName
                    oPara.messageAPI=oParam[0].messageAPI
                    oPara.userName=oParam[0].userName
                    oPara.password=oParam[0].password
                    oPara.authority=oParam[0].authority
                }
                delEnterSchoolMesg(oPara)
                });
            }

            function format2(row, cell, value, columnDef, dataContext, type)
            {
                value = value ||"";
                if("text" == type)
                {
                    return value;
                }
                switch(cell) {
                    case 3:
                        if(dataContext["password"]) {
                            return "<p>******</p>"
                        }else{
                            return "<p></p>"
                        }
                    default:
                        return value;
                }
            }

            var opt = {
                colNames: getRcText("STUDENT_LIST"),
                showHeader: true,
                multiSelect: false,
                showOperation: true,
                pageSize: 10,
                asyncPaging:true,
                onPageChange:function(pageNum,pageSize,oFilter){
                    //if(oFilter){
                    //    oFilter.messageNameWeak = oFilter.messageName?oFilter.messageName:"";
                    //    oFilter.messageAPIWeak = oFilter.messageAPI?oFilter.messageAPI:"";
                    //    oFilter.userNameWeak = oFilter.userName?oFilter.userName:"";
                    //    oFilter.authorityWeak = oFilter.authority?oFilter.authority:"";
                    //    delete oFilter.messageName;
                    //    delete oFilter.messageAPI;
                    //    delete oFilter.userName;
                    //    delete oFilter.authority;
                    //}
                    initEnterSchool(pageNum, 10, oFilter);
                },
                onSearch:function(oFilter,oSorter){
                    //if(oFilter){
                    //    oFilter.messageNameWeak = oFilter.messageName?oFilter.messageName:"";
                    //    oFilter.messageAPIWeak = oFilter.messageAPI?oFilter.messageAPI:"";
                    //    oFilter.userNameWeak = oFilter.userName?oFilter.userName:"";
                    //    oFilter.authorityWeak = oFilter.authority?oFilter.authority:"";
                    //    delete oFilter.messageName;
                    //    delete oFilter.messageAPI;
                    //    delete oFilter.userName;
                    //    delete oFilter.authority;
                    //}
                    initEnterSchool(0, 10, oFilter);
                },
                colModel:[
                    {name: 'messageName', datatype: "String"},
                    {name: 'messageAPI', datatype: "String"},
                    {name:'userName',datatype:"String"},
                    {name: 'password', datatype: "String",formatter:format2},
                    {name:'authority',datatype:"String"}

                ],
                buttons: [
                    {name:"add_btn",value:"添加",icon:"slist-add",action:addAll},
                    //{
                    //    name: "refresh_button",
                    //    value: "刷新",
                    //    mode: Frame.Button.Mode.UPDATE,
                    //    action: refresh
                    //},
                    {name: "edit", enable: true, action: addAll},
                    {name: "delete", enable: true, action: delAll},
                ]
            }
            $("#studentList a.slist-button").removeAttr("href");
            $("#studentList").SList("head", opt);
    }

    function initEnterApp(pageNum, pageSize, oFilter)
    {
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oParam = {
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10,
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam, oFilter);
        function onSuccess(aData)
        {
            if(aData.retCode != 0)
            {
                return;
            }
            var aResult = aData.result?aData.result:[];
            var aAppData=[];
            for(var i=0;i<aResult.data.length;i++){
                aResult.data[i].applyName=aResult.data[i].applyName!="null"?aResult.data[i].applyName:"";
                aResult.data[i].applyUsername=aResult.data[i].applyUsername!="null"?aResult.data[i].applyUsername:"";
                aResult.data[i].password=aResult.data[i].password!="null"?aResult.data[i].password:"";
                aAppData.push(aResult.data[i]);
            }

            $("#enterAppList").SList("refresh", {data: aAppData, total:aResult.rowCount});//aAppData
        }
        var opt = {
            type:"POST",
            url:MyConfig.path+'/smartcampusread',
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getApplyManage",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(opt);
    }

    function initEnterSchool(pageNum, pageSize, oFilter)
    {
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oParam = {
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10,
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam, oFilter);
        function onSuccess(aData)
        {
            if(aData.retCode != 0)
            {
                return;
            }
            var aResult = aData.result?aData.result:[];
            var aStudentData = aResult.data?aResult.data:[];
            $("#studentList").SList("refresh", {data:aStudentData, total:aResult.rowCount});
        }
        var opt = {
            type:"POST",
            url:MyConfig.path+'/smartcampusread',
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getInOutNotice",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(opt);
    }
    function getDoubleStr(num) {
        return num >= 10 ? num : "0" + num;
    }

    function initHealthMessage(pageNum, pageSize, oFilter)
    {
        var pageSize = pageSize || 10;
        var pageNum = pageNum || 1;
        var oFilter = oFilter || {};
        var oParam = {
            startRowIndex: 10 * (pageNum - 1),
            maxItem: 10,
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam, oFilter);
        function onSuccess(aData)
        {
            if(aData.retCode != 0)
            {
                return;
            }
            var aResult = aData.result?aData.result:[];
            var aHealthData=[];
            for(var i=0;i<aResult.data.length;i++){
                aResult.data[i].messageName=aResult.data[i].messageName!="null"?aResult.data[i].messageName:"";
                aResult.data[i].messageAPI=aResult.data[i].messageAPI!="null"?aResult.data[i].messageAPI:"";
                aResult.data[i].userName=aResult.data[i].userName!="null"?aResult.data[i].userName:"";
                aResult.data[i].password=aResult.data[i].password!="null"?aResult.data[i].password:"";
                aResult.data[i].authority=aResult.data[i].authority!="null"?aResult.data[i].authority:"";
                aResult.data[i].publishTime=aResult.data[i].publishTime!="null"?aResult.data[i].publishTime:"";
                aHealthData.push(aResult.data[i])
            }

            $("#healthList").SList("refresh", {data: aHealthData, total:aResult.rowCount});
        }
        var opt = {
            type:"POST",
            url:MyConfig.path+'/smartcampusread',
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"getHealthNotice",
                Param:oParam
            }),
            onSuccess:onSuccess,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(opt);
    }

    //function initSlistData(pageNum, pageSize, oFilter) {
    //    //monthType,schoolType,aGradeConf
    //    var pageSize = pageSize || 10;
    //    var pageNum = pageNum || 1;
    //    var oFilter = oFilter || {};
    //    var oParam = {
    //        startTime: 0,
    //        endtime: 0,
    //        startRowIndex: 10 * (pageNum - 1),
    //        maxItem: 10,
    //        //gradeType: schoolType
    //    }
    //    $.extend(oParam, oFilter);
    //
    //    $("#studentList").SList("refresh", {data: onlinedata, total: total});
    //
    //
    //}
    //
    //function initData(pageNum,pageSize,oFilter)
    //{
    //
    //    initSlistData(pageNum,pageSize,oFilter);
    //
    //}


    function initGrid()
    {
        initEnterAppOpt();
        initEnterOpt();
        initHealthOpt();
    }

    function initEvent()
    {

    }

    function _init ()
    {
        function setBreadContent(paraArr){
            
            $("#bread_index").css("display",'inline');
            $("#bread_index a").attr("href","#C_CDashboard");
            $("#bread_index a").text("网络管理");
            
            if(paraArr[0].text != ""){
                $("#bread_1").css("display",'inline');
                $("#bread_1 a").attr("href",paraArr[0].href);
                $("#bread_1 a").text(paraArr[0].text);
            }else{
                $("#bread_1").css("display",'none');
            }
            
            if(paraArr[1].text != ""){
                $("#bread_2").css("display",'inline');
                $("#bread_2 a").attr("href",paraArr[1].href);
                $("#bread_2 a").text(paraArr[1].text);
            }else{
                $("#bread_2").css("display",'none');
            }
            
            if(paraArr[2].text != ""){
                $("#bread_active").css("display",'inline');
                $("#bread_active").text(paraArr[2].text);
            }else{
                $("#bread_active").css("display",'none');
            }
        }
        setBreadContent([{text:'',href:''},
                        {text:'',href:''},
                        {text:'消息订阅',href:''}]);
        initGrid();
        ////假数据
        //var nData = [
        //    {'messageName':'进校','messageAPI':'http://lvzhou.h3c.com','username':'王校长','secret':'123456'},
        //    {'messageName':'出校','messageAPI':'http://lvzhou.h3c.com','username':'李校长','secret':'123456'},
        //    {'messageName':'进校','messageAPI':'http://lvzhou.h3c.com','username':'张校长','secret':'123456'},
        //    {'messageName':'出校','messageAPI':'http://lvzhou.h3c.com','username':'马校长','secret':'123456'}
        //];
        //
        //$("#studentList").SList("refresh", nData);
        initEnterApp();
        initEnterSchool();
        initHealthMessage();
    }

    function _destroy ()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput","Form","SingleSelect","DateRange","DateTime","EditTable","Typehead"],
        "utils":["Request","Base"]
    });
})( jQuery );
