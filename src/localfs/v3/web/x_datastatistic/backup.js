/**
 * Created by Administrator on 2017/4/19.
 */
(function($){
    var MODULE_NAME = "x_datastatistic.backup";
    var hPending = null;
    var g_sShopName = null;
    var g_onLine = [];//´æ´¢ÔÚÏßÏÂ·¢Ê§°ÜµÄÉè±¸
    var flag= null;//Îª¿Õ¾ÍÊÇµÚÒ»´ÎÏÂ·¢£¬·ñÔò¾ÍÊÇÔÙ´ÎÏÂ·¢Ê§°ÜµÄÉè±¸
    // ¶ÔDateµÄÀ©Õ¹£¬½« Date ×ª»¯ÎªÖ¸¶¨¸ñÊ½µÄString
    // ÔÂ(M)¡¢ÈÕ(d)¡¢Ð¡Ê±(h)¡¢·Ö(m)¡¢Ãë(s)¡¢¼¾¶È(q) ¿ÉÒÔÓÃ 1-2 ¸öÕ¼Î»·û£¬
    // Äê(y)¿ÉÒÔÓÃ 1-4 ¸öÕ¼Î»·û£¬ºÁÃë(S)Ö»ÄÜÓÃ 1 ¸öÕ¼Î»·û(ÊÇ 1-3 Î»µÄÊý×Ö)
    // Àý×Ó£º
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.format = function(fmt)   { //author: meizz
        var o = {
            "M+" : this.getMonth()+1,                 //ÔÂ·Ý
            "d+" : this.getDate(),                    //ÈÕ
            "h+" : this.getHours(),                   //Ð¡Ê±
            "m+" : this.getMinutes(),                 //·Ö
            "s+" : this.getSeconds(),                 //Ãë
            "q+" : Math.floor((this.getMonth()+3)/3), //¼¾¶È
            "S"  : this.getMilliseconds()             //ºÁÃë
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("cfg_restore_rc", sRcName);
    }
    function failConform(){
        $("#failConform").on("click", function(){
            flag&&flag.apply(null,flag.args);
            //flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function getStatus(g_onLine,aErrList,callback){
        var getDevStatusOpt = {
            type:"POST",
            url:"/base/getDevs",
            dataType:"json",
            timeout: 150000,
            data:{
                cfgTimeout:120,
                devSN:g_onLine
            },
            onSuccess:function(data){
                for(var i=0;i<aErrList.length;i++){
                    for(var j=0;j<data.detail.length;j++){
                        if(aErrList[i].devSN==data.detail[j].devSN){
                            aErrList[i].devState=getRcText("STATE").split(",")[data.detail[i].status]
                        }
                    }
                }
                callback(aErrList);

            },
            onFailed:function(error){
                hPending&&hPending.close();
                console.log(error);
            }
        };
        Utils.Request.sendRequest(getDevStatusOpt);
    }
    function closeMadle(){
        $("#failClose").on("click", function(){
            //¹Ø±Õdialogµ¯¿ò,·µ»ØÖÁÖ÷Ò³Ãæ
            flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function closeX(){
        $("#closeX").on("click", function(){
            //¹Ø±Õdialogµ¯¿ò,·µ»ØÖÁÖ÷Ò³Ãæ
            flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function closeXX(){
        $("#rclose").on("click", function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#restore_diag")));
        });
    }
    function closeb(){
        $("#bclose").on("click", function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#backup_diag")));
        });
    }
    function initFailDevGrid() {
        var opt = {
            colNames: getRcText("DEV_LIST"),
            showOperation: false,
            multiSelect: false,
            search: false,
            sortable: false,
            pageSize: 5,
            colModel: [
                {name: 'devSN', datatype: "String"}, //business_name branch_name
                {name: 'devState', datatype: "String"}, //business_name branch_name
            ]
        };
        $("#failList").SList("head", opt);
    }
    function initData()
    {
        function GetBackupTime(Suc,Fail) {

            var GetBackupTimeOpt = {
                type: "POST",
                url: MyConfig.path + "/ant/confmgr",
                contentType: "application/json",
                dataType: "json",
                timeout: 150000,
                data: JSON.stringify({
                    "configType": 1,
                    "sceneFlag": "true",
                    "sceneType": 2,
                    "userName": FrameInfo.g_user.user,
                    "shopName": g_sShopName,
                    "nasId": FrameInfo.Nasid,
                    "cfgTimeout": 120,
                    "cloudModule": "xiaoxiaobeicfg",
                    "deviceModule": "xiaoxiaobei",
                    "method": "GetBackupTime",
                    param: [{
                        "userName": FrameInfo.g_user.user,
                        "nasId": FrameInfo.Nasid,
                        "sceneName": g_sShopName

                    }]
                }),
                onSuccess: Suc,
                onFailed: Fail
            };
            Utils.Request.sendRequest(GetBackupTimeOpt);
        }

        function backupSuc(data, textStatus, jqXHR){
            try {
                if(!('result' in data )){
                    throw(new Error('result not exist'));
                }
                if (data.result == 0) {
                    $("#totlefileNum").html(getRcText("NEVER_BACKUP"));
                }
                else {
                    var myDate = new Date(data.result);
                    var year = myDate.getFullYear();
                    var mon = myDate.getMonth() + 1;
                    var day = myDate.getDate();
                    var hour = myDate.getHours();
                    var min = myDate.getMinutes();
                    var ss = myDate.getSeconds();
                    date = year + getRcText("DATE").split(",")[0] + mon + getRcText("DATE").split(",")[1] + day + getRcText("DATE").split(",")[2]
                        + hour + getRcText("DATE").split(",")[3] + min + getRcText("DATE").split(",")[4] + ss + getRcText("DATE").split(",")[5];
                    $("#totlefileNum").html(date);
                }
            }catch(error){
                console.log("GetBackupTime Fail,Error:"+error);
            }
        }
        function backupFail(){
            hPending&&hPending.close();
            console.log("GetBackupTime Fail!!!");
        }
        GetBackupTime(backupSuc,backupFail);
    }
    function initForm()
    {
        $("#backup_btn").on("click",function(){onOpenBackupDlg();});
        $("#recovery_btn").on("click", function(){onOpenRestoreDlg();});
    }
    function onOpenBackupDlg()
    {
        Utils.Base.openDlg(null, {}, {scope:$("#backupDlg"),className:"modal-small"});
    }
    function onOpenRestoreDlg()
    {
        Utils.Base.openDlg(null, {}, {scope:$("#restoreDlg"),className:"modal-small"});
    }
    function backupConform(){
        $("#backupConform").on("click", function(){
            Backup();
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#backup_diag")));
        });
    }
    function Backup() {
            hPending = Frame.Msg.pending(getRcText("PENDING"));
            var BackupSsideOpt = {
                type: "POST",
                url: MyConfig.path + "/ant/confmgr",
                contentType: "application/json",
                dataType: "json",
                timeout: 150000,
                data: JSON.stringify(
                    {
                        "configType": 1,
                        "sceneFlag": "true",
                        "sceneType": 2,
                        "userName": FrameInfo.g_user.user,
                        "shopName": g_sShopName,
                        "cfgTimeout": 120,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "xiaoxiaobei",
                        "method":"BackupAllCfg",
                        "param": [{
                            "userName": FrameInfo.g_user.user,
                            "nasId": FrameInfo.Nasid,
                            "sceneName": g_sShopName
                        }]
                    }),
                onSuccess: BackupSuc,
                onFailed: BackupFail
            };
        Utils.Request.sendRequest(BackupSsideOpt);
    }
    function BackupSuc(){
        hPending&&hPending.close();
        Frame.Msg.info(getRcText("BackupAllCfg").split(",")[1]);
        initData();
    }
    function BackupFail(){
        hPending&&hPending.close();
        Frame.Msg.info(getRcText("BackupAllCfg").split(",")[0]);
    }
    function restoreConform(){
        $("#restoreConform").on("click", function(){
            restore();
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#restore_diag")));
        });
    }
    function restore(){
        hPending = Frame.Msg.pending(getRcText("PENDING"));
        if(flag=== null){
            flag= restore;
            flag.args = arguments;
            var restoreOpt = {
                type: "POST",
                url: MyConfig.path + "/ant/confmgr",
                contentType: "application/json",
                dataType: "json",
                timeout: 150000,
                data: JSON.stringify(
                    {
                        "configType": 0,
                        "sceneFlag": "true",
                        "sceneType": 2,
                        "userName": FrameInfo.g_user.user,
                        "shopName": g_sShopName,
                        "cfgTimeout": 120,
                        "policy": "cloudFirst",
                        "nasId": FrameInfo.Nasid,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "xiaoxiaobei",
                        "method":"RestoreCurcfg",
                        "param": [{
                            "userName": FrameInfo.g_user.user,
                            "nasId": FrameInfo.Nasid,
                            "sceneName": g_sShopName
                        }]
                    }),
                onSuccess: restoreSuc,
                onFailed: restoreFail
            };
        }
        else{
            var restoreOpt = {
                type: "POST",
                url: MyConfig.path + "/ant/confmgr",
                contentType: "application/json",
                dataType: "json",
                timeout: 150000,
                data: JSON.stringify(
                    {
                        "configType": 0,
                        "sceneFlag": "true",
                        "sceneType": 2,
                        "userName": FrameInfo.g_user.user,
                        "shopName": g_sShopName,
                        "cfgTimeout": 120,
                        "nasId": FrameInfo.Nasid,
                        "devSN":g_onLine,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "xiaoxiaobei",
                        "method":"RestoreCurcfg",
                        "param": [{
                            "userName": FrameInfo.g_user.user,
                            "nasId": FrameInfo.Nasid,
                            "sceneName": g_sShopName
                        }]
                    }),
                onSuccess: restoreSuc,
                onFailed: restoreFail
            };
        }
        Utils.Request.sendRequest(restoreOpt);
    }
    function restoreSuc(data) {
        g_onLine=[];
        if (data.serviceResult == "success") {
            var aErrList = [];
            for (var i = 0; i < data.deviceResults.length; i++) {
                var curDevice = data.deviceResults[i];
                if (curDevice.deviceResult.result != "success") {
                    var devFailList = {
                        devSN: curDevice.devSN
                    };
                    if (g_onLine.indexOf(curDevice.devSN) == -1) {
                        g_onLine.push(curDevice.devSN);//²»ÖØ¸´µÄÉè±¸ÐòÁÐºÅ
                    }
                    //if (curDevice.communicateResult == "success") {
                    //    devFailList.devState = getRcText("STATE").split(",")[0];
                    //}
                    //else {
                    //    devFailList.devState = getRcText("STATE").split(",")[1];
                    //}
                    aErrList.push(devFailList);
                }
            }
            if (aErrList.length == 0) {
                Frame.Msg.info(getRcText("SUCCESS"));
                flag = null;
            }
            else {
                getStatus(g_onLine,aErrList,function(aErrOpt){
                    hPending&&hPending.close();
                    setTimeout(function(){
                        Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                    },500);
                    $("#failList").SList("refresh", aErrOpt);
                });
            }
        }
        //if (method == "RestoreCurcfg"){
        //    if (data.reason == "mongdb has some problems"){
        //        Frame.Msg.info(getRcText("DATA_ERRORMSG").split(",")[0], "error");
        //        // getRcText("DATA_ERRORMSG").split(",")[0]
        //    }else{
        //        Frame.Msg.info(getRcText("DATA_ERRORMSG").split(",")[1], "error");
        //    }
        //}else{
        //    Frame.Msg.info(getRcText(method).split(",")[0]);
        //}
        else {
            hPending&&hPending.close();
            Frame.Msg.info(getRcText("RestoreCurcfg").split(",")[1]);
            flag = null;
        }
    }
    function restoreFail(){
        hPending&&hPending.close();
        Frame.Msg.info(getRcText("RestoreCurcfg").split(",")[0]);
        flag = null;
    }
    function _init()
    {
        g_sShopName = Utils.Device.deviceInfo.shop_name;
        initForm();
        initData();
        backupConform();
        restoreConform();
        initFailDevGrid();
        failConform();
        closeMadle();
        closeX();
        closeXX();
        closeb();
    }
    function _destroy()
    {
        hPending&&hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Panel","SList","Form","FullCalendar"],
        "utils": ["Base","Request", 'Device']
    });
})(jQuery);