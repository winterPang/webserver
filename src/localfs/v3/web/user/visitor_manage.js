/**
 * Created by Administrator on 2016/6/28.
 */
;(function($){
    var MODULE_NAME = "user.visitor_manage";
    var v2path = MyConfig.v2path;
    var sName_Para = "";
    var bSort = "";
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("user_rc", sRcName);
    }

    /* 获取昵称 */
    function onGetStoreName()
    {
        var getStoreNameOpt = {
            url:v2path+"/shop/queryshopnames?ownerName="+FrameInfo.g_user.attributes.name,
            type: "GET",
            dataType: "json",
            onSuccess:getStoreNameSuc,
            onFailed:getStoreNameFail
        }

        function getStoreNameSuc(data){
            console.log("sec");
            if(data.errorcode == 0)
            {
                $("#storeName", $("#adduser_form")).singleSelect("InitData",data.data);
            }
            else{
                Frame.Msg.error(getRcText("GET_STORE_FAILED"));
            }
        }

        function getStoreNameFail(){
            console.log("fail");
        }

        Utils.Request.sendRequest(getStoreNameOpt);
    }

    /* 导出按钮  接口负责人：何巧 */
    function fnDeriveList()
    {
        var oDeriveList = {
            type: "GET",
            url: v2path+"/registuser/export",
            contentType:"application/json",
            dataType:"json",
            data: {
                "ownerName":FrameInfo.g_user.attributes.name,
                "storeName": Utils.Device.deviceInfo.shop_name,
                /*   "startRowIndex":0,
                 "maxItems":10,*/           /* 可以设置多少行 */
                "sortColumn":sName_Para,
                "ascending":bSort,
                "isUsingNickName":true
            },
            onSuccess:function(data){
                if ( data.errorcode == 0)
                {
                    $("#exportFile").get(0).src = data.data;
                    /* window.open(data.data);*/
                }
                else
                {
                    console.log("Derive Failed ->> Heqiao");
                }
            }
            ,onFailed:function(data){

            }
        }

        Utils.Request.sendRequest(oDeriveList);
    }

    function showAddUser(oRowData,type)
    {
        var jForm = $("#adduser_form");
        var jDlg = $("#add_user_Dlag");

        Utils.Base.resetForm(jForm);
        if(jDlg.children().length)
        {
            $("#pageToggle").show().insertAfter($(".modal-header",jDlg));
        }
        else
        {
            $("#pageToggle").show().appendTo(jDlg);
        }

        if(type=="add")
        {
            $("#store",jForm).removeClass("hide");
            $("#userName",jForm).attr("readonly",false);
            jForm.form("init", "edit", {"title":getRcText("ADD_USER"),"btn_apply": onSubmitAddUser,"btn_cancel":onCancel});
            onGetStoreName();

        }
        else{
            $("#userName",jForm).val(oRowData[0].userName);
            $("#userName",jForm).attr("readonly",true);
            $("#store",jForm).addClass("hide");
            jForm.form("init", "edit", {"title":getRcText("EDIT_USER"),"btn_apply": onSubmitEditUser, "btn_cancel":onCancel});

        }
        Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        var jText = $("#text");
        var jPassword = $("#userPassword");

        $("#switch").click(function(){
            if($(this).hasClass('show_word'))
            {
                $(this).removeClass('show_word');
                jText.hide();
                jPassword.show();
                jPassword.val(jText.val());
            }
            else{
                $(this).addClass('show_word');
                jText.show();
                jPassword.hide();
                jText.val(jPassword.val());
            }

        });
        $("#text").keyup(function(){

            $("#userPassword").val($("#text").val());

        });

        var jText2 = $("#text2");
        var jPassword2 = $("#passwordConform");
        $("#switch2").click(function(){
            if($(this).hasClass('show_word'))
            {
                $(this).removeClass('show_word');
                jText2.hide();
                jPassword2.show();
                jPassword2.val(jText2.val());
            }
            else{
                $(this).addClass('show_word');
                jText2.show();
                jPassword2.hide();
                jText2.val(jPassword2.val());
                // Utils.Widget.setError($("#passwordConform"),"");
            }

        });

        $("#text2").keyup(function(){

            $("#passwordConform").val($("#text2").val());

        });


        function eye(){
            var jText = $("#text");
            var jPassword = $("#userPassword");

            $("#switch").click(function(){
                if($(this).hasClass('show_word'))
                {
                    $(this).removeClass('show_word');
                    jText.hide();
                    jPassword.show();
                    jPassword.val(jText.val());
                }
                else{
                    $(this).addClass('show_word');
                    jText.show();
                    jPassword.hide();
                    jText.val(jPassword.val());
                }

            });
            $("#text").keyup(function(){

                $("#userPassword").val($("#text").val());

            });

            var jText2 = $("#text2");
            var jPassword2 = $("#passwordConform");
            $("#switch2").click(function(){
                if($(this).hasClass('show_word'))
                {
                    $(this).removeClass('show_word');
                    jText2.hide();
                    jPassword2.show();
                    jPassword2.val(jText2.val());
                }
                else{
                    $(this).addClass('show_word');
                    jText2.show();
                    jPassword2.hide();
                    jText2.val(jPassword2.val());
                    // Utils.Widget.setError($("#passwordConform"),"");
                }

            });

            $("#text2").keyup(function(){

                $("#passwordConform").val($("#text2").val());

            });

        }

        function updataForm()
        {
            $("input[type=text],input[type=password],select",jForm).each(function() {
                Utils.Widget.setError($(this),"");
            });
            eye();
            jForm.form("updateForm",{
                userName:"",
                userPassword:"",
                passwordConform:"",
                storeName:""
            });
        }
        function onCancel()
        {
            updataForm();
            Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));
        }

        function onSubmitAddUser()
        {
            var jConfirm = $("#passwordConform",jForm);
            var sPassword = $("#userPassword",jForm).val();
            if(jConfirm.val() != sPassword)
            {
                Frame.Msg.error(getRcText("PASSWORD_DIFFERENCE"));
                return false;
            }

            userAdd();
        }

        function userAdd(){
            var userAddOpt = {
                type:"POST",
                url:v2path+"/registuser/add",
                contentType:"application/json",
                dataType:"json",
                onSuccess: userAddSuc,
                onFailed: userAddFail,
                data: JSON.stringify({
                    "ownerName": FrameInfo.g_user.attributes.name,
                    "userName": $("#userName", jForm).val(),
                    "userPassword": $("#userPassword", jForm).val(),
                    "passwordConfirm": $("#passwordConform", jForm).val(),
                    "storeName": Utils.Device.deviceInfo.shop_name
                })
            }

            function userAddSuc(data){
                if(data.errorcode == 0){
                    Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));

                    Frame.Msg.confirm(getRcText("goon"),function(){
                        showAddUser("","add");
                    });

                    updataForm();
                    Utils.Base.refreshCurPage();
                }
                else{
                    Frame.Msg.error(data.errormsg);
                }
            }

            function userAddFail(){
                console.log("fail2");
            }

            Utils.Request.sendRequest(userAddOpt);
        }

        function onSubmitEditUser()
        {

            //fei kong jiao yan
            // if($.trim($("#userPassword", jForm).val())==""){
            //     Utils.Widget.setError($("#userPassword"),getRcText("InputContentError"));
            //     return false;
            // }
            // if($.trim($("#passwordConform", jForm).val())==""){
            //     Utils.Widget.setError($("#passwordConform"),getRcText("InputContentError"));
            //     return false;
            // }
            // if($.trim($("#text", jForm).val())==""){
            //     Utils.Widget.setError($("#text"),getRcText("InputContentError"));
            //     return false;
            // }
            // if($.trim($("#text2", jForm).val())==""){
            //     Utils.Widget.setError($("#text2"),getRcText("InputContentError"));
            //     return false;
            // }
            var jText = $("#text");
            var jPassword = $("#userPassword");
            $("#switch").click(function(){
                if($(this).hasClass('show_word'))
                {
                    $(this).removeClass('show_word');
                    jText.hide();
                    jPassword.show();
                    jPassword.val(jText.val());
                    // Utils.Widget.setError($("#text"),"");
                }
                else{
                    $(this).addClass('show_word');
                    jPassword.hide();
                    jText.show();
                    jText.val(jPassword.val());
                    // Utils.Widget.setError($("#userPassword"),"");
                }

            });

            $("#text").keyup(function(){

                $("#userPassword").val($("#text").val());

            });

            var jText2 = $("#text2");
            var jPassword2 = $("#passwordConform");
            $("#switch2").click(function(){
                if($(this).hasClass('show_word'))
                {
                    $(this).removeClass('show_word');
                    jText2.hide();
                    jPassword2.show();
                    jPassword2.val(jText2.val());
                    Utils.Widget.setError($("#text2"),"");
                }
                else{
                    $(this).addClass('show_word');
                    jText2.show();
                    jPassword2.hide();
                    jText2.val(jPassword2.val());
                    Utils.Widget.setError($("#passwordConform"),"");
                }

            });

            $("#text2").keyup(function(){

                $("#passwordConform").val($("#text2").val());

            });
            //mi ma shi fou yi zhi
            var jConfirm = $("#passwordConform",jForm);
            var sPassword = $("#userPassword",jForm).val();
            if(jConfirm.val() != sPassword)
            {
                Frame.Msg.error(getRcText("PASSWORD_DIFFERENCE"));
                return false;
            }

            var userModifyOpt = {
                type:"POST",
                url:v2path+"/registuser/modify",
                contentType:"application/json",
                dataType:"json",
                onSuccess: userModifySuc,
                onFailed: userModifyFail,
                //username:username,
                //password:password,
                data:JSON.stringify({
                    "ownerName": FrameInfo.g_user.attributes.name,
                    "userName":oRowData[0].userName,
                    "storeName":oRowData[0].storeName,
                    "userPassword":$("#userPassword",jForm).val(),
                    "passwordConfirm":$("#passwordConform",jForm).val()
                })
            }

            function userModifySuc(data){
                console.log("sec3");
                if(data.errorcode == 0){
                    Utils.Pages.closeWindow(Utils.Pages.getWindow(jForm));
                    Utils.Base.refreshCurPage();
                    Frame.Msg.info(getRcText("CONFIGURE_SUCCESS"));
                }
                else{
                    Frame.Msg.error(data.errormsg);
                }
            }

            function userModifyFail(){
                console.log("fail3");
            }

            Utils.Request.sendRequest(userModifyOpt);
        }

    }

    function delUser(oData)
    {
        var userDelOpt = {
            type: "POST",
            url: v2path + "/registuser/delete",
            contentType: "application/json",
            dataType: "json",
            onSuccess: userDelSuc,
            onFailed: userDelFail,
            data: JSON.stringify({
                "ownerName": FrameInfo.g_user.attributes.name,
                "userName": oData[0].realName,
                "storeName": oData[0].storeName
            })
        }

        function userDelSuc(data){
            console.log("sec4");
            if(data.errorcode == 0)
            {
                Frame.Msg.info(getRcText("CONFIGURE_SUCCESS"));
                Utils.Base.refreshCurPage();
            }
            else{
                Frame.Msg.error(data.errormsg);
            }
        }

        function userDelFail(){
            console.log("fail4");
        }

        Utils.Request.sendRequest(userDelOpt);
    }

    function GetLoginTime(logintime)
    {
        function doublenum(num)
        {
            if(num < 10)
            {
                return '0'+num;
            }
            return num;
        }
        var myDate = new Date(logintime);
        var year = myDate.getFullYear();
        var month = doublenum(myDate.getMonth() + 1);
        var day = doublenum(myDate.getDate());
        var hours = doublenum(myDate.getHours());
        var minutes = doublenum(myDate.getMinutes());
        var seconds = doublenum(myDate.getSeconds());
        return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
    }

    function onGetStoreName()
    {
        var getStoreNameOpt = {
            url:v2path+"/shop/queryshopnames?ownerName="+FrameInfo.g_user.attributes.name,
            type: "GET",
            dataType: "json",
            onSuccess:getStoreNameSuc,
            onFailed:getStoreNameFail
        }

        function getStoreNameSuc(data){
            console.log("sec");
            if(data.errorcode == 0)
            {
                $("#storeName", $("#adduser_form")).singleSelect("InitData",data.data);
            }
            else{
                Frame.Msg.error(getRcText("GET_STORE_FAILED"));
            }
        }

        function getStoreNameFail(){
            console.log("fail");
        }

        Utils.Request.sendRequest(getStoreNameOpt);
    }

    function EditShow(aRows)
    {
        if (aRows.length > 0 && aRows[0].userType == 8)
        {
            return true;
        }
        return false;
    }

    function queryRegistUser(params, pageSize) {
        pageSize = pageSize || 0;
        var registerUserListOpt = {
            type: "GET",
            url: v2path+"/registuser/query",
            contentType:"application/json",
            dataType:"json",
            data: {
                "ownerName":FrameInfo.g_user.attributes.name,
                "storeName": Utils.Device.deviceInfo.shop_name,
                "startRowIndex":0+pageSize*10,
                "maxItems":10,
                "isUsingNickName":true
            },
            onSuccess: function (data) {
                if (!('errorcode' in data && data.errorcode == 0)){
                    return ;
                }

                var aResult = data.data || [];
                var aRegisterList = [];

                aResult.forEach(function(value) {
                    var oRegister={};
                    oRegister.userName = value.userName;
                    oRegister.nickName = value.userName;
                    oRegister.storeName = value.storeName;
                    oRegister.userType = (value.userType == 100 ? 8 : value.userType-1);
                    oRegister.loginTime = GetLoginTime(value.loginTime);
                    oRegister.isBlackUser = value.isBlackUser;
                    oRegister.realName = value.realName;   //删除时会用到
                    aRegisterList.push(oRegister);
                }, this);

                var total = data.rowCount;
                $("#RegisterUserList").SList("refresh",{data:aRegisterList,total:total});
            }
        }

        $.extend(registerUserListOpt.data, params);

        Utils.Request.sendRequest(registerUserListOpt);
    }

    function sortRegistUser() {
        var registerUserListOpt = {
            type: "GET",
            url: v2path+"/registuser/query",
            contentType:"application/json",
            dataType:"json",
            data: {
                "ownerName":FrameInfo.g_user.attributes.name,
                "storeName": Utils.Device.deviceInfo.shop_name,
                "startRowIndex":0,
                "maxItems":10,
                "sortColumn":sName_Para,
                "ascending":bSort,
                "isUsingNickName":true
            },
            onSuccess: function (data) {
                if (!('errorcode' in data && data.errorcode == 0)){
                    return ;
                }

                var aResult = data.data || [];

                var aRegisterList = [];
                aResult.forEach(function(value) {
                    if( value.userType == 100 ) {
                        var oRegister = {};
                        oRegister.userName = value.userName;
                        oRegister.nickName = value.userName;
                        oRegister.storeName = value.storeName;
                        oRegister.userType = (value.userType == 100 ? 8 : value.userType - 1);
                        oRegister.loginTime = GetLoginTime(value.loginTime);
                        oRegister.isBlackUser = value.isBlackUser;
                        oRegister.realName = value.realName;
                        aRegisterList.push(oRegister);
                    }
                }, this);

                var total = data.rowCount;
                $("#RegisterUserList").SList("refresh",{data:aRegisterList,total:total});
            }
        }

        Utils.Request.sendRequest(registerUserListOpt);
    }

    function getRegisterUserList(pageSize)
    {
        pageSize = pageSize || 0;
        function RegisterUserListSuc(data){
            var aRegisterList = [];

            if(data.errorcode == 0){
                $.each(data.data,function(key,value){
                    var oRegister={};
                    if( 100 == value.userType) {
                        oRegister.userName = value.userName;
                        oRegister.nickName = value.userName;
                        oRegister.storeName = value.storeName;
                        oRegister.userType = (value.userType == 100 ? 8 : value.userType - 1);
                        oRegister.loginTime = GetLoginTime(value.loginTime);
                        oRegister.isBlackUser = value.isBlackUser;
                        oRegister.realName = value.realName;
                        aRegisterList.push(oRegister);
                    }
                });

                var total = data.rowCount;

                $("#RegisterUserList").SList("refresh",{data:aRegisterList,total:total});

            }else {
                //TODO errorcode处理
                Frame.Msg.error(getRcText("DATA_ERROR"));
            }
        }

        function RegisterUserListFail(){
            console.log("fail8");
        }

        var registerUserListOpt = {
            type: "GET",
            url: v2path+"/registuser/query",
            contentType:"application/json",
            dataType:"json",
            data: {
                "ownerName":FrameInfo.g_user.attributes.name,
                "storeName": Utils.Device.deviceInfo.shop_name,
                "startRowIndex":0+pageSize*10,
                "maxItems":10,
                "isUsingNickName":true
            },
            onSuccess: RegisterUserListSuc,
            onFailed: RegisterUserListFail
        }

        Utils.Request.sendRequest(registerUserListOpt);

    }

    function initGrid(){
        var optpage = {
            colNames: getRcText ("USER_LIST_HEADER"),
            showOperation:true,
            pageSize:10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if (oFilter) {
                    queryRegistUser(oFilter, pageNum-1);
                }
                else {
                    getRegisterUserList(pageNum-1);
                }
            },
            onSearch: function (oFilter, oSorter) {
                if ('nickName' in oFilter) {
                    oFilter.userName = oFilter.nickName;
                    delete oFilter.nickName;
                }
                if ('userType' in oFilter) {
                    oFilter.userType = (oFilter.userType == 8 ? 100 : parseInt(oFilter.userType) + 1);
                }

                queryRegistUser(oFilter);

            },
            onSort:function(sName,isDesc){
                //sortoption对象，如下
                var paiXuObject={};
                if(sName == "nickName"){
                    sName = "userName";
                }

                //发送请求
                sName_Para = sName;
                bSort = isDesc;
                sortRegistUser();
            },
            colModel: [
                {name:'nickName', datatype:"String"},
               // {name:'userType',datatype:"Order", data:getRcText('USER_TYPE').split(',')},
                {name:'loginTime',datatype:"String"}
            ],
            buttons:[
                {name: "add", action: showAddUser},
                {name:"edit",enable:EditShow,action:showAddUser},
                {name:"delete",action:Utils.Msg.deleteConfirm(delUser)},
                {name:"derive",value:getRcText("DERIVE"),enable:true,action:fnDeriveList}
            ]
        };
        $("#RegisterUserList").SList ("head", optpage);
    }

    function initData()
    {
        getRegisterUserList();

    }

    function _init ()
    {
        initGrid();
        initData();

    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base","Request","Device"]
    });
})(jQuery);