/**
 * Created by Administrator on 2016/11/16.
 */
define(['jquery','utils','bsTable'],function($scope,Utils) {
    return ['$scope', '$http','$state','$window','$stateParams','$alertService',function($scope,$http,$state,$window,$stateParams,$alert){
        function getRcString(attrName){
            return Utils.getRcString("ws_ssid_rc",attrName);
        }
        var g_ssidInfo = "";
        var g_AuthCfg = "";
        var g_themeCfg = "";
        var getssidlistUrl = Utils.getUrl('GET','','/ssidmonitor/getssidlist?devSN='+$scope.sceneInfo.sn,'/init/serviceconfig5/infobrief.json');
        var ssidUpdateUrl = Utils.getUrl('POST','','/ant/confmgr','/init/serviceconfig5/infobrief.json');


        $scope.return = function(){
            $window.history.back();
        }

        /**************** 页面初始化 ****************/
        queryAuth();
        //查询ssid
        function querySsid()
        {
            $http({
                url:getssidlistUrl.url,
                method:getssidlistUrl.method,
                params:{
                    stName:$stateParams.stname
                }
            }).success(function(data){
                g_ssidInfo = data.ssidList[0];
                $scope.template = {
                    ssid_name:g_ssidInfo.ssidName,
                    addPwd:g_ssidInfo.akmMode == 0 ? 2
                                                   : 1,
                    addPwdValue:"",
                    isHideSsid:Number(g_ssidInfo.hideSSID),
                }
                $scope.pwd = g_ssidInfo.akmMode == 0 ? false
                                                     : true;
                queryPub();
            }).error(function(){

            })
        }

        //查询发布管理
        function queryPub()
        {
            $http({
                url:"/v3/ace/oasis/auth-data/o2oportal/pubmng/queryBySsidV3/"+g_ssidInfo.ssid+"/"+$scope.sceneInfo.nasid,
                method:'GET',
            }).success(function(data){
                if(data.errorcode==0)
                {
                    var newThemeName = data.data.newThemeName;
                    var addLoginPageList = {};
                    var theme_type = newThemeName.charAt(newThemeName.length-1);
                    angular.forEach($scope.pageTemplates,function(v,k,array){
                        if(v.newThemeName == data.data.newThemeName)
                        {
                            addLoginPageList = v;
                        }
                    })
                    $scope.addAuthCfg = {
                        addAuthenType:"AT2",
                        addAuthCfgList:data.data.authCfgName,
                        addLoginPageList:addLoginPageList
                    }
                    $scope.oldAuthType = "AT2";
                    //$scope.addAuthCfg.addLoginPageList.themeName = data.data.themeTemplateName;
                }
                else if(data.errorcode==1307)
                {
                    $scope.addAuthCfg = {
                        addAuthenType:"AT1",
                        addAuthCfgList:g_AuthCfg,
                        addLoginPageList:g_themeCfg
                    }
                    $scope.oldAuthType = "AT1";

                }
            }).error(function(){

            })
        }

        //查询认证模板;
        function queryAuth()
        {
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/authcfg/query',
                method:"GET",
                params:{
                    storeId:$scope.sceneInfo.nasid,
                }
            }).success(function(data){
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
            //2017.6.12 因新页面模板修改借口url
            $http({
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
                        themeObj.newThemeName = data.data[i].newThemeName;
                    }
                    else if(data.data[i].themeType == 2)
                    {
                        themeObj.themeName = data.data[i].themeName+getRcString("sky");
                        themeObj.themeNameParam = data.data[i].themeName;
                        themeObj.newThemeName = data.data[i].newThemeName;
                    }
                    else if(data.data[i].themeType == 3)
                    {
                        themeObj.themeName = data.data[i].themeName+getRcString("vitallity");
                        themeObj.themeNameParam = data.data[i].themeName;
                        themeObj.newThemeName = data.data[i].newThemeName;
                    }
                    themeData.push(themeObj);
                }
                $scope.pageTemplates = themeData;
                g_themeCfg = $scope.pageTemplates[0];
                querySsid();
            }).error(function(err){
            });
        }

        /**************** 修改操作 **************/
        //新接口修改SSID
        $scope.updateSsidOne = function()
        {
            var reqData = {};
            if($scope.template.addPwdValue)
            {
                reqData = [{
                    stName: g_ssidInfo.stName,
                    akmMode: 1,
                    cipherSuite: 20,
                    securityIE: 3,
                    psk: $scope.template.addPwdValue,
                    hideSSID:Number($scope.template.isHideSsid),
            }]
            }
            else
            {
                reqData = [{
                    stName: g_ssidInfo.stName,
                    akmMode: 0,
                    cipherSuite: 0,
                    securityIE: 0,
                    psk: "",
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
                    method:"SSIDUpdateOne",
                    param:reqData
                }
            }).success(function(data){
                if(data.errCode==7 && data.reason == "stamgr data process method is unknown")
                {
                    //旧接口：密钥不允许为空
                    if(!$scope.template.addPwdValue)
                    {
                        $alert.msgDialogError(getRcString("shared_key_ziduan"),"error");
                        return;
                        //旧接口：可能丢配置
                    }
                    else
                    {
                        $alert.confirm(getRcString("LoseConfig"),function(){
                            updateSsidInfo();
                            return;
                        });
                    }
                }
                else
                {
                    if(data.errCode!=0)
                    {//新接口失败
                        $alert.msgDialogError(getRcString("modify_fail"),'error');
                        return;
                    }
                    else
                    {//新接口成功
                        operatePub();
                    }
                }
            }).error(function(err){
                console.log(err);
                $alert.msgDialogError(getRcString("modify_fail"),'error');
            });
        }

        //旧接口修改SSID
        function updateSsidInfo()
        {
            reqData = [{
                stName: g_ssidInfo.stName,
                description:"3",
                status: 1,
                akmMode: 1,
                cipherSuite: 20,
                securityIE: 3,
                psk: $scope.template.addPwdValue,
                ssidName: g_ssidInfo.ssidName,
                hideSSID:Number($scope.template.isHideSsid),
            }]
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
                    //hPending.close(100);
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
                    operatePub();
                }
                else
                {
                    $alert.msgDialogError(getRcString("modify_fail"),'error');
                    return;
                }
            }).error(function(err){
                console.log(err);
                $alert.msgDialogError(getRcString("modify_fail"),'error');
            });
        }

        function operatePub()
        {
            if($scope.oldAuthType == $scope.addAuthCfg.addAuthenType && $scope.oldAuthType == "AT1")
            {
                $alert.msgDialogSuccess(getRcString("modify_success"));
                $scope.return();
            }
            else
            {
                ($scope.addAuthCfg.addAuthenType == "AT1") ? delPublish()
                                                           : modifyPub()
            }

        }

        //修改发布管理
        function modifyPub()
        {
            var reqData = {
                nasId:$scope.sceneInfo.nasid,
                ssidIdV3:g_ssidInfo.ssid,
                ssidName:g_ssidInfo.ssidName,
                authCfgName:$scope.addAuthCfg.addAuthCfgList,
                themeTemplateName:$scope.addAuthCfg.addLoginPageList.themeNameParam,
                themeType:$scope.addAuthCfg.addLoginPageList.themeType,
            }
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/modifybyv3flag',
                method:'POST',
                data:reqData,
            }).success(function(data){
                if(data.errorcode=="1307"){
                    addPub();
                }else {
                    $alert.msgDialogSuccess(getRcString("modify_success"));
                    $scope.return();
                }
            }).error(function(response){
                $alert.msgDialogError(getRcString("modify_fail"),'error');
            });
        }

        //删除发布管理
        function delPublish()
        {
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/deleteBySsidV3',
                method:"GET",
                contentType: "application/json",
                params:{
                    nasId:$scope.sceneInfo.nasid,
                    ssidV3:g_ssidInfo.ssid
                }
            }).success(function(data){
                if(data.errorcode == 0)
                {
                    $alert.msgDialogSuccess(getRcString("modify_success"));
                    $scope.return();
                }
                else
                {
                    $alert.msgDialogError(getRcString("modify_fail"),'error');
                }

            }).error(function(err){
                $alert.msgDialogError(getRcString("modify_fail"),'error');
            });
        }

        //添加发布模板
        function addPub()
        {
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/addbyv3flag',
                method:'POST',
                data:{
                    nasId:$scope.sceneInfo.nasid,
                    name:g_ssidInfo.stName,
                    ownerName:$scope.userInfo.user,
                    ssidIdV3:g_ssidInfo.ssid,
                    authCfgName:$scope.addAuthCfg.addAuthCfgList,
                    themeTemplateName:$scope.addAuthCfg.addLoginPageList.themeNameParam,
                    themeType:$scope.addAuthCfg.addLoginPageList.themeType,
                }
            }).success(function(data){
                if(data.errorcode == 0){
                    $alert.msgDialogSuccess(getRcString("modify_success"));
                    $scope.return();
                }
            }).error(function(data){
                $alert.msgDialogError(getRcString("modify_fail"),'error');
            });
        }

        //点击事件--是否使用密码
        $scope.pwd=false;
        $scope.addPwdOn = function()
        {
            $scope.pwd = true;
        }
        $scope.addPwdOff= function()
        {
            $scope.pwd = false;
        }

        //监听密码
        $scope.$watch("modifyForm.addPwdValue.$viewValue", function (v) {
            $scope.template.addPwdValue = v;
        });
        $scope.$watch("modifyForm.PwdValue.$viewValue", function (v) {
            $scope.template.addPwdValue = v;
        });
    }]
});