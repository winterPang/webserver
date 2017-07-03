(function ($)
{
    var MODULE_NAME = "x_networkcfg.devicemanage";
    var g_RowType;
    var strPath = MyConfig.path + '/ant';
    var getDevStatus = {};
    var hPending = null;
    var bSetReboot = false;
    var g_nTotal = 0;
    var g_apercent = {};
    var g_rebootTime = null;
    var g_sShopName = null;
    var g_bIsReboot = false;
    var g_sStartTime = null;
    var timerUpStatus;
    var g_onLine = [];//存储在线下发失败的设备
    var flag= null;//为空就是第一次下发，否则就是再次下发失败的设备
    var timerStatusList;
    var pastArr;
    var upGradeErr;
    var upArr;
    var timerRe;
    
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }
    /*返回单个设备状态*/
    function getSingleStatus(g_onLine,$this,callback){
        var getDevStatusOpt = {
            type:"POST",
            url:"/base/getDevs",
            dataType:"json",
            timeout: 150000,
            data:{
                devSN:g_onLine
            },
            onSuccess:function(data){
                callback($this,data.detail[0].status);
            },
            onFailed:function(){

            }
        };
        Utils.Request.sendRequest(getDevStatusOpt);
    }
    /*返回失败离线列表*/
    function getStatus(g_onLine,aErrList,callback){
        var getDevStatusOpt = {
            type:"POST",
            url:"/base/getDevs",
            dataType:"json",
            timeout: 150000,
            data:{
                devSN:g_onLine
            },
            onSuccess:function(data){
                for(var i=0;i<aErrList.length;i++){
                    for(var j=0;j<data.detail.length;j++){
                        if(aErrList[i].devSN==data.detail[j].devSN){
                            aErrList[i].devState=getRcText("STATE").split(",")[data.detail[i].status];
                        }
                    }
                }
                //console.log(g_onLine,data,aErrList,888888);
                callback(aErrList);

            },
            onFailed:function(){

            }
        };
        Utils.Request.sendRequest(getDevStatusOpt);
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
                {name: 'devSN', datatype: "String"},
                {name: 'devState', datatype: "String"}
            ]
        };
        $("#failList").SList("head", opt);
    }
    function fCheckCfgRet(data) {
        g_onLine=[];
        if(data.serviceResult =="success") {
            var aErrList = [];
            for (var i = 0; i < data.deviceResults.length; i++) {
                if (data.deviceResults[i].reason == "Failed to set cfg to device.") {
                    var devFailList ={
                        devSN:data.deviceResults[i].devSN
                    };
                    devFailList.devSN = data.deviceResults[i].devSN;
                    if(g_onLine.indexOf(data.deviceResults[i].devSN)==-1){
                        g_onLine.push(data.deviceResults[i].devSN);//不重复的设备序列号
                    }
                    //if(data.deviceResults[i].communicateResult=="success") {
                    //    devFailList.devState = getRcText("STATE").split(",")[0];
                    //}
                    //else{
                    //    devFailList.devState = getRcText("STATE").split(",")[1];
                    //}
                    aErrList.push(devFailList);
                }
            }
            if (aErrList.length == 0) {
                Frame.Msg.info(getRcText("VER_ERROR").split(",")[5]);
                flag = null;
            }
            else {
                getStatus(g_onLine,aErrList,function(aErrOpt){
                    hPending.close();
                    setTimeout(function(){
                        Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                    },500);
                    $("#failList").SList("refresh", aErrOpt);
                });
            }
        }
        else{
            Frame.Msg.info(getRcText("MSG_INFO2").split(",")[0],"error");
            flag = null;
        }
        hPending.close();
        return;
    }

    function failConform(){
        $("#failConform").on("click", function(){
            flag&&flag.apply(null,flag.args);
            //flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function closeMadle(){
        $("#failClose").on("click", function(){
            //关闭dialog弹框,返回至主页面
            flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function closeX(){
        $("#closeX").on("click", function(){
            //关闭dialog弹框,返回至主页面
            flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function getNewVerion(versionList) {
        var date = "";
        var listindex = 0;
        for(var i=0; i<versionList.length; i++){
            if(versionList[i].publication_date > date){
                listindex = i;
                date = versionList[i].publication_date;
            }
        }

        return versionList[listindex];
    }

    function initData(jScope)
    {
        showDevList();

    }

    function aj_getApInfo(callback) {

        var data = {
            "tenant_name": FrameInfo.g_user.attributes.name,
            "nasid": FrameInfo.Nasid
        }

        var ajax = {
            url: "/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal/getDeviceInfoShop",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify(data),
            onSuccess: function(data) {
                if(!('dev_list' in data)){
                    console.log('dev_list not exist');
                    return;
                }
                callback(data.dev_list);
            },
            onFailed:function(err){
                //Frame.Msg.error(MyConfig.httperror);
                hPending&&hPending.close();
                callback("");
            }
        }

        Utils.Request.sendRequest(ajax);

    }

    function aj_getVerInfo(model, apinfo, callback) {
        var ajax = {
            url: "/v3/ace/oasis/oasis-rest-dev-version/restdev/o2oportal/getModelVersion?model="+model,
            type: "GET",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            onSuccess: function(data) {
                try {
                    var versionInfo = {
                        'version': apinfo.dev_soft_ver || "--",
                        'url': "",
                        'size': ""
                    }
                    if(!('error_code' in data)){
                        throw (new Error('error_code not exist'));
                    }
                    if (data.error_code == 0) {
                        if(!('data_list' in data && data.data_list instanceof Array )){
                            throw (new Error('data_list not exist'));
                        }
                        var newVer = getNewVerion(data.data_list);
                        if(!(('version','url','size') in newVer)){
                            throw (new Error('newVer error'));
                        }
                        versionInfo.version = newVer.version;
                        versionInfo.url = newVer.url;
                        versionInfo.size = newVer.size;

                        callback(versionInfo, apinfo);
                    } else {
                        console.log("error");
                        callback(versionInfo, apinfo);
                    }
                }catch(error){
                    console.log(error);
                    var versionInfo = {
                        'version':apinfo.dev_soft_ver || "--",
                        'url':"",
                        'size':""
                    }
                    callback(versionInfo, apinfo);
                }
            },
            onFailed:function(err){
                var versionInfo = {
                    'version':apinfo.dev_soft_ver || "--",
                    'url':"",
                    'size':""
                }
                callback(versionInfo, apinfo);
                hPending&&hPending.close();
            }
        }
        Utils.Request.sendRequest(ajax);
    }

    function  aj_addDev(devSN, apname, callback) {

        var data = {
            "user_name":FrameInfo.g_user.attributes.name,
            "dev_sn":devSN,
            "shop_name": g_sShopName,
            "nasId": FrameInfo.Nasid,
        }

        var ajax = {
            url: "/v3/oasis/oasis-rest-shop/restshop/o2oportal/addDev",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify(data),
            onSuccess: function(data) {
                if(!('error_code' in data)){
                    console.log('error_code not exist');
                    return;
                }
                callback(data.error_code);
            },
            onFailed:function(err){
                //Frame.Msg.error(MyConfig.httperror);
                callback(1);
                hPending&&hPending.close();
            }
        }

        Utils.Request.sendRequest(ajax);
    }

    function  aj_reBootAC(apSN, callback) {


        // base接口
        var data = {
            'devSN':  apSN,  //序列号
            'saveConfig'  :1,//1：保存配置，0：不保存配置
            "nasId": FrameInfo.Nasid,
        }

        hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[0]);
        // "设备正在重启..."
        var ajax = {
            url: MyConfig.path+"/base/resetDev",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify(data),
            timeout: 300000,
            onSuccess: function(data) {
                try {
                    if(!('retCode' in data)){
                        throw (new Error('retCode not exist'));
                    }
                    if (data.retCode == 0) {
                        callback(data.retCode);
                    } else {
                        callback(1);
                    }
                }catch(error){
                    console.log(error);
                }finally{
                    hPending&&hPending.close();
                }
            },
            onFailed:function(err){
                hPending&&hPending.close();
                callback(1);
            }
        }

        Utils.Request.sendRequest(ajax);
    }

    function  aj_devDel(apSN, callback) {
        var data = {
            "user_name":FrameInfo.g_user.attributes.name,
            "dev_sn":apSN,
            "nasId": FrameInfo.Nasid,
        }

        var ajax = {
            url: "/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal/deleteDev",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify(data),
            onSuccess: function(data) {
                try {
                    if (!('error_code' in data)) {
                        throw (new Error('error_code not exist'));
                    }
                    callback(data.error_code);
                    console.log("ff");
                    console.log(data);
                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                //Frame.Msg.error(MyConfig.httperror);
                callback(1);
                hPending&&hPending.close();
            }
        }

        Utils.Request.sendRequest(ajax);
    }

    function  aj_UpgradeStatus(sACSN){
        var errMessage = getRcText("VER_ERROR").split(",");
        var ajax = {
            url: MyConfig.path+"/base/getUpdateStatus",
            dataType: "json",
            timeout: 150000,
            type:"post",
            data:{
                devSN:sACSN
            },
            onSuccess:function(data){
                try {
                    if(!('status' in data)){
                        throw (new Error('data.status not exist'));
                    }
                    if (g_sStartTime == null)
                    {
                        return;
                    }
                    var bTimeOutFlag = ((new Date() - g_sStartTime) > 600000)?true:false;
                    if ((data.status != "0") || bTimeOutFlag){
                        clearInterval(getDevStatus[sACSN]);
                        delete getDevStatus[sACSN];
                        if (JSON.stringify(getDevStatus) == '{}')
                        {
                            g_apercent={};
                            g_nTotal=0;
                            g_bIsReboot=false;
                            $("#verProgress").addClass("hide");
                            hPending.close();
                            showDevList();
                            g_sStartTime = null;
                        }
                    }
                    console.log(data.status);
                    if (bTimeOutFlag){
                        Frame.Msg.info(errMessage[7], "error");
                    }
                    else if (data.status == "0") {
                        if(!('percent' in data)){
                            throw (new Error('data.percent not exist'));
                        }
                        g_apercent[sACSN] = data.percent;
                        var curPercent = 0;
                        for(var sSn in g_apercent)
                        {
                            curPercent += g_apercent[sSn];
                        }
                        curPercent = Math.round(curPercent/g_nTotal)*100;
                        $(".progress .progress-bar-striped").attr("valuenow", curPercent)
                            .css("width", curPercent + "%");
                        $(".progress .progress-bar-striped span").text(curPercent + "% Complete");
                        //console.log("升级进度:" + data.percent);
                        console.log(getRcText("MSG_INFO").split(",")[6], + curPercent);

                        if ((curPercent == 100)&&(g_bIsReboot == false)){
                            hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[1]);
                            g_bIsReboot = true;
                            // "设备重启中..."
                        }

                    } else if (data.status == "1") {
                        Frame.Msg.info(errMessage[4]);
                    } else if (data.status == "2") {
                        Frame.Msg.info(errMessage[0], "error");
                    } else if (data.status == "3") {
                        Frame.Msg.info(errMessage[1], "error");
                    } else if (data.status == "4") {
                        Frame.Msg.info(errMessage[2], "error");
                    } else if (data.status == "5") {
                        Frame.Msg.info(errMessage[3], "error");
                    }

                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                hPending&&hPending.close();
                return;
            }
        };

        Utils.Request.sendRequest(ajax);
    }

    function  upDateDevQueue(rowData,upArr){
        console.log(upArr,555);
        var upgradeArr=[];
        if(upArr){
            upgradeArr=upArr;
        }else{
            for(var i=0;i<rowData.length;i++){
                var upgradeParam={
                    devSN:rowData[i].SN,
                    fileSize:rowData[i].newversion.size,
                    devVersionUrl:rowData[i].newversion.url,
                    saveConfig:1,
                    rebootDev:1,
                    softwareVersion:rowData[i].newversion.version
                };
                upgradeArr.push(upgradeParam);
            }
        }
        var ajax = {
            url: "/v3/base/updateDevices",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType: "application/json",
            data:{
                param:upgradeArr
            },
            onSuccess: function(data) {
                getDevsn();
                if(data.retCode==0||data.retCode==-1){
                    //getDevsn();
                    setTimeout(function(){
                        getDevsn();
                        clearInterval(timerStatusList);
                        timerStatusList=setInterval(function(){
                            getDevsn();
                        },2000);
                    },1000);
                    var failTips=[];
                    var failArr=[];
                    for(var i=0;i<data.message.length;i++){
                        if(data.message[i].retCode==2){
                            failArr.push(data.message[i].devSN);
                            var failDetail={
                                "devSN":data.message[i].devSN,
                                "devState":getRcText("STATE").split(",")[1]
                            }
                        }
                        failTips.push(failDetail);
                    }
                    if(failTips.length>=1){
                        //$(".btn-apply,#failConform").off("click");
                        getStatus(failArr,failTips,function(failTips){
                            var reUp=[];
                            console.log(upgradeArr,888);
                            $("#failList").SList("refresh", failTips);
                            //Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                            setTimeout(function(){
                                Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                            },1000);
                            for(var i=0;i<upgradeArr.length;i++){
                                for(var j=0;j<upgradeArr.length;j++){
                                    if(upgradeArr[i].devSN==failArr[j]){
                                        reUp.push(upgradeArr[i]);
                                    }
                                }
                            }
                            $(".form-actions .btn:eq(0)").off("click");
                            $(".form-actions .btn:eq(0)").on("click",function(){
                                //alert(999);
                                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failcfgDlg")));
                                upDateDevQueue(rowData,reUp);
                            });
                        })



                        /* $("#failList").SList("refresh", failTips);
                         setTimeout(function(){
                         Utils.Base.openDlg(null, {}, {scope:$("#client_diag"),className:"modal-large"});
                         },1000);*/
                    }
                    upGradeErr=data.message;
                }else{
                    console.log("upgrade err!",data);
                    Frame.Msg.info(getRcText("Que_fail"),"error");
                }
            },
            onFailed:function(err){
                //Frame.Msg.error(MyConfig.httperror);
                console.log("UpGrade err");
                //hPending.close();
            }
        };
        Utils.Request.sendRequest(ajax);
    }
    function  aj_Upgrade(rowData) {

        var para = {
            'devSN' :rowData.SN,
            'fileSize' : rowData.newversion.size,            //软件大小，单位字节
            'devVersionUrl'   : rowData.newversion.url,      //AC设备软件存放路径
            'saveConfig'  :1,                                //1：保存配置，0：不保存配置
            'rebootDev'    :1                                //1：重启设备，0：不重启设备
        }
        hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[2]);
        // "设备正在升级..."
        g_sStartTime = new Date();
        var ajax = {
            url: MyConfig.path+"/base/updateDev",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify(para),
            onSuccess: function(data) {
                try {
                    if(!('retCode' in data)){
                        throw (new Error('retCode not exist'));
                    }
                    if (data.retCode == 0) {
                        //Frame.Msg.info("升级成功");
                        $("#verProgress").removeClass("hide");
                        g_nTotal += 100;
                        g_apercent[rowData.SN] = 0;
                        getDevStatus[rowData.SN] = setInterval(function () {
                            aj_UpgradeStatus(rowData.SN);
                        },1000);
                    } else {
                        Frame.Msg.info(getRcText("MSG_INFO").split(",")[0],"error");
                        // "升级失败"
                        if (JSON.stringify(getDevStatus) == '{}')
                        {
                            hPending.close();
                            g_sStartTime = null;
                        }
                    }
                }catch(error){
                    console.log(error);
                }
            },
            onFailed:function(err){
                if (JSON.stringify(getDevStatus) == '{}')
                {
                    hPending.close();
                }
                Frame.Msg.info(getRcText("MSG_INFO").split(",")[0],"error");
                g_sStartTime = null;
            }
        }

        Utils.Request.sendRequest(ajax);
    }

    function onError()
    {
        Frame.Msg.info(getRcText("MSG_INFO").split(",")[1],"error");
    }

    /*添加多设备在线状态*/
    function addStatus(g_AllAp,callback){
        var g_statues=[];
        for(var i=0;i<g_AllAp.length;i++){
            g_statues.push(g_AllAp[i].SN);
        }
        var getDevStatusOpt = {
            type:"POST",
            url:"/base/getDevs",
            dataType:"json",
            timeout: 150000,
            data:{
                devSN:g_statues
            },
            onSuccess:function(data){
                for(var i=0;i<data.detail.length;i++){
                    for(var j=0;j<g_AllAp.length;j++){
                        if(data.detail[i].devSN==g_AllAp[j].SN){
                            g_AllAp[j].lineStatus=getRcText("STATE").split(",")[data.detail[i].status];
                        }
                    }
                }
                console.log(g_AllAp);
                callback(g_AllAp);
            },
            onFailed:function(){

            }
        };
        Utils.Request.sendRequest(getDevStatusOpt);
    }

    /*检测重复model*/
    function checkModel(name,arr){
        var modelFlag=false;
        for(var i=0;i<arr.length;i++){
            if(arr[i]==name){
                modelFlag=true;
                break;
            }
        }
        return modelFlag;
    }

    /*获取详细版本信息*/
    function getVersionDetails(g_AllAp,modelName,callback){
        var data={models:modelName};
        var ajax = {
            url: "/v3/ace/oasis/oasis-rest-dev-version/restdev/o2oportal/getModelVersions",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            data:JSON.stringify(data),
            onSuccess: function(result) {
                console.log("版本信息",data);
                var modelList=[];
                for(var i=0;i<result.data.length;i++){
                    var oneModel={
                        modelVersion:result.data[i].model,
                        details:{
                            version : getNewVerion(result.data[i].version_list).version,
                            url : getNewVerion(result.data[i].version_list).url,
                            size : getNewVerion(result.data[i].version_list).size
                        }
                    }
                    modelList.push(oneModel);
                }


                callback(g_AllAp,modelList);


            },
            onFailed:function(err){
                console.log(err);
            }
        };
        Utils.Request.sendRequest(ajax);
    }

    /*补全设备信息*/
    function getDevInfo(statusList,onedata,g_AllAp,shopData) {
        var getDevInfoOpt = {
            url:MyConfig.path + "/devmonitor/web/getDevsInfo?devSN="+FrameInfo.ACSN ,
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType:"application/json",
            data:{
                devSN:statusList
            },
            onSuccess:function(data){
                //console.log("全部详细数据及model",data);
                var modelName=[];

                /*提取model*/
                for(var i=0;i<data.devarray.length;i++){
                    if(data.devarray[i].devMode){
                        if(!checkModel(data.devarray[i].devMode,modelName)){
                            modelName.push(data.devarray[i].devMode);
                        }
                    }
                }

                /*拼接数据*/
                for(var i=0;i<shopData.length;i++){
                    var singleG_AllAp={
                        lineStatus:"",
                        ApName: shopData[i].alias_name,
                        SN: shopData[i].dev_sn,
                        curversion: shopData[i].dev_soft_ver || "--",
                        newversion: "",
                        OnlineTime: shopData[i].devOnlineTime,
                        //OnlineTime: data.online_time,
                        apmodel: shopData[i].dev_model
                    };
                    for(var j=0;j<data.devarray.length;j++){
                        if(shopData[i].dev_sn==data.devarray[j].devSN){
                            singleG_AllAp.OnlineTime=formatSeconds(data.devarray[j].devOnlineTime);
                            break;
                        }
                    }
                    g_AllAp.push(singleG_AllAp);
                }

                /*版本信息添加*/
                getVersionDetails(g_AllAp,modelName,function(g_AllAp,modelDatails){
                    console.log("所有版本信息及列表数据",g_AllAp,modelDatails);
                    for(var i=0;i<g_AllAp.length;i++){
                        for(var j=0;j<modelDatails.length;j++){
                            if(modelDatails[j].modelVersion==g_AllAp[i].apmodel){
                                g_AllAp[i].newversion=modelDatails[j].details;
                            }
                        }
                    }
                    addCurrentVersion(g_AllAp,function(g_AllAp){
                        /*添加状态*/
                        addStatus(g_AllAp,function(g_AllAp){
                            console.log("最终列表数据",g_AllAp);
                            var upFlag=false;
                            var toFlag=false;
                            var upGraded=[];
                            var toUpGrade=[];
                            for(var i=0;i<g_AllAp.length;i++){
                                if(g_AllAp[i].curversion==g_AllAp[i].newversion.version){
                                    upFlag=true;
                                    upGraded.push(g_AllAp[i]);
                                }else{
                                    toFlag=true;
                                    toUpGrade.push(g_AllAp[i]);
                                }
                            }
                            if(upFlag){
                                $("#Que_WipsList").SList ("refresh",upGraded)
                            }
                            if(toFlag){
                                $("#WipsList").SList ("refresh",toUpGrade)
                            }
                            getDevsn();
                            clearInterval(timerStatusList);
                            timerStatusList=setInterval(function(){
                                getDevsn();
                            },5000);
                        });
                    });
                    console.log("添加信息后数据",g_AllAp);
                });
            },
            onFailed:function(err){
                console.log(err);
            }
        };
        Utils.Request.sendRequest(getDevInfoOpt);
    }

    /*修改当前版本信息*/
    function addCurrentVersion(g_AllAp,callback){
        var arrCurrent=[];
        for(var i=0;i<g_AllAp.length;i++){
            arrCurrent.push(g_AllAp[i].SN);
        }
        var ajax={
            url: "/v3/base/getAllUpdateStatus",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType: "application/json",
            data:{
                devSN:arrCurrent
            },
            onSuccess: function(data) {
                if(data.retCode==0){
                    for(var i=0;i<g_AllAp.length;i++){
                        for(var j=0;j<data.message.length;j++){
                            if(data.message[j].devSN==g_AllAp[i].SN){
                                g_AllAp[i].curversion=data.message[j].softwareVersion.split(",")[0];
                                g_AllAp[i].newversion.version=data.message[j].versionNeedUp||g_AllAp[i].newversion.version;
                            }
                        }
                    }
                    callback(g_AllAp);
                }else{

                }
            },
            onFailed:function(err){
                //Frame.Msg.info(getRcText("Que_UGstatus"),"error");
                console.log("addCurrentVersion err",err);
            }
        };
        Utils.Request.sendRequest(ajax);
    }


    /*获取最新版本*/
    function getNewVersion(model,currentVersion,callback) {
        var ajax = {
            url: "/v3/ace/oasis/oasis-rest-dev-version/restdev/o2oportal/getModelVersion?model="+model,
            type: "GET",
            dataType: "json",
            timeout: 150000,
            contentType: "application/json",
            onSuccess: function(data) {
                try {
                    var versionInfo = {
                        'version': "",
                        'url': "",
                        'size': ""
                    }
                    if(!('error_code' in data)){
                        throw (new Error('error_code not exist'));
                    }
                    if (data.error_code == 0) {
                        if(!('data_list' in data && data.data_list instanceof Array )){
                            throw (new Error('data_list not exist'));
                        }
                        var newVer = getNewVerion(data.data_list);
                        if(!(('version','url','size') in newVer)){
                            throw (new Error('newVer error'));
                        }
                        versionInfo.version = newVer.version;
                        versionInfo.url = newVer.url;
                        versionInfo.size = newVer.size;

                        callback(versionInfo);
                    } else {
                        console.log("error");
                        //callback(versionInfo, apinfo);
                    }
                }catch(error){
                    console.log(error);
                    var versionInfo = {
                        'version':"",
                        'url':"",
                        'size':""
                    }
                    //callback(versionInfo, apinfo);
                }
            },
            onFailed:function(err){
                var versionInfo = {
                    'version':apinfo.dev_soft_ver || "--",
                    'url':"",
                    'size':""
                }
                callback(versionInfo, apinfo);
                hPending.close();
            }
        }
        Utils.Request.sendRequest(ajax);
    }
    /*时间转换*/
    function doubleZ(n){
        var str=n+"";
        if(str.length==1){
            str=0+str;
        }else{

        }
        return str;
    }

    function formatSeconds(time) {
        var D=parseInt(time/86400);
        var H=parseInt((time%86400)/3600);
        var M=parseInt(((time%86400)%3600)/60);
        var S=parseInt((((time%86400)%3600)%60));
        return doubleZ(D)+"D:"+doubleZ(H)+"H:"+doubleZ(M)+"M:"+doubleZ(S)+"S";
        //return time;
    }

    function showDevList() {
        var g_AllAp = [];
        // hPending = Frame.Msg.pending("正在获取设备列表...");
        hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[3]);
        aj_getApInfo(function (devlist) {
            var arrDev=[];
            if (devlist != ""){
                for(var i=0; i<devlist.length; i++){
                    if (devlist[i].shop_name == g_sShopName){
                        var onedata = devlist[i];
                        arrDev.push(devlist[i].dev_sn);
                    }
                }
                //console.log("arrdev",arrDev,devlist);
                getDevInfo(arrDev,onedata,g_AllAp,devlist);
            }

            hPending.close();

        });
    }

    function RebootPro(oRowData) {
        for(var i=0; i<oRowData.length; i++){
            aj_reBootAC(oRowData[i].SN, function (error_code) {
                if(error_code == 0){
                    Frame.Msg.info(getRcText("MSG_INFO").split(",")[2]);
                    // "成功重启设备"
                    console.log("su");
                }else{
                    Frame.Msg.info(getRcText("MSG_INFO").split(",")[3],"error");
                    // "设备重启失败"
                    console.log("faild");
                }

                showDevList();
            });
        }
    }

    function DeletePro(oRowData) {

        for(var i=0; i<oRowData.length; i++){
            aj_devDel(oRowData[i].SN, function (error_code) {
                if(error_code == 0){
                    Frame.Msg.info(getRcText("MSG_INFO").split(",")[4]);
                    // "成功删除设备"
                }else{
                    Frame.Msg.info(getRcText("MSG_INFO").split(",")[5],"error");
                    // "设备删除失败"
                }

                showDevList();
            });
        }
    }

    function updateQueue(oRowData){
        //upDateDevQueue(oRowData);
        if(oRowData.length==1&&oRowData[0].curversion.replace(/\s/g, "") == oRowData[0].newversion.version.replace(/\s/g, "")){
            Frame.Msg.info(getRcText("MSG_INFO1").split(",")[0]);
        }else{
            upDateDevQueue(oRowData);
        }
    }

    function UpdatePro(oRowData) {
        Utils.Base.openDlg(null, {}, {scope:$("#warningModal"),className:"modal-large"});
        $("#warningForm").form("init", "edit", {title : getRcText("WARNING"),"btn_apply": function () {
            for(var i=0; i<oRowData.length; i++){
                if(oRowData[i].curversion.replace(/\s/g, "") == oRowData[i].newversion.version.replace(/\s/g, "")){
                    Frame.Msg.info(getRcText("MSG_INFO1").split(",")[0]);
                    // "已经是最新版本"
                }else{
                    aj_Upgrade(oRowData[i]);

                }
            }
        }});
        $("div").find(".btn-apply").removeClass('disabled');
        $($("div").find(".modal-footer>a")[2]).removeClass('btn-apply').addClass('btn-cancel');
        $($("div").find(".modal-footer>a")[3]).removeClass('btn-cancel').addClass('btn-apply');

        /**/
    }

    function AddPro(apSN, apName) {

        aj_addDev(apSN, apName, function (err_code) {
            if (err_code == 1){
                Frame.Msg.info(getRcText("MSG_INFO1").split(",")[1],'error');
                //    "添加设备失败"
            }else{
                Frame.Msg.info(getRcText("MSG_INFO1").split(",")[2]+apName);
                //    "成功添加设备"
            }
            showDevList();
        });
    }

    function onOpenDlg(oRowData,type)
    {
        $("#StatusForm").form("init", "edit", {title : getRcText("CONFIRM_TITLE"),"btn_apply": function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#StatusForm")));
        }});
        $("#ApText").html(getRcText("TEXT").split(",")[0]+type+getRcText("TEXT").split(",")[1]);
        // "是否批量""设备"
        $("div").find(".btn-apply").removeClass('disabled');
        Utils.Base.openDlg(null, {}, {scope:$("#StatusDlg"),className:"modal-super"});
    }

    /*去重*/
    function popRepeat(arr){
        var arrL=[];
        for(var i=0;i<arr.length;i++){
            var fl=false;
            if(arrL.length==0){
                arrL.push(arr[i]);
            }else{
                for(var j=0;j<arrL.length;j++){
                    if(arrL[j]==arr[i]){
                        fl=true;
                    }else{

                    }
                }
                if(!fl){
                    arrL.push(arr[i]);
                }
            }
        }
        return arrL;
    }

    function getDevsn(){
        var arrClick=[];
        $("#WipsList .slist-row").find(".slist-cell:eq(2)").each(function(){
            arrClick.push($(this).html());
        });
        /*获取表格中设备序列码*/
        if(arrClick==""){
            clearInterval(timerStatusList);
        }else{
            getDevStatusQueue2(arrClick);
        }


    }

    function checkStatus(devSN,pastDev,statuesData,callback){
        $.ajax({
            url:MyConfig.path + "/devmonitor/web/getDevsInfo?devSN="+FrameInfo.ACSN ,
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType:"application/json",
            data:{
                devSN:devSN
            },
            success:function(data){
                callback(statuesData,data);
            },
            fail:function(err){
                console.log(err);
            }
        });
    }

    function getDevStatusQueue2(arrClick){
        var ajax={
            url: "/v3/base/getAllUpdateStatus",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType: "application/json",
            data:{
                devSN:arrClick
            },
            onSuccess: function(data) {
                if(data.retCode==0){
                    var fl=0;
                    $("#WipsList .slist-row").find(".slist-cell.sl4 ").each(function(){
                        $(this).attr({"title":"升级状态"});
                    });
                    for(var i=0;i<data.message.length;i++){
                        /*重启中。。。*/
                        if(data.message[i].status==0&&data.message[i].percent==100){
                            $("#WipsList .slist-row").find(".slist-cell:eq(2)").each(function(){
                                if($(this).html()==data.message[i].devSN){
                                    /*手动设置离线*/
                                    $(this).siblings(".sl5 ").html(getRcText("STATE").split(",")[1]);

                                    $(this).siblings().children("div.bar").html('<div style="float:left;border-radius:5px;-webkit-border-radius:5px;-ms-border-radius:5px;margin:17px 0;width:50%;height:10px;background:#ccc;"><div style="border-radius:5px;-webkit-border-radius:5px;-ms-border-radius:5px;height:10px;width:'+data.message[i].percent+'%;background:#4ec1b2;text-align:center;line-height:10px;color:#fff;">'+data.message[i].percent+'%</div></div><div  class="sText" style="color:#4ec1b2;float:left;width:40%;">'+getRcText("PENDING_MSG").split(",")[1]+'</div>');
                                    $(this).siblings("div:eq(6)").find("a i.slist-upgrade").remove();
                                    $(this).siblings(".slist-cell:eq(0)").html('<div style="width: 15px;"></div>');
                                    $(this).siblings("div:eq(6)").find("a i.slist-reboot").remove();
                                    $(this).siblings(".sl5 ").html(getRcText("STATE").split(",")[1]);
                                }
                            });
                            /*升级中。。。*/
                        }else if(data.message[i].percent!=100&&data.message[i].status==0){
                            $("#WipsList .slist-row").find(".slist-cell:eq(2)").each(function(){
                                if($(this).html()==data.message[i].devSN){
                                    var $this=$(this);
                                    $this.siblings().children("div.bar").html('<div style="float:left;border-radius:5px;-webkit-border-radius:5px;-ms-border-radius:5px;margin:17px 0;width:60%;height:10px;background:#ccc;"><div style="border-radius:5px;-webkit-border-radius:5px;-ms-border-radius:5px;height:10px;width:'+data.message[i].percent+'%;background:#4ec1b2;text-align:center;line-height:10px;color:#fff;">'+data.message[i].percent+'%</div></div><div  class="sText" style="color:#4ec1b2;float:left;width:40%;">'+getRcText("Que_upGrade").split(",")[data.message[i].status]+'</div>');
                                    $this.siblings("div:eq(6)").find("a i.slist-upgrade").remove();
                                    $this.siblings(".slist-cell:eq(0)").html('<div style="width: 15px;"></div>');
                                    $this.siblings("div:eq(6)").find("a i.slist-reboot").remove();
                                }
                            });
                            /*升级完成或准备状态，后台状态无法区别使用接口获取当前及最新版本来区分*/
                        }else if(data.message[i].percent==100&&data.message[i].status==1){
                            $("#WipsList .slist-row").find(".slist-cell:eq(2)").each(function(){
                                if($(this).html()==data.message[i].devSN) {
                                    if($(this).siblings(".sl5 ").html()==getRcText("STATE").split(",")[1]){
                                        $(this).siblings("div:eq(6)").find("a i.slist-upgrade").remove();
                                        $(this).siblings("div:eq(6)").find("a i.slist-reboot").remove();
                                        $(this).siblings(".slist-cell:eq(0)").html('<div style="width: 15px;"></div>');
                                    }
                                    var $this = $(this);
                                    if((data.message[i].softwareVersion.split(",")[0]==data.message[i].versionNeedUp)&&(data.message[i].softwareVersion!='')&&(data.message[i].versionNeedUp!='')) {
                                        $this.siblings("div:eq(6)").find("a i.slist-upgrade").remove();
                                        $this.siblings("div:eq(6)").find("a i.slist-reboot").remove();
                                        //$(this).siblings(".sl5 ").html(getRcText("STATE").split(",")[1]);

                                        /*手动设置在线*/
                                        $(this).siblings(".sl5 ").html(getRcText("STATE").split(",")[0]);

                                        $(this).siblings(".slist-cell:eq(0)").html('<div style="width: 15px;"></div>');
                                        $this.siblings().children("div.bar").html(getRcText("Que_compare").split(",")[0]).css({"color": "#4ec1b2"});
                                        Frame.Msg.info(getRcText("Que_compare").split(",")[0]);
                                        timerRe=null;
                                        timerRe=setTimeout(function () {
                                            $("#WipsList .slist-center").html("");
                                            showDevList();
                                        }, 500);
                                    }else{
                                        $this.siblings().children("div.bar").html(getRcText("Que_compare").split(",")[1]).css({"color":"#4ec1b2"});
                                        //if(data.message[i].versionNeedUp!=''){
                                        //    $this.siblings().children("div.bar").html(getRcText("Que_compare").split(",")[2]).css({"color":"#4ec1b2"});
                                        //    $(this).siblings("div:eq(6)").find("a i.slist-upgrade").remove();
                                        //    $(this).siblings("div:eq(6)").find("a i.slist-reboot").remove();
                                        //    $(this).siblings(".slist-cell:eq(0)").html('<div style="width: 15px;"></div>');
                                        //}else{
                                        //    $this.siblings().children("div.bar").html(getRcText("Que_compare").split(",")[1]).css({"color":"#4ec1b2"});
                                        //}

                                    }
                                }
                            });
                            fl++;
                            /*升级出错状态*/
                        }else{
                            $("#WipsList .slist-row").find(".slist-cell:eq(2)").each(function(){
                                if($(this).siblings(".sl5 ").html()==getRcText("STATE").split(",")[1]){
                                    $(this).siblings("div:eq(6)").find("a i.slist-upgrade").remove();
                                    $(this).siblings("div:eq(6)").find("a i.slist-reboot").remove();
                                    $(this).siblings(".slist-cell:eq(0)").html('<div style="width: 15px;"></div>');
                                    //console.log($("#WipsList .slist-row").find(".slist-cell:eq(0)"),345);
                                }
                                if($(this).html()==data.message[i].devSN){
                                    var BacStatus=[];
                                    var $this=$(this);
                                    BacStatus.push(data.message[i].devSN);
                                    var textFlag=data.message[i].status;
                                    $this.siblings().children("div.bar").html(getRcText("Que_upGrade").split(",")[textFlag]).css({"color":"red"});
                                }
                            });
                            fl++;
                        }
                    }
                    /*无升级设备停止状态获取*/
                    //console.log(fl,"fl");
                    if(fl==data.message.length){
                        clearInterval(timerStatusList);
                    }
                }else{
                    console.log("get status err",data);
                    //Frame.Msg.info(getRcText("Que_UGstatus"),"error");
                }
            },
            onFailed:function(err){
                //Frame.Msg.info(getRcText("Que_UGstatus"),"error");
                console.log("get status err",err);
                hPending.close();
            }
        };
        Utils.Request.sendRequest(ajax);
    }

    function getDevStatusQueue(oRowData){
        var snArr=[];
        var statusQueue=[];
        var statusIng=[];
        var statusComplete=[];
        for(var i=0;i<oRowData.length;i++){
            snArr.push(oRowData[i].SN+"");
        }
        if(pastArr){
            snArr=popRepeat(snArr.concat(pastArr));
        }else{
            pastArr=snArr;
        }
        var ajax={
            url: "/v3/base/getAllUpdateStatus",
            type: "POST",
            dataType: "json",
            ContentType: "application/json",
            data:{
                devSN:snArr
            },
            onSuccess: function(data) {
                if(data.retCode==0){
                    for(var i=0;i<data.message.length;i++){
                        var statusData={
                            //"ApName":oRowData[i].ApName,
                            "SN":data.message[i].devSN,
                            "percent":data.message[i].percent,
                            "status":getRcText("Que_upGrade").split(",")[data.message[i].status]
                        }
                        statusQueue.push(statusData);
                    }
                    for(var j=0;j<upGradeErr.length;j++){
                        if(upGradeErr[j].retCode==2){
                            for(var i=0;i<statusQueue.length;i++){
                                if(upGradeErr[j].devSN==statusQueue[i].SN){
                                    statusQueue[i].status=getRcText("Que_upGradeFail");
                                }
                            }
                        }
                    }
                    console.log(statusData);
                    for(var i=0;i<statusQueue.length;i++){
                        if(statusQueue[i].status!=getRcText("Que_upGrade").split(',')[0]){
                            statusComplete.push(statusQueue[i]);
                        }else{
                            if(statusQueue[i].percent==100){
                                statusQueue[i].status=getRcText("PENDING_MSG").split(',')[0];
                            }
                            statusIng.push(statusQueue[i]);
                        }
                    }
                    upDateStatus(statusIng,statusComplete);
                }else{
                    console.log("get status err",data);
                    Frame.Msg.info(getRcText("Que_UGstatus"),"error");
                }
            },
            onFailed:function(err){
                Frame.Msg.info(getRcText("Que_UGstatus"),"error");
                console.log(err);
                hPending.close();
            }
        };
        Utils.Request.sendRequest(ajax);
    }

    /*插入进度*/
    function percentBar(row, cell, value, columnDef, dataContext, type)
    {
        return '<div style="width:50%;background:#ccc;height:10px;margin:16px 0;border-radius:5px;-webkit-border-radius:5px;-ms-border-radius:5px;"><div style="height:100%;text-align:center;line-height:10px;width:'+value+'%;background:green;border-radius:5px;-ms-border-radius:5px;-webkit-border-radius:5px;color:#fff">'+value+'%</div></div>'
    }

    /*刷新状态列表*/
    function upDateStatus(statusIng,statusComplete){
        if(statusIng.length==0){
            $("#listIng").SList ("refresh", statusIng);
            $("#listComplete").SList ("refresh", statusComplete);
            setTimeout(function(){
                setTimeout(function(){
                    $('#Que_complete').slideUp();
                    $('#Que_Ing').slideUp();
                },1000);
                Frame.Msg.info(getRcText("Que_Complete"));
                setTimeout(function(){
                    showDevList();
                },2000);
            },1000);
            clearInterval(timerStatusList);
        }else{
            $("#listIng").SList ("refresh", statusIng);
            $("#listComplete").SList ("refresh", statusComplete);
        }
    }

    /*筛选表格在线可升级设备*/
    function selectDevice(){
        var arrDel=[];
        $("#WipsList .slist-row").each(function(){
            //console.log($(this).children(".sl4").find("div.bar"),$(this).children(".sl4").find("div.bar").html(),getRcText("Que_compare").split(",")[1],$(this).children(".sl5").html(),getRcText("STATE").split(",")[0],$(this).children(".sl1").html());
            /*在线，状态为升级失败或者带升级*/
            if($(this).children(".sl4").find("div.bar")&&(($(this).children(".sl4").find("div.bar").html()==getRcText("Que_compare").split(",")[1])||($(this).children(".sl4").find("div.bar").html()==getRcText("Que_upGrade").split(",")[5])||($(this).children(".sl4").find("div.bar").html()==getRcText("Que_upGrade").split(",")[3])||($(this).children(".sl4").find("div.bar").html()==getRcText("Que_upGrade").split(",")[2])||($(this).children(".sl4").find("div.bar").html()==getRcText("Que_upGrade").split(",")[4])||($(this).children(".sl4").find("div.bar").html()==getRcText("Que_upGrade").split(",")[6])||($(this).children(".sl4").find("div.bar").html()==getRcText("Que_upGrade").split(",")[7]))&&$(this).children(".sl5").html()==getRcText("STATE").split(",")[0]){

            }else{
                arrDel.push($(this).children(".sl1").html());
            }
        });
        return arrDel;
    }

    function onUpdaOpenDlg(oRowData, type)
    {
        /*去除版本离线的设备*/
        var arrFilter=selectDevice();
        for(var i=0;i<oRowData.length;i++){
            for(var j=0;j<arrFilter.length;j++){
                if(oRowData[i].SN&&oRowData[i].SN==arrFilter[j]){
                    oRowData.splice(i,1);
                    i--;
                    break;
                }
            }
        }
        if(oRowData.length==0){
            Frame.Msg.info(getRcText("Que_devNone"));
            return;
        }
        /*if(oRowData.length==0){
            Frame.Msg.info(getRcText("Que_allComplete"));
            setTimeout(function(){
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#StatusForm")));
            },1000);
        }*/
        var context = "";
        if (type == "dev_update"){
            context =getRcText("BATCH_UPGRADE_TEXT").split(",")[0];
            // "是否批量升级下列选中设备"
        }else{
            context = getRcText("BATCH_UPGRADE_TEXT").split(",")[1]+oRowData[0].ApName;
            // "是否升级设备"
        }
        $("#StatusForm").form("init", "edit", {title : getRcText("CONFIRM_TITLE"),"btn_apply": function () {
            //UpdatePro(oRowData);
            updateQueue(oRowData);
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#StatusForm")));
        }});
        $("#ApText").html(context);
        $("div").find(".btn-apply").removeClass('disabled');
        // 批量更新下列选中的设备

        $("#WipsList1").SList ("refresh", oRowData);
        Utils.Base.openDlg(null, {}, {scope:$("#StatusDlg"),className:"modal-super"});
    }

    function onRebOpenDlg(oRowData, type)
    {
        var context = "";
        if (type == "dev_reboot"){
            context = getRcText("BATCH_RESTART_TEXT").split(",")[0];
            // "是否批量重启下列选中设备"
        }else{
            context = getRcText("BATCH_RESTART_TEXT").split(",")[1]+oRowData[0].ApName;
            // "是否重启设备"
        }

        $("#StatusForm").form("init", "edit", {title : getRcText("CONFIRM_TITLE"),"btn_apply": function () {
            RebootPro(oRowData);
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#StatusForm")));
        }});

        $("#ApText").html(context);
        $("div").find(".btn-apply").removeClass('disabled');
        // 批量重启下列选中的设备
        $("#WipsList1").SList ("refresh", oRowData);
        Utils.Base.openDlg(null, {}, {scope:$("#StatusDlg"),className:"modal-super"});
    }

    function onDelOpenDlg(oRowData,type)
    {
        var context = "";
        if (type == "dev_delete"){
            context = getRcText("BATCH_DELETE_TEXT").split(",")[0];
            // "是否批量删除下列选中设备"
        }else{
            context = getRcText("BATCH_DELETE_TEXT").split(",")[1]+oRowData[0].ApName;
            // "是否删除设备"
        }

        $("#StatusForm").form("init", "edit", {title : getRcText("CONFIRM_TITLE"),"btn_apply": function () {
            DeletePro(oRowData);
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#StatusForm")));
        }});

        $("#ApText").html(context);
        $("div").find(".btn-apply").removeClass('disabled');
        // 批量删除下列选中的设备
        $("#WipsList1").SList ("refresh", oRowData);
        Utils.Base.openDlg(null, {}, {scope:$("#StatusDlg"),className:"modal-super"});
    }

    function onOpenAddDlg(oRowData,type)
    {
        $("#AddApForm").form("init", "edit", {title : getRcText("ADD_TITLE"),"btn_apply": function () {
            //AddPro（）
            var ap_sn=$("#ap_SN").val();
            var ap_name = $("#ap_name").val();
            if ((ap_sn == "")||(ap_name == "")){
                return;
            }

            AddPro(ap_sn, ap_name);
            $("#ap_name").val("");
            $("#ap_SN").val("");

            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddApForm")));
        }});

        //$("div").find("a").removeClass('disabled');
        Utils.Base.openDlg(null, {}, {scope:$("#AddApDlg"),className:"modal-small"});
    }


    function ChangeVerInfo(row, cell, value, columnDef, dataContext, type)
    {
        if(!value)
        {
            return "";
        }
        if("text" == type)
        {
            return value;
        }
        switch(cell)
        {
            case  2:
            {
                if(dataContext["curversion"].replace(/\s/g, "") == dataContext["newversion"].version.replace(/\s/g, ""))
                {

                    return dataContext["curversion"];
                }
                var titletest = getRcText("TITLE_TEXT")+dataContext["newversion"].version;
                // "可升级到最新版本"
                return "<p class='list-link float-left' type='0'>"+dataContext["curversion"]+"</p><p title='"+titletest+"' class='upversion_icon'></p>";
                break;
            }
            default:
                break;
        }
        return false;
    }


    function onEditStatus(oData,sCell, editname){
        function onSuccess()
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#StatusForm")));
            //initData();
        }

        function onOk()
        {
            onSuccess();

        }

        function onCancel() {

        }

        //var oRadio = getRadioInfor(sCell,oData);
        $("#StatusForm").form("init", "edit", {title : getRcText("STATUS_TITLE"), "btn_apply": onOk, "btn_cancel":onCancel});
        $("#ApName").html(oData.ApName);
        $("#ApText").html(getRcText("TEXT").split(",")[2]+editname+getRcText("TEXT").split(",")[1]);
        // "是否确定要""设备"
        $("div").find("a").removeClass('disabled');
        Utils.Base.openDlg(null, {}, {scope:$("#StatusDlg"),className:"modal-super"});
    }

    function proclickInfo(){

        var jThis = $(this);
        var editname = jThis.attr("PolicyName");
        var nType = jThis.attr("type");
        //var oApData = $("#WipsList").SList("getSelectRow")[0];
        var oApData = {
            ApName: jThis.parents("div.slist-row").find("div.slist-cell[title]")[0].textContent
        }
        switch(nType)
        {
            case "0":
            case "1":
            case "2":
            {
                console.log(nType);
                console.log(oApData);
                onEditStatus(oApData,nType, editname);
                break;
            }
            default:
                break;
        }
        return false;
    }

    function setclocktime(){
        if (g_rebootTime == null){
            return;
        }

        enable = g_rebootTime.enable;
        starth = g_rebootTime.starth;
        startm = g_rebootTime.startm;

        $("#clocktime1").datetime("setTime", starth + ':' + startm);
        if (enable != null) {
            enable == 1 ? $("#rebootBtn").addClass('open') : $("#rebootBtn").removeClass('open');
        } else {
            $("#rebootBtn").addClass('open');
        }

    }

    function getRebootTime(suc){
        var option = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                cfgTimeout: 120,
                cloudModule: 'xiaoxiaobeicfg',
                deviceModule: "xiaoxiaobei",
                nasId: "FrameInfo.Nasid",
                method: "GetRebootCfg",
                configType :1,
                param: [{
                    "userName": FrameInfo.g_user.user,
                    "sceneName": g_sShopName,
                    "nasId": FrameInfo.Nasid
                }],
            }),
            onSuccess: function (data) {
                // if (!('errorcode' in data && data.errorcode == 0)) {
                //     return;
                // }
                var res = data.result;

                suc && suc.call(this, res);
            },
            onFailed: function (err) {
                hPending.close();
                return;
            }
        };
        Utils.Request.sendRequest(option);
    }

    function updateRebootTime(enable, starth, startm){
        // hPending = Frame.Msg.pending("正在更新设备重启时间");
        hPending = Frame.Msg.pending(getRcText("PENDING_MSG").split(",")[5]);
        if(flag===null){
            flag = updateRebootTime;
            flag.args = arguments;
            var option = {
                type: 'POST',
                url: MyConfig.path + '/ant/confmgr',
                contentType: 'application/json',
                dataType: 'json',
                timeout: 600000,
                data: JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    cloudModule: 'xiaoxiaobeicfg',
                    deviceModule: "xiaoxiaobei",
                    method: "RebootTimerUpdate",
                    nasId: FrameInfo.Nasid,
                    userName: FrameInfo.g_user.user,
                    shopName: g_sShopName,
                    sceneFlag: "true",
                    policy: "cloudFirst",
                    configType :0,
                    cfgTimeout: 120,
                    //cfgRetry: 2,
                    param: [{
                        "userName": FrameInfo.g_user.user,
                        "sceneName": g_sShopName,
                        "enable":enable,
                        "starth":starth,
                        "startm":startm,
                        "nasId": FrameInfo.Nasid
                    }],
                }),
                onSuccess: function (data) {
                    fCheckCfgRet(data);
                    //    if(data.serviceResult =="success") {
                    //        var aErrList = [];
                    //        for (var i = 0; i < data.deviceResults.length; i++) {
                    //            if ((data.deviceResults[i].communicateResult != "success") || (data.deviceResults[i].deviceResult.result != "success")) {
                    //                aErrList.push(data.deviceResults[i].devSN);
                    //            }
                    //        }
                    //        if (aErrList.length == 0) {
                    //            Frame.Msg.info(getRcText("VER_ERROR").split(",")[5]);
                    //            g_rebootTime = {'enable': enable, 'starth': starth, 'startm': startm};
                    //        }
                    //        else {
                    //            Frame.Msg.info(getRcText("FAIL_INFO") + aErrList.join(", "),"error");
                    //        }
                    //        hPending.close();
                    //        return;
                    //    }
                    //    else{
                    //        hPending.close();
                    //        Frame.Msg.info(getRcText("VER_ERROR").split(",")[6],"error");
                    //        return;
                    //    }
                },
                onFailed: function (err) {
                    hPending.close();
                    Frame.Msg.info(getRcText("VER_ERROR").split(",")[6],"error");
                    return;
                }
            };
        }
        else{
            var option = {
                type: 'POST',
                url: MyConfig.path + '/ant/confmgr',
                contentType: 'application/json',
                dataType: 'json',
                timeout: 600000,
                data: JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    cloudModule: 'xiaoxiaobeicfg',
                    deviceModule: "xiaoxiaobei",
                    method: "RebootTimerUpdate",
                    nasId: FrameInfo.Nasid,
                    userName: FrameInfo.g_user.user,
                    shopName: g_sShopName,
                    sceneFlag: "true",
                    //policy: "cloudFirst",
                    devSN:g_onLine,
                    configType :0,
                    cfgTimeout: 120,
                    //cfgRetry: 2,
                    param: [{
                        "userName": FrameInfo.g_user.user,
                        "sceneName": g_sShopName,
                        "enable":enable,
                        "starth":starth,
                        "startm":startm,
                        "nasId": FrameInfo.Nasid
                    }],
                }),
                onSuccess: function (data) {
                    fCheckCfgRet(data);
                },
                onFailed: function (err) {
                    hPending.close();
                    Frame.Msg.info(getRcText("VER_ERROR").split(",")[6],"error");
                    return;
                }
            };
        }

        Utils.Request.sendRequest(option);
        return this;
    }
    function QueStatus(row, cell, value, columnDef, dataContext, type){
        i++;
        return arr[i];
    }

    function bacPercent(row, cell, value, columnDef, dataContext, type){
        return '<div class="bar" style="height:100%;width:100%;"></div>';
    }

    function getListQuestatus(){

    }
    function initGrid()
    {
        $("#bacBtn").on("click",function(){
            $('#Que_complete').slideUp();
            $('#Que_Ing').slideUp();
            Frame.Msg.info(getRcText("Que_bacGrade"));
        });
        var opt = {
            /*pageSize,
             oFilter,
             oSorter,*/
            colNames: getRcText ("LIST_TITLE"),
            showHeader: true,
            multiSelect: true,
            showOperation:true,
            pageSize:5,
            colModel: [
                {name:'ApName', datatype:"String",width:150},
                {name:'SN', datatype:"String",width:150},
                {name:'curversion', datatype:"String",width:150,formatter:ChangeVerInfo},
                {name:'OnlineTime', datatype:"String",width:150},
                {name:'status', datatype:"String",formatter:bacPercent,width:150},
                {name:'lineStatus', datatype:"String",width:80}
            ],
            buttons:[
                {name:"dev_newadd", enable:false,value:g_RowType[0],mode:Frame.Button.Mode.CREATE,action:onOpenAddDlg},
                {name:"dev_update", enable:">0",value:getRcText("Que_upGradeBtn"),mode:Frame.Button.Mode.UPDATE,action:onUpdaOpenDlg},
                //{name:"dev_reboot", enable:">0",value:g_RowType[2],mode:Frame.Button.Mode.MOVE,action:onRebOpenDlg},
                //{name:"dev_delete", enable:">0",value:g_RowType[3],mode:Frame.Button.Mode.DELETE,action:onDelOpenDlg},
                {name:"upgrade",enable:true,action:onUpdaOpenDlg,formatter:bacPercent},
                {name:"reboot",enable:true,action:onRebOpenDlg},
                {name:"delete",enable:true,action:onDelOpenDlg}
            ]
        };
        $("#WipsList").SList ("head", opt);
        var optQ = {
            colNames: getRcText ("LIST_TITLE2"),
            showHeader: true,
            multiSelect: true,
            showOperation:true,
            pageSize:5,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                clearInterval(timerStatusList);
                timerStatusList=setInterval(function(){
                    getDevsn();
                },5000);
            },
            colModel: [
                {name:'ApName', datatype:"String"},
                {name:'SN', datatype:"String"},
                {name:'curversion', datatype:"String",formatter:ChangeVerInfo},
                {name:'OnlineTime', datatype:"String"},
                {name:'lineStatus', datatype:"String"}
                //{name:'OnlineTime', datatype:"String"}
            ],
            buttons:[
                {name:"dev_newadd", enable:false,value:g_RowType[0],mode:Frame.Button.Mode.CREATE,action:onOpenAddDlg},
                //{name:"dev_update", enable:">0",value:g_RowType[1],mode:Frame.Button.Mode.UPDATE,action:onUpdaOpenDlg},
                {name:"dev_reboot", enable:">0",value:g_RowType[2],mode:Frame.Button.Mode.MOVE,action:onRebOpenDlg},
                {name:"dev_delete", enable:">0",value:g_RowType[3],mode:Frame.Button.Mode.DELETE,action:onDelOpenDlg},
                //{name:"upgrade",enable:true,action:onUpdaOpenDlg},
                {name:"reboot",enable:true,action:onRebOpenDlg},
                {name:"delete",enable:true,action:onDelOpenDlg}
            ]
        };
        $("#Que_WipsList").SList ("head", optQ);

        var opts = {
            colNames: getRcText ("LIST_TITLE"),
            showHeader: true,
            multiSelect: false,
            search:false,
            // showOperation:true,
            pageSize:5,
            colModel: [
                {name:'ApName', datatype:"String"},
                {name:'SN', datatype:"String"},
                {name:'curversion', datatype:"String",formatter:ChangeVerInfo},
                {name:'OnlineTime', datatype:"String"}
            ]
        };
        $("#WipsList1").SList ("head", opts);

        var optListIng = {
            colNames: getRcText ("Que_statusList"),
            showHeader: true,
            multiSelect: false,
            search:false,
            // showOperation:true,
            pageSize:5,
            colModel: [
                //{name:'ApName', datatype:"String"},
                {name:'SN', datatype:"String"},
                {name:'percent', datatype:"Number",formatter:percentBar},
                {name:'status', datatype:"String"}
            ]
        };
        //$("#upGradeList").SList ("head", optUpGrade);
        $("#listIng").SList ("head", optListIng);
        var optListComplete = {
            colNames: getRcText ("Que_statusList"),
            showHeader: true,
            multiSelect: false,
            search:false,
            // showOperation:true,
            pageSize:5,
            colModel: [
                //{name:'ApName', datatype:"String"},
                {name:'SN', datatype:"String"},
                {name:'percent', datatype:"Number",formatter:percentBar},
                {name:'status', datatype:"String"}
            ]
        };
        $("#listComplete").SList ("head", optListComplete);

        $("#WipsList").on('click','a.list-link',proclickInfo);

        $("#WipsList").on('click',function(){
            getDevsn();
            clearInterval(timerStatusList);
            timerStatusList=setInterval(function(){
                getDevsn();
            },5000);
        });


    }

    function initAutoReboot() {
        var enable = 0;
        var starth = 0;
        var startm = 0;

        $("#clocktime1 span").css({left:'130px'});

        $("#StartValidityDateTime1 span").click(function(){
            $("#comfire").removeClass("hidden");
        });

        $("#comfire").click(function(){
            onSubmitSign();
            $("#comfire").addClass("hidden");
        });

        $("#rebootBtn").click(function(){
            onSubmitSign();
            $("#comfire").addClass("hidden");
        });

        function onSubmitSign() {
            getRebootTime(function(data){
                g_rebootTime = data;
                //setclocktime();
                enable = $("#rebootBtn").hasClass("open") ? 1 : 0;
                starth = $("#clocktime1").datetime("getTime").split(':')[0];
                startm = $("#clocktime1").datetime("getTime").split(':')[1];

                if(g_rebootTime != null){
                    if ((g_rebootTime.enable == enable) &&
                        (g_rebootTime.starth == starth) &&
                        (g_rebootTime.startm == startm)){
                        return;
                    }
                }

                updateRebootTime(enable, starth, startm);
            });
        }

        getRebootTime(function(data){

            g_rebootTime = data;

            setclocktime();
        });
    }

    function toggleButton() {
        var self = this;
        if (self.hasClass("open")) {
            self.removeClass("open")
                .parents(("div[id][class='detail-content']"))
                .find(".bg-img").removeClass("wifi-open").addClass("wifi-close");
        }
        else {
            self.addClass("open")
                .parents(("div[id][class='detail-content']"))
                .find(".bg-img").removeClass("wifi-close").addClass("wifi-open");
        }
    }

    function test(){
        alert($("#test .slist-row").length);
    };

    function _init ()
    {
        g_RowType = getRcText("EDIT_TITLE").split(",");
        if(Utils.Device.deviceInfo)
        {
            g_sShopName = Utils.Device.deviceInfo.shop_name;
        }
        else{}
        $(".openORclose").click(function () {
            toggleButton.call($(this));
        });
        initGrid();
        initAutoReboot();
        initData();
        initFenJiFenQuan();
        initFailDevGrid();
        failConform();
        closeMadle();
        closeX();
        //verProgressGrid();
        /*状态获取*/
    }
    $(document).on("click",function(){
        console.log(34343);
        isOkCheck();
        selectDevice();
    });
    /*选中处理*/
    function isOkCheck(){
        $("#WipsList .head-check .check-icon").click(function(){
            console.log(78787);
        });
    }

    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu= Frame.Permission.getCurPermission();
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        //3 作具体的“显示、隐藏”处理
        if($.inArray("WRITE",arrayShuZuNew) ==-1){
            //隐藏“写”的功能
            //写
            $(".hidemodify").css('display','none');
            $(".forbid").attr('disabled','true');
        }
        //if($.inArray("EXEC",arrayShuZuNew) ==-1){
        //    initGrid();
        //    $("#WipsList").addClass("upward");
        //    //隐藏“执行”的功能
        //    //执行
        //}
        //else{
        //    initGrid1();
        //    //$("#WipsList").SList ("head", opt);
        //}
    }
    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_RowType = null;
        hPending = null;
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        timerUpStatus=null;
        timerRe=null;
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","Form", "DateTime"],
        "utils": ["Request","Base", 'Device'],

    });

}) (jQuery);
