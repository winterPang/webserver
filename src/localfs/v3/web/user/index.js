;(function($){
    var MODULE_NAME = "user.index";
    var v2path = MyConfig.v2path;
    var username =MyConfig.username;
    var password = MyConfig.password;

    var bSort = false;       /* 排序 */
    var sName_Para = "";     /* 点击slist head的名称 */

    var g_fqfj_operateBtn = true;


    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("user_rc", sRcName);
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
                Frame.Msg.error("获取场所失败");
            }
        }

        function getStoreNameFail(){
            console.log("fail");
        }

        Utils.Request.sendRequest(getStoreNameOpt);
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
                Frame.Msg.error("两次密码不一致");
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
                    "storeId":FrameInfo.Nasid,
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
                Frame.Msg.error("两次密码不一致");
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
                    "storeId":FrameInfo.Nasid,
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
                    Frame.Msg.info("配置成功");
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
            "storeId":FrameInfo.Nasid,
	        "userName": oData[0].realName,
	        "storeName": oData[0].storeName,
                "userType": (oData[0].userType == 8 ? 100 : oData[0].userType + 1)
	    })
	}

        function userDelSuc(data){
            console.log("sec4");
            if(data.errorcode == 0)
            {
                Frame.Msg.info("配置成功");
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

    function addToBlackList(oData)
    {
        if(oData.length == 0)
        {
            return false;
        }

        var addToBlackListOpt = {
            type:"POST",
            url:v2path+"/registuser/addtoblackList",
            contentType:"application/json",
            dataType:"json",
            onSuccess: addToBlackListSuc,
            onFailed: addToBlackListFail,
            data:JSON.stringify({
                "ownerName": FrameInfo.g_user.attributes.name,
                "storeId":FrameInfo.Nasid,
                "storeName":oData[0].storeName,
                "userName":oData[0].realName,
                "userType": (oData[0].userType == 8 ? 100 : oData[0].userType + 1)
            })
        }

        function addToBlackListSuc(data){
            console.log("sec5");
            if(data.errorcode == 0)
            {
                Frame.Msg.info("配置成功");
                Utils.Base.refreshCurPage();
            }
            else{
                Frame.Msg.error(data.errormsg);
            }
        }

        function addToBlackListFail(){
            console.log("fail5");
        }

        Utils.Request.sendRequest(addToBlackListOpt);
    }

    function rmFromBlackList(oData)
    {
        if(oData.length == 0)
        {
            return false;
        }

        var rmFromBlackListOpt = {
            type:"POST",
            url:v2path+"/registuser/removefromblackList",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "ownerName": FrameInfo.g_user.attributes.name,
                "storeId":FrameInfo.Nasid,
                "storeName":oData[0].storeName,
                "userName":oData[0].realName,
                "userType": (oData[0].userType == 8 ? 100 : oData[0].userType + 1)
            }),
            onSuccess: rmFromBlackListSuc,
            onFailed: rmFromBlackListFail
        }

        function rmFromBlackListSuc(data){
            console.log("sec6");
            if(data.errorcode == 0)
            {
                Frame.Msg.info("配置成功");
                Utils.Base.refreshCurPage();
            }
            else{
                Frame.Msg.error(data.errormsg);
            }
        }

        function rmFromBlackListFail(){
            console.log("fail6");
        }

        Utils.Request.sendRequest(rmFromBlackListOpt);
    }

    function kickOut(oData){
        if(oData.length == 0)
        {
            return false;
        }
        var aData = [];
        for(var i=0; i<oData.length; i++)
        {
            var data = {};
            data.userIp = oData[i].userIp;
            data.userName = oData[i].userName;
            aData.push(data);
        }

        var kickOutOpt = {
            type:"POST",
            url:v2path+"/onlineuser/kickout",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "ownerName": FrameInfo.g_user.attributes.name,
                "nasId":FrameInfo.Nasid,
                "storeName":oData[0].storeName,
                "data":aData
            }),
            onSuccess: kickOutSuc,
            onFailed: kickOutFail
        }

        function kickOutSuc(data){
            console.log("sec7");
            if(data.errorcode == 0)
            {
                Frame.Msg.info("操作下发成功，稍后请刷新页面");
                //由于是异步操作，CCB评审决定让前端给一个提示信息，不主动刷新页面。
            }
            else{
                Frame.Msg.error(data.errormsg);
            }
        }

        function kickOutFail(){
            console.log("fail7");
        }

        Utils.Request.sendRequest(kickOutOpt);
    }

    function addblackShow(aRows)
    {
        var bAddtoBlackshow = false;
        if(aRows.length > 0)
        {
            for(var i=0; i<aRows.length; i++)
            {
                if(aRows[i].isBlackUser == true)
                {
                    return false;
                }
            }
            return true;
        }
        return bAddtoBlackshow;
    }

    function rmBlackShow(aRows)
    {
        var brmBlackshow = false;
        if(aRows.length > 0)
        {
            for(var i=0; i<aRows.length; i++)
            {
                if(aRows[i].isBlackUser == false)
                {
                   return false;
                }
            }
            return true;
        }
        return brmBlackshow;
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
                "storeId":FrameInfo.Nasid,
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
                    oRegister.nickName = value.userName || value.realName;
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
                "storeId":FrameInfo.Nasid,
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
                    var oRegister={};
                    oRegister.userName = value.userName;
                    oRegister.nickName = value.userName || value.realName ;
                    oRegister.storeName = value.storeName;
                    oRegister.userType = (value.userType == 100 ? 8 : value.userType-1);
                    oRegister.loginTime = GetLoginTime(value.loginTime);
                    oRegister.isBlackUser = value.isBlackUser;
                    oRegister.realName = value.realName;
                    aRegisterList.push(oRegister);
                }, this);

                var total = data.rowCount;
                $("#RegisterUserList").SList("refresh",{data:aRegisterList,total:total});
            }
        }

        Utils.Request.sendRequest(registerUserListOpt);
    }
    /* 导出按钮  接口负责人：何巧 */
    function fnDeriveList()
    {
        var oDeriveList = {
            type: "GET",
            url: v2path+"/registuser/export?ownerName="+FrameInfo.g_user.attributes.name+"&storeId="+FrameInfo.Nasid+"&storeName="+
            Utils.Device.deviceInfo.shop_name+"&maxItems=100000&sortColumn="+sName_Para+"&ascending="+bSort+
            "&isUsingNickName=true&startRowIndex=0",
            contentType:"application/json",
            dataType:"json",
            // data: {
            //     "ownerName":FrameInfo.g_user.attributes.name,
            //     "storeId":FrameInfo.Nasid,
            //     "storeName": Utils.Device.deviceInfo.shop_name,
            //     "startRowIndex":0,
            //     "maxItems":100000,          /* 可以设置多少行 */
            //     "sortColumn":sName_Para,
            //     "ascending":bSort,
            //     "isUsingNickName":true
            // },
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

    function initGrid()
    {
        var optpage = {
            colNames: getRcText ("USER_LIST_HEADER"),
            // showOperation:true,
            showOperation:g_fqfj_operateBtn,
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

               /* paiXuObject[sName]=isDesc;

                 //requestBody,如下
                 var guoLvTiaoJian={"findoption":{},"sortoption":paiXuObject};*/

                //发送请求
                sName_Para = sName;
                bSort = isDesc;
                sortRegistUser();
            },
            colModel: [
                {name:'nickName', datatype:"String"},
                {name:'userType',datatype:"Order", data:getRcText('USER_TYPE').split(',')},
                {name:'loginTime',datatype:"String"}
            ],
            buttons:[
                {name: "add", action: showAddUser},
                {name:"edit",enable:EditShow,action:showAddUser},
                {name:"delete",action:Utils.Msg.deleteConfirm(delUser)},
                {name:"addBlackList",value:getRcText("ADD_BLACK_LIST"),enable:addblackShow,action:addToBlackList},
                {name:"rmBlackList",value:getRcText("REMOVE_BLACK_LIST"),enable:rmBlackShow,action:rmFromBlackList},
                {name:"derive",value:getRcText("DERIVE"),enable:true,action:fnDeriveList}
            ]
        };
        $("#RegisterUserList").SList ("head", optpage);

        var optvisitor={
            search: false,
            pageSize:10,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                getOnlineUserList(pageNum-1);
            },
            
            colNames: getRcText("Visitor_LIST_HEADER"),
            showOperation:false,
            multiSelect: true,
            colModel: [     
                {name:"nickName", datatype:"String"},
                {name:"userIp", datatype:"String"},
                {name:"accessStartTime", datatype:"String"},
                {name:"accessDuration", datatype:"String"},
                {name:'userType',datatype:"Order", data:getRcText('USER_TYPE').split(',')},
            ],
            buttons:[
                {name:"kickout",value:getRcText("KICK_OUT"),enable:true,action:kickOut}
            ]
        };
        $("#OnlineVisitorList").SList ("head", optvisitor);
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

    function fnChengeTime(value) {
        var nSecond = parseInt(value);// 秒
        var nMinute = 0;// 分
        var nHour = 0;// 小时
        var nDay = 0; //天
        var result = {};
        if(nSecond >= 60) {
            nMinute = parseInt(nSecond/60);
            nSecond = parseInt(nSecond%60);
            if(nMinute >= 60) {
                nHour = parseInt(nMinute/60);
                nMinute = parseInt(nMinute%60);
            }
            if(nHour >= 24){
                nDay = parseInt(nHour/24);
                nHour = parseInt(nHour%24);
            }
        }
        /*result = ""+parseInt(nSecond)+"秒";*/
        if(nMinute > 0) {
            result = ""+parseInt(nMinute)+"分";
        }
        if(nMinute == 0)
        {
            result = "0分";
        }
        if(nHour > 0) {
            result = ""+parseInt(nHour)+"小时"+result;
        }
        if(nDay > 0)
        {
            result = ""+ parseInt(nDay)+"天"+result;
        }
        return result;
    }

    function getNickName(openidArr,userList,total,callback)
    {
        function nickSuc(data){
            if (!('errcode' in data && data.errcode == 0)){
                Frame.Msg.error("查询数据异常");
                return ;
            }

            var oRes = {};
            data.datas.forEach(function(res) {
                oRes[res.user_mac] = res;
            }, this);
            
            var newUserList = [];
            
            userList.forEach(function(user) {
                var user_mac = user.userMac;
                if (user_mac in oRes) {
                   /* user.nickName = oRes[open_id].nickname || oRes[open_id].user_mac;*/
                    user.nickName = oRes[user_mac].nickname || oRes[user_mac].user_mac;
                }
                newUserList.push(user);
            }, this);
            callback && callback(newUserList, total);
            //opt.SList("refresh",{data:newUserList,total:total});
        }

        function nickFail(){
            console.log("fail10");
        }

        var nickOpt = {
                    type: "POST",
                    url: v2path+"/weixinAuthUser/queryBulkAuthUsers",
                    contentType:"application/json",
                    dataType:"json",
                    data: JSON.stringify({
                            macs:openidArr,
                    }),
                    onSuccess: nickSuc,
                    onFailed: nickFail
                };
        Utils.Request.sendRequest(nickOpt);

    }

    function getRegisterUserList(pageSize)
    {
        pageSize = pageSize || 0;
        function RegisterUserListSuc(data){
            var aRegisterList = [];

            if(data.errorcode == 0){
                $.each(data.data,function(key,value){
                    var oRegister={};
                    oRegister.userName = value.userName;
                    oRegister.nickName = value.userName || value.realName;
                    oRegister.storeName = value.storeName;
                    oRegister.userType = (value.userType == 100 ? 8 : value.userType-1);
                    oRegister.loginTime = GetLoginTime(value.loginTime);
                    oRegister.isBlackUser = value.isBlackUser;
                    oRegister.realName = value.realName;
                    aRegisterList.push(oRegister);
                });

                var total = data.rowCount;

                $("#RegisterUserList").SList("refresh",{data:aRegisterList,total:total});

            }else {
                //TODO errorcode处理
                Frame.Msg.error("查询数据异常");
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
                "storeId":FrameInfo.Nasid,
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

    function getOnlineUserList(pageSize) {
        pageSize = pageSize || 0;
        function onlineuserSuc(data) {
            if (!data.errorcode == 0){
                Frame.Msg.error("查询数据异常");
                return ;
            }
            
            var aVisitor = [];
            var nickOpenids = [];
            $.each(data.data,function(key,value){
                var oVisitor={};
                oVisitor.userName = value.userName;
                oVisitor.nickName = value.userMac; //在线列表不显示昵称让其显示MAC
                oVisitor.storeName = value.storeName;
                oVisitor.userIp = value.userIp;
                oVisitor.accessStartTime = GetLoginTime(value.accessStartTime);
                oVisitor.accessDuration = fnChengeTime(value.accessDuration);
                oVisitor.userType = (value.userType == 100 ? 8 : value.userType -1);
                oVisitor.userMac = value.userMac;
                if(value.userType === 6||value.userType === 7){
                    nickOpenids.push(value.userMac);
                }
                aVisitor.push(oVisitor);
            });
            
            var total = data.rowCount;
            if(nickOpenids.length > 0)
            {
                getNickName(nickOpenids,aVisitor,total,function (aVisitor, total) {
                    $("#OnlineVisitorList").SList ("refresh", {data:aVisitor,total:total});
                });
            }
            else{
                $("#OnlineVisitorList").SList ("refresh", {data:aVisitor,total:total});
            }
        }
        
        function onlineuserFail() {

        }
        
        var onlineuserOpt = {
            type: "GET",
            url: v2path+"/onlineuser/query",
            contentType:"application/json",
            dataType:"json",
            data: {
                "ownerName":FrameInfo.g_user.attributes.name,
                "nasId":FrameInfo.Nasid,
                "storeName":Utils.Device.deviceInfo.shop_name,
                "startRowIndex":0+pageSize*10,
                "maxItems":10
            },
            onSuccess: onlineuserSuc,
            onFailed: onlineuserFail
        }

        Utils.Request.sendRequest(onlineuserOpt);
    }

    function initData()
    {
        getRegisterUserList();

        getOnlineUserList();

    }
    function _init ()
    {
        if (FrameInfo.Model != '2')
        {
            $("#onlinevisitor").show();
        };
        initFenJiFenQuan();

        initGrid();
        initData();   

        initFenJiFenQuan();     
    }

    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu=[];
        arrayShuZu=Frame.Permission.getCurPermission();
        
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        // console.log(arrayShuZuNew);

        //3 作具体的“显示、隐藏”处理
        if($.inArray("WRITE",arrayShuZuNew)==-1){
            //隐藏“写”的功能
            //写
            ($(".slist-button[title='"+getRcText("ADD_BLACK_LIST")+"']")) .css('display','none');
            ($(".slist-button[title='"+getRcText("REMOVE_BLACK_LIST")+"']")) .css('display','none');
            ($(".slist-button[title='"+getRcText("DERIVE")+"']")) .css('display','none');
            ($(".slist-button[title='"+getRcText("KICK_OUT")+"']")) .css('display','none');

            ($(".slist-button[title='添加']")) .css('display','none');
            g_fqfj_operateBtn=false;
        }
       
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