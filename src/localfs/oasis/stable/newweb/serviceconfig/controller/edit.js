//网络部署-无线配置-服务配置-编辑  by weixin
define(['jquery','utils','bsTable'],function($scope,Utils) {
    return ['$scope', '$http','$state','$window','$stateParams','$alertService',function($scope,$http,$state,$window,$stateParams,$alert){
        function getRcString(attrName){
            return Utils.getRcString("serverConfig_rc",attrName);
        }
        //  =========================页面初始化开始==============================
            var g_authType,g_authTemName,g_pageTemName,g_weixinAccountName,g_stnames,g_themeNames,g_authTemNames;
            var getssidlistUrl = Utils.getUrl('GET','','/ssidmonitor/getssidlist?devSN='+$scope.sceneInfo.sn,'/init/serviceconfig5/infobrief.json');
            var ssidUpdateUrl= Utils.getUrl('POST','','/ant/confmgr','/init/serviceconfig5/infobrief.json');
                 
            $scope.userData={
                wifi:"",
                server:"",
                SSID:"",
                pwdState:"",
                pwd:"",
                wirelessServer:"",
                authType:"",           
            }
            
            
            //查询基本配置
            $http({
                url:getssidlistUrl.url,
                method:getssidlistUrl.method, 
                params:{            
                    stName:$stateParams.stname
                }         
            }).success(function(response){          
                var data=response.ssidList[0]; 

                                             

                $scope.userData={
    	            wifi:"innerWifi",
    	            server:data.stName,
    	            SSID:data.ssidName,
    	            pwdState:data.akmMode==0?"pwdOff":"pwdOn",
    	            pwd:data.akmMode==0?"":"57402619752",
    	            wirelessServer:data.status==1?"wireless_open":"wireless_closed", 
    	            wifi:data.description==1?"innerWifi":"busWifi",  
    	        } 
    	        
    	        $scope.userData.wifi=="innerWifi"?$scope.innerwifi = {show:true}:$scope.buswifi = {show:true};
                $scope.userData.pwdState=="pwdOff"?$scope.pwd =false:$scope.pwd =true;
                

                queryPubmng(data.stName);
            }).error(function(response){
            }); 

            


            //查询认证模板
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/authcfg/query',
                method:"GET", 
                params:{            
                    storeId:$scope.sceneInfo.nasid,
                }         
            }).success(function(response){    
                g_authTemNames=[];
                for(var i=0,len=response.data.length;i<len;i++){
                    g_authTemNames.push(response.data[i].authCfgTemplateName);                                       
                } 
                $scope.authCfgTemplates=g_authTemNames;
                $scope.userData.authSelect=$scope.authCfgTemplates[0];
            }).error(function(response){
            });            
            
            //查询页面模板       
            $http({
                url:'/v3/ace/oasis/auth-data/restapp/o2oportal/themetemplate/query',
                method:"GET", 
                params:{            
                    storeId:$scope.sceneInfo.nasid,
                }         
            }).success(function(response){ 
                console.log(response);
                g_themeNames=[];
                for(var i=0,len=response.data.length;i<len;i++){
                    g_themeNames.push(response.data[i].themeName);                            
                }       
                $scope.themeNames=g_themeNames;
                $scope.userData.pageSelect=$scope.themeNames[0];
            }).error(function(response){
            });

            //查询发布管理
            function queryPubmng(stName){               

                $http({
                    url:"/v3/ace/oasis/auth-data/o2oportal/pubmng/queryBySsidV3/"+$scope.sceneInfo.sn+stName+"/"+$scope.sceneInfo.nasid,
                    method:"GET",
                    contentType: "application/json",
                }).success(function(response){                
                    if(response.errorcode==0){                 
                        $scope.userData.authType="auth_on";
                        g_authType="auth_on";
                        g_original="open";
                        $scope.auth = true;
                        $scope.userData.authSelect=response.data.authCfgName;
                        $scope.userData.pageSelect=response.data.themeTemplateName;
                        
                    }else{
                        $scope.userData.authType="auth_off";
                        g_original="close"
                   }                                  
                }).error(function(response){
                }); 
            }

            

        //  =========================页面初始化结束==============================
        
	    
        //  =========================修改开始==============================
            //修改基本配置
    	    function ssidUpdate(){
                var aData;
                
                if($scope.userData.pwdState=="pwdOn"){
                    if($scope.userData.pwd=="57402619752"){
                        aData=[{
                                stName:$scope.userData.server,
                                ssidName:$scope.userData.SSID,
                                akmMode:1,
                                cipherSuite:20,
                                securityIE:3,
                                status:$scope.userData.wirelessServer=="wireless_open"?1:2
                            }] 
                    }else{
                       aData=[{
                                stName:$scope.userData.server,
                                ssidName:$scope.userData.SSID,
                                akmMode:1,
                                cipherSuite:20,
                                securityIE:3,
                                psk:$scope.userData.pwd,
                                status:$scope.userData.wirelessServer=="wireless_open"?1:2
                            }]  
                    }
                    
                        
                        
                }else if($scope.userData.pwdState=="pwdOff"){
                    aData=[{
                            stName:$scope.userData.server,
                            ssidName:$scope.userData.SSID,            
                            status:$scope.userData.wirelessServer=="wireless_open"?1:2                           
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
                        description:3,
                        param:aData 
                    }         
                }).success(function(response){ 
                    if(response.result=="success"){
                        if(g_original=="open"){
                            if($scope.userData.authType=="auth_on"){      
                                modifyPumng();
                            }else{       
                                deletePubmng();
                            }
                        }else if(g_original=="close"){
                            if($scope.userData.authType=="auth_on"){                      
                                addPubmng();
                            }else{      
                                return;
                            }
                        }

                        
                    }else{
                        if(response.errCode==4){
                            $alert.msgDialogError(getRcString("MAIN"),'error'); 
                       }else{
                            $alert.msgDialogError(getRcString("EDIT_FAIL"),'error');
                       }
                    }
                }).error(function(response){
                    $alert.msgDialogError(getRcString("EDIT_FAIL"),'error');
                });                     
    	    }
          	     
            //增加发布管理器
            function addPubmng(){
                $http({
                        url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/addbyv3flag',
                        method:'POST', 
                    data:{                                 
                        nasId:$scope.sceneInfo.nasid,                
                        ssidIdV3:$scope.sceneInfo.sn+$scope.userData.server,
                        ssidName:$scope.userData.SSID,
                        name:$scope.sceneInfo.sn+$scope.userData.server,
                        authCfgName:$scope.userData.authSelect,
                        themeTemplateName:$scope.userData.pageSelect
                    }         
                }).success(function(response){ 
                    if(response.errorcode==0){ 
                        $alert.msgDialogSuccess(getRcString("EDIT_SUC")); 
                        $window.history.back();
                    }else{
                        $alert.msgDialogError(getRcString("EDIT_FAIL"),'error');
                    }
                }).error(function(response){
                    $alert.msgDialogError(getRcString("EDIT_FAIL"),'error'); 
                }); 
            } 

            //修改发布管理
            function modifyPumng(){
                $http({
                        url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/modifybyv3flag',
                        method:'POST', 
                    data:{            
                        ownerName:$scope.userInfo.user,
                        nasId:$scope.sceneInfo.nasid,                
                        ssidIdV3:$scope.sceneInfo.sn+$scope.userData.server,
                        ssidName:$scope.userData.SSID,
                        name:$scope.sceneInfo.sn+$scope.userData.server,
                        authCfgName:$scope.userData.authSelect,
                        themeTemplateName:$scope.userData.pageSelect
                    }         
                }).success(function(response){ 
                    if(response.errorcode==0){ 
                        $alert.msgDialogSuccess(getRcString("EDIT_SUC")); 
                        $window.history.back();
                    }else{
                        $alert.msgDialogError(getRcString("EDIT_FAIL"),'error');
                    }
                }).error(function(response){
                    $alert.msgDialogError(getRcString("EDIT_FAIL"),'error'); 
                });
            }

            //删除发布管理
            function deletePubmng(){
                $http({
                    url:'/v3/ace/oasis/auth-data/restapp/o2oportal/pubmng/deleteBySsidV3?ssidV3='+$scope.sceneInfo.sn+$scope.userData.server+"&nasId="+$scope.sceneInfo.nasid,
                    method:"GET",
                    contentType: "application/json",
                }).success(function(response){
                    if(response.errorcode==0){ 
                        $alert.msgDialogSuccess(getRcString("EDIT_SUC"));
                        $window.history.back(); 
                    }else{
                        $alert.msgDialogError(getRcString("EDIT_FAIL"),'error');
                    }                                    
                }).error(function(response){
                     $alert.msgDialogError(getRcString("EDIT_FAIL"),'error');
                }); 
            }

                      
        //  =========================修改结束==============================
        

        //  =========================事件开始==============================
            $scope.userData.wifi=="innerWifi"? $scope.innerwifi={show:true}: $scope.innerwifi={show:false};
            $scope.userData.authType=="authTem"? $scope.authSeclect={show:true}: $scope.authSeclect={show:false};
            $scope.userData.login=="template"? $scope.pageSelect={show:true}: $scope.pageSelect={show:false};
            $scope.userData.feelauth=="feelauthOn"?$scope.unauthtime={show:true}:$scope.unauthtime={show:false};
             
            
            $scope.submit=function(){        
                ssidUpdate();                
            }

            $scope.return = function(){
                $window.history.back();
            } 

            /*点击事件*/              
            $scope.pwdOn = function() {
                $scope.pwd = true;      
            }
            $scope.pwdOff= function() {
                $scope.pwd = false;                  
            }
           
            $scope.innerWifi = function() {
                $scope.innerwifi = {show:true};
                $scope.buswifi = {show:false};
                $scope.userData.authType="accountlogin2"
            }
            $scope.busWifi= function() {
                $scope.buswifi = {show:true};
                $scope.innerwifi = {show:false};
                $scope.userData.authType="keyInternet";
            }

            $scope.auth_on = function() {
                $scope.auth = true;         
            }
            $scope.auth_off= function() {
                $scope.auth = false;                  
            }

            //认证模板下拉框
            $scope.authSelect=false;
            $scope.authShow = function() {
                $scope.authSelect = true;
            }
            $scope.authHide = function() {
                $scope.authSelect = false;           
            }

            //页面模板下拉框
            $scope.pageSelect=false;
            $scope.pageShow = function() {
                $scope.pageSelect = true;
                
            }
            $scope.pageHide = function() {
                $scope.pageSelect = false;
            }

            //
            $scope.feelauthOn = function() {
                $scope.unauthtime = {show:true};
            }
            $scope.feelauthOff = function() {
                $scope.unauthtime = {show:false};
            }

            $scope.advanced=false;
            $scope.advancedToggle=function(){
                $scope.advanced=!$scope.advanced;
            }

            $scope.$watch("userForm.password.$viewValue", function (v) {        
                $scope.userData.pwd = v;
                
            });
            $scope.$watch("userForm.text.$viewValue", function (v) {
                $scope.userData.pwd = v;
            });
        //  =========================事件结束==============================
    }]
});