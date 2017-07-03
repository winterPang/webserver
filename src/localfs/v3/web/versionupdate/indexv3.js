;(function ($)
{
    var MODULE_NAME = "versionupdate.indexv3";
    var versionDalog = $("#rebootDialog");
    var rc_info = "device_infor_rc";
    var getDevStatus = null;
    var model;
    var versionAll = [],versionNewest = [],versionNewestDev = [];
    var g_aforgeData = [
        {
        url: "lvzhouv6.h3c.com",
        size: "23",
        type: "1",
        version: "2.4.5",
        description: "xxx"
        },{
        url: "lvzhouv6.h3c.com",
        size: "23",
        type: "1",
        version: "7.1.64.12.22",
        description: "xxx"
        }
    ];

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function offdownshow(aRows)
    {
        var bshow = false;
        aRows.length == 1 ? bshow = true : bshow = false;
        return bshow;
    }
    function openDalog(){
        Utils.Base.openDlg(null, {}, {scope:versionDalog,className:"modal-large"});
    }

    function initGrid()
    {

        var versionopt = {
            colNames: getRcText ("Version_HEADER"),
            showHeader: true,
            multiSelect : true,
            showOperation:false,
            colModel: [
                {name:'version', datatype:"String"},
                {name:'type', datatype:"String"},
                {name:'publication_date',datatype:"String"},
                {name:'description', datatype:"String"},
                {name:'size', datatype:"String"}, 
                {name:'url', datatype:"PercentCompleteBar"}
            ],
            buttons:[
                {name:"default",value:getRcText ("DOWNLOAD"),enable:offdownshow,mode:{icons: {primary: "fa fa-cloud-download"}},action:openDalog},
                {name:"default",value:getRcText ("OFFDOWNLOAD"),enable:offdownshow,mode:{icons: {primary: "fa fa-download"}},action:offdownload}
            ]

        };
        $("#device_version_list").SList ("head", versionopt);
    }

    function offdownload(rowData)
    {
        window.location.href=rowData[0].url;
    }

    function downloadVersion(rowData)
    {
        var error_message=getRcText ("DOWNLOAD_ERROR").split(",");
        if(rowData.length == 1){
            var data = {
                "tenant_name":FrameInfo.g_user.attributes.name,
                "dev_sn":FrameInfo.ACSN,
                "file_size":rowData[0].bkSize,
                "devVersionUrl":rowData[0].url
            }
            $.ajax({
                url: MyConfig.v2path+"/upgradeDevice",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data:JSON.stringify(data),
                success: function(data) {
                    if(data.retCode == 0){
                        Frame.Msg.info(error_message[0]);
                    }else{
                        Frame.Msg.info(error_message[1]);
                    }
                },
                error:function(err){
                    // Frame.Msg.error(MyConfig.httperror);
                }
            });
        }else{
            Frame.Msg.error(error_message[2]);
        }

    }

    function updateDevice(params){
        return $.ajax({
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
            })
        });
    }

    function initForm()
    {
        $("#closeBtn,#close").on("click",function(){
            $(this).attr("data-dismiss","modal");
        });
        $("#sure").on("click",function(){
            var dialogVaule = $("input[name=updateType]:checked",versionDalog).val();
            console.log(dialogVaule);
            var updateType = dialogVaule;
            var requestData = {};
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

            var cunProBar = $("#device_version_list .slist-row.active .progress-bar");
            var cunProBarParent = $("#device_version_list .slist-row.active .progress");
            //Test测试需求
            /*
            $("#verProgress").removeClass("hide");
            getDevStatus =  setInterval(getDevFunTest,1000);
            */
            updateDevice(requestData).done(function(data){
                 // data.retCode="0";
                if(data.retCode=="0"){
                    console.log("成功");
                    // $("#verProgress").removeClass("hide");
                    /* disable 软件升级 button */
                    $('a.slist-button').addClass('disabled')
                                       .attr('state','disable');
                    $('#version').css('display','none');
                    getDevStatus =  setInterval(getDevFun,1000,cunProBar, cunProBarParent);
                }else{
                    console.log("失败");
                }
                Utils.Pages.closeWindow(Utils.Pages.getWindow(versionDalog));
            })
        });

        $('input[type="radio"][name="devVer"]').bind('click',function(){
            var ID = $(this).attr('id');
            if(ID === 'newestversion'){
                $("#device_version_list").SList ("refresh", versionNewest);
            }
            else{
               $("#device_version_list").SList ("refresh", versionAll); 
            }
        });
    }

    function initData(){
        function get_WebSystemSuc( data ){

            var model;
            model = "Ain't get any system version info,please make sure your access to the internet";

            if(data["devSoftVersion"] !== undefined && data["devHardVersion"] !== undefined){
                model = data["devSoftVersion"] + ', ' +data["devHardVersion"];
                if(versionNewestDev.length != 0 && versionNewestDev[0].localeCompare(data["devHardVersion"]) > 0){
                    model += "（当前有最新正式版可供更新）";
                }
            }
            $("#curVer").text(model);
        }

        function get_WebSystemFail(){

        }

        function get_DevModelSuc(data){
            var model1 = data["devMode"]; 
            //check exists H3C删除这个h3c
            if(model1.indexOf("H3C")>=0){
               model1 = model1.split("H3C")[1].trim();
               }
            var  updateSoftWare ={
                url: MyConfig.v2path+"/getModelVersion?model="+model1,
                type: "GET",
                dataType: "json",
                contentType: "application/json",  
                onSuccess: get_UpdateSoftwareSuc,
                onFailed: get_UpdateSoftwareFail        
            };
            Utils.Request.sendRequest(updateSoftWare);

        }
        function get_DevModelFail(data){

        }

        function get_UpdateSoftwareSuc(data){
            var versionlist=[];
            var newVer = [];
            var  newestRelease = [];
            var  newestDevelop = [];
            var  newestPatch = [];
            versionNewest = [];   //初始化全局变量，解决点击其他菜单，出现重复数据的问题。

            function versionFormat(version){
                var verFomatted;
                if(version.search(/,/) === -1){
                    verFomatted = version.trim();
                }else{
                    verFomatted = version.split(/,/)[1].trim();
                }
                return verFomatted;
            }
            if(data.error_code==0){
                $.each(data.data_list,function(key,value){
                    var version ={};
                    function FilterNewestDevVer(version){
                        if(value.type == 1){
                            newestRelease.push(version);
                        }else if(value.type == 2){
                            newestDevelop.push(version);
                        }else if(value.type == 3){
                            newestPatch.push(version);
                        }
                    }
                    version.size=(value.size/(1024*1024)).toFixed(2);
                    version.type=getRcText("VERSION_TYPE").split(",")[value.type];
                    version.version=value.version;//转化成统一格式在这里
                    version.description=versionFormat(value.description);
                    version.bkSize = value.size;
                    version.url = value.url;
                    version.publication_date = value.publication_date;
                    FilterNewestDevVer(version);
                    versionlist.push(version);
                })
            }
            versionAll = versionlist;
            if(newestRelease.length != 0){
                versionNewest = versionNewest.concat(newestRelease.sort()[newestRelease.length -1]);
                if(newestRelease.length !== 0){
                    versionNewestDev[0] = newestRelease.sort()[newestRelease.length -1];
                }
            }
            if(newestDevelop.length != 0){
                versionNewest = versionNewest.concat(newestDevelop.sort()[newestDevelop.length -1]);
            }
            if(newestPatch.length != 0 ){
                versionNewest = versionNewest.concat(newestPatch.sort()[newestPatch.length -1]);
            }
            $("#device_version_list").SList ("refresh", versionNewest);
        }
        function get_UpdateSoftwareFail(data){

        }
        var get_WebSystem = {
            type: "GET",
            url: MyConfig.path + "/devmonitor/web/system?devSN=" + FrameInfo.ACSN,
            dataType: "json",
            onSuccess: get_WebSystemSuc,
            onFailed: get_WebSystemFail
        };
        var get_devModel ={
            type: "GET",
            url: MyConfig.path+"/devmonitor/web/system?devSN=" + FrameInfo.ACSN,
            dataType: "json", 
            onSuccess: get_DevModelSuc,
            onFailed: get_DevModelFail           
        };
        Utils.Request.sendRequest(get_WebSystem);
        Utils.Request.sendRequest(get_devModel);
    }

    /*应用分析特征库代码  start*/
    function dpioffdownloadVersion(rowData)
    {
        window.location.href=rowData[0].fileName;
    }

    function dpidownloadVersion(rowData)
    {
        var error_message=getRcText ("DOWNLOAD_ERROR").split(",");
        if(rowData.length == 1)
        {
            $.ajax({
                url: MyConfig.path+"/ant/confmgr",
                dataType: "json",
                type:"post",
                data:{
                    deviceModule: 'DRS',
                    method:'updateSignature',
                    param:
                    {
                        signatureType:'url',
                        signatureTimeout:'200',
                        downloadUrl:"lvzhouv3.h3c.com/v3/ant/dpi_signature/download/"+rowData[0].fileName,
                        fileName: rowData[0].fileName
                    }
                },
                success: function (data)
                {
                    if(data.communicateResult == "success")
                    {
                        if(data.deviceResult == "success")
                        {
                            Frame.Msg.error(error_message[0]);
                        }
                        else{
                            Frame.Msg.error(error_message[1]);
                        }

                    }
                    else
                    {
                        Frame.Msg.error(error_message[1]);
                    }

                },
            });
        }
        else{
            Frame.Msg.error(error_message[2]);
        }

    }

    function initDpi()
    {
        $.ajax({
            url: MyConfig.path+"/ant/dpi_signature",
            dataType: "json",
            type:"post",
            data:{
                method:'getSignature',
            },
            success: function (data)
            {
                var aData = data.result||[];
                for(var i=0;i<aData.length;i++)
                {
					delete aData[i].filePath;
                    delete aData[i].user;
                    delete aData[i].stamp;
                    delete aData[i].signatureType;
                }
                $("#apply_info_list").SList ("refresh", aData);
            },
        });
    }
    /*应用分析特征库代码  end*/
    var getDevFun = function(progressBar,progressBarParent){
        var errMessage = getRcText("VER_ERROR").split(",");
        $.ajax({
            url: MyConfig.path+"/base/getUpdateStatus",
            dataType: "json",
            type:"post",
            data:{
                devSN:FrameInfo.ACSN
            },
            success:function(data){

                if(data.status!="0"){
                    clearInterval(getDevStatus);
                    $('a.slist-button').removeClass('disabled')
                                       .attr('state','enable');
                    $('#version').css('display','block');
                    // $("#verProgress").addClass("hide");
                }

                if(data.status == "0"){
                    progressBarParent.attr('style','background-color:grey;margin:10px auto;');
                    progressBar.attr('style',"height:100%;width:" + data.percent + "%;")
                               .text(data.percent + "%");
                }else if(data.status == "1"){
                    Frame.Msg.info(errMessage[4]);
                }else if(data.status == "2"){
                    Frame.Msg.info(errMessage[0],"error");
                }else if(data.status == "3"){
                    Frame.Msg.info(errMessage[1],"error");
                }else if(data.status == "4"){
                    Frame.Msg.info(errMessage[2],"error");
                }else{
                    Frame.Msg.info(errMessage[3],"error");
                }

               }
        })
    }

    var i = 0;
    var getDevFunTest =function(){
        i++;

        if(i>100){
            clearInterval(getDevStatus);
            $("#verProgress").addClass("hide");
            return;
        }

        $(".progress .progress-bar-striped").attr("aria-valuenow",i).css("width",i+"%");
        $(".progress .progress-bar-striped span").text(i+"% Complete");
    }

    function _init(oPara)
    {
        if (FrameInfo.Model != '2')
        {
            $("#verlist").show();
            $("#applyDB").show();
            $("#StationTypeDB").show();
        };
        initForm();
        initGrid();
        initData();
        initDpi();  // 应用分析特征库

    }

    function _destroy()
    {
        versionDalog = null;
        clearInterval(getDevStatus);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form","Progressbar","Minput"],
        "utils": ["Base", "Request"]
    });
}) (jQuery);
