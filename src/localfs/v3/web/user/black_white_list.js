/**
 * Created by Administrator on 2016/6/28.
 */
;(function($){
    var MODULE_NAME = "user.black_white_list";
    var v2path = MyConfig.v2path;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("user_rc", sRcName);
    }

    function addToBlackList(oData)
    {
        if(oData.length == 0)
        {
            return false;
        }

       
        var addBlackListData= [];
        $.each(oData,function(k,v){
           addBlackListData[k] = {};
           addBlackListData[k].ownerName = FrameInfo.g_user.attributes.name,
           addBlackListData[k].storeName = v.storeName;
           addBlackListData[k].userName = v.userName;
           addBlackListData[k].userType = (v.userType == 8 ? 100 : v.userType + 1); 
        })

        function addToBlackListSuc(data){
            console.log("sec5");
            if(data.errorcode == 0)
            {
                Frame.Msg.info(getRcText("CONFIGURE_SUCCESS"));
                Utils.Base.refreshCurPage();
            }
            else if(data.errorcode == 1)
            {
                Frame.Msg.info(getRcText("error_cache"));
            }
            else if(data.errorcode == 1006)
            {
                Frame.Msg.info(getRcText("error_service"));
            }
            else if(data.errorcode == 1006)
            {
                Frame.Msg.info(getRcText("error_login"));
            }
            else
            {
                Frame.Msg.error(getRcText("error_fail"));
            }
        }

        function addToBlackListFail(){
            console.log("fail5");
        }

         var addToBlackListOpt = {
            type:"POST",
            url:v2path+"/registuser/addToBlackLists",
            contentType:"application/json",
            dataType:"json",
            onSuccess: addToBlackListSuc,
            onFailed: addToBlackListFail,
            data:JSON.stringify(addBlackListData)
        }

        Utils.Request.sendRequest(addToBlackListOpt);
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

    function rmFromBlackList(oData)
    {
        if(oData.length == 0)
        {
            return false;
        }

        var rmFromBlackListData= [];
        $.each(oData,function(k,v){
           rmFromBlackListData[k] = {};
           rmFromBlackListData[k].ownerName = FrameInfo.g_user.attributes.name,
           rmFromBlackListData[k].storeName = v.storeName;
           rmFromBlackListData[k].userName = v.userName;
           rmFromBlackListData[k].userType = (v.userType == 8 ? 100 : v.userType + 1); 
        })

        var rmFromBlackListOpt = {
            type:"POST",
            url:v2path+"/registuser/removefromblackLists",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(rmFromBlackListData),
            onSuccess: rmFromBlackListSuc,
            onFailed: rmFromBlackListFail
        }

        function rmFromBlackListSuc(data){
            console.log("sec6");
            if(data.errorcode == 0)
            {
                Frame.Msg.info(getRcText("CONFIGURE_SUCCESS"));
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
                        var oRegister = {};
                        oRegister.userName = value.userName;
                        oRegister.nickName = value.userName;
                        oRegister.storeName = value.storeName;
                        oRegister.userType = (value.userType == 100 ? 8 : value.userType - 1);
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

    function getRegisterUserList(pageSize)
    {
        pageSize = pageSize || 0;
        function RegisterUserListSuc(data){
            var aRegisterList = [];

            if(data.errorcode == 0){
                $.each(data.data,function(key,value){
                    var oRegister={};
                        oRegister.userName = value.userName;
                        oRegister.nickName = value.userName;
                        oRegister.storeName = value.storeName;
                        oRegister.userType = (value.userType == 100 ? 8 : value.userType - 1);
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
            showOperation:false,
            pageSize:10,
            asyncPaging:true,
            multiSelect:true,
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
                {name:'userType',datatype:"Order", data:getRcText('USER_TYPE').split(',')},
                //{name:'loginTime',datatype:"String"}
            ],
            buttons:[
                {name:"addBlackList",value:getRcText("ADD_BLACK_LIST"),enable:addblackShow,action:addToBlackList},
                {name:"rmBlackList",value:getRcText("REMOVE_BLACK_LIST"),enable:rmBlackShow,action:rmFromBlackList},
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