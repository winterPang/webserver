define(['utils','jquery','css!versionupdate5/css/index.css'], function (Utils,$) {
    return ['$scope', '$http','$alertService','$interval','$timeout',function ($scope, $http,$alert,$interval,$timeout) {
        function getRcString(attrName){
            return Utils.getRcString("device_infor_rc",attrName);
        }
        var g_versionlist = [];
        var g_versionNewArr = [];
        var requestData = {};
        var g_getDevStatus;
        $scope.updateType={};
        $scope.version=0;
        $scope.isCheck=true;
        var g_ID="";
        var width=0;
        var g_number=0;
        var flag;
        var dev_sn=[];
        var SPVersion;
        var LTVersion;
        $scope.showHide={
            upgradeflagup:1
        };
        dev_sn.push($scope.sceneInfo.sn);
        var tableHead=getRcString("Version_HEADER").split(',');
        var VER_ERROR = getRcString("VER_ERROR").split(";");
        var VERSION_FAIL = getRcString("VERSION_FAIL").split(";");
        var systemUrl=Utils.getUrl('GET', '', '/devmonitor/web/system', '/init/versionupdate5/system.json');
        var getModelVersionUrl=Utils.getUrl('GET', 'o2o', '/oasis/oasis-rest-dev-version/restdev/o2oportal/getModelVersion', '/init/versionupdate5/get_model_version.json');
        var getUpdateStatusUrl=Utils.getUrl('POST', '', '/base/getAllUpdateStatus', '/init/versionupdate5/get_update_status.json');
        var updateFlagUrl=Utils.getUrl('GET', '', '/devmonitor/upgradeflag','/init/versionupdate5/get_update_status.json');
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
        $scope.updateVersion=function(){
            $http({
                url: systemUrl.url,
                method: systemUrl.method,
                params: {'devSN': $scope.sceneInfo.sn}
            }).success(function(data){
                //console.log(data);
                if(data.devSoftVersion==undefined||data.devHardVersion==undefined){
                    $scope.curVersion="Ain't get any system version info,please make sure your access to the internet";
                }else{
                    $http({
                        url:updateFlagUrl.url,
                        method:updateFlagUrl.method,
                        params: {'devSN': $scope.sceneInfo.sn}
                    }).success(function(aData){
                        if(aData.upgradeable==0){ 
                            $scope.showHide.upgradeflag=0;
                            SPVersion=aData.lowestSpVerion;
                            LTVersion=aData.lowestLTVerion;
                            $("#version_num").tooltip({
                                animation:true,
                                placement:"right",
                                trigger:"hover",
                                title:getRcString("version_Dev")+" "+SPVersion+" "+getRcString("HUO")+" "+LTVersion,
                                template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="max-width:500px;"></div></div>'
                            });
                            $scope.curVersion=data.devSoftVersion + ', ' + data.devHardVersion+'，'+getRcString("version_INFO");
                        }else if(aData.upgradeable==1){
                            $scope.showHide.upgradeflag=1;
                            $scope.curVersion = data.devSoftVersion + ', ' + data.devHardVersion;
                        }
                        console.log(data);
                    }).error(function(){});
                }
                /*if(data.devSoftVersion !== undefined && data.devHardVersion !== undefined) {
                    $scope.curVersion = data.devSoftVersion + ', ' + data.devHardVersion;
                }*/
                $scope.getVersionList(data);
            }).error(function(){});
        };     
        $scope.getVersionList=function(DevData){
            var model1=DevData.devMode;
            if( model1.indexOf("H3C")>=0) {
                model1 = model1.split("H3C")[1].trim();
            }
            /*$http.get('../../init/versionupdate5/get_model_version.json').success(function(data) {
                if (data.error_code == 0) {
                    console.log(data);
                    $scope.getUpdateProgress(DevData, data);
                }
            }).error(function(){});*/
            $http({
                url: getModelVersionUrl.url,
                method: getModelVersionUrl.method,
                params: {model: model1}
            }).success(function(data){
                if(data.error_code==0){
                    console.log(data);
                    $scope.getUpdateProgress(DevData,data);
                }
            }).error(function(){});
        };
        $scope.getUpdateProgress=function(DevData,versionList,g_ID,requestData,updateData){
            console.log(versionList);
            $http({
                url: getUpdateStatusUrl.url,
                method: getUpdateStatusUrl.method,
                data: {'devSN':dev_sn}
            }).success(function(data){
                    $scope.versionList(DevData,versionList,data);
            }).error(function(){});
        };
        $scope.versionList=function(DevData,versionList,ProgressData){
            if(DevData&&versionList) {
                //*��ʼ��slist*
                var  newestRelease = [];
                g_versionlist = [];
                g_versionNewArr = [];
                angular.forEach(versionList.data_list,function(aData,index){
                    var version ={};
                    version.size=(aData.size/(1024*1024)).toFixed(2);
                    version.type=getRcString("VERSION_TYPE").split(",")[aData.type];
                    version.version=aData.version;//ת����ͳһ��ʽ������
                    version.description=aData.description;
                    version.bkSize = aData.size;
                    version.url = aData.url;
                    version.percent  = 0;
                    version.publication_date = aData.publication_date;
                    /*if(aData.type == 1)
                    {
                        newestRelease.push(version);
                    }*/
                    g_versionlist.push(version);
                });
                console.log(g_versionlist);
               /* if(newestRelease.length > 0)
                {
                    var newVersion = newestRelease.sort()[newestRelease.length-1];
                    g_versionNewArr.push(newVersion);
                }*/
                if(g_versionlist.length==0){
                    g_versionNewArr=g_versionlist[0];
                }else{
                    g_versionNewArr.push(g_versionlist[0]);
                }
                console.log($scope.version);
                $scope.isCheck=true;
                if($scope.version==0){
                    $scope.$broadcast('load#deVersion',g_versionNewArr);
                }else{
                    $scope.$broadcast('load#deVersion',g_versionlist);
                }
                //$scope.refreshVeisionList(DevData,versionList.data_list,data);
            }
            if(ProgressData.message[0].status!=0){
                $scope.btnToggle();
            }else{
                $alert.msgDialogSuccess(getRcString("Versioning"));
                getProgress();
            }
        };
        $scope.btnToggle=function(){
            function btnVersion() {
                $scope.$broadcast('getSelections#deVersion', function (data) {
                    $scope.$apply(function () {
                        if($scope.showHide.upgradeflag==0){
                            $scope.isCheck=true;
                        }else{
                            $scope.isCheck = data.length < 1;
                        }
                    });
                });
            }
            $scope.$on('check.bs.table#deVersion', function(e,row, $element,field){
                btnVersion();
                requestData.devVersionUrl=row.url;
                requestData.fileSize=row.bkSize;
                requestData.updateVersion=row.version;
                console.log(row);
            });
            $scope.$on('uncheck.bs.table#deVersion', btnVersion);
        };
        $scope.deviceVersion_table={
            tId:"deVersion",
            //pageSize   : 5,
            //pageList   : [5,10],
            clicktoSelect:true,
            showPageList:false,
            searchable: true,
            showCheckBox: true,
            singleSelect: true,
            columns: [
                {
                    sortable: true,
                    field: 'version',
                    title:tableHead[0] ,
                    searcher: {type: "text"}
                },
                {
                    sortable: true,
                    field: 'type',
                    title:tableHead[1] ,
                    searcher: {type: "text"}
                },
                {
                    sortable: true,
                    field: 'publication_date',
                    title:tableHead[2] ,
                    searcher: {type: "text"}
                },
                {
                    sortable: true,
                    field: 'description',
                    title:tableHead[3] ,
                    searcher: {type: "text"}
                },
                {
                    sortable: true,
                    field: 'size',
                    title:tableHead[4] ,
                    searcher: {type: "text"}
                },
                {
                    sortable: true,
                    field: 'percent',
                    title:tableHead[5] ,
                    searcher: {type: "text"},
                    formatter: function(value, row, index) {
                        var percentStatus="";
                        if (value == 0) {
                            return  percentStatus = getRcString("PERCENT");
                        }else if(value<=100&&g_number==0){
                            if(value==100){
                                //debugger
                                g_number=1;
                            }
                            var reg=/\s*/g;
                            var _id=row.version;
                            if(reg.test(_id)){
                                var attr=row.version.split(" ");
                                console.log(attr.length);
                                _id=attr[attr.length-1];
                                console.log(_id);
                            }else{
                                _id=row.version
                            }
                            console.log(_id);
                            return '<div class="progress" style="height:15px;line-height: 15px;margin-bottom: 0;">' +
                                 '<div class="progress-bar" id="' + _id + '" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:'+width+'%;">'
                                   +'<span id="progressNumber" style="text-align:center;"></span>' +'</div>' +'</div>';
                        }else if(value==100&&g_number==1){
                                return '<div>'+getRcString('MESSAGE')+'</div>';
                        }
                    }
                }
            ]
            //data:[{"version":"7.1.064 C5117P11","type":"2","publication_date":"2016-05-10","description":"小贝粉丝第六版","size":"109.38","percent":"0"}]
        };
        $scope.updateVersion();
        //uptade modal
        $scope.update = {
            options: {
                mId: 'update',
                title: getRcString("SELECT"),
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                modalSize: 'lg',
                showHeader: true,
                showFooter: true,
                searchable: true,
                okHandler: function (modal, $ele) {
                    console.log($scope.updateType.versionType);
                    if($scope.updateType.versionType == "1")
                    {
                        requestData.saveConfig = 0;
                        requestData.rebootDev = 0;
                    }else if($scope.updateType.versionType == "2"){
                        requestData.saveConfig = 0;
                        requestData.rebootDev = 1;
                    }else if($scope.updateType.versionType == "3"){
                        requestData.saveConfig = 1;
                        requestData.rebootDev = 1;
                    }
                    getDeviceSpace(requestData);
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        };
        $scope.updateDeviceModal=function(){
            $scope.updateType.versionType="";
            $scope.$broadcast('show#update');
            $scope.$broadcast('disabled.ok#update');
        };
        //点击摸态框中确认按钮执行的事件
         getDeviceSpace=function(flag){
            var getSpaceUrl=Utils.getUrl('GET', '', '/devmonitor/app/system', '/init/versionupdate5/update_device.json');
            $http({
                url: getSpaceUrl.url,
                method: getSpaceUrl.method,
                params:{
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function(data){
                console.log(data.diskRemain);
                var bSize=requestData.fileSize*2;
                if(data.diskRemain>bSize){
                    updateDevice(flag);
                }else{
                    $alert.msgDialogError(getRcString("VERSION_ERROR"));
                }
            }).error(function(){});
        };

        updateDevice=function(params){
            var updateDeviceUrl=Utils.getUrl('POST', '', '/base/updateDevices', '/init/versionupdate5/update_device.json');
            $http({
                url: updateDeviceUrl.url,
                method: updateDeviceUrl.method,
                data:{
                    param:[{
                        'devSN': $scope.sceneInfo.sn,
                        fileSize:params.fileSize,
                        devVersionUrl:params.devVersionUrl,
                        saveConfig:params.saveConfig,
                        rebootDev:params.rebootDev,
                        softwareVersion:params.updateVersion
                    }]
                } 
            }).success(function(data){
                if(data.retCode==0){
                    if(data.message[0].retCode == 0) {
                        $alert.msgDialogSuccess(getRcString('VERSION_BEGIN'));
                        getProgress();
                        $scope.$on('check.bs.table#deVersion', function(){
                            $scope.$broadcast('getSelections#deVersion', function (data) {
                                $scope.$apply(function () {
                                    $scope.isCheck = true;
                                });
                            })
                        });
                    }else if(data.message[0].retCode==1){
                        $alert.msgDialogError(VERSION_FAIL[0]);
                    }else if(data.message[0].retCode==2){
                        $alert.msgDialogError(VERSION_FAIL[1]);
                    }else if(data.message[0].retCode==3){
                        $alert.msgDialogError(VERSION_FAIL[2]);
                    }else{
                        $alert.msgDialogError(VERSION_FAIL[3]);
                    }
                }else if(data.retCode==-1){
                    $alert.msgDialogError(VERSION_FAIL[3]);
                }
            }).error(function(data){});
        };

        getProgress=function(){
            g_getDevStatus=setInterval(function(){refershProgress()},6000);
        };
        refershProgress=function(){
            if(g_getDevStatus) {
                console.log("ddddddddd");
                $http({
                    url: getUpdateStatusUrl.url,
                    method: getUpdateStatusUrl.method,
                    data: {'devSN':dev_sn}
                }).success(function (data) {
                    if(data.retCode==0){
                        if ($scope.version == 0) {
                            $.each(g_versionNewArr, function (key, value) {
                                if (g_versionNewArr[key].url == data.message[0].devVersionUrl) {
                                    g_versionNewArr[key].percent = data.message[0].percent;
                                    flag=key;
                                    //console.log(g_versionNewArr[key].version);
                                    $scope.setID(g_versionNewArr[key].version);
                                    if (data.message[0].status == 0) {                                   
                                        $scope.$broadcast('load#deVersion', g_versionNewArr);
                                        width = data.message[0].percent;
                                        $("#" + g_ID).css("width", width + "%");
                                        //$("#"+g_ID).children("span").html(width+"%");
                                        $("#progressNumber").html(width + "%");
                                        $scope.$broadcast('refresh#deVersion', {});
                                        $scope.isCheck = true;
                                    }
                                }                              
                            });
                            if (data.message[0].status != 0) {
                                if (data.message[0].status == 1) {
                                    $alert.msgDialogSuccess(getRcString('VERSION_SUCESS'));
                                } else if (data.message[0].status == 2) {
                                    $alert.alert(VER_ERROR[0]);
                                } else if (data.message[0].status == 3) {
                                    $alert.alert(VER_ERROR[1]);
                                } else if (data.message[0].status == 4) {
                                    $alert.alert(VER_ERROR[2]);
                                } else if (data.message[0].status == 5) {
                                    $alert.alert(VER_ERROR[3]);
                                } else if (data.message[0].status == 6) {
                                    $alert.alert(VER_ERROR[4]);
                                } else if (data.message[0].status == 7) {
                                    $alert.alert(VER_ERROR[5]);
                                }
                                g_versionNewArr[flag].percent = 0;
                                g_number=0;
                                clearInterval(g_getDevStatus);
                                g_getDevStatus = undefined;
                                //$scope.isCheck = false;
                                $scope.btnToggle();
                                $scope.$broadcast('load#deVersion', g_versionNewArr);
                            }   
                        } else {                       
                            $.each(g_versionlist, function (key, value) {
                                 if (g_versionlist[key].url == data.message[0].devVersionUrl) {
                                    g_versionlist[key].percent = data.message[0].percent;
                                    flag=key;
                                    //console.log(g_versionlist[key].version);
                                    $scope.setID(g_versionlist[key].version);
                                    if (data.message[0].status == 0) {                                  
                                        $scope.$broadcast('load#deVersion', g_versionlist);
                                        //debugger
                                        width = data.message[0].percent;
                                        $("#" + g_ID).css("width", width + "%");
                                        //$("#"+g_ID).children("span").html(width+"%");
                                        $("#progressNumber").html(width + "%");
                                        console.log($("#progressNumber"));
                                        $scope.$broadcast('refresh#deVersion', {});
                                        $scope.isCheck = true;
                                    }
                                }                               
                            });
                            if (data.message[0].status != 0) {
                                //debugger
                                $scope.$broadcast('load#deVersion', g_versionlist);
                                if (data.message[0].status == 1) {
                                    $alert.msgDialogSuccess(getRcString('VERSION_SUCESS'));
                                } else if (data.message[0].status == 2) {
                                    $alert.alert(VER_ERROR[0]);
                                } else if (data.message[0].status == 3) {
                                    $alert.alert(VER_ERROR[1]);
                                } else if (data.message[0].status == 4) {
                                    $alert.alert(VER_ERROR[2]);
                                } else if (data.message[0].status == 5) {
                                    $alert.alert(VER_ERROR[3]);
                                } else if (data.message[0].status == 6) {
                                    $alert.alert(VER_ERROR[4]);
                                } else if (data.message[0].status == 7) {
                                    $alert.alert(VER_ERROR[5]);
                                }
                                g_versionlist[flag].percent = 0;
                                g_number=0;
                                clearInterval(g_getDevStatus);
                                g_getDevStatus = undefined;
                                //$scope.isCheck = false;
                                $scope.btnToggle();
                                $scope.$broadcast('load#deVersion', g_versionlist);
                            }               
                        }
                    }
                }).error(function () {});
            }
        };
        //设置id值
        $scope.setID=function(progressID){
            var reg=/\s*/g;
            g_ID=progressID;
            if(reg.test(g_ID)){
                var attr=progressID.split(" ");
                console.log(attr.length);
                g_ID=attr[attr.length-1];
            }else{
                g_ID=progressID;
            }
        };
        //模态框中点击单选按钮执行的事件
        $scope.checked=function(){
                console.log($scope.updateType.versionType);
                if($scope.updateType.versionType){
                    $scope.$broadcast('enable.ok#update');
                }else{
                    $scope.$broadcast('disabled.ok#update');
                }
        };
        //离线下载函数
        $scope.offDownload=function(){
            console.log(requestData.devVersionUrl);
            window.location.href=requestData.devVersionUrl;
        };
    }];
});
