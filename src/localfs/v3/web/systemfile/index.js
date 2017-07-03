var g_tempTtparentId, g_lastTr, g_interval, g_progressNullcnt;
(function ($)
{
    var MODULE_NAME = "systemfile.index";
    var g_jForm,g_oPara;
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("systemfile_rc", sRcName);
    }
    $(document).on("mousedown", "#systemFileTable tr", function () {
        $("tr.selected").removeClass("selected");
        $(this).addClass("selected");
    });

    //Assembling tr
    function sysFileAssemblingTr(fileType, fileSize, fileAttr, fileTtid, fileTtparentId, fileName, fileTime){
        var Tr = '<tr data-tt-id="ttId" data-tt-parent-id="ttParentId"><td><span class="attr">name</span>'+
            '</td><td>filetype</td><td>size</td><td>time</td></tr>';

        Tr = Tr.replace(/filetype/,fileType);
        Tr = Tr.replace(/size/,fileSize);
        Tr = Tr.replace(/attr/,fileAttr);
        Tr = Tr.replace(/ttId/,fileTtid);
        Tr = Tr.replace(/ttParentId/,fileTtparentId);
        Tr = Tr.replace(/name/,fileName);
        Tr = Tr.replace(/time/,fileTime);

        return Tr;
    }


    function sysFileAssembling(dataArry){
        var i, tempTr, fileAttr;
        var tempSize, tempType, tempAttr, tempTtid, tempName, tempTime;
        for(i=0;i<dataArry.length;i++){
            if(dataArry[i].fileAttr == 3){
                tempType = "Folder";
                tempAttr = "folder";
                tempSize = "--";
                tempName = dataArry[i].fileName;
                fileAttr = dataArry[i].filePath.split("/");
                tempTtid = dataArry[i].filePath + "/" + dataArry[i].fileName;
                if(fileAttr.length>2){
                    g_tempTtparentId = dataArry[i].filePath;
                }
                else{
                    g_tempTtparentId = "";
                }

                function getLocalTime(nS) {
                    return new Date(parseInt(nS) * 1000).toISOString().replace(/T/g, " ").replace(/.000Z/g, "");
                }
                tempTime = getLocalTime(dataArry[i].mtime);
                tempTr = sysFileAssemblingTr(tempType, tempSize, tempAttr, tempTtid, g_tempTtparentId, tempName, tempTime);

                ($('#systemFileTable')).append(tempTr);
            }
        }
        for(i=0;i<dataArry.length;i++){
            if(dataArry[i].fileAttr != 3){
                tempType = "File";
                tempAttr = "file";

                if((dataArry[i].fileSize) > (1024*1024)){
                    tempSize = ((dataArry[i].fileSize) / (1024*1024)).toFixed(2) + ' MB'
                }
                else{
                    tempSize = ((dataArry[i].fileSize) / (1024)).toFixed(2) + ' KB'
                }

                tempName = dataArry[i].fileName;
                fileAttr = dataArry[i].filePath.split("/");
                tempTtid = dataArry[i].filePath + "/" + dataArry[i].fileName;
                if(fileAttr.length>2){
                    g_tempTtparentId = dataArry[i].filePath;
                }
                else{
                    g_tempTtparentId = "";
                }
                function getLocalTime(nS) {
                    return new Date(parseInt(nS) * 1000).toISOString().replace(/T/g, " ").replace(/.000Z/g, "");
                }
                tempTime = getLocalTime(dataArry[i].mtime);
                tempTr = sysFileAssemblingTr(tempType, tempSize, tempAttr, tempTtid, g_tempTtparentId, tempName, tempTime);

                $('#systemFileTable tr').each(function(){
                    var pid = $(this).attr("data-tt-id") + "";
                    var strpid = g_tempTtparentId;
                    if(pid.match(strpid)){
                        g_lastTr = $(this);
                    }
                });
                g_lastTr.after(tempTr);
            }
        }
    }
    function sysFileInitForm() {
        function onSubmitSSID(){
            $("#AddSsidDlg").find(".btn-apply").addClass("disabled");
            $('#AddSsidDlg').modal('hide');
            $("#sysprogressbar")[0].innerHTML = "";
            $("#systemfilebar").attr("aria-valuenow", 0);
            $("#systemfilebar").attr("style", "width: 0%;");
            $("#systemfilebarnum").find("span")[0].innerHTML = "0%";
            $("#systemfilebarrate").find("span")[0].innerHTML = "0 KB/S";
            sysCheckLoadFile();
        }


        $("#systemFilesend").on("click",function(){
            var jFormSSID = $("#verlist");
            var jDlg = $("#AddSsidDlg");
            jFormSSID.form("init", "edit", {"title":"文件上传","btn_apply": onSubmitSSID});
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-default"});
        })
        var menuPermissionArry = [];
        menuPermissionArry = Frame.Permission.getCurPermission();
        if (-1 == menuPermissionArry.indexOf("MAINTENANCE_WRITE"))
        {
            $("#sysFileBtnDiv").hide();
        }
        function getFileSuc(data) {
            if(data.retCode === 0) {
                var dataArray = data.message;
                sysFileAssembling(dataArray);
                sysFileInit();
                g_progressNullcnt = 0;
                $("#systemFilesend").removeClass("disabled");
                $("#systemFiledelete").removeClass("disabled");
                $("#systemFilerecv").removeClass("disabled");
                $("#systemFileRename").removeClass("disabled");
            }
            else if(data.retCode === 2){
                Frame.Msg.error(getRcText("NOOPERATE_ACCESS"));
            }
            else{
                Frame.Msg.error(getRcText("NOTFOUND_LINK"));
            }
        }
        function getFileFail(err) {
            Frame.Msg.error(err);
        }
        var wirelessFlowOpt = {
            url: "/v3/fs/",
            type: "POST",
            dataType: "json",
            timeout: 3000,
            data:{Method: "getDevFileStatus" ,
                devSN: FrameInfo.ACSN,
                pathName:""
            },
            onSuccess: getFileSuc,
            onFailed: getFileFail
        }
        Utils.Request.sendRequest(wirelessFlowOpt);
        console.log("run init!");

    }

    function sysDownloadFile() {
        var filename = $('.selected').attr("data-tt-id");
        var isGetUrl = 0;
        var intervar = 0;

        function DownloadFileSuc(data) {
            $("#systemFilerecv").removeClass("disabled");
            if (data.retCode == 0){
                //设置定时器获取进度条信息
                $('#sysFileProgressBar').modal('show');

                function ProgressFileSuc(data) {
                    if (data.retCode == 0){
                        if("" === data.devProgress){
                            g_progressNullcnt++;
                        }
                        else{
                            $("#sysprogressbar")[0].innerHTML = getRcText("UPLOADTO_CLOUD");
                            $("#systemfilebar").attr("aria-valuenow", data.devProgress);
                            $("#systemfilebar").attr("style", "width: " + data.devProgress + "%;");
                            $("#systemfilebarnum").find("span")[0].innerHTML = data.devProgress + "%";
                            $("#systemfilebarrate").find("span")[0].innerHTML = data.devRate + " KB/S";
                            g_progressNullcnt = 0;
                        }
                        if((data.fileName != undefined) &&(isGetUrl == 0)){
                            isGetUrl = 1;
                            clearInterval(g_interval);
                            console.log("close g_interval!");
                            intervar = setInterval(function (){
                                $('#sysFileProgressBar').modal('hide');
                                $("#filerecive").get(0).src = data.fileName;
                                clearInterval(intervar);
                            }, 500);
                        }
                        if(5 == g_progressNullcnt){
                            g_progressNullcnt = 0;
                            Frame.Msg.error(getRcText("OPERATE_FAILED"));
                            clearInterval(g_interval);
                            $('#sysFileProgressBar').modal('hide');
                        }
                    }
                    else{
                        Frame.Msg.error(data.message);
                        clearInterval(g_interval);
                        $('#sysFileProgressBar').modal('hide');
                        console.log("close g_interval!");
                    }
                }
                function ProgressileFail(err) {
                    Frame.Msg.error(err);
                }
                var wirelessFlowOpt = {
                    url: "/v3/fs/progress",
                    type: "POST",
                    dataType: "json",
                    timeout: 2000,
                    data:{
                        devSN: FrameInfo.ACSN,
                        fileName:filename
                    },
                    onSuccess: ProgressFileSuc,
                    onFailed: ProgressileFail
                }

                g_interval = setInterval(function (){
                    Utils.Request.sendRequest(wirelessFlowOpt);
                },1500);
                console.log("creat g_interval");
            }
            else{
                Frame.Msg.error(getRcText("UPLOADING_FILE"));
            }
        }
        function DownloadFileFail(err) {
            $("#systemFilerecv").removeClass("disabled");
            Frame.Msg.error(getRcText("REQUEST_TIMEOUT"));
        }

        var wirelessFlowOpt = {
            url: "/v3/fs/downloadFile",
            type: "POST",
            dataType: "json",
            timeout: 5000,
            data:{
                Method: "downloadFile" ,
                devSN: FrameInfo.ACSN,
                fileName:filename
            },
            onSuccess: DownloadFileSuc,
            onFailed: DownloadFileFail
        }
        Utils.Request.sendRequest(wirelessFlowOpt);
        console.log("download file!");
    }


//check uploadfile
    function sysCheckLoadFile() {
        var inputFile = $("#sysFileHeadImgToolsChoise")[0].files[0];
        function CheckLoadFileSuc(data) {
            if (data.retCode == 0){
                var form = $("#verlist")[0];
                var formData = new FormData(form);
                formData.append("Method", "uploadfile");
                var xhr = new XMLHttpRequest();
                xhr.open('POST', form.action + FrameInfo.ACSN);
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var data = JSON.parse(xhr.responseText);
                        if(data.retCode == 0) {
                            var tempAttr = new Array();
                            tempAttr.push(data);
                            sysFileAssembling(tempAttr);
                            $("#systemFileTable").treetable("destroy");
                            $("#systemFileTable").treetable({expandable: true});
                            Frame.Msg.alert(getRcText("UPLOAD_SUCCESS"));
                        }
                        else if(data.retCode == 5){
                            Frame.Msg.error(getRcText("UPLOADING_FILE"));
                        }
                        else if(data.retCode == 6){
                            Frame.Msg.error(getRcText("EXIST_SAMEFILE"));
                        }
                        else if(data.retCode == 4){
                            Frame.Msg.error(getRcText("OPERATE_FAILED"));
                        }
                        else{
                            Frame.Msg.error(getRcText("DEVICEINIT_FAILED"));
                        }
                        clearInterval(g_interval);
                        $('#sysFileProgressBar').modal('hide');
                        console.log("close g_interval!");
                    }
                }
                $('#sysFileProgressBar').modal('show');
                g_interval = setInterval(function (){
                    function getProgressFileSuc(data) {
                        if (data.retCode == 0){
                            if("" === data.devProgress){
                                g_progressNullcnt++;
                            }
                            else{
                                g_progressNullcnt = 0;
                                if(100 != data.broProgress) {
                                    $("#sysprogressbar")[0].innerHTML = getRcText("LOCALFILETO_CLOUD");
                                    $("#systemfilebar").attr("aria-valuenow", data.broProgress);
                                    $("#systemfilebar").attr("style", "width: " + data.broProgress + "%;");
                                    $("#systemfilebarnum").find("span")[0].innerHTML = data.broProgress + "%";
                                    $("#systemfilebarrate").find("span")[0].innerHTML = data.broRate + " KB/S";
                                }
                                else{
                                    $("#sysprogressbar")[0].innerHTML = getRcText("CLOUDFILETO_DEVICE");
                                    $("#systemfilebar").attr("aria-valuenow", data.devProgress);
                                    $("#systemfilebar").attr("style", "width: " + data.devProgress + "%;");
                                    $("#systemfilebarnum").find("span")[0].innerHTML = data.devProgress + "%";
                                    if(1024 >= data.devRate) {
                                        $("#systemfilebarrate").find("span")[0].innerHTML = data.devRate + " KB/S";
                                    }
                                    else{
                                        $("#systemfilebarrate").find("span")[0].innerHTML = ((data.devRate) / (1024)).toFixed(2) + " MB/S";
                                    }
                                }
                            }
                            if(5 == g_progressNullcnt){
                                xhr.abort();
                                g_progressNullcnt = 0;
                                Frame.Msg.error(getRcText("OPERATE_FAILED"));
                                clearInterval(g_interval);
                                $('#sysFileProgressBar').modal('hide');
                            }
                        }
                        else{
                            Frame.Msg.error(data.message);
                            clearInterval(g_interval);
                            $('#sysFileProgressBar').modal('hide');
                            console.log("close g_interval!");
                        }
                    }
                    function getProgressFileFail(err) {
                        Frame.Msg.error(err);
                    }
                    var wirelessFlowOpt = {
                        url: "/v3/fs/progress",
                        type: "POST",
                        dataType: "json",
                        timeout: 2000,
                        data:{
                            devSN: FrameInfo.ACSN
                        },
                        onSuccess: getProgressFileSuc,
                        onFailed: getProgressFileFail
                    }
                    Utils.Request.sendRequest(wirelessFlowOpt);
                },1500);
                console.log("creat g_interval");
            }
            else if(data.retCode == 5){
                Frame.Msg.error(getRcText("UPLOADING_FILE"));
            }
            else if(data.retCode == 6){
                Frame.Msg.error(getRcText("EXIST_SAMEFILE"));
            }
            else if(data.retCode == -1){
                Frame.Msg.error(getRcText("NOTFOUND_LINK"));
            }
            else if(data.retCode == 1){
                Frame.Msg.error(getRcText("NOENOUGH_SPACE"));
            }
            else{
                Frame.Msg.error(data.message);
            }
        }
        function CheckLoadFileFail(err) {
            Frame.Msg.error(err);
        }
        var wirelessFlowOpt = {
            url: "/v3/fs/checkLoadFile",
            type: "POST",
            dataType: "json",
            timeout: 2000,
            data:{
                devSN: FrameInfo.ACSN,
                fileName:inputFile.name,
                fileSize:inputFile.size
            },
            onSuccess: CheckLoadFileSuc,
            onFailed: CheckLoadFileFail
        }
        Utils.Request.sendRequest(wirelessFlowOpt);
        console.log("check uploadfile!");
    }

    function sysFileInit(){
        $("#systemFileTable").treetable({expandable: true});
        //$("#systemFileTable tr").mousedown(function () {
        //    $("tr.selected").removeClass("selected");
        //    $(this).addClass("selected");
        //});

        //$(function () {
        //    $('#sysFileProgressBar').on('hide.bs.modal', function () {
        //        if (window.confirm('现在关闭可能会导致操作失败，您确定？')) {
        //            clearInterval(g_interval);
        //            $('#sysFileProgressBar').modal('hide');
        //            console.log("close g_interval!");
        //            //alert("确定");
        //            return true;
        //        } else {
        //            //alert("取消");
        //            return false;
        //        }
        //    })
        //})

        function sysFileCheckSelected(){
            if(($('.selected').length !==0) && ($('.selected')[0].parentNode.nodeName !== "THEAD")){
                return true;
            }
            return false;
        }
        function sysFileCheckFile(){
            if($('.selected').find("span").hasClass("file")){
                return true;
            }
            return false;
        }

        $("#systemFiledelete").click(function (event) {
            if(sysFileCheckSelected()){
                if(sysFileCheckFile()){
                    Frame.Msg.confirm(getRcText("MAKESURE_DELETE"),function () {
                        function deleteFileSuc(data) {
                            if(0 == data.retCode){
                                $('.selected').remove();
                                //Frame.Msg.alert("删除成功！");
                            }
                            else if(11 == data.retCode){
                                Frame.Msg.error(getRcText("FILE_NOTEXIST"));
                            }
                            else if(13 == data.retCode){
                                Frame.Msg.error(getRcText("SYSTEM_IMPORTANTFILE"));
                            }
                            else{
                                Frame.Msg.error(getRcText("DELETE_FAILED"));
                            }
                        }
                        function deleteFileFail(err) {
                            Frame.Msg.error(err);
                        }
                        var wirelessFlowOpt = {
                            url: "/v3/fs/",
                            type: "POST",
                            dataType: "json",
                            timeout: 2000,
                            data:{Method: "deleteFile" ,
                                devSN: FrameInfo.ACSN,
                                fileName:$('.selected').attr("data-tt-id")
                            },
                            onSuccess: deleteFileSuc,
                            onFailed: deleteFileFail
                        }
                        Utils.Request.sendRequest(wirelessFlowOpt);
                        console.log("delete file!");

                    });
                }
                else{
                    Frame.Msg.error(getRcText("DELETE_FOLDER"));
                }
            }
            else{
                Frame.Msg.error(getRcText("SELECT_FILE"));
            }
        });

        $("#systemFilesend").click(function (event) {
            $("#sysFileHeadImgToolsChoise").val("");
            $("#chatSettingBtnOk").addClass("disabled");

        });
        $("#systemFileRename").click(function (event) {
            $("#sysFileRenameChoise").val("");
            $("#fileSettingBtnOk").addClass("disabled");

        });
        //关闭进度条
        $("#sysfileSettingBtnCancel").click(function (event) {
            clearInterval(g_interval);
            $('#sysFileProgressBar').modal('hide');
            console.log("close g_interval!");
            Frame.Msg.error(getRcText("OPERATEMAY_FAILED"));
        });
        $("#systemFilerecv").click(function (event) {
            //$("#systemFileTable").treetable("destroy");
            //$("#systemFileTable").treetable({expandable: true});
            $("#sysprogressbar")[0].innerHTML = "";
            $("#systemfilebar").attr("aria-valuenow", 0);
            $("#systemfilebar").attr("style", "width: 0%;");
            $("#systemfilebarnum").find("span")[0].innerHTML = "0%";
            $("#systemfilebarrate").find("span")[0].innerHTML = "0 KB/S";
            if(sysFileCheckSelected()){
                if(sysFileCheckFile()){
                    $("#systemFilerecv").addClass("disabled");
                    sysDownloadFile();
                }
                else{
                    Frame.Msg.error(getRcText("DOWNLOAD_FOLDER"));
                }
            }
            else{
                Frame.Msg.error(getRcText("SELECT_FILE"));
            }
        });
        //上传文件，不可以是中文名的文件
        $("#sysFileHeadImgToolsChoise").change(function(event){
           // $("#chatSettingBtnOk").removeClass("disabled");
            var file=this.files[0];
            if(/[\u4e00-\u9fa5|\s+]/.test(file.name)){
                $("#sysFileHeadImgToolsChoise").val("");
                $("#AddSsidDlg").find(".btn-apply").addClass("disabled");
                Frame.Msg.error(getRcText("CHINESE_CHATARATERS"));
                return;
            }
            if(file.size == 0){
                $("#sysFileHeadImgToolsChoise").val("");
                Frame.Msg.error(getRcText("UPLOAD_EMPTYFILE"));
                $("#AddSsidDlg").find(".btn-apply").addClass("disabled");
            }
            if(file == undefined){
                $("#AddSsidDlg").find(".btn-apply").addClass("disabled");
            }
        });
        //写入修改后的文件名，并且判断是否合法！
        $("#sysFileRenameChoise").bind("input propertychange", function() {
            $("#fileSettingBtnOk").removeClass("disabled");
            var value=this.value;
            if(/[\u4e00-\u9fa5]/.test(value)){
                $("#sysFileRenameChoise").val("");
                $("#fileSettingBtnOk").addClass("disabled");
                Frame.Msg.error(getRcText("CHINESE_CHATARATERS"));
                return;
            }
            if(/[\\/\:\?\"<>\*]/.test(value)) {
                $("#sysFileRenameChoise").val("");
                $("#fileSettingBtnOk").addClass("disabled");
                Frame.Msg.error(getRcText("ILLEGAL_FILENAME"));
                return;
            }
            var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
            if(reg.test(value)) {
                $("#sysFileRenameChoise").val("");
                $("#fileSettingBtnOk").addClass("disabled");
                Frame.Msg.error(getRcText("CHINESE_CHATARATERS"));
                return;
            }
            if(value == ""){
                $("#fileSettingBtnOk").addClass("disabled");
            }
        });

        //上传文件
        $("#chatSettingBtnOk").click(function (event) {
            $("#sysprogressbar")[0].innerHTML = "";
            $("#systemfilebar").attr("aria-valuenow", 0);
            $("#systemfilebar").attr("style", "width: 0%;");
            $("#systemfilebarnum").find("span")[0].innerHTML = "0%";
            $("#systemfilebarrate").find("span")[0].innerHTML = "0 KB/S";
            sysCheckLoadFile();
        });
        //修改文件名，正确的文件名才可以被点击确认
        $("#fileSettingBtnOk").click(function (event) {

            if(sysFileCheckSelected()){
                if(sysFileCheckFile()){
                    Frame.Msg.confirm(getRcText("MODIFY_FILENAME"), function () {
                        var fileOldName = $('.selected').attr("data-tt-id");

                        function deleteFileSuc(data) {
                            if (data.retCode == 0){
                                var fileName = (data.newName).split("/").pop();
                                var tempNode = ($('#systemFileTable').find("tr[data-tt-id="+'"' + fileOldName +'"'+"]")).last();
                                tempNode.find("span[class='file']")[0].innerHTML = fileName;
                                tempNode.attr("data-tt-id", data.newName);
                            }
                            else if(data.reCode == -1){
                                Frame.Msg.error(getRcText("NOTFOUND_LINK"));
                            }
                            else if(data.reCode == 13){
                                Frame.Msg.error(getRcText("SYSTEM_IMPORTANTFILE"));
                            }
                            else{
                                Frame.Msg.error(data.message);
                            }
                        }
                        function deleteFileFail(err) {
                            Frame.Msg.error(err);
                        }
                        var wirelessFlowOpt = {
                            url: "/v3/fs/",
                            type: "POST",
                            dataType: "json",
                            timeout: 2000,
                            data:{Method: "renameFile" ,
                                devSN: FrameInfo.ACSN,
                                fileName:$('.selected').attr("data-tt-id"),
                                newName:$("#sysFileRenameChoise").val()
                            },
                            onSuccess: deleteFileSuc,
                            onFailed: deleteFileFail
                        }
                        Utils.Request.sendRequest(wirelessFlowOpt);
                        console.log("rename file!");
                    });
                }
                else{
                    Frame.Msg.error(getRcText("MODIFY_FOLDER"));
                }
            }
            else{
                Frame.Msg.error(getRcText("SELECT_FILE"));
            }
        });
    }

    function _init(oPara)
    {
        sysFileInitForm();
        //sysTempInt();
        //sysFileInit();
    };
    //
    function _destroy()
    {
        console.log("destroy fini!");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form"],
        "libs": ["systemfile.jquery-treetable"],
        "utils":["Request","Base"]
    });


}) (jQuery);
