define(['jquery', 'utils', '../jquery-treetable', 'css!filesystem/css/jquery.treetable.css',
    'css!filesystem/css/jquery.treetable.theme.default.css', 'css!filesystem/css/screen.css'], function ($, Utils) {
    return ['$scope', '$http', '$alertService', '$timeout', function ($scope, $http, $alert, $timeout) {

        var g_tempTtparentId, g_lastTr, g_interval, g_progressNullcnt;
        var g_jForm, g_oPara;
        //新加
        var URL_GET_DEV_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/%d';
        $scope.devSnList = [];
        $scope.devOptions = {
            sId: 'devSnSelct',
            allowClear: false
        };
        $scope.Disabled = true;
        $scope.SH = true;
        //加载load图片
        if (Utils.getLang() == 'en') {
            $scope.load = 3;
        } else {
            $scope.load = 2;
        }
        //

        function getRcText(rcName) {
            return Utils.getRcString("fileSystem_rc", rcName);
        }

        var noticeType = getRcText("ERROR");
        var sucType = getRcText("SUCCESS");
        var promptType = getRcText("PROMPT");
        //提示框的表头
        $(document).on("mousedown", "#fileSystemTable tr", function () {
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
        });

        function sysFileAssemblingTr(fileType, fileSize, fileAttr, fileTtid, fileTtparentId, fileName, fileTime) {
            var tr = '<tr data-tt-id="ttId" data-tt-parent-id="ttParentId"><td><span class="attr">name</span>' +
                '</td><td>filetype</td><td>size</td><td>time</td></tr>';

            tr = tr.replace(/filetype/, fileType);
            tr = tr.replace(/size/, fileSize);
            tr = tr.replace(/attr/, fileAttr);
            tr = tr.replace(/ttId/, fileTtid);
            tr = tr.replace(/ttParentId/, fileTtparentId);
            tr = tr.replace(/name/, fileName);
            tr = tr.replace(/time/, fileTime);

            return tr;
        }

        function checkFileName(fileName, fileSize) {
            if (!fileName) {
                $alert.alert(getRcText("EMPTYFILE"), noticeType);
                return false;
            }
            if (!/^[\da-zA-Z][\da-zA-Z-_.]{0,99}$/.test(fileName)) {
                $alert.alert(getRcText("FILENAME_ERROR"), promptType);
                return false;
            }
            //上面的if一加下面的估计没有用了-_-!
            if (/[\u4e00-\u9fa5|\s+]/.test(fileName)) {
                $alert.alert(getRcText("CHINESE_CHATARATERS"), noticeType);
                return false;
            }
            if (/[\\/\:\?\"<>\*]/.test(fileName)) {
                //文件名中不能有\ / : ? " < > * 否则正则为ture继而报错
                $alert.alert(getRcText("ILLEGAL_FILENAME"), noticeType);
                return false;
            }
            if ((typeof(fileSize) != "undefined") && (0 == fileSize)) {
                $alert.alert(getRcText("UPLOAD_EMPTYFILE"), noticeType);
                return false;
            }
            var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
            if (reg.test(fileName)) {
                $alert.alert(getRcText("CHINESE_CHATARATERS"), noticeType);
                return false;
            }

            return true;
        }

        function sysFileAssembling(dataArry) {
            var i, tempTr, fileAttr;
            var tempSize, tempType, tempAttr, tempTtid, tempName, tempTime;
            for (i = 0; i < dataArry.length; i++) {
                if (dataArry[i].fileAttr == 3) {
                    tempType = "Folder";
                    tempAttr = "folder";
                    tempSize = "--";
                    tempName = dataArry[i].fileName;
                    fileAttr = dataArry[i].filePath.split("/");
                    tempTtid = dataArry[i].filePath + "/" + dataArry[i].fileName;
                    if (fileAttr.length > 2) {
                        g_tempTtparentId = dataArry[i].filePath;
                    }
                    else {
                        g_tempTtparentId = "";
                    }

                    function getLocalTime(nS) {
                        return new Date(parseInt(nS) * 1000).toISOString().replace(/T/g, " ").replace(/.000Z/g, "");
                    }

                    tempTime = getLocalTime(dataArry[i].mtime);
                    tempTr = sysFileAssemblingTr(tempType, tempSize, tempAttr, tempTtid, g_tempTtparentId, tempName, tempTime);

                    $('#fileSystemTableBdy').append(tempTr);
                }
            }
            for (i = 0; i < dataArry.length; i++) {
                if (dataArry[i].fileAttr != 3) {
                    tempType = "File";
                    tempAttr = "file";

                    if ((dataArry[i].fileSize) > (1024 * 1024)) {
                        tempSize = ((dataArry[i].fileSize) / (1024 * 1024)).toFixed(2) + ' MB'
                    }
                    else {
                        tempSize = ((dataArry[i].fileSize) / (1024)).toFixed(2) + ' KB'
                    }

                    tempName = dataArry[i].fileName;
                    fileAttr = dataArry[i].filePath.split("/");
                    tempTtid = dataArry[i].filePath + "/" + dataArry[i].fileName;
                    if (fileAttr.length > 2) {
                        g_tempTtparentId = dataArry[i].filePath;
                    }
                    else {
                        g_tempTtparentId = "";
                    }
                    function getLocalTime(nS) {
                        return new Date(parseInt(nS) * 1000).toISOString().replace(/T/g, " ").replace(/.000Z/g, "");
                    }

                    tempTime = getLocalTime(dataArry[i].mtime);
                    tempTr = sysFileAssemblingTr(tempType, tempSize, tempAttr, tempTtid, g_tempTtparentId, tempName, tempTime);

                    $('#fileSystemTable tr').each(function () {
                        var pid = $(this).attr("data-tt-id") + "";
                        var strpid = g_tempTtparentId;
                        if (pid.match(strpid)) {
                            g_lastTr = $(this);
                        }
                    });

                    if (g_lastTr) {
                        g_lastTr.after(tempTr);
                    }

                }
            }
        }

        function sysCheckLoadFile() {
            var inputFile = $("#uploadFile")[0].files[0];

            function CheckLoadFileSuc(data) {
                if (!data) {
                    $alert.alert(getRcText("REQUEST_TIMEOUT"), noticeType);
                    return;
                }
                if (data.retCode == 0) {
                    var form = $("#uploadForm")[0];
                    var formData = new FormData(form);
                    formData.append("Method", "uploadfile");
                    var xhr = new XMLHttpRequest();
                    // xhr.open('POST', form.action + $scope.sceneInfo.sn);
                    xhr.open('POST', form.action + $scope.apData);
                    xhr.send(formData);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var data = JSON.parse(xhr.responseText);
                            if (data.retCode == 0) {
                                var tempAttr = [];
                                tempAttr.push(data);
                                sysFileAssembling(tempAttr);
                                $("#fileSystemTable").treetable("destroy");
                                $("#fileSystemTable").treetable({expandable: true});
                                $("#fileSystemTable").treetable('expandAll');
                                clearInterval(g_interval);
                                $scope.$broadcast('hide#progressModal');
                                $alert.msgDialogSuccess(getRcText("UPLOADSUCCESS"));
                                // $alert.alert("文件上传成功", sucType);
                            }
                            else if (data.retCode == 5) {
                                $alert.alert(getRcText("UPLOADING_FILE"), promptType);
                            }
                            else if (data.retCode == 6) {
                                $alert.alert(getRcText("EXIST_SAMEFILE"), noticeType);
                            }
                            else if (data.retCode == 4) {
                                $alert.alert(getRcText("OPERATE_FAILED"), noticeType);
                            }
                            else {
                                $alert.alert(getRcText("DEVICEINIT_FAILED"), noticeType);
                            }
                        }
                        console.log("close g_interval!");

                    }
                    $scope.$broadcast('show#progressModal');
                    g_interval = setInterval(function () {
                        function getProgressFileSuc(data) {
                            if (!data) {
                                $alert.alert(getRcText("REQUEST_TIMEOUT"), noticeType);
                                return;
                            }
                            if (data.retCode == 0) {
                                if ("" === data.devProgress) {
                                    g_progressNullcnt++;
                                }
                                else {
                                    g_progressNullcnt = 0;
                                    var progress = (data.broProgress + data.devProgress) / 2;
                                    $("#sysprogressbar")[0].innerHTML = getRcText("LOCALFILETO_DEVICE");
                                    $("#systemfilebar").attr("aria-valuenow", progress);
                                    $("#systemfilebar").attr("style", "width: " + progress + "%;");
                                    $("#systemfilebarnum").find("span")[0].innerHTML = progress + "%";
                                    $("#systemfilebarrate").find("span")[0].innerHTML = (data.broRate + data.devRate) + " KB/S";
                                    // if (100 != data.broProgress) {
                                    //     $("#sysprogressbar")[0].innerHTML = getRcText("LOCALFILETO_CLOUD");
                                    //     $("#systemfilebar").attr("aria-valuenow", data.broProgress);
                                    //     $("#systemfilebar").attr("style", "width: " + data.broProgress + "%;");
                                    //     $("#systemfilebarnum").find("span")[0].innerHTML = data.broProgress + "%";
                                    //     $("#systemfilebarrate").find("span")[0].innerHTML = data.broRate + " KB/S";
                                    // }
                                    // else if (100 != data.devProgress) {
                                    //     $("#sysprogressbar")[0].innerHTML = getRcText("CLOUDFILETO_DEVICE");
                                    //     $("#systemfilebar").attr("aria-valuenow", data.devProgress);
                                    //     $("#systemfilebar").attr("style", "width: " + data.devProgress + "%;");
                                    //     $("#systemfilebarnum").find("span")[0].innerHTML = data.devProgress + "%";
                                    //     if (1024 >= data.devRate) {
                                    //         $("#systemfilebarrate").find("span")[0].innerHTML = data.devRate + " KB/S";
                                    //     }
                                    //     else {
                                    //         $("#systemfilebarrate").find("span")[0].innerHTML = ((data.devRate) / (1024)).toFixed(2) + " MB/S";
                                    //     }
                                    // }
                                    // else {
                                    //     $timeout(function () {
                                    //         $scope.$broadcast('hide#progressModal');
                                    //     }, 500);
                                    // }
                                }
                                if (5 == g_progressNullcnt) {
                                    xhr.abort();
                                    g_progressNullcnt = 0;
                                    clearInterval(g_interval);
                                    $timeout(function () {
                                        $scope.$broadcast('hide#progressModal');
                                    }, 500);
                                    // $scope.$broadcast('hide#progressModal');
                                    $alert.alert(getRcText("OPERATE_FAILED"), noticeType);
                                }
                            }
                            else {
                                clearInterval(g_interval);
                                // $scope.$broadcast('hide#progressModal');
                                $timeout(function () {
                                    $scope.$broadcast('hide#progressModal');
                                }, 500);
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
                            data: {
                                // devSN: $scope.sceneInfo.sn
                                devSN: $scope.apData
                            }
                        };
                        $http(progressOpt).success(getProgressFileSuc);
                    }, 1500);
                    console.log("creat g_interval");
                }
                else if (data.retCode == 5) {
                    $alert.alert(getRcText("UPLOADING_FILE"), promptType);
                }
                else if (data.retCode == 6) {
                    $alert.alert(getRcText("EXIST_SAMEFILE"), noticeType);
                }
                else if (data.retCode == -1) {
                    $alert.alert(getRcText("NOTFOUND_LINK"), noticeType);
                }
                else if (data.retCode == 1) {
                    $alert.alert(getRcText("NOENOUGH_SPACE"), noticeType);
                }
                else {
                    $alert.alert(getRcText("OPERATE_FAILED"), noticeType);
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
                data: {
                    // devSN:$scope.sceneInfo.sn,
                    devSN: $scope.apData,
                    fileName: inputFile.name,
                    fileSize: inputFile.size
                }
            };
            $http(uploadOpt).success(CheckLoadFileSuc);
        }

        $scope.uploadOptions = {
            mId: "uploadModal",
            title: getRcText("SENDFILE2DEVICE"),                            //弹出框标题自定义，默认标题为“提示”
            autoClose: true,                         //点击确定按钮是否关闭弹窗，默认关闭
            showCancel: true,                       //是否显示取消按钮，默认显示
            okHandler: function (modal, $ele) {
                $("#sysprogressbar")[0].innerHTML = "";
                $("#systemfilebar").attr("aria-valuenow", 0);
                $("#systemfilebar").attr("style", "width: 0%;");
                $("#systemfilebarnum").find("span")[0].innerHTML = "0%";
                $("#systemfilebarrate").find("span")[0].innerHTML = "0 KB/S";
                sysCheckLoadFile();
            }
        };


        $scope.progressOptions = {
            mId: "progressModal",
            title: getRcText("FILEPROGRESS"),                        //弹出框标题自定义，默认标题为“提示”
            autoClose: true,                         //点击确定按钮是否关闭弹窗，默认关闭
            showCancel: false,
            showClose: false,
            okText: getRcText("CLOSEPROGRESS"),  // 确定按钮文本
            okHandler: function (modal, $ele) {
                // clearInterval(g_interval);       //这里会阻止下载
            }
        };
        $scope.renameOptions = {
            mId: "renameModal",
            title: getRcText("RENAMEFILE"),                            //弹出框标题自定义，默认标题为“提示”
            autoClose: true,                         //点击确定按钮是否关闭弹窗，默认关闭
            showCancel: true,                       //是否显示取消按钮，默认显示
            okHandler: function (modal, $ele) {
                var newName = $scope.filesystem.rename;

                if (checkFileName(newName)) {
                    // $alert.confirm(getRcText("MODIFY_FILENAME"), function () {
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
                            // devSN: $scope.sceneInfo.sn,
                            devSN: $scope.apData,
                            fileName: oldName,
                            newName: newName,
                        }
                    };

                    function renameFileSuc(data) {
                        if (!data) {
                            $alert.alert(getRcText("REQUEST_TIMEOUT"), noticeType);
                            return;
                        }
                        if (0 == data.retCode) {
                            var fileName = (data.newName).split("/").pop();
                            var tempNode = ($('#fileSystemTable').find("tr[data-tt-id=" + '"' + oldName + '"' + "]")).last();
                            tempNode.find("span[class='file']")[0].innerHTML = fileName;
                            tempNode.attr("data-tt-id", data.newName);
                            $alert.msgDialogSuccess(getRcText("RENAME_SUCCESSFULLY"));
                            // $alert.alert("文件改名成功", sucType);
                        }
                        else if (data.retCode == -1) {
                            $alert.alert(getRcText("NOTFOUND_LINK"), noticeType);
                        }
                        else if (data.retCode == 13) {
                            $alert.alert(getRcText("SYSTEM_IMPORTANTFILE"), promptType);
                        }
                        else if (data.retCode == 12) {
                            $alert.alert(getRcText("EXIST_SAMEFILE"), noticeType);
                        }
                        else {
                            $alert.alert(getRcText("OPERATE_FAILED"), noticeType);
                        }
                        $scope.filesystem.rename = "";
                        // modal.hide();
                    }

                    $http(renameFileOpt).success(renameFileSuc);
                    // });
                }
                else {
                    $("#renameFile").val("");
                }
            }
        };

        function sysFileInitForm() {
            $scope.SH = true;
            $scope.filesystem = {rename: ""};
            $scope.Disabled = true;
            function getFileSuc(data) {
                $scope.SH = false;
                if (!data) {
                    $alert.msgDialogError(getRcText("REQUEST_TIMEOUT"), 'error');
                    return;
                }
                if (data.retCode === 0) {
                    $scope.Disabled = false;
                    var dataArray = data.message;
                    sysFileAssembling(dataArray);
                    sysFileInit();
                    g_progressNullcnt = 0;
                }
                else if (data.retCode === 2) {
                    $alert.alert(getRcText("NOOPERATE_ACCESS"), noticeType);
                }
                else {
                    $alert.alert(getRcText("NOTFOUND_LINK"), noticeType);
                }
            }

            function getFileFail(err) {
            }

            var url = Utils.getUrl('POST', '', '/fs', '/init/applications/file_data.json');
            var getFilesOpt =
            {
                url: url.url,
                method: url.method,
                header: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                    timeout: 6000,
                data: {
                    Method: "getDevFileStatus",
                    // devSN: $scope.sceneInfo.sn,
                    devSN: $scope.apData,
                    pathName: ""
                }
            };

            $http(getFilesOpt).success(getFileSuc);
        }

        function sysFileInit() {
            $("#fileSystemTable").treetable({expandable: true});
            $("#fileSystemTable").treetable('expandAll');

            $scope.delete = function () {
                var selectDom = $('.selected');
                if (selectDom.length) {
                    if (selectDom.find("span").hasClass("file")) {
                        $alert.confirm(getRcText("MAKESURE_DELETE"), function () {
                            function deleteFileSuc(data) {
                                if (!data) {
                                    $alert.alert(getRcText("REQUEST_TIMEOUT"), noticeType);
                                    return;
                                }
                                if (0 == data.retCode) {
                                    selectDom.remove();
                                    $alert.msgDialogSuccess(getRcText("DELETE_SUCCESSFULLY"));
                                    // $alert.alert("文件删除成功", sucType);
                                }
                                else if (data.retCode == -1) {
                                    $alert.alert(getRcText("NOTFOUND_LINK"), noticeType);
                                }
                                else if (data.retCode == 13) {
                                    $alert.alert(getRcText("SYSTEM_IMPORTANTFILE"), promptType);
                                }
                                else if (data.retCode == 7) {
                                    $alert.alert(getRcText("FILE_NOTEXIST"), noticeType);
                                    $("#fileSystemTableBdy").empty();
                                    sysFileInitForm();
                                }
                                else {
                                    $alert.alert(getRcText("OPERATE_FAILED"), noticeType);
                                }
                            }


                            var deleteFileOpt = {
                                url: "/v3/fs/",
                                method: "POST",
                                header: {
                                    "Content-type": "application/json",
                                    "Accept": "application/json"
                                },
                                timeout: 2000,
                                data: {
                                    Method: "deleteFile",
                                    // devSN: $scope.sceneInfo.sn,
                                    devSN: $scope.apData,
                                    fileName: selectDom.attr("data-tt-id")
                                }
                            };
                            console.log(selectDom.attr("data-tt-id"));
                            $http(deleteFileOpt).success(deleteFileSuc);

                        });
                    }
                    else {
                        $alert.alert(getRcText("DELETE_FOLDER"), promptType);
                    }
                }
                else {
                    $alert.alert(getRcText("SELECT_FILE"), promptType);
                }
            };
            $scope.rename = function () {
                var selectDom = $('.selected');
                if (selectDom.length) {
                    if (selectDom.find("span").hasClass("file")) {
                        $scope.$broadcast('show#renameModal');
                    }
                    else {
                        $alert.alert(getRcText("MODIFY_FOLDER"), promptType);
                    }
                }
                else {
                    $alert.alert(getRcText("SELECT_FILE"), promptType);
                }
            };

            $scope.upload = function () {
                $scope.$broadcast('show#uploadModal');
            };

            $scope.download = function () {
                var selectDom = $('.selected');
                if (selectDom.length) {
                    if (selectDom.find("span").hasClass("file")) {
                        var fileName = $('.selected').attr("data-tt-id");
                        fileName = fileName.split("/");
                        fileName = fileName[fileName.length-1];
                        if (fileName.length > 100) {
                            $alert.alert(getRcText("FILENAMEL"), promptType);
                            return;
                        }
                    }
                    else {
                        $alert.alert(getRcText("DOWNLOAD_FOLDER"), promptType);
                        return;
                    }
                }
                else {
                    $alert.alert(getRcText("SELECT_FILE"), promptType);
                    return;
                }

                //
                $("#sysprogressbar")[0].innerHTML = "";
                $("#systemfilebar").attr("aria-valuenow", 0);
                $("#systemfilebar").attr("style", "width: 0%;");
                $("#systemfilebarnum").find("span")[0].innerHTML = "0%";
                $("#systemfilebarrate").find("span")[0].innerHTML = "0 KB/S";
                $alert.confirm(getRcText("MAKESURE_DOWNLOADFILE"), function () {
                    var filename = $('.selected').attr("data-tt-id");
                    var isGetUrl = 0;
                    var intervar = 0;

                    function DownloadFileSuc(data) {
                        if (!data) {
                            $alert.alert(getRcText("REQUEST_TIMEOUT"), noticeType);
                            return;
                        }
                        if (data.retCode == 0) {
                            //设置定时器获取进度条信息
                            // $scope.$broadcast('show#progressModal');

                            function ProgressFileSuc(data) {
                                if (data.retCode == 0) {
                                    if ("" === data.devProgress) {
                                        g_progressNullcnt++;
                                    }
                                    else {
                                        $("#sysprogressbar")[0].innerHTML = getRcText("DEVICEFILETO_CLOUD");
                                        $("#systemfilebar").attr("aria-valuenow", data.devProgress);
                                        $("#systemfilebar").attr("style", "width: " + data.devProgress + "%;");
                                        $("#systemfilebarnum").find("span")[0].innerHTML = data.devProgress + "%";
                                        $("#systemfilebarrate").find("span")[0].innerHTML = data.devRate + " KB/S";
                                        g_progressNullcnt = 0;
                                    }
                                    if ((data.fileName != undefined) && (isGetUrl == 0)) {
                                        isGetUrl = 1;
                                        $timeout(function () {
                                            $scope.$broadcast('hide#progressModal');
                                        }, 500);
                                        clearInterval(g_interval);
                                        console.log("close g_interval!");
                                        intervar = setInterval(function () {
                                            // $scope.$broadcast('hide#progressModal');
                                            $("#filerecive").get(0).src = data.fileName.replace('../../fs', '/v3/fs');
                                            clearInterval(intervar);
                                        }, 500);
                                    }
                                    if (5 == g_progressNullcnt) {
                                        g_progressNullcnt = 0;
                                        clearInterval(g_interval);
                                        $timeout(function () {
                                            $scope.$broadcast('hide#progressModal');
                                        }, 500);
                                        // $scope.$broadcast('hide#progressModal', $scope);
                                        $alert.alert(getRcText("OPERATE_FAILED"), noticeType);
                                    }
                                }
                                else {
                                    clearInterval(g_interval);
                                    $timeout(function () {
                                        $scope.$broadcast('hide#progressModal');
                                    }, 500);
                                    // $scope.$broadcast('hide#progressModal');
                                    console.log("close g_interval!");
                                }
                            }


                            var progressOpt = {
                                method: 'POST',
                                url: "/v3/fs/progress",
                                header: {
                                    "Content-type": "application/json",
                                    "Accept": "application/json"
                                },
                                timeout: 2000,
                                data: {
                                    // devSN: $scope.sceneInfo.sn,
                                    devSN: $scope.apData,
                                    fileName: filename
                                }
                            };

                            $scope.$broadcast('show#progressModal');

                            g_interval = setInterval(function () {
                                $http(progressOpt).success(ProgressFileSuc);
                            }, 1500);
                        }
                        else {
                            $alert.alert(getRcText("UPLOADING_FILE"), promptType);
                        }
                    }

                    function DownloadFileFail(err) {
                        $alert.alert(getRcText("REQUEST_TIMEOUT"), noticeType);
                    }

                    var downloadOpt = {
                        url: "/v3/fs/downloadFile",
                        method: "POST",
                        header: {
                            "Content-type": "application/json",
                            "Accept": "application/json"
                        },
                        timeout: 15000,
                        data: {
                            Method: "downloadFile",
                            // devSN: $scope.sceneInfo.sn,
                            devSN: $scope.apData,
                            fileName: filename
                        }
                    };
                    $http(downloadOpt).success(DownloadFileSuc).error(DownloadFileFail);
                    console.log("download file!");
                });
            };


            $("#uploadFile").change(function (event) {
                var inputFile = $("#uploadFile")[0].files[0];
                if (!checkFileName(inputFile.name, inputFile.size)) {
                    $("#uploadFile").val("");
                    //$scope.$broadcast('hide#uploadModal');
                }
            });


        };
        // sysFileInitForm();
        // //假数据(以下部分仅用于demo,以后正式开发应删)>>>>>>
        // function getFileSu_c(data) {
        //         if(data.retCode === 0) {
        //             var dataArray = data.message;
        //             sysFileAssembling(dataArray);
        //             sysFileInit();
        //             g_progressNullcnt = 0;
        //             $("#deleteFileBtn").removeClass("disabled");
        //             $("#renameFileBtn").removeClass("disabled");
        //             $("#uploadFileBtn").removeClass("disabled");
        //             $("#downloadFileBtn").removeClass("disabled");
        //         }
        //         else if(data.retCode === 2){
        //             $alert.alert(getRcText("NOOPERATE_ACCESS"), noticeType);
        //         }
        //         else{
        //             $alert.alert(getRcText("NOTFOUND_LINK"), noticeType);
        //         }
        //     }
        // $scope.pk = {"message":[{"fileName":"flash:","fileSize":2048,"fileAttr":3,"filePath":"/mnt","mtime":1482136835},{"fileName":"ifindex.dat","fileSize":218,"fileAttr":0,"filePath":"/mnt/flash:","mtime":1481960936},{"fileName":"pki","fileSize":2048,"fileAttr":3,"filePath":"/mnt/flash:","mtime":1647984912},{"fileName":"https-server.p12","fileSize":2398,"fileAttr":0,"filePath":"/mnt/flash:/pki","mtime":1491385264},{"fileName":"startup.cfg","fileSize":3525,"fileAttr":2,"filePath":"/mnt/flash:","mtime":1481960937},{"fileName":"startup.mdb","fileSize":78989,"fileAttr":2,"filePath":"/mnt/flash:","mtime":1481960937},{"fileName":"wa5300-fat-boot.bin","fileSize":5422080,"fileAttr":1,"filePath":"/mnt/flash:","mtime":1451606400},{"fileName":"wa5300-fat-system.bin","fileSize":24610816,"fileAttr":1,"filePath":"/mnt/flash:","mtime":1451606400}],"retCode":0,"memoryLeft":98};
        // $scope.$watch('Search_ap',function  (v,v2) {
        //     // console.log(v,v2);
        //     if(v){
        //         getFileSu_c($scope.pk);
        //     }      
        // });
        // //<<<<<<<<<<<<<<
        var deviseDevData = {};
        $http.get(sprintf(URL_GET_DEV_LIST, $scope.sceneInfo.nasid))
            .success(function (data) {
                $.each(data.data[0].devices, function (i, value) {
                    $scope.devSnList.push(value.devAlias);
                    deviseDevData[value.devAlias] = value.devSn;
                });
            }).error(function () {
            $alert.noticeDanger(getRcString('retry'));
        });
        // $scope.$on('select2:select#devSnSelct', getDevSn);
        $scope.$watch('dev', function () {
            $("#fileSystemTableBdy").empty();
            if (!$scope.dev) {
                return;
            }
            $scope.apData = deviseDevData[$scope.dev];
            sysFileInitForm();
        })

    }]
})
