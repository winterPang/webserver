define(['jquery','utils','echarts','angular-ui-router',
        'css!frame/libs/treetable/css/jquery.treetable',
        'css!frame/libs/treetable/css/jquery.treetable.theme.default',
        'css!frame/libs/treetable/css/screen',
        'jqueryTreetable' ,'css!filesystem/css/detail','filesystem/libs/oasis-select' ],
    function($,Utils,echarts) {
        return ['$scope','$http','$alertService', function($scope,$http,$alert){
            var g_tempTtparentId, g_lastTr, g_interval, g_progressNullcnt;
            var g_jForm,g_oPara;
            $scope.regiondata=[{id:1,name:'东电'},{id:2,name:'龙冠'},{id:3,name:'杭州'}];
            $scope.devicedata=[{id:1,name:'设备1'},{id:2,name:'常用设备'},{id:3,name:'备用设备'}];
            function getRcText(rcName) {
               return Utils.getRcString("fileSystem_rc", rcName);
            }
            var noticeType = getRcText("ERROR");
            $(document).on("mousedown", "#fileSystemTable tr", function () {
                $("tr.selected").removeClass("selected");
                $(this).addClass("selected");
            });

            function sysFileAssemblingTr(fileType, fileSize, fileAttr, fileTtid, fileTtparentId, fileName, fileTime){
                var tr = '<tr data-tt-id="ttId" data-tt-parent-id="ttParentId"><td><span class="attr">name</span>'+
                    '</td><td>filetype</td><td>size</td><td>time</td></tr>';

                tr = tr.replace(/filetype/,fileType);
                tr = tr.replace(/size/,fileSize);
                tr = tr.replace(/attr/,fileAttr);
                tr = tr.replace(/ttId/,fileTtid);
                tr = tr.replace(/ttParentId/,fileTtparentId);
                tr = tr.replace(/name/,fileName);
                tr = tr.replace(/time/,fileTime);

                return tr;
            }

    function checkFileName(fileName,fileSize)
    {
        if(!fileName){
            $alert.alert(getRcText("EMPTYFILE"), noticeType);
            return false;
        }
        if(/[\u4e00-\u9fa5|\s+]/.test(fileName)){
            $alert.alert(getRcText("CHINESE_CHATARATERS"), noticeType);
            return false;
        }
        if(/[\\/\:\?\"<>\*]/.test(fileName)) {
            $alert.alert(getRcText("ILLEGAL_FILENAME"), noticeType);
            return false;
        }
        if((typeof(fileSize)!="undefined") && (0 == fileSize))
        {
            $alert.alert(getRcText("UPLOAD_EMPTYFILE"), noticeType);
            return false;
        }
        var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
        if(reg.test(fileName)) {
            $alert.alert(getRcText("CHINESE_CHATARATERS"), noticeType);
            return false;
        }

        return true;
    }
    function sysFileAssembling(dataArry){
        var i, tempTr, fileAttr;
        var tempSize, tempType, tempAttr, tempTtid, tempName, tempTime;
        for(i=0; i<dataArry.length; i++){
            if(dataArry[i].fileAttr == 3){
                tempType = "Folder";
                tempAttr = "folder";
                tempSize = "--";
                tempName = dataArry[i].fileName;
                fileAttr = dataArry[i].filePath.split("/");
                tempTtid = dataArry[i].filePath + "/" + dataArry[i].fileName;
                if(fileAttr.length > 2){
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

                $('#fileSystemTable').append(tempTr);
            }
        }
        for(i=0; i<dataArry.length; i++){
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

                $('#fileSystemTable tr').each(function(){
                    var pid = $(this).attr("data-tt-id") + "";
                    var strpid = g_tempTtparentId;
                    if(pid.match(strpid)){
                        g_lastTr = $(this);
                    }
                });

                if(g_lastTr) {
                    g_lastTr.after(tempTr);
                }

            }
        }
    }
    function sysCheckLoadFile() {
        var inputFile = $("#uploadFile")[0].files[0];
        function CheckLoadFileSuc(data) {
            if (data.retCode == 0){
                var form = $("#uploadForm")[0];
                var formData = new FormData(form);
                formData.append("Method", "uploadfile");
                var xhr = new XMLHttpRequest();
                xhr.open('POST', form.action + $scope.sceneInfo.sn);
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var data = JSON.parse(xhr.responseText);
                        if(data.retCode == 0) {
                            var tempAttr = new Array();
                            tempAttr.push(data);
                            sysFileAssembling(tempAttr);
                            $("#fileSystemTable").treetable("destroy");
                            $("#fileSystemTable").treetable({expandable: true});
                            $("#uploadFile").val("");
                            $alert.alert(getRcText("UPLOADSUCCESS"));
                        }
                        else if(data.retCode == 5){
                            $alert.alert(getRcText("UPLOADING_FILE"), noticeType);
                        }
                        else if(data.retCode == 6){
                            $alert.alert(getRcText("EXIST_SAMEFILE"), noticeType);
                        }
                        else if(data.retCode == 4){
                            $alert.alert(getRcText("OPERATE_FAILED"), noticeType);
                        }
                        else{
                            $alert.alert(getRcText("DEVICEINIT_FAILED"), noticeType);
                        }
                    }
                        clearInterval(g_interval);
                        $scope.$broadcast('hide#progressModal',$scope);
                        console.log("close g_interval!");

                }
                $scope.$broadcast('show#progressModal',$scope);
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
                                clearInterval(g_interval);
                                $scope.$broadcast('hide#progressModal',$scope);
                                $alert.alert(getRcText("OPERATE_FAILED"), noticeType);
                            }
                        }
                        else{
                            clearInterval(g_interval);
                            $scope.$broadcast('hide#progressModal',$scope);
                            console.log("close g_interval!");
                        }
                    }
                    function getProgressFileFail(err) {
                    }
                    var progressOpt = {
                        method: 'POST',
                        url: "/v3/fs/progress",
                        header: {
                            "Content-type": "application/json",
                            "Accept": "application/json"
                        },
                        timeout: 2000,
                        data:{
                            devSN: $scope.sceneInfo.sn
                        }
                    };
                    $http(progressOpt).success(getProgressFileSuc);
                },1500);
                console.log("creat g_interval");
            }
            else if(data.retCode == 5){
                $alert.alert(getRcText("UPLOADING_FILE"), noticeType);
            }
            else if(data.retCode == 6){
                $alert.alert(getRcText("EXIST_SAMEFILE"), noticeType);
            }
            else if(data.retCode == -1){
                $alert.alert(getRcText("NOTFOUND_LINK"), noticeType);
            }
            else if(data.retCode == 1){
                $alert.alert(getRcText("NOENOUGH_SPACE"), noticeType);
            }
            else{
            }
        }
        function CheckLoadFileFail(err) {

        }
        var uploadOpt = {
            method: 'POST',
            url: "/v3/fs/checkLoadFile",
            header: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            timeout: 2000,
            data:{
                devSN:$scope.sceneInfo.sn,
                fileName:inputFile.name,
                fileSize:inputFile.size
            }
        };
        $http(uploadOpt).success(CheckLoadFileSuc);
    }
    function sysFileInitForm() {
        $scope.uploadOptions = {
            mId:"uploadModal",
            title:getRcText("SENDFILE2DEVICE"),                            //弹出框标题自定义，默认标题为“提示”
            autoClose: true,                         //点击确定按钮是否关闭弹窗，默认关闭
            showCancel: true,                       //是否显示取消按钮，默认显示
            okHandler: function(modal,$ele){
                $("#sysprogressbar")[0].innerHTML = "";
                $("#systemfilebar").attr("aria-valuenow", 0);
                $("#systemfilebar").attr("style", "width: 0%;");
                $("#systemfilebarnum").find("span")[0].innerHTML = "0%";
                $("#systemfilebarrate").find("span")[0].innerHTML = "0 KB/S";
                sysCheckLoadFile();
            },
            cancelHandler: function(modal,$ele){
                //点击取消按钮事件，默认什么都不做
                $("#uploadFile").val("");
            },
            beforeRender: function($ele){
                //渲染弹窗之前执行的操作,$ele为传入的html片段;
                return $ele;
            }
        };
        $scope.progressOptions = {
            mId:"progressModal",
            title:getRcText("FILEPROGRESS"),                        //弹出框标题自定义，默认标题为“提示”
            autoClose: true,                         //点击确定按钮是否关闭弹窗，默认关闭
            showCancel: false,
            showClose: false,
            okText: getRcText("CLOSEPROGRESS"),  // 确定按钮文本
            okHandler: function(modal,$ele){
                clearInterval(g_interval);
                console.log("close g_interval!");

            },
            cancelHandler: function(modal,$ele){
                //点击取消按钮事件，默认什么都不做
            },
            beforeRender: function($ele){
                //渲染弹窗之前执行的操作,$ele为传入的html片段;
                return $ele;
            }
        };
        $scope.renameOptions = {
                mId:"renameModal",
                title:getRcText("RENAMEFILE"),                            //弹出框标题自定义，默认标题为“提示”
                autoClose: true,                         //点击确定按钮是否关闭弹窗，默认关闭
                showCancel: true,                       //是否显示取消按钮，默认显示
                okHandler: function(modal,$ele){
                    var newName =  $scope.filesystem.rename;

                    if(checkFileName(newName)) {
                        $alert.confirm(getRcText("MODIFY_FILENAME"),function () {
                            var selectDom = $('.selected');
                            var oldName = selectDom.attr("data-tt-id");

                            var renameFileOpt = {
                                url: "/v3/fs/",
                                method: 'POST',
                                header: {
                                    "Content-type": "application/json",
                                    "Accept": "application/json"
                                },
                                timeout: 2000,
                                data: {
                                    Method: "renameFile",
                                    devSN: $scope.sceneInfo.sn,
                                    fileName: oldName,
                                    newName: newName,
                                }
                            };

                            function renameFileSuc(data) {
                                if (0 == data.retCode) {
                                    var fileName = (data.newName).split("/").pop();
                                    var tempNode = ($('#fileSystemTable').find("tr[data-tt-id=" + '"' + oldName + '"' + "]")).last();
                                    tempNode.find("span[class='file']")[0].innerHTML = fileName;
                                    tempNode.attr("data-tt-id", data.newName);
                                }
                                else if(data.reCode == -1){
                                    $alert.alert(getRcText("NOTFOUND_LINK"), noticeType);
                                }
                                else if(data.reCode == 13){
                                    $alert.alert(getRcText("SYSTEM_IMPORTANTFILE"), noticeType);
                                }
                                else{

                                }
                                $scope.filesystem.rename = "";
                                modal.hide();
                            }

                            $http(renameFileOpt).success(renameFileSuc);
                        });
                    }
                    else
                    {
                        $("#renameFile").val("");
                    }
                },
                cancelHandler: function(modal,$ele){
                    //点击取消按钮事件，默认什么都不做
                },
                beforeRender: function($ele){
                    //渲染弹窗之前执行的操作,$ele为传入的html片段;
                    return $ele;
                }
        };
        $scope.filesystem = {rename:""};
        function getFileSuc(data) {
            if(data.retCode === 0) {
                var dataArray = data.message;
                sysFileAssembling(dataArray);
                sysFileInit();
                g_progressNullcnt = 0;
                $("#deleteFileBtn").removeClass("disabled");
                $("#renameFileBtn").removeClass("disabled");
                $("#uploadFileBtn").removeClass("disabled");
                $("#downloadFileBtn").removeClass("disabled");
            }
            else if(data.retCode === 2){
                $alert.alert(getRcText("NOOPERATE_ACCESS"), noticeType);
            }
            else{
                $alert.alert(getRcText("NOTFOUND_LINK"), noticeType);
            }
        }

        function getFileFail(err) {
        }
        var url = Utils.getUrl('POST','', '/fs','/init/applications/file_data.json');
        var getFilesOpt =
            {
                url: url.url,
                method:url.method,
                header: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                timeout: 3000,
                data:{
                    Method: "getDevFileStatus" ,
                    devSN: $scope.sceneInfo.sn,
                    pathName:""
                }
            };

        $http(getFilesOpt).success(getFileSuc);

    }

    function sysFileInit(){
        $("#fileSystemTable").treetable({expandable: true});

        $scope.delete = function (){
            var selectDom = $('.selected');
            if(selectDom.length){
                if(selectDom.find("span").hasClass("file")){
                    $alert.confirm(getRcText("MAKESURE_DELETE"), function () {
                        function deleteFileSuc(data) {
                            if(0 == data.retCode){
                                selectDom.remove();
                            }
                            else if(data.reCode == -1){
                                $alert.alert(getRcText("NOTFOUND_LINK"), noticeType);
                            }
                            else if(data.reCode == 13){
                                $alert.alert(getRcText("SYSTEM_IMPORTANTFILE"), noticeType);
                            }
                            else{

                            }
                        }
                        function deleteFileFail(err) {

                        }
                        var deleteFileOpt = {
                            url: "/v3/fs/",
                            method:"POST",
                            header: {
                                "Content-type": "application/json",
                                "Accept": "application/json"
                            },
                            timeout: 2000,
                            data:{
                                Method: "deleteFile" ,
                                devSN: $scope.sceneInfo.sn,
                                fileName:selectDom.attr("data-tt-id")
                            }
                        };
                        console.log(selectDom.attr("data-tt-id"));
                        $http(deleteFileOpt).success(deleteFileSuc);

                    });
                }
                else{
                    $alert.alert(getRcText("DELETE_FOLDER"), noticeType);
                }
            }
            else{
                $alert.alert(getRcText("SELECT_FILE"), noticeType);
            }
        };
        $scope.rename = function (){
            var selectDom = $('.selected');
            if(selectDom.length) {
                if(selectDom.find("span").hasClass("file")) {
                    $scope.$broadcast('show#renameModal',$scope);
                }
                else {
                    $alert.alert(getRcText("MODIFY_FOLDER"), noticeType);
                }
            }
            else {
                $alert.alert(getRcText("SELECT_FILE"), noticeType);
            }
        };

        $scope.upload = function (){
            $scope.$broadcast('show#uploadModal',$scope);
        };
        $scope.download = function() {
            $("#sysprogressbar")[0].innerHTML = "";
            $("#systemfilebar").attr("aria-valuenow", 0);
            $("#systemfilebar").attr("style", "width: 0%;");
            $("#systemfilebarnum").find("span")[0].innerHTML = "0%";
            $("#systemfilebarrate").find("span")[0].innerHTML = "0 KB/S";
            $alert.confirm(getRcText("MAKESURE_DOWNLOADFILE"),function (){
            var filename = $('.selected').attr("data-tt-id");
            var isGetUrl = 0;
            var intervar = 0;
            $("#downloadFileBtn").addClass("disabled");
            function DownloadFileSuc(data) {
                $("#downloadFileBtn").removeClass("disabled");
                if (data.retCode == 0){
                    //设置定时器获取进度条信息
                    $scope.$broadcast('show#progressModal',$scope);

                    function ProgressFileSuc(data) {
                        if (data.retCode == 0){
                            if("" === data.devProgress){
                                g_progressNullcnt++;
                            }
                            else{
                                $("#sysprogressbar")[0].innerHTML = getRcText("DEVICEFILETO_CLOUD");
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
                                    $scope.$broadcast('hide#progressModal',$scope);
                                    $("#filerecive").get(0).src = data.fileName.replace('../../fs','/v3/fs');
                                    clearInterval(intervar);
                                }, 500);
                            }
                            if(5 == g_progressNullcnt){
                                g_progressNullcnt = 0;
                                clearInterval(g_interval);
                                $scope.$broadcast('hide#progressModal',$scope);
                                $alert.alert(getRcText("OPERATE_FAILED"), noticeType);
                            }
                        }
                        else{
                            clearInterval(g_interval);
                            $scope.$broadcast('hide#progressModal',$scope);
                            console.log("close g_interval!");
                        }
                    }
                    function ProgressileFail(err) {
                    }
                    var progressOpt = {
                        method: 'POST',
                        url: "/v3/fs/progress",
                        header: {
                            "Content-type": "application/json",
                            "Accept": "application/json"
                        },
                        timeout: 2000,
                        data:{
                            devSN: $scope.sceneInfo.sn,
                            fileName:filename
                        }
                    };


                    g_interval = setInterval(function (){
                        $http(progressOpt).success(ProgressFileSuc);
                    },1500);
                    console.log("creat g_interval");
                }
                else{
                    $alert.alert(getRcText("UPLOADING_FILE"), noticeType);
                }
            }
            function DownloadFileFail(err) {
                $("#downloadFileBtn").removeClass("disabled");
                $alert.alert(getRcText("REQUEST_TIMEOUT"), noticeType);
            }

            var downloadOpt = {
                url: "/v3/fs/downloadFile",
                method:"POST",
                header: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                timeout: 5000,
                data:{
                    Method: "downloadFile" ,
                    devSN: $scope.sceneInfo.sn,
                    fileName: filename
            }
        };
            $http(downloadOpt).success(DownloadFileSuc).error(DownloadFileFail);
            console.log("download file!");
        });
        };
        $("#uploadFile").change(function(event){
            var inputFile = $("#uploadFile")[0].files[0];
            if(!checkFileName(inputFile.name, inputFile.size))
            {
                $("#uploadFile").val("");
                //$scope.$broadcast('hide#uploadModal',$scope);
            }
        });


    };
    sysFileInitForm();


}];
});
