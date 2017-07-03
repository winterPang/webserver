define(['utils','bsTable'], function(Utils,$) {
    return  ['$scope', '$http','$state','$alertService','$rootScope','$interval', function ($scope, $http,$state,$alert,$rootScope,$interval) {
        function getRcString(attrName){
            return Utils.getRcString("ws_ssid_rc",attrName);
        }
        var g_stName = "";
        var g_addSsidName = "";
        var g_addPwd = "";
        var g_addSsidInfo = "";
        var g_AuthCfg = "";
        var g_themeCfg = "";
        var g_pubmngInfo = "";
        var g_authInfo = "";
        var getssidinfobriefUrl = Utils.getUrl('GET','','/ssidmonitor/getssidinfobrief?devSN='+$scope.sceneInfo.sn+'&ownerName='
            +$scope.userInfo.user+'&nasId='+$scope.sceneInfo.nasid,'/init/serviceconfig5/infobrief.json');
        var ssidUpdateUrl = Utils.getUrl('POST','','/ant/confmgr','/init/serviceconfig5/infobrief.json');
        var getSupportModelUrl = Utils.getUrl('GET','','/apmonitor/getapmodellist?devSN='+$scope.sceneInfo.sn,'/init/serviceconfig5/infobrief.json');

        queryAuth();

        //查询认证模板
        function queryAuth()
        {
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/authcfg/query',
                method:"GET",
                params:{
                    storeId:$scope.sceneInfo.nasid,
                }
            }).success(function(data){
                g_authInfo = data.data;
                var authTemNames=[];
                for(var i=0,len=data.data.length;i<len;i++)
                {
                    authTemNames.push(data.data[i].authCfgTemplateName);
                }
                $scope.authTemplates = authTemNames;
                g_AuthCfg = $scope.authTemplates[0];
                queryTheme();
            }).error(function(err){
            });
        }

        //查询页面模板
        function queryTheme()
        {
            $http({
                //2017/6/12 新增页面模板 前端配合修改 '/v3/ace/oasis/auth-data/restapp/o2oportal/themetemplate/query'
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pagetemplate/queryAllData',
                method:"GET",
                params:{
                    storeId:$scope.sceneInfo.nasid,
                }
            }).success(function(data){
                console.log(data);
                var themeData = []
                var themeNames=[];
                for(var i=0,len = data.data.length;i<len;i++){
                    var themeObj = {};
                    themeObj.themeType = data.data[i].themeType;
                    if(data.data[i].themeType == 1)
                    {
                        themeObj.themeName = data.data[i].themeName+getRcString("brief");
                        themeObj.themeNameParam = data.data[i].themeName;
                    }
                    else if(data.data[i].themeType == 2)
                    {
                        themeObj.themeName = data.data[i].themeName+getRcString("sky");
                        themeObj.themeNameParam = data.data[i].themeName;
                    }
                    else if(data.data[i].themeType == 3)
                    {
                        themeObj.themeName = data.data[i].themeName+getRcString("vitallity");
                        themeObj.themeNameParam = data.data[i].themeName;
                    }
                    themeData.push(themeObj);
                }
                $scope.pageTemplates = themeData;
                g_themeCfg = $scope.pageTemplates[0];
                queryPub();
            }).error(function(err){
            });
        }

        //查询发布管理
        function queryPub()
        {
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/query',
                method:"GET",
                params:{
                    nasId:$scope.sceneInfo.nasid,
                }
            }).success(function(data){
                g_pubmngInfo = data.data;
                console.log(data);
                refreshTable();
            }).error(function(err){
            });
        }
        //重置form

        $scope.template = {
            addSsidName:"",
            addPwd:2,
            continueCfg:2,
            isHideSsid:0,
        }
        $scope.$on('hidden.bs.modal#template', function () {
            $scope.template = {
                addSsidName:"",
                addPwd:2,
                continueCfg:2,
                isHideSsid:0,
            }
            $scope.pwd = false;
            $scope.ssidForm.$setPristine();
            $scope.ssidForm.$setUntouched();
        });

        /************************** 添加SSID **********************/
        //添加按钮
        $scope.addSsidCfg = function () {
            $scope.template={
                addPwd:2,
                continueCfg:2,
                isHideSsid:0,
            };
            $scope.$broadcast('show#template');
        }

        $scope.cancel = function(){
            $scope.$broadcast('hide#template');
        }

        //无线服务模态框
        $scope.templateOption={
                mId:'template',
                title:getRcString("ADD_TITLE").split(",")[0],
                autoClose: false,
                showCancel: true,
                showHeader: true,
                showFooter: false,
                buttonAlign: "center",
                modalSize:'lg',
                okHandler: function(modal,$ele){
            },
            cancelHandler: function(modal,$ele){
            },
            beforeRender: function($ele){
                return $ele;
            }
        }

        //获取设备支持的AP  supportModelArr
        $scope.getSupportModel = function()
        {
            $http({
                url:getSupportModelUrl.url,
                method:getSupportModelUrl.method
            }).success(function(data){
                if(data.apModelList.length > 0){
                    var supportModelArr = data.apModelList;
                    getApModel(supportModelArr);
                }
                else
                {
                    $alert.msgDialogError(getRcString("NO_support"),"error");
                }
            }).error(function(err){
                console.log(err);
            });
        }

        //AP组下配置ApModel
        function getApModel(supportModelArr)
        {
            var paramArr =[];
            if(supportModelArr)
            {
                angular.forEach(supportModelArr,function(item,index,array){
                    var paramObj = {};
                    paramObj.apGroupName = "default-group";
                    paramObj.apModel = item.apmodel;
                    paramArr.push(paramObj);
                });
            }
            var reqData = {
                devSN : $scope.sceneInfo.sn,
                configType : 0,
                cloudModule : "apmgr",
                deviceModule : "apmgr",
                method : "AddApGroupModel",
                param : [
                    {apGroupName:"default-group", apModel:"WTU430"},
                    {apGroupName:"default-group", apModel:"WAP712"},
                    {apGroupName:"default-group", apModel:"WAP722"},
                    {apGroupName:"default-group", apModel:"WAP722E"},
                    {apGroupName:"default-group", apModel:"WAP722S"},
                    {apGroupName:"default-group", apModel:"WAP712C"}
                ]
            };
            if(paramArr.length > 0)
            {
                reqData.param = paramArr;
            }
            $http({
                url:ssidUpdateUrl.url,
                method:ssidUpdateUrl.method,
                data:reqData
            }).success(function(data){
                if(data.communicateResult == "fail")
                {
                    //hPending.close(100);
                    $alert.msgDialogError(getRcString("LINK"),'error');
                    return;
                }
                var i = 0 ;
                angular.forEach(data.deviceResult,function(item,index,array){
                    if(item.result&& item.result == "success"){
                        i++;
                    }
                })
                if(i == 0)
                {
                    $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                    return;
                }
                if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
                {
                    ssidUpdate(supportModelArr);
                }
                else
                {
                    $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                    return;
                }
            }).error(function(err){
                onsole.log(err);
                $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
            });
        }

        //添加SSID
        function ssidUpdate(supportModelArr)
        {
            $alert.msgDialogSuccess(getRcString("CFG_add_senting"));
            g_stName = "st"+"_"+(""+Math.random()).substring(2);
            g_addSsidName = $scope.template.addSsidName;
            g_addPwd = $scope.template.addPwd;
            var continueCfg = $scope.template.continueCfg;
            var reqData = {};
            if($scope.template.addPwd == 1)
            {
                reqData = [{
                    stName: g_stName,
                    description:"3",
                    status: 1,
                    akmMode: 1,
                    cipherSuite: 20,
                    securityIE: 3,
                    psk: $scope.template.addPwdValue,
                    ssidName: g_addSsidName,
                    hideSSID:Number($scope.template.isHideSsid),
                }]
            }
            else
            {
                reqData = [{
                    stName: g_stName,
                    description:"3",
                    status: 1,
                    akmMode: 0,
                    cipherSuite: 0,
                    securityIE: 0,
                    psk: "",
                    ssidName: g_addSsidName,
                    hideSSID:Number($scope.template.isHideSsid),
                }]
            }
            $http({
                url:ssidUpdateUrl.url,
                method:ssidUpdateUrl.method,
                data:{
                    devSN:$scope.sceneInfo.sn,
                    configType:0,
                    cloudModule:"stamgr",
                    deviceModule:"stamgr",
                    method:"SSIDUpdate",
                    param:reqData
                }
            }).success(function(data){
                if(data.communicateResult == "fail" )
                {
                    $alert.msgDialogError(getRcString("LINK"),'error');
                    return;
                }
                if(data.deviceResult[0].result == "fail")
                {
                    $alert.msgDialogError(getRcString("ADD_Limit"),'error');
                    return;
                }
                if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
                {
                    portalEnable(supportModelArr,continueCfg,g_stName);
                }
                else
                {
                    $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                    return;
                }
            }).error(function(err){
                console.log(err);
                $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
            });
        }

        //使能云端认证
        function portalEnable(supportModelArr,continueCfg,stName)
        {
            var reqData = {
                devSN : $scope.sceneInfo.sn,
                configType : 0,
                cloudModule : "portal",
                deviceModule : "portal",
                method : "setSimpleConfig",
                param :
                    [{
                        stname:stName,
                        enable:1,
                        webserver:"lvzhou-server",
                        domain:"cloud"
                    }]
            };
            $http({
                url:ssidUpdateUrl.url,
                method:ssidUpdateUrl.method,
                data:reqData
            }).success(function(data){
                if(data.communicateResult == "fail" )
                {
                    $alert.msgDialogError(getRcString("LINK"),'error');
                    return;
                }
                var i = 0 ;
                angular.forEach(data.deviceResult,function(item,index,array){
                    if(item.result&& item.result == "success"){
                        i++;
                    }
                })
                if(i == 0){
                    $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                    return;
                }
                if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
                {
                    bingSSIDByAPgroup(supportModelArr,continueCfg,stName);
                }
                else
                {
                    $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                    return;
                }
            }).error(function(err){
                $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                console.log(err);
            })
        }

        //绑定SSID到"AP组"
        function bingSSIDByAPgroup(supportModelArr,continueCfg,stName)
        {
            var paramArr =[];
            if(supportModelArr)
            {
                angular.forEach(supportModelArr,function(item,index,array) {
                    var paramObj_1 = {};
                    var paramObj_2 = {};
                    paramObj_1.apGroupName = "default-group";
                    paramObj_1.apModelName = item.apmodel;
                    paramObj_1.radioId = 1;
                    paramObj_1.stName = stName;
                    //paramObj_1.vlanId  =  1;
                    paramObj_2.apGroupName = "default-group";
                    paramObj_2.apModelName = item.apmodel;
                    paramObj_2.radioId = 2;
                    paramObj_2.stName = stName;
                    //paramObj_2.vlanId  =  1;

                    paramArr.push(paramObj_1);
                    paramArr.push(paramObj_2);
                });
            }
            var reqData = {
                devSN : $scope.sceneInfo.sn,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSIDBindByAPGroup",
                param :[
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   1,
                        stName       :   stName,
                        vlanId:1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   1,
                        stName       :   stName,
                        vlanId:1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   2,
                        stName       :   stName,
                        vlanId:1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   2,
                        stName       :   stName,
                        vlanId:1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722E",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722E",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722S",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722S",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712C",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712C",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    }
                ]
            };
            if(paramArr.length > 0)
            {
                reqData.param = paramArr;
            }
            $http({
                url:ssidUpdateUrl.url,
                method:ssidUpdateUrl.method,
                data:reqData
            }).success(function(data){
                if(data.communicateResult == "fail")
                {
                    $alert.msgDialogError(getRcString("LINK"),'error');
                    return;
                }
                var i = 0 ;
                angular.forEach(data.deviceResult,function(item,index,array){
                    if(item.result&& item.result == "success"){
                        i++;
                    }
                })
                if(i == 0){
                    $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                    return;
                }
                if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
                {
                    addSynSSID(continueCfg);
                }
                else
                {
                    $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                    return;
                }
            }).error(function(){
                $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                console.log(err);
            })
        }

        //添加页面时同步到设备
        function addSynSSID(continueCfg)
        {
            var reqData = {
                devSN:$scope.sceneInfo.sn,
                module : "stamgr",
                method : "SyncSSIDList",
                configType:0,
                cloudModule:"stamgr",
                deviceModule:"stamgr",
                param:[{}]
            }
            $http({
                url:ssidUpdateUrl.url,
                method:ssidUpdateUrl.method,
                data:reqData
            }).success(function(data){
                if(data.communicateResult == "fail")
                {
                    $alert.msgDialogError(getRcString("LINK"),'error');
                    return;
                }
                var i = 0 ;
                angular.forEach(data.deviceResult,function(item,index,array){
                    if(item.result&& item.result == "success"){
                        i++;
                    }
                })
                if(i == 0){
                    $alert.msgDialogError(getRcString("ADD_FAIL"),'error');
                    return;
                }
                if(data.result == "success" && data.serviceResult == "success")
                {
                    if(data.errCode=="0")
                    {
                        if(continueCfg)
                        {
                            if(continueCfg == "1")
                            {
                                $scope.$broadcast('hide#template',$scope);
                                $alert.msgDialogSuccess(getRcString("ADD_SUCCESS"));
                                queryAuth();
                            }
                            else
                            {
                                $scope.addAuthCfg = {
                                    addAuthenType: "AT1"
                                }
                                $scope.addAuthCfg.addAuthCfgList = g_AuthCfg;
                                $scope.addAuthCfg.addLoginPageList = g_themeCfg;
                                $scope.$broadcast('hide#template',$scope);
                                $scope.$broadcast('show#addAuthCfg',$scope);
                            }
                        }
                        else
                        {
                            queryAuth();
                        }
                    }
                    else
                    {
                        if(continueCfg)
                        {
                            $alert.msgDialogError(getRcString("add_service"),'error');
                        }
                        else
                        {
                            $alert.msgDialogError(getRcString("SYN_FAIL"),'error');
                        }
                    }
                }
            }).error(function(err){
                $alert.msgDialogError(getRcString("SYN_FAIL"),'error');
                console.log(err);
            })
        }

      
        //认证配置 模态框
        $scope.addAuthCfgOpt={
            mId:'addAuthCfg',
            title:getRcString("ADD_WifiSerAuth").split(",")[0],
            autoClose: true,
            showCancel: true,
            showHeader: true,
            showFooter: true,
            buttonAlign: "center",
            modalSize:'lg',
            okHandler: function(modal,$ele){
                addPub();
            },
            cancelHandler: function(modal,$ele){
                queryAuth();
            },
            beforeRender: function($ele){
                return $ele;
            }
        }

        //添加发布模板
        function addPub()
        {
            if($scope.addAuthCfg.addAuthenType == "AT1")
            {
                $alert.msgDialogSuccess(getRcString("ADD_SUCCESS"));
                queryAuth();
                return;
            }
            var ssidIDOpt = {};
            for(var i= 0;i<g_addSsidInfo.length;i++){
                if(g_addSsidInfo[i].stName == g_stName){
                    ssidIDOpt.ssidId = g_addSsidInfo[i].ssid;
                }
            }
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/addbyv3flag',
                method:'POST',
                data:{
                    nasId:$scope.sceneInfo.nasid,
                    name:g_stName,
                    ownerName:$scope.userInfo.user,
                    ssidIdV3:$scope.sceneInfo.sn+g_stName,
                    ssidName:g_addSsidName,
                    authCfgName:$scope.addAuthCfg.addAuthCfgList,
                    themeTemplateName:$scope.addAuthCfg.addLoginPageList.themeNameParam,
                    themeType:$scope.addAuthCfg.addLoginPageList.themeType,
                }
            }).success(function(data){
                if(data.errorcode == 0){
                    $alert.msgDialogSuccess(getRcString("ADD_SUCCESS"));
                    addSynSSID();
                }
                else
                {
                    queryAuth();
                    $alert.msgDialogError(getRcString("add_service"),'error');
                }

            }).error(function(err){
                console.log(err);
                $alert.msgDialogError(getRcString("add_service"),'error');
            });
        }

        /******* 同步 *******/
        //同步按钮
        $scope.syn_ssid = getRcString("syn");
        $scope.synSSID = function()
        {
            var reqData = {
                devSN:$scope.sceneInfo.sn,
                module : "stamgr",
                method : "SyncSSIDList",
                configType:0,
                cloudModule:"stamgr",
                deviceModule:"stamgr",
                param:[{}]
            }
            $http({
                url:ssidUpdateUrl.url,
                method:ssidUpdateUrl.method,
                data:reqData
            }).success(function(data){
                if(data.communicateResult == "fail")
                {
                    $alert.msgDialogError(getRcString("LINK_syn"),'error');
                    return;
                }
                var i = 0 ;
                angular.forEach(data.deviceResult,function(item,index,array){
                    if(item.result&& item.result == "success"){
                        i++;
                    }
                })
                if(i == 0){
                    $alert.msgDialogError(getRcString("SYN_FAIL"),'error');
                    return;
                }
                if(data.result == "success" && data.serviceResult == "success")
                {
                    if(data.errCode=="0")
                    {
                        $alert.msgDialogSuccess(getRcString("syn_suc"));
                        queryAuth();
                        synSsidDisable();
                    }
                    else
                    {
                        $alert.msgDialogError(getRcString("SYN_FAIL"),'error');
                    }
                }
            }).error(function(){
                $alert.msgDialogError(getRcString("SYN_FAIL"),'error');
                console.log(err);
            })
        }

        //同步按钮置灰30s
        function synSsidDisable()
        {
            $scope.isDisable = true;
            var i = 30;
           var time = $interval(function(){
                $scope.syn_ssid = i+getRcString("second");
                if(i == 0)
                {
                    $interval.cancel(time);
                    $scope.isDisable = false;
                    $scope.syn_ssid = getRcString("syn");
                    return;
                }
                i--;
            },1000)
        }

        /*********************************** 删除SSID ******************************/


        //删除SSID
        //获取设备支持的AP  supportModelArr
        function getSupportModelRe(e,row,$btn)
        {
            $http({
                url:getSupportModelUrl.url,
                method:getSupportModelUrl.method
            }).success(function(data){
                if(data.apModelList.length > 0){
                    var supportModelArr = data.apModelList;
                    SSIDUnbindByAPGroup(row,supportModelArr)
                }
                else
                {
                    $alert.msgDialogError(getRcString("NO_support"),"error");
                }
            }).error(function(err){
                console.log(err);
            });
        }

        //将SSID从AP组中解绑
        function SSIDUnbindByAPGroup(row,supportModelArr)
        {
            var stName = row.stName;
            var paramArr =[];
            if(supportModelArr)
            {
                angular.forEach(supportModelArr,function(item,index,array) {
                    var paramObj_1 = {};
                    var paramObj_2 = {};
                    paramObj_1.apGroupName = "default-group";
                    paramObj_1.apModelName = item.apmodel;
                    paramObj_1.radioId = 1;
                    paramObj_1.stName = stName;
                    //paramObj_1.vlanId  =  1;
                    paramObj_2.apGroupName = "default-group";
                    paramObj_2.apModelName = item.apmodel;
                    paramObj_2.radioId = 2;
                    paramObj_2.stName = stName;
                    //paramObj_2.vlanId  =  1;

                    paramArr.push(paramObj_1);
                    paramArr.push(paramObj_2);
                });
            }
            var reqData = {
                devSN : $scope.sceneInfo.sn,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSIDUnbindByAPGroup",
                param :[
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   1,
                        stName       :   stName,
                        vlanId:1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   1,
                        stName       :   stName,
                        vlanId:1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   2,
                        stName       :   stName,
                        vlanId:1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   2,
                        stName       :   stName,
                        vlanId:1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722E",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722E",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722S",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722S",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712C",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712C",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    }
                ]
            };
            if(paramArr.length > 0)
            {
                reqData.param = paramArr;
            }
            $http({
                url:ssidUpdateUrl.url,
                method:ssidUpdateUrl.method,
                data:reqData
            }).success(function(data){
                if(data.communicateResult == "fail")
                {
                    $alert.msgDialogError(getRcString("LINK_delete"),'error');
                    return;
                }
                var i = 0 ;
                angular.forEach(data.deviceResult,function(item,index,array){
                    if(item.result&& item.result == "success"){
                        i++;
                    }
                })
                if(i == 0){
                    $alert.msgDialogError(getRcString("DEL_FAIL"),'error');
                    return;
                }
                if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
                {
                    SSIDDelete(row,stName);
                }
                else
                {
                    $alert.msgDialogError(getRcString("DEL_FAIL"),'error');
                    return;
                }
            }).error(function(err){
                console.log(err);
                $alert.msgDialogError(getRcString("DEL_FAIL"),'error');
            });
        }

        //删除SSID
        function SSIDDelete(row,stName)
        {
            $http({
                url:ssidUpdateUrl.url,
                method:ssidUpdateUrl.method,
                data:{
                    devSN:$scope.sceneInfo.sn,
                    configType:0,
                    cloudModule:"stamgr",
                    deviceModule:"stamgr",
                    method:"SSIDDelete",
                    param:[
                        {stName:stName}
                    ]
                }
            }).success(function(data){
                if(data.communicateResult == "fail")
                {
                    //hPending.close(100);
                    $alert.msgDialogSuccess(getRcString("LINK_delete"));
                    //Utils.Base.refreshCurPage();
                    return;
                }
                var i = 0 ;
                angular.forEach(data.deviceResult,function(item,index,array){
                    if(item.result&& item.result == "success"){
                        i++;
                    }
                })
                if(i == 0){
                    $alert.msgDialogSuccess(getRcString("DEL_FAIL"));
                    return;
                }
                if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
                {
                    $alert.msgDialogSuccess(getRcString("DEL_SUCCESS"));
                    delPublish(row);
                }
                else
                {
                    $alert.msgDialogSuccess(getRcString("DEL_FAIL"));
                    return;
                }
            }).error(function(err){
                $alert.msgDialogSuccess(getRcString("DEL_FAIL"));
                console.log(err);
            });
        }

        //删除发布管理
        function delPublish(row)
        {
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/deleteBySsidV3',
                method:"GET",
                contentType: "application/json",
                params:{
                    nasId:$scope.sceneInfo.nasid,
                    ssidV3:row.ssid
                }
            }).success(function(data){
                if(data.errorcode == 0)
                {
                    addSynSSID();
                }
                else
                {
                    addSynSSID();
                }

            }).error(function(err){
                addSynSSID();
            });
        }

        //刷数据bs-table
        $scope.serverTable={
            tId:'serverConfigTable',
       //     url:getssidinfobriefUrl.url,
            method:getssidinfobriefUrl.method,
            dataField:'ssidList',
            totalField:'ssidTotalCnt',
            pageSize : 10,
            showPageList: false,
            searchable: true,
            pagniation:true,
            clickToSelect: true,
            searchable: true,
            responseHandler:function(res){
                var adata=res.ssidList;
                g_stnames=[];
                var authTypeNum = "";
                for(var i=0,len=adata.length;i<len;i++){
                    g_stnames.push(adata[i].stName);
                    adata[i].lvzhouAuthMode="";
                    for(var j = 0; j<g_pubmngInfo.length; j++){
                        if(adata[i].ssid == g_pubmngInfo[j].ssidIdV3){
                            for(var k = 0; k<g_authInfo.length; k++){
                                if(g_pubmngInfo[j].authCfgName == g_authInfo[k].authCfgTemplateName){
                                    authTypeNum = g_authInfo[k].authType;
                                    adata[i].lvzhouAuthMode=getRcString("AUTHEN_TYPE").split(",")[authTypeNum]
                                }
                            }
                        }
                    }
                    if(adata[i].lvzhouAuthMode==""){
                        adata[i].lvzhouAuthMode=getRcString("AUTHEN_TYPE").split(",")[0]
                    }
                }
                return res;
            },
            columns:[
                {
                    sortable:true,
                    searcher:{type:"text"},
                    field:'ssidName',
                    title:getRcString('SSID_HEADER').split(",")[0]
                },
                {
                    sortable:true,
                    searcher:{type:"select",
                        valueField:"value",
                        textField:"text",
                        data:[
                            {value:getRcString("AUTHEN_TYPE").split(",")[0],text:getRcString("AUTHEN_TYPE").split(",")[0]},
                            {value:getRcString("AUTHEN_TYPE").split(",")[1],text:getRcString("AUTHEN_TYPE").split(",")[1]},
                            {value:getRcString("AUTHEN_TYPE").split(",")[2],text:getRcString("AUTHEN_TYPE").split(",")[2]},
                        ]},
                    field:'lvzhouAuthMode',
                    title:getRcString('SSID_HEADER').split(",")[1]
                },
            ],
            operateWidth: 240,
            operateTitle: "",
            operate:{},
            tips:{
                edit: getRcString("edit"),
                remove:getRcString("remove"),
            },
            icons: {
                edit:'fa fa-edit',
                remove:'fa fa-trash',
            },
        };

        function refreshTable()
        {
            $scope.$broadcast('refresh#serverConfigTable',{
                url:getssidinfobriefUrl.url
            });
        }

        //Click event - use password
        $scope.pwd=false;
        $scope.addPwdOn = function()
        {
            $scope.pwd = true;
        }
        $scope.addPwdOff= function()
        {
            $scope.pwd = false;
        }

        //Monitor SSID
        $scope.$watch("ssidForm.ssid_name.$viewValue", function (v) {
            $scope.template.addSsidName = v;
        });

        //Monitor SSID
        $scope.$watch("ssidForm.addPwdValue.$viewValue", function (v) {
            $scope.template.addPwdValue = v;
        });
        $scope.$watch("ssidForm.PwdValue.$viewValue", function (v) {
            $scope.template.addPwdValue = v;
        });

        //Hierarchical separation of powers
        $scope.$watch("permission",function(){

            $scope.$watch("serverTable",function(){
                if($scope.permission.write == true)
                {
                    $scope.serverTable.operate = {
                        edit:  function(e,row,$btn){
                            $state.go('^.wireless0_modify',{stname:row.stName});
                        },
                        remove:function(e,row,$btn){
                            $alert.confirm(getRcString("del_ssid"),
                                function () {
                                    getSupportModelRe(e,row,$btn);
                                },
                                function () {
                                }
                            );
                        },
                    }
                    $scope.serverTable.operateTitle = getRcString("operate")

                }
                else if($scope.permission.write == false)
                {
                    $scope.serverTable.operateTitle = "";
                    $scope.serverTable.operate = {
                    }
                }
                else
                {
                    console.error("permission getfailed");
                }
            });

        },true)

    }];
});