(function($){
    var MODULE_NAME = "x_summary.clienthist";
    var g_sShopName  = null;
    var hPending = null;
    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(0).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

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
    
    function  aj_gethistClients(callback) {
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
        var opt={
            type: "GET",
            url: MyConfig.v2path+"/accessdetail/query?ownerName="+FrameInfo.g_user.attributes.name+"&storeName="+g_sShopName,
            contentType:"application/json",
            dataType:"json",
            timeout: 150000,
            onSuccess:function(data){
                try {
                    if(!('errorcode' in data )){
                        throw (new Error('errorcode not exist'));
                    }
                    console.log("onlineuser");
                    console.log(data);
                    if (data.errorcode == 0) {
                        if(!('data' in data && data.data instanceof Array)){
                            throw (new Error('data not exist'));
                        }
                        $.each(data.data, function (key, value) {
                            var oVisitor = {};
                            oVisitor.macAddr = value.userMac;
                            oVisitor.userIp = value.userIp;
                            oVisitor.accessStartTime = GetLoginTime(value.accessStartTime);
                            oVisitor.accessDuration = GetNormalDate(value.accessDuration);
                            oVisitor.authType = ouserType[value.userType];
                            oVisitor.authAccount = value.userName;

                            oVisitor.storeName = value.storeName;
                            aVisitor.push(oVisitor);
                        })

                        callback(aVisitor);
                        //$("#OnlineVisitorList").SList ("refresh", aVisitor);
                    }
                    else {

                        // Frame.Msg.error("查询数据异常");
                    }
                }catch(error){

                }
                
            },
            onFailed:function(err){
                hPending&&hPending.close();
            }
        }

        Utils.Request.sendRequest(opt);
    
    }
    
    function aj_gethistClients_b(callback) {
        var opt = {
            url:MyConfig.path+"/stamonitor/gethistclientlist?devSN=" + FrameInfo.ACSN+"&skipnum="+0+"&limitnum="+1000,
            type: "GET",
            contentType:"application/json",
            dataType:"json",
            timeout: 150000,
            onSuccess: function (data) {
                console.log(data);
                try {
                    if(!(data instanceof Object && 'clientList' in data)){
                        throw (new Error('clientList not exist'));
                    }
                    callback(data.clientList);
                }catch(error){
                    console.log(error)
                }
            },
            onFailed:function(err){
                hPending&&hPending.close();
                console.log("get history client faild;");
            }
        }
        
        Utils.Request.sendRequest(opt);
    }
    
    function initHistoryGrid(){
        var optpage = {
            colNames: getRcText ("Visitor_LIST_HEADER"),
            pageSize:10,
            colModel: [
                {name:"macAddr", datatype:"String",width:80},
                {name:"userIp", datatype:"String",width:60},
                {name:"accessStartTime", datatype:"String",width:100},
                {name:"accessDuration", datatype:"String",width:60},
                // {name:"authType", datatype:"String",width:80},
                // {name:"authAccount", datatype:"String",width:80},
            ]
        };
        $("#HistoryList").SList ("head", optpage);
    }
    //论这个函数的作用？
    function queryHistorySta(storeName,onSuccess,onFailed) {
            var name = FrameInfo.g_user.user;
            var StoreName  = "����1¥СС��667";
            var queryHistory = {
                type: "GET",
                url: MyConfig.v2path+"/accessdetail/query" + "?ownerName=" + name + "&storeName=" + storeName,
                dataType: "json",
                timeout: 150000,
                onSuccess:onSuccess,
                onFailed:onFailed
            }
            Utils.Request.sendRequest(queryHistory);
    }
    
    function initHistoryData()
    {
        // aj_gethistClients(function (userlist) {
        //     $("#HistoryList").SList ("refresh", userlist); 
        // });
        
        var aVisitor=[];
        // aj_gethistClients(function (authlist) {
        //     aj_gethistClients_b(function (userlist) {
        //         for (var i=(userlist.length-1); i>=0; i--){
        //             var oVisitor={};
        //             oVisitor.macAddr = userlist[i].clientMAC;
        //             oVisitor.userIp = userlist[i].clientIP;
        //             oVisitor.accessStartTime = GetLoginTime(userlist[i].upLineDate);
        //             oVisitor.accessDuration = GetNormalDate(userlist[i].onlineTime);
        //             oVisitor.authType = getRcText("USER_TYPE").split(',')[0];// "短信认证";//ouserType[userlist[i].userType];
        //             oVisitor.authAccount = getRcText("AUTH_ACCOUNT");// "18648816203";//userlist[i].userName;
        //             // "未认证"
                    
        //             for(var n in authlist){
        //                 if (userlist[i].clientMAC.replace(new RegExp("-","gm"),"") == authlist[n].macAddr.replace(new RegExp("-","gm"),"").toLocaleLowerCase()){
        //                     if(Math.abs((new Date(userlist[i].upLineDate)-(new Date(authlist[n].accessStartTime)))) < 3600000){
        //                         oVisitor.authType = authlist[n].authType// "短信认证";//ouserType[userlist[i].userType];
        //                         oVisitor.authAccount = authlist[n].authAccount;
        //                     }
        //                 }
        //             }
                    
        //             oVisitor.storeName = "";//value.storeName;
        //             aVisitor.push(oVisitor);
        //         }
                
        //         $("#HistoryList").SList ("refresh", aVisitor);
        //     });
        // });
        aj_gethistClients_b(function (userlist) {
            for (var i=(userlist.length-1); i>=0; i--){
                var oVisitor={};
                oVisitor.macAddr = userlist[i].clientMAC;
                oVisitor.userIp = userlist[i].clientIP;
                oVisitor.accessStartTime = GetLoginTime(userlist[i].upLineDate);
                oVisitor.accessDuration = GetNormalDate(userlist[i].onlineTime);
                oVisitor.authType = getRcText("USER_TYPE").split(',')[0];// "短信认证";//ouserType[userlist[i].userType];
                oVisitor.authAccount = getRcText("AUTH_ACCOUNT");// "18648816203";//userlist[i].userName;
                // "未认证"
                
                // for(var n in authlist){
                //     if (userlist[i].clientMAC.replace(new RegExp("-","gm"),"") == authlist[n].macAddr.replace(new RegExp("-","gm"),"").toLocaleLowerCase()){
                //         if(Math.abs((new Date(userlist[i].upLineDate)-(new Date(authlist[n].accessStartTime)))) < 3600000){
                //             oVisitor.authType = authlist[n].authType// "短信认证";//ouserType[userlist[i].userType];
                //             oVisitor.authAccount = authlist[n].authAccount;
                //         }
                //     }
                // }
                
                oVisitor.storeName = "";//value.storeName;
                aVisitor.push(oVisitor);
            }
            
            $("#HistoryList").SList ("refresh", aVisitor);
        });
    }
    
    function _init ()
    {
        g_sShopName = Utils.Device.deviceInfo.shop_name;
        initHistoryGrid();
        initHistoryData();
        
        $("#hBack").click(function(){
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
        "utils": ["Request", "Base", 'Device']
    });
})(jQuery);
