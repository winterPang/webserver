(function ($)
{
    var MODULE_NAME = "versionupdate.indexv3_new";
    var rc_info = "device_infor_rc";
    var g_versionlist = [];
    var g_versionNewArr = [];
    var g_getDevStatus ;
    var g_ID = "" ;
    var hPending;
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }
     /*刷新所有版本列表及进度*/
    function refreshProgressAll(ProgressData)
    {
        var VER_ERROR = getRcText("VER_ERROR").split(";");
        if(g_getDevStatus&&g_ID)
        {
            if(ProgressData.status ==1)
            {
                Frame.Msg.info(VER_ERROR[4]);            
            }  
            else if(ProgressData.status==2)
            {
                Frame.Msg.error(VER_ERROR[0]);
            }
            else if(ProgressData.status==3)
            {
                Frame.Msg.error(VER_ERROR[1]);
            }
            else if(ProgressData.status==4)
            {
                Frame.Msg.error(VER_ERROR[2]);
            }
            else if(ProgressData.status==5)
            {
                Frame.Msg.error(VER_ERROR[3]);
            }   
        } 
        if(ProgressData.status == 0&&g_ID&&!g_getDevStatus)
        {
            g_getDevStatus =  setInterval(getUpdateProgress,1000,null,null,g_ID);
             
        }

        if(ProgressData.status!= 0&&g_getDevStatus)
        {
            clearInterval(g_getDevStatus);
            g_getDevStatus = undefined;
            /*slistEnable();*/
        } 
        /*遍历将正在升级的版本url与slist中的url匹配，相同将将进度赋值*/
        $.each(g_versionlist,function(key,value)
        {
            if(ProgressData.status == 0 
                && ProgressData.devVersionUrl == value.url)
            {
                g_versionlist[key].percent  = ProgressData.percent;
            }
            if(ProgressData.status != 0 )
            {
                g_versionlist[key].percent  = 0; 
            }

        })
        /*当g_getDevStatus 存在时，将升级按钮和slist置灰*/      
        /*if(g_getDevStatus||ProgressData.status == "0")
        {
            $("#device_version_list").SList ("refresh", g_versionlist);
            slistDisable();
        }
        else
        {*/
            $("#device_version_list").SList ("refresh", g_versionlist);    
        /*}*/
    }
    /*初始化slist*/
    function refreshVeisionList(DevData,versionList,ProgressData)
    {         
        var  newestRelease = [];
        g_versionlist = [];
        g_versionNewArr = [];
        $.each(versionList,function(key,value){
            var version ={};
            version.size=(value.size/(1024*1024)).toFixed(2);
            version.type=getRcText("VERSION_TYPE").split(",")[value.type];
            version.version=value.version;//转化成统一格式在这里
            version.description=value.description;
            version.bkSize = value.size;
            version.url = value.url;
            version.percent  = 0;
            version.publication_date = value.publication_date;
            if(value.type == 1)
            {
                newestRelease.push(version);
            }
            g_versionlist.push(version);
        })

        if(newestRelease.length > 0)
        {
            var newVersion = newestRelease.sort()[newestRelease.length-1];
            if(ProgressData.status == 0 && ProgressData.devVersionUrl == newVersion.url)
            {        
                newVersion.percent  = ProgressData.percent;
                /*slistDisable(); */
                g_getDevStatus = setInterval(getUpdateProgress,1000);
                        
            } 
            g_versionNewArr.push(newVersion);
        }

        var model = "Ain't get any system version info,please make sure your access to the internet";

        if(DevData["devSoftVersion"] !== undefined && DevData["devHardVersion"] !== undefined)
        {
            model = DevData["devSoftVersion"] + ', ' +DevData["devHardVersion"];
            /*
            if(versionNewestDev.length != 0 && 
                versionNewestDev[0].localeCompare(data["devHardVersion"]) > 0)
            {
                model += "（当前有最新正式版可供更新）";
            }
            */
        }
        $("#curVer").text(model);

            /*if(g_getDevStatus||ProgressData.status == 0)
            {
                $("#device_version_list").SList ("refresh", g_versionNewArr);
                slistDisable();    
            }
            else
            {*/
                $("#device_version_list").SList ("refresh", g_versionNewArr);    
           /* }*/
    }
    /*刷新最新版本列表及进度*/
    function refreshProgress(ProgressData)
    {
        var VER_ERROR = getRcText("VER_ERROR").split(";");
        if(g_getDevStatus&&g_ID)
        {
            if(ProgressData.status ==1)
            {
                Frame.Msg.info(VER_ERROR[4]);            
            }  
            else if(ProgressData.status==2)
            {
                Frame.Msg.error(VER_ERROR[0]);
            }
            else if(ProgressData.status==3)
            {
                Frame.Msg.error(VER_ERROR[1]);
            }
            else if(ProgressData.status==4)
            {
                Frame.Msg.error(VER_ERROR[2]);
            }
            else if(ProgressData.status==5)
            {
                Frame.Msg.error(VER_ERROR[3]);
            }   
        }

        if(ProgressData.status == 0&&g_ID&&!g_getDevStatus)
        {
            g_getDevStatus = setInterval(getUpdateProgress,1000,null,null,g_ID);
            
        }

        if(ProgressData.status!= 0&&g_getDevStatus)
        {
            clearInterval(g_getDevStatus);
            g_getDevStatus = undefined;
            /*slistEnable();*/
        }

        $.each(g_versionNewArr,function(key,value)
        {
            if(ProgressData.status == 0 
                    && ProgressData.devVersionUrl == g_versionNewArr[key].url)
            {
                g_versionNewArr[key].percent  = ProgressData.percent;
                 
            }

            if(ProgressData.status != 0 )
            {
                g_versionlist[key].percent  = 0; 
            }

        })

        /*if(g_getDevStatus||ProgressData.status === 0)
        {
            $("#device_version_list").SList ("refresh", g_versionNewArr);
            slistDisable();   
        }
        else
        {*/
            $("#device_version_list").SList ("refresh", g_versionNewArr);    
        /*}*/
    }
    /*获取进度条数据*/
    function getUpdateProgress(DevData,versionList,g_ID,requestData,updateData)
    {
        if(updateData&&g_getDevStatus)
        {
            clearInterval(g_getDevStatus);
            g_getDevStatus = undefined;
                                 
        }
        
        function getUpdateProgressSuc(data)
        {
              
            if(DevData&&versionList)
            {
                /*初始化slist*/
                refreshVeisionList(DevData,versionList.data_list,data);               
            }
            else
            {
                if(!requestData&&g_ID == "newestversion")
                {
                    //TODO 刷新最新版本列表及进度
                    refreshProgress(data);
                }
                else if(!requestData&&g_ID == "allversion")
                {
                    //TODO 刷新所有版本列表及进度
                    refreshProgressAll(data);   
                }
                else if(requestData)
                {
                    if(data.status === 0)
                    {
                        Frame.Msg.info(getRcText ("Versioning"));
                        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#versionFormat")));
                        if(g_ID&&!g_getDevStatus)
                        {
                            g_getDevStatus =  setInterval(getUpdateProgress,1000,null,null,g_ID);
                                 
                        }
                    }
                    else
                    {
                        var selectData = $("#device_version_list").SList("getSelectRow");
                        requestData.fileSize = parseInt(selectData[0].bkSize);
                        requestData.devVersionUrl = selectData[0].url;
                        updateDevice(requestData);
                    }        
                }
                else
                {
                    refreshProgress(data);  
                }            
            }     
        }
        function getUpdateProgressFail()
        {
            console.log("fail");
        }

       var getProgressOpt = {
            url: MyConfig.path+"/base/getUpdateStatus",
            dataType: "json",
            type:"post",
            data:{ devSN:FrameInfo.ACSN },
            onSuccess: getUpdateProgressSuc,
            onFailed: getUpdateProgressFail
        }
        Utils.Request.sendRequest(getProgressOpt);
    }

    function getVersionList(DevData)
    {
        function getVersionListSuc(data)
        {
            if(data.error_code==0)
            {
                getUpdateProgress(DevData,data);
            }
           
        }

        function getVersionListFail()
        {

        }

        var model1 = DevData["devMode"];
        if(model1.indexOf("H3C")>=0)
        { 
               model1 = model1.split("H3C")[1].trim();
        }

        var getVersionListOpt = {
            url: MyConfig.v2path+"/getModelVersion?model="+model1,
            type: "GET",
            dataType: "json",
            contentType: "application/json",  
            onSuccess: getVersionListSuc,
            onFailed: getVersionListFail
        }
        Utils.Request.sendRequest(getVersionListOpt);
    }

    function getWebSystem()
    {
        function getWebSystemSuc(data)
        {
            console.log(data);
            getVersionList(data);   
        }

        function getWebSystemFail(err)
        {
            console.log(err);
        }

        var getWebSystemOpt = {
            type: "GET",
            url: MyConfig.path+"/devmonitor/web/system?devSN=" + FrameInfo.ACSN,
            datatype: "json",
            onSuccess: getWebSystemSuc,
            onFailed: getWebSystemFail,

        }
        Utils.Request.sendRequest(getWebSystemOpt);
    }

    /*function slistDisable()
    {
        $("#device_version_list>div>div>a:first").addClass("disabled");
        $("#device_version_list>div>div>div>span ").removeClass("check-icon");
        $("#device_version_list>div>div>div").unbind("click");
        $("#device_version_list>div>div>div>div>.check-icon ").removeClass("check-icon");
        $("#device_version_list>div>div.slist-center ").unbind("click");    
    }

    function slistEnable()
    {
        $("#device_version_list>div>div>a:first").removeClass("disabled");
        $("#device_version_list>div>div>div>span ").addClass("check-icon");
        $("#device_version_list>div>div>div").bind("click");
        $("#device_version_list>div>div>div>div>.check-icon ").addClass("check-icon");
        $("#device_version_list>div>div.slist-center ").bind("click");    
    }*/

    function initGrid()
    {
        var versionopt = {
            colNames: getRcText ("Version_HEADER"),
            showHeader: true,
            multiSelect : false,
            showOperation:false,
            colModel: [
                {name:'version', datatype:"String"},
                {name:'type', datatype:"String"},
                {name:'publication_date',datatype:"String"},
                {name:'description', datatype:"String"},
                {name:'size', datatype:"String"}, 
                {name:'percent', datatype:"PercentCompleteBar"}
            ],
            buttons:[
                {name:"default",value:getRcText ("DOWNLOAD"),enable:offdownshow,
                    mode:{icons: {primary: "fa fa-cloud-download"}},action:openDalog},
                {name:"default",value:getRcText ("OFFDOWNLOAD"),enable:offdownshow,
                    mode:{icons: {primary: "fa fa-download"}},action:offdownload}
            ]

        };
        $("#device_version_list").SList ("head", versionopt);   
    }

    function offdownshow(aRows)
    {
        var bshow = false;
        aRows.length == 1 ? bshow = true : bshow = false;
        return bshow;   
    }

    function openDalog()
    {   
       
        $("#versionFormat").form("init", "edit", {"title":getRcText ("SELECT"), "btn_apply":onSure, "btn_cancle":onCancel});
  
        Utils.Base.openDlg(null, {}, {scope:$("#rebootDialog"), className:"modal-large"});   
       
    }

    function onSure()
    {
        var requestData = {};
        var updateType = $("input[name = updateType]:checked").val();        
        if(updateType == "1")
        {
            requestData.saveConfig = 0;
            requestData.rebootDev = 0;
        }else if(updateType == "2"){
            requestData.saveConfig = 0;
            requestData.rebootDev = 1;
        }else if(updateType == "3"){
            requestData.saveConfig = 1;
            requestData.rebootDev = 1;
        }
        /*var selectData = $("#device_version_list").SList("getSelectRow");
        requestData.fileSize = parseInt(selectData[0].bkSize);
        requestData.devVersionUrl = selectData[0].url;*/
        getUpdateProgress(null, null, g_ID, requestData);
    }

    function onCancel()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#rebootDialog")));
    }


    function offdownload(rowData)
    {
        window.location.href=rowData[0].url;    
    }
    
    function updateDevice(params)
    {

        function updateDeviceSuc(data)
        {
            if(data.retCode == "0")
            {
                console.log("success");
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#versionFormat")));
                //Frame.Msg.info(getRcText ("version_suc"));
                //Utils.Base.refreshCurPage();
                Frame.Msg.info(getRcText("version_suc"));
                g_getDevStatus = setInterval(getUpdateProgress,2000,null,null,g_ID,"",data);
                //getUpdateProgress(null, null, g_ID,"",data);
            }
            else
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#versionFormat")));
                //Utils.Base.refreshCurPage();
                Frame.Msg.info(getRcText ("version_fail"));
            }
        }

        function updateDeviceFail()
        {
            console.log("fail");
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#versionFormat")));
            Utils.Base.refreshCurPage();
            Frame.Msg.info(getRcText ("version_fail"));
        }
        var updateDeviceOpt = {
            url:MyConfig.path+"/base/updateDev",
            type:"POST",
            accepts:"application/json",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                fileSize:params.fileSize,
                devVersionUrl:params.devVersionUrl,
                saveConfig:params.saveConfig,
                rebootDev:params.rebootDev
            }),
            onSuccess: updateDeviceSuc,
            onFailed: updateDeviceFail,
        }
        Utils.Request.sendRequest(updateDeviceOpt);
    }

    function initData()
    {
        getWebSystem();
    }

    

    function initForm()
    {
        $('input[type = "radio"][name = "devVer"]').bind('click',function(){  
            if(g_ID&&g_getDevStatus)
            {
                g_ID = null;
            }

            if(g_getDevStatus)
            {
                clearInterval(g_getDevStatus);
                g_getDevStatus = undefined;
            }

            g_ID = $(this).attr('id');
            getUpdateProgress(null,null,g_ID);   
                    
        });

     /*   $("#sure").bind("click",function(){
            var requestData = {};
            var updateType = $("input[name = updateType]:checked").val();
            console.log(dialogVaule);
            if(updateType == "1"){
                requestData.saveConfig = 0;
                requestData.rebootDev = 0;
            }else if(updateType == "2"){
                requestData.saveConfig = 0;
                requestData.rebootDev = 1;
            }else if(updateType == "3"){
                requestData.saveConfig = 1;
                requestData.rebootDev = 1;
            }
            var selectData = $("#device_version_list").SList("getSelectRow");
            requestData.fileSize = parseInt(selectData[0].bkSize);
            requestData.devVersionUrl = selectData[0].url;
            //查询进度 --------- 如果状态===0 提示（不调用升级）--------
            //-----状态！== 0调用升级借口--查询进度----更新进度条函数

            console.log(requestData);
            getUpdateProgress(requestData);


            //updateDevice(requestData);
        });*/

    }
    
    function _init ()
    {
        initGrid();
        initData();
        initForm();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_versionlist = [];
        g_versionNewArr = [];
        g_ID = null ;
        clearInterval(g_getDevStatus);
        g_getDevStatus = null;   
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList", "Form", "Progressbar", "SingleSelect", "Minput", "MSelect"],
        "utils": ["Base","Request"]
    });
}) (jQuery);
