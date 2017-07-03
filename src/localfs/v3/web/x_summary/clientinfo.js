(function($){
    var MODULE_NAME = "x_summary.clientinfo";
    var g_sShopName  = null;
    var hPending = null;
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("user_rc", sRcName);
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
    
    function GetNormalDate(num) {
        
        var Timelable = getRcText("TIME").split(",");
        var time = num;
        var day = parseInt(time / 86400);
        var temp = time % 86400;
        var hour = parseInt(temp / 3600);
        temp = time % 3600;
        var mini = parseInt(temp / 60);
        var sec = time % 60;
        return day + Timelable[0] + hour + Timelable[1] + mini + Timelable[2];
        
    }
    
    function  aj_getOnlineClients(callback) {
        var aUserType = getRcText("USER_TYPE").split(",");
        var ouserType={
            "1":aUserType[1],
            "2":aUserType[2],
            "3":aUserType[3],
            "4":aUserType[4],
            "5":aUserType[5],
            "6":aUserType[6],
            "7":aUserType[7],
            "100":aUserType[8]
        };
        
        var aVisitor = [];
        var aj_PlaceOpt = {
                type: "GET",
                url: MyConfig.v2path+"/onlineuser/query?ownerName="+FrameInfo.g_user.attributes.name+"&storeName="+g_sShopName ,
                contentType:"application/json",
                dataType:"json",
                timeout: 150000,
                onSuccess:function(data){
                    try {
                        if(!('errorcode' in data && 'data' in data && data.data instanceof Array )){
                            throw (new Error('data not exist'));
                        }
                        
                        if (data.errorcode == 0) {
                            $.each(data.data, function (key, value) {
                                var oVisitor = {};
                                oVisitor.macAddr = value.userMac;
                                oVisitor.userIp = value.userIp;
                                oVisitor.accessStartTime = GetLoginTime(value.accessStartTime);
                                oVisitor.accessDuration = value.accessDuration;
                                oVisitor.authType = ouserType[value.userType];
                                oVisitor.authAccount = value.userName;

                                oVisitor.storeName = value.storeName;
                                aVisitor.push(oVisitor);
                            })

                            callback(aVisitor);
                            //$("#OnlineVisitorList").SList ("refresh", aVisitor);
                        }
                        else {
                            //TODO errorcode处理
                            // Frame.Msg.error("查询数据异常");
                        }
                    }catch(error){

                    }

                },
                onFailed:function(err){
                    hPending&&hPending.close();
                }
            }

            Utils.Request.sendRequest(aj_PlaceOpt);
    
    }
    
    function aj_getOnlineClients_b(callback) {
        
        var getOnlineOpt = {
            url:MyConfig.path+"/stamonitor/web/stationlist?devSN=" + FrameInfo.ACSN,
            type: "GET",
            contentType:"application/json",
            dataType:"json",
            timeout: 150000,
            onSuccess: function (data) {
                if(!('clientList' in data)){
                    console.log('clientList not exist');
                    return;
                }
                
                callback(data.clientList);
            },
            onFailed:function(err){
                hPending&&hPending.close();
                console.log("get online client faild:");
            }
        }
        Utils.Request.sendRequest(getOnlineOpt);
    }
    
    function initUserGrid(){
        var optvisitor={
            colNames: getRcText("Visitor_LIST_HEADER"),
            showOperation:false,
            multiSelect: false,
            pageSize:10,
            colModel: [
                {name:"macAddr", datatype:"String"},
                {name:"userIp", datatype:"String"},
                {name:"accessStartTime", datatype:"String"},
                {name:"accessDuration", datatype:"String"},
                // {name:"authType", datatype:"String"},
                // {name:"authAccount", datatype:"String"},
            ],
        };
        $("#OnlineVisitorList").SList ("head", optvisitor);
    }
    
    function initUserData()
    {
        // aj_getOnlineClients(function (userlist) {
        //     $("#OnlineVisitorList").SList ("refresh", userlist);
        // });
        
        var aVisitor=[];
        // aj_getOnlineClients(function (authlist) {
        //     aj_getOnlineClients_b(function (userlist) {
        //         for (var i=0; i<userlist.length; i++){
        //             var oVisitor={};
        //             oVisitor.macAddr = userlist[i].clientMAC;
        //             oVisitor.userIp = userlist[i].clientIP;
        //             oVisitor.accessStartTime = GetLoginTime(userlist[i].uplineTime);
        //             oVisitor.accessDuration = GetNormalDate(userlist[i].onlineTime);
        //             oVisitor.authType = getRcText("USER_TYPE").split(',')[0];// "短信认证";//ouserType[userlist[i].userType];
        //             oVisitor.authAccount = getRcText("AUTH_ACCOUNT");
        //             // "未认证"
        //             oVisitor.storeName = "";//value.storeName;
                    
        //             // for(var n in authlist){
        //             //     if ((userlist[i].clientMAC == authlist[n].macAddr)&&
        //             //         (userlist[i].uplineTime == authlist[n].accessStartTime)){
        //             //             oVisitor.authType = authlist[n].authType// "短信认证";//ouserType[userlist[i].userType];
        //             //             oVisitor.authAccount = authlist[n].authAccount;
        //             //         }
        //             // }
                    
        //             for(var n in authlist){
        //                 if (userlist[i].clientMAC.replace(new RegExp("-","gm"),"") == authlist[n].macAddr.replace(new RegExp("-","gm"),"").toLocaleLowerCase()){
        //                     if(Math.abs((new Date(userlist[i].uplineTime)-(new Date(authlist[n].accessStartTime)))) < 3600000){
        //                         oVisitor.authType = authlist[n].authType// "短信认证";//ouserType[userlist[i].userType];
        //                         oVisitor.authAccount = authlist[n].authAccount;
        //                     }
        //                 }
        //             }
                    
        //             aVisitor.push(oVisitor);
        //         }
                
        //         $("#OnlineVisitorList").SList ("refresh", aVisitor);
        //     });
        // });
        aj_getOnlineClients_b(function (userlist) {
            for (var i=0; i<userlist.length; i++){
                var oVisitor={};
                oVisitor.macAddr = userlist[i].clientMAC;
                oVisitor.userIp = userlist[i].clientIP;
                oVisitor.accessStartTime = GetLoginTime(userlist[i].uplineTime);
                oVisitor.accessDuration = GetNormalDate(userlist[i].onlineTime);
                oVisitor.authType = getRcText("USER_TYPE").split(',')[0];// "短信认证";//ouserType[userlist[i].userType];
                oVisitor.authAccount = getRcText("AUTH_ACCOUNT");
                // "未认证"
                oVisitor.storeName = "";//value.storeName;
                
                // for(var n in authlist){
                //     if ((userlist[i].clientMAC == authlist[n].macAddr)&&
                //         (userlist[i].uplineTime == authlist[n].accessStartTime)){
                //             oVisitor.authType = authlist[n].authType// "短信认证";//ouserType[userlist[i].userType];
                //             oVisitor.authAccount = authlist[n].authAccount;
                //         }
                // }
                
                // for(var n in authlist){
                //     if (userlist[i].clientMAC.replace(new RegExp("-","gm"),"") == authlist[n].macAddr.replace(new RegExp("-","gm"),"").toLocaleLowerCase()){
                //         if(Math.abs((new Date(userlist[i].uplineTime)-(new Date(authlist[n].accessStartTime)))) < 3600000){
                //             oVisitor.authType = authlist[n].authType// "短信认证";//ouserType[userlist[i].userType];
                //             oVisitor.authAccount = authlist[n].authAccount;
                //         }
                //     }
                // }
                
                aVisitor.push(oVisitor);
            }
            
            $("#OnlineVisitorList").SList ("refresh", aVisitor);
        });
    }
    
    function _init ()
    {
        g_sShopName = Utils.Device.deviceInfo.shop_name;
        
        initUserGrid();
        initUserData();
        
        $("#iBack").click(function(){
            Utils.Base.redirect({ np: "x_summary.userflow"});
        });
    }
    
    function _destroy()
    {
        hPending&&hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","SingleSelect","Minput","Form"],
        "utils": ["Base","Request", 'Device']
    });
})(jQuery);
